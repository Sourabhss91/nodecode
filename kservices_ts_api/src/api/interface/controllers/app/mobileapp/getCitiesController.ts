import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../helpers/apiResponse";
import { FindCities } from "../../../../domain/models/mobileapp.model";
import {  } from "../../../../domain/entities/mobileapp.entity";
import { env } from '../../../../../infrastructure/env';

/**
 * get settings.
 *
 * @returns {Object}
 */

export const getCities = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
    };
    await FindCities(reqData, (err: any, response: any) => {
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
