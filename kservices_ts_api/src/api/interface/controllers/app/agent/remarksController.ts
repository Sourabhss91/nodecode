import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../helpers/apiResponse";
import { FindRemarks, SetRemarks, FindListRemarks } from "../../../../domain/models/agent.model";
import { remarksRequest, setRemarksRequest, fetchListRemarksRequest } from "../../../../domain/entities/agent.entity";
import { env } from '../../../../../infrastructure/env';
import { convertTimeZone } from "../../../../helpers/utility";
import {
  InsertLaunchIn,
  UpdateLaunchInAgent,
  UpdateLaunchInAgentOut,
  getAgentDetailsLaunch,
  getAgentDetails,
  UpdateLaunchDetailsInAgentOut,
  getAgentDetailsLaunchNext,
  getTimeForToday,
  updateactiveBreakTimeSummary,
  FindAgentTotalInOutBreakTime,
} from "../../../../domain/models/mobileapp.model";
import { Constants } from "../../../../config/constants";

/**
 * get settings.
 *
 * @returns {Object}
 */

export const getRemarks = async (req: Request, res: Response) => {
  try {
    let reqData: remarksRequest = {
      id: parseInt(req.params.id),
      callDirection: req.body.callDirection,
      sessionId: req.body.sessionId,
    };
    await FindRemarks(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};

/**
 * get settings.
 *
 * @returns {Object}
 */

export const setRemarks = async (req: Request, res: Response) => {
  try {
    let reqData: setRemarksRequest = {
      id: parseInt(req.params.id),
      callDirection: req.body.callDirection,
      sessionId: req.body.sessionId,
      remarks: req.body.remarks,
    };
    await SetRemarks(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

/**
 * get getListRemarks.
 *
 * @returns {Object}
 */

export const getListRemarks = async (req: Request, res: Response) => {
  try {
    let reqData: fetchListRemarksRequest = {
      id: parseInt(req.params.id),
      callDirection: req.body.callDirection,
      customerNumber: req.body.customerNumber,
    };
    await FindListRemarks(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const userBreakIn = async (req: Request, res: Response) => {
  try {
    console.log(req.params);
    console.log(req.body);
    //return;
    let agentId = req.params.id;
    let dateTime = req.body.startDate;
    let date = new Date(req.body.startDate);

    let inmnth = date.getMonth() + 1;
    let reqData: any = {
      sme_id: parseInt(req.body.smeId),
      agent_id: parseInt(agentId),
      insert_date: date.getFullYear() + "-" + inmnth + "-" + date.getDate(),
      in_time: dateTime,
      message: req.body.message ? req.body.message : "",
      start_date: date.getFullYear() + "-" + inmnth + "-" + date.getDate() + " 00:00:00",
      end_date: date.getFullYear() + "-" + inmnth + "-" + date.getDate() + " 23:59:59",
    };

    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqDateTime: any = {
      currentDate: getCurrentDate,
    };

    await getAgentDetails(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          console.log(response);
          getTimeForToday(reqData, reqDateTime, (err: any, agentDetailTime: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              if (agentDetailTime.length > 0) {
                var s = agentDetailTime[0]["in_time"].split(":");
                console.log(s);
                var dt1 = new Date(date.getFullYear(), inmnth, date.getDate(), parseInt(s[0]), parseInt(s[1]), parseInt(s[2]));

                var e = agentDetailTime[0]["out_time"].split(":");
                var dt2 = new Date(date.getFullYear(), inmnth, date.getDate(), parseInt(e[0]), parseInt(e[1]), parseInt(e[2]));

                if (date >= dt1 && date <= dt2) {
                  return ErrorEmptyResponse(res, "Agent not eligible for lunch entry");
                } else {
                  if (response[0]["status"] == Constants.BREAK_STATUE.IN || response[0]["status"] == Constants.BREAK_STATUE.OUT) {
                    getAgentDetailsLaunchNext(reqData, (err: any, responseLastEntry: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if (responseLastEntry.length == 0) {
                          InsertLaunchIn(reqData, (err: any, response: any) => {
                            if (err) {
                              return ErrorEmptyResponse(res, err);
                            } else {
                              let reqDataAgent: any = {
                                sme_id: parseInt(req.body.smeId),
                                agent_id: parseInt(agentId),
                                insert_time: dateTime,
                                in_time: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
                                status: Constants.BREAK_STATUE.IN,
                              };
                              UpdateLaunchInAgent(reqDataAgent, (err: any, response: any) => {
                                return SuccessResponse(res, "Successfully In", response);
                              });
                            }
                          });
                        } else {
                          return ErrorEmptyResponse(res, "Agent is already on lunch");
                        }
                      }
                    });
                  } else {
                    return ErrorEmptyResponse(res, "Agent not eligible for lunch entry");
                  }
                }
              } else {
                return ErrorEmptyResponse(res, "Agent not eligible for lunch entry");
              }
            }
          });
        } else {
          return ErrorEmptyResponse(res, "Invalid agent");
        }
      }
    });
  } catch (e) {
    if (env.NODE_ENV_ERROR_LOG == "yes") {
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};

/**
 * get settings.
 *
 * @returns {Object}
 */

export const userBreakOut = async (req: Request, res: Response) => {
  try {
    let agentId = req.params.id;
    //let callingDetailRequest = JSON.parse(req.body.callingDetailRequest);
    // let dateTime = new Date("2022-07-11T10:49:01.004Z").toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
    // let date = new Date("2022-07-11T10:49:01.004Z");
    let dateTime = req.body.endDate;
    let date = new Date(req.body.endDate);
    let inmnth = date.getMonth() + 1;

    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqDateTime: any = {
      currentDate: getCurrentDate,
    };

    let reqData: any = {
      sme_id: parseInt(req.body.smeId),
      agent_id: parseInt(agentId),
      insert_date: date.getFullYear() + "-" + inmnth + "-" + date.getDate(),
      in_time: dateTime,
      message: req.body.message ? req.body.message : "",
      start_date: date.getFullYear() + "-" + inmnth + "-" + date.getDate() + " 00:00:00",
      end_date: date.getFullYear() + "-" + inmnth + "-" + date.getDate() + " 23:59:59",
      currentDateTime: getCurrentDate ? getCurrentDate : ""
    };

    let TotalActiveTime = 0;
    let TotalBreakTime = 0;
 
    
    await getAgentDetails(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          getTimeForToday(reqData, reqDateTime, (err: any, agentDetailTime: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              if (agentDetailTime.length > 0) {
                var s = agentDetailTime[0]["in_time"].split(":");
                var dt1 = new Date(date.getFullYear(), inmnth, date.getDate(), parseInt(s[0]), parseInt(s[1]), parseInt(s[2]));

                var e = agentDetailTime[0]["out_time"].split(":");
                var dt2 = new Date(date.getFullYear(), inmnth, date.getDate(), parseInt(e[0]), parseInt(e[1]), parseInt(e[2]));
                if (date >= dt1 && date <= dt2) {
                  return ErrorEmptyResponse(res, "Agent not eligible for lunch entry");
                } else {
                  if (response[0]["status"] == Constants.BREAK_STATUE.IN || response[0]["status"] == Constants.BREAK_STATUE.OUT) {
                    getAgentDetailsLaunch(reqData, (err: any, responseLastEntry: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        console.log(responseLastEntry);
                        if (responseLastEntry.length > 0) {
                          let reqDataAgent: any = {
                            sme_id: parseInt(req.body.smeId),
                            agent_id: parseInt(agentId),
                            out_time: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
                            in_time: dateTime,
                            status: Constants.BREAK_STATUE.OUT,
                            message: req.body.message,
                            currentDateTime: getCurrentDate 
                          };
                          UpdateLaunchInAgentOut(reqDataAgent, (err: any, response: any) => {});
                          for(let data of responseLastEntry){
                            let where: any = { id: data.id };
                            UpdateLaunchDetailsInAgentOut(reqDataAgent, where, (err: any, response: any) => {});
                          }

                          FindAgentTotalInOutBreakTime(reqDataAgent, (err: any, responseB: any) => {
                            if (err) {
                            } else {
                              if (responseB[0] && responseB[0].break_time != null) {
                                TotalBreakTime = responseB[0].break_time;
                              } else {
                                TotalBreakTime = 0;
                              }

                              if (responseB[0] && responseB[0].active_time != 'undefined') {
                                TotalActiveTime = responseB[0].active_time;
                              } else {
                                TotalActiveTime = 0;
                              }
                              let data2: any = {
                                TotalActiveTime: TotalActiveTime,
                                TotalBreakTime: TotalBreakTime
                              }
                              updateactiveBreakTimeSummary(reqDataAgent, data2, (err: any, responseD: any) => {
                                if (err) {
                                } else {
                                  //console.log('updateAgentactiveBreakTimeProcess cron job run successfully');
                                }
                              });
                            }
                          });
                          return SuccessResponse(res, "Successfully Out", response);
                        } else {
                          return ErrorEmptyResponse(res, "Agent is not on lunch");
                        }
                      }
                    });
                  } else {
                    return ErrorEmptyResponse(res, "Agent not eligible for lunch entry");
                  }
                }
              } else {
                return ErrorEmptyResponse(res, "Agent not eligible for lunch entry");
              }
            }
          });
        } else {
          return ErrorEmptyResponse(res, "Invalid agent");
        }
      }
    });
  } catch (e) {
    if (env.NODE_ENV_ERROR_LOG == "yes") {
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};
