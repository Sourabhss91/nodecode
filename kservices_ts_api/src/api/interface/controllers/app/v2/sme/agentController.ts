import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, userExistsError } from "../../../../../helpers/apiResponse";
import { env } from "../../../../../../infrastructure/env";
import {
  FindAgentStatus,
  FindAgentList,
  FindagentInsight,
  checkCanCreateAgent,
  addAgentData,
  addAgentGroupMapping,
  addAgentDetailsTiming,
  checkAgentMobileExist,
  updateAgentData,
  updateAgentGroupMapping,
  deleteAgentDetailsTiming,
  deleteAgentData,
  FindgetInsightsAgentStatus,
  checkAgentEmailExist,
  addUser,
  addUserRole,
  deleteAgentLoncodes,
  addAgentlongcodes,
  updatetAgentPosition,
  deleteAgentDataFromUsers,
  addAgentLogs,
  deleteAgentFromDetailsTiming,
  deleteAgentDataFromUserRoles,
  getAgentExtensionCount,
  getAgentsInsightDayWiseData,
  checkAgentEmailExistInUser,
  updateAgentStatusData,
  agentActInactTimeDataIn,
  getAgentActInactTimeData,
  agentActInactTimeDataOut,
  FindAllAgentsData,
  getFailedCallCount,
  getSuccessCallCount,
  updateSuccessCallCount,
  toBreakTime,
  toActiveTime,
  updateactiveBreakTimeSummary,
  avgSuccessCallCount,
  avgRingingCallCount,
  updateAvgCallCountSummary,
  FindSmeData,
  FindagentDetails,
  FindAgentBreakTime,
  SendFirebaseNotificationSME,
  SendFirebaseNotificationAgent,
  FindAllAgentsList,
  avgTotalDuration,
  deleteAgentDataFromChangePassword,
  getSingleAgentData,
  addWebrtcAgentData,
  addSipBuddies,
  updateSeqWebrtcNumber,
  updateWebrtcAgentData,
  deleteAgentFromLongcodeMapping,
  isWebrtcAgentRegisterData,
  getAbandonedCallsData,
  FindActiveAgentOnly,
  getLiveAprData
} from "../../../../../domain/models/v2/sme.model";
import {
  fetchRequest,
  agentStatusRequest,
  fetchInsightRequest,
  addAgentRequest,
  addAgentGroupMappingRequest,
  addAgentDetailsTimingRequest,
  updateAgentRequest,
  deleteAgentRequest,
  getInsightsAgentStatusRequestValidate,
  setAgentsOrderRequest,
  addAgentExtensionRequest,
  getAgentdetailRequestValidate
} from "../../../../../domain/entities/sme.entity";
import { randomString, convertTimeZone } from "../../../../../helpers/utility";
import { MailSent } from "../../../../../lib/mailer";
import { getEmailTemplate } from "../../../../../domain/models/v2/email_template.model";

import { glogger } from "../../../../../helpers/logger";

/**
 * get settings.
 *
 * @returns {Object}
 */

