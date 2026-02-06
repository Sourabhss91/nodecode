import { QueryTypes } from "sequelize";
import { sequelize } from "../../../config/db";
import { logger } from "../../../lib/logger";
import { getOffset } from "../../../helpers/utility";
const {BigQuery} = require('@google-cloud/bigquery');
const options:any = {
  keyFilename: 'google_cred.json',
  projectId: 'kommuno-347914',
};
const datasetId:any = 'kommuno-347914.kommuno_prod_bq';
const bigquery = new BigQuery(options);

/**  Get list */
export async function FindCallList(where: any, callback: any) {
    try {
        const sqlQuery ='SELECT ucd.id, ucd.sme_id, ucd.duration, ucd.status, ucd.agent_id, ucd.response_message, ucd.agent_group, ucd.response_code, ucd.connected_duration, ucd.ringing_duration, ucd.customer_ani, ucd.session_id, ucd.call_mode,  ucd.call_info, ucd.call_route_reason, ad.agent_name as agent_name, ad.agent_mobile as agent_number FROM [kommuno-347914:kommuno_prod_bq.agent_report_details] ucd left join [kommuno-347914:kommuno_prod_bq.agent_details] ad on ucd.agent_id = ad.agent_id  WHERE ucd.sme_id = "20002013" order by ucd.start_date asc limit 10 OFFSET 1';
        const options = {
          query: sqlQuery,
          //location: 'US',
          useLegacySql: true,
        };
        const [job] = await bigquery.createQueryJob(options);
        const [rows] = await job.getQueryResults();
      callback(null, rows);
    } catch (error: any) {
      logger.error(error);
      callback(error, null);
      throw new Error(error);
    }
  }

  /** find */
