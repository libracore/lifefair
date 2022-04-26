# -*- coding: utf-8 -*-
# Copyright (c) 2017-2019, libracore and contributors
# License: AGPL v3. See LICENCE

# import definitions
from __future__ import unicode_literals
import frappe
from frappe import throw, _
import json

@frappe.whitelist(allow_guest=True) 
def get_blocks(meeting):
	sql_query = """
		SELECT
			`official_title`,
			`location`,
			`short_name`,
			`neues_datum`,
			`time`,
			GROUP_CONCAT(`tabBlock Interest`.`interest`) AS `interests`,
			`website_link`,
			`tabBlock`.`name`,
			`meeting`
		FROM `tabBlock`
		LEFT JOIN `tabBlock Interest` ON `tabBlock Interest`.`parent` = `tabBlock`.`name`
		WHERE `meeting` = '{meeting}'
		GROUP BY `tabBlock`.`name`
		ORDER BY `tabBlock`.`neues_datum` ASC;
	""".format(meeting=meeting)
	data = frappe.db.sql(sql_query, as_dict = True)
	return data

@frappe.whitelist(allow_guest=True) 
def create_ticket(firstname, lastname, adresse, email, phone, firma, funktion, plzOrt, warenkorb):
	new_regs = []
	# ticket is not in the database, create
	# check email address to find person
	db_person = frappe.get_all("Person", filters={'email': email}, fields=['name'])
	# iterate over email2 and email3 in case of no hit
	if not db_person:
		db_person = frappe.get_all("Person", filters={'email2': email}, fields=['name'])
		if not db_person:
			db_person = frappe.get_all("Person", filters={'email3': email}, fields=['name'])

	if db_person:
		person_name = db_person[0]['name']
		# get person, check website_description and update if empty
		person = frappe.get_doc("Person", db_person[0]['name'])
		if not person.website_description:
			person.website_description = "{0}, {1}".format(funktion, firma)
		# update phone number if missing
		if not person.company_phone:
			person.company_phone = phone
		person.save()
	else:
		# person not found, create new person
		new_person = create_person(company=firma,first_name=firstname, last_name=lastname, email=email, phone=phone, function=funktion, street=adresse, pincode=plzOrt)
		if new_person:
			person_name = new_person.name
		else:
			frappe.log_error("Import Ticketing Error", "Failed to insert person {0} {1} (Ticket: {2})".format(firstname, lastname))
	try:
		basestring
	except NameError:
		basestring = str

	if isinstance(warenkorb, basestring):
		warenkorb = json.loads(warenkorb)
	for entry in warenkorb:
		try:
			registration = frappe.get_doc({
				'doctype': "Registration",
				'person': person_name,
				'meeting': entry['meeting'],
				'block': entry['name'],
				'date': entry['neues_datum'],
				'phone': phone
			})
			registration = registration.insert()
			reg_name = registration.name
			frappe.db.commit()
			new_regs.append(reg_name)
		except Exception as e:
			frappe.log_error("{0}\n\n{1}".format(e, entry), "val")   
	return new_regs

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
		# ~ if not company_matches and company and company != "":
			# ~ company = frappe.get_doc({
				# ~ 'doctype': "Organisation",
				# ~ 'official_name': company
			# ~ })
			# ~ try:
				# ~ company.insert()
			# ~ except Exception as e:
				# ~ frappe.log_error("Insert company {0} failed {1}".format(company, e))
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

@frappe.whitelist(allow_guest=True) 
def get_person():
	sql_query = """
		SELECT 
			`tabPerson`.`email` AS `email`,
			`tabPerson`.`name` AS `name`,
			`tabPerson`.`full_name` AS `full_name`
		FROM `tabPerson`
		ORDER BY `tabPerson`.`modified` DESC;
	"""
	data = frappe.db.sql(sql_query, as_dict = True)
	return data
