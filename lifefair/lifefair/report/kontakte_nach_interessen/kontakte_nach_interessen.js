// Copyright (c) 2019, libracore and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Kontakte nach Interessen"] = {
    "filters": [
        {
            "fieldname":"interest",
            "label": __("Interesse"),
            "fieldtype": "Link",
            "options": "Interesse"
        }
    ]
}
