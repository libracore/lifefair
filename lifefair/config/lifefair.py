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
                   }
            ]
        },
        {
            "label": _("Marketing"),
            "icon": "octicon octicon-megaphone",
            "items": [
                   {
                       "type": "doctype",
                       "name": "Follow Up",
                       "label": _("Follow Up"),
                       "description": _("Follow Up")
                   }
            ]
        },
        {
            "label": _("Settings"),
            "icon": "octicon octicon-tools",
            "items": [
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
                   }
            ]
        }
    ]
