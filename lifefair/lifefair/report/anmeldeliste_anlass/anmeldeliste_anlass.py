# -*- coding: utf-8 -*-
# Copyright (c) 2019-2020, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

def execute(filters=None):
    columns, data = [], []
    
    columns = ["Kontakt KNT:Link/Person:50",
               "Personenkürzel::50",  
               "Name::150",     
               "Geschlecht::50",           
               "Zeile 1::250", 
               "Zeile 2::75",
               "Geprüft von::50",
               "Meldedatum::100",
               "Email Clerk::75",
               "Registrierung:Link/Registration:100",
               "Gutscheincode::200",
               "Anlass::200",
               "Bemerkungen::120",
               "Teilnahme::100",
               "Block::200",
               "Funktion::150",
               "Organisation::200",
               "Verbandsmitglied::200",
               "Branche::100",
               "Stakeholder::100",
               "Hierarchiestufe::100",
               "Email::150",
               "Tel. gesch.::150",
               "Mobile::150",
               "Nur einmal kontaktieren::100",
               "Briefanrede::100",
               "Nachname::100",
               "PLZ::50",
               "Interessen::200",
               "Typ::100",
               "Ticketnummer::125",
               "Barcode::125"
               ]
    if filters:
        data = get_data(meeting=filters.meeting, interests=filters.interests, as_list=True)
    else:
        data = get_data(as_list=True)
          
    return columns, data


def get_data(meeting=None, interests=None, as_list=True):
    sql_query = """SELECT
         `tabRegistration`.`person` AS `Kontakt KNT`,
         `tabPerson`.`first_characters` AS `Personenkürzel`,
         `tabPerson`.`long_name` AS `Name`,
         `tabPerson`.`gender` AS `Geschlecht`,
         SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 1) AS `Zeile 1`,
         IF (SUBSTRING_INDEX(SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 2), ';', -1) !=
            SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 1),
            SUBSTRING_INDEX(SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 2), ';', -1), "") AS `Zeile 2`,
         (SELECT IF(`tabRegistration`.`is_checked` = 1, "Ja", "Nein")) AS `Geprüft von`,
         `tabRegistration`.`meldedatum` AS `Meldedatum`,
         `tabRegistration`.`email_clerk` AS `Email Clerk`,
         `tabRegistration`.`name` AS `Registrierung`,
         `tabRegistration`.`code` AS `Gutscheincode`,
         `tabRegistration`.`meeting` AS `Anlass`,
         IFNULL(`tabRegistration`.`remarks`, "-") AS `Bemerkungen`,
         IFNULL(`tabRegistration`.`participation`, "-") AS `Teilnahme`,
         IFNULL(`tabRegistration`.`block`, "-") AS `Block`,
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
         GROUP_CONCAT(IFNULL(`tabPerson Interest`.`interesse`, "-")) AS `Interessen`,
         `tabRegistration`.`type` AS `Typ`,
         `tabRegistration`.`ticket_number` AS `Ticketnummer`,
         `tabRegistration`.`barcode` AS `Barcode`
    FROM `tabRegistration`
    LEFT JOIN `tabPerson` ON `tabRegistration`.`person` = `tabPerson`.`name`
    LEFT JOIN `tabPerson Interest` ON `tabPerson Interest`.`parent` = `tabPerson`.`name`
    LEFT JOIN `tabBlock` ON `tabBlock`.`name` = `tabRegistration`.`block`
        WHERE 
			`tabRegistration`.`status` NOT IN ("Cancelled", "Abgemeldet", "Tentative")
        """
    if meeting:
        sql_query += """ AND `tabRegistration`.`meeting` = '{0}'""".format(meeting)
    #elif interests:
    #   sql_query += """ WHERE `t2`.`interest_1` = '{0}' OR `t2`.`interest_2` = '{0}' OR `t2`.`interest_3` = '{0}'""".format(interests)	
    sql_query += """ GROUP BY  `tabRegistration`.`name`"""
    sql_query += """ LIMIT 10000;"""

    if as_list:
        data = frappe.db.sql(sql_query, as_list = True)
    else:
        data = frappe.db.sql(sql_query, as_list = True)
    return data

