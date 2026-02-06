import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, EmptyResponse } from "../../../../../helpers/apiResponse";
import {
  FindclicktoCall,
  UpdateclicktoCall,
  UpdateclicktoCallbase,
  FindAutoDialedNo,
  FindAutoDialedNoProfile,
  FindVirtualNoStatus,
  UpdateAutoDialedNo,
  UpdateAutoDialedNoError,
  FindAgentFullDetails,
  UpdateClick2Call,
  UpdateAutoDialedNoErrorNew,
  FindAppOutCallDetail,
  FindAutoDialedNoNew,
  UpdateAgentStatusBusy,
  UpdateBusyAgentTiming,
  FindAllSmeIvrPlan,
  UpdateOutgoingCampaign,
  UpdateDialersNumbers,
  
} from "../../../../../domain/models/v2/ivr.model";
import { getclicktocallRequest, getAutoDialerNoRequest, updateClick2CallRequest, getAppOutCallDetailRequest } from "../../../../../domain/entities/v2/ivr.entity";
import { convertTimeZone } from "../../../../../helpers/utility";
import { getVirtualNumberByagentId } from "../../../../../helpers/findVirtualNumber";
import { env } from "../../../../../../infrastructure/env";
import { glogger } from "../../../../../helpers/logger";
/**
 * get settings.
 *
 * @returns {Object}
 */

