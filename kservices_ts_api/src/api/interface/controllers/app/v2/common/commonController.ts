import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, SuccessResponseWithCount } from "../../../../../helpers/apiResponse";
import { FindGenralCities } from "../../../../../domain/models/v2/common.model";
import { countryFetchRequest, logFetchrequest, setActivityLogFetchrequest } from "../../../../../domain/entities/v2/common.entity";
import { FindActivityLogs, AddActivityLogs, totalActivityLogs } from "../../../../../domain/models/v2/log.model";
import { env } from '../../../../../../infrastructure/env';

/**
 * get settings.
 *
 * @returns {Object}
 */

export const getGenralCities = async (req: Request, res: Response) => {
  try {
    let reqData: countryFetchRequest = {
      country: req.params.country,
    };
    await FindGenralCities(reqData, (err: any, response: any) => {
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

export const getGeneralLeadType = async (req: Request, res: Response) => {
  try {
    let response = {
      records: "{New, Existing}",
      success: true,
    };
    return SuccessResponse(res, "Successfully listed", response);
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const getGeneralLeadStatus = async (req: Request, res: Response) => {
  try {
    let response = {
      records: "{Hot, Warm, Cold, Closed - Won, Closed - Lost, Invalid, Important, Negotiation}",
      success: true,
    };
    return SuccessResponse(res, "Successfully listed", response);
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const getActivityLogs = async (req: Request, res: Response) => {
  try {
    var g_agentId = "";
    var g_agentId_op = "";
    var g_moduleName = "";
    var g_moduleName_op = "";

    if (req.body.filterList) {
      var filterData = req.body.filterList;
      for (let data of filterData) {
        if (data["name"] == "agentId") {
          g_agentId = data["val"];
          g_agentId_op = data["op"];
        }

        if (data["name"] == "moduleName") {
          g_moduleName = data["val"];
          g_moduleName_op = data["op"];
        }
      }
    }

    let reqData: any = {
      smeId: req.params.id,
      agentId: g_agentId,
      agentId_op: g_agentId_op,
      moduleName: g_moduleName,
      moduleName_op: g_moduleName_op,
      initialRecord: req.body.initialRecord,
      batchSize: req.body.batchSize,
    };
    await FindActivityLogs(reqData, (err: any, response: any) => {
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
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const setActivityLogs = async (req: Request, res: Response) => {
  try {
    let reqData: setActivityLogFetchrequest = {
      smeId: req.params.id,
      agentId: req.body.agentId ? req.body.agentId : 0,
      ip: req.body.ip ? req.body.ip : null,
      message: req.body.message ? req.body.message : null,
      userRole: req.body.userRole ? req.body.userRole : null,
      moduleName: req.body.moduleName ? req.body.moduleName : null,
      action: req.body.action ? req.body.action : null,
      insertDate: req.body.insertDate ? req.body.insertDate : "0000-00-00 00:00:00",
      customerNumber: req.body.customerNumber ? req.body.customerNumber : "",
    };
    await AddActivityLogs(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully added", response);
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};
