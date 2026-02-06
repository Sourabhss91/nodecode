import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../helpers/apiResponse";
import {
  InsertEndCallCdr,
  GetLastInsertedId,
  GetLastInsertedIdCdr,
  InsertIncomingOutgoingCallCdr,
  CheckRecordExist,
  UpdateEndCallCdr,
  CheckRecordInoutCdr,
  UpdateIncomingOutgoingCallCdr,
  GetLastCallStatistics,
  addcallEndIvrNotify,
  FindAgentEmail,
  InsertUpdateTotalCallStatistics,
  InsertUpdateOthersCallStatistics,
  FindAddressbook,
  updateSmeCallsBalnce,
  FindAllSmeIvrPlan
} from "../../../../domain/models/ivr.model";
import { endCallCdrRequest, endCallStatsRequest } from "../../../../domain/entities/ivr.entity";
import { env } from "../../../../../infrastructure/env";
import { glogger } from "../../../../helpers/logger";
import { convertTimeZone } from "../../../../helpers/utility";

/**
 * get settings.
 *
 * @returns {Object}
 */


 export const endCallCdr = async (req: Request, res: Response) => {
  try {
    let reqData: endCallCdrRequest = {
      sme_id: parseInt(req.params.id),
      callDirection: req.body.callDirection,
      connectedDuration: req.body.connectedDuration ? req.body.connectedDuration : 0,
      ringingDuration: req.body.ringingDuration ? req.body.ringingDuration : 0,
      customerNumber: req.body.customerNumber,
      agentNumber: req.body.agentNumber,
      longcode: req.body.longcode,
      session_id: req.body.session_id,
      addressBookId: req.body.addressBookId ? req.body.addressBookId : 0,
      agentGroup: req.body.agentGroup ? req.body.agentGroup : 0,
      answer: req.body.answer ? req.body.answer : 0,
      callDirectionStatus: req.body.callDirectionStatus ? req.body.callDirectionStatus : 0,
      callRecordedFile: req.body.callRecordedFile ? req.body.callRecordedFile : null,
      callRecordingStatus: req.body.callRecordingStatus ? req.body.callRecordingStatus : 0,
      callStatus: req.body.callStatus ? req.body.callStatus : 0,
      cdrMode: req.body.cdrMode ? req.body.cdrMode : 0,
      callMode: req.body.callModeDb ? req.body.callModeDb : 0,
      channelNo: req.body.channelNo ? req.body.channelNo : 0,
      disconnectedBy: req.body.disconnectedBy ? req.body.disconnectedBy : null,
      remarks: req.body.remarks ? req.body.remarks : null,
      duration: req.body.duration ? req.body.duration : 0,
      endDateTime: req.body.endDateTime,
      merge_status: req.body.merge_status ? req.body.merge_status : 0,
      insertDateTime: req.body.insertDateTime,
      masterShortcode: req.body.masterShortcode ? req.body.masterShortcode : 0,
      patchedAgentId: req.body.patchedAgentId ? req.body.patchedAgentId : 0,
      serverIpAddress: req.body.serverIpAddress ? req.body.serverIpAddress : 0,
      shortcodeMapping: req.body.shortcodeMapping ? req.body.shortcodeMapping : 0,
      smeIdentifier: req.body.smeIdentifier ? req.body.smeIdentifier : 0,
      startDateTime: req.body.startDateTime,
      voicemailRecordingFile: req.body.voicemailRecordingFile ? req.body.voicemailRecordingFile : null,
      voicemailRecordingStatus: req.body.voicemailRecordingStatus ? req.body.voicemailRecordingStatus : 0,
      callType: req.body.callType ? req.body.callType : 0,
      hlr: req.body.hlr ? req.body.hlr : null,
      callDescription: req.body.callDescription ? req.body.callDescription : null,
      ivrDuration: req.body.ivrDuration ? req.body.ivrDuration : 0,
      customerStatus: req.body.customerStatus ? req.body.customerStatus : 0,
      finalStatus: req.body.callStatus && req.body.callStatus == "0" ? "patched" : "notpatched",
      callflowId: req.body.callflowId ? req.body.callflowId : 0,
      callflowName: req.body.callflowName ? req.body.callflowName : null,
      provisionalFlag: req.body.provisionalFlag && req.body.provisionalFlag == 1 ? 2 : req.body.callStatus ? req.body.callStatus : 0,
      finalDTMF: req.body.finalDTMF ? req.body.finalDTMF : 0,
    };
    glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "API Request Customer No:" + req.body.customerNumber+ "  Session Id "+req.headers.sessionid+"");

    await CheckRecordExist(reqData, (err: any, response: any) => {
      if (err) {
        glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "CheckRecordExist, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          UpdateEndCallCdr(reqData, (err: any, responseUpdate: any) => {
            if (err) {
              glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "UpdateEndCallCdr, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              CheckRecordInoutCdr(reqData, (err: any, response2: any) => {
                if (err) {
                  glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "CheckRecordInoutCdr, error:" + err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  if (response2.length > 0) {
                    UpdateIncomingOutgoingCallCdr(reqData, (err: any, response3: any) => {
                      if (err) {
                        glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "UpdateIncomingOutgoingCallCdr, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "UpdateIncomingOutgoingCallCdr - SuccessResponse ");
                        //return SuccessResponse(res, "Successfully updated", response3);


                        glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "GetLastCallStatistics - ------------------------ ");
                        GetLastCallStatistics(reqData, (err: any, response44: any) => {
                          if (err) {
                            glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "GetLastCallStatistics, error:" + err);
                            return ErrorEmptyResponse(res, err);
                          } else {

                              let incomingTotalCalls = 0;
                              let incomingFailedCalls =0;
                              let incomingSuccessCalls =0;
                              let outgoingTotalCalls = 0;
                              let outgoingFailedCalls =0;
                              let outgoingSuccessCalls =0;
                              let voicemailCalls =0;
                              

                              if(response44 && response44.length > 0){

                              if( (response44[0] && response44[0].service_id && response44[0].service_id == "1") || ( response44[1] && response44[1].service_id && response44[1].service_id == "1") ) {
                                 //incoming Total Calls
                                 
                                 if(response44[0] && response44[0].service_id > 0) {
                                  incomingTotalCalls = response44[0].total_calls;
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "incoming Total Calls 0 ("+incomingTotalCalls+")");
                                 } else if (response44[1] && response44[1]["service_id"] > 0) {
                                  incomingTotalCalls = response44[1].total_calls;
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "incoming Total Calls 1 ("+incomingTotalCalls+")");
                                 } else {
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "incoming Total Calls default ("+incomingTotalCalls+")");
                                 }
                              }if( (response44[0] && response44[0].service_id && response44[0].service_id == "2") || (response44[1] && response44[1].service_id && response44[1].service_id == "2") ) {
                                //outgoing Total Calls
                                 if(response44[0] && response44[0]["service_id"] > 0) {
                                  outgoingTotalCalls = response44[0].total_calls;
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "outgoingTotalCalls 0 ("+outgoingTotalCalls+")");
                                 } else if (response44[1] && response44[1]["service_id"] > 0) {
                                  outgoingTotalCalls = response44[1].total_calls;
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "outgoingTotalCalls 1 ("+outgoingTotalCalls+")");
                                 } else {
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "outgoingTotalCalls default ("+outgoingTotalCalls+")");
                                 }
                              }if( (response44[0] && response44[0].service_id && response44[0].service_id == "15") || (response44[1] && response44[1].service_id && response44[1].service_id == "15") ) {
                                //incoming Failed Calls
                                if(response44[0] && response44[0]["service_id"] > 0) {
                                  incomingFailedCalls = response44[0].total_calls;
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "incomingFailedCalls 0 ("+incomingFailedCalls+")");
                                } else if (response44[1] && response44[1]["service_id"] > 0) {
                                  incomingFailedCalls = response44[1].total_calls;
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "incomingFailedCalls 1 ("+incomingFailedCalls+")");
                                }else{
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "incomingFailedCalls default ("+incomingFailedCalls+")");
                                }
                              }if( (response44[0] && response44[0].service_id && response44[0].service_id == "25") || (response44[1] && response44[1].service_id && response44[1].service_id == "25") ) {
                                //outgoing Failed Calls

                               
                                if(response44[0] && response44[0].service_id > 0) {
                                  outgoingFailedCalls = response44[0].total_calls;
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "outgoingFailedCalls 0 ("+outgoingFailedCalls+")");
                                } else if (response44[1] && response44[1].service_id > 0) {
                                  outgoingFailedCalls = response44[1].total_calls;
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "outgoingFailedCalls 1 ("+outgoingFailedCalls+")");
                                } else {
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "outgoingFailedCalls default ("+outgoingFailedCalls+")");
                                }
                              }if( (response44[0] && response44[0].service_id && response44[0].service_id == "16") || (response44[1] && response44[1].service_id && response44[1].service_id == "16") ) {
                                //incoming Success Calls
                                if(response44[0] && response44[0]["service_id"] > 0) {
                                  incomingSuccessCalls = response44[0].total_calls;
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "incomingSuccessCalls 0 ("+incomingSuccessCalls+")");
                                } else if (response44[1] && response44[1]["service_id"] > 0) {
                                  incomingSuccessCalls = response44[1].total_calls;
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "incomingSuccessCalls 1 ("+incomingSuccessCalls+")");
                                }else{
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "incomingSuccessCalls default ("+incomingSuccessCalls+")");
                                }
                              }if( (response44[0] && response44[0].service_id && response44[0].service_id == "26") || (response44[1] && response44[1].service_id && response44[1].service_id == "26") ) {
                                //outgoing Success Calls
                                if(response44[0] && response44[0]["service_id"] > 0) {
                                  outgoingSuccessCalls = response44[0].total_calls;
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "outgoingSuccessCalls 0 ("+outgoingSuccessCalls+")");
                                } else if (response44[1] && response44[1]["service_id"] > 0) {
                                  outgoingSuccessCalls = response44[1].total_calls;
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "outgoingSuccessCalls 1 ("+outgoingSuccessCalls+")");
                                }else{
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "outgoingSuccessCalls default ("+outgoingSuccessCalls+")");
                                }
                             }if( (response44[0] && response44[0].service_id && response44[0].service_id == "11") ) {
                              //voicemail calls
                              if(response44[0] && response44[0]["service_id"] > 0) {
                                voicemailCalls = response44[0].total_calls;
                                glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "voicemail calls 0 ("+voicemailCalls+")");
                              }else{
                                glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "voicemail calls default ("+voicemailCalls+")");
                              }
                           }
                            }

                              glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "sme_id("+req.params.id+"), incomingTotalCalls("+incomingTotalCalls+"), incomingFailedCalls("+incomingFailedCalls+"), incomingSuccessCalls("+incomingSuccessCalls+"), outgoingTotalCalls("+outgoingTotalCalls+"), outgoingFailedCalls("+outgoingFailedCalls+"), outgoingSuccessCalls("+outgoingSuccessCalls+"), insertDateTime("+req.body.insertDateTime+") ");
                              
                              let reqDataStats: endCallStatsRequest = {
                                sme_id: parseInt(req.params.id),
                                incomingTotalCalls: incomingTotalCalls,
                                incomingFailedCalls: incomingFailedCalls,
                                incomingSuccessCalls: incomingSuccessCalls,
                                outgoingTotalCalls: outgoingTotalCalls,
                                outgoingFailedCalls: outgoingFailedCalls,
                                outgoingSuccessCalls: outgoingSuccessCalls,
                                voicemailCalls: voicemailCalls,
                                insertDateTime: req.body.insertDateTime,
                                service_id_total : 0,
                                service_id_sub_total : 0,
                                answer : req.body.answer ? req.body.answer : 0,
                                callStatus: req.body.callStatus ? req.body.callStatus : 0,
                                callDirection: req.body.callDirection ? req.body.callDirection : 0,


                              };

                              //update total calls
                              if ( (req.body.callDirection == "INCOMING") &&  (req.body.callType == "3") ){ 
                                //voicemail call
                                reqDataStats["service_id_sub_total"] = 11;
                                reqDataStats["service_id_total"] = 11;
                                glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", " voicemail calls - 11 & 11");

                              }
                                //update total calls
                                else if ( (req.body.callDirection == "INCOMING") &&  (req.body.callStatus == "0") ){ 
                                  //incoming success call
                                  reqDataStats["service_id_sub_total"] = 16;
                                  reqDataStats["service_id_total"] = 1;
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "incoming success call - 16 & 1");

                                }else if ( (req.body.callDirection == "INCOMING") &&  (req.body.callStatus == "1") ){ 
                                  //incoming failed call
                                  reqDataStats["service_id_sub_total"] = 15;
                                  reqDataStats["service_id_total"] = 1;
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "incoming failed call - 15 & 1");

                                }else if ( (req.body.callDirection == "OUTGOING") &&  (req.body.answer == "1") ){ 
                                  //outgoing failed call
                                  reqDataStats["service_id_sub_total"] = 25;
                                  reqDataStats["service_id_total"] = 2;
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "outgoing failed call - 25 & 2");

                                  //UpdateOutFailedStatistics(reqDataStats, (err: any, respons5: any) => {
                                  //   if (err) {
                                  //     glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "UpdateOutFailedStatistics, error:" + err);
                                  //     return ErrorEmptyResponse(res, err);
                                  //   } else {
                                  //     glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "UpdateOutFailedStatistics - SuccessResponse ");

                                  //     UpdateOutTotalStatistics(reqDataStats, (err: any, respons5: any) => {
                                  //       if (err) {
                                  //         glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "UpdateOutTotalStatistics, error:" + err);
                                  //         return ErrorEmptyResponse(res, err);
                                  //       } else {
                                  //         glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "UpdateOutTotalStatistics - SuccessResponse ");
                                  //         return SuccessResponse(res, "Successfully updated", response3);
                                  //       }
                                  //     });
                                  //   }
                                  // });

                                }else if ( (req.body.callDirection == "OUTGOING") &&  (req.body.answer == "2") ){ 
                                  //outgoing success call
                                  reqDataStats["service_id_sub_total"] = 26;
                                  reqDataStats["service_id_total"] = 2;
                                  glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "outgoing success call - 26 & 2");

                                  // UpdateOutSuccessStatistics(reqDataStats, (err: any, respons5: any) => {
                                  //   if (err) {
                                  //     glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "UpdateOutSuccessStatistics, error:" + err);
                                  //     return ErrorEmptyResponse(res, err);
                                  //   } else {
                                  //     glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "UpdateOutSuccessStatistics - SuccessResponse ");

                                  //     UpdateOutTotalStatistics(reqDataStats, (err: any, respons5: any) => {
                                  //       if (err) {
                                  //         glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "UpdateOutTotalStatistics, error:" + err);
                                  //         return ErrorEmptyResponse(res, err);
                                  //       } else {
                                  //         glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "UpdateOutTotalStatistics - SuccessResponse ");
                                  //         return SuccessResponse(res, "Successfully updated", response3);
                                  //       }
                                  //     });
                                  //   }
                                  // });
                                }

                                InsertUpdateTotalCallStatistics(reqDataStats, (err: any, respons5: any) => {
                                    if (err) {
                                      glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "InsertUpdateTotalCallStatistics, error:" + err);
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "InsertUpdateTotalCallStatistics - SuccessResponse ");

                                      if ( (req.body.callDirection == "INCOMING") &&  (req.body.callType == "3") ){
                                        //do nothing its voicemail case only...

                                      }else {
                                        InsertUpdateOthersCallStatistics(reqDataStats, (err: any, respons5: any) => {
                                        if (err) {
                                          glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "InsertUpdateOthersCallStatistics, error:" + err);
                                          return ErrorEmptyResponse(res, err);
                                        } else {
                                          glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "InsertUpdateOthersCallStatistics - SuccessResponse ");
                                          return SuccessResponse(res, "Successfully updated", response3);
                                        }
                                        });
                                      }
                                      
                                    }
                                  });

                        }
                      });

                      }
                    });
                  } else {
                    GetLastInsertedIdCdr(reqData, (err: any, response3: any) => {
                      if (err) {
                        glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "GetLastInsertedIdCdr, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if (response3.length > 0) {
                          var data2 = JSON.parse(JSON.stringify(response3[0]));
                          let reqDataNew2: any = {
                            lastInsertedId: data2["id"],
                          };
                          InsertIncomingOutgoingCallCdr(reqData, reqDataNew2, (err: any, response5: any) => {
                            if (err) {
                              glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "InsertIncomingOutgoingCallCdr, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "InsertIncomingOutgoingCallCdr - SuccessResponse ");
                              return SuccessResponse(res, "Successfully inserted", response5);
                            }
                          });
                        }
                      }
                    });
                  }
                }
              });
            }
          });
        } else {
          GetLastInsertedId(reqData, (err: any, response: any) => {
            if (err) {
              glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "GetLastInsertedId, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              if (response.length > 0) {
                var data = JSON.parse(JSON.stringify(response[0]));
                let reqDataNew: any = {
                  lastInsertedId: data["id"],
                };
                InsertEndCallCdr(reqData, reqDataNew, (err: any, response1: any) => {
                  if (err) {
                    glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "InsertEndCallCdr, error:" + err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    CheckRecordInoutCdr(reqData, (err: any, response2: any) => {
                      if (err) {
                        glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "CheckRecordInoutCdr, error:" + err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if (response2.length > 0) {
                          UpdateIncomingOutgoingCallCdr(reqData, (err: any, response3: any) => {
                            if (err) {
                              glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "UpdateIncomingOutgoingCallCdr, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "UpdateIncomingOutgoingCallCdr - SuccessResponse ");
                              return SuccessResponse(res, "Successfully updated", response3);
                            }
                          });
                        } else {
                          GetLastInsertedIdCdr(reqData, (err: any, response3: any) => {
                            if (err) {
                              glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "GetLastInsertedIdCdr, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              if (response3.length > 0) {
                                var data2 = JSON.parse(JSON.stringify(response3[0]));
                                let reqDataNew2: any = {
                                  lastInsertedId: data2["id"],
                                };
                                InsertIncomingOutgoingCallCdr(reqData, reqDataNew2, (err: any, response5: any) => {
                                  if (err) {
                                    glogger("ERR", "" + req.body.session_id + "", "/ivr/endCallCdr/", "InsertIncomingOutgoingCallCdr, error:" + err);
                                    return ErrorEmptyResponse(res, err);
                                  } else {
                                    glogger("DEB", "" + req.body.session_id + "", "/ivr/endCallCdr/", "InsertIncomingOutgoingCallCdr - SuccessResponse ");
                                    return SuccessResponse(res, "Successfully inserted", response5);
                                  }
                                });
                              }
                            }
                          });
                        }
                      }
                    });
                  }
                });
              }
            }
          });
        }
      }
    });
  } catch (e) {
    glogger("ERR", "" + req.body.session_id + "", "/ivr/fetchCallProfile/", "Exception, error:" + e);
    ErrorResponse(res, e);
  }
};

