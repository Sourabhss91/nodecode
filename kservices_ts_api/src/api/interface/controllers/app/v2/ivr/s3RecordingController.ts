import { Request, Response } from "express";
import { toLowerCase } from "fp-ts/lib/string";
import { s3Upload } from "../../../../../lib/awsS3";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { updateS3Recording, updateS3RecordingStatus } from "../../../../../domain/entities/v2/ivr.entity";
import { addUploadedRecording, uploadedRecordingStatusIn, uploadedRecordingStatusOut, getRecordingStatistics, InsertUpdateToRecordingCallStatistics, updateRecordingStatusBoth } from "../../../../../domain/models/v2/ivr.model";
import { env } from "../../../../../../infrastructure/env";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import { glogger } from "../../../../../helpers/logger";
import { convertTimeZone } from "../../../../../helpers/utility";
/** Object id data type */
const ObjectId = mongoose.Types.ObjectId;

const storage = multer.diskStorage({
  filename: function (req: any, file: any, cb: any) {
    let fileName = "KService-" + Date.now() + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});
/**
 * add file.
 *
 * @returns {Object}
 */

export const recordingUpload = (req: Request, res: Response): any => {
  try {
    console.log("sme_id:(" + req.params.id + ")");
    multer({
      storage: storage,
      fileFilter: function (req, file: any, callback: any) {
        if (file.mimetype == "audio/wav" || file.mimetype == "audio/wave" || file.mimetype == "audio/mp3" || file.mimetype == "audio/MP4") {
          callback(null, file);
        } else {
          callback(null, false);
          console.log(res, "Only .wave, .wav, .mp3 and .MP4 format allowed!");
        }
      },
    }).array("kservice_file", 1)(req, res, function (err) {
      if (err) {
        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/uploadRecording', "recordingUpload, error:"+err);
        return ErrorEmptyResponse(res, err);
      } else {
        glogger('CDR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/uploadRecording', "Session Id "+req.headers.sessionid+"");
        if (req.files != undefined && req.files.length != 0) {
          let foldername = req.params.id;
          const filePath = s3Upload(foldername, req.files, (err: any, s3Data: any) => {
            console.log(s3Data);
            let a_call_id = req.query.in_call_id as string;
            let crm_url = env.CRM_RECORDING_URL + a_call_id + "/playRecording";
            //let komm_url = env.KOMM_RECORDING_URL+req.body.in_call_id+"/playRecording";
            let komm_url = s3Data.Location;

            // sme_id:parseInt(req.params.id),
            //     in_flag:req.body.in_flag,
            //     in_call_id:req.body.in_call_id,
            //     in_agent_id:req.body.in_agent_id,
            //     in_customer_ani:req.body.in_customer_ani,
            //     in_duration:req.body.in_duration,
            //     in_filename:req.body.in_filename,
            //     in_status:req.body.in_status ? req.body.in_status : 0,
            //     in_flag_tbl:req.body.in_flag_tbl,
            //     in_ip:req.body.in_ip,
            //     insertDateTime : req.body.insertDateTime,
            //     in_file : s3Data.Location,
            //     session_id : req.body.session_id,
            //     call_direction : req.body.call_direction,
            //     crm_url : crm_url,
            //     komm_url: komm_url
            let reqData: updateS3Recording = {
              sme_id: parseInt(req.params.id),
              in_flag: parseInt(req.query.in_flag as string),
              in_call_id: req.query.in_call_id as string,
              in_agent_id: parseInt(req.query.in_agent_id as string),
              in_customer_ani: req.query.in_customer_ani as string,
              in_duration: parseInt(req.query.in_duration as string),
              in_filename: req.query.in_filename as string,
              in_status: parseInt(req.query.in_status as string) ? parseInt(req.query.in_status as string) : 0,
              in_flag_tbl: req.query.in_flag_tbl as string,
              in_ip: req.query.in_ip as string,
              insertDateTime: req.query.insertDateTime as string,
              in_file: s3Data.Location,
              session_id: req.query.session_id as string,
              call_direction: req.query.call_direction as string,
              crm_url: crm_url,
              komm_url: komm_url,
            };

            addUploadedRecording(reqData, (err: any, response: any) => {
              if (err) {
                glogger('ERR', ""+req.query.in_call_id+"", '/ivr/'+req.params.id+'/uploadRecording', "addUploadedRecording, error:"+err);
                return ErrorEmptyResponse(res, err);
              } else {

                

                let currentDate = Date();
                let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);

                let reqDataNew: updateS3RecordingStatus = {
                  sme_id: parseInt(req.params.id),
                  session_id: req.query.session_id as string,
                  call_direction: req.query.call_direction as string,
                  getCurrentDate : getCurrentDate,
                };
                if (req.query.call_direction == "OUTGOING") {
                  uploadedRecordingStatusOut(reqDataNew, (err: any, response: any) => {
                    if (err) {
                      glogger('ERR', ""+req.query.session_id+"", '/ivr/'+req.params.id+'/uploadRecording', "uploadedRecordingStatusOut, error:"+err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      glogger('DEB', ""+req.query.session_id+"", '/ivr/'+req.params.id+'/uploadRecording', "SuccessResponse");
                      return SuccessResponse(res, "Successfully upload", s3Data);
                    }
                  });
                } else {
                  uploadedRecordingStatusIn(reqDataNew, (err: any, response: any) => {
                    if (err) {
                      glogger('ERR', ""+req.query.session_id+"", '/ivr/'+req.params.id+'/uploadRecording', "uploadedRecordingStatusIn, error:"+err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      glogger('DEB', ""+req.query.session_id+"", '/ivr/'+req.params.id+'/uploadRecording', "SuccessResponse");
                      return SuccessResponse(res, "Successfully upload", s3Data);
                    }
                  });
                }
              }
            });
          });
        }
      }
    });
  } catch (e) {
    glogger('ERR', ""+req.body.in_call_id+"", '/ivr/'+req.params.id+'/uploadRecording', "Exception:"+e);
    console.log(e);
  }
};

export const saveRecordingData = (req: Request, res: Response): any => {
  try {
    console.log("sme_id:(" + req.params.id + ")");
    console.log("in_call_id:(" + req.body.in_call_id + ")");
    console.log(req.body);
    let a_call_id = req.body.in_call_id;
    let crm_url = env.CRM_RECORDING_URL + a_call_id + "/playRecording";
    //let komm_url = env.KOMM_RECORDING_URL+req.body.in_call_id+"/playRecording";
    let komm_url = req.body.in_filename;

    let reqData: updateS3Recording = {
      sme_id: parseInt(req.params.id),
      in_flag: req.body.in_flag,
      in_call_id: req.body.in_call_id,
      in_agent_id: req.body.in_agent_id,
      in_customer_ani: req.body.in_customer_ani,
      in_duration: req.body.in_duration,
      in_filename: req.body.in_filename,
      in_status: req.body.in_status ? req.body.in_status : 0,
      in_flag_tbl: req.body.in_flag_tbl,
      in_ip: req.body.in_ip,
      insertDateTime: req.body.insertDateTime,
      in_file: req.body.in_filename,
      session_id: req.body.session_id,
      call_direction: req.body.call_direction,
      crm_url: crm_url,
      komm_url: komm_url,
    };
    glogger('IMP', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/uploadRecording', "API Request agentId("+req.body.in_agent_id+"), customerAni("+req.body.in_customer_ani+")");
    addUploadedRecording(reqData, (err: any, response: any) => {
      if (err) {
        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/uploadRecording', "addUploadedRecording, error:"+err);
        return ErrorEmptyResponse(res, err);
      } else {

        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);

        let reqDataNew: updateS3RecordingStatus = {
          sme_id: parseInt(req.params.id),
          session_id: req.body.session_id,
          call_direction: req.body.call_direction,
          getCurrentDate : getCurrentDate,
        };

        //Update Recording Merge Status in calling_cdr
        updateRecordingStatusBoth(reqDataNew, (err: any, response: any) => {
          if (err) {
            glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/saveRecordingData', "updateRecordingStatusBoth, error:"+err);
            return ErrorEmptyResponse(res, err);
          } else {
            glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/saveRecordingData', "updateRecordingStatusBoth Update Successfully");
            if (req.body.call_direction == "OUTGOING") {
              uploadedRecordingStatusOut(reqDataNew, (err: any, response: any) => {
                if (err) {
                  glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/uploadRecording', "uploadedRecordingStatusOut, error:"+err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/uploadRecording', "SuccessResponse");
    
                  let totalRecordings = 0;
    
                  getRecordingStatistics(reqDataNew, (err: any, response44: any) => {
                    if (err) {
                      glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "GetLastCallStatistics, error:" + err);
                      return ErrorEmptyResponse(res, err);
                    } else {
    
                      if(response44[0] && response44[0].service_id > 0) {
                        totalRecordings = response44[0].total_calls;
                        glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "incoming Total Calls ! 0 ("+totalRecordings+")");
                       
                       } else {
                        glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "incoming Total Calls default 0 ("+totalRecordings+")");
                       }
    
                       let reqDataStatsRec: any = {
                        sme_id: parseInt(req.params.id),
                        totalRecordings: totalRecordings,
                        insertDateTime: req.body.insertDateTime,
                        
                      };
    
                      InsertUpdateToRecordingCallStatistics(reqDataStatsRec, (err: any, response45: any) => {
                        if (err) {
                          glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "InsertUpdateToRecordingCallStatistics, error:" + err);
                          return ErrorEmptyResponse(res, err);
                        } else {
    
                          return SuccessResponse(res, "Successfully upload", req.body.in_filename);
                         
                        }
                      });
    
    
                    }
                  });
    
    
                  
                }
              });
            } else {
              uploadedRecordingStatusIn(reqDataNew, (err: any, response: any) => {
                if (err) {
                  glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/uploadRecording', "uploadedRecordingStatusIn, error:"+err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/uploadRecording', "SuccessResponse");
                  //return SuccessResponse(res, "Successfully upload", req.body.in_filename);
    
                  let totalRecordings = 0;
    
                  getRecordingStatistics(reqDataNew, (err: any, response44: any) => {
                    if (err) {
                      glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "GetLastCallStatistics, error:" + err);
                      return ErrorEmptyResponse(res, err);
                    } else {
    
                      if(response44[0] && response44[0].service_id > 0) {
                        totalRecordings = response44[0].total_calls;
                        glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "incoming Total Calls ! 0 ("+totalRecordings+")");
                       
                       } else {
                        glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "incoming Total Calls default 0 ("+totalRecordings+")");
                       }
    
                       let reqDataStatsRec: any = {
                        sme_id: parseInt(req.params.id),
                        totalRecordings: totalRecordings,
                        insertDateTime: req.body.insertDateTime,
                        
                      };
    
                      InsertUpdateToRecordingCallStatistics(reqDataStatsRec, (err: any, response45: any) => {
                        if (err) {
                          glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "InsertUpdateToRecordingCallStatistics, error:" + err);
                          return ErrorEmptyResponse(res, err);
                        } else {
    
                          return SuccessResponse(res, "Successfully upload", req.body.in_filename);
                         
                        }
                      });
    
    
                    }
                  });
                }
              });
            }
          }
        });
      }
    });
  } catch (e) {
    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/uploadRecording', "Exception:"+e);
    ErrorResponse(res, e);
  }
};
