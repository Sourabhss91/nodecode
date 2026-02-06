import { Request, Response, NextFunction } from "express";
import { decode } from "../lib/jwt";
import { unauthorizedResponse, notFoundResponse, ErrorEmptyResponse } from "../helpers/apiResponse";
import { Constants } from "../config/constants";
import { env } from "../../infrastructure/env/index";
import { convertTimeZone } from "../helpers/utility";
var atob = require("atob");
export const verifyTokenIVR = async (req: Request, res: Response, next: NextFunction) => {
  console.log(new Date());
  var myCurrentDate = convertTimeZone("IST", "resultTimeZone", new Date());
  console.log(myCurrentDate);
  const accessToken: any = req.headers.token;
  console.log(accessToken);
  if (accessToken) {
    let days: any = env.TOKEN_SECRET_IN_DAYS;
    let secret = env.TOKEN_SECRET;
    var myCurrentDate = convertTimeZone("IST", "resultTimeZone", new Date());
    var myPastDate = new Date(myCurrentDate);
    if (days > 0) {
      let day: any = days.replace("+", "");
      myPastDate.setDate(myPastDate.getDate() + day);
    } else {
      let day: any = days.replace("-", "");
      myPastDate.setDate(myPastDate.getDate() - day);
    }
    var month = "" + (myPastDate.getMonth() + 1);
    var daynumber = "" + myPastDate.getDate();
    var year = myPastDate.getFullYear();
    var bin = atob(accessToken);
    let verifyToken: any = year + month + daynumber;
    if (bin == verifyToken) {
      // @ts-ignore
      return next();
    } else {
      notFoundResponse(res, Constants.ERROR_MESSAGES.AUTHORIZATION_TOKEN_INVALID);
    }
  } else {
    unauthorizedResponse(res, Constants.ERROR_MESSAGES.AUTHORIZATION_REQUIRED);
  }
};


export const verifyTokenIVRCustom = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken: any = req.headers.token;
  if (accessToken) {
    if (accessToken == env.CUSTOM_TOKEN) {
      return next();
    } else {
      notFoundResponse(res, Constants.ERROR_MESSAGES.AUTHORIZATION_TOKEN_INVALID);
    }
  } else {
    unauthorizedResponse(res, Constants.ERROR_MESSAGES.AUTHORIZATION_REQUIRED);
  }
};
