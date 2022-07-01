# -*- coding: utf-8 -*-
# Copyright (c) 2017-2022, libracore and contributors
# License: AGPL v3. See LICENCE

# import definitions
from __future__ import unicode_literals
import frappe
from frappe import throw, _
import json
from frappe.utils.data import today
from frappe.utils.data import add_to_date

@frappe.whitelist(allow_guest=True) 
def get_visitor_type():
    sql_query = """
        SELECT 
            `tabVisitor Type`.`name`
        FROM `tabVisitor Type`
        ORDER BY `tabVisitor Type`.`priority` ASC
    """
    data = frappe.db.sql(sql_query, as_dict = True)
    visitor_types = []
    for d in data:
        visitor_types.append(d['name'])
    return visitor_types

@frappe.whitelist(allow_guest=True) 
def get_blocks(meeting, usertype):
    sql_query = """
        SELECT
            `official_title`,
            `location`,
            `short_name`,
            `neues_datum`,
            `time`,
            `tabBlock Price`.`rate` AS `rate`,
            GROUP_CONCAT(`tabBlock Interest`.`interest`) AS `interests`,
            `website_link`,
            `tabBlock`.`name`,
            `tabBlock`.`meeting`
        FROM `tabBlock`
        LEFT JOIN `tabBlock Interest` ON `tabBlock Interest`.`parent` = `tabBlock`.`name`
        LEFT JOIN `tabBlock Price Block` ON `tabBlock Price Block`.`block` = `tabBlock`.`name`
        LEFT JOIN `tabBlock Price` ON `tabBlock Price`.`name` = `tabBlock Price Block`.`parent`
        WHERE `tabBlock`.`meeting` = '{meeting}'
        AND `tabBlock Price`.`visitor_type` = '{usertype}'
        GROUP BY `tabBlock`.`name`
        ORDER BY `tabBlock`.`neues_datum` ASC;
    """.format(meeting=meeting, usertype=usertype)
    data = frappe.db.sql(sql_query, as_dict = True)
    return data

