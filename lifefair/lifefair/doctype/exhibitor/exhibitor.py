# -*- coding: utf-8 -*-
# Copyright (c) 2019, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Exhibitor(Document):
	pass

#
# call the API from
#   /api/method/lifefair.lifefair.doctype.exhibitor.exhibitor.get_exhibitors_company_overview?event=<event id>
@frappe.whitelist(allow_guest=True)
def get_exhibitors_company_overview(event=None):
    if event:
        sql_query = """SELECT
                 `tabExhibitor`.`organisation` AS `organisation`,
                 `tabExhibitor`.`topic` AS `topic`,
                 `tabExhibitor`.`name` AS `name`,
                 "," AS `seperator`
            FROM `tabExhibitor`             
              WHERE `tabExhibitor`.`meeting` = "{event}"
            ORDER BY `tabExhibitor`.`organisation` ASC;""".format(event=event)

        exhibition = frappe.db.sql(sql_query, as_dict=True)        
        if exhibition:
            exhibition[-1]['seperator'] = '.'
            return exhibition
        else:
            return ('Nothing found for {0}'.format(event))
    else:
        return ('Please provide an exhibition')


#
# call the API from
#   /api/method/lifefair.lifefair.doctype.exhibitor.exhibitor.get_exhibitors_topic_overview?event=<event id>
@frappe.whitelist(allow_guest=True)
def get_exhibitors_topic_overview(event=None):
    if event:
        sql_query = """SELECT
                 `tabExhibitor`.`organisation` AS `organisation`,
                 `tabExhibitor`.`topic` AS `topic`,
                 `tabExhibitor`.`name` AS `name`,
                 "," AS `seperator`
            FROM `tabExhibitor`             
              WHERE `tabExhibitor`.`meeting` = "{event}"
            ORDER BY `tabExhibitor`.`topic` ASC;""".format(event=event)

        exhibition = frappe.db.sql(sql_query, as_dict=True)        
        if exhibition:
            exhibition[-1]['seperator'] = '.'
            return exhibition
        else:
            return ('Nothing found for {0}'.format(event))
    else:
        return ('Please provide an exhibition')
