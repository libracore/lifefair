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
        person_count = 0
        registration_count = 0
        registration_count = 0
        for ticket in self.tickets:
            if ticket.email != "@":
                person_count += 1
                person_matches = frappe.get_all('Person', filters={'email': ticket.email}, fields=['name'])
                if person_matches:
                    ticket.person = person_matches[0]['name']                    
                    registration_matches = frappe.get_all('Registration', filters={'person': person_matches[0]['name'], 'meeting': self.meeting}, fields=['name'])
                    if registration_matches:
                        ticket.registration = registration_matches[0]['name']
                        registration_count += 1
        self.ticket_count = len(self.tickets)
        self.person_count = person_count
        self.registration_count = registration_count
        self.missing_registrations = person_count - registration_count
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
            'content': 'Partnership ticket entry from Webpage (unsecured): {0}, {1}, {2}'.format(fname, lname, email),
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

# this is a public API to read ticket entries
#
# call the API from
#   /api/method/lifefair.lifefair.doctype.partnershipticket.partnershipticket.get_guests?ticket=<ticket id>&title=<title>
@frappe.whitelist(allow_guest=True)
def get_guests(ticket=None, title=None):
    if ticket and title:
        # for security: crosscheck name/id against title
        tickets = frappe.get_all("Partnershipticket", filters={'name': ticket, 'title': title}, fields=['name'])
        if tickets:
            code = "<table style='width: 100%; '>"
            code += "<tr><th>Nr.</th><th>Vorname</th><th>Nachname</th><th>Email</th></tr>"
            entries = frappe.get_all('Partnership Ticket Item', filters={'parent': ticket}, fields=['first_name', 'last_name', 'email'])
            for i in range(0, len(entries)):
                code += "<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td></tr>".format(
                    (i+1), entries[i]['first_name'], entries[i]['last_name'], entries[i]['email'])
            code += "</table>"
            return code
        else:
            return _('Invalid credentials')
    else:
        return _('Invalid API call')

# this is the function to bulk-update the ticket status
@frappe.whitelist()
def bulk_update_status(meeting):
    # find all tickets for the specified meeting
    partner_tickets = frappe.get_all("Partnershipticket", filters={'meeting': meeting}, fields=['name'])
    if partner_tickets:
        for partner_ticket in partner_tickets:
            ticket = frappe.get_doc("Partnershipticket", partner_ticket['name'])
            ticket.identify_people()
    return
