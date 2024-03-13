frappe.ready(function(){
	//add xlsx library
	var xlsx = document.createElement('script');
	xlsx.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js';
	document.head.appendChild(xlsx);

	remove_buttons();
	insert_upload_button();
	replace_icon();
});


function remove_buttons() {
	hide_divs("btn-remove"); 
	hide_divs("btn-add-row");
}

function hide_divs(class_name) {
	var divsToHide = document.getElementsByClassName(class_name); 
    for(var i = 0; i < divsToHide.length; i++){
        divsToHide[i].style.visibility = "hidden"; 
    }
}

function insert_upload_button() {
	var excel_text = 'Sie können hier eine Excel-Datei mit den Daten hochladen. Die Datei wird automatisch ausgelesen und die Daten in die Felder übertragen. Bitte verwenden Sie folgendes Fomat:';
	var excel_text2 = 'Vorname, Nachname, E-Mail, Funktion, Organisation, Telefonnummer, gewünschte IF Blocks';
	var upload_button = '<button class="btn btn-primary btn-sm ml-2" id="excel_upload" onclick="upload_file()">Excel hochladen</button>';
	var upload_section = '<section id="excel_upload"> <h3>Excel Upload</h3> <p>' + excel_text + '</p> <p>' + excel_text2 + '</p>' + upload_button + '</section><hr>';
	//select class web-form-wrapper
	var web_form_wrapper = document.getElementsByClassName("web-form-wrapper");
	//add button
	web_form_wrapper[0].insertAdjacentHTML('beforeend', upload_section);
}

//upload excel file
function upload_file() {
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
	for (var i = 0; i < data_array.length; i++) {
		var first_name = data_array[i].Vorname;
		var last_name = data_array[i].Nachname;
		var email = data_array[i].E_Mail;
		var role = data_array[i].Funktion;
		var organization = data_array[i].Organisation;
		var phone = data_array[i].Telefonnummer;
		var if_blocks = data_array[i].gewünschte_IF_Blocks;
		set_values(i, first_name, last_name, email, role, organization, phone, if_blocks);
	}
}

function set_values(index, first_name, last_name, email, role, organization, phone, if_blocks) {
	//get element with data-idx=index
	var element = document.querySelector("[data-idx='" + index + "']");
	console.log(element);
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

//remove every span with octicon-triangle-down class and replace it with octicon-pencil in class btn-open-row
function replace_icon() {
	$(document).ready(function() {
		var span = document.getElementsByClassName("octicon-triangle-down");
		console.log(span);
		console.log(span.length);
		for (var i = 0; i < span.length; i++) {
			console.log(span[i]);
			span[i].classList.remove("octicon-triangle-down");
			span[i].classList.add("octicon-pencil");
		}
	});
}


//<input type="text" autocomplete="off" class="input-with-feedback form-control" maxlength="140" data-fieldtype="Data" data-fieldname="first_name" placeholder="" data-doctype="Partnership Ticket Item"></input>
