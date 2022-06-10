# -*- coding: utf-8 -*-
# Copyright (c) 2017-2019, libracore and contributors
# License: AGPL v3. See LICENCE

# import definitions
from __future__ import unicode_literals
import frappe
from frappe import throw, _
import json
from frappe.utils.data import today
from random import randint

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
def create_ticket(stripe, addressOne, addressTwo, warenkorb):
	new_regs = []
	if isinstance(addressOne, str):
		addressOne = json.loads(addressOne)
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
		if not person.website_description:
			person.website_description = "{0}, {1}".format(addressOne['funktion'], addressOne['firma'])
		# update phone number if missing
		if not person.company_phone:
			person.company_phone = addressOne['phone']
		person.save()
	else:
		# person not found, create new person
		person_name = create_person(addressOne)
		# ~ if new_person:
			# ~ person_name = new_person['name']
		# ~ else:
			# ~ frappe.log_error("Import Ticketing Error", "Failed to insert person {0} {1} (Ticket: {2})".format(addressOne['firstname'], addressOne['lastname']))
	# ~ try:
		# ~ basestring
	# ~ except NameError:
		# ~ basestring = str
		
	sinv_name = create_invoice(addressOne, addressTwo, warenkorb, person=person_name)
	ticket_number = get_ticket_code()
	
	if addressOne['giftcode'] != "":
		db_giftc = frappe.get_all("Ticket Voucher", filters={'name': addressOne['giftcode']}, fields=['name'])
		giftc = frappe.get_doc("Ticket Voucher", db_giftc[0]['name'])
		giftc.used_by = person_name
		giftc.save()
	else:
		frappe.log_error("no giftc")

	frappe.log_error("ticket and sinv done")
	if stripe == "Yes":
		create_payment_entry(sinv_name)
	
	if isinstance(warenkorb, str):
		warenkorb = json.loads(warenkorb)
	for entry in warenkorb:
		try:
			registration = frappe.get_doc({
				'doctype': "Registration",
				'person': person_name,
				'meeting': entry['meeting'],
				'block': entry['name'],
				'date': entry['neues_datum'],
				'phone': addressOne['phone'],
				'ticket_number': ticket_number
			})
			registration = registration.insert()
			#reg_name = registration.name
			frappe.db.commit()
			new_regs.append(registration)
		except Exception as e:
			frappe.log_error("{0}\n\n{1}".format(e, entry), "val")   
	return new_regs

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
    #frappe.log_error(ticket_code)
    return ticket_code

def create_person(addressOne, source="from xing"):
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
		# do not insert companies, too many typo issues
		# ~ if not company_matches and company and company != "":
			# ~ company = frappe.get_doc({
				# ~ 'doctype': "Organisation",
				# ~ 'official_name': company
			# ~ })
			# ~ try:
				# ~ company.insert()
			# ~ except Exception as e:
				# ~ frappe.log_error("Insert company {0} failed {1}".format(company, e))
		full_name = "{0} {1}".format(addressOne['firstname'], addressOne['lastname'])
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
		try:
			person = person.insert()
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
					person.save()
			person_name = person.name
			frappe.db.commit()            
		except Exception as e:
			frappe.log_error("Import Xing Error", "Insert Person {1} {2} failed. {3}: {0}".format(e, addressOne['firstname'], addressOne['lastname'], source))      
	#frappe.log_error(person_name)
	return person_name