export async function FindCallListOLD(where: any, callback: any) {
    try {
      let table_name = "";
      let duration_field = "";
      let called_number_field = "";
      let calling_number_field = "";
      let agent_name_field = "";
      let call_status_field = "";
      let answer_status_field = "";
      let remarks_field = "";
      let callId_fiels = "";
      let limit_field = "";
      let initialRecord;
      let callFlow_field = "";
  
      //table name finalized
      if (where["type"] == "incoming") {
        table_name = "incoming_ivr_call_cdr";
      } else if (where["type"] == "outgoing") {
        table_name = "outbond_ivr_cdr";
      }
  
      if (where["isDownload"] == "1") {
        limit_field = "";
      } else {
        initialRecord = where["initialRecord"] - 1;
        limit_field = "limit " + initialRecord + "," + where["batchSize"] + "";
      }
  
      //duration check
      if (where["duration_op"] == "11") {
        //Equals to
        duration_field = "and cr.duration = " + where["duration"] + "";
      } else if (where["duration_op"] == "12") {
        //Not Equals to
        duration_field = "and cr.duration != " + where["duration"] + "";
      } else if (where["duration_op"] == "13") {
        //Is greater than
        duration_field = "and cr.duration > " + where["duration"] + "";
      } else if (where["duration_op"] == "14") {
        //Is less than
        duration_field = "and cr.duration < " + where["duration"] + "";
      }
  
      //calledNumber check as agent Number
      if (where["calledNumber_op"] == "1") {
        //Equals to
        called_number_field = ' and SUBSTRING(TRIM(cdr.called_number), -10) = SUBSTRING("' + where["calledNumber"] + '", -10) ';
      } else if (where["calledNumber_op"] == "2") {
        //Not Equals to
        called_number_field = 'and SUBSTRING(TRIM(cdr.called_number), -10) != SUBSTRING("' + where["calledNumber"] + '", -10)';
      } else if (where["calledNumber_op"] == "3") {
        //Start with
        called_number_field = 'and SUBSTRING(TRIM(cdr.called_number), -10) LIKE "' + where["calledNumber"] + '%"';
      } else if (where["calledNumber_op"] == "4") {
        //it contains
        called_number_field = 'and SUBSTRING(TRIM(cdr.called_number), -10) LIKE "%' + where["calledNumber"] + '%"';
      } else if (where["calledNumber_op"] == "5") {
        //it does not contains
        called_number_field = 'and SUBSTRING(TRIM(cdr.called_number), -10) NOT LIKE "%' + where["calledNumber"] + '%"';
      } else if (where["calledNumber_op"] == "6") {
        //it end with
        called_number_field = 'and SUBSTRING(TRIM(cdr.called_number), -10) LIKE "%' + where["calledNumber"] + '"';
      }
  
      //callingNumber check as customer number
      if (where["callingNumber_op"] == "1") {
        //Equals to
        calling_number_field = 'and SUBSTRING(TRIM(cdr.calling_number), -10) = SUBSTRING("' + where["callingNumber"] + '", -10)';
      } else if (where["callingNumber_op"] == "2") {
        //Not Equals to
        calling_number_field = 'and SUBSTRING(TRIM(cdr.calling_number), -10) != SUBSTRING("' + where["callingNumber"] + '", -10)';
      } else if (where["callingNumber_op"] == "3") {
        //Start with
        calling_number_field = 'and SUBSTRING(TRIM(cdr.calling_number), -10) LIKE "' + where["callingNumber"] + '%"';
      } else if (where["callingNumber_op"] == "4") {
        //it contains
        calling_number_field = 'and SUBSTRING(TRIM(cdr.calling_number), -10) LIKE "%' + where["callingNumber"] + '%"';
      } else if (where["callingNumber_op"] == "5") {
        //it does not contains
        calling_number_field = 'and SUBSTRING(TRIM(cdr.calling_number), -10) NOT LIKE "%' + where["callingNumber"] + '%"';
      } else if (where["callingNumber_op"] == "6") {
        //it end with
        calling_number_field = 'and SUBSTRING(TRIM(cdr.calling_number), -10) LIKE "%' + where["callingNumber"] + '"';
      }
  
      //Agent Name check
      if (where["agentName_op"] == "1") {
        //Equals to
        agent_name_field = 'and TRIM(ad.agent_name) = "' + where["agentName"] + '"';
      } else if (where["agentName_op"] == "2") {
        //Not Equals to
        agent_name_field = 'and TRIM(ad.agent_name) != "' + where["agentName"] + '"';
      } else if (where["agentName_op"] == "3") {
        //Start with
        agent_name_field = 'and TRIM(ad.agent_name) LIKE "' + where["agentName"] + '%"';
      } else if (where["agentName_op"] == "4") {
        //it contains
        agent_name_field = 'and TRIM(ad.agent_name) LIKE "%' + where["agentName"] + '%"';
      } else if (where["agentName_op"] == "5") {
        //it does not contains
        agent_name_field = 'and TRIM(ad.agent_name) NOT LIKE "%' + where["agentName"] + '%"';
      } else if (where["agentName_op"] == "6") {
        //it end with
        agent_name_field = 'and TRIM(ad.agent_name) LIKE "%' + where["agentName"] + '"';
      }
  
      //SessionID / callId check
      if (where["callId_op"] == "1") {
        //Equals to
        callId_fiels = 'and TRIM(cdr.session_id) = "' + where["callId"] + '"';
      } else if (where["callId_op"] == "2") {
        //Not Equals to
        callId_fiels = 'and TRIM(cdr.session_id) != "' + where["callId"] + '"';
      } else if (where["callId_op"] == "3") {
        //Start with
        callId_fiels = 'and TRIM(cdr.session_id) LIKE "' + where["callId"] + '%"';
      } else if (where["callId_op"] == "4") {
        //it contains
        callId_fiels = 'and TRIM(cdr.session_id) LIKE "%' + where["callId"] + '%"';
      } else if (where["callId_op"] == "5") {
        //it does not contains
        callId_fiels = 'and TRIM(cdr.session_id) NOT LIKE "%' + where["callId"] + '%"';
      } else if (where["callId_op"] == "6") {
        //it end with
        callId_fiels = 'and TRIM(cdr.session_id) LIKE "%' + where["callId"] + '"';
      }
  
      if (where["remarks_op"] == "1") {
        //Equals to
        remarks_field = 'and TRIM(cr.remarks) = "' + where["remarks"] + '"';
      } else if (where["remarks_op"] == "2") {
        //Not Equals to
        remarks_field = 'and TRIM(cr.remarks) != "' + where["remarks"] + '"';
      } else if (where["remarks_op"] == "3") {
        //Start with
        remarks_field = 'and TRIM(cr.remarks) LIKE "' + where["remarks"] + '%"';
      } else if (where["remarks_op"] == "4") {
        //it contains
        remarks_field = 'and TRIM(cr.remarks) LIKE "%' + where["remarks"] + '%"';
      } else if (where["remarks_op"] == "5") {
        //it does not contains
        remarks_field = 'and TRIM(cr.remarks) NOT LIKE "%' + where["remarks"] + '%"';
      } else if (where["remarks_op"] == "6") {
        //it end with
        remarks_field = 'and TRIM(cr.remarks) LIKE "%' + where["remarks"] + '"';
      }
  
      //Call Staus for incoming Answer/Failed filter  1:failed,  0:success
      if (where["callStatus_op"] == "11") {
        //Equals to
        call_status_field = "and cdr.call_status = " + where["callStatus"] + "";
      }
  
      //Answer Staus for outgoing Answer/Failed filter  1:failed,  2:success
      if (where["answerStatus_op"] == "11") {
        //Equals to
        answer_status_field = "and cdr.answer = " + where["answerStatus"] + "";
      }
  
      if (where["callFlow_op"] == "11") {
        //Equals to
        callFlow_field = "and cdr.call_flow_id = " + where["callFlow"] + "";
      }
      
      let Query = "";
      if (table_name == "outbond_ivr_cdr") {
        Query =
          'select ad.agent_name, cdr.id, cdr.disconnected_by, cdr.sme_id, DATE_FORMAT(cdr.start_date_time, "%Y-%m-%d %H:%i:%s") as start_date_time, DATE_FORMAT(cdr.end_date_time, "%Y-%m-%d %H:%i:%s") as end_date_time , DATE_FORMAT(cdr.insert_date_time, "%Y-%m-%d %H:%i:%s") as insert_date_time , cdr.duration, cdr.longcode, cdr.hlr, cdr.master_shortcode, cdr.sme_identifier, cdr.shortcode_mapping, if(cdr.call_direction_status="1","TRUE","FALSE") as call_direction_status, cdr.call_direction, cdr.calling_number, cdr.called_number, cdr.call_recording_status,cdr.call_recorded_file, if(cdr.voicemail_recording_status="1","TRUE","FALSE") as voicemail_recording_status, cdr.voicemail_recording_file, cdr.channel_no, cdr.server_ip_address, if(cdr.cdr_mode="1","INCOMING_IVR_CALL","I dont know") as cdr_mode, cdr.cdr_mode as cdr_mode_int, cdr.agent_group, agd.group_name, cdr.patched_agent_id, cdr.session_id, cdr.merge_status, cdr.answer, if(cdr.answer="2","0","1") as call_status, cdr.address_book_id, cdr.call_mode, ab.customer_name, cr.remarks, cdr.connected_call_duration, cdr.connected_duration, cdr.ringing_duration, cdr.call_type, cdr.call_description, cdr.ivr_duration, cdr.customer_status, rec.merged_file, rec.duration as recording_duration, bwl.blacklist_status from outbond_ivr_cdr cdr left join agent_details ad on cdr.patched_agent_id = ad.agent_id LEFT JOIN agent_group_mapping agm ON agm.agent_id = ad.agent_id LEFT JOIN agent_group_detail agd ON agd.group_id = agm.group_id left join mpbx_call_recording rec on rec.call_id = cdr.call_recorded_file LEFT JOIN black_white_list bwl ON SUBSTRING(TRIM(bwl.customer_number), -10)=SUBSTRING(cdr.called_number, -10) AND bwl.sme_id = cdr.sme_id and bwl.blacklist_status != -9 LEFT JOIN address_book ab on SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(cdr.called_number, -10) AND ab.sme_id = cdr.sme_id LEFT JOIN customer_remarks cr ON cr.session_id = cdr.session_id AND cr.call_direction = cdr.call_direction where (cdr.start_date_time  BETWEEN :startDate AND :endDate) and cdr.sme_id = :id AND cdr.customer_status = 0' +
          duration_field +
          " " +
          called_number_field +
          " " +
          calling_number_field +
          " " +
          answer_status_field +
          " " +
          remarks_field +
          " " +
          agent_name_field +
          " " +
          callFlow_field +
          " "+
          callId_fiels +
          " GROUP BY cdr.session_id order  by id desc " +
          limit_field +
          "";
      } else {
        Query =
          'select ad.agent_name, ad.agent_mobile, cdr.id, cdr.sme_id, DATE_FORMAT(cdr.start_date_time, "%Y-%m-%d %H:%i:%s") as start_date_time, DATE_FORMAT(cdr.end_date_time, "%Y-%m-%d %H:%i:%s") as end_date_time, DATE_FORMAT(cdr.insert_date_time, "%Y-%m-%d %H:%i:%s") as insert_date_time, cdr.duration, cdr.longcode, cdr.hlr, cdr.master_shortcode, cdr.sme_identifier, cdr.shortcode_mapping, if(cdr.call_direction_status="1","TRUE","FALSE") as call_direction_status, cdr.call_direction, cdr.calling_number, cdr.called_number, cdr.call_recording_status,cdr.call_recorded_file, if(cdr.voicemail_recording_status="1","TRUE","FALSE") as voicemail_recording_status, cdr.voicemail_recording_file, cdr.channel_no, cdr.server_ip_address, if(cdr.cdr_mode="1","INCOMING_IVR_CALL","I dont know") as cdr_mode, cdr.agent_group, agd.group_name, cdr.patched_agent_id, cdr.session_id, cdr.merge_status, cdr.answer, cdr.call_flow_id, cdr.call_status, cdr.disconnected_by, cdr.address_book_id, ab.customer_name, cr.remarks, cdr.connected_call_duration, cdr.connected_duration, cdr.ringing_duration, cdr.call_type, cdr.call_description, cdr.ivr_duration,cdr.customer_status, cdr.call_mode, rec.merged_file, rec.duration as recording_duration, bwl.blacklist_status, mcm.flow_name from ' +
          table_name +
          " cdr left join agent_details ad on cdr.patched_agent_id = ad.agent_id LEFT JOIN agent_group_mapping agm ON agm.agent_id = ad.agent_id LEFT JOIN agent_group_detail agd ON agd.group_id = agm.group_id left join mpbx_call_recording rec on rec.call_id = cdr.call_recorded_file LEFT JOIN black_white_list bwl ON SUBSTRING(TRIM(bwl.customer_number), -10)=SUBSTRING(cdr.calling_number, -10) AND bwl.sme_id = cdr.sme_id AND bwl.blacklist_status != -9 LEFT JOIN address_book ab on SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(cdr.calling_number, -10) AND ab.sme_id = cdr.sme_id LEFT JOIN customer_remarks cr ON cr.session_id = cdr.session_id AND cr.call_direction = cdr.call_direction LEFT JOIN mpbx_category_master mcm ON mcm.flow_id = cdr.call_flow_id AND mcm.sme_id = cdr.sme_id where (cdr.start_date_time  BETWEEN :startDate AND :endDate) and cdr.sme_id = :id AND cdr.customer_status = 0 AND cdr.call_type != '3'" +
          duration_field +
          " " +
          called_number_field +
          " " +
          calling_number_field +
          "  " +
          call_status_field +
          " " +
          remarks_field +
          " " +
          agent_name_field +
          " " +
          callFlow_field +
          " "+
          callId_fiels +
          " GROUP BY cdr.session_id order  by id desc " +
          limit_field +
          "";
      }
  
      let executeQuery = await sequelize.query<any>(Query, {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: { id: where["id"], startDate: where["startDate"], endDate: where["endDate"] },
      });
      callback(null, executeQuery);
    } catch (error: any) {
      logger.error(error);
      callback(error, null);
      throw new Error(error);
    }
  }

  /**  find */
