import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { FindSystemDetail, FindSystemDetailGraph } from "../../../../../domain/models/v2/sme.model";
import { fetchSystemRequest } from "../../../../../domain/entities/v2/sme.entity";
import { env } from '../../../../../../infrastructure/env';



export const systemDetail = async (req: Request, res: Response) => {
  try {
    let reqData: fetchSystemRequest = {
      id: parseInt(req.params.id),
      endDate: req.body.endDate + ' 23:59:59',
      startDate: req.body.startDate + ' 00:00:00'
    };
    await FindSystemDetail(reqData, (err: any, response: any) => {
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

export const getSystemDetailGraphData = async (req: Request, res: Response) => {
  try {
    let reqData: fetchSystemRequest = {
      id: parseInt(req.params.id),
      startDate: req.body.startDate + ' 00:00:00',
      endDate: req.body.endDate + ' 23:59:59'
    };
    await FindSystemDetailGraph(reqData, (err: any, response: any) => {
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



