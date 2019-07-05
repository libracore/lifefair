frappe.query_reports["Actors per Meeting"] = {
    "filters": [
        {
            "fieldname":"meeting",
            "label": __("Meeting"),
            "fieldtype": "Link",
            "options": "Meeting"
        },
        {
            "fieldname":"block",
            "label": __("Block"),
            "fieldtype": "Link",
            "options": "Block"
        }
    ]
}
