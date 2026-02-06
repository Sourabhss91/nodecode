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



export const agentSummary = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      sme_id: parseInt(req.params.id),
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      agentNumber: req.body.agentNumber ? req.body.agentNumber : 0
    };


    var a = req.body.startDate;
    var b = req.body.endDate;

    var dateDiffrence = getNumberOfDays(a, b);
    if (dateDiffrence > 30) {
      glogger('ERR', "" + req.body.agentNumber + "", '/kcrm/' + req.params.id + '/agent/summary', "FindAgentSummary, error:" + 'Please limit the date range to 30 days');
      return ErrorEmptyResponse(res, 'Please limit the date range to 30 days');
    }

    FindAgentSummary(reqData, (err: any, response: any) => {
      if (err) {
        glogger('ERR', "" + req.body.agentNumber + "", '/kcrm/' + req.params.id + '/agent/summary', "FindAgentSummary, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Scheduled", response);
      }
    });

  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};


export const agentDayWiseSummary = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      sme_id: parseInt(req.params.id),
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      agentNumber: req.body.agentNumber
    };
    var a = req.body.startDate;
    var b = req.body.endDate;

    var dateDiffrence = getNumberOfDays(a, b);
    if (dateDiffrence > 30) {
      return ErrorEmptyResponse(res, 'Please limit the date range to 30 days');
    }

    findagentDayWiseSummary(reqData, (err: any, response: any) => {
      if (err) {
        glogger('ERR', "" + req.body.agentNumber + "", '/kcrm/' + req.params.id + '/agent/dayWiseSummary', "findagentDayWiseSummary, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Scheduled", response);
      }
    });

  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};



