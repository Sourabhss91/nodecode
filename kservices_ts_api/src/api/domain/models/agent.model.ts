import { QueryTypes } from "sequelize";
import { sequelize } from "../../config/db";
import { logger } from "../../lib/logger";
import { remarksRequest, setRemarksRequest, fetchListRemarksRequest, callListFetchRequest } from "../entities/agent.entity";

/**  find */
export async function FindRemarks(where: remarksRequest, callback: any) {
  try {
    if (where["callDirection"] == "INCOMING") {
      var Query = "select remarks from incoming_ivr_call_cdr where session_id= :sessionId LIMIT 1";
    } else {
      var Query = "select remarks from outbond_ivr_cdr where session_id= :sessionId LIMIT 1";
    }

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sessionId: where["sessionId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/**  Update */
export async function SetRemarks(where: setRemarksRequest, callback: any) {
  try {
    if (where["callDirection"] == "INCOMING") {
      var Query = "UPDATE incoming_ivr_call_cdr set remarks = :remarks where session_id = :sessionId";
    } else {
      var Query = "UPDATE outbond_ivr_cdr set remarks =  :remarks where session_id = :sessionId";
    }

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { sessionId: where["sessionId"], remarks: where["remarks"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/**  find */
export async function FindListRemarks(where: fetchListRemarksRequest, callback: any) {
  try {
    if (where["callDirection"] == "INCOMING") {
      var Query =
        'select start_date_time, remarks, answer from incoming_ivr_call_cdr WHERE remarks != "NULL" and remarks != "" and SUBSTRING(TRIM(calling_number), -10)=SUBSTRING(:customerNumber, -10) order by start_date_time desc limit 0,5';
    } else {
      var Query =
        "select start_date_time, remarks, answer from outbond_ivr_cdr where remarks != 'NULL' and remarks != '' and SUBSTRING(TRIM(called_number), -10)=SUBSTRING(:customerNumber, -10) order by start_date_time desc limit 0,5";
    }

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { customerNumber: where["customerNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function FindCallList(where: callListFetchRequest, callback: any) {
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
      called_number_field = ' and SUBSTRING(TRIM(ivr.called_number), -10) = SUBSTRING("'+where['calledNumber']+'", -10) ';
    } else if (where["calledNumber_op"] == "2") {
      //Not Equals to
      called_number_field = 'and SUBSTRING(TRIM(ivr.called_number), -10) != SUBSTRING("'+where['calledNumber']+'", -10)';
    } else if (where["calledNumber_op"] == "3") {
      //Start with
      called_number_field = 'and SUBSTRING(TRIM(ivr.called_number), -10) LIKE "' + where["calledNumber"] + '%"';
    } else if (where["calledNumber_op"] == "4") {
      //it contains
      called_number_field = 'and SUBSTRING(TRIM(ivr.called_number), -10) LIKE "%' + where["calledNumber"] + '%"';
    } else if (where["calledNumber_op"] == "5") {
      //it does not contains
      called_number_field = 'and SUBSTRING(TRIM(ivr.called_number), -10) NOT LIKE "%' + where["calledNumber"] + '%"';
    } else if (where["calledNumber_op"] == "6") {
      //it end with
      called_number_field = 'and SUBSTRING(TRIM(ivr.called_number), -10) LIKE "%' + where["calledNumber"] + '"';
    }

    //callingNumber check as customer number
    if (where["callingNumber_op"] == "1") {
      //Equals to
      calling_number_field = 'and SUBSTRING(TRIM(cdr.calling_number), -10) = SUBSTRING("'+where['callingNumber']+'", -10)';
    } else if (where["callingNumber_op"] == "2") {
      //Not Equals to
      calling_number_field = 'and SUBSTRING(TRIM(cdr.calling_number), -10) != SUBSTRING("'+where['callingNumber']+'", -10)';
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
    let Query = "";
    if (table_name == "outbond_ivr_cdr") {
      Query =
        'select ad.agent_name, ad.recording_type, cdr.id, cdr.sme_id, DATE_FORMAT(cdr.start_date_time, "%Y-%m-%d %H:%i:%s") as start_date_time, DATE_FORMAT(cdr.end_date_time, "%Y-%m-%d %H:%i:%s") as end_date_time , DATE_FORMAT(cdr.insert_date_time, "%Y-%m-%d %H:%i:%s") as insert_date_time , cdr.duration, cdr.longcode, cdr.hlr, cdr.master_shortcode, cdr.sme_identifier, cdr.shortcode_mapping, if(cdr.call_direction_status="1","TRUE","FALSE") as call_direction_status, cdr.call_direction, cdr.calling_number, cdr.called_number, cdr.call_recording_status,cdr.call_recorded_file, if(cdr.voicemail_recording_status="1","TRUE","FALSE") as voicemail_recording_status, cdr.voicemail_recording_file, cdr.channel_no, cdr.server_ip_address, if(cdr.cdr_mode="1","INCOMING_IVR_CALL","I dont know") as cdr_mode, cdr.agent_group, cdr.patched_agent_id, cdr.session_id, cdr.merge_status, cdr.answer, if(cdr.answer="2","0","1") as call_status, cdr.address_book_id, ab.customer_name, cr.remarks, cdr.connected_call_duration, cdr.connected_duration, cdr.ringing_duration, cdr.call_type, cdr.call_description, cdr.ivr_duration, cdr.customer_status, rec.merged_file, bwl.blacklist_status from outbond_ivr_cdr cdr left join agent_details ad on cdr.patched_agent_id = ad.agent_id left join mpbx_call_recording rec on rec.call_id = cdr.call_recorded_file LEFT JOIN black_white_list bwl ON SUBSTRING(TRIM(bwl.customer_number), -10)=SUBSTRING(cdr.called_number, -10) AND bwl.sme_id = cdr.sme_id and bwl.blacklist_status != -9 LEFT JOIN address_book ab on SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(cdr.called_number, -10) AND ab.sme_id = cdr.sme_id LEFT JOIN customer_remarks cr ON cr.session_id = cdr.session_id where (cdr.start_date_time  BETWEEN :startDate AND :endDate) and cdr.sme_id = :id AND cdr.customer_status = 0' +
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
        callId_fiels +
        " order  by id desc " +
        limit_field +
        "";
    } else {
      Query =
        'SELECT ard.agent_id AS patched_agent_id, ad.agent_mobile, ad.agent_email, ad.recording_type, ard.agent_group AS agent_group,ad.agent_name AS agent_name,cdr.answer AS answer,cdr.call_direction AS call_direction, cdr.call_direction_status AS call_direction_status, cdr.session_id AS session_id,cdr.call_recorded_file AS call_recorded_file, cdr.call_recording_status AS call_recording_status, ard.status AS call_status,ad.agent_mobile AS called_number, cdr.calling_number AS calling_number, cdr.cdr_mode AS cdr_mode,cdr.channel_no AS channel_no,ab.customer_name AS customer_name, cdr.disconnected_by AS disconnected_by, cdr.duration AS duration, DATE_FORMAT(ard.start_date, "%Y-%m-%d %H:%i:%s") AS start_date_time, DATE_FORMAT(cdr.end_date_time, "%Y-%m-%d %H:%i:%s") as end_date_time, cdr.hlr AS hlr, cdr.connected_duration, cdr.connected_call_duration, cdr.ringing_duration,DATE_FORMAT(ard.insert_date, "%Y-%m-%d %H:%i:%s") AS insert_date_time, cdr.longcode AS longcode, cdr.call_type, cdr.master_shortcode AS master_shortcode, cdr.merge_status AS merge_status, rec.merged_file, cdr.server_ip_address AS server_ip_address, cdr.shortcode_mapping AS shortcode_mapping,cdr.sme_identifier AS sme_identifier, ard.start_date AS startDate_TimeS,cdr.voicemail_recording_file AS voicemail_recording_file, cdr.voicemail_recording_status AS voicemail_recording_status,cdr.address_book_id AS address_book_id, cdr.dtmf, cr.remarks, cdr.call_status AS iicc_call_status, mcm.flow_name FROM agent_report_details AS ard LEFT JOIN agent_details AS ad ON ard.agent_id = ad.agent_id LEFT JOIN incoming_ivr_call_cdr AS cdr ON cdr.session_id = ard.session_id AND cdr.customer_status = 0 LEFT JOIN address_book ab ON SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(cdr.calling_number, -10) AND ab.sme_id = cdr.sme_id left join mpbx_call_recording rec on rec.call_id = cdr.call_recorded_file LEFT JOIN customer_remarks cr ON cr.session_id = cdr.session_id LEFT JOIN mpbx_category_master mcm ON mcm.flow_id = cdr.call_flow_id AND mcm.sme_id = cdr.sme_id WHERE (ard.insert_date BETWEEN :startDate AND :endDate) AND cdr.sme_id= :id AND ard.agent_id= :agentId AND ard.call_info = "incoming"' +
        duration_field +
        " " +
        calling_number_field +
        "  " +
        call_status_field +
        " " +
        remarks_field +
        " " +
        agent_name_field +
        " " +
        callId_fiels +
        " GROUP BY ard.session_id ORDER BY cdr.insert_date_time DESC " +
        limit_field +
        "";
    }

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"], startDate: where["startDate"], endDate: where["endDate"], agentId: where["agentId"] }, 
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function totalRecordList(where: any, callback: any) {
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
      called_number_field = ' and SUBSTRING(TRIM(cdr.called_number), -10) = SUBSTRING("'+where['calledNumber']+'", -10) ';
    } else if (where["calledNumber_op"] == "2") {
      //Not Equals to
      called_number_field = 'and SUBSTRING(TRIM(cdr.called_number), -10) != SUBSTRING("'+where['calledNumber']+'", -10)';
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
      calling_number_field = 'and SUBSTRING(TRIM(cdr.calling_number), -10) = SUBSTRING("'+where['callingNumber']+'", -10)';
    } else if (where["callingNumber_op"] == "2") {
      //Not Equals to
      calling_number_field = 'and SUBSTRING(TRIM(cdr.calling_number), -10) != SUBSTRING("'+where['callingNumber']+'", -10)';
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
    let Query = "";
    if (table_name == "outbond_ivr_cdr") {
      Query =
        "select count(*) as total_records from " +
        table_name +
        " cdr left join agent_details ad on cdr.patched_agent_id = ad.agent_id LEFT JOIN customer_remarks cr ON cr.session_id = cdr.session_id where (cdr.start_date_time  BETWEEN :startDate  AND :endDate ) and cdr.sme_id = :id AND cdr.customer_status = 0" +
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
        callId_fiels +
        "";
    } else {
      Query =
        "SELECT COUNT(DISTINCT ard.session_id) AS total_records FROM agent_report_details AS ard LEFT JOIN agent_details AS ad ON ard.agent_id = ad.agent_id LEFT JOIN incoming_ivr_call_cdr AS cdr ON cdr.session_id = ard.session_id AND cdr.customer_status = 0 LEFT JOIN address_book ab ON SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(cdr.calling_number, -10) LEFT JOIN mpbx_call_recording rec ON rec.call_id = cdr.call_recorded_file LEFT JOIN customer_remarks cr ON cr.session_id = cdr.session_id WHERE (ard.insert_date BETWEEN :startDate AND :endDate) AND cdr.sme_id= :id AND ard.agent_id= :agentId AND ard.call_info = 'incoming'" +
        duration_field +
        " " +
        calling_number_field +
        "  " +
        call_status_field +
        " " +
        remarks_field +
        " " +
        agent_name_field +
        " " +
        callId_fiels +
        "";
    }

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"], startDate: where["startDate"], endDate: where["endDate"], agentId: where["agentId"] }, 
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getAgentCampaignSummaryData(where: any, callback: any) {
  try {
    var Query = "select ics.assigned, ics.answered, ics.failed, ics.pending, oic.campaign_name, oic.campaign_description, DATE_FORMAT(oic.start_date_time, '%Y-%m-%d %H:%i:%s') as start_date_time, DATE_FORMAT(oic.end_date_time, '%Y-%m-%d %H:%i:%s') as end_date_time from ivr_campaign_summary AS ics LEFT JOIN outgoing_campaign oic ON oic.id = ics.campaign_id where ics.sme_id= :smeId and ics.campaign_id= :campaignId and ics.agent_id= :agentId";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], campaignId: where["campaignId"], agentId: where["agentId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}
