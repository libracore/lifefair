// Copyright (c) 2019, libracore and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Anmeldeliste Anlass"] = {
    "filters": [
        {
            "fieldname":"meeting",
            "label": __("Meeting"),
            "fieldtype": "Link",
            "options": "Meeting"
        },
                {
            "fieldname":"interests",
            "label": __("Interests"),
            "fieldtype": "Link",
            "options": "Interesse"
        }
    ]
}
