document.addEventListener('DOMContentLoaded', function() {
    var xlsx = document.createElement('script');
	xlsx.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js';
	document.head.appendChild(xlsx);

    check_for_login();
});

function check_for_login() {
    if (frappe.session.user !== "Guest"){
        get_ticket_data();
    } else {
        window.location.replace("/login?redirect-to=/partnerticket");
    }
}

function get_ticket_data() {
    //get ticket where responsible is current user
    frappe.call({
        'method': 'lifefair.templates.pages.partnerticket.get_partnerticket',
        'async': false,
        'args': {
            'user': frappe.session.user
        },
        'callback': function(response) {
			var ticket= response.message[0];
			var guests = response.message[1];
			var h2 = document.getElementById("ticket-name");
			h2.innerHTML = ticket[0].person_name;
			var owner = document.getElementById("ticket-owner-name");
			owner.innerHTML = ticket[0].person_name;
			var meeting = document.getElementById("ticket-anlass");
			meeting.innerHTML = ticket[0].meeting;
			add_rows(ticket[0].ticket_count, guests);
			//fill_form(data[0].name);
        }
    });
}

//dynamically add empty rows to <tbody id="ticket-table-body"></tbody>
function add_rows(number_of_rows, guests) {
    var tbody = document.getElementById("ticket-table-body");
    for (var i = 0; i < number_of_rows; i++) {
        var tr = document.createElement("tr");
        tr.setAttribute("data-idx", i);
		// add rows using the following format: <tr><td id="first-column">1</td><td><input type="text" id="vorname1" name="vorname1" required></td><td><input type="text" id="nachname1" name="nachname1" required></td><td><input type="email" id="email1" name="email1" required></td><td><input type="text" id="funktion1" name="funktion1"></td><td><input type="text" id="organisation1" name="organisation1"></td><td><input type="text" id="telefonnummer1" name="telefonnummer1"></td><td><input type="text" id="ifblocks1" name="ifblocks1"></td></tr>
		tr.innerHTML = "<td id='first-column'>" + (i+1) + "</td><td><input type='text' id='vorname" + i + "' name='vorname" + i + "' data-fieldname='first_name' required></td><td><input type='text' id='nachname" + i + "' name='nachname" + i + "' data-fieldname='last_name' required></td><td><input type='email' id='email" + i + "' name='email" + i + "' data-fieldname='email' required></td><td><input type='text' id='funktion" + i + "' name='funktion" + i + "' data-fieldname='role'></td><td><input type='text' id='organisation" + i + "' name='organisation" + i + "' data-fieldname='organization'></td><td><input type='text' id='telefonnummer" + i + "' name='telefonnummer" + i + "' data-fieldname='phone'></td><td><input type='text' id='ifblocks" + i + "' name='ifblocks" + i + "' data-fieldname='if_blocks'></td><td><span class='grey-checkmark'>&#x2713;</span></td>";
        tbody.appendChild(tr);
    }
	fill_form(guests);
}

//upload excel file
function upload_file() {
	var input = document.createElement("input");
	input.type = 'file';
	input.accept = '.xls,.xlsx';

	// Add an event listener to listen for when a file is selected
	input.addEventListener('change', function(event) {
		var file = event.target.files[0];
		if (file){
			var reader = new FileReader();

			// Add an event listener to listen for when the file has been read
			reader.addEventListener('load', function(event) {
				var contents = event.target.result;
				extract_data(contents);
			});
			reader.onerror = function(event) {
				frappe.msgprint("Error reading file");
			}
			reader.readAsBinaryString(file);
		} else {
			frappe.msgprint("No file selected");
		}

	});
	input.click();
}

//extract data from excel file
function extract_data(contents){
	var data = XLSX.read(contents, {type: 'binary'});
	var first_sheet_name = data.SheetNames[0];
	var csv = XLSX.utils.sheet_to_csv(data.Sheets[first_sheet_name]);
	convert_raw_data(csv);
}

