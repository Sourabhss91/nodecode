import { Request, Response } from "express";
import { logger, loggerFileError } from "../../../../../lib/logger";
import { glogger } from "../../../../../helpers/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, SuccessResponseWithCount, userExistsError } from "../../../../../helpers/apiResponse";
import { FindAddressbookDetail, checkAddressBookCustomerExist, addAddressBookCustomer, updateAddressBookCustomer, addCustomerNoteData } from "../../../../../domain/models/v3/sme.model";
import { addressBook } from "../../../../../domain/schema/mongo/addressBook.schema";
import { env } from "../../../../../../infrastructure/env";

export const getAddressbookDetail = async (req: Request, res: Response) => {
  try {
    var g_agentId = "";
    var companyName = "";
    var companyName_op = "";
    var customerName = "";
    var customerName_op = "";
    var customerNumber = "";
    var customerNumber_op = "";
    var searchLeads = "";
    var searchLeads_op = "";
    var searchLeads_category = "";

    if (req.body.customer_number_primary) {
      customerNumber = req.body.customer_number_primary;
    }

    if (req.body.filterList) {
      var filterData = req.body.filterList;
      for (let data of filterData) {
        if (data["name"] == "agentId") {
          g_agentId = data["val"];
        }

        if (data["name"] == "company_name") {
          companyName = data["val"];
          companyName_op = data["op"];
        }

        if (data["name"] == "customer_name") {
          customerName = data["val"];
          customerName_op = data["op"];
        }
        if (data["name"] == "customer_number_primary") {
          customerNumber = data["val"];
          customerNumber_op = data["op"];
        }

        if (data["name"] == "searchLeads") {
          searchLeads = data["val"];
          searchLeads_op = data["op"];
          searchLeads_category = data["category"];
        }
      }
    }
    let reqData: any = {
      id: parseInt(req.params.id),
      agent_id: g_agentId,
      companyName: companyName,
      companyName_op: companyName_op,
      customerName: customerName,
      customerName_op: customerName_op,
      customer_number: customerNumber,
      customerNumber_op: customerNumber_op,
      initialRecord: req.body.initialRecord,
      batchSize: req.body.batchSize,
      searchLeads: searchLeads,
      searchLeads_op: searchLeads_op,
      searchLeads_category: searchLeads_category,
    };

    addressBook.find({ sme_id: reqData["id"] }).exec((err: any, addressBookResult: any) => {
      if (err) {
      } else {
        return SuccessResponseWithCount(res, "Successfully listed", addressBookResult, 0);
      }
    });
    /*await FindAddressbookDetail(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          return SuccessResponseWithCount(res, "Successfully listed", response, 0);
        } else {
          return SuccessResponseWithCount(res, "Successfully listed", response, 0);
        }
      }
    });*/
  } catch (e) {
    logger.error(e);
    if (env.NODE_ENV_ERROR_LOG == "yes") {
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    ErrorResponse(res, e);
  }
};

export const setAddressbookDetail = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      customer_number: req.body.customer_number_primary.toString().trim(),
      customer_name: req.body.customer_name ? req.body.customer_name : "",
      company_name: req.body.company_name ? req.body.company_name : "",
      email_id: req.body.email_id ? req.body.email_id : "",
      address: req.body.address ? req.body.address : "",
      city: req.body.city ? req.body.city : "",
      created_by: req.body.created_by ? req.body.created_by : 0,
      status: req.body.status ? req.body.status : 1,
      insertDateTime: req.body.insertDateTime,
      id: req.body.id ? req.body.id : "",
    };

    /*await checkAddressBookCustomerExist(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response && response.length > 0) {
          updateAddressBookCustomer(reqData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Successfully Updated", response);
            }
          });
        } else {
          addAddressBookCustomer(reqData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Successfully Added to Blacklist", response);
            }
          });
        }
      }
    });*/

    //MongoDB Process begins
    let reqDataMongo: any = {
      smeId: parseInt(req.params.id),
      customer_number: req.body.customer_number_primary.toString().trim(),
      customer_name: req.body.customer_name ? req.body.customer_name : "",
      company_name: req.body.company_name ? req.body.company_name : "",
      email_id: req.body.email_id ? req.body.email_id : "",
      address: req.body.address ? req.body.address : "",
      city: req.body.city ? req.body.city : "",
      created_by: req.body.created_by ? req.body.created_by : 0,
      status: req.body.status ? req.body.status : 1,
      insert_date_time: req.body.insertDateTime,
      id: req.body.id ? req.body.id : "",
    };
    await addressBook.findOne({ session_id: reqDataMongo["session_id"], sme_id: parseInt(reqDataMongo["sme_id"]) }).exec(async (err: any, data: any) => {
      if (err) {
        console.log("ERR", "/sme/" + req.params.id + "/setAddressbookDetail", "setAddressbookDetail", err);
        glogger("ERR", "/sme/" + req.params.id + "/setAddressbookDetail", "setAddressbookDetail", err);
      }
      if (data) {
        await addressBook
          .updateOne({ session_id: reqDataMongo["session_id"], sme_id: parseInt(reqDataMongo["sme_id"]) }, { remarks: reqDataMongo["remarks"], updated_date_time: reqDataMongo["updated_date_time"] })
          .exec((err: any, data: any) => {
            if (err) {
              console.log("ERR", "/sme/" + req.params.id + "/setAddressbookDetail", "addressBook.updateOne", err);
              glogger("ERR", "/sme/" + req.params.id + "/setAddressbookDetail", "addressBook.updateOne", err);
            } else {
              return SuccessResponse(res, "Successfully updated", data);
            }
          });
      } else {
        await addressBook.create(reqDataMongo, (err: any, data: any) => {
          if (err) {
            console.log("ERR", "/sme/" + req.params.id + "/setAddressbookDetail", "addressBook.create", err);
            glogger("ERR", "/sme/" + req.params.id + "/setAddressbookDetail", "addressBook.create", err);
          } else {
            return SuccessResponse(res, "Successfully inserted", data);
          }
        });
      }
    });
  } catch (e) {
    glogger("ERR", "/sme/" + req.params.id + "/setAddressbookDetail", "catch", e);
    ErrorResponse(res, e);
  }
};

