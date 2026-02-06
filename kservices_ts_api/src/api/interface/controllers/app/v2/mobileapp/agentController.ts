import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, userExistsError } from "../../../../../helpers/apiResponse";
import { FindagentInsight, FindCdrMissCall, FindTypeDetail, findSmeLongcode,FindAgentList } from "../../../../../domain/models/v2/mobileapp.model";
import { fetchInsightRequest, fetchCdrMisscallRequest, fetchTypedDetailRequest } from "../../../../../domain/entities/v2/mobileapp.entity";
import { env } from "../../../../../../infrastructure/env";

/**
 * get settings.
 *
 * @returns {Object}
 */

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

export const getCdrMisscall = async (req: Request, res: Response) => {
  try {
    var g_startDate = "";
    var g_startDate_op = "";
    var g_endDate = "";
    var g_endDate_op = "";

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
      }
    }

    let reqData: fetchCdrMisscallRequest = {
      id: parseInt(req.params.id),
      startDate: g_startDate,
      startDate_op: g_startDate_op,
      endDate: g_endDate,
      endDate_op: g_endDate_op,
      initialRecord: req.body.initialRecord,
      batchSize: req.body.batchSize,
    };
    await FindCdrMissCall(reqData, (err: any, response: any) => {
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

export const getTypeDetail = async (req: Request, res: Response) => {
  try {
    let reqData: fetchTypedDetailRequest = {
      id: req.params.id,
    };
    await FindTypeDetail(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          let reqData2: any = {
            smeId: response[0].smeId
          }
          findSmeLongcode(reqData2, (err: any, responseL: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              response[0].longocdejson = responseL;
              return SuccessResponse(res, "Successfully listed", response);
            }
          });
        } else {
          return SuccessResponse(res, "Successfully listed", response);
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


export const getAgentList = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
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