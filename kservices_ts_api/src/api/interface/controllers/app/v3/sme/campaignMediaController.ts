import { Request, Response } from "express";
import { toLowerCase } from "fp-ts/lib/string";
import { s3Upload } from "../../../../../lib/awsS3";
import { env } from "../../../../../../infrastructure/env";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, SuccessResponseWithCount } from "../../../../../helpers/apiResponse";
import multer from "multer";
import path from "path";
import fs from "fs";
import csvtojson from "csvtojson";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { getCampaignMediaFileData, setCampaignMediaFileData, addCampaignData, getOutgoingCampaignData, updateCampaignData, getScheduledCallsPastData, updateCampaignDataSchedule, numberExistInUniqueDetails, updateUniqueCustomerCampaign, insertUniqueCustomerCampaign, getLeadSourceData, updateOutgoingCampaignData, deleteCampaignBaseData, getOutgoingCampaigAgentWiseData,  getAgentCampaignData, totalgetAgentCampaignData, checkCampaignReportdData, answeredCampaignReportdData, failedCampaignReportdData, pendingCampaignReportdData, updateIsReportGeneratedStatus, insertIvrCampaignSummary, getScheduledCallsTodayData, getScheduledCallsUpcomingData, totalgetScheduledCallsPastData, totalgetScheduledCallsTodayData, totalgetScheduledCallsUpcomingData, updateLeadUploadData, getCampaignAssignedAgentsData, saveNonWorkingFlowData, getNonWorkingFlowData, updateNonWorkingFlowData, updateTextToSpeechCount, saveNonWorkingFlowMappingData, getNonWorkingMappingFlowData, getNonWorkingDayData, updateNonWorkingDaysData, saveNonWorkingDaysData, checkAddressBookCustomerExist, updateAddressBookCustomer, addAddressBookCustomer, numberExistInInformativeObd, updateInformativeObd, insertInformativeObd, insertUniqueCustomerCampaignNew, ifExistInUploadDialerNumbers, getOutgoingCampaignBetaData } from "../../../../../domain/models/v3/sme.model";
import { glogger } from "../../../../../helpers/logger";
import { convertTimeZone } from "../../../../../helpers/utility";
const { format } = require("@fast-csv/format");
//let uploadPath = "./upload";
let uploadPath = env.IVR_FLOW_FILE_PATH;
const AWS = require('aws-sdk');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath +"/"+ req.params.id+"/campaign/"+ req.params.campaignId);
  },
  filename: function (req: any, file: any, cb: any) {
    let fileName = req.params.id + "-campaign-base-" + Date.now() + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const leadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath +"/"+ req.params.id+"/lead/");
  },
  filename: function (req: any, file: any, cb: any) {
    let fileName = req.params.id + "-lead-base-" + Date.now() + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const nonWorkingStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath +"/"+ req.params.id);
  },
  filename: function (req: any, file: any, cb: any) {
    let fileName = file.originalname;
    cb(null, fileName);
  },
});

/**
 * add file.
 *
 * @returns {Object}
 */

export const uploadCampaignMediaFile = (req: Request, res: Response): any => {
  try {
    let dir = uploadPath + req.params.id;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

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
    }).array("file", 1)(req, res, function (err) {
      if (err) {
        console.log(err);
      } else {
        if (req.files != undefined && req.files.length != 0) {
          return SuccessResponse(res, "Successfully", req.files);
        }
      }
    });
  } catch (e) {
    if (env.NODE_ENV_ERROR_LOG == "yes") {
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    console.log(e);
  }
};

