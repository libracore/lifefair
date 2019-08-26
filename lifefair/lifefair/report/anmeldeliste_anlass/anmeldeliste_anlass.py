# -*- coding: utf-8 -*-
# Copyright (c) 2019, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

def execute(filters=None):
    columns, data = [], []
    
    columns = ["Person:Link/Person:100", 
               "Personenkürzel::50",
               "Name::200", 
               "Zeile 1::100",
               "Zeile 2::100",
               "Geprüft von::50",
               "Registrierung:Link/Registration:100",
               "Meeting:Link/Meeting:200",
               "Funktion::150",
               "Organisation:Link/Organisation:200",
               "Gutscheincode::200",
               "Email::150",
               "Nur einmal kontakieren::50",
               "Block:Link/Block:100",
               "Briefanrede::100",
               "Nachname::100"             
            ]
    if filters:
        data = get_data(meeting=filters.meeting, as_list=True)
    else:
        data = get_data(as_list=True)
          
    return columns, data

# use as_list=True in case of later Export to Excel
def get_data(meeting="%", as_list=True):
    sql_query = """SELECT 
         `tabRegistration`.`person` AS `Person`, 
         `tabPerson`.`first_characters` AS `Personenkürzel`,
         `tabPerson`.`long_name` AS `Name`, 
         SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 1) AS `Zeile 1`,
         IF (SUBSTRING_INDEX(SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 2), ';', -1) !=  
             SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 1), 
             SUBSTRING_INDEX(SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 2), ';', -1), "") AS `Zeile 2`,
         (SELECT IF(`tabRegistration`.`is_checked` = 1, "Ja", "Nein")) AS `Geprüft von`,
         `tabRegistration`.`name` AS `Registrierung`,
         `tabRegistration`.`meeting` AS `Meeting`,
         `tabPerson`.`primary_function` AS `Funktion`,
         `tabPerson`.`primary_organisation` AS `Organisation`,
         `tabRegistration`.`code` AS `Gutscheincode`,
         `tabPerson`.`email` AS `Email`,
         `tabPerson`.`nur_einmal_kontaktieren` AS `Nur einmal kontakieren`,
         `tabRegistration`.`block` AS `Block`,
         IF (`tabPerson`.`salutation` LIKE "%", 
             CONCAT(`tabPerson`.`letter_salutation`, " ", `tabPerson`.`salutation`),
             `tabPerson`.`letter_salutation`) AS `Briefanrede`,
         `tabPerson`.`last_name` AS `Last Name`
        FROM `tabRegistration`
        LEFT JOIN `tabPerson` ON `tabRegistration`.`person` = `tabPerson`.`name`
        WHERE 
          `meeting` LIKE '{0}' 
          AND `status` NOT IN ("Cancelled", "Abgemeldet")
        LIMIT 10000;""".format(meeting)
    if as_list:
        data = frappe.db.sql(sql_query, as_list = True)
    else:
        data = frappe.db.sql(sql_query, as_dict = True)
    return data
