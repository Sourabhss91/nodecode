import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { getSocketIo } from "../../../../../../infrastructure/webserver/express/index";
import {
  AddLiveCalls,
  UpdateLiveCalls,
  DeleteLiveCalls,
  checkUniqueCallsRecords,
  UpdateUniqueCalls,
  AddUniqueCalls,
  AddBlacklistIvrCalls,
  getKeepAlive,
  checkLiveCallHangedData,
  UpdateHangedLiveCallsFree,
  checkDbHanged,
  checkTotalLeadStatusSummaryExist,
  updateTotalLeadStatusSummaryData,
  insertTotalLeadStatusSummaryData,
  checkTotalLeadSourceSummaryExist,
  updateTotalLeadSourceSummaryData,
  insertTotalLeadSourceSummaryData,
  checkTotalLeadProductSummaryExist,
  updateTotalLeadProductSummaryData,
  insertTotalLeadProductSummaryData,
  checkTotalLeadTypeSummaryExist,
  updateTotalLeadTypeSummaryData,
  insertTotalLeadTypeSummaryData,
  checkTotalLeadCitySummaryExist,
  updateTotalLeadCitySummaryData,
  insertTotalLeadCitySummaryData,
  getSmeProfileData,
  checkLiveCallExist
} from "../../../../../domain/models/v3/ivr.model";
import {
  setLiveCallsRequestValidate,
  updateLiveCallsRequestValidate,
  deleteLiveCallsValidate,
  setUniqueCallsRequestValidate,
  setblacklistRequestValidate,
  setKeepAliveRequest,
} from "../../../../../domain/entities/v3/ivr.entity";
import { env } from "../../../../../../infrastructure/env";
import { convertTimeZone } from "../../../../../helpers/utility";
import { MailSent } from "../../../../../lib/mailer";
import { glogger } from "../../../../../helpers/logger";
/**
 * get settings.
 *
 * @returns {Object}
 */

export const setLiveCalls = async (req: Request, res: Response) => {
  try {
    let reqData: setLiveCallsRequestValidate = {
      sme_id: parseInt(req.params.id),
      date_time: req.body.date_time,
      longcode: req.body.longcode,
      customer_number: req.body.customer_number,
      agent_number: req.body.agent_number ? req.body.agent_number : 0,
      self_ip: req.body.self_ip,
      agent_id: parseInt(req.body.agent_id) ? parseInt(req.body.agent_id) : 0,
      session_id: req.body.session_id,
      call_status: parseInt(req.body.call_status) ? parseInt(req.body.call_status) : 0,
      call_type: req.body.call_type,
      is_auto_dial: req.body.is_auto_dial ? req.body.is_auto_dial : 0,
      customer_name: req.body.customer_name ? req.body.customer_name : "No Name",
    };
    glogger('IMP', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setLiveCalls', "API Request Customer No:"+ req.body.customer_number);

    await checkLiveCallExist(reqData, async(err: any, liveCallResponse: any) => {
      if (err) {       
        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setLiveCalls', "checkLiveCallExist, error:"+err);
        return ErrorEmptyResponse(res, err);
      } else {
        if(liveCallResponse.length == 0){
          await AddLiveCalls(reqData, (err: any, response: any) => {
            if (err) {       
              glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setLiveCalls', "AddLiveCalls, error:"+err);
              return ErrorEmptyResponse(res, err);
            } else {
              const io : any = getSocketIo();
              let addLiveCallReq: any = {
                smeId: parseInt(req.params.id),
                dateTime: req.body.date_time,
                longcode: req.body.longcode,
                customerNumber: req.body.customer_number,
                agentNumber: req.body.agent_number ? req.body.agent_number : 0,
                selfIp: req.body.self_ip,
                agentId: parseInt(req.body.agent_id) ? parseInt(req.body.agent_id) : 0,
                sessionId: req.body.session_id,
                callStatus: parseInt(req.body.call_status) ? parseInt(req.body.call_status) : 0,
                callType: req.body.call_type,
                isAutoDial: req.body.is_auto_dial ? req.body.is_auto_dial : 0,
                customerName: req.body.customer_name ? req.body.customer_name : "No Name",
              };
              io.emit("add_live_calls", addLiveCallReq);
              return SuccessResponse(res, "Successfully inserted", response);
            }
          });
        } else {
          return SuccessResponse(res, "Already exist", []);
        }
      }
    })
  } catch (e) {
    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setLiveCalls', "Exception:"+e);
    ErrorResponse(res, e);
  }
};

export const upddateLiveCalls = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      sme_id: parseInt(req.params.id),
      customer_number: req.body.customer_number,
      agent_number: req.body.agent_number ? req.body.agent_number : 0,
      agent_id: parseInt(req.body.agent_id) ? parseInt(req.body.agent_id) : 0,
      session_id: req.body.session_id,
      call_status: parseInt(req.body.call_status) ? parseInt(req.body.call_status) : 0,
      date_time: req.body.date_time ? req.body.date_time : '0000-00-00 00:00:00',
      longcode: req.body.longcode ? req.body.longcode : '',
      self_ip: req.body.self_ip ? req.body.self_ip : '',
      call_type: req.body.call_type ? req.body.call_type : '',
      isAutoDial: req.body.isAutoDial ? req.body.isAutoDial : 0,
    };
    glogger('IMP', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/updateLiveCalls', "API Request Customer No:"+ req.body.customer_number);


    await UpdateLiveCalls(reqData, (err: any, response: any) => {
      if (err) {
        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/updateLiveCalls', "UpdateLiveCalls, error:"+err);
        return ErrorEmptyResponse(res, err);
      } else {
        glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/updateLiveCalls', "SuccessResponse");
        const io : any = getSocketIo();
        let updateLiveCallReq: any = {
          smeId: parseInt(req.params.id),
          customerNumber: req.body.customer_number,
          agentNumber: req.body.agent_number ? req.body.agent_number : 0,
          agentId: parseInt(req.body.agent_id) ? parseInt(req.body.agent_id) : 0,
          sessionId: req.body.session_id,
          callStatus: parseInt(req.body.call_status) ? parseInt(req.body.call_status) : 0,
        };
        io.emit("update_live_calls", updateLiveCallReq);
        return SuccessResponse(res, "Successfully updated", response);
      }
    });
  } catch (e) {
    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/updateLiveCalls', "Exception:"+e);
    ErrorResponse(res, e);
  }
};

