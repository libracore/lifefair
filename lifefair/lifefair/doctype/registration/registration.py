# -*- coding: utf-8 -*-
# Copyright (c) 2018, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe import _
import csv
import re
import datetime

class Registration(Document):
    pass

@frappe.whitelist()
def import_xing(content, meeting):
    new_regs = []
    new_pers = []
    
    # field definition
    TICKETNO        = 0                     # ticket number cell A
    BARCODE         = 1                     # barcode cell B
    REMARKS         = 2                     # remarks field ("Kategorie")
    STATUS          = 4                     # status ['Bezahlt', 'Storniert', 'Versendet']
    DATE            = 5                     # order date (13.07.2018, 16:56)
    SALUTATION      = 10
    TITLE           = 11
    FIRST_NAME      = 12
    LAST_NAME       = 13
    EMAIL           = 14
    COMPANY         = 15
    PHONE           = 50                    # AY
    STREET          = 26                    # AA                    
    PINCODE         = 28                    # AC
    CITY            = 29                    # AD
    FUNCTION        = 49                    # AX 
    BLOCK           = 52                    # BA, contains IF.xx
    TYPE            = 3
    PAYMENT         = 44                    # AS
    INVOICENO       = 43                    # AR
    CODE            = 47                    # AV, "Gutscheincode", e.g. "S18STAFF"
    PARTICIPATION   = 51                    # AZ, "Ich nehme teil" 
      
    isfirst = True
    # read csv
    elements = unicode_csv_reader(content.splitlines())
    counter = 0
    # process elements
    for element in elements:
        if isfirst:
            isfirst = False;
            continue
        counter += 1
        # check if the ticket is already in the database
        db_regs = frappe.get_all("Registration", filters={'ticket_number': element[TICKETNO]}, fields=['name'])
        if db_regs:
            # ticket is already in the database, update
            reg = frappe.get_doc("Registration", db_regs[0]['name'])
            status = parse_status(element[STATUS])
            reg.status = status
            reg.type = element[TYPE]
            reg.payment = element[PAYMENT]
            reg.invoice_number = element[INVOICENO]
            reg.phone = element[PHONE]
            reg.code = element[CODE]
            reg.participation = element[PARTICIPATION]
            # find block
            block = find_block(element[BLOCK], meeting)
            reg.block = block
            try:
                reg.save()
                frappe.db.commit()
            except Exception as e:
                frappe.log_error("Import Xing Error", "Update Registration failed. {0}".format(e))                 
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
                else:
                    long_name = full_name
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
                try:
                    person = person.insert()
                    person_name = person.name
                    frappe.db.commit()
                    new_pers.append(person_name)
                except Exception as e:
                    frappe.log_error("Import Xing Error", "Insert Person failed. {0}".format(e))      
                                  
            # create the new registration
            # find block
            block = find_block(element[BLOCK], meeting)
            # parse date stamp (13.07.2018, 16:56)
            date_fields = element[DATE].split(',')[0].split('.')
            if len(date_fields) >= 3:
                # proper date stamp
                date = "{0}-{1}-{2}".format(date_fields[2], date_fields[1], date_fields[0])
            else:
                # found float timestamp
                zerodate = datetime.datetime(1899, 12, 30)
                delta = datetime.timedelta(days=float(element[DATE]))
                converted_date = zerodate + delta
                date = "{year:04d}-{month:02d}-{day:02d}".format(year=converted_date.year, month=converted_date.month, day=converted_date.day)
            # parse status ['Bezahlt', 'Storniert', 'Versendet'] > [Tentative, Confirmed, Cancelled, Paid, Sent]
            status = parse_status(element[STATUS])
            try:
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
                    'status': status,
                    'code': element[CODE],
                    'participation': element[PARTICIPATION]
                })
                registration = registration.insert()
                reg_name = registration.name
                frappe.db.commit()
                new_regs.append(reg_name)
            except Exception as e:
                frappe.log_error("Import Xing Error", "Insert Registration failed. {0}".format(e))
        
    return { 'registrations': new_regs, 'people': new_pers }
    
def find_block(block_field, meeting):
    # regex block finder
    p = re.compile('IF.\d\d')
    # find block in the source text
    match_block = p.match(block_field)
    if match_block:
        block = "{0} {1}".format(meeting, match_block.group(0))
        # check if the block exists in the db
        db_block = frappe.get_all("Block", filters={'name': block}, fields=['name'])
        if not db_block:
            block = None
    else:
        block = None  
    return block
        
def parse_status(xing_status):
    status = None
    if xing_status == "Bezahlt":
        status = "Paid"
    elif xing_status == "Storniert":
        status = "Cancelled"
    elif xing_status == "Versendet":
        status = "Sent"
    return status


def unicode_csv_reader(unicode_csv_data, dialect=csv.excel, **kwargs):
    # csv.py doesn't do Unicode; encode temporarily as UTF-8:
    csv_reader = csv.reader(utf_8_encoder(unicode_csv_data),
                            dialect=dialect, **kwargs)
    for row in csv_reader:
        # decode UTF-8 back to Unicode, cell by cell:
        yield [unicode(cell, 'utf-8') for cell in row]

def utf_8_encoder(unicode_csv_data):
    for line in unicode_csv_data:
        yield line.encode('utf-8')
