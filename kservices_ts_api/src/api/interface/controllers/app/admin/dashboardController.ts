import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, userExistsError } from "../../../../helpers/apiResponse";
import { findAllClients,findAllAgents,FindSystemDetailGraph,findAllSmeList } from "../../../../domain/models/admin.model";
import { randomString, convertTimeZone } from "../../../../helpers/utility";
import { MailSent } from "../../../../lib/mailer";
import { env } from "../../../../../infrastructure/env";

/**
 * get settings.
 *
 * @returns {Object}
 */




export const getSystemDetailGraphData = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      startDate: req.body.startDate + ' 00:00:00',
      endDate: req.body.endDate + ' 23:59:59',
      filterUserId: req.body.userIds ? req.body.userIds : 'all'
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


export const systemdetail = async (req: Request, res: Response) => {
  try {
   
    let reqData: any = {
      startDate: req.body.startDate + ' 00:00:00',
      endDate: req.body.endDate + ' 23:59:59',
      filterUserId: req.body.userIds ? req.body.userIds : 'all'
    };

    let obj: any = {};
    await findAllClients(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        obj['clients'] = response;
        findAllAgents(reqData, (err: any, response2: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
            obj['agents'] = response2;
            return SuccessResponse(res, "Successfully Listed", obj);
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

export const allSmeList = async (req: Request, res: Response) => {
  try {
    let reqData: any = {};
    await findAllSmeList(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Listed", response);
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