export const deleteLiveCalls = async (req: Request, res: Response) => {
  try {
    let reqData: deleteLiveCallsValidate = {
      sme_id: parseInt(req.params.id),
      session_id: req.body.session_id,
    };

    glogger('IMP', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/deleteLiveCalls', "API Request ");
    await DeleteLiveCalls(reqData, (err: any, response: any) => {
      if (err) {
        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/deleteLiveCalls', "DeleteLiveCalls, error:"+err);
        return ErrorEmptyResponse(res, err);
      } else {
        glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/deleteLiveCalls', "SuccessResponse");
        const io : any = getSocketIo();
        let deleteLiveCallReq: any = {
          smeId: parseInt(req.params.id),
          sessionId: req.body.session_id,
        };
        io.emit("delete_live_calls", deleteLiveCallReq);
        return SuccessResponse(res, "Successfully updated", response);
      }
    });
  } catch (e) {
    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/deleteLiveCalls', "Exception:"+e);
    ErrorResponse(res, e);
  }
};

export const setUniqueCalls = async (req: Request, res: Response) => {
  try {
    let reqData: setUniqueCallsRequestValidate = {
      sme_id: parseInt(req.params.id),
      channel: req.body.channel ? req.body.channel : 0,
      callpatchedAgentGroup: req.body.callpatchedAgentGroup ? req.body.callpatchedAgentGroup : 0,
      callDirection: req.body.callDirection ? req.body.callDirection : 0,
      callDirectionStatus: req.body.callDirectionStatus ? req.body.callDirectionStatus : 0,
      callRecordedFile: req.body.callRecordedFile ? req.body.callRecordedFile : 0,
      callRecordingStatus: req.body.callRecordingStatus ? req.body.callRecordingStatus : 0,
      customerNumber: req.body.customerNumber ? req.body.customerNumber : 0,
      agentNumber: req.body.agentNumber ? req.body.agentNumber : 0,
      callcdrMode: req.body.callcdrMode ? req.body.callcdrMode : 0,
      callMode: req.body.callModeDb ? req.body.callModeDb : 0,
      callchannelNo: req.body.callchannelNo ? req.body.callchannelNo : 0,
      callDuration: req.body.callDuration ? req.body.callDuration : 0,
      callendDateTime: req.body.callendDateTime ? req.body.callendDateTime : 0,
      callHlr: req.body.callHlr ? req.body.callHlr : 0,
      callinsertDateTime: req.body.callinsertDateTime ? req.body.callinsertDateTime : 0,
      calllongcode: req.body.calllongcode ? req.body.calllongcode : 0,
      callmasterShortcode: req.body.callmasterShortcode ? req.body.callmasterShortcode : 0,
      callpatchedAgentId: req.body.callpatchedAgentId ? req.body.callpatchedAgentId : 0,
      ip: req.body.ip ? req.body.ip : 0,
      callshortcodeMapping: req.body.callshortcodeMapping ? req.body.callshortcodeMapping : 0,

      callsmeIdentifier: req.body.callsmeIdentifier ? req.body.callsmeIdentifier : 0,
      callstartDateTime: req.body.callstartDateTime ? req.body.callstartDateTime : 0,
      voicemailRecordingFile: req.body.voicemailRecordingFile ? req.body.voicemailRecordingFile : 0,
      voicemailRecordingStatus: req.body.voicemailRecordingStatus ? req.body.voicemailRecordingStatus : 0,
      callgroupid: req.body.callgroupid ? req.body.callgroupid : 0,
      callSessionId: req.body.callSessionId ? req.body.callSessionId : 0,
      callcdrFlag: req.body.callcdrFlag ? req.body.callcdrFlag : 0,
      callanswerFlag: req.body.callanswerFlag ? req.body.callanswerFlag : 0,
      callfinalStatus: req.body.callfinalStatus ? req.body.callfinalStatus : 0,
      calldisconnectedBy: req.body.calldisconnectedBy ? req.body.calldisconnectedBy : 0,
      addressBookName: req.body.addressBookName ? req.body.addressBookName : 0,
      addressBookId: req.body.addressBookId ? req.body.addressBookId : 0,
      insertDateTime: req.body.insertDateTime,
      provisionalFlag: req.body.endCallProvisionalFlag && req.body.endCallProvisionalFlag == 1 ? 3 : req.body.callanswerFlag ? req.body.callanswerFlag : 0,
      agentName: req.body.agent_name ? req.body.agent_name : ""
    };
    glogger('IMP', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls', "API Request Customer No:"+ req.body.customerNumber);

    await getSmeProfileData(reqData, (err: any, smeProfile: any) => {
      if (err) {
        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "getSmeProfileData, error:"+err);
        return ErrorEmptyResponse(res, err);
      } else {
        console.log("smeProfile");
        console.log(smeProfile);
        var smeProfile = JSON.parse(JSON.stringify(smeProfile[0]));
        checkUniqueCallsRecords(reqData, (err: any, response: any) => {
          if (err) {
            glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "checkUniqueCallsRecords, error:"+err);
            return ErrorEmptyResponse(res, err);
          } else {
            glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "checkUniqueCallsRecords length"+response.length+"");
            if (response.length > 0) {
              var data2 = JSON.parse(JSON.stringify(response[0]));
              UpdateUniqueCalls(reqData, data2, (err: any, response2: any) => {
                if (err) {
                  glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "UpdateUniqueCalls, error:"+err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "UpdateUniqueCalls Successfully Update");
                  return SuccessResponse(res, "Successfully updated", response2);
                }
              });
            } else {
              AddUniqueCalls(reqData, smeProfile, (err: any, response3: any) => {
                if (err) {
                  glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "AddUniqueCalls, error:"+err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "AddUniqueCalls Successfully Inserted");
                  let currentDate = new Date();
                  let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
                  let reqData1: any = {
                    "smeId": reqData["sme_id"],
                    "agentId": reqData["callpatchedAgentId"],
                    "leadStatus": 0,
                    "sourceId": 0,
                    "productId": 0,
                    "cityId": 0,
                    "leadType": '',
                    "insertDateTime": getCurrentDate,
                    "leadStatusCount": 1,
                    "leadSourceCount": 1,
                    "leadProductCount": 1,
                    "leadTypeCount": 1, 
                    "leadCityCount": 1, 
                  }; 
                  checkTotalLeadStatusSummaryExist(reqData1, (err: any, response5: any) => {
                    if (err) {
                      glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "checkTotalLeadStatusSummaryExist, error:"+err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      if(response5.length > 0){
                        let reqData2: any = {
                          "id": response5[0].id,
                          "leadStatusCount": response5[0].lead_status_count+1,
                        };
                        updateTotalLeadStatusSummaryData(reqData2,  (err: any, response6: any) => {
                          if (err) {
                            glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "updateTotalLeadStatusSummaryData, error:"+err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            
                          }
                        });
                      } else {
                        insertTotalLeadStatusSummaryData(reqData1, async (err: any, response7: any) => {
                          if (err) {
                            glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "insertTotalLeadStatusSummaryData, error:"+err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            
                          }
                        });
                      }
                    }
                  });
    
                  checkTotalLeadSourceSummaryExist(reqData1, (err: any, response6: any) => {
                    if (err) {
                      glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "checkTotalLeadSourceSummaryExist, error:"+err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      if(response6.length > 0){
                        let reqData2: any = {
                          "id": response6[0].id,
                          "leadSourceCount": response6[0].lead_source_count+1,
                        };
                        updateTotalLeadSourceSummaryData(reqData2,  (err: any, response7: any) => {
                          if (err) {
                            glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "updateTotalLeadSourceSummaryData, error:"+err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            
                          }
                        });
                      } else {
                        insertTotalLeadSourceSummaryData(reqData1, async (err: any, response7: any) => {
                          if (err) {
                            glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "insertTotalLeadSourceSummaryData, error:"+err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            
                          }
                        });
                      }
                    }
                  });
    
                  checkTotalLeadProductSummaryExist(reqData1, (err: any, response6: any) => {
                    if (err) {
                      glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "checkTotalLeadProductSummaryExist, error:"+err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      if(response6.length > 0){
                        let reqData2: any = {
                          "id": response6[0].id,
                          "leadProductCount": response6[0].lead_product_count+1,
                        };
                        updateTotalLeadProductSummaryData(reqData2,  (err: any, response7: any) => {
                          if (err) {
                            glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "updateTotalLeadProductSummaryData, error:"+err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            
                          }
                        });
                      } else {
                        insertTotalLeadProductSummaryData(reqData1, async (err: any, response7: any) => {
                          if (err) {
                            glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "insertTotalLeadProductSummaryData, error:"+err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            
                          }
                        });
                      }
                    }
                  });
    
                  /*checkTotalLeadTypeSummaryExist(reqData1, (err: any, response6: any) => {
                    if (err) {
                      glogger('ERR', ""+req.body.callSessionId+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "checkTotalLeadTypeSummaryExist, error:"+err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      if(response6.length > 0){
                        let reqData2: any = {
                          "id": response6[0].id,
                          "leadTypeCount": response6[0].lead_type_count+1,
                        };
                        updateTotalLeadTypeSummaryData(reqData2,  (err: any, response7: any) => {
                          if (err) {
                            glogger('ERR', ""+req.body.callSessionId+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "updateTotalLeadTypeSummaryData, error:"+err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            
                          }
                        });
                      } else {
                        insertTotalLeadTypeSummaryData(reqData1, async (err: any, response7: any) => {
                          if (err) {
                            glogger('ERR', ""+req.body.callSessionId+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "insertTotalLeadTypeSummaryData, error:"+err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            
                          }
                        });
                      }
                    }
                  });*/
    
                  checkTotalLeadCitySummaryExist(reqData1, (err: any, response7: any) => {
                    if (err) {
                      glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "checkTotalLeadCitySummaryExist, error:"+err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      if(response7.length > 0){
                        let reqData2: any = {
                          "id": response7[0].id,
                          "leadCityCount": response7[0].lead_city_count+1,
                        };
                        updateTotalLeadCitySummaryData(reqData2,  (err: any, response8: any) => {
                          if (err) {
                            glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "updateTotalLeadCitySummaryData, error:"+err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            
                          }
                        });
                      } else {
                        insertTotalLeadCitySummaryData(reqData1, async (err: any, response8: any) => {
                          if (err) {
                            glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "insertTotalLeadCitySummaryData, error:"+err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            
                          }
                        });
                      }
                    }
                  });
    
                  glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "SuccessResponse");
                  return SuccessResponse(res, "Successfully inserted", response3);
                }
              });
            }
          }
        });
      }
    });
  } catch (e) {
    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "Exception:"+e);
    ErrorResponse(res, e);
  }
};