@frappe.whitelist(allow_guest=True) 
def create_ticket(stripe, addressOne, addressTwo, warenkorb, total):
    
    if isinstance(addressOne, str):
        addressOne = json.loads(addressOne)
    firma = addressOne['firma']
    # ticket is not in the database, create
    # check email address to find person
    db_person = frappe.get_all("Person", filters={'email': addressOne['email']}, fields=['name'])
    # iterate over email2 and email3 in case of no hit
    if not db_person:
        db_person = frappe.get_all("Person", filters={'email2': addressOne['email']}, fields=['name'])
        if not db_person:
            db_person = frappe.get_all("Person", filters={'email3': addressOne['email']}, fields=['name'])
            
    if db_person:
        person_name = db_person[0]['name']
        # get person, check website_description and update if empty
        person = frappe.get_doc("Person", db_person[0]['name'])
        contact = frappe.get_all("Contact", filters={'email_id': addressOne["email"]}, fields=['name'])
        done_data = "No"
        if firma:
            customer = firma
        else:
            customer = person.full_name
        # create customer if missing
        if not person.customer_link: 
            person.customer_link = create_customer(addressOne, person, customer)
        elif firma != person.customer_link:
            create_customer(addressOne, person, customer)
        # update if address is missing
        if not person.customer_address:
            person.customer_address = create_address(customer, check="No", info=addressOne, person=person.name)
            current_address = person.customer_address
        else:
            # create an Address record to avoid replacing the current address
            address_name = frappe.get_doc("Address", person.customer_address)
            current_address = person.customer_address
            if len(address_name.links) == 0:
                link = address_name.append('links', {})
                link.link_doctype = "Customer"
                link.link_name = person.customer_link
                address_name.save(ignore_permissions=True)
            if addressOne['adresse'] != address_name.address_line1 or addressOne['ort'] != address_name.city or addressOne['plz'] != address_name.pincode or addressOne['land'] != address_name.country:
                current_address = create_address(customer, check="No", info=addressOne, person=person.name)
                if done_data == "No":
                    create_data_changes(addressOne, person)
                    done_data = "Yes"
        #check if the data provided is different from the one found and create a contatc record for it
        if addressOne['herrFrau'] != person.gender or addressOne['akademishTitle'] != person.title or addressOne['firstname'] != person.first_name or addressOne['lastname'] != person.last_name or addressOne['phone'] != person.company_phone:
            create_contact(addressOne, customer, customer_address=current_address, person_contact=contact )
            if done_data == "No":
                create_data_changes(addressOne, person)
                done_data = "Yes"
        if contact:
            contact_data = frappe.get_doc("Contact", contact[0]['name'])
            if addressOne['firma'] != contact_data.company_name or addressOne['funktion'] != contact_data.function:
                create_contact(addressOne, customer, customer_address=current_address, person_contact=contact)
                if done_data == "No":
                    create_data_changes(addressOne, person)
                    done_data = "Yes"
        if not person.website_description:
            person.website_description = "{0}, {1}".format(addressOne['funktion'], addressOne['firma'])
        # update phone number if missing
        if not person.company_phone:
            person.company_phone = addressOne['phone']
        person.save(ignore_permissions=True)
    else:
        # person not found, create new person
        full_name = "{0} {1}".format(addressOne['firstname'], addressOne['lastname'])
        if firma:
            customer = firma
        else:
            customer = full_name
        person_name = create_person(addressOne, customer, full_name)
        current_address = frappe.get_doc("Person", person_name).customer_address
        contact=None
    
    if isinstance(warenkorb, str):
        warenkorb = json.loads(warenkorb)
    registration = None
    for entry in warenkorb:
        if registration:
            new_registration = frappe.copy_doc(registration, ignore_no_copy = False)
            new_registration.block = entry['name']
            new_registration.date = entry['neues_datum']
            new_registration = new_registration.insert(ignore_permissions=True)
            new_registration.save(ignore_permissions=True)
        else:
            try:
                registration = frappe.get_doc({
                    'doctype': "Registration",
                    'person': person_name,
                    'meeting': entry['meeting'],
                    'block': entry['name'],
                    'date': entry['neues_datum'],
                    'phone': addressOne['phone']
                })
                registration.insert(ignore_permissions=True)
                registration.create_ticket(ignore_permissions=True)
            except Exception as e:
                frappe.log_error("{0}\n\n{1}".format(e, entry), "Registration creation failed")
    frappe.db.commit()

    #sales invoice beign created
    sinv_name, signature = create_invoice(addressOne, addressTwo, customer, total, registration.ticket_number, addresse=current_address, person=person_name, contact=contact )
    
    #check giftcard if provided
    if addressOne['giftcode'] != "":
        db_giftc = frappe.get_all("Ticket Voucher", filters={'name': addressOne['giftcode']}, fields=['name'])
        giftc = frappe.get_doc("Ticket Voucher", db_giftc[0]['name'])
        giftc.used_by = person_name
        giftc.save(ignore_permissions=True)
    
    #check if kreditkard payment was done
    if stripe == "Yes":
        create_payment_entry(sinv_name)
    
    return {'ticket_number': registration.ticket_number, 'sinv_name': sinv_name, 'signature': signature}

