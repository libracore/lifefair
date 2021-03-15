// Copyright (c) 2016, libracore and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Actor per Meeting Details"] = {
	"filters": [
		{
            "fieldname":"interests",
            "label": __("Interests"),
            "fieldtype": "Link",
            "options": "Interesse"
        }
	]
};
