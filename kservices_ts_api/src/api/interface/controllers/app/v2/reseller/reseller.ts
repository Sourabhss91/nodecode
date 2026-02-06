import { Request, Response } from "express";
import { logger, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { UserSignin, UpdateUserToken, FindProfileDetail, UpdateUserStatus } from "../../../../../domain/models/v2/reseller.model";
import { signinRequest, getTypeDetailRequest } from "../../../../../domain/entities/v2/reseller.entity";
import { sign} from "../../../../../lib/jwt";
import { env } from '../../../../../../infrastructure/env';

/**
 * get settings.
 *
 * @returns {Object}
 */

export const resellerSignin = async (req: Request, res: Response) => {
  try {
    let deviceType : string = req.body.deviceType;
    let reqData: signinRequest = {
      username: req.body.username,
      password: req.body.password,
    };
    await UserSignin(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          let userData: any = response[0];
          /*jwt configuration*/
          let expireIn : any = env.JWT_TIMEOUT_DURATION;
          if(deviceType == "WEB"){
            expireIn = env.JWT_TIMEOUT_DURATION_WEB;
          }else if(deviceType == "APP"){
            expireIn = env.JWT_TIMEOUT_DURATION_APP;
          }
          const token = sign(userData,expireIn);
          userData.access_token = token;
          userData.token_type = "Bearer";
          let payload: any = {
            username: req.body.username,
            access_token: token,
          };
          UpdateUserToken(payload, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Successfully loggedIn", userData);
            }
          });
        } else {
          return ErrorEmptyResponse(res, "Invalid login credentials");
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

export const getTypeDetail = async (req: Request, res: Response) => {
  try {
    let reqData: getTypeDetailRequest = {
      username: req.params.id,
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
