import { Request, Response, NextFunction } from "express";
import { decode } from "../lib/jwt";
import { unauthorizedResponse, notFoundResponse, ErrorEmptyResponse } from "../helpers/apiResponse";
import { Constants } from "../config/constants";

export const verifyTokenSME = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken: any = req.headers.authentication;
  if (accessToken) {
    const token = accessToken.split(" ")[1];
    const { decoded, expired } = decode(token);
    if (decoded) {
      // @ts-ignore
      req.body.user = decoded;
      if (req.body.user.ROLE == "Client" || req.body.user.ROLE == "Agent") {
        if (req.body.username != undefined) {
          if (req.body.username != "") {
            if (req.body.username != req.body.user.username) {
              notFoundResponse(res, Constants.ERROR_MESSAGES.AUTHORIZATION_TOKEN_INVALID_WITH_USERID);
            } else {
              return next();
            }
          } else {
            return next();
          }
        } else {
          return next();
        }
      } else {
        ErrorEmptyResponse(res, Constants.ERROR_MESSAGES.PERMISSION_ACCESS_CLIENT);
      }
    }
    if (expired) {
      unauthorizedResponse(res, Constants.ERROR_MESSAGES.AUTHORIZATION_TOKEN_EXPIRED);
    }
  } else {
    unauthorizedResponse(res, Constants.ERROR_MESSAGES.AUTHORIZATION_REQUIRED);
  }
};
