import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, ErrorResWithSuccess, EmptyResponse, NoDataEmptyResponse } from "../../../../helpers/apiResponse";
import {
  CheckAgentExtension,
  FindAgentExtensionDetails,
  UpdateAgentStatusFree,
  UpdateAgentStatusBusy,
  UpdateBusyAgentTiming,
  UpdateFreeAgentiming,
  getResponseMessageCdr,
  InsertAgentReport,
  UpdateAgentDetails,
  GetCountAgentCall,
  UpdateAgentCalling,
  InsertAgentCalling,
  UpdateAgentCallThroughMode,
  UpdateAgentCallSuccessFail,
  FindAgentFullDetails,
  getLastCallAgent,
  getRandomAgent,
  getSerialAgent,
  getEqualAgent,
  getMaximumAgent,
  getOffHoursAgent,
  InsertCustomerReport,
  getSmeRecordData,
  getAgentDetailsData,
  FindAgentDetailById,
} from "../../../../domain/models/ivr.model";
import {
  agentExtentionRequest,
  fetchAgentstatusRequest,
  addAgentCdrRequest,
  fetchAgentOutRequest,
  getFreeAgentRequest,
  getFreeAgentEqualRequest,
  addCustomerCdrRequest,
} from "../../../../domain/entities/ivr.entity";
import { calculateDuration, secondsToHms, convertTimeZone } from "../../../../helpers/utility";
import { env } from "../../../../../infrastructure/env";
import { glogger } from "../../../../helpers/logger";

/**
 * get settings.
 *
 * @returns {Object}
 */

