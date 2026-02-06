import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../helpers/apiResponse";
import { findFollowUpCallsNotify,insertFollowUpCallsNotification } from "../../../../domain/models/mobileapp.model";

import { json } from "body-parser";
import { env } from '../../../../../infrastructure/env';
const firebase = require("firebase-admin");
import { glogger } from "../../../../helpers/logger";
import { convertTimeZone } from "../../../../helpers/utility";

/**
 * get settings.
 *
 * @returns {Object}
 */

  export const checkFollowUpCall = async () => {
    try {
        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
        let reqDateTime: any = {
            currentDate: getCurrentDate,
        };
        await findFollowUpCallsNotify(reqDateTime, (err: any, response: any) => {
            if (err) {
              glogger("ERR", "Cron", "findFollowUpCallsNotify", err);
            } else {
                if(response.length > 0){
                    for (let data of response) {
                        let reqData: any = {
                            "sme_id": data.sme_id,
                            "customer_number": data.customer_number, 
                            "customer_name": data.customer_name, 
                            "agent_id": data.created_by, 
                            "schedule_date_time": data.reminder_date_time,
                            "insert_date_time": getCurrentDate,
                            "username": data.agent_email,
                            "status" : data.status,
                            "mode" : 'APP',
                            "event" : 'followup_call',
                            "title" : 'Follow Up '+data.customer_number+' '+data.customer_name ? data.customer_name : '',
                            "message" : 'You have a follow up in next 2 minutes',
                            "note" : data.message,
                        };

                        insertFollowUpCallsNotification(reqData, (err: any, responseN: any) => {
                            if (err) {
                                glogger("ERR", "Cron", "insertFollowUpCallsNotification", err);
                            } else {
                                console.log("successfully run cron checkFollowUpCall");
                            }
                        });
                        
                    }
                }
            }
        });
    
    } catch (e) {
      
        glogger("ERR", "CRON:- checkFollowUpCall", "Exception", e);
    }
  };