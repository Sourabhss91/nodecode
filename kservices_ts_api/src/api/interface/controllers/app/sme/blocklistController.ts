import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../helpers/apiResponse";
import { FindBlacklistNumbers, checkBlacllistCustomerExist, addBlackWhiteListNumbers, updateBlackWhiteListNumbers } from "../../../../domain/models/sme.model";
import { fetchRequest, setBlackWhiteListNumbersRequest } from "../../../../domain/entities/sme.entity";
import { env } from '../../../../../infrastructure/env';

export const getBlacklistNumbers = async (req: Request, res: Response) => {
  try {
    let reqData: fetchRequest = {
      id: parseInt(req.params.id),
    };
    await FindBlacklistNumbers(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    logger.error(e);
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    ErrorResponse(res, e);
  }
};

export const setBlackWhiteListNumbers = async (req: Request, res: Response) => {
  try {
    let reqData: setBlackWhiteListNumbersRequest = {
      smeId: parseInt(req.params.id),
      created_by: parseInt(req.body.created_by),
      customer_number: req.body.customer_number.toString(),
      blacklist_status: parseInt(req.body.blacklist_status),
      reason: req.body.reason,
      insertDateTime : req.body.insertDateTime

    };
    await checkBlacllistCustomerExist(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if(response && response.length > 0) {
          updateBlackWhiteListNumbers(reqData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Successfully Updated", response);
            }
          });
        } else {
          addBlackWhiteListNumbers(reqData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Successfully Added to Blacklist", response);
            }
          });
        }
      }
    });
  } catch (e) {
    logger.error(e);
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    ErrorResponse(res, e);
  }
};
