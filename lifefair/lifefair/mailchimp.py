# -*- coding: utf-8 -*-
# Copyright (c) 2017-2019, libracore and contributors
# License: AGPL v3. See LICENCE

# import definitions
from __future__ import unicode_literals
import frappe
from frappe import throw, _
import json
import base64
import requests
from requests.auth import HTTPBasicAuth
from datetime import datetime
import hashlib
from frappe.utils.background_jobs import enqueue
from lifefair.lifefair.utils import add_log

# execute API function
def execute(host, api_token, payload, verify_ssl=True, method="GET"):  
    try:
        response = requests.request(
            method=method,
            url=host,
            json=payload,
            auth=HTTPBasicAuth("MailChimpConnector", api_token),
            verify=verify_ssl)

        status=response.status_code
        text=response.text
        if status not in [200, 404]:
            frappe.log_error("Unexcpected MailChimp response: http {method} {host} response {status} with message {text} on payload {payload}".format(
                status=status,text=text, payload=payload, method=method, host=host), "MailChimp Error")
        if status == 404:
            return None

        return text
    except Exception as e:
        frappe.throw("Execution of http request failed. Please check host and API token. ({0})".format(e))

@frappe.whitelist()
def get_lists():
    config = frappe.get_single("MailChimp Settings")

    if not config.host or not config.api_key:
        frappe.throw( _("No configuration found. Please make sure that there is a MailChimp configuration") )

    if config.verify_ssl != 1:
        verify_ssl = False
    else:
        verify_ssl = True
    raw = execute(config.host + "/lists?fields=lists.name,lists.id", config.api_key, 
        None, verify_ssl)
    results = json.loads(raw)

    return { 'lists': results['lists'] }

@frappe.whitelist()
def get_members(list_id, count=10000, offset=0):
    config = frappe.get_single("MailChimp Settings")

    if not config.host or not config.api_key:
        frappe.throw( _("No configuration found. Please make sure that there is a MailChimp configuration") )

    if config.verify_ssl != 1:
        verify_ssl = False
    else:
        verify_ssl = True
    url = "{host}/lists/{list_id}/members?members.email_address,members.status&count={count}&offset={offset}".format(
        host=config.host, list_id=list_id, count=count, offset=offset)
    raw = execute(host=url, api_token=config.api_key, payload=None, verify_ssl=verify_ssl)
    results = json.loads(raw)
    return { 'members': results['members'] }

@frappe.whitelist()
def enqueue_sync_contacts(list_id, type="Alle", meeting=None, owner=None):
    add_log(title= _("Starting sync"), 
       message = ( _("Starting to sync contacts to {0}")).format(list_id),
       topic = "MailChimp")

    kwargs={
          'list_id': list_id,
          'type': type,
          'meeting': meeting,
          'owner': owner
        }
    enqueue("lifefair.lifefair.mailchimp.sync_contacts",
        queue='long',
        timeout=15000,
        **kwargs)
    frappe.msgprint( _("Queued for syncing. It may take a few minutes to an hour."))
    return

