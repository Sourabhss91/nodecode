import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { FindSetting, UpdateSettings, checkSmeAutodialerPermissionData, generateReportData, getDownloadReportData, getWebrtcNumberData,  getTrainingVideosData, getFaqData } from "../../../../../domain/models/v2/sme.model";
import { fetchRequest, updateSettingsRequest } from "../../../../../domain/entities/v2/sme.entity";
import { convertTimeZone } from "../../../../../helpers/utility";
import { env } from '../../../../../../infrastructure/env';
import fs from 'fs'
//let uploadPath = "./upload/";
let uploadPath = env.IVR_FLOW_FILE_PATH;
/**
 * get settings.
 *
 * @returns {Object}
 */

export const getSetting = async (req: Request, res: Response) => {
  try {
    let reqData: fetchRequest = {
      id: parseInt(req.params.id),
    };
    await FindSetting(reqData, (err: any, response: any) => {
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

export const updateSetting = async (req: Request, res: Response) => {
  try {

    let reqData: updateSettingsRequest = {
      id: parseInt(req.params.id),
      agent_relax_time: req.body.agent_relax_time,
      call_back_url: req.body.call_back_url,
      gui_timer: req.body.gui_timer ? req.body.gui_timer : 0,
      in_permission_flag: req.body.in_permission_flag,
      language: req.body.language,
      masking: req.body.masking,
      out_permission_flag: req.body.out_permission_flag,
      queue_limit: req.body.queue_limit,
      rec_validity: req.body.rec_validity,
      recording: req.body.recording,
      selection_algo: req.body.selection_algo,
      sticky_algo: req.body.sticky_algo,
      voicemail: req.body.voicemail,
      balance: req.body.balance,
      email_id: req.body.email_id,
      principle_id: req.body.principle_id ? req.body.principle_id : '',
      end_call_notification_flag: req.body.end_call_notification_flag,
      agent_break_notifcation: req.body.agent_break_notifcation,
      agent_break_notification_email: req.body.agent_break_notification_email,
      agent_break_notification_time: req.body.agent_break_notification_time,
      sme_mobile: req.body.sme_mobile ? req.body.sme_mobile : "",
      default_lead_sticky: req.body.default_lead_sticky ? req.body.default_lead_sticky : 0,
      eod_report_emails: req.body.eod_report_emails ? req.body.eod_report_emails : "",
      eod_report_flag: req.body.eod_report_flag ? req.body.eod_report_flag : 0
    };

    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST","resultTimeZone",currentDate);
    let reqDateTime:any ={
      currentDate:getCurrentDate
    }
    await UpdateSettings(reqData,reqDateTime, (err: any, response: any) => {
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


/**
 * get settings.
 *
 * @returns {Object}
 */

 export const downloadFile = async (req: Request, res: Response) => {
  try {
    let filePath:any = uploadPath+""+req.body.filePath;
    res.download(filePath);

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

export const checkSmeAutodialerPermission = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
    };
    await checkSmeAutodialerPermissionData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    if (env.NODE_ENV_ERROR_LOG == "yes") {
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};


export const generateReport = async (req: Request, res: Response) => {
  try {

    let reqData: any = {
      smeId: parseInt(req.params.id),
      status: req.body.status ? req.body.status : "Pending",
      agentId: req.body.agentId && req.body.agentId.length > 0 ? req.body.agentId : "",
      callFlow: req.body.callFlow ? req.body.callFlow : "",
      callStatus: req.body.callStatus ? req.body.callStatus : "",
      callType: req.body.callType ? req.body.callType : "",
      duration: req.body.duration ? req.body.duration : "",
      durationValue: req.body.durationValue ? req.body.durationValue : 0,
      reportName: req.body.reportName ? req.body.reportName : "",
      reportType: req.body.reportType ? req.body.reportType : "",
      startDateTime: req.body.startDate ? req.body.startDate : "",
      endDateTime: req.body.endDate ? req.body.endDate : "",
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : "",
      city: req.body.city ? req.body.city : "",
      leadSource: req.body.leadSource ? req.body.leadSource : "",
      leadStatus: req.body.leadStatus ? req.body.leadStatus : "",
      product: req.body.product ? req.body.product : "",
      email: req.body.email ? req.body.email : "",
      databaseMode: req.body.databaseMode && req.body.databaseMode !="" ? req.body.databaseMode : "",
      userVersion: req.body.userVersion ? req.body.userVersion : 1
    };

    await generateReportData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        
        return SuccessResponse(res, "Inserted Successfully", response);
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};


export const getDownloadReport = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
    };
    await getDownloadReportData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};


export const getWebrtcNumber = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
    };
    await getWebrtcNumberData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const getTrainingVideos = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
    };
    await getTrainingVideosData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const getFaq = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
    };
    await getFaqData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};
