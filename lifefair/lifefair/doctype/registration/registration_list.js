frappe.listview_settings['Registration'] = {
    onload: function(listview) {
        listview.page.add_menu_item( __("Import Xing Registrations"), function() {
            var dlg = new frappe.ui.Dialog({
                'title': __("Import Xing Registrations"),
                'fields': [
                    {'fieldname': 'ht', 'fieldtype': 'HTML'},
                    {'fieldname': 'meeting', 'label': 'Meeting', 'fieldtype': 'Link', 'options': 'Meeting'}
                ],
                primary_action: function() {
                    dlg.hide();
                    var data = dlg.get_values();
                    var file = document.getElementById("input_file").files[0];
                    console.log(data);
                    import_xing(file, data.meeting);
                },
                primary_action_label: __("Import")
            });
            dlg.fields_dict.ht.$wrapper.html('<input type="file" id="input_file" />');
            dlg.show();
        });
    }
}

function import_xing(filename, meeting) {
    console.log(filename);
    console.log(meeting);
}
