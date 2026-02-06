import { Request, Response, NextFunction } from "express";
import { decode } from "../lib/jwt";
import { unauthorizedResponse, notFoundResponse, ErrorEmptyResponse } from "../helpers/apiResponse";
import { Constants } from "../config/constants";
import { authVerifyToken} from "../domain/models/crm.model";

export const verifyAuthAccessKeyToken = async (req: Request, res: Response, next: NextFunction) => {
  const AccessKey: any = req.headers.accesskey;
  const AccessToken: any = req.headers.accesstoken;
  if (AccessKey != ""  && AccessToken != "") {
    const { decoded, expired } = decode(AccessKey);
    if (decoded) {
      // @ts-ignore
      req.body.user = decoded;
      if (req.body.user.user_token == AccessToken) {
        if (req.body.user.username != undefined) {
          if (req.body.user.username != "") {
            next();
            /*authVerifyToken({user_token:req.body.user.user_token,user_key:AccessKey},(err:any,response:any)=>{
              if(err){
                ErrorEmptyResponse(res,err);
              }else{
                if(response.length > 0){
                  next();
                }else{
                  ErrorEmptyResponse(res, Constants.ERROR_MESSAGES.AUTHORIZATION_TOKEN_INVALID); 
                }
              }
            })*/
          } else {
            ErrorEmptyResponse(res, Constants.ERROR_MESSAGES.AUTHORIZATION_TOKEN_INVALID);
          }
        } else {
            ErrorEmptyResponse(res, Constants.ERROR_MESSAGES.AUTHORIZATION_TOKEN_INVALID);
        }
      } else {
        ErrorEmptyResponse(res, Constants.ERROR_MESSAGES.AUTHORIZATION_TOKEN_INVALID);
      }
    }
    if (expired) {
      unauthorizedResponse(res, Constants.ERROR_MESSAGES.AUTHORIZATION_ACCESS_KEY_EXPIRED);
    }
  } else {
    unauthorizedResponse(res, Constants.ERROR_MESSAGES.AUTHORIZATION_REQUIRED);
  }
};
