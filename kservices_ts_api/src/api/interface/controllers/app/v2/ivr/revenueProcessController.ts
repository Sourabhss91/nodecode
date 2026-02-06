import { Request, Response } from "express";
import { env } from "../../../../../../infrastructure/env";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { addrevenueProcess, checkAgentHangedData, UpdateAgentStatusFree, UpdateFreeAgentiming, updateKommunoSiteStatus, addLogSiteStatusWise } from "../../../../../domain/models/v2/ivr.model";
import { fetchRevenueRequest, fetchAgentstatusRequest } from "../../../../../domain/entities/v2/ivr.entity";
import { exit } from "process";
import { convertTimeZone } from "../../../../../helpers/utility";
import { MailSent } from "../../../../../lib/mailer";
import { glogger } from "../../../../../helpers/logger";

/**
 * get settings.
 *
 * @returns {Object}
 */

export const revenueProcess = async () => {
  try {
    let reqData: any = {
      IN_BACKDAYS: env.IN_BACKDAYS !== undefined ? env.IN_BACKDAYS : 0,
    };
    await addrevenueProcess(reqData, (err: any, response: any) => {
      if (err) {
        glogger("ERR", "Cron", "addrevenueProcess", err);
        //return ErrorEmptyResponse(res, err);
      } else {
        console.log("successfully run cron revenueProcess");
        //return SuccessResponse(res, "Successfully inserted", response);
      }
    });
  } catch (e) {
    glogger("ERR", "Cron", "Exception", e);
    //ErrorResponse(res, e);
  }
};

export const revenueProcessToday = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      IN_BACKDAYS: 1,
    };
    await addrevenueProcess(reqData, (err: any, response: any) => {
      if (err) {
        glogger("ERR", "URL:- " + req.originalUrl + " ", "addrevenueProcess", err);
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully inserted", response);
      }
    });
  } catch (e) {
    glogger("ERR", "URL:- " + req.originalUrl + " ", "Exception", e);
    ErrorResponse(res, e);
  }
};

export const checkAgentHanged = async () => {
  try {

    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqDateTime: any = {
      currentDate: getCurrentDate,
    };

    await checkAgentHangedData(reqDateTime, (err: any, response: any) => {
      if (err) {
        glogger("ERR", "Cron", "checkAgentHangedData", err);
      } else {
        if (response && response.length > 0) {
          var message = "<h3>These agents were hanged. Now has been released</h3>";
          for (let agent of response) {
            let reqDataAgent: fetchAgentstatusRequest = {
              agent_id: parseInt(agent.agent_id),
            };

            message = message + "<p>" + agent.agent_name + "(" + agent.agent_mobile + ") agent of " + agent.client_name + "(" + agent.client_id + ") client - " + agent.recent_call_date_time + "</p>";

            UpdateAgentStatusFree(reqDataAgent, (err: any, response: any) => {
              if (err) {
                glogger("ERR", "Cron", "UpdateAgentStatusFree", err);
              } else {
                UpdateFreeAgentiming(reqDataAgent, reqDateTime, (err: any, response2: any) => {
                  if (err) {
                    glogger("ERR", "Cron", "UpdateFreeAgentiming", err);
                  } else {
                  }
                });
              }
            });
          }
          var to = "munish.kumar@kommuno.com, ankit.mithal@kommuno.com, tarsem.singh@kommuno.com";
          let emailDataRequest: any = {
            'to': to,
            'subject': 'Agent Hanged Information',
            'message': message
          };

          MailSent(emailDataRequest);
        }
        console.log("successfully run cron checkAgentHanged");
        //return SuccessResponse(res, "Successfully inserted", response);
      }
    });
  } catch (e) {
    glogger("ERR", "Cron ", "Exception", e);
    //ErrorResponse(res, e);
  }
};


export const updateSiteStatus = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      siteName: req.body.siteName,
      status: req.body.status,
    };
    await updateKommunoSiteStatus(reqData, (err: any, response: any) => {
      if (err) {
        glogger("ERR", "Cron", "updateKommunoSiteStatus", err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          let logdata: any = {
            siteName: req.body.siteName,
            status: req.body.status > 0 ? 'UP' : 'DOWN',
            insertdateTime: getCurrentDate
          };
          addLogSiteStatusWise(logdata, (err: any, response: any) => {
            if (err) {
              glogger("ERR", "Cron", "addLogSiteStatusWise", err);
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Successfully inserted", response);
            }
          });
        }

      }
    });
  } catch (e) {
    glogger("ERR", "Cron", "Exception", e);
    ErrorResponse(res, e);
  }
};