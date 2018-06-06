## Lifefair

Lifefair ERPNext application

### License
AGPL

### Features
This application allows to manage complex relations between people and organisations and the administration of events. 

It includes
* directly sending a mail with the local email client (e.g. Thunderbird or Outlook) from a contact
* downloading contacts as vCards

### Installation
Lifefair is an application for ERPNext (https://erpnext.org). Make sure to have a running ERPNext server.

On an ERPNext server, in the bench folder, run

    $ bench get-app https://github.com/libracore/lifefair.git
    $ bench install-app lifefair

### Troubleshooting
#### vCards in Outlook
By default, most Outlook configurations will not properly import special characters. To enable UTF-8 support, go to File > Options > Advanced > International Options and select UTF-8 for outgoing vCards (I know this is strange, but it works ;-) )
