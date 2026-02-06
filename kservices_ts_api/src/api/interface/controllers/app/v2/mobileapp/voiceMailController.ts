import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponseWithCount, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { FindVoiceMail, TotalVoicemailRecords } from "../../../../../domain/models/v2/mobileapp.model";
import { fetchVoiceMailRequest } from "../../../../../domain/entities/v2/mobileapp.entity";
import { env } from '../../../../../../infrastructure/env';

/**
 * get settings.
 *
 * @returns {Object}
 */

export const getVoiceMail = async (req: Request, res: Response) => {
  try {
    var g_startDate = "";
    var g_startDate_op = "";
    var g_endDate = "";
    var g_endDate_op = "";
    var g_customer_number = 0;
    var g_customer_number_op = 0;
    var g_duration = 0;
    var g_duration_op = 0;
    var g_session_id = "";
    var g_session_id_op = "";

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

        if (data["name"] == "calling_number") {
          g_customer_number = data["val"];
          g_customer_number_op = data["op"];
        }

        if (data["name"] == "duration") {
          g_duration = data["val"];
          g_duration_op = data["op"];
        }

        if (data["name"] == "session_id") {
          g_session_id = data["val"];
          g_session_id_op = data["op"];
        }
      }
    }

    let reqData: fetchVoiceMailRequest = {
      id: parseInt(req.params.id),
      initialRecord: req.body.initialRecord,
      batchSize: req.body.batchSize,
      startDate: g_startDate,
      startDate_op: g_startDate_op,
      endDate: g_endDate,
      endDate_op: g_endDate_op,
      customerNumber: g_customer_number,
      customerNumber_op: g_customer_number_op,
      duration: g_duration,
      duration_op: g_duration_op,
      sessionId: g_session_id,
      sessionId_op: g_session_id_op,
    };
    await FindVoiceMail(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          TotalVoicemailRecords(reqData, (err: any, totalRecord: any) => {
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
