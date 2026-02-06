import { Request, Response } from "express";
import { logger, loggerFileError } from "../../../../../lib/logger";
import { glogger } from "../../../../../helpers/logger";
import { ErrorResponse, SuccessResponse, SuccessResponseWithCount, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import {
  UpdateUniqueCall,
  GetUniqueCalls,
  TotalUniqueCall,
  getCallsPerformanceData,
  checkManualLeadExist,
  addManualLeadData,
  deleteUniqueDetailData,
  leadTransferData,
  uploadLeadNumbers,
  bulkLeadTransferData,
  updateManualLeadData,
  updateLeadStatusOnLiveCallData,
  getFrequencyCalls,
  bulkLeadStatusTransferData,
  checkAddressBookCustomerExist,
  addAddressBookCustomer,
  updateAddressBookCustomer,
  followupTransferData,
  copyCampaignToLeadData,
} from "../../../../../domain/models/v3/sme.model";
import {
  checkTotalLeadStatusSummaryExist,
  updateTotalLeadStatusSummaryData,
  insertTotalLeadStatusSummaryData,
  checkTotalLeadSourceSummaryExist,
  updateTotalLeadSourceSummaryData,
  insertTotalLeadSourceSummaryData,
  checkTotalLeadProductSummaryExist,
  updateTotalLeadProductSummaryData,
  insertTotalLeadProductSummaryData,
  checkTotalLeadTypeSummaryExist,
  updateTotalLeadTypeSummaryData,
  insertTotalLeadTypeSummaryData,
  checkTotalLeadCitySummaryExist,
  updateTotalLeadCitySummaryData,
  insertTotalLeadCitySummaryData,
} from "../../../../../domain/models/v3/ivr.model";
import { uniqueCustomerDetail } from "../../../../../domain/schema/mongo/uniqueCustomerDetail.schema";
import { getUniqueCallsRequest, fetchCallperformance } from "../../../../../domain/entities/v3/sme.entity";
import { convertTimeZone } from "../../../../../helpers/utility";
import { env } from "../../../../../../infrastructure/env";
import { MailSent } from "../../../../../lib/mailer";

/**
 * get settings.
 *
 * @returns {Object}
 */

export const updateUniqueCalls = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);

    let reqData: any = {
      id: parseInt(req.params.id),
      smeId: parseInt(req.params.id),
      callId: parseInt(req.body.id),
      cityId: req.body.cityId ? req.body.cityId : 0,
      productId: req.body.productId ? parseInt(req.body.productId) : 0,
      productPrice: req.body.productPrice ? parseInt(req.body.productPrice) : 0,
      leadAssignedAgent: req.body.leadAssignedAgent ? parseInt(req.body.leadAssignedAgent) : 0,
      leadType: req.body.leadType ? req.body.leadType : 0,
      leadStatus: req.body.leadStatus ? req.body.leadStatus : 0,
      customerName: req.body.customerName ? req.body.customerName : "",
      insertDateTime: req.body.insertDateTime,
      sourceId: req.body.sourceId ? req.body.sourceId : 0,
      oldValue: req.body.oldValue ? req.body.oldValue : 0,
      agentId: req.body.recentPatchedAgentId ? (req.body.recentPatchedAgentId == 2 ? req.body.leadAssignedAgent : 0) : 0,
      leadStatusCount: 1,
      leadSourceCount: 1,
      leadProductCount: 1,
      leadTypeCount: 1,
      leadCityCount: 1,
      other: req.body.other ? req.body.other : "",
      currentdateTime: getCurrentDate,
      stickyType: req.body.stickyType ? req.body.stickyType : 0,
    };

    await UpdateUniqueCall(reqData, async (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        /* Get Total Lead Status Summary data*/
        if (req.body && req.body.field && req.body.field == "lead_status") {
          await checkTotalLeadStatusSummaryExist(reqData, async (err: any, response2: any) => {
            if (err) {
              glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "checkTotalLeadStatusSummaryExist, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              if (response2 && response2.length > 0) {
                let reqData2: any = {
                  id: response2[0].id,
                  leadStatusCount: response2[0].lead_status_count + 1,
                };
                await updateTotalLeadStatusSummaryData(reqData2, async (err: any, response3: any) => {
                  if (err) {
                    glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "updateTotalLeadSummaryData, error:" + err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      leadStatus: req.body.oldValue ? req.body.oldValue : "",
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadStatusSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "checkTotalLeadStatusSummaryExist, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if (response5.length > 0 && response5[0].lead_status_count > 0) {
                          let reqData3: any = {
                            id: response5[0].id,
                            leadStatusCount: response5[0].lead_status_count - 1,
                          };
                          await updateTotalLeadStatusSummaryData(reqData3, async (err: any, response6: any) => {
                            if (err) {
                              glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "updateTotalLeadSummaryData, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                            }
                          });
                        }
                      }
                    });
                  }
                });
              } else {
                await insertTotalLeadStatusSummaryData(reqData, async (err: any, response4: any) => {
                  if (err) {
                    glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "insertTotalLeadSummaryData, error:" + err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      leadStatus: req.body.oldValue ? req.body.oldValue : "",
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadStatusSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "checkTotalLeadStatusSummaryExist, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if (response5.length > 0 && response5[0].lead_status_count > 0) {
                          let reqData4: any = {
                            id: response5[0].id,
                            leadStatusCount: response5[0].lead_status_count - 1,
                          };
                          await updateTotalLeadStatusSummaryData(reqData4, async (err: any, response6: any) => {
                            if (err) {
                              glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "updateTotalLeadSummaryData, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
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
        }

        /* Get Total Lead Source Summary data*/
        if (req.body && req.body.field && req.body.field == "lead_source") {
          await checkTotalLeadSourceSummaryExist(reqData, async (err: any, response2: any) => {
            if (err) {
              glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "checkTotalLeadSourceSummaryExist, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              if (response2.length > 0) {
                let reqData2: any = {
                  id: response2[0].id,
                  leadSourceCount: response2[0].lead_source_count + 1,
                };
                await updateTotalLeadSourceSummaryData(reqData2, async (err: any, response3: any) => {
                  if (err) {
                    glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "updateTotalLeadSourceSummaryData, error:" + err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      sourceId: req.body.oldValue,
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadSourceSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "checkTotalLeadSourceSummaryExist, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if (response5.length > 0 && response5[0].lead_source_count > 0) {
                          let reqData3: any = {
                            id: response5[0].id,
                            leadSourceCount: response5[0].lead_source_count - 1,
                          };
                          await updateTotalLeadSourceSummaryData(reqData3, async (err: any, response6: any) => {
                            if (err) {
                              glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "updateTotalLeadSourceSummaryData, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                            }
                          });
                        }
                      }
                    });
                  }
                });
              } else {
                await insertTotalLeadSourceSummaryData(reqData, async (err: any, response4: any) => {
                  if (err) {
                    glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "insertTotalLeadSourceSummaryData, error:" + err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      sourceId: req.body.oldValue ? req.body.oldValue : "",
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadSourceSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "checkTotalLeadSourceSummaryExist, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if (response5.length > 0 && response5[0].lead_source_count > 0) {
                          let reqData3: any = {
                            id: response5[0].id,
                            leadSourceCount: response5[0].lead_source_count - 1,
                          };
                          await updateTotalLeadSourceSummaryData(reqData3, async (err: any, response6: any) => {
                            if (err) {
                              glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "updateTotalLeadSourceSummaryData, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
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
        }

        /* Get Total Lead Product Summary data*/
        if (req.body && req.body.field && req.body.field == "product") {
          await checkTotalLeadProductSummaryExist(reqData, async (err: any, response2: any) => {
            if (err) {
              glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "checkTotalLeadProductSummaryExist, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              if (response2.length > 0) {
                let reqData2: any = {
                  id: response2[0].id,
                  leadProductCount: response2[0].lead_product_count + 1,
                };
                await updateTotalLeadProductSummaryData(reqData2, async (err: any, response3: any) => {
                  if (err) {
                    glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "updateTotalLeadProductSummaryData, error:" + err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      productId: req.body.oldValue,
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadProductSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "checkTotalLeadProductSummaryExist, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if (response5.length > 0 && response5[0].lead_product_count > 0) {
                          let reqData3: any = {
                            id: response5[0].id,
                            leadProductCount: response5[0].lead_product_count - 1,
                          };
                          await updateTotalLeadProductSummaryData(reqData3, async (err: any, response6: any) => {
                            if (err) {
                              glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "updateTotalLeadProductSummaryData, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                            }
                          });
                        }
                      }
                    });
                  }
                });
              } else {
                await insertTotalLeadProductSummaryData(reqData, async (err: any, response4: any) => {
                  if (err) {
                    glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "insertTotalLeadProductSummaryData, error:" + err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      productId: req.body.oldValue,
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadProductSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "checkTotalLeadProductSummaryExist, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if (response5.length > 0 && response5[0].lead_product_count > 0) {
                          let reqData3: any = {
                            id: response5[0].id,
                            leadProductCount: response5[0].lead_product_count - 1,
                          };
                          await updateTotalLeadProductSummaryData(reqData3, async (err: any, response6: any) => {
                            if (err) {
                              glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "updateTotalLeadProductSummaryData, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
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
        }

        /* Get Total Lead Type Summary data*/
        if (req.body && req.body.field && req.body.field == "lead_type") {
          await checkTotalLeadTypeSummaryExist(reqData, async (err: any, response2: any) => {
            if (err) {
              glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "checkTotalLeadTypeSummaryExist, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              if (response2.length > 0) {
                let reqData2: any = {
                  id: response2[0].id,
                  leadTypeCount: response2[0].lead_type_count + 1,
                };
                await updateTotalLeadTypeSummaryData(reqData2, async (err: any, response3: any) => {
                  if (err) {
                    glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "updateTotalLeadTypeSummaryData, error:" + err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      leadType: req.body.oldValue ? req.body.oldValue : "",
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadTypeSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "checkTotalLeadTypeSummaryExist, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if (response5.length > 0 && response5[0].lead_type_count > 0) {
                          let reqData3: any = {
                            id: response5[0].id,
                            leadTypeCount: response5[0].lead_type_count - 1,
                          };
                          await updateTotalLeadTypeSummaryData(reqData3, async (err: any, response6: any) => {
                            if (err) {
                              glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "updateTotalLeadTypeSummaryData, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                            }
                          });
                        }
                      }
                    });
                  }
                });
              } else {
                await insertTotalLeadTypeSummaryData(reqData, async (err: any, response4: any) => {
                  if (err) {
                    glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "insertTotalLeadTypeSummaryData, error:" + err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      leadType: req.body.oldValue ? req.body.oldValue : "",
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadTypeSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "checkTotalLeadTypeSummaryExist, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if (response5.length > 0 && response5[0].lead_type_count > 0) {
                          let reqData4: any = {
                            id: response5[0].id,
                            leadTypeCount: response5[0].lead_type_count - 1,
                          };
                          await updateTotalLeadTypeSummaryData(reqData4, async (err: any, response6: any) => {
                            if (err) {
                              glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "updateTotalLeadTypeSummaryData, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
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
        }

        /* Get Total Lead City Summary data*/
        if (req.body && req.body.field && req.body.field == "city") {
          await checkTotalLeadCitySummaryExist(reqData, async (err: any, response2: any) => {
            if (err) {
              glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "checkTotalLeadCitySummaryExist, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              if (response2.length > 0) {
                let reqData2: any = {
                  id: response2[0].id,
                  leadCityCount: response2[0].lead_city_count + 1,
                };
                await updateTotalLeadCitySummaryData(reqData2, async (err: any, response3: any) => {
                  if (err) {
                    glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "updateTotalLeadCitySummaryData, error:" + err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      cityId: req.body.oldValue,
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadCitySummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "checkTotalLeadCitySummaryExist, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if (response5.length > 0 && response5[0].lead_city_count > 0) {
                          let reqData3: any = {
                            id: response5[0].id,
                            leadCityCount: response5[0].lead_city_count - 1,
                          };
                          await updateTotalLeadCitySummaryData(reqData3, async (err: any, response6: any) => {
                            if (err) {
                              glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "updateTotalLeadCitySummaryData, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                            }
                          });
                        }
                      }
                    });
                  }
                });
              } else {
                await insertTotalLeadCitySummaryData(reqData, async (err: any, response4: any) => {
                  if (err) {
                    glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "insertTotalLeadCitySummaryData, error:" + err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      cityId: req.body.oldValue,
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadCitySummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "checkTotalLeadCitySummaryExist, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if (response5.length > 0 && response5[0].lead_city_count > 0) {
                          let reqData3: any = {
                            id: response5[0].id,
                            leadCityCount: response5[0].lead_city_count - 1,
                          };
                          await updateTotalLeadCitySummaryData(reqData3, async (err: any, response6: any) => {
                            if (err) {
                              glogger("ERR", "", "/sme/" + req.params.id + "/UpdateUniqueCall/", "updateTotalLeadCitySummaryData, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
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
        }
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

export const getUniqueCalls = async (req: Request, res: Response) => {
  try {
    var g_startDate = "";
    var g_startDate_op = "";
    var g_endDate = "";
    var g_endDate_op = "";
    var g_duration = "";
    var g_duration_op = "";
    var customerNumber = "";
    var customerNumber_op = "";
    var agentNumber = "";
    var agentNumber_op = "";
    var agentName = "";
    var agentName_op = "";
    var answerStatus = "";
    var answerStatus_op = "";
    var cityId = "";
    var cityId_op = "";
    var productId = "";
    var productId_op = "";
    var leadType = "";
    var leadType_op = "";
    var customerName = "";
    var customerName_op = "";
    var productPrice = "";
    var productPrice_op = "";
    var leadStatus = "";
    var leadStatus_op = "";
    var agentId = "";
    var agentId_op = "";
    var sourceId = "";
    var sourceId_op = "";
    var campaignId = "";
    var campaignId_op = "";
    var searchLeads = "";
    var searchLeads_op = "";
    var searchLeads_category = "";
    var sortLeadDateVar = "";
    var sortLeadDateVar_op = "";
    var companyName = "";
    var companyName_op = "";
    var uniqueId = "";
    var uniqueId_op = "";
    var abandoned = "";
    var abandoned_op = "";

    if (req.body.filterList) {
      var getUniqueCallsData = req.body.filterList;
      for (let data of getUniqueCallsData) {
        if (data["name"] == "startDate") {
          g_startDate = data["val"];
          g_startDate_op = data["op"];
        }

        if (data["name"] == "endDate") {
          g_endDate = data["val"];
          g_endDate_op = data["op"];
        }

        if (data["name"] == "duration") {
          g_duration = data["val"];
          g_duration_op = data["op"];
        }

        if (data["name"] == "customer_number") {
          customerNumber = data["val"];
          customerNumber_op = data["op"];
        }

        if (data["name"] == "agentNumber") {
          agentNumber = data["val"];
          agentNumber_op = data["op"];
        }

        if (data["name"] == "agentName") {
          agentName = data["val"];
          agentName_op = data["op"];
        }

        if (data["name"] == "answer") {
          answerStatus = data["val"];
          answerStatus_op = data["op"];
        }

        if (data["name"] == "cityId") {
          cityId = data["val"];
          cityId_op = data["op"];
        }

        if (data["name"] == "productId") {
          productId = data["val"];
          productId_op = data["op"];
        }

        if (data["name"] == "lead_type") {
          leadType = data["val"];
          leadType_op = data["op"];
        }

        if (data["name"] == "customer_name") {
          customerName = data["val"];
          customerName_op = data["op"];
        }

        if (data["name"] == "product_price") {
          productPrice = data["val"];
          productPrice_op = data["op"];
        }

        if (data["name"] == "lead_status") {
          leadStatus = data["val"];
          leadStatus_op = data["op"];
        }

        if (data["name"] == "agentId") {
          agentId = data["val"];
          agentId_op = data["op"];
        }

        if (data["name"] == "lead_source") {
          sourceId = data["val"];
          sourceId_op = data["op"];
        }

        if (data["name"] == "campaignId") {
          campaignId = data["val"];
          campaignId_op = data["op"];
        }

        if (data["name"] == "searchLeads") {
          searchLeads = data["val"];
          searchLeads_op = data["op"];
          searchLeads_category = data["category"];
        }

        if (data["name"] == "sortLeadDateVar") {
          sortLeadDateVar = data["val"];
          sortLeadDateVar_op = data["op"];
        }

        if (data["name"] == "company_name") {
          companyName = data["val"];
          companyName_op = data["op"];
        }

        if (data["name"] == "unique_id") {
          uniqueId = data["val"];
          uniqueId_op = data["op"];
        }

        if (data["name"] == "abandoned") {
          abandoned = data["val"];
          abandoned_op = data["op"];
        }
      }
    }

    let reqData: getUniqueCallsRequest = {
      id: parseInt(req.params.id),
      isDownload: req.body.isDownload,
      initialRecord: req.body.initialRecord,
      batchSize: req.body.batchSize,
      startDate: g_startDate,
      startDate_op: g_startDate_op,
      endDate: g_endDate,
      endDate_op: g_endDate_op,
      duration: g_duration,
      duration_op: g_duration_op,
      customerNumber: customerNumber,
      customerNumber_op: customerNumber_op,
      agentNumber: agentNumber,
      agentNumber_op: agentNumber_op,
      agentName: agentName,
      agentName_op: agentName_op,
      answerStatus: answerStatus,
      answerStatus_op: answerStatus_op,
      cityId: cityId,
      cityId_op: cityId_op,
      productId: productId,
      productId_op: productId_op,
      leadType: leadType,
      leadType_op: leadType_op,
      customerName: customerName,
      customerName_op: customerName_op,
      productPrice: productPrice,
      productPrice_op: productPrice_op,
      leadStatus: leadStatus,
      leadStatus_op: leadStatus_op,
      agentId: agentId,
      agentId_op: agentId_op,
      sourceId: sourceId,
      sourceId_op: sourceId_op,
      campaignId: campaignId,
      campaignId_op: campaignId_op,
      searchLeads: searchLeads,
      searchLeads_op: searchLeads_op,
      searchLeads_category: searchLeads_category,
      sortLeadDateVar: sortLeadDateVar,
      sortLeadDateVar_op: sortLeadDateVar_op,
      companyName: companyName,
      companyName_op: companyName_op,
      uniqueId: uniqueId,
      uniqueId_op: uniqueId_op,
      abandoned: abandoned,
      abandoned_op: abandoned_op,
    };

    let filter: any = {
      sme_id: reqData["id"],
      update_date_time: {
        $gte: reqData["startDate"] && reqData["startDate"] != "" ? reqData["startDate"] : null,
        $lte: reqData["endDate"] && reqData["endDate"] != "" ? reqData["endDate"] : null,
      },
    };

    uniqueCustomerDetail.find(filter).limit(reqData["batchSize"]).skip(reqData["initialRecord"]-1).sort({update_date_time: "desc"}).exec((err: any, getUniquecallsResult: any)=>{
      if (err) {
        glogger("ERR", "", "/v3/sme/" + req.params.id + "/getUniqueCalls/", "getUniquecallsResult, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponseWithCount(res, "Successfully listed", getUniquecallsResult, 0);
      }
    })
    /*await GetUniqueCalls(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          return SuccessResponseWithCount(res, "Successfully listed", response, 0);
        } else {
          return SuccessResponseWithCount(res, "Successfully listed", response, 0);
        }
      }
    });*/
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

export const getCallsPerformance = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: fetchCallperformance = {
      id: parseInt(req.params.id),
      currentdateTime: getCurrentDate,
      agentId: req.body.agentId ? req.body.agentId : 0,
    };
    await getCallsPerformanceData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          let asd: any = {
            totalCalls: response[0].TotalCalls,
            lessThenFifteenSeconds: Math.round(response[0].LessThenFifteenSeconds),
            greaterThenOneMinute: Math.round(response[0].GreaterThenOneMinute),
          };
          return SuccessResponse(res, "Successfully listed", asd);
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

export const addManualLead = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
      customer_number: req.body.customerNumber ? req.body.customerNumber : "",
      recent_duration: req.body.recent_duration ? req.body.recent_duration : 0,
      recent_via_longcode: req.body.recent_via_longcode ? req.body.recent_via_longcode : 0,
      server_ip_address: req.body.ip ? req.body.ip : 0,
      recent_patched_agent_id: req.body.recent_patched_agent_id ? req.body.recent_patched_agent_id : 0,
      total_incoming_calls: req.body.total_incoming_calls ? req.body.total_incoming_calls : 0,
      total_outgoing_calls: req.body.total_outgoing_calls ? req.body.total_outgoing_calls : 0,
      lead_type: req.body.lead_type ? req.body.lead_type : "",
      lead_status: req.body.lead_status ? req.body.lead_status : 0,
      city_id: req.body.city_id ? req.body.city_id : 0,
      product_id: req.body.product_id ? req.body.product_id : 0,
      product_price: req.body.product_price ? req.body.product_price : 0,
      assigned_agent_id: req.body.assigned_agent_id ? req.body.assigned_agent_id : 0,
      connected_call_duration: req.body.connected_call_duration ? req.body.connected_call_duration : 0,
      sticky_type: req.body.sticky_type ? req.body.sticky_type : 0,
      insert_date_time: req.body.insertDateTime,
      update_date_time: req.body.insertDateTime,
      call_type: req.body.call_type ? req.body.call_type : "",
      source_id: req.body.source_id ? req.body.source_id : 0,
    };

    await checkManualLeadExist(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response && response.length > 0) {
          return SuccessResponse(res, "Listed successfully", response);
        } else {
          addManualLeadData(reqData, (err: any, response1: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              let currentDate = new Date();
              let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
              let reqData1: any = {
                smeId: reqData["id"],
                agentId: reqData["recent_patched_agent_id"] ? reqData["recent_patched_agent_id"] : reqData["assigned_agent_id"],
                leadStatus: 0,
                sourceId: 0,
                productId: 0,
                leadType: "",
                cityId: 0,
                insertDateTime: getCurrentDate,
                leadStatusCount: 1,
                leadSourceCount: 1,
                leadProductCount: 1,
                leadTypeCount: 1,
                leadCityCount: 1,
              };
              checkTotalLeadStatusSummaryExist(reqData1, (err: any, response5: any) => {
                if (err) {
                  glogger("ERR", "" + req.body.callSessionId + "", "/ivr/" + req.params.id + "/setUniqueCalls/", "checkTotalLeadStatusSummaryExist, error:" + err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  if (response5.length > 0) {
                    let reqData2: any = {
                      id: response5[0].id,
                      leadStatusCount: response5[0].lead_status_count + 1,
                    };
                    updateTotalLeadStatusSummaryData(reqData2, (err: any, response6: any) => {
                      if (err) {
                        glogger("ERR", "" + req.body.callSessionId + "", "/ivr/" + req.params.id + "/setUniqueCalls/", "updateTotalLeadStatusSummaryData, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                      }
                    });
                  } else {
                    insertTotalLeadStatusSummaryData(reqData1, async (err: any, response7: any) => {
                      if (err) {
                        glogger("ERR", "" + req.body.callSessionId + "", "/ivr/" + req.params.id + "/setUniqueCalls/", "insertTotalLeadStatusSummaryData, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                      }
                    });
                  }
                }
              });

              checkTotalLeadSourceSummaryExist(reqData1, (err: any, response6: any) => {
                if (err) {
                  glogger("ERR", "" + req.body.callSessionId + "", "/ivr/" + req.params.id + "/setUniqueCalls/", "checkTotalLeadSourceSummaryExist, error:" + err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  if (response6.length > 0) {
                    let reqData2: any = {
                      id: response6[0].id,
                      leadSourceCount: response6[0].lead_source_count + 1,
                    };
                    updateTotalLeadSourceSummaryData(reqData2, (err: any, response7: any) => {
                      if (err) {
                        glogger("ERR", "" + req.body.callSessionId + "", "/ivr/" + req.params.id + "/setUniqueCalls/", "updateTotalLeadSourceSummaryData, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                      }
                    });
                  } else {
                    insertTotalLeadSourceSummaryData(reqData1, async (err: any, response7: any) => {
                      if (err) {
                        glogger("ERR", "" + req.body.callSessionId + "", "/ivr/" + req.params.id + "/setUniqueCalls/", "insertTotalLeadSourceSummaryData, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                      }
                    });
                  }
                }
              });

              checkTotalLeadProductSummaryExist(reqData1, (err: any, response6: any) => {
                if (err) {
                  glogger("ERR", "" + req.body.callSessionId + "", "/ivr/" + req.params.id + "/setUniqueCalls/", "checkTotalLeadProductSummaryExist, error:" + err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  if (response6.length > 0) {
                    let reqData2: any = {
                      id: response6[0].id,
                      leadProductCount: response6[0].lead_product_count + 1,
                    };
                    updateTotalLeadProductSummaryData(reqData2, (err: any, response7: any) => {
                      if (err) {
                        glogger("ERR", "" + req.body.callSessionId + "", "/ivr/" + req.params.id + "/setUniqueCalls/", "updateTotalLeadProductSummaryData, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                      }
                    });
                  } else {
                    insertTotalLeadProductSummaryData(reqData1, async (err: any, response7: any) => {
                      if (err) {
                        glogger("ERR", "" + req.body.callSessionId + "", "/ivr/" + req.params.id + "/setUniqueCalls/", "insertTotalLeadProductSummaryData, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                      }
                    });
                  }
                }
              });

              /*checkTotalLeadTypeSummaryExist(reqData1, (err: any, response6: any) => {
                if (err) {
                  glogger('ERR', ""+req.body.callSessionId+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "checkTotalLeadTypeSummaryExist, error:"+err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  if(response6.length > 0){
                    let reqData2: any = {
                      "id": response6[0].id,
                      "leadTypeCount": response6[0].lead_type_count+1,
                    };
                    updateTotalLeadTypeSummaryData(reqData2,  (err: any, response7: any) => {
                      if (err) {
                        glogger('ERR', ""+req.body.callSessionId+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "updateTotalLeadTypeSummaryData, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        
                      }
                    });
                  } else {
                    insertTotalLeadTypeSummaryData(reqData1, async (err: any, response7: any) => {
                      if (err) {
                        glogger('ERR', ""+req.body.callSessionId+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "insertTotalLeadTypeSummaryData, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        
                      }
                    });
                  }
                }
              });*/

              checkTotalLeadCitySummaryExist(reqData1, (err: any, response7: any) => {
                if (err) {
                  glogger("ERR", "" + req.body.callSessionId + "", "/ivr/" + req.params.id + "/setUniqueCalls/", "checkTotalLeadCitySummaryExist, error:" + err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  if (response7.length > 0) {
                    let reqData2: any = {
                      id: response7[0].id,
                      leadCityCount: response7[0].lead_city_count + 1,
                    };
                    updateTotalLeadCitySummaryData(reqData2, (err: any, response8: any) => {
                      if (err) {
                        glogger("ERR", "" + req.body.callSessionId + "", "/ivr/" + req.params.id + "/setUniqueCalls/", "updateTotalLeadCitySummaryData, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                      }
                    });
                  } else {
                    insertTotalLeadCitySummaryData(reqData1, async (err: any, response8: any) => {
                      if (err) {
                        glogger("ERR", "" + req.body.callSessionId + "", "/ivr/" + req.params.id + "/setUniqueCalls/", "insertTotalLeadCitySummaryData, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                      }
                    });
                  }
                }
              });
              return SuccessResponse(res, "Lead added successfully", response1);
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

export const deleteUniqueDetail = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      status: req.body.status,
      leadId: req.body.leadId,
    };
    await deleteUniqueDetailData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Lead deleted Successfully", response);
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

export const demoRequest = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.body.id) ? parseInt(req.body.id) : 0,
      customer_number: req.body.mobileNumber ? req.body.mobileNumber : "",
      recent_duration: req.body.recent_duration ? req.body.recent_duration : 0,
      recent_via_longcode: req.body.recent_via_longcode ? req.body.recent_via_longcode : 0,
      server_ip_address: req.body.ip ? req.body.ip : 0,
      recent_patched_agent_id: req.body.recent_patched_agent_id ? req.body.recent_patched_agent_id : 0,
      total_incoming_calls: req.body.total_incoming_calls ? req.body.total_incoming_calls : 0,
      total_outgoing_calls: req.body.total_outgoing_calls ? req.body.total_outgoing_calls : 0,
      lead_type: req.body.lead_type ? req.body.lead_type : "",
      lead_status: req.body.lead_status ? req.body.lead_status : 0,
      city_id: req.body.city_id ? req.body.city_id : 0,
      product_id: req.body.product_id ? req.body.product_id : 0,
      product_price: req.body.product_price ? req.body.product_price : 0,
      assigned_agent_id: req.body.assigned_agent_id ? req.body.assigned_agent_id : 0,
      connected_call_duration: req.body.connected_call_duration ? req.body.connected_call_duration : 0,
      sticky_type: req.body.sticky_type ? req.body.sticky_type : 0,
      insert_date_time: req.body.insertDateTime,
      update_date_time: req.body.insertDateTime,
      call_type: req.body.call_type ? req.body.call_type : "",
      source_id: req.body.source_id ? req.body.source_id : 0,
      full_name: req.body.fullName ? req.body.fullName : "N/A",
      business_email: req.body.businessEmail ? req.body.businessEmail : "N/A",
      subject: req.body.subject ? req.body.subject : "N/A",
      message: req.body.message ? req.body.message : "N/A",
    };

    await checkManualLeadExist(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        let toMail = "tarsem.singh@kommuno.com,ankit.mithal@kommuno.com";
        //let toMail = 'munish.kumar@kommuno.com';
        let data = "<p> This is demo request for <strong>" + req.body.packId + "</strong> plan<p>";
        data += "<p> Contact : " + req.body.mobileNumber + "</p>";
        data += "<p> Name : " + reqData["full_name"] + "</p>";
        data += "<p> Email : " + reqData["business_email"] + "</p>";
        data += "<p> Subject : " + reqData["subject"] + "</p>";
        data += "<p> Message : " + reqData["message"] + "</p>";
        let subject = "Demo Request";

        let dataRequest: any = {
          to: toMail,
          subject: subject,
          message: data,
        };

        MailSent(dataRequest);
        if (response && response.length > 0) {
          return SuccessResponse(res, "You already requested for demo!", response);
        } else {
          addManualLeadData(reqData, (err: any, response1: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Your request has been submitted successfully", response1);
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

export const leadTransfer = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id) ? parseInt(req.params.id) : 0,
      agentId: req.body.agentId ? req.body.agentId : 0,
      leadId: req.body.leadId ? req.body.leadId : 0,
      stickyType: req.body.stickyType ? req.body.stickyType : 0,
      assignedFrom: req.body.currentAgentId ? req.body.currentAgentId : 0,
      assignedTo: req.body.agentId ? req.body.agentId : 0,
      customerNumber: req.body.customerNumber ? req.body.customerNumber : 0,
    };
    await leadTransferData(reqData, async (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (req.body.currentAgentId) {
          await followupTransferData(reqData, async (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Lead transfered successfully", response);
            }
          });
        } else {
          return SuccessResponse(res, "Lead transfered successfully", response);
        }
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const uploadLeadData = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id) ? parseInt(req.params.id) : 0,
      finalUploadLeadArray: req.body.finalUploadLeadArray ? req.body.finalUploadLeadArray : 0,
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : 0,
    };
    let finalUploadLeadArray: any = reqData["finalUploadLeadArray"];

    for (let l = 0; l < finalUploadLeadArray.length; l++) {
      let reqLeadData: any = {
        id: parseInt(req.params.id),
        smeId: parseInt(req.params.id),
        customer_number: finalUploadLeadArray[l].customerNumber ? "+91" + finalUploadLeadArray[l].customerNumber.substring(finalUploadLeadArray[l].customerNumber.length - 10) : "",
        recent_duration: req.body.recent_duration ? req.body.recent_duration : 0,
        recent_via_longcode: req.body.recent_via_longcode ? req.body.recent_via_longcode : 0,
        server_ip_address: req.body.ip ? req.body.ip : 0,
        recent_patched_agent_id: req.body.recent_patched_agent_id ? req.body.recent_patched_agent_id : 0,
        total_incoming_calls: req.body.total_incoming_calls ? req.body.total_incoming_calls : 0,
        total_outgoing_calls: req.body.total_outgoing_calls ? req.body.total_outgoing_calls : 0,
        lead_type: req.body.lead_type ? req.body.lead_type : "",
        lead_status: finalUploadLeadArray[l].status ? finalUploadLeadArray[l].status : 0,
        city_id: finalUploadLeadArray[l].city ? finalUploadLeadArray[l].city : 0,
        source_id: finalUploadLeadArray[l].source ? finalUploadLeadArray[l].source : 0,
        product_id: finalUploadLeadArray[l].product ? finalUploadLeadArray[l].product : 0,
        product_price: finalUploadLeadArray[l].price ? finalUploadLeadArray[l].price : 0,
        assigned_agent_id: finalUploadLeadArray[l].agentId ? finalUploadLeadArray[l].agentId : 0,
        connected_call_duration: req.body.connected_call_duration ? req.body.connected_call_duration : 0,
        sticky_type: req.body.sticky_type ? req.body.sticky_type : 0,
        insert_date_time: req.body.insertDateTime,
        update_date_time: req.body.insertDateTime,
        call_type: req.body.call_type ? req.body.call_type : "",
        insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : 0,
      };

      await checkManualLeadExist(reqLeadData, async (err: any, response: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          if (response && response.length > 0) {
            let reqLeadData1: any = {
              leadId: response[0].id,
            };
            await updateManualLeadData(reqLeadData, reqLeadData1, async (err: any, response1: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
              }
            });
          } else {
            await addManualLeadData(reqLeadData, async (err: any, response2: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                if (finalUploadLeadArray[l].customerName != "" || finalUploadLeadArray[l].email != "" || finalUploadLeadArray[l].address != "" || finalUploadLeadArray[l].company != "") {
                  await checkAddressBookCustomerExist(reqLeadData, async (err: any, response3: any) => {
                    if (err) {
                      return ErrorEmptyResponse(res, err);
                    } else {
                      let reqContactData: any = {
                        smeId: parseInt(req.params.id),
                        customer_number_primary: finalUploadLeadArray[l].customerNumber
                          ? "+91" + finalUploadLeadArray[l].customerNumber.substring(finalUploadLeadArray[l].customerNumber.length - 10)
                          : "",
                        customer_number: finalUploadLeadArray[l].customerNumber ? "+91" + finalUploadLeadArray[l].customerNumber.substring(finalUploadLeadArray[l].customerNumber.length - 10) : "",
                        customer_name: finalUploadLeadArray[l].customerName ? finalUploadLeadArray[l].customerName : "",
                        email_id: finalUploadLeadArray[l].email ? finalUploadLeadArray[l].email : "",
                        address: finalUploadLeadArray[l].address ? finalUploadLeadArray[l].address : "",
                        company_name: finalUploadLeadArray[l].company ? finalUploadLeadArray[l].company : "",
                        created_by: parseInt(req.params.id),
                        status: 1,
                        insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : 0,
                      };
                      if (response3 && response3.length > 0) {
                        await updateAddressBookCustomer(reqContactData, async (err: any, response4: any) => {
                          if (err) {
                            return ErrorEmptyResponse(res, err);
                          } else {
                          }
                        });
                      } else {
                        await addAddressBookCustomer(reqContactData, async (err: any, response5: any) => {
                          if (err) {
                            return ErrorEmptyResponse(res, err);
                          } else {
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
      });
      await sleep(50);
    }
    return SuccessResponse(res, "Leads uploaded successfully", "");
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const bulkLeadTransfer = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id) ? parseInt(req.params.id) : 0,
      assignedFrom: req.body.assignedFrom ? req.body.assignedFrom : 0,
      assignedTo: req.body.assignedTo ? req.body.assignedTo : 0,
      stickyType: req.body.stickyType ? req.body.stickyType : 0,
    };

    await bulkLeadTransferData(reqData, async (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        await bulkLeadStatusTransferData(reqData, async (err: any, response: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
            await followupTransferData(reqData, async (err: any, response: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                return SuccessResponse(res, "Lead transfered successfully", response);
              }
            });
          }
        });
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const updateLeadStatusOnLiveCall = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id) ? parseInt(req.params.id) : 0,
      agentId: req.body.agentId ? req.body.agentId : 0,
      leadStatus: req.body.leadStatus ? req.body.leadStatus : 0,
      customerNumber: req.body.customerNumber ? req.body.customerNumber : 0,
    };
    await updateLeadStatusOnLiveCallData(reqData, async (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Lead status added successfully", response);
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const viewFrequency = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      initialRecord: req.body.initialRecord ? req.body.initialRecord : 0,
      batchSize: req.body.batchSize ? req.body.batchSize : 6,
      customerNumber: req.body.customerNumber,
      callDirection: req.body.callDirection ? req.body.callDirection : "",
      agentId: req.body.agentId ? req.body.agentId : 0,
    };

    await getFrequencyCalls(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          return SuccessResponseWithCount(res, "Successfully listed", response, 0);
        } else {
          return SuccessResponseWithCount(res, "Successfully listed", response, 0);
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

export const copyCampaignToLead = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      customerNumber: req.body.customerNumber ? req.body.customerNumber : 0,
      cityId: req.body.cityId ? req.body.cityId : 0,
      other: req.body.other != "" ? req.body.other : "",
      price: req.body.price ? req.body.price : 0,
      productId: req.body.productId ? req.body.productId : 0,
      sourceId: req.body.sourceId ? req.body.sourceId : 0,
      statusId: req.body.statusId ? req.body.statusId : 0,
    };

    await copyCampaignToLeadData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Campaign Lead copied to lead manager  successfully", response);
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

async function sleep(ms: any) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
