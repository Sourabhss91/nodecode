import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, SuccessResponseWithCount } from "../../../../../helpers/apiResponse";
import { FindCallList, totalRecordList, getAgentCampaignSummaryData } from "../../../../../domain/models/v2/agent.model";
import { callListFetchRequest } from "../../../../../domain/entities/v2/agent.entity";
import { env } from "../../../../../../infrastructure/env";

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
    var agentId = 0;

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

        if (data["name"] == "agent_id") {
          agentId = data["val"];
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
      agentId: agentId,
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

export const getAgentCampaignSummary = async (req: Request, res: Response) => {
  try {
    var campaignId = "";
    var agentId = 0;

    if (req.body.filterList) {
      var filterData = req.body.filterList;
      for (let data of filterData) {
        if (data["name"] == "agent_id") {
          agentId = data["val"];
        }
        if (data["name"] == "campaign_id") {
          campaignId = data["val"];
        }
      }
    }

    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: agentId,
      campaignId: campaignId,
    };
    await getAgentCampaignSummaryData(reqData, (err: any, response: any) => {
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
