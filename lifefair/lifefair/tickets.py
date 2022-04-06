# -*- coding: utf-8 -*-
# Copyright (c) 2017-2019, libracore and contributors
# License: AGPL v3. See LICENCE

# import definitions
from __future__ import unicode_literals
import frappe
from frappe import throw, _

@frappe.whitelist() 
def get_blocks(meeting):
	sql_query = """
	SELECT `official_title`, `location`, `short_name`, 
	`neues_datum`, `time`, GROUP_CONCAT(`tabBlock Interest`.`interest`) AS `interests`, `website_link`
	FROM `tabBlock`
	LEFT JOIN `tabBlock Interest` ON `tabBlock Interest`.`parent` = `tabBlock`.`name`
	WHERE `meeting` = "{meeting}" 
	GROUP BY `tabBlock`.`name`
	ORDER BY `tabBlock`.`neues_datum` ASC;
	""".format(meeting=meeting)
	data = frappe.db.sql(sql_query, as_dict = True)
	return data
