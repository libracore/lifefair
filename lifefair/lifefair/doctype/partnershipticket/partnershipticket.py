# -*- coding: utf-8 -*-
# Copyright (c) 2018, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe import _

class Partnershipticket(Document):
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

# this is a public API for the creation of partnership ticket entries
#
# call the API from
#   /api/method/lifefair.lifefair.doctype.partnershipticket.partnershipticket.add_guest?ticket=<ticket id>&fname=<first name>&lname=<last name>&email=<email>
@frappe.whitelist(allow_guest=True)
def add_guest(ticket=None, fname=None, lname=None, email=None):
    if ticket and email and fname and lname:
        new_ticket = frappe.get_doc({
            'doctype': 'Partnership Ticket Item',
            'parenttype': 'Partnershipticket',
            'parentfield': 'tickets',
            'parent': ticket,
            'first_name': fname,
            'last_name': lname,
            'email': email
        })
        new_ticket.insert(ignore_permissions=True)
        new_comment = frappe.get_doc({
            'doctype': 'Communication',
            'communication_type': 'Comment',
            'comment_type': 'Comment',
            'subject': 'Website Ticket Entry',
            'content': 'Partnership ticket entry from Webpage (unsecured)',
            'reference_doctype': 'Partnershipticket',
            'status': 'Linked',
            'reference_name': ticket,
            'modified_by': 'Administrator',
            'owner': 'Administrator',
            'sent_or_received': 'Received'
        })
        new_comment.insert(ignore_permissions=True)
        frappe.db.commit()
        return _('Data received')
    else:
        return _('Invalid API call')
