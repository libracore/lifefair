// Copyright (c) 2018, libracore and contributors
// For license information, please see license.txt

frappe.ui.form.on('Partnershipticket', {
	refresh: function(frm) {
		// add download vCard buton
		frm.add_custom_button( __("Identify people"), function() {
			identify_people(frm);
		}).addClass("btn-primary");
		// load business card
		display_overview(frm);
	},
	validate: function(frm) {
		//secure_items(frm);
		
		apply_owner(frm);
	}
});

frappe.ui.form.on('Partnership Ticket Item', {
	tickets_add: function(frm, cdt, cdn) {
		frappe.model.set_value(cdt, cdn, "name", Date.now().toString());
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

function apply_owner(frm) {
	frappe.call({
		method: 'apply_owner',
		doc: frm.doc
    });
}

function identify_people(frm) {
	frappe.call({
		method: 'identify_people',
		doc: frm.doc,
		callback: function(response) {
			display_overview(frm);
		}
    });
}

function display_overview(frm) {
    // render business card
    var html = frappe.render_template('ticket_overview', frm.doc);
    if (frm.fields_dict['ticket_overview_html']) {
		$(frm.fields_dict['ticket_overview_html'].wrapper).html(html);
    }	
}
