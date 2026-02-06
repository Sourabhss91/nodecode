import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorResWithSuccess } from "../../../../helpers/apiResponse";
import { setLongcodesData, getLongcodeCount, getEndCallReasonsListData, UpdateEndCallReasonOutgoing, UpdateEndCallReasonCommnCdr } from "../../../../domain/models/sme.model";
import { env } from '../../../../../infrastructure/env';

/**
 * get settings.
 *
 * @returns {Object}
 */

export const setLongcodes = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      longcode: req.body.longcodeId,
      status: req.body.status,
      insertDateTime : req.body.insertDateTime
    };
    if(req.body.status && req.body.status == "-7"){
      await getLongcodeCount(reqData, (err: any, response: any) => {
        if (err) {
          return ErrorResponse(res, err);
        } else {
          if(response && response[0].count == 1){
            return ErrorResWithSuccess(res, "You can not mark this number as SPAM. Please contact Kommuno to get new virtual number");
          } else {
            setLongcodesData(reqData, (err: any, response: any) => {
              if (err) {
                return ErrorResponse(res, err);
              } else {
                return SuccessResponse(res, "Successfully added to spam", response);
              }
            });
          }
        }
      });
    } else {
      await setLongcodesData(reqData, (err: any, response: any) => {
        if (err) {
          return ErrorResponse(res, err);
        } else {
          return SuccessResponse(res, "Successfully added to spam", response);
        }
      });
    }
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

export const getEndCallReasonsList = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
    };
    await getEndCallReasonsListData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorResponse(res, err);
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

export const updateEndCallReason = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      sessionId: req.body.sessionId,
      callDirection: req.body.callDirection,
      reasonId: req.body.reasonId,
      agentId: req.body.agentId,
    };
    await UpdateEndCallReasonOutgoing(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorResponse(res, err);
      } else {
        UpdateEndCallReasonCommnCdr(reqData, (err: any, response: any) => {
          if (err) {
            return ErrorResponse(res, err);
          } else {
               return SuccessResponse(res, "Successfully updated", response);
          }
        });
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
