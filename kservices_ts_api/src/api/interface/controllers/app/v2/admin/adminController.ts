import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, userExistsError } from "../../../../../helpers/apiResponse";
import {
  fetchSmeData,
  getPendingLongcodesData,
  getZonesData,
  checkSmeEmailExist,
  getMaxSmeId,
  addUser,
  addUserRole,
  addSmeData,
  updateSequenceGen,
  addSmelongcodes,
  updateLongcodesStatus,
  updateSmeData,
  getAllLongcodesData,
  getAllActiveLongcodesData,
  addLeadSource,
  FindAllProductPackage,
  assignProductToSme,
  enabledSmeAccount,
  UpdatePaymentHistory,
  findSmePassword,
  UpdateAgentRequirements,
  updateSmeNotifyPermission,
  FindAllkommunoSites,
  findSiteWiseLongcode,
  updateSmeSelectedSites,
  addSMEHuntingNumbers,
  getSingleProductDetail,
  deleteSMEHuntingNumbers,
  FindSmeMapLongcodeExist,
  findSmeExistingpackage,
  upgradeSmeproduct,
  fetchSmeDataNew,
  addSmeDataNew,
  addSmelongcodesNew,
  updateLongcodesStatusNew,
  updateSmeAgentsdetails,
  updateAccountSID,
  updateSmeStep1,
  UpdatePlanValidity,
  UpdateClientSatus,
  updateSMEStatus,
  updateNewSmePermission,
  removeLongcodeSme,
  updateLongcodesSMEStatus,
  updateSmeBalanceData,
  removeLongcodeSmeAgentMap,
  FindDataCenter,
  FindTeleOperator,
  InsertLongcode,
  FindLongcodeExist,
  FindlocationOperator,
  updateLongcodeState,
  FindAllLiveEvent,
  UpdateSmeCrmIntegration,
  UpdateSmeCrmIntegrationDetails,
  FindsmeCrmIntegrationDetails,
  InsertSmeCrmIntegrationDetails,
  FindgAllCallModes,
  FindAllAgentData,
  UpdateFinalPaymentSMS,
  findSmeSmsPlan,
  UpdateSmeSmsPlan,
  InsertSmeSmsPlan,
  getAllSmsPackagesData,
  FindSingleSmsPackdetail
} from "../../../../../domain/models/v2/admin.model";
import { randomString, convertTimeZone } from "../../../../../helpers/utility";
import { MailSent } from "../../../../../lib/mailer";
import { getEmailTemplate } from "../../../../../domain/models/email_template.model";
import { env } from "../../../../../../infrastructure/env";
const crypto = require("crypto");
// Get the current timestamp in a specific format
const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);

// Generate a random string of 6 characters
const randomStringOrder = crypto.randomBytes(3).toString("hex").toUpperCase();

// Combine the timestamp and random string to create a unique 14-digit alphanumeric code
const orderID = timestamp + randomStringOrder;

/**
 * get settings.
 *
 * @returns {Object}
 */

