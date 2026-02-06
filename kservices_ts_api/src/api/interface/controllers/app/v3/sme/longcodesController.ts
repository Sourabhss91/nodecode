import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { FindLongcodes, FindAgentLongcodes} from "../../../../../domain/models/v3/sme.model";
import { fetchRequest } from "../../../../../domain/entities/v3/sme.entity";
import { env } from '../../../../../../infrastructure/env';

/**
 * get settings.
 *
 * @returns {Object}
 */

export const getSmeLongcodes = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
      mode: req.body.mode ? req.body.mode : ""
    };
    await FindLongcodes(reqData, (err: any, response: any) => {
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

export const getAgentLongcodes = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
      agentId: req.body.agentId ? req.body.agentId : ""
    };
    await FindAgentLongcodes(reqData, (err: any, response: any) => {
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
