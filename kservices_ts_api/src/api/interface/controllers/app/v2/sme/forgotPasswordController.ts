import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { Constants } from "../../../../../config/constants";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { GetUserDetails, UpdateUserToken, insertUpdateForgotPassword, TokenVerify, updatePassword, deleteToken,VerifyPassword,VerifyOTP,updateForgotPassword} from "../../../../../domain/models/v2/sme.model";
import { getEmailTemplate} from "../../../../../domain/models/email_template.model";
import { forgotPasswordRequest,resetPasswordRequest,emailRequest } from "../../../../../domain/entities/v2/sme.entity";
import { MailSent } from "../../../../../lib/mailer";
import { randomString,convertTimeZone } from "../../../../../helpers/utility";
import { env } from '../../../../../../infrastructure/env';

/**
 * Forgot Password.
 *
 * @returns {Object}
 */

export const forgotPassword = async (req: Request, res: Response) => {
  try {

    let where: forgotPasswordRequest = {
      username: req.params.id,
      mode: req.body.mode,
    };

    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST","resultTimeZone",currentDate);
    
    await GetUserDetails(where, (err: any, responseData: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (responseData.length > 0) {
          if(responseData[0]['status'] == '0') {
            return ErrorEmptyResponse(res, "This account has been de-activated");
          } else {
            let genreateOtp = Math.floor(100000 + Math.random() * 900000);
            let reqData: any = {
                sme_id: req.params.id,
                status: 0,
                token: randomString(32),
                otp:genreateOtp,
                insertion_date: getCurrentDate,
                updation_date: getCurrentDate
            };

            let where: any = {
              sme_id: req.params.id,
            };

            insertUpdateForgotPassword(reqData, where, (err: any, response: any) => {
                if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let response :any = {
                      "username" :req.params.id,
                      "email": responseData[0]['email_id'],
                      "updateDateTime":getCurrentDate
                    }
                   
                    /** get email template */
                    getEmailTemplate({type:"forgot_password"},(err:any,emailTemp:any)=>{
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                          if(emailTemp.length > 0){

                            let dataRequest :any={
                              'to':responseData[0]['email_id'],
                              'subject':emailTemp[0]['title'],
                              'message':emailTemp[0]['content'].replace("{{otp}}", genreateOtp).replace("{{username}}", responseData[0]['user_name'])
                            };
                            MailSent(dataRequest);
                            return SuccessResponse(res,  "Forgot password OTP sent to your registered mail.",response);
                          }else{
                            return ErrorEmptyResponse(res, "Email template not found");
                          }
                      }
                    })
                  }
            });
          }

        } else {
          return ErrorEmptyResponse(res, "Invalid username");
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

export const resetPassword = async (req: Request, res: Response) => {
  try {
    // let where: resetPasswordRequest = {
    //   sme_id: req.params.id,
    //   token: req.body.token,
    // };
    let reqData: any = {
      username: req.params.id,
      password: req.body.newPassword,
      current_password: req.body.password
    };

    if(req.body.newPassword == req.body.confirmPassword){
      await VerifyPassword(reqData, (err: any, responseData: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          if (responseData.length > 0) {
              
                updatePassword(reqData, (err: any, response: any) => {
                  if (err) {
                      return ErrorEmptyResponse(res, err);
                    } else {
                      return SuccessResponse(res, "Successfully password reset.", response);
                    }
              });
          } else {
            return ErrorEmptyResponse(res, "Invalid Password");
          }
        }
      });
    }else{
      return ErrorEmptyResponse(res, "Invalid Password");
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

export const verifyOtpForgotPassword = async (req: Request, res: Response) => {
  try {
   
    let reqData: any = {
      username: req.params.id,
      oneTimeCode: req.body.oneTimeCode ? req.body.oneTimeCode : 0
    };

    let currentDate = Date();
    let dateToday = convertTimeZone("IST","resultTimeZone",currentDate);
    
    let dateTodays = new Date(dateToday);
    
    // const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // if(timezone !='Asia/Calcutta'){
    //   var dateToday = new Date();
    // }else{
    //   var ISToffSet = 330; //IST is 5:30; i.e. 60*5+30 = 330 in minutes 
    //   let offset= ISToffSet*60*1000;
    //     var dateToday = new Date(dateTodays.getTime()+offset);
    // }

        if( req.body.oneTimeCode == 0){
          return ErrorEmptyResponse(res, "Please enter valid OTP");
        }
 
      await VerifyOTP(reqData, (err: any, responseData: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          if (responseData.length > 0) {
            let currentMinutes  = dateTodays.getMinutes();
            let d =new Date(responseData[0].insertion_date);
            let otpMinutes = d.getMinutes();
             let checkTimeDiff = currentMinutes -otpMinutes;

             if(checkTimeDiff > 10){
              return ErrorEmptyResponse(res, "OTP expire Please regenerate OTP again");
             }else{
              return SuccessResponse(res, "OTP verify successfully", {});
             }
          } else {
            return ErrorEmptyResponse(res, "Please enter valid OTP");
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

export const forgotChangePassword = async (req: Request, res: Response) => {
  try {
   
    let reqData: any = {
      username: req.params.id,
      newPassword: req.body.newPassword
    };

      await updateForgotPassword(reqData, (err: any, responseData: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {               
              let where: any = {
                sme_id: req.params.id
              };
              let reqDataN: any = {
                sme_id: req.params.id,
                otp:0
              };
              insertUpdateForgotPassword(reqDataN,where, (err: any, responseD: any) => {
                        if (err) {
                            return ErrorEmptyResponse(res, err);
                          } else {
                            return SuccessResponse(res, "Successfully password reset.", responseData);
                          }
              }); 
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


