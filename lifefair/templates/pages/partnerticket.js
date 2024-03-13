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
        display_login();
    }
}

function display_login() {
    document.getElementById("login-section").style.display = "block";
    document.getElementById("main-section").style.display = "none";
}

function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    frappe.call({
        'method': 'lifefair.templates.pages.partnerticket.login',
        'args': {
            'usr': username,
            'pwd': password
        },
        'callback': function(response) {
			console.log(response);
            if (response.message === "Success") {
                console.log("Login successful");
                console.log(frappe.session.user);
                document.getElementById("login-section").style.display = "none";
                document.getElementById("main-section").style.display = "block";
                get_ticket_data();
            } else {
                frappe.msgprint("Login failed");
            }
        }
    })

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
			var data= response.message;
			var h2 = document.getElementById("ticket-name");
			h2.innerHTML = data[0].person_name;
			var owner = document.getElementById("ticket-owner-name");
			owner.innerHTML = data[0].person_name;
			var meeting = document.getElementById("ticket-anlass");
			meeting.innerHTML = data[0].meeting;
			add_rows(data[0].ticket_count);
			//fill_form(data[0].name);
        }
    });
}

//dynamically add empty rows to <tbody id="ticket-table-body"></tbody>, the number of rows can be specified as an input
function add_rows(number_of_rows) {
    var tbody = document.getElementById("ticket-table-body");
    for (var i = 0; i < number_of_rows; i++) {
        var tr = document.createElement("tr");
        tr.setAttribute("data-idx", i);
		// add rows using the following format: <tr><td id="first-column">1</td><td><input type="text" id="vorname1" name="vorname1" required></td><td><input type="text" id="nachname1" name="nachname1" required></td><td><input type="email" id="email1" name="email1" required></td><td><input type="text" id="funktion1" name="funktion1"></td><td><input type="text" id="organisation1" name="organisation1"></td><td><input type="text" id="telefonnummer1" name="telefonnummer1"></td><td><input type="text" id="ifblocks1" name="ifblocks1"></td></tr>
		tr.innerHTML = "<td id='first-column'>" + (i+1) + "</td><td><input type='text' id='vorname" + i + "' name='vorname" + i + "' data-fieldname='first_name' required></td><td><input type='text' id='nachname" + i + "' name='nachname" + i + "' data-fieldname='last_name' required></td><td><input type='email' id='email" + i + "' name='email" + i + "' data-fieldname='email' required></td><td><input type='text' id='funktion" + i + "' name='funktion" + i + "' data-fieldname='role'></td><td><input type='text' id='organisation" + i + "' name='organisation" + i + "' data-fieldname='organization'></td><td><input type='text' id='telefonnummer" + i + "' name='telefonnummer" + i + "' data-fieldname='phone'></td><td><input type='text' id='ifblocks" + i + "' name='ifblocks" + i + "' data-fieldname='if_blocks'></td>";
        tbody.appendChild(tr);
    }
}

//upload excel file
function upload_file() {
	save_changes();
	var input = document.createElement('input');
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
	var headers = ["Vorname", "Nachname", "E_Mail", "Funktion", "Organisation", "Telefonnummer", "IF Blocks"];
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
	//get first free row
	var table = document.getElementById("ticket-table");
	var first_free_row = 0;
	for (var i = 0; i < table.rows.length; i++) {
		var row = table.rows[i];

		var isEmpty = true;
		for (var j = 0; j < row.cells.length; j++) {
			if (row.cells[j].textContent.trim() !== "") {
				isEmpty = false;
				break;
			}
		}

		if (isEmpty) {
			first_free_row = i;
			break;
		}
	}
	
	var number_of_rows = document.querySelectorAll("[data-idx]").length;

	for (var i = 0; i < data_array.length; i++) {
		var first_name = data_array[i].Vorname;
		var last_name = data_array[i].Nachname;
		var email = data_array[i].E_Mail;
		var role = data_array[i].Funktion;
		var organization = data_array[i].Organisation;
		var phone = data_array[i].Telefonnummer;
		var if_blocks = data_array[i]["IF Blocks"];
		if (first_name && last_name && email && first_free_row + i < number_of_rows){
			set_values(first_free_row, first_name, last_name, email, role, organization, phone, if_blocks);
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
	//TODO
	console.log("saving changes");
	frappe.call({
		'method': 'lifefair.templates.pages.partnerticket.save_changes',
		'args': {
			'user': frappe.session.user,
			'first_name': document.getElementById("vorname0").value,
			'last_name': document.getElementById("nachname0").value,
			'email': document.getElementById("email0").value,
			'role': document.getElementById("funktion0").value,
			'organization': document.getElementById("organisation0").value,
			'phone': document.getElementById("telefonnummer0").value,
			'if_blocks': document.getElementById("ifblocks0").value
		},
		'callback': function(response) {
			console.log(response);
		}
	})
}