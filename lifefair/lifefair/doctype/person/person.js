// Copyright (c) 2018, libracore and contributors
// For license information, please see license.txt

frappe.ui.form.on('Person', {
	refresh: function(frm) {

	},
	validate: function(frm) {
		cur_frm.set_value('full_name', frm.doc.first_name + " " + frm.doc.last_name);
	},
	/* update first characters when changing the name */
	last_name: function(frm) {
		cur_frm.set_value('first_characters', frm.doc.last_name.substring(0, 4).toUpperCase());
	}
});
