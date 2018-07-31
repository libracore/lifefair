# -*- coding: utf-8 -*-
# Copyright (c) 2018, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe import _
import csv

class Registration(Document):
    pass

@frappe.whitelist()
def import_xing(content, meeting):
    new_regs = []
    
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
    
    isfirst = True
    # read csv
    elements = csv.reader(content.splitlines(), dialect='excel')
    frappe.log_error(content)
    # process elements
    for element in elements:
        if isfirst:
            isfirst = False;
            continue
        # check if the ticket is already in the database
        frappe.log_error("Ticket: " + element[TICKETNO])
        
        return { 'new_registrations': new_regs }
    else:
        return { 'result': _('Parsing file failed') }

def split_line(line):
    cells = []
    old_pos = 0
    pos = -1
    while True:
        pos = line.find(',', pos + 1)
        if pos == -1:
            break
        new_cell = line[oldpos:pos]
        cells.append(new_cell)
        old_pos = pos
        if line[(pos + 1):(pos + 2)] == '"':
            pos = line.find('"', pos + 2)
            if pos == -1:
                break
            new_cell = line[oldpos:pos]
            cells.append(new_cell)
            old_pos = pos
    return cells
