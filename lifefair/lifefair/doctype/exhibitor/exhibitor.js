// Copyright (c) 2019, libracore and contributors
// For license information, please see license.txt

frappe.ui.form.on('Exhibitor', {
	refresh: function(frm) {

	},
	validate: function(frm) {
        // check length limit of description field
        if ((frm.doc.description) && (frm.doc.description.length > 1100)) {
            frappe.msgprint( __("Description too long. Please shorten below 1100 characters."), __("Validation") );
            frappe.validated=false;
        }
        else if ((frm.doc.company_description) && (frm.doc.company_description.length > 1100)) {
            frappe.msgprint( __("Description too long. Please shorten below 1100 characters."), __("Validation") );
            frappe.validated=false;
        }
    },
    before_save: function(frm) {
        // replace line break with html-type line break
        if (frm.doc.company_description) {
            cur_frm.set_value('company_description',
                frm.doc.company_description.split('\n').join('<br>'));
        }
    }
});
