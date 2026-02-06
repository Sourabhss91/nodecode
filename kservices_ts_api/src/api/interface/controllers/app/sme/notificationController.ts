import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../helpers/apiResponse";
import { UpdatenotificationToken, removeNotificationToken, getNotificationData, markAllAsReadData } from "../../../../domain/models/sme.model";
import { UpdatenotificationRequest, getNotificationRequest, markAllAsReadRequest } from "../../../../domain/entities/sme.entity";
import { env } from '../../../../../infrastructure/env';
/**
 * get settings.
 *
 * @returns {Object}
 */

export const setNotificationToken = async (req: Request, res: Response) => {
  try {
    let reqData: UpdatenotificationRequest = {
      id: parseInt(req.params.id),
      token: req.body.token,
      username: req.body.username,
    };
    await UpdatenotificationToken(reqData, (err: any, response: any) => {
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

export const revokeNotificationToken = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: req.params.id,
      token: "",
      username: req.body.username.toString(),
    };
    await removeNotificationToken(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Logout Successfully", response);
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

export const getNotifications = async (req: Request, res: Response) => {
  try {

    let reqData: getNotificationRequest = {
      id: parseInt(req.params.id),
      agentId: req.body.agentId ? req.body.agentId : "",
      agentEmail: req.body.agentEmail ? req.body.agentEmail : "",
    };
    
    await getNotificationData(reqData, (err: any, response: any) => {
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

export const markAllAsReadNotification = async (req: Request, res: Response) => {
  try {
    var notification_id ='';
    var is_read ;
    if(req.body.id){
      notification_id = req.body.id;
      is_read = req.body.isRead;
    } else {
      is_read = 1;
    }
    let reqData: markAllAsReadRequest = {
      id: parseInt(req.params.id),
      notificationId: notification_id,
      isRead: is_read
    };
    await markAllAsReadData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Updated", response);
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


