frappe.ready(function() {
	// bind events here
	remove_buttons();
})

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
