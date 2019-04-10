// Copyright (c) 2018, libracore and contributors
// For license information, please see license.txt

frappe.ui.form.on('Block', {
	refresh: function(frm) {
        if (!frm.doc.__islocal) {
            display_partners(frm);
        }
	}
});

function display_partners(frm) {
    // render partners
    frappe.call({
	method: 'get_partners',
	doc: frm.doc,
	callback: function(r) {
	    if (r.message) {
		var html = "";
		if (r.message.partners.length == 0) {
		    html = "<p>" + __("No partners found") + "</p>";
		} else {
		    r.message.partners.forEach(function (partner) {
                // address code generator
                html += '<p>';
                html += '<span class="octicon octicon-broadcast"></span>&nbsp;';
                html += '<a href="/desk#Form/Organisation/' + partner.parent + '">';
                html += partner.parent + "</a>: " + partner.type;
                html += "</p>";
		    });
		}					
		if (frm.fields_dict['partnerships_html']) {
			$(frm.fields_dict['partnerships_html'].wrapper).html(html);
		}
	    }
	}
    });	
}