export const fetchSme = async (req: Request, res: Response) => {
  try {
    let reqData: any = {};
    await fetchSmeData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Listed", response);
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

export const fetchSmenew = async (req: Request, res: Response) => {
  try {
    let reqData: any = {};
    await fetchSmeDataNew(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Listed", response);
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

export const getPendingLongcodes = async (req: Request, res: Response) => {
  try {
    let reqData: any = {};
    await getPendingLongcodesData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Listed", response);
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

export const getZones = async (req: Request, res: Response) => {
  try {
    let reqData: any = {};
    await getZonesData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Listed", response);
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

export const addSme = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      accountSid: req.body.accountSid ? req.body.accountSid : "",
      allowedAgents: req.body.allowedAgents ? req.body.allowedAgents : 5,
      alternateNumber: req.body.alternateNumber ? req.body.alternateNumber : "",
      balance: req.body.balance ? req.body.balance : 0,
      bizAddress: req.body.bizAddress ? req.body.bizAddress : "",
      emailId: req.body.emailId ? req.body.emailId : "",
      inPermissionFlag: req.body.inPermissionFlag ? req.body.inPermissionFlag : 0,
      language: req.body.language ? req.body.language : 0,
      masking: req.body.masking ? req.body.masking : 0,
      outPermissionFlag: req.body.outPermissionFlag ? req.body.outPermissionFlag : 0,
      recValidity: req.body.recValidity ? req.body.recValidity : 0,
      recording: req.body.recording ? req.body.recording : 0,
      selectionAlgo: req.body.selectionAlgo ? req.body.selectionAlgo : "",
      smeMobile: req.body.smeMobile ? req.body.smeMobile : "",
      role: "Client",
      password: randomString(10),
      smeName: req.body.smeName ? req.body.smeName : "",
      status: req.body.status ? req.body.status : 1,
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : "0000-00-00 00:00:00",
      stickyAlgo: req.body.stickyAlgo ? req.body.stickyAlgo : 0,
      voicemail: req.body.voicemail ? req.body.voicemail : 0,
      zoneId: req.body.zoneId ? req.body.zoneId : 0,
      billingStatus: req.body.billingStatus ? req.body.billingStatus : 0,
      queueLimit: req.body.queueLimit ? req.body.queueLimit : 0,
      longCodes: req.body.longCodes ? req.body.longCodes : [],
      outChannels: req.body.outChannels ? req.body.outChannels : 0,
      callFlowLimit: req.body.callFlowLimit ? req.body.callFlowLimit : 0,
      defaultLeadSource: req.body.defaultLeadSource ? req.body.defaultLeadSource : [],
    };

    await checkSmeEmailExist(reqData, (err: any, response: any) => {
      if (response && response[0] && response[0].email_id) {
        return userExistsError(res, "Email already used by another client");
      } else {
        getMaxSmeId(reqData, (err: any, response: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
            let reqDataNew: any = {
              smeId: response[0].seq_col_value,
            };
            addUser(reqDataNew, reqData, (err: any, response: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                addUserRole(reqDataNew, reqData, (err: any, response: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    addSmeData(reqDataNew, reqData, (err: any, response: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        let seqData: any = {
                          smeId: reqDataNew["smeId"] + 1,
                        };
                        updateSequenceGen(seqData, (err: any, response: any) => {
                          if (err) {
                            return ErrorEmptyResponse(res, err);
                          } else {
                            getEmailTemplate({ type: "add_client" }, (err: any, emailTemp: any) => {
                              if (err) {
                                return ErrorEmptyResponse(res, err);
                              } else {
                                if (emailTemp.length > 0) {
                                  let dataRequest: any = {
                                    to: reqData["emailId"],
                                    subject: emailTemp[0]["title"],
                                    message: emailTemp[0]["content"]
                                      .replace("{{password}}", reqData["password"])
                                      .replace("{{clientName}}", reqData["smeName"])
                                      .replace("{{smeId}}", reqDataNew["smeId"])
                                      .replace("{{siteUrl}}", env.SITE_ADMIN_URL + "kui")
                                      .replace("{{clientName}}", reqData["smeName"]),
                                  };
                                  MailSent(dataRequest);
                                } else {
                                  return ErrorEmptyResponse(res, "Email template not found");
                                }
                              }
                            });

                            if (reqData["longCodes"] && reqData["longCodes"].length > 0) {
                              let longcodes = reqData["longCodes"];
                              for (let l = 0; l < longcodes.length; l++) {
                                let reqlongcodes: any = {
                                  smeId: reqDataNew["smeId"],
                                  longcode: longcodes[l].id,
                                };
                                addSmelongcodesNew(reqlongcodes, (err: any, response5: any) => {
                                  if (err) {
                                    return ErrorEmptyResponse(res, err);
                                  } else {
                                    updateLongcodesStatusNew(reqlongcodes, (err: any, response5: any) => {
                                      if (err) {
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                      }
                                    });
                                  }
                                });
                              }
                            }

                            if (reqData["defaultLeadSource"] && reqData["defaultLeadSource"].length > 0) {
                              let defaultLeadSource = reqData["defaultLeadSource"];
                              for (let l = 0; l < defaultLeadSource.length; l++) {
                                let reqLeadSource: any = {
                                  smeId: reqDataNew["smeId"],
                                  leadSource: defaultLeadSource[l].leadSource,
                                  description: defaultLeadSource[l].description,
                                  insertDateTime: reqData["insertDateTime"],
                                };
                                addLeadSource(reqLeadSource, (err: any, response5: any) => {
                                  if (err) {
                                    return ErrorEmptyResponse(res, err);
                                  } else {
                                  }
                                });
                              }
                            }
                            return SuccessResponse(res, "Client created successfully! username and password sent to your registered email.", reqDataNew);
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

// save client create step 1 form in admin panel
export const addSmeNew = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      alternateNumber: req.body.alternateNumber ? req.body.alternateNumber : "",
      bizAddress: req.body.bizAddress ? req.body.bizAddress : "",
      emailId: req.body.emailId ? req.body.emailId : "",
      smeMobile: req.body.smeMobile ? req.body.smeMobile : "",
      role: "Client",
      password: randomString(10),
      smeName: req.body.smeName ? req.body.smeName : "",
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : "0000-00-00 00:00:00",
      zoneId: req.body.zoneId ? req.body.zoneId : 0,
      queueLimit: req.body.queueLimit ? req.body.queueLimit : 0,
    };

    await checkSmeEmailExist(reqData, (err: any, response: any) => {
      if (response && response[0] && response[0].email_id) {
        return userExistsError(res, "Email already used by another client");
      } else {
        getMaxSmeId(reqData, (err: any, response: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
            let reqDataNew: any = {
              smeId: response[0].seq_col_value,
            };
            addUser(reqDataNew, reqData, (err: any, response: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                addUserRole(reqDataNew, reqData, (err: any, response: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    addSmeDataNew(reqDataNew, reqData, (err: any, response: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        let seqData: any = {
                          smeId: reqDataNew["smeId"] + 1,
                        };
                        updateSequenceGen(seqData, (err: any, response: any) => {
                          if (err) {
                            return ErrorEmptyResponse(res, err);
                          } else {
                            if (reqData["defaultLeadSource"] && reqData["defaultLeadSource"].length > 0) {
                              let defaultLeadSource = reqData["defaultLeadSource"];
                              for (let l = 0; l < defaultLeadSource.length; l++) {
                                let reqLeadSource: any = {
                                  smeId: reqDataNew["smeId"],
                                  leadSource: defaultLeadSource[l].leadSource,
                                  description: defaultLeadSource[l].description,
                                  insertDateTime: reqData["insertDateTime"],
                                };
                                addLeadSource(reqLeadSource, (err: any, response5: any) => {
                                  if (err) {
                                    return ErrorEmptyResponse(res, err);
                                  } else {
                                  }
                                });
                              }
                            }
                            return SuccessResponse(res, "Client created successfully!", reqDataNew);
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

// save client create step 2 form in admin panel
export const updateSmeAgentDetailsNew = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      allowedAgents: req.body.allowedAgents ? req.body.allowedAgents : 5,
      autodialer: req.body.autodialer ? req.body.autodialer : 0,
      incomingChannel: req.body.incomingChannel ? req.body.incomingChannel : 0,
      outgoingChannel: req.body.outgoingChannel ? req.body.outgoingChannel : 0,
      webrtcChannel: req.body.webrtcChannel ? req.body.webrtcChannel : 0,
      textSpeechChannel: req.body.textSpeechChannel ? req.body.textSpeechChannel : 0,
      smeId: req.params.id,
      getCurrentDate: getCurrentDate,
    };

    await updateSmeAgentsdetails(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Agent Details updated successfully!", response);
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

export const updateSme = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: req.body.smeId ? req.body.smeId : "",
      smeName: req.body.smeName ? req.body.smeName : "",
      smeMobile: req.body.smeMobile ? req.body.smeMobile : "",
      alternateNumber: req.body.alternateNumber ? req.body.alternateNumber : "",
      bizAddress: req.body.bizAddress ? req.body.bizAddress : "",
      language: req.body.language ? req.body.language : 0,
      masking: req.body.masking ? req.body.masking : 0,
      outPermissionFlag: req.body.outPermissionFlag ? req.body.outPermissionFlag : 0,
      voicemail: req.body.voicemail ? req.body.voicemail : 0,
      recording: req.body.recording ? req.body.recording : 0,
      stickyAlgo: req.body.stickyAlgo ? req.body.stickyAlgo : 0,
      allowedAgents: req.body.allowedAgents ? req.body.allowedAgents : 5,
      accountSid: req.body.accountSid ? req.body.accountSid : "",
      emailId: req.body.emailId ? req.body.emailId : "",
      inPermissionFlag: req.body.inPermissionFlag ? req.body.inPermissionFlag : 0,
      recValidity: req.body.recValidity ? req.body.recValidity : 0,
      selectionAlgo: req.body.selectionAlgo ? req.body.selectionAlgo : "",
      status: req.body.status ? req.body.status : 1,
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : "0000-00-00 00:00:00",
      zoneId: req.body.zoneId ? req.body.zoneId : 0,
      billingStatus: req.body.billingStatus ? req.body.billingStatus : 0,
      queueLimit: req.body.queueLimit ? req.body.queueLimit : 0,
      longCodes: req.body.longCodes ? req.body.longCodes : [],
      outChannels: req.body.outChannels ? req.body.outChannels : 0,
      callFlowLimit: req.body.callFlowLimit ? req.body.callFlowLimit : 0,
    };

    await updateSmeData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (reqData["longCodes"] && reqData["longCodes"].length > 0) {
          let longcodes = reqData["longCodes"];
          for (let l = 0; l < longcodes.length; l++) {
            let reqlongcodes: any = {
              smeId: reqData["smeId"],
              longcode: longcodes[l].id,
            };
            addSmelongcodes(reqlongcodes, (err: any, response5: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                updateLongcodesStatus(reqlongcodes, (err: any, response5: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                  }
                });
              }
            });
          }
        }
        return SuccessResponse(res, "Client updated successfully! username and password sent to your registered email.", response);
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const getAllLongcodes = async (req: Request, res: Response) => {
  try {
    let reqData: any = {};
    await getAllLongcodesData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Listed", response);
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

export const addSmeLongcodes = async (req: Request, res: Response) => {
  try {
    let reqlongcodes: any = {
      smeId: req.params.id,
      longcode: req.body.longecodeId,
    };
    await addSmelongcodes(reqlongcodes, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        updateLongcodesStatus(reqlongcodes, (err: any, response5: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
            return SuccessResponse(res, "Successfully Listed", response);
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

export const removeLongcode = async (req: Request, res: Response) => {
  try {
    let reqlongcodes: any = {
      smeId: req.params.id,
      longcode: req.body.longecodeId,
    };
    await removeLongcodeSme(reqlongcodes, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        removeLongcodeSmeAgentMap(reqlongcodes, (err: any, response: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
            updateLongcodesSMEStatus(reqlongcodes, (err: any, response5: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                return SuccessResponse(res, "Successfully Listed", response);
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

export const getAllActiveLongcodes = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      sme_id: req.params.id,
    };
    await getAllActiveLongcodesData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Listed", response);
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

export const getAllProductPackage = async (req: Request, res: Response) => {
  try {
    let reqData: any = {};
    await FindAllProductPackage(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Listed", response);
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

export const updateClientPlan = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      packId: req.body.packId,
      smeId: req.params.id,
      planActualPrice: req.body.planActualPrice ? req.body.planActualPrice : 0,
      insertDateTime: getCurrentDate,
    };
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

export const finalclientCreateSubmission = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      packId: req.body.packId,
      smeId: req.params.id,
      planValidity: req.body.selectedMonths ? req.body.selectedMonths : 0,
      planExpiration_date: req.body.PackexpirationDate ? req.body.PackexpirationDate : 0,
      planActualPrice: req.body.planActualPrice ? req.body.planActualPrice : 0,
      status: req.body.status ? req.body.status : 0,
      amountPaid: req.body.totalAmountPaid ? req.body.totalAmountPaid : 0,
      billingStatus: req.body.billingStatus ? req.body.billingStatus : 0,
      insertDateTime: getCurrentDate,
      paymentDoneBy: "Kommuno_admin",
      orderID: "admin" + orderID,
    };

    await getSingleProductDetail(reqData, (err: any, responseSingleP: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (responseSingleP.length > 0) {
          let reqDataNew: any = {
            minutes: responseSingleP[0].minutes ? responseSingleP[0].minutes : 0,
            no_of_calls: responseSingleP[0].no_of_calls ? responseSingleP[0].no_of_calls : 0,
            unlimitedCalls: responseSingleP[0].unlimited_pack,
            agentLimit: req.body.allowedAgents ? req.body.allowedAgents : 0,
            pack_type: responseSingleP[0].pack_type ? responseSingleP[0].pack_type : 0,
          };
          findSmeExistingpackage(reqData, (err: any, responseExistinPackage: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              if (responseExistinPackage.length > 0) {
                upgradeSmeproduct(reqData, reqDataNew, (err: any, responseUpgradeSmeP: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    if (responseUpgradeSmeP.length > 0) {
                      UpdateClientSatus(reqData, (err: any, responseStatusU: any) => {
                        if (err) {
                          return ErrorEmptyResponse(res, err);
                        } else {
                          UpdatePaymentHistory(reqData, (err: any, responseHistory: any) => {
                            if (err) {
                              return ErrorEmptyResponse(res, err);
                            } else {
                              if (responseHistory.length > 0) {
                                return SuccessResponse(res, "new pack updated successfully!", responseHistory);
                              } else {
                                return ErrorEmptyResponse(res, "Api failed for update payment history");
                              }
                            }
                          });
                        }
                      });
                    } else {
                      return ErrorEmptyResponse(res, "Api failed for update product");
                    }
                  }
                });
              } else {
                assignProductToSme(reqData, reqDataNew, (err: any, response: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    if (response.length > 0) {
                      UpdateClientSatus(reqData, (err: any, responseStatus: any) => {
                        if (err) {
                          return ErrorEmptyResponse(res, err);
                        } else {
                          if (responseStatus.length > 0) {
                            UpdatePaymentHistory(reqData, (err: any, responseHistory: any) => {
                              if (err) {
                                return ErrorEmptyResponse(res, err);
                              } else {
                                if (responseHistory.length > 0) {
                                  enabledSmeAccount(reqData, (err: any, response2: any) => {
                                    if (err) {
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      findSmePassword(reqData, (err: any, response3: any) => {
                                        if (err) {
                                          return ErrorEmptyResponse(res, err);
                                        } else {
                                          getEmailTemplate({ type: "add_client" }, (err: any, emailTemp: any) => {
                                            if (err) {
                                              return ErrorEmptyResponse(res, err);
                                            } else {
                                              if (emailTemp.length > 0) {
                                                let dataRequest: any = {
                                                  to: response3[0].email_id,
                                                  subject: emailTemp[0]["title"],
                                                  message: emailTemp[0]["content"]
                                                    .replace("{{password}}", response3[0].password)
                                                    .replace("{{clientName}}", response3[0].name)
                                                    .replace("{{smeId}}", reqData["smeId"])
                                                    .replace("{{siteUrl}}", env.SITE_ADMIN_URL)
                                                    .replace("{{clientName}}", reqData["smeName"]),
                                                };
                                                MailSent(dataRequest);
                                              } else {
                                                return ErrorEmptyResponse(res, "Email template not found");
                                              }
                                            }
                                          });
                                          return SuccessResponse(res, "Client updated successfully! username and password sent to your registered email.", response2);
                                        }
                                      });
                                    }
                                  });
                                } else {
                                  return ErrorEmptyResponse(res, "Api failed update payment history");
                                }
                              }
                            });
                          } else {
                            return ErrorEmptyResponse(res, "Api failed for update sme satus");
                          }
                        }
                      });
                    } else {
                      return ErrorEmptyResponse(res, "Api failed ");
                    }
                  }
                });
              }
            }
          });
        } else {
          return ErrorEmptyResponse(res, "No product found");
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

export const UpdateAgentRequirement = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: req.params.id,
      inPermissionFlag: req.body.inPermissionFlag ? req.body.inPermissionFlag : 0,
      incomingChannel: req.body.incomingChannel ? req.body.incomingChannel : 0,
      outPermissionFlag: req.body.outPermissionFlag ? req.body.outPermissionFlag : 0,
      outgoingChannel: req.body.outgoingChannel ? req.body.outgoingChannel : 0,
      webrtcChannel: req.body.webrtcChannel ? req.body.webrtcChannel : 0,
      webrtcPermissionFlag: req.body.webrtcPermissionFlag ? req.body.webrtcPermissionFlag : 0,

      autoDialerChannel: req.body.autoDialerChannel ? req.body.autoDialerChannel : 0,
      autoDialerPermissionFlag: req.body.autoDialerPermissionFlag ? req.body.autoDialerPermissionFlag : 0,

      allowedAgents: req.body.allowedAgents ? req.body.allowedAgents : 5,
      outgoingAgent: req.body.outgoingAgent ? req.body.outgoingAgent : 0,
      incomingAgent: req.body.incomingAgent ? req.body.incomingAgent : 0,
      parallel_ringing_channels: req.body.parallel_ringing_channels ? req.body.parallel_ringing_channels : 0,
    };

    await UpdateAgentRequirements(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Updated", response);
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

export const updateSmeNotifyPermissions = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: req.params.id,
      endCallNotification: req.body.endCallNotification ? req.body.endCallNotification : 0,
    };

    await updateSmeNotifyPermission(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Updated", response);
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

export const getkommunoSitesList = async (req: Request, res: Response) => {
  try {
    let reqData: any = {};
    await FindAllkommunoSites(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Listed", response);
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

export const getSiteWiseLongcodeList = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      siteId: req.body.siteId ? req.body.siteId : 0,
    };
    await findSiteWiseLongcode(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Listed", response);
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

export const UpdateSMEHuntingNumbers = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      smeId: req.params.id,
      longCodes: req.body.longCodes ? req.body.longCodes : [],
      primarySiteId: req.body.primarySiteId ? req.body.primarySiteId : 0,
      secondarySiteId: req.body.secondarySiteId ? req.body.secondarySiteId : 0,
      accountSid: req.body.accountSid ? req.body.accountSid : "",
    };
    //commengt primiary and secondary site longcode logic

    await updateAccountSID(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully updated", response);
      }
    });

    // await updateSmeSelectedSites(reqData, (err: any, response: any) => {
    //   if (err) {
    //     return ErrorEmptyResponse(res, err);
    //   } else {
    //     deleteSMEHuntingNumbers(reqData, (err: any, response: any) => {
    //       if (err) {
    //         return ErrorEmptyResponse(res, err);
    //       } else {
    //         if (reqData["longCodes"] && reqData["longCodes"].length > 0) {
    //           let longcodes = reqData["longCodes"];
    //           for (let l = 0; l < longcodes.length; l++) {
    //             let reqlongcodes: any = {
    //               smeId: req.params.id,
    //               longcodePrimaryId: longcodes[l].idp_val,
    //               longcodeSecondaryId: longcodes[l].ids_val,
    //               primaryLongcode: longcodes[l].idp,
    //               secondaryLongcode: longcodes[l].ids,
    //               insertDateTime: getCurrentDate
    //             };
    //             addSMEHuntingNumbers(reqlongcodes, (err: any, response2: any) => {
    //               if (err) {
    //                 return ErrorEmptyResponse(res, err);
    //               } else {
    //                 FindSmeMapLongcodeExist(reqlongcodes, (err: any, responseMap: any) => {
    //                   if (err) {
    //                     return ErrorEmptyResponse(res, err);
    //                   } else {
    //                     if (responseMap.length <= 0) {
    //                       addSmelongcodesNew(reqlongcodes, (err: any, response3: any) => {
    //                         if (err) {
    //                           return ErrorEmptyResponse(res, err);
    //                         } else {
    //                           updateLongcodesStatusNew(reqlongcodes, (err: any, response4: any) => {
    //                             if (err) {
    //                               return ErrorEmptyResponse(res, err);
    //                             } else {

    //                             }
    //                           });
    //                         }
    //                       });
    //                     }
    //                   }
    //                 });

    //               }
    //             });
    //           }
    //           return SuccessResponse(res, "Successfully updated", response);
    //         }
    //       }
    //     });
    //   }
    // });
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

export const updatestep1 = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: req.params.id,
      alternateNumber: req.body.alternateNumber ? req.body.alternateNumber : "",
      bizAddress: req.body.bizAddress ? req.body.bizAddress : "",
      emailId: req.body.emailId ? req.body.emailId : "",
      smeMobile: req.body.smeMobile ? req.body.smeMobile : "",
      smeName: req.body.smeName ? req.body.smeName : "",
      zoneId: req.body.zoneId ? req.body.zoneId : 0,
      queueLimit: req.body.queueLimit ? req.body.queueLimit : 0,
    };
    await updateSmeStep1(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Client updated successfully!", response);
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const updateClientStatus = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      smeId: req.body.id,
      status: req.body.status,
      getCurrentDate: getCurrentDate,
    };
    await updateSMEStatus(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "updated successfully!", response);
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const UpdateClientPermission = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: req.params.id,
      voicemail: req.body.voicemail ? req.body.voicemail : 0,
      masking: req.body.masking ? req.body.masking : 0,
      recording: req.body.recording ? req.body.recording : 0,
      textSpeechChannel: req.body.textSpeechChannel ? req.body.textSpeechChannel : 0,
      textSpeechPermissionFlag: req.body.textSpeechPermissionFlag ? req.body.textSpeechPermissionFlag : 0,
      selectionAlgo: req.body.selectionAlgo ? req.body.selectionAlgo : "",
      stickyAlgo: req.body.stickyAlgo ? req.body.stickyAlgo : 0,
      leadManagerPermissionFlag: req.body.leadManagerPermissionFlag ? req.body.leadManagerPermissionFlag : 0,
      editAgentDetailsPermissionFlag: req.body.editAgentDetailsPermissionFlag ? req.body.editAgentDetailsPermissionFlag : 0,
      callFlowLimit: req.body.callFlowLimit ? req.body.callFlowLimit : 0,
      randomSearchLongcode: req.body.randomSearchLongcode ? req.body.randomSearchLongcode : 0,
      userVersion: req.body.userVersion ? req.body.userVersion : 1,
      whatsappPermissionFlag: req.body.whatsappPermissionFlag ? req.body.whatsappPermissionFlag : 0,
      whatsappLimit: req.body.whatsappLimit ? req.body.whatsappLimit : 0,
    };

    await updateNewSmePermission(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Updated", response);
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

export const updateSmeBalance = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: req.params.id,
      billingStatus: req.body.billingStatus ? req.body.billingStatus : 0,
    };

    await updateSmeBalanceData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Updated", response);
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

export const getdataCenter = async (req: Request, res: Response) => {
  try {
    let reqData: any = {};
    await FindDataCenter(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Listed", response);
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

export const getteleOperator = async (req: Request, res: Response) => {
  try {
    let reqData: any = {};
    await FindTeleOperator(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Listed", response);
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

export const addLongcode = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      longCode: "91" + req.body.longCode,
      operatorName: req.body.operatorName,
      numberType: req.body.numberType,
      siteId: req.body.siteId,
      dataCenter: req.body.dataCenter,
      type: req.body.type,
      insertDateTime: getCurrentDate,
      location: "",
    };
    await FindLongcodeExist(reqData, (err: any, responseA: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (responseA.length > 0) {
          return ErrorEmptyResponse(res, "Longcode already exist");
        } else {
          FindlocationOperator(reqData, (err: any, responseO: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              if (responseO.length > 0) {
                reqData["location"] = responseO[0].location;
              }
              InsertLongcode(reqData, (err: any, response: any) => {
                if (err) {
                  return ErrorEmptyResponse(res, err);
                } else {
                  return SuccessResponse(res, "updated successfully!", response);
                }
              });
            }
          });
        }
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const updateLongcodeStatus = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: req.params.id,
      status: req.params.status,
    };

    await updateLongcodeState(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Updated", response);
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

export const getAllLiveEvent = async (req: Request, res: Response) => {
  try {
    let reqData: any = {};
    await FindAllLiveEvent(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Listed", response);
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

export const getAllCallModes = async (req: Request, res: Response) => {
  try {
    let reqData: any = {};
    await FindgAllCallModes(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Listed", response);
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

export const UpdateClientCrmIntegration = async (req: Request, res: Response) => {
  try {
    let liveEventTypes = req.body.liveEventTypeState.map((obj: { id: any }) => obj.id).join("|");

    let callModeEvents = req.body.callModeTypeState.map((obj: { id: any }) => obj.id).join("|");
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      smeId: req.params.id,
      crmIntegration: req.body.crmIntegration ? req.body.crmIntegration : "0",
      liveEventTypeState: liveEventTypes ? liveEventTypes : "",
      crmPartner: req.body.crmPartner ? req.body.crmPartner : "",
      crmOutgoingUrl: req.body.crmOutgoingUrl ? req.body.crmOutgoingUrl : "",
      crmOutgoingAuthToken: req.body.crmOutgoingAuthToken ? req.body.crmOutgoingAuthToken : "",
      crmOutgoingUrlProviders: req.body.crmOutgoingUrlProviders ? req.body.crmOutgoingUrlProviders : "",
      crmIncomingUrl: req.body.crmIncomingUrl ? req.body.crmIncomingUrl : "",
      crmIncomingToken: req.body.crmIncomingToken ? req.body.crmIncomingToken : "",
      crmIncomingUrlProvider: req.body.crmIncomingUrlProvider ? req.body.crmIncomingUrlProvider : "",
      crmRecordingUrl: req.body.crmRecordingUrl ? req.body.crmRecordingUrl : "",
      crmRecordingAuthToken: req.body.crmRecordingAuthToken ? req.body.crmRecordingAuthToken : "",
      crmRecordingUrlProvider: req.body.crmRecordingUrlProvider ? req.body.crmRecordingUrlProvider : "",
      crmCallPopupUrl: req.body.crmCallPopupUrl ? req.body.crmCallPopupUrl : "",
      crmCallPopupAuthToken: req.body.crmCallPopupAuthToken ? req.body.crmCallPopupAuthToken : "",
      crmCallPopupProvider: req.body.crmCallPopupProvider ? req.body.crmCallPopupProvider : "",
      crmPushSmsUrl: req.body.crmPushSmsUrl ? req.body.crmPushSmsUrl : "",
      crmPushSmsAuthToken: req.body.crmPushSmsAuthToken ? req.body.crmPushSmsAuthToken : "",
      crmPushSmsProvider: req.body.crmPushSmsProvider ? req.body.crmPushSmsProvider : "",
      insert_date_time: getCurrentDate,
      callModeTypeState: callModeEvents,
    };

    await FindsmeCrmIntegrationDetails(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          UpdateSmeCrmIntegrationDetails(reqData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              UpdateSmeCrmIntegration(reqData, (err: any, response: any) => {
                if (err) {
                  return ErrorEmptyResponse(res, err);
                } else {
                  return SuccessResponse(res, "Successfully Updated", response);
                }
              });
            }
          });
        } else {
          InsertSmeCrmIntegrationDetails(reqData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              UpdateSmeCrmIntegration(reqData, (err: any, response: any) => {
                if (err) {
                  return ErrorEmptyResponse(res, err);
                } else {
                  return SuccessResponse(res, "Successfully Updated", response);
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

export const getAllAgents = async (req: Request, res: Response) => {
  try {
    var searchLeads = "";
    var searchLeads_op = "";
    var searchLeads_category = "";
    var smeId = '';
    var smeId_op = '';
    var agentId = '';
    var agentId_op = '';

    if (req.body.filterList) {
      var getUniqueCallsData = req.body.filterList;
      for (let data of getUniqueCallsData) {
        if (data["name"] == "searchLeads") {
          searchLeads = data["val"];
          searchLeads_op = data["op"];
          searchLeads_category = data["category"];
        }

        if (data["name"] == "smeId") {
          smeId = data["val"];
          smeId_op = data["op"];
        }

        if (data["name"] == "agentId") {
          agentId = data["val"];
          agentId_op = data["op"];
        }
      }
    }
    let reqData: any = {
      initialRecord: req.body.initialRecord,
      batchSize: req.body.batchSize,
      searchLeads: searchLeads,
      searchLeads_op: searchLeads_op,
      searchLeads_category: searchLeads_category,
      smeId: smeId,
      smeId_op: smeId_op,
      agentId: agentId,
      agentId_op: agentId_op
    };
    await FindAllAgentData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Listed", response);
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



export const UpdateSmeSMSBalance = async (req: Request, res: Response) => {
  try {

    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);

    let reqData: any = {
      smeId: parseInt(req.params.id),
      paymentId: req.body.smsPackid,
      response: "",
      packageId: req.body.smsPackid,
      amount: 0,
      orderID: "admin" + orderID,
      packageType: "SMS",
      status: "Success",
      packQuantity: req.body.smsbalanceAdd,
      insert_date_time: getCurrentDate

    };

    await FindSingleSmsPackdetail(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {

        UpdateFinalPaymentSMS(reqData, (err: any, responseA: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
            findSmeSmsPlan(reqData, (err: any, responseB: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                if (responseB.length > 0) {
                  let reqData3: any = {
                    smsCountUpdate: responseB[0].balance + (response[0].sms_count * reqData['packQuantity']),
                  }
                  UpdateSmeSmsPlan(reqData, reqData3, (err: any, responseC: any) => {
                    if (err) {
                      return ErrorEmptyResponse(res, err);
                    } else {
                      return SuccessResponse(res, "Successfully payment created", responseC);
                    }
                  });
                } else {
                  InsertSmeSmsPlan(reqData, (err: any, responsD: any) => {
                    if (err) {
                      return ErrorEmptyResponse(res, err);
                    } else {
                      return SuccessResponse(res, "Successfully payment created", responsD);
                    }
                  });
                }
              }
            });
          }
        });


      }
    });


  } catch (e) {
    console.log(e);
  }
};


export const getAllSmsPackages = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
    };
    await getAllSmsPackagesData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          return SuccessResponse(res, "Successfully listed", response);
        } else {
          return SuccessResponse(res, "Successfully listed", []);
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