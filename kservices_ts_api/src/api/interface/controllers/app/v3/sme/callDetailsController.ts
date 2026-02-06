import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { glogger } from "../../../../../helpers/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, SuccessResponseWithCount } from "../../../../../helpers/apiResponse";
import {
  FindCallList,
  setFollowUpCallData,
  followNumberExistInUniqueDetails,
  updateUniqueCustomerData,
  insertUniqueCustomerData,
  getMergeCallsData,
  clearLiveCallData,
  updateCallColumnSettings,
  getAgentLiveCallLeadData,
  getAgentLiveCallCampaignLeadData,
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
} from "../../../../../domain/models/v3/ivr.model";
import { callingCdr } from "../../../../../domain/schema/mongo/callingCdr.schema";
import { callListFetchRequest, mergeCallFetchRequest } from "../../../../../domain/entities/v3/sme.entity";
import { env } from "../../../../../../infrastructure/env";
import { convertTimeZone } from "../../../../../helpers/utility";

/**
 * get settings.
 *
 * @returns {Object}
 */

export const getlist = async (req: Request, res: Response) => {
  try {
    var g_startDate = "";
    var g_startDate_op = "";
    var g_endDate = "";
    var g_endDate_op = "";
    var callDirectionStatus = "";
    var callDirectionStatus_op = "";
    var duration = "";
    var duration_op = "";
    var calledNumber = "";
    var calledNumber_op = "";
    var callingNumber = "";
    var callingNumber_op = "";
    var agentName = "";
    var agentName_op = "";
    var callStatus = "";
    var callStatus_op = "";
    var answerStatus = "";
    var answerStatus_op = "";
    var remarks = "";
    var remarks_op = "";
    var callId = "";
    var callId_op = "";
    var callFlow = "";
    var callFlow_op = "";

    if (req.body.filterList) {
      var filterData = req.body.filterList;
      for (let data of filterData) {
        if (data["name"] == "startDate") {
          g_startDate = data["val"];
          g_startDate_op = data["op"];
        }

        if (data["name"] == "endDate") {
          g_endDate = data["val"];
          g_endDate_op = data["op"];
        }

        if (data["name"] == "duration") {
          duration = data["val"];
          duration_op = data["op"];
        }

        if (data["name"] == "callDirectionStatus") {
          callDirectionStatus = data["val"];
          callDirectionStatus_op = data["op"];
        }

        if (data["name"] == "callId") {
          callId = data["val"];
          callId_op = data["op"];
        }

        if (data["name"] == "called_number") {
          calledNumber = data["val"];
          calledNumber_op = data["op"];
        }

        if (data["name"] == "calling_number") {
          callingNumber = data["val"];
          callingNumber_op = data["op"];
        }
        if (data["name"] == "agent_name") {
          agentName = data["val"];
          agentName_op = data["op"];
        }

        if (data["name"] == "callStatus") {
          callStatus = data["val"];
          callStatus_op = data["op"];
        }

        if (data["name"] == "answer") {
          answerStatus = data["val"];
          answerStatus_op = data["op"];
        }

        if (data["name"] == "remarks") {
          remarks = data["val"];
          remarks_op = data["op"];
        }

        if (data["name"] == "flow_name") {
          callFlow = data["val"];
          callFlow_op = data["op"];
        }
      }
    }

    let reqData: callListFetchRequest = {
      id: parseInt(req.params.id),
      type: req.params.type,
      isDownload: req.body.isDownload,
      callDirectionStatus: req.body.callDirectionStatus,
      callDirectionStatus_op: req.body.callDirectionStatus_op,
      initialRecord: req.body.initialRecord,
      batchSize: req.body.batchSize,
      startDate: g_startDate,
      startDate_op: g_startDate_op,
      endDate: g_endDate,
      endDate_op: g_endDate_op,
      duration: duration,
      duration_op: duration_op,
      calledNumber: calledNumber,
      calledNumber_op: calledNumber_op,
      callingNumber: callingNumber,
      callingNumber_op: callingNumber_op,
      agentName: agentName,
      agentName_op: agentName_op,
      callStatus: callStatus,
      callStatus_op: callStatus_op,
      answerStatus: answerStatus,
      answerStatus_op: answerStatus_op,
      remarks: remarks,
      remarks_op: remarks_op,
      callId: callId,
      callId_op: callId_op,
      callFlow: callFlow,
      callFlow_op: callFlow_op,
    };
    await FindCallList(reqData, (err: any, response: any) => {
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

export const setFollowUpCall = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      sme_id: parseInt(req.params.id),
      agent_id: req.body.agentId ? req.body.agentId : 0,
      mobile: req.body.customerNumber,
      scheduleDateTime: req.body.scheduleDateTime,
      status: req.body.status,
      message: req.body.message ? req.body.message : "",
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : "0000:00:00 00:00:00",
    };

    await setFollowUpCallData(reqData, (err: any, response1: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response1) {
          followNumberExistInUniqueDetails(reqData, (err: any, response2: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              if (response2 && response2.length > 0) {
                let where: any = { uniqueId: response2[0]["id"], lastInsertedId: response1[0] };
                updateUniqueCustomerData(where, reqData, (err: any, response3: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    return SuccessResponse(res, "Successfully schedule", response1);
                  }
                });
              } else {
                let reqInsertData: any = {
                  id: req.params.id,
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
                  call_type: "SCHEDULE",
                  assigned_to: req.body.agentId,
                  customer_followup_id: response1[0],
                };
                insertUniqueCustomerData(reqInsertData, reqData, (err: any, response4: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let currentDate = new Date();
                    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
                    let reqData1: any = {
                      smeId: reqInsertData["id"],
                      agentId: reqInsertData["recent_patched_agent_id"],
                      leadStatus: 0,
                      sourceId: 0,
                      productId: 0,
                      leadType: "",
                      insertDateTime: getCurrentDate,
                      leadStatusCount: 1,
                      leadSourceCount: 1,
                      leadProductCount: 1,
                      leadTypeCount: 1,
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

                    checkTotalLeadTypeSummaryExist(reqData1, (err: any, response6: any) => {
                      if (err) {
                        glogger("ERR", "" + req.body.callSessionId + "", "/ivr/" + req.params.id + "/setUniqueCalls/", "checkTotalLeadTypeSummaryExist, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if (response6.length > 0) {
                          let reqData2: any = {
                            id: response6[0].id,
                            leadTypeCount: response6[0].lead_type_count + 1,
                          };
                          updateTotalLeadTypeSummaryData(reqData2, (err: any, response7: any) => {
                            if (err) {
                              glogger("ERR", "" + req.body.callSessionId + "", "/ivr/" + req.params.id + "/setUniqueCalls/", "updateTotalLeadTypeSummaryData, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                            }
                          });
                        } else {
                          insertTotalLeadTypeSummaryData(reqData1, async (err: any, response7: any) => {
                            if (err) {
                              glogger("ERR", "" + req.body.callSessionId + "", "/ivr/" + req.params.id + "/setUniqueCalls/", "insertTotalLeadTypeSummaryData, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                            }
                          });
                        }
                      }
                    });
                    return SuccessResponse(res, "Successfully schedule", response1);
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

export const getMergeCalls = async (req: Request, res: Response) => {
  try {
    var startDate = "";
    var startDate_op = "";
    var endDate = "";
    var endDate_op = "";
    var customerNumber = {};
    var customerNumber_op = "";
    var customerName = "";
    var customerName_op = "";
    var agentNumber = "";
    var agentNumber_op = "";
    var agentName = "";
    var agentName_op = "";
    var callDirection = "";
    var callDirection_op = "";
    var duration = "";
    var duration_op = "";
    var callStatus = "";
    var callStatus_op = "";
    var remarks = "";
    var remarks_op = "";
    var callFlow = "";
    var callFlow_op = "";
    var searchLeads = "";
    var searchLeads_op = "";
    var searchLeads_category = "";
    var callQueue = "";
    var callQueue_op = "";

    if (req.body.filterList) {
      var filterData = req.body.filterList;
      for (let data of filterData) {
        if (data["name"] == "startDate") {
          startDate = data["val"];
          startDate_op = data["op"];
        }

        if (data["name"] == "endDate") {
          endDate = data["val"];
          endDate_op = data["op"];
        }

        if (data["name"] == "customer_number") {
          customerNumber = data["val"];
          customerNumber_op = data["op"];
        }

        if (data["name"] == "customer_name") {
          customerName = data["val"];
          customerName_op = data["op"];
        }

        if (data["name"] == "agent_number") {
          agentNumber = data["val"];
          agentNumber_op = data["op"];
        }

        if (data["name"] == "agent_name") {
          agentName = data["val"];
          agentName_op = data["op"];
        }

        if (data["name"] == "duration") {
          duration = data["val"];
          duration_op = data["op"];
        }

        if (data["name"] == "callDirection") {
          callDirection = data["val"];
          callDirection_op = data["op"];
        }

        if (data["name"] == "callStatus") {
          callStatus = data["val"];
          callStatus_op = data["op"];
        }

        if (data["name"] == "remarks") {
          remarks = data["val"];
          remarks_op = data["op"];
        }

        if (data["name"] == "callFlow") {
          callFlow = data["val"];
          callFlow_op = data["op"];
        }

        if (data["name"] == "searchLeads") {
          searchLeads = data["val"];
          searchLeads_op = data["op"];
          searchLeads_category = data["category"];
        }

        if (data["name"] == "callQueue") {
          callQueue = data["val"];
          callQueue_op = data["op"];
        }
      }
    }

    let reqData: mergeCallFetchRequest = {
      smeId: parseInt(req.params.id),
      initialRecord: req.body.initialRecord,
      batchSize: req.body.batchSize,
      startDate: startDate,
      endDate: endDate,
      customerNumber: customerNumber,
      customerName: customerName,
      agentNumber: agentNumber,
      agentName: agentName,
      remarks: remarks,
      callDirection: callDirection,
      callStatus: callStatus,
      duration: duration,
      callFlow: callFlow,
      searchLeads: searchLeads,
      searchLeads_category: searchLeads_category,
      callQueue: callQueue,
    };

    let filter: any = {
      sme_id: reqData["smeId"],
      start_date_time: {
        $gte: reqData["startDate"] && reqData["startDate"] != "" ? reqData["startDate"] : null,
        $lte: reqData["endDate"] && reqData["endDate"] != "" ? reqData["endDate"] : null,
      },
    };

    if(customerNumber_op != ""){
      filter.customer_number = { $regex: reqData["customerNumber"], $options: 'g' };
    }

    if(agentNumber_op != ""){
      filter.agent_number = { $regex: reqData["agentNumber"], $options: 'g' };
    }

    callingCdr
      .aggregate([
        { $match: filter },
        {
          $lookup: {
            from: "address_book",
            localField: "customer_number",
            foreignField: "customer_number_primary",
            as: "address_book",
          },
        },
        {
          $unwind: "$address_book",
        },
      ])
      .limit(reqData["batchSize"])
      .skip(reqData["initialRecord"] - 1)
      .sort({
        start_date_time: "desc",
      })
      .exec(function (err: any, getMergeCallsResult: any) {
        if (err) {
          glogger("ERR", "", "/v3/sme/" + req.params.id + "/getMergeCalls/", "getMergeCallsResult, error:" + err);
          return ErrorEmptyResponse(res, err);
        } else {
          return SuccessResponseWithCount(res, "Successfully listed", getMergeCallsResult, 0);
        }
      });
  } catch (e) {
    glogger("ERR", "", "/v3/sme/" + req.params.id + "/getMergeCalls/", "callingCdr.aggregate, error:" + e);
    ErrorResponse(res, e);
  }
};

export const clearLiveCall = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      id: req.body.id ? req.body.id : 0,
    };

    await clearLiveCallData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Call cleared successfully", response);
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

export const setCallColumnSettings = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
      callColumns: req.body.callColumns,
    };
    await updateCallColumnSettings(reqData, (err: any, response: any) => {
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

export const getAgentLiveCallLead = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      customerNumber: req.body.customerNumber ? req.body.customerNumber : 0,
      agentId: req.body.agentId ? req.body.agentId : 0,
    };

    await getAgentLiveCallLeadData(reqData, async (err: any, response: any) => {
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

export const getAgentLiveCallCampaignLead = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      customerNumber: req.body.customerNumber ? req.body.customerNumber : 0,
    };

    await getAgentLiveCallCampaignLeadData(reqData, async (err: any, response: any) => {
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
