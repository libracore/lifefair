# -*- coding: utf-8 -*-
# Copyright (c) 2019, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

def execute(filters=None):
    columns, data = [], []
    
    columns = ["Person:Link/Person:100", 
               "Name::200", 
                "Briefanrede::100",
               "Nachname::100",
               "Meeting:Link/Meeting:300",
               "Funktion::150",
               "Organisation:Link/Organisation:200",
               "Erste Zeichen::50",
               "Gutscheincode::200",
               "Email::150",
               "Nur einmal kontakieren::50",
               "Firma 1::100",
               "Firma 2::100",
               "Geprüft von::50",
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
         `tabPerson`.`long_name` AS `Name`, 
         IF (`tabPerson`.`salutation` LIKE "%", 
             CONCAT(`tabPerson`.`letter_salutation`, " ", `tabPerson`.`salutation`),
             `tabPerson`.`letter_salutation`) AS `Briefanrede`,
         `tabPerson`.`last_name` AS `Last Name`,
         `tabRegistration`.`meeting` AS `Meeting`,
         `tabPerson`.`primary_function` AS `Funktion`,
         `tabPerson`.`primary_organisation` AS `Organisation`,
         `tabPerson`.`first_characters` AS `Erste Zeichen`,
         `tabRegistration`.`code` AS `Gutscheincode`,
         `tabPerson`.`email` AS `Email`,
         `tabPerson`.`nur_einmal_kontaktieren` AS `Nur einmal kontakieren`,
         SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 1) AS `Firma 1`,
         IF (SUBSTRING_INDEX(SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 2), ';', -1) !=  
             SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 1), 
             SUBSTRING_INDEX(SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 2), ';', -1), "") AS `Firma 2`,
         (SELECT IF(`tabRegistration`.`is_checked` = 1, "Ja", "Nein")) AS `Geprüft von`
        FROM `tabRegistration`
        LEFT JOIN `tabPerson` ON `tabRegistration`.`person` = `tabPerson`.`name`
        WHERE `meeting` LIKE '{0}' LIMIT 10000;""".format(meeting)
    if as_list:
        data = frappe.db.sql(sql_query, as_list = True)
    else:
        data = frappe.db.sql(sql_query, as_dict = True)
    return data
