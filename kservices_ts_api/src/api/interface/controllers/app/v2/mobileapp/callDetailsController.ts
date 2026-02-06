import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, SuccessResponseWithCount } from "../../../../../helpers/apiResponse";
import { FindCallList, totalRecordList, FindCallBase, SetCallSchedule, FindOutgoingCampaignData, totalRecordOutgoingCampaignData, FindFollowUpCalls, totalFollowUpCallsRecord, numberExistInUniqueDetails, updateUniqueCustomerData, insertUniqueCustomerData, FindendcallReasonList,UpdateEndCallReasonOutgoing,UpdateEndCallReasonCommnCdr, changeScheduleStatusData } from "../../../../../domain/models/v2/mobileapp.model";
import { callListFetchRequest, fetchcallbaeRequest, setcallscheduleRequest } from "../../../../../domain/entities/v2/mobileapp.entity";
import { env } from '../../../../../../infrastructure/env';
import { glogger } from "../../../../../helpers/logger";

/**
 * get settings.
 *
 * @returns {Object}
 */

export const getlist = async (req: Request, res: Response) => {
  try {
    var g_startDate = '';
    var g_startDate_op = '';
    var g_endDate = '';
    var g_endDate_op = '';
    var callDirectionStatus = '';
    var callDirectionStatus_op = '';
    var duration = '';
    var duration_op = '';
    var calledNumber = '';
    var calledNumber_op = '';
    var callingNumber = '';
    var callingNumber_op = '';
    var agentName = '';
    var agentName_op = '';
    var callStatus = '';
    var callStatus_op = '';
    var answerStatus = '';
    var answerStatus_op = '';
    var remarks = '';
    var remarks_op = '';
    var callId = '';
    var callId_op = '';

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
      smeId: req.body.smeId

    };
    await FindCallList(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          return SuccessResponseWithCount(res, "Successfully listed", response, 100);
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



export const getCallBase = async (req: Request, res: Response) => {
  try {
    let reqData: fetchcallbaeRequest = {
      id: parseInt(req.params.id)
    };
    await FindCallBase(reqData, (err: any, response: any) => {
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

export const setCallSchedule = async (req: Request, res: Response) => {
  try {
    let dateTime = new Date(req.body.scheduleDateTime).toISOString().replace(/T/, ' ').replace(/\..+/, '');

    let reqData: setcallscheduleRequest = {
      agent_id: parseInt(req.params.id),
      sme_id: req.body.sme_id,
      callCounter: req.body.callCounter,
      callType: req.body.callType,
      description: req.body.desc,
      mobile: "+91"+req.body.mobile.substring(req.body.mobile.length - 10),
      scheduleDateTime: dateTime,
      status: req.body.status,
      message: req.body.message ? req.body.message : null,
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : '0000:00:00 00:00:00'
    };

    await SetCallSchedule(reqData, (err: any, response1: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response1) {
          numberExistInUniqueDetails(reqData, (err: any, response2: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              if (response2 && response2.length > 0) {
                let where: any = { 'uniqueId': response2[0]['id'], 'lastInsertedId': response1[0] }
                updateUniqueCustomerData(where, reqData, (err: any, response3: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    return SuccessResponse(res, "Successfully schedule", response1);
                  }
                });
              } else {
                let reqInsertData: any = {
                  id: req.body.sme_id,
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
                  assigned_to: parseInt(req.params.id),
                  customer_followup_id: response1[0],
                };
                insertUniqueCustomerData(reqInsertData, reqData, (err: any, response4: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
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


export const getOutgoingCampaign = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
      smeId: parseInt(req.body.smeId)
    };
    await FindOutgoingCampaignData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          totalRecordOutgoingCampaignData(reqData, (err: any, totalRecord: any) => {

            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              totalRecord = totalRecord[0]["total_records"];
              return SuccessResponseWithCount(res, "Successfully listed", response, totalRecord);
            }
          });

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

export const getFollowUpCalls = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
      initialRecord: req.body.initialRecord,
      batchSize: req.body.batchSize,
    };
    await FindFollowUpCalls(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          totalFollowUpCallsRecord(reqData, (err: any, totalRecord: any) => {

            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              if(totalRecord.length >0 ){
                totalRecord = totalRecord.length;
              }else{
                totalRecord = 0;
              }
              
              
              return SuccessResponseWithCount(res, "Successfully listed", response, totalRecord);
            }
          });

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


export const endcallReasonList = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
    };
    await FindendcallReasonList(reqData, (err: any, response: any) => {
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


export const updateEndCallReason = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
      sessionId: req.body.sessionId,
      callDirection: req.body.callDirection,
      reasonId: req.body.reasonId,
      smeId: req.body.smeId,
    };
    await UpdateEndCallReasonOutgoing(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        UpdateEndCallReasonCommnCdr(reqData, (err: any, response: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
               return SuccessResponse(res, "Successfully updated", response);
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

export const changeScheduleStatus = async (req: Request, res: Response) => {
  try {

    let reqData: any = {
      smeId: parseInt(req.params.id) ? parseInt(req.params.id) : 0,
      scheduleId: req.body.scheduleId ? req.body.scheduleId : 0 ,
      status: req.body.status ? req.body.status : 0 ,
    };
    await changeScheduleStatusData(reqData, async(err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Schedule status updated successfully", response);
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};
