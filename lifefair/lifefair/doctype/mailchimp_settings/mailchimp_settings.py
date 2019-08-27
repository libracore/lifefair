# -*- coding: utf-8 -*-
# Copyright (c) 2019, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from lifefair.lifefair.mailchimp import get_lists
from frappe import _

class MailChimpSettings(Document):
    def validate(self):
        # try to get list to verify connection
        try:
            get_lists()
        except Exception as err:
            frappe.msgprint( _("Connection verification failed ({0}).").format(err), _("Validation"))
        return
        
    pass
