import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { insertUpdateBulkCity } from "../../../../../domain/models/v3/sme.model";
import { env } from '../../../../../../infrastructure/env';

/**
 * get settings.
 *
 * @returns {Object}
 */

export const setCities = async (req: Request, res: Response) => {
  try {
    var cities = req.body.List;
    for (let city of cities) {
      let reqData: any = {
        sme_id: city["smeId"],
        status: city["status"],
        city_id: city["cityId"],
      };

      let where: any = {
        sme_id: city["smeId"],
        city_id: city["cityId"]
      };

      await insertUpdateBulkCity(reqData, where, (err: any, response: any) => {});
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
