from frappe import _

def get_data():
   return {
      'fieldname': 'organisation',
      'transactions': [
         {
            'label': _('Addresses'),
            'items': ['Organisation Address']
         }
      ]
   }