def create_person(addressOne, customer, full_name, source="from ticketing"):
    # check if the person is already in the database (by email)
    sql_query = """SELECT `name` 
                   FROM `tabPerson`
                   WHERE `email` = '{email}'
                      OR `email2` = '{email}'
                      OR `email3` = '{email}';""".format(email=addressOne['email'])
    db_person = frappe.db.sql(sql_query, as_dict=True)
    person_name = None
    if not db_person:
        # check if company exists
        company_matches = None
        if addressOne['firma']:
            company_matches = frappe.get_all("Organisation", filters={'official_name': addressOne['firma']}, fields=['name'])
        if addressOne['akademishTitle']:
            long_name = "{0} {1} {2}".format(addressOne['akademishTitle'], addressOne['firstname'], addressOne['lastname'])
        else:
            long_name = full_name
        try:
            first_characters = addressOne['lastname'][0:4].upper()
        except:
            try:
                first_characters = addressOne['lastname'].upper()
            except:
                first_characters = "NN"
        gender = addressOne['herrFrau']
        if gender == "Herr":
            letter_salutation = "Sehr geehrter Herr"
        elif gender == "Frau":
            letter_salutation = "Sehr geehrte Frau"
        else:
            gender = ""
            letter_salutation = ""
        person = frappe.get_doc({
            'doctype': "Person",
            'first_name': addressOne['firstname'],
            'last_name': addressOne['lastname'],
            'full_name': full_name,
            'long_name': long_name,
            'first_characters': first_characters,
            'email': addressOne['email'],
            'company_phone': addressOne['phone'],
            'title': addressOne['akademishTitle'],
            'gender': gender,
            'letter_salutation': letter_salutation,
            'website_description': "{0}, {1}".format(addressOne['funktion'], addressOne['firma']),
            'contact_notes': "{5} {1} @ {0}, {2}, {3} {4}".format(addressOne['firma'], addressOne['funktion'], 
                addressOne['adresse'], addressOne['plz'], addressOne['ort'], addressOne['land'] )
        })
        person_name = None
        try:
            person = person.insert(ignore_permissions=True)
            person.customer_link = create_customer(addressOne, person, customer)
            person.customer_address = create_address(customer, check="No", info=addressOne, person=person.name)
            # only insert company reference if provided (and matched)
            if company_matches and addressOne['firma'] and addressOne['firma'] != "":
                if addressOne['funktion'] and addressOne['funktion'] != "":
                    organisation = person.append('organisations', {})
                    organisation.organisation = addressOne['firma']
                    organisation.function = addressOne['funktion']
                    organisation.is_primary = 0
                    organisation.notes = source
                    person.primary_organisation = addressOne['firma']
                    person.primary_function = addressOne['funktion']
            person.save(ignore_permissions=True)
            create_contact(addressOne, customer, customer_address=person.customer_address, person_contact=None)
            person_name = person.name
            frappe.db.commit()            
        except Exception as e:
            frappe.log_error("Import Ticketing Error", "Insert Person {1} {2} failed. {3}: {0}".format(e, addressOne['firstname'], addressOne['lastname'], source))      
    #frappe.log_error(person_name)
    return person_name

def create_contact(addressOne, customer, customer_address, person_contact=None, source="from ticketing"):
    if addressOne['herrFrau'] == "Herr":
        gender = "Männlich"
    elif addressOne['herrFrau'] == "Frau":
        gender = "Weiblich"
    else:
        gender = "Sonstige(s)"
    address = None
    if customer_address:
        address = customer_address
    if person_contact:
        contact = frappe.get_doc("Contact", person_contact[0]['name'])
        contact.first_name = addressOne["firstname"]
        contact.last_name = addressOne["lastname"]
        contact.email_id = addressOne['email']
        contact.gender = gender
        contact.company_name = addressOne["firma"]
        contact.function = addressOne["funktion"]
        contact.address = address
        if contact.phone != addressOne['phone']:
            phone_no = contact.append('phone_nos', {})
            phone_no.phone = addressOne["phone"]
            phone_no.is_primary_phone = 0
        contact.phone = addressOne['phone']
        contact_name = contact.name
        contact.save(ignore_permissions=True)
        frappe.db.commit()
    else:
        contact = frappe.get_doc({
            'doctype': "Contact",
            'first_name': addressOne["firstname"],
            'last_name': addressOne["lastname"],
            'gender': gender,
            'company_name': addressOne["firma"],
            'function': addressOne["funktion"],
            'address': address
        })
        contact_name = None
        try:
            contact = contact.insert(ignore_permissions=True)
            email = contact.append('email_ids', {})
            email.email_id = addressOne["email"]
            email.is_primary = 1
            phone_no = contact.append('phone_nos', {})
            phone_no.phone = addressOne["phone"]
            phone_no.is_primary_phone = 1
            link = contact.append('links', {})
            link.link_doctype = "Customer"
            link.link_name = customer
            link.link_title = customer
            contact.save(ignore_permissions=True)
            contact_name = contact.name
            frappe.db.commit()
        except Exception as e:
            frappe.log_error("Import Ticketing Error", "Insert Contact {1} {2} failed. {3}: {0}".format(e, addressOne["firstname"], addressOne["lastname"], source))
    #frappe.log_error("in the create contact")   
    return contact_name

