import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import {
  InsertLaunchIn,
  UpdateLaunchInAgent,
  UpdateLaunchInAgentOut,
  getAgentDetailsLaunch,
  getAgentDetails,
  UpdateLaunchDetailsInAgentOut,
  getAgentDetailsLaunchNext,
  getAgentDetailsLaunchList,
  getAgentDetailsLaunchGetSameDayEntry,
  getTimeForToday,
  getAngentDetails,
  getAssigneCount,
  updateactiveBreakTimeSummary,
  FindAgentTotalInOutBreakTime,
} from "../../../../../domain/models/v2/mobileapp.model";
import { launchIn, launchInAgent, launchInOut, launchInOutWhere, launchInWhereGet } from "../../../../../domain/entities/v2/mobileapp.entity";
import { json } from "body-parser";
import { Constants } from "../../../../../config/constants";
import { any } from "io-ts";
import { convertTimeZone } from "../../../../../helpers/utility";
import { env } from "../../../../../../infrastructure/env";

/**
 * get settings.
 *
 * @returns {Object}
 */

export const userBreakIn = async (req: Request, res: Response) => {
  try {
    let agentId = req.params.id;
    //let callingDetailRequest = JSON.parse(req.body.callingDetailRequest);
    let dateTime = new Date(req.body.startDate).toISOString().replace(/T/, " ").replace(/\..+/, "");
    let date = new Date(req.body.startDate);

    // let dateTime = new Date("2022-07-11T10:46:01.004Z").toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
    // let date = new Date("2022-07-11T10:46:01.004Z");

    let inmnth = date.getMonth() + 1;
    //new Date(req.body.startDate).toISOString().slice(0, 10)
    console.log(date);
    let reqData: launchIn = {
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
                              let reqDataAgent: launchInAgent = {
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
    let dateTime = new Date(req.body.endDate).toISOString().replace(/T/, " ").replace(/\..+/, "");
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
                          // let curDate = new Date();
                          // let prevDate = new Date(response[0]['insert_time'])
                          // console.log(prevDate);
                          // console.log(response[0]['insert_time']);
                          // let mm = curDate.getMonth();
                          // let premm = prevDate.getMonth();

                          // if(responseLastEntry[0]['out_time'] == null
                          // && Date.parse(curDate.getFullYear()+"-"+mm+"-"+curDate.getDate()) == Date.parse(prevDate.getFullYear()+"-"+premm+"-"+prevDate.getDate())){

                          // }else{
                          //     return ErrorEmptyResponse(res, "Agent is not on lunch");
                          // }
                          let reqDataAgent: launchInOut = {
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
                            let where: launchInOutWhere = { id: data.id };
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

/**
 * get settings.
 *
 * @returns {Object}
 */

export const userBreakList = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqDateTime: any = {
      currentDate: getCurrentDate,
    };

    let agentId = req.params.id;
    //let callingDetailRequest = JSON.parse(req.body.callingDetailRequest);
    let GetcurrentDate = new Date();
    let dateToday: any;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone == "Asia/Calcutta") {
      dateToday = new Date();
    } else {
      var ISToffSet = 330; //IST is 5:30; i.e. 60*5+30 = 330 in minutes
      let offset = ISToffSet * 60 * 1000;
      dateToday = new Date(GetcurrentDate.getTime() + offset);
    }

    let months = dateToday.getMonth() + 1;
    let reqData: launchInWhereGet = {
      agent_id: parseInt(agentId),
      start_date: dateToday.getFullYear() + "-" + months + "-" + dateToday.getDate() + " 00:00:00",
      end_date: dateToday.getFullYear() + "-" + months + "-" + dateToday.getDate() + " 23:59:59",
    };

    await getAngentDetails(reqData, (err: any, agentDetails: any) => {
      getAgentDetailsLaunchGetSameDayEntry(reqData, (err: any, sameDaysEntry: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          let schAssinedCount: any = 0;
          let schFollowUpCount: any = 0;
          let signIn: any = 0;
          let signInStr: any = 0;
          let signOut: any = 0;
          let signOutStr: any = 0;
          let totalActiveTime: any = 0;
          let status: any = 0;
          let totalActiveTimeStr: any = 0;
          let totalBreakTime: any = 0;
          let totalBreakTimeStr: any = 0;

          let agentStatus = agentDetails[0]["status"];

          signIn = agentDetails[0]["in_time"];
          var array = signIn.split(":");
          signInStr = parseInt(array[0], 10) * 60 * 60 + parseInt(array[1], 10) * 60 + parseInt(array[2], 10);

          signOut = agentDetails[0]["out_time"];
          var array2 = signOut.split(":");
          signOutStr = parseInt(array2[0], 10) * 60 * 60 + parseInt(array2[1], 10) * 60 + parseInt(array2[2], 10);

          var s1 = agentDetails[0]["in_time"].split(":");
          console.log(s1);
          var dt1 = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate(), parseInt(s1[0]), parseInt(s1[1]), parseInt(s1[2]));

          var s2 = agentDetails[0]["out_time"].split(":");
          console.log(s1);
          var dt2 = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate(), parseInt(s2[0]), parseInt(s2[1]), parseInt(s2[2]));

          totalActiveTimeStr = (dateToday.getTime() - dt1.getTime()) / 1000;

          totalActiveTime = totalActiveTimeStr;
          var dactive = Math.abs(Number(totalActiveTime));
          var hactive = Math.floor(dactive / 3600);
          var mactive = Math.floor((dactive % 3600) / 60);
          var sactive = Math.floor((dactive % 3600) % 60);

          getTimeForToday(reqData, reqDateTime, (err: any, agentDetailTime: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              if (agentDetailTime.length == 0) {
                agentStatus = 3;
              }

              let breakAr: any = [];
              let breakIn: any, breakOut: any, breakInStr: any, breakOutStr: any;
              let breakSeconds: number = 0;
              var differenceinSeconds: number = 0;
              /** today entry*/

              if (sameDaysEntry.length > 0) {
                for (let i = 0; i < sameDaysEntry.length; i++) {
                  let inDate = new Date(sameDaysEntry[i]["in_time"]);
                  let outDate = new Date(sameDaysEntry[i]["out_time"]);
                  breakIn = inDate.getTime();
                  breakOut = outDate.getTime();
                  let inmnth = inDate.getMonth() + 1;
                  breakInStr =
                    sameDaysEntry[i]["in_time"] == null
                      ? null
                      : inDate.getFullYear() + "-" + inmnth + "-" + inDate.getDate() + " " + inDate.getHours() + ":" + inDate.getMinutes() + ":" + inDate.getSeconds();
                  let outhmonth = outDate.getMonth() + 1;
                  breakOutStr =
                    sameDaysEntry[i]["out_time"] == null
                      ? null
                      : outDate.getFullYear() + "-" + outhmonth + "-" + outDate.getDate() + " " + outDate.getHours() + ":" + outDate.getMinutes() + ":" + outDate.getSeconds();

                  var startDate = new Date(sameDaysEntry[i]["out_time"]);
                  // Do your operations
                  var endDate = new Date(sameDaysEntry[i]["in_time"]);
                  if (sameDaysEntry[i]["out_time"] != null) {
                    differenceinSeconds = (startDate.getTime() - endDate.getTime()) / 1000;
                  }
                  breakSeconds += differenceinSeconds;
                  breakAr.push({
                    breakIn: breakIn,
                    breakInStr: breakInStr,
                    breakOut: breakOut,
                    breakOutStr: breakOutStr,
                  });
                }
              }

              totalActiveTime = totalActiveTimeStr - breakSeconds;

              dactive = Math.abs(Number(totalActiveTime));
              hactive = Math.floor(dactive / 3600);
              mactive = Math.floor((dactive % 3600) / 60);
              sactive = Math.floor((dactive % 3600) % 60);

              var d = Math.abs(Number(breakSeconds));
              var h = Math.floor(d / 3600);
              var m = Math.floor((d % 3600) / 60);
              var s = Math.floor((d % 3600) % 60);

              var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
              var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
              var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

              getAssigneCount(reqData, (err: any, getAssigneCountN: any) => {
                let responseArr: any = {
                  breaks: breakAr,
                  schAssinedCount: getAssigneCountN[0]["schAssinedCount"],
                  schFollowUpCount: getAssigneCountN[0]["schFollowUpCount"],
                  signIn: signInStr,
                  signInStr: signIn,
                  signOut: Math.round(signOutStr),
                  signOutStr: signOut,
                  status: agentStatus,
                  totalActiveTime: Math.round(totalActiveTimeStr),
                  totalActiveTimeStr: hactive + ":" + mactive + ":" + sactive,
                  totalBreakTime: breakSeconds,
                  totalBreakTimeStr: h + ":" + m + ":" + s,
                };

                return SuccessResponse(res, "Successfully list", responseArr);
              });
            }
          });
        }
      });
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