function convert_raw_data(csv) {
	var lines = csv.split("\n");
	var result = [];
	var headers = ["first_name", "last_name", "email", "function", "organisation", "phone", "if_block"];
	for(var i = 1; i < lines.length; i++){
		var obj = {};
		var currentline = lines[i].split(",");
		for(var j = 0; j < headers.length; j++){
			obj[headers[j]] = currentline[j];
		}
		result.push(obj);
	}
	fill_form(result);
}

function fill_form(data_array) {
    var table = document.getElementById("ticket-table");
    var first_free_row = 0;
    var number_of_rows = document.querySelectorAll("[data-idx]").length;

    // Find the first free row
    for (var i = 1; i < table.rows.length; i++) {
        var row = table.rows[i];
        var email = row.querySelector("[data-fieldname='email']").value;
        var first_name = row.querySelector("[data-fieldname='first_name']").value;
        var last_name = row.querySelector("[data-fieldname='last_name']").value;

        if (email === "" && first_name === "" && last_name === "") {
            first_free_row = i - 1;
            break;
        }
    }

    // Fill the form with data from the data_array
    for (var i = 0; i < data_array.length; i++) {
        var data = data_array[i];
        var first_name = data.first_name;
        var last_name = data.last_name;
        var email = data.email;
        var role = data.function;
        var organization = data.organisation;
        var phone = data.phone;
        var if_blocks = data.if_block;

        if (first_name && last_name && email && (first_free_row + i < number_of_rows)) {
            set_values(first_free_row + i, first_name, last_name, email, role, organization, phone, if_blocks);
        }
    }
}


function set_values(index, first_name, last_name, email, role, organization, phone, if_blocks) {
	//get element with data-idx=index
	var element = document.querySelector("[data-idx='" + index + "']");
	//set first-name in input field with data-fieldname=first_name of element
	var first_name_field = element.querySelector("[data-fieldname='first_name']");
	first_name_field.value = first_name;
	//set last-name in input field with data-fieldname=last_name of element
	var last_name_field = element.querySelector("[data-fieldname='last_name']");
	last_name_field.value = last_name;
	//set email in input field with data-fieldname=email of element
	var email_field = element.querySelector("[data-fieldname='email']");
	email_field.value = email;
	//set role in input field with data-fieldname=role of element
	var role_field = element.querySelector("[data-fieldname='role']");
	role_field.value = role;
	//set organization in input field with data-fieldname=organization of element
	var organization_field = element.querySelector("[data-fieldname='organization']");
	organization_field.value = organization;
	//set phone in input field with data-fieldname=phone of element
	var phone_field = element.querySelector("[data-fieldname='phone']");
	phone_field.value = phone;
	//set if_blocks in input field with data-fieldname=if_blocks of element
	var if_blocks_field = element.querySelector("[data-fieldname='if_blocks']");
	if_blocks_field.value = if_blocks;
}

function save_changes() {
	for (var i = 0; i < document.getElementById("ticket-table").rows.length-1; i++) {
		save_row(i);
	}
}

function save_row(index) {
	var first_name = document.getElementById("vorname" + index).value;
	var last_name = document.getElementById("nachname" + index).value;
	var email = document.getElementById("email" + index).value;
	var role = document.getElementById("funktion" + index).value;
	var organization = document.getElementById("organisation" + index).value;
	var phone = document.getElementById("telefonnummer" + index).value;
	var if_blocks = document.getElementById("ifblocks" + index).value;
	frappe.call({
		'method': 'lifefair.templates.pages.partnerticket.save_changes',
		'async': false,
		'args': {
			'index': index+1,
			'user': frappe.session.user,
			'first_name': first_name,
			'last_name': last_name,
			'email': email,
			'role': role,
			'organization': organization,
			'phone': phone,
			'if_blocks': if_blocks
		},
		'callback': function(response) {

		}
	})
}