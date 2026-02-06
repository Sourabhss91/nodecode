import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { FindRemarks, checkRemarksExist, UpdateCustomerRemarks, InsertCustomerRemarks, FindListRemarks, updateUniqueRecentRemarks } from "../../../../../domain/models/v2/sme.model";
import { remarksRequest, setRemarksRequest, fetchListRemarksRequest } from "../../../../../domain/entities/v2/sme.entity";
import { env } from '../../../../../../infrastructure/env';

/**
 * get settings.
 *
 * @returns {Object}
 */

export const getRemarks = async (req: Request, res: Response) => {
  try {
    let reqData: remarksRequest = {
      id: parseInt(req.params.id),
      callDirection: req.body.callDirection,
      sessionId: req.body.sessionId,
    };
    await FindRemarks(reqData, (err: any, response: any) => {
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

/**
 * get settings.
 *
 * @returns {Object}
 */

export const setRemarks = async (req: Request, res: Response) => {
  try {
    var created_by = 0;
    if(req.body.agentId) {
      created_by = parseInt(req.body.agentId);
    } else {
      created_by = parseInt(req.params.id);
    }
    let reqData: any = {
      id: parseInt(req.params.id),
      callDirection: req.body.callDirection ? req.body.callDirection : "",
      sessionId: req.body.sessionId ? req.body.sessionId : "",
      remarks: req.body.remarks,
      customerNumber: req.body.customerNumber ? req.body.customerNumber : "",
      createdBy: created_by,
      insertDateTime : req.body.insertDateTime
    };
    await checkRemarksExist(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response && response.length > 0) {
          UpdateCustomerRemarks(reqData, (err: any, response1: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Successfully updated", {});
            }
          });
        } else {
          InsertCustomerRemarks(reqData, (err: any, response2: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              var reqData1 = {
                "customerRemarksId": response2[0]
              }
              updateUniqueRecentRemarks(reqData, reqData1, (err: any, response2: any) => {
                if (err) {
                } else {
                }
              });
              return SuccessResponse(res, "Successfully inserted", {});
            }
          });
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

/**
 * get getListRemarks.
 *
 * @returns {Object}
 */

export const getListRemarks = async (req: Request, res: Response) => {
  try {
    let reqData: fetchListRemarksRequest = {
      id: parseInt(req.params.id),
      callDirection: req.body.callDirection ? req.body.callDirection : "",
      customerNumber: req.body.customerNumber,
    };
    await FindListRemarks(reqData, (err: any, response: any) => {
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
