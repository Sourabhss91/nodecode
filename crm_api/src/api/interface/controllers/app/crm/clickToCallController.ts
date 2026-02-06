import { Request, response, Response } from "express";
import { logger } from "../../../../lib/logger";
import { ErrorResponse, ErrorResWithSuccess, SuccessResponse, ErrorEmptyResponse, notFoundResponse, userExistsError } from "../../../../helpers/apiResponse";
import {
  addClickToCall,
  findSmeLongcode,
  findAgentLongcode,
  findPilotNumber,
  findAgentDetails,
  findCallscheduleData,
  findIvrCallBackUrl,
  findIvrAgentDetails,
  findIvrCallBackRecording,
  findSmeExist,
  findVirtualNumberSmeWise,
  getAgentTimeForToday,
  findKomunoSitesUrlByCallMode,
  FindAllSmeIvrPlan,
} from "../../../../domain/models/crm.model";
import { addClickToCallRequest, fetchCallbackRequest, fetchivrOutgoingCallbackRequest } from "../../../../domain/entities/crm.entity";
import { getRandomNumber, convertTimeZone, timeToMinutes, getCurrentTime } from "../../../../helpers/utility";
import { glogger } from "../../../../helpers/logger";
const axios = require("axios");
var requestClient = require("request");
/**
 * get settings.
 *
 * @returns {Object}
 */

export const clickToCallbackup_06_06_2023 = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let dateTime = convertTimeZone("IST", "resultTimeZone", req.body.scheduleDateTime);

    let countryCode = "";

    if (req.body.countryCode == "IND" || req.body.countryCode == "ind") {
      countryCode = "+91";
    } else {
      glogger("ERR", "" + req.body.sessionId + "", "/ivr/" + req.params.id + "/clickToCall", "FindclicktoCall, error:" + "Invalid countryCode");
      return ErrorResponse(res, "Invalid countryCode ");
    }

    let reqData: addClickToCallRequest = {
      accountSid: req.body.accountSid,
      agentGroup: req.body.agentGroup ? req.body.agentGroup : null,
      agentNumber: countryCode + req.body.agentNumber.slice(req.body.agentNumber.length - 10),
      callMode: req.body.callMode,
      callPriority: req.body.callPriority,
      customDtmf: req.body.customDtmf ? req.body.customDtmf : null,
      customDtmfFlag: req.body.customDtmfFlag ? req.body.customDtmfFlag : null,
      liveEvent: req.body.liveEvent ? req.body.liveEvent : null,
      liveEventFlag: req.body.liveEventFlag ? req.body.liveEventFlag : null,
      mediaFileFlag: req.body.mediaFileFlag ? req.body.mediaFileFlag : null,
      mediaFileId: req.body.mediaFileId ? req.body.mediaFileId : null,
      nameFileFlag: req.body.nameFileFlag ? req.body.nameFileFlag : null,
      nameFileId: req.body.nameFileId ? req.body.nameFileId : null,
      optionalField: req.body.optionalField ? req.body.optionalField : null,
      pilotNumber: countryCode + req.body.pilotNumber.slice(req.body.pilotNumber.length - 10),
      recordingFlag: req.body.recordingFlag ? req.body.recordingFlag : null,
      scheduleDateTime: dateTime,
      sessionId: req.body.sessionId,
      smeId: req.body.smeId,
      timeLimit: req.body.timeLimit ? req.body.timeLimit : null,
      to: countryCode + req.body.to.slice(req.body.to.length - 10),
    };

    await findSmeExist(reqData, (err: any, responseSme: any) => {
      if (err) {
        glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findSmeExist, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (responseSme.length > 0) {
          findAgentDetails(reqData, (err: any, responseAgent: any) => {
            if (err) {
              glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findAgentDetails, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              if (responseAgent.length > 0) {
                findPilotNumber(reqData, (err: any, responseP: any) => {
                  if (err) {
                    glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findPilotNumber, error:" + err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    if (responseP.length > 0) {
                      let newData: any = {
                        virtualNumber: countryCode + req.body.pilotNumber.slice(req.body.pilotNumber.length - 10),
                        insertDateTime: getCurrentDate,
                        longcodeSiteName: responseP[0].name,
                      };

                      addClickToCall(reqData, newData, (err: any, response: any) => {
                        if (err) {
                          glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "addClickToCall, error:" + err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          let ResponseCustom = {
                            callScheduleId: response[0],
                            sessionId: reqData.sessionId,
                            virtualNumber: req.body.pilotNumber,
                            smeId: req.body.smeId,
                            dateTime: req.body.scheduleDateTime,
                          };
                          glogger("DEB", "" + req.body.sessionId + "", "/ivr/schedule/callback", "addClickToCall, success:" + "SuccessResponse");
                          return SuccessResponse(res, "Successfully Scheduled", ResponseCustom);
                        }
                      });
                    } else {
                      findSmeLongcode(reqData, (err: any, responseB: any) => {
                        if (err) {
                          glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findSmeLongcode, error:" + err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          if (responseB.length > 0) {
                            let a = getRandomNumber(responseB);
                            let newData: any = {
                              virtualNumber: "+" + a.longcode,
                              insertDateTime: getCurrentDate,
                              longcodeSiteName: responseP[0].name,
                            };
                            addClickToCall(reqData, newData, (err: any, response: any) => {
                              if (err) {
                                glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "addClickToCall, error:" + err);
                                return ErrorEmptyResponse(res, err);
                              } else {
                                let ResponseCustom = {
                                  callScheduleId: response[0],
                                  sessionId: reqData.sessionId,
                                  virtualNumber: a.longcode,
                                  smeId: req.body.smeId,
                                  dateTime: req.body.scheduleDateTime,
                                };
                                glogger("DEB", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findSmeLongcode addClickToCall, success:" + "SuccessResponse");
                                return SuccessResponse(res, "Successfully Scheduled", ResponseCustom);
                              }
                            });
                          } else {
                            findAgentDetails(reqData, (err: any, responseAgent: any) => {
                              if (err) {
                                glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findAgentDetails, error:" + err);
                                return ErrorEmptyResponse(res, err);
                              } else {
                                if (responseAgent.length > 0) {
                                  let where: any = {
                                    agentId: responseAgent[0].agent_id,
                                  };

                                  findAgentLongcode(reqData, where, (err: any, responseA: any) => {
                                    if (err) {
                                      glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findAgentLongcode, error:" + err);
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      if (responseA.length > 0) {
                                        let randomVirtualNumber = getRandomNumber(responseA);
                                        let newData: any = {
                                          virtualNumber: "+" + randomVirtualNumber.longcode,
                                          insertDateTime: getCurrentDate,
                                          longcodeSiteName: responseP[0].name,
                                        };
                                        addClickToCall(reqData, newData, (err: any, response: any) => {
                                          if (err) {
                                            glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "addClickToCall, error:" + err);
                                            return ErrorEmptyResponse(res, err);
                                          } else {
                                            let ResponseCustom = {
                                              callScheduleId: response[0],
                                              sessionId: reqData.sessionId,
                                              virtualNumber: "+" + randomVirtualNumber.longcode,
                                              smeId: req.body.smeId,
                                              dateTime: req.body.scheduleDateTime,
                                            };
                                            glogger("DEB", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findAgentLongcode addClickToCall, success:" + "SuccessResponse");
                                            return SuccessResponse(res, "Successfully Scheduled", ResponseCustom);
                                          }
                                        });
                                      } else {
                                        return ErrorEmptyResponse(res, "no virtual number available");
                                      }
                                    }
                                  });
                                } else {
                                  return ErrorEmptyResponse(res, "Agent number is not found ");
                                }
                              }
                            });
                          }
                        }
                      });
                    }
                  }
                });
              } else {
                return ErrorEmptyResponse(res, "Invalid agent number");
              }
            }
          });
        } else {
          return ErrorEmptyResponse(res, "Invalid Sme Id");
        }
      }
    });
  } catch (e) {
    ErrorResponse(res, e);
  }
};

