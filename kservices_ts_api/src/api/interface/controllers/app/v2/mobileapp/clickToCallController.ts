import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { addClickToCall,findAgentLongcode,findSmeLongcode } from "../../../../../domain/models/v2/mobileapp.model";
import { addClickToCallRequest } from "../../../../../domain/entities/v2/mobileapp.entity";
import { getRandomNumber } from "../../../../../helpers/utility";
import { env } from '../../../../../../infrastructure/env';
/**
 * get settings.
 *
 * @returns {Object}
 */

export const clickToCall = async (req: Request, res: Response) => {
  try {
    let dateTime = new Date(req.body.scheduleDateTime).toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
    let reqData: addClickToCallRequest = {
        accountSid: req.body.accountSid,
        agentGroup: req.body.agentGroup,
        agentNumber: req.body.agentNumber,
        callMode: req.body.callMode,
        callPriority: req.body.callPriority,
        customDtmf: req.body.customDtmf,
        customDtmfFlag: req.body.customDtmfFlag,
        from: req.body.from,
        liveEvent: req.body.liveEvent,
        liveEventFlag: req.body.liveEventFlag,
        mediaFileFlag: req.body.mediaFileFlag,
        mediaFileId: req.body.mediaFileId,
        nameFileFlag: req.body.nameFileFlag,
        nameFileId: req.body.nameFileId,
        optionalField: req.body.optionalField,
        pilotNumber: req.body.pilotNumber,
        recordingFlag: req.body.recordingFlag,
        scheduleDateTime: dateTime,
        sessionId: req.body.sessionId,
        smeId: req.body.smeId,
        agent_id: req.body.agentId,
        timeLimit: req.body.timeLimit,
        to: req.body.to,
        insertDateTime : req.body.insertDateTime ? req.body.insertDateTime : '0000:00:00 00:00:00',
        baseId :  req.body.baseId ? req.body.baseId : 0
    };
    await  findAgentLongcode(reqData, (err: any, responseA: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {

        if(responseA.length >0 ){
          let randomVirtualNumber = getRandomNumber(responseA);
          let newData :any ={
            virtualNumber: randomVirtualNumber.longcode
          }
          addClickToCall(reqData,newData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              let ResponseCustom = {
                "callScheduleId" : response[0],
                "sessionId": reqData.sessionId,
                "virtualNumber": '+'+ randomVirtualNumber.longcode
              }
              return SuccessResponse(res, "Successfully Scheduled", ResponseCustom);
            }
          });
        }else{
          findSmeLongcode(reqData, (err: any, responseB: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              if(responseB.length > 0 ){

                let a = getRandomNumber(responseB);
                let newData :any ={
                  virtualNumber: a.longcode
                }
                addClickToCall(reqData, newData, (err: any, response: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let ResponseCustom = {
                      "callScheduleId" : response[0],
                      "sessionId": reqData.sessionId,
                      "virtualNumber": a.longcode
                    }
                    return SuccessResponse(res, "Successfully Scheduled", ResponseCustom);
                  }
                });
              }else{          
                return ErrorEmptyResponse(res, "no virtual number available");
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
