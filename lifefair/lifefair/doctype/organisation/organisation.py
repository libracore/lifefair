# -*- coding: utf-8 -*-
# Copyright (c) 2018, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Organisation(Document):
	def get_addresses(self):
		sql_query = ("""SELECT *  
			FROM `tabOrganisation Address` 
			WHERE `organisation` = '{0}'
			ORDER BY `city` ASC""".format(self.name))
		addresses = frappe.db.sql(sql_query, as_dict=True)
		return { 'addresses': addresses }
		
	def get_people(self):
		sql_query = ("""SELECT 
		      `t2`.`name`, 
		      `t2`.`full_name`,
		      `t1`.`function` AS `role`,
		      `t1`.`is_primary`       
			FROM (SELECT * FROM `tabPerson Organisation` WHERE `organisation` = '{0}') AS `t1`			
			LEFT JOIN `tabPerson` AS `t2` ON `t1`.`parent` = `t2`.`name` 
			ORDER BY `t1`.`is_primary` DESC, `t2`.`last_name` ASC""".format(self.name))
		people = frappe.db.sql(sql_query, as_dict=True)
		return { 'people': people }
