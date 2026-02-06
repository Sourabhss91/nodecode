import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { FindCustomerBook, UpdateAddressBookCustomername, UpdateUniqueCustomername, UpdateIncomingCustomername, UpdateOutgoingCustomername,InsertAddressBookCustomername,UpdateAddressBookReturnUpdateRow } from "../../../../../domain/models/v2/sme.model";
import { fetchRequest } from "../../../../../domain/entities/v2/sme.entity";
import { env } from '../../../../../../infrastructure/env';

/**
 * get settings.
 *
 * @returns {Object}
 */

export const setCustomerName = async (req: Request, res: Response) => {
  try {

    var created_by = "";
    if (req.body.agentId) {
      created_by = req.body.agentId;
    } else {
      created_by = req.params.id;
    }

    let where: any = {
      smeId: req.params.id,
      customerName: req.body.customerName,
      customerNumber: req.body.customerNumber,
      agentNumber: req.body.agentNumber,
      createdBy: created_by,
      insertDateTime : req.body.insertDateTime,
      status: 1
    };
    
    await FindCustomerBook(where, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response && response.length > 0) {
          UpdateAddressBookCustomername(where, (err: any, response1: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              let updateRow :any ={};
              if(response[0]['customer_name'] != req.body.customerName){
                updateRow['customer_name']=req.body.customerName;
              }
              return SuccessResponse(res, "Successfully updated", updateRow);
            }
          });
        } else {
          InsertAddressBookCustomername(where, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
               return SuccessResponse(res, "Successfully inserted", {});
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

export const getCustomerName = async (req: Request, res: Response) => {
  try {

    let where: any = {
      smeId: req.params.id,
      customerNumber: req.body.customerNumber,
    };
    
    await FindCustomerBook(where, (err: any, response: any) => {
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