@frappe.whitelist(allow_guest=True) 
def create_invoice(addressOne, addressTwo, warenkorb, person, source="from xing"):
	frappe.log_error("on the create sinv")
	sinv_address = addressOne
	if isinstance(addressTwo, str):
		addressTwo = json.loads(addressTwo)
	if len(addressTwo) > 0:
		sinv_address = addressTwo
	
	customer = frappe.get_doc("Person", person).customer_link
	
	if not customer: 
		customer = create_customer(addressOne, person)
	# ~ else:
		# ~ frappe.log_error(person)
	sinv = frappe.get_doc({
		'doctype': "Sales Invoice",
		'posting_date': today(),
		'posting_time': "00:00:00",
		'customer': customer,
		'company': "Lifefair",
		"items": [
				{
					"item_code": "001",
					"qty": 1,
					"rate": 50
				}
			]
	})
	try: 
		sinv.insert()
		signature = sinv.get_signature()
		sinv.submit()
		sinv_name = sinv.name
		frappe.db.commit()
	except Exception as e:
		frappe.log_error("Import Xing Error", "Insert Invoice {1} {2} failed. {3}: {0}".format(e, addressOne["firstname"], addressOne["lastname"], source))      
	#frappe.log_error(sinv_name)
	return sinv_name

def create_customer(addressOne, person, source="from xing"):
	full_name = "{0} {1}".format(addressOne["firstname"], addressOne["lastname"])
	firma = addressOne["firma"];
	if firma == "":
		customer_type = "Individual"
	else:
		customer_type = "Company"
	customer = frappe.get_doc({
		'doctype': "Customer",
		'customer_name': full_name,
		'customer_group': "Alle Kundengruppen",
		'customer_type': customer_type
	})
	try:
		customer = customer.insert()
		customer_name = customer.name
		frappe.db.commit()
	except Exception as e:
		frappe.log_error("Import Xing Error", "Insert Customer {1} {2} failed. {3}: {0}".format(e, addressOne["firstname"], addressOne["lastname"], source))      
	#frappe.log_error("in the else customer_name {1}".format(customer_name))
	#Update the customer field in person doctype
	person = frappe.get_doc("Person", person)
	person.customer_link = customer_name
	person.save()
	#frappe.log_error(customer_name)
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
		'paid_from': 'Schuldner - L',
		'paid_to': 'Stripe-Stripe - L',
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
	pe.insert()
	pe.submit()
	frappe.db.commit()
	#frappe.log_error(pe.name)
	return pe
	# ~ except Exception as err:
        # ~ return err

# ~ @frappe.whitelist(allow_guest=True) 
# ~ def get_person():
	# ~ sql_query = """
		# ~ SELECT 
			# ~ `tabPerson`.`email` AS `email`,
			# ~ `tabPerson`.`name` AS `name`,
			# ~ `tabPerson`.`full_name` AS `full_name`
		# ~ FROM `tabPerson`
		# ~ ORDER BY `tabPerson`.`modified` DESC;
	# ~ """
	# ~ data = frappe.db.sql(sql_query, as_dict = True)
	# ~ return data
	
@frappe.whitelist(allow_guest=True) 
def get_invoice(addressOne):
	if isinstance(addressOne, str):
		addressOne = json.loads(addressOne)
	full_name = "{0} {1}".format(addressOne["firstname"], addressOne["lastname"])
	db_sinv = frappe.get_all("Sales Invoice", filters={'title': full_name}, fields=['name'])
	if db_sinv:
		sinv_name = frappe.get_doc("Sales Invoice", db_sinv[0]['name'])
	else:
		frappe.log_error("in the get sinv else")
		frappe.log_error(db_sinv)
	return sinv_name.name

@frappe.whitelist(allow_guest=True) 
def check_giftcode(firstname, lastname, giftcode):
	db_giftc = frappe.get_all("Ticket Voucher", filters={'name': giftcode}, fields=['name'])
	if not db_giftc:
		frappe.log_error("in the gift if not, giftc doesnt exist")
		giftcRate = -1
	else:
		frappe.log_error("in the gift else, giftc  exist")
		giftc = frappe.get_doc("Ticket Voucher", db_giftc[0]['name'])
		if not giftc.used_by:
			frappe.log_error("is not beign use")
			giftcRate = giftc.discount
		else:
			frappe.log_error("is being use")
			giftcRate = -1
	
	return giftcRate
