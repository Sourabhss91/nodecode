import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, ErrorResWithSuccess, EmptyResponse, NoDataEmptyResponse } from "../../../../helpers/apiResponse";
import {
  UpdateAgentStatusBusy,
  UpdateAgentStatusBusyParallelRinging,
  UpdateBusyAgentTiming,
  UpdateBusyAgentTimingParallelRinging,
  getLastCallAgent,
  getRandomAgent,
  getRandomAgentParallelRinging,
  getSerialAgent,
  getEqualAgent,
  getEqualAgentList,
  getMaximumAgent,
  getOffHoursAgent,
  getEqualAgentCheck,
  getAllAgentsStatus,
  getAgentOffHourStatus,
  getAgentDetail,
} from "../../../../domain/models/ivr.model";
import { fetchAgentstatusRequest, getFreeAgentRequest, getFreeAgentRequestV2, getFreeAgentEqualRequest, getFreeAgentParallelRingingRequest } from "../../../../domain/entities/ivr.entity";
import { calculateDuration, secondsToHms, convertTimeZone } from "../../../../helpers/utility";
import { env } from "../../../../../infrastructure/env";
import { glogger } from "../../../../helpers/logger";

/**
 * get settings.
 *
 * @returns {Object}
 */

export const getFreeAgent = async (req: Request, res: Response) => {
  try {
    let obj: any = {};

    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqDateTime: any = {
      currentDate: getCurrentDate,
    };

    let reqDataOrig: getFreeAgentRequest = {
      sme_id: parseInt(req.params.id),
      g_group: req.body.group,
      //g_agent_ignore_list:req.body.agent_ignore_list.split(","),
      g_agent_ignore_list: req.body.agent_ignore_list != "" ? req.body.agent_ignore_list.split(",") : [],
      g_alogtype: req.body.alogtype,
      g_customer_no: req.body.customer_no,
      g_sme_sticky_algo: parseInt(req.body.sme_sticky_algo),
      currentDate: getCurrentDate,
      g_assigned_agent_sticky_type: parseInt(req.body.assigned_agent_sticky_type),
      g_assigned_agent_sticky_id: parseInt(req.body.assigned_agent_sticky_id),
      g_assigned_vn_agent_id: parseInt(req.body.assigned_vn_agent_id),
    };
    glogger('IMP', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "API Request Customer No:"+ req.body.customer_no);
    await getLastCallAgent(reqDataOrig, (err: any, response: any) => {
      if (err) {
        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getLastCallAgent, error:"+err);
        return ErrorEmptyResponse(res, err);
      } else {
        let a_agent_id;
        let a_agent_status;
        let a_sticky_agent;
        let a_sticky_days;
        let a_last_call_day;
        let a_off_hour_status;

        if (response.length > 0) {
          var data = JSON.parse(JSON.stringify(response[0]));
          a_agent_id = data["agent_id"];
          a_sticky_agent = data["sticky_agent"];
          a_sticky_days = data["sticky_days"];
          a_last_call_day = data["last_call_day"];
          a_agent_status = data["status"];
          a_off_hour_status = data["agent_off_hours_status"];
        }

        console.log(
          "DB Response: agent_id(" +
            a_agent_id +
            "), sticky_agent(" +
            a_sticky_agent +
            "), sticky_days(" +
            a_sticky_days +
            "), last_call_day(" +
            a_last_call_day +
            "), a_agent_status(" +
            a_agent_status +
            "), a_off_hour_status(" +
            a_off_hour_status +
            ")"
        );

        //case when the virual no is already assigned to agent permanent.
        if ((req.body) && (req.body.assigned_vn_agent_id) && (req.body.assigned_vn_agent_id != "")) {

                  //this call virtual no is already assigned to agent.
                  //bypass agent direct agent call
        
                  glogger('IMP', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "("+req.body.customer_no+") call virtual no is assined to AgentId("+req.body.assigned_vn_agent_id+")");
        
                  glogger('IMP', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "API Request agentId:"+ req.body.assigned_vn_agent_id);
        
                  
                    
                        let a_extra_sticky_info = "";
                        let a_extra_status_info = "";                
        
                        if (response.length > 0){
                            var data2 = JSON.parse(JSON.stringify(response[0]));
        
                            glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent',  "getAgentDetail length >0");
        
                          let reqDataNew: any = {
                            agent_id: data2.agent_id,
                          };
        
                          
                            if(data2.agent_off_hours_status == 'off_hours') {
        
                              

                              a_extra_status_info = "off_hours";
        
                              a_extra_sticky_info = " sticky(dedicated_vn) " + a_extra_status_info + "";
        
                              obj["agent_details"] = "";
                              obj["call_reason"] = "dedicated_vn";
                              obj["customer_sticky"] = "2";
                              obj["extra_sticky_info"] = a_extra_sticky_info;
        
                              glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "agent is "+a_extra_sticky_info+"");

                              //return NoDataEmptyResponse(res, "agent not found", obj);
        
                              getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                                if (err) {
                                  glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  obj["all_agent_status"] = response33;
                                  return NoDataEmptyResponse(res, "agent not found", obj);
                                }
                              });
        
        
                            }else if(data2.status == 1) {
        
                              //agent idle so lets make it busy
                              UpdateAgentStatusBusy(reqDataNew, (err: any, response22: any) => {
                                if (err) {
                                  glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "UpdateAgentStatusBusy, error:"+err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  UpdateBusyAgentTiming(reqDataNew, reqDateTime, (err: any, response23: any) => {
                                    if (err) {
                                      glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "UpdateBusyAgentTiming, error:"+err);
                                      return ErrorEmptyResponse(res, err);
                                    } else {
        
                                      /* this means the agent of last patched call is found and that agent is sticky(hard) with the customer */
                                      a_extra_status_info = "idle";
                                      a_extra_sticky_info =  " sticky(dedicated_vn) " + a_extra_status_info + "";
                                      obj["agent_details"] = response;
                                      obj["call_reason"] = "dedicated_vn";
                                      obj["customer_sticky"] = "2";
                                      obj["extra_sticky_info"] = a_extra_sticky_info;
        
                                      glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "agent is "+a_extra_sticky_info+"");
                  
                                      getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                                        if (err) {
                                          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                                          return ErrorEmptyResponse(res, err);
                                        } else {
                                          obj["all_agent_status"] = response33;
                                          return SuccessResponse(res, "found agent", obj);
                                        }
                                      });
                                    }
                                  });
                                }
                              });
        
                            }
                            else if (data2.status == 2) {
        
                              a_extra_status_info = "busy";
        
                              a_extra_sticky_info = " sticky(dedicated_vn) " + a_extra_status_info + "";
        
                              obj["agent_details"] = "";
                              obj["call_reason"] = "dedicated_vn";
                              obj["customer_sticky"] = "2";
                              obj["extra_sticky_info"] = a_extra_sticky_info;

                              glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "agent is "+a_extra_sticky_info+"");
        
                              //return NoDataEmptyResponse(res, "agent not found", obj);
        
                              getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                                if (err) {
                                  glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  obj["all_agent_status"] = response33;
                                  return NoDataEmptyResponse(res, "agent not found", obj);
                                }
                              });
        
                              
                            } else if (data2.status == 4) {
                              a_extra_status_info = "break";
        
                              a_extra_sticky_info = " sticky(dedicated_vn) " + a_extra_status_info + "";
        
                              obj["agent_details"] = "";
                              obj["call_reason"] = "dedicated_vn";
                              obj["customer_sticky"] = "2";
                              obj["extra_sticky_info"] = a_extra_sticky_info;

                              glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "agent is "+a_extra_sticky_info+"");
        
                              //return NoDataEmptyResponse(res, "agent not found", obj);
        
                              getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                                if (err) {
                                  glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  obj["all_agent_status"] = response33;
                                  return NoDataEmptyResponse(res, "agent not found", obj);
                                }
                              });
        
        
                            } else if (data2.status == 0) {
                              a_extra_status_info = "inactive";
        
                              a_extra_sticky_info = " sticky(dedicated_vn) " + a_extra_status_info + "";
        
                              obj["agent_details"] = "";
                              obj["call_reason"] = "dedicated_vn";
                              obj["customer_sticky"] = "2";
                              obj["extra_sticky_info"] = a_extra_sticky_info;

                              glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "agent is "+a_extra_sticky_info+"");
        
                              //return NoDataEmptyResponse(res, "agent not found", obj);
        
                              getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                                if (err) {
                                  glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  obj["all_agent_status"] = response33;
                                  return NoDataEmptyResponse(res, "agent not found", obj);
                                }
                              });
                            } else {
                              a_extra_status_info = "other";
        
                              a_extra_sticky_info = " sticky(dedicated_vn) " + a_extra_status_info + "";
        
                              obj["agent_details"] = "";
                              obj["call_reason"] = "dedicated_vn";
                              obj["customer_sticky"] = "2";
                              obj["extra_sticky_info"] = a_extra_sticky_info;

                              glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "agent is "+a_extra_sticky_info+"");
        
                              //return NoDataEmptyResponse(res, "agent not found", obj);
        
                              getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                                if (err) {
                                  glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  obj["all_agent_status"] = response33;
                                  return NoDataEmptyResponse(res, "agent not found", obj);
                                }
                              });
                            }
        
                         
                        } else {
                          return ErrorResWithSuccess(res, "No record found");
                        }
                      //}
                   //});
        }
        
        //case which is lead already hard sticky.
        else if ((req.body) && (req.body.assigned_agent_sticky_type) && (req.body.assigned_agent_sticky_id) && (req.body.assigned_agent_sticky_type == "2")) {

          //this lead is already assigned to agent and hard sticky so lets find the status of agent and response accordingly.

          glogger('IMP', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "Lead("+req.body.customer_no+") is Hard Sticky with AgentId("+req.body.assigned_agent_sticky_id+")");

          glogger('IMP', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "API Request agentId:"+ req.body.assigned_agent_sticky_id);

          //let reqDataOrig33: any = {
            //agent_id: req.body.assigned_agent_sticky_id,
            //sme_id:parseInt(req.params.id),
            //currentDate: getCurrentDate,
          //};

          //getAgentDetail(reqDataOrig33, (err: any, respLeadHardSticky: any) => {
          //if (err) {
              //glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent',  "getAgentDetail, error:"+err);
              //return ErrorEmptyResponse(res, err);
          //} else {
            
                let a_extra_sticky_info = "";
                let a_extra_status_info = "";                

                if (response.length > 0){
                    var data2 = JSON.parse(JSON.stringify(response[0]));

                    glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent',  "getAgentDetail length >0");

                  let reqDataNew: any = {
                    agent_id: data2.agent_id,
                  };

                  
                    if(data2.agent_off_hours_status == 'off_hours') {

                      a_extra_status_info = "off_hours";

                      a_extra_sticky_info = " sticky(hard) " + a_extra_status_info + "";

                      obj["agent_details"] = "";
                      obj["call_reason"] = "hard_sticky";
                      obj["customer_sticky"] = "2";
                      obj["extra_sticky_info"] = a_extra_sticky_info;

                      //return NoDataEmptyResponse(res, "agent not found", obj);

                      getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                        if (err) {
                          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          obj["all_agent_status"] = response33;
                          return NoDataEmptyResponse(res, "agent not found", obj);
                        }
                      });


                    }else if(data2.status == 1) {

                      //agent idle so lets make it busy
                      UpdateAgentStatusBusy(reqDataNew, (err: any, response22: any) => {
                        if (err) {
                          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "UpdateAgentStatusBusy, error:"+err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          UpdateBusyAgentTiming(reqDataNew, reqDateTime, (err: any, response23: any) => {
                            if (err) {
                              glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "UpdateBusyAgentTiming, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {

                              /* this means the agent of last patched call is found and that agent is sticky(hard) with the customer */
                              a_extra_status_info = "idle";
                              a_extra_sticky_info =  " sticky(hard) " + a_extra_status_info + "";
                              obj["agent_details"] = response;
                              obj["call_reason"] = "hard_sticky";
                              obj["customer_sticky"] = "2";
                              obj["extra_sticky_info"] = a_extra_sticky_info;

                              
          
                              getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                                if (err) {
                                  glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  obj["all_agent_status"] = response33;
                                  return SuccessResponse(res, "found agent", obj);
                                }
                              });
                            }
                          });
                        }
                      });

                    }
                    else if (data2.status == 2) {

                      a_extra_status_info = "busy";

                      a_extra_sticky_info = " sticky(hard) " + a_extra_status_info + "";

                      obj["agent_details"] = "";
                      obj["call_reason"] = "hard_sticky";
                      obj["customer_sticky"] = "2";
                      obj["extra_sticky_info"] = a_extra_sticky_info;

                      //return NoDataEmptyResponse(res, "agent not found", obj);

                      getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                        if (err) {
                          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          obj["all_agent_status"] = response33;
                          return NoDataEmptyResponse(res, "agent not found", obj);
                        }
                      });

                      
                    } else if (data2.status == 4) {
                      a_extra_status_info = "break";

                      a_extra_sticky_info = " sticky(hard) " + a_extra_status_info + "";

                      obj["agent_details"] = "";
                      obj["call_reason"] = "hard_sticky";
                      obj["customer_sticky"] = "2";
                      obj["extra_sticky_info"] = a_extra_sticky_info;

                      //return NoDataEmptyResponse(res, "agent not found", obj);

                      getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                        if (err) {
                          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          obj["all_agent_status"] = response33;
                          return NoDataEmptyResponse(res, "agent not found", obj);
                        }
                      });


                    } else if (data2.status == 0) {
                      a_extra_status_info = "inactive";

                      a_extra_sticky_info = " sticky(hard) " + a_extra_status_info + "";

                      obj["agent_details"] = "";
                      obj["call_reason"] = "hard_sticky";
                      obj["customer_sticky"] = "2";
                      obj["extra_sticky_info"] = a_extra_sticky_info;

                      //return NoDataEmptyResponse(res, "agent not found", obj);

                      getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                        if (err) {
                          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          obj["all_agent_status"] = response33;
                          return NoDataEmptyResponse(res, "agent not found", obj);
                        }
                      });
                    } else {
                      a_extra_status_info = "other";

                      a_extra_sticky_info = " sticky(hard) " + a_extra_status_info + "";

                      obj["agent_details"] = "";
                      obj["call_reason"] = "hard_sticky";
                      obj["customer_sticky"] = "2";
                      obj["extra_sticky_info"] = a_extra_sticky_info;

                      //return NoDataEmptyResponse(res, "agent not found", obj);

                      getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                        if (err) {
                          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          obj["all_agent_status"] = response33;
                          return NoDataEmptyResponse(res, "agent not found", obj);
                        }
                      });
                    }

                 
                } else {
                  return ErrorResWithSuccess(res, "No record found");
                }
              //}
           //});
        }
        //case which is lead already soft sticky.
        else if ((req.body) && (req.body.assigned_agent_sticky_type) && (req.body.assigned_agent_sticky_id) && (req.body.assigned_agent_sticky_type == "1") && (a_agent_status == 1) && (a_off_hour_status != "off_hours")) {

          //this lead is already assigned to agent and hard sticky so lets find the status of agent and response accordingly.

          glogger('IMP', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "Lead("+req.body.customer_no+") is soft Sticky with AgentId("+req.body.assigned_agent_sticky_id+") and Agent idle");

          glogger('IMP', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "API Request agentId:"+ req.body.assigned_agent_sticky_id);

          //let reqDataOrig33: any = {
            //agent_id: req.body.assigned_agent_sticky_id,
            //sme_id:parseInt(req.params.id),
            //currentDate: getCurrentDate,
          //};

          //getAgentDetail(reqDataOrig33, (err: any, respLeadHardSticky: any) => {
          //if (err) {
              //glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent',  "getAgentDetail, error:"+err);
              //return ErrorEmptyResponse(res, err);
          //} else {
            
                let a_extra_sticky_info = "";
                let a_extra_status_info = "";                

                if (response.length > 0){
                    var data2 = JSON.parse(JSON.stringify(response[0]));

                    glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent',  "getAgentDetail length >0");

                  let reqDataNew: any = {
                    agent_id: data2.agent_id,
                  };

                  
                    if(data2.agent_off_hours_status == 'off_hours') {

                      a_extra_status_info = "off_hours";

                      a_extra_sticky_info = " sticky(soft) " + a_extra_status_info + "";

                      obj["agent_details"] = "";
                      obj["call_reason"] = "soft_sticky";
                      obj["customer_sticky"] = "1";
                      obj["extra_sticky_info"] = a_extra_sticky_info;

                      //return NoDataEmptyResponse(res, "agent not found", obj);

                      getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                        if (err) {
                          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          obj["all_agent_status"] = response33;
                          return NoDataEmptyResponse(res, "agent not found", obj);
                        }
                      });


                    }else if(data2.status == 1) {

                      //agent idle so lets make it busy
                      UpdateAgentStatusBusy(reqDataNew, (err: any, response22: any) => {
                        if (err) {
                          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "UpdateAgentStatusBusy, error:"+err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          UpdateBusyAgentTiming(reqDataNew, reqDateTime, (err: any, response23: any) => {
                            if (err) {
                              glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "UpdateBusyAgentTiming, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {

                              /* this means the agent of last patched call is found and that agent is sticky(soft) with the customer */
                              a_extra_status_info = "idle";
                              a_extra_sticky_info =  " sticky(soft) " + a_extra_status_info + "";
                              obj["agent_details"] = response;
                              obj["call_reason"] = "soft_sticky";
                              obj["customer_sticky"] = "1";
                              obj["extra_sticky_info"] = a_extra_sticky_info;

                              
          
                              getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                                if (err) {
                                  glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  obj["all_agent_status"] = response33;
                                  return SuccessResponse(res, "found agent", obj);
                                }
                              });
                            }
                          });
                        }
                      });

                    }
                    else if (data2.status == 2) {

                      a_extra_status_info = "busy";

                      a_extra_sticky_info = " sticky(soft) " + a_extra_status_info + "";

                      obj["agent_details"] = "";
                      obj["call_reason"] = "soft_sticky";
                      obj["customer_sticky"] = "1";
                      obj["extra_sticky_info"] = a_extra_sticky_info;

                      //return NoDataEmptyResponse(res, "agent not found", obj);

                      getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                        if (err) {
                          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          obj["all_agent_status"] = response33;
                          return NoDataEmptyResponse(res, "agent not found", obj);
                        }
                      });

                      
                    } else if (data2.status == 4) {
                      a_extra_status_info = "break";

                      a_extra_sticky_info = " sticky(soft) " + a_extra_status_info + "";

                      obj["agent_details"] = "";
                      obj["call_reason"] = "soft_sticky";
                      obj["customer_sticky"] = "1";
                      obj["extra_sticky_info"] = a_extra_sticky_info;

                      //return NoDataEmptyResponse(res, "agent not found", obj);

                      getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                        if (err) {
                          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          obj["all_agent_status"] = response33;
                          return NoDataEmptyResponse(res, "agent not found", obj);
                        }
                      });


                    } else if (data2.status == 0) {
                      a_extra_status_info = "inactive";

                      a_extra_sticky_info = " sticky(soft) " + a_extra_status_info + "";

                      obj["agent_details"] = "";
                      obj["call_reason"] = "soft_sticky";
                      obj["customer_sticky"] = "1";
                      obj["extra_sticky_info"] = a_extra_sticky_info;

                      //return NoDataEmptyResponse(res, "agent not found", obj);

                      getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                        if (err) {
                          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          obj["all_agent_status"] = response33;
                          return NoDataEmptyResponse(res, "agent not found", obj);
                        }
                      });
                    } else {
                      a_extra_status_info = "other";

                      a_extra_sticky_info = " sticky(soft) " + a_extra_status_info + "";

                      obj["agent_details"] = "";
                      obj["call_reason"] = "soft_sticky";
                      obj["customer_sticky"] = "1";
                      obj["extra_sticky_info"] = a_extra_sticky_info;

                      //return NoDataEmptyResponse(res, "agent not found", obj);

                      getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                        if (err) {
                          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          obj["all_agent_status"] = response33;
                          return NoDataEmptyResponse(res, "agent not found", obj);
                        }
                      });
                    }

                 
                } else {
                  return ErrorResWithSuccess(res, "No record found");
                }
              //}
           //});


        }else if (a_agent_id && a_sticky_agent == 2 && a_sticky_days > 0 && a_last_call_day < a_sticky_days) {
          //hard sticky case handling
          console.log("Agent " + a_agent_id + " is hard sticky");
          let reqData: fetchAgentstatusRequest = {
            agent_id: a_agent_id,
          };
          let currentDate = Date();
          let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
          let reqDateTime: any = {
            currentDate: getCurrentDate,
          };

          if (a_agent_status == 1 && a_off_hour_status == "available") {
            UpdateAgentStatusBusy(reqData, (err: any, response22: any) => {
              if (err) {
                glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "UpdateAgentStatusBusy, error:"+err);
                return ErrorEmptyResponse(res, err);
              } else {
                UpdateBusyAgentTiming(reqData, reqDateTime, (err: any, response23: any) => {
                  if (err) {
                    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "UpdateBusyAgentTiming, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    /* this means the agent of last patched call is found and that agent is sticky(hard) with the customer */
                    obj["agent_details"] = response;
                    obj["call_reason"] = "hard_sticky";
                    obj["customer_sticky"] = "2";
                    obj["extra_sticky_info"] = "";

                    getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                      if (err) {
                        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        obj["all_agent_status"] = response33;
                        return SuccessResponse(res, "found agent", obj);
                      }
                    });
                  }
                });
              }
            });
          } else {
            let a_extra_sticky_info = "";
            let a_extra_status_info = "";

            if (a_off_hour_status == "available") {
              if (a_agent_status == 2) {
                a_extra_status_info = "busy";
              } else if (a_agent_status == 4) {
                a_extra_status_info = "break";
              } else if (a_agent_status == 0) {
                a_extra_status_info = "inactive";
              } else {
                a_extra_status_info = "other";
              }
            } else if (a_off_hour_status == "off_hours") {
              a_extra_status_info = "off_hours";
            } else {
              a_extra_status_info = "other";
            }

            a_extra_sticky_info = "" + a_agent_id + " sticky(hard) " + a_extra_status_info + "";

            obj["agent_details"] = response;
            obj["call_reason"] = "hard_sticky";
            obj["customer_sticky"] = "2";
            obj["extra_sticky_info"] = a_extra_sticky_info;

            //return NoDataEmptyResponse(res, "agent not found", obj);

            getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
              if (err) {
                glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                return ErrorEmptyResponse(res, err);
              } else {
                obj["all_agent_status"] = response33;
                return NoDataEmptyResponse(res, "agent not found", obj);
              }
            });
          }
        } else if (a_agent_id && a_sticky_agent == 1 && a_sticky_days > 0 && a_last_call_day < a_sticky_days && a_agent_status == 1 && a_off_hour_status == "available") {
          //soft sticky case handling.
          console.log("Agent " + a_agent_id + " is soft sticky");

          let reqData: fetchAgentstatusRequest = {
            agent_id: data["agent_id"],
          };
          let currentDate = Date();
          let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);

          let reqDateTime: any = {
            currentDate: getCurrentDate,
          };
          UpdateAgentStatusBusy(reqData, (err: any, response22: any) => {
            if (err) {
              glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "UpdateAgentStatusBusy, error:"+err);
              return ErrorEmptyResponse(res, err);
            } else {
              UpdateBusyAgentTiming(reqData, reqDateTime, (err: any, response22: any) => {
                if (err) {
                  glogger('ERR',""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "UpdateBusyAgentTiming, error:"+err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  /* this means the agent of last patched call is found and that agent is sticky(soft) with the customer */
                  obj["agent_details"] = response;
                  obj["call_reason"] = "soft_sticky";
                  obj["customer_sticky"] = "1";
                  obj["extra_sticky_info"] = "";

                  getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                    if (err) {
                      glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      obj["all_agent_status"] = response33;
                      return SuccessResponse(res, "found agent", obj);
                    }
                  });
                }
              });
            }
          });
        } else {
          let a_extra_sticky_info = "";
          if (a_agent_id && a_sticky_agent == 1 && a_sticky_days > 0 && a_last_call_day < a_sticky_days) {
            let a_extra_sticky_info = "";
            let a_extra_status_info = "";

            if (a_off_hour_status == "available") {
              if (a_agent_status == 2) {
                a_extra_status_info = "busy";
              } else if (a_agent_status == 4) {
                a_extra_status_info = "break";
              } else if (a_agent_status == 0) {
                a_extra_status_info = "inactive";
              } else {
                a_extra_status_info = "other";
              }
            } else if (a_off_hour_status == "off_hours") {
              a_extra_status_info = "off_hours";
            } else {
              a_extra_status_info = "other";
            }

            a_extra_sticky_info = "" + a_agent_id + " was sticky(soft) but " + a_extra_status_info + "";
          }



          if (req.body.alogtype == "Random") {
            console.log("lets find the Random agent..");
            getRandomAgent(reqDataOrig, (err: any, responseRand: any) => {
              if (err) {
                glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getRandomAgent, error:"+err);
                return ErrorEmptyResponse(res, err);
              } else {

                if (responseRand[0]) {
                  var data = JSON.parse(JSON.stringify(responseRand[0]));

                  let reqData: fetchAgentstatusRequest = {
                    agent_id: data["agent_id"],
                  };
                  let currentDate = Date();
                  let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
                  let reqDateTime: any = {
                    currentDate: getCurrentDate,
                  };
                  UpdateAgentStatusBusy(reqData, (err: any, response: any) => {
                    if (err) {
                      glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "UpdateAgentStatusBusy, error:"+err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      UpdateBusyAgentTiming(reqData, reqDateTime, (err: any, response22: any) => {
                        if (err) {
                          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "UpdateBusyAgentTiming, error:"+err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          /* this means the agent of last patched call is found and that agent is sticky(hard) with the customer */
                          obj["agent_details"] = responseRand;
                          obj["customer_sticky"] = "0";
                          obj["call_reason"] = "random";
                          obj["extra_sticky_info"] = a_extra_sticky_info;
                          //return SuccessResponse(res, "found agent", obj);

                          getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                            if (err) {
                              glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              obj["all_agent_status"] = response33;
                              return SuccessResponse(res, "found agent", obj);
                            }
                          });
                        }
                      });
                    }
                  });
                } else {
                  /* in case agent not found check the table if all are offhour or bussy */
                  getOffHoursAgent(reqDataOrig, (err: any, response3: any) => {
                    if (err) {
                      glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getOffHoursAgent, error:"+err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      if (response3[0]) {
                        var data3 = JSON.parse(JSON.stringify(response3[0]));
                        if (data3["not_offhours_agents_count"] > 0) {
                          obj["agent_details"] = "";
                          obj["customer_sticky"] = "0";
                          obj["call_reason"] = "busy";
                          obj["extra_sticky_info"] = a_extra_sticky_info;
                          //return NoDataEmptyResponse(res, "agent not found", obj);
                          getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                            if (err) {
                              glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              obj["all_agent_status"] = response33;
                              return NoDataEmptyResponse(res, "agent not found", obj);
                            }
                          });
                        } else {
                          obj["agent_details"] = "";
                          obj["call_reason"] = "offhour";
                          obj["customer_sticky"] = "0";
                          obj["extra_sticky_info"] = a_extra_sticky_info;
                          //return NoDataEmptyResponse(res, "agent not found", obj);

                          getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                            if (err) {
                              glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              obj["all_agent_status"] = response33;
                              return NoDataEmptyResponse(res, "agent not found", obj);
                            }
                          });
                        }
                      } else {
                        obj["agent_details"] = "";
                        obj["call_reason"] = "offhour";
                        obj["customer_sticky"] = "0";
                        obj["extra_sticky_info"] = a_extra_sticky_info;
                        //return NoDataEmptyResponse(res, "agent not found", obj);

                        getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                          if (err) {
                            glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            obj["all_agent_status"] = response33;
                            return NoDataEmptyResponse(res, "agent not found", obj);
                          }
                        });
                      }
                    }
                  });
                }

                
              }
            });
          } else if (req.body.alogtype == "Serial Hunting") {
            getSerialAgent(reqDataOrig, (err: any, responseSH: any) => {
              if (err) {
                glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getSerialAgent, error:"+err);
                return ErrorEmptyResponse(res, err);
              } else {
                if (responseSH[0]) {
                  var data = JSON.parse(JSON.stringify(responseSH[0]));

                  let reqData: fetchAgentstatusRequest = {
                    agent_id: data["agent_id"],
                  };
                  let currentDate = Date();
                  let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
                  let reqDateTime: any = {
                    currentDate: getCurrentDate,
                  };
                  UpdateAgentStatusBusy(reqData, (err: any, response: any) => {
                    if (err) {
                      glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "UpdateAgentStatusBusy, error:"+err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      UpdateBusyAgentTiming(reqData, reqDateTime, (err: any, response22: any) => {
                        if (err) {
                          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "UpdateBusyAgentTiming, error:"+err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          /* this means the agent of last patched call is found and that agent is sticky(hard) with the customer */
                          obj["agent_details"] = responseSH;
                          obj["call_reason"] = "sh";
                          obj["customer_sticky"] = "0";
                          obj["extra_sticky_info"] = a_extra_sticky_info;
                          //return SuccessResponse(res, "found agent", obj);

                          getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                            if (err) {
                              glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              obj["all_agent_status"] = response33;
                              return SuccessResponse(res, "found agent", obj);
                            }
                          });
                        }
                      });
                    }
                  });
                } else {
                  /* in case agent not found check the table if all are offhour or bussy */
                  getOffHoursAgent(reqDataOrig, (err: any, response4: any) => {
                    if (err) {
                      glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getOffHoursAgent, error:"+err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      if (response4[0]) {
                        var data3 = JSON.parse(JSON.stringify(response4[0]));
                        if (data3["not_offhours_agents_count"] > 0) {
                          obj["agent_details"] = "";
                          obj["call_reason"] = "busy";
                          obj["customer_sticky"] = "0";
                          obj["extra_sticky_info"] = a_extra_sticky_info;
                          //return NoDataEmptyResponse(res, "agent not found", obj);
                          getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                            if (err) {
                              glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              obj["all_agent_status"] = response33;
                              return NoDataEmptyResponse(res, "agent not found", obj);
                            }
                          });
                        } else {
                          obj["agent_details"] = "";
                          obj["call_reason"] = "offhour";
                          obj["customer_sticky"] = "0";
                          obj["extra_sticky_info"] = a_extra_sticky_info;
                          //return NoDataEmptyResponse(res, "agent not found", obj);
                          getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                            if (err) {
                              glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              obj["all_agent_status"] = response33;
                              return NoDataEmptyResponse(res, "agent not found", obj);
                            }
                          });
                        }
                      } else {
                        obj["agent_details"] = "";
                        obj["call_reason"] = "offhour";
                        obj["customer_sticky"] = "0";
                        obj["extra_sticky_info"] = a_extra_sticky_info;
                        //return NoDataEmptyResponse(res, "agent not found", obj);
                        getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                          if (err) {
                            glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            obj["all_agent_status"] = response33;
                            return NoDataEmptyResponse(res, "agent not found", obj);
                          }
                        });
                      }
                    }
                  });
                }
              }
            });
          } else if (req.body.alogtype == "Even Call Distribution") {
            getMaximumAgent(reqDataOrig, (err: any, response2: any) => {
              if (err) {
                glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getMaximumAgent, error:"+err);
                return ErrorEmptyResponse(res, err);
              } else {
                if (response2[0]) {
                  var data = JSON.parse(JSON.stringify(response2[0]));

                  let currentDate = Date();
                  let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
                  let reqDateTime: any = {
                    currentDate: getCurrentDate,
                  };

                  let reqDataNew: getFreeAgentEqualRequest = {
                    sme_id: parseInt(req.params.id),
                    g_group: req.body.group,
                    g_agent_ignore_list: req.body.agent_ignore_list.split(","),
                    g_alogtype: req.body.alogtype,
                    g_customer_no: req.body.customer_no,
                    g_sme_sticky_algo: parseInt(req.body.sme_sticky_algo),
                    g_total_agent_count: data["total_count"],
                    currentDate: getCurrentDate,
                  };

                  getEqualAgentCheck(reqDataNew, (err: any, responseAgent: any) => {
                    if (err) {
                      glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getEqualAgentCheck, error:"+err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      reqDataNew.agentId = responseAgent;
                      //console.log("responseAgent",responseAgent)
                      /*let agentIdNotCall : any = 0;
                              if(responseAgent.length > 0){
                                let resultAgent: any = responseAgent.map((s:any) =>{return s.agent_id})
                                //console.log("resultAgent",resultAgent)
                                let totalCallagent: any = {};
                                resultAgent.forEach((x: string | number) => {
                                  totalCallagent[x] = (totalCallagent[x] || 0) + 1;
                                });
                                let totalCallagentArr: any = Object.values(totalCallagent)
                                let minVal:any = Math.min(...totalCallagentArr)
                                agentIdNotCall = Object.keys(totalCallagent).find(key => totalCallagent[key] === minVal)
                              }
                              if(agentIdNotCall != 0){
                                reqDataNew.agentId = agentIdNotCall
                              }*/
                      //console.log('reqDataNew',reqDataNew)
                      //console.log('agentIdNotCall',agentIdNotCall)

                      getEqualAgentList(reqDataNew, (err: any, responseECD: any) => {
                        if (err) {
                          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getEqualAgentList, error:"+err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          //console.log('responseECD',responseECD)
                          if (responseECD[0]) {
                            var data = JSON.parse(JSON.stringify(responseECD[0]));

                            let reqData: fetchAgentstatusRequest = {
                              agent_id: data["agent_id"],
                            };
                            let currentDate = Date();
                            let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
                            let reqDateTime: any = {
                              currentDate: getCurrentDate,
                            };
                            UpdateAgentStatusBusy(reqData, (err: any, response: any) => {
                              if (err) {
                                glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "UpdateAgentStatusBusy, error:"+err);
                                return ErrorEmptyResponse(res, err);
                              } else {
                                UpdateBusyAgentTiming(reqData, reqDateTime, (err: any, response22: any) => {
                                  if (err) {
                                    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "UpdateBusyAgentTiming, error:"+err);
                                    return ErrorEmptyResponse(res, err);
                                  } else {
                                    /* this means the agent of last patched call is found and that agent is sticky(hard) with the customer */
                                    obj["agent_details"] = responseECD;
                                    obj["call_reason"] = "ecd";
                                    obj["customer_sticky"] = "0";
                                    //return SuccessResponse(res, "found agent", obj);
                                    getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                                      if (err) {
                                        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                        obj["all_agent_status"] = response33;
                                        return SuccessResponse(res, "found agent", obj);
                                      }
                                    });
                                  }
                                });
                              }
                            });
                          } else {
                            /* in case agent not found check the table if all are offhour or bussy */
                            getOffHoursAgent(reqDataOrig, (err: any, response4: any) => {
                              if (err) {
                                glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getOffHoursAgent, error:"+err);
                                return ErrorEmptyResponse(res, err);
                              } else {
                                if (response4[0]) {
                                  var data3 = JSON.parse(JSON.stringify(response4[0]));
                                  if (data3["not_offhours_agents_count"] > 0) {
                                    obj["agent_details"] = "";
                                    obj["call_reason"] = "busy";
                                    obj["customer_sticky"] = "0";
                                    //return NoDataEmptyResponse(res, "agent not found", obj);
                                    getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                                      if (err) {
                                        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                        obj["all_agent_status"] = response33;
                                        return NoDataEmptyResponse(res, "agent not found", obj);
                                      }
                                    });
                                  } else {
                                    obj["agent_details"] = "";
                                    obj["call_reason"] = "offhour";
                                    obj["customer_sticky"] = "0";
                                    //return NoDataEmptyResponse(res, "agent not found", obj);
                                    getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                                      if (err) {
                                        glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                                        return ErrorEmptyResponse(res, err);
                                      } else {
                                        obj["all_agent_status"] = response33;
                                        return NoDataEmptyResponse(res, "agent not found", obj);
                                      }
                                    });
                                  }
                                } else {
                                  obj["agent_details"] = "";
                                  obj["call_reason"] = "offhour";
                                  obj["customer_sticky"] = "0";
                                  //return NoDataEmptyResponse(res, "agent not found", obj);
                                  getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                                    if (err) {
                                      glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      obj["all_agent_status"] = response33;
                                      return NoDataEmptyResponse(res, "agent not found", obj);
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
                  /* in case agent not found check the table if all are offhour or bussy */
                  getOffHoursAgent(reqDataOrig, (err: any, response4: any) => {
                    if (err) {
                      glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getOffHoursAgent, error:"+err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      if (response4[0]) {
                        var data3 = JSON.parse(JSON.stringify(response4[0]));
                        if (data3["not_offhours_agents_count"] > 0) {
                          obj["agent_details"] = "";
                          obj["call_reason"] = "busy";
                          obj["customer_sticky"] = "0";
                          //return NoDataEmptyResponse(res, "agent not found", obj);
                          getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                            if (err) {
                              glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              obj["all_agent_status"] = response33;
                              return NoDataEmptyResponse(res, "agent not found", obj);
                            }
                          });
                        } else {
                          obj["agent_details"] = "";
                          obj["call_reason"] = "offhour";
                          obj["customer_sticky"] = "0";
                          //return NoDataEmptyResponse(res, "agent not found", obj);

                          getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                            if (err) {
                              glogger('ERR',""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              obj["all_agent_status"] = response33;
                              return NoDataEmptyResponse(res, "agent not found", obj);
                            }
                          });
                        }
                      } else {
                        obj["agent_details"] = "";
                        obj["call_reason"] = "offhour";
                        obj["customer_sticky"] = "0";
                        //return NoDataEmptyResponse(res, "agent not found", obj);
                        getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
                          if (err) {
                            glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            obj["all_agent_status"] = response33;
                            return NoDataEmptyResponse(res, "agent not found", obj);
                          }
                        });
                      }
                    }
                  });
                }
              }
            });
          } else {
            getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
              if (err) {
                glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                return ErrorEmptyResponse(res, err);
              } else {
                obj["all_agent_status"] = response33;
                return NoDataEmptyResponse(res, "agent not found", obj);
              }
            });
          }
        }
      }
    });
  } catch (e) {
    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "Exception:"+e);
    ErrorResponse(res, e);
  }
};





