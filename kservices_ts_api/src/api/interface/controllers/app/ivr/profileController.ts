import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../helpers/apiResponse";
import {
  FindSmeProfile,
  FindSelfSmeLiveCalls,
  FindAllSmeLiveCalls,
  FindSmePrompts,
  FindSmeCrmList,
  FindSmeAddressBook,
  FindSmeAgentList,
  FindSmeIvrFlow,
  FindblacklistIvrCalls,
  FindDefaultIvrFlow,
  FindAssignedAgentIdIvrCalls,
  FindLongcodeType,
  FindVirtualLongcode,
  FindAllVirtualNumbers,
  FindagentAssignedLongcode,
  FindagentNonWorkingDays,
  FindagentNonWorkingHours,
  FindAllSmeIvrPlan
} from "../../../../domain/models/ivr.model";
import { fetchCallProfileRequestValidate } from "../../../../domain/entities/ivr.entity";
import { convertTimeZone } from "../../../../helpers/utility";
import { env } from "../../../../../infrastructure/env";
import { glogger } from "../../../../helpers/logger";

/**
 * get settings.
 *
 * @returns {Object}
 */

export const fetchCallProfile = async (req: Request, res: Response) => {
  try {
    let reqData: fetchCallProfileRequestValidate = {
      callingNumber: req.body.callingNumber,
      longcode: req.body.longcode,
    };

    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqDateTime: any = {
      currentDate: getCurrentDate,
    };
    const today = new Date();
    const dayOfWeek = today.getDay();

    glogger('IMP', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "API Request callingNumber(" + req.body.callingNumber + "), longcode(" + req.body.longcode + ")");


    let obj: any = {};

    await FindSmeProfile(reqData, (err: any, response: any) => {
      if (err) {
        glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "FindSmeProfile, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if(response.length >0){
          obj["sme_profile"] = response;
          var data = JSON.parse(JSON.stringify(response[0]));
  
          let where: any = {
            sme_id: data["id"],
            longcode: req.body.longcode,
            ip_address: req.body.ipAddress,
          };
          FindAllSmeLiveCalls(where, reqDateTime, (err: any, responseAllSmeCalls: any) => {
            if (err) {
              glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "FindAllSmeLiveCalls, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              obj["all_Sme_liveCalls"] = responseAllSmeCalls;
  
              FindAllSmeIvrPlan(where, (err: any, responseActivatedPlan: any) => {
                if (err) {
                  glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "FindAllSmeIvrPlan, error:" + err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  obj["sme_ivr_plan"] = responseActivatedPlan;
                  FindSelfSmeLiveCalls(where, reqDateTime, (err: any, response2: any) => {
                    if (err) {
                      glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "FindSelfSmeLiveCalls, error:" + err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      obj["self_liveCalls"] = response2;
                      FindSmePrompts(where, (err: any, response3: any) => {
                        if (err) {
                          glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "FindSmePrompts, error:" + err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          obj["smePrompt"] = response3;
                          FindSmeCrmList(where, (err: any, response4: any) => {
                            if (err) {
                              glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "FindSmeCrmList, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              obj["crmList"] = response4;
  
                              let wheredata: any = {
                                sme_id: data["id"],
                                callingNumber: req.body.callingNumber,
                                currentDate: getCurrentDate,
                              };
  
                              FindSmeAddressBook(wheredata, (err: any, response5: any) => {
                                if (err) {
                                  glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "FindSmeAddressBook, error:" + err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  obj["addressBook"] = response5;
                                  FindSmeAgentList(wheredata, (err: any, response6: any) => {
                                    if (err) {
                                      glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "FindSmeAgentList, error:" + err);
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      obj["agentList"] = response6;
                                      FindblacklistIvrCalls(wheredata, (err: any, response8: any) => {
                                        if (err) {
                                          glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "FindblacklistIvrCalls, error:" + err);
                                          return ErrorEmptyResponse(res, err);
                                        } else {
                                          obj["blackListIvr"] = response8;
  
                                          FindagentAssignedLongcode(reqData, (err: any, responseAgentAssigned: any) => {
                                            if (err) {
                                              glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "FindagentAssignedLongcode, error:" + err);
                                              return ErrorEmptyResponse(res, err);
                                            } else {
                                              obj["agent_assigned_longcode"] = responseAgentAssigned;
                                              FindagentNonWorkingDays(where, (err: any, responseNonWorkingDay: any) => {
                                                if (err) {
                                                  glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "FindagentNonWorkingDays, error:" + err);
                                                  return ErrorEmptyResponse(res, err);
                                                } else {
                                                  if (responseNonWorkingDay.length > 0) {
  
                                                    if (responseNonWorkingDay[0].non_working_days == 1) {
                                                      responseNonWorkingDay[0]['non_working_day_profile'] =1;
  
                                                      if (dayOfWeek === 1 && responseNonWorkingDay[0].mon == 1) {
                                                        obj["non_working_day"] = responseNonWorkingDay;
                                                      } else if (dayOfWeek === 2 && responseNonWorkingDay[0].tue == 1) {
                                                        obj["non_working_day"] = responseNonWorkingDay;
                                                      } else if (dayOfWeek === 3 && responseNonWorkingDay[0].wed == 1) {
                                                        obj["non_working_day"] = responseNonWorkingDay;
                                                      } else if (dayOfWeek === 4 && responseNonWorkingDay[0].thu == 1) {
                                                        obj["non_working_day"] = responseNonWorkingDay;
                                                      } else if (dayOfWeek === 5 && responseNonWorkingDay[0].fri == 1) {
                                                        obj["non_working_day"] = responseNonWorkingDay;
                                                      } else if (dayOfWeek === 6 && responseNonWorkingDay[0].sat == 1) {
                                                        obj["non_working_day"] = responseNonWorkingDay;
                                                      } else if (dayOfWeek === 0 && responseNonWorkingDay[0].sun == 1) {
                                                        obj["non_working_day"] = responseNonWorkingDay;
                                                      } else {
                                                        responseNonWorkingDay[0]['non_working_day_profile'] =0;
                                                        obj["non_working_day"] = responseNonWorkingDay;
                                                      }
  
                                                    } else {
                                                      obj["non_working_day"] = [];
                                                    }
                                                  } else {
                                                    obj["non_working_day"] = responseNonWorkingDay;
                                                  }
  
                                                  FindagentNonWorkingHours(where, (err: any, responseNonWorkingHours: any) => {
                                                    if (err) {
                                                      glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "FindagentNonWorkingHours, error:" + err);
                                                      return ErrorEmptyResponse(res, err);
                                                    } else {
                                                      if (responseNonWorkingHours.length > 0) {
                                                        if (responseNonWorkingHours[0].non_working_hours == 1) {
                                                          const currentDateTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                                                          const currentTime = new Date(currentDateTime).toLocaleTimeString("en-US", { hour12: false }); // Returns a string in the format "HH:mm:ss"
                                                          if (currentTime >= responseNonWorkingHours[0].in_time && currentTime <= responseNonWorkingHours[0].out_time) {
                                                            responseNonWorkingHours[0]['non_working_hour_profile'] =0;
                                                            obj["non_working_hour"] = responseNonWorkingHours;
                                                          } else {
                                                            responseNonWorkingHours[0]['non_working_hour_profile'] =1;
                                                            obj["non_working_hour"] = responseNonWorkingHours;
                                                          }
                                                        } else {
                                                          obj["non_working_hour"] = [];
                                                        }
  
                                                      } else {
                                                        obj["non_working_hour"] = responseNonWorkingHours;
                                                      }
  
                                                      /* find longcode number type is it DID or Virtual Number */
                                                      FindLongcodeType(reqData, (err: any, responseLongcodeType: any) => {
                                                        if (err) {
                                                          glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "FindLongcodeType, error:" + err);
                                                          return ErrorEmptyResponse(res, err);
                                                        } else {
                                                          if (responseLongcodeType.length > 0) {
                                                             let dataType2 : any ={
                                                              site_id : responseLongcodeType[0].site_identifier
                                                             }
                                                            if (responseLongcodeType[0].number_type == 'did') {
                                                              /* if incoming longcode is DID then we have provide valid virtual number */
                                                              FindVirtualLongcode(wheredata, dataType2, (err: any, responseVirtual: any) => {
                                                                if (err) {
                                                                  glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "FindVirtualLongcode, error:" + err);
                                                                  return ErrorEmptyResponse(res, err);
                                                                } else {
                                                                  obj["out_virtual_longcode"] = responseVirtual;
                                                                }
                                                              });
                                                            } else {
                                                              obj["out_virtual_longcode"] = responseLongcodeType;
                                                            }
                                                          } else {
                                                            obj["out_virtual_longcode"] = responseLongcodeType;
                                                          }
  
                                                          FindAllVirtualNumbers(wheredata, (err: any, respFindAllVirtualNumbers: any) => {
                                                            if (err) {
                                                              glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "FindAllVirtualNumbers, error:" + err);
                                                              return ErrorEmptyResponse(res, err);
                                                            } else {
                                                              obj["all_longcodes"] = respFindAllVirtualNumbers;
                                                              FindAssignedAgentIdIvrCalls(wheredata, reqData, (err: any, respAssignedAgent: any) => {
                                                                if (err) {
                                                                  glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "FindAssignedAgentIdIvrCalls, error:" + err);
                                                                  return ErrorEmptyResponse(res, err);
                                                                } else {
                                                                  if (respAssignedAgent.length > 0 && respAssignedAgent[0].agent_id != null) {
                                                                    var status;
                                                                    if (respAssignedAgent[0].agent_status == 'off_hours') {
                                                                      status = 3;
                                                                    } else {
                                                                      status = respAssignedAgent[0].status;
                                                                    }
                                                                    let resData: any = {
                                                                      "agent_id": respAssignedAgent[0].agent_id,
                                                                      "agent_name": respAssignedAgent[0].agent_name,
                                                                      "agent_mobile": respAssignedAgent[0].agent_mobile,
                                                                      "group_name": respAssignedAgent[0].group_name,
                                                                      "status": status,
                                                                      "agent_email": respAssignedAgent[0].agent_email,
                                                                      "sticky_type": respAssignedAgent[0].sticky_type,
                                                                      "webrtc_flag": respAssignedAgent[0].webrtc_flag,
                                                                      "webrtc_registered_duration": respAssignedAgent[0].webrtc_registered_duration,
                                                                      "webrtc_registered_flag": respAssignedAgent[0].webrtc_registered_flag,
                                                                    }
                                                                    obj["assignedAgent"] = resData;
                                                                  } else {
                                                                    obj["assignedAgent"] = [];
                                                                  }
  
                                                                  FindSmeIvrFlow(where, (err: any, response7: any) => {
                                                                    if (err) {
                                                                      glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "FindSmeIvrFlow, error:" + err);
                                                                      return ErrorEmptyResponse(res, err);
                                                                    } else {
                                                                      if (response7.length > 0) {
                                                                        obj["ivrFlow"] = response7;
                                                                        glogger('DEB', "" + req.headers.sessionid + "", 'fetchCallProfile', "SuccessResponse");
                                                                        return SuccessResponse(res, "Successfully listed", obj);
                                                                      } else {
                                                                        FindDefaultIvrFlow(where, (err: any, responsecheck: any) => {
                                                                          if (err) {
                                                                            glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "FindDefaultIvrFlow, error:" + err);
                                                                            return ErrorEmptyResponse(res, err);
                                                                          } else {
                                                                            obj["ivrFlow"] = responsecheck;
                                                                            glogger('DEB', "" + req.headers.sessionid + "", 'fetchCallProfile', "SuccessResponse");
                                                                            return SuccessResponse(res, "Successfully listed", obj);
                                                                          }
                                                                        });
                                                                      }
                                                                    }
                                                                  });
                                                                }
                                                              });
                                                            }
                                                          });
                                                        }
                                                      });
                                                    }
                                                  });
                                                }
                                              });
                                            }
                                          });
                                        }
                                      });
                                    }
                                  });
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        
        }else{
          return SuccessResponse(res, "No data found", obj);
        }
      }
    });
  } catch (e) {
    glogger('ERR', "" + req.headers.sessionid + "", '/ivr/fetchCallProfile', "Exception:" + e);
    ErrorResponse(res, e);
  }
};
