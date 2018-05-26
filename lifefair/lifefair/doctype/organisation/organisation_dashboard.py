from frappe import _

def get_data():
   return {
      'fieldname': 'organisation',
      'transactions': [
         {
            'label': _('Address'),
            'items': ['Organisation Address']
         }
      ]
   }