def create_address(customer, check, info, person, source="from ticketing"):
    #frappe.log_error("on the create address")
    if check == "Yes":
        person = info["firma"]
    address = frappe.get_doc({
        'doctype': "Address",
        'address_title': person,
        'address_type': "Billing",
        'address_line1': info["adresse"],
        'pincode': info["plz"],
        'city': info["ort"],
        'country': info["land"],
        'email_id': info["email"],
        'phone': info["phone"]
    })
    try:
        address = address.insert(ignore_permissions=True)
        address_name = address.name    
        link = address.append('links', {})
        link.link_doctype = "Customer"
        link.link_name = customer
        address.save(ignore_permissions=True)
        if check != "Yes":
            person_contact = frappe.get_all("Contact", filters={'email_id': info["email"]}, fields=['name'])
            if person_contact:
                contact = frappe.get_doc("Contact", person_contact[0]['name'])
                contact.address = address_name
                contact.save(ignore_permissions=True)
        frappe.db.commit()
    except Exception as e:
        frappe.log_error("Import Ticketing Error", "Insert Address {1} {2} failed. {3}: {0}".format(e, person, info["lastname"], source))
    return address_name

@frappe.whitelist(allow_guest=True) 
def create_invoice(addressOne, addressTwo, customer, total, ticket_number, addresse, person, contact=None, source="from ticketing"):
    #frappe.log_error("on the create sinv")
    person = frappe.get_doc("Person", person)
    
    contact_name = person.full_name
    customer_link = person.customer_link
    addresse_name = frappe.get_doc("Address", addresse).name
    sinv_address = addresse_name
    
    if contact:
        contact_name = frappe.get_doc("Contact", contact[0]['name']).name
    
    #frappe.log_error(contact_name)

    if isinstance(addressTwo, str):
        addressTwo = json.loads(addressTwo)
    if len(addressTwo) > 0:
        sinv_address = create_address(customer, check="Yes", info=addressTwo, person=person.name)
    
    taxes_and_charges = frappe.get_value("Ticketing Settings", "Ticketing Settings", "sales_taxes")
    taxes_and_charges_template = frappe.get_doc("Sales Taxes and Charges Template", taxes_and_charges)
    sinv = frappe.get_doc({
        'doctype': "Sales Invoice",
        'posting_date': today(),
        'due_date': add_to_date(today(), days=20),
        'customer': customer_link,
        'company': frappe.get_value("Ticketing Settings", "Ticketing Settings", "company"),
        'customer_address': sinv_address,
        'contact_person': contact_name,
        'shipping_address_name': addresse_name,
        'ticket_number': ticket_number,
        'taxes_and_charges': taxes_and_charges,
        'taxes': taxes_and_charges_template.taxes,
        'items': [
                {
                    "item_code": frappe.get_value("Ticketing Settings", "Ticketing Settings", "ticket_item"),
                    "qty": 1,
                    "price_list_rate": total,
                    "rate": total
                }
            ]
    })
    sinv_name = None
    try: 
        sinv.insert(ignore_permissions=True)
        signature = sinv.get_signature()
        sinv.submit()
        sinv_name = sinv.name
        frappe.db.commit()
    except Exception as e:
        frappe.log_error("Import Ticketing Error", "Insert Invoice {1} {2} failed. {3}: {0}".format(e, addressOne["firstname"], addressOne["lastname"], source))      
    return sinv_name, signature

