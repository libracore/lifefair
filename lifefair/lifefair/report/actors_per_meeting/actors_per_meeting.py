# Copyright (c) 2018, libracore (https://www.libracore.com) and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe


def execute(filters=None):
    columns, data = [], []
    
    columns = ["Block:Link/Block:150",
               "Name::200",  
               "Website description::200",                
               "Role::200", 
               "Person:Link/Person:100",
               "Show on website",
               "Meeting::100",
               "Image",
               "Registered",
               "Interest:Link/Interest:150"]
    if filters:
        data = get_actors(meeting=filters.meeting, block=filters.block, as_list=True)
    else:
        data = get_actors(as_list=True)
          
    return columns, data

# use as_list=True in case of later Export to Excel
def get_actors(meeting=None, block=None, interest=None, as_list=True):
    sql_query = """SELECT 
				`t6`.`interest` AS `Interest`,
                `t2`.`title` AS `Block`,
                `t4`.`long_name` AS `Name`,
                `t3`.`person_website_description` AS `Website description`,
                `t3`.`person_role` AS `Role`,
                `t3`.`person` AS `Person`,
                `t4`.`show_on_website` AS `Show on website`,
                `t1`.`name` AS `Name`,
                `t4`.`image` AS `Image`,
                /*`t5`.`name` AS `Registered`*/
                (SELECT IF(`t5`.`name` IS NOT NULL, "ja", "nein")) AS `Registered`
            FROM `tabMeeting` AS `t1`
            INNER JOIN `tabBlock` AS `t2` ON `t1`.`title` = `t2`.`meeting` 
            INNER JOIN `tabBlock Planning` AS `t3` ON (`t2`.`title` = `t3`.`parent` AND `t3`.`person` IS NOT NULL)
            INNER JOIN `tabInterest` AS `t6` 
            LEFT JOIN `tabPerson` AS `t4` ON `t3`.`person` = `t4`.`name`
            LEFT JOIN `tabRegistration` AS `t5` ON (`t1`.`name` = `t5`.`meeting` AND `t4`.`name` = `t5`.`person`)"""
    if meeting:
        sql_query += """ WHERE `t1`.`title` = '{0}'""".format(meeting)
    elif block:
        sql_query += """ WHERE `t2`.`title` = '{0}'""".format(block)
    elif interest:
        sql_query += """ WHERE `t6`.`title` = '{0}'""".format(interest)    
    sql_query += """ GROUP BY (CONCAT(`t2`.`title`, `t3`.`person`))"""
    sql_query += """ ORDER BY `t1`.`title` ASC, `t2`.`title` ASC, `t3`.`idx` ASC"""
    if as_list:
        data = frappe.db.sql(sql_query, as_list = True)
    else:
        data = frappe.db.sql(sql_query, as_dict = True)
    return data
