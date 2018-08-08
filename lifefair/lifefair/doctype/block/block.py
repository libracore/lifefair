# -*- coding: utf-8 -*-
# Copyright (c) 2018, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Block(Document):
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
