frappe.listview_settings['Registration'] = {
    onload: function(listview) {
        listview.page.add_menu_item( __("Import Xing Registrations"), function() {
            // clean file browser cache
            if (document.getElementById("input_file")) {
                document.getElementById("input_file").outerHTML = "";
            }
            var dlg = new frappe.ui.Dialog({
                'title': __("Import Xing Registrations"),
                'fields': [
                    {'fieldname': 'ht', 'fieldtype': 'HTML'},
                    {'fieldname': 'meeting', 'label': 'Meeting', 'fieldtype': 'Link', 'options': 'Meeting', 'reqd': 1}
                ],
                primary_action: function() {
                    dlg.hide();
                    var data = dlg.get_values();
                    var file = document.getElementById("input_file").files[0];
                    import_xing(file, data.meeting);
                },
                primary_action_label: __("Import")
            });
            dlg.fields_dict.ht.$wrapper.html('<input type="file" id="input_file" />');
            dlg.show();
        });
    }
}

function import_xing(file, meeting) {
    
    console.log(file);
    console.log(meeting);
    
    // read the file
    if (file) {
        // create new reader instance 
        var reader = new FileReader();
        reader.onload = function(e) {
            console.log("Reading...");
            // read the file 
            var data = e.target.result;
            // load the workbook
            var workbook = XLSX.read(data, {type: 'binary'});
            var first_sheet_name = workbook.SheetNames[0];
            // convert content to csv 
            var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[first_sheet_name]);
            console.log("Got csv...");
            // fetch test apparatus parameters 
            frappe.call({
                "method": "lifefair.lifefair.doctype.registration.registration.import_xing",
                "args": {
                    "content": csv,
                    "meeting": meeting
                },
                "callback": function(response) {
                    if (response.message) {
                        console.log("Response: " + response.message);
                        frappe.msgprint(__("New registrations: ") + response.message.registrations + "<br>" +
                            __("New people: ") + response.message.people)
                    }
                }
            });
        }
        // assign an error handler event
        reader.onerror = function (event) {
            frappe.msgprint(__("Error reading file"), __("Error"));
        }
        reader.readAsBinaryString(file);
    }
    else
    {
        frappe.msgprint(__("Please select a file."), __("Information"));
    }
}

