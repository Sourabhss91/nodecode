import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../helpers/apiResponse";
import { FindProfileDetail, UpdateUserStatus } from "../../../../domain/models/sme.model";
import { fetchRequest, getTypeDetailRequest } from "../../../../domain/entities/sme.entity";
import { env } from '../../../../../infrastructure/env';

/**
 * get settings.
 *
 * @returns {Object}
 */

export const getTypeDetail = async (req: Request, res: Response) => {
  try {
    let reqData: getTypeDetailRequest = {
      id: req.params.id,
      userRole: req.body.user.ROLE
    };
    await FindProfileDetail(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        let reqData1: any = {
          username: req.params.id,
          onlineStatus: req.body.status ? req.body.status : "Online",
        };
        UpdateUserStatus(reqData1, (err: any, response:any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {

          }
        });
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
