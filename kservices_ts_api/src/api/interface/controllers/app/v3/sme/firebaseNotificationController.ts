import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { glogger } from "../../../../../helpers/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, SuccessResponseWithCount } from "../../../../../helpers/apiResponse";
import { updateNotificationStatus, findNewFirebaseNotification, findFollowUpCallsNotify,insertFollowUpCallsNotification } from "../../../../../domain/models/v3/sme.model";
import { env } from '../../../../../../infrastructure/env';
import { convertTimeZone } from "../../../../../helpers/utility";
const firebase = require("firebase-admin");

firebase.initializeApp({
    credential: firebase.credential.cert({
        "type": env.TYPE,
        "project_id": env.PROJECT_ID,
        "private_key_id": env.PRIVATE_KEY_ID,
        "private_key": env.PRIVATE_KEY,
        "client_email": env.CLIENT_EMAIL,
        "client_id": env.CLIENT_ID,
        "auth_uri": env.AUTH_URI,
        "token_uri": env.TOKEN_URI,
        "auth_provider_x509_cert_url": env.AUTH_PROVIDER_X509_CERT_URI,
        "client_x509_cert_url": env.CLIENT_X509_CERT_URL
      })
});


export const firebaseNotification = async () => {
    try {
        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
        let reqDateTime: any = {
        currentDate: getCurrentDate,
        };
        await findNewFirebaseNotification(reqDateTime, (err: any, response: any) => {
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

                        var firebaseToken = notification.notification_token;

                        var payload = {
                            "notification": {
                                "title": "" + notification.title,
                                "body": "" + notification.message,
                                "icon": "https://dev.wringg.com/wui/content/images/kommuno-favicon.png",
                            },
                            "data": {
                                "insertdate": " " + notification.insert_date_time,
                                "username": " " + notification.username,
                                "agentEmail": " " + notification.agent_email,
                                "sessionId": " " + notification.session_id,
                                "scheduleDatetime": " " +notification.schedule_date_time,
                                "agentd": " " + notification.agent_id,
                                "mode": " " +notification.mode,
                                "title": " " +notification.title,
                                "event": " "+notification.event,
                                "customerNumber": " "+notification.customer_number,
                                "callDirection": " "+notification.call_direction
                            }
                        } 
                        firebase.messaging().sendToDevice(firebaseToken, payload).then((response: any) =>{
                            if(response.successCount == 1){
                                updateNotificationStatus(regData, (err: any, response: any) => {
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

export const checkWebFollowUpCall = async () => {
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
                            "mode" : 'WEB',
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