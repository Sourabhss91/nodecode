import { QueryTypes } from "sequelize";
import { sequelize } from "../../config/db";
import { logger } from "../../lib/logger";
import { remarksRequest, setRemarksRequest, fetchListRemarksRequest, launchIn, launchInAgent, launchInOut, launchInOutWhere, fetchInsightRequest, callListFetchRequest,addClickToCallRequest,launchInWhereGet } from "../entities/mobileapp.entity";

/**  find remarks*/
export async function FindRemarks(where: remarksRequest, callback: any) {
  try {
    var Query = "select remarks from customer_remarks where session_id= :sessionId and call_direction= :callDirection LIMIT 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sessionId: where["sessionId"], callDirection: where["callDirection"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/**  check remarks exist */
export async function checkRemarksExist(where: remarksRequest, callback: any) {
  try {
    var Query = "select remarks from customer_remarks where session_id= :sessionId LIMIT 1";

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

/** Insert Remarks */
export async function InsertCustomerRemarks(where: any, callback: any) {
  try {
    let Query = "Insert into customer_remarks (sme_id, customer_number, call_direction, session_id, remarks, created_by,start_date_time) values ( :smeId, :customerNumber, :callDirection, :sessionId, :remarks, :createdBy, :insertDateTime)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: where["smeId"],
        customerNumber: where["customerNumber"],
        callDirection: where["callDirection"],
        sessionId: where["sessionId"],
        remarks: where["remarks"],
        createdBy: where["createdBy"],
        insertDateTime: where["insertDateTime"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/**  Update remarks*/
export async function UpdateCustomerRemarks(where: setRemarksRequest, callback: any) {
  try {
    var Query = "UPDATE customer_remarks set remarks =  :remarks, updated_date_time=:insertDateTime  where session_id = :sessionId and call_direction= :callDirection LIMIT 1";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { remarks: where["remarks"], sessionId: where["sessionId"], callDirection: where["callDirection"], insertDateTime: where["insertDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/**  find recent remarks list*/
export async function FindListRemarks(where: fetchListRemarksRequest, callback: any) {
  try {
    var Query = 'select start_date_time, remarks from customer_remarks WHERE remarks != "NULL" and remarks != "" and SUBSTRING(TRIM(customer_number), -10)=SUBSTRING(:customerNumber, -10)  AND sme_id = :smeId order by start_date_time desc limit 0,5';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { customerNumber: where["customerNumber"], callDirection: where["callDirection"], smeId: where["smeId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

 /** find */
 export async function FindappVersion(where: any, callback: any) {
    try {
      let Query = "SELECT platform, version_code, version_name, file_url,description,deleted from apk_detail where version_name  > :version_name  and platform =:platform and deleted !=1";
      let executeQuery = await sequelize.query<any>(Query, {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: { version_name: where["version_name"],platform: where["platform"] },
      });
      callback(null, executeQuery);
    } catch (error: any) {
      logger.error(error);
      callback(error, null);
      throw new Error(error);
    }
  }

export async function FindagentAppDetail(where: any, callback: any) {
    try {
      let Query = "SELECT id, agent_id,sme_id, apk_version, apk_name insert_date_time, update_date_time from agent_apk_version_detail where   sme_id =:sme_id  and agent_id =:agent_id ";
      let executeQuery = await sequelize.query<any>(Query, {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: { sme_id: where["sme_id"],agent_id: where["agent_id"],version_name: where["version_name"] },
      });
      callback(null, executeQuery);
    } catch (error: any) {
      logger.error(error);
      callback(error, null);
      throw new Error(error);
    }
  }

   /** find */
 export async function InsertLaunchIn(where: launchIn, callback: any) {
  try {
    const sql = `
    INSERT INTO agent_lunch_details (sme_id, agent_id, insert_date, in_time, message)
    VALUES (:sme_id, :agent_id, :insert_date, :in_time, :message);
  `
  let executeQuery = sequelize.query(sql, {
    type: QueryTypes.INSERT,
    replacements: { sme_id: where["sme_id"],agent_id: where["agent_id"] ,insert_date: where["insert_date"] ,in_time: where["in_time"],message: where["message"] },
  })
 
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

  /** find */
export async function FindagentInsight(where: fetchInsightRequest, callback: any) {
  try {
    let agent_id='';

    if(where['agentId'] !=0){
      agent_id = "and agent_id="+ where['agentId'];
    }

    let Query = "Select SUM(total_in_calls) AS totalInCalls, SUM(avg_call_duration) AS avgCallDuration, SUM(in_failed_calls) AS inFailedCalls, SUM(in_success_calls) AS inSuccessCalls, SUM(total_out_calls) AS totalOutCalls, SUM(total_calls) AS totalCalls, SUM(total_call_duration) AS totalCallDuration, SUM(out_success_calls) AS outSuccessCalls, (SUM(out_success_calls) * 100) / (SUM(total_out_calls)) AS outSuccess, SUM(out_failed_calls) AS outFailedCalls, SUM(office_hours) AS officeHours,SUM(no_answer) AS noAnswer ,SUM(lunch_hours) AS lunchHours, (SUM(in_success_calls) * 100)/(SUM(total_in_calls)) AS inSuccess from agent_calling_details  where sme_id = :sme_id "+agent_id+"  and Date(insert_date) BETWEEN :startDate and :endDate";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"],agentId: where["agentId"] ,startDate: where["startDate"] ,endDate: where["endDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function FindVoiceMail(where: any, callback: any) {
  try {
    let insert_date_time_field = ""; 
    let g_initialRecord = "";
    let insert_customer_number_field = "";
    let insert_duration_field = "";
    let insert_session_id_field = "";

    if (where["startDate"] && where["endDate"]) {
      insert_date_time_field = ' AND vcc.insert_date_time BETWEEN "' + where["startDate"] + '" AND "' + where["endDate"] + '"';
    }

    if (where["initialRecord"] == "1") {
      //Equals to
      g_initialRecord = "0";
    } else {
      g_initialRecord = where["initialRecord"];
    }

    if (where["customerNumber"] && where["customerNumber"] > 0) {
      insert_customer_number_field = ' AND SUBSTRING(TRIM(vcc.calling_number), -10) = SUBSTRING(:customerNumber, -10)';
    }

    if (where["duration"] && where["duration"] > 0) {
      insert_duration_field = ' AND vcc.duration = :duration';
    }

    if (where["sessionId"] && where["sessionId"] != "") {
      insert_session_id_field = ' AND vcc.session_id = :session_id';
    }

    let Query =
      "select id, sme_id, start_date_time, end_date_time, insert_date_time, duration, longcode, hlr, master_shortcode, sme_identifier, shortcode_mapping, call_direction_status, call_direction, calling_number, called_number, call_recording_status, call_recorded_file, voicemail_recording_status, voicemail_recording_file, channel_no, server_ip_address, cdr_mode, agent_group, patched_agent_id, session_id, merge_status, answer, address_book_id, customer_name, assign_flag from voicemail_call_cdr vcc where sme_id = :id " + insert_date_time_field + " " + insert_customer_number_field + " " + insert_duration_field + " " + insert_session_id_field + " order by vcc.insert_date_time desc limit" + " "+ g_initialRecord + ", :batchSize";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"], startDate: where["startDate"], endDate: where["endDate"], customerNumber: where["customerNumber"], duration: where["duration"], session_id: where["sessionId"], batchSize: where["batchSize"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/**  Update */
export async function UpdateLaunchInAgentOut(where: launchInOut, callback: any) {
  try {
 
    var Query = "UPDATE agent_details set status =  :status where agent_id = :agent_id LIMIT 1";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { agent_id: where["agent_id"],out_time: where["out_time"],status: where["status"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/**  Update */
export async function UpdateagentAppDetail(where: any, callback: any) {
  try {
 
    var Query = "UPDATE agent_apk_version_detail set apk_name =:version_name , update_date_time =:update_date_time where agent_id = :agent_id and sme_id = :sme_id  LIMIT 1";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { agent_id: where["agent_id"],version_name: where["version_name"],sme_id: where["sme_id"],update_date_time: where["update_date_time"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/**  Update */
export async function UpdateLaunchDetailsInAgentOut(payload: launchInOut,where: launchInOutWhere, callback: any) {
  try {
 
    var Query = "UPDATE agent_lunch_details set out_time =  :out_time where id = :id LIMIT 1";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { id: where["id"],out_time: payload["in_time"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** get total records of voicemail */
export async function TotalVoicemailRecords(where: any, callback: any) {
  try {
    let insert_date_time_field = "";
    
    if (where["startDate"] && where["endDate"]) {
      insert_date_time_field = ' AND vcc.insert_date_time BETWEEN "' + where["startDate"] + '" AND "' + where["endDate"] + '"';
    }

    let Query =
      "SELECT count(*) as total_records from voicemail_call_cdr vcc where sme_id = :id " + insert_date_time_field + " order by vcc.insert_date_time desc";

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

 /** find */
 export async function getAgentDetailsLaunch(where: any, callback: any) {
  try {
    //let Query = "SELECT id, agent_id, insert_date, out_time  from agent_lunch_details where agent_id = :agent_id ORDER BY id desc limit 1";
    let Query = "SELECT id, agent_id, insert_date, out_time  from agent_lunch_details where agent_id = :agent_id AND DATE(insert_date) = date(:currentDateTime) AND out_time IS null ";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agent_id: where["agent_id"], currentDateTime: where["currentDateTime"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

 /** find */
 export async function getAgentDetailsLaunchList(where: launchInOutWhere, callback: any) {
  try {
    let Query = "SELECT id, agent_id, insert_date,out_time,in_time, message  from agent_lunch_details where agent_id = :agent_id ORDER BY id desc";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agent_id: where["id"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

 /** find */
 export async function getAgentDetailsLaunchGetSameDayEntry(where: launchInWhereGet, callback: any) {
  try {
    let Query = "SELECT id, agent_id, insert_date,out_time,in_time, message  from agent_lunch_details where agent_id = :agent_id AND (insert_date BETWEEN :start_date AND :end_date)  ORDER BY id desc";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agent_id: where["agent_id"],start_date: where["start_date"],end_date: where["end_date"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

 /** find */
 export async function getTimeForToday(where: any, payload:any, callback: any) {
  try {
    //let Query = "SELECT * from agent_details where agent_id = :agent_id  LIMIT 1";

    let Query = "SELECT * from agent_details_timing  where agent_id =:agent_id  and days_week= UPPER(DATE_FORMAT(:currentDate,'%a')) AND DATE_FORMAT(in_time,'%T') < DATE_FORMAT(:currentDate,'%T') AND DATE_FORMAT(out_time,'%T') > DATE_FORMAT(:currentDate,'%T') limit 1";

    
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agent_id: where["agent_id"],currentDate: payload["currentDate"]},
    });

    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

 /** find */
 export async function getAngentDetails(where: launchInWhereGet, callback: any) {
  try {
    let Query = "SELECT * from agent_details where agent_id = :agent_id LIMIT 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agent_id: where["agent_id"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindCdrMissCall(where: any, callback: any) {
  try {
    var initialRecord;
    var limit_field;
    initialRecord = where["initialRecord"] - 1;
    limit_field = " limit " + initialRecord + "," + where["batchSize"] + "";

    let Query = "SELECT  ard.agent_id AS patched_agent_id,ard.agent_group AS agent_group,ad.agent_name AS agent_name,ivr.answer AS answer,ivr.call_direction AS call_direction, ivr.call_direction_status AS call_direction_status, ivr.session_id AS session_id,ivr.call_recorded_file AS call_recorded_file, ivr.call_recording_status AS call_recording_status, ivr.call_status AS call_status,ivr.called_number AS called_number, ivr.calling_number AS calling_number, ivr.cdr_mode AS cdr_mode,ivr.channel_no AS channel_no,ab.customer_name AS customer_name, ivr.disconnected_by AS disconnected_by, ard.duration AS duration,ard.start_date AS start_date_time, ivr.hlr AS hlr, ard.insert_date AS insert_date_time, ivr.longcode AS longcode, ivr.master_shortcode AS master_shortcode, ivr.merge_status AS merge_status, ivr.server_ip_address AS server_ip_address, ivr.shortcode_mapping AS shortcode_mapping,ivr.sme_identifier AS sme_identifier, ard.start_date AS startDate_TimeS,ivr.voicemail_recording_file AS voicemail_recording_file, ivr.voicemail_recording_status AS voicemail_recording_status,ivr.address_book_id as address_book_id FROM agent_report_details AS ard LEFT JOIN agent_details  as ad ON ard.agent_id = ad.agent_id LEFT JOIN incoming_ivr_call_cdr  as ivr ON ivr.session_id = ard.session_id LEFT JOIN address_book ab on ab.customer_number_primary = ivr.calling_number AND ab.`status` != -9 where ard.status = 1 and ard.insert_date BETWEEN :startDate and :endDate and  ard.agent_id= :id  AND ard.call_info='incoming' ORDER BY ivr.insert_date_time DESC" +
    limit_field;

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"],startDate: where["startDate"],endDate: where["endDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

 /** find */
 export async function getAgentDetailsLaunchNext(where: launchIn, callback: any) {
  try {
    let Query = "SELECT id, agent_id, insert_date,out_time  from agent_lunch_details where agent_id = :agent_id AND DATE(insert_date)= :insert_date AND out_time IS NULL ORDER BY id desc limit 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agent_id: where["agent_id"], insert_date:where["insert_date"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindTypeDetail(where: any, callback: any) {
  try {
    let Query = "SELECT ad.in_permission_flag AS inPermissionFlag,ad.out_permission_flag AS outPermissionFlag,  ad.break_permission_flag as breakPermissionFlag, sp.account_sid, ad.agent_email, ad.agent_extention, ad.agent_id, agm.group_id, ad.agent_masking, ad.agent_mobile, agent_name AS agentName, ad.agent_score, sp.agent_relax_time, sp.allowed_agents, sp.alternate_number, ad.assign_failed_calls, ad.assign_voicemail_calls, sp.balance, sp.biz_address, sp.call_back_url, ad.days_flag, sp.gui_timer, sp.in_channels, sp.insert_time, sp.in_permission_flag AS sme_in_call_permission,  sp.out_permission_flag AS sme_out_call_permission,  sp.in_queue_channels, sp.`language`, sp.masking, l.longcode, lsm.longcode_id AS longcode_id, sp.out_channels, sp.recording, sp.rec_validity, sp.eod_report_flag, sp.selection_algo, sp.service_flag, sp.id AS smeId, sp.sme_mobile, sp.email_id AS sme_name, sp.`status` AS sme_status, ad.`status` AS agent_status, sp.sticky_algo, ad.sticky_agent, ad.sticky_days, ur.ROLE as roles, sp.name AS smeName, u.username AS userName, sp.status,sp.billing_status FROM sme_profile sp LEFT JOIN agent_details ad ON ad.sme_id = sp.id LEFT JOIN agent_group_mapping agm ON agm.agent_id = ad.agent_id LEFT JOIN users u ON u.username = ad.agent_email LEFT JOIN user_roles ur ON ur.username = u.username LEFT JOIN longcodes_sme_mapping lsm ON lsm.sme_id = sp.id LEFT JOIN longcodes l ON l.id = lsm.longcode_id  WHERE u.username = :id and ad.`status` != -9 and u.enabled=1 LIMIT 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

 /** find */
 export async function getAgentDetails(where: launchIn, callback: any) {
  try {
    let Query = "SELECT agent_id, status, insert_time,in_time,out_time  from agent_details where agent_id = :agent_id and status !=-9  and status !=0 limit 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agent_id: where["agent_id"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/**  Update */
export async function UpdateLaunchInAgent(where: launchInAgent, callback: any) {
  try {
 
    var Query = "UPDATE agent_details set status =  :status where agent_id = :agent_id";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { agent_id: where["agent_id"],status: where["status"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function DeleteAgentAddressBook(where: any, callback: any) {
  try {
    let Query = "Update address_book set status =-9 where id= :addressBookId limit 1 ";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { addressBookId: where["addressBookId"] },
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
      table_name = 'incoming_ivr_call_cdr';
    }
    else if (where["type"] == "outgoing") {
        table_name = 'outbond_ivr_cdr';
    }
    else if (where["type"] == "failedIncoming") {
        table_name = 'agent_report_details';
    }

    if (where["isDownload"] == "1") {
      limit_field = "";
    } else {
      initialRecord = where["initialRecord"] - 1;
      limit_field = " limit " + initialRecord + "," + where["batchSize"] + "";
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
      called_number_field = 'and TRIM(cdr.called_number) = "' + where["calledNumber"] + '"';
    } else if (where["calledNumber_op"] == "2") {
      //Not Equals to
      called_number_field = 'and TRIM(cdr.called_number) != "' + where["calledNumber"] + '"';
    } else if (where["calledNumber_op"] == "3") {
      //Start with
      called_number_field = 'and TRIM(cdr.called_number) LIKE "' + where["calledNumber"] + '%"';
    } else if (where["calledNumber_op"] == "4") {
      //it contains
      called_number_field = 'and TRIM(cdr.called_number) LIKE "%' + where["calledNumber"] + '%"';
    } else if (where["calledNumber_op"] == "5") {
      //it does not contains
      called_number_field = 'and TRIM(cdr.called_number) NOT LIKE "%' + where["calledNumber"] + '%"';
    } else if (where["calledNumber_op"] == "6") {
      //it end with
      called_number_field = 'and TRIM(cdr.called_number) LIKE "%' + where["calledNumber"] + '"';
    }

    //callingNumber check as customer number
    if (where["callingNumber_op"] == "1") {
      //Equals to
      calling_number_field = 'and TRIM(cdr.calling_number) = "' + where["callingNumber"] + '"';
    } else if (where["callingNumber_op"] == "2") {
      //Not Equals to
      calling_number_field = 'and TRIM(cdr.calling_number) != "' + where["callingNumber"] + '"';
    } else if (where["callingNumber_op"] == "3") {
      //Start with
      calling_number_field = 'and TRIM(cdr.calling_number) LIKE "' + where["callingNumber"] + '%"';
    } else if (where["callingNumber_op"] == "4") {
      //it contains
      calling_number_field = 'and TRIM(cdr.calling_number) LIKE "%' + where["callingNumber"] + '%"';
    } else if (where["callingNumber_op"] == "5") {
      //it does not contains
      calling_number_field = 'and TRIM(cdr.calling_number) NOT LIKE "%' + where["callingNumber"] + '%"';
    } else if (where["callingNumber_op"] == "6") {
      //it end with
      calling_number_field = 'and TRIM(cdr.calling_number) LIKE "%' + where["callingNumber"] + '"';
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
      remarks_field = 'and TRIM(cdr.remarks) = "' + where["remarks"] + '"';
    } else if (where["remarks_op"] == "2") {
      //Not Equals to
      remarks_field = 'and TRIM(cdr.remarks) != "' + where["remarks"] + '"';
    } else if (where["remarks_op"] == "3") {
      //Start with
      remarks_field = 'and TRIM(cdr.remarks) LIKE "' + where["remarks"] + '%"';
    } else if (where["remarks_op"] == "4") {
      //it contains
      remarks_field = 'and TRIM(cdr.remarks) LIKE "%' + where["remarks"] + '%"';
    } else if (where["remarks_op"] == "5") {
      //it does not contains
      remarks_field = 'and TRIM(cdr.remarks) NOT LIKE "%' + where["remarks"] + '%"';
    } else if (where["remarks_op"] == "6") {
      //it end with
      remarks_field = 'and TRIM(cdr.remarks) LIKE "%' + where["remarks"] + '"';
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
        'select ad.agent_name, cdr.id, cdr.sme_id, cdr.start_date_time, cdr.end_date_time, cdr.insert_date_time, cdr.duration, cdr.longcode, cdr.hlr, cdr.master_shortcode, cdr.sme_identifier, cdr.shortcode_mapping, if(cdr.call_direction_status="1","TRUE","FALSE") as call_direction_status, cdr.call_direction, cdr.calling_number, cdr.called_number, cdr.call_recording_status,cdr.call_recorded_file, if(cdr.voicemail_recording_status="1","TRUE","FALSE") as voicemail_recording_status, cdr.voicemail_recording_file, cdr.channel_no, cdr.server_ip_address, if(cdr.cdr_mode="1","INCOMING_IVR_CALL","I dont know") as cdr_mode, cdr.agent_group, cdr.patched_agent_id, cdr.session_id, cdr.merge_status, cdr.answer, if(cdr.answer="2","0","1") as call_status, cdr.address_book_id, cdr.remarks, rec.merged_file, ab.customer_name, ab.company_name, ab.email_id, ab.mode, ab.address from outbond_ivr_cdr cdr left join agent_details ad on cdr.patched_agent_id = ad.agent_id left join mpbx_call_recording rec on rec.call_id = cdr.call_recorded_file LEFT JOIN address_book ab on ab.customer_number_primary = cdr.called_number AND ab.status != -9 AND ab.sme_id = cdr.sme_id where (cdr.start_date_time  BETWEEN :startDate AND :endDate) and cdr.patched_agent_id = :id ' +
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
        " GROUP BY cdr.session_id order  by id desc " +
        limit_field +
        "";
    } else if(table_name == "agent_report_details"){
      Query =
        'select adr.agent_id, ad.agent_name, adr.id, adr.sme_id, adr.start_date as start_date_time, adr.end_date as end_date_time, adr.insert_date as insert_date_time, adr.duration, cdr.longcode, cdr.hlr, cdr.master_shortcode, cdr.sme_identifier, cdr.shortcode_mapping, if(cdr.call_direction_status="1","TRUE","FALSE") as call_direction_status, cdr.call_direction, adr.customer_ani as calling_number, cdr.called_number, cdr.call_recording_status,cdr.call_recorded_file, if(cdr.voicemail_recording_status="1","TRUE","FALSE") as voicemail_recording_status, cdr.voicemail_recording_file, cdr.channel_no, cdr.server_ip_address, if(cdr.cdr_mode="1","INCOMING_IVR_CALL","I dont know") as cdr_mode, adr.agent_group, cdr.patched_agent_id, adr.session_id, cdr.merge_status, cdr.answer, cdr.call_status, cdr.disconnected_by, cdr.address_book_id, cdr.remarks, ab.customer_name, ab.company_name, ab.email_id, ab.mode, ab.address from agent_report_details adr left join incoming_ivr_call_cdr cdr on adr.session_id = cdr.session_id  left join agent_details ad on cdr.patched_agent_id = ad.agent_id LEFT JOIN address_book ab on ab.customer_number_primary = cdr.calling_number AND ab.status != -9 AND ab.sme_id = adr.sme_id where adr.agent_id = :id and (adr.start_date  BETWEEN :startDate AND :endDate) and adr.status = 1 ' +
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
        callId_fiels +
        " GROUP BY adr.session_id order  by id desc " +
        limit_field +
        "";
    } else {
      Query =
        'SELECT ard.agent_id AS patched_agent_id,ard.agent_group AS agent_group,ad.agent_name AS agent_name,ivr.answer AS answer,ivr.call_direction AS call_direction, ivr.call_direction_status AS call_direction_status, ivr.session_id AS session_id,ivr.call_recorded_file AS call_recorded_file, ivr.call_recording_status AS call_recording_status, ard.status AS call_status,ad.agent_mobile AS called_number, ivr.calling_number AS calling_number, ivr.cdr_mode AS cdr_mode,ivr.channel_no AS channel_no,ab.customer_name AS customer_name, ivr.disconnected_by AS disconnected_by, ivr.duration AS duration, ard.start_date AS start_date_time, ivr.end_date_time as end_date_time, ivr.hlr AS hlr, ivr.connected_duration, ivr.connected_call_duration, ivr.ringing_duration,ard.insert_date AS insert_date_time, ivr.longcode AS longcode, ivr.call_type, ivr.master_shortcode AS master_shortcode, ivr.merge_status AS merge_status, rec.merged_file, ivr.server_ip_address AS server_ip_address, ivr.shortcode_mapping AS shortcode_mapping,ivr.sme_identifier AS sme_identifier, ard.start_date AS startDate_TimeS,ivr.voicemail_recording_file AS voicemail_recording_file, ivr.voicemail_recording_status AS voicemail_recording_status,ivr.address_book_id AS address_book_id, cr.remarks, ivr.call_status AS iicc_call_status FROM agent_report_details AS ard LEFT JOIN agent_details AS ad ON ard.agent_id = ad.agent_id LEFT JOIN incoming_ivr_call_cdr AS ivr ON ivr.session_id = ard.session_id AND ivr.customer_status = 0 LEFT JOIN address_book ab ON ab.customer_number_primary = ivr.calling_number AND ab.`status` != -9 AND ab.sme_id = ard.sme_id left join mpbx_call_recording rec on rec.call_id = ivr.call_recorded_file LEFT JOIN customer_remarks cr ON cr.session_id = ivr.session_id WHERE (ard.insert_date BETWEEN :startDate AND :endDate) AND ivr.sme_id= :smeId AND ard.agent_id= :id AND ard.call_info = "incoming" GROUP BY ard.session_id' +
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
        callId_fiels +
        " ORDER BY ivr.insert_date_time DESC " +
        limit_field +
        "";
    }

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"],smeId: where["smeId"], startDate: where["startDate"], endDate: where["endDate"] },
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
      called_number_field = 'and TRIM(cdr.called_number) = "' + where["calledNumber"] + '"';
    } else if (where["calledNumber_op"] == "2") {
      //Not Equals to
      called_number_field = 'and TRIM(cdr.called_number) != "' + where["calledNumber"] + '"';
    } else if (where["calledNumber_op"] == "3") {
      //Start with
      called_number_field = 'and TRIM(cdr.called_number) LIKE "' + where["calledNumber"] + '%"';
    } else if (where["calledNumber_op"] == "4") {
      //it contains
      called_number_field = 'and TRIM(cdr.called_number) LIKE "%' + where["calledNumber"] + '%"';
    } else if (where["calledNumber_op"] == "5") {
      //it does not contains
      called_number_field = 'and TRIM(cdr.called_number) NOT LIKE "%' + where["calledNumber"] + '%"';
    } else if (where["calledNumber_op"] == "6") {
      //it end with
      called_number_field = 'and TRIM(cdr.called_number) LIKE "%' + where["calledNumber"] + '"';
    }

    //callingNumber check as customer number
    if (where["callingNumber_op"] == "1") {
      //Equals to
      calling_number_field = 'and TRIM(cdr.calling_number) = "' + where["callingNumber"] + '"';
    } else if (where["callingNumber_op"] == "2") {
      //Not Equals to
      calling_number_field = 'and TRIM(cdr.calling_number) != "' + where["callingNumber"] + '"';
    } else if (where["callingNumber_op"] == "3") {
      //Start with
      calling_number_field = 'and TRIM(cdr.calling_number) LIKE "' + where["callingNumber"] + '%"';
    } else if (where["callingNumber_op"] == "4") {
      //it contains
      calling_number_field = 'and TRIM(cdr.calling_number) LIKE "%' + where["callingNumber"] + '%"';
    } else if (where["callingNumber_op"] == "5") {
      //it does not contains
      calling_number_field = 'and TRIM(cdr.calling_number) NOT LIKE "%' + where["callingNumber"] + '%"';
    } else if (where["callingNumber_op"] == "6") {
      //it end with
      calling_number_field = 'and TRIM(cdr.calling_number) LIKE "%' + where["callingNumber"] + '"';
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
      remarks_field = 'and TRIM(cdr.remarks) = "' + where["remarks"] + '"';
    } else if (where["remarks_op"] == "2") {
      //Not Equals to
      remarks_field = 'and TRIM(cdr.remarks) != "' + where["remarks"] + '"';
    } else if (where["remarks_op"] == "3") {
      //Start with
      remarks_field = 'and TRIM(cdr.remarks) LIKE "' + where["remarks"] + '%"';
    } else if (where["remarks_op"] == "4") {
      //it contains
      remarks_field = 'and TRIM(cdr.remarks) LIKE "%' + where["remarks"] + '%"';
    } else if (where["remarks_op"] == "5") {
      //it does not contains
      remarks_field = 'and TRIM(cdr.remarks) NOT LIKE "%' + where["remarks"] + '%"';
    } else if (where["remarks_op"] == "6") {
      //it end with
      remarks_field = 'and TRIM(cdr.remarks) LIKE "%' + where["remarks"] + '"';
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
        " cdr left join agent_details ad on cdr.patched_agent_id = ad.agent_id where (cdr.start_date_time  BETWEEN :startDate  AND :endDate ) and cdr.patched_agent_id = :id " +
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
        "SELECT COUNT(DISTINCT ard.session_id) AS total_records FROM agent_report_details AS ard  WHERE (ard.insert_date BETWEEN :startDate AND :endDate) AND ard.sme_id= :smeId AND ard.agent_id= :id AND ard.call_info = 'incoming' " +
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
        callId_fiels +
        "";
    }

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"],smeId: where["smeId"], startDate: where["startDate"], endDate: where["endDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** find */
export async function addClickToCall(payload: addClickToCallRequest, where:any, callback: any) {
  try {
    let Query =
      "INSERT INTO click2call_schedule (account_sid, group_name, agent_number, call_mode, call_priority, custom_dtmf, custom_dtmf_flag, from_no, live_event, live_event_flag, media_file_flag, media_file_id, name_file_flag, name_file_id, optional_field, virtual_number, recording_flag, scheduled_date, session_id, sme_id, time_limit, to_no, status, inserted_date,base_id) VALUES (:accountSid, :agentGroup, :agentNumber, :callMode, :callPriority, :customDtmf, :customDtmfFlag, :from, :liveEvent, :liveEventFlag, :mediaFileFlag, :mediaFileId, :nameFileFlag, :nameFileId, :optionalField, :virtualNumber, :recordingFlag, :scheduleDateTime, :sessionId, :smeId, :timeLimit, :to, 0, :insertDateTime, :baseId)  ";
      let executeQuery = await sequelize.query(Query, {
        raw: true,
        type: QueryTypes.INSERT,
        replacements: { accountSid: payload["accountSid"], agentGroup: payload["agentGroup"], agentNumber: payload["agentNumber"], callMode: payload["callMode"], callPriority: payload["callPriority"], customDtmf: payload["customDtmf"], customDtmfFlag: payload["customDtmfFlag"], from: payload["from"], liveEvent: payload["liveEvent"], liveEventFlag: payload["liveEventFlag"], mediaFileFlag: payload["mediaFileFlag"], mediaFileId: payload["mediaFileId"], nameFileFlag: payload["nameFileFlag"], nameFileId: payload["nameFileId"], optionalField: payload["optionalField"], virtualNumber: where["virtualNumber"], recordingFlag: payload["recordingFlag"], scheduleDateTime: payload["scheduleDateTime"], sessionId: payload["sessionId"], smeId: payload["smeId"], timeLimit: payload["timeLimit"], to: payload["to"], insertDateTime: payload["insertDateTime"],baseId: payload["baseId"] },
      });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/**  Update */
export async function UpdateCustomerName(where: any, callback: any) {
  try {
    
      var Query = "update address_book  set customer_name =:g_customerName  where customer_number_primary =:g_customerNumberPrimary and id =:addressbookId";
   

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { g_customerName: where["g_customerName"], g_customerNumberPrimary: where["g_customerNumberPrimary"], addressbookId: where["addressbookId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindCallBase(where: any, callback: any) {
  try {
    let Query = "SELECT ab.id AS address_book_id, ab.customer_name, csb.base_id AS baseId, csb.call_counter AS callCounter, csb.call_type AS callType, csb.description AS description,csb.insert_time AS insertTime, csb.mobile AS mobile, csb.schedule_date_time AS scheduleDateTime, csb.STATUS AS STATUS FROM call_scheduler_base AS csb LEFT JOIN address_book AS ab ON    SUBSTRING(TRIM(csb.mobile), -10)  =  SUBSTRING(TRIM(ab.customer_number_primary), -10) WHERE csb.agent_id = :id GROUP BY csb.base_id order by  FIELD(csb.call_counter,1) asc, csb.schedule_date_time desc";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindCustomerBook(where: any, callback: any) {
  try {
    let Query = "Select id from address_book where sme_id = :sme_id and SUBSTRING(TRIM(customer_number_primary), -10) = SUBSTRING(:customer_number, -10) and status !=-9 LIMIT 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], customer_number: where["customer_number"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** update customer name in address book*/
export async function UpdateAddressBookCustomername(where: any, callback: any) {
  try {
    let Query = "update address_book set customer_name = :customer_name, company_name = :company_name, email_id = :email_id,  updated_date_time = :insertDateTime where sme_id = :sme_id AND SUBSTRING(TRIM(customer_number_primary), -10) = SUBSTRING(:customer_number, -10)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        customer_name: where["customer_name"],
        company_name: where["company_name"],
        email_id: where["email_id"],
        insertDateTime: where["insertDateTime"],
        sme_id: where["sme_id"],
        customer_number: where["customer_number"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** check can create agent  */
export async function InsertAddressBookCustomername(payload: any, callback: any) {
  try {
    payload["customer_number"] = payload["customer_number"].toString().indexOf("+91") !== -1 ? payload["customer_number"].toString().trim() : "+91"+payload["customer_number"].toString().trim();

    let Query = "INSERT INTO address_book (sme_id, customer_name, customer_number_primary, created_by, company_name, email_id, customer_number_secondary, mode, visibility_flag,insert_date_time, status) VALUES (:sme_id, :customer_name, :customer_number, :agent_id, :company_name, :email_id, :customer_number_secondary, :mode, :visibility_flag, :insertDateTime, :status)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { sme_id: payload["sme_id"], customer_name: payload["customer_name"], customer_number: payload["customer_number"], agent_id: payload["agent_id"], company_name: payload["company_name"], email_id: payload["email_id"], customer_number_secondary: payload["customer_number_secondary"], mode: payload["mode"], visibility_flag: payload["visibility_flag"], insertDateTime: payload["insertDateTime"], status: payload["status"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function SetCallSchedule(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO customer_followup ( sme_id, message, created_by,reminder_date_time,status ,created_date_time,customer_number) VALUES ( :sme_id, :description, :agent_id,:scheduleDateTime, :status, :insertDateTime, :mobile)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { sme_id: payload["sme_id"],description: payload["description"], agent_id: payload["agent_id"], status: payload["status"], scheduleDateTime: payload["scheduleDateTime"], insertDateTime: payload["insertDateTime"], mobile: payload["mobile"]},
    });

    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindAddressbookList(where: any, callback: any) {
  try {
    let Query = "Select id, sme_id, customer_name, customer_number_primary, mode, customer_number_secondary, company_name, email_id,address, created_by, visibility_flag, insert_date_time, updated_date_time, is_updated from address_book where sme_id = :sme_id and status = 1 and created_by = :id ORDER BY customer_name ASC";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { 
        sme_id: where["sme_id"], 
        id: where["id"], 
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindAddressbookListNew(where: any, callback: any) {
  try {
    var initialRecord;
    var limit_field;
    initialRecord = where["initialRecord"] - 1;
    limit_field = " limit " + initialRecord + "," + where["batchSize"] + "";

    let Query = "Select ab.id, ab.sme_id, ab.customer_name, ab.customer_number_primary, ab.MODE, ab.customer_number_secondary, ab.company_name, ab.email_id, ab.address, ab.created_by, ab.visibility_flag, ab.insert_date_time, ab.updated_date_time, ab.is_updated FROM address_book ab LEFT JOIN unique_customer_detail ucd ON ucd.sme_id = ab.sme_id AND RIGHT(ucd.customer_number, 10) = RIGHT(ab.customer_number_primary, 10) where ab.sme_id = :sme_id and ab.status = 1 and (ab.created_by = :id OR ucd.assigned_agent_id = :id) ORDER BY ab.customer_name ASC" +limit_field;
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], id: where["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

 /** find */
 export async function getAssigneCount(where: launchInWhereGet, callback: any) {
  try {
    let Query = "SELECT SUM(case when call_type =0 then 1 else 0 end)AS schAssinedCount, SUM(case when call_type =1 then 1 else 0 end)AS schFollowUpCount  from call_scheduler_base where agent_id = :agent_id  AND call_counter=0";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agent_id: where["agent_id"],start_date: where["start_date"],end_date: where["end_date"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindSingleAddressbook(where: any, callback: any) {
  try {
    let Query = "Select id, sme_id, customer_name, customer_number_primary, mode, customer_number_secondary, company_name, email_id,address, created_by, visibility_flag, insert_date_time, updated_date_time, is_updated from address_book where id = :addressBookId Limit 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { addressBookId: where["addressBookId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function findAgentLongcode(where: any, callback: any) {
  try {
    let Query = "SELECT lg.longcode FROM longcodes_agent_mapping AS lgm LEFT JOIN longcodes AS lg ON lg.id =lgm.longcode_id WHERE lgm.agent_id = :agent_id and lg.status = 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agent_id: where["agent_id"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function findSmeLongcode(where: any, callback: any) {
  try {
    let Query = "SELECT  lg.longcode, lg.status FROM longcodes_sme_mapping AS lgm LEFT JOIN longcodes AS lg ON lg.id =lgm.longcode_id WHERE lgm.sme_id = :smeId and lg.status = 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function checkEmailExistAddressBook(where: any, callback: any) {
  try {
    let Query ;
    
    if(where["addressBookId"] == 1){
      Query = "Select email_id from address_book where email_id =:email_id";
    }else{
      Query = "Select email_id from address_book where email_id =:email_id and id !=:addressBookId ";
    }
    
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { addressBookId: where["addressBookId"], email_id: where["email_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** update notification token*/
export async function UpdatenotificationToken(where: any, callback: any) {
  try {
    var  Query ="";
    if( where["mode"] =='APP'){
      Query = "update users set app_notification_token = :token where username = :username";
    }else{
      Query = "update users set notification_token = :token where username = :username";
    }
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        token: where["token"],
        username: where["username"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindOutgoingCampaignData(where: any, callback: any) {
  try {
    let Query = "SELECT sme_id, customer_number, recent_duration, recent_via_longcode, server_ip_address, recent_patched_agent_id, total_incoming_calls, total_outgoing_calls, lead_type, lead_status, city_id, product_id, product_price, assigned_agent_id, connected_call_duration, sticky_type, insert_date_time, update_date_time, call_type,answer from unique_customer_detail where assigned_to= :id and sme_id=:smeId and answer = 3";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"], smeId: where["smeId"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function totalRecordOutgoingCampaignData(where: any, callback: any) {
  try {
    let Query = "SELECT count(*) as total_records from unique_customer_detail where assigned_to= :id and sme_id=:smeId and answer =3";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"], smeId: where["smeId"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindFollowUpCalls(where: any, callback: any) {
  try {
    var initialRecord;
    var limit_field;
    initialRecord = where["initialRecord"] - 1;
    limit_field = " limit " + initialRecord + "," + where["batchSize"] + "";

    let Query = "SELECT cf.id, ab.customer_name, cf.customer_number, cf.reminder_date_time as scheduleDateTime, cf.sme_id,cf.created_by, cf.message, ucd.recent_duration, ucd.recent_via_longcode, ucd.server_ip_address, ucd.recent_patched_agent_id, ucd.total_incoming_calls, ucd.total_outgoing_calls, ucd.lead_type, ucd.lead_status, ucd.city_id, ucd.product_id, ucd.product_price, ucd.assigned_agent_id, ucd.connected_call_duration, ucd.sticky_type, ucd.insert_date_time, ucd.update_date_time, ucd.call_type,ucd.answer   from customer_followup as cf left join unique_customer_detail as ucd on cf.id =ucd.customer_followup_id LEFT   JOIN address_book ab on SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(cf.customer_number, -10) AND ab.`status` != -9 AND ab.sme_id= cf.sme_id where cf.created_by= :id GROUP BY cf.id order by scheduleDateTime desc"+
    limit_field;
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function totalFollowUpCallsRecord(where: any, callback: any) {
  try {
    var initialRecord;
    var limit_field;
    initialRecord = where["initialRecord"] - 1;
    limit_field = " limit " + initialRecord + "," + where["batchSize"] + "";
      
    let Query = "SELECT cf.id  as total_records FROM customer_followup AS cf LEFT JOIN unique_customer_detail AS ucd ON cf.id =ucd.customer_followup_id  LEFT JOIN address_book ab ON SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(cf.customer_number, -10) AND ab.`status` != -9 AND ab.sme_id= cf.sme_id WHERE cf.created_by= :id GROUP BY cf.id  "+
    limit_field;
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** Check if number exist in unique customer details  */
export async function numberExistInUniqueDetails(where: any, callback: any) {
  try {
    let Query = "SELECT id  from unique_customer_detail where sme_id = :sme_id AND SUBSTRING(TRIM(customer_number), -10)=SUBSTRING(:mobile, -10) limit 1" ;
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], mobile: where["mobile"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** update unique customer campaign*/
export async function updateUniqueCustomerData(where: any,  reqData: any, callback: any) {
  try {
    let Query = "update unique_customer_detail set assigned_to = :agent_id, customer_followup_id = :lastInsertedId where id  = :uniqueId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        uniqueId: where["uniqueId"],
        lastInsertedId: where["lastInsertedId"],
        agent_id: reqData["agent_id"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** insert manual lead data*/
export async function insertUniqueCustomerData(payload: any, where: any,  callback: any) {
  try {
    let Query =
      "INSERT INTO unique_customer_detail (sme_id, customer_number, recent_duration, recent_via_longcode, server_ip_address, recent_patched_agent_id, total_incoming_calls, total_outgoing_calls, lead_type, lead_status, city_id, product_id, product_price, assigned_agent_id, connected_call_duration, sticky_type, insert_date_time, update_date_time, call_type, assigned_to,  customer_followup_id) values (:id, :mobile, :recent_duration, :recent_via_longcode, :server_ip_address, :recent_patched_agent_id, :total_incoming_calls, :total_outgoing_calls, :lead_type, :lead_status, :city_id, :product_id, :product_price, :assigned_agent_id, :connected_call_duration, :sticky_type, :insert_date_time, :update_date_time, :call_type, :assigned_to, :customer_followup_id)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        id: payload["id"],
        recent_duration: payload["recent_duration"],
        recent_via_longcode: payload["recent_via_longcode"],
        server_ip_address: payload["server_ip_address"],
        recent_patched_agent_id: payload["recent_patched_agent_id"],
        total_incoming_calls: payload["total_incoming_calls"],
        total_outgoing_calls: payload["total_outgoing_calls"],
        lead_type: payload["lead_type"],
        lead_status: payload["lead_status"],
        city_id: payload["city_id"],
        product_id: payload["product_id"],
        product_price: payload["product_price"],
        assigned_agent_id: payload["assigned_agent_id"],
        connected_call_duration: payload["connected_call_duration"],
        sticky_type: payload["sticky_type"],
        insert_date_time: payload["insert_date_time"],
        update_date_time: payload["update_date_time"],
        call_type: payload["call_type"],
        assigned_to: payload["assigned_to"],
        mobile: where["mobile"],
        customer_followup_id: payload["customer_followup_id"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/**  find findFollowUpCallsNotify*/
export async function findFollowUpCallsNotify(where: any, callback: any) {
  try {
    var Query = "SELECT ab.customer_name, ad.agent_email,cf.sme_id, cf.customer_number, cf.created_by,cf.message, cf.reminder_date_time, cf.created_date_time, cf.status  FROM customer_followup as cf  LEFT JOIN agent_details as ad on cf.created_by =ad.agent_id  LEFT JOIN address_book AS ab ON SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(TRIM(cf.customer_number), -10) AND ab.status !=-9 AND ab.sme_id= cf.sme_id  WHERE cf.reminder_date_time between  :currentDate and  DATE_ADD(:currentDate, INTERVAL 5 MINUTE)";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { currentDate: where["currentDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function insertFollowUpCallsNotification(payload: any,  callback: any) {
  try {
    let Query =
      "INSERT INTO sme_notification (sme_id, insert_date_time, schedule_date_time, agent_id, event, message, mode, title,username,customer_name,customer_number,note) values (:sme_id, :insert_date_time, :schedule_date_time, :agent_id, :event, :message, :mode, :title,:username, :customer_name, :customer_number, :note )";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        sme_id: payload["sme_id"],
        insert_date_time: payload["insert_date_time"],
        schedule_date_time: payload["schedule_date_time"],
        agent_id: payload["agent_id"],
        event: payload["event"],
        message: payload["message"],
        mode: payload["mode"],
        title: payload["title"],
        username: payload["username"],
        customer_number: payload["customer_number"],
        customer_name: payload["customer_name"],
        note: payload["note"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function findfirebaseAppNotification(where: any, callback: any) {
  try {
    let Query = "SELECT  ntf.customer_name , ntf.customer_number , u.app_notification_token, ntf.id, ntf.event, ntf.insert_date_time, ntf.schedule_date_time, ntf.agent_id, ntf.session_id, ntf.agent_email, ntf.title, ntf.is_read, ntf.mode,ntf.username, ntf.message,ntf.note,ntf.call_direction FROM users u INNER JOIN sme_notification ntf ON ntf.username = u.username where ntf.is_sent=0 and ntf.mode='APP'  and u.app_notification_token !=''" ;
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function updateAppNotificationStatus(where: any, callback: any) {
  try {
    let Query = "Update sme_notification set is_sent=1 where id= :id and username=:username";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { username: where["username"], id: where["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function InsertagentAppDetail(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO agent_apk_version_detail ( sme_id, agent_id, platform, apk_name,insert_date_time,update_date_time ) VALUES ( :sme_id,  :agent_id, :platform, :version_name, :insert_date_time, :update_date_time)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { sme_id: payload["sme_id"],platform: payload["platform"], agent_id: payload["agent_id"], version_name: payload["version_name"], insert_date_time: payload["insert_date_time"], update_date_time: payload["update_date_time"]},
    });

    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindendcallReasonList(where: any, callback: any) {
  try {
    let Query = "SELECT id, reason_code, reason_message, insert_date_time from end_call_reason_enum ";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function UpdateEndCallReasonOutgoing(where: any, callback: any) {
  try {
    let Query = "Update calling_cdr set end_call_reason_id=:reasonId where session_id= :sessionId and sme_id=:smeId and call_direction=:callDirection limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { reasonId: where["reasonId"], smeId: where["smeId"],sessionId: where["sessionId"], callDirection: where["callDirection"]  },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function UpdateEndCallReasonCommnCdr(where: any, callback: any) {
  try {
    let Query = "Update outbond_ivr_cdr set end_call_reason_id=:reasonId where session_id= :sessionId and sme_id=:smeId limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { reasonId: where["reasonId"], smeId: where["smeId"],sessionId: where["sessionId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/**  find */
export async function FindCities(where: any, callback: any) {
  try {
    let Query =
      "select sc.city_id, sc.sme_id, cc.city_name, sc.status, sc.date_time from sme_cities_list sc left join country_cities cc on sc.city_id = cc.id where sc.sme_id  = :id and sc.status = 0";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/**  find */
export async function FindProducts(where: any, callback: any) {
  try {
    let Query = "select id, sme_id, product_name, status, date_time from sme_product_list where sme_id  = :id and status = 0";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** find agent list */
export async function FindAgentList(where: any, callback: any) {
  try {
    let Query =
      "SELECT ad.agent_id,ad.longcode_priority_flag as virtualNumberPriority, ad.sme_id, ad.agent_name, ad.agent_mobile, ad.`status`, DATE_FORMAT(ad.insert_time, '%Y-%m-%d %H:%i:%s') as insert_time, DATE_FORMAT(ad.insert_time, '%Y-%m-%d') as insert_date, DATE_FORMAT(ad.in_time, '%H:%i') AS in_time, DATE_FORMAT(ad.out_time, '%H:%i') AS out_time, ad.days_flag, ad.agent_position, ad.agent_extention, ad.agent_email, ad.sticky_agent, ad.sticky_days, ad.is_updated,ad.assign_failed_calls, ad.assign_voicemail_calls, ad.recent_call_date_time, ad.in_permission_flag, ad.out_permission_flag, ad.break_permission_flag, ad.agent_masking, agd.group_name,agd.group_id, ( SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('longcode', lc.longcode, 'id', lc.id,'status', lc.status)), ']') FROM longcodes lc INNER JOIN longcodes_agent_mapping lsm ON lsm.longcode_id = lc.id WHERE lsm.agent_id = ad.agent_id) AS longcodesjson FROM agent_details ad LEFT JOIN agent_group_mapping agm ON agm.agent_id = ad.agent_id LEFT JOIN agent_group_detail agd ON agd.group_id = agm.group_id WHERE ad.sme_id = :id AND ad.`status` != -9  ORDER BY ad.agent_position ASC ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        id: where["id"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getLeadStatusData(where: any, callback: any) {
  try {
    var status_field = "";
    if (where["leadStatus"] && where["leadStatus"] == "Imported") {
      status_field = " AND ls.lead_status = 'Imported'";
    }
    let Query = "SELECT ls.id, ls.lead_status as leadStatus, ls.description, DATE_FORMAT(ls.insert_date_time, '%Y-%m-%d %H:%i:%s') AS insert_date_time, ls.created_by  from lead_status ls where created_by = :smeId and ls.status != -9 " + status_field + "";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** Get lead Source data  */
export async function getLeadSourceData(where: any, callback: any) {
  try {
    var source_field = "";
    if (where["leadSource"] && where["leadSource"] == "Imported") {
      source_field = " AND ls.source = 'Imported'";
    }
    let Query = "SELECT ls.id, ls.source, ls.description, DATE_FORMAT(ls.insert_date_time, '%Y-%m-%d %H:%i:%s') AS insert_date_time, ls.created_by  from lead_source ls where created_by = :smeId and ls.status != -9 " + source_field + "";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find lead settings*/
export async function FindleadSettings(where: any, callback: any) {
  try {
    let Query = "select lead_settings from sme_profile where id  = :id and status = 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function checkManualLeadExist(where: any, callback: any) {
  try {
    let Query = "SELECT * FROM unique_customer_detail WHERE SUBSTRING(TRIM(customer_number), -10)=SUBSTRING(:customer_number, -10) AND sme_id = :id LIMIT 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { customer_number: where["customer_number"], id: where["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** insert manual lead data*/
export async function addManualLeadData(payload: any, callback: any) {
  try {
    let Query =
      "INSERT INTO unique_customer_detail (sme_id, customer_number, recent_duration, recent_via_longcode, server_ip_address, recent_patched_agent_id, total_incoming_calls, total_outgoing_calls, lead_type, lead_status, city_id, product_id, product_price, assigned_agent_id, connected_call_duration, sticky_type, insert_date_time, update_date_time, call_type, source_id, uploaded_date_time) values (:id, :customer_number, :recent_duration, :recent_via_longcode, :server_ip_address, :recent_patched_agent_id, :total_incoming_calls, :total_outgoing_calls, :lead_type, :lead_status, :city_id, :product_id, :product_price, :assigned_agent_id, :connected_call_duration, :sticky_type, :insert_date_time, :update_date_time, :call_type, :source_id, :insert_date_time)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        id: payload["id"],
        customer_number: payload["customer_number"],
        recent_duration: payload["recent_duration"],
        recent_via_longcode: payload["recent_via_longcode"],
        server_ip_address: payload["server_ip_address"],
        recent_patched_agent_id: payload["recent_patched_agent_id"],
        total_incoming_calls: payload["total_incoming_calls"],
        total_outgoing_calls: payload["total_outgoing_calls"],
        lead_type: payload["lead_type"],
        lead_status: payload["lead_status"],
        city_id: payload["city_id"],
        product_id: payload["product_id"],
        product_price: payload["product_price"],
        assigned_agent_id: payload["assigned_agent_id"],
        connected_call_duration: payload["connected_call_duration"],
        sticky_type: payload["sticky_type"],
        insert_date_time: payload["insert_date_time"],
        update_date_time: payload["update_date_time"],
        call_type: payload["call_type"],
        source_id: payload["source_id"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/* Lead Status Summary data begins*/
export async function checkTotalLeadStatusSummaryExist(where: any, callback: any) {
  try {
    var Query = "SELECT id, lead_status_count FROM total_lead_status_summary WHERE sme_id = :smeId AND agent_id = :agentId AND lead_status = :leadStatus";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {smeId: where["smeId"], agentId: where["agentId"], leadStatus: where["leadStatus"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function updateTotalLeadStatusSummaryData(payload: any, callback: any) {
  try {
    let Query = "Update total_lead_status_summary set lead_status_count= :leadStatusCount where id = :id  limit 1 ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { leadStatusCount: payload["leadStatusCount"],  id: payload["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
   
    callback(error, null);
    throw new Error(error);
  }
}

export async function insertTotalLeadStatusSummaryData(payload: any,  callback: any) {
  try {
    let Query =
      "INSERT INTO total_lead_status_summary (sme_id, agent_id, lead_status, lead_status_count, till_date_time) values (:smeId, :agentId, :leadStatus, :leadStatusCount, :insertDateTime)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        agentId: payload["agentId"],
        leadStatus: payload["leadStatus"],
        leadStatusCount: payload["leadStatusCount"],
        insertDateTime: payload["insertDateTime"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/* Lead Source Summary data begins*/
export async function checkTotalLeadSourceSummaryExist(where: any, callback: any) {
  try {
    var Query = "SELECT id, lead_source_count FROM total_lead_source_summary WHERE sme_id = :smeId AND agent_id = :agentId AND source_id = :sourceId";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {smeId: where["smeId"], agentId: where["agentId"], sourceId: where["sourceId"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function updateTotalLeadSourceSummaryData(payload: any, callback: any) {
  try {
    let Query = "Update total_lead_source_summary set lead_source_count= :leadSourceCount where id = :id  limit 1 ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { leadSourceCount: payload["leadSourceCount"], id: payload["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    callback(error, null);
    throw new Error(error);
  }
}

export async function insertTotalLeadSourceSummaryData(payload: any,  callback: any) {
  try {
    let Query =
      "INSERT INTO total_lead_source_summary (sme_id, agent_id, source_id, lead_source_count, till_date_time) values (:smeId, :agentId, :sourceId, :leadSourceCount, :insertDateTime)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        agentId: payload["agentId"],
        sourceId: payload["sourceId"],
        leadSourceCount: payload["leadSourceCount"],
        insertDateTime: payload["insertDateTime"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/* Lead Product Summary data begins*/
export async function checkTotalLeadProductSummaryExist(where: any, callback: any) {
  try {
    var Query = "SELECT id, lead_product_count FROM total_lead_product_summary WHERE sme_id = :smeId AND agent_id = :agentId AND product_id = :productId";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {smeId: where["smeId"], agentId: where["agentId"], productId: where["productId"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function updateTotalLeadProductSummaryData(payload: any, callback: any) {
  try {
    let Query = "Update total_lead_product_summary set lead_product_count= :leadProductCount where id = :id  limit 1 ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { leadProductCount: payload["leadProductCount"],  id: payload["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    callback(error, null);
    throw new Error(error);
  }
}

export async function insertTotalLeadProductSummaryData(payload: any,  callback: any) {
  try {
    let Query =
      "INSERT INTO total_lead_product_summary (sme_id, agent_id, product_id, lead_product_count, till_date_time) values (:smeId, :agentId, :productId, :leadProductCount, :insertDateTime)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        agentId: payload["agentId"],
        productId: payload["productId"],
        leadProductCount: payload["leadProductCount"],
        insertDateTime: payload["insertDateTime"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/* Lead City Summary data begins*/
export async function checkTotalLeadCitySummaryExist(where: any, callback: any) {
  try {
    var Query = "SELECT id, lead_city_count FROM total_lead_city_summary WHERE sme_id = :smeId AND agent_id = :agentId AND city_id = :cityId";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {smeId: where["smeId"], agentId: where["agentId"], cityId: where["cityId"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function updateTotalLeadCitySummaryData(payload: any, callback: any) {
  try {
    let Query = "Update total_lead_city_summary set lead_city_count= :leadCityCount where id = :id  limit 1 ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { leadCityCount: payload["leadCityCount"],  id: payload["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    callback(error, null);
    throw new Error(error);
  }
}

export async function insertTotalLeadCitySummaryData(payload: any,  callback: any) {
  try {
    let Query =
      "INSERT INTO total_lead_city_summary (sme_id, agent_id, city_id, lead_city_count, till_date_time) values (:smeId, :agentId, :cityId, :leadCityCount, :insertDateTime)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        agentId: payload["agentId"],
        cityId: payload["cityId"],
        leadCityCount: payload["leadCityCount"],
        insertDateTime: payload["insertDateTime"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}
/* Lead City Summary data ends*/


/** find */
export async function GetUniqueCalls(where: any, callback: any) {
  try {
    let duration_field = "";
    let agent_number_field = "";
    let customer_number_field = "";
    let agent_name_field = "";
    let call_answer_field = "";
    let productId_field = "";
    let cityId_field = "";
    let insert_date_time_field = "";
    let leadType_field = "";
    let customerName_field = "";
    let g_initialRecord = 0;
    let limit_field = "";
    let agentId_field = "";
    let LeadStatus_field = "";
    let productPrice_field = "";
    let sourceId_field = "";
    let campaignId_field = "";
    let answer_field = "";
    let searchLeads_field = "";
    let sortLeadDateVar_field = "";
    let companyName_field = "";
    let uniqueId_field = "";

    if (where["isDownload"] == "1") {
      limit_field = "";
    } else {
      g_initialRecord = where["initialRecord"] - 1;
      limit_field = "limit " + g_initialRecord + "," + where["batchSize"] + "";
    }

    //duration check
    if (where["duration_op"] == "11") {
      //Equals to
      duration_field = "and ucd.recent_duration = " + where["duration"] + "";
    } else if (where["duration_op"] == "12") {
      //Not Equals to
      duration_field = "and ucd.recent_duration != " + where["duration"] + "";
    } else if (where["duration_op"] == "13") {
      //Is greater than
      duration_field = "and ucd.recent_duration > " + where["duration"] + "";
    } else if (where["duration_op"] == "14") {
      //Is less than
      duration_field = "and ucd.recent_duration < " + where["duration"] + "";
    }

    //agent Number
    if (where["agentNumber_op"] == "1") {
      //Equals to
      agent_number_field = 'and TRIM(ad.agent_mobile) = "' + where["agentNumber"] + '"';
    } else if (where["agentNumber_op"] == "2") {
      //Not Equals to
      agent_number_field = 'and TRIM(ad.agent_mobile) != "' + where["agentNumber"] + '"';
    } else if (where["agentNumber_op"] == "3") {
      //Start with
      agent_number_field = 'and TRIM(ad.agent_mobile) LIKE "' + where["agentNumber"] + '%"';
    } else if (where["agentNumber_op"] == "4") {
      //it contains
      agent_number_field = 'and TRIM(ad.agent_mobile) LIKE "%' + where["agentNumber"] + '%"';
    } else if (where["agentNumber_op"] == "5") {
      //it does not contains
      agent_number_field = 'and TRIM(ad.agent_mobile) NOT LIKE "%' + where["agentNumber"] + '%"';
    } else if (where["agentNumber_op"] == "6") {
      //it end with
      agent_number_field = 'and TRIM(ad.agent_mobile) LIKE "%' + where["agentNumber"] + '"';
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
    if (where["customerNumber_op"] == "1") {
      //Equals to
      customer_number_field = 'and TRIM(ucd.customer_number) = "' + where["customerNumber"] + '"';
    } else if (where["customerNumber_op"] == "2") {
      //Not Equals to
      customer_number_field = 'and TRIM(ucd.customer_number) != "' + where["customerNumber"] + '"';
    } else if (where["customerNumber_op"] == "3") {
      //Start with
      customer_number_field = 'and TRIM(ucd.customer_number) LIKE "' + where["customerNumber"] + '%"';
    } else if (where["customerNumber_op"] == "4") {
      //it contains
      customer_number_field = 'and TRIM(ucd.customer_number) LIKE "%' + where["customerNumber"] + '%"';
    } else if (where["customerNumber_op"] == "5") {
      //it does not contains
      customer_number_field = 'and TRIM(ucd.customer_number) NOT LIKE "%' + where["customerNumber"] + '%"';
    } else if (where["customerNumber_op"] == "6") {
      //it end with
      customer_number_field = 'and TRIM(ucd.customer_number) LIKE "%' + where["customerNumber"] + '"';
    }

    //Call Staus for incoming Answer/Failed filter  1:Answer,  2:Failed
    if (where["answerStatus_op"] == "11") {
      //Equals to
      call_answer_field = "and ucd.answer = " + where["callAnswer"] + "";
    }

    //city_id
    if (where["cityId_op"] == "11") {
      //Equals to
      cityId_field = " and ucd.city_id in(" + where["cityId"] + ")";
    }

    //product_id
    if (where["productId_op"] == "11") {
      //Equals to
      productId_field = "and ucd.product_id in(" + where["productId"] + ")";
    }

    //campaignId
    if (where["campaignId_op"] == "11") {
      //Equals to
      campaignId_field = " and ucd.campaign_id = " + where["campaignId"] + "";
      answer_field = " and ucd.answer = 3";
    } else {
      answer_field = " and ucd.answer != 3";
    }

    //source_id
    if (where["sourceId_op"] == "11") {
      //Equals to
      sourceId_field = "and ucd.source_id in(" + where["sourceId"] + ")";
    }

    //lead_type
    if (where["leadType_op"] == "11") {
      //Equals to
      leadType_field = 'and ucd.lead_type = "' + where["leadType"] + '"';
    }

    //check as customer Name
    if (where["customerName_op"] == "1") {
      //Equals to
      customerName_field = ' and TRIM(ab.customer_name) = "' + where["customerName"] + '"';
    } else if (where["customerName_op"] == "2") {
      //Not Equals to
      customerName_field = ' and TRIM(ab.customer_name) != "' + where["customerName"] + '"';
    } else if (where["customerName_op"] == "3") {
      //Start with
      customerName_field = ' and TRIM(ab.customer_name) LIKE "' + where["customerName"] + '%"';
    } else if (where["customerName_op"] == "4") {
      //it contains
      customerName_field = ' and TRIM(ab.customer_name) LIKE "%' + where["customerName"] + '%"';
    } else if (where["customerName_op"] == "5") {
      //it does not contains
      customerName_field = ' and TRIM(ab.customer_name) NOT LIKE "%' + where["customerName"] + '%"';
    } else if (where["customerName_op"] == "6") {
      //it end with
      customerName_field = ' and TRIM(ab.customer_name) LIKE "%' + where["customerName"] + '"';
    }

    //check as Company Name
    if (where["companyName_op"] == "1") {
      //Equals to
      companyName_field = ' and TRIM(ab.company_name) = "' + where["companyName"] + '"';
    } else if (where["companyName_op"] == "2") {
      //Not Equals to
      companyName_field = ' and TRIM(ab.company_name) != "' + where["companyName"] + '"';
    } else if (where["companyName_op"] == "3") {
      //Start with
      companyName_field = ' and TRIM(ab.company_name) LIKE "' + where["companyName"] + '%"';
    } else if (where["companyName_op"] == "4") {
      //it contains
      companyName_field = ' and TRIM(ab.company_name) LIKE "%' + where["companyName"] + '%"';
    } else if (where["companyName_op"] == "5") {
      //it does not contains
      companyName_field = ' and TRIM(ab.company_name) NOT LIKE "%' + where["companyName"] + '%"';
    } else if (where["companyName_op"] == "6") {
      //it end with
      companyName_field = ' and TRIM(ab.company_name) LIKE "%' + where["companyName"] + '"';
    }

    //product_price
    if (where["productPrice_op"] == "11") {
      //Equals to
      productPrice_field = " and ucd.product_price = " + where["productPrice"] + "";
    } else if (where["productPrice_op"] == "12") {
      //Not Equals to
      productPrice_field = ' and ucd.product_price != "' + where["productPrice"] + '"';
    } else if (where["productPrice_op"] == "13") {
      //Start with
      productPrice_field = ' and ucd.product_price > "' + where["productPrice"] + '"';
    } else if (where["productPrice_op"] == "14") {
      //Start with
      productPrice_field = ' and ucd.product_price < "' + where["productPrice"] + '"';
    }

    //product_price
    if (where["leadStatus_op"] == "11") {
      //Equals to
      LeadStatus_field = " and ucd.lead_status in(" + where["leadStatus"] + ")";
    }

    //Agent Id
    if (where["agentId_op"] == "34") {
      if (where["campaignId_op"] == "11") {
        agentId_field = " and ucd.assigned_to = " + where["agentId"] + "";
      } else {
        agentId_field = " and (ucd.assigned_agent_id in(" + where["agentId"] + ") OR ucd.recent_patched_agent_id IN (" + where["agentId"] + "))";
      }

    }

    //Search Leads Field
    if (where["searchLeads_op"] == "11") {
      searchLeads_field = ' and (TRIM(ab.customer_name) LIKE "%' + where["searchLeads"] + '%" OR TRIM(ucd.customer_number) LIKE "%' + where["searchLeads"] + '%" OR TRIM(ab.company_name) LIKE "%' + where["searchLeads"] + '%") ';
    }

    if (where["startDate"] && where["endDate"] && where["campaignId_op"] == "") {
      insert_date_time_field = ' AND ucd.update_date_time BETWEEN "' + where["startDate"] + '" AND "' + where["endDate"] + '"';
    }

    if (where["sortLeadDateVar_op"] == "11") {
      sortLeadDateVar_field = " GROUP BY ucd.customer_number order by  "+where["sortLeadDateVar"]+" ";
    } else {
      sortLeadDateVar_field = " GROUP BY ucd.customer_number order by ucd.update_date_time desc ";
    }

    //Get single record on id basis
    if (where["uniqueId_op"] == "11") {
      //Equals to
      uniqueId_field = "and ucd.id = " + where["uniqueId"] + "";
    }

    let Query =
      'SELECT ucd.id, ucd.sme_id, DATE_FORMAT(ucd.update_date_time, "%Y-%m-%d %H:%i:%s") as update_date_time, DATE_FORMAT(ucd.insert_date_time, "%Y-%m-%d %H:%i:%s") as insert_date_time, ucd.recent_duration, ucd.recent_via_longcode, ucd.call_type, ucd.customer_number, ucd.customer_number as customerNumber, SUBSTRING(TRIM(ucd.customer_number), -12) as whattsappNumber, ucd.server_ip_address, ucd.recent_patched_agent_id, ad.agent_name, ad.agent_mobile, ad.agent_id, ucd.answer, ucd.address_book_id, ab.customer_name, ab.company_name, ucd.recent_remarks, ucd.total_incoming_calls, ucd.total_outgoing_calls, ucd.lead_type, ucd.city_id, cc.city_name,  ucd.product_id, pl.product_name, ucd.product_price, ucd.assigned_to, ucd.sticky_type, ad2.agent_name as lead_assigned_agent_name, ad2.agent_mobile as lead_assigned_agent_number, ucd.assigned_agent_id, bwl.blacklist_status, ls.source as lead_source, ucd.source_id, ucd.lead_status, cr.remarks, lst.lead_status as lead_status_name,ab.email_id FROM unique_customer_detail ucd left join agent_details ad on (ucd.recent_patched_agent_id = ad.agent_id OR ucd.assigned_agent_id = ad.agent_id) left join address_book ab on ab.customer_number_primary = ucd.customer_number and ucd.sme_id = ab.sme_id AND ab.status != -9 left join country_cities cc on ucd.city_id = cc.id left join sme_product_list pl on ucd.product_id = pl.id left join agent_details ad2 on ucd.assigned_agent_id = ad2.agent_id LEFT JOIN black_white_list bwl ON SUBSTRING(TRIM(bwl.customer_number), -10)=SUBSTRING(ucd.customer_number, -10) AND bwl.sme_id = ucd.sme_id and bwl.blacklist_status != -9 LEFT JOIN lead_source ls ON ls.id = ucd.source_id LEFT JOIN customer_remarks cr ON cr.sme_id = ucd.sme_id AND SUBSTRING(TRIM(cr.customer_number), -10)= SUBSTRING(ucd.customer_number, -10) AND cr.id = ucd.recent_remarks LEFT JOIN lead_status lst ON lst.created_by = ucd.sme_id AND lst.id = ucd.lead_status WHERE ucd.sme_id = :id AND ucd.status != -9 AND bwl.blacklist_status IS NULL' +
      insert_date_time_field +
      " " +
      customer_number_field +
      " " +
      call_answer_field +
      " " +
      answer_field +
      " " +
      agent_name_field +
      " " +
      agent_number_field +
      " " +
      productId_field +
      " " +
      sourceId_field +
      " " +
      cityId_field +
      " " +
      leadType_field +
      " " +
      customerName_field +
      " " +
      companyName_field +
      " " +
      LeadStatus_field +
      " " +
      agentId_field +
      " " +
      campaignId_field +
      " " +
      productPrice_field +
      " " +
      searchLeads_field +
      " " +
      uniqueId_field +
      " "+
      sortLeadDateVar_field +
      " " +
      limit_field +
      "";

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

export async function FindCustomerAddressbookDetail(where: any, callback: any) {
  try {
    let Query =
      "SELECT ucd.id, ab.customer_name, ab.company_name, ab.email_id, DATE_FORMAT(ab.insert_date_time, '%Y-%m-%d %H:%i:%s') AS insert_date_time, ab.address, ab.status, ab.mode, ab.created_by, ab.customer_number_primary, ls.lead_status as lead_status_name, lsr.source as lead_source, cc.city_name, ucd.product_price, spl.product_name, ucd.sticky_type, ucd.other FROM unique_customer_detail ucd LEFT JOIN address_book ab ON ab.sme_id = ucd.sme_id AND SUBSTRING(TRIM(ab.customer_number_primary), -10)= SUBSTRING(TRIM(ucd.customer_number), -10) LEFT JOIN lead_status ls ON ls.id = ucd.lead_status LEFT JOIN lead_source lsr ON lsr.id = ucd.source_id LEFT JOIN country_cities cc ON cc.id = ucd.city_id LEFT JOIN sme_product_list spl ON spl.id = ucd.product_id WHERE ucd.sme_id = :id AND SUBSTRING(TRIM(ucd.customer_number), -10)= SUBSTRING(TRIM(:customerNumber), -10) LIMIT 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        id: where["id"],
        customerNumber: where["customerNumber"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/**  find customer lead details total calls*/
export async function customerLeadDetailTotalCalls(where: any, callback: any) {
  try {
    var Query =
      "SELECT COUNT(*) AS total_calls FROM calling_cdr cc LEFT JOIN customer_remarks cr ON cr.sme_id = cc.sme_id AND cr.customer_number = cc.customer_number AND cr.session_id = cc.session_id LEFT JOIN mpbx_call_recording mcr ON mcr.sme_id = cc.sme_id AND cc.call_recorded_file = mcr.call_id AND cc.customer_number = mcr.customer_ani WHERE cc.sme_id= :id AND SUBSTRING(TRIM(cc.customer_number), -10)= SUBSTRING(TRIM(:customerNumber), -10)";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"], customerNumber: where["customerNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/**  find remarks*/
export async function FindProductsActivity(where: any, callback: any) {
  try {
    var offset_field = "";
    var limit_field = "";
    if ((where["initialRecord"] && where["initialRecord"] != "")) {
      offset_field = " offset " + where["initialRecord"];
    }

    if ((where["batchSize"] && where["batchSize"] != "")) {
      limit_field = " LIMIT " + where["batchSize"];
    }
    var Query =
      "SELECT DATE_FORMAT(lh.insert_date_time, '%Y-%m-%d %H:%i:%s') AS insert_date_time, lh.message, sp.name, ad.agent_name FROM log_history lh LEFT JOIN sme_profile sp ON sp.id = lh.sme_id LEFT JOIN agent_details ad ON ad.agent_id = lh.agent_id WHERE SUBSTRING(TRIM(lh.customer_number), -10)= SUBSTRING(:customerNumber, -10) AND lh.sme_id = :id AND lh.module_name = 'product' ORDER BY lh.insert_date_time DESC" +limit_field+ " " + offset_field + "";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"], customerNumber: where["customerNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** get customer Notes*/
export async function FindCustomerNotes(where: any, callback: any) {
  try {
    var offset_field = "";
    var limit_field = "";
    if ((where["initialRecord"] && where["initialRecord"] != "") && (where["mode"] && where["mode"] == "notes")) {
      offset_field = " offset " + where["initialRecord"];
    }
    if ((where["batchSize"] && where["batchSize"] != "") && (where["mode"] && where["mode"] == "notes")) {
      limit_field = " LIMIT " + where["batchSize"];
    }

    let Query = "SELECT DATE_FORMAT(cr.start_date_time, '%Y-%m-%d %H:%i:%s') as start_date_time , cr.remarks, cr.mode, sp.name, ad.agent_name FROM customer_remarks cr LEFT JOIN sme_profile sp ON sp.id = cr.created_by LEFT JOIN agent_details ad ON ad.agent_id = cr.created_by WHERE cr.remarks != 'NULL' AND cr.remarks != '' AND SUBSTRING(TRIM(cr.customer_number), -10)= SUBSTRING(:customerNumber, -10)  AND cr.sme_id = :smeId ORDER BY cr.start_date_time DESC " +limit_field+ " " + offset_field + "";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        smeId: where["id"], customerNumber: where["customerNumber"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** get past scheduled call data */
export async function getScheduledCallsPastData(where: any, callback: any) {
  try {
    let agentId_field = "";
    let limit_field = "";
    let g_initialRecord = 0;
    let customer_number_field = "";
    if (where["agentId"] && where["agentId"] != "") {
      agentId_field = " and cf.created_by= " + where["agentId"];
    }
    if (where["customerNumber"] && where["customerNumber"] != "") {
      customer_number_field = " and SUBSTRING(TRIM(cf.customer_number), -10) = SUBSTRING(" + where['customerNumber'] + ", -10)";
    }

    if (where["isDownload"] == "1") {
      limit_field = "";
    } else {
      g_initialRecord = where["initialRecord"] - 1;
      limit_field = "limit " + g_initialRecord + "," + where["batchSize"] + "";
    }


    let Query =
      "SELECT ab.customer_name, ab.company_name, ad.agent_name, cf.id, cf.customer_number, cf.customer_number as customerNumber, DATE_FORMAT(cf.reminder_date_time, '%Y-%m-%d %H:%i:%s') as scheduleDateTime, cf.sme_id, cf.created_by, cf.message, cf.status, ucd.recent_duration, ucd.recent_via_longcode, ucd.server_ip_address, ucd.recent_patched_agent_id, ucd.total_incoming_calls, ucd.total_outgoing_calls, ucd.lead_type, ucd.lead_status, ucd.city_id, ucd.product_id, ucd.product_price, ucd.assigned_agent_id, ucd.connected_call_duration, ucd.sticky_type, ucd.insert_date_time, ucd.update_date_time, ucd.call_type,ucd.answer   from customer_followup as cf left join unique_customer_detail as ucd on cf.id =ucd.customer_followup_id LEFT   JOIN address_book ab on SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(cf.customer_number, -10) AND ab.`status` != -9 AND ab.sme_id= cf.sme_id LEFT JOIN agent_details ad ON ad.sme_id = cf.sme_id AND ad.agent_id = cf.created_by where cf.sme_id= :smeId " + agentId_field + " " + customer_number_field + " AND DATE(cf.reminder_date_time) < DATE(:insertDateTime) GROUP BY cf.id order by cf.reminder_date_time desc " + limit_field +
      "";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], insertDateTime: where["insertDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** get today scheduled call data */
export async function getScheduledCallsTodayData(where: any, callback: any) {
  try {
    let agentId_field = "";
    let customer_number_field = "";
    if (where["agentId"] && where["agentId"] != "") {
      agentId_field = " and cf.created_by= " + where["agentId"];
    }
    if (where["customerNumber"] && where["customerNumber"] != "") {
      customer_number_field = " and SUBSTRING(TRIM(cf.customer_number), -10) = SUBSTRING(" + where['customerNumber'] + ", -10)";
    }

    let Query =
      "SELECT ab.customer_name, ab.company_name, ad.agent_name, cf.id, cf.customer_number,  cf.customer_number as customerNumber, DATE_FORMAT(cf.reminder_date_time, '%Y-%m-%d %H:%i:%s') as scheduleDateTime, cf.sme_id, cf.created_by, cf.message, cf.status, ucd.recent_duration, ucd.recent_via_longcode, ucd.server_ip_address, ucd.recent_patched_agent_id, ucd.total_incoming_calls, ucd.total_outgoing_calls, ucd.lead_type, ucd.lead_status, ucd.city_id, ucd.product_id, ucd.product_price, ucd.assigned_agent_id, ucd.connected_call_duration, ucd.sticky_type, ucd.insert_date_time, ucd.update_date_time, ucd.call_type,ucd.answer   from customer_followup as cf left join unique_customer_detail as ucd on cf.id =ucd.customer_followup_id LEFT   JOIN address_book ab on SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(cf.customer_number, -10) AND ab.`status` != -9 AND ab.sme_id= cf.sme_id LEFT JOIN agent_details ad ON ad.sme_id = cf.sme_id AND ad.agent_id = cf.created_by where cf.sme_id= :smeId " + agentId_field + " " + customer_number_field + "AND DATE(cf.reminder_date_time) = DATE(:insertDateTime) GROUP BY cf.id order by cf.reminder_date_time asc";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], insertDateTime: where["insertDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** get Upcoming scheduled call data */
export async function getScheduledCallsUpcomingData(where: any, callback: any) {
  try {
    let agentId_field = "";
    let customer_number_field = "";
    if (where["agentId"] && where["agentId"] != "") {
      agentId_field = " and cf.created_by= " + where["agentId"];
    }
    if (where["customerNumber"] && where["customerNumber"] != "") {
      customer_number_field = " and SUBSTRING(TRIM(cf.customer_number), -10) = SUBSTRING(" + where['customerNumber'] + ", -10)";
    }

    let Query =
      "SELECT ab.customer_name, ab.company_name, ad.agent_name, cf.id, cf.customer_number,  cf.customer_number as customerNumber, DATE_FORMAT(cf.reminder_date_time, '%Y-%m-%d %H:%i:%s') as scheduleDateTime, cf.sme_id, cf.created_by, cf.message, cf.status, ucd.recent_duration, ucd.recent_via_longcode, ucd.server_ip_address, ucd.recent_patched_agent_id, ucd.total_incoming_calls, ucd.total_outgoing_calls, ucd.lead_type, ucd.lead_status, ucd.city_id, ucd.product_id, ucd.product_price, ucd.assigned_agent_id, ucd.connected_call_duration, ucd.sticky_type, ucd.insert_date_time, ucd.update_date_time, ucd.call_type,ucd.answer   from customer_followup as cf left join unique_customer_detail as ucd on cf.id =ucd.customer_followup_id LEFT   JOIN address_book ab on SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(cf.customer_number, -10) AND ab.`status` != -9 AND ab.sme_id= cf.sme_id LEFT JOIN agent_details ad ON ad.sme_id = cf.sme_id AND ad.agent_id = cf.created_by where cf.sme_id= :smeId " + agentId_field + " " + customer_number_field + "AND DATE(cf.reminder_date_time) > DATE(:insertDateTime) GROUP BY cf.id order by cf.reminder_date_time asc";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], insertDateTime: where["insertDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/**  find lead detail customer calls*/
export async function FindCustomerCalls(where: any, callback: any) {
  try {
    var offset_field = "";
    var limit_field = "";
    if ((where["initialRecord"] && where["initialRecord"] != "") && (where["mode"] && where["mode"] == "calls")) {
      offset_field = " offset " + where["initialRecord"];
    }

    if ((where["batchSize"] && where["batchSize"] != "") && (where["mode"] && where["mode"] == "calls")) {
      limit_field = " LIMIT " + where["batchSize"];
    }
    var Query =
      "SELECT COUNT(*) AS total_calls, cc.id, cc.sme_id, DATE_FORMAT(cc.start_date_time, '%Y-%m-%d %H:%i:%s') AS start_date_time, DATE_FORMAT(cc.end_date_time, '%Y-%m-%d %H:%i:%s') AS end_date_time, DATE_FORMAT(cc.insert_date_time, '%Y-%m-%d %H:%i:%s') AS insert_date_time, cc.duration, cc.longcode, cc.hlr, cc.master_shortcode, cc.sme_identifier, cc.shortcode_mapping, cc.call_direction_status, cc.call_direction, cc.customer_number, cc.agent_number, cc.call_recording_status, cc.call_recorded_file, cc.voicemail_recording_status, cc.voicemail_recording_file, cc.channel_no, cc.server_ip_address, cc.cdr_mode, cc.agent_group, cc.patched_agent_id, cc.session_id, cc.merge_status, cc.answer, cc.call_status, cc.disconnected_by, cc.address_book_id, cc.remarks, cc.connected_duration, cc.ringing_duration, cc.call_type, cc.call_description, cc.ivr_duration, cc.customer_status, cr.remarks AS customerRemarks, mcr.merged_file FROM calling_cdr cc LEFT JOIN customer_remarks cr ON cr.sme_id = cc.sme_id AND cr.customer_number = cc.customer_number AND cr.session_id = cc.session_id LEFT JOIN mpbx_call_recording mcr ON mcr.sme_id = cc.sme_id AND cc.call_recorded_file = mcr.call_id AND cc.customer_number = mcr.customer_ani WHERE cc.sme_id= :id AND SUBSTRING(TRIM(cc.customer_number), -10)= SUBSTRING(TRIM(:customerNumber), -10) GROUP BY cc.id ORDER BY cc.start_date_time DESC " +limit_field+ " " + offset_field + "";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"], customerNumber: where["customerNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** get address book detail*/
export async function FindAddressbookDetail(where: any, callback: any) {
  try {
    let customer_number_field = "";
    let agent_id_field = "";
    let company_name_field = "";
    let customer_name_field = "";
    let limit_field = "";
    let initialRecord;

    if(where["initialRecord"]) {
      initialRecord = where["initialRecord"] - 1;
      limit_field = "limit " + initialRecord + "," + where["batchSize"] + "";
    }

    if (where["customer_number"] != "") {
      customer_number_field = " and SUBSTRING(TRIM(customer_number_primary), -10) = SUBSTRING(" + where["customer_number"] + ", -10)";
    }
    if (where["agent_id"] != "") {
      agent_id_field = " and  created_by = " + where["agent_id"] + "";
    }

    //company name
    if (where["companyName_op"] == "1") {
      //Equals to
      company_name_field = ' and company_name = "' + where["companyName"] + '"';
    } else if (where["companyName_op"] == "2") {
      //Not Equals to
      company_name_field = ' and company_name != "' + where["companyName"] + '"';
    } else if (where["companyName_op"] == "3") {
      //Start with
      company_name_field = ' and company_name LIKE "' + where["companyName"] + '%"';
    } else if (where["companyName_op"] == "4") {
      //it contains
      company_name_field = ' and company_name LIKE "%' + where["companyName"] + '%"';
    } else if (where["companyName_op"] == "5") {
      //it does not contains
      company_name_field = ' and company_name NOT LIKE "%' + where["companyName"] + '%"';
    } else if (where["companyName_op"] == "6") {
      //it end with
      company_name_field = ' and company_name LIKE "%' + where["companyName"] + '"';
    }

    //customer name
    if (where["customerName_op"] == "1") {
      //Equals to
      customer_name_field = ' and customer_name = "' + where["customerName"] + '"';
    } else if (where["customerName_op"] == "2") {
      //Not Equals to
      customer_name_field = ' and customer_name != "' + where["customerName"] + '"';
    } else if (where["customerName_op"] == "3") {
      //Start with
      customer_name_field = ' and customer_name LIKE "' + where["customerName"] + '%"';
    } else if (where["customerName_op"] == "4") {
      //it contains
      customer_name_field = ' and customer_name LIKE "%' + where["customerName"] + '%"';
    } else if (where["customerName_op"] == "5") {
      //it does not contains
      customer_name_field = ' and customer_name NOT LIKE "%' + where["customerName"] + '%"';
    } else if (where["customerName_op"] == "6") {
      //it end with
      customer_name_field = ' and customer_name LIKE "%' + where["customerName"] + '"';
    }

    let Query =
      "SELECT id, customer_name, company_name, RIGHT(customer_number_primary , 10) AS customer_number_primary, email_id, address, created_by  FROM address_book WHERE sme_id = :sme_id AND status = 1  " +
      customer_number_field +
      " " +
      agent_id_field +
      " " +
      company_name_field +
      " " +
      customer_name_field +
      " order by customer_name asc"+
      " "+
      limit_field;
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** check customers exist in address book */
export async function checkAddressBookCustomerExist(where: any, callback: any) {
  try {
    let Query = "SELECT id FROM address_book ab WHERE ab.sme_id = :sme_id AND SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(:customer_number, -10) AND status = 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["smeId"], customer_number: where["customer_number"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** Update customers to address book */
export async function updateAddressBookCustomer(where: any, callback: any) {
  try {
    let id_field = "";
    if (where["id"] && where["id"] != "") {
      id_field = " AND id = " + where["id"];
    }
    let Query =
      "UPDATE address_book set customer_name = :customer_name, company_name = :company_name, email_id = :email_id, address = :address, created_by = :created_by, status = :status, updated_date_time=:insertDateTime  WHERE sme_id = :smeId AND SUBSTRING(customer_number_primary, -10) = SUBSTRING(:customer_number_primary, -10) AND status = 1 " +
      id_field +
      "";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        customer_name: where["customer_name"],
        company_name: where["company_name"],
        email_id: where["email_id"],
        address: where["address"],
        created_by: where["created_by"],
        status: where["status"],
        smeId: where["smeId"],
        customer_number_primary: where["customer_number"],
        insertDateTime: where["insertDateTime"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** add customers to address book */
export async function addAddressBookCustomer(where: any, callback: any) {
  try {
    where["customer_number"] = where["customer_number"].toString().indexOf("+91") !== -1 ? where["customer_number"].toString().trim() : "+91"+where["customer_number"].toString().trim();

    let Query =
      "INSERT INTO address_book (sme_id, customer_name, customer_number_primary, company_name, email_id, address, created_by, status,insert_date_time) values (:sme_id, :customer_name, :customer_number_primary, :company_name, :email_id, :address, :created_by, :status, :insertDateTime )";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        sme_id: where["smeId"],
        customer_name: where["customer_name"],
        customer_number_primary: where["customer_number"],
        company_name: where["company_name"],
        email_id: where["email_id"],
        address: where["address"],
        created_by: where["created_by"],
        status: where["status"],
        insertDateTime: where["insertDateTime"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** Update Unique Calls */
export async function UpdateUniqueCall(where: any, callback: any) {
  try {
    let Query =
      "update unique_customer_detail set city_id = :cityId, product_id = :productId , product_price = :productPrice, assigned_agent_id = :leadAssignedAgent,lead_type = :leadType, lead_status = :leadStatus, source_id = :sourceId WHERE sme_id = :id  and id = :callId LIMIT 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        cityId: where["cityId"],
        productId: where["productId"],
        productPrice: where["productPrice"],
        leadAssignedAgent: where["leadAssignedAgent"],
        leadType: where["leadType"],
        leadStatus: where["leadStatus"],
        id: where["id"],
        callId: where["callId"],
        sourceId: where["sourceId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/* Lead Type Summary data begins*/
export async function checkTotalLeadTypeSummaryExist(where: any, callback: any) {
  try {
    var Query = "SELECT id, lead_type_count FROM total_lead_type_summary WHERE sme_id = :smeId AND agent_id = :agentId AND lead_type = :leadType";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {smeId: where["smeId"], agentId: where["agentId"], leadType: where["leadType"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function updateTotalLeadTypeSummaryData(payload: any, callback: any) {
  try {
    let Query = "Update total_lead_type_summary set lead_type_count= :leadTypeCount where id = :id  limit 1 ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { leadTypeCount: payload["leadTypeCount"], id: payload["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function insertTotalLeadTypeSummaryData(payload: any,  callback: any) {
  try {
    let Query =
      "INSERT INTO total_lead_type_summary (sme_id, agent_id, lead_type, lead_type_count, till_date_time) values (:smeId, :agentId, :leadType, :leadTypeCount, :insertDateTime)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        agentId: payload["agentId"],
        leadType: payload["leadType"],
        leadTypeCount: payload["leadTypeCount"],
        insertDateTime: payload["insertDateTime"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function addCustomerNoteData(where: any, callback: any) {
  try {
    let Query =
      "Insert into customer_remarks (sme_id, customer_number, call_direction, session_id, remarks, created_by, start_date_time, mode) values ( :id, :customerNumber, :callDirection, :sessionId, :remarks, :createdBy, :insertDateTime, :mode)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        id: where["id"],
        customerNumber: where["customerNumber"],
        callDirection: where["callDirection"],
        sessionId: where["sessionId"],
        remarks: where["remarks"],
        createdBy: where["createdBy"],
        insertDateTime: where["insertDateTime"],
        mode: where["mode"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function setFollowUpCallData(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO customer_followup ( sme_id, message, created_by, reminder_date_time, status , created_date_time,customer_number) VALUES ( :sme_id, :message, :agent_id, :scheduleDateTime, :status, :insertDateTime, :mobile)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { sme_id: payload["sme_id"], message: payload["message"], agent_id: payload["agent_id"], status: payload["status"], scheduleDateTime: payload["scheduleDateTime"], insertDateTime: payload["insertDateTime"], mobile: payload["mobile"] },
    });

    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** Check if number exist in unique customer details  */
export async function followNumberExistInUniqueDetails(where: any, callback: any) {
  try {
    let Query = "SELECT id from unique_customer_detail where sme_id = :sme_id AND SUBSTRING(TRIM(customer_number), -10)=SUBSTRING(:mobile, -10) limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], mobile: where["mobile"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}




/** Update Unique Calls */
export async function UpdateUniqueCallAddressId(where: any, callback: any) {
  try {
    let Query =
      "update unique_customer_detail set address_book_id = :addressBookId WHERE sme_id = :smeId  and id = :callId LIMIT 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        addressBookId: where["addressBookId"],
        smeId: where["smeId"],
        callId: where["callId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function updateactiveBreakTimeSummary(where: any, payload: any, callback: any) {
  try {
    var Query = 'UPDATE agent_calling_details SET  lunch_hours = :TotalBreakTime, office_hours = :TotalActiveTime WHERE agent_id = :agent_id and sme_id = :sme_id and date(insert_date) = date(:currentDateTime) limit 1';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { sme_id: where["sme_id"], agent_id: where["agent_id"], TotalBreakTime: payload["TotalBreakTime"], TotalActiveTime: payload["TotalActiveTime"],currentDateTime: where["currentDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function FindAgentTotalInOutBreakTime(where: any, callback: any) {
  try {
    let Query =
      "SELECT SUM(TIME_TO_SEC(TIMEDIFF(ald.out_time, ald.in_time))) AS break_time, TIME_TO_SEC(TIMEDIFF(adt.out_time, adt.in_time)) as active_time  FROM agent_lunch_details AS ald LEFT JOIN agent_details_timing AS adt ON adt.sme_id = ald.sme_id AND adt.days_week = UPPER(DATE_FORMAT(:currentDateTime,'%a')) AND adt.agent_id =:agent_id  WHERE ald.agent_id=:agent_id AND ald.sme_id= :sme_id AND DATE(ald.insert_date) = DATE(:currentDateTime)";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], agent_id: where["agent_id"],currentDateTime: where["currentDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function changeScheduleStatusData(where: any,  callback: any) {
  try {
    var Query = 'UPDATE customer_followup SET status = :status WHERE id = :scheduleId';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { scheduleId: where["scheduleId"], status: where["status"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function updateUniqueRecentRemarks(where: any, payload: any, callback: any) {
  try {
    let Query = "Update unique_customer_detail set recent_remarks = :customerRemarksId where sme_id = :id and SUBSTRING(TRIM(customer_number), -10) = SUBSTRING(:customerNumber, -10) limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { customerRemarksId: payload["customerRemarksId"], id: where["id"], customerNumber: where["customerNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}
