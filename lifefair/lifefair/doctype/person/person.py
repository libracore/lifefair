# -*- coding: utf-8 -*-
# Copyright (c) 2018, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from datetime import datetime

class Person(Document):
    def get_addresses(self):
        sql_query = ("""SELECT *  
            FROM `tabOrganisation Address` 
            WHERE `person` = '{1}'
            UNION SELECT *  
            FROM `tabOrganisation Address`
            WHERE `organisation` = '{0}' AND `for_shipping` = '1' AND `organisation` != ""
            ORDER BY `is_private` DESC, `city` ASC""".format(self.primary_organisation, self.name))
        addresses = frappe.db.sql(sql_query, as_dict=True)
        return { 'addresses': addresses }
    
    def get_contacts(self):
        sql_query = ("""SELECT 
              '1' AS `direct`, 
              `t3`.`person` AS `person`, 
              `t3`.`person_name` AS `person_name`,
              `t3`.`function` AS `function`
            FROM `tabPerson Contact` AS `t3`
            WHERE `parent` = '{0}'
            UNION SELECT 
              '0' AS `direct`, 
              `t1`.`parent` AS `person`, 
              `t2`.`full_name` AS `person_name`,
              `t1`.`function` AS `function`
            FROM `tabPerson Contact` AS `t1`
            LEFT JOIN `tabPerson` AS `t2` ON `t2`.`name` = `t1`.`parent`
            WHERE `t1`.`person` = '{0}'
            ORDER BY `person_name` ASC""".format(self.name))
        contacts = frappe.db.sql(sql_query, as_dict=True)
        return { 'contacts': contacts }

    def get_active_participation(self):
        sql_query = ("""SELECT 
              `t2`.`name` AS `block`, 
              `t2`.`meeting` AS `meeting`
        FROM `tabBlock Planning` AS `t1`
            LEFT JOIN `tabBlock` AS `t2` ON `t2`.`name` = `t1`.`parent`
            WHERE `t1`.`person` = '{0}' 
            GROUP BY `t2`.`name`
            ORDER BY `t2`.`name` ASC""".format(self.name))
        participations = frappe.db.sql(sql_query, as_dict=True)
        return { 'participations': participations }
    
    # generates a vCard record (UTF-8, not Outlook configuration)
    def get_vcard(self):
        vcard_content = "BEGIN:VCARD\nVERSION:3.0\n"
        if self.salutation:
            title = self.salutation + " "
        elif self.gender:
            title = self.gender + " "
        else:
            title = ""
        vcard_content += "N:{0};{1};;{2};\nFN:{2}{1} {0}\n".format(
            self.last_name, self.first_name, title)
        if self.primary_organisation:
            vcard_content += "ORG:{0}\n".format(self.primary_organisation)
            address = frappe.get_all("Organisation Address", 
            filters={'organisation': self.primary_organisation},
            fields=['street', 'number', 'additional_address', 'pin_code', 'city', 'country'])
            if address:
                vcard_content += "ADR;TYPE=WORK:;;{street} {number};{city};;{pincode};{country}\n".format(
                    street=address[0].street, number=address[0].number, additional=address[0].additional_address, 
                    city=address[0].city, pincode=address[0].pin_code, country=address[0].country)
        if self.primary_function:
            vcard_content += "TITLE:{0}\n".format(self.primary_function)
        if self.image:
            vcard_content += "PHOTO;VALUE=URL;TYPE=JPEG:{0}\n".format(self.image)
        if self.company_phone:
            vcard_content += "TEL;TYPE=WORK,VOICE:{0}\n".format(self.company_phone)
        if self.private_phone:
            vcard_content += "TEL;TYPE=HOME,VOICE:{0}\n".format(self.private_phone)
        if self.mobile_phone:
            vcard_content += "TEL;TYPE=CELL,VOICE:{0}\n".format(self.mobile_phone)
        if self.email:
            vcard_content += "EMAIL;TYPE=PREF,INTERNET:{0}\n".format(self.email)
        if self.homepage:
            vcard_content += "URL:{0}\n".format(self.homepage)
        modified_date = datetime.strptime(self.modified.split('.')[0], "%Y-%m-%d %H:%M:%S");
        vcard_content += "REV:{0:04d}-{1:02d}-{2:02d}T{3:02d}:{4:02d}:{5:02d}Z\n".format(
            modified_date.year, modified_date.month, modified_date.day, 
            modified_date.hour, modified_date.minute, modified_date.second)
        vcard_content += "NOTE:{0}\n".format(self.notes)
        vcard_content += "END:VCARD"
        return { 'vcard': vcard_content }

