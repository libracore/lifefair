// Copyright (c) 2018, libracore and contributors
// For license information, please see license.txt

frappe.ui.form.on('Person', {
	refresh: function(frm) {
        frm.add_custom_button(__("Send mail"), function() {
			send_mail(frm);
		}).addClass("btn-warning");
	},
	validate: function(frm) {
		// set full name
		cur_frm.set_value('full_name', frm.doc.first_name + " " + frm.doc.last_name);
		// set primary company
		find_primary_company(frm);
	},
	/* update first characters when changing the name */
	last_name: function(frm) {
		cur_frm.set_value('first_characters', frm.doc.last_name.substring(0, 4).toUpperCase());
	}
});

function find_primary_company(frm) {
	for (i = 0; i < frm.doc.organisations.length; i++) {
		if (frm.doc.organisations[i].is_primary) {
			cur_frm.set_value('primary_organisation', frm.doc.organisations[i].organisation);
			break;
		} 
	} 
}

function send_mail(frm) {
    window.location.href = "mailto:" + frm.doc.email;
}