def sync_contacts(list_id, type, meeting=None, owner=None):
    # get settings
    config = frappe.get_single("MailChimp Settings")

    if not config.host or not config.api_key:
        frappe.throw( _("No configuration found. Please make sure that there is a MailChimp configuration") )
    if config.verify_ssl != 1:
        verify_ssl = False
    else:
        verify_ssl = True

    # get the ERP contact list
    if type.lower() == "alle":
        sql_query = """SELECT
                `tabPerson`.`name` AS `name`,
                `tabPerson`.`letter_salutation` AS `letter_salutation`,
                `tabPerson`.`salutation` AS `salutation`,
                `tabPerson`.`email` AS `email`,
                `tabPerson`.`do_not_contact` AS `do_not_contact`,
                `tabPerson`.`first_name` AS `first_name`,
                `tabPerson`.`last_name` AS `last_name`,
                `tabPerson`.`primary_organisation` AS `organisation`,
                'Person' AS `doctype`
            FROM
                `tabPerson`
            WHERE
                `tabPerson`.`email` LIKE '%@%.%'
            UNION SELECT
                `tabPublic Mail`.`name` AS `name`,
                `tabPublic Mail`.`letter_salutation` AS `letter_salutation`,
                '' AS `salutation`,
                `tabPublic Mail`.`email` AS `email`,
                `tabPublic Mail`.`do_not_contact` AS `do_not_contact`,
                '' AS `first_name`,
                '' AS `last_name`,
                `tabPublic Mail`.`organisation` AS `organisation`,
                'Public Mail' AS `doctype`
            FROM
                `tabPublic Mail`
            WHERE
                `tabPublic Mail`.`email` LIKE '%@%.%'"""
    else:
            sql_query = """SELECT
                `tabPerson`.`name` AS `name`,
                `tabPerson`.`letter_salutation` AS `letter_salutation`,
                `tabPerson`.`salutation` AS `salutation`,
                `tabPerson`.`email` AS `email`,
                `tabPerson`.`do_not_contact` AS `do_not_contact`,
                `tabPerson`.`first_name` AS `first_name`,
                `tabPerson`.`last_name` AS `last_name`,
                `tabPerson`.`primary_organisation` AS `organisation`,
                'Person' AS `doctype`
            FROM
                `tabPerson`
            WHERE
                `tabPerson`.`email` LIKE '%@%.%'
                AND `tabPerson`.`is_vip` = 0
                AND !( `tabPerson`.`name` IN (SELECT
                    `tabRegistration`.`person`
                    FROM `tabRegistration`
                    WHERE `tabRegistration`.`meeting` = '{meeting}'))
            UNION SELECT
                `tabPublic Mail`.`name` AS `name`,
                `tabPublic Mail`.`letter_salutation` AS `letter_salutation`,
                '' AS `salutation`,
                `tabPublic Mail`.`email` AS `email`,
                `tabPublic Mail`.`do_not_contact` AS `do_not_contact`,
                '' AS `first_name`,
                '' AS `last_name`,
                `tabPublic Mail`.`organisation` AS `organisation`,
                'Public Mail' AS `doctype`
            FROM
                `tabPublic Mail`
            WHERE
                `tabPublic Mail`.`email` LIKE '%@%.%'""".format(meeting=meeting)
    erp_members = frappe.db.sql(sql_query, as_dict=True)

    # get all members from the MailChimp list
    repeat = True
    offset = 0
    while repeat:
        mc_members = get_members(list_id, count=1000, offset=offset)['members']
        if len(mc_members) > 0:
            for mc_member in mc_members:
                # print(mc_member['email_address'])
                check_mc_member_in_erp(mc_member, erp_members)
            offset += 1000
        else:
            repeat = False

    # now get all erp members to MailChmp
    contact_written = []
    for erp_member in erp_members:
        # compute mailchimp id (md5 hash of lower-case email)
        try:
            mc_id = hashlib.md5(erp_member['email'].lower()).hexdigest()
        except:
            frappe.log_error("Invalid email address (unable to compute hash): {0}".format(erp_member['email']), "Invalid email address")
        # load subscription status from mailchimp if it is set as master
        # default is unsubscribed
        contact_status="unsubscribed"
        if erp_member['do_not_contact'] == 1:
            contact_status = "unsubscribed"
        else:
            contact_status = "subscribed"

        url = "{0}/lists/{1}/members/{2}".format(config.host, list_id, mc_id)  
        method="PUT"

        contact_object = {
            "email_address": erp_member['email'],
            "status": contact_status,
            "merge_fields": {
                "FNAME": erp_member['first_name'] or "", 
                "LNAME": erp_member['last_name'] or "",
                "TITEL": erp_member['salutation'] or "",
                "ANREDE": erp_member['letter_salutation'] or ""
            }
        }
        
        raw = execute(host=url, api_token=config.api_key, 
            payload=contact_object, verify_ssl=verify_ssl, method=method)
        print("Updated to MailChimp {0}: {1}".format(erp_member['email'], raw))
        contact_written.append(erp_member['email'])
    
    url = "{0}/lists/{1}/members?fields=members.id,members.email_address,members.status".format(
        config.host, list_id)  
    raw = execute(url, config.api_key, None, verify_ssl)
    results = json.loads(raw)
       
    if owner:
        frappe.publish_realtime(
            event='msgprint',
            message= _("Synchronisation to MailChimp complete"),
            user=owner
        )
    add_log(title= _("Sync complete"),
       message = ( _("Sync to {0} completed, written {1} contacts.")).format(list_id, len(contact_written)),
       topic = "MailChimp")
    return { 'members': results['members'] }

