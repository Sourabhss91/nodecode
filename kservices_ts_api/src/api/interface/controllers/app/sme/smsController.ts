import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { randomString } from "../../../../helpers/utility";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../helpers/apiResponse";
//const parse = require('csv-parse');
import {
  FindSmsTemplate,
  addSmstemplate,
  FindSmsCampaign,
  addSmsCampaign,
  FindSmsHeader,
  addSmsHeader,
  UpdateHeaderSms,
  UpdateSmsTemplate,
  deleteSmsTemplate,
  deleteSmsHeader,
  findHeader,
  findTemplate,
  deleteCampaign,
  FindLatInsertCampaign,
  uploadCampaignData,
  UpdateSmsCampaignData,
  getAllSmsPackagesData,
  getSmeSmsPackageData,
  getSmsEndCallEnumData,
  updateSmeSmsNotifyPermission,
  FindEndCallSms,
  addEndCallSMSPermission,
  findEndcallSmsPermissions,
  FindSmsPaymentHistory,
  FindSetting,
  updateSmsEventSmeProfile,
  FindCommSmsSettings,
  updateCommSmsSettings,
  addCommSmsSettings,
  FindtemplateData
} from "../../../../domain/models/sme.model";
import {
  fetchRequest,
  setSmsRequest,
  setSmsCampaignRequest,
  setSmsHeaderRequest,
  deletetemplateFetch,
  deleteHeaderFetch,
  updateHeaderfecth,
  getHeaderTemplateFetch,
  uploadSmsCampaignRequest,
  deleteCampaignFetch
} from "../../../../domain/entities/sme.entity";
import multer from "multer";
import csvtojson from "csvtojson";
import csv, { parseFile } from "fast-csv";
import fs from "fs";
import { parse } from 'csv-parse';
import json2csv from "json2csv";
import path from "path";
import { env } from "../../../../../infrastructure/env";
import { glogger } from "../../../../helpers/logger";
const { format } = require("@fast-csv/format");
const readXlsxFile = require('read-excel-file/node')
let uploadPath = "./upload/";
let displayPath = "/upload/";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath + req.params.id + "/" + req.params.campaign);
  },
  filename: function (req: any, file: any, cb: any) {
    let fileName = req.params.id + "-sms-campaign-real-file" + Date.now() + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});
var requestClient = require('request');

