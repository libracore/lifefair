# -*- coding: utf-8 -*-
# Copyright (c) 2018, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Block(Document):
    def get_partners(self):
        sql_query = ("""SELECT *  
            FROM `tabOrganisation Partnership` 
            WHERE `block` = '{block}'
            ORDER BY `parent` ASC;""".format(block=self.name))
        partners = frappe.db.sql(sql_query, as_dict=True)
        return { 'partners': partners }
	pass

# this is a public API for the block information for the website
#
# call the API from
#   /api/method/lifefair.lifefair.doctype.block.block.get_block_info?block=<block id>
@frappe.whitelist(allow_guest=True)
def get_block_info(block=None):
    if block:
        sql_query = """SELECT 
             `official_title`,
             `topic`,
             `content`,
             `use`,
             `location`,
             `location_detail_1`,
             `location_detail_2`,
             `location_detail_3`,
             `tile_text`
             FROM `tabBlock`
             WHERE `name` = '{0}';""".format(block)
        block_info = frappe.db.sql(sql_query, as_dict=True)
        return block_info
    else:
        return ('Please provide a block')

# this is a public API for the block details for the website
#
# call the API from
#   /api/method/lifefair.lifefair.doctype.block.block.get_block_details?block=<block id>
@frappe.whitelist(allow_guest=True)
def get_block_details(block=None):
    if block:
        sql_query = """SELECT 
             `subject`,
             `person_1_long_name`,
             `person_1_with_description`,
             `person_1_website_description`,
             `person_2_long_name`,
             `person_2_with_description`,
             `person_1_website_description`,
             `tabWeb Format`.`start_code`,
             `tabWeb Format`.`end_code`
             FROM `tabBlock Planning`
             LEFT JOIN `tabWeb Format` ON `tabBlock Planning`.`format` = `tabWeb Format`.`name`
             WHERE `parent` = '{0}'
               AND `show_on_website` = 1;""".format(block)
        block_details = frappe.db.sql(sql_query, as_dict=True)
        return block_info
    else:
        return ('Please provide a block')

# this is a public API for the block partner logos for the website
#
# call the API from
#   /api/method/lifefair.lifefair.doctype.block.block.get_block_partners?block=<block id>
@frappe.whitelist(allow_guest=True)
def get_block_partners(block=None):
    if block:
        sql_query = """SELECT 
             `tabOrganisation`.`name` AS `organisation`,
             `tabOrganisation`.`homepage`,
             `tabOrganisation Partnership`.`type`,
             `tabOrganisation Partnership`.`image_url_web`,
             `tabOrganisation Partnership`.`image_height_web`
             FROM `tabOrganisation Partnership`
             LEFT JOIN `tabOrganisation` ON `tabOrganisation Partnership`.`parent` = `tabOrganisation`.`name`
             WHERE `tabOrganisation Partnership`.`block` = '{0}'
               AND `tabOrganisation Partnership`.`show_on_website` = 1
             ORDER BY `tabOrganisation Partnership`.`priority` DESC;""".format(block)
        partners = frappe.db.sql(sql_query, as_dict=True)
        return partners
    else:
        return ('Please provide a block')
