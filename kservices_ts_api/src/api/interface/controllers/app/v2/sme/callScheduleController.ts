import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { insertUpdateBulkBaselist, insertBulkCallBaseHistory, changeScheduleStatusData } from "../../../../../domain/models/v2/sme.model";
import { baseListRequest } from "../../../../../domain/entities/v2/sme.entity";
import multer from "multer";
import path from "path";
import { env } from '../../../../../../infrastructure/env';
const readXlsxFile = require("read-excel-file/node");
let uploadPath = "./upload/excel/";
let displayPath = "/upload/excel/";
var dateTime = require("node-datetime");
var dt = dateTime.create();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req: any, file: any, cb: any) {
    let fileName = req.params.id + "-" + Date.now() + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

export const uploadBaseList = async (req: Request, res: Response) => {
  try {
    console.log("req");
    console.log(req);
    multer({
      storage: storage,
      fileFilter: function (req, file: any, callback: any) {
        if (file.mimetype.includes("excel") || file.mimetype.includes("spreadsheetml")) {
          callback(null, true);
        } else {
          callback("Please upload only excel file.", false);
        }
      },
    }).array("excelFile", 1)(req, res, function (err) {
      if (err) {
        console.log(err);
      } else {
        if (req.files != undefined && req.files.length != 0) {
          let fileObj: any = req.files;

          readXlsxFile(fileObj[0].path).then((rows: any) => {
            rows.shift();
            let tutorials: any = [];
            rows.forEach((row: any) => {
              let tutorial = {
                number: row[0],
                description: row[1],
              };
              tutorials.push(tutorial);
            });
            let baseList: any = [];
            let set: any = [];
            let invalid: any = [];
            for (const rowData of tutorials) {
              let mobile = rowData["number"];
              let mobileFilter = mobile != null && mobile.length > 10 ? mobile.substring(mobile.length - 10) : mobile;
              /** check valid mobile number */
              if (/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(mobileFilter)) {
                set.push(mobile);
              } else {
                invalid.push(mobile);
              }
            }

            const uniqueArray = Array.from(new Set(set));
            const setNumber = new Set(set);
            const duplicates = set.filter((item: unknown) => {
              if (setNumber.has(item)) {
                setNumber.delete(item);
                return;
              } else {
                return item;
              }
            });

            let encodeData: any = {
              date: dt.now(),
              duplicateCount: duplicates.length,
              duplicateSet: duplicates,
              fileName: fileObj[0].path,
              invalidCount: invalid.length,
              invalidSet: invalid,
              totalCount: set.length,
              uploadedCound: set.length,
            };
            let callbaseHistroyPayload: any = {
              sme_id: req.params.id,
              insert_time: dt.format("Y-m-d H:M:S"),
              data: JSON.stringify(encodeData),
            };
            insertBulkCallBaseHistory(callbaseHistroyPayload, (err: any, data: any) => {});
          });
        }
      }
    });

    var agentIds = req.body;
    for (let data of agentIds) {
      let where: baseListRequest = {
        sme_id: parseInt(req.params.id),
        mobile: req.params.countryCode + data["mobile"],
        desc: data["desc"],
        agentId: data["agentId"],
        insertDateTime: data["insertDateTime"],
      };

      insertUpdateBulkBaselist(where, (err: any, response: any) => {});
    }
    return SuccessResponse(res, "Successfully", {});
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


export const changeScheduleStatus = async (req: Request, res: Response) => {
  try {

    let reqData: any = {
      smeId: parseInt(req.params.id) ? parseInt(req.params.id) : 0,
      scheduleId: req.body.scheduleId ? req.body.scheduleId : 0 ,
      status: req.body.status ? req.body.status : 0 ,
    };
    await changeScheduleStatusData(reqData, async(err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Schedule status updated successfully", response);
      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};
