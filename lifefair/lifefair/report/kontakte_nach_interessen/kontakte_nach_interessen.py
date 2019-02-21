# Copyright (c) 2019, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

def execute(filters=None):
    columns, data = [], []
    
    columns = ["Person:Link/Person:100",
               "Name::200",  
               "Website description::200",
               "Primary Organisation::200",
               "Email::200"
            ]
    if filters:
        data = get_people(interest=filters.interest, as_list=True)
    else:
        data = get_people(as_list=True)
          
    return columns, data

# use as_list=True in case of later Export to Excel
def get_people(interest="%", as_list=True):
    sql_query = """SELECT 
                `t2`.`name` AS `Person`,
                `t2`.`long_name` AS `Name`,
                `t2`.`website_description` AS `Website description`,
                `t2`.`primary_organisation` AS `Primary Organisation`,
                `t2`.`email`
            FROM `tabPerson Interest` AS `t1`
            LEFT JOIN `tabPerson` AS `t2` ON `t1`.`parent` = `t2`.`name`
            WHERE `t1`.`interesse` LIKE '{0}'
            GROUP BY `t2`.`name`
            ORDER BY `t2`.`long_name` ASC""".format(interest)
    if as_list:
        data = frappe.db.sql(sql_query, as_list = True)
    else:
        data = frappe.db.sql(sql_query, as_dict = True)
    return data
