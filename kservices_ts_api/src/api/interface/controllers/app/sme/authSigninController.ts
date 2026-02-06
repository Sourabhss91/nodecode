import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../helpers/apiResponse";
import { UserSignin, UpdateUserToken,UserSingleDetails,findUserAccessKey,UpdateUserAccessKey } from "../../../../domain/models/sme.model";
import { signinRequest, fetchRequest,tokenRequest } from "../../../../domain/entities/sme.entity";
import { sign, randomValueHex } from "../../../../lib/jwt";
import { env } from '../../../../../infrastructure/env'
/**
 * signin.
 *
 * @returns {Object}
 */

export const authSignin = async (req: Request, res: Response) => {
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


/**
 * generate token.
 *
 * @returns {Object}
 */

 export const generateToken = async (req: Request, res: Response) => {
  try {
    let deviceType : string = req.body.deviceType;
    let reqData: fetchRequest = {
      id: parseInt(req.body.id),
    };
    await UserSingleDetails(reqData, (err: any, response: any) => {
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
            username: req.body.id,
            access_token: token,
          };
          UpdateUserToken(payload, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Successfully Generated", userData);
            }
          });
        } else {
          return ErrorEmptyResponse(res, "Invalid credentials");
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
 * generate token.
 *
 * @returns {Object}
 */

 export const generateAccessKey = async (req: Request, res: Response) => {
  try {
    
    //let deviceType : string = req.body.deviceType;
    let reqData: tokenRequest = {
      id: req.body.clientId,
      token:req.body.clientToken
    };
    let jwtTime: any = req.body.jwtTime;
    await findUserAccessKey(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          let userData: any = response[0];
          /*jwt configuration*/
          let expireIn : any = jwtTime;
          const token = sign(userData,expireIn);
          userData.user_key = token;
          userData.token_type = "Bearer";
          let payload: any = {
            username: req.body.clientId,
            user_key: token,
            user_time: req.body.jwtTime
          };
          UpdateUserAccessKey(payload, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Successfully Generated", userData);
            }
          });
        } else {
          return ErrorEmptyResponse(res, "Invalid credentials");
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