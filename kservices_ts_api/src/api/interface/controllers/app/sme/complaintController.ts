import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../helpers/apiResponse";
import { FindComplaint, UpdateComplaint, insertComplaint } from "../../../../domain/models/sme.model";
import { fetchRequest, addComplaintRequest, updateComplaintRequest } from "../../../../domain/entities/sme.entity";
import { env } from '../../../../../infrastructure/env';

/**
 * get settings.
 *
 * @returns {Object}
 */

export const getComplaintList = async (req: Request, res: Response) => {
  try {
    let reqData: fetchRequest = {
      id: parseInt(req.params.id),
    };
    await FindComplaint(reqData, (err: any, response: any) => {
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

export const setComplaint = async (req: Request, res: Response) => {
  try {
    if (req.body.id) {
      let reqData: updateComplaintRequest = {
        smeId: parseInt(req.params.id),
        category: parseInt(req.body.category),
        complaintDetail: req.body.complaintDetail,
        emailId: req.body.emailId,
        status: parseInt(req.body.status),
        subject: req.body.subject,
        id: req.body.id,
        insertDateTime : req.body.insertDateTime,
      };
      await UpdateComplaint(reqData, (err: any, response: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          if(req.body.status && req.body.status == "-9") {
            return SuccessResponse(res, "Successfully Deleted ", response);
          } else {
            return SuccessResponse(res, "Successfully Updated ", response);
          }
          
        }
      });
    } else {
      let reqData: addComplaintRequest = {
        smeId: parseInt(req.params.id),
        category: parseInt(req.body.category),
        complaintDetail: req.body.complaintDetail,
        emailId: req.body.emailId,
        status: parseInt(req.body.status),
        subject: req.body.subject,
        insertDateTime : req.body.insertDateTime,
      };
      await insertComplaint(reqData, (err: any, response: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          return SuccessResponse(res, "Successfully Added", response);
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