def create_customer(addressOne, person, customer, source="from ticketing"):
    if addressOne['firma']:
        customer_type = "Company"
    else:
        customer_type = "Individual"
    customer_db = frappe.get_doc({
        'doctype': "Customer",
        'customer_name': customer,
        'customer_group': frappe.get_value("Selling Settings", "Selling Settings", "customer_group"),
        'territory': frappe.get_value("Selling Settings", "Selling Settings", "territory"),
        'customer_type': customer_type
    })
    customer_name = None
    try:
        customer_db = customer_db.insert(ignore_permissions=True)
        customer_name = customer_db.name
        frappe.db.commit()
    except Exception as e:
        frappe.log_error("Import Ticketing Error", "Insert Customer {1} {2} failed. {3}: {0}".format(e, addressOne["firstname"], addressOne["lastname"], source))      
    return customer_name

@frappe.whitelist(allow_guest=True) 
def create_payment_entry(sinv_name):
    sinv = frappe.get_doc("Sales Invoice", sinv_name)
    pe = frappe.get_doc({
        'doctype': "Payment Entry",
        'posting_date': today(),
        'payment_type': "Receive",
        'party_type': "Customer",
        'party': sinv.customer,
        'paid_from': frappe.get_value("Company", frappe.defaults.get_global_default("Company"), "default_receivable_accoutn"),
        'paid_to': frappe.get_value("Ticketing Settings", "Ticketing Settings", "stripe"),
        'paid_amount': sinv.outstanding_amount,
        'received_amount': sinv.outstanding_amount,
        'references': [
            {
                'reference_doctype': "Sales Invoice",
                'reference_name': sinv.name,
                'allocated_amount': sinv.outstanding_amount
            }
        ],
        'reference_no': sinv.name,
        'reference_date': today(),
        'remarks': 'Auto Payment for {sinv}'.format(sinv=sinv.name)
    })
    pe_name = None 
    try:
        pe.insert(ignore_permissions=True)
        pe_name = pe.name
        pe.submit()
        frappe.db.commit()
    except Exception as e:
        frappe.log_error("Import Ticketing Error", "Insert Customer {1} failed. {0}".format(e, sinv_name))      
    return pe_name

@frappe.whitelist(allow_guest=True) 
def create_data_changes(addressOne, person):
    data_changes_name = None
    try:
        data_changes = frappe.get_doc({
            'doctype': "Contact Data Change",
            'person': person.name,
            'form_data': "<strong>Herr/Frau:</strong> {0}, <br> <strong>Akademische Titel:</strong>  {1},<br> <strong>Vorname:</strong>  {2},<br> <strong>Name:</strong>  {3},<br> <strong>Firma:</strong> {4},<br> <strong>Funktion:</strong>  {5},<br> <strong>Telefonnummer:</strong> {6},<br> <strong>E-mail:</strong>  {7},<br> <strong>Adresse:</strong>  {8},<br> <strong>PLZ und Ort:</strong>  {9} {10},<br> <strong>Land:</strong> {11}.".format(addressOne['herrFrau'], addressOne["akademishTitle"], addressOne["lastname"], addressOne["firstname"], addressOne["firma"], addressOne["funktion"], addressOne["phone"], addressOne["email"], addressOne["adresse"], addressOne["plz"], addressOne["ort"], addressOne["land"])
        })
        data_changes.save(ignore_permissions=True)
        data_changes_name = data_changes.name
        frappe.db.commit()
    except Exception as e:
        frappe.log_error("Import Ticketing Error", "Insert Data Changes {1} {2} failed. {0}".format(e, addressOne["firstname"], addressOne["lastname"]))      
    return data_changes_name

@frappe.whitelist(allow_guest=True) 
def check_giftcode(giftcode):
    db_giftc = frappe.get_all("Ticket Voucher", filters={'name': giftcode}, fields=['name'])
    if not db_giftc:
        giftcRate = -1
    else:
        giftc = frappe.get_doc("Ticket Voucher", db_giftc[0]['name'])
        if not giftc.used_by:
            giftcRate = giftc.discount
        else:
            giftcRate = -1
    
    return giftcRate
