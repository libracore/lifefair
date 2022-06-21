from __future__ import unicode_literals
from frappe import _

def get_data():
    return[
        {
            "label": _("Contacts"),
            "icon": "octicon octicon-organization",
            "items": [
                   {
                       "type": "doctype",
                       "name": "Person",
                       "label": _("Person"),
                       "color": "#f88c00",
                       "icon": "octicon octicon-person",
                       "description": _("Person")
                   },
                   {
                       "type": "doctype",
                       "name": "Organisation",
                       "label": _("Organisation"),
                       "color": "#f88c00",
                       "icon": "octicon octicon-organization",
                       "description": _("Organisation")
                   }
            ]
        },
        {
            "label": _("Events"),
            "icon": "octicon octicon-broadcast",
            "items": [
                   {
                       "type": "doctype",
                       "name": "Meeting",
                       "label": _("Meeting"),
                       "color": "#f88c00",
                       "icon": "octicon octicon-broadcast",
                       "description": _("Meeting")
                   },
                   {
                       "type": "doctype",
                       "name": "Block",
                       "label": _("Block"),
                       "color": "#f88c00",
                       "icon": "octicon octicon-clippy",
                       "description": _("Block")
                   },
                   {
                       "type": "doctype",
                       "name": "Registration",
                       "label": _("Registration"),
                       "color": "#f88c00",
                       "icon": "octicon octicon-clippy",
                       "description": _("Registration")
                   },
                   {
                       "type": "doctype",
                       "name": "Partnershipticket",
                       "label": _("Partnershipticket"),
                       "color": "#f88c00",
                       "icon": "octicon octicon-clippy",
                       "description": _("Partnershipticket")                      
                   },
                   {
                       "type": "doctype",
                       "name": "Exhibitor",
                       "label": _("Exhibitor"),
                       "color": "#f88c00",
                       "icon": "octicon octicon-clippy",
                       "description": _("Exhibitor")
                   },
                   {
                       "type": "doctype",
                       "name": "Block Price",
                       "label": _("Block Price"),
                       "description": _("Block Price")
                   }
            ]
        },
        {
            "label": _("Reports"),
            "icon": "octicon octicon-book",
            "items": [
                   {
                       "type": "report",
                       "doctype": "Meeting",
                       "name": "Actors per Meeting",
                       "label": _("Actors per Meeting"),
                       "description": _("Actors per Meeting"),
                        "is_query_report": True
                   },
                   {
                       "type": "report",
                       "doctype": "Person",
                       "name": "Kontakte nach Interessen",
                       "label": _("Kontakte nach Interessen"),
                       "description": _("Kontakte nach Interessen"),
                        "is_query_report": True
                   },
                   {
                       "type": "report",
                       "doctype": "Registration",
                       "name": "Anmeldeliste Anlass",
                       "label": _("Anmeldeliste Anlass"),
                       "description": _("Anmeldeliste Anlass"),
                        "is_query_report": True
                   }
            ]
        },
        {
            "label": _("Marketing"),
            "icon": "octicon octicon-megaphone",
            "items": [
                   {
                       "type": "doctype",
                       "name": "Marketing and Activity",
                       "label": _("Marketing and Activity"),
                       "description": _("Marketing and Activity")
                   },
                   {
                       "type": "doctype",
                       "name": "Follow Up",
                       "label": _("Follow Up"),
                       "description": _("Follow Up")
                   },
                   {
                       "type": "report",
                       "doctype": "Person",
                       "name": "Testimonials",
                       "label": _("Testimonials"),
                       "description": _("Testimonials"),
                        "is_query_report": True
                   },
                   {
                       "type": "doctype",
                       "name": "Contact Data Change",
                       "label": _("Contact Data Change"),
                       "description": _("Contact Data Change")
                   },
                   {
                       "type": "doctype",
                       "name": "Ticket Voucher",
                       "label": _("Ticket Voucher"),
                       "description": _("Ticket Voucher")
                   },
            ]
        },
        {
            "label": _("Settings"),
            "icon": "octicon octicon-tools",
            "items": [
                   {
                       "type": "doctype",
                       "name": "Hierarchiestufe",
                       "label": _("Hierarchiestufe"),
                       "description": _("Hierarchiestufe")
                   },
                   {
                       "type": "doctype",
                       "name": "Stakeholder",
                       "label": _("Stakeholder"),
                       "description": _("Stakeholder")
                   },
                   {
                       "type": "doctype",
                       "name": "Branche",
                       "label": _("Branche"),
                       "description": _("Branche")
                   },
                   {
                       "type": "doctype",
                       "name": "Interesse",
                       "label": _("Interesse"),
                       "description": _("Interesse")
                   },
                   {
                       "type": "doctype",
                       "name": "Engagement",
                       "label": _("Engagement"),
                       "description": _("Engagement")
                   },
                   {
                       "type": "doctype",
                       "name": "Person Group",
                       "label": _("Person Group"),
                       "description": _("Person Group")
                   },
                   {
                       "type": "doctype",
                       "name": "Organisation Type",
                       "label": _("Organisation Type"),
                       "description": _("Organisation Type")
                   },
                   {
                       "type": "doctype",
                       "name": "MailChimp Settings",
                       "label": _("MailChimp Settings"),
                       "description": _("MailChimp Settings")
                   },
                   {
                       "type": "doctype",
                       "name": "Web Format",
                       "label": _("Web Format"),
                       "description": _("Web Format")
                   },
                   {
                       "type": "doctype",
                       "name": "SDG Goal",
                       "label": _("SDG Goal"),
                       "description": _("SDG Goal")
                   },
                   {
                       "type": "doctype",
                       "name": "Ticketing Settings",
                       "label": _("Ticketing Settings"),
                       "description": _("Ticketing Settings")
                   },
                   {
                       "type": "doctype",
                       "name": "Visitor Type",
                       "label": _("Visitor Type"),
                       "description": _("Visitor Type")
                   },
                   
            ]
        }
    ]