export const getCampaignMediaFile = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      sme_id: parseInt(req.params.id),
    };
    await getCampaignMediaFileData(reqData, (err: any, response: any) => {
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

export const setCampaignMediaFile = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
      templateName: req.body.templateName,
      originalFilePath: req.body.originalFilePath,
      finalFilePath: req.body.finalFilePath,
      status: req.body.status,
      insertDate: req.body.insertDate,
    };
    await setCampaignMediaFileData(reqData, (err: any, response: any) => {
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

export const uploadScheduleCampaign = async (req: Request, res: Response) => {
  try {
    let campaign_id: any = parseInt(req.params.campaignId);
    let customerNumberColumn: any = req.params.customerNumberColumn;
    let reqData: any = {
      campaign_id: campaign_id,
      base_file: "",
      base_count: 0,
      failed_file: "",
      failed_count: 0,
      filtered_file: "",
      filtered_count: 0,
      duplicate_file: "",
      duplicate_count: 0,
      invalid_file: "",
      invalid_count: 0,
      success_file: "",
      success_count: 0,
      error_count: 0,
      LastInsertedId: parseInt(req.params.id),
    };

    let dir = uploadPath +"/"+ req.params.id;
    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir);
    }

    let dir1 = uploadPath +"/"+ req.params.id + "/campaign/";

    if (!fs.existsSync(dir1)) {
      await fs.mkdirSync(dir1);
    }

    let dir2 = uploadPath + "/" + req.params.id + "/campaign/" + campaign_id;
    if (!fs.existsSync(dir2)) {
      fs.mkdirSync(dir2);
    }

    let finalUploadPath: string = dir2 + "/";
    req.params.campaign = campaign_id;

    multer({
      storage: storage,
      fileFilter: function (req, file: any, callback: any) {
        if (file.mimetype == "text/csv") {
          callback(null, file);
        } else {
          callback(null, false);
          console.log(res, "Only .csv format allowed!");
        }
      },
    }).array("base_file", 1)(req, res, function (err) {
      if (err) {
        console.log(err);
      } else {
        const contactData: any = [];
        const uploaded_file_columns: any = [];
        if (req.files != undefined && req.files.length != 0) {
          let fileUpload: any = req.files;
          csvtojson()
            .fromFile(fileUpload[0].path)
            .then(async (source) => {
              let duplicate_file: any = [];
              let invalid_file: any = [];
              let failed_count: any = [];
              let success_file: any = [];

              let invalid_file1: any = [];
              let success_file1: any = [];

              let invalidFileName: any = req.params.id + "-campaign-invalid-file" + Date.now() + Date.now() + ".csv";
              let successFileName: any = req.params.id + "-campaign-filtered-file" + Date.now() + Date.now() + ".csv";
              let duplicateFileName: any = req.params.id + "-campaign-duplicate-file" + Date.now() + Date.now() + ".csv";

              reqData["base_count"] = source.length;
              reqData["base_file"] = fileUpload[0].path;
              let filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;

              await source.map(async (contact) => {
                if (filter.test(contact[customerNumberColumn])) {
                  if (contact[customerNumberColumn].length == 10) {
                    success_file.push(contact[customerNumberColumn]);
                  } else {
                    invalid_file.push(contact[customerNumberColumn]);
                  }
                } else {
                  invalid_file.push(contact[customerNumberColumn]);
                }
                contactData.push(contact[customerNumberColumn]);

              });

              const toFindDuplicates = (success_file: any[]) => success_file.filter((item: any, index: any) => success_file.indexOf(item) !== index);
              const duplicateElementa = toFindDuplicates(success_file);
              reqData["duplicate_count"] = duplicateElementa.length;

              success_file = [...new Set(success_file)];

              reqData["filtered_count"] = success_file.length;
              reqData["invalid_count"] = invalid_file.length;

              const csvFile = await fs.createWriteStream(finalUploadPath + invalidFileName);
              const stream = format({ headers: true });
              stream.pipe(csvFile);
              for (let j = 0; j < invalid_file.length; j++) {
                invalid_file1.push({
                  Contact: invalid_file[j],
                });
                stream.write(invalid_file1[j]);
              }
              stream.end();

              const csvFile1 = await fs.createWriteStream(finalUploadPath + successFileName);
              const stream1 = format({ headers: true });
              stream1.pipe(csvFile1);
              for (let k = 0; k < success_file.length; k++) {
                success_file1.push({
                  Contact: success_file[k],
                });
                stream1.write(success_file1[k]);
              }
              stream1.end();

              const csvFile2 = await fs.createWriteStream(finalUploadPath + duplicateFileName);
              const stream2 = format({ headers: true });
              stream2.pipe(csvFile2);
              for (let k = 0; k < duplicateElementa.length; k++) {
                duplicate_file.push({
                  Contact: duplicateElementa[k],
                });
                stream2.write(duplicate_file[k]);
              }
              stream2.end();

              reqData["filtered_file"] = finalUploadPath + successFileName;
              reqData["invalid_file"] = finalUploadPath + invalidFileName;
              reqData["duplicate_file"] = finalUploadPath + duplicateFileName;
              reqData["valid_numbers"] = success_file;
              await updateCampaignData(reqData, (err: any, response: any) => {
                if (err) {
                  return ErrorEmptyResponse(res, err);
                } else {
                  return SuccessResponse(res, "Successfully inserted", reqData);
                }
              });
            });
        }
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

export const getUploadedFileColumnsData = async (req: Request, res: Response) => {
  try {

    let reqData: any = {

    };

    let dir = uploadPath +"/"+ req.params.id;
    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir);
    }

    let dir1 = uploadPath +"/"+ req.params.id + "/campaign/";

    if (!fs.existsSync(dir1)) {
      await fs.mkdirSync(dir1);
    }

    let dir2 = uploadPath + "/" + req.params.id + "/campaign/" + req.params.campaignId;
    if (!fs.existsSync(dir2)) {
      fs.mkdirSync(dir2);
    }

    let finalUploadPath: string = dir2 + "/";
    req.params.campaign = req.params.campaignId;
    multer({
      storage: storage,
      fileFilter: function (req, file: any, callback: any) {
        if (file.mimetype == "text/csv") {
          callback(null, file);
        } else {
          callback(null, false);
          console.log(res, "Only .csv format allowed!");
        }
      },
    }).array("base_file", 1)(req, res, function (err) {
      if (err) {
        console.log(err);
      } else {
        const uploaded_file_columns: any = [];
        if (req.files != undefined && req.files.length != 0) {
          let fileUpload: any = req.files;
          csvtojson()
            .fromFile(fileUpload[0].path)
            .then(async (source) => {
              reqData["base_count"] = source.length;
              if(source && source.length > 0) {
                for (const [key, value] of Object.entries(source[0])) {
                  uploaded_file_columns.push({"name":key, "id": key});
                }
              }

              reqData["uploaded_file_columns"] = uploaded_file_columns;
              reqData["uploaded_file_data"] = source;
              return SuccessResponse(res, "Successfully Listed", reqData);
            });
        }
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

export const addCampaign = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      campaignName: req.body.campaignName,
      campaignType: req.body.campaignType,
      campaignDescription: req.body.campaignDescription,
      status: "Draft",
      insertDateTime: req.body.insertDateTime,
    };
    await addCampaignData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response) {
          let lastInsertedId = response[0];
          var custom_response = {
            lastInsertedId: lastInsertedId,
            status: "1",
          };
          return SuccessResponse(res, "Successfully Added", custom_response);
        }
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

export const getOutgoingCampaign = async (req: Request, res: Response) => {
  try {
    var campaign_name ='';
    var campaign_name_op ='';
    var campaign_description ='';
    var campaign_description_op ='';
    var campaign_type ='';
    var campaign_type_op ='';
    
    if (req.body.filterList) {
      var filterData = req.body.filterList;
      for (let data of filterData) {
        if(data["name"] =="campaign_name"){
          campaign_name = data["val"];
          campaign_name_op = data["op"];
        }

        if(data["name"] == "campaign_description"){
          campaign_description = data["val"];
          campaign_description_op = data["op"];
        }

        if(data["name"] == "campaign_type"){
          campaign_type = data["val"];
          campaign_type_op = data["op"];
        }
      }
    }

    let reqData: any = {
      smeId: parseInt(req.params.id),
      campaignName: campaign_name,
      campaignName_op: campaign_name_op,
      campaignDescription: campaign_description,
      campaignDescription_op: campaign_description_op,
      campaignType: campaign_type,
      campaignType_op: campaign_type_op,
      initialRecord: req.body.initialRecord ? req.body.initialRecord : 1,
      batchSize: req.body.batchSize ? req.body.batchSize : 60,
    };
    await getOutgoingCampaignData(reqData, (err: any, response: any) => {
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

export const getScheduledCalls = async (req: Request, res: Response) => {
  try {

    var g_insertDateTime ='';
    var g_insertDateTime_op ='';
    var agent_id ='';
    var agent_id_op ='';
    
    if (req.body.filterList) {
      var filterData = req.body.filterList;
      for (let data of filterData) {
        if(data["name"] =="insertDateTime"){
          g_insertDateTime = data["val"];
          g_insertDateTime_op = data["op"];
        }

        if(data["name"] == "agent_id"){
          agent_id = data["val"];
          agent_id_op = data["op"];
        }
      }
    }
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agent_id ? req.body.agent_id : agent_id,
      insertDateTime: getCurrentDate,
      customerNumber: req.body.customerNumber ? req.body.customerNumber : "",
      initialRecord: req.body.initialRecord ? req.body.initialRecord : 1,
      batchSize: req.body.batchSize ? req.body.batchSize : 60,
    };

    let responseData: any = {};
    await getScheduledCallsPastData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        responseData["pastSchedule"] = response;
        getScheduledCallsTodayData(reqData, (err: any, response1: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
            responseData["todaySchedule"] = response1;
            getScheduledCallsUpcomingData(reqData, (err: any, response2: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                responseData["upcomingSchedule"] = response2;
                return SuccessResponse(res, "Successfully listed", responseData);
              }
            });
          }
        });
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

export const addCampaignBase = async (req: Request, res: Response) => {
  try {
    
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agentId,
      customerNumbers: req.body.customerNumbers ? req.body.customerNumbers : 0,
      campaignId: req.body.campaignId,
      startDateTime: req.body.startDateTime,
      endDateTime: req.body.endDateTime,
      status: req.body.status,
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : "",
      leadSource: req.body.leadSource ? req.body.leadSource : 0,
      allAgents: JSON.stringify(req.body.allAgents),
      nextCallTry: req.body.nextCallTry ? req.body.nextCallTry : 0,
      timeDifference: req.body.timeDifference ? req.body.timeDifference : "",
      callPriority: req.body.callPriority ? req.body.callPriority : 22,
      isAutoDialer: 0,
    };

    let finalUploadCampaignData = reqData["customerNumbers"];
    var alreadyExistCount = 0;
    if(req.body.campaignMode && req.body.campaignMode == "edit"){
      await deleteCampaignBaseData(reqData, (err: any, response4: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          updateCampaignDataSchedule (0, reqData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              getLeadSourceData(reqData, (err: any, response1: any) => {
                if (err) {
                  return ErrorEmptyResponse(res, err);
                } else {
                  if(finalUploadCampaignData && finalUploadCampaignData.length > 0) {
                    for (let l = 0; l < finalUploadCampaignData.length; l++) {
                      let reqCustomerNumbers: any = {
                        customerNumber: "+91"+finalUploadCampaignData[l].mobile.substring(finalUploadCampaignData[l].mobile.length - 10),
                        agentId: finalUploadCampaignData[l].agentId,
                        sourceId: (response1 && response1[0]['id']) ? response1[0]['id'] : 0
                      };
                      numberExistInUniqueDetails(reqData, reqCustomerNumbers, (err: any, response2: any) => {
                        if (err) {
                          return ErrorEmptyResponse(res, err);
                        } else {
                          if(response2 && response2.length > 0) {
                            let where: any = {
                              'uniqueId': response2[0]['id'], 
                              'customerNumber': response2[0]['customer_number'] 
                            }
                            updateUniqueCustomerCampaign(where , reqCustomerNumbers, reqData, (err: any, response3: any) => {
                              if (err) {
                                return ErrorEmptyResponse(res, err);
                              } else {
                              
                              }
                            });
                          } else {
                            let reqInsertData: any = {
                              id: parseInt(req.params.id),
                              recent_duration: req.body.recent_duration ? req.body.recent_duration : 0 ,
                              recent_via_longcode: req.body.recent_via_longcode ? req.body.recent_via_longcode : 0 ,
                              server_ip_address: req.body.ip ? req.body.ip : 0 ,
                              recent_patched_agent_id: req.body.recent_patched_agent_id ? req.body.recent_patched_agent_id : 0 ,
                              total_incoming_calls: req.body.total_incoming_calls ? req.body.total_incoming_calls : 0 ,
                              total_outgoing_calls: req.body.total_outgoing_calls ? req.body.total_outgoing_calls : 0 ,
                              lead_type: req.body.lead_type ? req.body.lead_type : "" ,
                              lead_status: req.body.lead_status ? req.body.lead_status : 0 ,
                              city_id: req.body.city_id ? req.body.city_id : 0 ,
                              product_id: req.body.product_id ? req.body.product_id : 0 ,
                              product_price: req.body.product_price ? req.body.product_price : 0 ,
                              assigned_agent_id: req.body.assigned_agent_id ? req.body.assigned_agent_id : 0 ,
                              connected_call_duration: req.body.connected_call_duration ? req.body.connected_call_duration : 0 ,
                              sticky_type: req.body.sticky_type ? req.body.sticky_type : 0 ,
                              insert_date_time : req.body.insertDateTime,
                              update_date_time : req.body.insertDateTime,
                              call_type : req.body.call_type ? req.body.call_type : "CAMPAIGN" ,
                            };
                            insertUniqueCustomerCampaign(reqCustomerNumbers, reqData, (err: any, response4: any) => {
                              if (err) {
                                return ErrorEmptyResponse(res, err);
                              } else {
                              
                              }
                            });
                          }
                        }
                      });
                    }
                  }
                }
              });
            }
            return SuccessResponse(res, "Successfully Added", response);
          });
        }
      });
    } else {
      await updateCampaignDataSchedule (alreadyExistCount, reqData, async(err: any, response: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          await getLeadSourceData (reqData, async(err: any, response1: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              var alreadyExistCount = 0;
              if(finalUploadCampaignData && finalUploadCampaignData.length > 0) {
                for (let l = 0; l < finalUploadCampaignData.length; l++) {
                  let reqCustomerNumbers: any = {
                    customerNumber: "+91"+finalUploadCampaignData[l].mobile.substring(finalUploadCampaignData[l].mobile.length - 10),
                    customer_number: "+91"+finalUploadCampaignData[l].mobile.substring(finalUploadCampaignData[l].mobile.length - 10),
                    agentId: finalUploadCampaignData[l].agentId,
                    sourceId: (response1 && response1.length > 0) ? response1[0]['id'] : 0,
                    recentDuration: req.body.recent_duration ? req.body.recent_duration : 0 ,
                    recentViaLongcode: req.body.recent_via_longcode ? req.body.recent_via_longcode : 0 ,
                    serverIpAddress: req.body.ip ? req.body.ip : 0 ,
                    recentPatchedAgentId: req.body.recent_patched_agent_id ? req.body.recent_patched_agent_id : 0 ,
                    totalIncomingCalls: req.body.total_incoming_calls ? req.body.total_incoming_calls : 0 ,
                    totalOutgoingCalls: req.body.total_outgoing_calls ? req.body.total_outgoing_calls : 0 ,
                    leadType: req.body.lead_type ? req.body.lead_type : "" ,
                    leadStatus: finalUploadCampaignData[l].status ? finalUploadCampaignData[l].status : 0 ,
                    cityId: finalUploadCampaignData[l].city ? finalUploadCampaignData[l].city : 0 ,
                    productId: finalUploadCampaignData[l].product ? finalUploadCampaignData[l].product : 0 ,
                    productPrice: finalUploadCampaignData[l].price ? finalUploadCampaignData[l].price : 0 ,
                    assignedAgentId: finalUploadCampaignData[l].agentId ? finalUploadCampaignData[l].agentId : 0 ,
                    connectedCallDuration: req.body.connected_call_duration ? req.body.connected_call_duration : 0 ,
                    stickyType: req.body.sticky_type ? req.body.sticky_type : 0 ,
                    insert_date_time : req.body.insertDateTime,
                    updateDateTime : req.body.insertDateTime,
                    callType : req.body.call_type ? req.body.call_type : "CAMPAIGN" ,
                    other : finalUploadCampaignData[l].other ? finalUploadCampaignData[l].other : "N/A" ,
                    customerName : finalUploadCampaignData[l].customerName ? finalUploadCampaignData[l].customerName : "" ,
                    email : finalUploadCampaignData[l].email ? finalUploadCampaignData[l].email : "" ,
                    address : finalUploadCampaignData[l].address ? finalUploadCampaignData[l].address : "" ,
                    company : finalUploadCampaignData[l].company ? finalUploadCampaignData[l].company : "" ,
                    insertDateTime : req.body.insertDateTime ? req.body.insertDateTime : 0,
                    smeId : req.params.id ? req.params.id : 0,
                    createdBy : req.body.createdBy ? req.body.createdBy : req.params.id,
                  };
                  await numberExistInUniqueDetails(reqData, reqCustomerNumbers, async(err: any, response2: any) => {
                    if (err) {
                      return ErrorEmptyResponse(res, err);
                    } else {
                      if(response2 && response2.length > 0) {
                        let uniqueId: any = {
                          'uniqueId': response2[0]['id'], 
                          'customerNumber': response2[0]['customer_number'] 
                        }
                        if(response2[0].status == "Completed" || response2[0].end_date_time < reqData["insertDateTime"]){
                          await updateUniqueCustomerCampaign(uniqueId , reqCustomerNumbers, reqData, async(err: any, response3: any) => {
                            if (err) {
                              return ErrorEmptyResponse(res, err);
                            } else {
                            
                            }
                          });
                        } else if(response2[0].status == null && response2[0].campaign_id == null){
                          await updateUniqueCustomerCampaign(uniqueId , reqCustomerNumbers, reqData, async(err: any, response3: any) => {
                            if (err) {
                              return ErrorEmptyResponse(res, err);
                            } else {
                            
                            }
                          });
                        } else if(response2[0].status != "Completed" || response2[0].end_date_time > reqData["insertDateTime"]){
                          alreadyExistCount = alreadyExistCount+1;
                        }
                      } else {
                        await insertUniqueCustomerCampaign(reqCustomerNumbers, reqData, async(err: any, response4: any) => {
                          if (err) {
                            return ErrorEmptyResponse(res, err);
                          } else {
                            if(reqCustomerNumbers["customerName"] != "" || reqCustomerNumbers["email"] != "" || reqCustomerNumbers["address"] != "" || reqCustomerNumbers["company"] != ""){
                              await checkAddressBookCustomerExist(reqCustomerNumbers, async(err: any, response3: any) => {
                                if (err) {
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  let reqContactData: any = {
                                    "smeId": parseInt(req.params.id),
                                    "customer_number_primary": finalUploadCampaignData[l].mobile ? "+91"+finalUploadCampaignData[l].mobile.substring(finalUploadCampaignData[l].mobile.length - 10) : "" ,
                                    "customer_number": finalUploadCampaignData[l].mobile ? "+91"+finalUploadCampaignData[l].mobile.substring(finalUploadCampaignData[l].mobile.length - 10) : "" ,
                                    "customer_name": finalUploadCampaignData[l].customerName ? finalUploadCampaignData[l].customerName : "" ,
                                    "email_id": finalUploadCampaignData[l].email ? finalUploadCampaignData[l].email : "" ,
                                    "address": finalUploadCampaignData[l].address ? finalUploadCampaignData[l].address : "" ,
                                    "company_name": finalUploadCampaignData[l].company ? finalUploadCampaignData[l].company : "" ,
                                    "created_by": req.body.createdBy ? req.body.createdBy : req.params.id,
                                    "status": 1,
                                    "insertDateTime": req.body.insertDateTime ? req.body.insertDateTime : 0
                                  };
                                  if(response3 && response3.length > 0) {
                                    await updateAddressBookCustomer(reqContactData, async(err: any, response4: any) => {
                                      if (err) {
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                        
                                      }
                                    });
                                  } else {
                                    await addAddressBookCustomer(reqContactData, async(err: any, response5: any) => {
                                      if (err) {
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                        
                                      }
                                    });
                                  }
                                }
                              });
                            }
                          }
                        });
                      }
                    }
                  });
                  await sleep(70);
                }

                await updateCampaignDataSchedule (alreadyExistCount, reqData, async(err: any, response: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    if(finalUploadCampaignData.length == alreadyExistCount) {
                      let message = "All the number(s) are already assigned to another campaign"; 
                      let campaignStatus = {
                        "campaignStatus": 0
                      }
                      let reqUpdateData: any = {
                        smeId: parseInt(req.params.id),
                        campaignName: req.body.campaignName ? req.body.campaignName : "",
                        campaignType: req.body.campaigType ? req.body.campaigType : "Preview Dialer",
                        campaignDescription: req.body.campaignDescription ? req.body.campaignDescription : "",
                        status: "-9",
                        campaignId: req.body.campaignId,
                        startStopStatus: req.body.startStopStatus ? req.body.startStopStatus : 0
                      };
                      await updateOutgoingCampaignData (reqUpdateData, async(err: any, response: any) => {
                        if (err) {
                          return ErrorEmptyResponse(res, err);
                        } else {
                          return SuccessResponse(res, message, campaignStatus);
                        }
                      });
                    } else if(alreadyExistCount && alreadyExistCount > 0){
                      let message = "Scheduled successfully. "+alreadyExistCount+" number(s) was already assigned to another campaign";
                      let campaignStatus = {
                        "campaignStatus": 1
                      }
                      return SuccessResponse(res, message, campaignStatus);
                    } else if(alreadyExistCount == 0){
                      let message = "Campaign scheduled successfully";
                      let campaignStatus = {
                        "campaignStatus": 1
                      }
                      return SuccessResponse(res, message, campaignStatus);
                    }
                  }
                });
              }
            }
          });
        }
      });
    }
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

export const updateOutgoingCampaign = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      campaignName: req.body.campaignName,
      campaignType: req.body.campaignType,
      campaignDescription: req.body.campaignDescription,
      status: req.body.status ? req.body.status : "Draft",
      campaignId: req.body.campaignId,
      startStopStatus: req.body.startStopStatus ? req.body.startStopStatus : 0
    };
    await updateOutgoingCampaignData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if(reqData["status"] == "-9"){
          deleteCampaignBaseData(reqData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Successfully Deleted", response);
            }
          });
        } else {
          return SuccessResponse(res, "Successfully Updated", response);
        }
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

export const getOutgoingCampaigAgentWise = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      startDate: req.body.start_date_time,
      endDate: req.body.end_date_time,
      campaignId: req.body.id,
    };
    await getOutgoingCampaigAgentWiseData(reqData, (err: any, response: any) => {
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

export const getAgentCampaign = async (req: Request, res: Response) => {
  try {

    var g_startDate ='';
    var g_startDate_op ='';
    var g_endDate='';
    var g_endDate_op='';
    var agent_id ='';
    var agent_id_op ='';

    if (req.body.filterList) {
      var filterData = req.body.filterList;
      for (let data of filterData) {
        if(data["name"] =="startDate"){
            g_startDate = data["val"];
            g_startDate_op = data["op"];
        }

        if(data["name"] =="endDate"){
            g_endDate = data["val"];
            g_endDate_op = data["op"];
        }

        if(data["name"] == "agent_id"){
          agent_id = data["val"];
          agent_id_op = data["op"];
        }
      }
    }
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: agent_id,
      currentDate: getCurrentDate,
      initialRecord: req.body.initialRecord,
      batchSize: req.body.batchSize,
    };
    await getAgentCampaignData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if(response.length > 0){
          return SuccessResponseWithCount(res, "Successfully listed", response, 0);  
        } else {
          return SuccessResponseWithCount(res, "Successfully listed", response, 0);
        }
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

export const addAutodialerCampaignBase = async (req: Request, res: Response) => {
  try {
    
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agentId,
      campaignId: req.body.campaignId,
      startDateTime: req.body.startDateTime,
      endDateTime: req.body.endDateTime,
      status: req.body.status,
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : "",
      leadSource: req.body.leadSource ? req.body.leadSource : 0,
      allAgents: JSON.stringify(req.body.allAgents),
      nextCallTry: req.body.nextCallTry ? req.body.nextCallTry : 0,
      timeDifference: req.body.timeDifference ? req.body.timeDifference : "",
      isAutoDialer: 0,
      callPriority: req.body.callPriority ? req.body.callPriority : 22,
      finalUploadCampaignData: req.body.finalUploadCampaignData ? req.body.finalUploadCampaignData : [],
    };
    var finalUploadCampaignData = reqData["finalUploadCampaignData"];
    var alreadyExistCount = 0;
    
    if(req.body.campaignMode && req.body.campaignMode == "edit"){
      await deleteCampaignBaseData(reqData, (err: any, response4: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          updateCampaignDataSchedule (0, reqData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              getLeadSourceData(reqData, (err: any, response1: any) => {
                if (err) {
                  return ErrorEmptyResponse(res, err);
                } else {
                  if(finalUploadCampaignData && finalUploadCampaignData.length > 0) {
                    for (let l = 0; l < finalUploadCampaignData.length; l++) {
                      let reqCustomerNumbers: any = {
                        customerNumber: "+91"+finalUploadCampaignData[l].customerNumber.substring(finalUploadCampaignData[l].customerNumber.length - 10),
                        agentId: 0,
                        sourceId: (response1 && response1.length > 0) ? response1[0]['id'] : 0,
                        recentDuration: req.body.recent_duration ? req.body.recent_duration : 0 ,
                        recentViaLongcode: req.body.recent_via_longcode ? req.body.recent_via_longcode : 0 ,
                        serverIpAddress: req.body.ip ? req.body.ip : 0 ,
                        recentPatchedAgentId: req.body.recent_patched_agent_id ? req.body.recent_patched_agent_id : 0 ,
                        totalIncomingCalls: req.body.total_incoming_calls ? req.body.total_incoming_calls : 0 ,
                        totalOutgoingCalls: req.body.total_outgoing_calls ? req.body.total_outgoing_calls : 0 ,
                        leadType: req.body.lead_type ? req.body.lead_type : "" ,
                        leadStatus: finalUploadCampaignData[l].status ? finalUploadCampaignData[l].status : 0 ,
                        cityId: finalUploadCampaignData[l].city ? finalUploadCampaignData[l].city : 0 ,
                        productId: finalUploadCampaignData[l].product ? finalUploadCampaignData[l].product : 0 ,
                        productPrice: finalUploadCampaignData[l].price ? finalUploadCampaignData[l].price : 0 ,
                        assignedAgentId: finalUploadCampaignData[l].agentId ? finalUploadCampaignData[l].agentId : 0 ,
                        connectedCallDuration: req.body.connected_call_duration ? req.body.connected_call_duration : 0 ,
                        stickyType: req.body.sticky_type ? req.body.sticky_type : 0 ,
                        insert_date_time : req.body.insertDateTime,
                        updateDateTime : req.body.insertDateTime,
                        callType : req.body.call_type ? req.body.call_type : "CAMPAIGN" ,
                        other : req.body.other ? req.body.other : "N/A" ,
                        insertDateTime : req.body.insertDateTime ? req.body.insertDateTime : 0,
                        smeId : req.params.id ? req.params.id : 0,
                      };
                      numberExistInUniqueDetails(reqData, reqCustomerNumbers, (err: any, response2: any) => {
                        if (err) {
                          return ErrorEmptyResponse(res, err);
                        } else {
                          if(response2 && response2.length > 0) {
                            let uniqueId: any = {
                              'uniqueId': response2[0]['id'], 
                              'customerNumber': response2[0]['customer_number'] 
                            }
                            updateUniqueCustomerCampaign(uniqueId , reqCustomerNumbers, reqData, (err: any, response3: any) => {
                              if (err) {
                                return ErrorEmptyResponse(res, err);
                              } else {
                              
                              }
                            });
                          } else {
                            insertUniqueCustomerCampaign(reqCustomerNumbers, reqData, (err: any, response4: any) => {
                              if (err) {
                                return ErrorEmptyResponse(res, err);
                              } else {
                              
                              }
                            });
                          }
                        }
                      });
                    }
                  }
                }
              });
            }
            return SuccessResponse(res, "Successfully Updated", response);
          });
        }
      });
    } else {
      await updateCampaignDataSchedule (alreadyExistCount, reqData, async(err: any, response: any) => {
        if (err) {
          glogger("ERR", "Cron", "addAutodialerCampaignBase, updateCampaignDataSchedule", err);
          return ErrorEmptyResponse(res, err);
        } else {
          await getLeadSourceData (reqData, async(err: any, response1: any) => {
            if (err) {
              glogger("ERR", "Cron", "addAutodialerCampaignBase, getLeadSourceData", err);
              return ErrorEmptyResponse(res, err);
            } else {
              var alreadyExistCount = 0;
              if(finalUploadCampaignData && finalUploadCampaignData.length > 0) {
                for (let l = 0; l < finalUploadCampaignData.length; l++) {
                  let reqCustomerNumbers: any = {
                    customerNumber: "+91"+finalUploadCampaignData[l].customerNumber.substring(finalUploadCampaignData[l].customerNumber.length - 10),
                    customer_number: "+91"+finalUploadCampaignData[l].customerNumber.substring(finalUploadCampaignData[l].customerNumber.length - 10),
                    agentId: 0,
                    sourceId: (response1 && response1.length > 0) ? response1[0]['id'] : 0,
                    recentDuration: req.body.recent_duration ? req.body.recent_duration : 0 ,
                    recentViaLongcode: req.body.recent_via_longcode ? req.body.recent_via_longcode : 0 ,
                    serverIpAddress: req.body.ip ? req.body.ip : 0 ,
                    recentPatchedAgentId: req.body.recent_patched_agent_id ? req.body.recent_patched_agent_id : 0 ,
                    totalIncomingCalls: req.body.total_incoming_calls ? req.body.total_incoming_calls : 0 ,
                    totalOutgoingCalls: req.body.total_outgoing_calls ? req.body.total_outgoing_calls : 0 ,
                    leadType: req.body.lead_type ? req.body.lead_type : "" ,
                    leadStatus: finalUploadCampaignData[l].status ? finalUploadCampaignData[l].status : 0 ,
                    cityId: finalUploadCampaignData[l].city ? finalUploadCampaignData[l].city : 0 ,
                    productId: finalUploadCampaignData[l].product ? finalUploadCampaignData[l].product : 0 ,
                    productPrice: finalUploadCampaignData[l].price ? finalUploadCampaignData[l].price : 0 ,
                    assignedAgentId: finalUploadCampaignData[l].agentId ? finalUploadCampaignData[l].agentId : 0 ,
                    connectedCallDuration: req.body.connected_call_duration ? req.body.connected_call_duration : 0 ,
                    stickyType: req.body.sticky_type ? req.body.sticky_type : 0 ,
                    insert_date_time : req.body.insertDateTime,
                    updateDateTime : req.body.insertDateTime,
                    callType : req.body.call_type ? req.body.call_type : "CAMPAIGN" ,
                    other : finalUploadCampaignData[l].other ? finalUploadCampaignData[l].other : "N/A" ,
                    customerName : finalUploadCampaignData[l].customerName ? finalUploadCampaignData[l].customerName : "" ,
                    email : finalUploadCampaignData[l].email ? finalUploadCampaignData[l].email : "" ,
                    address : finalUploadCampaignData[l].address ? finalUploadCampaignData[l].address : "" ,
                    company : finalUploadCampaignData[l].company ? finalUploadCampaignData[l].company : "" ,
                    insertDateTime : req.body.insertDateTime ? req.body.insertDateTime : 0,
                    smeId : req.params.id ? req.params.id : 0,
                    createdBy : req.body.createdBy ? req.body.createdBy : req.params.id,
                  };
                  await numberExistInUniqueDetails(reqData, reqCustomerNumbers, async(err: any, response2: any) => {
                    if (err) {
                      return ErrorEmptyResponse(res, err);
                    } else {
                      if(response2 && response2.length > 0) {
                        let uniqueId: any = {
                          'uniqueId': response2[0]['id'], 
                          'customerNumber': response2[0]['customer_number'] 
                        }
                        if(response2[0].status == "Completed" || response2[0].end_date_time < reqData["insertDateTime"]){
                          await updateUniqueCustomerCampaign(uniqueId , reqCustomerNumbers, reqData, async(err: any, response3: any) => {
                            if (err) {
                              return ErrorEmptyResponse(res, err);
                            } else {
                            
                            }
                          });
                        } else if(response2[0].status == null && response2[0].campaign_id == null){
                          await updateUniqueCustomerCampaign(uniqueId , reqCustomerNumbers, reqData, async(err: any, response3: any) => {
                            if (err) {
                              return ErrorEmptyResponse(res, err);
                            } else {
                            
                            }
                          });
                        } else if((response2[0].status != "Completed" || response2[0].end_date_time > reqData["insertDateTime"]) && response2[0].campaign_id != reqData["campaignId"]){
                          alreadyExistCount = alreadyExistCount+1;
                        }
                      } else {
                        await insertUniqueCustomerCampaign(reqCustomerNumbers, reqData, async(err: any, response4: any) => {
                          if (err) {
                            return ErrorEmptyResponse(res, err);
                          } else {
                            if(reqCustomerNumbers["customerName"] != "" || reqCustomerNumbers["email"] != "" || reqCustomerNumbers["address"] != "" || reqCustomerNumbers["company"] != ""){
                              await checkAddressBookCustomerExist(reqCustomerNumbers, async(err: any, response3: any) => {
                                if (err) {
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  let reqContactData: any = {
                                    "smeId": parseInt(req.params.id),
                                    "customer_number_primary": finalUploadCampaignData[l].customerNumber ? "+91"+finalUploadCampaignData[l].customerNumber.substring(finalUploadCampaignData[l].customerNumber.length - 10) : "" ,
                                    "customer_number": finalUploadCampaignData[l].customerNumber ? "+91"+finalUploadCampaignData[l].customerNumber.substring(finalUploadCampaignData[l].customerNumber.length - 10) : "" ,
                                    "customer_name": finalUploadCampaignData[l].customerName ? finalUploadCampaignData[l].customerName : "" ,
                                    "email_id": finalUploadCampaignData[l].email ? finalUploadCampaignData[l].email : "" ,
                                    "address": finalUploadCampaignData[l].address ? finalUploadCampaignData[l].address : "" ,
                                    "company_name": finalUploadCampaignData[l].company ? finalUploadCampaignData[l].company : "" ,
                                    "created_by": req.body.createdBy ? req.body.createdBy : req.params.id,
                                    "status": 1,
                                    "insertDateTime": req.body.insertDateTime ? req.body.insertDateTime : 0
                                  };
                                  if(response3 && response3.length > 0) {
                                    await updateAddressBookCustomer(reqContactData, async(err: any, response4: any) => {
                                      if (err) {
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                        
                                      }
                                    });
                                  } else {
                                    await addAddressBookCustomer(reqContactData, async(err: any, response5: any) => {
                                      if (err) {
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                        
                                      }
                                    });
                                  }
                                }
                              });
                            }
                          }
                        });
                      }
                    }
                  });
                  await sleep(70);
                }
                await updateCampaignDataSchedule (alreadyExistCount, reqData, async(err: any, response: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    if(finalUploadCampaignData.length == alreadyExistCount) {
                      let message = "All the number(s) are already assigned to another campaign"; 
                      let campaignStatus = {
                        "campaignStatus": 0
                      }
                      let reqUpdateData: any = {
                        smeId: parseInt(req.params.id),
                        campaignName: req.body.campaignName ? req.body.campaignName : "",
                        campaignType: req.body.campaigType ? req.body.campaigType : "Autodialer",
                        campaignDescription: req.body.campaignDescription ? req.body.campaignDescription : "",
                        status: "-9",
                        campaignId: req.body.campaignId,
                        startStopStatus: req.body.startStopStatus ? req.body.startStopStatus : 0
                      };
                      await updateOutgoingCampaignData (reqUpdateData, async(err: any, response: any) => {
                        if (err) {
                          return ErrorEmptyResponse(res, err);
                        } else {
                          return SuccessResponse(res, message, campaignStatus);
                        }
                      });
                    } else if(alreadyExistCount > 0){
                      let message = "Scheduled successfully. "+alreadyExistCount+" number(s) was already assigned to another campaign";
                      let campaignStatus = {
                        "campaignStatus": 1
                      }
                      return SuccessResponse(res, message, campaignStatus);
                    } else if(alreadyExistCount == 0){
                      let message = "Campaign scheduled successfully";
                      let campaignStatus = {
                        "campaignStatus": 1
                      }
                      return SuccessResponse(res, message, campaignStatus);
                    }
                  }
                });
              }
            }
          });
        }
        
      });
    }
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

export const generateCampaignReport = async () => {
  try {
    
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqDateTime: any = {
      currentDate: getCurrentDate,
    };

    await checkCampaignReportdData(reqDateTime, async(err: any, response: any) => {
      if (err) {
        glogger("ERR", "Cron", "checkCampaignReportdData", err);
      } else {
        if (response && response.length > 0) {
          for (let resp of response) {
            let dir = uploadPath +"/"+ resp.sme_id;
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir);
            }
            
            let dir1 = uploadPath + "/"+resp.sme_id + "/campaign/";
            if (!fs.existsSync(dir1)) {
              fs.mkdirSync(dir1);
            }

            let dir2 = uploadPath + "/"+resp.sme_id + "/campaign/"+ resp.id;
            if (!fs.existsSync(dir2)) {
              fs.mkdirSync(dir2);
            }

            let finalUploadPath: string = dir2 + "/";
            let answeredFileName: any = resp.sme_id + "-campaign-answered-file" + Date.now() + Date.now() + ".csv";
            let answered_file: any = [];

            let failedFileName: any = resp.sme_id + "-campaign-failed-file" + Date.now() + Date.now() + ".csv";
            let failed_file: any = [];

            let pendingFileName: any = resp.sme_id + "-campaign-pending-file" + Date.now() + Date.now() + ".csv";
            let pending_file: any = [];

            let agentWiseFileName: any = resp.sme_id + "-campaign-agent-wise-file" + Date.now() + Date.now() + ".csv";
            let agentWise_file: any = [];

            let campaignReportFileName: any = resp.sme_id + "-campaign-report-file" + Date.now() + Date.now() + ".csv";
            let campaignReport_file: any = [];

            let reqData1: any = {
              smeId: resp.sme_id,
              campaignId: resp.id,
              startDate: resp.start_date_time,
              endDate: resp.end_date_time,
              answeredFilePath: answeredFileName,
              failedFilePath: failedFileName,
              pendingFilePath: pendingFileName,
              agentWiseFilePath: agentWiseFileName,
              campaignReportFilePath: campaignReportFileName,
            };

            await answeredCampaignReportdData(reqData1, async(err: any, response1: any) => {
              if (err) {
                glogger("ERR", "Cron", "answeredCampaignReportdData", err);
              } else {
                var answeredNumbersCount = response1.length;
                if (response1 && response1.length > 0) {
                  const csvFile = fs.createWriteStream(finalUploadPath + answeredFileName);
                  const stream = format({ headers: true });
                  stream.pipe(csvFile);
                  for (let k = 0; k < response1.length; k++) {
                    answered_file.push({
                      "Date": getCurrentDate,
                      "Campaign Name" : resp.campaign_name,
                      "Campaign Description" : resp.campaign_description,
                      "Campaign Type" : resp.campaign_type,
                      "Campaign Status" : 'Completed',
                      "Customer Number":  response1[k].customer_number.slice(response1[k].customer_number.length - 10),
                      "Start Time" : resp.start_date_time,
                      "End Time" : resp.end_date_time,
                    });
                    stream.write(answered_file[k]);
                  }
                  stream.end();
                }

                await failedCampaignReportdData(reqData1, async(err: any, response2: any) => {
                  if (err) {
                    glogger("ERR", "Cron", "failedCampaignReportdData", err);
                  } else {
                    var failedNumbersCount = response2.length;
                    if (response2 && response2.length > 0) {
                      const csvFile1 = fs.createWriteStream(finalUploadPath + failedFileName);
                      const stream1 = format({ headers: true });
                      stream1.pipe(csvFile1);
                      for (let k = 0; k < response2.length; k++) {
                        failed_file.push({
                          "Date": getCurrentDate,
                          "Campaign Name" : resp.campaign_name,
                          "Campaign Description" : resp.campaign_description,
                          "Campaign Type" : resp.campaign_type,
                          "Campaign Status" : 'Completed',
                          "Customer Number":  response2[k].customer_number.slice(response2[k].customer_number.length - 10),
                          "Start Time" : resp.start_date_time,
                          "End Time" : resp.end_date_time,
                        });
                        stream1.write(failed_file[k]);
                      }
                      stream1.end();
                    }

                    await pendingCampaignReportdData(reqData1, async(err: any, response3: any) => {
                      if (err) {
                        glogger("ERR", "Cron", "pendingCampaignReportdData", err);
                      } else {
                        var pendingNumbersCount = response3.length;
                        if (response3 && response3.length > 0) {
                          const csvFile2 = fs.createWriteStream(finalUploadPath + pendingFileName);
                          const stream2 = format({ headers: true });
                          stream2.pipe(csvFile2);
                          for (let k = 0; k < response3.length; k++) {
                            pending_file.push({
                              "Date": getCurrentDate,
                              "Campaign Name" : resp.campaign_name,
                              "Campaign Description" : resp.campaign_description,
                              "Campaign Type" : resp.campaign_type,
                              "Campaign Status" : 'Completed',
                              "Customer Number":  response3[k].customer_number.slice(response3[k].customer_number.length - 10),
                              "Start Time" : resp.start_date_time,
                              "End Time" : resp.end_date_time,
                            });
                            stream2.write(pending_file[k]);
                          }
                          stream2.end();
                        }

                        await getOutgoingCampaigAgentWiseData(reqData1, async(err: any, response4: any) => {
                          if (err) {
                            glogger("ERR", "Cron", "agentWiseCampaignReportdData", err);
                          } else {
                            if (response4 && response4.length > 0) {
                              const csvFile3 = fs.createWriteStream(finalUploadPath + agentWiseFileName);
                              const stream3 = format({ headers: true });
                              stream3.pipe(csvFile3);
                              for (let k = 0; k < response4.length; k++) {
                                agentWise_file.push({
                                  "Date": getCurrentDate,
                                  "Campaign Name" : resp.campaign_name,
                                  "Campaign Description" : resp.campaign_description,
                                  "Campaign Type" : resp.campaign_type,
                                  "Campaign Status" : 'Completed',
                                  "Customer Number":  response4[k].customer_number.slice(response4[k].customer_number.length - 10),
                                  "Start Time" : resp.start_date_time,
                                  "End Time" : resp.end_date_time,
                                  "Agent":  response4[k].agent_name,
                                  "Answered":  response4[k].answered,
                                  "Failed":  response4[k].failed,
                                  "Pending":  response4[k].pending,
                                });
                                stream3.write(agentWise_file[k]);
                              }
                              stream3.end();
                            }

                            const csvFile4 = fs.createWriteStream(finalUploadPath + campaignReportFileName);
                            const stream4 = format({ headers: true });
                            stream4.pipe(csvFile4);
                            
                              campaignReport_file.push({
                                "Date": getCurrentDate,
                                "Campaign Name" : resp.campaign_name,
                                "Campaign Description" : resp.campaign_description,
                                "Campaign Type" : resp.campaign_type,
                                "Campaign Status" : 'Completed',
                                "Start Time" : resp.start_date_time,
                                "End Time" : resp.end_date_time,
                                "Invalid" : resp.invalid_count,
                                "Duplicate" : resp.duplicate_count,
                                "Already Assigned" : resp.already_assigned,
                                "Valid" : resp.filtered_count,
                                "Answered" : answeredNumbersCount,
                                "Failed" : failedNumbersCount,
                                "Pending" : pendingNumbersCount,
                              });

                              stream4.write(campaignReport_file[0]);
                            
                            stream4.end();
                          }
                        });

                        let reqData2: any = {
                          smeId: resp.sme_id,
                          campaignId: resp.id,
                          startDate: resp.start_date_time,
                          endDate: resp.end_date_time,
                          answeredFilePath: answered_file && answered_file.length>0 ? answeredFileName : "",
                          failedFilePath: failed_file && failed_file.length>0 ? failedFileName : "",
                          pendingFilePath: pending_file && pending_file.length>0 ? pendingFileName : "",
                          agentWiseFilePath: agentWiseFileName,
                          campaignReportPath: campaignReport_file && campaignReport_file.length>0 ? campaignReportFileName : "",
                        };

                        updateIsReportGeneratedStatus(reqData2, (err: any, response5: any) => {
                          if (err) {
                            glogger("ERR", "Cron", "updateIsReportGeneratedStatus", err);
                          } else {
                            
                          }
                        });
                      }
                    });
                  }
                });

                getOutgoingCampaigAgentWiseData(reqData1, (err: any, data: any) => {
                  if (err) {
                    glogger("ERR", "Cron", "getOutgoingCampaigAgentWiseData", err);
                  } else {

                    if (data && data.length > 0) {
                      var totalAnswered = 0;
                      var totalFailed = 0;
                      var totalPending = 0;
                      var agentWiseData = [];
                      for (let i = 0; i < data.length; i++) {
                          var answeredCount = 0;
                          var failedCount = 0;
                          var totalLeadsCount = 0;
                          var pendingCount = 0;
                          for (var j = 0; j < data.length; j++) {
                              if (data[i].agent_id == data[j].agent_id) {
                                  if (data[j].answered > 0) {
                                      answeredCount = answeredCount + 1;
                                  }
                                  if (data[j].failed > 0 && data[j].answered == 0) {
                                      failedCount = failedCount + 1;
                                  }

                                  if (data[j].failed == null && data[j].answered == null) {
                                      pendingCount = pendingCount + 1;
                                  }
                                  totalLeadsCount = totalLeadsCount + 1;
                              }
                          }

                          if (data[i].answered > 0) {
                              totalAnswered = totalAnswered + 1;
                          }
                          if (data[i].failed > 0 && data[i].answered == 0) {
                              totalFailed = totalFailed + 1;
                          }

                          if (data[i].failed == null && data[i].answered == null) {
                              totalPending = totalPending + 1;
                          }

                          var found = agentWiseData.some(function (el) {
                              return el.agentId === data[i].agent_id
                          });

                          if (!found) agentWiseData.push({
                            "smeId": resp.sme_id,
                            "campaignId": resp.id,
                            "agentId": data[i].agent_id,
                            "agent_name": data[i].agent_name,
                            "campaign_name": data[i].campaign_name,
                            "answered": answeredCount,
                            "failed": failedCount,
                            "pending": pendingCount,
                            "assigned": totalLeadsCount,
                            "insert_date_time": getCurrentDate
                          });
                      }

                      for (let i = 0; i < agentWiseData.length; i++) {
                        insertIvrCampaignSummary(agentWiseData[i], async(err: any, response4: any) => {
                          if (err) {
                            glogger("ERR", "Cron", "insertIvrCampaignSummary", err);
                          } else {
                            
                          }
                        });
                      }
                      
                    }
                  }
                });

              }
            });
          }
        }
        console.log("successfully run cron generateCampaignReport");
      }
    });
  } catch (e) {
    if (env.NODE_ENV_ERROR_LOG == "yes") {
      loggerFileError.error(e);
    }
    logger.error(e);
  }
};

