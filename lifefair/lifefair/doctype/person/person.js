// Copyright (c) 2018, libracore and contributors
// For license information, please see license.txt

frappe.ui.form.on('Person', {
	refresh: function(frm) {
		// add send mail button
        frm.add_custom_button(__("Send Mail"), function() {
			send_mail(frm);
		}).addClass("btn-warning");
		// add download vCard buton
        frm.add_custom_button(__("Download vCard"), function() {
			download_vcard(frm);
		}).addClass("btn-warning");		
		// load addresses
		display_addresses(frm);
		// load contacts
        display_contacts(frm);
	},
	validate: function(frm) {
		// set full name
		cur_frm.set_value('full_name', frm.doc.first_name + " " + frm.doc.last_name);
        // set long  name
        if (frm.doc.salutation) {
            var long_name = frm.doc.salutation + " " + frm.doc.first_name + " " + frm.doc.last_name;
        } else {
            var long_name = frm.doc.first_name + " " + frm.doc.last_name;
        }
		cur_frm.set_value('long_name', long_name);
		// set primary company
		find_primary_company(frm);
	},
	/* update first characters when changing the name */
	last_name: function(frm) {
		cur_frm.set_value('first_characters', frm.doc.last_name.substring(0, 4).toUpperCase());
	},
    gender: function(frm) {
        if (frm.doc.gender) {
            if (frm.doc.gender == "Frau") {
                cur_frm.set_value('letter_salutation', "Sehr geehrte Frau");
            }
            else if (frm.doc.gender == "Herr") {
                cur_frm.set_value('letter_salutation', "Sehr geehrter Herr");
            }
        }
    }
});

// find the primary organisation
function find_primary_company(frm) {
	for (i = 0; i < frm.doc.organisations.length; i++) {
		if (frm.doc.organisations[i].is_primary) {
			cur_frm.set_value('primary_organisation', frm.doc.organisations[i].organisation);
			cur_frm.set_value('primary_function', frm.doc.organisations[i].function);
			break;
		} 
	} 
}

// open email with local email client
function send_mail(frm) {
    window.location.href = "mailto:" + frm.doc.email;
}

// create vCard and push to download
function download_vcard(frm) {
    frappe.call({
		method: 'get_vcard',
		doc: frm.doc,
		callback: function(r) {
			if (r.message.vcard) {
				download(frm.doc.name + ".vcf", 
					'data:text/v-card;charset=utf-8,', 
					r.message.vcard);
			}
		}
	});
}

// create a downloadable file that directly opens in the browser
function download(filename, type, content) {
  var element = document.createElement('a');
  element.setAttribute('href', type + encodeURIComponent(content));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function display_addresses(frm) {
	// render addresses
	frappe.call({
		method: 'get_addresses',
		doc: frm.doc,
		callback: function(r) {
			if (r.message) {
				var html = "";
				if (r.message.addresses.length == 0) {
					html = __("<p>No addresses found</p>");
				} else {
					r.message.addresses.forEach(function (address) {
						// address code generator
						html += '<p>';
						if (address.is_private) {
							html += '<span class="octicon octicon-home"></span>&nbsp;';
						}
						if (address.is_primary) {
							html += '<span class="octicon octicon-star"></span>&nbsp;';
						}
						if (address.for_shipping) {
							html += '<span class="octicon octicon-mail"></span>&nbsp;';
						}
						if (!address.is_private) {
							html += address.organisation + ", &nbsp;";
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

function display_contacts(frm) {
	// render contacts
	frappe.call({
		method: 'get_contacts',
		doc: frm.doc,
		callback: function(r) {
			if (r.message) {
				var html = "";
				if (r.message.contacts.length == 0) {
					html = __("<p>No linked contacts found</p>");
				} else {
					r.message.contacts.forEach(function (contact) {
						// contacts code generator
						html += '<p>';
						if (contact.direct == "1") {
							html += '<span class="octicon octicon-arrow-small-left"></span>&nbsp;';
                            html += '<a href="/desk#Form/Person/' + contact.person + '">';
                            html += contact.person_name + "</a>&nbsp;";
                            html += __("is") + "&nbsp;" + contact.function + "&nbsp;" + __("of");
                            html += "&nbsp;" + frm.doc.full_name;
						} else {
                            html += '<p><span class="octicon octicon-arrow-small-right"></span>&nbsp;';
                            html += frm.doc.full_name + "&nbsp;";
                            html += __("is") + "&nbsp;" + contact.function + "&nbsp;" + __("of") + "&nbsp;";
                            html += '<a href="/desk#Form/Person/' + contact.person + '">';
                            html += contact.person_name + "</a>";
                        }
                        html +=  "</p>"
					});
				}					
				if (frm.fields_dict['contact_html']) {
					$(frm.fields_dict['contact_html'].wrapper).html(html);
				}

			}

		}
	});
	
}
