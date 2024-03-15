import frappe
from frappe import _
import json

@frappe.whitelist(allow_guest=True)
def get_partnerticket(user):
    if user:
        sql_query_1 = """SELECT `owner`,
            `person_name`,
            `title`,
            `meeting`,
            `ticket_count`
            FROM `tabPartnershipticket` 
            WHERE `responsible` = %s"""
        partner_ticket = frappe.db.sql(sql_query_1, user, as_dict=True)

        sql_query_2 = """SELECT `first_name`,
            `last_name`,
            `email`,
            `function`,
            `organisation`,
            `phone`,
            `if_block`
            FROM `tabPartnershipticket` 
            LEFT JOIN `tabPartnership Ticket Item` ON `tabPartnershipticket`.`name` = `tabPartnership Ticket Item`.`parent`
            WHERE `responsible` = %s
            AND `first_name` != 'null'"""
        guests = frappe.db.sql(sql_query_2, user, as_dict=True)

        if partner_ticket and guests:
            return partner_ticket, guests
    return None

@frappe.whitelist(allow_guest=True)
def get_registrations(user):
    if user:
        partbershipticket_name = frappe.get_all('Partnershipticket', filters={'owner': user})
        if partbershipticket_name:
            partbershipticket = frappe.get_doc('Partnershipticket', partbershipticket_name[0]['name'])
            return partbershipticket
    return None


@frappe.whitelist(allow_guest=True)
def save_changes(index, user, first_name, last_name, email, role=None, organization=None, phone=None, if_blocks=None):
    if user:
        sql_query = """UPDATE `tabPartnership Ticket Item`
            SET `first_name` = %s,
            `last_name` = %s,
            `email` = %s,
            `function` = %s,
            `organisation` = %s,
            `phone` = %s,
            `if_block` = %s
            WHERE `parent` = (SELECT `name` FROM `tabPartnershipticket` WHERE `responsible` = %s)
            AND `idx` = %s"""
        frappe.db.sql(sql_query, (first_name, last_name, email, role, organization, phone, if_blocks, user, index))

        return 'Success'
    return None