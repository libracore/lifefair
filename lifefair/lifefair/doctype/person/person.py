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
			WHERE `parent` = '{1}'
			UNION SELECT *  
			FROM `tabOrganisation Address`
			WHERE `organisation` = '{0}' AND `for_shipping` = '1'
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
	    FROM `tabBlock Actor` AS `t1`
            LEFT JOIN `tabBlock` AS `t2` ON `t2`.`name` = `t1`.`parent`
            WHERE `t1`.`person` = '{0}' ORDER BY `t2`.`name` ASC""".format(self.name))
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
    if block:
	sql_query = """SELECT 
			 `t2`.`long_name` AS `full_name`, 
			 `t3`.`organisation` AS `organisation`,
			 `t3`.`function` AS `function`,
			 `t2`.`website_description` AS `website_description`, 
			 `t2`.`image` AS `image`,
			 `t2`.`first_characters` AS `first_characters`
		FROM `tabBlock Actor` AS `t1`
		LEFT JOIN `tabPerson` AS `t2` ON `t1`.`person` = `t2`.`name`
		LEFT JOIN 
		  (SELECT * FROM `tabPerson Organisation` WHERE `is_primary` = 1) AS `t3`
		  ON `t2`.`name` = `t3`.`parent`
		WHERE `t1`.`parent` = "{0}" AND `t2`.`show_on_website` = 1
		ORDER BY `t2`.`first_characters` ASC;""".format(block)
    else:
	sql_query = """SELECT 
	     `t1`.`long_name` AS `full_name`, 
	     `t2`.`organisation` AS `organisation`,
	     `t2`.`function` AS `function`,
	     `t1`.`website_description` AS `website_description`, 
	     `t1`.`image` AS `image`,
	     `t1`.`first_characters` AS `first_characters`
	   FROM (SELECT * FROM `tabPerson` WHERE `show_on_website` = 1) AS `t1` 
	   LEFT JOIN 
	      (SELECT * FROM `tabPerson Organisation` WHERE `is_primary` = 1) AS `t2`
	      ON `t1`.`name` = `t2`.`parent`
	   ORDER BY `t1`.`first_characters` ASC"""
    people = frappe.db.sql(sql_query, as_dict=True)

    return people
