# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"module_name": "Lifefair",
			"color": "#f88c00",
			#"icon": "fa fa-lightbulb",
			"icon": "octicon octicon-light-bulb",
			"type": "module",
			"label": _("Lifefair")
		},
		{
			"module_name": "Person",
			"_doctype": "Person",
			"color": "#f88c00",
			"icon": "octicon octicon-person",
			"type": "link",
			"link": "List/Person"
		}
	]
