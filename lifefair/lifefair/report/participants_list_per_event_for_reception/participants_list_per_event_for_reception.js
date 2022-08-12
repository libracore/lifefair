// Copyright (c) 2022, libracore and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Participants list per event for reception"] = {
    "filters": [
        {
            "fieldname":"meeting",
            "label": __("Meeting"),
            "fieldtype": "Link",
            "options": "Meeting",
            "reqd": 1
        },
        {
            "fieldname":"with_details",
            "label": __("With Details"),
            "fieldtype": "Check"
        }
    ]
};