# this is a public API for the actors list for the website
#
# call the API from
#   /api/method/lifefair.lifefair.doctype.person.person.website_actors
#   /api/method/lifefair.lifefair.doctype.person.person.website_actors?block=<block id>
@frappe.whitelist(allow_guest=True)
def website_actors(block=None):
    if not block:
        block = "%"
    sql_query = """SELECT 
             `t2`.`long_name` AS `full_name`, 
             `t3`.`organisation` AS `organisation`,
             `t3`.`function` AS `function`,
             `t2`.`website_description` AS `website_description`, 
             `t2`.`image` AS `image`,
             `t2`.`first_characters` AS `first_characters`,
             `t4`.`short_name` AS `short_name`,
             `t4`.`official_title` AS `official_title`
        FROM `tabBlock Planning` AS `t1`
        LEFT JOIN `tabPerson` AS `t2` ON `t1`.`person` = `t2`.`name`
        LEFT JOIN 
          (SELECT * FROM `tabPerson Organisation` WHERE `is_primary` = 1) AS `t3`
          ON `t2`.`name` = `t3`.`parent`
        LEFT JOIN `tabBlock` AS `t4` ON `t1`.`parent` = `t4`.`name`
        WHERE 
          `t1`.`parent` LIKE "{0}" 
          AND `t1`.`show_on_website` = 1 /* person on block */
          AND `t2`.`show_on_website` = 1 /* person itself */
          AND `t1`.`parent` NOT LIKE "%Beirat%"
          AND `t1`.`parent` NOT LIKE "%Abend%"
        GROUP BY `t2`.`long_name`
        ORDER BY `t2`.`first_characters` ASC;""".format(block)
    people = frappe.db.sql(sql_query, as_dict=True)

    return people

# this is a public API for the actors list for an event
#
# call the API from
#   /api/method/lifefair.lifefair.doctype.person.person.website_actors_by_event?event=<event id>
@frappe.whitelist(allow_guest=True)
def website_actors_by_event(event=None):
    if event:
        sql_query = """SELECT
                 `tabPerson`.`long_name` AS `full_name`, 
                 `tOrg`.`organisation` AS `organisation`,
                 `tOrg`.`function` AS `function`,
                 `tabPerson`.`website_description` AS `website_description`, 
                 `tabPerson`.`image` AS `image`,
                 `tabPerson`.`first_characters` AS `first_characters`,
                 IFNULL(`tTestimonial`.`text`, "") AS `testimonial`,
                 `person`.`short_name` AS `short_name`,
                 `person`.`official_title` AS `official_title`
            FROM (
              /* subquery: find all people for event */
              SELECT 
                `tabBlock Planning`.`person` AS `name`,
                `tabBlock`.`short_name` AS `short_name`,
                `tabBlock`.`official_title` AS `official_title`    
              FROM `tabBlock Planning`
              LEFT JOIN `tabBlock` ON `tabBlock`.`name` = `tabBlock Planning`.`parent`
              WHERE `tabBlock`.`meeting` = "{event}"
               AND `tabBlock Planning`.`person` IS NOT NULL
               AND `tabBlock Planning`.`show_on_website` = 1 
               AND `tabBlock Planning`.`parent` NOT LIKE "%Beirat%"
               AND `tabBlock Planning`.`parent` NOT LIKE "%Abend%"
              GROUP BY `tabBlock Planning`.`person`
              ) AS `person`
            LEFT JOIN `tabPerson` ON `tabPerson`.`name` = `person`.`name`
            LEFT JOIN 
              (SELECT * FROM `tabPerson Organisation` WHERE `is_primary` = 1) AS `tOrg`
              ON `tabPerson`.`name` = `tOrg`.`parent`
            LEFT JOIN 
              (SELECT `parent`, `text` FROM `tabPerson Quote` ORDER BY `date` DESC LIMIT 1) AS `tTestimonial`
              ON `tTestimonial`.`parent` = `tabPerson`.`name`
            WHERE `tabPerson`.`show_on_website` = 1
            GROUP BY `tabPerson`.`long_name`
            ORDER BY `tabPerson`.`first_characters` ASC;""".format(event=event)
        people = frappe.db.sql(sql_query, as_dict=True)

        return people
    else:
        return ('Please provide an event')
    
# populate person interest in bulk from meeting
@frappe.whitelist()
def add_interest(interest, meeting):
    # get all participants from a meeting
    participants = frappe.get_all("Registration", filters=[
        ['meeting', '=', meeting]],
        # no exclusion filter ['status', 'IN', ['Tentative', 'Confirmed', 'Paid']]],
        fields=['person'])
    return add_interest_to_participants(participants, interest)
    
# populate person interest in bulk from block
@frappe.whitelist()
def add_interest_to_block(interest, block):
    # get all participants from a block
    participants = frappe.get_all("Registration", filters=[
        ['block', '=', block]],
        # no exclusion filter ['status', 'IN', ['Tentative', 'Confirmed', 'Paid']]],
        fields=['person'])
    return add_interest_to_participants(participants, interest)
        
def add_interest_to_participants(participants, interest):
    if participants:
        participant_count = len(participants)
        added_count = 0
        # loop through all participants
        for participant in participants:
            has_interest = frappe.get_all("Person Interest", filters=[
                ['parent', '=', participant['person']],
                ['interesse', '=', interest]],
                fields=['name'])
            # participant does not have this interest, add
            if not has_interest:
                new_interest = frappe.get_doc({
                    'doctype': 'Person Interest',
                    'parenttype': 'Person',
                    'parentfield': 'interessen',
                    'parent': participant['person'],
                    'interesse': interest
                })
                new_interest.insert()
                added_count += 1
        return {'participants': participant_count, 'added_interests': added_count}
    else:
        return {'participants': 0, 'added_interests': 0}
