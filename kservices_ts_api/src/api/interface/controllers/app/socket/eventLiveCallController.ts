import { Request, Response } from "express";
import { toLowerCase } from "fp-ts/lib/string";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import { GetEventLiveCall, GetEventAgentLiveCall, GetEventClickToCall, GetEventAgentInfo } from "../../../../domain/models/sme.model";
import { calculateDuration, secondsToHms, convertTimeZone } from "../../../../helpers/utility";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { glogger } from "../../../../helpers/logger";
import { env } from '../../../../../infrastructure/env';
/** Object id data type */
const ObjectId = mongoose.Types.ObjectId;

/**
 * event live call.
 *
 * @returns {Object}
 */

export const eventLiveCall = async (payload: any, socketId: any, callback: any) => {
  try {
    let getCurrentDate = Date();
    let currentDateTime = convertTimeZone("IST","resultTimeZone",getCurrentDate);
    let where: any = {
      id: payload["sme_id"],
      currentDateTime: currentDateTime,
    };
    await GetEventLiveCall(where, (err: any, response: any) => {
      let gflagList = [];
      let finalTimeFormat = "";
      let gcallStatus = "";
      let gcallType = "";
      let gCustomerName = "";
      let gAgentName = "";
      let gAgentNumber = "";
      let startDate = "";
      let endDate = "";
      let gSmeId = "";
      let callDuration: any;
      if (response.length > 0) {
        for (let acnt = 0; acnt < response.length; acnt++) {
          let rows = response[acnt];
          if (!rows.call_type) {
            gcallType = "Incoming";
          } else {
            gcallType = rows.call_type;
          }

          if(gcallType == "Incoming") {
            if (rows.call_status == "0") {
              gcallStatus = "Ringing";
            } else if (rows.call_status == "1") {
              gcallStatus = "Connected";
            } else if (rows.call_status == "2") {
              gcallStatus = "Other";
            }
          }

          if(gcallType == "Outgoing") {

            if (rows.call_status == "0") {
              gcallStatus = "Agent Ringing";
            }
            else if (rows.call_status == "1") {
              gcallStatus = "Connected";
            }
            else if (rows.call_status == "10") {
              gcallStatus = "Agent Connected";
            }
            else if (rows.call_status == "11") {
              gcallStatus = "Customer Connected";
            }
            else if (rows.call_status == "20") {
              gcallStatus = "Customer Ringing";
            }
            else if (rows.call_status == "22") {
              gcallStatus = "Connected";
            }
            else if (rows.call_status == "2") {
              gcallStatus = "Other";
            }
          }

          
          startDate = rows.date_time.replace("Z", "").replace("T", " ");
          endDate = convertTimeZone("IST","resultTimeZone",getCurrentDate);
          callDuration = calculateDuration(startDate, endDate);
          
          finalTimeFormat = secondsToHms(callDuration);
          
          if (rows.customer_name == "0") {
            gCustomerName = "No Name";
          } else {
            gCustomerName = rows.customer_name;
          }
          if (rows.agent_name == "Not Found" || rows.agent_name == "") {
            gAgentName = "Searching";
          } else {
            gAgentName = rows.agent_name;
          }
          if (rows.agent_number == "0") {
            gAgentNumber = "Searching";
          } else {
            gAgentNumber = rows.agent_mobile;
          }

          gSmeId = rows.sme_id;

          var gmicroList = {
            id: rows.id,
            customerName: gCustomerName,
            customerNumber: rows.customer_number,
            agentId: rows.agent_id,
            callStatus: gcallStatus,
            callType: gcallType,
            agentNumber: gAgentNumber,
            agentName: gAgentName,
            dateTime: rows.date_time,
            currentTime: finalTimeFormat,
          };

          gflagList.push(gmicroList);
        }

        let result = {
          data: gflagList,
          status: 200,
          totalRecords: response.length,
        };
        callback(null, result);
      } else {
        let result = {
          data: [],
          status: 200,
          totalRecords: 0,
        };
        callback(null, result);
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(payload);
      loggerFileError.error(e);
    }
    console.log(e);
  }
};

export const eventAgentLiveCall = async (payload: any, socketId: any, callback: any) => {
  try {
    var g_agentId = "";
    if (payload.filterList) {
      var agentData = payload.filterList;
      for (let data of agentData) {
        if (data["name"] == "agentId") {
          g_agentId = data["val"];
        }
      }
    }

    let getCurrentDate = Date();
    let currentDateTime = convertTimeZone("IST","resultTimeZone",getCurrentDate);
    let where: any = {
      id: payload["sme_id"],
      agentId: g_agentId,
      currentDateTime: currentDateTime,
    };

    glogger('IMP', ""+socketId+"", '/socket/'+g_agentId+'/evt_agent_live_calls', "eventAgentLiveCall");
    await GetEventAgentLiveCall(where, (err: any, response: any) => {
      let gflagList = [];
      let finalTimeFormat = "";
      let gcallStatus = "";
      let gcallType = "";
      let gCustomerName = "";
      let gAgentName = "";
      let gAgentNumber = "";
      let startDate = "";
      let endDate = "";
      let gSmeId = "";
      let callDuration: any;
      if (response.length > 0) {
        for (let acnt = 0; acnt < response.length; acnt++) {
          let rows = response[acnt];
          if (!rows.call_type) {
            gcallType = "Incoming";
          } else {
            gcallType = rows.call_type;
          }

          if(gcallType == "Incoming") {
            if (rows.call_status == "0") {
              gcallStatus = "Ringing";
            } else if (rows.call_status == "1") {
              gcallStatus = "Connected";
            } else if (rows.call_status == "2") {
              gcallStatus = "Other";
            }
          }

          if(gcallType == "Outgoing") {

            if (rows.call_status == "0") {
              gcallStatus = "Agent Ringing";
            }
            else if (rows.call_status == "1") {
              gcallStatus = "Connected";
            }
            else if (rows.call_status == "10") {
              gcallStatus = "Agent Connected";
            }
            else if (rows.call_status == "11") {
              gcallStatus = "Customer Connected";
            }
            else if (rows.call_status == "20") {
              gcallStatus = "Customer Ringing";
            }
            else if (rows.call_status == "22") {
              gcallStatus = "Connected";
            }
            else if (rows.call_status == "2") {
              gcallStatus = "Other";
            }
          }

          startDate = rows.date_time.replace("Z", "").replace("T", " ");
          endDate = convertTimeZone("IST","resultTimeZone",getCurrentDate);
          
          callDuration = calculateDuration(startDate, endDate);
          finalTimeFormat = secondsToHms(callDuration);

          if (rows.customer_name == "0") {
            gCustomerName = "No Name";
          } else {
            gCustomerName = rows.customer_name;
          }
          if (rows.agent_name == "Not Found") {
            gAgentName = "Searching";
          } else {
            gAgentName = rows.agent_name;
          }
          if (rows.agent_number == "0") {
            gAgentNumber = "Searching";
          } else {
            gAgentNumber = rows.agent_number;
          }

          gSmeId = rows.sme_id;

          var gmicroList = {
            customerName: gCustomerName,
            customerNumber: rows.customer_number,
            agentId: rows.agent_id,
            callStatus: gcallStatus,
            callType: gcallType,
            agentNumber: gAgentNumber,
            agentName: gAgentName,
            dateTime: rows.date_time,
            currentTime: finalTimeFormat,
            sessionId: rows.session_id,
            remarks:rows.remarks,
            id: rows.id,
            isAutoDial: rows.is_auto_dial
          };

          gflagList.push(gmicroList);
        }
        let result = {
          data: gflagList,
          status: 200,
          totalRecords: response.length,
        };
        glogger('DEB', ""+socketId+"", '/socket/'+g_agentId+'/evt_agent_live_calls', ""+response.length+"");
        callback(null, result);
      } else {
        let result = {
          data: [],
          status: 200,
          totalRecords: 0,
        };
        glogger('DEB', ""+socketId+"", '/socket/'+g_agentId+'/evt_agent_live_calls', "[]");
        callback(null, result);
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(payload);
      loggerFileError.error(e);
    }
    console.log(e);
  }
};

export const eventClickToCall = async (payload: any, socketId: any, callback: any) => {
  try {
    var g_agentId = "";
    var g_agentNumber = "";
    var g_customerNumber = "";
    if (payload.filterList) {
      var agentData = payload.filterList;
      for (let data of agentData) {
        if (data["name"] == "agentId") {
          g_agentId = data["val"];
        }

        if (data["name"] == "agentNumber") {
          g_agentNumber = data["val"];
        }

        if (data["name"] == "customerNumber") {
          g_customerNumber = data["val"];
        }
      }
    }

    let getCurrentDate = Date();
    let currentDateTime = convertTimeZone("IST","resultTimeZone",getCurrentDate);

    let where: any = {
      id: payload["sme_id"],
      agentId: g_agentId,
      agentNumber: g_agentNumber,
      customerNumber: g_customerNumber,
      currentDateTime: currentDateTime,
    };

    glogger('IMP', ""+socketId+"", '/socket/'+g_agentId+'/eventClickToCall', " agentNumber "+g_agentNumber+"  customernumber "+g_agentNumber+"");
    await GetEventClickToCall(where, (err: any, response: any) => {
      let gflagList = [];
      let finalTimeFormat = "";
      let gcallStatus = "";
      let gcallType = "";
      let gCustomerName = "";
      let gAgentName = "";
      let gAgentNumber = "";
      let startDate = "";
      let endDate = "";
      let gSmeId = "";
      let callDuration: any;
      if (response.length > 0) {
        for (let acnt = 0; acnt < response.length; acnt++) {
          let rows = response[acnt];
          if (!rows.call_type) {
            gcallType = "Incoming";
          } else {
            gcallType = rows.call_type;
          }

          if (rows.call_status == "0") {
            gcallStatus = "agentRinging";
          }
          else if (rows.call_status == "1") {
            gcallStatus = "Connected";
          }
          else if (rows.call_status == "10") {
            gcallStatus = "agentConnected";
          }
          else if (rows.call_status == "11") {
            gcallStatus = "customerConnected";
          }
          else if (rows.call_status == "20") {
            gcallStatus = "customerRinging";
          }
          else if (rows.call_status == "22") {
            gcallStatus = "Connected";
          }
          else if (rows.call_status == "2") {
            gcallStatus = "Other";
          }

          startDate = rows.date_time.replace("Z", "").replace("T", " ");
          endDate = convertTimeZone("IST","resultTimeZone",getCurrentDate);

          callDuration = calculateDuration(startDate, endDate);
          finalTimeFormat = secondsToHms(callDuration);

          if (rows.customer_name == "0") {
            gCustomerName = "No Name";
          } else {
            gCustomerName = rows.customer_name;
          }
          if (rows.agent_name == "Not Found") {
            gAgentName = "Searching";
          } else {
            gAgentName = rows.agent_name;
          }
          if (rows.agent_number == "0") {
            gAgentNumber = "Searching";
          } else {
            gAgentNumber = rows.agent_number;
          }

          gSmeId = rows.sme_id;

          var gmicroList = {
            customerName: gCustomerName,
            customerNumber: rows.customer_number,
            agentId: rows.agent_id,
            callStatus: gcallStatus,
            callType: gcallType,
            agentNumber: gAgentNumber,
            agentName: gAgentName,
            dateTime: rows.date_time,
            currentTime: finalTimeFormat,
          };

          gflagList.push(gmicroList);
        }
        glogger('DEB', ""+socketId+"", '/socket/'+g_agentId+'/eventClickToCall', "GetEventClickToCall "+ response.length+"");
        let result = {
          data: gflagList,
          status: 200,
          totalRecords: response.length,
        };
        callback(null, result);
      } else {
        let result = {
          data: [],
          status: 200,
          totalRecords: 0,
        };
        callback(null, result);
        glogger('DEB', ""+socketId+"", '/socket/'+g_agentId+'/eventClickToCall', "GetEventClickToCall "+ response.length+"");
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(payload);
      loggerFileError.error(e);
    }
    console.log(e);
  }
};

export const eventAgentInfo = async (payload: any, socketId: any, callback: any) => {
  try {
    let where: any = {
      id: payload["sme_id"],
      callingNumber: payload["callingNumber"],
      calledNumber: payload["calledNumber"],
    };
    glogger('IMP', ""+socketId+"", '/socket/'+payload["sme_id"]+'/evt_agent_info', "Calling number "+payload["callingNumber"]+" called number "+payload["calledNumber"]+"");
    await GetEventAgentInfo(where, (err: any, response: any) => {

      if (response.length > 0) {
				if (response[0].masking == 0) {
					let result = {
            data: response,
            status: 200,
            totalRecords: response.length,
          };
          glogger('DEB', ""+socketId+"", '/socket/'+payload["sme_id"]+'/evt_agent_info', "Calling number "+payload["callingNumber"]+" called number "+payload["calledNumber"]+" masking "+response[0].masking+"");
          callback(null, result);
				}
				else {
					let result = {
            data: [{ customerNumber: '**********', customerName: '**********', masking: 1 }],
            status: 200,
            totalRecords: response.length,
          };

          glogger('DEB', ""+socketId+"", '/socket/'+payload["sme_id"]+'/evt_agent_info', "Calling number "+payload["callingNumber"]+" called number "+payload["calledNumber"]+" masking 1");
          callback(null, result);
				}

			}
      
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(payload);
      loggerFileError.error(e);
    }
    console.log(e);
  }
};
