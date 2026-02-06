import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, SuccessResponseWithCount } from "../../../../../helpers/apiResponse";
import { updateAppNotificationStatus, findfirebaseAppNotification } from "../../../../../domain/models/v2/mobileapp.model";
import { env } from '../../../../../../infrastructure/env';
import { convertTimeZone } from "../../../../../helpers/utility";
const firebase = require("firebase-admin");
import { glogger } from "../../../../../helpers/logger";

export const firebaseAppNotification = async () => {
    try {
        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
        let reqDateTime: any = {
        currentDate: getCurrentDate,
        };
        await findfirebaseAppNotification(reqDateTime, (err: any, response: any) => {
            if (err) {
              if (env.NODE_ENV_ERROR_LOG == "yes") {
                loggerFileError.error(err);
              }
              logger.error(err);
            } else {
                if (response && response.length > 0) {
                    for (let notification of response) {
                        let regData: any = {
                            username: notification.username,
                            id: notification.id,
                            };

                        var firebaseToken = notification.app_notification_token;
                        var customerName = '';
                        if(notification.customer_name != '' || notification.customer_name !='NULL'){
                             customerName = notification.customer_name;
                        }
                       
                        var schedule_date_time = new Date(notification.schedule_date_time).toISOString().replace(/T/, ' ').replace(/\..+/, '') ;

                        var payload = {
                            "notification": {
                                "title": "" + notification.title,
                                "body": "" + notification.message,
                                "icon": "https://dev.kommuno.com/kui/content/images/kommuno-favicon.png",
                                "content_available": "true",
                                "priority": "high"
                            },
                            "data": {
                                
                                "customer_name": ""+ customerName,
                                "customer_number": ""+ notification.customer_number,
                                "time": ""+schedule_date_time,
                                "message": "",
                                "note": ""+notification.note,
                                "type": ""+notification.event,
                                "mode": ""+notification.mode,
                                "session_id": ""+notification.session_id,
                                "call_direction": ""+notification.call_direction,
                                "notification_id": ""+notification.id
                            }
                        } 
                        
                        firebase.messaging().sendToDevice(firebaseToken, payload).then((response: any) =>{
                            console.log(response);
                            if(response.successCount == 1){
                                updateAppNotificationStatus(regData, (err: any, response: any) => {
                                    if (err) {
                                      if (env.NODE_ENV_ERROR_LOG == "yes") {
                                        loggerFileError.error(err);
                                      }
                                      logger.error(err);
                                    } else {
                                      console.log('success')
                                    }
                                });
                            }
    
                        })
                        .catch((error: any) => {
                                console.log(error);
                        });
                    }
                }
            }
        });
    } catch (e) {
        logger.error(e);
        //ErrorResponse(res, e);
      }
  };