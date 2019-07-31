// Copyright (c) 2019, libracore and contributors
// For license information, please see license.txt

frappe.ui.form.on('Exhibitor', {
	refresh: function(frm) {

	},
	validate: function(frm) {
    // check length limit of description field
    if (frm.doc.description.length > 1100) {
        frappe.msgprint( __("Description too long. Please shorten below 1100 characters."), __("Validation") );
        frappe.validated=false;
    }
}

});
