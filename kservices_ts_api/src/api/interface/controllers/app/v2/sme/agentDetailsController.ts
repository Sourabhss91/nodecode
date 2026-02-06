import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, SuccessResponseWithCount } from "../../../../../helpers/apiResponse";
import { FindagentDetails, FetchAgentReport, AgentReportTotalRecord, FindAgentReportData, FetchOutCallsReport } from "../../../../../domain/models/v2/sme.model";
import { getAgentdetailRequestValidate, fetchAgentReport, AgentReportDataRequestValidate } from "../../../../../domain/entities/v2/sme.entity";
import { env } from '../../../../../../infrastructure/env';
import { glogger } from "../../../../../helpers/logger";
/**
 * get group details.
 *
 * @returns {Object}
 */

export const getAgentDetail = async (req: Request, res: Response) => {
  try {
    let reqData: getAgentdetailRequestValidate = {
      id: parseInt(req.params.id),
    };
    await FindagentDetails(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const agentReportdetail = async (req: Request, res: Response) => {
  try {
    var g_startDate = "";
    var g_startDate_op = "";
    var g_endDate = "";
    var g_endDate_op = "";
    var g_duration = "";
    var g_duration_op = "";
    var customerAni = "";
    var customerAni_op = "";
    var agentNumber = "";
    var agentNumber_op = "";
    var agentName = "";
    var agentName_op = "";
    var responseMessage = "";
    var responseMessage_op = "";
    var callMode = "";
    var callMode_op = "";
    var sessionId = "";
    var sessionId_op = "";
    var orderBy = "";
    var orderBy_op = "";
    var status = "";
    var status_op = "";

    if (req.body.filterList) {
      var getreportDetailData = req.body.filterList;
      for (let data of getreportDetailData) {
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

        if (data["name"] == "session_id" || data["name"] == "sessionId") {
          sessionId = data["val"];
          sessionId_op = data["op"];
        }

        if (data["name"] == "customer_ani") {
          customerAni = data["val"];
          customerAni_op = data["op"];
        }

        if (data["name"] == "agent_number") {
          agentNumber = data["val"];
          agentNumber_op = data["op"];
        }

        if (data["name"] == "agent_name") {
          agentName = data["val"];
          agentName_op = data["op"];
        }

        if (data["name"] == "response_message") {
          responseMessage = data["val"];
          responseMessage_op = data["op"];
        }

        if (data["name"] == "call_mode") {
          callMode = data["val"];
          callMode_op = data["op"];
        }

        if (data["name"] == "orderBy") {
          orderBy = data["val"];
          orderBy_op = data["op"];
        }

        if (data["name"] == "status") {
          status = data["val"];
          status_op = data["op"];
        }
      }
    }

    let reqData: fetchAgentReport = {
      sme_id: parseInt(req.params.id),
      isDownload: req.body.isDownload,
      initialRecord: req.body.initialRecord,
      batchSize: req.body.batchSize,
      startDate: g_startDate,
      startDate_op: g_startDate_op,
      endDate: g_endDate,
      endDate_op: g_endDate_op,
      duration: g_duration,
      duration_op: g_duration_op,
      customerAni: customerAni,
      customerAni_op: customerAni_op,
      agentNumber: agentNumber,
      agentNumber_op: agentNumber_op,
      agentName: agentName,
      agentName_op: agentName_op,
      responseMessage: responseMessage,
      responseMessage_op: responseMessage_op,
      callMode: callMode,
      callMode_op: callMode_op,
      sessionId: sessionId,
      sessionId_op: sessionId_op,
      orderBy: orderBy,
      orderBy_op: orderBy_op,
      status: status,
      status_op: status_op
    };
    await FetchAgentReport(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponseWithCount(res, "Successfully listed", response, 0);
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const agentReportData = async (req: Request, res: Response) => {
  try {
    let reqData: AgentReportDataRequestValidate = {
      smeId: parseInt(req.params.id),
      sessionId: req.body.sessionId,
    };
    await FindAgentReportData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const getOutCallsReport = async (req: Request, res: Response) => {
  try {
    var g_startDate = "";
    var g_startDate_op = "";
    var g_endDate = "";
    var g_endDate_op = "";
    var g_duration = "";
    var g_duration_op = "";
    var customerAni = "";
    var customerAni_op = "";
    var agentNumber = "";
    var agentNumber_op = "";
    var agentName = "";
    var agentName_op = "";
    var responseMessage = "";
    var responseMessage_op = "";
    var callMode = "";
    var callMode_op = "";
    var sessionId = "";
    var sessionId_op = "";
    var orderBy = "";
    var orderBy_op = "";
    var status = "";
    var status_op = "";

    if (req.body.filterList) {
      var getreportDetailData = req.body.filterList;
      for (let data of getreportDetailData) {
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

        if (data["name"] == "session_id" || data["name"] == "sessionId") {
          sessionId = data["val"];
          sessionId_op = data["op"];
        }

        if (data["name"] == "customer_ani") {
          customerAni = data["val"];
          customerAni_op = data["op"];
        }

        if (data["name"] == "agent_number") {
          agentNumber = data["val"];
          agentNumber_op = data["op"];
        }

        if (data["name"] == "agent_name") {
          agentName = data["val"];
          agentName_op = data["op"];
        }

        if (data["name"] == "response_message") {
          responseMessage = data["val"];
          responseMessage_op = data["op"];
        }

        if (data["name"] == "call_mode") {
          callMode = data["val"];
          callMode_op = data["op"];
        }

        if (data["name"] == "orderBy") {
          orderBy = data["val"];
          orderBy_op = data["op"];
        }

        if (data["name"] == "status") {
          status = data["val"];
          status_op = data["op"];
        }
      }
    }

    let reqData: fetchAgentReport = {
      sme_id: parseInt(req.params.id),
      isDownload: req.body.isDownload,
      initialRecord: req.body.initialRecord,
      batchSize: req.body.batchSize,
      startDate: g_startDate,
      startDate_op: g_startDate_op,
      endDate: g_endDate,
      endDate_op: g_endDate_op,
      duration: g_duration,
      duration_op: g_duration_op,
      customerAni: customerAni,
      customerAni_op: customerAni_op,
      agentNumber: agentNumber,
      agentNumber_op: agentNumber_op,
      agentName: agentName,
      agentName_op: agentName_op,
      responseMessage: responseMessage,
      responseMessage_op: responseMessage_op,
      callMode: callMode,
      callMode_op: callMode_op,
      sessionId: sessionId,
      sessionId_op: sessionId_op,
      orderBy: orderBy,
      orderBy_op: orderBy_op,
      status: status,
      status_op: status_op
    };
    await FetchOutCallsReport(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};


export const transferLiveCall = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agentId,
      agentNumber: req.body.agentNumber,
      customerNumber: req.body.customerNumber,
      operation: req.body.operation,
    };
    console.log(reqData);
    return SuccessResponse(res, "Successfully listed", []);
    /*await FindAgentReportData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });*/
  } catch (e) {
    glogger('ERR', "", '/sme/'+req.params.id+'/transferLiveCall/', ", exeption:"+e);
    ErrorResponse(res, e);
  }
};

