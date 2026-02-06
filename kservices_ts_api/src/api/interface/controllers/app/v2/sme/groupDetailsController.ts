import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { FindGroupDetails } from "../../../../../domain/models/v2/sme.model";
import { groupdetailsRequest } from "../../../../../domain/entities/v2/sme.entity";
import { env } from '../../../../../../infrastructure/env';

/**
 * get group details.
 *
 * @returns {Object}
 */

export const getGroupdetail = async (req: Request, res: Response) => {
  try {
    let reqData: groupdetailsRequest = {
      status: parseInt(req.params.status),
    };
    await FindGroupDetails(reqData, (err: any, response: any) => {
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
