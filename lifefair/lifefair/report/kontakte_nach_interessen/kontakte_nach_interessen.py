# -*- coding: utf-8 -*-
# Copyright (c) 2019, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

def execute(filters=None):
    columns, data = [], []
    
    columns = ["Person:Link/Person:100",
               "Name::200",
               "Last name::200",
               "Letter salutation::150",
               "Website description::200",
               "Primary Organisation::200",
               "Email::200",
               "Company phone::100",
               "Hierarchie::100",
               "Engagement::100",
               "Interesse",
               "Nur einmal kontaktieren::50"
            ]
    if filters:
        if filters.interest1:
            interest1 = "%{0}%".format(filters.interest1)
        else:
            interest1 = "%"
        if filters.interest2:
            interest2 = "%{0}%".format(filters.interest2)
        else:
            interest2 = "%"
        if filters.interest3:
            interest3 = "%{0}%".format(filters.interest3)
        else:
            interest3 = "%"
        if filters.interest4:
            interest4 = "%{0}%".format(filters.interest4)
        else:
            interest4 = "%"
        if filters.interest5:
            interest5 = "%{0}%".format(filters.interest5)
        else:
            interest5 = "%"
        data = get_people(interest1=interest1, interest2=interest2,
            interest3=interest3, interest4=interest4, interest5=interest5, 
            as_list=True)
    else:
        data = get_people(as_list=True)
          
    return columns, data

# use as_list=True in case of later Export to Excel
def get_people(interest1="%", interest2="%",
            interest3="%", interest4="%", interest5="%", as_list=True):
    sql_query = """SELECT 
                    `t2`.`name` AS `Person`,
                    `t2`.`long_name` AS `Name`,
                    `t2`.`last_name` AS `Last name`,
                    `t2`.`letter_salutation` AS `Letter salutation`,
                    `t2`.`website_description` AS `Website description`,
                    `t2`.`primary_organisation` AS `Primary Organisation`,
                    `t2`.`email` AS `Email`,
                    `t2`.`company_phone` AS `Company phone`,
                    `t2`.`hierarchiestufe` AS `Hierarchie`,
                    `t2`.`engagement` AS `Engagement`,
                    `t1`.`interest` AS `Interest`,
                    `t2`.`nur_einmal_kontaktieren` AS `Nur einmal kontaktieren`
                   FROM (SELECT 
                           `parent` AS `person`, 
                           GROUP_CONCAT(`interesse`) AS `interest`
                         FROM `tabPerson Interest`
                         GROUP BY `parent`) AS `t1`
                   LEFT JOIN `tabPerson` AS `t2` ON `t1`.`person` = `t2`.`name` 
                   WHERE 
                     `t1`.`interest` LIKE "{0}" 
                     AND `t1`.`interest` LIKE "{1}" 
                     AND `t1`.`interest` LIKE "{2}"
                     AND `t1`.`interest` LIKE "{3}"
                     AND `t1`.`interest` LIKE "{4}"
                   ORDER BY `t2`.`long_name` ASC""".format(interest1,interest2,interest3,interest4,interest5)
    if as_list:
        data = frappe.db.sql(sql_query, as_list = True)
    else:
        data = frappe.db.sql(sql_query, as_dict = True)
    return data
