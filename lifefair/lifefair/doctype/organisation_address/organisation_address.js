// Copyright (c) 2018, libracore and contributors
// For license information, please see license.txt

frappe.ui.form.on('Organisation Address', {
	refresh: function(frm) {

	},
	validate: function(frm) {
		// check if address is linked to an organisation or person
		if ((!frm.doc.person) && (!frm.doc.organisation)) {
			frappe.msgprint( __("Please select a link to an organisation or person."), __("Validation") );
			frappe.validated=false;
		}
	}
});
