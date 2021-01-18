// Copyright (c) 2018-2020, libracore and contributors
// For license information, please see license.txt

frappe.ui.form.on('Registration', {
    refresh: function(frm) {
        if (!frm.doc.barcode) {
            frm.add_custom_button( __("Create ticket"), function() {
                create_ticket(frm);
            });
        }
    },
    /*
    validate: function(frm){
		frappe.call({
			method: 'lifefair.lifefair.doctype.registration.registration.set_reporting_date',
			args: {
				"docu": cur_frm.doc.name,
			},
		callback: function(response) {
            refresh_field(['meldedatum'])
        }
		});
    
    },
    */
});

function create_ticket(frm) {
    frappe.call({
        method: 'create_ticket',
        doc: frm.doc,
        callback: function(response) {
            refresh_field(['date', 'barcode', 'ticket_number', 'type', 'invoice_number', 'email_clerk', 'meldedatum'])
        }
    });
}
