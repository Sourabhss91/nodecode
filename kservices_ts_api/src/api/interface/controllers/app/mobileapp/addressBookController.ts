import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse,userExistsError } from "../../../../helpers/apiResponse";
import { DeleteAgentAddressBook,FindCustomerBook, UpdateAddressBookCustomername,InsertAddressBookCustomername ,FindAddressbookList, FindSingleAddressbook, checkEmailExistAddressBook, FindAddressbookListNew} from "../../../../domain/models/mobileapp.model";
import { deleteAddressBookRequest,setCustomerNameRequest,getAddressbookListRequest,FetchAddressbookRequest, getAddressbookListRequestNew } from "../../../../domain/entities/mobileapp.entity";
import { env } from '../../../../../infrastructure/env';

/**
 * get settings.
 *
 * @returns {Object}
 */
 export const deleteAddressbook = async (req: Request, res: Response) => {
    try {
      let reqData: deleteAddressBookRequest = {
        id: parseInt(req.params.id),
        addressBookId: parseInt(req.body.addressBookId),
      };
      await DeleteAgentAddressBook(reqData, (err: any, response: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          return SuccessResponse(res, "Successfully deleted", response);
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

   export const setCustomerName = async (req: Request, res: Response) => {
    try {
      let where: any = {
        agent_id: req.params.id,
        sme_id: req.body.smeId,
        customer_name: req.body.customerName,
        customer_number: req.body.customerNumber,
        created_by: req.params.id,
        company_name: req.body.companyName,
        email_id: req.body.emailId,
        customer_number_secondary: req.body.customerNumberSecondary ? req.body.customerNumberSecondary.join(',') : "",
        mode: req.body.mode ? req.body.mode : 0,
        visibility_flag: req.body.visibilityFlag ? req.body.visibilityFlag : 0,
        insertDateTime : req.body.insertDateTime ? req.body.insertDateTime : '0000:00:00 00:00:00',
        insertdate: 1,
        addressBookId:0,
        status: req.body.status ? req.body.status : 1,
      };

      
      await FindCustomerBook(where, (err: any, response: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          if (response && response.length > 0) {
            return ErrorEmptyResponse(res, " Mobile number already used by another agent.");
          } else {
            checkEmailExistAddressBook(where, (err: any, responseA: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                if ( responseA.length>0 && responseA[0].email_id && responseA[0].email_id !='') {
                  return userExistsError(res, "Email already used by another agent.");
                } else {
                  InsertAddressBookCustomername(where, (err: any, response: any) => {
                    if (err) {
                      return ErrorEmptyResponse(res, err);
                    } else {
                      return SuccessResponse(res, "Contact added successfully", response);
                    }
                  });
                }
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
  

  export const getAddressbookList = async (req: Request, res: Response) => {
    try {
      let reqData: getAddressbookListRequest = {
        id: parseInt(req.params.id),
        sme_id: parseInt(req.body.sme_id)
      };
      await FindAddressbookList(reqData, (err: any, response: any) => {
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

  export const getAddressbookListNew = async (req: Request, res: Response) => {
    try {
      let reqData: getAddressbookListRequestNew = {
        id: parseInt(req.params.id),
        sme_id: parseInt(req.body.sme_id),
        initialRecord: req.body.initialRecord,
        batchSize: req.body.batchSize,
      };
      await FindAddressbookListNew(reqData, (err: any, response: any) => {
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

  export const getAddressbook = async (req: Request, res: Response) => {
    try {
      let reqData: FetchAddressbookRequest = {
        agentId: parseInt(req.params.id),
        addressBookId: parseInt(req.params.addressBookId),
      };
      await FindSingleAddressbook(reqData, (err: any, response: any) => {
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

  export const updateCustomerName = async (req: Request, res: Response) => {
    try {
      let where: any = {
        agent_id: req.params.id,
        sme_id: req.body.smeId,
        customer_name: req.body.customerName,
        addressBookId: req.body.addressBookId,
        company_name: req.body.companyName,
        email_id: req.body.emailId,
        insertDateTime : req.body.insertDateTime ? req.body.insertDateTime : '0000:00:00 00:00:00',
        insertdate: 0,
        customer_number: req.body.customerNumber ? req.body.customerNumber : "",
        visibility_flag: req.body.visibilityFlag ? req.body.visibilityFlag : 0,
        customer_number_secondary : '',
        mode : req.body.mode ? req.body.mode : 0,
        status : req.body.status ? req.body.status : 1,
      };

      await FindCustomerBook(where, (err: any, response: any) => {
        if (err) {
          return ErrorEmptyResponse(res, err);
        } else {
          if (response.length>0 ) {
            UpdateAddressBookCustomername(where, (err: any, response1: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                return SuccessResponse(res, "Successfully updated", response1);
              }
            });
          } else {
            InsertAddressBookCustomername(where, (err: any, response: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                return SuccessResponse(res, "Successfully inserted", response);
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
  
  