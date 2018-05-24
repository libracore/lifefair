from frappe import _

def get_data():
   return {
      'fieldname': 'type',
      'transactions': [
         {
            'label': _('Linked Organisations'),
            'items': ['Organisation']
         }
      ]
   }
