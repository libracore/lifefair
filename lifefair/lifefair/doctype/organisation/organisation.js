// Copyright (c) 2018, libracore and contributors
// For license information, please see license.txt

frappe.ui.form.on('Organisation', {
	refresh: function(frm) {
		if (!frm.doc.__islocal) {
			display_addresses(frm);
			
			display_people(frm);
		}
	},
    ist_ver(frm) {
		// your code here
		cur_frm.set_value("ist_kein_ver", 0);
	},
	ist_kein_ver(frm) {
		cur_frm.set_value("ist_ver", 0);
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
				if (r.message.addresses.length == 0) {
					html = __("<p>No addresses found</p>");
				} else {
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
							html += "&nbsp;(" + address.postbox;
							if (address.postbox_pin_code) {
								html += ", " + address.postbox_pin_code;
							}
							if (address.postbox_city) {
								html += " " + address.postbox_city;
							}
							html += ", " + address.post_box_country + ")";
						}
						html += "</a></p>";
					});
				}
				
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
				
				
				
				
				/*
				var html = "";
				r.message.people.forEach(function (person) {
					// person code generator
					html += '<p>';
					html += '<a href="/desk#Form/Person/' + person.name + '">';
					html += person.full_name;
					html += ", " + person.role;
					if (person.linkedin_id) { html += ", " + '<span class="fa fa-linkedin-square"></span>&nbsp;' + person.linkedin_id;}
					if (person.is_primary) {
						html += '&nbsp;<span class="octicon octicon-check"></span>';
					}
					html += "</a></p>";
				});
				
				*/
				
						// render business card
		var html = "";				
		r.message.people.forEach(function (person) {
			html += '<p>';	
			html += '<a href="/desk#Form/Person/' + person.name + '">';
			html += person.full_name;
			    if (person.website_description) {
                html += " (" + person.website_description + ")<br>";
                } else {
                html += "<br>";
                }
                if (person.company_phone) {
                html += '<span class="octicon octicon-device-mobile"></span>&nbsp;' + person.company_phone + ", ";
                } else if (person.private_phone) {
                html += '<span class="octicon octicon-device-mobile"></span>&nbsp;' + person.private_phone + ", ";
                }
                if (person.mobile_phone) {
                html += '<span class="octicon octicon-device-mobile"></span>&nbsp;' + person.mobile_phone + ", ";
                } 
                html += '&nbsp;<span class="octicon octicon-mail"></span>&nbsp;';
                if (person.email) {
                html += "<a href=\"mailto:" + person.email + "\">" + person.email + "</a>" + ", ";
                } else if (person.email2) {
                html += "<a href=\"mailto:" + person.email2 + "\">" + person.email2 + "</a>" + ", ";
                } else if (person.email3) {
                html += "<a href=\"mailto:" + person.email3 + "\">" + person.email3 + "</a>" + ", ";
                }
                if (person.linkedin_id) {
                html += '<span class="fa fa-linkedin-square"></span>&nbsp;' + person.linkedin_id;
                }
                
			html += '</p>';
		})//for each
	
				
				if (frm.fields_dict['people_html']) {
					$(frm.fields_dict['people_html'].wrapper).html(html);
				}
			}

		}
	});
	
}