export const addNewCustomer = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      sme_id: parseInt(req.params.id),
      customer_number_primary:
      req.body.customer_number_primary.toString().indexOf("+91") !== -1 ? req.body.customer_number_primary.toString().trim() : "+91" + req.body.customer_number_primary.toString().trim(),
      customer_name: req.body.customer_name ? req.body.customer_name : "",
      company_name: req.body.company_name ? req.body.company_name : "",
      email_id: req.body.email_id ? req.body.email_id : "",
      address: req.body.address ? req.body.address : "",
      city: req.body.city ? req.body.city : "",
      created_by: req.body.created_by ? req.body.created_by : 0,
      status: req.body.status ? req.body.status : 1,
      insert_date_time: req.body.insertDateTime,
    };

    await addressBook.findOne({ customer_number_primary: reqData["customer_number_primary"], sme_id: parseInt(reqData["sme_id"]) }).exec(async (err: any, addressBookResult: any) => {
      if (err) {
        glogger("ERR", "/sme/" + req.params.id + "/addNewCustomer", "addressBookResult", err);
      }
      if (addressBookResult) {
        return userExistsError(res, "Contact number already exist!");
      } else {
        await addressBook.create(reqData, (err: any, addAddressBookResult: any) => {
          if (err) {
            glogger("ERR", "/sme/" + req.params.id + "/addNewCustomer", "addAddressBookResult", err);
          } else {
            return SuccessResponse(res, "Contact added Successfully", addAddressBookResult);
          }
        });
      }
    });
  } catch (e) {
    glogger("ERR", "/sme/" + req.params.id + "/addNewCustomer", "catch", e);
    ErrorResponse(res, e);
  }
};

export const addCustomerNote = async (req: Request, res: Response) => {
  try {
    var created_by = 0;
    if (req.body.agentId) {
      created_by = parseInt(req.body.agentId);
    } else {
      created_by = parseInt(req.params.id);
    }
    let reqData: any = {
      id: parseInt(req.params.id),
      callDirection: req.body.callDirection ? req.body.callDirection : "",
      sessionId: req.body.sessionId ? req.body.sessionId : "",
      remarks: req.body.remarks,
      customerNumber: req.body.customerNumber ? req.body.customerNumber : "",
      createdBy: created_by,
      insertDateTime: req.body.insertDateTime,
      mode: req.body.callMode ? req.body.callMode : "",
    };

    await addCustomerNoteData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Customer note added successfully", response);
      }
    });
  } catch (e) {
    logger.error(e);
    if (env.NODE_ENV_ERROR_LOG == "yes") {
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    ErrorResponse(res, e);
  }
};
