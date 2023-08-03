# -*- coding: utf-8 -*-
# Copyright (c) 2018-2019, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe import _
from frappe.utils.data import getdate
import csv
import re
import datetime
from lifefair.lifefair.utils import add_log
from random import randint
from datetime import timedelta
from datetime import date
from datetime import datetime

class Registration(Document):
    def create_ticket(self, ignore_permissions=False):
        if not ignore_permissions:
            self.date = date.today()
            
        # get random 18 digit barcode
        self.barcode = get_barcode(18)
        
        # get ticket number (####-####-####)
        self.ticket_number = get_ticket_code()
        
        self.type = "LF-Ticket"
        self.email_clerk = frappe.session.user or frappe.get_doc("Ticketing Settings", "Ticketing Settings", "email_clerk")
        
        meeting = frappe.get_doc('Meeting', self.meeting)
        registration_date = self.date
        meeting_date = meeting.date_date_format #datetime.datetime.strptime(meeting.date_date_format, '%d-%m-%Y')
        
        reg = getdate(registration_date) + timedelta(days=10)
        met = meeting_date - timedelta(days=8)
        
        
        earliest = min(reg, met)
        self.meldedatum = earliest
        
        deadline = date.today() + timedelta(days=7)
        self.deadline_daten_an_partner = deadline
        
        self.save(ignore_permissions=ignore_permissions)
        
        
        return
    pass


def get_barcode(l):
    # generate random barcode
    barcode = ''
    for i in range(l):
        barcode += str(randint(0,9))
    # check if this is already in the database
    db = frappe.get_all("Registration", filters={'barcode': barcode}, fields=['name'])
    if len(db) > 0:
        # it's in the database, retry
        barcode = get_barcode(l)
    return barcode

def get_ticket_code():
    # generate random ticket code
    ticket_code = ''
    for i in range(14):
        ticket_code += str(randint(0,9))
    ticket_code = list(ticket_code)
    ticket_code[4] = "/"
    ticket_code[9] = "/"
    ticket_code = "".join(ticket_code)
    # check if this is already in the database
    db = frappe.get_all("Registration", filters={'ticket_number': ticket_code}, fields=['name'])
    if len(db) > 0:
        # it's in the database, retry
        ticket_code = get_ticket_code()
    return ticket_code
    
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
    PHONE_2         = None
    
    isfirst = True
    # read csv
    elements = csv.reader(content.splitlines(), dialect=csv.excel)
    counter = 0
    # process elements
    for element in elements:
        if isfirst:
            isfirst = False;
            # find colums codes
            i = 0
            for column in element:
                if column == "Ticketnummer":
                    TICKETNO = i
                elif column == "Barcode":
                    BARCODE = i
                elif column == "Kategorie":    
                    REMARKS = i
                elif column == "Status":    
                    STATUS = i
                elif column == "Bestelldatum":
                    DATE = i
                elif column == "Anrede":
                    SALUTATION = i
                elif column == "Titel":
                    TITLE = i
                elif column == "Vorname":
                    FIRST_NAME = i
                elif column == "Nachname":
                    LAST_NAME = i
                elif column == "Ticket-Email":
                    EMAIL = i
                elif column == "Firma":
                    COMPANY = i
                elif column == "Telefon":
                    PHONE = i
                elif column == "Telefonnummer":
                    PHONE_2 = i
                elif column == "Strasse":
                    STREET = i
                elif column == "Postleitzahl":                  
                    PINCODE = i
                elif column == "Ort":
                    CITY = i
                elif column == "Funktion":
                    FUNCTION = i
                elif "Innovationsforen" in column:
                    BLOCK = i
                elif column == "Ticketart":
                    TYPE = i
                elif column == "Bezahlart":
                    PAYMENT = i
                elif column == "Rechnungsnummer":
                    INVOICENO = i
                elif column == "Gutscheincode":
                    CODE = i
                elif "Ich nehme teil" in column:
                    PARTICIPATION = i
                i += 1
            continue
        counter += 1
        # check if the ticket is already in the database
        db_regs = frappe.get_all("Registration", filters={'ticket_number': element[TICKETNO]}, fields=['name'])
        if db_regs:
            # ticket is already in the database, update
            reg = frappe.get_doc("Registration", db_regs[0]['name'])
            status = parse_status(element[STATUS], element[REMARKS])
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
            # iterate over email2 and email3 in case of no hit
            if not db_person:
                db_person = frappe.get_all("Person", filters={'email2': element[EMAIL]}, fields=['name'])
                if not db_person:
                    db_person = frappe.get_all("Person", filters={'email3': element[EMAIL]}, fields=['name'])
            phone = element[PHONE]
            if PHONE_2 and element[PHONE_2] and element[PHONE_2] != ".":
                phone = element[PHONE_2]
            if db_person:
                person_name = db_person[0]['name']
                # get person, check website_description and update if empty
                person = frappe.get_doc("Person", db_person[0]['name'])
                if not person.website_description:
                    person.website_description = "{0}, {1}".format(element[FUNCTION], element[COMPANY])
                # update phone number if missing
                if not person.company_phone:
                    person.company_phone = phone
                person.save()
            else:
                # person not found, create new person
                new_person = create_person(company=element[COMPANY],first_name=element[FIRST_NAME], 
                    last_name=element[LAST_NAME], title=element[TITLE],
                    salutation=element[SALUTATION], email=element[EMAIL], phone=phone, 
                    function=element[FUNCTION], street=element[STREET], pincode=element[PINCODE], 
                    city=element[CITY], source="from xing")
                if new_person:
                    new_pers.append(new_person)
                    person_name = new_person
                else:
                    frappe.log_error("Import Xing Error", "Failed to insert person {0} {1} (Ticket: {2})".format(element[FIRST_NAME], element[LAST_NAME], element[TICKETNO]))
                                                  
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
            status = parse_status(element[STATUS], element[REMARKS])
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
                    'phone': phone,
                    'status': status,
                    'code': element[CODE],
                    'participation': element[PARTICIPATION]
                })
                registration = registration.insert()
                reg_name = registration.name
                frappe.db.commit()
                new_regs.append(reg_name)
            except Exception as e:
                frappe.log_error("Import Xing Error", "Insert Registration failed. {0} (Ticket: {1})".format(e, element[TICKETNO]))
    add_log(title= _("Xing Import complete"),
       message = ( _("Import of {0} registrations ({1}) and {2} contacts ({3}).")).format(
                len(new_regs), new_regs, len(new_pers), new_pers),
       topic = "Xing")    
    return { 'registrations': new_regs, 'people': new_pers }

