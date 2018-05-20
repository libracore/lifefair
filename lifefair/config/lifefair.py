from __future__ import unicode_literals
from frappe import _

def get_data():
    return[
        {
            "label": _("Contacts"),
            "icon": "octicon octicon-light-bulb",
            "items": [
                   {
                       "type": "doctype",
                       "name": "person",
                       "label": _("Person"),
                       "color": "#f88c00",
                       "icon": "octicon octicon-person",
                       "description": _("Person")
                   },
                   {
                       "type": "doctype",
                       "name": "organisation",
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
                       "name": "block",
                       "label": _("Block"),
                       "color": "#f88c00",
                       "icon": "octicon octicon-clippy",
                       "description": _("Block")
                   }
            ]
        }
    ]
    
