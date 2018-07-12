# -*- coding: utf-8 -*-
# Copyright (c) 2018, libracore and contributors
# For license information, please see license.txt

from frappe import _

def get_data():
   return {
      'fieldname': 'person',
      'transactions': [
         {
            'label': _('Addresses'),
            'items': ['Organisation Address']
         },
         {
            'label': _('Participation'),
            'items': ['Registration', 'Partnership Ticket']
         }
      ]
   }
