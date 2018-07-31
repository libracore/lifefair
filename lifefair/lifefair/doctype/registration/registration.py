# -*- coding: utf-8 -*-
# Copyright (c) 2018, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe import _
import csv
import re

class Registration(Document):
    pass

@frappe.whitelist()
def import_xing(content, meeting):
    new_regs = []
    new_pers = []
    
    # field definition
    TICKETNO = 0                    # ticket number cell A
    BARCODE = 1                     # barcode cell B
    REMARKS = 2                     # remarks field ("Kategorie")
    STATUS = 4                      # status ['Bezahlt', 'Storniert', 'Versendet']
    DATE = 5                        # order date (13.07.2018, 16:56)
    SALUTATION = 10
    TITLE = 11
    FIRST_NAME = 12
    LAST_NAME = 13
    EMAIL = 14
    COMPANY = 15
    PHONE = 25
    STREET = 19
    PINCODE = 20
    CITY = 21
    FUNCTION = 24
    BLOCK = 26                      # contains IF.xx
    TYPE = 3
    PAYMENT = 23
    INVOICENO = 22
    
    # regex block finder
    p = re.compile('IF.\d\d')
    
    isfirst = True
    # read csv
    elements = csv.reader(content.encode('utf-8').splitlines(), dialect='excel')
    # process elements
    for element in elements:
        if isfirst:
            isfirst = False;
            continue
        # check if the ticket is already in the database
        db_regs = frappe.get_all("Registration", filters={'ticket_number': element[TICKETNO].decode('utf-8')}, fields=['name'])
        if db_regs:
            # ticket is already in the database, update
            reg = frappe.get_doc("Registration", db_regs[0]['name'])
            status = parse_status(element[STATUS].decode('utf-8'))
            reg.status = status
            reg.type = element[TYPE].decode('utf-8'),
            reg.payment = element[PAYMENT].decode('utf-8'),
            reg.invoice_number = element[INVOICENO].decode('utf-8'),
            reg.phone = element[PHONE].decode('utf-8'),
            reg.save()
            frappe.db.commit()
        else:
            # ticket is not in the database, create
            # check email address to find person
            db_person = frappe.get_all("Person", filters={'email': element[EMAIL]}, fields=['name'])
            if db_person:
                person_name = db_person[0]['name']
            else:
                # person not found, create new person
                frappe.log_error("{0}".format(element))
                full_name = "{0} {1}".format(element[FIRST_NAME].decode('utf-8'), element[LAST_NAME].decode('utf-8'))
                if element[TITLE]:
                    long_name = "{0} {1} {2}".format(element[TITLE].decode('utf-8'), element[FIRST_NAME].decode('utf-8'), element[LAST_NAME].decode('utf-8'))
                else:
                    long_name = full_name
                try:
                    first_characters = element[LAST_NAME].decode('utf-8')[0:4].upper()
                except:
                    try:
                        first_characters = element[LAST_NAME].decode('utf-8').upper()
                    except:
                        first_characters = "NN"
                person = frappe.get_doc({
                    'doctype': "Person",
                    'first_name': element[FIRST_NAME].decode('utf-8'),
                    'last_name': element[LAST_NAME].decode('utf-8'),
                    'full_name': full_name,
                    'long_name': long_name,
                    'first_characters': first_characters,
                    'email': element[EMAIL].decode('utf-8'),
                    'company_phone': element[PHONE].decode('utf-8'),
                    'title': element[TITLE].decode('utf-8'),
                    'remarks': "From Xing, {1} @ {0}, {2}, {3} {4}".format(element[COMPANY].decode('utf-8'), element[FUNCTION].decode('utf-8'), 
                        element[STREET].decode('utf-8'), element[PINCODE].decode('utf-8'), element[CITY].decode('utf-8'))
                })
                person = person.insert()
                person_name = person.name
                frappe.db.commit()
                new_pers.append(person_name)
            # create the new registration
            # find block
            match_block = p.match(element[BLOCK].decode('utf-8'))
            if match_block:
                block = "SGES 2018 {0}".format(match_block)
            else:
                block = None
            # parse date stamp (13.07.2018, 16:56)
            date_fields = element[DATE].decode('utf-8').split(',')[0].split('.')
            date = "{0}-{1}-{2}".format(date_fields[2], date_fields[1], date_fields[0])
            # parse status ['Bezahlt', 'Storniert', 'Versendet'] > [Tentative, Confirmed, Cancelled, Paid, Sent]
            status = parse_status(element[STATUS].decode('utf-8'))
            frappe.log_error(person_name)
            registration = frappe.get_doc({
                'doctype': "Registration",
                'person': person_name,
                'meeting': meeting,
                'block': block,
                'date': date,
                'remarks': element[REMARKS].decode('utf-8'),
                'ticket_number': element[TICKETNO].decode('utf-8'),
                'barcode': element[BARCODE].decode('utf-8'),
                'type': element[TYPE].decode('utf-8'),
                'payment': element[PAYMENT].decode('utf-8'),
                'invoice_number': element[INVOICENO].decode('utf-8'),
                'phone': element[PHONE].decode('utf-8'),
                'status': status
            })

            registration = registration.insert()
            reg_name = registration.name
            frappe.db.commit()
            new_regs.append(reg_name)

        
    return { 'registrations': new_regs, 'people': new_pers }

def parse_status(xing_status):
    status = None
    if xing_status == "Bezahlt":
        status = "Paid"
    elif xing_status == "Storniert":
        status = "Cancelled"
    elif xing_status == "Versendet":
        status = "Sent"
    return status
