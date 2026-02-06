import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, EmptyResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
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
  FindAllSmeIvrPlan,
  FindSmeWiseIvrFlows,
  FindchildrenOfSmeFlow,
  FindchildrenOfSmeFlowDefault,
  FindchildDtmfWait,
  FindinvalidEventFlow,
  FindNoinputEventFlow,
  FindNoinputEventRedirect,
  FindInvalidEventRedirect,
} from "../../../../../domain/models/v2/ivr.model";
import { fetchCallProfileRequestValidate } from "../../../../../domain/entities/v2/ivr.entity";
import { convertTimeZone } from "../../../../../helpers/utility";
import { env } from "../../../../../../infrastructure/env";
import { glogger } from "../../../../../helpers/logger";
import { array } from "fp-ts";

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

    glogger("IMP", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "API Request callingNumber(" + req.body.callingNumber + "), longcode(" + req.body.longcode + ")");

    let obj: any = {};

    await FindSmeProfile(reqData, (err: any, response: any) => {
      if (err) {
        glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "FindSmeProfile, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          obj["sme_profile"] = response;
          var data = JSON.parse(JSON.stringify(response[0]));

          let where: any = {
            sme_id: data["id"],
            longcode: req.body.longcode,
            ip_address: req.body.ipAddress,
          };

          console.log("dkfgdfkjdjkbfdbdkfdjbdkjdbvjbvd       1    fjk===================================");

          FindAllSmeLiveCalls(where, reqDateTime, (err: any, responseAllSmeCalls: any) => {
            if (err) {
              glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "FindAllSmeLiveCalls, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              obj["all_Sme_liveCalls"] = responseAllSmeCalls;

              FindAllSmeIvrPlan(where, (err: any, responseActivatedPlan: any) => {
                if (err) {
                  glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "FindAllSmeIvrPlan, error:" + err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  obj["sme_ivr_plan"] = responseActivatedPlan;
                  FindSelfSmeLiveCalls(where, reqDateTime, (err: any, response2: any) => {
                    if (err) {
                      glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "FindSelfSmeLiveCalls, error:" + err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      obj["self_liveCalls"] = response2;
                      FindSmePrompts(where, (err: any, response3: any) => {
                        if (err) {
                          glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "FindSmePrompts, error:" + err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          obj["smePrompt"] = response3;
                          FindSmeCrmList(where, (err: any, response4: any) => {
                            if (err) {
                              glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "FindSmeCrmList, error:" + err);
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
                                  glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "FindSmeAddressBook, error:" + err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  obj["addressBook"] = response5;
                                  FindSmeAgentList(wheredata, (err: any, response6: any) => {
                                    if (err) {
                                      glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "FindSmeAgentList, error:" + err);
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      obj["agentList"] = response6;
                                      FindblacklistIvrCalls(wheredata, (err: any, response8: any) => {
                                        if (err) {
                                          glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "FindblacklistIvrCalls, error:" + err);
                                          return ErrorEmptyResponse(res, err);
                                        } else {
                                          obj["blackListIvr"] = response8;

                                          FindagentAssignedLongcode(reqData, (err: any, responseAgentAssigned: any) => {
                                            if (err) {
                                              glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "FindagentAssignedLongcode, error:" + err);
                                              return ErrorEmptyResponse(res, err);
                                            } else {
                                              obj["agent_assigned_longcode"] = responseAgentAssigned;
                                              FindagentNonWorkingDays(where, (err: any, responseNonWorkingDay: any) => {
                                                if (err) {
                                                  glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "FindagentNonWorkingDays, error:" + err);
                                                  return ErrorEmptyResponse(res, err);
                                                } else {
                                                  if (responseNonWorkingDay.length > 0) {
                                                    if (responseNonWorkingDay[0].non_working_days == 1) {
                                                      responseNonWorkingDay[0]["non_working_day_profile"] = 1;

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
                                                        responseNonWorkingDay[0]["non_working_day_profile"] = 0;
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
                                                      glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "FindagentNonWorkingHours, error:" + err);
                                                      return ErrorEmptyResponse(res, err);
                                                    } else {
                                                      if (responseNonWorkingHours.length > 0) {
                                                        if (responseNonWorkingHours[0].non_working_hours == 1) {
                                                          const currentDateTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                                                          const currentTime = new Date(currentDateTime).toLocaleTimeString("en-US", { hour12: false }); // Returns a string in the format "HH:mm:ss"
                                                          if (currentTime >= responseNonWorkingHours[0].in_time && currentTime <= responseNonWorkingHours[0].out_time) {
                                                            responseNonWorkingHours[0]["non_working_hour_profile"] = 0;
                                                            obj["non_working_hour"] = responseNonWorkingHours;
                                                          } else {
                                                            responseNonWorkingHours[0]["non_working_hour_profile"] = 1;
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
                                                          glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "FindLongcodeType, error:" + err);
                                                          return ErrorEmptyResponse(res, err);
                                                        } else {
                                                          if (responseLongcodeType.length > 0) {
                                                            let dataType2: any = {
                                                              site_id: responseLongcodeType[0].site_identifier,
                                                            };
                                                            if (responseLongcodeType[0].number_type == "did") {
                                                              /* if incoming longcode is DID then we have provide valid virtual number */
                                                              FindVirtualLongcode(wheredata, dataType2, (err: any, responseVirtual: any) => {
                                                                if (err) {
                                                                  glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "FindVirtualLongcode, error:" + err);
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
                                                              glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "FindAllVirtualNumbers, error:" + err);
                                                              return ErrorEmptyResponse(res, err);
                                                            } else {
                                                              obj["all_longcodes"] = respFindAllVirtualNumbers;
                                                              FindAssignedAgentIdIvrCalls(wheredata, reqData, (err: any, respAssignedAgent: any) => {
                                                                if (err) {
                                                                  glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "FindAssignedAgentIdIvrCalls, error:" + err);
                                                                  return ErrorEmptyResponse(res, err);
                                                                } else {
                                                                  if (respAssignedAgent.length > 0 && respAssignedAgent[0].agent_id != null) {
                                                                    var status;
                                                                    if (respAssignedAgent[0].agent_status == "off_hours") {
                                                                      status = 3;
                                                                    } else {
                                                                      status = respAssignedAgent[0].status;
                                                                    }
                                                                    let resData: any = {
                                                                      agent_id: respAssignedAgent[0].agent_id,
                                                                      agent_name: respAssignedAgent[0].agent_name,
                                                                      agent_mobile: respAssignedAgent[0].agent_mobile,
                                                                      group_name: respAssignedAgent[0].group_name,
                                                                      status: status,
                                                                      agent_email: respAssignedAgent[0].agent_email,
                                                                      sticky_type: respAssignedAgent[0].sticky_type,
                                                                      webrtc_flag: respAssignedAgent[0].webrtc_flag,
                                                                      webrtc_registered_duration: respAssignedAgent[0].webrtc_registered_duration,
                                                                      webrtc_registered_flag: respAssignedAgent[0].webrtc_registered_flag,
                                                                    };
                                                                    obj["assignedAgent"] = resData;
                                                                  } else {
                                                                    obj["assignedAgent"] = [];
                                                                  }

                                                                  FindSmeIvrFlow(where, (err: any, response7: any) => {
                                                                    if (err) {
                                                                      glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "FindSmeIvrFlow, error:" + err);
                                                                      return ErrorEmptyResponse(res, err);
                                                                    } else {
                                                                      console.log("dkfgdfkjdjkbfdbdkfdjbdkjdbvjbvdfjk===================================");
                                                                      if (response7.length > 0) {
                                                                        obj["ivrFlow"] = response7;
                                                                        glogger("DEB", "" + req.headers.sessionid + "", "fetchCallProfile", "SuccessResponse");
                                                                        return SuccessResponse(res, "Successfully listed", obj);
                                                                      } else {
                                                                        FindDefaultIvrFlow(where, (err: any, responsecheck: any) => {
                                                                          if (err) {
                                                                            glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "FindDefaultIvrFlow, error:" + err);
                                                                            return ErrorEmptyResponse(res, err);
                                                                          } else {
                                                                            obj["ivrFlow"] = responsecheck;
                                                                            glogger("DEB", "" + req.headers.sessionid + "", "fetchCallProfile", "SuccessResponse");
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
        } else {
          return SuccessResponse(res, "No data found", obj);
        }
      }
    });
  } catch (e) {
    glogger("ERR", "" + req.headers.sessionid + "", "/ivr/fetchCallProfile", "Exception:" + e);
    ErrorResponse(res, e);
  }
};

export const getSmeIvrFlow = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      sme_id: req.body.sme_id,
      dtmf: req.body.dtmf,
      ivr_id: req.body.ivr_id,
      end_of_media_flag: req.body.end_of_media_flag,
      retry: req.body.retry,
    };
    let catId: number;
    let respData: any = {};

    await FindSmeWiseIvrFlows(reqData, (err: any, response: any) => {
      if (err) {
        glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindSmeWiseIvrFlows", "FindSmeWiseIvrFlows, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          if (response[0].children > 0) {
            if (response[0].cat_id == 0) {
              catId = 1;
            } else {
              catId = response[0].cat_id;
            }
            let reqdata2: any = {
              cat_id: catId,
              flow_id: response[0].flow_id,
            };

            FindchildrenOfSmeFlow(reqData, reqdata2, (err: any, resposene2: any) => {
              if (err) {
                glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindchildrenOfSmeFlow", "FindchildrenOfSmeFlow, error:" + err);
                return ErrorEmptyResponse(res, err);
              } else {
                if (resposene2.length > 0) {
                  if (response[0].children > 0) {
                    let reqData3: any = {
                      cat_id: resposene2[0].cat_id,
                      flow_id: resposene2[0].flow_id,
                    };
                    FindinvalidEventFlow(reqData, reqdata2, async (err: any, InvalidInputres: any) => {
                      if (err) {
                        glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindinvalidEventFlow", "FindinvalidEventFlow, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        respData["invalid"] = InvalidInputres;
                        if (InvalidInputres.length > 0) {
                          if (InvalidInputres[0].redirect_to && InvalidInputres[0].redirect_to.length > 0) {
                            let reqData21: any = {
                              redirect_id: InvalidInputres[0].redirect_to,
                              flow_id: InvalidInputres[0].flow_id,
                            };
                            await FindInvalidEventRedirect(reqData, reqData21, (err: any, RedirectResInvalid: any) => {
                              if (err) {
                                glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindInvalidEventRedirect", "FindInvalidEventRedirect, error:" + err);
                                return ErrorEmptyResponse(res, err);
                              } else {
                                if (RedirectResInvalid.length > 0) {
                                  let reqDataRedirect1: any = {
                                    cat_id: RedirectResInvalid[0].cat_id,
                                    flow_id: RedirectResInvalid[0].flow_id,
                                  };
                                  FindchildDtmfWait(reqData, reqDataRedirect1, (err: any, resposenedtmf11: any) => {
                                    if (err) {
                                      glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindchildDtmfWait", "FindchildDtmfWait, error:" + err);
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      if (resposenedtmf11.length > 0) {
                                        if (resposenedtmf11[0].id > 0) {
                                          RedirectResInvalid[0].child_dtmf_wait = true;
                                          RedirectResInvalid[0].expected_dtmf = resposenedtmf11[0].expected_dtmf;
                                          respData["invalid"][0].invalid_redirect = RedirectResInvalid;
                                        } else {
                                          RedirectResInvalid[0].child_dtmf_wait = false;
                                          RedirectResInvalid[0].expected_dtmf = resposenedtmf11[0].expected_dtmf;
                                          respData["invalid"][0].invalid_redirect = RedirectResInvalid;
                                        }
                                      } else {
                                        RedirectResInvalid[0].child_dtmf_wait = false;
                                        RedirectResInvalid[0].expected_dtmf = "";
                                        respData["invalid"][0].invalid_redirect = RedirectResInvalid;
                                      }
                                    }
                                  });
                                } else {
                                  RedirectResInvalid[0].child_dtmf_wait = false;
                                  RedirectResInvalid[0].expected_dtmf = "";
                                  respData["invalid"][0].invalid_redirect = RedirectResInvalid;
                                }
                              }
                            });
                          }
                        }

                        await FindNoinputEventFlow(reqData, reqdata2, async (err: any, NoInputRes: any) => {
                          if (err) {
                            glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindNoinputEventFlow", "FindNoinputEventFlow, error:" + err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            respData["noinput"] = NoInputRes;
                            if (NoInputRes.length > 0) {
                              if (NoInputRes[0].redirect_to && NoInputRes[0].redirect_to.length > 0) {
                                let reqDataNoinput: any = {
                                  redirect_id: NoInputRes[0].redirect_to,
                                  flow_id: NoInputRes[0].flow_id,
                                };
                                await FindNoinputEventRedirect(reqData, reqDataNoinput, async (err: any, RedirectRes: any) => {
                                  if (err) {
                                    glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindNoinputEventRedirect", "FindNoinputEventRedirect, error:" + err);
                                    return ErrorEmptyResponse(res, err);
                                  } else {
                                    if (RedirectRes.length > 0) {
                                      let reqDataRedirect1: any = {
                                        cat_id: RedirectRes[0].cat_id,
                                        flow_id: RedirectRes[0].flow_id,
                                      };
                                      await  FindchildDtmfWait(reqData, reqDataRedirect1, (err: any, resposenedtmf1: any) => {
                                        if (err) {
                                          glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindchildDtmfWait", "FindchildDtmfWait, error:" + err);
                                          return ErrorEmptyResponse(res, err);
                                        } else {
                                          if (resposenedtmf1.length > 0) {
                                            if (resposenedtmf1[0].id > 0) {
                                              RedirectRes[0].child_dtmf_wait = true;
                                              RedirectRes[0].expected_dtmf = resposenedtmf1[0].expected_dtmf;
                                              respData["noinput"][0].noinput_redirect = RedirectRes;
                                            } else {
                                              RedirectRes[0].child_dtmf_wait = false;
                                              RedirectRes[0].expected_dtmf = resposenedtmf1[0].expected_dtmf;
                                              respData["noinput"][0].noinput_redirect = RedirectRes;
                                              
                                            }
                                          } else {
                                            RedirectRes[0].child_dtmf_wait = false;
                                            RedirectRes[0].expected_dtmf = "";
                                            respData["noinput"][0].noinput_redirect = RedirectRes;
                                           
                                          }
                                        }
                                      });
                                    } else {
                                      RedirectRes[0].child_dtmf_wait = false;
                                      RedirectRes[0].expected_dtmf = "";
                                      respData["noinput"][0].noinput_redirect = RedirectRes;
                                    }
                                  }
                                });
                              }
                            }
                            await FindchildDtmfWait(reqData, reqData3, (err: any, resposenedtmf: any) => {
                              if (err) {
                                glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindchildDtmfWait", "FindchildDtmfWait, error:" + err);
                                return ErrorEmptyResponse(res, err);
                              } else {
                                if (resposenedtmf.length > 0) {
                                  if (resposenedtmf[0].id > 0) {
                                    resposene2[0].child_dtmf_wait = true;
                                    resposene2[0].expected_dtmf = resposenedtmf[0].expected_dtmf;
                                    respData["ivrFlow"] = resposene2;
                                    return SuccessResponse(res, "Success", respData);
                                  } else {
                                    resposene2[0].child_dtmf_wait = false;
                                    resposene2[0].expected_dtmf = resposenedtmf[0].expected_dtmf;
                                    respData["ivrFlow"] = resposene2;
                                    return SuccessResponse(res, "Success", respData);
                                  }
                                } else {
                                  resposene2[0].child_dtmf_wait = false;
                                  resposene2[0].expected_dtmf = "";
                                  respData["ivrFlow"] = resposene2;
                                  return SuccessResponse(res, "Success", respData);
                                }
                              }
                            });
                          }
                        });
                      }
                    });
                  } else {
                    resposene2[0].child_dtmf_wait = false;
                    resposene2[0].expected_dtmf = "";
                    respData["ivrFlow"] = resposene2;
                    return SuccessResponse(res, "Success", respData);
                  }
                } else {
                  reqData["dtmf"] = 99;
                  FindchildrenOfSmeFlowDefault(reqData, reqdata2, async (err: any, resposene3: any) => {
                    if (err) {
                      glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindchildrenOfSmeFlowDefault", "FindchildrenOfSmeFlowDefault, error:" + err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      if (resposene3.length > 0) {
                        if (resposene3[0].children > 0) {
                          let reqData4: any = {
                            cat_id: resposene3[0].cat_id,
                            flow_id: resposene3[0].flow_id,
                          };

                          await FindinvalidEventFlow(reqData, reqData4, async (err: any, InvalidInputres: any) => {
                            if (err) {
                              glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindinvalidEventFlow", "FindinvalidEventFlow, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              respData["invalid"] = InvalidInputres;
                              if (InvalidInputres.length > 0) {
                                if (InvalidInputres[0].redirect_to && InvalidInputres[0].redirect_to.length > 0) {
                                  let reqData21: any = {
                                    redirect_id: InvalidInputres[0].redirect_to,
                                    flow_id: InvalidInputres[0].flow_id,
                                  };
                                  await FindInvalidEventRedirect(reqData, reqData21, (err: any, RedirectResInvalid: any) => {
                                    if (err) {
                                      glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindInvalidEventRedirect", "FindInvalidEventRedirect, error:" + err);
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      if (RedirectResInvalid.length > 0) {
                                        let reqDataRedirect1: any = {
                                          cat_id: RedirectResInvalid[0].cat_id,
                                          flow_id: RedirectResInvalid[0].flow_id,
                                        };
                                        FindchildDtmfWait(reqData, reqDataRedirect1, (err: any, resposenedtmf11: any) => {
                                          if (err) {
                                            glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindchildDtmfWait", "FindchildDtmfWait, error:" + err);
                                            return ErrorEmptyResponse(res, err);
                                          } else {
                                            if (resposenedtmf11.length > 0) {
                                              if (resposenedtmf11[0].id > 0) {
                                                RedirectResInvalid[0].child_dtmf_wait = true;
                                                RedirectResInvalid[0].expected_dtmf = resposenedtmf11[0].expected_dtmf;
                                                respData["invalid"][0].invalid_redirect = RedirectResInvalid;
                                              } else {
                                                RedirectResInvalid[0].child_dtmf_wait = false;
                                                RedirectResInvalid[0].expected_dtmf = resposenedtmf11[0].expected_dtmf;
                                                respData["invalid"][0].invalid_redirect = RedirectResInvalid;
                                              }
                                            } else {
                                              RedirectResInvalid[0].child_dtmf_wait = false;
                                              RedirectResInvalid[0].expected_dtmf = "";
                                              respData["invalid"][0].invalid_redirect = RedirectResInvalid;
                                            }
                                          }
                                        });
                                      } else {
                                        RedirectResInvalid[0].child_dtmf_wait = false;
                                        RedirectResInvalid[0].expected_dtmf = "";
                                        respData["invalid"][0].invalid_redirect = RedirectResInvalid;
                                      }
                                    }
                                  });
                                }
                              }
                              await FindNoinputEventFlow(reqData, reqData4, async (err: any, NoInputRes: any) => {
                                if (err) {
                                  glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindNoinputEventFlow", "FindNoinputEventFlow, error:" + err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  respData["noinput"] = NoInputRes;
                                  if (NoInputRes.length > 0) {
                                    if (NoInputRes[0].redirect_to && NoInputRes[0].redirect_to.length > 0) {
                                      let reqData3: any = {
                                        redirect_id: NoInputRes[0].redirect_to,
                                        flow_id: NoInputRes[0].flow_id,
                                      };
                                      await   FindNoinputEventRedirect(reqData, reqData3, async (err: any, RedirectRes: any) => {
                                        if (err) {
                                          glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindNoinputEventRedirect", "FindNoinputEventRedirect, error:" + err);
                                          return ErrorEmptyResponse(res, err);
                                        } else {
                                          if (RedirectRes.length > 0) {
                                            let reqDataRedirect1: any = {
                                              cat_id: RedirectRes[0].cat_id,
                                              flow_id: RedirectRes[0].flow_id,
                                            };
                                            await FindchildDtmfWait(reqData, reqDataRedirect1, async (err: any, resposenedtmf1: any) => {
                                              if (err) {
                                                glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindchildDtmfWait", "FindchildDtmfWait, error:" + err);
                                                return ErrorEmptyResponse(res, err);
                                              } else {
                                                if (resposenedtmf1.length > 0) {
                                                  if (resposenedtmf1[0].id > 0) {
                                                    RedirectRes[0].child_dtmf_wait = true;
                                                    RedirectRes[0].expected_dtmf = resposenedtmf1[0].expected_dtmf;
                                                    respData["noinput"][0].noinput_redirect = RedirectRes;
                                                  } else {
                                                    RedirectRes[0].child_dtmf_wait = false;
                                                    RedirectRes[0].expected_dtmf = resposenedtmf1[0].expected_dtmf;
                                                    respData["noinput"][0].noinput_redirect = RedirectRes;
                                                  }
                                                  FindchildDtmfWait(reqData, reqData4, (err: any, resposenedtmf2: any) => {
                                                    if (err) {
                                                      glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindchildDtmfWait", "FindchildDtmfWait, error:" + err);
                                                      return ErrorEmptyResponse(res, err);
                                                    } else {
                                                      if (resposenedtmf2.length > 0) {
                                                        if (resposenedtmf2[0].id > 0) {
                                                          resposene3[0].child_dtmf_wait = true;
                                                          resposene3[0].expected_dtmf = resposenedtmf2[0].expected_dtmf;
                                                          respData["ivrFlow"] = resposene3;
                                                          return SuccessResponse(res, "Success", respData);
                                                        } else {
                                                          resposene3[0].child_dtmf_wait = false;
                                                          resposene3[0].expected_dtmf = resposenedtmf2[0].expected_dtmf;
                                                          respData["ivrFlow"] = resposene3;
                                                          return SuccessResponse(res, "Success", respData);
                                                        }
                                                      } else {
                                                        resposene3[0].child_dtmf_wait = false;
                                                        resposene3[0].expected_dtmf = resposenedtmf2[0].expected_dtmf;
                                                        respData["ivrFlow"] = resposene3;
                                                        return SuccessResponse(res, "Success", respData);
                                                      }
                                                    }
                                                  });
                                                } else {
                                                  RedirectRes[0].child_dtmf_wait = false;
                                                  RedirectRes[0].expected_dtmf = "";
                                                  respData["noinput"][0].noinput_redirect = RedirectRes;
                                                  await FindchildDtmfWait(reqData, reqData4, (err: any, resposenedtmf2: any) => {
                                                    if (err) {
                                                      glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindchildDtmfWait", "FindchildDtmfWait, error:" + err);
                                                      return ErrorEmptyResponse(res, err);
                                                    } else {
                                                      if (resposenedtmf2.length > 0) {
                                                        if (resposenedtmf2[0].id > 0) {
                                                          resposene3[0].child_dtmf_wait = true;
                                                          resposene3[0].expected_dtmf = resposenedtmf2[0].expected_dtmf;
                                                          respData["ivrFlow"] = resposene3;
                                                          return SuccessResponse(res, "Success", respData);
                                                        } else {
                                                          resposene3[0].child_dtmf_wait = false;
                                                          resposene3[0].expected_dtmf = resposenedtmf2[0].expected_dtmf;
                                                          respData["ivrFlow"] = resposene3;
                                                          return SuccessResponse(res, "Success", respData);
                                                        }
                                                      } else {
                                                        resposene3[0].child_dtmf_wait = false;
                                                        resposene3[0].expected_dtmf = resposenedtmf2[0].expected_dtmf;
                                                        respData["ivrFlow"] = resposene3;
                                                        return SuccessResponse(res, "Success", respData);
                                                      }
                                                    }
                                                  });
                                                }
                                              }
                                            });
                                          } else {
                                            RedirectRes[0].child_dtmf_wait = false;
                                            RedirectRes[0].expected_dtmf = "";
                                            respData["noinput"][0].noinput_redirect = RedirectRes;
                                            await FindchildDtmfWait(reqData, reqData4, (err: any, resposenedtmf2: any) => {
                                              if (err) {
                                                glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindchildDtmfWait", "FindchildDtmfWait, error:" + err);
                                                return ErrorEmptyResponse(res, err);
                                              } else {
                                                if (resposenedtmf2.length > 0) {
                                                  if (resposenedtmf2[0].id > 0) {
                                                    resposene3[0].child_dtmf_wait = true;
                                                    resposene3[0].expected_dtmf = resposenedtmf2[0].expected_dtmf;
                                                    respData["ivrFlow"] = resposene3;
                                                    return SuccessResponse(res, "Success", respData);
                                                  } else {
                                                    resposene3[0].child_dtmf_wait = false;
                                                    resposene3[0].expected_dtmf = resposenedtmf2[0].expected_dtmf;
                                                    respData["ivrFlow"] = resposene3;
                                                    return SuccessResponse(res, "Success", respData);
                                                  }
                                                } else {
                                                  resposene3[0].child_dtmf_wait = false;
                                                  resposene3[0].expected_dtmf = resposenedtmf2[0].expected_dtmf;
                                                  respData["ivrFlow"] = resposene3;
                                                  return SuccessResponse(res, "Success", respData);
                                                }
                                              }
                                            });
                                          }
                                        }
                                      });
                                    }
                                  } else {
                                    await FindchildDtmfWait(reqData, reqData4, (err: any, resposenedtmf2: any) => {
                                      if (err) {
                                        glogger("ERR", "" + req.headers.sessionid + "", "/ivr/FindchildDtmfWait", "FindchildDtmfWait, error:" + err);
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                        if (resposenedtmf2.length > 0) {
                                          if (resposenedtmf2[0].id > 0) {
                                            resposene3[0].child_dtmf_wait = true;
                                            resposene3[0].expected_dtmf = resposenedtmf2[0].expected_dtmf;
                                            respData["ivrFlow"] = resposene3;
                                            return SuccessResponse(res, "Success", respData);
                                          } else {
                                            resposene3[0].child_dtmf_wait = false;
                                            resposene3[0].expected_dtmf = resposenedtmf2[0].expected_dtmf;
                                            respData["ivrFlow"] = resposene3;
                                            return SuccessResponse(res, "Success", respData);
                                          }
                                        } else {
                                          resposene3[0].child_dtmf_wait = false;
                                          resposene3[0].expected_dtmf = resposenedtmf2[0].expected_dtmf;
                                          respData["ivrFlow"] = resposene3;
                                          return SuccessResponse(res, "Success", respData);
                                        }
                                      }
                                    });
                                  }
                                }
                              });
                            }
                          });
                        } else {
                          resposene3[0].child_dtmf_wait = false;
                          resposene3[0].expected_dtmf = "";
                          respData["ivrFlow"] = resposene3;
                          return SuccessResponse(res, "Success", respData);
                        }
                      } else {
                        return EmptyResponse(res, "Success", []);
                      }
                    }
                  });
                }
              }
            });
          } else {
            return SuccessResponse(res, "Success", []);
          }
        } else {
          return EmptyResponse(res, "Success", []);
        }
      }
    });
  } catch (e) {
    glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/FindSmeWiseIvrFlows", "Exception:" + e);
    ErrorResponse(res, e);
  }
};