export const agentExtention = async (req: Request, res: Response) => {
  try {
    let reqData: agentExtentionRequest = {
      sme_id: parseInt(req.params.id),
      in_agent_ext: req.body.in_agent_ext,
    };
    glogger("IMP", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/agentExtention", "API Request in_agent_ext:" + req.body.in_agent_ext);

    await CheckAgentExtension(reqData, (err: any, response: any) => {
      if (err) {
        glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/agentExtention", "CheckAgentExtension, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          var data = JSON.parse(JSON.stringify(response[0]));
          if (data["in_agent_cnt"] == 1) {
            FindAgentExtensionDetails(reqData, (err: any, response2: any) => {
              if (err) {
                glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/agentExtention", "FindAgentExtensionDetails, error:" + err);
                return ErrorEmptyResponse(res, err);
              } else {
                let reqDataNew: fetchAgentstatusRequest = {
                  agent_id: response2[0].in_agent_id,
                };

                UpdateAgentStatusBusy(reqDataNew, (err: any, response1: any) => {
                  if (err) {
                    glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/agentExtention", "UpdateAgentStatusBusy, error:" + err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let currentDate = Date();
                    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
                    let reqDateTime: any = {
                      currentDate: getCurrentDate,
                    };

                    UpdateBusyAgentTiming(reqDataNew, reqDateTime, (err: any, response3: any) => {
                      if (err) {
                        glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/agentExtention", "UpdateBusyAgentTiming, error:" + err);
                        return ErrorEmptyResponse(response3, err);
                      } else {
                        glogger("DEB", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/agentExtention", "SuccessResponse");
                        return SuccessResponse(res, "Successfully listed", response2);
                      }
                    });
                  }
                });
              }
            });
          } else {
            return EmptyResponse(res, "invalid extention", "0");
          }
        }
      }
    });
  } catch (e) {
    glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/agentExtention", "Exception:" + e);
    ErrorResponse(res, e);
  }
};

export const setAgentFree = async (req: Request, res: Response) => {
  try {
    let reqData: fetchAgentstatusRequest = {
      agent_id: parseInt(req.params.id),
    };

    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqDateTime: any = {
      currentDate: getCurrentDate,
    };
    glogger("IMP", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentFree", "API Request");
    glogger("CDR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentFree", "Free Agent " + req.params.id + "");

    await UpdateAgentStatusFree(reqData, (err: any, response: any) => {
      if (err) {
        glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentFree", "UpdateAgentStatusFree, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if(response[1] == 1){
          glogger("IMP", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentFree", "UpdateAgentStatusFree Successfully update status in agent_details");
          glogger("CDR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentFree", "UpdateAgentStatusFree Successfully update status in agent_details");
        } else {
          glogger("IMP", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentFree", "UpdateAgentStatusFree Not update status in agent_details");
          glogger("CDR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentFree", "UpdateAgentStatusFree Not update status in agent_details");
        }
        UpdateFreeAgentiming(reqData, reqDateTime, (err: any, response1: any) => {
          if (err) {
            glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentFree", "UpdateFreeAgentiming, error:" + err);
            return ErrorEmptyResponse(res, err);
          } else {
            if(response1[1] == 1){
              glogger("IMP", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentFree", "UpdateFreeAgentiming Successfully update status in agent_details_timing");
              glogger("CDR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentFree", "UpdateFreeAgentiming Successfully update status in agent_details_timing");
            } else {
              glogger("IMP", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentFree", "UpdateFreeAgentiming Not update status in agent_details_timing");
              glogger("CDR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentFree", "UpdateFreeAgentiming Not update status in agent_details_timing");
            }
            FindAgentDetailById(reqData, (err: any, FindAgentDetailByIdResponse: any) => {
              if (err) {
                glogger("ERR", "" + req.headers.sessionid + "", "/ivr/setAgentFree", "FindAgentDetailById, error:" + err);
                return ErrorEmptyResponse(res, err);
              } else {
                if (FindAgentDetailByIdResponse[0].status == 2) {
                  glogger("DEB", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentFree", "Agent is still busy I am going to retry it");
                  UpdateAgentStatusFree(reqData, (err: any, response2: any) => {
                    if (err) {
                      glogger("ERR", "", "/ivr/" + req.body.agentNumber + "/setAgentFree", "UpdateAgentStatusFree retry, error:" + err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      UpdateFreeAgentiming(reqData, reqDateTime, (err: any, response3: any) => {
                        if (err) {
                          glogger("ERR", "", "/ivr/" + req.body.agentNumber + "/setAgentFree", "UpdateFreeAgentiming retry, error:" + err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          glogger("DEB", "", "/ivr/" + req.body.agentNumber + "/setAgentFree", "UpdateFreeAgentiming Agent is free on retry");
                          return SuccessResponse(res, "Agent Released Successfully", FindAgentDetailByIdResponse);
                        }
                      });
                    }
                  });
                } else {
                  glogger("DEB", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentFree", "Agent is free now");
                  return SuccessResponse(res, "Successfully listed", FindAgentDetailByIdResponse);
                }
              }
            });
          }
        });
      }
    });
  } catch (e) {
    glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentFree", "Exception:" + e);
    ErrorResponse(res, e);
  }
};

export const setAgentBusy = async (req: Request, res: Response) => {
  try {
    let reqData: fetchAgentstatusRequest = {
      agent_id: parseInt(req.params.id),
    };
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqDateTime: any = {
      currentDate: getCurrentDate,
    };
    glogger("IMP", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentBusy", "API Request");

    glogger("CDR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentBusy", "Free Agent " + req.params.id + "");
    await UpdateAgentStatusBusy(reqData, (err: any, response: any) => {
      if (err) {
        glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentBusy", "UpdateAgentStatusBusy, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        UpdateBusyAgentTiming(reqData, reqDateTime, (err: any, response2: any) => {
          if (err) {
            glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentBusy", "UpdateBusyAgentTiming, error:" + err);
            return ErrorEmptyResponse(res, err);
          } else {
            glogger("DEB", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentBusy", "SuccessResponse");
            return SuccessResponse(res, "Successfully listed", response2);
          }
        });
      }
    });
  } catch (e) {
    glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentBusy", "Exception:" + e);
    ErrorResponse(res, e);
  }
};

export const setAgentCdr = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqDateTime: any = {
      currentDate: getCurrentDate,
    };
    let reqData: addAgentCdrRequest = {
      sme_id: parseInt(req.params.id),
      g_inflag: req.body.inflag,
      g_agentgroup: req.body.agentgroup ? req.body.agentgroup : "",
      g_agentId: req.body.agentId,
      g_groupId: req.body.groupId,
      g_status: req.body.status ? req.body.status : 0,
      g_responseCode: req.body.responseCode,
      g_duration: req.body.duration,
      endDate: req.body.endDate,
      startDate: req.body.startDate,
      g_customerAni: req.body.customerAni,
      g_sessionCall: req.body.sessionCall,
      g_mode: req.body.mode,
      g_callInfo: req.body.callInfo,
      connectedDuration: req.body.connectedDuration ? req.body.connectedDuration : 0,
      ringingDuration: req.body.ringingDuration ? req.body.ringingDuration : 0,
      callRouteReason: req.body.callRouteReason ? req.body.callRouteReason : "",
      recentCallDateTime: req.body.endDate,
      overallCallStatus: req.body.overallCallStatus ? req.body.overallCallStatus : "",
      agentNumber: req.body.agentNumber ? req.body.agentNumber : 0,
    };
    glogger("IMP", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentCdr", "API Request agentId(" + req.body.agentId + "), customerAni(" + req.body.customerAni + ")");
    await getResponseMessageCdr(reqData, (err: any, response2: any) => {
      if (err) {
        glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentCdr", "getResponseMessageCdr, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        var data2 = JSON.parse(JSON.stringify(response2[0]));
        // var in_response_message = data2.in_response_message;
        //   var in_response_message = data2.in_response_message.concat('('+req.body.g_responseCode+')');

        let appenddata: any = {
          in_response_message: data2.in_response_message.concat("(" + req.body.responseCode + ")"),
          currentDate: getCurrentDate,
        };
        InsertAgentReport(reqData, appenddata, (err: any, response3: any) => {
          if (err) {
            glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentCdr", "InsertAgentReport, error:" + err);
            return ErrorEmptyResponse(res, err);
          } else {
            UpdateAgentDetails(reqData, (err: any, response4: any) => {
              if (err) {
                glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentCdr", "UpdateAgentDetails, error:" + err);
                return ErrorEmptyResponse(res, err);
              } else {
                GetCountAgentCall(reqData, reqDateTime, (err: any, response5: any) => {
                  if (err) {
                    glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentCdr", "GetCountAgentCall, error:" + err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    var data5 = JSON.parse(JSON.stringify(response5[0]));
                    let CheckCount = parseInt(data5["in_cnt"]);
                    let total_calls = parseInt(data5["total_calls"]);
                    let total_in_calls = parseInt(data5["total_in_calls"]);
                    let total_out_calls = parseInt(data5["total_out_calls"]);
                    let no_answer = parseInt(data5["no_answer"]);
                    let in_success_calls = parseInt(data5["in_success_calls"]);
                    let in_failed_calls = parseInt(data5["in_failed_calls"]);
                    let out_success_calls = parseInt(data5["out_success_calls"]);
                    let out_failed_calls = parseInt(data5["out_failed_calls"]);
                    let avg_call_duration = parseInt(data5["avg_call_duration"]);
                    let total_call_duration = parseInt(data5["total_call_duration"]);
                    let office_hours = parseInt(data5["office_hours"]);
                    let lunch_hours = parseInt(data5["lunch_hours"]);
                    let avg_connected_duration = parseInt(data5["avg_connected_duration"]);
                    let avg_ringing_duration = parseInt(data5["avg_ringing_duration"]);
                    let connected_duration = parseInt(data5["connected_duration"]);
                    let total_connected_duration = parseInt(data5["total_connected_duration"]);
                    let ringing_duration = parseInt(data5["ringing_duration"]);
                    let total_ringing_duration = parseInt(data5["total_ringing_duration"]);

                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "CheckCount(" + CheckCount + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "total_calls(" + total_calls + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "total_in_calls(" + total_in_calls + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "total_out_calls(" + total_out_calls + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "no_answer(" + no_answer + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "in_success_calls(" + in_success_calls + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "in_failed_calls(" + in_failed_calls + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "out_success_calls(" + out_success_calls + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "out_failed_calls(" + out_failed_calls + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "avg_call_duration(" + avg_call_duration + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "total_call_duration(" + total_call_duration + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "office_hours(" + office_hours + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "lunch_hours(" + lunch_hours + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "avg_connected_duration(" + avg_connected_duration + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "avg_ringing_duration(" + avg_ringing_duration + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "connected_duration(" + connected_duration + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "total_connected_duration(" + total_connected_duration + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "ringing_duration(" + ringing_duration + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "total_ringing_duration(" + total_ringing_duration + ")");

                    total_calls = total_calls + 1;
                    total_call_duration = total_call_duration + parseInt(reqData["g_duration"]);
                    connected_duration = connected_duration + parseInt(reqData["connectedDuration"]);
                    total_connected_duration = total_connected_duration + parseInt(reqData["connectedDuration"]);
                    ringing_duration = ringing_duration + parseInt(reqData["ringingDuration"]);
                    total_ringing_duration = total_ringing_duration + parseInt(reqData["ringingDuration"]);

                    //let tmp_sum_avg_call_duration = avg_call_duration + parseInt(reqData["g_duration"]);
                    //glogger('DEB', ""+req.headers.sessionid+"", 'setAgentCdr', "tmp_sum_avg_call_duratio("+tmp_sum_avg_call_duration+") = avg_call_duration("+avg_call_duration+") + g_duration("+parseInt(reqData["g_duration"])+")");

                    avg_call_duration = total_call_duration / total_calls;
                    //glogger('DEB', ""+req.headers.sessionid+"", 'setAgentCdr', "avg_call_duration("+avg_call_duration+") = tmp_sum_avg_call_duration("+tmp_sum_avg_call_duration+") / total_calls("+total_calls+")");

                    //let tmp_avg_connected_duration = avg_connected_duration + parseInt(reqData["connectedDuration"]);
                    avg_connected_duration = connected_duration / total_calls;

                    //let tmp_avg_ringing_duration = avg_ringing_duration + parseInt(reqData["ringingDuration"]);
                    avg_ringing_duration = ringing_duration / total_calls;

                    if (reqData["g_callInfo"] == "incoming") {
                      total_in_calls = total_in_calls + 1;
                    }
                    if (reqData["g_callInfo"] == "outgoing") {
                      total_out_calls = total_out_calls + 1;
                    }

                    if (reqData["g_status"] == "1") {
                      no_answer = no_answer + 1;
                    }

                    if (reqData["g_status"] == "1" && reqData["g_callInfo"] == "incoming") {
                      in_failed_calls = in_failed_calls + 1;
                    }
                    if (reqData["g_status"] == "0" && reqData["g_callInfo"] == "incoming") {
                      in_success_calls = in_success_calls + 1;
                    }

                    //if((reqData["g_status"] == "0") && (reqData["g_callInfo"] == "outgoing") && (reqData["overallCallStatus"] == "failed")) {

                    if (reqData["g_callInfo"] == "outgoing" && reqData["overallCallStatus"] == "failed") {
                      console.log("here for outgoing failed calls==============================================");
                      out_failed_calls = out_failed_calls + 1;
                    }

                    //if((reqData["g_status"] == "0") && (reqData["g_callInfo"] == "outgoing") && (reqData["overallCallStatus"] == "success")) {
                    if (reqData["g_callInfo"] == "outgoing" && reqData["overallCallStatus"] == "success") {
                      out_success_calls = out_success_calls + 1;
                    }

                    glogger(
                      "DEB",
                      "" + req.headers.sessionid + "",
                      "/ivr/" + req.params.id + "/setAgentCdr",
                      "Total Calls - total_calls(" +
                        total_calls +
                        "), total_in_calls(" +
                        total_in_calls +
                        "), total_out_calls(" +
                        total_out_calls +
                        "), no_answer(" +
                        no_answer +
                        "), in_failed_calls(" +
                        in_failed_calls +
                        ") , in_success_calls(" +
                        in_success_calls +
                        ") , out_failed_calls(" +
                        out_failed_calls +
                        ") , out_success_calls(" +
                        out_success_calls +
                        ")"
                    );

                    glogger(
                      "DEB",
                      "" + req.headers.sessionid + "",
                      "/ivr/" + req.params.id + "/setAgentCdr",
                      "Total Duration - total_call_duration(" +
                        total_call_duration +
                        "), connected_duration(" +
                        connected_duration +
                        "), total_connected_duration(" +
                        total_connected_duration +
                        "), ringing_duration(" +
                        ringing_duration +
                        "), total_ringing_duration(" +
                        total_ringing_duration +
                        ")"
                    );

                    glogger(
                      "DEB",
                      "" + req.headers.sessionid + "",
                      "/ivr/" + req.params.id + "/setAgentCdr",
                      "Avg Duration - avg_call_duration(" + avg_call_duration + "), avg_connected_duration(" + avg_connected_duration + "), avg_ringing_duration(" + avg_ringing_duration + ")"
                    );

                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "================ After ===============");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "CheckCount(" + CheckCount + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "total_calls(" + total_calls + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "total_in_calls(" + total_in_calls + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "total_out_calls(" + total_out_calls + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "no_answer(" + no_answer + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "in_success_calls(" + in_success_calls + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "in_failed_calls(" + in_failed_calls + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "out_success_calls(" + out_success_calls + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "out_failed_calls(" + out_failed_calls + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "avg_call_duration(" + avg_call_duration + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "total_call_duration(" + total_call_duration + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "office_hours(" + office_hours + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "lunch_hours(" + lunch_hours + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "avg_connected_duration(" + avg_connected_duration + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "avg_ringing_duration(" + avg_ringing_duration + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "connected_duration(" + connected_duration + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "total_connected_duration(" + total_connected_duration + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "ringing_duration(" + ringing_duration + ")");
                    glogger("DEB", "" + req.headers.sessionid + "", "setAgentCdr", "total_ringing_duration(" + total_ringing_duration + ")");

                    let reqDataNew: any = {
                      agent_id: req.body.agentId,
                      sme_id: parseInt(req.params.id),
                      total_calls: total_calls,
                      total_in_calls: total_in_calls,
                      total_out_calls: total_out_calls,
                      no_answer: no_answer,
                      in_success_calls: in_success_calls,
                      in_failed_calls: in_failed_calls,
                      out_success_calls: out_success_calls,
                      out_failed_calls: out_failed_calls,
                      avg_call_duration: avg_call_duration,
                      total_call_duration: total_call_duration,
                      office_hours: office_hours,
                      lunch_hours: lunch_hours,
                      avg_connected_duration: avg_connected_duration,
                      avg_ringing_duration: avg_ringing_duration,
                      connected_duration: connected_duration,
                      total_connected_duration: total_connected_duration,
                      ringing_duration: ringing_duration,
                      total_ringing_duration: total_ringing_duration,
                      g_agentId: req.body.agentId,
                    };

                    if (CheckCount >= 1) {
                      UpdateAgentCalling(reqDataNew, reqDateTime, (err: any, response9: any) => {
                        return SuccessResponse(res, "Successfully updated", response9);
                      });
                    } else {
                      InsertAgentCalling(reqDataNew, reqDateTime, (err: any, response9: any) => {
                        return SuccessResponse(res, "Successfully updated", response9);
                      });
                    }

                    /*UpdateAgentCallThroughMode(reqData, reqDateTime, (err: any, response8: any) => {});

                    UpdateAgentCallSuccessFail(reqData, reqDateTime, (err: any, response9: any) => {
                      glogger('DEB', ""+req.headers.sessionid+"", '/ivr/'+req.params.id+'/setAgentCdr', "SuccessResponse");
                      return SuccessResponse(res, "Successfully updated", response9);
                      
                    });*/
                  }
                });
              }
            });
          }
        });
      }
    });
  } catch (e) {
    glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentCdr", "Exception:" + e);
    ErrorResponse(res, e);
  }
};

export const setAgentOut = async (req: Request, res: Response) => {
  try {
    let reqData: fetchAgentOutRequest = {
      sme_id: parseInt(req.params.id),
      agentNumber: req.body.agentNumber,
    };

    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqDateTime: any = {
      currentDate: getCurrentDate,
    };
    glogger("IMP", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentOut", "API Request agentNumber:" + req.body.agentNumber);
    await FindAgentFullDetails(reqData, (err: any, response: any) => {
      if (err) {
        glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentOut", "FindAgentFullDetails, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          var data2 = JSON.parse(JSON.stringify(response[0]));

          let reqDataNew: any = {
            agent_id: data2.agent_id,
          };
          UpdateAgentStatusBusy(reqDataNew, (err: any, response2: any) => {
            if (err) {
              glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentOut", "UpdateAgentStatusBusy, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              UpdateBusyAgentTiming(reqDataNew, reqDateTime, (err: any, response3: any) => {
                if (err) {
                  glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentOut", "UpdateBusyAgentTiming, error:" + err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  glogger("DEB", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentOut", "SuccessResponse");
                  return SuccessResponse(res, "Successfully listed", response);
                }
              });
            }
          });
        } else {
          return ErrorResWithSuccess(res, "No record found");
        }
      }
    });
  } catch (e) {
    glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setAgentOut", "Exception:" + e);
    ErrorResponse(res, e);
  }
};

export const setCustomerCdr = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);

    let reqData: addCustomerCdrRequest = {
      sme_id: parseInt(req.params.id),
      g_inflag: req.body.inflag,
      g_status: req.body.status ? req.body.status : 0,
      g_responseCode: req.body.responseCode,
      endDate: req.body.endDate ? req.body.endDate : getCurrentDate,
      startDate: req.body.startDate ? req.body.startDate : getCurrentDate,
      g_customerAni: req.body.customerAni,
      g_sessionCall: req.body.sessionCall,
      g_mode: req.body.mode,
      g_callInfo: req.body.callInfo,
      connectedDuration: req.body.connectedDuration ? req.body.connectedDuration : 0,
      ringingDuration: req.body.ringingDuration ? req.body.ringingDuration : 0,
      callRouteReason: req.body.callRouteReason ? req.body.callRouteReason : "",
      recentCallDateTime: req.body.endDate,
      totalDuration: req.body.totalDuration ? req.body.totalDuration : 0,
    };
    glogger("IMP", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setCustomerCdr", "API Request Customer No:" + req.body.customerAni);
    await getResponseMessageCdr(reqData, (err: any, response: any) => {
      if (err) {
        glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setCustomerCdr", "getResponseMessageCdr, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        var data2 = JSON.parse(JSON.stringify(response[0]));

        let appenddata: any = {
          in_response_message: data2.in_response_message.concat("(" + req.body.responseCode + ")"),
          currentDate: getCurrentDate,
        };

        InsertCustomerReport(reqData, appenddata, (err: any, response1: any) => {
          if (err) {
            glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setCustomerCdr", "InsertCustomerReport, error:" + err);
            return ErrorEmptyResponse(res, err);
          } else {
            glogger("DEB", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setCustomerCdr", "SuccessResponse");
            return SuccessResponse(res, "Customer Report inserted successfully", response1);
          }
        });
      }
    });
  } catch (e) {
    glogger("ERR", "" + req.headers.sessionid + "", "/ivr/" + req.params.id + "/setCustomerCdr", "Exception:" + e);
    ErrorResponse(res, e);
  }
};

export const releaseAgent = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.body.smeId),
      agentNumber: parseInt(req.body.agentNumber),
    };
    await getAgentDetailsData(reqData, async (err: any, response: any) => {
      if (err) {
        glogger("ERR", "", "/ivr/" + req.body.agentNumber + "/releaseAgent", "getAgentDetailsData, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (response && response.length > 0) {
          let reqData1: any = {
            agent_id: response[0].agent_id,
          };

          let currentDate = Date();
          let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
          let reqDateTime: any = {
            currentDate: getCurrentDate,
          };
          glogger("IMP", "", "/ivr/" + req.body.agentNumber + "/releaseAgent", "API Request");
          glogger("CDR", "", "/ivr/" + req.body.agentNumber + "/releaseAgent", "Free Agent " + req.body.agentNumber + "");

          await UpdateAgentStatusFree(reqData1, (err: any, response: any) => {
            if (err) {
              glogger("ERR", "", "/ivr/" + req.body.agentNumber + "/releaseAgent", "UpdateAgentStatusFree, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              UpdateFreeAgentiming(reqData1, reqDateTime, (err: any, response2: any) => {
                if (err) {
                  glogger("ERR", "", "/ivr/" + req.body.agentNumber + "/releaseAgent", "UpdateFreeAgentiming, error:" + err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  FindAgentDetailById(reqData1, (err: any, FindAgentDetailByIdResponse: any) => {
                    if (err) {
                      glogger("ERR", "", "/ivr/" + req.body.agentNumber + "/releaseAgent", "FindAgentDetailById, error:" + err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      if (FindAgentDetailByIdResponse[0].status == 2) {
                        UpdateAgentStatusFree(reqData1, (err: any, response: any) => {
                          if (err) {
                            glogger("ERR", "", "/ivr/" + req.body.agentNumber + "/releaseAgent", "UpdateAgentStatusFree retry, error:" + err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            UpdateFreeAgentiming(reqData1, reqDateTime, (err: any, response2: any) => {
                              if (err) {
                                glogger("ERR", "", "/ivr/" + req.body.agentNumber + "/releaseAgent", "UpdateFreeAgentiming retry, error:" + err);
                                return ErrorEmptyResponse(res, err);
                              } else {
                                glogger("DEB", "", "/ivr/" + req.body.agentNumber + "/releaseAgent", "Agent Release on retry");
                                return SuccessResponse(res, "Agent Released Successfully", FindAgentDetailByIdResponse);
                              }
                            });
                          }
                        });
                      } else {
                        glogger("DEB", "", "/ivr/" + req.body.agentNumber + "/releaseAgent", "Agent Release on first try");
                        return SuccessResponse(res, "Agent Released Successfully", FindAgentDetailByIdResponse);
                      }
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
  } catch (e) {
    glogger("ERR", "", "/ivr/" + req.body.id + "/releaseAgent", "Exception:" + e);
    ErrorResponse(res, e);
  }
};

export const getSmeRecord = async (req: Request, res: Response) => {
  try {
    if (!req.body.code) {
      return SuccessResponse(res, "Code param is missing", null);
    }

    if (req.body.code && req.body.code != "456!@#123%^") {
      return SuccessResponse(res, "Invalid Code", null);
    }

    let reqData: any = {
      userName: req.body.userName,
    };

    glogger("CDR", "", "/ivr/" + req.body.userName + "/getSmeRecord", "Agent " + req.body.userName + "");

    await getSmeRecordData(reqData, (err: any, response: any) => {
      if (err) {
        glogger("ERR", "", "/ivr/" + req.body.userName + "/getSmeRecord", "getSmeRecordData, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Listed", response);
      }
    });
  } catch (e) {
    glogger("ERR", "", "/ivr/" + req.body.userName + "/getSmeRecord", "Exception:" + e);
    ErrorResponse(res, e);
  }
};
