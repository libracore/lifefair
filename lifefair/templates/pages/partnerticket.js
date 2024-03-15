document.addEventListener('DOMContentLoaded', function() {
	// dynamically load the xlsx library
    var xlsx = document.createElement('script');
	xlsx.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js';
	document.head.appendChild(xlsx);

	//check if the user is logged in
    check_for_login();
});

function check_for_login() {
	//redirect to login page if user is not logged in
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
			if (response && response.message){
				var ticket= response.message[0];
				var guests = response.message[1];
				update_ticket_ui(ticket, guests);
			} else {
				frappe.msgprint("No ticket found");
			}
        }
    });
}

function update_ticket_ui(ticket, guests) {
	var h2 = document.getElementById("ticket-name");
	h2.innerHTML = ticket[0].person_name;

	var owner = document.getElementById("ticket-owner-name");
	owner.innerHTML = ticket[0].person_name;

	var meeting = document.getElementById("ticket-anlass");
	meeting.innerHTML = ticket[0].meeting;

	add_rows(ticket[0].ticket_count, guests);
}

//dynamically add empty rows to <tbody id="ticket-table-body"></tbody>
function add_rows(number_of_rows, guests) {
    var tbody = document.getElementById("ticket-table-body");

	//add empty rows to the table
    for (var i = 0; i < number_of_rows; i++) {
        var tr = create_table_row(i);
        tbody.appendChild(tr);
    }
	fill_form(guests);
}

function create_table_row(index){
	var tr = document.createElement("tr");
	tr.setAttribute("data-idx", index);

	//create first cell for the row with id="first-column"
	var td = document.createElement("td");
	td.innerHTML = index+1;
	td.classList.add("first-column");
	tr.appendChild(td);

	//create cells for each column
	var cells =[
		create_table_cell(index, "", "vorname", "first_name"),
		create_table_cell(index, "", "nachname", "last_name"),
		create_table_cell(index, "", "email", "email"),
		create_table_cell(index, "", "funktion", "role"),
		create_table_cell(index, "", "organisation", "organization"),
		create_table_cell(index, "", "telefonnummer", "phone"),
		create_table_cell(index, "", "ifblocks", "if_blocks")
	];

	//create a table cell for the checkmark
	var td = document.createElement("td");
	td.innerHTML = "&#x2713;";
	td.classList.add("grey-checkmark");
	cells.push(td);

	//append cells to the row
	cells.forEach(function(cell){
		tr.appendChild(cell);
	});

	return tr;
}

function create_table_cell(index, value, id_prefix, fieldName, type="text", className=""){
	var td = document.createElement("td");
	var input = document.createElement("input");
	input.type = type;
	input.id = id_prefix + index;
	input.name = id_prefix + index;
	input.setAttribute("data-fieldname", fieldName);
	input.required = (type === "text" && fieldName === "email");
	input.value = value;
	td.appendChild(input);
	if (className){
		td.classList.add(className);
	}
	return td;
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
	get_registrations();
}

function set_values(index, first_name, last_name, email, role, organization, phone, if_blocks) {
	//get element with data-idx=index
	var element = document.querySelector("[data-idx='" + index + "']");
	
	//set values of the input fields
	set_value(element, "first_name", first_name);
	set_value(element, "last_name", last_name);
	set_value(element, "email", email);
	set_value(element, "role", role);
	set_value(element, "organization", organization);
	set_value(element, "phone", phone);
	set_value(element, "if_blocks", if_blocks);
}

function set_value(element, fieldname, value){
	var field = element.querySelector("[data-fieldname='" + fieldname + "']");

	//set the value if the field exists
	if (field){
		field.value = value;
	} else {
		console.log("Field not found: " + fieldname);
	}
}

function get_registrations() {
	frappe.call({
		'method': 'lifefair.templates.pages.partnerticket.get_registrations',
		'args': {
			'user': frappe.session.user
		},
		'callback': function(response) {
			if (response.message) {
				var tickets = response.message.tickets;
				for (var i = 0; i < tickets.length; i++) {
					var ticket = tickets[i];
					if (ticket.registration){
						change_checkmark_color(ticket.idx-1);
						make_row_readonly(ticket.idx-1);
					}
				}
			}
		}
	});
}

function change_checkmark_color(index) {
	var element = document.querySelector("[data-idx='" + index + "']");
	var checkmark = element.querySelector(".grey-checkmark");
	checkmark.classList.remove("grey-checkmark");
	checkmark.classList.add("green-checkmark");
}

function make_row_readonly(index) {
	var element = document.querySelector("[data-idx='" + index + "']");
	var inputs = element.querySelectorAll("input");
	inputs.forEach(function(input){
		input.readOnly = true;
	});
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
			read_file(file);
		} else {
			frappe.msgprint("No file selected");
		}
	});
	input.click();
}

//read file contents
function read_file(file) {
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
}

//extract data from excel file
function extract_data(contents){
	var data = XLSX.read(contents, {type: 'binary'});
	var first_sheet_name = data.SheetNames[0];
	var csv = XLSX.utils.sheet_to_csv(data.Sheets[first_sheet_name]);
	convert_raw_data(csv);
}

//convert CSV data to usable JSON
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

function save_changes() {
	for (var i = 0; i < document.getElementById("ticket-table").rows.length-1; i++) {
		save_row(i);
	}
	//popup to confirm changes
	frappe.msgprint("Änderungen gespeichert");
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