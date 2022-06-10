// Copyright (c) 2022, libracore and contributors
// For license information, please see license.txt

cur_frm.fields_dict.blocks.grid.get_field('block').get_query =  
    function() {                                                                      
        return {
            filters: {
                "meeting": cur_frm.doc.meeting
           }
        }
};

frappe.ui.form.on('Block Price', {
	// refresh: function(frm) {

	// }
});
