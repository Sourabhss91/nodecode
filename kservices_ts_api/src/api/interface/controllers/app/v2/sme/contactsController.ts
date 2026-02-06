import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, SuccessResponseWithCount, userExistsError } from "../../../../../helpers/apiResponse";
import { FindAddressbookDetail, checkAddressBookCustomerExist, addAddressBookCustomer, updateAddressBookCustomer, totalContactsRecordList, addCustomerNoteData } from "../../../../../domain/models/v2/sme.model";
import { env } from '../../../../../../infrastructure/env';

export const getAddressbookDetail = async (req: Request, res: Response) => {
  try {

    var g_agentId = "";
    var companyName = "";
    var companyName_op = "";
    var customerName = "";
    var customerName_op = "";
    var customerNumber = "";
    var customerNumber_op = "";
    var searchLeads='';
    var searchLeads_op='';
    var searchLeads_category='';

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

        if(data["name"] =="searchLeads"){
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
    await FindAddressbookDetail(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          return SuccessResponseWithCount(res, "Successfully listed", response, 0);
        } else {
          return SuccessResponseWithCount(res, "Successfully listed", response, 0);
        }
      }
    });
  } catch (e) {
    logger.error(e);
    if(env.NODE_ENV_ERROR_LOG == "yes"){
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
    await checkAddressBookCustomerExist(reqData, (err: any, response: any) => {
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
    });
  } catch (e) {
    logger.error(e);
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    ErrorResponse(res, e);
  }
};

export const addNewCustomer = async (req: Request, res: Response) => {
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
    };

    await checkAddressBookCustomerExist(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response && response.length > 0) {
          return userExistsError(res, "Contact number already exist!");
        } else {
          addAddressBookCustomer(reqData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Customer added successfully", response);
            }
          });
        }
      }
    });
  } catch (e) {
    logger.error(e);
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    ErrorResponse(res, e);
  }
};

export const addCustomerNote = async (req: Request, res: Response) => {
  try {
    
    var created_by = 0;
    if(req.body.agentId) {
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
      insertDateTime : req.body.insertDateTime,
      mode : req.body.callMode ? req.body.callMode : ""
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
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    ErrorResponse(res, e);
  }
};
