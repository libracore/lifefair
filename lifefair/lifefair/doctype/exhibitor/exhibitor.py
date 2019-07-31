# -*- coding: utf-8 -*-
# Copyright (c) 2019, libracore and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Exhibitor(Document):
	pass

#
# call the API from
#   /api/method/lifefair.lifefair.doctype.exhibitor.exhibitor.get_exhibitors_company_overview?event=<event id>
@frappe.whitelist(allow_guest=True)
def get_exhibitors_company_overview(event=None):
    if event:
        sql_query = """SELECT
                 `tabExhibitor`.`organisation` AS `organisation`,
                 `tabExhibitor`.`topic` AS `topic`,
                 `tabExhibitor`.`name` AS `name`,
                 "," AS `separator`
            FROM `tabExhibitor`             
              WHERE `tabExhibitor`.`meeting` = "{event}"
            ORDER BY `tabExhibitor`.`organisation` ASC;""".format(event=event)

        exhibition = frappe.db.sql(sql_query, as_dict=True)        
        if exhibition:
            exhibition[-1]['separator'] = '.'
            return exhibition
        else:
            return ('Nothing found for {0}'.format(event))
    else:
        return ('Please provide an exhibition')


#
# call the API from
#   /api/method/lifefair.lifefair.doctype.exhibitor.exhibitor.get_exhibitors_topic_overview?event=<event id>
@frappe.whitelist(allow_guest=True)
def get_exhibitors_topic_overview(event=None):
    if event:
        sql_query = """SELECT
                 `tabExhibitor`.`organisation` AS `organisation`,
                 `tabExhibitor`.`topic` AS `topic`,
                 `tabExhibitor`.`name` AS `name`,
                 "," AS `separator`
            FROM `tabExhibitor`             
              WHERE `tabExhibitor`.`meeting` = "{event}"
            ORDER BY `tabExhibitor`.`topic` ASC;""".format(event=event)

        exhibition = frappe.db.sql(sql_query, as_dict=True)        
        if exhibition:
            exhibition[-1]['separator'] = '.'
            return exhibition
        else:
            return ('Nothing found for {0}'.format(event))
    else:
        return ('Please provide an exhibition')
        
        #
# call the API from
#   /api/method/lifefair.lifefair.doctype.exhibitor.exhibitor.get_exhibitors?event=<event id>
@frappe.whitelist(allow_guest=True)
def get_exhibitors(event=None):
    if event:
        sql_query = """SELECT 
                 `tabExhibitor`.`name` AS `name`,
                 `tabExhibitor`.`organisation` AS `organisation`,
                 `tabExhibitor`.`topic` AS `topic`,
                 `tabExhibitor`.`website_link` AS `website_link`,
                 `tabExhibitor`.`linktext_website` AS `linktext_website`,
                 `tabExhibitor`.`product_image_link` AS `product_image_link`,
                 `tabExhibitor`.`company_description` AS `company_description`,
                 `tP1`.`full_name` AS `person_1`,
                 `tP1`.`website_description` AS `website_description_1`,
                 `tP1`.`email` AS `email_1`,
                 `tP1`.`company_phone` AS `phone_1`,
                 `tP1`.`image` AS `image_1`,
             IF(ISNULL(`tTestimonial1`.`text`), "", CONCAT("«",`tTestimonial1`.`text`,"»")) AS `testimonial_1`,
                 `tP2`.`full_name` AS `person_2`,
                 `tP2`.`website_description` AS `website_description_2`,                
                 `tP2`.`email` AS `email_2`,
                 `tP2`.`company_phone` AS `phone_2`,
                 `tP2`.`image` AS `image_2`,
             IF(ISNULL(`tTestimonial2`.`text`), "", CONCAT("«",`tTestimonial2`.`text`,"»")) AS `testimonial_2`,  
                 `tP3`.`full_name` AS `person_3`,
                 `tP3`.`website_description` AS `website_description_3`,
                 `tP3`.`email` AS `email_3`,
                 `tP3`.`company_phone` AS `phone_3`,                
                 `tP3`.`image` AS `image_3`,
             IF(ISNULL(`tTestimonial3`.`text`), "", CONCAT("«",`tTestimonial3`.`text`,"»")) AS `testimonial_3`
                 
             FROM `tabExhibitor`
             LEFT JOIN `tabExhibition Contact` AS `tPL1` ON `tabExhibitor`.`name` = `tPL1`.`parent` AND `tPL1`.`idx` = 1
             LEFT JOIN `tabPerson` AS `tP1` ON `tP1`.`name` = `tPL1`.`person`
             LEFT JOIN 
  (SELECT `parent`, `text` FROM `tabPerson Quote` ORDER BY `date` DESC LIMIT 1) AS `tTestimonial1`
  ON `tTestimonial1`.`parent` = `tP1`.`name`
             LEFT JOIN `tabExhibition Contact` AS `tPL2` ON `tabExhibitor`.`name` = `tPL2`.`parent` AND `tPL2`.`idx` = 2
             LEFT JOIN `tabPerson` AS `tP2` ON `tP2`.`name` = `tPL2`.`person`
             LEFT JOIN 
  (SELECT `parent`, `text` FROM `tabPerson Quote` ORDER BY `date` DESC LIMIT 1) AS `tTestimonial2`
  ON `tTestimonial2`.`parent` = `tP2`.`name`
             LEFT JOIN `tabExhibition Contact` AS `tPL3` ON `tabExhibitor`.`name` = `tPL3`.`parent` AND `tPL3`.`idx` = 3
             LEFT JOIN `tabPerson` AS `tP3` ON `tP3`.`name` = `tPL3`.`person`
             LEFT JOIN 
               (SELECT `parent`, `text` FROM `tabPerson Quote` ORDER BY `date` DESC LIMIT 1) AS `tTestimonial3`
               ON `tTestimonial3`.`parent` = `tP3`.`name`
             WHERE `meeting` = "{event}";""".format(event=event)

        exhibition = frappe.db.sql(sql_query, as_dict=True)        
        if exhibition:
            exhibition[-1]['separator'] = '.'
            return exhibition
        else:
            return ('Nothing found for {0}'.format(event))
    else:
        return ('Please provide an exhibition')
