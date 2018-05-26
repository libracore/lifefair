// Copyright (c) 2018, libracore and contributors
// For license information, please see license.txt

frappe.ui.form.on('Organisation', {
	refresh: function(frm) {
		if (!frm.doc.__islocal) {
			display_addresses(frm);
			
			display_people(frm);
		}
	}
});

function display_addresses(frm) {
	// render addresses
	frappe.call({
		method: 'get_addresses',
		doc: frm.doc,
		callback: function(r) {
			if (r.message) {
				//console.log(r.message);
				
				var html = "";
				r.message.addresses.forEach(function (address) {
					// address code generator
					html += '<p>';
					if (address.is_primary) {
						html += '<span class="octicon octicon-star"></span>&nbsp;';
					}
					if (address.for_shipping) {
						html += '<span class="octicon octicon-mail"></span>&nbsp;';
					}
					html += '<a href="/desk#Form/Organisation Address/' + address.name + '">';
					html += address.street + " " + address.number;
					if (address.additional_address) { 
						html += ", " + address.additional_address;
					}
					html += ", " + address.pin_code + " "  + address.city + ", " + address.country;
					if (address.postbox) {
						html += "(" + address.postbox;
						if (address.postbox_pin_code) {
							html += ", " + address.postbox_pin_code;
						}
						if (address.postbox_city) {
							html += " " + address.postbox_city;
						}
						html += ", " + address.postbox_country + ")";
					}
					html += "</a></p>";
				});
				
				if (frm.fields_dict['address_html']) {
					$(frm.fields_dict['address_html'].wrapper).html(html);
				}
			}

		}
	});
	
}

function display_people(frm) {
	// render people
	frappe.call({
		method: 'get_people',
		doc: frm.doc,
		callback: function(r) {
			if (r.message) {
				//console.log(r.message);
				
				var html = "";
				r.message.people.forEach(function (person) {
					// person code generator
					html += '<p>';
					html += '<a href="/desk#Form/Person/' + person.name + '">';
					html += person.full_name;
					html += ", " + person.role;
					if (person.is_primary) {
						html += '&nbsp;<span class="octicon octicon-check"></span>';
					}
					html += "</a></p>";
				});
				
				if (frm.fields_dict['people_html']) {
					$(frm.fields_dict['people_html'].wrapper).html(html);
				}
			}

		}
	});
	
}
