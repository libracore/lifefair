# Copyright (c) 2013, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.utils import cint

def execute(filters=None):
    columns, data = [], []
    
    columns = [
               "Kontakt KNT:Link/Person:90",
               "Personenkürzel::70",
               "Name::160",     
               "Geschlecht::50",           
               "Zeile 1::160", 
               "Zeile 2::160",
               "Geprüft von::50",
               "Meldedatum::80",
               "Email Clerk::100",
               "Registrierung:Link/Registration:170",
               "Gutscheincode::100",
               "Anlass::170",
               "Bemerkungen::190",
               "Teilnahme::100",
               "Block:Link/Block:200",
               "Funktion::150",
               "Organisation::200",
               "Verbandsmitglied::50",
               "Branche::150",
               "Stakeholder::100",
               "Hierarchiestufe::80",
               "Email::150",
               "Tel. gesch.::110",
               "Mobile::110",
               "Nur einmal kontaktieren::50",
               "Briefanrede::70",
               "Nachname::100",
               "PLZ::50",
               "Interessen::200",
               "Typ::90",
               "Ticketnummer::125",
               "Barcode::125",
               "IF erster Tag offen::50",
               "IF zweiter Tag offen::50"
               ]
    if filters:
        data = get_data(meeting=filters.meeting, interests=filters.interests, with_details=filters.with_details, as_dict=True)
    else:
        data = get_data(as_dict=True)
          
    return columns, data

def get_data(meeting=None, interests=None, with_details=0, as_dict=True):
        
    sql_query = """
        SELECT
             `tabRegistration`.`person` AS `Kontakt KNT`,
             `tabPerson`.`long_name` AS `Name`,
             `tabPerson`.`first_characters` AS `Personenkürzel`,
             `tabPerson`.`gender` AS `Geschlecht`,
             SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 1) AS `Zeile 1`,
             IF (SUBSTRING_INDEX(SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 2), ';', -1) !=
             SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 1),
             SUBSTRING_INDEX(SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 2), ';', -1), "") AS `Zeile 2`,
             (SELECT IF(MAX(`tabRegistration`.`is_checked`) = 1, "Ja", "Nein")) AS `Geprüft von`,
             `tabRegistration`.`meldedatum` AS `Meldedatum`,
             `tabRegistration`.`email_clerk` AS `Email Clerk`,
             GROUP_CONCAT(`tabRegistration`.`name`, "-") AS `Registrierung`,
             GROUP_CONCAT(IFNULL(`tabRegistration`.`remarks`, "-")) AS `Bemerkungen`,
             GROUP_CONCAT(IFNULL(`tabRegistration`.`participation`, "-")) AS `Teilnahme`,
             `tabRegistration`.`code` AS `Gutscheincode`,
             `tabRegistration`.`meeting` AS `Anlass`,
             GROUP_CONCAT(IFNULL(`tabRegistration`.`block`, "-")) AS `Block`,
             IFNULL(`tabPerson`.`primary_function`, "-") AS `Funktion`,
             IFNULL(`tabPerson`.`primary_organisation`, "-") AS `Organisation`,
             IFNULL((SELECT `tabOrganisation`.`ist_ver`
             FROM `tabOrganisation`
             WHERE `tabOrganisation`.`name` IN (SELECT `tabPerson Organisation`.`organisation`
                                                FROM `tabPerson Organisation`
                                                WHERE `tabPerson Organisation`.`parent` = `tabPerson`.`name`)
             ORDER BY `tabOrganisation`.`ist_ver` DESC
             LIMIT 1), 0) AS `Verbandsmitglied`,
             `tabPerson`.`branche` AS `Branche`,
             `tabPerson`.`stakeholder` AS `Stakeholder`,
             `tabPerson`.`hierarchiestufe` AS `Hierarchiestufe`,
             `tabPerson`.`email` AS `Email`,
             `tabPerson`.`company_phone` AS `Tel. gesch.`,
             `tabPerson`.`mobile_phone` AS `Mobile`,
             `tabPerson`.`nur_einmal_kontaktieren` AS `Nur einmal kontaktieren`,
             `tabPerson`.`letter_salutation` AS `Briefanrede`,
             `tabPerson`.`last_name` AS `Nachname`,
             `tabPerson`.`personal_postal_code` AS `PLZ`,
              /*GROUP_CONCAT(IFNULL(`tabPerson Interest`.`interesse`, "-")) AS `Interessen`,*/
             `tabRegistration`.`type` AS `Typ`,
             `tabRegistration`.`ticket_number` AS `Ticketnummer`,
             `tabRegistration`.`barcode` AS `Barcode`,
             MAX(`tabRegistration`.`erster_tag_offen`) AS `IF erster Tag offen`,
             MAX(`tabRegistration`.`zweiter_tag_offen`) AS `IF zweiter Tag offen`,
             0 AS `indent`
        FROM `tabRegistration`
        LEFT JOIN `tabPerson` ON `tabRegistration`.`person` = `tabPerson`.`name`
        /*LEFT JOIN `tabPerson Interest` ON `tabPerson Interest`.`parent` = `tabPerson`.`name`*/
        LEFT JOIN `tabBlock` ON `tabBlock`.`name` = `tabRegistration`.`block`
            WHERE 
                `tabRegistration`.`status` NOT IN ("Cancelled", "Abgemeldet", "Tentative")
        """
    if meeting:
        sql_query += """ AND `tabRegistration`.`meeting` = '{0}'""".format(meeting)

    sql_query += """ GROUP BY  `tabRegistration`.`ticket_number`"""
    sql_query += """ ORDER BY `tabPerson`.`first_characters` ASC; """

    tickets = frappe.db.sql(sql_query, as_dict = True)

    if cint(with_details) == 0:
        return tickets
    
    data = []
    # create drill-down
    for t in tickets:
        # append project row
        data.append(t)
        # extend drill-down here
        sql_query = """
            SELECT 
                `tabRegistration`.`person` AS `Kontakt KNT`,
                 (SELECT IF(`tabRegistration`.`is_checked` = 1, "Ja", "Nein")) AS `Geprüft von`,
                 `tabRegistration`.`meldedatum` AS `Meldedatum`,
                 `tabRegistration`.`name` AS `Registrierung`,
                 IFNULL(`tabRegistration`.`remarks`, "-") AS `Bemerkungen`,
                 IFNULL(`tabRegistration`.`participation`, "-") AS `Teilnahme`,
                 IFNULL(`tabRegistration`.`block`, "-") AS `Block`,
                 `tabRegistration`.`ticket_number` AS `Ticketnummer`,
                 `tabRegistration`.`barcode` AS `Barcode`,
                 `tabRegistration`.`erster_tag_offen` AS `IF erster Tag offen`,
                 `tabRegistration`.`zweiter_tag_offen` AS `IF zweiter Tag offen`,
                 1 AS `indent`
            FROM `tabRegistration`
            LEFT JOIN `tabBlock` ON `tabBlock`.`name` = `tabRegistration`.`block`
                WHERE 
                    `tabRegistration`.`status` NOT IN ("Cancelled", "Abgemeldet", "Tentative")
                    AND `tabRegistration`.`ticket_number` = "{ticket}"
        """.format(ticket=t['Ticketnummer'])
        if meeting:
            sql_query += """ AND `tabRegistration`.`meeting` = '{0}'""".format(meeting)
            
        sql_query += """ GROUP BY  `tabRegistration`.`name`"""
        sql_query += """ ORDER BY `tabRegistration`.`block` ASC; """

        registration = frappe.db.sql(sql_query, as_dict = True)

        for r in registration:
            data.append(r)
        
    return data
