// Copyright (c) 2018-2019, libracore and contributors
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
	// load active participation
	display_active_participation(frm);
	// load passive participation
	display_passive_participation(frm);
	// load business card
	display_business_card(frm);
    },
    validate: function(frm) {
        // set full name
        cur_frm.set_value('full_name', frm.doc.first_name + " " + frm.doc.last_name);
        // set long  name
        var long_name = frm.doc.first_name + " " + frm.doc.last_name;
        if (frm.doc.salutation) {
            long_name = frm.doc.salutation + " " + frm.doc.first_name + " " + frm.doc.last_name;
        }
        cur_frm.set_value('long_name', long_name);
        // set primary company
        find_primary_company(frm);
        // update website description
        if (!frm.doc.website_description) {
            update_website_description(frm);
        }
    },
    /* update first characters when changing the name */
    last_name: function(frm) {
	if (frm.doc.last_name.length >= 4) {
	    cur_frm.set_value('first_characters', frm.doc.last_name.substring(0, 4).toUpperCase());
	} else {
	    try {
	        var base_name = frm.doc.last_name + frm.doc.first_name;
	        cur_frm.set_value('first_characters', base_name.substring(0, 4).toUpperCase());
	    } catch {
		cur_frm.set_value('first_characters', "AAAA");
	    }
	}
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
    var found_primary = false;
    for (var i = 0; i < frm.doc.organisations.length; i++) {
        if (frm.doc.organisations[i].is_primary) {
            cur_frm.set_value('primary_organisation', frm.doc.organisations[i].organisation);
            cur_frm.set_value('primary_function', frm.doc.organisations[i].function);
            found_primary = true;
            break;
        } 
    }
    if (!found_primary) {
        // no primary organisation found
        cur_frm.set_value('primary_organisation', "");
        cur_frm.set_value('primary_function', "");        
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
		    html = "<p>" + __("No addresses found") + "</p>";
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
		    html = "<p>" + __("No linked contacts found") + "</p>";
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

function display_active_participation(frm) {
    // render active participation
    frappe.call({
	method: 'get_active_participation',
	doc: frm.doc,
	callback: function(r) {
	    if (r.message) {
            var html = "";
            if (r.message.participations.length == 0) {
                html = "<p>" + __("Diese Person war bis jetzt an noch keinem Anlass aktiv.") + "</p>";
            } else {
				html = "<p>" + __("Diese Person war aktiv in an ") + "<strong>" + r.message.participations.length + "</strong>" +" Anlässen.</p> <br>";

                r.message.participations.forEach(function (participation) {
                    // participation code generator
                    html += '<p>';
                    html += '<a href="/desk#Form/Block/' + participation.block + '">';
                    html += participation.block + ", " + participation.official_title + ", " + participation.person_role + "," + participation.description
                    if (participation.website_description) {
						participation.website_description +"</a></p>";
						} else {
							+"</a></p>";
							}
                   
                });
            }					
            if (frm.fields_dict['actor_html']) {
                $(frm.fields_dict['actor_html'].wrapper).html(html);
            }
	    }
	}
    });	
}



function display_passive_participation(frm) {
    // render passive participation
    frappe.call({
	method: 'get_passive_participation',
	doc: frm.doc,
	callback: function(r) {
		
		console.log(r.message);
	    if (r.message) {
            var html = "";
			
         if (r.message.registrations.length == 0) {
                html = "<p>" + __("Diese Person hat bis jetzt noch keinen Anlass besucht.") + "</p>";
            } else {
				html = "<p>" + __("Diese Person war bereits für ") + "<strong>" + r.message.registrations.length + "</strong>" +" Anlässe registriert.</p> <br>";
                r.message.registrations.forEach(function (registrations) {
                    // participation code generator
                    html += '<a href="/desk#Form/Block/' + registrations.title + '">';
                    html += registrations.short_name + ", " + registrations.official_title + ", " + "</a></p>";
                });
				}
            if (frm.fields_dict['registration']) {
                $(frm.fields_dict['registration'].wrapper).html(html);
            }
	    }
	}
    });	
}





function update_website_description(frm) {
    var description = "";
    frm.doc.organisations.forEach(function(organisation) {
        if (!description == "") {
            description += "; ";
        }
        
        if (organisation.function){
			description += organisation.function + ", ";
		}
		if (organisation.organisation){
			description += organisation.organisation;
		}

    });
    cur_frm.set_value('website_description', description);
}


function display_business_card(frm) {
	frappe.call({
    method: 'get_association_info',
    doc: frm.doc,
    callback: function(r) {
		
		// render business card
		var html = '<p>';
		html += frm.doc.long_name;
		if (frm.doc.website_description) {
		html += " (" + frm.doc.website_description + ")<br>" + ", ";
		} else {
		html += "<br>";
		}
		if (frm.doc.company_phone) {
		html += '<span class="octicon octicon-device-mobile"></span>&nbsp;' + frm.doc.company_phone + ", ";
		} else if (frm.doc.private_phone) {
		html += '<span class="octicon octicon-device-mobile"></span>&nbsp;' + frm.doc.private_phone + ", ";
		}
		if (frm.doc.mobile_phone) {
		html += '<span class="octicon octicon-device-mobile"></span>&nbsp;' + frm.doc.mobile_phone + ", ";
		} 
		html += '&nbsp;<span class="octicon octicon-mail"></span>&nbsp;';
		if (frm.doc.email) {
		html += "<a href=\"mailto:" + frm.doc.email + "\">" + frm.doc.email + "</a>" + ", ";
		} else if (frm.doc.email2) {
		html += "<a href=\"mailto:" + frm.doc.email2 + "\">" + frm.doc.email2 + "</a>" + ", ";
		} else if (frm.doc.email3) {
		html += "<a href=\"mailto:" + frm.doc.email3 + "\">" + frm.doc.email3 + "</a>" + ", ";
		}
		if (frm.doc.linkedin_id) {
		html += '<span class="fa fa-linkedin-square"></span>&nbsp;' + frm.doc.linkedin_id;
		}
		html +=  "</p>"
	
		if (r.message > 0) {
		html +=	'<p> Ist Mitgleid eines Verbandes: JA </p>';
			} else {
		html +=	'<p> Ist Mitgleid eines Verbandes: NEIN </p>';
			}

			
		
		
			
		if (frm.fields_dict['business_card_html']) {
		$(frm.fields_dict['business_card_html'].wrapper).html(html);
		}
	}
    });
} //display business car