export const getAgentStatus = async (req: Request, res: Response) => {
  try {
    var g_agentStatus = "";
    var g_agentStatus_op = "";
    var g_agentId = "";
    var g_agentId_op;
    if (req.body.filterList) {
      var agentData = req.body.filterList;
      for (let data of agentData) {
        if (data["name"] == "agentStatus") {
          g_agentStatus = data["val"];
          g_agentStatus_op = data["op"];
        }

        if (data["name"] == "agentId" && data["val"] > 0) {
          g_agentId = data["val"];
          g_agentId_op = data["op"];
        }
      }
    }

    let reqData: agentStatusRequest = {
      id: parseInt(req.params.id),
      agentStatus: g_agentStatus,
      agentStatus_op: g_agentStatus_op,
      agentId: g_agentId,
      agentId_op: g_agentId_op,
    };

    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqDateTime: any = {
      currentDate: getCurrentDate
    }

    await FindAgentStatus(reqData, reqDateTime, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
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

export const getAgentList = async (req: Request, res: Response) => {
  try {
    let reqData: fetchRequest = {
      id: parseInt(req.params.id),
    };
    await FindAgentList(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
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

export const agentInsight = async (req: Request, res: Response) => {
  try {
    let reqData: fetchInsightRequest = {
      sme_id: parseInt(req.params.id),
      agentId: req.body.agentId,
      endDate: req.body.endDate,
      startDate: req.body.startDate,
    };
    await FindagentInsight(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
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

export const canCreateAgent = async (req: Request, res: Response) => {
  try {
    let reqData: fetchRequest = {
      id: parseInt(req.params.id),
    };
    await checkCanCreateAgent(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
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

export const addAgent = async (req: Request, res: Response) => {
  try {

    let reqData: addAgentRequest = {
      id: parseInt(req.params.id),
      agentName: req.body.agentName ? req.body.agentName : "",
      agentMobile: req.body.agentMobile,
      status: req.body.status,
      inTime: req.body.inTime ? req.body.inTime : "",
      outTime: req.body.outTime ? req.body.outTime : "",
      daysFlag: req.body.daysFlag ? req.body.daysFlag : 0,
      agentEmail: req.body.agentEmail ? req.body.agentEmail : "",
      stickyAgent: req.body.stickyAgent ? req.body.stickyAgent : 0,
      agentMasking: req.body.agentMasking ? req.body.agentMasking : 0,
      stickyDays: req.body.stickyDays ? req.body.stickyDays : 0,
      assignFailedCalls: req.body.assignFailedCalls,
      assignVoicemailCalls: req.body.assignVoicemailCalls,
      inPermissionFlag: req.body.inPermissionFlag,
      outPermissionFlag: req.body.outPermissionFlag,
      role: "Agent",
      password: randomString(10),
      selectedLongCode: req.body.longCodes,
      clientName: req.body.clientName ? req.body.clientName : "",
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : "0000-00-00 00:00:00",
      breakPermissionFlag: req.body.breakPermissionFlag ? req.body.breakPermissionFlag : 0,
      virtualNumberPriority: req.body.virtualNumberPriority ? req.body.virtualNumberPriority : 0,
      recordingType: req.body.recordingType ? req.body.recordingType : 0,
    };

    await checkAgentMobileExist(reqData, (err: any, response: any) => {
      if (response && response.length > 0) {
        return userExistsError(res, "Mobile number already used by another agent");
      } else {
        if (reqData["agentEmail"] && reqData["agentEmail"] != "") {
          checkAgentEmailExist(reqData, (err: any, response: any) => {
            if (response && response.length > 0) {
              return userExistsError(res, "Email already used by another agent");
            } else {
              addUser(reqData, (err: any, response: any) => {
                if (err) {
                  return ErrorEmptyResponse(res, err);
                } else {
                  addUserRole(reqData, (err: any, response: any) => {
                    if (err) {
                      return ErrorEmptyResponse(res, err);
                    } else {
                      getAgentExtensionCount(reqData, (err: any, responseC: any) => {
                        if (err) {
                          return ErrorEmptyResponse(res, err);
                        } else {
                          if (responseC[0].agent_extention != null) {
                            var agent_extension = (responseC[0].agent_extention + 1);
                          } else {
                            var agent_extension = (responseC[0].agent_extention);
                          }

                          if (responseC[0].agent_position != null) {
                            var agent_position = (responseC[0].agent_position + 1);
                          } else {
                            var agent_position = (responseC[0].agent_position);
                          }

                          let reqDataNew: addAgentExtensionRequest = {
                            agentExtension: agent_extension,
                            agentPosition: agent_position
                          };
                          addAgentData(reqData, reqDataNew, (err: any, response: any) => {
                            if (err) {
                              return ErrorEmptyResponse(res, err);
                            } else {
                              if (response) {
                                let lastInsertedAgentId = response[0];
                                let reqDataGroup: addAgentGroupMappingRequest = {
                                  agentId: lastInsertedAgentId,
                                  groupId: req.body.agentGroups[0] ? req.body.agentGroups[0] : 1,
                                  insertDateTime: req.body.insertDateTime
                                };
                                addAgentGroupMapping(reqDataGroup, (err: any, response1: any) => {
                                  if (err) {
                                    return ErrorEmptyResponse(res, err);
                                  } else {
                                    if (response1) {
                                      let val = req.body.daysFlag;
                                      let days = [];
                                      for (let day = 0; day < 7; day++) {
                                        let dayValue = Math.pow(2, day);
                                        if (dayValue > val) break;
                                        if ((val & dayValue) > 0) {
                                          switch (dayValue) {
                                            case 64:
                                              days.push("SUN");
                                              break;
                                            case 32:
                                              days.push("SAT");
                                              break;
                                            case 16:
                                              days.push("FRI");
                                              break;
                                            case 8:
                                              days.push("THU");
                                              break;
                                            case 4:
                                              days.push("WED");
                                              break;
                                            case 2:
                                              days.push("TUE");
                                              break;
                                            case 1:
                                              days.push("MON");
                                              break;
                                          }
                                        }
                                      }
                                      for (let day of days) {
                                        let reqDataTiming: addAgentDetailsTimingRequest = {
                                          smeId: parseInt(req.params.id),
                                          agentId: lastInsertedAgentId,
                                          agentName: req.body.agentName,
                                          agentMobile: req.body.agentMobile,
                                          status: req.body.status,
                                          inTime: req.body.inTime,
                                          outTime: req.body.outTime,
                                          daysWeek: day,
                                          insertDateTime: req.body.insertDateTime
                                        };
                                        addAgentDetailsTiming(reqDataTiming, (err: any, response2: any) => {
                                          if (err) {
                                            return ErrorEmptyResponse(res, err);
                                          } else {
                                          }
                                        });
                                      }
                                      getEmailTemplate({ type: "add_agent" }, (err: any, emailTemp: any) => {
                                        if (err) {
                                          return ErrorEmptyResponse(res, err);
                                        } else {
                                          if (emailTemp.length > 0) {

                                            let dataRequest: any = {
                                              'to': reqData['agentEmail'],
                                              'subject': emailTemp[0]['title'],
                                              'message': emailTemp[0]['content'].replace("{{password}}", reqData['password']).replace("{{agentName}}", reqData['agentName']).replace("{{agentEmail}}", reqData['agentEmail']).replace("{{siteUrl}}", env.SITE_ADMIN_URL).replace("{{clientName}}", reqData['clientName'])
                                            };
                                            MailSent(dataRequest);
                                          } else {
                                            return ErrorEmptyResponse(res, "Email template not found");
                                          }
                                        }
                                      });

                                      if (reqData["selectedLongCode"] && reqData["selectedLongCode"].length > 0) {
                                        let longcodes = reqData["selectedLongCode"];
                                        for (let l = 0; l < longcodes.length; l++) {
                                          let reqlongcodes: any = {
                                            smeId: parseInt(req.params.id),
                                            agentId: lastInsertedAgentId,
                                            longcode: longcodes[l].id,
                                          };
                                          addAgentlongcodes(reqlongcodes, (err: any, response5: any) => {
                                            if (err) {
                                              return ErrorEmptyResponse(res, err);
                                            } else {

                                            }
                                          });
                                        }
                                      }
                                      return SuccessResponse(res, "Agent created successfully! username and password sent to your registered email.", response);
                                    }
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
        } else {
          getAgentExtensionCount(reqData, (err: any, responseC: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              if (responseC[0].agent_extention != null) {
                var agent_extension = (responseC[0].agent_extention + 1);
              } else {
                var agent_extension = (responseC[0].agent_extention);
              }
              if (responseC[0].agent_position != null) {
                var agent_position = (responseC[0].agent_position + 1);
              } else {
                var agent_position = (responseC[0].agent_position);
              }

              let reqDataNew: addAgentExtensionRequest = {
                agentExtension: agent_extension,
                agentPosition: agent_position
              };
              addAgentData(reqData, reqDataNew, (err: any, response: any) => {
                if (err) {
                  return ErrorEmptyResponse(res, err);
                } else {
                  if (response) {
                    let lastInsertedAgentId = response[0];
                    let reqDataGroup: addAgentGroupMappingRequest = {
                      agentId: lastInsertedAgentId,
                      groupId: req.body.agentGroups[0] ? req.body.agentGroups[0] : 1,
                      insertDateTime: req.body.insertDateTime
                    };
                    addAgentGroupMapping(reqDataGroup, (err: any, response1: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if (response1) {
                          let val = req.body.daysFlag;
                          let days = [];
                          for (let day = 0; day < 7; day++) {
                            let dayValue = Math.pow(2, day);
                            if (dayValue > val) break;
                            if ((val & dayValue) > 0) {
                              switch (dayValue) {
                                case 64:
                                  days.push("SUN");
                                  break;
                                case 32:
                                  days.push("SAT");
                                  break;
                                case 16:
                                  days.push("FRI");
                                  break;
                                case 8:
                                  days.push("THU");
                                  break;
                                case 4:
                                  days.push("WED");
                                  break;
                                case 2:
                                  days.push("TUE");
                                  break;
                                case 1:
                                  days.push("MON");
                                  break;
                              }
                            }
                          }
                          for (let day of days) {
                            let reqDataTiming: addAgentDetailsTimingRequest = {
                              smeId: parseInt(req.params.id),
                              agentId: lastInsertedAgentId,
                              agentName: req.body.agentName,
                              agentMobile: req.body.agentMobile,
                              status: req.body.status,
                              inTime: req.body.inTime,
                              outTime: req.body.outTime,
                              daysWeek: day,
                              insertDateTime: req.body.insertDateTime
                            };
                            addAgentDetailsTiming(reqDataTiming, (err: any, response2: any) => {
                              if (err) {
                                return ErrorEmptyResponse(res, err);
                              } else {
                              }
                            });
                          }

                          if (reqData["selectedLongCode"] && reqData["selectedLongCode"].length > 0) {
                            let longcodes = reqData["selectedLongCode"];
                            for (let l = 0; l < longcodes.length; l++) {
                              let reqlongcodes: any = {
                                smeId: parseInt(req.params.id),
                                agentId: lastInsertedAgentId,
                                longcode: longcodes[l].id,
                              };
                              addAgentlongcodes(reqlongcodes, (err: any, response5: any) => {
                                if (err) {
                                  return ErrorEmptyResponse(res, err);
                                } else {

                                }
                              });
                            }
                          }
                          return SuccessResponse(res, "Successfully Inserted", response);
                        }
                      }
                    });
                  }
                }
              });
            }
          });
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

export const updateAgent = async (req: Request, res: Response) => {
  try {
    let reqData: updateAgentRequest = {
      id: parseInt(req.params.id),
      agentId: parseInt(req.params.agentId),
      agentName: req.body.agent_name,
      agentMobile: req.body.agentMobile,
      status: req.body.status,
      inTime: req.body.inTime,
      outTime: req.body.outTime,
      daysFlag: req.body.daysFlag,
      agentEmail: req.body.agentEmail,
      stickyAgent: req.body.stickyAgent,
      agentMasking: req.body.agentMasking,
      stickyDays: req.body.stickyDays,
      assignFailedCalls: req.body.assignFailedCalls,
      assignVoicemailCalls: req.body.assignVoicemailCalls,
      inPermissionFlag: req.body.inPermissionFlag,
      outPermissionFlag: req.body.outPermissionFlag,
      agentExtension: req.body.agent_extention,
      selectedLongCode: req.body.selectedLongCode,
      insertDateTime: req.body.insertDateTime,
      clientName: req.body.clientName ? req.body.clientName : "",
      role: "Agent",
      password: randomString(10),
      breakPermissionFlag: req.body.breakPermissionFlag ? req.body.breakPermissionFlag : 0,
      virtualNumberPriority: req.body.virtualNumberPriority ? req.body.virtualNumberPriority : 0,
      webrtcFlag: req.body.webrtcFlag ? req.body.webrtcFlag : 0,
      recordingType: req.body.recordingType ? req.body.recordingType : 0,
    };

    await checkAgentMobileExist(reqData, (err: any, response: any) => {
      if (response && response[0] && response[0].agent_mobile) {
        return userExistsError(res, "Mobile number already used by another agent");
      } else {
        if (reqData && reqData.agentEmail == "") {
          updateAgentData(reqData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              if (response) {
                let reqDataGroup: addAgentGroupMappingRequest = {
                  agentId: parseInt(req.params.agentId),
                  groupId: req.body.agentGroups[0] ? req.body.agentGroups[0] : 1,
                  insertDateTime: req.body.insertDateTime
                };
                updateAgentGroupMapping(reqDataGroup, (err: any, response1: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    if (response1) {
                      let reqDataGroup: any = {
                        agentId: parseInt(req.params.agentId),
                        groupId: req.body.agentGroups[0] ? req.body.agentGroups[0] : 1,
                      };
                      deleteAgentDetailsTiming(reqDataGroup, (err: any, response2: any) => {
                        if (err) {
                          return ErrorEmptyResponse(res, err);
                        } else {
                          let val = req.body.daysFlag;
                          let days = [];
                          for (let day = 0; day < 7; day++) {
                            let dayValue = Math.pow(2, day);
                            if (dayValue > val) break;
                            if ((val & dayValue) > 0) {
                              switch (dayValue) {
                                case 64:
                                  days.push("SUN");
                                  break;
                                case 32:
                                  days.push("SAT");
                                  break;
                                case 16:
                                  days.push("FRI");
                                  break;
                                case 8:
                                  days.push("THU");
                                  break;
                                case 4:
                                  days.push("WED");
                                  break;
                                case 2:
                                  days.push("TUE");
                                  break;
                                case 1:
                                  days.push("MON");
                                  break;
                              }
                            }
                          }
                          for (let day of days) {
                            let reqDataTiming: addAgentDetailsTimingRequest = {
                              smeId: parseInt(req.params.id),
                              agentId: parseInt(req.params.agentId),
                              agentName: req.body.agent_name,
                              agentMobile: req.body.agentMobile,
                              status: req.body.status,
                              inTime: req.body.inTime,
                              outTime: req.body.outTime,
                              daysWeek: day,
                              insertDateTime: req.body.insertDateTime
                            };
                            addAgentDetailsTiming(reqDataTiming, (err: any, response3: any) => {
                              if (err) {
                                return ErrorEmptyResponse(res, err);
                              }
                            });
                          }
                        }
                      });

                      if (reqData["selectedLongCode"] && reqData["selectedLongCode"].length > 0) {
                        deleteAgentLoncodes(reqData, (err: any, response4: any) => {
                          if (err) {
                            return ErrorEmptyResponse(res, err);
                          } else {
                            let longcodes = reqData["selectedLongCode"];
                            for (let l = 0; l < longcodes.length; l++) {
                              let reqlongcodes: any = {
                                smeId: parseInt(req.params.id),
                                agentId: parseInt(req.params.agentId),
                                longcode: longcodes[l].id,
                              };
                              addAgentlongcodes(reqlongcodes, (err: any, response5: any) => {
                                if (err) {
                                  return ErrorEmptyResponse(res, err);
                                } else {

                                }
                              });
                            }

                          }
                        });
                      } else {
                        deleteAgentLoncodes(reqData, (err: any, response5: any) => {
                          if (err) {
                            return ErrorEmptyResponse(res, err);
                          } else {
                            
                          }
                        });
                      }

                      return SuccessResponse(res, "Successfully Updated", response);
                    }
                  }
                });
              }
            }
          });
        } else {
          checkAgentEmailExist(reqData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              if (response.length > 0) {
                return userExistsError(res, "Email already used by another agent");
              } else {
                checkAgentEmailExistInUser(reqData, (err: any, response: any) => {
                  if (response && response[0] && response[0].username) {
                    updateAgentData(reqData, (err: any, response: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if (response) {
                          let reqDataGroup: addAgentGroupMappingRequest = {
                            agentId: parseInt(req.params.agentId),
                            groupId: req.body.agentGroups[0] ? req.body.agentGroups[0] : 1,
                            insertDateTime: req.body.insertDateTime
                          };
                          updateAgentGroupMapping(reqDataGroup, (err: any, response1: any) => {
                            if (err) {
                              return ErrorEmptyResponse(res, err);
                            } else {
                              if (response1) {
                                let reqDataGroup: any = {
                                  agentId: parseInt(req.params.agentId),
                                  groupId: req.body.agentGroups[0] ? req.body.agentGroups[0] : 1,
                                };
                                deleteAgentDetailsTiming(reqDataGroup, (err: any, response2: any) => {
                                  if (err) {
                                    return ErrorEmptyResponse(res, err);
                                  } else {
                                    let val = req.body.daysFlag;
                                    let days = [];
                                    for (let day = 0; day < 7; day++) {
                                      let dayValue = Math.pow(2, day);
                                      if (dayValue > val) break;
                                      if ((val & dayValue) > 0) {
                                        switch (dayValue) {
                                          case 64:
                                            days.push("SUN");
                                            break;
                                          case 32:
                                            days.push("SAT");
                                            break;
                                          case 16:
                                            days.push("FRI");
                                            break;
                                          case 8:
                                            days.push("THU");
                                            break;
                                          case 4:
                                            days.push("WED");
                                            break;
                                          case 2:
                                            days.push("TUE");
                                            break;
                                          case 1:
                                            days.push("MON");
                                            break;
                                        }
                                      }
                                    }
                                    for (let day of days) {
                                      let reqDataTiming: addAgentDetailsTimingRequest = {
                                        smeId: parseInt(req.params.id),
                                        agentId: parseInt(req.params.agentId),
                                        agentName: req.body.agent_name,
                                        agentMobile: req.body.agentMobile,
                                        status: req.body.status,
                                        inTime: req.body.inTime,
                                        outTime: req.body.outTime,
                                        daysWeek: day,
                                        insertDateTime: req.body.insertDateTime
                                      };
                                      addAgentDetailsTiming(reqDataTiming, (err: any, response3: any) => {
                                        if (err) {
                                          return ErrorEmptyResponse(res, err);
                                        }
                                      });
                                    }
                                  }
                                });

                                if (reqData["selectedLongCode"] && reqData["selectedLongCode"].length > 0) {
                                  deleteAgentLoncodes(reqData, (err: any, response4: any) => {
                                    if (err) {
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      let longcodes = reqData["selectedLongCode"];
                                      for (let l = 0; l < longcodes.length; l++) {
                                        let reqlongcodes: any = {
                                          smeId: parseInt(req.params.id),
                                          agentId: parseInt(req.params.agentId),
                                          longcode: longcodes[l].id,
                                        };
                                        addAgentlongcodes(reqlongcodes, (err: any, response5: any) => {
                                          if (err) {
                                            return ErrorEmptyResponse(res, err);
                                          } else {

                                          }
                                        });
                                      }

                                    }
                                  });
                                } else {
                                  deleteAgentLoncodes(reqData, (err: any, response5: any) => {
                                    if (err) {
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      
                                    }
                                  });
                                }

                                return SuccessResponse(res, "Successfully Updated", response);
                              }
                            }
                          });
                        }
                      }
                    });
                  } else {
                    addUser(reqData, (err: any, response: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        addUserRole(reqData, (err: any, response: any) => {
                          if (err) {
                            return ErrorEmptyResponse(res, err);
                          } else {
                            updateAgentData(reqData, (err: any, response: any) => {
                              if (err) {
                                return ErrorEmptyResponse(res, err);
                              } else {
                                if (response) {
                                  let reqDataGroup: addAgentGroupMappingRequest = {
                                    agentId: parseInt(req.params.agentId),
                                    groupId: req.body.agentGroups[0] ? req.body.agentGroups[0] : 1,
                                    insertDateTime: req.body.insertDateTime
                                  };
                                  updateAgentGroupMapping(reqDataGroup, (err: any, response1: any) => {
                                    if (err) {
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      if (response1) {
                                        let reqDataGroup: any = {
                                          agentId: parseInt(req.params.agentId),
                                          groupId: req.body.agentGroups[0] ? req.body.agentGroups[0] : 1,
                                        };
                                        deleteAgentDetailsTiming(reqDataGroup, (err: any, response2: any) => {
                                          if (err) {
                                            return ErrorEmptyResponse(res, err);
                                          } else {
                                            let val = req.body.daysFlag;
                                            let days = [];
                                            for (let day = 0; day < 7; day++) {
                                              let dayValue = Math.pow(2, day);
                                              if (dayValue > val) break;
                                              if ((val & dayValue) > 0) {
                                                switch (dayValue) {
                                                  case 64:
                                                    days.push("SUN");
                                                    break;
                                                  case 32:
                                                    days.push("SAT");
                                                    break;
                                                  case 16:
                                                    days.push("FRI");
                                                    break;
                                                  case 8:
                                                    days.push("THU");
                                                    break;
                                                  case 4:
                                                    days.push("WED");
                                                    break;
                                                  case 2:
                                                    days.push("TUE");
                                                    break;
                                                  case 1:
                                                    days.push("MON");
                                                    break;
                                                }
                                              }
                                            }
                                            for (let day of days) {
                                              let reqDataTiming: addAgentDetailsTimingRequest = {
                                                smeId: parseInt(req.params.id),
                                                agentId: parseInt(req.params.agentId),
                                                agentName: req.body.agent_name,
                                                agentMobile: req.body.agentMobile,
                                                status: req.body.status,
                                                inTime: req.body.inTime,
                                                outTime: req.body.outTime,
                                                daysWeek: day,
                                                insertDateTime: req.body.insertDateTime
                                              };
                                              addAgentDetailsTiming(reqDataTiming, (err: any, response3: any) => {
                                                if (err) {
                                                  return ErrorEmptyResponse(res, err);
                                                }
                                              });
                                            }
                                          }
                                        });

                                        getEmailTemplate({ type: "add_agent" }, (err: any, emailTemp: any) => {
                                          if (err) {
                                            return ErrorEmptyResponse(res, err);
                                          } else {
                                            if (emailTemp.length > 0) {

                                              let dataRequest: any = {
                                                'to': reqData['agentEmail'],
                                                'subject': emailTemp[0]['title'],
                                                'message': emailTemp[0]['content'].replace("{{password}}", reqData['password']).replace("{{agentName}}", reqData['agentName']).replace("{{agentEmail}}", reqData['agentEmail']).replace("{{siteUrl}}", env.SITE_ADMIN_URL).replace("{{clientName}}", reqData['clientName'])
                                              };
                                              MailSent(dataRequest);
                                            } else {
                                              return ErrorEmptyResponse(res, "Email template not found");
                                            }
                                          }
                                        });

                                        if (reqData["selectedLongCode"] && reqData["selectedLongCode"].length > 0) {
                                          deleteAgentLoncodes(reqData, (err: any, response4: any) => {
                                            if (err) {
                                              return ErrorEmptyResponse(res, err);
                                            } else {
                                              let longcodes = reqData["selectedLongCode"];
                                              for (let l = 0; l < longcodes.length; l++) {
                                                let reqlongcodes: any = {
                                                  smeId: parseInt(req.params.id),
                                                  agentId: parseInt(req.params.agentId),
                                                  longcode: longcodes[l].id,
                                                };
                                                addAgentlongcodes(reqlongcodes, (err: any, response5: any) => {
                                                  if (err) {
                                                    return ErrorEmptyResponse(res, err);
                                                  } else {

                                                  }
                                                });
                                              }

                                            }
                                          });
                                        } else {
                                          deleteAgentLoncodes(reqData, (err: any, response5: any) => {
                                            if (err) {
                                              return ErrorEmptyResponse(res, err);
                                            } else {
                                              
                                            }
                                          });
                                        }
                                        return SuccessResponse(res, "Successfully Updated", response);
                                      }
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
            }
          });
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

export const deleteAgent = async (req: Request, res: Response) => {
  try {
    let reqData: deleteAgentRequest = {
      id: parseInt(req.params.id),
      agentId: parseInt(req.params.agentId),
      status: "-9",
      agentEmail: req.body.agent_email,
      agentName: req.body.agent_name,
      agentNumber: req.body.agent_mobile ? req.body.agent_mobile : ""
    };

    await deleteAgentFromDetailsTiming(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        deleteAgentData(reqData, (err: any, response: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
            deleteAgentDataFromUserRoles(reqData, (err: any, response: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                deleteAgentDataFromChangePassword(reqData, (err: any, response: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    deleteAgentDataFromUsers(reqData, (err: any, response: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        deleteAgentFromLongcodeMapping(reqData, (err: any, response: any) => {
                          if (err) {
                            return ErrorEmptyResponse(res, err);
                          } else {
                            addAgentLogs(reqData, (err: any, response: any) => {
                              if (err) {
                                return ErrorEmptyResponse(res, err);
                              }
                            });
                          }
                        });
                        
                        return SuccessResponse(res, "Successfully Deleted", response);
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

export const getInsightsAgentStatus = async (req: Request, res: Response) => {
  try {
    let reqData: getInsightsAgentStatusRequestValidate = {
      id: parseInt(req.params.id),
    };
    await FindgetInsightsAgentStatus(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
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

export const setAgentsOrder = async (req: Request, res: Response) => {
  try {

    if (req.body.positions && req.body.positions.length > 0) {
      let positions = req.body.positions;
      for (let l = 0; l < positions.length; l++) {
        let reqData: setAgentsOrderRequest = {
          smeId: parseInt(req.params.id),
          order: parseInt(req.body.positions[l].order),
          agentId: parseInt(req.body.positions[l].id),
        };
        await updatetAgentPosition(reqData, (err: any, response: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          }
        });
      }
      return SuccessResponse(res, "Order successfully updated", null);
    }
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

export const getAgentsInsightDayWise = async (req: Request, res: Response) => {
  try {
    var g_agentId = "";
    if (req.body.agentId && req.body.agentId > 0) {
      g_agentId = req.body.agentId;
    }
    let reqData: any = {
      id: parseInt(req.params.id),
      agentId: g_agentId,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    };

    await getAgentsInsightDayWiseData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
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

export const updateAgentStatus = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
      agentId: req.body.agentId,
      status: req.body.status,
    };

    await updateAgentStatusData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Agent updated successfully", response);
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

export const agentActInactTime = async (req: Request, res: Response) => {
  try {

    let reqData: any = {
      id: parseInt(req.params.id),
      agent_id: req.body.agentId,
      insert_date: req.body.startDate,
      in_time: req.body.startDate,
      out_time: req.body.startDate,
    }

    if (req.body && req.body.status && req.body.status == '0') {
      await agentActInactTimeDataIn(reqData, (err: any, response: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          return SuccessResponse(res, "Agent status time updated successfully", response);
        }
      });
    } else {
      await getAgentActInactTimeData(reqData, (err: any, responseTimeData: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          if (responseTimeData && responseTimeData.length > 0) {
            let where: any = { 'id': responseTimeData[0]['id'] }
            agentActInactTimeDataOut(where, reqData, (err: any, responseOut: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                return SuccessResponse(res, "Agent status time updated successfully", responseOut);
              }
            });
          }
        }
      });
    }
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

export const reviewAgentScoreProcess = async () => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      currentDate: getCurrentDate,
    };
    await FindSmeData(reqData, async (err: any, responseA: any) => {
      if (err) {
        glogger("ERR", "Cron", "FindSmeData", err);
      } else {

        if (responseA.length > 0) {
          for (let data of responseA) {
            let reqData: any = {
              id: data.id,
            };

            FindAllAgentsData(reqData, (err: any, response: any) => {
              if (err) {
                glogger("ERR", "Cron", "FindAllAgentsData, reviewAgentScoreProcess", err);
              } else {
        
                if (response.length > 0) {
                  for (let data of response) {
                    let successCountRecord = 0;
                    let failedCountRecord = 0;
                    getFailedCallCount(data, (err: any, responseB: any) => {
                      if (err) {
                        glogger("ERR", "Cron", "getFailedCallCount", err);
                      } else {
                        if (responseB[0] && responseB[0].failedCount != 'undefined') {
                          failedCountRecord = responseB[0].failedCount;
                        } else {
                          failedCountRecord = 0;
                        }
        
                        getSuccessCallCount(data, (err: any, responseC: any) => {
                          if (err) {
                            glogger("ERR", "Cron", "getSuccessCallCount", err);
                          } else {
                            if (responseC[0] && responseC[0].successCount != 'undefined') {
                              successCountRecord = responseC[0].successCount;
                            } else {
                              successCountRecord = 0;
                            }
        
                            let abc = ((successCountRecord + failedCountRecord));
        
                            if (abc == 0) {
                              var callscore = 0;
                            } else {
                              var callscore = (100 * successCountRecord / abc);
                            }
                            let data2: any = {
                              callscore: callscore
                            }
                            updateSuccessCallCount(data, data2, (err: any, responseD: any) => {
                              if (err) {
                                glogger("ERR", "Cron", "updateSuccessCallCount", err);
                              } else {
                                //console.log('reviewAgentScoreProcess cron job run successfully');
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                }
              }
            });
          }
        }
      }
    });
  } catch (e) {
    glogger("ERR", "Cron ", "Exception", e);
  }
};

export const updateAgentactiveBreakTimeProcess = async () => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      currentDate: getCurrentDate,
    };

    await FindSmeData(reqData, async (err: any, responseA: any) => {
      if (err) {
        glogger("ERR", "Cron", "FindSmeData", err);
      } else {

        if (responseA.length > 0) {
          for (let data of responseA) {
            let reqData: any = {
              id: data.id,
            };
            FindAllAgentsData(reqData, async (err: any, response: any) => {
              if (err) {
                glogger("ERR", "Cron", "FindAllAgentsData, updateAgentactiveBreakTimeProcess", err);
              } else {

                if (response.length > 0) {
                  for (let data of response) {
                    let TotalActiveTime = 0;
                    let TotalBreakTime = 0;
                    toBreakTime(data, (err: any, responseB: any) => {
                      if (err) {
                        glogger("ERR", "Cron", "toBreakTime", err);
                      } else {
                        if (responseB[0] && responseB[0].break_time != null) {
                          TotalBreakTime = responseB[0].break_time;
                        } else {
                          TotalBreakTime = 0;
                        }
                        toActiveTime(data, (err: any, responseC: any) => {
                          if (err) {
                            glogger("ERR", "Cron", "toActiveTime", err);
                          } else {
                            if (responseC[0] && responseC[0].active_time != 'undefined') {
                              TotalActiveTime = responseC[0].active_time;
                            } else {
                              TotalActiveTime = 0;
                            }
                            let data2: any = {
                              TotalActiveTime: TotalActiveTime,
                              TotalBreakTime: TotalBreakTime
                            }
                            updateactiveBreakTimeSummary(data, data2, (err: any, responseD: any) => {
                              if (err) {
                                glogger("ERR", "Cron", "updateactiveBreakTimeSummary", err);
                              } else {
                                //console.log('updateAgentactiveBreakTimeProcess cron job run successfully');
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                }
              }
            });
            await sleep(12000);
          }

        }
      }
    });

  } catch (e) {
    glogger("ERR", "Cron ", "Exception", e);
  }
};

export const AgentAllAverageCallsCalculationProcess = async () => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      currentDate: getCurrentDate,
      currentDateWithoutTime: getCurrentDate.slice(0, 10)
      //currentDateWithoutTime: '2022-11-11'
    };

    await FindSmeData(reqData, async (err: any, responseA: any) => {
      if (err) {
        glogger("ERR", "Cron", "FindSmeData", err);
      } else {
        if (responseA.length > 0) {
          for (let data of responseA) {
            let reqData1: any = {
              id: data.id,
            };

            await FindAllAgentsData(reqData1, async (err: any, response: any) => {
              if (err) {
                glogger("ERR", "Cron", "FindAllAgentsData, AgentAllAverageCallsCalculationProcess", err);
              } else {
                if (response.length > 0) {
                  for (let data of response) {
                    let gConnectedTotalCalls = 0;
                    let gConnectedDuration = 0;
                    let gAvgConnectedDuration = 0;
                    let TotalConnectedCallDuration = 0;

                    let gRingingTotalCalls = 0;
                    let gRingingDuration = 0;
                    let gAvgRingingDuration = 0;
                    let TotalRingingCallDuration = 0;

                    let gDurationTotalCalls = 0;
                    let gDuration = 0;
                    let gAvgDuration = 0;
                    
                    //Get connected and avg connected duration
                    await avgSuccessCallCount(data, reqData, async(err: any, responseB: any) => {
                      if (err) {
                        glogger("ERR", "Cron", "avgSuccessCallCount", err);
                      } else {
                        if (responseB[0] && responseB[0].count != null) {
                          gConnectedTotalCalls = responseB[0].count;
                        } else {
                          gConnectedTotalCalls = 0;
                        }

                        if (responseB[0] && responseB[0].connected_duration != null) {
                          gConnectedDuration = responseB[0].connected_duration;
                          TotalConnectedCallDuration = responseB[0].connected_duration;
                        } else {
                          gConnectedDuration = 0;
                          TotalConnectedCallDuration = 0;
                        }

                        if (gConnectedDuration == 0 || gConnectedTotalCalls == 0) {
                          gAvgConnectedDuration = 0;
                        } else {
                          gAvgConnectedDuration = (gConnectedDuration / gConnectedTotalCalls)
                        }
                        // Get Ringing and avg ringing duration
                        await avgRingingCallCount(data, reqData, async(err: any, responseC: any) => {
                          if (err) {
                            glogger("ERR", "Cron", "avgSuccessCallCount2", err);
                          } else {
                            if (responseC[0] && responseC[0].total != null) {
                              gRingingTotalCalls = responseC[0].total;
                            } else {
                              gRingingTotalCalls = 0;
                            }

                            if (responseC[0] && responseC[0].ringing_duration != null) {
                              gRingingDuration = responseC[0].ringing_duration;
                              TotalRingingCallDuration = responseC[0].ringing_duration;
                            } else {
                              gRingingDuration = 0;
                              TotalRingingCallDuration = 0;
                            }

                            if (gRingingDuration == 0 || gRingingTotalCalls == 0) {
                              gAvgRingingDuration = 0;
                            } else {
                              gAvgRingingDuration = (gRingingDuration / gRingingTotalCalls);
                            }
                            
                            //Get total and avg. total duration
                            await avgTotalDuration(data, reqData, async(err: any, responseD: any) => {
                              if (err) {
                                glogger("ERR", "Cron", "avgTotalDuration", err);
                              } else {
                                if (responseD[0] && responseD[0].count != null) {
                                  gDurationTotalCalls = responseD[0].count;
                                } else {
                                  gDurationTotalCalls = 0;
                                }
        
                                if (responseD[0] && responseD[0].duration != null) {
                                  gDuration = responseD[0].duration;
                                } else {
                                  gDuration = 0;
                                }
        
                                //get average duration 
                                if (gDuration == 0 || gDurationTotalCalls == 0) {
                                  gAvgDuration = 0;
                                } else {
                                  gAvgDuration = (gDuration / gDurationTotalCalls);
                                }

                                let data2: any = {
                                  gDuration: gDuration,
                                  gAvgDuration: gAvgDuration,
                                  gConnectedDuration: gConnectedDuration,
                                  gAvgConnectedDuration: gAvgConnectedDuration,
                                  gRingingDuration: gRingingDuration,
                                  gAvgRingingDuration: gAvgRingingDuration,
                                  TotalRingingCallDuration: TotalRingingCallDuration,
                                  TotalConnectedCallDuration: TotalConnectedCallDuration,
                                }

                                await updateAvgCallCountSummary(data, data2, reqData, async(err: any, responseE: any) => {
                                  if (err) {
                                    glogger("ERR", "Cron", "updateAvgCallCountSummary", err);
                                  } else {
                                    // console.log(responseD);
                                  }
                                });
                              }
                            });

                            
                          }
                        });


                      }
                    });
                  }
                }
              }
            });
            
            await sleep(12000);
          }
        }
      }
    });

  } catch (e) {
    glogger("ERR", "Cron ", "Exception", e);
  }
};

export const AgentBreakTimeExceedProcess = async () => {
  try {
    let currentDate = new Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      currentDate: getCurrentDate,
    };
    
    await FindSmeData(reqData, async (err: any, response: any) => {
      if (err) {
        glogger("ERR", "Cron", "FindSmeData", err);
      } else {
        if (response.length > 0) {
          for (let data of response) {
            if (data.agent_break_notifcation == 1) {
              let reqData: getAgentdetailRequestValidate = {
                id: data.id,
              };
              FindAllAgentsList(reqData, async (err: any, responseB: any) => {
                if (err) {
                  glogger("ERR", "Cron", "FindAllAgentsList", err);
                } else {
                  if (responseB.length > 0) {
                    for (let agentdata of responseB) {
                      if (agentdata.break_permission_flag == 1) {

                        let reqDatanew: any = {
                          agent_id: agentdata.agent_id,
                          sme_id: agentdata.sme_id,
                          getCurrentDate: getCurrentDate
                        }
                        FindAgentBreakTime(reqDatanew, (err: any, responseC: any) => {
                          if (err) {
                            glogger("ERR", "Cron", "FindAgentBreakTime", err);
                          } else {

                            console.log(responseC);
                            if (responseC[0] && responseC[0].break_time) {

                              console.log(responseC[0].break_time);

                              let totalBreakNotificationTime = data.agent_break_notification_time * 60;
                              let timeDifferenc = responseC[0].break_time ;

                              let mailcheckTime = responseC[0].break_time - totalBreakNotificationTime;
                              
                              if (timeDifferenc > totalBreakNotificationTime && mailcheckTime < 900) {
                                // agent_break_notification_email == 1 send email to sme
                                if (data.agent_break_notification_email == 1 || data.agent_break_notification_email == 3) {
                                  var message = "Your agent " + agentdata.agent_name + " is on break more than " + data.agent_break_notification_time + "  minutes";
                                  let firebaseata: any = {
                                    agent_id: agentdata.agent_id,
                                    sme_id: agentdata.sme_id,
                                    insert_date_time: getCurrentDate,
                                    schedule_date_time: getCurrentDate,
                                    event: 'break_time_exceed',
                                    message: message,
                                    mode: "WEB",
                                    username: agentdata.sme_id,
                                    title: "Break Time Exceed",

                                  }
                                  SendFirebaseNotificationSME(firebaseata, (err: any, responseD: any) => {
                                    if (err) {
                                      glogger("ERR", "Cron", "SendFirebaseNotificationSME", err);
                                    } else {
                                      getEmailTemplate({ type: "agent_break_notify_sme" }, (err: any, emailTemp: any) => {
                                        if (err) {
                                          glogger("ERR", "Cron", "getEmailTemplate", err);
                                        } else {
                                          if (emailTemp.length > 0) {

                                            let dataRequest: any = {
                                              'to': data.email_id,
                                              'subject': emailTemp[0]['title'],
                                              'message': emailTemp[0]['content'].replace("{{name}}", agentdata.agent_name).replace("{{time}}", data.agent_break_notification_time)
                                            };
                                            MailSent(dataRequest);
                                            glogger("IMP", "Cron", "agent_break_notify_sme Email sent ", "to : "+data.email_id+" subject : "+emailTemp[0]['title']);
                                            //return SuccessResponse(201, "Email sent successfully.", []);
                                          } else {
                                            glogger("ERR", "Cron", " agent_break_notify_sme Email template  found", err);
                                            //return ErrorEmptyResponse(401, "Email template not found");
                                          }
                                        }
                                      });
                                    }
                                  });
                                }

                                if (timeDifferenc > totalBreakNotificationTime) {
                                  // agent_break_notification_email == 1 send email to agent
                                  if (data.agent_break_notification_email == 2 || data.agent_break_notification_email == 3) {
                                    let firebaseAgent: any = {
                                      agent_id: agentdata.agent_id,
                                      sme_id: agentdata.sme_id,
                                      insert_date_time: getCurrentDate,
                                      schedule_date_time: getCurrentDate,
                                      event: 'break_time_exceed',
                                      message: 'You are break on more then ' + data.agent_break_notification_time + " minutes",
                                      mode: "APP",
                                      username: agentdata.agent_email,
                                      title: "Break Time Exceed",

                                    }
                                    SendFirebaseNotificationAgent(firebaseAgent, (err: any, responseE: any) => {
                                      if (err) {
                                        glogger("ERR", "Cron", "SendFirebaseNotificationAgent", err);
                                      } else {
                                        getEmailTemplate({ type: "agent_break_notify_agent" }, (err: any, emailTemp: any) => {
                                          if (err) {
                                            glogger("ERR", "Cron", "getEmailTemplate", err);
                                          } else {
                                            if (emailTemp.length > 0) {

                                              let dataRequest: any = {
                                                'to': agentdata.agent_email,
                                                'subject': emailTemp[0]['title'],
                                                'message': emailTemp[0]['content'].replace("{{time}}", data.agent_break_notification_time)
                                              };
                                              MailSent(dataRequest);
                                              //return SuccessResponse(201, "Email sent successfully.", response);
                                              glogger("IMP", "Cron", "agent_break_notify_agent Email template not found", dataRequest);
                                            } else {
                                              glogger("ERR", "Cron", "agent_break_notify_agent Email template not found", err);
                                            }
                                          }
                                        });
                                      }
                                    });
                                  }

                                }

                              }
                            }
                          }
                        });
                      }
                    }
                  }
                }
              });

              await sleep(12000);
            }
          }
        }
      }

    });

  } catch (e) {
    glogger("ERR", "Cron ", "Exception", e);
  }
};

export const getSingleAgent = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agentId ? req.body.agentId : 0
    };
    await getSingleAgentData(reqData, (err: any, response: any) => {
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


export const addWebrtcAgent = async (req: Request, res: Response) => {
  try {

    let reqData: any = {
      id: parseInt(req.params.id),
      agentName: req.body.agentName ? req.body.agentName : "",
      agentMobile: req.body.agentMobile,
      seqWebrtcNumber: req.body.webrtcSeqNumber,
      status: req.body.status,
      inTime: req.body.inTime ? req.body.inTime : "",
      outTime: req.body.outTime ? req.body.outTime : "",
      daysFlag: req.body.daysFlag ? req.body.daysFlag : 0,
      agentEmail: req.body.agentEmail ? req.body.agentEmail : "",
      stickyAgent: req.body.stickyAgent ? req.body.stickyAgent : 0,
      agentMasking: req.body.agentMasking ? req.body.agentMasking : 0,
      stickyDays: req.body.stickyDays ? req.body.stickyDays : 0,
      assignFailedCalls: req.body.assignFailedCalls,
      assignVoicemailCalls: req.body.assignVoicemailCalls,
      inPermissionFlag: req.body.inPermissionFlag,
      outPermissionFlag: req.body.outPermissionFlag,
      role: "Agent",
      password: randomString(10),
      selectedLongCode: req.body.longCodes,
      clientName: req.body.clientName ? req.body.clientName : "",
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : "0000-00-00 00:00:00",
      breakPermissionFlag: req.body.breakPermissionFlag ? req.body.breakPermissionFlag : 0,
      virtualNumberPriority: req.body.virtualNumberPriority ? req.body.virtualNumberPriority : 0,
      webrtcFlag: req.body.webrtcFlag ? req.body.webrtcFlag : 0,
      transport: 'UDP,TCP,TLS,WS,WSS',
      host: 'dynamic',
      context: 'default',
      nat: 'force_rport,comedia',
      type: 'friend',
      amaflags: 'billing',
      dtmfmode: 'RFC2833',
      qualify: 'yes',
      disallow: 'all',
      allow: 'ulaw,alaw,gsm,g729,opus',
      fullcontact: "sips:"+req.body.agentMobile+"@df7jal23ls0d.invalid^3Brtcweb-breaker=no^3Btransport=wss",
      ipaddr: "",
      port: 0,
      directmedia: "no",
      trustrpid: "yes",
      sendrpid: "yes",
      timert1: 500,
      callcounter: "yes",
      allowoverlap: "yes",
      allowsubscribe: "yes",
      allowtransfer: "yes",
      ignoresdpversion: "no",
      videosupport: "no",
      rfc2833compensate: "yes",
      session_timers: "accept",
      dtlsverify: "fingerprint",
      useragent: "Kommuno",
      regseconds: 1678763517,
      regserver: "",
      lastms: -1,
      qualifyfreq: 120,
      encryption: "yes",
      secret: randomString(10),
      recordingType: req.body.recordingType ? req.body.recordingType : 0,
    };

    if (reqData["agentEmail"] && reqData["agentEmail"] != "") {
      checkAgentEmailExist(reqData, (err: any, response: any) => {
        if (response && response.length > 0) {
          return userExistsError(res, "Email already used by another agent");
        } else {
          addUser(reqData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              addUserRole(reqData, (err: any, response: any) => {
                if (err) {
                  return ErrorEmptyResponse(res, err);
                } else {
                  getAgentExtensionCount(reqData, (err: any, responseC: any) => {
                    if (err) {
                      return ErrorEmptyResponse(res, err);
                    } else {
                      if (responseC[0].agent_extention != null) {
                        var agent_extension = (responseC[0].agent_extention + 1);
                      } else {
                        var agent_extension = (responseC[0].agent_extention);
                      }
  
                      if (responseC[0].agent_position != null) {
                        var agent_position = (responseC[0].agent_position + 1);
                      } else {
                        var agent_position = (responseC[0].agent_position);
                      }
  
                      let reqDataNew: any = {
                        agentExtension: agent_extension,
                        agentPosition: agent_position,
                        agentMobile: "+"+reqData["agentMobile"],
                      };
                      addWebrtcAgentData(reqData, reqDataNew, (err: any, response: any) => {
                        if (err) {
                          return ErrorEmptyResponse(res, err);
                        } else {
                          if (response) {
                            let lastInsertedAgentId = response[0];
                            let reqDataGroup: addAgentGroupMappingRequest = {
                              agentId: lastInsertedAgentId,
                              groupId: req.body.agentGroups[0] ? req.body.agentGroups[0] : 1,
                              insertDateTime: req.body.insertDateTime
                            };
                            addAgentGroupMapping(reqDataGroup, (err: any, response1: any) => {
                              if (err) {
                                return ErrorEmptyResponse(res, err);
                              } else {
                                if (response1) {
                                  let val = req.body.daysFlag;
                                  let days = [];
                                  for (let day = 0; day < 7; day++) {
                                    let dayValue = Math.pow(2, day);
                                    if (dayValue > val) break;
                                    if ((val & dayValue) > 0) {
                                      switch (dayValue) {
                                        case 64:
                                          days.push("SUN");
                                          break;
                                        case 32:
                                          days.push("SAT");
                                          break;
                                        case 16:
                                          days.push("FRI");
                                          break;
                                        case 8:
                                          days.push("THU");
                                          break;
                                        case 4:
                                          days.push("WED");
                                          break;
                                        case 2:
                                          days.push("TUE");
                                          break;
                                        case 1:
                                          days.push("MON");
                                          break;
                                      }
                                    }
                                  }
                                  for (let day of days) {
                                    let reqDataTiming: any = {
                                      smeId: parseInt(req.params.id),
                                      agentId: lastInsertedAgentId,
                                      agentName: req.body.agentName,
                                      agentMobile: "+"+req.body.agentMobile,
                                      status: req.body.status,
                                      inTime: req.body.inTime,
                                      outTime: req.body.outTime,
                                      daysWeek: day,
                                      insertDateTime: req.body.insertDateTime
                                    };
                                    addAgentDetailsTiming(reqDataTiming, (err: any, response2: any) => {
                                      if (err) {
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                      }
                                    });
                                  }
  
                                  getEmailTemplate({ type: "add_agent" }, (err: any, emailTemp: any) => {
                                    if (err) {
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      if (emailTemp.length > 0) {
  
                                        let dataRequest: any = {
                                          'to': reqData['agentEmail'],
                                          'subject': emailTemp[0]['title'],
                                          'message': emailTemp[0]['content'].replace("{{password}}", reqData['password']).replace("{{agentName}}", reqData['agentName']).replace("{{agentEmail}}", reqData['agentEmail']).replace("{{siteUrl}}", env.SITE_ADMIN_URL).replace("{{clientName}}", reqData['clientName'])
                                        };
                                        MailSent(dataRequest);
                                      } else {
                                        return ErrorEmptyResponse(res, "Email template not found");
                                      }
                                    }
                                  });
  
                                  if (reqData["selectedLongCode"] && reqData["selectedLongCode"].length > 0) {
                                    let longcodes = reqData["selectedLongCode"];
                                    for (let l = 0; l < longcodes.length; l++) {
                                      let reqlongcodes: any = {
                                        smeId: parseInt(req.params.id),
                                        agentId: lastInsertedAgentId,
                                        longcode: longcodes[l].id,
                                      };
                                      addAgentlongcodes(reqlongcodes, (err: any, response5: any) => {
                                        if (err) {
                                          return ErrorEmptyResponse(res, err);
                                        } else {
  
                                        }
                                      });
                                    }
                                  }
  
                                  addSipBuddies(reqData, (err: any, response6: any) => {
                                    if (err) {
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      let updatedWebrtcNumber: any = {
                                        webrtcNumber: reqData["seqWebrtcNumber"]+1,
                                      };
                                      updateSeqWebrtcNumber(updatedWebrtcNumber, (err: any, response6: any) => {
                                        if (err) {
                                          return ErrorEmptyResponse(res, err);
                                        } else {
                                          return SuccessResponse(res, "Webrtc Agent created successfully! username and password sent to your registered email.", response);
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
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      getAgentExtensionCount(reqData, (err: any, responseC: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          if (responseC[0].agent_extention != null) {
            var agent_extension = (responseC[0].agent_extention + 1);
          } else {
            var agent_extension = (responseC[0].agent_extention);
          }

          if (responseC[0].agent_position != null) {
            var agent_position = (responseC[0].agent_position + 1);
          } else {
            var agent_position = (responseC[0].agent_position);
          }

          let reqDataNew: any = {
            agentExtension: agent_extension,
            agentPosition: agent_position,
            agentMobile: "+"+reqData["agentMobile"],
          };
          addWebrtcAgentData(reqData, reqDataNew, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              if (response) {
                let lastInsertedAgentId = response[0];
                let reqDataGroup: addAgentGroupMappingRequest = {
                  agentId: lastInsertedAgentId,
                  groupId: req.body.agentGroups[0] ? req.body.agentGroups[0] : 1,
                  insertDateTime: req.body.insertDateTime
                };
                addAgentGroupMapping(reqDataGroup, (err: any, response1: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    if (response1) {
                      let val = req.body.daysFlag;
                      let days = [];
                      for (let day = 0; day < 7; day++) {
                        let dayValue = Math.pow(2, day);
                        if (dayValue > val) break;
                        if ((val & dayValue) > 0) {
                          switch (dayValue) {
                            case 64:
                              days.push("SUN");
                              break;
                            case 32:
                              days.push("SAT");
                              break;
                            case 16:
                              days.push("FRI");
                              break;
                            case 8:
                              days.push("THU");
                              break;
                            case 4:
                              days.push("WED");
                              break;
                            case 2:
                              days.push("TUE");
                              break;
                            case 1:
                              days.push("MON");
                              break;
                          }
                        }
                      }
                      for (let day of days) {
                        let reqDataTiming: any = {
                          smeId: parseInt(req.params.id),
                          agentId: lastInsertedAgentId,
                          agentName: req.body.agentName,
                          agentMobile: "+"+req.body.agentMobile,
                          status: req.body.status,
                          inTime: req.body.inTime,
                          outTime: req.body.outTime,
                          daysWeek: day,
                          insertDateTime: req.body.insertDateTime
                        };
                        addAgentDetailsTiming(reqDataTiming, (err: any, response2: any) => {
                          if (err) {
                            return ErrorEmptyResponse(res, err);
                          } else {
                          }
                        });
                      }

                      if (reqData["selectedLongCode"] && reqData["selectedLongCode"].length > 0) {
                        let longcodes = reqData["selectedLongCode"];
                        for (let l = 0; l < longcodes.length; l++) {
                          let reqlongcodes: any = {
                            smeId: parseInt(req.params.id),
                            agentId: lastInsertedAgentId,
                            longcode: longcodes[l].id,
                          };
                          addAgentlongcodes(reqlongcodes, (err: any, response5: any) => {
                            if (err) {
                              return ErrorEmptyResponse(res, err);
                            } else {

                            }
                          });
                        }
                      }

                      addSipBuddies(reqData, (err: any, response6: any) => {
                        if (err) {
                          return ErrorEmptyResponse(res, err);
                        } else {
                          let updatedWebrtcNumber: any = {
                            webrtcNumber: reqData["seqWebrtcNumber"]+1,
                          };
                          updateSeqWebrtcNumber(updatedWebrtcNumber, (err: any, response6: any) => {
                            if (err) {
                              return ErrorEmptyResponse(res, err);
                            } else {
                              return SuccessResponse(res, "Webrtc Agent created successfully", response);
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
        }
      });
    }
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


export const updateWebrtcAgentStatus = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agentId ? req.body.agentId : 0,
      status: req.body.status && req.body.status == 1 ? 1 : 0,
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : "",
    };
    await updateWebrtcAgentData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully updated", response);
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};


export const isWebrtcAgentRegister = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      webrtcAgentNumbers: req.body.webrtcAgentNumbers ? req.body.webrtcAgentNumbers : "",
    };
    await isWebrtcAgentRegisterData(reqData, (err: any, response: any) => {
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


export const getAbandonedCalls = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      startDateTime: req.body.startDateTime,
      endDateTime: req.body.endDateTime,
    };
    await getAbandonedCallsData(reqData, (err: any, response: any) => {
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


export const isAgentEmailExist = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentEmail: req.body.agentEmail,
    };
    checkAgentEmailExist(reqData, (err: any, response: any) => {
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

export const isAgentMobileExist = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
      agentMobile: req.body.agentMobile,
    };
    checkAgentMobileExist(reqData, (err: any, response: any) => {
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

async function sleep(ms: any) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}


export const getActiveAgentList = async (req: Request, res: Response) => {
  try {
    let reqData: fetchRequest = {
      id: parseInt(req.params.id),
    };
    await FindActiveAgentOnly(reqData, (err: any, response: any) => {
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

export const getLiveApr = async (req: Request, res: Response) => {
  try {
    var g_startDate ='';
    var g_startDate_op ='';
    var g_endDate='';
    var g_endDate_op='';
    if (req.body.filterList) {
      var filterData = req.body.filterList;
      for (let data of filterData) {
        if(data["name"] =="startDate"){
            g_startDate = data["val"];
            g_startDate_op = data["op"];
        }
        if(data["name"] =="endDate"){
            g_endDate = data["val"];
            g_endDate_op = data["op"];
        }
      }
    }
    
    let reqData: any = {
      smeId: parseInt(req.params.id),
      initialRecord:req.body.initialRecord,
      batchSize: req.body.batchSize,
      startDate: g_startDate,
      startDate_op: g_startDate_op,
      endDate: g_endDate,
      endDate_op: g_endDate_op,
    };
    await getLiveAprData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    ErrorResponse(res, e);
  }
}