export const getFreeAgentParallelRinging = async (req: Request, res: Response) => {
  try {
    let obj: any = {};

    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqDateTime: any = {
      currentDate: getCurrentDate,
    };

    let reqDataOrig: getFreeAgentParallelRingingRequest = {
      sme_id: parseInt(req.params.id),
      g_group: req.body.group,
      //g_agent_ignore_list:req.body.agent_ignore_list.split(","),
      g_agent_ignore_list: req.body.agent_ignore_list != "" ? req.body.agent_ignore_list.split(",") : [],
      g_alogtype: req.body.alogtype,
      g_customer_no: req.body.customer_no,
      g_sme_sticky_algo: parseInt(req.body.sme_sticky_algo),
      g_total_agents: parseInt(req.body.total_agents),
      currentDate: getCurrentDate,
    };
    glogger('IMP', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgentParallelRinging', "API Request Customer No:"+ req.body.customer_no);



    let a_extra_sticky_info = "";
    let a_extra_status_info = "";
    let agentIdArray: any = [];

    if (req.body.alogtype == "Random") {
      getRandomAgentParallelRinging(reqDataOrig, (err: any, responseRand: any) => {
        if (err) {
          glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgentParallelRinging', "getRandomAgentParallelRinging, error:"+err);
          return ErrorEmptyResponse(res, err);
        } else {
          
          if (responseRand && responseRand.length > 0) {
            responseRand.forEach(function(element: any) { 
              agentIdArray.push(element.agent_id);
            });
            
            let reqData: fetchAgentstatusRequest = {
              agent_id: agentIdArray,
            };

            UpdateAgentStatusBusyParallelRinging(reqData, (err: any, response: any) => {
              if (err) {
                glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "UpdateAgentStatusBusyParallelRinging, error:"+err);
                return ErrorEmptyResponse(res, err);
              } else {
                UpdateBusyAgentTimingParallelRinging(reqData, reqDateTime, (err: any, response22: any) => {
                  if (err) {
                    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "UpdateBusyAgentTiming, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    /* this means the agent of last patched call is found and that agent is sticky(hard) with the customer */
                    obj["agent_details"] = responseRand;
                    obj["customer_sticky"] = "0";
                    obj["call_reason"] = "random";
                    obj["extra_sticky_info"] = a_extra_sticky_info;
                    return SuccessResponse(res, "found agent", obj);
                   
                  }
                });
              }
            });
          } else {
            obj["agent_details"] = "";
            obj["call_reason"] = "offhour";
            obj["customer_sticky"] = "0";
            obj["extra_sticky_info"] = a_extra_sticky_info;
            //return NoDataEmptyResponse(res, "agent not found", obj);

            getAllAgentsStatus(reqDataOrig, (err: any, response33: any) => {
              if (err) {
                glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgent', "getAllAgentsStatus, error:"+err);
                return ErrorEmptyResponse(res, err);
              } else {
                obj["all_agent_status"] = response33;
                return NoDataEmptyResponse(res, "agent not found", obj);
              }
            });
          }
        }
      });
    } 


  } catch (e) {
    glogger('ERR', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/getFreeAgentParallelRinging', "Exception:"+e);
    ErrorResponse(res, e);
  }
};