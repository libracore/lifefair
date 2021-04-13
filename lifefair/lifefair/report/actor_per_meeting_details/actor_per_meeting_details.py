# Copyright (c) 2013, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

def execute(filters=None):
    columns, data = [], []
	
    columns = ["Block:Link/Block:150",
               "Personenname",  
               "Nachname",                
               "Briefanrede", 
               "Bezeichung für externe Kommunikation::250",
               "Rolle",
               "Kontakt KNT:Link/Person:100",
               "Auf Website anzeigen",
               "Name",
               "Bild",
               "E-Mail",
               "Telefon geschäftlich",
               "Mobiltelefon",
               "Private phone",
               "Stakeholder",
               "Primary organisation",
               "Verbandsmitglied",
               "First Characters",
               "Contact function",
               "Contact name",
               "Contact email",
               "Contact phone",
               "Ticket number",
               "Registered",
               "Interessen"
               ]
    if filters:
        data = get_actors(interests=filters.interests, as_list=True)
    else:
        data = get_actors(as_list=True)
          
    return columns, data

# use as_list=True in case of later Export to Excel
def get_actors(interests=None, as_list=True):
    sql_query = """SELECT
        `t2`.`title` AS `Block`,
        IFNULL(`t4`.`long_name`, "-") AS `Personenname`,
        IFNULL(`t4`.`last_name`, "-") AS `Nachname`,
        IFNULL(`t4`.`letter_salutation`, "-") AS `Briefanrede`,
        IFNULL(`t3`.`person_website_description`, "-") AS `Website description`,
        `t3`.`person_role` AS `Role`,
        `t3`.`person` AS `Person:Link/Person:100`,
        `t4`.`show_on_website` AS `Show on website`,
        `t1`.`name` AS `Name`,
        `t4`.`image` AS `Image`,
        `t4`.`email` AS `Email`,
        `t4`.`company_phone` AS `Company phone`,
        `t4`.`mobile_phone` AS `Mobile phone`,
        `t4`.`private_phone` AS `Private phone`,
        IFNULL(`t4`.`person_group`, "-") AS `Stakeholder`,
        IFNULL(`t4`.`primary_organisation`, "-") AS `Primary organisation`,
        IFNULL((SELECT `tabOrganisation`.`ist_ver`
          FROM `tabOrganisation`
          WHERE `tabOrganisation`.`name` IN (SELECT `tabPerson Organisation`.`organisation`
                                             FROM `tabPerson Organisation`
                                             WHERE `tabPerson Organisation`.`parent` = `t4`.`name`)
          ORDER BY `tabOrganisation`.`ist_ver` DESC
          LIMIT 1), 0) AS `Verbandsmitglied`,
        IFNULL(`t4`.`first_characters`, "----") AS `First Characters`,
        IFNULL(`t5`.`function`, "-") AS `Contact function`,
        IFNULL(`t6`.`long_name`, "-") As `Contact name`,
        `t6`.`email` As `Contact email`,
        `t6`.`company_phone` AS `Contact phone`,
        `t7`.`ticket_number` AS `Ticket number`,
        (SELECT IF(`t7`.`name` IS NOT NULL, "ja", "nein")) AS `Registered`,
        GROUP_CONCAT(`t10`.`interesse`) AS `Interests`
    FROM `tabMeeting` AS `t1`
    INNER JOIN `tabBlock` AS `t2` ON `t1`.`title` = `t2`.`meeting` 
    INNER JOIN `tabBlock Planning` AS `t3` ON (`t2`.`title` = `t3`.`parent` AND `t3`.`person` IS NOT NULL)
    LEFT JOIN `tabPerson` AS `t4` ON `t3`.`person` = `t4`.`name`
    LEFT JOIN `tabPerson Contact` AS `t5` ON (`t5`.`parent` = `t4`.`name` AND `t5`.`idx` = 1)
    LEFT JOIN `tabPerson`AS `t6` ON (`t6`.`name` = `t5`.`person`)
    LEFT JOIN `tabRegistration` AS `t7` ON (`t7`.`person` = `t4`.`name` AND `t7`.`meeting` = `t2`.`meeting` /*'SGES 2018'*/ AND `t7`.`status` != "Cancelled")
	LEFT JOIN `tabPerson Interest` AS `t10` ON (`t10`.`parent` = `t4`.`name`)
/* display each person once per block (disabled by request on 2020-08-17 LaMu) */
/*	GROUP BY (CONCAT(`t2`.`title`, `t3`.`person`))*/
    """
    if interests:
        sql_query += """ WHERE `t2`.`interest_1` = '{0}' OR `t2`.`interest_2` = '{0}' OR `t2`.`interest_3` = '{0}'""".format(interests)		
    sql_query += """ GROUP BY (CONCAT(`t2`.`title`, `t3`.`person`))"""
    #sql_query += """ ORDER BY `t1`.`title` ASC, `t2`.`title` ASC, `t4`.`idx` ASC"""
    if as_list:
        data = frappe.db.sql(sql_query, as_list = True)
    else:
        data = frappe.db.sql(sql_query, as_dict = True)
    return data