export const clickToCall = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let dateTime = convertTimeZone("IST", "resultTimeZone", req.body.scheduleDateTime);

    let countryCode = "";

    if (req.body.countryCode == "IND" || req.body.countryCode == "ind") {
      countryCode = "+91";
    } else {
      glogger("ERR", "" + req.body.sessionId + "", "/ivr/" + req.params.id + "/clickToCall", "FindclicktoCall, error:" + "Invalid countryCode");
      return ErrorResponse(res, "Invalid countryCode ");
    }

    let reqData: addClickToCallRequest = {
      accountSid: req.body.accountSid,
      agentGroup: req.body.agentGroup ? req.body.agentGroup : null,
      agentNumber: countryCode + req.body.agentNumber.slice(req.body.agentNumber.length - 10),
      callMode: req.body.callMode,
      callPriority: req.body.callPriority,
      customDtmf: req.body.customDtmf ? req.body.customDtmf : null,
      customDtmfFlag: req.body.customDtmfFlag ? req.body.customDtmfFlag : null,
      liveEvent: req.body.liveEvent ? req.body.liveEvent : null,
      liveEventFlag: req.body.liveEventFlag ? req.body.liveEventFlag : null,
      mediaFileFlag: req.body.mediaFileFlag ? req.body.mediaFileFlag : null,
      mediaFileId: req.body.mediaFileId ? req.body.mediaFileId : null,
      nameFileFlag: req.body.nameFileFlag ? req.body.nameFileFlag : null,
      nameFileId: req.body.nameFileId ? req.body.nameFileId : null,
      optionalField: req.body.optionalField ? req.body.optionalField : null,
      pilotNumber: countryCode + req.body.pilotNumber.slice(req.body.pilotNumber.length - 10),
      recordingFlag: req.body.recordingFlag ? req.body.recordingFlag : null,
      scheduleDateTime: dateTime,
      sessionId: req.body.sessionId,
      smeId: req.body.smeId,
      timeLimit: req.body.timeLimit ? req.body.timeLimit : null,
      to: countryCode + req.body.to.slice(req.body.to.length - 10),
    };

    await findSmeExist(reqData, (err: any, responseSme: any) => {
      if (err) {
        glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findSmeExist, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (responseSme.length > 0) {
          if (responseSme[0].search_longcode_random == 1) {
            findAgentDetails(reqData, (err: any, responseAgent: any) => {
              if (err) {
                glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findAgentDetails, error:" + err);
                return ErrorEmptyResponse(res, err);
              } else {
                if (responseAgent.length > 0) {
                  let where: any = {
                    agent_id: responseAgent[0].agent_id,
                  };
                  findAgentLongcode(reqData, where, (err: any, responseA: any) => {
                    if (err) {
                      glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findAgentLongcode, error:" + err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      if (responseA.length > 0) {
                        let randomVirtualNumber = getRandomNumber(responseA);
                        let newData: any = {
                          virtualNumber: "+" + randomVirtualNumber.longcode,
                          insertDateTime: getCurrentDate,
                          longcodeSiteName: responseA[0].name,
                        };
                        addClickToCall(reqData, newData, (err: any, response: any) => {
                          if (err) {
                            glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "addClickToCall, error:" + err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            let ResponseCustom = {
                              callScheduleId: response[0],
                              sessionId: reqData.sessionId,
                              virtualNumber: "+" + randomVirtualNumber.longcode,
                              smeId: req.body.smeId,
                              dateTime: req.body.scheduleDateTime,
                            };
                            glogger("DEB", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findAgentLongcode addClickToCall, success:" + "SuccessResponse");
                            return SuccessResponse(res, "Successfully Scheduled", ResponseCustom);
                          }
                        });
                      } else {
                        findSmeLongcode(reqData, (err: any, responseB: any) => {
                          if (err) {
                            glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findSmeLongcode, error:" + err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            if (responseB.length > 0) {
                              let a = getRandomNumber(responseB);
                              let newData: any = {
                                virtualNumber: "+" + a.longcode,
                                insertDateTime: getCurrentDate,
                                longcodeSiteName: responseB[0].name,
                              };
                              addClickToCall(reqData, newData, (err: any, response: any) => {
                                if (err) {
                                  glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "addClickToCall, error:" + err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  let ResponseCustom = {
                                    callScheduleId: response[0],
                                    sessionId: reqData.sessionId,
                                    virtualNumber: a.longcode,
                                    smeId: req.body.smeId,
                                    dateTime: req.body.scheduleDateTime,
                                  };
                                  glogger("DEB", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findSmeLongcode addClickToCall, success:" + "SuccessResponse");
                                  return SuccessResponse(res, "Successfully Scheduled", ResponseCustom);
                                }
                              });
                            }
                          }
                        });
                      }
                    }
                  });
                } else {
                  return ErrorEmptyResponse(res, "Invalid agent number");
                }
              }
            });
          } else {
            findAgentDetails(reqData, (err: any, responseAgent: any) => {
              if (err) {
                glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findAgentDetails, error:" + err);
                return ErrorEmptyResponse(res, err);
              } else {
                if (responseAgent.length > 0) {
                  findPilotNumber(reqData, (err: any, responseP: any) => {
                    if (err) {
                      glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findPilotNumber, error:" + err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      if (responseP.length > 0) {
                        let newData: any = {
                          virtualNumber: countryCode + req.body.pilotNumber.slice(req.body.pilotNumber.length - 10),
                          insertDateTime: getCurrentDate,
                          longcodeSiteName: responseP[0].name,
                        };

                        addClickToCall(reqData, newData, (err: any, response: any) => {
                          if (err) {
                            glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "addClickToCall, error:" + err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            let ResponseCustom = {
                              callScheduleId: response[0],
                              sessionId: reqData.sessionId,
                              virtualNumber: req.body.pilotNumber,
                              smeId: req.body.smeId,
                              dateTime: req.body.scheduleDateTime,
                            };
                            glogger("DEB", "" + req.body.sessionId + "", "/ivr/schedule/callback", "addClickToCall, success:" + "SuccessResponse");
                            return SuccessResponse(res, "Successfully Scheduled", ResponseCustom);
                          }
                        });
                      } else {
                        findSmeLongcode(reqData, (err: any, responseB: any) => {
                          if (err) {
                            glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findSmeLongcode, error:" + err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            if (responseB.length > 0) {
                              let a = getRandomNumber(responseB);
                              let newData: any = {
                                virtualNumber: "+" + a.longcode,
                                insertDateTime: getCurrentDate,
                                longcodeSiteName: responseB[0].name,
                              };
                              addClickToCall(reqData, newData, (err: any, response: any) => {
                                if (err) {
                                  glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "addClickToCall, error:" + err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  let ResponseCustom = {
                                    callScheduleId: response[0],
                                    sessionId: reqData.sessionId,
                                    virtualNumber: a.longcode,
                                    smeId: req.body.smeId,
                                    dateTime: req.body.scheduleDateTime,
                                  };
                                  glogger("DEB", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findSmeLongcode addClickToCall, success:" + "SuccessResponse");
                                  return SuccessResponse(res, "Successfully Scheduled", ResponseCustom);
                                }
                              });
                            } else {
                              findAgentDetails(reqData, (err: any, responseAgent: any) => {
                                if (err) {
                                  glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findAgentDetails, error:" + err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  if (responseAgent.length > 0) {
                                    let where: any = {
                                      agentId: responseAgent[0].agent_id,
                                    };

                                    findAgentLongcode(reqData, where, (err: any, responseA: any) => {
                                      if (err) {
                                        glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findAgentLongcode, error:" + err);
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                        if (responseA.length > 0) {
                                          let randomVirtualNumber = getRandomNumber(responseA);
                                          let newData: any = {
                                            virtualNumber: "+" + randomVirtualNumber.longcode,
                                            insertDateTime: getCurrentDate,
                                            longcodeSiteName: responseA[0].name,
                                          };
                                          addClickToCall(reqData, newData, (err: any, response: any) => {
                                            if (err) {
                                              glogger("ERR", "" + req.body.sessionId + "", "/ivr/schedule/callback", "addClickToCall, error:" + err);
                                              return ErrorEmptyResponse(res, err);
                                            } else {
                                              let ResponseCustom = {
                                                callScheduleId: response[0],
                                                sessionId: reqData.sessionId,
                                                virtualNumber: "+" + randomVirtualNumber.longcode,
                                                smeId: req.body.smeId,
                                                dateTime: req.body.scheduleDateTime,
                                              };
                                              glogger("DEB", "" + req.body.sessionId + "", "/ivr/schedule/callback", "findAgentLongcode addClickToCall, success:" + "SuccessResponse");
                                              return SuccessResponse(res, "Successfully Scheduled", ResponseCustom);
                                            }
                                          });
                                        } else {
                                          return ErrorEmptyResponse(res, "no virtual number available");
                                        }
                                      }
                                    });
                                  } else {
                                    return ErrorEmptyResponse(res, "Agent number is not found ");
                                  }
                                }
                              });
                            }
                          }
                        });
                      }
                    }
                  });
                } else {
                  return ErrorEmptyResponse(res, "Invalid agent number");
                }
              }
            });
          }
        } else {
          return ErrorEmptyResponse(res, "Invalid Sme Id");
        }
      }
    });
  } catch (e) {
    ErrorResponse(res, e);
  }
};

export const callback = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    console.log(req.body);
    let reqData: any = {
      callScheduleId: "test",
      smeId: 12333,
    };

    return SuccessResponse(res, "Successfully Scheduled", reqData);
  } catch (e) {
    ErrorResponse(res, e);
  }
};

