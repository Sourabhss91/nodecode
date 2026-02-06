import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, notFoundResponse, userExistsError, NoDataEmptyResponse } from "../../../../../helpers/apiResponse";
import { addClickToCall, FidnAgentIdByAgentNumber, addClickToCallNew, FindSiteidVirtualNumber, checkVirtualNumberStatus, findVirtualNumberSmeWise, findSmeExist, findAgentDetails, findAgentLongcode, findSmeLongcode, getAgentTimeForToday, findKomunoSitesUrlByCallMode, FindAllSmeIvrPlan } from "../../../../../domain/models/v2/crm.model";
import { addClickToCallRequest } from "../../../../../domain/entities/v2/crm.entity";
import { env } from '../../../../../../infrastructure/env';
import { getVirtualNumberByagentId } from "../../../../../helpers/findVirtualNumber";
import { glogger } from "../../../../../helpers/logger";
import { getRandomNumber, convertTimeZone, getCurrentTime, timeToMinutes } from "../../../../../helpers/utility";

import { 
  UpdateOutgoingCampaign,
  UpdateDialersNumbers
  
} from "../../../../../domain/models/v2/ivr.model";
var requestClient = require('request');
const axios = require('axios');
/**
 * get settings.
 *
 * @returns {Object}
 */

export const clickToCall = async (req: Request, res: Response) => {
  try {
    let reqData: addClickToCallRequest = {
      Authorization: req.body.Authorization,
      accountSid: req.body.accountSid,
      agentGroup: req.body.agentGroup,
      agentNumber: req.body.agentNumber,
      callMode: req.body.callMode,
      callPriority: req.body.callPriority,
      customDtmf: req.body.customDtmf,
      customDtmfFlag: req.body.customDtmfFlag,
      from: req.body.from,
      liveEvent: req.body.liveEvent,
      liveEventFlag: req.body.liveEventFlag,
      mediaFileFlag: req.body.mediaFileFlag,
      mediaFileId: req.body.mediaFileId,
      nameFileFlag: req.body.nameFileFlag,
      nameFileId: req.body.nameFileId,
      optionalField: req.body.optionalField,
      pilotNumber: req.body.pilotNumber,
      recordingFlag: req.body.recordingFlag,
      scheduleDateTime: req.body.scheduleDateTime,
      sessionId: req.body.sessionId,
      smeId: req.body.smeId,
      timeLimit: req.body.timeLimit,
      to: req.body.to
    };
    let reqDataNew: any = {}
    await addClickToCall(reqData, reqDataNew, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        let ResponseCustom = {
          "callScheduleId": response[0],
          "sessionId": reqData.sessionId
        }
        return SuccessResponse(res, "Successfully Scheduled", ResponseCustom);
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

export const clickToCallNew = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      Authorization: req.body.Authorization,
      accountSid: req.body.accountSid,
      agentGroup: req.body.agentGroup,
      agentNumber: req.body.agentNumber,
      callMode: req.body.callMode,
      callPriority: req.body.callPriority,
      customDtmf: req.body.customDtmf,
      customDtmfFlag: req.body.customDtmfFlag,
      from: req.body.from,
      liveEvent: req.body.liveEvent,
      liveEventFlag: req.body.liveEventFlag,
      mediaFileFlag: req.body.mediaFileFlag,
      mediaFileId: req.body.mediaFileId,
      nameFileFlag: req.body.nameFileFlag,
      nameFileId: req.body.nameFileId,
      optionalField: req.body.optionalField,
      pilotNumber: req.body.pilotNumber,
      recordingFlag: req.body.recordingFlag,
      scheduleDateTime: req.body.scheduleDateTime,
      sessionId: req.body.sessionId,
      smeId: req.body.smeId,
      timeLimit: req.body.timeLimit,
      to: req.body.to
    };
    await FidnAgentIdByAgentNumber(reqData, (err: any, response: any) => {
      if (err) {
        glogger('ERR', "" + reqData["sessionId"] + "", '/crm/clickToCallNew', "FidnAgentIdByAgentNumber, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        var agentVirtualNumber = getVirtualNumberByagentId(response[0].agent_id, response[0].longcode_priority_flag);

        agentVirtualNumber.then(function (result) {
          if (result) {
            let reqFindsitedata: any = {
              "virtualNumber": result
            }
            FindSiteidVirtualNumber(reqFindsitedata, (err: any, _response2: any) => {
              if (err) {
                glogger('ERR', "" + reqData["sessionId"] + "", '/crm/clickToCallNew', "FindSiteidVirtualNumber, error:" + err);
                return ErrorEmptyResponse(res, err);
              } else {

                let reqSiteWiseId: any = {
                  "virtualNumber": result,
                  "siteId": response[0].longcode_priority_flag
                }
                addClickToCallNew(reqData, reqSiteWiseId, (err: any, response: any) => {
                  if (err) {
                    glogger('ERR', "" + reqData["sessionId"] + "", '/crm/clickToCallNew', "addClickToCallNew, error:" + err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let ResponseCustom = {
                      "callScheduleId": response[0],
                      "sessionId": reqData.sessionId
                    }
                    glogger('DEB', "" + reqData["sessionId"] + "", '/crm/clickToCallNew', "SuccessResponse");
                    return SuccessResponse(res, "Successfully Scheduled", ResponseCustom);
                  }
                });
              }
            });

          } else {
            return ErrorEmptyResponse(res, "No VirtualNumber found");
          }

        });
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

//this working for live API
export const clickToCallNew2 = async (req: Request, res: Response) => {
  try {
    let reqData: addClickToCallRequest = {
      Authorization: req.body.Authorization,
      accountSid: req.body.accountSid,
      agentGroup: req.body.agentGroup,
      agentNumber: req.body.agentNumber,
      callMode: req.body.callMode,
      callPriority: req.body.callPriority,
      customDtmf: req.body.customDtmf,
      customDtmfFlag: req.body.customDtmfFlag,
      from: req.body.from,
      liveEvent: req.body.liveEvent,
      liveEventFlag: req.body.liveEventFlag,
      mediaFileFlag: req.body.mediaFileFlag,
      mediaFileId: req.body.mediaFileId,
      nameFileFlag: req.body.nameFileFlag,
      nameFileId: req.body.nameFileId,
      optionalField: req.body.optionalField,
      pilotNumber: req.body.pilotNumber,
      recordingFlag: req.body.recordingFlag,
      scheduleDateTime: req.body.scheduleDateTime,
      sessionId: req.body.sessionId,
      smeId: req.body.smeId,
      timeLimit: req.body.timeLimit,
      to: req.body.to
    };
    await findSmeExist(reqData, (err: any, responseSme: any) => {
      if (err) {
        glogger('ERR', "" + req.body.sessionId + "", '/crm/schedule/callback', "findSmeExist, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (responseSme.length > 0) {
          /* If search_longcode_random is set 1 for SME then it will get random longcode for click to call */
          if (responseSme[0].search_longcode_random == 1) {

            findAgentDetails(reqData, (err: any, responseAgent: any) => {
              if (err) {
                glogger('ERR', "" + req.body.sessionId + "", '/crm/schedule/callback', "findAgentDetails, error:" + err);
                return ErrorEmptyResponse(res, err);
              } else {
                if (responseAgent.length > 0) {
                  let where: any = {
                    agent_id: responseAgent[0].agent_id
                  }

                  findAgentLongcode(reqData, where, (err: any, responseA: any) => {
                    if (err) {
                      glogger('ERR', "" + req.body.sessionId + "", '/crm/schedule/callback', "findAgentLongcode, error:" + err);
                      return ErrorEmptyResponse(res, err);
                    } else {

                      if (responseA.length > 0) {
                        var randomVirtualNumber = getRandomNumber(responseA);
                        reqData['from'] = '+' + randomVirtualNumber.longcode;
                        reqData['pilotNumber'] = '+' + randomVirtualNumber.longcode;
                        let newData: any = {
                          longcodeSiteName: responseA[0].name
                        }
                        addClickToCall(reqData, newData, (err: any, response: any) => {
                          if (err) {
                            glogger('ERR', "" + req.body.sessionId + "", '/crm/schedule/callback', "addClickToCall, error:" + err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            let ResponseCustom = {
                              "callScheduleId": response[0],
                              "sessionId": reqData.sessionId,
                              "virtualNumber": '+' + randomVirtualNumber.longcode,
                              "smeId": req.body.smeId,
                              "dateTime": req.body.scheduleDateTime
                            }
                            glogger('DEB', "" + req.body.sessionId + "", '/crm/schedule/callback', "findAgentLongcode addClickToCall, success:" + "SuccessResponse");
                            return SuccessResponse(res, "Successfully Scheduled", ResponseCustom);
                          }
                        });
                      } else {
                        findSmeLongcode(reqData, (err: any, responseB: any) => {
                          if (err) {
                            glogger('ERR', "" + req.body.sessionId + "", '/crm/schedule/callback', "findSmeLongcode, error:" + err);
                            return ErrorEmptyResponse(res, err);
                          } else {

                            var randomVirtualNumber = getRandomNumber(responseB);
                            reqData['from'] = '+' + randomVirtualNumber.longcode;
                            reqData['pilotNumber'] = '+' + randomVirtualNumber.longcode;

                            let newData: any = {
                              longcodeSiteName: responseB[0].name
                            }
                            addClickToCall(reqData, newData, (err: any, response: any) => {
                              if (err) {
                                glogger('ERR', "" + req.body.sessionId + "", '/crm/schedule/callback', "addClickToCall, error:" + err);
                                return ErrorEmptyResponse(res, err);
                              } else {
                                let ResponseCustom = {
                                  "callScheduleId": response[0],
                                  "sessionId": reqData.sessionId,
                                  "virtualNumber": randomVirtualNumber.longcode,
                                  "smeId": req.body.smeId,
                                  "dateTime": req.body.scheduleDateTime
                                }
                                glogger('DEB', "" + req.body.sessionId + "", '/crm/schedule/callback', "findSmeLongcode addClickToCall, success:" + "SuccessResponse");
                                return SuccessResponse(res, "Successfully Scheduled", ResponseCustom);
                              }
                            });
                          }
                        });
                      }

                    }
                  });
                } else {
                  return ErrorEmptyResponse(res, "Agent number is not found ");
                }
              }
            });

          } else {
            checkVirtualNumberStatus(reqData, (err: any, responseVir: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                if (responseVir.length > 0) {
                  let reqDataNew: any = {
                    longcodeSiteName: responseVir[0].name,
                  }

                  addClickToCall(reqData, reqDataNew, (err: any, response: any) => {
                    if (err) {
                      return ErrorEmptyResponse(res, err);
                    } else {
                      let ResponseCustom = {
                        "callScheduleId": response[0],
                        "sessionId": reqData.sessionId,
                        "smeId": req.body.smeId,
                        "dateTime": req.body.scheduleDateTime
                      }
                      return SuccessResponse(res, "Successfully Scheduled", ResponseCustom);
                    }
                  });
                } else {
                  findVirtualNumberSmeWise(reqData, (err: any, responseSmeVir: any) => {
                    if (err) {
                      return ErrorEmptyResponse(res, err);
                    } else {
                      if (responseSmeVir.length > 0) {
                        var randomNumber = getRandomNumber(responseSmeVir);
                        reqData['from'] = '+' + randomNumber.longcode;
                        reqData['pilotNumber'] = '+' + randomNumber.longcode;
                        let reqDataNew2: any = {
                          longcodeSiteName: responseSmeVir[0].name,
                        }
                        addClickToCall(reqData, reqDataNew2, (err: any, response: any) => {
                          if (err) {
                            return ErrorEmptyResponse(res, err);
                          } else {
                            let ResponseCustom = {
                              "callScheduleId": response[0],
                              "sessionId": reqData.sessionId,
                              "smeId": req.body.smeId,
                              "dateTime": req.body.scheduleDateTime
                            }
                            return SuccessResponse(res, "Successfully Scheduled", ResponseCustom);
                          }
                        });
                      } else {
                        return SuccessResponse(res, "You have not any active virtual number", []);
                      }

                    }
                  });

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
    if (env.NODE_ENV_ERROR_LOG == "yes") {
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};



//this working for live API
export const clickToCallLiveCall = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      Authorization: req.body.Authorization,
      accountSid: req.body.accountSid,
      agentGroup: req.body.agentGroup,
      agentNumber: req.body.agentNumber,
      callMode: req.body.callMode,
      callPriority: req.body.callPriority,
      customDtmf: req.body.customDtmf,
      customDtmfFlag: req.body.customDtmfFlag,
      from: req.body.from,
      liveEvent: req.body.liveEvent,
      liveEventFlag: req.body.liveEventFlag,
      mediaFileFlag: req.body.mediaFileFlag,
      mediaFileId: req.body.mediaFileId,
      nameFileFlag: req.body.nameFileFlag,
      nameFileId: req.body.nameFileId,
      optionalField: req.body.optionalField,
      pilotNumber: req.body.pilotNumber,
      recordingFlag: req.body.recordingFlag,
      scheduleDateTime: req.body.scheduleDateTime,
      sessionId: req.body.sessionId,
      smeId: req.body.smeId,
      timeLimit: req.body.timeLimit,
      to: req.body.to,
      campaign_id: req.body.campaignId ? req.body.campaignId : 0,
    };
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqDateTime: any = {
      currentDate: getCurrentDate,
    };

    let objVal: any = {};

    await findSmeExist(reqData, (err: any, responseSme: any) => {
      if (err) {
        glogger('ERR', "" + req.body.sessionId + "", '/crm/schedule/callback', "findSmeExist, error:" + err);
        updateCallError(res,reqData,err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (responseSme.length > 0) {
          objVal["sme_profile"] = responseSme;

          FindAllSmeIvrPlan(reqData, (err: any, responseSmePlan: any) => {
            if (err) {
              glogger('ERR', "" + req.body.sessionId + "", '/crm/schedule/callback', "FindAllSmeIvrPlan, error:" + err);
              updateCallError(res,reqData,err);
              return ErrorEmptyResponse(res, err);
            } else {
              objVal["sme_plan_details"] = responseSmePlan;
              findAgentDetails(reqData, (err: any, responseAgent: any) => {
                if (err) {
                  glogger('ERR', "" + req.body.sessionId + "", '/crm/schedule/callback', "findAgentDetails, error:" + err);
                  updateCallError(res,reqData,err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  if (responseAgent.length > 0) {
                    objVal["agent_details"] = responseAgent;
                    let where: any = {
                      agent_id: responseAgent[0].agent_id
                    }
                    getAgentTimeForToday(where, reqDateTime, (err: any, agentDetailTime: any) => {
                      if (err) {
                        updateCallError(res,reqData,err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if (agentDetailTime.length > 0) {
                          if (responseAgent[0].status == 2) {
                            glogger('DEB', "" + req.body.sessionId + "", '/crm/schedule/callback', "findAgentLongcode, sucess:Agent is busy");
                            updateCallError(res,reqData,"Agent is busy");
                            return userExistsError(res, "Agent is busy");
                          } else if (responseAgent[0].status == 4) {
                            glogger('DEB', "" + req.body.sessionId + "", '/crm/schedule/callback', "findAgentLongcode, sucess:Agent is on lunch");
                            updateCallError(res,reqData,"Agent is on lunch");
                            return userExistsError(res, "Agent is on lunch");
                          } else if (responseAgent[0].status == 0) {
                            glogger('DEB', "" + req.body.sessionId + "", '/crm/schedule/callback', "findAgentLongcode, sucess:Agent is inactive");
                            updateCallError(res,reqData,"Agent is inactive");
                            return userExistsError(res, "Agent is inactive");
                          } else if (responseAgent[0].status == 1) {
                            const isAgentAvailable = isAgentOnDuty(agentDetailTime[0]["in_time"], agentDetailTime[0]["out_time"]);
                            if (!isAgentAvailable) {
                              glogger('DEB', "" + req.body.sessionId + "", '/crm/schedule/callback', "findAgentLongcode, sucess:Agent is off hours");
                              updateCallError(res,reqData,"Agent is off hours");
                              return userExistsError(res, "Agent is off hours");
                            }
                            /* If search_longcode_random is set 1 for SME then it will get random longcode for click to call */
                            if (responseSme[0].search_longcode_random == 1) {
                              findAgentLongcode(reqData, where, (err: any, responseA: any) => {
                                if (err) {
                                  glogger('ERR', "" + req.body.sessionId + "", '/crm/schedule/callback', "findAgentLongcode, error:" + err);
                                  updateCallError(res,reqData,err);
                                  return ErrorEmptyResponse(res, err);
                                } else {

                                  if (responseA.length > 0) {
                                    var randomVirtualNumber = getRandomNumber(responseA);
                                    reqData['from'] = '+' + randomVirtualNumber.longcode;
                                    reqData['pilotNumber'] = '+' + randomVirtualNumber.longcode;
                                    let newData22: any = {
                                      longcodeSiteName: responseA[0].name,
                                      longcodeSiteId: responseA[0].site_id,
                                    }

                                    console.log("===============newData22===============");
                                                                        console.log(newData22);
                                                                        console.log("===============newData22===============");


                                    var clinetSideResponse = favoritePupper(reqData, newData22, res, objVal);
                                    clinetSideResponse.then(function (result) {
                                      if (result) {
                                        return SuccessResponse(res, "Successfully Scheduled", result);
                                      }
                                    }).catch((error) => {
                                      updateCallError(res,reqData,error);
                                      return ErrorEmptyResponse(res, error);
                                    });
                                  } else {
                                    findSmeLongcode(reqData, (err: any, responseB: any) => {
                                      if (err) {
                                        glogger('ERR', "" + req.body.sessionId + "", '/crm/schedule/callback', "findSmeLongcode, error:" + err);
                                        updateCallError(res,reqData,err);
                                        return ErrorEmptyResponse(res, err);
                                      } else {

                                        var randomVirtualNumber = getRandomNumber(responseB);
                                        reqData['from'] = '+' + randomVirtualNumber.longcode;
                                        reqData['pilotNumber'] = '+' + randomVirtualNumber.longcode;

                                        let newData23: any = {
                                          longcodeSiteName: responseB[0].name,
                                          longcodeSiteId: responseB[0].site_id
                                        }

                                        console.log("===============newData23===============");
                                                                        console.log(newData23);
                                                                        console.log("===============newData23===============");


                                        var clinetSideResponse = favoritePupper(reqData, newData23, res, objVal);
                                            clinetSideResponse.then(function (result) {
                                              if (result) {
                                                return SuccessResponse(res, "Successfully Scheduled", result);
                                              }
                                            }).catch((error) => {
                                              updateCallError(res,reqData,error);
                                              return ErrorEmptyResponse(res, error);
                                            });
                                      }
                                    });
                                  }

                                }
                              });
                            } else {
                              checkVirtualNumberStatus(reqData, (err: any, responseVir: any) => {
                                if (err) {
                                  updateCallError(res,reqData,err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  if (responseVir.length > 0) {
                                    let reqDataNew: any = {
                                      longcodeSiteName: responseVir[0].name,
                                      longcodeSiteId: responseVir[0].site_id,
                                    }

                                    console.log("===============reqDataNew===============");
                                                                        console.log(reqDataNew);
                                                                        console.log("===============reqDataNew===============");

                                    var clinetSideResponse = favoritePupper(reqData, reqDataNew, res, objVal);
                                    clinetSideResponse.then(function (result) {
                                      if (result) {
                                        return SuccessResponse(res, "Successfully Scheduled", result);
                                      }
                                    }).catch((error) => {
                                      updateCallError(res,reqData,error);
                                      return ErrorEmptyResponse(res, error);
                                    });
                                  } else {
                                    findVirtualNumberSmeWise(reqData, (err: any, responseSmeVir: any) => {
                                      if (err) {
                                        updateCallError(res,reqData,err);
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                        if (responseSmeVir.length > 0) {
                                          var randomNumber = getRandomNumber(responseSmeVir);
                                          reqData['from'] = '+' + randomNumber.longcode;
                                          reqData['pilotNumber'] = '+' + randomNumber.longcode;
                                          let reqDataNew2: any = {
                                            longcodeSiteName: responseSmeVir[0].name,
                                            longcodeSiteId: responseSmeVir[0].site_id,
                                          }

                                          console.log("===============reqDataNew2===============");
                                          console.log(reqDataNew2);
                                          console.log("===============reqDataNew2===============");


                                          var clinetSideResponse = favoritePupper(reqData, reqDataNew2, res, objVal);
                                              clinetSideResponse.then(function (result) {
                                                if (result) {
                                                  return SuccessResponse(res, "Successfully Scheduled", result);
                                                }
                                              }).catch((error) => {
                                                updateCallError(res,reqData,error);
                                                return ErrorEmptyResponse(res, error);
                                              });
                                        } else {
                                          updateCallError(res,reqData,"You have not any active virtual number");
                                          return SuccessResponse(res, "You have not any active virtual number", []);
                                        }

                                      }
                                    });

                                  }

                                }
                              });
                            }

                          }

                        } else {
                          updateCallError(res,reqData,"Agent is off hours");
                          return ErrorEmptyResponse(res, "Agent is off hours")
                        }
                      }
                    });
                  } else {
                    updateCallError(res,reqData,"Agent number is not found");
                    return notFoundResponse(res, "Agent number is not found ");
                  }
                }
              });

            }
          });

        } else {
          updateCallError(res,reqData,"Sme id was not found");
          return notFoundResponse(res, "Sme id was not found");
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

function isAgentOnDuty(agentStartTimeStr: string, agentEndTimeStr: string) {
  // Convert agent start and end times to minutes from midnight
  const agentStartTimeMinutes = timeToMinutes(agentStartTimeStr);
  const agentEndTimeMinutes = timeToMinutes(agentEndTimeStr);

  // Get the current time in minutes from midnight
  const now = new Date();
  const currentTime = timeToMinutes(getCurrentTime("IST", "resultTimeZone",now));
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
    
    objVal['allocated_site'] = newData;
    objVal['click2call'] = reqData;
    findKomunoSitesUrlByCallMode(reqData, newData, (err: any, sitesUrlByCallMode: any) => {
      if (err) {
        updateCallError(res,reqData,err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (sitesUrlByCallMode.length > 0) {
         
          const requestOptions = {
            method: 'POST',
            url: sitesUrlByCallMode[0].url,
            timeout: 5000,
            
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: '',
            },
            data: {
              data: objVal
            },
          };

          console.log(requestOptions);
          
          // Make the API request
          axios(requestOptions)
            .then((response: { data: any; }) => {
              
              // ... perform additional processing or actions based on the response
              if(response.data.status == 1){
                glogger('DEB', "" + reqData['sessionId'] + "", '/crm/' + reqData['smeId'] + '/clicktocallLive', "" +reqData['sessionId'] + ", message:" + "" + response.data + "");
                return SuccessResponse(res, response.data.message,[]);
              }else{
                console.error('API request error:', response.data.message);
                updateCallError(res,reqData,"API request error ");
                return ErrorEmptyResponse(res, "API request failed");
              }
              
              
            })
            .catch((error: any) => {
              // Handle any errors that occur during the API request
              //console.error('API request error:', error);
              glogger('ERR', "" + reqData['sessionId'] + "", '/crm/clicktocallLive', "findKomunoSitesUrlByCallMode, error:" + error);

              if (error.code === 'ECONNABORTED') {
                console.error('API request timed out.');
                if (error.request) {
                  //console.log('Request details:', error.request.method, error.request.path);
                  updateCallError(res,reqData,"API request timed out");
                  return ErrorEmptyResponse(res, 'API request timed out.');
                }
                // Handle the timeout error message and request details here
              } else {
                console.error('API request failed:', error.message);
                updateCallError(res,reqData,"API request failed");
                return ErrorEmptyResponse(res, 'API request failed.');
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


function updateCallError(res: Response<any, Record<string, any>>,reqData:any,message:string ) {
  if(reqData['call_mode']==6 || reqData['call_mode']==7){
    let dataSend:any={
      call_status_v2 : 3,
      sme_id: reqData['smeId'],
      campaign_id: reqData['campaign_id'],
      session_id: reqData['sessionId'],
      response_msg: message,
      call_status: 3,
    }

    UpdateOutgoingCampaign(dataSend, (err: any, response2: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        UpdateDialersNumbers(dataSend, (err: any, response3: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
           //console.log('Succesfully error ,essage updated');
          }
        });
      }
    });
   
  }
}