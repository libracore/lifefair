# -*- coding: utf-8 -*-
# Copyright (c) 2017-2019, libracore and contributors
# License: AGPL v3. See LICENCE

# import definitions
from __future__ import unicode_literals
import frappe
from frappe import throw, _
from datetime import datetime

def add_log(title, topic="General", message=""):
    new_log = frappe.get_doc({
        'doctype': 'Lifefair Log',
        'title': title,
        'message': message,
        'topic': topic,
        'date': datetime.now()
    })
    new_log.insert(ignore_permissions=True)
    frappe.db.commit()
    return