export const getSmsTemplate = async (req: Request, res: Response) => {
  try {
    let reqData: fetchRequest = {
      id: parseInt(req.params.id),
    };
    await FindSmsTemplate(reqData, (err: any, response: any) => {
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

export const setSmsTemplate = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      message_text: req.body.message_text,
      template_id: req.body.template_id,
      principle_id: req.body.principle_id,
      template_name: req.body.template_name,
      unicode: req.body.unicode,
      v_from: req.body.v_from,
      insertDateTime: req.body.insertDateTime,
    };
    await addSmstemplate(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully inserted", response);
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

export const getSmsCampaign = async (req: Request, res: Response) => {
  try {
    let reqData: fetchRequest = {
      id: parseInt(req.params.id),
    };
    await FindSmsCampaign(reqData, (err: any, response: any) => {
      // let dir = path.join(__dirname, './upload/20002002/Qox7Sb')
      // let files = fs.readdirSync(dir) // gives all the files
      // let promises = files.map(file => parseFile(path.join(dir, file))) // gives an array of promises for each file
      // Promise.all(promises).then(console.log)
      // const file = `/upload/20002002/Qox7Sb/20002002-sms-campaign-invalid-file16584788632751658478863275.csv`;
      // console.log(file)
      // res.download(file);
      // var filename = path.basename(file);
      // res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      // res.setHeader('Content-type', 'text/csv');

      // var filestream = fs.createReadStream(file);
      // filestream.pipe(res);

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

// export const setSmsCampaign = async (req: Request, res: Response) => {
//   try {
//     let campaign_id : any = randomString(6);
//     let reqData: setSmsCampaignRequest = {
//         sme_id: parseInt(req.params.id),
//         status : 1,
//         template_id : req.query.template_id,
//         base_file : "",
//         cli :"",
//         base_count : 0,
//         start_time : req.query.start_time,
//         end_time : req.query.end_time,
//         filtered_count : 0,
//         fail_count : 0,
//         invalid_count : 0,
//         campaign_name : req.query.campaign_name,
//         campaign_id : campaign_id,
//         upload_file : "",
//         failed_file : "",
//         filtered_file : "",
//         duplicate_file : "",
//         duplicate_count : 0,
//         invalid_file : "",
//         sucess_count : 0,
//         success_file : "",
//         insertDateTime : req.query.insertDateTime
//     };

//     let dir = uploadPath+req.params.id;
//     if (!fs.existsSync(dir)){
//       await fs.mkdirSync(dir);
//     }

//     let dir1 = uploadPath+req.params.id+"/"+campaign_id;

//     if (!fs.existsSync(dir1)){
//       await fs.mkdirSync(dir1);
//     }

//     let finalUploadPath : string = dir1+"/";
//     console.log(finalUploadPath)
//     req.params.campaign = campaign_id;

//       multer({ storage:storage, fileFilter:function(req,file:any,callback:any){
//         if (file.mimetype == "text/csv") {
//             callback(null, file);
//         }else{
//             callback(null, false);
//             console.log(res,'Only .csv format allowed!');
//         }
//     } }).array('base_file',1)(req,res,function(err){
//         if(err){
//             console.log(err);
//         }else{
//             const contactData: any = [];
//             if(req.files != undefined && req.files.length != 0){
//               let fileUpload:any = req.files;
//               console.log(fileUpload)
//               csvtojson().fromFile(fileUpload[0].path).then(async source => {
//                 let duplicate_file:any=[];
//                 let invalid_file:any=[];
//                 let fail_count:any=[];
//                 let success_file:any=[];

//                 let invalid_file1:any=[];
//                 let success_file1:any=[];

//                 let invalidFileName:any = req.params.id+"-sms-campaign-invalid-file"+ Date.now() + Date.now()+".csv";
//                 let successFileName:any = req.params.id+"-sms-campaign-filtered-file"+ Date.now() + Date.now()+".csv";
//                 let duplicateFileName:any = req.params.id+"-sms-campaign-duplicate-file"+ Date.now() + Date.now()+".csv";

//                 reqData['base_count'] = source.length;
//                 reqData['base_file'] = fileUpload[0].path;
//                 let filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
//                 await source.map(async (contact)=>{

//                   if (filter.test(contact['Contact'])) {
//                     if(contact['Contact'].length==10){
//                       success_file.push(contact['Contact']);
//                     }else{
//                       invalid_file.push(contact['Contact']);
//                     }
//                   }else{
//                     invalid_file.push(contact['Contact']);
//                   }
//                   contactData.push(contact["Contact"]);

//                 })

//                 const toFindDuplicates = (success_file: any[]) => success_file.filter((item:any, index:any) => success_file.indexOf(item) !== index)
//                 const duplicateElementa = toFindDuplicates(success_file);
//                 //let duplicateArray = [...new Set(duplicateElementa)];
//                 reqData['duplicate_count'] = duplicateElementa.length;

//                 success_file = [...new Set(success_file)];

//                 reqData['filtered_count'] = success_file.length;
//                 reqData['invalid_count'] = invalid_file.length;

//                await fs.copyFile(finalUploadPath+fileUpload[0].filename, finalUploadPath+invalidFileName, (err) => {
//                   if (err) throw err;
//                   console.log('source.txt was copied to destination.txt');
//                 });

//                 await fs.copyFile(finalUploadPath+fileUpload[0].filename, finalUploadPath+successFileName, (err) => {
//                   if (err) throw err;
//                   console.log('source.txt was copied to destination.txt');
//                 });

//                 const csvFile = await fs.createWriteStream(finalUploadPath+invalidFileName);
//                 const stream = format({ headers:true });
//                 stream.pipe(csvFile);
//                 for(let j=0; j<invalid_file.length; j++) {
//                   invalid_file1.push({
//                     Contact: invalid_file[j],
//                   });
//                   stream.write(invalid_file1[j]);
//                 }
//                 stream.end();

//                 const csvFile1 = await fs.createWriteStream(finalUploadPath+successFileName);
//                 const stream1 = format({ headers:true });
//                 stream1.pipe(csvFile1);
//                 for(let k=0; k<success_file.length; k++) {
//                   success_file1.push({
//                     Contact: success_file[k],
//                   });
//                   stream1.write(success_file1[k]);
//                 }
//                 stream1.end();

//                 const csvFile2 = await fs.createWriteStream(finalUploadPath+duplicateFileName);
//                 const stream2 = format({ headers:true });
//                 stream2.pipe(csvFile2);
//                 for(let k=0; k<duplicateElementa.length; k++) {
//                   duplicate_file.push({
//                     Contact: duplicateElementa[k],
//                   });
//                   stream2.write(duplicate_file[k]);
//                 }
//                 stream2.end();

//                 reqData['filtered_file'] = finalUploadPath+successFileName;
//                 reqData['invalid_file'] = finalUploadPath+invalidFileName;
//                 reqData['duplicate_file'] = finalUploadPath+duplicateFileName;
//                 console.log(reqData)
//                 await addSmsCampaign(reqData, (err: any, response: any) => {
//                   if (err) {
//                     return ErrorEmptyResponse(res, err);
//                   } else {
//                     return SuccessResponse(res, "Successfully inserted", response);
//                   }
//                 });
//             });

//             }
//         }
//     })

//     // let reqData: setSmsCampaignRequest = {
//     //   //template_id,sme_id,base_file,start_time,end_time,campaign_name
//     //     sme_id: parseInt(req.params.id),
//     //     status : req.body.status,
//     //     template_id : req.body.template_id,
//     //     base_file : req.body.base_file,
//     //     cli : req.body.cli,
//     //     base_count : req.body.base_count,
//     //     insert_date : req.body.insert_date,
//     //     start_time : req.body.start_time,
//     //     end_time : req.body.end_time,
//     //     sucess_count : req.body.sucess_count,
//     //     fail_count : req.body.fail_count,
//     //     invalid_count : req.body.invalid_count,
//     //     campaign_name : req.body.campaign_name,
//     //     campaign_id : req.body.campaign_id,
//     //     upload_file : req.body.upload_file,
//     //     failed_file : req.body.failed_file,
//     //     success_file : req.body.success_file,
//     //     duplicate_file : req.body.duplicate_file,
//     //     invalid_file : req.body.invalid_file,
//     // };
//     // await addSmsCampaign(reqData, (err: any, response: any) => {
//     //   if (err) {
//     //     return ErrorEmptyResponse(res, err);
//     //   } else {
//     //     return SuccessResponse(res, "Successfully inserted", response);
//     //   }
//     // });
//   } catch (e) {
//     logger.error(e);
//     ErrorResponse(res, e);
//   }
// };

export const updateCampaign = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.smeId),
      lastInsertedId: req.body.lastInsertedId,
      campaign_message: req.body.campaignMessage ? req.body.campaignMessage : "",
      principal_id: req.body.principal_id,
      header_id: req.body.header,
      campaign_type: req.body.type,
      campaign_name: req.body.name,
      template_id: req.body.templateLabel,
      fomrStep: req.body.fomrStep ? req.body.fomrStep : "step1",
    };
    await UpdateSmsCampaignData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully inserted", response);
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const setSmsCampaign = async (req: Request, res: Response) => {
  try {
    let reqData: setSmsCampaignRequest = {
      sme_id: parseInt(req.params.id),
      template_id: req.body.templateLabel,
      base_file: "",
      cli: "",
      base_count: 0,
      start_time: req.body.insertDateTime,
      end_time: req.body.insertDateTime,
      filtered_count: 0,
      fail_count: 0,
      invalid_count: 0,
      campaign_name: req.body.name,
      upload_file: "",
      failed_file: "",
      filtered_file: "",
      duplicate_file: "",
      duplicate_count: 0,
      invalid_file: "",
      sucess_count: 0,
      success_file: "",
      campaign_message: req.body.campaignMessage ? req.body.campaignMessage : "",
      principal_id: req.body.principal_id,
      header_id: req.body.header,
      campaign_type: req.body.type,
      insertDateTime: req.body.insertDateTime,
    };
    console.log(reqData);

    await addSmsCampaign(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        var LastInsertedId = response[0];
        let regId: any = {
          LastInsertedId: LastInsertedId,
        };
        console.log(LastInsertedId);
        FindLatInsertCampaign(regId, (err: any, responseD: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
            console.log(responseD);
            return SuccessResponse(res, "Successfully inserted", responseD);
          }
        });
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const uploadCampaign = async (req: Request, res: Response) => {
  try {
    let campaign_id: any = parseInt(req.params.campaignId);
    let reqData: uploadSmsCampaignRequest = {
      base_file: "",
      base_count: 0,
      filtered_count: 0,
      fail_count: 0,
      invalid_count: 0,
      campaign_id: campaign_id,
      failed_file: "",
      filtered_file: "",
      duplicate_file: "",
      duplicate_count: 0,
      invalid_file: "",
      LastInsertedId: parseInt(req.params.campaignId),
      campaignSelect: 0,
    };

    let dir = uploadPath + req.params.id;
    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir);
    }

    let dir1 = uploadPath + req.params.id + "/" + campaign_id;

    if (!fs.existsSync(dir1)) {
      await fs.mkdirSync(dir1);
    }

    let finalUploadPath: string = dir1 + "/";
    console.log(finalUploadPath);
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
        if (req.files != undefined && req.files.length != 0) {
          let fileUpload: any = req.files;
          console.log(fileUpload);
          csvtojson()
            .fromFile(fileUpload[0].path)
            .then(async (source) => {
              let duplicate_file: any = [];
              let invalid_file: any = [];
              let fail_count: any = [];
              let success_file: any = [];

              let invalid_file1: any = [];
              let success_file1: any = [];

              let invalidFileName: any = req.params.id + "-sms-campaign-invalid-file" + Date.now() + Date.now() + ".csv";
              let successFileName: any = req.params.id + "-sms-campaign-filtered-file" + Date.now() + Date.now() + ".csv";
              let duplicateFileName: any = req.params.id + "-sms-campaign-duplicate-file" + Date.now() + Date.now() + ".csv";

              reqData["base_count"] = source.length;
              reqData["base_file"] = fileUpload[0].path;
              let filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;

              await source.map(async (contact) => {
                if (filter.test(contact["Contact"])) {
                  if (contact["Contact"].length == 10) {
                    success_file.push(contact["Contact"]);
                  } else {
                    invalid_file.push(contact["Contact"]);
                  }
                } else {
                  invalid_file.push(contact["Contact"]);
                }
                contactData.push(contact["Contact"]);

                console.log(success_file);
              });

              const toFindDuplicates = (success_file: any[]) => success_file.filter((item: any, index: any) => success_file.indexOf(item) !== index);
              const duplicateElementa = toFindDuplicates(success_file);
              //let duplicateArray = [...new Set(duplicateElementa)];
              reqData["duplicate_count"] = duplicateElementa.length;

              success_file = [...new Set(success_file)];

              reqData["filtered_count"] = success_file.length;
              reqData["invalid_count"] = invalid_file.length;

              await fs.copyFile(finalUploadPath + fileUpload[0].filename, finalUploadPath + invalidFileName, (err) => {
                if (err) throw err;
                console.log("source.txt was copied to destination.txt");
              });

              await fs.copyFile(finalUploadPath + fileUpload[0].filename, finalUploadPath + successFileName, (err) => {
                if (err) throw err;
                console.log("source.txt was copied to destination.txt");
              });

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
              console.log(reqData);

              await uploadCampaignData(reqData, (err: any, response: any) => {
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

export const uploadCampaignSheet = async (req: Request, res: Response) => {
  try {
    let campaign_id: any = parseInt(req.params.campaignId);
    let headers: any = (req.query.csvHeaders != undefined) ? (req.query.csvHeaders as string).split(",") : [];
    let reqData: uploadSmsCampaignRequest = {

      base_file: "",
      base_count: 0,
      filtered_count: 0,
      fail_count: 0,
      invalid_count: 0,
      campaign_id: campaign_id,
      failed_file: "",
      filtered_file: "",
      duplicate_file: "",
      duplicate_count: 0,
      invalid_file: "",
      LastInsertedId: parseInt(req.params.id),
      campaignSelect: 0
    };

    let dir = uploadPath + req.params.id;
    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir);
    }

    let dir1 = uploadPath + req.params.id + "/" + campaign_id;

    if (!fs.existsSync(dir1)) {
      await fs.mkdirSync(dir1);
    }

    let finalUploadPath: string = dir1 + "/";
    //console.log(finalUploadPath)
    req.params.campaign = campaign_id;

    multer({
      storage: storage, fileFilter: function (req, file: any, callback: any) {
        console.log('file.mimetype', file.mimetype)
        //if (file.mimetype == "text/excel") {
        callback(null, file);
        // }else{
        //     callback(true, false);
        //     console.log('Only .excel format allowed!');
        // }
      }
    }).array('base_file', 1)(req, res, function (err) {
      if (err) {
        //console.log(err);
        return ErrorEmptyResponse(res, 'Only .excel format allowed!');
      } else {
        const contactData: any = [];
        if (req.files != undefined && req.files.length != 0) {
          let fileUpload: any = req.files;
          readXlsxFile(fileUpload[0].path).then(async (rows: any) => {
            let campaignCalls: any = [];

            if (rows[0] != undefined) {
              console.log('rows', rows)
              console.log('rows', rows.length)
              if (rows[0].length > 0) {

                let duplicate_file: any = [];
                let invalid_file: any = [];
                let fail_count: any = [];
                let success_file: any = [];

                let invalid_file1: any = [];
                let success_file1: any = [];

                let invalidFileName: any = req.params.id + "-sms-campaign-invalid-file" + Date.now() + Date.now() + ".csv";
                let successFileName: any = req.params.id + "-sms-campaign-filtered-file" + Date.now() + Date.now() + ".csv";
                let duplicateFileName: any = req.params.id + "-sms-campaign-duplicate-file" + Date.now() + Date.now() + ".csv";

                reqData['base_count'] = rows.length;
                reqData['base_file'] = fileUpload[0].path;
                let filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;


                await rows.forEach(async (contact: any) => {

                  if (filter.test(contact[0])) {
                    if (contact[0].toString().length == 10) {
                      success_file.push(contact[0]);
                    } else {
                      invalid_file.push(contact[0]);
                    }
                  } else {
                    invalid_file.push(contact[0]);
                  }
                  contactData.push(contact[0]);
                })

                console.log('success_file', success_file);
                console.log('invalid_file', invalid_file);

                const toFindDuplicates = (success_file: any[]) => success_file.filter((item: any, index: any) => success_file.indexOf(item) !== index)
                const duplicateElementa = toFindDuplicates(success_file);
                //let duplicateArray = [...new Set(duplicateElementa)];
                reqData['duplicate_count'] = duplicateElementa.length;

                success_file = [...new Set(success_file)];

                reqData['filtered_count'] = success_file.length;
                reqData['invalid_count'] = invalid_file.length;



                await fs.copyFile(finalUploadPath + fileUpload[0].filename, finalUploadPath + invalidFileName, (err) => {
                  if (err) throw err;
                  console.log('source.txt was copied to destination.txt');
                });

                await fs.copyFile(finalUploadPath + fileUpload[0].filename, finalUploadPath + successFileName, (err) => {
                  if (err) throw err;
                  console.log('source.txt was copied to destination.txt');
                });

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

                reqData['filtered_file'] = finalUploadPath + successFileName;
                reqData['invalid_file'] = finalUploadPath + invalidFileName;
                reqData['duplicate_file'] = finalUploadPath + duplicateFileName;
                console.log(reqData)



                await uploadCampaignData(reqData, (err: any, response: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    return SuccessResponse(res, "Successfully inserted", reqData);
                  }
                });

              }
            }
            // rows.forEach((row:any) => {

            //   let tutorial = {
            //     'contacts': row[0],
            //     "name": row[1],
            //     "address": row[2],
            //   };

            //   campaignCalls.push(tutorial);
            // });
            // console.log('campaignCalls',campaignCalls)

          })

        }
      }
    })


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

export const uploadCampaignSheetAll = async (req: Request, res: Response) => {
  try {
    let campaign_id: any = parseInt(req.params.campaignId);
    let reqData: uploadSmsCampaignRequest = {

      base_file: "",
      base_count: 0,
      filtered_count: 0,
      fail_count: 0,
      invalid_count: 0,
      campaign_id: campaign_id,
      failed_file: "",
      filtered_file: "",
      duplicate_file: "",
      duplicate_count: 0,
      invalid_file: "",
      LastInsertedId: parseInt(req.params.campaignId),
      campaignSelect: 0,
    };

    let dir = uploadPath + req.params.id;
    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir);
    }

    let dir1 = uploadPath + req.params.id + "/" + campaign_id;

    if (!fs.existsSync(dir1)) {
      await fs.mkdirSync(dir1);
    }

    let finalUploadPath: string = dir1 + "/";
    //console.log(finalUploadPath)
    req.params.campaign = campaign_id;

    multer({
      storage: storage, fileFilter: function (req, file: any, callback: any) {
        console.log('file.mimetype', file.mimetype)
        //if (file.mimetype == "text/excel") {
        callback(null, file);
        // }else{
        //     callback(true, false);
        //     console.log('Only .excel format allowed!');
        // }
      }
    }).array('base_file', 1)(req, res, function (err) {
      if (err) {
        //console.log(err);
        return ErrorEmptyResponse(res, 'Only .excel format allowed!');
      } else {
        const contactData: any = [];
        if (req.files != undefined && req.files.length != 0) {
          let fileUpload: any = req.files;

          if (fileUpload[0].mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            readXlsxFile(fileUpload[0].path).then(async (rows: any) => {
              let campaignCalls: any = [];

              if (rows[0] != undefined) {
                console.log('rows', rows)
                console.log('rows', rows.length)
                if (rows[0].length > 0) {

                  let duplicate_file: any = [];
                  let invalid_file: any = [];
                  let fail_count: any = [];
                  let success_file: any = [];

                  let invalid_file1: any = [];
                  let success_file1: any = [];

                  let invalidFileName: any = req.params.id + "-sms-campaign-invalid-file" + Date.now() + Date.now() + ".json";
                  let successFileName: any = req.params.id + "-sms-campaign-filtered-file" + Date.now() + Date.now() + ".json";
                  let duplicateFileName: any = req.params.id + "-sms-campaign-duplicate-file" + Date.now() + Date.now() + ".json";

                  reqData['base_count'] = rows.length;
                  reqData['base_file'] = fileUpload[0].path;
                  let filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;


                  await rows.forEach(async (contact: any) => {

                    if (filter.test(contact[0])) {
                      if (contact[0].toString().length == 10) {
                        success_file.push(contact[0]);
                      } else {
                        invalid_file.push(contact[0]);
                      }
                    } else {
                      invalid_file.push(contact[0]);
                    }
                    contactData.push(contact[0]);
                  })

                  console.log('success_file', success_file);
                  console.log('invalid_file', invalid_file);

                  const toFindDuplicates = (success_file: any[]) => success_file.filter((item: any, index: any) => success_file.indexOf(item) !== index)
                  const duplicateElementa = toFindDuplicates(success_file);
                  //let duplicateArray = [...new Set(duplicateElementa)];
                  reqData['duplicate_count'] = duplicateElementa.length;

                  success_file = [...new Set(success_file)];

                  reqData['filtered_count'] = success_file.length;
                  reqData['invalid_count'] = invalid_file.length;

                  let successJson: any = [];
                  let invalidJson: any = [];
                  let duplicateJson: any = [];
                  let rowArr: any = [];
                  /** success file generate */
                  for (let j = 0; j < success_file.length; j++) {
                    for (let i = 0; i < rows.length; i++) {
                      if (success_file[j] == rows[i][0]) {
                        successJson.push(rows[i]);
                      }

                    }
                  }
                  successJson = successJson.filter((value: any, index: any, self: any) =>
                    index === self.findIndex((t: any) => (
                      t[0] === value[0]
                    ))
                  )

                  fs.writeFile(finalUploadPath + successFileName, JSON.stringify(successJson), function (err) {
                    if (err) throw err;
                    console.log('complete');
                  }
                  );

                  /** invalid file generate */
                  for (let j = 0; j < invalid_file.length; j++) {
                    for (let i = 0; i < rows.length; i++) {
                      if (invalid_file[j] == rows[i][0]) {
                        invalidJson.push(rows[i]);
                      }

                    }
                  }
                  fs.writeFile(finalUploadPath + invalidFileName, JSON.stringify(invalidJson), function (err) {
                    if (err) throw err;
                    console.log('complete');
                  }
                  );

                  /** duplicate file generate */
                  for (let j = 0; j < duplicateElementa.length; j++) {
                    for (let i = 0; i < rows.length; i++) {
                      if (duplicateElementa[j] == rows[i][0]) {
                        duplicateJson.push(rows[i]);
                      }

                    }
                  }
                  fs.writeFile(finalUploadPath + duplicateFileName, JSON.stringify(duplicateJson), function (err) {
                    if (err) throw err;
                    console.log('complete');
                  }
                  );


                  reqData['filtered_file'] = finalUploadPath + successFileName;
                  reqData['invalid_file'] = finalUploadPath + invalidFileName;
                  reqData['duplicate_file'] = finalUploadPath + duplicateFileName;
                  console.log(reqData)



                  await uploadCampaignData(reqData, (err: any, response: any) => {
                    if (err) {
                      return ErrorEmptyResponse(res, err);
                    } else {
                      return SuccessResponse(res, "Successfully inserted", reqData);
                    }
                  });

                }
              }
            })
          } else {
            console.log('fileUpload', fileUpload[0].mimetype)
            csvtojson()
              .fromFile(fileUpload[0].path)
              .then(async (source) => {
                let duplicate_file: any = [];
                let invalid_file: any = [];
                let fail_count: any = [];
                let success_file: any = [];

                let invalid_file1: any = [];
                let success_file1: any = [];

                let invalidFileName: any = req.params.id + "-sms-campaign-invalid-file" + Date.now() + Date.now() + ".json";
                let successFileName: any = req.params.id + "-sms-campaign-filtered-file" + Date.now() + Date.now() + ".json";
                let duplicateFileName: any = req.params.id + "-sms-campaign-duplicate-file" + Date.now() + Date.now() + ".json";

                reqData["base_count"] = source.length;
                reqData["base_file"] = fileUpload[0].path;
                let filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
                let rows: any = [];

                fs.createReadStream(fileUpload[0].path)
                  .pipe(parse({ delimiter: ',', from_line: 2 }))
                  .on('data', (row: any) => {
                    rows.push(row);
                  }).on("end", () => {

                    rows.forEach(async (contact: any) => {

                      if (filter.test(contact[0])) {
                        if (contact[0].toString().length == 10) {
                          success_file.push(contact[0]);
                        } else {
                          invalid_file.push(contact[0]);
                        }
                      } else {
                        invalid_file.push(contact[0]);
                      }
                      contactData.push(contact[0]);
                    })

                    console.log('success_file', success_file);
                    console.log('invalid_file', invalid_file);

                    const toFindDuplicates = (success_file: any[]) => success_file.filter((item: any, index: any) => success_file.indexOf(item) !== index)
                    const duplicateElementa = toFindDuplicates(success_file);
                    //let duplicateArray = [...new Set(duplicateElementa)];
                    reqData['duplicate_count'] = duplicateElementa.length;

                    success_file = [...new Set(success_file)];

                    reqData['filtered_count'] = success_file.length;
                    reqData['invalid_count'] = invalid_file.length;

                    let successJson: any = [];
                    let invalidJson: any = [];
                    let duplicateJson: any = [];
                    let rowArr: any = [];
                    /** success file generate */
                    for (let j = 0; j < success_file.length; j++) {
                      for (let i = 0; i < rows.length; i++) {
                        if (success_file[j] == rows[i][0]) {
                          successJson.push(rows[i]);
                        }

                      }
                    }
                    successJson = successJson.filter((value: any, index: any, self: any) =>
                      index === self.findIndex((t: any) => (
                        t[0] === value[0]
                      ))
                    )

                    fs.writeFile(finalUploadPath + successFileName, JSON.stringify(successJson), function (err) {
                      if (err) throw err;
                      console.log('complete');
                    }
                    );

                    /** invalid file generate */
                    for (let j = 0; j < invalid_file.length; j++) {
                      for (let i = 0; i < rows.length; i++) {
                        if (invalid_file[j] == rows[i][0]) {
                          invalidJson.push(rows[i]);
                        }

                      }
                    }
                    fs.writeFile(finalUploadPath + invalidFileName, JSON.stringify(invalidJson), function (err) {
                      if (err) throw err;
                      console.log('complete');
                    }
                    );

                    /** duplicate file generate */
                    for (let j = 0; j < duplicateElementa.length; j++) {
                      for (let i = 0; i < rows.length; i++) {
                        if (duplicateElementa[j] == rows[i][0]) {
                          duplicateJson.push(rows[i]);
                        }

                      }
                    }
                    fs.writeFile(finalUploadPath + duplicateFileName, JSON.stringify(duplicateJson), function (err) {
                      if (err) throw err;
                      console.log('complete');
                    }
                    );


                    reqData['filtered_file'] = finalUploadPath + successFileName;
                    reqData['invalid_file'] = finalUploadPath + invalidFileName;
                    reqData['duplicate_file'] = finalUploadPath + duplicateFileName;
                    console.log(reqData)



                    uploadCampaignData(reqData, (err: any, response: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        return SuccessResponse(res, "Successfully inserted", reqData);
                      }
                    });


                  });

                // await source.map(async (contact) => {
                //   if (filter.test(contact["Contact"])) {
                //     if (contact["Contact"].length == 10) {
                //       success_file.push(contact["Contact"]);
                //     } else {
                //       invalid_file.push(contact["Contact"]);
                //     }
                //   } else {
                //     invalid_file.push(contact["Contact"]);
                //   }
                //   contactData.push(contact["Contact"]);

                //console.log(success_file);
                //});
                //console.log('rows',source)
                // const toFindDuplicates = (success_file: any[]) => success_file.filter((item: any, index: any) => success_file.indexOf(item) !== index);
                // const duplicateElementa = toFindDuplicates(success_file);
                //let duplicateArray = [...new Set(duplicateElementa)];
                // reqData["duplicate_count"] = duplicateElementa.length;

                // success_file = [...new Set(success_file)];

                // reqData["filtered_count"] = success_file.length;
                // reqData["invalid_count"] = invalid_file.length;

                // let successJson:any=[];
                // let invalidJson:any=[];
                // let duplicateJson:any=[];
                // let rowArr:any=[];

                /** success file generate */
                //   for(let j=0;j<success_file.length;j++){
                //     for(let i=0;i<source.length;i++){
                //       if(success_file[j] == source[i]['Contact']){
                //         successJson.push(source[i]);
                //       }

                //     }
                //   }
                //   successJson = successJson.filter((value:any, index:any, self:any) =>
                //   index === self.findIndex((t:any) => (
                //     t['Contact'] === value['Contact']
                //   ))
                //   )
                //  fs.writeFile (finalUploadPath+successFileName, JSON.stringify(successJson), function(err) {
                //   if (err) throw err;
                //   console.log('complete');
                //   }
                // );

                /** invalid file generate */
                //   for(let j=0;j<invalid_file.length;j++){
                //     for(let i=0;i<source.length;i++){
                //       if(invalid_file[j] == source[i]['Contact']){
                //         invalidJson.push(source[i]);
                //       }

                //     }
                //   }

                //  fs.writeFile (finalUploadPath+invalidFileName, JSON.stringify(invalidJson), function(err) {
                //   if (err) throw err;
                //   console.log('complete');
                //   }
                // );

                /** duplicate file generate */
                //   for(let j=0;j<duplicateElementa.length;j++){
                //     for(let i=0;i<source.length;i++){
                //       if(duplicateElementa[j] == source[i]['Contact']){
                //         duplicateJson.push(source[i]);
                //       }

                //     }
                //   }
                //  fs.writeFile (finalUploadPath+duplicateFileName, JSON.stringify(duplicateJson), function(err) {
                //   if (err) throw err;
                //   console.log('complete');
                //   }
                // );

                /*await fs.copyFile(finalUploadPath + fileUpload[0].filename, finalUploadPath + invalidFileName, (err) => {
                  if (err) throw err;
                  console.log("source.txt was copied to destination.txt");
                });
  
                await fs.copyFile(finalUploadPath + fileUpload[0].filename, finalUploadPath + successFileName, (err) => {
                  if (err) throw err;
                  console.log("source.txt was copied to destination.txt");
                });*/

                /*const csvFile = await fs.createWriteStream(finalUploadPath + invalidFileName);
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
                stream2.end();*/

                // reqData["filtered_file"] = finalUploadPath + successFileName;
                // reqData["invalid_file"] = finalUploadPath + invalidFileName;
                // reqData["duplicate_file"] = finalUploadPath + duplicateFileName;
                // console.log(reqData);

                // await uploadCampaignData(reqData, (err: any, response: any) => {
                //   if (err) {
                //     return ErrorEmptyResponse(res, err);
                //   } else {
                //     return SuccessResponse(res, "Successfully inserted", reqData);
                //   }
                // });
              });
          }

        }
      }
    })


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

export const getSmsHeader = async (req: Request, res: Response) => {
  try {
    let reqData: fetchRequest = {
      id: parseInt(req.params.id),
    };
    await FindSmsHeader(reqData, (err: any, response: any) => {
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

export const setSmsHeader = async (req: Request, res: Response) => {
  try {
    let reqData: setSmsHeaderRequest = {
      smeId: parseInt(req.params.id),
      status: req.body.status,
      headerName: req.body.header_name,
      type: req.body.type,
      principalId: req.body.principle_id,
      insertDateTime: req.body.insert_date_time,
    };

    await addSmsHeader(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully inserted", response);
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

export const updateSmsHeader = async (req: Request, res: Response) => {
  try {
    let reqData: updateHeaderfecth = {
      smeId: req.body.smeId,
      headerId: parseInt(req.params.id),
      type: req.body.type,
      header_name: req.body.header_name,
      principalId: req.body.principle_id,
    };
    await UpdateHeaderSms(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully inserted", response);
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

export const updateSmsTemplate = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      templateId: parseInt(req.params.id),
      smeId: req.body.smeId,
      message_text: req.body.message_text,
      template_id: req.body.template_id,
      principle_id: req.body.principle_id,
      template_name: req.body.template_name,
      unicode: req.body.unicode,
      v_from: req.body.v_from,
    };
    await UpdateSmsTemplate(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully inserted", response);
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

export const deleteSMSTemplate = async (req: Request, res: Response) => {
  try {
    let reqData: deletetemplateFetch = {
      id: parseInt(req.params.id),
      templateId: req.body.templateId,
    };
    await deleteSmsTemplate(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully deleted", response);
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

export const deleteSmsCampaign = async (req: Request, res: Response) => {
  try {
    let reqData: deleteCampaignFetch = {
      id: parseInt(req.params.id),
      campaignId: req.body.campaignId,
    };
    await deleteCampaign(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully deleted", response);
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const deleteHeader = async (req: Request, res: Response) => {
  try {
    let reqData: deleteHeaderFetch = {
      id: parseInt(req.params.id),
      headerId: req.body.headerId,
    };
    await deleteSmsHeader(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully deleted", response);
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

export const getHeaderList = async (req: Request, res: Response) => {
  try {
    let reqData: getHeaderTemplateFetch = {
      id: parseInt(req.params.id),
      type: req.body.type,
    };
    console.log(reqData);
    await findHeader(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          return SuccessResponse(res, "Successfully listed", response);
        } else {
          return SuccessResponse(res, "Successfully listed", []);
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

export const getTemplateList = async (req: Request, res: Response) => {
  try {
    let reqData: getHeaderTemplateFetch = {
      id: parseInt(req.params.id),
      type: req.body.type,
    };
    await findTemplate(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          return SuccessResponse(res, "Successfully listed", response);
        } else {
          return SuccessResponse(res, "Successfully listed", []);
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

export const uploadCampaignNumbers = async (req: Request, res: Response) => {
  try {
    let campaign_id: any = parseInt(req.params.campaignId);
    let reqData: any = {
      base_file: "",
      base_count: 0,
      filtered_count: 0,
      fail_count: 0,
      invalid_count: 0,
      campaign_id: campaign_id,
      failed_file: "",
      filtered_file: "",
      duplicate_file: "",
      duplicate_count: 0,
      invalid_file: "",
      LastInsertedId: parseInt(req.params.campaignId),
      campaignSelect: req.body.campaignSelect,
    };
    var campagnNumbers = req.body.CustomNumbers;
    var array1 = campagnNumbers.split(/[ ,]+/);
    let dir = uploadPath + req.params.id;
    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir);
    }
    let dir1 = uploadPath + req.params.id + "/" + campaign_id;

    if (!fs.existsSync(dir1)) {
      await fs.mkdirSync(dir1);
    }
    let finalUploadPath: string = dir1 + "/";
    req.params.campaign = campaign_id;
    const contactData: any = [];
    let duplicate_file: any = [];
    let invalid_file: any = [];
    let fail_count: any = [];
    let success_file: any = [];
    let base_file1: any = [];
    let invalid_file1: any = [];
    let success_file1: any = [];
    let invalidFileName: any = req.params.id + "-sms-campaign-invalid-file" + Date.now() + Date.now() + ".json";
    let successFileName: any = req.params.id + "-sms-campaign-filtered-file" + Date.now() + Date.now() + ".json";
    let duplicateFileName: any = req.params.id + "-sms-campaign-duplicate-file" + Date.now() + Date.now() + ".json";

    let baseFileName: any = req.params.id + "-sms-campaign-real-file" + Date.now() + Date.now() + ".json";

    let filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;

    await array1.map(async (contact: any) => {
      if (filter.test(contact)) {
        if (contact.length == 10) {
          success_file.push(contact);
        } else {
          invalid_file.push(contact);
        }
      } else {
        invalid_file.push(contact);
      }
      contactData.push(contact);
    });

    const toFindDuplicates = (success_file: any[]) => success_file.filter((item: any, index: any) => success_file.indexOf(item) !== index);
    const duplicateElementa = toFindDuplicates(success_file);
    //let duplicateArray = [...new Set(duplicateElementa)];
    reqData["duplicate_count"] = duplicateElementa.length;
    success_file = [...new Set(success_file)];

    fs.writeFile(finalUploadPath + successFileName, JSON.stringify(success_file), function (err) {
      if (err) throw err;
      console.log('complete');
    }
    );

    fs.writeFile(finalUploadPath + invalidFileName, JSON.stringify(invalid_file), function (err) {
      if (err) throw err;
      console.log('complete');
    }
    );

    fs.writeFile(finalUploadPath + duplicateFileName, JSON.stringify(duplicate_file), function (err) {
      if (err) throw err;
      console.log('complete');
    }
    );

    fs.writeFile(finalUploadPath + baseFileName, JSON.stringify(array1), function (err) {
      if (err) throw err;
      console.log('complete');
    }
    );
    reqData["filtered_count"] = success_file.length;
    reqData["invalid_count"] = invalid_file.length;
    reqData["base_count"] = array1.length;

    reqData["filtered_file"] = finalUploadPath + successFileName;
    reqData["invalid_file"] = finalUploadPath + invalidFileName;
    reqData["duplicate_file"] = finalUploadPath + duplicateFileName;
    reqData["base_file"] = finalUploadPath + baseFileName;

    await uploadCampaignData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully inserted", reqData);
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


export const getAllSmsPackages = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
    };
    await getAllSmsPackagesData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          return SuccessResponse(res, "Successfully listed", response);
        } else {
          return SuccessResponse(res, "Successfully listed", []);
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


export const getSmeSmsPackage = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
    };
    await getSmeSmsPackageData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          return SuccessResponse(res, "Successfully listed", response);
        } else {
          return SuccessResponse(res, "Successfully listed", []);
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

export const getSmsEndCallEnum = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
    };
    await getSmsEndCallEnumData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          return SuccessResponse(res, "Successfully listed", response);
        } else {
          return SuccessResponse(res, "Successfully listed", []);
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


export const setSmeSmsNotifyPermission = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      customerFailedMessageId: req.body.customerFailed == true ? req.body.customerFailedMessageId : 0,
      customerSuccessMsgId: req.body.customerAnswer == true ? req.body.customerSuccessMsgId : 0,
      agentFailedMsgId: req.body.agentFailed == true ? req.body.agentFailedMsgId : 0,
      agentAnswerMsgId: req.body.agentAnswer == true ? req.body.agentAnswerMsgId : 0,
      adminFailedMsgId: req.body.adminFailed == true ? req.body.adminFailedMsgId : 0,
      adminSuccessMsgId: req.body.adminSuccess == true ? req.body.adminSuccessMsgId : 0,
      adminabandonedMsgId: req.body.adminabandoned == true ? req.body.adminabandonedMsgId : 0,
      customerFailed: req.body.customerFailed == true ? 1 : 0,
      customerAnswer: req.body.customerAnswer == true ? 1 : 0,
      adminSuccess: req.body.adminSuccess == true ? 1 : 0,
      adminFailed: req.body.adminFailed == true ? 1 : 0,
      agentAnswer: req.body.agentAnswer == true ? 1 : 0,
      agentFailed: req.body.agentFailed == true ? 1 : 0,
      adminabandoned: req.body.adminabandoned == true ? 1 : 0,
    };

    await FindEndCallSms(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          updateSmeSmsNotifyPermission(reqData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Successfully updated!", response);
            }
          });
        } else {
          addEndCallSMSPermission(reqData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              /* find sme live events */
              let reqData2: any = {
                id: parseInt(req.params.id),
              }
              FindSetting(reqData2, (err: any, responseN: any) => {
                if (err) {
                  return ErrorEmptyResponse(res, err);
                } else {
                  if (responseN.length > 0) {
                    var eventsName;
                    var event = 'evt_sendsms_komm';
                    if (responseN[0].live_events == 0 || responseN[0].live_events == '' || responseN[0].live_events == null) {
                      eventsName = event;
                    } else {
                      eventsName = responseN[0].live_events + ',' + event;
                    }
                    let reqData3: any = {
                      SMSEVENT: eventsName,
                      SMEID: parseInt(req.params.id),
                    }
                    updateSmsEventSmeProfile(reqData3, (err: any, responseN: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        return SuccessResponse(res, "Successfully updated!", responseN);
                      }
                    });
                  }
                }
              });
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


export const getEndcallSmsPermission = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
    };
    await findEndcallSmsPermissions(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          return SuccessResponse(res, "Successfully listed", response);
        } else {
          return SuccessResponse(res, "Successfully listed", []);
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


export const getSmsPaymentHistory = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      initialRecord: req.body.initialRecord,
      batchSize: req.body.batchSize
    };
    await FindSmsPaymentHistory(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          return SuccessResponse(res, "Successfully listed", response);
        } else {
          return SuccessResponse(res, "Successfully listed", []);
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

export const setCommSmsSettings = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      url: req.body.url,
      username: req.body.commUsername,
      password: req.body.commPassword,
      insertDateTime: req.body.insertDateTime,
    };

    await FindCommSmsSettings(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
          if( response.length > 0 ){
            updateCommSmsSettings(reqData, (err: any, response2: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                return SuccessResponse(res, "Successfully updated", response2);
              }
            });
          }else{
            addCommSmsSettings(reqData, (err: any, response3: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                return SuccessResponse(res, "Successfully updated", response3);
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


export const sendCommSms = async (req: Request, res: Response) => {
  try {
    var message = req.body.message;
    let reqData: any = {
      smeId: parseInt(req.params.id),
      message: message.replace(/\\n/g, '\n'),
      templateId: req.body.templateId,
      customerNumber: req.body.customerNumber,
    };


    await FindCommSmsSettings(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
          if( response.length > 0 ){
            FindtemplateData(reqData, (err: any, response2: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                var url = "" + response[0].url + "username=" + response[0].commUsername + "&password=" + response[0].commPassword + "&unicode=" + response2[0].unicode + "&from=" + response2[0].v_from + "&to=" + reqData['customerNumber'] + "&text=" + reqData['message'] + "&dltContentId=" + response2[0].dlt_content_id + "&dltPrincipalEntityId=" + response2[0].dlt_principal_id + "";

                if (url != '') {
                  console.log(url)
                  var options = {
                    'method': 'GET',
                    'url': url,
                    'headers': {
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },

                  };
                  requestClient(options, function (error: string | undefined, response: any) {
                    if (error) {
                      glogger('ERR', "0", '/sme/' + req.params.id + '/sendCommSms', "" + url + ", error:" + error);
                      throw new Error(error);
                    }
                    
                    if (response.statusCode == 200) {
                      glogger('DEB', "0", '/sme/' + req.params.id + '/sendCommSms', "" + url + ", success:" + "Successfully");
                      return SuccessResponse(res, "Message sent successfully", []);
                    }
                  });
                }
              }
            });                        
          }else{
            return SuccessResponse(res, "Update Settings", []);
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

export const getCommSmsSettings = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id)
    };

    await FindCommSmsSettings(reqData, (err: any, response: any) => {
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


function dateFormat(date: any): string {
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  var year = date.getFullYear();
  var hour = ("0" + date.getHours()).slice(-2);
  var min = ("0" + date.getMinutes()).slice(-2);
  var seg = ("0" + date.getSeconds()).slice(-2);
  return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + seg;
}
