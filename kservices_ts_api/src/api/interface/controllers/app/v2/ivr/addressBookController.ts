import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { FindAddressbook } from "../../../../../domain/models/v2/ivr.model";
import { addressBookRequest } from "../../../../../domain/entities/v2/ivr.entity";
import { env } from '../../../../../../infrastructure/env';
import { glogger } from "../../../../../helpers/logger";

/**
 * get settings. 
 *
 * @returns {Object}
 */

 export const getAddressbook = async (req: Request, res: Response) => {
    try {
      let reqData: addressBookRequest = {
        sme_id: parseInt(req.params.id),
        customerNumber:req.body.customerNumber
      };
      glogger('IMP', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getAddressbook', "API Request Customer No:"+ req.body.customerNumber);
      await FindAddressbook(reqData, (err: any, response: any) => {
        if (err) {
          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getAddressbook', "FindAddressbook, error:"+err);
          return ErrorEmptyResponse(res, err);
        } else {
          glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getAddressbook', "SuccessResponse");
            return SuccessResponse(res, "Successfully listed", response);
          
        }
      });
    } catch (e) {
      glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getAddressbook', "Exception:"+e);
      ErrorResponse(res, e);
    }
  };
 


 
 