export const sendIvrOutgoingcallback = async (req: Request, res: Response) => {
  try {
    let reqData: fetchivrOutgoingCallbackRequest = {
      callScheduleId: req.body.callScheduleId,
      smeId: parseInt(req.params.id),
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    };

    glogger(
      "DEB",
      "" + req.body.callScheduleId + "",
      "/kcrm/" + req.params.id + "/schedule/sendIvrOutgoingcallback",
      "Request from Click2Call: callScheduleId(" + req.body.callScheduleId + "), smeId(" + req.params.id + "), startTime(" + req.body.startTime + "),  endTime(" + req.body.endTime + ")"
    );

    await findCallscheduleData(reqData, (err: any, responseData: any) => {
      if (err) {
        glogger("ERR", "" + req.body.callScheduleId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrOutgoingcallback", "findCallscheduleData, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (responseData.length > 0) {
          glogger(
            "DEB",
            "" + req.body.callScheduleId + "",
            "/kcrm/" + req.params.id + "/schedule/sendIvrOutgoingcallback",
            "DB response received for callScheduleId(" + req.body.callScheduleId + "), smeId(" + req.params.id + ")"
          );

          findIvrCallBackUrl(reqData, (err: any, responseurl: any) => {
            if (err) {
              glogger("ERR", "" + req.body.callScheduleId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrOutgoingcallback", "findIvrCallBackUrl, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              if (responseurl.length > 0) {
                if (responseurl[0].outgoing_url == "" || responseurl[0].outgoing_url == "NULL") {
                  glogger("ERR", "" + req.body.callScheduleId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrOutgoingcallback", "findIvrCallBackUrl, error:" + "No destination url found");
                  return ErrorResWithSuccess(res, "No destination url found");
                } else {
                  var options;
                  if (responseurl[0].outgoing_url_provider == "enjaysynapse") {
                    options = {
                      method: "POST",
                      url: responseurl[0].outgoing_url,
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: responseurl[0].outgoing_auth_token,
                      },
                      form: {
                        duration: responseData[0].call_duration,
                        enjay_lat_source_number: responseData[0].agent_number,
                        date_start: req.body.startTime,
                        date_end: req.body.endTime,
                        mobile_call_detect_c: 0,
                        name: responseData[0].agent_number,
                        enjay_lat_destination_number: responseData[0].to_no,
                        assigned_user_id: responseData[0].agent_number,
                        direction: "Outbound",
                        call_status: responseData[0].call_status == "Patched" ? "Held" : "Not Held",
                        logged_via: "Calllog",
                        logged_by: "IVR",
                        synapse_recording_link: "",
                      },
                    };
                  } else if (responseurl[0].outgoing_url_provider == "leadrat") {
                    let data = JSON.stringify({
                      "callStatus": responseData[0].call_status,
                      "smeId": req.params.id.toString(),
                      "sessionId": responseData[0].session_id,
                      "callMode": responseData[0].call_mode.toString(),
                      "agentNumber": responseData[0].agent_number,
                      "customerNumber": responseData[0].to_no,
                      "customDtmf": responseData[0].custom_dtmf,
                      "callDuration": responseData[0].call_duration.toString(),
                      "optionalField": responseData[0].optional_field,
                      "responseMsg": responseData[0].response_msg,
                      "recordingFile": responseData[0].recording_file_id.toString(),
                      "startTime": req.body.startTime,
                      "endTime": req.body.endTime,
                      "connected_duration": req.body.connectedDuration ? req.body.connectedDuration : 0,
                      "agentLegStatus": req.body.agentLegStatus ? req.body.agentLegStatus : 0,
                      "customerLegStatus": req.body.customerLegStatus ? req.body.customerLegStatus : 0,
                    });
                    options = {
                    'method': 'POST',
                    'url': responseurl[0].outgoing_url,
                      'headers': {
                        'API-Key': responseurl[0].outgoing_auth_token, 
                        'Content-Type': 'application/json'
                      },
                      body : data
                    };
                  }
                  else {
                    options = {
                      method: "POST",
                      url: responseurl[0].outgoing_url,
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                      },
                      form: {
                        callStatus: responseData[0].call_status,
                        smeId: parseInt(req.params.id),
                        sessionId: responseData[0].session_id,
                        callMode: responseData[0].call_mode,
                        agentNumber: responseData[0].agent_number,
                        customerNumber: responseData[0].to_no,
                        customDtmf: responseData[0].custom_dtmf,
                        callDuration: responseData[0].call_duration,
                        optionalField: responseData[0].optional_field,
                        responseMsg: responseData[0].response_msg,
                        recordingFile: responseData[0].recording_file_id,
                        startTime: req.body.startTime,
                        endTime: req.body.endTime,

                        connected_duration: req.body.connectedDuration ? req.body.connectedDuration : 0,

                        agentLegStatus: req.body.agentLegStatus ? req.body.agentLegStatus : 0,
                        customerLegStatus: req.body.customerLegStatus ? req.body.customerLegStatus : 0,
                      },
                    };
                  }

                  console.log(options);

                  requestClient(options, function (error: string | undefined, response: any) {
                    if (error) {
                      glogger(
                        "ERR",
                        "" + req.body.callScheduleId + "",
                        "/kcrm/" + req.params.id + "/schedule/sendIvrOutgoingcallback",
                        "" + responseurl[0].outgoing_url + ", far end URL response - error:" + error
                      );

                      glogger(
                        "CDR",
                        "" + req.body.callScheduleId + "",
                        "/kcrm/" + req.params.id + "/schedule/sendIvrOutgoingcallback",
                        "" +
                          responseurl[0].outgoing_url +
                          ", params:" +
                          responseData[0].call_status +
                          ", " +
                          req.params.id +
                          ", " +
                          responseData[0].session_id +
                          ", " +
                          responseData[0].call_mode +
                          ", " +
                          responseData[0].agent_number +
                          ", " +
                          responseData[0].to_no +
                          ", " +
                          responseData[0].custom_dtmf +
                          ", " +
                          responseData[0].call_duration +
                          ", " +
                          responseData[0].optional_field +
                          ", " +
                          responseData[0].response_msg +
                          ", " +
                          responseData[0].recording_file_id +
                          ", " +
                          req.body.startTime +
                          ", " +
                          req.body.endTime +
                          ", FAILED 3rd Party Response"
                      );

                      throw new Error(error);
                    } else {
                      glogger(
                        "CDR",
                        "" + req.body.callScheduleId + "",
                        "/kcrm/" + req.params.id + "/schedule/sendIvrOutgoingcallback",
                        "" +
                          responseurl[0].outgoing_url +
                          ", params:" +
                          responseData[0].call_status +
                          ", " +
                          req.params.id +
                          ", " +
                          responseData[0].session_id +
                          ", " +
                          responseData[0].call_mode +
                          ", " +
                          responseData[0].agent_number +
                          ", " +
                          responseData[0].to_no +
                          ", " +
                          responseData[0].custom_dtmf +
                          ", " +
                          responseData[0].call_duration +
                          ", " +
                          responseData[0].optional_field +
                          ", " +
                          responseData[0].response_msg +
                          ", " +
                          responseData[0].recording_file_id +
                          ", " +
                          req.body.startTime +
                          ", " +
                          req.body.endTime +
                          ", SUCCESS 3rd Party Response"
                      );
                      console.log(response.body);
                      if (response.body.length > 0) {
                        /*var resp = JSON.parse(response.body);
                        if (resp.status == 200) {
                          glogger("DEB", "" + req.body.callScheduleId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrOutgoingcallback", "" + resp.status + ", message:" + "" + resp.message + "");

                          return SuccessResponse(res, "Successfully", resp);
                        } else {
                          glogger("ERR", "" + req.body.callScheduleId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrOutgoingcallback", "" + resp.status + ", message:" + "" + resp.message + "");
                          return ErrorEmptyResponse(res, "" + resp.message + "");
                        }*/
                      } else {
                        return ErrorEmptyResponse(res, "Api failed");
                      }
                    }
                  });
                }
              } else {
                glogger(
                  "ERR",
                  "" + req.body.callScheduleId + "",
                  "/kcrm/" + req.params.id + "/schedule/sendIvrOutgoingcallback",
                  "findIvrCallBackUrl, far end url details nor received for callScheduleId(" + req.body.callScheduleId + "), smeId(" + req.params.id + ")"
                );
                return ErrorResWithSuccess(res, "No Far End URL data found");
              }
            }
          });
        } else {
          glogger(
            "ERR",
            "" + req.body.callScheduleId + "",
            "/kcrm/" + req.params.id + "/schedule/sendIvrOutgoingcallback",
            "findCallscheduleData, db response length is ZERO callScheduleId(" + req.body.callScheduleId + "), smeId(" + req.params.id + ")"
          );
          return ErrorResWithSuccess(res, "No data found");
        }
      }
    });
  } catch (e) {
    ErrorResponse(res, e);
  }
};

export const sendIvrLiveEvent = async (req: Request, res: Response) => {
  try {
    let reqdata: any = {
      smeId: parseInt(req.params.id),
      liveEvent: req.body.liveEvent,
      accountSid: req.body.accountSid,
      sessionId: req.body.sessionId,
      to: req.body.to,
      from: req.body.from,
      dateTime: req.body.dateTime,
      customDtmf: req.body.customDtmf,
      recordingFile: req.body.recordingFile,
      responseMsg: req.body.responseMsg,
      agentNumber: req.body.agentNumber,
      callMode: req.body.callMode,
      callType: req.body.callType,
      kommSessionId: req.body.kommSessionId,
      startTime: req.body.startTime ? req.body.startTime : "",
      endTime: req.body.endTime ? req.body.endTime : "",
      call_duration: req.body.call_duration ? req.body.call_duration : "",
      call_status: req.body.call_status ? req.body.call_status : "",
      connectedAgentNumber: req.body.connectedAgentNumber ? req.body.connectedAgentNumber : 0,
    };

    glogger(
      "DEB",
      "" + req.body.kommSessionId + "",
      "/kcrm/" + req.params.id + "/schedule/sendIvrLiveEvent",
      "Request from IVR: liveEvent(" + req.body.liveEvent + "), kommSessionId(" + req.body.kommSessionId + "), to(" + req.body.to + "),  from(" + req.body.from + ")"
    );

    await findIvrAgentDetails(reqdata, (err: any, responseAgent: any) => {
      if (err) {
        glogger("ERR", "" + req.body.kommSessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrLiveEvent", "findIvrAgentDetails, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        
        findIvrCallBackUrl(reqdata, (err: any, responseurl: any) => {
          if (err) {
            glogger("ERR", "" + req.body.kommSessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrLiveEvent", "findIvrCallBackUrl, error:" + err);
            return ErrorEmptyResponse(res, err);
          } else {
            if (responseurl.length > 0) {
              // if (responseurl[0].incoming_url_provider == '' || responseurl[0].incoming_url_provider == 'NULL' || (responseurl[0].incoming_url_provider != 'kommuno' || responseurl[0].incoming_url_provider != 'enjaysynapse')) {
              //   glogger('ERR', "" + req.body.kommSessionId + "", '/kcrm/' + req.params.id + '/schedule/sendIvrLiveEvent', "findIvrCallBackUrl, error:" + 'Invalid event type');
              //   return ErrorResWithSuccess(res, "Invalid incoming url provider type");
              // }
              var options;
              if (req.body.liveEvent == "evt_popup" && responseurl[0].call_popup_provider == "enjaysynapse") {
                console.log("popup");
                if (responseurl[0].call_popup_url == "" || responseurl[0].call_popup_url == "NULL") {
                  glogger("ERR", "" + req.body.kommSessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrLiveEvent", "findIvrCallBackUrl, error:" + "No call popup url found");
                  return ErrorResWithSuccess(res, "No destination url found");
                } else {
                  options = {
                    method: "POST",
                    url: responseurl[0].call_popup_url,
                    headers: {
                      "Content-Type": "application/json",
                      Accept: "application/json",
                      Authorization: responseurl[0].call_popup_auth_token,
                    },
                    form: {
                      from: req.body.from,
                      event: req.body.liveEvent,
                      uniqueid: req.body.sessionId,
                      time: req.body.dateTime,
                      nm: req.body.connectedAgentNumber,
                      to: req.body.connectedAgentNumber,
                    },
                  };
                  console.log(options);
                  requestClient(options, function (error: string | undefined, response: any) {
                    if (error) {
                      glogger("ERR", "" + req.body.kommSessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrLiveEvent", "" + responseurl[0].call_popup_url + ", error:" + error);
                    }

                    glogger("DEB", "" + req.body.kommSessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrLiveEvent", "" + responseurl[0].call_popup_url + ", success:" + "Successfully");

                    glogger(
                      "CDR",
                      "" + req.body.kommSessionId + "",
                      "/kcrm/" + req.params.id + "/schedule/sendIvrLiveEvent",
                      "" +
                        responseurl[0].call_popup_url +
                        ", params:" +
                        req.params.id +
                        ", " +
                        req.body.liveEvent +
                        ", " +
                        req.body.to +
                        ", " +
                        req.body.sessionId +
                        ", " +
                        req.body.connectedAgentNumber
                    );
                    console.log(response.body);
                    if (response.body.length > 0) {
                      /*var resp = JSON.parse(response.body);
                      if (resp.status == 200) {
                        glogger("DEB", "" + req.body.kommSessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrLiveEvent", "" + resp.status + ", message:" + "" + resp.message + "");

                        return SuccessResponse(res, "Successfully", resp);
                      } else {
                        glogger("ERR", "" + req.body.kommSessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrLiveEvent", "" + resp.status + ", message:" + "" + resp.message + "");
                        return ErrorEmptyResponse(res, "" + resp.message + "");
                      }*/
                    } else {
                      return ErrorEmptyResponse(res, "api failed");
                    }
                  });
                }
              } else {
                if (responseurl[0].incoming_url == "" || responseurl[0].incoming_url == "NULL") {
                  glogger("ERR", "" + req.body.kommSessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrLiveEvent", "findIvrCallBackUrl, error:" + "No incoming  url found");
                  return ErrorResWithSuccess(res, "No destination url found");
                } else {
                  if (responseurl[0].incoming_url_provider == "enjaysynapse") {
                    let startDateWithSimpleformat = new Date(req.body.startTime).toISOString().replace(/T/, " ").replace(/\..+/, "");
                    let endDateWithSimpleformat = new Date(req.body.endTime).toISOString().replace(/T/, " ").replace(/\..+/, "");
                    options = {
                      method: "POST",
                      url: responseurl[0].incoming_url,
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: responseurl[0].incoming_auth_token,
                      },
                      form: {
                        duration: req.body.call_duration,
                        enjay_lat_source_number: req.body.from,
                        date_start: startDateWithSimpleformat,
                        date_end: endDateWithSimpleformat,
                        mobile_call_detect_c: 0,
                        name: req.body.from,
                        enjay_lat_destination_number: req.body.connectedAgentNumber,
                        assigned_user_id: req.body.connectedAgentNumber,
                        direction: "Inbound",
                        call_status: req.body.call_status == "patched" ? "Held" : "Not Held",
                        logged_via: "Calllog",
                        logged_by: "IVR",
                        synapse_recording_link: req.body.recordingFile,
                      },
                    };
                  } else if (responseurl[0].incoming_url_provider == "4qt") {
                    let qtReqBodyParam = {
                      extension: responseAgent.length>0 && responseAgent[0].id ? responseAgent[0].id : req.body.sessionId , //call extension number.
                      callid: req.body.sessionId ? req.body.sessionId : 0, //call id number.
                      start_time: new Date(req.body.startTime).toISOString().replace(/T/, " ").replace(/\..+/, ""), //call start time
                      destination: responseAgent.length>0 && responseAgent[0].agent_number ? responseAgent[0].agent_number.substr(responseAgent[0].agent_number.length - 10) : req.body.agentNumber.substr(req.body.agentNumber.length - 10), //received agent number.
                      caller_id: responseAgent.length>0 && responseAgent[0].customer_ani ? responseAgent[0].customer_ani.substr(responseAgent[0].customer_ani.length - 10) : req.body.from.substr(req.body.from.length - 10), //customer mobile number.
                      end_time: new Date(req.body.endTime).toISOString().replace(/T/, " ").replace(/\..+/, ""), //call end time .
                      action: 1, //call action.
                      resource_url: '', //call recording url.
                      type: "I", //type of call.
                      call_duration: responseAgent.length>0 && responseAgent[0].duration ? responseAgent[0].duration : req.body.call_duration, //call duration time.
                      call_type: "I", //call type .
                      dispnumber: req.body.to ? req.body.to.substr(req.body.to.length - 10) : "0", // ivr number .
                    }
                    
                    let qtQueryString = "&extension="+qtReqBodyParam["extension"]+"&callid="+qtReqBodyParam["callid"]+"&start_time="+qtReqBodyParam["start_time"]+"&destination="+qtReqBodyParam["destination"]+"&caller_id="+qtReqBodyParam["caller_id"]+"&end_time="+qtReqBodyParam["end_time"]+"&action="+qtReqBodyParam["action"]+"&resource_url="+qtReqBodyParam["resource_url"]+"&type="+qtReqBodyParam["type"]+"&call_duration="+qtReqBodyParam["call_duration"]+"&call_type="+qtReqBodyParam["call_type"]+"&dispnumber="+qtReqBodyParam["dispnumber"]+"";
                    options = {
                      method: "GET",
                      url: responseurl[0].incoming_url+''+qtQueryString,
                      headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: responseurl[0].incoming_auth_token,
                      },
                      form: {},
                    };
                  } else if (responseurl[0].incoming_url_provider == "leadrat") {


                      console.log("for leadrat....")
                      
                      let data = JSON.stringify({
                        "smeId": req.params.id.toString(),
                        "liveEvent": req.body.liveEvent,
                        "accountSid": req.body.accountSid,
                        "sessionId": req.body.kommSessionId,
                        "to": req.body.to,
                        "from": req.body.from,
                        "dateTime": req.body.dateTime,
                        "customDtmf": req.body.customDtmf,
                        "recordingFile": req.body.recordingFile,
                        "responseMsg": req.body.responseMsg,
                        "agentNumber": req.body.agentNumber,
                        "callMode": req.body.callMode,
                        "callType": req.body.callType,
                        "agentDetials": responseAgent
                      });
                      options = {
                      'method': 'POST',
                      'url': responseurl[0].incoming_url,
                        'headers': {
                          'API-Key': responseurl[0].incoming_auth_token, 
                          'Content-Type': 'application/json'
                        },
                        body : data
                      };
                    } else {
                      options = {
                        method: "POST",
                        url: responseurl[0].incoming_url,
                        headers: {
                          "Content-Type": "application/x-www-form-urlencoded",
                          Accept: "application/json",
                          Authorization: responseurl[0].incoming_auth_token,
                        },
                          form: {
                            smeId: parseInt(req.params.id),
                            liveEvent: req.body.liveEvent,
                            accountSid: req.body.accountSid,
                            sessionId: req.body.kommSessionId,
                            to: req.body.to,
                            from: req.body.from,
                            dateTime: req.body.dateTime,
                            customDtmf: req.body.customDtmf,
                            recordingFile: req.body.recordingFile,
                            responseMsg: req.body.responseMsg,
                            agentNumber: req.body.agentNumber,
                            callMode: req.body.callMode,
                            callType: req.body.callType,
                            agentDetials: responseAgent,
                          },
                        //},
                      };
                    }
                    
                    console.log("lets hit the sendIvrLiveEvent api....")
                    console.log(options);

                    requestClient(options, function (error: string | undefined, response: any) {
                      if (error) {
                        glogger("ERR", "" + req.body.kommSessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrLiveEvent", "" + responseurl[0].incoming_url + ", error:" + error);
                      } else {

                        glogger("DEB", "" + req.body.kommSessionId + "", "success hit leadrat api for incoming..","success");
                      }
                    
                    glogger("DEB", "" + req.body.kommSessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrLiveEvent", "" + responseurl[0].incoming_url + ", success:" + "Successfully");

                    console.log(response.body);

                    glogger(
                      "CDR",
                      "" + req.body.kommSessionId + "",
                      "/kcrm/" + req.params.id + "/schedule/sendIvrLiveEvent",
                      "" +
                        responseurl[0].incoming_url +
                        ", params:" +
                        req.params.id +
                        ", " +
                        req.body.liveEvent +
                        ", " +
                        req.body.accountSid +
                        ", " +
                        req.body.kommSessionId +
                        ", " +
                        req.body.to +
                        ", " +
                        req.body.from +
                        ", " +
                        req.body.dateTime +
                        ", " +
                        req.body.customDtmf +
                        ", " +
                        req.body.recordingFile +
                        ", " +
                        req.body.responseMsg +
                        ", " +
                        req.body.agentNumber +
                        ", " +
                        req.body.callMode +
                        ", " +
                        req.body.callType +
                        ", " +
                        responseAgent
                    );
                    return SuccessResponse(res, "Successfully", response);
                    //console.log(response.body);
                    //console.log(response.body);
                    /*if (response.body.length > 0) {
                      if(typeof response.body !== "string"){ 
                        var resp = JSON.parse(response.body);
                        if (resp.status == 200) {
                          glogger("DEB", "" + req.body.kommSessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrLiveEvent", "" + resp.status + ", message:" + "" + resp.message + "");

                          return SuccessResponse(res, "Successfully", resp);
                        } else {
                          glogger("ERR", "" + req.body.kommSessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrLiveEvent", "" + resp.status + ", message:" + "" + resp.message + "");
                          return ErrorEmptyResponse(res, "" + resp.message + "");
                        }
                      } else {
                        return SuccessResponse(res, "Successfully", response.body);
                      }
                    } else {
                      glogger("ERR", "" + req.body.kommSessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrLiveEvent", "" + resp.status + ", message:" + "client side api failed");
                      return ErrorEmptyResponse(res, "api failed");
                    }*/
                  });
                }
              }
            } else {
              glogger("ERR", "" + req.body.kommSessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrLiveEvent", "" + req.params.id + ", message:" + "No url found of client api");
              return ErrorResWithSuccess(res, "No data found");
            }
          }
        });
      }
    });
  } catch (e) {
    ErrorResponse(res, e);
  }
};

export const sendIvrRecordingEvent = async (req: Request, res: Response) => {
  try {
    var recordingFile = "";
    let reqdata: any = {
      smeId: parseInt(req.params.id),
      liveEvent: req.body.liveEvent,
      accountSid: req.body.accountSid,
      sessionId: req.body.sessionId,
      to: req.body.to,
      from: req.body.from,
      dateTime: req.body.dateTime,
      customDtmf: req.body.customDtmf,
      recordingId: req.body.recordingId,
      responseMsg: req.body.responseMsg,
      agentNumber: req.body.agentNumber,
      callMode: req.body.callMode,
      callType: req.body.callType,
      kommSessionId: req.body.kommSessionId,
    };
    await findIvrAgentDetails(reqdata, (err: any, responseAgent: any) => {
      if (err) {
        glogger("ERR", "" + req.body.sessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrRecordingEvent", "findIvrAgentDetails, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
  
        findIvrCallBackRecording(reqdata, (err: any, responseRecordingurl: any) => {
          if (err) {
            glogger("ERR", "" + req.body.sessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrRecordingEvent", "findIvrCallBackRecording, error:" + err);
            return ErrorEmptyResponse(res, err);
          } else {
            if (responseRecordingurl.length > 0) {
              recordingFile = responseRecordingurl[0].merged_file;
            }
            findIvrCallBackUrl(reqdata, (err: any, responseurl: any) => {
              if (err) {
                glogger("ERR", "" + req.body.sessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrRecordingEvent", "findIvrCallBackUrl, error:" + err);
                return ErrorEmptyResponse(res, err);
              } else {

                if (responseurl.length > 0) {
                  var options = {};
                  if (responseurl[0].recording_url == "" || responseurl[0].recording_url == "NULL") {
                    glogger("ERR", "" + req.body.sessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrRecordingEvent", "findIvrCallBackUrl, error:" + "No recording_url");
                    return ErrorResWithSuccess(res, "No destination url found");
                  } else if (responseurl[0].recording_url_provider != "" && responseurl[0].recording_url_provider != "NULL" && responseurl[0].recording_url_provider == "4qt") {
                    console.log("================***********4qt***********============");
                    let qtReqBodyParam = {
                      extension: responseAgent.length>0 && responseAgent[0].id ? responseAgent[0].id : req.body.sessionId , //call extension number.
                      callid: req.body.sessionId ? req.body.sessionId : 0, //call id number.
                      start_time: req.body.dateTime, //call start time
                      destination: responseAgent.length>0 && responseAgent[0].agent_number ? responseAgent[0].agent_number.substr(responseAgent[0].agent_number.length - 10) : req.body.agentNumber.substr(req.body.agentNumber.length - 10), //received agent number.
                      caller_id: responseAgent.length>0 && responseAgent[0].customer_ani ? responseAgent[0].customer_ani.substr(responseAgent[0].customer_ani.length - 10) : req.body.from.substr(req.body.from.length - 10), //customer mobile number.
                      end_time: req.body.dateTime, //call end time .
                      action: 1, //call action.
                      resource_url: recordingFile, //call recording url.
                      type: "I", //type of call.
                      call_duration: responseAgent.length>0 && responseAgent[0].duration ? responseAgent[0].duration : req.body.call_duration, //call duration time.
                      call_type: "I", //call type .
                      dispnumber: req.body.to ? req.body.to.substr(req.body.to.length - 10) : "0", // ivr number .
                    }
                    
                    let qtQueryString = "&extension="+qtReqBodyParam["extension"]+"&callid="+qtReqBodyParam["callid"]+"&start_time="+qtReqBodyParam["start_time"]+"&destination="+qtReqBodyParam["destination"]+"&caller_id="+qtReqBodyParam["caller_id"]+"&end_time="+qtReqBodyParam["end_time"]+"&action="+qtReqBodyParam["action"]+"&resource_url="+qtReqBodyParam["resource_url"]+"&type="+qtReqBodyParam["type"]+"&call_duration="+qtReqBodyParam["call_duration"]+"&call_type="+qtReqBodyParam["call_type"]+"&dispnumber="+qtReqBodyParam["dispnumber"]+"";

                    options = {
                      method: "POST",
                      url: responseurl[0].recording_url+''+qtQueryString,
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                      },
                      form: {},
                    };


                  } else if (responseurl[0].recording_url_provider != "" && responseurl[0].recording_url_provider != "NULL" && responseurl[0].recording_url_provider == "leadrat") {
                    console.log("================*********** leadrat ***********============");
                    
                    let data = JSON.stringify({
                      "smeId": req.params.id.toString(),
                      "liveEvent": req.body.liveEvent,
                      "accountSid": req.body.accountSid,
                      "sessionId": req.body.sessionId,
                      "to": req.body.to,
                      "from": req.body.from,
                      "dateTime": req.body.dateTime,
                      "customDtmf": req.body.customDtmf,
                      "recordingFile": recordingFile,
                      "responseMsg": req.body.responseMsg && req.body.responseMsg != "" ? req.body.responseMsg.toString() : "",
                      "agentNumber": req.body.agentNumber,
                      "callMode": req.body.callMode && req.body.callMode != "" ? req.body.callMode.toString() : "",
                      "callType": req.body.callType,
                      "agentDetials": responseAgent,
                    });
                    options = {
                    'method': 'POST',
                    'url': responseurl[0].recording_url,
                      'headers': {
                        'API-Key': responseurl[0].recording_auth_token, 
                        'Content-Type': 'application/json'
                      },
                      body : data
                    };
                  } else if (responseurl[0].recording_url_provider == "" || responseurl[0].recording_url_provider == "NULL" || responseurl[0].recording_url_provider != "kommuno") {
                    glogger("ERR", "" + req.body.sessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrRecordingEvent", "findIvrCallBackUrl, error:" + "No recording_url_provider");
                    return ErrorResWithSuccess(res, "Invalid event type");
                  } else {
                    console.log("================kommmuno============");
                    options = {
                      method: "POST",
                      url: responseurl[0].recording_url,
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                      },
                      form: {
                        smeId: parseInt(req.params.id),
                        liveEvent: req.body.liveEvent,
                        accountSid: req.body.accountSid,
                        sessionId: req.body.sessionId,
                        to: req.body.to,
                        from: req.body.from,
                        dateTime: req.body.dateTime,
                        customDtmf: req.body.customDtmf,
                        recordingFile: recordingFile,
                        responseMsg: req.body.responseMsg,
                        agentNumber: req.body.agentNumber,
                        callMode: req.body.callMode,
                        callType: req.body.callType,
                        agentDetials: responseAgent,
                      },
                    
                    };
                  }
                  console.log(options);
                  requestClient(options, function (error: string | undefined, response: any) {
                    if (error) {
                      glogger("ERR", "" + req.body.sessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrRecordingEvent", "" + responseurl[0].recording_url + ", error:" + error);
                    }
                    
                    glogger("DEB", "" + req.body.sessionId + "", "/kcrm/" + req.params.id + "/schedule/sendIvrRecordingEvent", "" + responseurl[0].recording_url + ", success:" + "Successfully");

                    glogger(
                      "CDR",
                      "" + req.body.sessionId + "",
                      "/kcrm/" + req.params.id + "/schedule/sendIvrLiveEvent",
                      "" +
                        responseurl[0].recording_url +
                        ", params:" +
                        req.params.id +
                        ", " +
                        req.body.liveEvent +
                        ", " +
                        req.body.accountSid +
                        ", " +
                        req.body.sessionId +
                        ", " +
                        req.body.to +
                        ", " +
                        req.body.from +
                        ", " +
                        req.body.dateTime +
                        ", " +
                        req.body.customDtmf +
                        ", " +
                        recordingFile +
                        ", " +
                        req.body.responseMsg +
                        ", " +
                        req.body.agentNumber +
                        ", " +
                        req.body.callMode +
                        ", " +
                        req.body.callType +
                        ", " +
                        responseAgent
                    );
                    console.log(response.body);
                    if (response.body.length > 0) {
                      /*if(typeof response.body !== "string"){ 
                        var resp = JSON.parse(response.body);
                        return SuccessResponse(res, "Successfully", resp.data);
                      } else {
                        return SuccessResponse(res, "Successfully", response.body);
                      }*/
                    }
                  });
                } else {
                  return ErrorResWithSuccess(res, "No data found");
                }
              }
            });
          }
        });
      }
    });
  } catch (e) {
    ErrorResponse(res, e);
  }
};

export const userClickToCall = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);

    let timestamp = Date.now().toString();
    let randomNum = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
    let sessionId = timestamp + randomNum;

    if (req.body.callMode != 2) {
      glogger("ERR", "" + sessionId + "", "/kcrm/mobileapp/user/clickToCall", "FindcallMode, error:" + "Invalid callMode");
      return ErrorResponse(res, "Invalid callMode ");
    }

    if (req.body.recordingFlag === 0 || req.body.recordingFlag === 1) {
      let status = true;
    } else {
      glogger("ERR", "" + sessionId + "", "/kcrm/mobileapp/user/clickToCall", "recordingFlag, error:" + "recordingFlag must be 1 or 0");
      return ErrorResponse(res, "Invalid recordingFlag. It must be 1 or 0");
    }

    let reqData: any = {
      Authorization: req.body.Authorization,
      smeId: req.body.smeId,
      agentNumber: req.body.callingNumber,
      callMode: req.body.callMode,
      recordingFlag: req.body.recordingFlag ? req.body.recordingFlag : 0,
      to: req.body.calledNumber,
      sessionId: sessionId,
      scheduleDateTime: getCurrentDate,
      //unrequiredFiedls

      accountSid: "",
      agentGroup: "",
      callPriority: 0,
      customDtmf: "",
      customDtmfFlag: 0,
      liveEvent: "",
      liveEventFlag: 0,
      mediaFileFlag: 0,
      mediaFileId: "",
      nameFileFlag: 0,
      nameFileId: "",
      optionalField: "",
      pilotNumber: "",

      timeLimit: 0,
    };

    glogger(
      "DEB",
      "" + sessionId + "",
      "/kcrm/mobileapp/user/clickToCall",
      "Request from clickToCall: callingNumber(" +
        req.body.callingNumber +
        "), smeId(" +
        req.body.smeId +
        "), callMode(" +
        req.body.callMode +
        "), recordingFlag(" +
        req.body.recordingFlag +
        "),  calledNumber(" +
        req.body.calledNumber +
        ")"
    );

    await findSmeExist(reqData, (err: any, responseSme: any) => {
      if (err) {
        glogger("ERR", "" + sessionId + "", "/kcrm/mobileapp/user/clickToCall", "findSmeExist, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (responseSme.length > 0) {
          findVirtualNumberSmeWise(reqData, (err: any, responseSmeVir: any) => {
            if (err) {
              glogger("ERR", "" + sessionId + "", "/ivr/schedule/callback", "findVirtualNumberSmeWise, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              if (responseSmeVir.length > 0) {
                let randomNumber = getRandomNumber(responseSmeVir);
                reqData["from"] = "+" + randomNumber.longcode;
                reqData["pilotNumber"] = "+" + randomNumber.longcode;
                let reqDataNew2: any = {
                  longcodeSiteName: responseSmeVir[0].name,
                  virtualNumber: "+" + randomNumber.longcode,
                  insertDateTime: getCurrentDate,
                };
                addClickToCall(reqData, reqDataNew2, (err: any, response: any) => {
                  if (err) {
                    glogger("ERR", "" + sessionId + "", "/ivr/schedule/callback", "addClickToCall, error:" + err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let ResponseCustom = {
                      callScheduleId: response[0],
                      sessionId: reqData.sessionId,
                      virtualNumber: "+" + randomNumber.longcode,
                    };
                    glogger(
                      "DEB",
                      "" + sessionId + "",
                      "/kcrm/mobileapp/user/clickToCall",
                      "respose from clickToCall: callScheduleId(" + response[0] + "), virtualNumber(" + randomNumber.longcode + ")  calledNumber(" + req.body.calledNumber + ")"
                    );
                    return SuccessResponse(res, "Successfully Scheduled", ResponseCustom);
                  }
                });
              } else {
                glogger("DEB", "" + sessionId + "", "/kcrm/mobileapp/user/clickToCall", "You have not any active virtual number");
                return SuccessResponse(res, "You have not any active virtual number", []);
              }
            }
          });
        } else {
          glogger("ERR", "" + sessionId + "", "/ivr/schedule/callback", "findSmeExist, error:" + "Invalid Sme Id");
          return ErrorResponse(res, "Invalid Sme Id");
        }
      }
    });
  } catch (e) {
    ErrorResponse(res, e);
  }
};

export const aiBotClickToCall = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);

    if (req.body.recordingFlag === 0 || req.body.recordingFlag === 1) {
      let status = true;
    } else {
      glogger("ERR", "" + req.body.sessionId + "", "/kcrm/aibot/aiBotClickToCall", "recordingFlag, error:" + "recordingFlag must be 1 or 0");
      return ErrorResponse(res, "Invalid recordingFlag. It must be 1 or 0");
    }

    let sessionId = req.body.sessionId;

    let reqData: any = {
      Authorization: req.body.Authorization,
      smeId: req.body.smeId,
      callMode: req.body.callMode,
      recordingFlag: req.body.recordingFlag ? req.body.recordingFlag : 0,
      to: req.body.to,
      sessionId: req.body.sessionId,
      scheduleDateTime: getCurrentDate,
      //unrequiredFiedls

      accountSid: "",
      agentGroup: "",
      callPriority: 0,
      customDtmf: "",
      customDtmfFlag: 0,
      liveEvent: "",
      liveEventFlag: 0,
      mediaFileFlag: 0,
      mediaFileId: "",
      nameFileFlag: 0,
      nameFileId: "",
      optionalField: "",
      pilotNumber: "",
      timeLimit: 0,
      agentNumber: 0,
    };

    glogger(
      "DEB",
      "" + sessionId + "",
      "/kcrm/aibot/aiBotClickToCall",
      "Request from clickToCall: callingNumber(" +
        req.body.callingNumber +
        "), smeId(" +
        req.body.smeId +
        "), callMode(" +
        req.body.callMode +
        "), recordingFlag(" +
        req.body.recordingFlag +
        "),  calledNumber(" +
        req.body.calledNumber +
        ")"
    );

    await findSmeExist(reqData, (err: any, responseSme: any) => {
      if (err) {
        glogger("ERR", "" + sessionId + "", "/kcrm/aibot/aiBotClickToCall", "findSmeExist, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (responseSme.length > 0) {
          findVirtualNumberSmeWise(reqData, (err: any, responseSmeVir: any) => {
            if (err) {
              glogger("ERR", "" + sessionId + "", "/kcrm/aibot/aiBotClickToCall", "findVirtualNumberSmeWise, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              if (responseSmeVir.length > 0) {
                let randomNumber = getRandomNumber(responseSmeVir);
                reqData["from"] = "+" + randomNumber.longcode;
                reqData["pilotNumber"] = "+" + randomNumber.longcode;
                let reqDataNew2: any = {
                  longcodeSiteName: responseSmeVir[0].name,
                  virtualNumber: "+" + randomNumber.longcode,
                  insertDateTime: getCurrentDate,
                };
                addClickToCall(reqData, reqDataNew2, (err: any, response: any) => {
                  if (err) {
                    glogger("ERR", "" + sessionId + "", "/kcrm/aibot/aiBotClickToCall", "addClickToCall, error:" + err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let ResponseCustom = {
                      callScheduleId: response[0],
                      sessionId: reqData.sessionId,
                      virtualNumber: "+" + randomNumber.longcode,
                    };
                    glogger(
                      "DEB",
                      "" + sessionId + "",
                      "/kcrm/aibot/aiBotClickToCall",
                      "respose from clickToCall: callScheduleId(" + response[0] + "), virtualNumber(" + randomNumber.longcode + ")  calledNumber(" + req.body.calledNumber + ")"
                    );
                    return SuccessResponse(res, "Successfully Scheduled", ResponseCustom);
                  }
                });
              } else {
                glogger("DEB", "" + sessionId + "", "/kcrm/aibot/aiBotClickToCall", "You have not any active virtual number");
                return SuccessResponse(res, "You have not any active virtual number", []);
              }
            }
          });
        } else {
          glogger("ERR", "" + sessionId + "", "/kcrm/aibot/aiBotClickToCall", "findSmeExist, error:" + "Invalid Sme Id");
          return ErrorResponse(res, "Invalid Sme Id");
        }
      }
    });
  } catch (e) {
    ErrorResponse(res, e);
  }
};

export const clickToCallLiveCall = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let dateTime = convertTimeZone("IST", "resultTimeZone", req.body.scheduleDateTime);

    let countryCode = "";

    if (req.body.countryCode == "IND" || req.body.countryCode == "ind") {
      countryCode = "+91";
    } else {
      glogger("ERR", "" + req.body.sessionId + "", "/ivr/" + req.params.id + "/clickToCallLiveCall", "FindclicktoCall, error:" + "Invalid countryCode");
      return ErrorResponse(res, "Invalid countryCode ");
    }

    let reqData: addClickToCallRequest = {
      accountSid: req.body.accountSid,
      agentGroup: req.body.agentGroup ? req.body.agentGroup : null,
      agentNumber: countryCode + req.body.agentNumber.slice(req.body.agentNumber.length - 10),
      callMode: req.body.callMode,
      callPriority: req.body.callPriority,
      customDtmf: req.body.customDtmf ? req.body.customDtmf : null,
      customDtmfFlag: req.body.customDtmfFlag ? req.body.customDtmfFlag : null,
      liveEvent: req.body.liveEvent ? req.body.liveEvent : null,
      liveEventFlag: req.body.liveEventFlag ? req.body.liveEventFlag : null,
      mediaFileFlag: req.body.mediaFileFlag ? req.body.mediaFileFlag : null,
      mediaFileId: req.body.mediaFileId ? req.body.mediaFileId : null,
      nameFileFlag: req.body.nameFileFlag ? req.body.nameFileFlag : null,
      nameFileId: req.body.nameFileId ? req.body.nameFileId : null,
      optionalField: req.body.optionalField ? req.body.optionalField : null,
      pilotNumber: countryCode + req.body.pilotNumber.slice(req.body.pilotNumber.length - 10),
      recordingFlag: req.body.recordingFlag ? req.body.recordingFlag : null,
      scheduleDateTime: dateTime,
      sessionId: req.body.sessionId,
      smeId: req.body.smeId,
      timeLimit: req.body.timeLimit ? req.body.timeLimit : null,
      to: countryCode + req.body.to.slice(req.body.to.length - 10),
    };

    let reqDateTime: any = {
      currentDate: getCurrentDate,
    };
    let objVal: any = {};
    await findSmeExist(reqData, (err: any, responseSme: any) => {
      if (err) {
        glogger("ERR", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "findSmeExist, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (responseSme.length > 0) {
          objVal["sme_profile"] = responseSme;

          FindAllSmeIvrPlan(reqData, (err: any, responseSmePlan: any) => {
            if (err) {
              glogger("ERR", "" + req.body.sessionId + "", "/crm/schedule/callback", "FindAllSmeIvrPlan, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              objVal["sme_plan_details"] = responseSmePlan;
              findAgentDetails(reqData, (err: any, responseAgent: any) => {
                if (err) {
                  glogger("ERR", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "findAgentDetails, error:" + err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  if (responseAgent.length > 0) {
                    objVal["agent_details"] = responseAgent;
                    let where: any = {
                      agent_id: responseAgent[0].agent_id,
                    };
                    getAgentTimeForToday(where, reqDateTime, (err: any, agentDetailTime: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if (agentDetailTime.length > 0) {
                          if (responseAgent[0].status == 2) {
                            glogger("DEB", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "findAgentLongcode, sucess:Agent is busy");
                            return userExistsError(res, "Agent is busy");
                          } else if (responseAgent[0].status == 4) {
                            glogger("DEB", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "findAgentLongcode, sucess:Agent is on lunch");
                            return userExistsError(res, "Agent is on lunch");
                          } else if (responseAgent[0].status == 0) {
                            glogger("DEB", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "findAgentLongcode, sucess:Agent is inactive");
                            return userExistsError(res, "Agent is inactive");
                          } else if (responseAgent[0].status == 1) {
                            const isAgentAvailable = isAgentOnDuty(agentDetailTime[0]["in_time"], agentDetailTime[0]["out_time"]);
                            if (!isAgentAvailable) {
                              glogger("DEB", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "findAgentLongcode, sucess:Agent is off hours");
                              return userExistsError(res, "Agent is off hours");
                            }

                            /* If search_longcode_random is set 1 for SME then it will get random longcode for click to call */
                            if (responseSme[0].search_longcode_random == 1) {
                              findAgentLongcode(reqData, where, (err: any, responseA: any) => {
                                if (err) {
                                  glogger("ERR", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "findAgentLongcode, error:" + err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  if (responseA.length > 0) {
                                    let randomVirtualNumber = getRandomNumber(responseA);
                                    let newData: any = {
                                      virtualNumber: "+" + randomVirtualNumber.longcode,
                                      insertDateTime: getCurrentDate,
                                      longcodeSiteName: responseA[0].name,
                                      longcodeSiteId: responseA[0].site_id,
                                    };
                                    addClickToCall(reqData, newData, (err: any, response: any) => {
                                      if (err) {
                                        glogger("ERR", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "addClickToCall, error:" + err);
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                        let ResponseCustom = {
                                          callScheduleId: response[0],
                                          sessionId: reqData.sessionId,
                                          virtualNumber: "+" + randomVirtualNumber.longcode,
                                          smeId: req.body.smeId,
                                          dateTime: req.body.scheduleDateTime,
                                        };
                                        glogger("DEB", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "findAgentLongcode addClickToCall, success:" + "SuccessResponse");
                                        var clinetSideResponse = favoritePupper(reqData, newData, res, objVal);
                                        clinetSideResponse.then(function (result) {
                                          if (result) {
                                            return SuccessResponse(res, "Successfully Scheduled", result);
                                          }
                                        });
                                      }
                                    });
                                  } else {
                                    findSmeLongcode(reqData, (err: any, responseB: any) => {
                                      if (err) {
                                        glogger("ERR", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "findSmeLongcode, error:" + err);
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                        if (responseB.length > 0) {
                                          let a = getRandomNumber(responseB);
                                          let newData: any = {
                                            virtualNumber: "+" + a.longcode,
                                            insertDateTime: getCurrentDate,
                                            longcodeSiteName: responseB[0].name,
                                            longcodeSiteId: responseB[0].site_id,
                                          };
                                          addClickToCall(reqData, newData, (err: any, response: any) => {
                                            if (err) {
                                              glogger("ERR", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "addClickToCall, error:" + err);
                                              return ErrorEmptyResponse(res, err);
                                            } else {
                                              let ResponseCustom = {
                                                callScheduleId: response[0],
                                                sessionId: reqData.sessionId,
                                                virtualNumber: a.longcode,
                                                smeId: req.body.smeId,
                                                dateTime: req.body.scheduleDateTime,
                                              };
                                              glogger("DEB", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "findSmeLongcode addClickToCall, success:" + "SuccessResponse");
                                              var clinetSideResponse = favoritePupper(reqData, newData, res, objVal);
                                              clinetSideResponse.then(function (result) {
                                                if (result) {
                                                  return SuccessResponse(res, "Successfully Scheduled", result);
                                                }
                                              });
                                            }
                                          });
                                        }
                                      }
                                    });
                                  }
                                }
                              });
                            } else {
                              findPilotNumber(reqData, (err: any, responseP: any) => {
                                if (err) {
                                  glogger("ERR", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "findPilotNumber, error:" + err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  if (responseP.length > 0) {
                                    let newData: any = {
                                      virtualNumber: countryCode + req.body.pilotNumber.slice(req.body.pilotNumber.length - 10),
                                      insertDateTime: getCurrentDate,
                                      longcodeSiteName: responseP[0].name,
                                      longcodeSiteId: responseP[0].site_id,
                                    };

                                    addClickToCall(reqData, newData, (err: any, response: any) => {
                                      if (err) {
                                        glogger("ERR", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "addClickToCall, error:" + err);
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                        let ResponseCustom = {
                                          callScheduleId: response[0],
                                          sessionId: reqData.sessionId,
                                          virtualNumber: req.body.pilotNumber,
                                          smeId: req.body.smeId,
                                          dateTime: req.body.scheduleDateTime,
                                        };
                                        glogger("DEB", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "addClickToCall, success:" + "SuccessResponse");
                                        var clinetSideResponse = favoritePupper(reqData, newData, res, objVal);
                                        clinetSideResponse.then(function (result) {
                                          if (result) {
                                            return SuccessResponse(res, "Successfully Scheduled", result);
                                          }
                                        });
                                      }
                                    });
                                  } else {
                                    findSmeLongcode(reqData, (err: any, responseB: any) => {
                                      if (err) {
                                        glogger("ERR", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "findSmeLongcode, error:" + err);
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                        if (responseB.length > 0) {
                                          let a = getRandomNumber(responseB);
                                          let newData: any = {
                                            virtualNumber: "+" + a.longcode,
                                            insertDateTime: getCurrentDate,
                                            longcodeSiteName: responseB[0].name,
                                            longcodeSiteId: responseB[0].site_id,
                                          };
                                          addClickToCall(reqData, newData, (err: any, response: any) => {
                                            if (err) {
                                              glogger("ERR", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "addClickToCall, error:" + err);
                                              return ErrorEmptyResponse(res, err);
                                            } else {
                                              let ResponseCustom = {
                                                callScheduleId: response[0],
                                                sessionId: reqData.sessionId,
                                                virtualNumber: a.longcode,
                                                smeId: req.body.smeId,
                                                dateTime: req.body.scheduleDateTime,
                                              };
                                              glogger("DEB", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "findSmeLongcode addClickToCall, success:" + "SuccessResponse");
                                              var clinetSideResponse = favoritePupper(reqData, newData, res, objVal);
                                              clinetSideResponse.then(function (result) {
                                                if (result) {
                                                  return SuccessResponse(res, "Successfully Scheduled", result);
                                                }
                                              });
                                            }
                                          });
                                        } else {
                                          findAgentDetails(reqData, (err: any, responseAgent: any) => {
                                            if (err) {
                                              glogger("ERR", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "findAgentDetails, error:" + err);
                                              return ErrorEmptyResponse(res, err);
                                            } else {
                                              if (responseAgent.length > 0) {
                                                let where: any = {
                                                  agentId: responseAgent[0].agent_id,
                                                };

                                                findAgentLongcode(reqData, where, (err: any, responseA: any) => {
                                                  if (err) {
                                                    glogger("ERR", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "findAgentLongcode, error:" + err);
                                                    return ErrorEmptyResponse(res, err);
                                                  } else {
                                                    if (responseA.length > 0) {
                                                      let randomVirtualNumber = getRandomNumber(responseA);
                                                      let newData: any = {
                                                        virtualNumber: "+" + randomVirtualNumber.longcode,
                                                        insertDateTime: getCurrentDate,
                                                        longcodeSiteName: responseA[0].name,
                                                        longcodeSiteId: responseA[0].site_id,
                                                      };
                                                      addClickToCall(reqData, newData, (err: any, response: any) => {
                                                        if (err) {
                                                          glogger("ERR", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "addClickToCall, error:" + err);
                                                          return ErrorEmptyResponse(res, err);
                                                        } else {
                                                          let ResponseCustom = {
                                                            callScheduleId: response[0],
                                                            sessionId: reqData.sessionId,
                                                            virtualNumber: "+" + randomVirtualNumber.longcode,
                                                            smeId: req.body.smeId,
                                                            dateTime: req.body.scheduleDateTime,
                                                          };
                                                          glogger("DEB", "" + req.body.sessionId + "", "/kcrm/clickToCallLiveCall", "findAgentLongcode addClickToCall, success:" + "SuccessResponse");
                                                          var clinetSideResponse = favoritePupper(reqData, newData, res, objVal);
                                                          clinetSideResponse.then(function (result) {
                                                            if (result) {
                                                              return SuccessResponse(res, "Successfully Scheduled", result);
                                                            }
                                                          });
                                                        }
                                                      });
                                                    } else {
                                                      return ErrorEmptyResponse(res, "no virtual number available");
                                                    }
                                                  }
                                                });
                                              } else {
                                                return ErrorEmptyResponse(res, "Agent number is not found ");
                                              }
                                            }
                                          });
                                        }
                                      }
                                    });
                                  }
                                }
                              });
                            }
                          }
                        } else {
                          return ErrorEmptyResponse(res, "Agent is off hours");
                        }
                      }
                    });
                  } else {
                    return ErrorEmptyResponse(res, "Invalid agent number");
                  }
                }
              });
            }
          });
        } else {
          return ErrorEmptyResponse(res, "Invalid Sme Id");
        }
      }
    });
  } catch (e) {
    ErrorResponse(res, e);
  }
};

function isAgentOnDuty(agentStartTimeStr: string, agentEndTimeStr: string) {
  // Convert agent start and end times to minutes from midnight
  const agentStartTimeMinutes = timeToMinutes(agentStartTimeStr);
  const agentEndTimeMinutes = timeToMinutes(agentEndTimeStr);

  // Get the current time in minutes from midnight
  const currentTime = timeToMinutes(getCurrentTime());

  // Check if the current time is within the agent's working hours
  if (
    (currentTime >= agentStartTimeMinutes && currentTime < agentEndTimeMinutes) ||
    (agentEndTimeMinutes < agentStartTimeMinutes && (currentTime >= agentStartTimeMinutes || currentTime < agentEndTimeMinutes))
  ) {
    return true;
  }

  return false;
}

async function favoritePupper(reqData: any, newData: any, res: Response<any, Record<string, any>>, objVal: any) {
  return new Promise(async (_resolve, _reject) => {
    console.log(reqData);
    console.log(newData);
    objVal["allocated_site"] = newData;
    objVal["click2call"] = reqData;

    findKomunoSitesUrlByCallMode(reqData, newData, (err: any, sitesUrlByCallMode: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (sitesUrlByCallMode.length > 0) {
          const requestOptions = {
            method: "POST",
            url: sitesUrlByCallMode[0].url,

            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "",
            },
            data: {
              data: objVal,
            },
          };

          // Make the API request
          axios(requestOptions)
            .then((response: { data: any }) => {
              // ... perform additional processing or actions based on the response
              if (response.data.status == 1) {
                glogger("DEB", "" + reqData["sessionId"] + "", "/crm/" + reqData["smeId"] + "/clicktocallLive", "" + reqData["sessionId"] + ", message:" + "" + response.data + "");
                return SuccessResponse(res, response.data.message, []);
              } else {
                console.error("API request error:", response.data.message);
                return ErrorEmptyResponse(res, "API request failed");
              }
            })
            .catch((error: any) => {
              // Handle any errors that occur during the API request
              //console.error('API request error:', error);
              glogger("ERR", "" + reqData["sessionId"] + "", "/crm/clicktocallLive", "findKomunoSitesUrlByCallMode, error:" + error);
              if (error.code === "ECONNABORTED") {
                console.error("API request timed out.");
                if (error.request) {
                  //console.log('Request details:', error.request.method, error.request.path);
                  return ErrorEmptyResponse(res, "API request timed out.");
                }
                // Handle the timeout error message and request details here
              } else {
                console.error("API request failed:", error.message);
                return ErrorEmptyResponse(res, "API request failed.");
                // Handle other errors here
              }
              // ... perform error handling or logging
            });
        } else {
          return notFoundResponse(res, "Site url not found");
        }
      }
    });
  });
}
