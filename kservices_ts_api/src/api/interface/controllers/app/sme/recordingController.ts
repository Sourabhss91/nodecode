import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { ErrorResponse, SuccessResponse, SuccessResponseWithCount, ErrorEmptyResponse } from "../../../../helpers/apiResponse";
import { FindRecording, totalRecordingList } from "../../../../domain/models/sme.model";
import { recordingGetRequest } from "../../../../domain/entities/sme.entity";
import { env } from '../../../../../infrastructure/env';

/**
 * get settings.
 *
 * @returns {Object}
 */

export const getSmeRecordings = async (req: Request, res: Response) => {
  try {
    var g_startDate = "";
    var g_startDate_op = "";
    var g_endDate = "";
    var g_endDate_op = "";
    var g_duration = "";
    var g_duration_op = "";
    var g_customerNumber = "";
    var g_customerNumber_op = "";
    var g_agentId = "";
    var g_agentId_op = "";
    var g_agentName = "";
    var g_agentName_op = "";

    if (req.body.filterList) {
      var recordingData = req.body.filterList;
      for (let data of recordingData) {
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

        if (data["name"] == "customerNumber") {
          g_customerNumber = data["val"];
          g_customerNumber_op = data["op"];
        }

        if (data["name"] == "agentId") {
          g_agentId = data["val"];
          g_agentId_op = data["op"];
        }

        if (data["name"] == "agent_name") {
          g_agentName = data["val"];
          g_agentName_op = data["op"];
        }
      }
    }

    let reqData: recordingGetRequest = {
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
      customerNumber: g_customerNumber,
      customerNumber_op: g_customerNumber_op,
      agentId: g_agentId,
      agentId_op: g_agentId_op,
      agentName: g_agentName,
      agentName_op: g_agentName_op,
    };
    await FindRecording(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          totalRecordingList(reqData, (err: any, totalRecord: any) => {
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
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};
