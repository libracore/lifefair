from frappe import _

def get_data():
   return {
      'fieldname': 'person_group',
      'transactions': [
         {
            'label': _('Linked People'),
            'items': ['Person']
         }
      ]
   }
