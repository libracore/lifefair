// Copyright (c) 2018-2019, libracore and contributors
// For license information, please see license.txt

frappe.ui.form.on('Block', {
	refresh: function(frm) {
        // set filters for applicable print formats (only for Block)
        cur_frm.fields_dict['flyer_print_format'].get_query = function(doc) {
            return { filters: {'doc_type': 'Block'} }
        };
        if (!frm.doc.__islocal) {
            display_partners(frm);
            
            frm.add_custom_button(__("Download HTML"), function() {
                generate_html(frm);
            });
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

function generate_html(frm) {
    var container = frm;
    //console.log(args.toSource());
    frappe.call({
	  method: 'get_partners',
	  doc: frm.doc,
	  callback: function(r) {
	    if ((r.message) && (r.message.partners.length > 0)) {
		    container.partners = r.message.partners;
        } else {
            container.partners = [];
        }
        // set timestamp
        var d = new Date();
        container.now = "Zeitstempel: " + d.getHours() 
            + ":" + d.getMinutes()
            + ":" + d.getSeconds()
            + " " + d.getFullYear()
            + "-" + (d.getMonth() + 1)
            + "-" + d.getDay();
        // pull data into the review form
        var review_html = frappe.render_template("review", container);
        console.log(review_html);
        // prepare for download
        download("Review " + frm.doc.name + ".html", 'data:text/html;charset=utf-8,', review_html);
        
	  }
    });	
}
