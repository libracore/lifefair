# -*- coding: utf-8 -*-
# Copyright (c) 2018, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Meeting(Document):
    def get_partners(self):
        sql_query = ("""SELECT *  
            FROM `tabOrganisation Partnership` 
            WHERE `meeting` = '{meeting}'
            ORDER BY `parent` ASC;""".format(meeting=self.name))
        partners = frappe.db.sql(sql_query, as_dict=True)
        return { 'partners': partners }
    pass
