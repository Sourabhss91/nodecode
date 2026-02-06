import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { findSmeProductPackage,FindSmePackagePaymentHistory } from "../../../../../domain/models/v3/sme.model";
import { env } from '../../../../../../infrastructure/env';

/**
 * get settings.
 *
 * @returns {Object}
 */

 export const getSmeProductPackage = async (req: Request, res: Response) => {
    try {
      let reqData: any = {
        id: req.params.id,
      };
      await findSmeProductPackage(reqData, (err: any, response: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          return SuccessResponse(res, "Successfully Listed", response);
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
  }
  
  export const getsmePackagePaymentHistory = async (req: Request, res: Response) => {
    try {
      let reqData: any = {
        smeId: parseInt(req.params.id),
        initialRecord: req.body.initialRecord,
        batchSize: req.body.batchSize
      };
      await FindSmePackagePaymentHistory(reqData, (err: any, response: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          if (response.length > 0) {
            return SuccessResponse(res, "Successfully listed", response);
          } else {
            return SuccessResponse(res, "Successfully listed", []);
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