export const getclicktocall = async (req: Request, res: Response) => {
  try {
    let reqData: getclicktocallRequest = {
      smeId: parseInt(req.params.id),
      mode: req.body.mode ? req.body.mode : 0,
      flag: req.body.flag ? req.body.flag : 0,
      sessionId: req.body.sessionId ? req.body.sessionId : 0,
      scheduleId: req.body.scheduleId ? req.body.scheduleId : 0,
      callDuration: req.body.callDuration ? req.body.callDuration : 0,
      dtmf: req.body.dtmf ? req.body.dtmf : 0,
      recordingFileId: req.body.recordingFileId ? req.body.recordingFileId : 0,
      callStatus: req.body.callStatus ? req.body.callStatus : 0,
      agentNumber: req.body.agentNumber,
      virtualNumber: req.body.virtualNumber,
    };

    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqDateTime: any = {
      currentDate: getCurrentDate,
    };

    glogger('IMP', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "API Request agentNumber(" + req.body.agentNumber + ")");
    await FindclicktoCall(reqData, reqDateTime, (err: any, response: any) => {
      if (err) {
        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "FindclicktoCall, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          var data2 = JSON.parse(JSON.stringify(response[0]));

          UpdateclicktoCall(reqData, data2, (err: any, response2: any) => {
            if (err) {
              glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "UpdateclicktoCall, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              UpdateclicktoCallbase(reqData, data2, (err: any, response3: any) => {
                if (err) {
                  glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "UpdateclicktoCallbase, error:" + err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  glogger('DEB', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "SuccessResponse");
                  return SuccessResponse(res, "Successfully listed", response);
                }
              });
            }
          });
        } else {
          return SuccessResponse(res, "Successfully listed", {});
        }
      }
    });
  } catch (e) {
    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "Exception:" + e);
    ErrorResponse(res, e);
  }
};
export const getAutoDialerNo = async (req: Request, res: Response) => {
  try {
    let gSessionId = 90909090909;

    if ((req.body) && (req.body.appCallMode) && ((req.body.appCallMode == "autodialer")  || (req.body.appCallMode == "click2call")) ){

      glogger('DEB', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "getAutoDialerNo - valid appCallMode ("+req.body.appCallMode+")");

    } else {
      glogger('ERR', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "getAutoDialerNo - Invalid appCallMode ");
      return ErrorEmptyResponse(res, "Invalid appCallMode");
    }

    let reqData: getAutoDialerNoRequest = {
      virtualNumberString: req.body.virtualNumberString,
      insertDateTime: req.body.insertDateTime,
      appCallMode: req.body.appCallMode,
      longcodSiteName: req.body.longcodSiteName ? req.body.longcodSiteName : '',
      callType: req.body.callType ? req.body.callType : ''
    };

    let obj: any = {};
    glogger('IMP', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "API Request virtualNumberString(" + req.body.virtualNumberString + ")");


    await FindAutoDialedNo(reqData, (err: any, response: any) => {
      if (err) {
        glogger('ERR', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "FindAutoDialedNo, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        obj["click2call"] = response;

        if (response.length > 0) {
          let reqDataNew: any = {
            virtual_number: response[0]["virtual_number"],
            sme_id: response[0]["sme_id"],
            session_id: response[0]["session_id"],
            longcode: response[0]["virtual_number"],
            agentNumber: response[0]["agent_number"],
            virtualNumberString: reqData.virtualNumberString,
            schedule_id: response[0]["call_schedule_id"],
            
          };
          
          if((response) && (response[0]) && (response[0].session_id) ) { 
            gSessionId = response[0].session_id; 
          }
          
          glogger('DEB', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAutoDialedNo, mark c2c status 1 done for toNo("+response[0].to_no+")");

          UpdateAutoDialedNo(reqDataNew, (err: any, response4: any) => {
            if (err) {
              glogger('ERR', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAutoDialedNo, failed for toNo("+response[0].to_no+"), error:" + err);
              
              return ErrorEmptyResponse(res, err);
            } else {
              
              glogger('DEB', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAutoDialedNo - Received click2schedule toNo("+response[0].to_no+")" );

              FindAllSmeIvrPlan(reqDataNew, (err: any, responsePlan: any) => {
                if (err) {
                  glogger('ERR', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "FindAllSmeIvrPlan, failed for toNo("+response[0].to_no+"), error:" + err);
                  
                  return ErrorEmptyResponse(res, err);
                } else {
                  
                  glogger('DEB', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "FindAllSmeIvrPlan - Received click2schedule toNo("+response[0].to_no+")" );
                  obj["sme_plan_details"] = responsePlan;

                  FindAutoDialedNoProfile(reqDataNew, (err: any, response2: any) => {
                    if (err) {
                      glogger('ERR', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "FindAutoDialedNoProfile, failed for toNo("+response[0].to_no+"), error:" + err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      obj["sme_profile"] = response2;
                      if (response2.length > 0) {

                        glogger('DEB', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "FindAutoDialedNoProfile - Received sme profile data of toNo("+response[0].to_no+")" );
                        FindVirtualNoStatus(reqDataNew, (err: any, response3: any) => {
                          if (err) {
                            glogger('ERR', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "FindVirtualNoStatus, failed for toNo("+response[0].to_no+"), error:" + err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            //Virtual No is not in spam or deleted, its valid
                            if ( (response3) && (response3.length > 0) && (response3[0]) && (response3[0].status) && (response3[0].status == 1) ){

                              glogger('DEB', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "FindVirtualNoStatus - Received virtual no status - toNo("+response[0].to_no+")" );
                              FindAgentFullDetails(reqDataNew, (err: any, response5: any) => {
                                if (err) {
                                  glogger('ERR', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "FindAgentFullDetails,failed for toNo("+response[0].to_no+"), error:" + err);
                                  UpdateAutoDialedNoErrorNew(reqDataNew, (err: any, response4: any) => {
                                    if (err) {
                                      glogger('ERR', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAutoDialedNoErrorNew, failed for toNo("+response[0].to_no+"), error:" + err);
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      glogger('IMP', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAutoDialedNoErrorNew, return Invalid Agent Number");
                                      return ErrorEmptyResponse(res, "Invalid Agent Number");
                                    }
                                  });
                                } else {
                                  glogger('DEB', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "FindAgentFullDetails - Received agent details - toNo("+response[0].to_no+")" );

                                  if ( (response5) && (response5.length > 0) && (response5[0]) && (response5[0].status) &&  (response5[0].status != 1) ) {

                                    glogger('DEB', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "FindAgentFullDetails - agent("+response[0].agent_number+") not idle - toNo("+response[0].to_no+")" );

                                    UpdateAutoDialedNoErrorNew(reqDataNew, (err: any, response4: any) => {
                                      if (err) {
                                        glogger('ERR', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAutoDialedNoErrorNew, failed on agent("+response[0].agent_number+") not idle toNo("+response[0].to_no+"), error:" + err);
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                        glogger('DEB', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAutoDialedNoErrorNew, agent("+response[0].agent_number+") not idle for toNo("+response[0].to_no+")");
                                        return ErrorEmptyResponse(res, "Click2Call Agent Not Idle");
                                      }
                                    });

                                  } else{

                                    glogger('DEB', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "FindAgentFullDetails, agent("+response[0].agent_number+") is idle for toNo("+response[0].to_no+")");
                                    obj["agent_details"] = response5;
                                    //return SuccessResponse(res, "Successfully listed", obj);

                                    if(response5 &&  response5[0] && response5[0]["agent_id"]){
                                      let reqDataNew33: any = {
                                        agent_id: response5[0]["agent_id"],
                                      };
                                      UpdateAgentStatusBusy(reqDataNew33, (err: any, response2: any) => {
                                        if (err) {
                                          glogger('ERR', ""+gSessionId+"", '/ivr/'+req.params.id+'/setAgentOut',  "UpdateAgentStatusBusy, failed for toNo("+response[0].to_no+"), error:" + err);
                                          return ErrorEmptyResponse(res, err);
                                        } else {

                                          glogger('DEB', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAgentStatusBusy, mark agent("+response[0].agent_number+") agent_detail for toNo("+response[0].to_no+")");
                                          glogger('CDR', ""+gSessionId+"", '/ivr/'+req.params.id+'/getAutoDialerNo', "Mark Agent Busy agent("+response[0].agent_number+")");

                                          let currentDate = Date();
                                          let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
                                          let reqDateTime: any = {
                                            currentDate: getCurrentDate,
                                          };
                                          UpdateBusyAgentTiming(reqDataNew33, reqDateTime, (err: any, response3: any) => {
                                            if (err) {
                                              glogger('ERR', ""+gSessionId+"", '/ivr/'+req.params.id+'/setAgentOut',  "UpdateBusyAgentTiming, failed for toNo("+response[0].to_no+"), error:" + err);
                                              return ErrorEmptyResponse(res, err);
                                            } else {

                                              glogger('DEB', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateBusyAgentTiming, mark agent("+response[0].agent_number+") agent_timing for toNo("+response[0].to_no+")");
                                              glogger('DEB', ""+gSessionId+"", '/ivr/'+req.params.id+'/setAgentOut',  "SuccessResponse");
                                              //return SuccessResponse(res, "Successfully listed", response);
                                              glogger('DEB', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "SuccessResponse");
                                              return SuccessResponse(res, "Successfully listed", obj);
                                              
                                            }
                                          });
                                        }
                                      });
                                    } else {
                                      UpdateAutoDialedNoErrorNew(reqDataNew, (err: any, response4: any) => {
                                        if (err) {
                                          glogger('ERR', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAutoDialedNoErrorNew, Invalid Agent Number for toNo("+response[0].to_no+"), error:" + err);
                                          return ErrorEmptyResponse(res, err);
                                        } else {
                                          glogger('IMP', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAutoDialedNoErrorNew, Invalid Agent Number");
                                          return ErrorEmptyResponse(res, "Invalid Agent Number");
                                        }
                                      });
                                    }
                                  }
                                }
                              });
                            } else if ( (response3) && (response3.length > 0) && (response3[0]) && (response3[0].status) && (response3[0].status == -7) ) {

                              glogger('DEB', ""+gSessionId+"", '/ivr/'+req.params.id+'/setAgentOut',  "virtual no status is -7 for toNo("+response[0].to_no+")");

                              let reqDataNew2: any = {
                                sme_id: response[0]["sme_id"],
                                session_id: response[0]["session_id"],
                                virtualNumberString: reqData.virtualNumberString,
                                response_msg: "VirtualNumber SPAM",
                              };

                              UpdateAutoDialedNoErrorNew(reqDataNew, (err: any, response4: any) => {
                                if (err) {
                                  glogger('ERR', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAutoDialedNoErrorNew, virtual no -7 failed for toNo("+response[0].to_no+"), error:" + err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  glogger('IMP', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAutoDialedNoErrorNew, return VirtualNumber SPAM");
                                  return ErrorEmptyResponse(res, "VirtualNumber SPAM");
                                }
                              });

                          
                            } else if ( (response3) && (response3.length > 0) && (response3[0]) && (response3[0].status) && (response3[0].status == -9) ) {
                              let reqDataNew2: any = {
                                sme_id: response[0]["sme_id"],
                                session_id: response[0]["session_id"],
                                virtualNumberString: reqData.virtualNumberString,
                                response_msg: "VirtualNumber Deleted",
                              };
                              glogger('DEB', ""+gSessionId+"", '/ivr/'+req.params.id+'/setAgentOut',  "virtual no status is -9 for toNo("+response[0].to_no+")");
                              UpdateAutoDialedNoErrorNew(reqDataNew, (err: any, response4: any) => {
                                if (err) {
                                  glogger('ERR', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAutoDialedNoErrorNew, virtual no -9 failed for toNo("+response[0].to_no+"), error:" + err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  glogger('IMP', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAutoDialedNoErrorNew, return VirtualNumber Deleted");
                                  return ErrorEmptyResponse(res, "VirtualNumber Deleted");
                                }
                              });

                            } else {
                              let reqDataNew2: any = {
                                sme_id: response[0]["sme_id"],
                                session_id: response[0]["session_id"],
                                virtualNumberString: reqData.virtualNumberString,
                                response_msg: "VirtualNumber invalid",
                              };

                              glogger('ERR', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAutoDialedNoErrorNew, virtual no else failed for toNo("+response[0].to_no+"), error:" + err);

                              UpdateAutoDialedNoErrorNew(reqDataNew, (err: any, response4: any) => {
                                if (err) {
                                  glogger('ERR', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAutoDialedNoErrorNew, failed for toNo("+response[0].to_no+"), error:" + err);
                                  return ErrorEmptyResponse(res, err);
                                } else {

                                  glogger('IMP', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAutoDialedNoErrorNew, return VirtualNumber invalid");
                                  if( (response3) && (response3.length > 0) && (response3[0]) && (response3[0].status) ) {

                                    glogger('IMP', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAutoDialedNoErrorNew, return VirtualNumber invalid error handled herer..");
                                    return ErrorEmptyResponse(response3[0].status, "VirtualNumber invalid"); 
                                  }
                                  else {
                                    glogger('IMP', ""+gSessionId+"", '/ivr/' + req.params.id + '/getAutoDialerNo', "UpdateAutoDialedNoErrorNew, return VirtualNumber invalid error handled herer..-1");
                                    return ErrorEmptyResponse(res, "VirtualNumber invalid");
                                  }
                                }
                              });

                            
                            }
                          }
                        });
                      } else {
                        return EmptyResponse(res, "No Record found", {});
                      }
                    }
                  });

                }
              });
            }
          });
          
        } else {
          return EmptyResponse(res, "No Record found", {});
        }
      }
    });
  } catch (e) {
    glogger('ERR', "tmp999999999", '/ivr/' + req.params.id + '/getAutoDialerNo', "Exception:" + e);
    ErrorResponse(res, e);
  }
};

export const updateClick2Call = async (req: Request, res: Response) => {
  try {
    let reqData: updateClick2CallRequest = {
      sme_id: parseInt(req.params.id),
      session_id: req.body.session_id,
      schedule_id: req.body.schedule_id,
      duration: req.body.duration,
      dtmf: req.body.dtmf,
      recording_file_id: req.body.recording_file_id,
      call_status: req.body.call_status,
      agent_no: req.body.agent_no,
      response_msg: req.body.response_msg,
    };

    glogger('IMP', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "API Request agentNumber(" + req.body.agent_no + ") ");

    await UpdateClick2Call(reqData, (err: any, response: any) => {
      if (err) {
        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "UpdateClick2Call, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        glogger('DEB', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "SuccessResponse");
        return SuccessResponse(res, "Successfully listed", response);

      }
    });
  } catch (e) {
    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "Exception:" + e);
    ErrorResponse(res, e);
  }
};

export const getAppOutCallDetail = async (req: Request, res: Response) => {
  try {
    let reqData: getAppOutCallDetailRequest = {
      sme_id: parseInt(req.params.id),
      agent_no: req.body.agent_no,
      longcode: req.body.longcode,
      insertDateTime: req.body.insertDateTime,
    };

    let obj: any = {};
    glogger('IMP', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getAppOutCallDetail', "API Request agent_no(" + req.body.agent_no + ")");
    await FindAppOutCallDetail(reqData, (err: any, response: any) => {
      if (err) {
        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "FindAppOutCallDetail, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        obj["click2call"] = response;

        if (response.length > 0) {
          let reqDataNew: any = {
            sme_id: parseInt(req.params.id),
            session_id: response[0]["session_id"],
            longcode: req.body.longcode,
            agentNumber: req.body.agent_no,
          };
          FindAutoDialedNoProfile(reqDataNew, (err: any, response2: any) => {
            if (err) {
              glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "FindAutoDialedNoProfile, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              obj["sme_profile"] = response2;
              if (response2.length > 0) {
                FindVirtualNoStatus(reqDataNew, (err: any, response3: any) => {
                  if (err) {
                    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "FindVirtualNoStatus, error:" + err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    //Virtual No is not in spam or deleted, its valid
                    if (response3[0].status == 1) {
                      FindAgentFullDetails(reqDataNew, (err: any, response5: any) => {
                        if (err) {
                          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "FindAgentFullDetails, error:" + err);
                          return ErrorEmptyResponse(res, "Invalid Agent Number");
                        } else {
                          obj["agent_details"] = response5;
                          //return SuccessResponse(res, "Successfully listed", obj);

                          UpdateAutoDialedNo(reqDataNew, (err: any, response4: any) => {
                            if (err) {
                              glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "UpdateAutoDialedNo, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              glogger('DEB', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "SuccessResponse");
                              return SuccessResponse(res, "Successfully listed", obj);
                            }
                          });
                        }
                      });
                    } else if (response3[0].status == -7) {
                      return ErrorEmptyResponse(res, "VirtualNumber SPAM");
                    } else if (response3[0].status == -9) {
                      return ErrorEmptyResponse(res, "VirtualNumber Deleted");
                    } else {
                      return ErrorEmptyResponse(response3[0].status, "VirtualNumber invalid");
                    }
                  }
                });
              } else {
                return EmptyResponse(res, "No Record found", {});
              }
            }
          });
        } else {
          return EmptyResponse(res, "No Record found", {});
        }
      }
    });
  } catch (e) {
    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "Exception:" + e);
    ErrorResponse(res, e);
  }
};


export const getAppOutCallDetailNew = async (req: Request, res: Response) => {
  try {
    let reqData: getAppOutCallDetailRequest = {
      sme_id: parseInt(req.params.id),
      agent_no: req.body.agent_no,
      longcode: req.body.longcode,
      insertDateTime: req.body.insertDateTime,
    };

    let obj: any = {};
    glogger('IMP', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getAppOutCallDetailNew', "API Request agent_no(" + req.body.agent_no + ")");


    await FindAppOutCallDetail(reqData, (err: any, response: any) => {
      if (err) {
        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getAppOutCallDetailNew', "FindAppOutCallDetail, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        obj["click2call"] = response;

        if (response.length > 0) {
          let reqDataNew: any = {
            sme_id: parseInt(req.params.id),
            session_id: response[0]["session_id"],
            longcode: req.body.longcode,
            agentNumber: req.body.agent_no,
          };
          FindAutoDialedNoProfile(reqDataNew, (err: any, response2: any) => {
            if (err) {
              glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getAppOutCallDetailNew', "FindAutoDialedNoProfile, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              obj["sme_profile"] = response2;
              if (response2.length > 0) {
                FindAgentFullDetails(reqDataNew, (err: any, response5: any) => {
                  if (err) {
                    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getAppOutCallDetailNew', "FindAgentFullDetails, error:" + err);
                    return ErrorEmptyResponse(res, "Invalid Agent Number");
                  } else {
                    obj["agent_details"] = response5;
                    //return SuccessResponse(res, "Successfully listed", obj);
                    var agentVirtualNumber = getVirtualNumberByagentId(response5[0].agent_id,response5[0].longcode_priority_flag);
                    agentVirtualNumber.then(function (result) {
                      if (result) {
                        obj["virtual_number"] = result;
                        UpdateAutoDialedNo(reqDataNew, (err: any, response4: any) => {
                          if (err) {
                            glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getAppOutCallDetailNew', "UpdateAutoDialedNo, error:" + err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            glogger('DEB', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getAppOutCallDetailNew', "SuccessResponse");
                            return SuccessResponse(res, "Successfully listed", obj);
                          }
                        });
                      } else {
                        return ErrorEmptyResponse(res, "No VirtualNumber found");
                      }

                    });
                  }
                });

              } else {
                return EmptyResponse(res, "No Record found", {});
              }
            }
          });
        } else {
          return EmptyResponse(res, "No Record found", {});
        }
      }
    });
  } catch (e) {
    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getAppOutCallDetailNew', "Exception:" + e);
    ErrorResponse(res, e);
  }
};


export const getAutoDialerNoNew = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      siteId: req.body.siteId,
      insertDateTime: req.body.insertDateTime,
    };

    let obj: any = {};
    glogger('DEB', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getAutoDialerNoNew', "API Request siteId(" + req.body.siteId + ")");

    await FindAutoDialedNoNew(reqData, (err: any, response: any) => {
      if (err) {
        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getAutoDialerNoNew', "FindAutoDialedNoNew, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        obj["click2call"] = response;

        if (response.length > 0) {
          let reqDataNew: any = {
            virtual_number: response[0]["virtual_number"],
            sme_id: response[0]["sme_id"],
            session_id: response[0]["session_id"],
            longcode: response[0]["virtual_number"],
            agentNumber: response[0]["agent_number"],
            siteId: reqData.siteId,
          };

          FindAutoDialedNoProfile(reqDataNew, (err: any, response2: any) => {
            if (err) {
              glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getAutoDialerNoNew', "FindAutoDialedNoProfile, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              obj["sme_profile"] = response2;
              if (response2.length > 0) {
                FindAgentFullDetails(reqDataNew, (err: any, response5: any) => {
                  if (err) {
                    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "FindAgentFullDetails, error:" + err);
                    return ErrorEmptyResponse(res, "Invalid Agent Number");
                  } else {
                    obj["agent_details"] = response5;

                    var agentVirtualNumber = getVirtualNumberByagentId(response5[0].agent_id,response5[0].longcode_priority_flag);
                    agentVirtualNumber.then(function (result) {
                      if (result) {
                        obj["virtual_number"] = result;
                        UpdateAutoDialedNo(reqDataNew, (err: any, response4: any) => {
                          if (err) {
                            glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getAppOutCallDetailNew', "UpdateAutoDialedNo, error:" + err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            glogger('DEB', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getAppOutCallDetailNew', "SuccessResponse");
                            return SuccessResponse(res, "Successfully listed", obj);
                          }
                        });
                      } else {
                        return ErrorEmptyResponse(res, "No VirtualNumber found");
                      }

                    });
                  }
                });
              } else {
                return EmptyResponse(res, "No Record found", {});
              }
            }
          });
        } else {
          return EmptyResponse(res, "No Record found", {});
        }
      }
    });
  } catch (e) {
    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "Exception:" + e);
    ErrorResponse(res, e);
  }
};



export const updateClick2CallLiveCall = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      sme_id: parseInt(req.params.id),
      session_id: req.body.session_id,
      schedule_id: req.body.schedule_id,
      duration: req.body.duration,
      dtmf: req.body.dtmf,
      recording_file_id: req.body.recording_file_id,
      call_status: req.body.call_status,
      agent_no: req.body.agent_no,
      response_msg: req.body.response_msg,
      call_status_v2: req.body.call_status_v2,
      call_mode: req.body.callMode,
      campaign_id: req.body.campaign_id ? req.body.campaign_id : 0,
    };

    glogger('IMP', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/updateClick2CallLiveCall', "API Request agentNumber(" + req.body.agent_no + ") ");

    if(reqData['call_mode'] == 6 || reqData['call_mode'] == 7){
      UpdateOutgoingCampaign(reqData, (err: any, response2: any) => {
        if (err) {
          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/updateClick2CallLiveCall', "UpdateOutgoingCampaign, error:" + err);
          return ErrorEmptyResponse(res, err);
        } else {
          UpdateDialersNumbers(reqData, (err: any, response3: any) => {
            if (err) {
              glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/updateClick2CallLiveCall', "UpdateDialersNumbers, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Successfully listed", response3);
            }
          });
        }
      });
     
    }
  } catch (e) {
    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/' + req.params.id + '/getclicktocall', "Exception:" + e);
    ErrorResponse(res, e);
  }
};