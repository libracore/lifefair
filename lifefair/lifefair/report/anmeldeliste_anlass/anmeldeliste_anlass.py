# -*- coding: utf-8 -*-
# Copyright (c) 2019, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

def execute(filters=None):
    columns, data = [], []
    
    columns = [
                {"label": ("Kontakt KNT"), "fieldname": "Person", "fieldtype": "Link", "options": "Person", "width": 100},
                {"label": ("Personenkürzel"), "fieldname": "item_group", "fieldtype": "Link", "options": "Item Group",  "width": 50},
                {"label": ("Name"), "fieldname": "Namw", "fieldtype": "Data", "width": 200},
                {"label": ("Geschlecht"), "fieldname": "Geschlecht", "fieldtype": "Data", "width": 100},
                {"label": ("Zeile 1"), "fieldname": "Zeile 1", "fieldtype": "Data", "width": 100},
                {"label": ("Zeile 2"), "fieldname": "Zeile 2", "fieldtype": "Data", "width": 100},
                {"label": ("Geprüft von"), "fieldname": "Geprüft von", "fieldtype": "Data", "width": 100},
                {"label": ("Registrierung"), "fieldname": "Registrierung", "fieldtype": "Link", "options": "Registration", "width": 100}, 
                {"label": ("Gutscheincode"), "fieldname": "Gutscheincode", "fieldtype": "Data", "width": 200},
                {"label": ("Anlass"), "fieldname": "Meeting", "fieldtype": "Data", "width": 200},
                {"label": ("Teilnahme"), "fieldname": "Teilnahme", "fieldtype": "Data", "width": 200},
                {"label": ("Block"), "fieldname": "Block", "fieldtype": "Link", "options": "Block", "width": 100}, 
                {"label": ("Funktion %"), "fieldname": "Funktion", "fieldtype": "Data", "width": 150},
                {"label": ("Organisation"), "fieldname": "Organisation", "fieldtype": "Link", "options": "Organisation", "width": 200}, 
                {"label": ("Branche"), "fieldname": "Branche", "fieldtype": "Data", "width": 100},
                {"label": ("Stakeholder"), "fieldname": "Stakeholder", "fieldtype": "Data", "width": 100},
                {"label": ("Hierarchiestufe"), "fieldname": "Hierarchiestufe", "fieldtype": "Data", "width": 100},
                {"label": ("Email"), "fieldname": "Email", "fieldtype": "Data", "width": 150},
                {"label": ("Nur einmal kontaktieren"), "fieldname": "Nur einmal kontaktieren", "fieldtype": "Data", "width": 100},
                {"label": ("Briefanrede"), "fieldname": "Briefanrede", "fieldtype": "Data", "width": 100},
                {"label": ("Nachname"), "fieldname": "Last Name", "fieldtype": "Data", "width": 100}
            ]
            
    if filters:
        data = get_data(meeting=filters.meeting, as_dict=True)
    else:
        data = get_data(as_dict=True)
          
    return columns, data

# use as_list=True in case of later Export to Excel
def get_data(meeting="%", as_dict=True):
    sql_query = """SELECT 
         `tabRegistration`.`person` AS `Person`, 
         `tabRegistration`.`participation` AS `Teilnahme`, 
         `tabPerson`.`first_characters` AS `Personenkürzel`,
         `tabPerson`.`long_name` AS `Name`,
         `tabPerson`.`gender` AS `Geschlecht`,
         `tabPerson`.`branche` AS `Branche`,
         `tabPerson`.`stakeholder` AS `Stakeholder`,
         `tabPerson`.`hierarchiestufe` AS `Hierarchiestufe`,
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
    if as_dict:
        data = frappe.db.sql(sql_query, as_dict = True)
    else:
        data = frappe.db.sql(sql_query, as_dict = True)
    return data