def check_mc_member_in_erp(mc_member, erp_members):
    found = False
    person_matches = frappe.get_all("Person", filters={'email': mc_member['email_address']}, fields=['name'])
    if person_matches:
        # update person
        update_erp_person(person_matches[0]['name'], mc_member)
    else:
        mailer_matches = frappe.get_all("Public Mail", filters={'email': mc_member['email_address']}, fields=['name'])
        if mailer_matches:
            # update mailer
            update_erp_mailer(mailer_matches[0]['name'], mc_member)
        else:
            # create person
            create_erp_member(mc_member)
    return

def update_erp_person(name, mc_member):
    # update person
    print("Updating person {0}".format(name))
    # if MailChimp unsubscribed --> unsubscribe contact
    if mc_member['status'] == "unsubscribed":
        person = frappe.get_doc("Person", name)
        person.do_not_contact = 1
        try:
            person.save()
            frappe.db.commit()
        except Exception as err:
            frappe.log_error( "Unable to save person {person} ({err})".format(person=name, err=err), "MailChimp update_erp_person")
    return

def update_erp_mailer(name, mc_member):
    # update mailer
    print("Updating mailer {0}".format(name))
    mailer = frappe.get_doc("Public Mail", name)
    if mc_member['status'] == "subscribed":
        mailer.do_not_contact = 0
    else:
        mailer.do_not_contact = 1
    mailer.save()
    frappe.db.commit()
    return

def create_erp_member(mc_member):
    print("Creating person {0}".format(mc_member['email_address']))
    do_not_contact = 1
    if mc_member['status'] == "subscribed":
        do_not_contact = 0
    # compute first characters
    #try:
    first_chars = mc_member['merge_fields']['LNAME'][0:4].upper()
    #except:
    #    first_chars = ""
    # try to fetch custom fields
    try:
        salutation = mc_member['merge_fields']['TITEL'] or ''
        title = mc_member['merge_fields']['ANREDE'] or ''
        
    except:
        salutation = None
        title = None
    full_name = "{0} {1}".format(mc_member['merge_fields']['FNAME'], mc_member['merge_fields']['LNAME'])
    person = frappe.get_doc({
        'doctype': "Person",
        'email': mc_member['email_address'],
        'first_name': mc_member['merge_fields']['FNAME'] or '',
        'last_name': mc_member['merge_fields']['LNAME'] or '',
        'first_characters': first_chars,
        'salutation': salutation,
        'title': title,
        'do_not_contact': do_not_contact,
        'full_name': full_name,
        'long_name': full_name
    })
    person.insert()
    frappe.db.commit()
    return
    
def get_status_from_mailchimp(config, list_id, contact_name, mc_id):
    url = "{0}/lists/{1}/members/{2}".format(
            config.host, list_id, mc_id)  
            
@frappe.whitelist()
def enqueue_get_campaigns(list_id):
    add_log(title= _("Starting sync"), 
       message =( _("Starting to sync campaigns from {0}")).format(list_id),
       topic ="MailChimp")
       
    kwargs={
          'list_id': list_id
        }
    enqueue("lifefair.lifefair.mailchimp.get_campaigns",
        queue='long',
        timeout=15000,
        **kwargs)
    frappe.msgprint( _("Queued for syncing. It may take a few minutes to an hour."))
    return
    
def get_campaigns(list_id):
    config = frappe.get_single("MailChimp Settings")
    
    if not config.host or not config.api_key:
        frappe.throw( _("No configuration found. Please make sure that there is a MailChimpConnector configuration") )
    
    if config.verify_ssl != 1:
        verify_ssl = False
    else:
        verify_ssl = True
               
    url = "{0}/campaigns?fields=campaigns.id,campaigns.status,campaigns.settings.title".format(
        config.host, list_id)  
    raw = execute(url, config.api_key, None, verify_ssl, method="GET")
    results = json.loads(raw)
    for campaign in results['campaigns']:
        try:
            erp_campaign = frappe.get_doc("Campaign", campaign['settings']['title'])
            # update if applicable
            
        except:
            # erp does not know this campaignyet, create
            new_campaign = frappe.get_doc({'doctype': 'Campaign'})
            new_campaign.campaign_name = campaign['settings']['title']
            new_campaign.insert()
         
    add_log(title= _("Sync complete"), 
       message= ( _("Sync of campaigns from {0} completed.")).format(list_id),
       topic="MailChimp")
    return { 'campaigns': results['campaigns'] }
