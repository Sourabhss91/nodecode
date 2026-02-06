import { Request, Response } from "express";
import { env } from "../../../../../../infrastructure/env";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { checkUserExist } from "../../../../../domain/models/v3/ivr.model";
import { getTokenRequest } from "../../../../../domain/entities/v3/ivr.entity";
import { generateSecretToken  } from "../../../../../helpers/utility";
import { glogger } from "../../../../../helpers/logger";
var btoa = require("btoa");
/**
 * get token.
 *
 * @returns {Object}
 */

export const getToken = async (req: Request, res: Response) => {
  try {
    
    let reqData: getTokenRequest = {
      username: req.body.username,
      password: req.body.password,
    };
    glogger('DEB', ""+req.headers.sessionid+"", '/ivr/getToken', "API Request username("+req.body.username+"), password("+req.body.password+")");
    await checkUserExist(reqData, (err: any, response: any) => {
      if (err) {
        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/getToken', "checkUserExist, error:"+err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (response && response.length > 0) {
          var accesToken = generateSecretToken(env.IN_BACKDAYS); 
          var generatedAccessToken = btoa(accesToken);
          var customResponse = {
              "accessToken" : generatedAccessToken
          }
          console.log(response[0].username);
          glogger('DEB', ""+req.headers.sessionid+"", '/ivr/getToken', "SuccessResponse");
          return SuccessResponse(res, "Successfully listed", customResponse);
        } else {
          return SuccessResponse(res, "Invalid Credentials", response);
        }
      }
    });
  } catch (e) {
    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/getToken', "Exception:"+e);
    ErrorResponse(res, e);
  }
};
