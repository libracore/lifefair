# -*- coding: utf-8 -*-
# Copyright (c) 2019-2020, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

def execute(filters=None):
    columns, data = [], []
    
    columns = [
                {"label": ("Kontakt KNT"), "fieldname": "person", "fieldtype": "Link", "options": "Person", "width": 100},
                {"label": ("Personenkürzel"), "fieldname": "chars", "fieldtype": "Data",  "width": 50},
                {"label": ("Name"), "fieldname": "full_name", "fieldtype": "Data", "width": 200},
                {"label": ("Geschlecht"), "fieldname": "geschlecht", "fieldtype": "Data", "width": 100},
                {"label": ("Zeile 1"), "fieldname": "line1", "fieldtype": "Data", "width": 100},
                {"label": ("Zeile 2"), "fieldname": "line2", "fieldtype": "Data", "width": 100},
                {"label": ("Geprüft von"), "fieldname": "checked", "fieldtype": "Data", "width": 100},
                {"label": ("Registrierung"), "fieldname": "registrierung", "fieldtype": "Link", "options": "Registration", "width": 100}, 
                {"label": ("Gutscheincode"), "fieldname": "gutscheincode", "fieldtype": "Data", "width": 200},
                {"label": ("Anlass"), "fieldname": "meeting", "fieldtype": "Data", "width": 200},
                {"label": ("Bemerkungen"), "fieldname": "remarks", "fieldtype": "Data", "width": 200},
                {"label": ("Teilnahme"), "fieldname": "teilnahme", "fieldtype": "Data", "width": 200},
                {"label": ("Block"), "fieldname": "block", "fieldtype": "Link", "options": "Block", "width": 100}, 
                {"label": ("Funktion"), "fieldname": "funktion", "fieldtype": "Data", "width": 150},
                {"label": ("Organisation"), "fieldname": "organisation", "fieldtype": "Link", "options": "Organisation", "width": 200}, 
                {"label": ("Verbandsmitglied"), "fieldname": "verbandsmitglied", "fieldtype": "Data", "width": 200}, 
                {"label": ("Branche"), "fieldname": "branche", "fieldtype": "Data", "width": 100},
                {"label": ("Stakeholder"), "fieldname": "stakeholder", "fieldtype": "Data", "width": 100},
                {"label": ("Hierarchiestufe"), "fieldname": "hierarchiestufe", "fieldtype": "Data", "width": 100},
                {"label": ("Email"), "fieldname": "email", "fieldtype": "Data", "width": 150},
                {"label": ("Tel. gesch."), "fieldname": "company_phone", "fieldtype": "Data", "width": 150},
                {"label": ("Mobile"), "fieldname": "mobile_phone", "fieldtype": "Data", "width": 150},
                {"label": ("Nur einmal kontaktieren"), "fieldname": "contact_only_once", "fieldtype": "Data", "width": 100},
                {"label": ("Briefanrede"), "fieldname": "briefanrede", "fieldtype": "Data", "width": 100},
                {"label": ("Nachname"), "fieldname": "last_name", "fieldtype": "Data", "width": 100},
                {"label": ("PLZ"), "fieldname": "plz", "fieldtype": "Data", "width": 50}
            ]

    if filters:
        data = get_data(meeting=filters.meeting, as_dict=True)
    else:
        data = get_data(as_dict=True)

    return columns, data

def get_data(meeting="%", as_dict=True):
    sql_query = """SELECT
         `tabRegistration`.`person` AS `person`,
         IFNULL(`tabRegistration`.`participation`, "-") AS `teilnahme`,
         `tabPerson`.`first_characters` AS `chars`,
         `tabPerson`.`long_name` AS `full_name`,
         `tabPerson`.`gender` AS `geschlecht`,
         `tabPerson`.`branche` AS `branche`,
         `tabPerson`.`stakeholder` AS `stakeholder`,
         `tabPerson`.`hierarchiestufe` AS `hierarchiestufe`,
         `tabPerson`.`personal_postal_code` AS `plz`,
         SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 1) AS `line1`,
         IF (SUBSTRING_INDEX(SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 2), ';', -1) !=
             SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 1),
             SUBSTRING_INDEX(SUBSTRING_INDEX(`tabPerson`.`website_description`, ';', 2), ';', -1), "") AS `line2`,
         (SELECT IF(`tabRegistration`.`is_checked` = 1, "Ja", "Nein")) AS `checked`,
         `tabRegistration`.`name` AS `registrierung`,
         `tabRegistration`.`meeting` AS `meeting`,
         IFNULL(`tabPerson`.`primary_function`, "-") AS `funktion`,
         IFNULL(`tabPerson`.`primary_organisation`, "-") AS `organisation`,
         IFNULL(`tabOrganisation`.`ist_ver`, 0) AS `verbandsmitglied`,
         `tabRegistration`.`code` AS `gutscheincode`,
         `tabPerson`.`email` AS `email`,
         `tabPerson`.`company_phone` AS `company_phone`,
         `tabPerson`.`mobile_phone` AS `mobile_phone`,
         `tabPerson`.`nur_einmal_kontaktieren` AS `contact_only_once`,
         IFNULL(`tabRegistration`.`block`, "-") AS `block`,
         IFNULL(`tabRegistration`.`remarks`, "-") AS `remarks`,
         IF (`tabPerson`.`salutation` LIKE "%",
             CONCAT(`tabPerson`.`letter_salutation`, " ", `tabPerson`.`salutation`),
             `tabPerson`.`letter_salutation`) AS `briefanrede`,
         `tabPerson`.`last_name` AS `last_name`
        FROM `tabRegistration`
        LEFT JOIN `tabPerson` ON `tabRegistration`.`person` = `tabPerson`.`name`
        LEFT JOIN `tabPerson Organisation` ON `tabPerson Organisation`.`parent` = `tabPerson`.`name`
		LEFT JOIN `tabOrganisation` ON `tabOrganisation`.`name` = `tabPerson Organisation`.`organisation`
        WHERE
          `meeting` LIKE '{0}'
          AND `status` NOT IN ("Cancelled", "Abgemeldet", "Tentative")
        LIMIT 10000;""".format(meeting)
    if as_dict:
        data = frappe.db.sql(sql_query, as_dict = True)
    else:
        data = frappe.db.sql(sql_query, as_dict = True)
    return data
