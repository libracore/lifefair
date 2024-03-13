import frappe
from frappe import _
import json


# deprecated, will be dropped in future versions; refer to shop module
@frappe.whitelist(allow_guest=True)
def login(usr, pwd):
    frappe.local.flags.redirect_location = "/partnershipticket"
    frappe.log_error(usr, "usr")
    frappe.db_commit()
    from frappe.auth import LoginManager
    frappe.local.login_manager = LoginManager()
    frappe.local.login_manager.authenticate(usr, pwd)
    frappe.local.login_manager.login()
    frappe.local.response["type"] = "redirect"
    frappe.local.response["location"] = "/partnershipticket"
    frappe.log_error(usr)
    return frappe.local.session

@frappe.whitelist(allow_guest=True)
def get_partnerticket(user):
    if user:
        sql_query = """SELECT `owner`,
            `person_name`,
            `title`,
            `meeting`,
            `ticket_count`
            FROM `tabPartnershipticket` WHERE `responsible` = %s"""
        partner_ticket = frappe.db.sql(sql_query, user, as_dict=True)
        if partner_ticket:
            return partner_ticket
    return None

@frappe.whitelist(allow_guest=True)
def save_changes(user, first_name, last_name, email, role, organization, phone, if_blocks):
    return None