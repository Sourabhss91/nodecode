import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../../../../../helpers/apiResponse";
import { getRemarksRequest, setRemarksRequest, fetchListRemarksRequest } from "../../../../../domain/entities/v3/sme.entity";
import { callingCdr } from "../../../../../domain/schema/mongo/callingCdr.schema";
import { glogger } from "../../../../../helpers/logger";

export const getRemarks = async (req: Request, res: Response) => {
  try {
    let reqData: getRemarksRequest = {
      sme_id: parseInt(req.params.id),
      call_direction: req.body.callDirection,
      session_id: req.body.sessionId,
      limit: req.body.limit ? req.body.limit : 1,
    };

    await callingCdr.find({ session_id: reqData["session_id"], sme_id: reqData["sme_id"] }, "remarks").limit(reqData["limit"]).exec(async (err: any, remarksResult: any) => {
      if (err) {
        console.log("ERR", "/sme/" + req.params.id + "/getRemarks", "callingCdr.findOne", err);
        glogger("ERR", "/sme/" + req.params.id + "/getRemarks", "callingCdr.findOne", err);
      } else {
        return SuccessResponse(res, "Successfully listed", remarksResult);
      }
      
    });
  } catch (e) {
    glogger("ERR", "/sme/" + req.params.id + "/getRemarks", "callingCdr.findOne", e);
    ErrorResponse(res, e);
  }
};

export const setRemarks = async (req: Request, res: Response) => {
  try {
    var created_by = 0;
    if (req.body.agentId) {
      created_by = parseInt(req.body.agentId);
    } else {
      created_by = parseInt(req.params.id);
    }
    
    let reqData: setRemarksRequest = {
      sme_id: parseInt(req.params.id),
      call_direction: req.body.callDirection ? req.body.callDirection : "",
      session_id: req.body.sessionId ? req.body.sessionId : "",
      remarks: req.body.remarks,
      customer_number: req.body.customerNumber ? req.body.customerNumber : "",
      created_by: created_by,
      start_date_time: req.body.insertDateTime,
      updated_date_time: req.body.insertDateTime,
    };

    await callingCdr.findOne({ session_id: reqData["session_id"], sme_id: reqData["sme_id"] }).exec(async (err: any, data: any) => {
      if (err) {
        console.log("ERR", "/v3/sme/" + req.params.id + "/setRemarks", "callingCdr.findOne", err);
        glogger("ERR", "/v3/sme/" + req.params.id + "/setRemarks", "callingCdr.findOne", err);
      }
      if (data) {
        await callingCdr
          .updateOne({ session_id: reqData["session_id"], sme_id: reqData["sme_id"] }, { remarks: reqData["remarks"], updated_date_time: reqData["updated_date_time"] })
          .exec((err: any, data: any) => {
            if (err) {
              console.log("ERR", "/sme/" + req.params.id + "/setRemarks", "callingCdr.updateOne", err);
              glogger("ERR", "/sme/" + req.params.id + "/setRemarks", "callingCdr.updateOne", err);
            } else {
              return SuccessResponse(res, "Remarks updated successfully", data);
            }
          });
      } else {
        await callingCdr.create(reqData, async (err: any, data: any) => {
          if (err) {
            console.log("ERR", "/v3/sme/" + req.params.id + "/setRemarks", "callingCdr.create", err);
            glogger("ERR", "/v3/sme/" + req.params.id + "/setRemarks", "callingCdr.create", err);
          } else {
            return SuccessResponse(res, "Remarks added successfully", data);
          }
        });
      }
    });
  } catch (e) {
    glogger("ERR", "/v3/sme/" + req.params.id + "/setRemarks", "catch", e);
    ErrorResponse(res, e);
  }
};

export const getListRemarks = async (req: Request, res: Response) => {
  try {
    let reqData: fetchListRemarksRequest = {
      sme_id: parseInt(req.params.id),
      call_direction: req.body.callDirection ? req.body.callDirection : "",
      customer_number: req.body.customerNumber,
      limit: req.body.limit ? req.body.limit : 5
    };

    await callingCdr.find({ customer_number: reqData["customer_number"], sme_id: reqData["sme_id"] }, "remarks").limit(reqData["limit"]).sort({
      start_date_time: "desc"}).exec(async (err: any, remarksListResult: any) => {
      if (err) {
        console.log("ERR", "/v3/sme/" + req.params.id + "/getListRemarks", "callingCdr.find", err);
        glogger("ERR", "/v3/sme/" + req.params.id + "/getListRemarks", "callingCdr.find", err);
      } else {
        return SuccessResponse(res, "Successfully listed", remarksListResult);
      }
    });
  } catch (e) {
    glogger("ERR", "/v3/sme/" + req.params.id + "/getListRemarks", "callingCdr.find", e);
    ErrorResponse(res, e);
  }
};