export const callEndIvrNotify = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);

    let reqData: any = {
      sme_id: parseInt(req.params.id),
      callType: req.body.callType,
      sessionId: req.body.sessionId,
      agentId: req.body.agentId,
      customerName: req.body.customerName ? req.body.customerName : null,
      customerNumber: req.body.customerNumber,
      title: "End Call Reason " + req.body.customerNumber,
      mode: req.body.mode ? req.body.mode : "APP",
      event: "end_call_ivr_reason",
      insertdateTime: getCurrentDate,
      scheduleDateTime: getCurrentDate,
      message: "write what happened to this call on " + getCurrentDate,
    };
    glogger("IMP", ""+req.headers.sessionid+"", "/ivr/callEndIvrNotify", "Api");
    await FindAgentEmail(reqData, (err: any, responseA: any) => {
      if (err) {
        glogger("ERR", ""+req.headers.sessionid+"", "/ivr/callEndIvrNotify", "FindAgentEmail, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        var agent_email = null;
        if (responseA[0] && responseA[0].agent_email) {
          agent_email = responseA[0].agent_email;
          
          let data2: any = {
            agent_email: agent_email,
          };

          FindAddressbook(reqData, (err: any, responseAddr: any) => {
            if (err) {
              glogger("ERR", ""+req.headers.sessionid+"", "/ivr/callEndIvrNotify", "findCustomerName, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              var customerName = '';
              if(responseAddr[0] && responseAddr[0].g_customer_name){
                 customerName = responseAddr[0].g_customer_name;
              }
              let data3: any = {
                customerName: customerName,
              };
              addcallEndIvrNotify(reqData, data2,data3, (err: any, response: any) => {
                if (err) {
                  glogger("ERR", ""+req.headers.sessionid+"", "/ivr/callEndIvrNotify", "addcallEndIvrNotify, error:" + err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  glogger("DEB", ""+req.headers.sessionid+"", "/ivr/callEndIvrNotify", "SuccessResponse");
                  return SuccessResponse(res, "system is alive", response);
                }
              });
            }
          });
        }
      }
    });
  } catch (e) {
    glogger("ERR", ""+req.headers.sessionid+"", "/ivr/callEndIvrNotify", "Exception:" + e);
    ErrorResponse(res, e);
  }
};



export const updateCallBalance = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let callPulse:any = env.CALL_PULSE;

    let reqData: any = {
      sme_id: parseInt(req.params.id),
      callDuration: req.body.callDuration,
      type: req.body.calls_type 
    };
    glogger("IMP", ""+req.headers.sessionid+"", "/ivr/updateCallBalance", "Api");
    
    /* update client calls balance after every calls */
    await FindAllSmeIvrPlan(reqData, (err: any, responsePlan: any) => {
      if (err) {
        glogger("ERR", ""+req.headers.sessionid+"", "/ivr/updateCallBalance", "FindAllSmeIvrPlan, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if(responsePlan.length>0){
          if(responsePlan[0].unlimited_calls ==0){
            if(req.body.calls_type =='minute'){
              reqData['totalMinutes']  = Math.ceil(req.body.callDuration / callPulse);
            }else if(req.body.calls_type =='call'){
              reqData['totalCalls']  = 1
            }
            updateSmeCallsBalnce(reqData, (err: any, responseA: any) => {
              if (err) {
                glogger("ERR", ""+req.headers.sessionid+"", "/ivr/updateCallBalance", "updateSmeCallsBalnce, error:" + err);
                return ErrorEmptyResponse(res, err);
              } else {
                glogger("DEB", ""+req.headers.sessionid+"", "/ivr/updateCallBalance", "SuccessResponse");
                return SuccessResponse(res, "system is alive", responseA);
              }
            });
          }else{
            return SuccessResponse(res, "system is alive", 'unlimied calls plan activated');
          }
        }
      }
    });
  } catch (e) {
    glogger("ERR", ""+req.headers.sessionid+"", "/ivr/updateCallBalance", "Exception:" + e);
    ErrorResponse(res, e);
  }
};