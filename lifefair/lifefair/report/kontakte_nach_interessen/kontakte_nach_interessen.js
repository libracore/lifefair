// Copyright (c) 2019, libracore and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Kontakte nach Interessen"] = {
    "filters": [
        {
            "fieldname":"interest1",
            "label": __("Interesse 1"),
            "fieldtype": "Link",
            "options": "Interesse"
        },
        {
            "fieldname":"interest2",
            "label": __("Interesse 2"),
            "fieldtype": "Link",
            "options": "Interesse"
        },
        {
            "fieldname":"interest3",
            "label": __("Interesse 3"),
            "fieldtype": "Link",
            "options": "Interesse"
        },
        {
            "fieldname":"interest4",
            "label": __("Interesse 4"),
            "fieldtype": "Link",
            "options": "Interesse"
        },
        {
            "fieldname":"interest5",
            "label": __("Interesse 5"),
            "fieldtype": "Link",
            "options": "Interesse"
        }
    ]
}
