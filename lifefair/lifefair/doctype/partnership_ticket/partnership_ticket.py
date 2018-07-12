# -*- coding: utf-8 -*-
# Copyright (c) 2018, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe import _

class PartnershipTicket(Document):
    def apply_owner(self):
        try:
            owner = frappe.get_doc("User", self.responsible)
        except:
            frappe.msgprint( _("The selected responsible person is not yet a user. Please add the email as new user.") )
        else:
            self.owner = self.responsible
            self.save()
        return
    
    def identify_people(self):
        for ticket in self.tickets:
            if ticket.email:
                person_matches = frappe.get_all('Person', filters={'email': ticket.email}, fields=['name'])
                if person_matches:
                    ticket.person = person_matches[0]['name']
                    registration_matches = frappe.get_all('Registration', filters={'person': person_matches[0]['name'], 'meeting': self.meeting}, fields=['name'])
                    if registration_matches:
                        ticket.registration = registration_matches[0]['name']
        self.save()
         
    pass
