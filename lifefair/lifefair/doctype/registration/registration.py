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
        db_regs = frappe.get_all("Registration", filters={'ticket_number': element[TICKETNO]}, fields=['name'])
        if db_regs:
            # ticket is already in the database, update
            reg = frappe.get_doc("Registration", db_regs[0]['name'])
            status = parse_status(element[STATUS])
            reg.status = status
            reg.type = element[TYPE],
            reg.payment = element[PAYMENT],
            reg.invoice_number = element[INVOICENO],
            reg.phone = element[PHONE],
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
                full_name = "{0} {1}".format(element[FIRST_NAME], element[LAST_NAME])
                if element[TITLE]:
                    long_name = "{0} {1} {2}".format(element[TITLE], element[FIRST_NAME], element[LAST_NAME])
                try:
                    first_characters = element[LAST_NAME][0:4].upper()
                except:
                    try:
                        first_characters = element[LAST_NAME].upper()
                    except:
                        first_characters = "NN"
                person = frappe.get_doc({
                    'doctype': "Person",
                    'first_name': element[FIRST_NAME],
                    'last_name': element[LAST_NAME],
                    'full_name': full_name,
                    'long_name': long_name,
                    'first_characters': first_characters,
                    'email': element[EMAIL],
                    'company_phone': element[PHONE],
                    'title': element[TITLE],
                    'remarks': "From Xing, {1} @ {0}, {2}, {3} {4}".format(element[COMPANY], element[FUNCTION], 
                        element[STREET], element[PINCODE], element[CITY])
                })
                person_name = person.insert()
                frappe.db.commit()
                new_pers.append(person_name)
            # create the new registration
            # find block
            match_block = p.match(element[BLOCK])
            if match_block:
                block = "SGES 2018 {0}".format(match_block)
            # parse date stamp (13.07.2018, 16:56)
            date_fields = element[DATE].split(',')[0].split('.')
            date = "{0}-{1}-{2}".format(date_fields[2], date_fields[1], date_fields[0])
            # parse status ['Bezahlt', 'Storniert', 'Versendet'] > [Tentative, Confirmed, Cancelled, Paid, Sent]
            status = parse_status(element[STATUS])
            registration = frappe.get_doc({
                'doctype': "Registration",
                'person': person_name,
                'meeting': meeting,
                'block': block,
                'date': date,
                'remarks': element[REMARKS],
                'ticket_number': element[TICKETNO],
                'barcode': element[BARCODE],
                'type': element[TYPE],
                'payment': element[PAYMENT],
                'invoice_number': element[INVOICENO],
                'phone': element[PHONE],
                'status': status
            })
            reg_name = registration.insert()
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