export async function FetchAgentReport(where: any, callback: any) {
    try {
      let duration_field = "";
      let agent_number_field = "";
      let agent_name_field = "";
      let customer_number_field = "";
      let g_mode = "";
      let responseMessage = "";
      let call_answer_field = "";
      let productId_field = "";
      let insert_date_time_field = "";
      let customerName_field = "";
      let agentId_field = "";
      let productPrice_field = "";
      let sessionId = "";
      let g_initialRecord;
      let orderBy_field = "";
      let limit_field = "";
      let status_field = "";
  
      //duration check
      if (where["duration_op"] == "11") {
        //Equals to
        duration_field = "and ucd.duration = " + where["duration"] + "";
      } else if (where["duration_op"] == "12") {
        //Not Equals to
        duration_field = "and ucd.duration != " + where["duration"] + "";
      } else if (where["duration_op"] == "13") {
        //Is greater than
        duration_field = "and ucd.duration > " + where["duration"] + "";
      } else if (where["duration_op"] == "14") {
        //Is less than
        duration_field = "and ucd.duration < " + where["duration"] + "";
      }
  
      //agent Number
      if (where["agentNumber_op"] == "1") {
        //Equals to
        agent_number_field = " and SUBSTRING(TRIM(ad.agent_mobile), -10) = SUBSTRING(" + where["agentNumber"] + ", -10)";
      } else if (where["agentNumber_op"] == "2") {
        //Not Equals to
        agent_number_field = " and SUBSTRING(TRIM(ad.agent_mobile), -10) != SUBSTRING(" + where["agentNumber"] + ", -10)";
      } else if (where["agentNumber_op"] == "3") {
        //Start with
        agent_number_field = ' and SUBSTRING(TRIM(ad.agent_mobile), -10) LIKE "' + where["agentNumber"] + '%"';
      } else if (where["agentNumber_op"] == "4") {
        //it contains
        agent_number_field = ' and SUBSTRING(TRIM(ad.agent_mobile), -10) LIKE "%' + where["agentNumber"] + '%"';
      } else if (where["agentNumber_op"] == "5") {
        //it does not contains
        agent_number_field = ' and SUBSTRING(TRIM(ad.agent_mobile), -10) NOT LIKE "%' + where["agentNumber"] + '%"';
      } else if (where["agentNumber_op"] == "6") {
        //it end with
        agent_number_field = ' and SUBSTRING(TRIM(ad.agent_mobile), -10) LIKE "%' + where["agentNumber"] + '"';
      }
  
      //Agent Name check
      if (where["agentName_op"] == "1") {
        //Equals to
        agent_name_field = 'and TRIM(ad.agent_name) = "' + where["agentName"] + '"';
      } else if (where["agentName_op"] == "2") {
        //Not Equals to
        agent_name_field = 'and TRIM(ad.agent_name) != "' + where["agentName"] + '"';
      } else if (where["agentName_op"] == "3") {
        //Start with
        agent_name_field = 'and TRIM(ad.agent_name) LIKE "' + where["agentName"] + '%"';
      } else if (where["agentName_op"] == "4") {
        //it contains
        agent_name_field = 'and TRIM(ad.agent_name) LIKE "%' + where["agentName"] + '%"';
      } else if (where["agentName_op"] == "5") {
        //it does not contains
        agent_name_field = 'and TRIM(ad.agent_name) NOT LIKE "%' + where["agentName"] + '%"';
      } else if (where["agentName_op"] == "6") {
        //it end with
        agent_name_field = 'and TRIM(ad.agent_name) LIKE "%' + where["agentName"] + '"';
      }
  
      //callingNumber check as customer number
      if (where["customerAni_op"] == "1") {
        //Equals to
        customer_number_field = " and SUBSTRING(TRIM(ucd.customer_ani), -10) = SUBSTRING(" + where["customerAni"] + ", -10)";
      } else if (where["customerAni_op"] == "2") {
        //Not Equals to
        customer_number_field = "and SUBSTRING(TRIM(ucd.customer_ani), -10) != SUBSTRING(" + where["customerAni"] + ", -10)";
      } else if (where["customerAni_op"] == "3") {
        //Start with
        customer_number_field = ' and SUBSTRING(TRIM(ucd.customer_ani), -10) LIKE "' + where["customerAni"] + '%"';
      } else if (where["customerAni_op"] == "4") {
        //it contains
        customer_number_field = ' and SUBSTRING(TRIM(ucd.customer_ani), -10) LIKE "%' + where["customerAni"] + '%"';
      } else if (where["customerAni_op"] == "5") {
        //it does not contains
        customer_number_field = ' and SUBSTRING(TRIM(ucd.customer_ani), -10) NOT LIKE "%' + where["customerAni"] + '%"';
      } else if (where["customerAni_op"] == "6") {
        //it end with
        customer_number_field = ' and SUBSTRING(TRIM(ucd.customer_ani), -10) LIKE "%' + where["customerAni"] + '"';
      }
  
      if (where["callMode_op"] == "1") {
        //Equals to
        g_mode = 'and TRIM(ucd.call_mode) = "' + where["callMode"] + '"';
      } else if (where["callMode_op"] == "2") {
        //Not Equals to
        g_mode = 'and TRIM(ucd.call_mode) != "' + where["callMode"] + '"';
      } else if (where["callMode_op"] == "3") {
        //Start with
        g_mode = 'and TRIM(ucd.call_mode) LIKE "' + where["callMode"] + '%"';
      } else if (where["callMode_op"] == "4") {
        //it contains
        g_mode = 'and TRIM(ucd.call_mode) LIKE "%' + where["callMode"] + '%"';
      } else if (where["callMode_op"] == "5") {
        //it does not contains
        g_mode = 'and TRIM(ucd.call_mode) NOT LIKE "%' + where["callMode"] + '%"';
      } else if (where["callMode_op"] == "6") {
        //it end with
        g_mode = 'and TRIM(ucd.call_mode) LIKE "%' + where["callMode"] + '"';
      }
  
      if (where["responseMessage_op"] == "1") {
        //Equals to
        responseMessage = 'and TRIM(ucd.response_message) = "' + where["responseMessage"] + '"';
      } else if (where["responseMessage_op"] == "2") {
        //Not Equals to
        responseMessage = 'and TRIM(ucd.response_message) != "' + where["responseMessage"] + '"';
      } else if (where["responseMessage_op"] == "3") {
        //Start with
        responseMessage = 'and TRIM(ucd.response_message) LIKE "' + where["responseMessage"] + '%"';
      } else if (where["responseMessage_op"] == "4") {
        //it contains
        responseMessage = 'and TRIM(ucd.response_message) LIKE "%' + where["responseMessage"] + '%"';
      } else if (where["responseMessage_op"] == "5") {
        //it does not contains
        responseMessage = 'and TRIM(ucd.response_message) NOT LIKE "%' + where["responseMessage"] + '%"';
      } else if (where["responseMessage_op"] == "6") {
        //it end with
        responseMessage = 'and TRIM(ucd.response_message) LIKE "%' + where["responseMessage"] + '"';
      }
  
      if (where["sessionId_op"] == "1") {
        //Equals to
        sessionId = 'and TRIM(ucd.session_id) = "' + where["sessionId"] + '"';
      } else if (where["sessionId_op"] == "2") {
        //Not Equals to
        sessionId = 'and TRIM(ucd.session_id) != "' + where["sessionId"] + '"';
      } else if (where["sessionId_op"] == "3") {
        //Start with
        sessionId = 'and TRIM(ucd.session_id) LIKE "' + where["sessionId"] + '%"';
      } else if (where["sessionId_op"] == "4") {
        //it contains
        sessionId = 'and TRIM(ucd.session_id) LIKE "%' + where["sessionId"] + '%"';
      } else if (where["sessionId_op"] == "5") {
        //it does not contains
        sessionId = 'and TRIM(ucd.session_id) NOT LIKE "%' + where["sessionId"] + '%"';
      } else if (where["sessionId_op"] == "6") {
        //it end with
        sessionId = 'and TRIM(ucd.session_id) LIKE "%' + where["sessionId"] + '"';
      }
  
      //status
      if (where["status_op"] == "11") {
        //Equals to
        status_field = ' and ucd.status =  "'+ where["status"] +'"';
      }
  
      //checking the intial record if 1 then better to start from 0.
      if (where["initialRecord"] == "1") {
        //Equals to
        g_initialRecord = "0";
      } else {
        g_initialRecord = where["initialRecord"];
      }
  
      if (where["startDate"] && where["endDate"]) {
        insert_date_time_field = ' AND ucd.insert_date BETWEEN "' + where["startDate"] + '" AND "' + where["endDate"] + '"';
      }
  
      if (where["orderBy"] && where["orderBy"] != "") {
        orderBy_field = " " + where["orderBy"] + "";
      } else {
        orderBy_field = " asc";
      }
  
      if (where["isDownload"] == "1") {
        limit_field = "";
      } else {
        g_initialRecord = where["initialRecord"] - 1;
        //g_initialRecord = getOffset(where["batchSize"],1);
        limit_field = " limit " + where["batchSize"] + " OFFSET " + g_initialRecord + "";
      }
  
      let Query =
        "SELECT ucd.id, ucd.sme_id,  ucd.insert_date as insert_date, ucd.duration, ucd.status, ucd.agent_id, ucd.response_message, ucd.agent_group, ucd.start_date as start_date, ucd.end_date as end_date, ucd.response_code, ucd.connected_duration, ucd.ringing_duration, ucd.customer_ani, ucd.session_id, ucd.call_mode,  ucd.call_info, ucd.call_route_reason, ad.agent_name as agent_name, ad.agent_mobile as agent_number FROM [kommuno-347914:kommuno_prod_bq.agent_report_details]  ucd left join [kommuno-347914:kommuno_prod_bq.agent_details] ad on ucd.agent_id = ad.agent_id  WHERE ucd.sme_id ='"+where["sme_id"]+ "' " +
        insert_date_time_field +
        " " +
        customer_number_field +
        " " +
        call_answer_field +
        " " +
        agent_name_field +
        " " +
        agent_number_field +
        " " +
        productId_field +
        " " +
        sessionId +
        " " +
        responseMessage +
        " " +
        customerName_field +
        " " +
        g_mode +
        " " +
        agentId_field +
        " " +
        duration_field +
        " " +
        productPrice_field +
        " " +
        status_field +
        " order by ucd.start_date" +
        orderBy_field +
        limit_field;

  console.log('Query',Query)

        const options = {
            query: Query,
            //location: 'US',
            useLegacySql: true,
          };
          const [job] = await bigquery.createQueryJob(options);
          const [executeQuery] = await job.getQueryResults();

    //   let executeQuery = await sequelize.query<any>(Query, {
    //     raw: true,
    //     type: QueryTypes.SELECT,
    //     replacements: { sme_id: where["sme_id"], startDate: where["startDate"], endDate: where["endDate"] },
    //   });
      callback(null, executeQuery);
    } catch (error: any) {
      logger.error(error);
      callback(error, null);
      throw new Error(error);
    }
  }