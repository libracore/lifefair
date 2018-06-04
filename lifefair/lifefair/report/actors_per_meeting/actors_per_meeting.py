# Copyright (c) 2018, libracore (https://www.libracore.com) and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

def execute(filters=None):
    columns, data = [], []
    
    columns = ["Meeting::100", "Block::200", "Person:Link/Person:100", "Name::200", "Role::200", "Show on Website"]
    if filters:
        data = get_actors(meeting=filters.meeting)
    else:
        data = get_actors()
            
    return columns, data

def get_actors(meeting=None):
    sql_query = """SELECT 
                `t1`.`title` AS `Meeting`,
                `t2`.`title` AS `Block`,
                `t3`.`person` AS `Person`,
                `t3`.`person_name` AS `Name`,
                `t3`.`role` AS `Role`,
                `t4`.`show_on_website` AS `Show on Website`,
                `t4`.`website_description` AS `Description`,
                `t4`.`image` AS `Image`
            FROM `tabMeeting` AS `t1`
            INNER JOIN `tabBlock` AS `t2` ON `t1`.`title` = `t2`.`meeting` 
            INNER JOIN `tabBlock Actor` AS `t3` ON `t2`.`title` = `t3`.`parent`
            LEFT JOIN `tabPerson` AS `t4` ON `t3`.`person` = `t4`.`name`"""
    if meeting:
        sql_query += """ WHERE `t1`.`title` = '{0}'""".format(meeting)
    sql_query += """ ORDER BY `t1`.`title` ASC, `t2`.`title` ASC, `t3`.`idx` ASC"""
    data = frappe.db.sql(sql_query, as_dict = True)
    return data