export const getPastScheduledCalls = async (req: Request, res: Response) => {
  try {

    var g_insertDateTime ='';
    var g_insertDateTime_op ='';
    var agent_id ='';
    var agent_id_op ='';
    
    if (req.body.filterList) {
      var filterData = req.body.filterList;
      for (let data of filterData) {
        if(data["name"] =="insertDateTime"){
          g_insertDateTime = data["val"];
          g_insertDateTime_op = data["op"];
        }

        if(data["name"] == "agent_id"){
          agent_id = data["val"];
          agent_id_op = data["op"];
        }
      }
    }
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agentId ? req.body.agentId : agent_id,
      insertDateTime: getCurrentDate,
      customerNumber: req.body.customerNumber ? req.body.customerNumber : "",
      initialRecord: req.body.initialRecord ? req.body.initialRecord : 1,
      batchSize: req.body.batchSize ? req.body.batchSize : 60,
    };

    await getScheduledCallsPastData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if(response.length > 0){
          return  SuccessResponseWithCount(res, "Successfully listed", response, 0); 
        } else {
          return SuccessResponseWithCount(res, "Successfully listed", response, 0);
        }
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

export const getTodayScheduledCalls = async (req: Request, res: Response) => {
  try {

    var g_insertDateTime ='';
    var g_insertDateTime_op ='';
    var agent_id ='';
    var agent_id_op ='';

    if (req.body.filterList) {
      var filterData = req.body.filterList;
      for (let data of filterData) {
        if(data["name"] =="insertDateTime"){
          g_insertDateTime = data["val"];
          g_insertDateTime_op = data["op"];
        }

        if(data["name"] == "agent_id"){
          agent_id = data["val"];
          agent_id_op = data["op"];
        }
      }
    }
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agentId ? req.body.agentId : agent_id,
      insertDateTime: getCurrentDate,
      customerNumber: req.body.customerNumber ? req.body.customerNumber : "",
      initialRecord: req.body.initialRecord ? req.body.initialRecord : 1,
      batchSize: req.body.batchSize ? req.body.batchSize : 60,
    };

    await getScheduledCallsTodayData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if(response.length > 0){
          return  SuccessResponseWithCount(res, "Successfully listed", response, 0); 
        } else {
          return SuccessResponseWithCount(res, "Successfully listed", response, 0);
        }
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

export const getUpcomingScheduledCalls = async (req: Request, res: Response) => {
  try {

    var g_insertDateTime ='';
    var g_insertDateTime_op ='';
    var agent_id ='';
    var agent_id_op ='';
    
    if (req.body.filterList) {
      var filterData = req.body.filterList;
      for (let data of filterData) {
        if(data["name"] =="insertDateTime"){
          g_insertDateTime = data["val"];
          g_insertDateTime_op = data["op"];
        }

        if(data["name"] == "agent_id"){
          agent_id = data["val"];
          agent_id_op = data["op"];
        }
      }
    }
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agentId ? req.body.agentId : agent_id,
      insertDateTime: getCurrentDate,
      customerNumber: req.body.customerNumber ? req.body.customerNumber : "",
      initialRecord: req.body.initialRecord ? req.body.initialRecord : 1,
      batchSize: req.body.batchSize ? req.body.batchSize : 60,
    };

    await getScheduledCallsUpcomingData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if(response.length > 0){
          return  SuccessResponseWithCount(res, "Successfully listed", response, 0); 
        } else {
          return SuccessResponseWithCount(res, "Successfully listed", response, 0);
        }
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

export const uploadLead = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);

    let reqData: any = {
      smeId: parseInt(req.params.id),
      insertDateTime: getCurrentDate
    };

    let dir = uploadPath +"/"+ req.params.id;
    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir);
    }

    let dir1 = uploadPath +"/"+ req.params.id + "/lead/";

    if (!fs.existsSync(dir1)) {
      await fs.mkdirSync(dir1);
    }

    let finalUploadPath: string = dir1 + "/";

    multer({
      storage: leadStorage,
      fileFilter: function (req, file: any, callback: any) {
        if (file.mimetype == "text/csv") {
          callback(null, file);
        } else {
          callback(null, false);
          console.log(res, "Only .csv format allowed!");
        }
      },
    }).array("base_file", 1)(req, res, function (err) {
      if (err) {
        console.log(err);
      } else {
        const uploaded_file_columns: any = [];
        if (req.files != undefined && req.files.length != 0) {
          let fileUpload: any = req.files;
          csvtojson()
            .fromFile(fileUpload[0].path)
            .then(async (source) => {
              if(source && source.length > 0) {
                for (const [key, value] of Object.entries(source[0])) {
                  uploaded_file_columns.push({"name":key, "id": key});
                }
              }

              reqData["uploaded_file_columns"] = uploaded_file_columns;
              reqData["uploaded_file_data"] = source;
              return SuccessResponse(res, "Successfully inserted", reqData);
              // await updateLeadUploadData(reqData, (err: any, response: any) => {
              //   if (err) {
              //     return ErrorEmptyResponse(res, err);
              //   } else {
              //     return SuccessResponse(res, "Successfully inserted", reqData);
              //   }
              // });
            });
        }
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

export const getCampaignAssignedAgents = async (req: Request, res: Response) => {
  try {

    let reqData: any = {
      smeId: parseInt(req.params.id),
      campaignId: req.body.campaignId ? req.body.campaignId : 0,
      initialRecord: req.body.initialRecord ? req.body.initialRecord : 1,
      batchSize: req.body.batchSize ? req.body.batchSize : 60,
    };

    await getOutgoingCampaignData(reqData, async(err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if(response.length > 0){
          let reqData1: any = {
            "assignedAgents": JSON.parse(response[0]["assigned_agents"]),
          }
          await getCampaignAssignedAgentsData(reqData, reqData1, async(err: any, response1: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Successfully listed", response1);
            }
          });
        }
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

export const getNonWorkingFlow = async (req: Request, res: Response) => {
  try {

    let reqData: any = {
      smeId: parseInt(req.params.id),
    };

    await getNonWorkingFlowData(reqData, async(err: any, response: any) => {
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

export const saveNonWorkingFlow = async (req: Request, res: Response) => {
  try {

    let finalUploadFilePath: string = "";
    let finalUploadFilePathPolly: string = "";
    let finalUploadFileName: string = "";
    let fileName: string = "";
    let finalUploadPath: string = "";

    if(req.body.welcomeGreetingCustom && req.body.welcomeGreetingCustom != "") {
      let dir = uploadPath +"/"+ req.params.id;
      let pathDir = env.WRINGG_SITE_URL +"uploads/"+ req.params.id+"/polly";
      
      if (!fs.existsSync(dir)) {
        await fs.mkdirSync(dir);
      }

      let dir1 = uploadPath +"/"+ req.params.id + "/polly";

      if (!fs.existsSync(dir1)) {
        await fs.mkdirSync(dir1);
      }

      finalUploadPath = dir1 + "/";
      let finalUploadFile: string = pathDir + "/";
      fileName = Date.now()+Date.now()+".mp3";
      finalUploadFilePath = finalUploadPath;
      finalUploadFilePathPolly = finalUploadPath+fileName;
      finalUploadFileName = finalUploadFile+fileName;

      const Polly = new AWS.Polly({
        signatureVersion: 'v4',
        region: 'us-east-1'
      })
      
      let params = {
        'Text': req.body.welcomeGreetingCustom && req.body.welcomeGreetingCustom != "" ? req.body.welcomeGreetingCustom : "Welcome",
        'OutputFormat': 'mp3',
        'VoiceId': 'Kajal',
        'LanguageCode': req.body.language && req.body.language != "" ? req.body.language : 'hi-IN',
        "Engine": "neural"
      }
    
      Polly.synthesizeSpeech(params, (err: any, data: any) => {
          if (err) {
              console.log(err);
              console.log(err.code);
          } else if (data) {
            if (data.AudioStream instanceof Buffer) {
              fs.writeFile(finalUploadFilePathPolly, data.AudioStream, function(err: any) {
                  if (err) {
                      return console.log(err)
                  }
                  console.log("The file was saved!")
              })
            }
          }
      })
    }

    if(req.body.finalUploadFileName && req.body.finalUploadFileName !="" && req.body.welcomeGreetingCustom == ""){
      finalUploadFileName = req.body.finalUploadFileName;
      finalUploadPath = req.body.finalUploadFilePath;
      fileName = req.body.fileName;
    }

    let reqData: any = {
      smeId: parseInt(req.params.id),
      inTime: req.body.inTime ? req.body.inTime : "",
      outTime: req.body.outTime ? req.body.outTime : "",
      voicemail: req.body.voicemail ? req.body.voicemail : 0,
      welcomeGreeting: req.body.welcomeGreeting && req.body.welcomeGreeting > 0 ? req.body.welcomeGreeting : "",
      workingHours: req.body.workingHours ? req.body.workingHours : 0,
      id: req.body.id ? req.body.id : 0,
      insertDate: req.body.insertDate ? req.body.insertDate : 0,
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : 0,
      updateDateTime: req.body.updateDateTime ? req.body.updateDateTime : 0,
      textToSpeechCount: req.body.textToSpeechCount ? req.body.textToSpeechCount : 0,
      filePath: finalUploadFileName ? finalUploadFileName : "",
      fileName: fileName ? fileName : "",
      welcomeGreetingName: req.body.welcomeGreetingName ? req.body.welcomeGreetingName : "",
      language: req.body.language ? req.body.language : "hi-IN",
      nonWorkingType: "non_working_hour",
      modeFrom: req.body.modeFrom ? req.body.modeFrom : "",
      directoryPath: finalUploadPath ? finalUploadPath : "",
    };

    if(req.body.id && (req.body.welcomeGreetingCustom != "" || req.body.finalUploadFileName !="")){
      await saveNonWorkingFlowMappingData(reqData, async(err: any, response: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          if(response) {
            let reqData1: any = {
              textToSpeechId: response[0]
            }
            await updateNonWorkingFlowData(reqData, reqData1, async(err: any, response: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                if(response) {
                  if(req.body.textToSpeechCount > 0){
                    await updateTextToSpeechCount(reqData, async(err: any, response: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        
                      }
                    });
                  }
                  return SuccessResponse(res, "Non working hours flow updated successfully", response);
                }
              }
            });
          }
        }
      });
    } else if(req.body.id && req.body.welcomeGreeting && req.body.welcomeGreeting > 0){
      let reqData1: any = {
        textToSpeechId: req.body.welcomeGreeting
      }
      await updateNonWorkingFlowData(reqData, reqData1, async(err: any, response: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          if(response) {
            if(req.body.textToSpeechCount > 0){
              await updateTextToSpeechCount(reqData, async(err: any, response: any) => {
                if (err) {
                  return ErrorEmptyResponse(res, err);
                } else {
                  
                }
              });
            }
            return SuccessResponse(res, "Non working hours flow created successfully", response);
          }
        }
      });
    } else {
      await saveNonWorkingFlowMappingData(reqData, async(err: any, response: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          if(response) {
            console.log(response);
            let reqData1: any = {
              textToSpeechId: response[0]
            }
            await saveNonWorkingFlowData(reqData, reqData1, async(err: any, response: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                if(response) {
                  if(req.body.textToSpeechCount > 0){
                    await updateTextToSpeechCount(reqData, async(err: any, response: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        
                      }
                    });
                  }
                  return SuccessResponse(res, "Non working hours flow created successfully", response);
                }
              }
            });
          }
        }
      });
    }
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const getNonWorkingMappingFlow = async (req: Request, res: Response) => {
  try {

    let reqData: any = {
      smeId: parseInt(req.params.id),
      nonWorkingType: req.body.nonWorkingType ? req.body.nonWorkingType : "",
    };

    await getNonWorkingMappingFlowData(reqData, async(err: any, response: any) => {
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

export const getNonWorkingDays = async (req: Request, res: Response) => {
  try {

    let reqData: any = {
      smeId: parseInt(req.params.id),
    };

    await getNonWorkingDayData(reqData, async(err: any, response: any) => {
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

export const saveNonWorkingDays = async (req: Request, res: Response) => {
  try {

    let finalUploadFilePath: string = "";
    let finalUploadFilePathPolly: string = "";
    let finalUploadFileName: string = "";
    let fileName: string = "";
    let finalUploadPath: string = "";

    if(req.body.welcomeGreetingCustom && req.body.welcomeGreetingCustom != "") {
      let dir = uploadPath +"/"+ req.params.id;
      let pathDir = env.WRINGG_SITE_URL +"uploads/"+ req.params.id+"/polly";

      if (!fs.existsSync(dir)) {
        await fs.mkdirSync(dir);
      }

      let dir1 = uploadPath +"/"+ req.params.id + "/polly";

      if (!fs.existsSync(dir1)) {
        await fs.mkdirSync(dir1);
      }

      finalUploadPath = dir1 + "/";
      let finalUploadFile: string = pathDir + "/";

      fileName = Date.now()+Date.now()+".mp3";

      finalUploadFilePath = finalUploadPath;
      finalUploadFilePathPolly = finalUploadPath+fileName;
      finalUploadFileName = finalUploadFile+fileName;

      const Polly = new AWS.Polly({
        signatureVersion: 'v4',
        region: 'us-east-1'
      })
      
      let params = {
          'Text': req.body.welcomeGreetingCustom && req.body.welcomeGreetingCustom != "" ? req.body.welcomeGreetingCustom : "Welcome",
          'OutputFormat': 'mp3',
          'VoiceId': 'Kajal',
          'LanguageCode': req.body.language && req.body.language != "" ? req.body.language : 'hi-IN',
          "Engine": "neural"
      }
      
      Polly.synthesizeSpeech(params, (err: any, data: any) => {
        if (err) {
            console.log(err.code)
        } else if (data) {
          if (data.AudioStream instanceof Buffer) {
            fs.writeFile(finalUploadFilePathPolly, data.AudioStream, function(err: any) {
                if (err) {
                    return console.log(err)
                }
                console.log("The file was saved!")
            })
          }
        }
      })
    }

    if(req.body.finalUploadFileName && req.body.finalUploadFileName !="" && req.body.welcomeGreetingCustom == ""){
      finalUploadFileName = req.body.finalUploadFileName;
      finalUploadPath = req.body.finalUploadFilePath;
      fileName = req.body.fileName;
    }

    let reqData: any = {
      smeId: parseInt(req.params.id),
      voicemail: req.body.voicemail ? req.body.voicemail : 0,
      welcomeGreeting: req.body.welcomeGreeting && req.body.welcomeGreeting > 0 ? req.body.welcomeGreeting : "",
      workingDays: req.body.workingDays ? req.body.workingDays : 0,
      mon: req.body.mon ? req.body.mon : 0,
      tue: req.body.tue ? req.body.tue : 0,
      wed: req.body.wed ? req.body.wed : 0,
      thu: req.body.thu ? req.body.thu : 0,
      fri: req.body.fri ? req.body.fri : 0,
      sat: req.body.sat ? req.body.sat : 0,
      sun: req.body.sun ? req.body.sun : 0,
      id: req.body.id ? req.body.id : 0,
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : 0,
      textToSpeechCount: req.body.textToSpeechCount ? req.body.textToSpeechCount : 0,
      filePath: finalUploadFileName ? finalUploadFileName : "",
      fileName: fileName ? fileName : "",
      welcomeGreetingName: req.body.welcomeGreetingName ? req.body.welcomeGreetingName : "",
      language: req.body.language ? req.body.language : "hi-IN",
      nonWorkingType: "non_working_day",
      modeFrom: req.body.modeFrom ? req.body.modeFrom : "",
      directoryPath: finalUploadPath ? finalUploadPath : "",
    };

    if(req.body.id && (req.body.welcomeGreetingCustom != "" || req.body.finalUploadFileName !="")){
      await saveNonWorkingFlowMappingData(reqData, async(err: any, response: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          if(response) {
            let reqData1: any = {
              textToSpeechId: response[0]
            }
            await updateNonWorkingDaysData(reqData, reqData1, async(err: any, response: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                if(response) {
                  if(req.body.textToSpeechCount > 0){
                    await updateTextToSpeechCount(reqData, async(err: any, response: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        
                      }
                    });
                  }
                  return SuccessResponse(res, "Non working hours flow updated successfully", response);
                }
              }
            });
          }
        }
      });
    } else if(req.body.id && req.body.welcomeGreeting && req.body.welcomeGreeting > 0){
      let reqData1: any = {
        textToSpeechId: req.body.welcomeGreeting
      }
      await updateNonWorkingDaysData(reqData, reqData1, async(err: any, response: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          if(response) {
            if(req.body.textToSpeechCount > 0){
              await updateTextToSpeechCount(reqData, async(err: any, response: any) => {
                if (err) {
                  return ErrorEmptyResponse(res, err);
                } else {
                  
                }
              });
            }
            return SuccessResponse(res, "Non working hours flow created successfully", response);
          }
        }
      });
    } else {
      await saveNonWorkingFlowMappingData(reqData, async(err: any, response: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          if(response) {
            let reqData1: any = {
              textToSpeechId: response[0]
            }
            await saveNonWorkingDaysData(reqData, reqData1, async(err: any, response: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                if(response) {
                  if(req.body.textToSpeechCount > 0){
                    await updateTextToSpeechCount(reqData, async(err: any, response: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        
                      }
                    });
                  }
                  return SuccessResponse(res, "Non working days flow created successfully", response);
                }
              }
            });
          }
        }
      });
    }
    
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const getNonWorkingDaysMappingFlow = async (req: Request, res: Response) => {
  try {

    let reqData: any = {
      smeId: parseInt(req.params.id),
      nonWorkingType: req.body.nonWorkingType ? req.body.nonWorkingType : "",
    };

    await getNonWorkingMappingFlowData(reqData, async(err: any, response: any) => {
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

export const uploadNonWorkingFile = async (req: Request, res: Response) => {
  try {

    let pathDir = env.WRINGG_SITE_URL +"uploads/"+ req.params.id;
    let dir = uploadPath +"/"+ req.params.id;
    
    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir);
    }

    let dir1 = uploadPath +"/"+ req.params.id;

    if (!fs.existsSync(dir1)) {
      await fs.mkdirSync(dir1);
    }

    let finalUploadPath: string = dir1 + "/";
    let finalUploadFile: string = pathDir + "/";

    multer({
      storage: nonWorkingStorage,
      fileFilter: function (req, file: any, callback: any) {
        if (file.mimetype == "audio/mpeg") {
          callback(null, file);
        } else {
          callback(null, false);
          console.log(res, "Only .mp3 format allowed!");
        }
      },
    }).array("base_file", 1)(req, res, function (err) {
      if (err) {
        console.log(err);
      } else {
        if (req.files != undefined && req.files.length != 0) {
          let fileUpload: any = req.files;
          let fileName = fileUpload[0].originalname;

          let customResponse: any = {
            finalUploadFilePath: finalUploadPath,
            finalUploadFileName: finalUploadFile+fileName,
            fileName: fileName,
          };
          return SuccessResponse(res, "Successfully uploaded", customResponse);
        }
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

export const addInformativeObdCampaignBase = async (req: Request, res: Response) => {
  try {
    
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agentId,
      campaignId: req.body.campaignId,
      startDateTime: req.body.startDateTime,
      endDateTime: req.body.endDateTime,
      status: req.body.status,
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : "",
      leadSource: req.body.leadSource ? req.body.leadSource : 0,
      allAgents: JSON.stringify(req.body.allAgents),
      nextCallTry: req.body.nextCallTry ? req.body.nextCallTry : 0,
      timeDifference: req.body.timeDifference ? req.body.timeDifference : "",
      isAutoDialer: 0,
      callPriority: req.body.callPriority ? req.body.callPriority : 22,
      finalUploadCampaignData: req.body.finalUploadCampaignData ? req.body.finalUploadCampaignData : [],
    };
    
    var finalUploadCampaignData = reqData["finalUploadCampaignData"];
    var alreadyExistCount = 0;
    
    if(req.body.campaignMode && req.body.campaignMode == "edit"){
      await deleteCampaignBaseData(reqData, (err: any, response4: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          updateCampaignDataSchedule (0, reqData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              getLeadSourceData(reqData, (err: any, response1: any) => {
                if (err) {
                  return ErrorEmptyResponse(res, err);
                } else {
                  if(finalUploadCampaignData && finalUploadCampaignData.length > 0) {
                    for (let l = 0; l < finalUploadCampaignData.length; l++) {
                      let reqCustomerNumbers: any = {
                        customerNumber: "+91"+finalUploadCampaignData[l].customerNumber.substring(finalUploadCampaignData[l].customerNumber.length - 10),
                        agentId: 0,
                        sourceId: (response1 && response1.length > 0) ? response1[0]['id'] : 0,
                        recentDuration: req.body.recent_duration ? req.body.recent_duration : 0 ,
                        recentViaLongcode: req.body.recent_via_longcode ? req.body.recent_via_longcode : 0 ,
                        serverIpAddress: req.body.ip ? req.body.ip : 0 ,
                        recentPatchedAgentId: req.body.recent_patched_agent_id ? req.body.recent_patched_agent_id : 0 ,
                        totalIncomingCalls: req.body.total_incoming_calls ? req.body.total_incoming_calls : 0 ,
                        totalOutgoingCalls: req.body.total_outgoing_calls ? req.body.total_outgoing_calls : 0 ,
                        leadType: req.body.lead_type ? req.body.lead_type : "" ,
                        leadStatus: finalUploadCampaignData[l].status ? finalUploadCampaignData[l].status : 0 ,
                        cityId: finalUploadCampaignData[l].city ? finalUploadCampaignData[l].city : 0 ,
                        productId: finalUploadCampaignData[l].product ? finalUploadCampaignData[l].product : 0 ,
                        productPrice: finalUploadCampaignData[l].price ? finalUploadCampaignData[l].price : 0 ,
                        assignedAgentId: finalUploadCampaignData[l].agentId ? finalUploadCampaignData[l].agentId : 0 ,
                        connectedCallDuration: req.body.connected_call_duration ? req.body.connected_call_duration : 0 ,
                        stickyType: req.body.sticky_type ? req.body.sticky_type : 0 ,
                        insert_date_time : req.body.insertDateTime,
                        updateDateTime : req.body.insertDateTime,
                        callType : req.body.call_type ? req.body.call_type : "CAMPAIGN" ,
                        other : req.body.other ? req.body.other : "N/A" ,
                        insertDateTime : req.body.insertDateTime ? req.body.insertDateTime : 0,
                        smeId : req.params.id ? req.params.id : 0,
                      };
                      numberExistInInformativeObd(reqData, reqCustomerNumbers, (err: any, response2: any) => {
                        if (err) {
                          return ErrorEmptyResponse(res, err);
                        } else {
                          if(response2 && response2.length > 0) {
                            let uniqueId: any = {
                              'uniqueId':response2[0]['id'],
                              'customerNumber':response2[0]['customer_number']
                            }
                            updateInformativeObd(uniqueId , reqCustomerNumbers, reqData, (err: any, response3: any) => {
                              if (err) {
                                return ErrorEmptyResponse(res, err);
                              } else {
                              
                              }
                            });
                          } else {
                            insertInformativeObd(reqCustomerNumbers, reqData, (err: any, response4: any) => {
                              if (err) {
                                return ErrorEmptyResponse(res, err);
                              } else {
                              
                              }
                            });
                          }
                        }
                      });
                    }
                  }
                }
              });
            }
            return SuccessResponse(res, "Successfully Added", response);
          });
        }
      });
    } else {
      await updateCampaignDataSchedule (alreadyExistCount, reqData, async(err: any, response: any) => {
        if (err) {
          glogger("ERR", "Cron", "addInformativeObdCampaignBase, updateCampaignDataSchedule", err);
          return ErrorEmptyResponse(res, err);
        } else {
          await getLeadSourceData (reqData, async(err: any, response1: any) => {
            if (err) {
              glogger("ERR", "Cron", "addInformativeObdCampaignBase, getLeadSourceData", err);
              return ErrorEmptyResponse(res, err);
            } else {
              var alreadyExistCount = 0;
              if(finalUploadCampaignData && finalUploadCampaignData.length > 0) {
                for (let l = 0; l < finalUploadCampaignData.length; l++) {
                  let reqCustomerNumbers: any = {
                    customerNumber: "+91"+finalUploadCampaignData[l].customerNumber.substring(finalUploadCampaignData[l].customerNumber.length - 10),
                    customer_number: "+91"+finalUploadCampaignData[l].customerNumber.substring(finalUploadCampaignData[l].customerNumber.length - 10),
                    agentId: 0,
                    sourceId: (response1 && response1.length > 0) ? response1[0]['id'] : 0,
                    recentDuration: req.body.recent_duration ? req.body.recent_duration : 0 ,
                    recentViaLongcode: req.body.recent_via_longcode ? req.body.recent_via_longcode : 0 ,
                    serverIpAddress: req.body.ip ? req.body.ip : 0 ,
                    recentPatchedAgentId: req.body.recent_patched_agent_id ? req.body.recent_patched_agent_id : 0 ,
                    totalIncomingCalls: req.body.total_incoming_calls ? req.body.total_incoming_calls : 0 ,
                    totalOutgoingCalls: req.body.total_outgoing_calls ? req.body.total_outgoing_calls : 0 ,
                    leadType: req.body.lead_type ? req.body.lead_type : "" ,
                    leadStatus: finalUploadCampaignData[l].status ? finalUploadCampaignData[l].status : 0 ,
                    cityId: finalUploadCampaignData[l].city ? finalUploadCampaignData[l].city : 0 ,
                    productId: finalUploadCampaignData[l].product ? finalUploadCampaignData[l].product : 0 ,
                    productPrice: finalUploadCampaignData[l].price ? finalUploadCampaignData[l].price : 0 ,
                    assignedAgentId: finalUploadCampaignData[l].agentId ? finalUploadCampaignData[l].agentId : 0 ,
                    connectedCallDuration: req.body.connected_call_duration ? req.body.connected_call_duration : 0 ,
                    stickyType: req.body.sticky_type ? req.body.sticky_type : 0 ,
                    insert_date_time : req.body.insertDateTime,
                    updateDateTime : req.body.insertDateTime,
                    callType : req.body.call_type ? req.body.call_type : "CAMPAIGN" ,
                    other : finalUploadCampaignData[l].other ? finalUploadCampaignData[l].other : "N/A" ,
                    customerName : finalUploadCampaignData[l].customerName ? finalUploadCampaignData[l].customerName : "" ,
                    email : finalUploadCampaignData[l].email ? finalUploadCampaignData[l].email : "" ,
                    address : finalUploadCampaignData[l].address ? finalUploadCampaignData[l].address : "" ,
                    company : finalUploadCampaignData[l].company ? finalUploadCampaignData[l].company : "" ,
                    insertDateTime : req.body.insertDateTime ? req.body.insertDateTime : 0,
                    smeId : req.params.id ? req.params.id : 0,
                    createdBy : req.body.createdBy ? req.body.createdBy : req.params.id,
                  };
                  await numberExistInInformativeObd(reqData, reqCustomerNumbers, async(err: any, response2: any) => {
                    if (err) {
                      return ErrorEmptyResponse(res, err);
                    } else {
                      if(response2 && response2.length > 0) {
                        let uniqueId: any = {
                          'uniqueId':response2[0]['id'],
                          'customerNumber':response2[0]['customer_number']
                        }
                        if(response2[0].status == "Completed" || response2[0].end_date_time < reqData["insertDateTime"]){
                          await updateInformativeObd(uniqueId , reqCustomerNumbers, reqData, async(err: any, response3: any) => {
                            if (err) {
                              return ErrorEmptyResponse(res, err);
                            } else {
                            
                            }
                          });
                        } else if(response2[0].status == null && response2[0].campaign_id == null){
                          await updateInformativeObd(uniqueId , reqCustomerNumbers, reqData, async(err: any, response3: any) => {
                            if (err) {
                              return ErrorEmptyResponse(res, err);
                            } else {
                            
                            }
                          });
                        } else if(response2[0].status != "Completed" || response2[0].end_date_time > reqData["insertDateTime"]){
                          alreadyExistCount = alreadyExistCount+1;
                        }
                      } else {
                        await insertInformativeObd(reqCustomerNumbers, reqData, async(err: any, response4: any) => {
                          if (err) {
                            return ErrorEmptyResponse(res, err);
                          } else {
                            if(reqCustomerNumbers["customerName"] != "" || reqCustomerNumbers["email"] != "" || reqCustomerNumbers["address"] != "" || reqCustomerNumbers["company"] != ""){
                              await checkAddressBookCustomerExist(reqCustomerNumbers, async(err: any, response3: any) => {
                                if (err) {
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  let reqContactData: any = {
                                    "smeId": parseInt(req.params.id),
                                    "customer_number_primary": finalUploadCampaignData[l].customerNumber ? "+91"+finalUploadCampaignData[l].customerNumber.substring(finalUploadCampaignData[l].customerNumber.length - 10) : "" ,
                                    "customer_number": finalUploadCampaignData[l].customerNumber ? "+91"+finalUploadCampaignData[l].customerNumber.substring(finalUploadCampaignData[l].customerNumber.length - 10) : "" ,
                                    "customer_name": finalUploadCampaignData[l].customerName ? finalUploadCampaignData[l].customerName : "" ,
                                    "email_id": finalUploadCampaignData[l].email ? finalUploadCampaignData[l].email : "" ,
                                    "address": finalUploadCampaignData[l].address ? finalUploadCampaignData[l].address : "" ,
                                    "company_name": finalUploadCampaignData[l].company ? finalUploadCampaignData[l].company : "" ,
                                    "created_by": req.body.createdBy ? req.body.createdBy : req.params.id,
                                    "status": 1,
                                    "insertDateTime": req.body.insertDateTime ? req.body.insertDateTime : 0
                                  };
                                  if(response3 && response3.length > 0) {
                                    await updateAddressBookCustomer(reqContactData, async(err: any, response4: any) => {
                                      if (err) {
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                        
                                      }
                                    });
                                  } else {
                                    await addAddressBookCustomer(reqContactData, async(err: any, response5: any) => {
                                      if (err) {
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                        
                                      }
                                    });
                                  }
                                }
                              });
                            }
                          }
                        });
                      }
                    }
                  });
                  await sleep(70);
                }
                await updateCampaignDataSchedule (alreadyExistCount, reqData, async(err: any, response: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    if(finalUploadCampaignData.length == alreadyExistCount) {
                      let message = "All the number(s) are already assigned to another campaign"; 
                      let campaignStatus = {
                        "campaignStatus": 0
                      }
                      let reqUpdateData: any = {
                        smeId: parseInt(req.params.id),
                        campaignName: req.body.campaignName ? req.body.campaignName : "",
                        campaignType: req.body.campaigType ? req.body.campaigType : "Autodialer",
                        campaignDescription: req.body.campaignDescription ? req.body.campaignDescription : "",
                        status: "-9",
                        campaignId: req.body.campaignId,
                        startStopStatus: req.body.startStopStatus ? req.body.startStopStatus : 0
                      };
                      await updateOutgoingCampaignData (reqUpdateData, async(err: any, response: any) => {
                        if (err) {
                          return ErrorEmptyResponse(res, err);
                        } else {
                          return SuccessResponse(res, message, campaignStatus);
                        }
                      });
                    } else if(alreadyExistCount && alreadyExistCount > 0){
                      let message = "Scheduled successfully "+alreadyExistCount+" number(s) already assigned to another campaign";
                      let campaignStatus = {
                        "campaignStatus": 1
                      }
                      return SuccessResponse(res, message, campaignStatus);
                    } else if(alreadyExistCount == 0){
                      let message = "Campaign scheduled successfully";
                      let campaignStatus = {
                        "campaignStatus": 1
                      }
                      return SuccessResponse(res, message, campaignStatus);
                    }
                  }
                });
              }
            }
          });
        }
        
      });
    }
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

export const addAutodialerCampaignBaseNew = async (req: Request, res: Response) => {
  try {
    
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agentId,
      campaignId: req.body.campaignId,
      startDateTime: req.body.startDateTime,
      endDateTime: req.body.endDateTime,
      status: req.body.status,
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : "",
      leadSource: req.body.leadSource ? req.body.leadSource : 0,
      allAgents: JSON.stringify(req.body.allAgents),
      nextCallTry: req.body.nextCallTry ? req.body.nextCallTry : 0,
      timeDifference: req.body.timeDifference ? req.body.timeDifference : "",
      isAutoDialer: 0,
      callPriority: req.body.callPriority ? req.body.callPriority : 22,
      finalUploadCampaignData: req.body.finalUploadCampaignData ? req.body.finalUploadCampaignData : [],
    };
    var finalUploadCampaignData = reqData["finalUploadCampaignData"];
    var alreadyExistCount = 0;
    
    await updateCampaignDataSchedule (alreadyExistCount, reqData, async(err: any, response: any) => {
      if (err) {
        glogger("ERR", "Cron", "addAutodialerCampaignBaseNew, updateCampaignDataSchedule", err);
        return ErrorEmptyResponse(res, err);
      } else {
        await getLeadSourceData (reqData, async(err: any, response1: any) => {
          if (err) {
            glogger("ERR", "Cron", "addAutodialerCampaignBaseNew, getLeadSourceData", err);
            return ErrorEmptyResponse(res, err);
          } else {
            if(finalUploadCampaignData && finalUploadCampaignData.length > 0) {
              for (let l = 0; l < finalUploadCampaignData.length; l++) {
                var randomNumber = Math.floor(Math.random() * (999 - 100 + 1) + 100);
                var uniqueSessionId = new Date().getTime() + "" + randomNumber;
                let reqCustomerNumbers: any = {
                  customerNumber: "+91"+finalUploadCampaignData[l].customerNumber.substring(finalUploadCampaignData[l].customerNumber.length - 10),
                  customer_number: "+91"+finalUploadCampaignData[l].customerNumber.substring(finalUploadCampaignData[l].customerNumber.length - 10),
                  agentId: 0,
                  sourceId: (response1 && response1.length > 0) ? response1[0]['id'] : 0,
                  leadStatus: finalUploadCampaignData[l].status ? finalUploadCampaignData[l].status : 0 ,
                  cityId: finalUploadCampaignData[l].city ? finalUploadCampaignData[l].city : 0 ,
                  productId: finalUploadCampaignData[l].product ? finalUploadCampaignData[l].product : 0 ,
                  productPrice: finalUploadCampaignData[l].price ? finalUploadCampaignData[l].price : 0 ,
                  assignedAgentId: finalUploadCampaignData[l].agentId ? finalUploadCampaignData[l].agentId : 0 ,
                  insert_date_time : req.body.insertDateTime,
                  updateDateTime : req.body.insertDateTime,
                  callType : req.body.call_type ? req.body.call_type : "CAMPAIGN" ,
                  other : finalUploadCampaignData[l].other ? finalUploadCampaignData[l].other : "N/A" ,
                  customerName : finalUploadCampaignData[l].customerName ? finalUploadCampaignData[l].customerName : "" ,
                  email : finalUploadCampaignData[l].email ? finalUploadCampaignData[l].email : "" ,
                  address : finalUploadCampaignData[l].address ? finalUploadCampaignData[l].address : "" ,
                  company : finalUploadCampaignData[l].company ? finalUploadCampaignData[l].company : "" ,
                  insertDateTime : req.body.insertDateTime ? req.body.insertDateTime : 0,
                  smeId : req.params.id ? req.params.id : 0,
                  createdBy : req.body.createdBy ? req.body.createdBy : req.params.id,
                  campaignId: req.body.campaignId,
                  callStatus: 0,
                  sessionId: uniqueSessionId
                };
                
                await insertUniqueCustomerCampaignNew(reqCustomerNumbers, reqData, async(err: any, response4: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    if(reqCustomerNumbers["customerName"] != "" || reqCustomerNumbers["email"] != "" || reqCustomerNumbers["address"] != "" || reqCustomerNumbers["company"] != ""){
                      await checkAddressBookCustomerExist(reqCustomerNumbers, async(err: any, response3: any) => {
                        if (err) {
                          return ErrorEmptyResponse(res, err);
                        } else {
                          let reqContactData: any = {
                            "smeId": parseInt(req.params.id),
                            "customer_number_primary": finalUploadCampaignData[l].customerNumber ? "+91"+finalUploadCampaignData[l].customerNumber.substring(finalUploadCampaignData[l].customerNumber.length - 10) : "" ,
                            "customer_number": finalUploadCampaignData[l].customerNumber ? "+91"+finalUploadCampaignData[l].customerNumber.substring(finalUploadCampaignData[l].customerNumber.length - 10) : "" ,
                            "customer_name": finalUploadCampaignData[l].customerName ? finalUploadCampaignData[l].customerName : "" ,
                            "email_id": finalUploadCampaignData[l].email ? finalUploadCampaignData[l].email : "" ,
                            "address": finalUploadCampaignData[l].address ? finalUploadCampaignData[l].address : "" ,
                            "company_name": finalUploadCampaignData[l].company ? finalUploadCampaignData[l].company : "" ,
                            "created_by": req.body.createdBy ? req.body.createdBy : req.params.id,
                            "status": 1,
                            "insertDateTime": req.body.insertDateTime ? req.body.insertDateTime : 0
                          };
                          if(response3 && response3.length > 0) {
                            await updateAddressBookCustomer(reqContactData, async(err: any, response4: any) => {
                              if (err) {
                                return ErrorEmptyResponse(res, err);
                              } else {
                                
                              }
                            });
                          } else {
                            await addAddressBookCustomer(reqContactData, async(err: any, response5: any) => {
                              if (err) {
                                return ErrorEmptyResponse(res, err);
                              } else {
                                
                              }
                            });
                          }
                        }
                      });
                    }
                  }
                });
                
                await sleep(70);
              }
              return SuccessResponse(res, "Campaign Scheduled Successsfully", response);
            }
          }
        });
      }
      
    });
    
  } catch (e) {
    glogger("ERR", "Cron", "addAutodialerCampaignBaseNew", e);
    ErrorResponse(res, e);
  }
};

export const getOutgoingCampaignBeta = async (req: Request, res: Response) => {
  try {
    var campaign_name ='';
    var campaign_name_op ='';
    var campaign_description ='';
    var campaign_description_op ='';
    var campaign_type ='';
    var campaign_type_op ='';
    
    if (req.body.filterList) {
      var filterData = req.body.filterList;
      for (let data of filterData) {
        if(data["name"] =="campaign_name"){
          campaign_name = data["val"];
          campaign_name_op = data["op"];
        }

        if(data["name"] == "campaign_description"){
          campaign_description = data["val"];
          campaign_description_op = data["op"];
        }

        if(data["name"] == "campaign_type"){
          campaign_type = data["val"];
          campaign_type_op = data["op"];
        }
      }
    }

    let reqData: any = {
      smeId: parseInt(req.params.id),
      campaignName: campaign_name,
      campaignName_op: campaign_name_op,
      campaignDescription: campaign_description,
      campaignDescription_op: campaign_description_op,
      campaignType: campaign_type,
      campaignType_op: campaign_type_op,
      initialRecord: req.body.initialRecord ? req.body.initialRecord : 1,
      batchSize: req.body.batchSize ? req.body.batchSize : 60,
    };
    await getOutgoingCampaignBetaData(reqData, (err: any, response: any) => {
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

export const getCampaignBetaAssignedAgents = async (req: Request, res: Response) => {
  try {

    let reqData: any = {
      smeId: parseInt(req.params.id),
      campaignId: req.body.campaignId ? req.body.campaignId : 0,
      initialRecord: req.body.initialRecord ? req.body.initialRecord : 1,
      batchSize: req.body.batchSize ? req.body.batchSize : 60,
    };

    await getOutgoingCampaignBetaData(reqData, async(err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if(response.length > 0){
          let reqData1: any = {
            "assignedAgents": JSON.parse(response[0]["assigned_agents"]),
          }
          await getCampaignAssignedAgentsData(reqData, reqData1, async(err: any, response1: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Successfully listed", response1);
            }
          });
        }
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

async function sleep(ms: any) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}