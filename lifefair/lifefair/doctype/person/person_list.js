frappe.listview_settings['Person'] = {
    onload: function(listview) {
        listview.page.add_menu_item( __("Sync MailChimp"), function() {
            sync_mailchimp();
        });
    }
}

function sync_mailchimp() {
    // get available lists
    load_mailchimp_lists();
}

function load_mailchimp_lists() {
    frappe.call({
        method: 'lifefair.lifefair.mailchimp.get_lists',
        callback: function(r) {
            if (r.message) {
                // selection dialog
                select_dialog(r.message.lists);
            }
        }
    }); 
}

function select_dialog(lists) {
    var list_options = "";
    for (var i = 0; i < lists.length; i++) {
        list_options += lists[i].name + "\n";
    }
    if (list_options.length > 2) {
        list_options = list_options.substring(0, list_options.length - 1)
    }
    var default_list = ""
    if (lists.length > 0) {
        default_list = lists[0].name;
    }
    var dlg = new frappe.ui.Dialog({
       'fields': [
           {
               'fieldname': 'list', 
               'fieldtype': 'Select', 
               'options': list_options, 
               'reqd': 1, 
               'label': __("List"),
               'default': default_list
           },
           {
               'fieldname': 'method',
               'fieldtype': 'Select', 
               'options': "Alle\n2. Welle", 
               'reqd': 1, 
               'label': __("Method"),
               'default': "Alle"
           },
           {
               'fieldname': 'meeting',
               'fieldtype': 'Link', 
               'options': "Meeting", 
               'label': __("Meeting"),
               'depends_on': 'eval:doc.method == \'2. Welle\''
           }
       ],
       'primary_action': function() {
           dlg.hide();
           var values = dlg.get_values();
           if ((values.method == "2. Welle") && (!values.meeting)) {
               frappe.msgprint( __("Please select a meeting for a second wave." ),  __("Warning") );
           } else {
           var target_list = "";
               for (var i = 0; i < lists.length; i++) {
                    if (lists[i].name == values.list) {
                        target_list = lists[i].id;
                    }
               }
               frappe.show_alert( __("Starting sync...") );
               run_sync(target_list, values.method, values.meeting);
           }
       },
       'primary_action_label': __('Sync'),
       'title': __("Sync Person with MailChimp")
    });
    dlg.show();
}

function run_sync(list, method, meeting) {
    frappe.call({
        "method": "lifefair.lifefair.mailchimp.enqueue_sync_contacts",
        "args": {
            'list': list,
            'method': method,
            'meeting': meeting
        },
        "callback": function(response) {
            frappe.show_alert( __("MailChimp synchronisation completed.") );
        }
    });
}

