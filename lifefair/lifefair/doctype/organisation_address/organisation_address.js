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
		} else {
			// set is private if no organisation is defined (but a person)
			if (!frm.doc.organisation) {
				cur_frm.set_value('is_private', 1);
			}
		}
		// set title
		if (!frm.doc.is_private) {
			cur_frm.set_value('title', frm.doc.organisation);
		} else {
			cur_frm.set_value('title', frm.doc.person_name);
		}
	}
});
