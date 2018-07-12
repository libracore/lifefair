// Copyright (c) 2018, libracore and contributors
// For license information, please see license.txt

frappe.ui.form.on('Partnership Ticket', {
	refresh: function(frm) {

	},
	validate: function(frm) {
		secure_items(frm);
	}
});

function secure_items(frm) {
	var tickets = cur_frm.doc.tickets;
	var ticket_no = 1;
	tickets.forEach(function(entry) {
		frappe.model.set_value(entry.doctype, entry.name, "ticket_no", ticket_no);
		ticket_no++;
	});
}
