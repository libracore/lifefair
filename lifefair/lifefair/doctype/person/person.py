# -*- coding: utf-8 -*-
# Copyright (c) 2018, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

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

# this is a public API for the actors list for the website
#
# call the API from
#   /api/method/lifefair.lifefair.doctype.person.person.website_actors
@frappe.whitelist(allow_guest=True)
def website_actors():
	sql_query = """SELECT 
	     `t1`.`full_name`, 
		 `t2`.`organisation`,
	     `t2`.`function`,
	     `t1`.`website_description`, 
	     `t1`.`image`
	   FROM (SELECT * FROM `tabPerson` WHERE `show_on_website` = 1) AS `t1` 
	   LEFT JOIN 
	      (SELECT * FROM `tabPerson Organisation` WHERE `is_primary` = 1) AS `t2`
	      ON `t1`.`name` = `t2`.`parent`"""
	people = frappe.db.sql(sql_query, as_dict=True)
	
	return people
