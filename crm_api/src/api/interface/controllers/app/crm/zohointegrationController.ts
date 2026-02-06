import { Request, Response } from "express";
import { logger } from "../../../../lib/logger";
import { ErrorResponse, ErrorResWithSuccess, SuccessResponse, ErrorEmptyResponse, notFoundResponse } from "../../../../helpers/apiResponse";
import { FindAgentSummary,findagentDayWiseSummary } from "../../../../domain/models/crm.model";
import { addClickToCallRequest } from "../../../../domain/entities/crm.entity";
import { convertTimeZone, getNumberOfDays } from "../../../../helpers/utility";
import { glogger } from "../../../../helpers/logger";

var requestClient = require('request');
/**
 * get settings.
 *
 * @returns {Object}
 */



export const clicktodial = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    console.log(req.body);
    return SuccessResponse(res, "Successfully Scheduled", req.body);
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};





