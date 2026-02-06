import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { FindappVersion,FindagentAppDetail,UpdateagentAppDetail,InsertagentAppDetail } from "../../../../../domain/models/v2/mobileapp.model";
import { fetchAppversion } from "../../../../../domain/entities/v2/mobileapp.entity";
import { json } from "body-parser";
import { env } from '../../../../../../infrastructure/env';
import { convertTimeZone } from "../../../../../helpers/utility";
/**
 * get settings.
 *
 * @returns {Object}
 */

  export const appVersion = async (req: Request, res: Response) => {
    try {
      let currentDate = Date();
      let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
      let reqData: fetchAppversion = {
        agent_id: req.body.agent_id,
        sme_id : req.params.id,
        platform: req.body.platform,
        version_name: req.body.version_name.replace('v ',''),
        insert_date_time : getCurrentDate,
        update_date_time: getCurrentDate       

      }
       
      await FindagentAppDetail(reqData, (err: any, responseA: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          console.log(responseA);
          if(responseA.length > 0 ){
            UpdateagentAppDetail(reqData, (err: any, responseB: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                FindappVersion(reqData, (err: any, response: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    console.log(response);
                    if(response.length >0 ){
                      return SuccessResponse(res, "Successfully listed", response);
                    }else{
                      return SuccessResponse(res, "App version already updated", response);
                    }
          
                  }
                });
              }
            });
          }else{
            InsertagentAppDetail(reqData, (err: any, responseC: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                FindappVersion(reqData, (err: any, response: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    if(response.length >0 ){
                      return SuccessResponse(res, "Successfully listed", response);
                    }else{
                      return SuccessResponse(res, "App version already updated", response);
                    }
          
                  }
                });
              }
            });
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