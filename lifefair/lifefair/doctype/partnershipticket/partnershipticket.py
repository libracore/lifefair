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
                # try to find person by email address
                person_matches = frappe.get_all('Person', filters={'email': ticket.email}, fields=['name'])
                if person_matches:
                    ticket.person = person_matches[0]['name']
                else:
                    # fallback to email 2
                    person_matches = frappe.get_all('Person', filters={'email2': ticket.email}, fields=['name'])
                    if person_matches:
                        ticket.person = person_matches[0]['name']
                    else:
                        # fallback to email 3
                        person_matches = frappe.get_all('Person', filters={'email3': ticket.email}, fields=['name'])
                        if person_matches:
                            ticket.person = person_matches[0]['name']
                # if person found, try to match registration
                if ticket.person:
                    registration_matches = frappe.get_all('Registration', filters={'person': ticket.person, 'meeting': self.meeting}, fields=['name'])
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

# this is the function to bulk-create registrations for all partnership tickets
@frappe.whitelist()
def create_registrations():
    #get all partnership tickets
    partnershiptickets = frappe.get_all("Partnershipticket", filters={})

    #for each ticket, iterate through the tickets and create a registration for each ticket if the person is not yet registered
    for partnershipticket in partnershiptickets:
        ticket = frappe.get_doc("Partnershipticket", partnershipticket['name'])
        meeting = ticket.meeting

        for ticket in ticket.tickets:
            if is_valid_ticket(ticket):
                 create_registration_if_needed(ticket, meeting)
    return

# check if the ticket is valid
def is_valid_ticket(ticket):
    return ticket.first_name and ticket.last_name and ticket.email and ticket.email != "@"

# create a registration if needed
def create_registration_if_needed(ticket, meeting):
     if not get_registrations(ticket, meeting):
        if person_exists(ticket):
            create_registration(ticket, meeting)
        else:
            create_person(ticket)
            #set ticket.person
            person_matches = frappe.get_all('Person', filters={'email': ticket.email}, fields=['name'])
            if person_matches:
                ticket.person = person_matches[0]['name']
            create_registration(ticket, meeting)

# create a person
def create_person(ticket):
    try:
        if ticket.organisation:
            organisation = get_or_create_organisation(ticket.organisation)
            create_person_document(ticket, organisation)
        else:
            create_person_document(ticket)
        return
    except Exception as err:
        frappe.log_error(err, "Person {0} {1}".format(ticket.first_name, ticket.last_name))

# get or create an organisation
def get_or_create_organisation(organisation_name):
    organisation = frappe.get_all('Organisation', filters={'official_name': organisation_name}, fields=['name'])
    if not organisation:
        organisation = create_organisation(organisation_name)
    else:
        organisation = organisation[0]['name']
    return organisation

# create an organisation
def create_organisation(organisation_name):
    new_organisation = frappe.get_doc({
        'doctype': 'Organisation',
        'official_name': organisation_name
    })
    new_organisation.insert(ignore_permissions=True)
    frappe.db.commit()
    return new_organisation.name

# create a new person
def create_person_document(ticket, organisation=None):
    person_doc = {
        'doctype': 'Person',
        'full_name': ticket.first_name + ' ' + ticket.last_name,
        'first_name': ticket.first_name,
        'last_name': ticket.last_name,
        'email': ticket.email,
        'company_phone': ticket.phone
    }
    if organisation:
        person_doc['organisations'] = [{
            'reference_doctype': 'Person Organisation',
            'primary_organisation': organisation,
            'organisation': organisation,
            'function': ticket.function,
            'is_primary': 1
        }]
    new_person = frappe.get_doc(person_doc)
    new_person.insert(ignore_permissions=True)
    frappe.db.commit()
    return

# check if the person exists
def person_exists(ticket):
    if ticket.email == "@":
        return False
        
    # try to find person by email address
    person_matches = frappe.get_all('Person', filters={'email': ticket.email}, fields=['name'])
    if person_matches:
        return True
    
    # try to find person by email address 2
    person_matches = frappe.get_all('Person', filters={'email2': ticket.email}, fields=['name'])
    if person_matches:
        return True

    # try to find person by email address 3
    person_matches = frappe.get_all('Person', filters={'email3': ticket.email}, fields=['name'])
    if person_matches:
        return True

    return False

# check if the person is already registered for the meeting        
def get_registrations(ticket, meeting):
    if ticket.person:
        registration_matches = frappe.get_all('Registration', filters={'person': ticket.person, 'meeting': meeting}, fields=['name'])
        if registration_matches:
            ticket.registration = registration_matches[0]['name']
            return ticket.registration
    return None

# find the matching if block
def find_matching_block(if_block, meeting):
    if if_block:
        if if_block=="Hauptprogramm":
            blocks = frappe.get_all('Block', filters={'title': ['like', f'%Hauptprogramm%'], 'meeting': meeting}, fields=['name'])
            return blocks[0].name
        block_names = if_block.split(", ")
        matching_if_blocks = []
        for i, block_name in enumerate(block_names):
            if "." not in block_name:
                block_names[i] = block_name[:-2] + "." + block_name[-2:]
            matching_block = frappe.get_all('Block', filters={'title': ['like', f'%{block_names[i]}%'], 'meeting': meeting}, fields=['name'])
            matching_if_blocks.append(matching_block[0])
        return matching_if_blocks
    return None

# create a registration for the person
def create_registration(ticket, meeting):
    try:
        #create registration for main block
        new_registration = frappe.get_doc({
            'doctype': 'Registration',
            'person': ticket.person,
            'meeting': meeting,
            'block': find_matching_block("Hauptprogramm", meeting)
        })
        new_registration.insert(ignore_permissions=True)
        frappe.db.commit()

        #create registration for each if block
        matching_if_blocks = find_matching_block(ticket.if_block, meeting)
        if matching_if_blocks:
            for matching_if_block in matching_if_blocks:
                new_registration = frappe.get_doc({
                    'doctype': 'Registration',
                    'person': ticket.person,
                    'meeting': meeting,
                    'block': matching_if_block.name
                })
                new_registration.insert(ignore_permissions=True)
                frappe.db.commit()
    except Exception as err:
        frappe.log_error(err, "Registration for {0} {1}".format(ticket.first_name, ticket.last_name))