def create_person(first_name, last_name, email, title=None, salutation=None, company=None, function=None, phone=None,
    street=None, pincode=None, city=None, source="from xing"):
    # check if the person is already in the database (by email)
    sql_query = """SELECT `name` 
                   FROM `tabPerson`
                   WHERE `email` = '{email}'
                      OR `email2` = '{email}'
                      OR `email3` = '{email}';""".format(email=email)
    db_person = frappe.db.sql(sql_query, as_dict=True)
    person_name = None
    if not db_person:
        # check if company exists
        company_matches = None
        if company:
            company_matches = frappe.get_all("Organisation", filters={'official_name': company}, fields=['name'])
        # do not insert companies, too many typo issues
        """if not company_matches and company and company != "":
            company = frappe.get_doc({
                'doctype': "Organisation",
                'official_name': company
            })
            try:
                company.insert()
            except Exception as e:
                frappe.log_error("Insert company {0} failed {1}".format(company, e)) """
        full_name = "{0} {1}".format(first_name, last_name)
        if title:
            long_name = "{0} {1} {2}".format(title, first_name, last_name)
        else:
            long_name = full_name
        try:
            first_characters = last_name[0:4].upper()
        except:
            try:
                first_characters = last_name.upper()
            except:
                first_characters = "NN"
        gender = salutation
        if gender == "Herr":
            letter_salutation = "Sehr geehrter Herr"
        elif gender == "Frau":
            letter_salutation = "Sehr geehrte Frau"
        else:
            gender = ""
            letter_salutation = ""
        person = frappe.get_doc({
            'doctype': "Person",
            'first_name': first_name,
            'last_name': last_name,
            'full_name': full_name,
            'long_name': long_name,
            'first_characters': first_characters,
            'email': email,
            'company_phone': phone,
            'title': title,
            'gender': gender,
            'letter_salutation': letter_salutation,
            'website_description': "{0}, {1}".format(function, company),
            'remarks': "{5}, {1} @ {0}, {2}, {3} {4}".format(company, function, 
                street, pincode, city, source)
        })
        try:
            person = person.insert()
            # only insert company reference if provided (and matched)
            if company_matches and company and company != "":
                if function and function != "":
                    organisation = person.append('organisations', {})
                    organisation.organisation = company
                    organisation.function = function
                    organisation.is_primary = 0
                    organisation.notes = source
                    person.primary_organisation = company
                    person.primary_function = function
                    person.save()
            person_name = person.name
            frappe.db.commit()            
        except Exception as e:
            frappe.log_error("Import Xing Error", "Insert Person {1} {2} failed. {3}: {0}".format(e, first_name, last_name, source))      
    #frappe.log_error(person_name)
    return person_name

def find_block(block_field, meeting):
    # regex block finder
    p = re.compile('IF.\d\d')
    # find block in the source text
    match_block = p.match(block_field)
    if match_block:
        block = "{0} {1}".format(meeting, match_block.group(0))
        # check if the block exists in the db
        db_block = frappe.get_all("Block", 
            filters=[['name', 'LIKE', '%{0}%'.format(block)],
                     ['meeting', '=', meeting]], 
            fields=['name'],
            order_by='name ASC')
        if len(db_block) > 0:
            block = db_block[0]['name']
        else:
            block = None
    else:
        block = None  
    return block
        
def parse_status(xing_status, remarks=None):
    status = None
    # parse from normal status
    if xing_status == "Bezahlt":
        status = "Paid"
    elif xing_status == "Storniert":
        status = "Cancelled"
    elif xing_status == "Versendet":
        status = "Sent"
    # override status in special cases: Warteliste in remarks is tentative (except on cancellations)
    if not (status == "Cancelled") and "warteliste" in remarks.replace(" ", "").lower():
        status = "Tentative"
    return status
