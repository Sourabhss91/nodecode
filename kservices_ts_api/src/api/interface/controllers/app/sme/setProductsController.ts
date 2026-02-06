import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../helpers/apiResponse";
import { insertUpdateBulkProducts, insertProduct } from "../../../../domain/models/sme.model";
import { env } from '../../../../../infrastructure/env';

/**
 * get settings.
 *
 * @returns {Object}
 */

export const setProducts = async (req: Request, res: Response) => {
  try {
    var Products = req.body.productList;
    for (let product of Products) {
      let reqData: any = {
        sme_id: product["smeId"],
        status: product["status"],
        product_name: product["productName"],
      };
      
      if(product["id"] !== undefined && product["id"] ) {
        let where: any = {
          sme_id: product["smeId"],
          id: product["id"]
        };
        
        await insertUpdateBulkProducts(reqData, where, (err: any, response: any) => {});
      } else {
        await insertProduct(reqData, (err: any, response: any) => {});
      }
    
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
