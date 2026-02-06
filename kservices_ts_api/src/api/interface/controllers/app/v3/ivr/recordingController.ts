import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { addRecordingIvr, addFailedRecordingInfo , returnFailedRecordingInfo, updateRecordingRetry, updateRecordingSuccess} from "../../../../../domain/models/v3/ivr.model";
import { updateAgentRequest, getFailedRecordingRequest, failedRecordingRequest, updateFailedRecordingRequest} from "../../../../../domain/entities/v3/ivr.entity";
import { env } from '../../../../../../infrastructure/env';
import { glogger } from "../../../../../helpers/logger";

/**
 * get settings.
 *
 * @returns {Object}
 */



  export const saveRecording = async (req: Request, res: Response) => {
    try {
      let reqData: updateAgentRequest = {
       
        sme_id:parseInt(req.params.id),
        in_flag:req.body.in_flag,
        in_call_id:req.body.in_call_id,
        in_agent_id:req.body.in_agent_id,
        in_customer_ani:req.body.in_customer_ani,
        in_duration:req.body.in_duration,
        in_filename:req.body.in_filename,
        in_status:req.body.in_status ? req.body.in_status : 0,
        in_flag_tbl:req.body.in_flag_tbl,
        in_ip:req.body.in_ip,
        insertDateTime : req.body.insertDateTime

      };

      glogger('IMP', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/saveRecording', "API Request agentId("+req.body.in_agent_id+"), customerAni("+req.body.in_customer_ani+")");

      await addRecordingIvr(reqData, (err: any, response: any) => {
        if (err) {
          glogger('ERR', ""+req.body.in_call_id+"", '/ivr/'+req.params.id+'/saveRecording', "addRecordingIvr, error:"+err);
          return ErrorEmptyResponse(res, err);
        } else {
          glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/saveRecording', "SuccessResponse");
          return SuccessResponse(res, "Successfully inserted", response);
         
        }
      });
    } catch (e) {
      glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/saveRecording', "Exception:"+e);
      ErrorResponse(res, e);
    }
  };
 


 
 
  export const saveFailedRecordingInfo = async (req: Request, res: Response) => {
    try {
      let reqData: failedRecordingRequest = {
       
        sme_id:parseInt(req.params.id),
        in_flag:req.body.in_flag,
        in_call_id:req.body.in_call_id,
        in_agent_id:req.body.in_agent_id,
        in_customer_ani:req.body.in_customer_ani,
        in_duration:req.body.in_duration,
        in_filename:req.body.in_filename,
        in_status:req.body.in_status ? req.body.in_status : 0,
        in_flag_tbl:req.body.in_flag_tbl,
        in_ip:req.body.in_ip,
        in_session_id:req.body.in_session_id,
        insertDateTime : req.body.insertDateTime

      };

      glogger('IMP', ""+req.headers.sessionid+"", 'saveFailedRecordingInfo', "API Request agentId("+req.body.in_agent_id+"), customerAni("+req.body.in_customer_ani+") ");

      await addFailedRecordingInfo(reqData, (err: any, response: any) => {
        if (err) {
          glogger('ERR', ""+req.headers.sessionid+"", 'saveFailedRecordingInfo', "addRecordingIvr, error:"+err);
          return ErrorEmptyResponse(res, err);
        } else {
          glogger('DEB', ""+req.headers.sessionid+"", 'saveFailedRecordingInfo', "SuccessResponse");
          return SuccessResponse(res, "Successfully inserted", response);
         
        }
      });
    } catch (e) {
      glogger('ERR', ""+req.headers.sessionid+"", 'saveFailedRecordingInfo', "Exception:"+e);
      ErrorResponse(res, e);
    }
  };

  export const getFailedRecordingInfo = async (req: Request, res: Response) => {
    try {
      let reqData: getFailedRecordingRequest = {

        in_ip:req.body.in_ip,
        total_records:req.body.total_records

      };

      glogger('IMP', ""+req.headers.sessionid+"", 'getFailedRecordingInfo', "API Request ip("+req.body.in_ip+")");


      await returnFailedRecordingInfo(reqData, (err: any, response: any) => {
        if (err) {
          glogger('ERR', ""+req.headers.sessionid+"", 'getFailedRecordingInfo', "returnFailedRecordingInfo, error:"+err);
          return ErrorEmptyResponse(res, err);
        } else {
          glogger('DEB', ""+req.headers.sessionid+"", 'getFailedRecordingInfo', "SuccessResponse");
          return SuccessResponse(res, "Successfully inserted", response);
         
        }
      });
    } catch (e) {
      glogger('ERR', ""+req.headers.sessionid+"", 'getFailedRecordingInfo', "Exception:"+e);
      ErrorResponse(res, e);
    }
  };



  export const updateFailedRecordingRetry = async (req: Request, res: Response) => {
    try {
      let reqData: updateFailedRecordingRequest = {

        in_call_id:req.body.call_id,
        in_sme_id:req.body.sme_id,
        in_status:req.body.status,
        in_s3url:req.body.s3url ? req.body.s3url : 0,
      
      };

      glogger('IMP', ""+req.headers.sessionid+"", 'updateFailedRecordingRetry', "API Request ip("+req.body.in_ip+")  ");
      if(req.body.status == "SUCCESS"){

      glogger('DEB', ""+req.headers.sessionid+"", 'updateRecordingSuccess', "SUCCESS status case");
      await updateRecordingSuccess(reqData, (err: any, response: any) => {
        if (err) {
          glogger('ERR', ""+req.headers.sessionid+"", 'updateRecordingSuccess', " error:"+err);
          return ErrorEmptyResponse(res, err);
        } else {
          glogger('DEB', ""+req.headers.sessionid+"", 'updateRecordingSuccess', "SuccessResponse");
          return SuccessResponse(res, "Successfully inserted", response);
         
        }
      });
    } else {
      glogger('DEB', ""+req.headers.sessionid+"", 'updateRecordingSuccess', "FAILED status case");
      await updateRecordingRetry(reqData, (err: any, response: any) => {
        if (err) {
          glogger('ERR', ""+req.headers.sessionid+"", 'updateRecordingRetry', " error:"+err);
          return ErrorEmptyResponse(res, err);
        } else {
          glogger('DEB', ""+req.headers.sessionid+"", 'updateRecordingRetry', "SuccessResponse");
          return SuccessResponse(res, "Successfully inserted", response);
         
        }
      });

    }
    } catch (e) {
      glogger('ERR', ""+req.headers.sessionid+"", 'updateFailedRecordingRetry', "Exception:"+e);
      ErrorResponse(res, e);
    }
  };