export const blacklistIvrCalls = async (req: Request, res: Response) => {
  try {
    let reqData: setblacklistRequestValidate = {
      sme_id: parseInt(req.params.id),
      start_date: req.body.startDate,
      longcode: req.body.longcode,
      customer_number: req.body.customerNumber,
      session_id: req.body.sessionId,
      insertDateTime: req.body.insertDateTime,
    };
    glogger('IMP', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setBlacklistIvrCalls', "API Request Customer No:"+ req.body.customer_number);


    await AddBlacklistIvrCalls(reqData, (err: any, response: any) => {
      if (err) {
        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setBlacklistIvrCalls', "AddBlacklistIvrCalls, error:"+err);
        return ErrorEmptyResponse(res, err);
      } else {
        glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setBlacklistIvrCalls', "SuccessResponse");
        return SuccessResponse(res, "Successfully inserted", response);
      }
    });
  } catch (e) {
    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setBlacklistIvrCalls', "Exception:"+e);   
    ErrorResponse(res, e);
  }
};

export const keepAlive = async (req: Request, res: Response) => {
  try {
    let reqData: setKeepAliveRequest = {
      start_date: req.body.startDate,
    };
    glogger('IMP', ""+req.headers.sessionid+"", '/ivr/keepAlive', "API Request start_date:"+ req.body.startDate +" Session Id "+req.headers.sessionid+"");
    await getKeepAlive(reqData, (err: any, response: any) => {
      if (err) {
        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/keepAlive', "getKeepAlive, error:"+err);
        return ErrorEmptyResponse(res, err);
      } else {
        glogger('DEB', ""+req.headers.sessionid+"", '/ivr/keepAlive', "SuccessResponse");
        return SuccessResponse(res, "system is alive", response);
      }
    });
  } catch (e) {
    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/keepAlive', "Exception:"+e);
    ErrorResponse(res, e);
  }
};
