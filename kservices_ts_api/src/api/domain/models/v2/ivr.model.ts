import { cons } from "fp-ts/lib/ReadonlyNonEmptyArray";
import { QueryTypes } from "sequelize";
import { sequelize, sequelize_reader } from "../../../config/db";
import { logger } from "../../../lib/logger";
import { glogger } from "../../../helpers/logger";

import { fetchCallProfileRequestValidate, endCallCdrRequest } from "../../entities/ivr.entity";

/** find */
export async function FindSmeProfile(where: fetchCallProfileRequestValidate, callback: any) {
  try {
    let Query =
      "SELECT sp.id,sp.name,sp.email_id,sp.sme_mobile,sp.alternate_number,sp.allowed_agents,sp.service_flag,sp.status,sp.insert_time,sp.update_time,sp.zone_id,sp.longcode_id,sp.ivr_flow_status,sp.balance,sp.recording,sp.masking,sp.voicemail,sp.selection_algo,sp.biz_address,sp.language,sp.billing_status,sp.billing_date,sp.renew_date,sp.pack_id,sp.rec_validity,sp.crm_flag,sp.queue_limit,sp.account_sid,sp.call_back_url,sp.outdial_limit,sp.campaign_limit,sp.live_events,sp.call_mode,sp.sticky_algo,sp.eod_report_flag,sp.routing_type,sp.in_channels,sp.in_queue_channels,sp.out_channels,sp.gui_timer,sp.agent_relax_time,sp.in_permission_flag,sp.out_permission_flag,sp.lead_settings,lc.hlr,lc.sme_Identifier, lc.number_type, sp.end_call_notification_flag,sp.parallel_ringing_channels,sp.lead_manager_permission_flag, sp.webrtc_channel, sp.webrtc_permission_flag, sp.text_to_speech_permission_flag, sp.text_to_speech_count, sp.incoming_agent as incoming_agent, sp.outgoing_agent as outgoing_agent, sp.no_agent_calling_flag, sp.redirect_calls_ai_bot,sp.jingle_flag FROM longcodes AS lc LEFT JOIN longcodes_sme_mapping AS lm ON lm.longcode_id=lc.id LEFT JOIN sme_profile AS sp ON sp.id=lm.sme_id where SUBSTRING(TRIM(lc.longcode), -10) = SUBSTRING(:longcode, -10)  limit 1";
    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { longcode: where["longcode"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {

    glogger('ERR', "0", 'FindSmeProfile', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindSelfSmeLiveCalls(where: any, payload: any, callback: any) {
  try {
    let Query = "SELECT IFNULL(count(*),0) as LiveCalls, IFNULL(sum(CASE WHEN call_type = 'Incoming' THEN 1 ELSE 0 END),0) AS incomingCalls, IFNULL(sum(CASE WHEN call_type = 'Outgoing' THEN 1 ELSE 0 END),0) AS outgoingCalls from live_calls  where sme_id  =:sme_id and DATE(date_time) =DATE(:currentDate)";
    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], currentDate: payload["currentDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindSelfSmeLiveCalls', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindAllSmeLiveCalls(where: any, payload: any, callback: any) {
  try {
    var serverAddr ='';
    if(where['ip_address'] ){
      serverAddr =  "and server_ip_address ='"+ where['ip_address']+"'";
    }
    let Query = "SELECT IFNULL(count(*),0) as LiveCalls, IFNULL(sum(CASE WHEN call_type = 'Incoming' THEN 1 ELSE 0 END),0) AS incomingCalls, IFNULL(sum(CASE WHEN call_type = 'Outgoing' THEN 1 ELSE 0 END),0) AS outgoingCalls from live_calls  where DATE(date_time) =DATE(:currentDate) "+ serverAddr;
    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], currentDate: payload["currentDate"], ip_address: where["ip_address"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindAllSmeLiveCalls', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindSmePrompts(where: any, callback: any) {
  try {
    let Query =
      "SELECT id, prompt_name,status,sme_id,insert_date_time,updated_date_time,prompt_description, prompt_path,server_ip_address,category,prompt_key,prompt_url from sme_prompts where sme_id  =:sme_id";
    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindSmePrompts', "error:" + error);

    callback(error, null);
    throw new Error(error);
  }
}

export async function FindSmeCrmList(where: any, callback: any) {
  try {
    let Query =
      "SELECT sme_id,crm_partner,status,insert_datetime,update_datetime,recording_url,recording_url_provider,outgoing_url,outgoing_url_provider,incoming_url,incoming_url_provider,pushsms_url,sms_provider,pushsms_success,pushsms_failure from sme_crm_details where sme_id  =:sme_id";
    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindSmeCrmList', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindSmeAddressBook(where: any, callback: any) {
  try {
    let Query =
      "SELECT id,sme_id,customer_name,customer_number_primary,status,insert_date_time,updated_date_time,mode,customer_number_secondary,company_name,email_id,created_by,visibility_flag,is_updated from address_book where sme_id  =:sme_id and SUBSTRING(TRIM(customer_number_primary), -10) = SUBSTRING(:callingNumber, -10)";
    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], callingNumber: where["callingNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindSmeAddressBook', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindSmeAgentList(where: any, callback: any) {
  try {
    let Query =
      "SELECT ad.*, agd.group_name,lg.longcode FROM agent_details  ad LEFT JOIN agent_group_mapping AS ag ON ad.agent_id = ag.agent_id LEFT JOIN  agent_group_detail  agd ON agd.group_id = ag.group_id LEFT JOIN longcodes_agent_mapping  lam ON lam.agent_id =  ad.agent_id LEFT JOIN longcodes  lg ON  lg.id = lam.longcode_id WHERE ad.sme_id  =:sme_id and SUBSTRING(TRIM(ad.agent_mobile), -10) = SUBSTRING(:callingNumber, -10) and ad.status !=-9 limit 1";
    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], callingNumber: where["callingNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindSmeAgentList', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindSmeIvrFlow(where: any, callback: any) {
  try {
    //let Query = "SELECT mcm.id, mcm.sme_id, mcm.flow_id, mcm.flow_name, mcm.cat_id, mcm.cat_desc, mcm.parent_cat_id, mcm.children, mcm.dtmf, mcm.media_file_status, mcm.media_file, mcm.service_type,mcm.title, mcm.event_type, mcm.type , mcm.date_time,mcm.queue_id FROM mpbx_category_master AS mcm INNER  JOIN longcodes AS lc ON  SUBSTRING(lc.longcode,  -10) = SUBSTRING(:longcode,  -10) INNER  JOIN longcodes_sme_mapping AS lsm ON lsm.sme_id =mcm.sme_id and lc.id =lsm.longcode_id AND lsm.call_flow_id = mcm.flow_id  WHERE mcm.sme_id =:sme_id ";

    let Query = "SELECT mcm.id, mcm.sme_id, mcm.flow_id, mcm.flow_name, mcm.cat_id, mcm.cat_desc, mcm.parent_cat_id, mcm.children, mcm.dtmf, mcm.media_file_status, mcm.media_file, mcm.service_type,mcm.title, mcm.event_type, mcm.type , mcm.date_time,mcm.queue_id, sq.name as queue_name,md.directory_path FROM mpbx_category_master AS mcm   left JOIN sme_queue sq  ON sq.id = mcm.queue_id left join media_details as md ON md.id=mcm.media_id INNER  JOIN longcodes AS lc ON  SUBSTRING(lc.longcode,  -10) = SUBSTRING(:longcode,  -10) INNER  JOIN longcodes_sme_mapping AS lsm ON lsm.sme_id =mcm.sme_id and lc.id =lsm.longcode_id AND lsm.call_flow_id = mcm.flow_id WHERE mcm.sme_id =:sme_id and mcm.parent_cat_id =0  limit 1";

    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], longcode: where["longcode"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindSmeIvrFlow', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function AddLiveCalls(where: any, callback: any) {
  try {
    let Query =
      "INSERT INTO live_calls (sme_id, date_time, longcode, customer_number, agent_number, server_ip_address, agent_id, session_id, call_status, call_type,is_auto_dial) VALUES (:sme_id, :date_time, :longcode, :customer_number, :agent_number, :self_ip, :agent_id, :session_id, :call_status , :call_type,:is_auto_dial)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        sme_id: where["sme_id"],
        longcode: where["longcode"],
        customer_number: where["customer_number"],
        callingNumber: where["callingNumber"],
        self_ip: where["self_ip"],
        agent_id: where["agent_id"],
        agent_number: where["agent_number"],
        session_id: where["session_id"],
        call_status: where["call_status"],
        date_time: where["date_time"],
        call_type: where["call_type"],
        is_auto_dial: where["is_auto_dial"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'AddLiveCalls', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateLiveCalls(where: any, callback: any) {
  try {
    /*let Query = "Update live_calls set agent_number= :agent_number, agent_id=:agent_id , call_status=:call_status, customer_number=:customer_number where  session_id =:session_id  limit 1 ";*/

    let Query = "INSERT INTO live_calls (sme_id, date_time, longcode, customer_number, agent_number, server_ip_address, agent_id, session_id, call_status, call_type, is_auto_dial) VALUES (:sme_id, :date_time, :longcode, :customer_number, :agent_number, :self_ip, :agent_id, :session_id, :call_status, :call_type, :isAutoDial) ON DUPLICATE KEY UPDATE agent_id = :agent_id, agent_number = :agent_number,  call_status = :call_status, customer_number = :customer_number";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { sme_id: where["sme_id"], date_time: where["date_time"], longcode: where["longcode"], customer_number: where["customer_number"], agent_id: where["agent_id"], agent_number: where["agent_number"], session_id: where["session_id"], call_status: where["call_status"], self_ip: where["self_ip"], call_type: where["call_type"], isAutoDial: where["isAutoDial"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateLiveCalls', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function DeleteLiveCalls(where: any, callback: any) {
  try {
    let Query = "delete from live_calls where session_id =:session_id limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: { session_id: where["session_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'DeleteLiveCalls', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function CheckAgentExtension(where: any, callback: any) {
  try {
    let Query = "SELECT COUNT(1) as in_agent_cnt FROM agent_details WHERE agent_extention=:in_agent_ext AND sme_id=:sme_id AND STATUS!='-9' AND STATUS!='0' LIMIT 1";
    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], in_agent_ext: where["in_agent_ext"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'CheckAgentExtension', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindAgentExtensionDetails(where: any, callback: any) {
  try {
    let Query =
      "SELECT IFNULL(ad.agent_id,0) AS in_agent_id, IFNULL(ad.agent_email,0) AS in_email_id,IFNULL(ad.STATUS,0) AS in_agent_status,IFNULL(ad.agent_mobile,0) AS in_agent_mobile,IFNULL(ad.sticky_agent,0) AS in_agent_sticky, IFNULL(ad.webrtc_flag,0) AS in_webrtc_flag, IFNULL(ad.agent_masking,0) AS in_agent_masking, IFNULL(ad.agent_score,0) AS in_agent_score, IFNULL(ad.sticky_days,0) AS in_agent_sticky_days, IFNULL(ag.group_id,0) AS in_group_id ,IFNULL(agd.group_name,0) AS in_group_name FROM agent_details AS ad INNER JOIN agent_group_mapping AS ag ON ag.agent_id=ad.agent_id INNER JOIN agent_group_detail AS agd ON agd.group_id=ag.group_id  WHERE agent_extention=:in_agent_ext AND sme_id=:sme_id AND STATUS!='-9' AND STATUS!='0' LIMIT 1";
    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], in_agent_ext: where["in_agent_ext"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindAgentExtensionDetails', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindAddressbook(where: any, callback: any) {
  try {
    let Query =
      "SELECT IFNULL(customer_name,0) as g_customer_name , IFNULL(id,0) as g_addbookid FROM address_book WHERE sme_id = :sme_id AND SUBSTRING(customer_number_primary,  -10) = SUBSTRING(:customerNumber,  -10) limit 1";
    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], customerNumber: where["customerNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindAddressbook', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateAgentStatusFree(where: any, callback: any) {
  try {
    let Query = "Update agent_details set status= 1 where agent_id =:agent_id limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { agent_id: where["agent_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateAgentStatusFree', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateAgentStatusBusy(where: any, callback: any) {
  try {
    let Query = "Update agent_details set status= 2 where agent_id =:agent_id limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { agent_id: where["agent_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateAgentStatusBusy', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateAgentStatusBusyParallelRinging(where: any, callback: any) {
  try {

    console.log(where["agent_id"]);

    let Query = "Update agent_details set status= 2 where agent_id in(:agent_id)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { agent_id: where["agent_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateAgentStatusBusyParallelRinging', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function getAgentDetail(where: any, callback: any) {
  try {
    //let Query =
      //"SELECT ad.*, agd.group_name,agd.group_id,agd.group_status,sm.recording FROM agent_details ad LEFT JOIN agent_group_mapping AS ag ON ad.agent_id = ag.agent_id LEFT JOIN agent_group_detail AS agd ON agd.group_id = ag.group_id LEFT JOIN sme_profile AS sm ON ad.sme_id = sm.id  WHERE ad.sme_id  =:sme_id and ad.agent_id =:agent_id  and ad.status !=-9 Limit 1";

      let Query =
      "SELECT ad.*, agd.group_name,agd.group_id,agd.group_status,sm.recording , (  select (case when count(1) > '0' then 'available' else 'off_hours' END ) as status from              agent_details_timing adt where adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a'))       and adt.agent_id = ad.agent_id AND (CASE WHEN adt.in_time > adt.out_time THEN ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE WHEN adt.in_time > adt.out_time THEN (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)) as agent_off_hours_status FROM agent_details ad left JOIN agent_details_timing adt ON ad.agent_id = adt.agent_id LEFT JOIN agent_group_mapping AS ag ON ad.agent_id = ag.agent_id LEFT JOIN agent_group_detail AS agd ON agd.group_id = ag.group_id LEFT JOIN sme_profile AS sm ON ad.sme_id = sm.id  WHERE ad.sme_id  =:sme_id and ad.agent_id =:agent_id  and ad.status !=-9 Limit 1";

    console.log(where);
    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], agent_id: where["agent_id"], currentDate: where["currentDate"] },
    });
    console.log(executeQuery);
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'getAgentDetail', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function UpdateFreeAgentiming(where: any, payload: any, callback: any) {
  try {
    let Query =
      "Update agent_details_timing set status= 1 where agent_id =:agent_id and days_week=UPPER(DATE_FORMAT(:currentDate,'%a')) AND DATE_FORMAT(in_time,'%T') < DATE_FORMAT(:currentDate,'%T') AND DATE_FORMAT(out_time,'%T') > DATE_FORMAT(:currentDate,'%T')";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { agent_id: where["agent_id"], currentDate: payload["currentDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateFreeAgentiming', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateBusyAgentTiming(where: any, payload: any, callback: any) {
  try {
    let Query =
      "Update agent_details_timing set status= 2 where agent_id =:agent_id and days_week=UPPER(DATE_FORMAT(:currentDate,'%a')) AND DATE_FORMAT(in_time,'%T') < DATE_FORMAT(:currentDate,'%T') AND DATE_FORMAT(out_time,'%T') > DATE_FORMAT(:currentDate,'%T') ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { agent_id: where["agent_id"], currentDate: payload["currentDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateBusyAgentTiming', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateBusyAgentTimingParallelRinging(where: any, payload: any, callback: any) {
  try {
    let Query =
      "Update agent_details_timing set status= 2 where agent_id in(:agent_id) and days_week=UPPER(DATE_FORMAT(:currentDate,'%a')) AND DATE_FORMAT(in_time,'%T') < DATE_FORMAT(:currentDate,'%T') AND DATE_FORMAT(out_time,'%T') > DATE_FORMAT(:currentDate,'%T') ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { agent_id: where["agent_id"], currentDate: payload["currentDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateBusyAgentTimingParallelRinging', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function getAllAgentsStatus(where: any, callback: any) {
  try {
    //let Query = "select sme_id, agent_name , agent_mobile , agent_id , status , agent_extention , in_time , out_time , agent_email , sticky_agent , agent_masking , sticky_days ,in_permission_flag ,out_permission_flag , break_permission_flag  from agent_details where sme_id =:sme_id and status != -9";

    //let Query =      "select ad.sme_id, ad.agent_name , ad.agent_mobile , ad.agent_id , ad.status , ad.agent_extention , ad.in_time , ad.out_time , ad.agent_email , ad.sticky_agent , ad.agent_masking , ad.sticky_days , ad.webrtc_flag, ad.in_permission_flag ,ad.out_permission_flag , ad.break_permission_flag  from agent_details ad left join agent_group_mapping agm ON ad.agent_id  = agm.agent_id LEFT JOIN agent_group_detail agd on agm.group_id =agd.group_id  where ad.sme_id =:sme_id and ad.status != -9 and agm.group_id =:g_group ";

    let Query =
      "select ad.sme_id, ad.agent_name , ad.agent_mobile , ad.agent_id , ad.status , ad.agent_extention , ad.in_time , ad.out_time , ad.agent_email , ad.sticky_agent , ad.agent_masking , ad.sticky_days , ad.webrtc_flag, ad.in_permission_flag ,ad.out_permission_flag , ad.break_permission_flag  from agent_details ad  LEFT JOIN sme_queue_mapping sqm ON sqm.agent_id  = ad.agent_id  where ad.sme_id =:sme_id and ad.status != -9 and sqm.queue_id = :g_queue_id ";

    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], g_queue_id: where["g_queue_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'getAllAgentsStatus', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function addRecordingIvr(where: any, callback: any) {
  try {
    let Query =
      "INSERT INTO mpbx_call_recording (call_id,sme_id,agent_id,customer_ani,duration,filename,STATUS,flag,rec_server,insert_date) VALUES (:in_call_id,:sme_id,:in_agent_id,:in_customer_ani,:in_duration,:in_filename,:in_status, :in_flag_tbl,  :in_ip, :insertDateTime) ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        in_call_id: where["in_call_id"],
        sme_id: where["sme_id"],
        in_agent_id: where["in_agent_id"],
        in_customer_ani: where["in_customer_ani"],
        in_duration: where["in_duration"],
        in_filename: where["in_filename"],
        in_status: where["in_status"],
        in_flag_tbl: where["in_flag_tbl"],
        in_ip: where["in_ip"],
        insertDateTime: where["insertDateTime"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", '/ivr/' + where["sme_id"] + '/saveRecording', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}



export async function addFailedRecordingInfo(where: any, callback: any) {
  try {
    let Query =
      "INSERT INTO mpbx_call_recording_failed (call_id,sme_id,agent_id,customer_ani,duration,filename,STATUS,flag,rec_server,insert_date, session_id) VALUES (:in_call_id,:sme_id,:in_agent_id,:in_customer_ani,:in_duration,:in_filename,:in_status, :in_flag_tbl,  :in_ip, :insertDateTime, :in_session_id) ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        in_call_id: where["in_call_id"],
        sme_id: where["sme_id"],
        in_agent_id: where["in_agent_id"],
        in_customer_ani: where["in_customer_ani"],
        in_duration: where["in_duration"],
        in_filename: where["in_filename"],
        in_status: where["in_status"],
        in_flag_tbl: where["in_flag_tbl"],
        in_ip: where["in_ip"],
        in_session_id: where["in_session_id"],
        insertDateTime: where["insertDateTime"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", '/ivr/' + where["sme_id"] + '/saveRecording', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function returnFailedRecordingInfo(where: any, callback: any) {
  try {
    //let Query =
    //"select sme_id, call_id , agent_id , customer_ani , duration , filename , insert_date , merged_file , rec_server, session_id from mpbx_call_recording_failed  where status = 0 and rec_server= :in_ip limit :total_records ";

    let Query =
      "select mcrf.sme_id, mcrf.call_id , mcrf.agent_id , mcrf.customer_ani , mcrf.duration , mcrf.filename , mcrf.insert_date , mcrf.merged_file , mcrf.rec_server, mcrf.retry, cc.session_id , cc.call_direction from mpbx_call_recording_failed as mcrf inner join calling_cdr as cc on mcrf.call_id = cc.call_recorded_file  where mcrf.status = 0 and mcrf.rec_server =:in_ip limit 1 ";

    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { in_ip: where["in_ip"], total_records: where['total_records'], },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'returnFailedRecordingInfo', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function updateRecordingRetry(where: any, callback: any) {
  try {
    let Query = "update mpbx_call_recording_failed set retry = retry+1 where sme_id =:in_sme_id and call_id =:in_call_id limit 1 ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { in_sme_id: where["in_sme_id"], in_call_id: where["in_call_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'updateRecordingRetry', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function updateRecordingSuccess(where: any, callback: any) {
  try {
    let Query = "update mpbx_call_recording_failed set status = 1, s3_url =:in_s3url where sme_id =:in_sme_id and call_id =:in_call_id limit 1 ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { in_sme_id: where["in_sme_id"], in_call_id: where["in_call_id"], in_s3url: where["in_s3url"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'updateRecordingSuccess', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function addUploadedRecording(where: any, callback: any) {
  try {
    let Query =
      "INSERT INTO mpbx_call_recording (call_id,sme_id,agent_id,customer_ani,duration,filename,STATUS,flag,rec_server,insert_date, merged_file, s3_url, crm_url) VALUES (:in_call_id,:sme_id,:in_agent_id,:in_customer_ani,:in_duration,:in_filename,:in_status, :in_flag_tbl,  :in_ip, :insertDateTime, :komm_url, :in_file, :crm_url ) ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        in_call_id: where["in_call_id"],
        sme_id: where["sme_id"],
        in_agent_id: where["in_agent_id"],
        in_customer_ani: where["in_customer_ani"],
        in_duration: where["in_duration"],
        in_filename: where["in_filename"],
        in_status: where["in_status"],
        in_flag_tbl: where["in_flag_tbl"],
        in_ip: where["in_ip"],
        insertDateTime: where["insertDateTime"],
        komm_url: where["komm_url"],
        in_file: where["in_file"],
        crm_url: where["crm_url"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", '/ivr/' + where["sme_id"] + '/uploadRecording', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function uploadedRecordingStatusIn(where: any, callback: any) {
  try {
    let Query = "Update incoming_ivr_call_cdr set merge_status= 1 where sme_id =:sme_id and session_id =:session_id limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { sme_id: where["sme_id"], session_id: where["session_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", '/ivr/' + where["sme_id"] + '/uploadRecording', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function uploadedRecordingStatusOut(where: any, callback: any) {
  try {
    let Query = "Update outbond_ivr_cdr set merge_status= 1 where sme_id =:sme_id and session_id =:session_id limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { sme_id: where["sme_id"], session_id: where["session_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", '/ivr/' + where["sme_id"] + '/uploadRecording', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}
export async function getResponseMessageCdr(where: any, callback: any) {
  try {
    let Query = "SELECT response_message as in_response_message FROM mpbx_ss7_response WHERE response_code= :g_responseCode";
    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { g_responseCode: where["g_responseCode"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'getResponseMessageCdr', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function InsertAgentReport(where: any, payload: any, callback: any) {
  try {
    //let Query = "INSERT INTO agent_report_details (sme_id, agent_id, agent_group, status,response_message,response_code, start_date,end_date, duration, insert_date,customer_ani,session_id,call_mode,call_info,connected_duration,ringing_duration, call_route_reason,agent_number) values (:sme_id, :g_agentId, :g_agentgroup, :g_status, :in_response_message, :g_responseCode, :startDate, :endDate, :g_duration, :currentDate, :g_customerAni, :g_sessionCall, :g_mode, :g_callInfo, :connectedDuration, :ringingDuration, :callRouteReason,:agentNumber) ";

    let Query = "INSERT INTO agent_report_details (sme_id, agent_id, queue_name, status,response_message,response_code, start_date,end_date, duration, insert_date,customer_ani,session_id,call_mode,call_info,connected_duration,ringing_duration, call_route_reason,agent_number) values (:sme_id, :g_agentId, :g_queue, :g_status, :in_response_message, :g_responseCode, :startDate, :endDate, :g_duration, :currentDate, :g_customerAni, :g_sessionCall, :g_mode, :g_callInfo, :connectedDuration, :ringingDuration, :callRouteReason,:agentNumber) ";


    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        sme_id: where["sme_id"],
        g_agentId: where["g_agentId"],
        g_queue: where["g_queue"],
        g_status: where["g_status"],
        in_response_message: payload["in_response_message"],
        g_responseCode: where["g_responseCode"],
        startDate: where["startDate"],
        endDate: where["endDate"],
        g_duration: where["g_duration"],
        g_customerAni: where["g_customerAni"],
        g_sessionCall: where["g_sessionCall"],
        g_mode: where["g_mode"],
        g_callInfo: where["g_callInfo"],
        connectedDuration: where["connectedDuration"],
        ringingDuration: where["ringingDuration"],
        currentDate: payload["currentDate"],
        callRouteReason: where["callRouteReason"],
        agentNumber: where["agentNumber"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'InsertAgentReport', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateAgentDetails(where: any, callback: any) {
  try {
    let Query = "Update agent_details set recent_call_date_time = :recentCallDateTime WHERE sme_id=:sme_id AND agent_id=:g_agentId limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { sme_id: where["sme_id"], g_agentId: where["g_agentId"], recentCallDateTime: where["recentCallDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateAgentDetails', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function GetCountAgentCall(where: any, payload: any, callback: any) {
  try {
    let Query = "SELECT COUNT(1) as in_cnt, IFNULL(total_calls,0) as total_calls, IFNULL(total_in_calls,0) as total_in_calls,  IFNULL(total_out_calls,0) as total_out_calls, IFNULL(no_answer ,0) as no_answer,  IFNULL(in_success_calls ,0) as in_success_calls,  IFNULL(in_failed_calls ,0) as in_failed_calls,  IFNULL(out_success_calls ,0) as out_success_calls, IFNULL(out_failed_calls ,0) as out_failed_calls,  IFNULL(avg_call_duration ,0) as avg_call_duration,  IFNULL(total_call_duration ,0) as total_call_duration,  IFNULL(office_hours ,0) as office_hours, IFNULL(lunch_hours ,0) as lunch_hours,  IFNULL(avg_connected_duration ,0) as avg_connected_duration,  IFNULL(avg_ringing_duration ,0) as avg_ringing_duration,  IFNULL(connected_duration ,0) as connected_duration,  IFNULL(ringing_duration ,0) as ringing_duration,  IFNULL(total_ringing_duration ,0) as total_ringing_duration,  IFNULL(total_connected_duration ,0) as total_connected_duration FROM agent_calling_details WHERE sme_id=:sme_id  AND agent_id=:g_agentId AND DATE(insert_date)= DATE(:currentDate)";
    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], g_agentId: where["g_agentId"], currentDate: payload["currentDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'GetCountAgentCall', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateAgentCalling(where: any, payload: any, callback: any) {
  try {

    //let Query =
      //"UPDATE agent_calling_details SET total_calls=(SELECT MAX(total_calls) FROM agent_calling_details WHERE sme_id=:sme_id AND agent_id=:g_agentId AND Date(insert_date)=Date(:currentDate) limit 1) +1  WHERE ///sme_id=:sme_id AND agent_id=:g_agentId AND Date(insert_date)=Date(:currentDate) limit 1";


    let Query =
      "UPDATE agent_calling_details SET total_calls=:total_calls, total_in_calls=:total_in_calls, total_out_calls=:total_out_calls, no_answer=:no_answer, in_success_calls=:in_success_calls, in_failed_calls=:in_failed_calls, out_success_calls=:out_success_calls, out_failed_calls=:out_failed_calls, avg_call_duration=:avg_call_duration, total_call_duration=:total_call_duration,avg_connected_duration=:avg_connected_duration, avg_ringing_duration=:avg_ringing_duration, connected_duration=:connected_duration, total_connected_duration=:total_connected_duration, ringing_duration=:ringing_duration, total_ringing_duration=:total_ringing_duration  WHERE sme_id=:sme_id AND agent_id=:g_agentId AND Date(insert_date)=Date(:currentDate) limit 1";

    console.log(Query);

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {total_calls: where["total_calls"], total_in_calls: where["total_in_calls"], total_out_calls: where["total_out_calls"], no_answer: where["no_answer"], in_success_calls: where["in_success_calls"], in_failed_calls: where["in_failed_calls"], out_success_calls: where["out_success_calls"], out_failed_calls: where["out_failed_calls"], avg_call_duration: where["avg_call_duration"], total_call_duration: where["total_call_duration"], ringing_duration: where["ringing_duration"], total_ringing_duration: where["total_ringing_duration"], avg_connected_duration: where["avg_connected_duration"], avg_ringing_duration: where["avg_ringing_duration"], connected_duration: where["connected_duration"], total_connected_duration: where["total_connected_duration"],       sme_id: where["sme_id"], g_agentId: where["g_agentId"], currentDate: payload["currentDate"],  },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateAgentCalling', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function InsertAgentCalling(where: any, payload: any, callback: any) {
  try {
    //let Query =
      //"INSERT INTO agent_calling_details (agent_id,sme_id,total_calls,insert_date,in_success_calls,in_failed_calls,out_success_calls,out_failed_calls) values(:g_agentId, :sme_id, 1, :currentDate, 0, 0, 0, 0)";

      let Query =
      "INSERT INTO agent_calling_details (agent_id,sme_id,insert_date, total_calls, total_in_calls,total_out_calls, no_answer, in_success_calls, in_failed_calls, out_success_calls, out_failed_calls, avg_call_duration, total_call_duration, avg_connected_duration, avg_ringing_duration, connected_duration, total_connected_duration, ringing_duration, total_ringing_duration) values(:g_agentId, :sme_id, :currentDate, :total_calls, :total_in_calls, :total_out_calls, :no_answer, :in_success_calls, :in_failed_calls, :out_success_calls, :out_failed_calls, :avg_call_duration, :total_call_duration, :avg_connected_duration, :avg_ringing_duration, :connected_duration, :total_connected_duration, :ringing_duration, :total_ringing_duration)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { total_calls: where["total_calls"], sme_id: where["sme_id"], g_agentId: where["g_agentId"], currentDate: payload["currentDate"],      total_in_calls: where["total_in_calls"], total_out_calls: where["total_out_calls"], no_answer: where["no_answer"], in_success_calls: where["in_success_calls"], in_failed_calls: where["in_failed_calls"], out_success_calls: where["out_success_calls"], out_failed_calls: where["out_failed_calls"], avg_call_duration: where["avg_call_duration"], total_call_duration: where["total_call_duration"], ringing_duration: where["ringing_duration"], total_ringing_duration: where["total_ringing_duration"], avg_connected_duration: where["avg_connected_duration"], avg_ringing_duration: where["avg_ringing_duration"], connected_duration: where["connected_duration"], total_connected_duration: where["total_connected_duration"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'InsertAgentCalling', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateAgentCallThroughMode(where: any, payload: any, callback: any) {
  try {
    let Query = "";
    if (where["g_mode"] == "IVR_IN") {
      Query =
        "UPDATE agent_calling_details SET total_in_calls= (SELECT MAX(total_in_calls) FROM agent_calling_details WHERE sme_id=:sme_id AND agent_id=:g_agentId AND Date(insert_date)=Date(:currentDate)) +1   WHERE sme_id=:sme_id AND agent_id=:g_agentId AND Date(insert_date)=Date(:currentDate)";
    } else if (where["g_mode"] == "IVR_OUT" || where["g_mode"] == "WRINGG_APP" || where["g_mode"] == "CRM_WEB" || where["g_mode"] == "1") {
      Query =
        "UPDATE agent_calling_details SET total_out_calls= (SELECT MAX(total_out_calls) FROM agent_calling_details WHERE sme_id=:sme_id AND agent_id=:g_agentId AND Date(insert_date)=Date(:currentDate)) +1  WHERE  sme_id=:sme_id AND agent_id=:g_agentId AND Date(insert_date)=Date(:currentDate)";
    }

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { sme_id: where["sme_id"], g_agentId: where["g_agentId"], currentDate: payload["currentDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateAgentCallThroughMode', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateAgentCallSuccessFail(where: any, payload: any, callback: any) {
  try {
    let Query = "";
    if (where["g_mode"] == "IVR_IN" && where["g_status"] == 0) {
      Query =
        "UPDATE agent_calling_details SET in_success_calls=  (SELECT MAX(in_success_calls) FROM agent_calling_details WHERE sme_id=:sme_id AND agent_id=:g_agentId AND Date(insert_date)=Date(:currentDate)) +1   WHERE sme_id=:sme_id AND agent_id=:g_agentId AND Date(insert_date)=Date(:currentDate)";
    } else if (where["g_mode"] == "IVR_IN" && where["g_status"] == 1) {
      Query =
        "UPDATE agent_calling_details SET in_failed_calls=  (SELECT MAX(in_failed_calls) FROM agent_calling_details WHERE sme_id=:sme_id AND agent_id=:g_agentId AND Date(insert_date)=Date(:currentDate)) +1 WHERE sme_id=:sme_id AND agent_id=:g_agentId AND Date(insert_date)=Date(:currentDate)";
    } else if ((where["g_mode"] == "IVR_OUT" || where["g_mode"] == "WRINGG_APP" || where["g_mode"] == "CRM_WEB" || where["g_mode"] == "1") && where['overallCallStatus'] == 'success') {
      Query =
        "UPDATE agent_calling_details SET out_success_calls=  (SELECT MAX(out_success_calls) FROM agent_calling_details WHERE sme_id=:sme_id AND agent_id=:g_agentId AND Date(insert_date)=Date(:currentDate)) +1   WHERE sme_id=:sme_id AND agent_id=:g_agentId AND Date(insert_date)=Date(:currentDate)";
    } else if ((where["g_mode"] == "IVR_OUT" || where["g_mode"] == "WRINGG_APP" || where["g_mode"] == "CRM_WEB" || where["g_mode"] == "1") && where['overallCallStatus'] == 'failed') {
      Query =
        "UPDATE agent_calling_details SET out_failed_calls= (SELECT MAX(out_failed_calls) FROM agent_calling_details WHERE sme_id=:sme_id AND agent_id=:g_agentId AND Date(insert_date)=Date(:currentDate)) +1   WHERE sme_id=:sme_id AND agent_id=:g_agentId AND Date(insert_date)=Date(:currentDate)";
    }

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { sme_id: where["sme_id"], g_agentId: where["g_agentId"], currentDate: payload["currentDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateAgentCallSuccessFail', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function InsertEndCallCdr(where: any, payload: any, callback: any) {
  try {
    

    //let  Query =    "INSERT INTO calling_cdr ( sme_id,  start_date_time, end_date_time, insert_date_time, duration, longcode, hlr, master_shortcode, sme_identifier, shortcode_mapping, call_direction_status, call_direction, customer_number, agent_number, call_recording_status, call_recorded_file, voicemail_recording_status, voicemail_recording_file, channel_no, server_ip_address, cdr_mode, call_mode, agent_group, patched_agent_id, session_id, merge_status, answer, call_status, disconnected_by, address_book_id, remarks, connected_duration, ringing_duration, call_type, call_description,ivr_duration,customer_status, final_status,call_flow_id, call_flow_name) values ( :sme_id,  :startDateTime, :endDateTime, :insertDateTime, :duration, :longcode, :hlr, :masterShortcode, :smeIdentifier, :shortcodeMapping, :callDirectionStatus, :callDirection, :customerNumber, :agentNumber,:callRecordingStatus, :callRecordedFile, :voicemailRecordingStatus, :voicemailRecordingFile, :channelNo, :serverIpAddress, :cdrMode, :callMode, :agentGroup, :patchedAgentId, :session_id, :merge_status, :answer, :provisionalFlag, :disconnectedBy, :addressBookId, :remarks, :connectedDuration, :ringingDuration, :callType, :callDescription, :ivrDuration, :customerStatus, :finalStatus, :callflowId, :callflowName) ";

    let  Query =    "INSERT INTO calling_cdr ( sme_id,  start_date_time, end_date_time, insert_date_time, duration, longcode, hlr, master_shortcode, sme_identifier, shortcode_mapping, call_direction_status, call_direction, customer_number, agent_number, call_recording_status, call_recorded_file, voicemail_recording_status, voicemail_recording_file, channel_no, server_ip_address, cdr_mode, call_mode, queue_name, patched_agent_id, session_id, merge_status, answer, call_status, disconnected_by, address_book_id, remarks, connected_duration, ringing_duration, call_type, call_description,ivr_duration,customer_status, final_status,call_flow_id, call_flow_name) values ( :sme_id,  :startDateTime, :endDateTime, :insertDateTime, :duration, :longcode, :hlr, :masterShortcode, :smeIdentifier, :shortcodeMapping, :callDirectionStatus, :callDirection, :customerNumber, :agentNumber,:callRecordingStatus, :callRecordedFile, :voicemailRecordingStatus, :voicemailRecordingFile, :channelNo, :serverIpAddress, :cdrMode, :callMode, :queue_name, :patchedAgentId, :session_id, :merge_status, :answer, :provisionalFlag, :disconnectedBy, :addressBookId, :remarks, :connectedDuration, :ringingDuration, :callType, :callDescription, :ivrDuration, :customerStatus, :finalStatus, :callflowId, :callflowName) ";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        sme_id: where["sme_id"],
        lastInsertedId: payload["lastInsertedId"],
        startDateTime: where["startDateTime"],
        endDateTime: where["endDateTime"],
        insertDateTime: where["insertDateTime"],
        duration: where["duration"],
        longcode: where["longcode"],
        hlr: where["hlr"],
        masterShortcode: where["masterShortcode"],
        smeIdentifier: where["smeIdentifier"],
        shortcodeMapping: where["shortcodeMapping"],
        callDirectionStatus: where["callDirectionStatus"],
        callDirection: where["callDirection"],
        customerNumber: where["customerNumber"],
        agentNumber: where["agentNumber"],
        callRecordingStatus: where["callRecordingStatus"],
        callRecordedFile: where["callRecordedFile"],
        voicemailRecordingStatus: where["voicemailRecordingStatus"],
        voicemailRecordingFile: where["voicemailRecordingFile"],
        channelNo: where["channelNo"],
        serverIpAddress: where["serverIpAddress"],
        cdrMode: where["cdrMode"],
        callMode: where["callMode"],
        agentGroup: where["agentGroup"],
        queue_name: where["queue_name"],
        session_id: where["session_id"],
        merge_status: where["merge_status"],
        answer: where["answer"],
        callStatus: where["callStatus"],
        disconnectedBy: where["disconnectedBy"],
        addressBookId: where["addressBookId"],
        remarks: where["remarks"],
        connectedDuration: where["connectedDuration"],
        ringingDuration: where["ringingDuration"],
        patchedAgentId: where["patchedAgentId"],
        callType: where["callType"],
        callDescription: where["callDescription"],
        ivrDuration: where["ivrDuration"],
        customerStatus: where["customerStatus"],
        finalStatus: where["finalStatus"],
        callflowId: where["callflowId"],
        callflowName: where["callflowName"],
        provisionalFlag: where["provisionalFlag"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'InsertEndCallCdr', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function GetLastInsertedId(where: any, callback: any) {
  try {
    let Query = "SELECT MAX(id) as id FROM calling_cdr";
    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'GetLastInsertedId', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function GetLastInsertedIdCdr(where: any, callback: any) {
  try {
    let Query = "";
    if (where["callDirection"] == "INCOMING") {
      Query = "SELECT MAX(id) as id FROM incoming_ivr_call_cdr";
    } else if (where["callDirection"] == "OUTGOING") {
      Query = "SELECT MAX(id) as id FROM outbond_ivr_cdr";
    }

    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'GetLastInsertedIdCdr', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function InsertIncomingOutgoingCallCdr(where: any, payload: any, callback: any) {
  try {
    if (payload["lastInsertedId"] == null || payload["lastInsertedId"] == 0) {
      payload["lastInsertedId"] = 1;
    } else {
      payload["lastInsertedId"] = payload["lastInsertedId"] + 1;
    }

    let Query = "";
    if (where["callDirection"] == "INCOMING") {
      Query =
        "INSERT INTO incoming_ivr_call_cdr (sme_id, start_date_time, end_date_time, insert_date_time, duration, longcode, hlr, master_shortcode, sme_identifier, shortcode_mapping,call_direction_status,   call_direction, calling_number, called_number, call_recording_status, call_recorded_file, voicemail_recording_status, voicemail_recording_file, channel_no, server_ip_address, cdr_mode, call_mode, agent_group, patched_agent_id, answer, call_status, disconnected_by, address_book_id, remarks,  session_id,merge_status,connected_duration,ringing_duration, call_type, call_description, ivr_duration,customer_status,call_flow_id, call_flow_name) values ( :sme_id,  :startDateTime, :endDateTime, :insertDateTime, :duration, :longcode, :hlr, :masterShortcode, :smeIdentifier, :shortcodeMapping, :callDirectionStatus, :callDirection, :customerNumber, :agentNumber, :callRecordingStatus, :callRecordedFile, :voicemailRecordingStatus, :voicemailRecordingFile, :channelNo, :serverIpAddress, :cdrMode,:callMode, :agentGroup, :patchedAgentId, :answer, :provisionalFlag,  :disconnectedBy, :addressBookId, :remarks, :session_id, :merge_status,     :connectedDuration, :ringingDuration, :callType, :callDescription,:ivrDuration,:customerStatus, :callflowId, :callflowName)";
    } else if (where["callDirection"] == "OUTGOING") {
      Query =
        "INSERT INTO outbond_ivr_cdr (sme_id, start_date_time, end_date_time, insert_date_time, duration, longcode, hlr, master_shortcode, sme_identifier, shortcode_mapping,call_direction_status,   call_direction, calling_number, called_number, call_recording_status, call_recorded_file, voicemail_recording_status, voicemail_recording_file, channel_no, server_ip_address, cdr_mode, call_mode, agent_group, patched_agent_id, answer, address_book_id, remarks, session_id,merge_status,connected_duration,ringing_duration, call_type, call_description, ivr_duration,customer_status, disconnected_by) values (:sme_id,  :startDateTime, :endDateTime, :insertDateTime, :duration, :longcode, :hlr, :masterShortcode, :smeIdentifier, :shortcodeMapping, :callDirectionStatus, :callDirection, :agentNumber, :customerNumber, :callRecordingStatus, :callRecordedFile, :voicemailRecordingStatus, :voicemailRecordingFile, :channelNo, :serverIpAddress, :cdrMode, :callMode, :agentGroup, :patchedAgentId, :answer,   :addressBookId, :remarks,  :session_id, :merge_status,:connectedDuration, :ringingDuration, :callType, :callDescription, :ivrDuration,:customerStatus,  :disconnectedBy)";
    }

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        sme_id: where["sme_id"],
        lastInsertedId: payload["lastInsertedId"],
        startDateTime: where["startDateTime"],
        endDateTime: where["endDateTime"],
        insertDateTime: where["insertDateTime"],
        duration: where["duration"],
        longcode: where["longcode"],
        hlr: where["hlr"],
        masterShortcode: where["masterShortcode"],
        smeIdentifier: where["smeIdentifier"],
        shortcodeMapping: where["shortcodeMapping"],
        callDirectionStatus: where["callDirectionStatus"],
        callDirection: where["callDirection"],
        customerNumber: where["customerNumber"],
        agentNumber: where["agentNumber"],
        callRecordingStatus: where["callRecordingStatus"],
        callRecordedFile: where["callRecordedFile"],
        voicemailRecordingStatus: where["voicemailRecordingStatus"],
        voicemailRecordingFile: where["voicemailRecordingFile"],
        channelNo: where["channelNo"],
        serverIpAddress: where["serverIpAddress"],
        cdrMode: where["cdrMode"],
        callMode: where["callMode"],
        agentGroup: where["agentGroup"],
        session_id: where["session_id"],
        merge_status: where["merge_status"],
        answer: where["answer"],
        callStatus: where["callStatus"],
        disconnectedBy: where["disconnectedBy"],
        addressBookId: where["addressBookId"],
        remarks: where["remarks"],
        connectedDuration: where["connectedDuration"],
        ringingDuration: where["ringingDuration"],
        patchedAgentId: where["patchedAgentId"],
        callType: where["callType"],
        callDescription: where["callDescription"],
        ivrDuration: where["ivrDuration"],
        customerStatus: where["customerStatus"],
        callflowId: where["callflowId"],
        callflowName: where["callflowName"],
        provisionalFlag: where["provisionalFlag"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'InsertIncomingOutgoingCallCdr', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function CheckRecordExist(where: endCallCdrRequest, callback: any) {
  try {
    let Query = "SELECT id  FROM calling_cdr where session_id= :session_id";

    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { session_id: where["session_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'CheckRecordExist', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateEndCallCdr(where: any, callback: any) {
  try {
    let Query =
      "Update calling_cdr set sme_id=:sme_id,start_date_time =:startDateTime, end_date_time= :endDateTime,  duration=:duration, longcode=:longcode, hlr=:hlr, master_shortcode=:masterShortcode, sme_identifier=:smeIdentifier, shortcode_mapping=:shortcodeMapping, call_direction_status=:callDirectionStatus, call_direction=:callDirection, customer_number=:customerNumber, agent_number=:agentNumber, call_recording_status=:callRecordingStatus, call_recorded_file=:callRecordedFile, voicemail_recording_status=:voicemailRecordingStatus, voicemail_recording_file=:voicemailRecordingFile, channel_no=:channelNo, server_ip_address=:serverIpAddress, cdr_mode=:cdrMode, call_mode=:callMode, queue_name=:queue_name, patched_agent_id=:patchedAgentId, merge_status=:merge_status, answer=:answer, call_status=:callStatus, disconnected_by=:disconnectedBy, address_book_id=:addressBookId, remarks=:remarks, connected_duration=:connectedDuration, ringing_duration=:ringingDuration, call_type=:callType, call_description=:callDescription,ivr_duration=:ivrDuration, customer_status=:customerStatus, final_status=:finalStatus, call_flow_id=:callflowId, call_flow_name=:callflowName, dtmf=:finalDTMF,  did=:did where session_id=:session_id limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        sme_id: where["sme_id"],
        startDateTime: where["startDateTime"],
        endDateTime: where["endDateTime"],
        duration: where["duration"],
        longcode: where["longcode"],
        hlr: where["hlr"],
        masterShortcode: where["masterShortcode"],
        smeIdentifier: where["smeIdentifier"],
        shortcodeMapping: where["shortcodeMapping"],
        callDirectionStatus: where["callDirectionStatus"],
        callDirection: where["callDirection"],
        customerNumber: where["customerNumber"],
        agentNumber: where["agentNumber"],
        callRecordingStatus: where["callRecordingStatus"],
        callRecordedFile: where["callRecordedFile"],
        voicemailRecordingStatus: where["voicemailRecordingStatus"],
        voicemailRecordingFile: where["voicemailRecordingFile"],
        channelNo: where["channelNo"],
        serverIpAddress: where["serverIpAddress"],
        cdrMode: where["cdrMode"],
        callMode: where["callMode"],
        agentGroup: where["agentGroup"],
        queue_name: where["queue_name"],
        session_id: where["session_id"],
        merge_status: where["merge_status"],
        answer: where["answer"],
        callStatus: where["callStatus"],
        disconnectedBy: where["disconnectedBy"],
        addressBookId: where["addressBookId"],
        remarks: where["remarks"],
        connectedDuration: where["connectedDuration"],
        ringingDuration: where["ringingDuration"],
        patchedAgentId: where["patchedAgentId"],
        callType: where["callType"],
        callDescription: where["callDescription"],
        ivrDuration: where["ivrDuration"],
        customerStatus: where["customerStatus"],
        finalStatus: where["finalStatus"],
        callflowId: where["callflowId"],
        callflowName: where["callflowName"],
        finalDTMF: where["finalDTMF"],
        did: where["did"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateEndCallCdr', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function CheckRecordInoutCdr(where: any, callback: any) {
  try {
    let Query = "";
    if (where["callDirection"] == "INCOMING") {
      Query = "SELECT id  FROM incoming_ivr_call_cdr where session_id= :session_id";
    } else if (where["callDirection"] == "OUTGOING") {
      Query = "SELECT  id FROM outbond_ivr_cdr where session_id= :session_id";
    }

    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { session_id: where["session_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'CheckRecordInoutCdr', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function GetLastCallStatistics(where: any, callback: any) {
  try {
    let Query = "";
    // Query =
    //     "SELECT  id, service_id, mou, revenue, total_calls, date_time, insert_time, update_time, unique_calls FROM revenue_details where  date(date_time) = date(:startDateTime) and service_id in ('1','2','15','16','25','26') and sme_id =:sme_id";

    if ( (where["callDirection"] == "INCOMING") &&  (where["callType"] == "3") ){
      // Incoming failed call
      glogger('DEB', "0", 'GetLastCallStatistics', "voicemail from revenue table");
      Query =
      "SELECT  id, service_id, mou, revenue, total_calls, date_time, insert_time, update_time, unique_calls FROM revenue_details where  date(date_time) = date(:startDateTime) and service_id in ('11') and sme_id =:sme_id";

    }else if ( (where["callDirection"] == "INCOMING") &&  (where["callStatus"] == "1") ){
      // Incoming failed call
      glogger('DEB', "0", 'GetLastCallStatistics', "Incoming failed call");
      Query =
      "SELECT  id, service_id, mou, revenue, total_calls, date_time, insert_time, update_time, unique_calls FROM revenue_details where  date(date_time) = date(:startDateTime) and service_id in ('1','15') and sme_id =:sme_id";

    }
     else if ( (where["callDirection"] == "INCOMING") &&  (where["callStatus"] == "0") ){    
      // incoming success call
      glogger('DEB', "0", 'GetLastCallStatistics', "Incoming success call");
      Query =
      "SELECT  id, service_id, mou, revenue, total_calls, date_time, insert_time, update_time, unique_calls FROM revenue_details where  date(date_time) = date(:startDateTime) and service_id in ('1','16') and sme_id =:sme_id";

    } else if ( (where["callDirection"] == "OUTGOING") &&  (where["answer"] == "1") ){    
      // outgoing failed call
      glogger('DEB', "0", 'GetLastCallStatistics', " outgoing failed call");
      Query =
      "SELECT  id, service_id, mou, revenue, total_calls, date_time, insert_time, update_time, unique_calls FROM revenue_details where date(date_time) = date(:startDateTime) and service_id in ('2','25') and sme_id =:sme_id";

    } else if ( (where["callDirection"] == "OUTGOING") &&  (where["answer"] == "2") ){    
      // outgoing success call
      glogger('DEB', "0", 'GetLastCallStatistics', "outgoing success call");
      Query =
      "SELECT  id, service_id, mou, revenue, total_calls, date_time, insert_time, update_time, unique_calls FROM revenue_details where  date(date_time) = date(:startDateTime) and service_id in ('2','26') and sme_id =:sme_id";
    } else {
      glogger('DEB', "0", 'GetLastCallStatistics', "else ?");
    }

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        sme_id: where["sme_id"],
        startDateTime: where["startDateTime"],
        endDateTime: where["endDateTime"],
       
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'GetLastCallStatistics', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateOutTotalStatistics(where: any, callback: any) {
  try {
    let Query = "";
    let QueryType;
    if (where["outgoingFailedCalls"] > 0){
      //lets insert
      QueryType = QueryTypes.UPDATE;
      Query =
        "UPDATE  revenue_details set total_calls=total_calls+1 where  service_id=2 and  date(date_time) = date(:insertDateTime) limit 1";
    } else {
      QueryType = QueryTypes.INSERT;
      Query =
      "INSERT INTO revenue_details (sme_id, service_id, mou, revenue , total_calls, date_time, insert_time) VALUES (:sme_id ,2, 0,0, 1, :insertDateTime, :insertDateTime )";
    }

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryType,
      replacements: {
        sme_id: where["sme_id"],
        incomingTotalCalls: where["incomingTotalCalls"],
        incomingFailedCalls: where["incomingFailedCalls"],
        incomingSuccessCalls: where["incomingSuccessCalls"],
        outgoingTotalCalls: where["outgoingTotalCalls"],
        outgoingFailedCalls: where["outgoingFailedCalls"],
        outgoingSuccessCalls: where["outgoingSuccessCalls"],
        insertDateTime: where["insertDateTime"],
        
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateOutTotalStatistics', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function InsertUpdateTotalCallStatistics(where: any, callback: any) {
  try {
    let Query = "";
    let QueryType;

    if ((where["callDirection"] == "INCOMING") && (where["service_id_total"] == 11)) {

      if (where["voicemailCalls"] > 0){
        //lets insert
        QueryType = QueryTypes.UPDATE;
        Query =
          "UPDATE  revenue_details set total_calls=total_calls+1 where  service_id=11 and  date(date_time) = date(:insertDateTime) and sme_id =:sme_id limit 1";
      } else {
        QueryType = QueryTypes.INSERT;
        Query =
        "INSERT INTO revenue_details (sme_id, service_id, mou, revenue , total_calls, date_time, insert_time) VALUES (:sme_id ,11, 0,0, 1, :insertDateTime, :insertDateTime )";
      }

    }
    else if ((where["callDirection"] == "INCOMING") && (where["service_id_total"] == 1)) {

      if (where["incomingTotalCalls"] > 0){
        //lets insert
        QueryType = QueryTypes.UPDATE;
        Query =
          "UPDATE  revenue_details set total_calls=total_calls+1 where  service_id=1 and  date(date_time) = date(:insertDateTime) and sme_id =:sme_id limit 1";
      } else {
        QueryType = QueryTypes.INSERT;
        Query =
        "INSERT INTO revenue_details (sme_id, service_id, mou, revenue , total_calls, date_time, insert_time) VALUES (:sme_id ,1, 0,0, 1, :insertDateTime, :insertDateTime )";
      }

    } else if ((where["callDirection"] == "OUTGOING") && (where["service_id_total"] == 2)){    
      // incoming success call
      if (where["outgoingTotalCalls"] > 0){
        //lets insert
        QueryType = QueryTypes.UPDATE;
        Query =
          "UPDATE  revenue_details set total_calls=total_calls+1 where  service_id=2 and  date(date_time) = date(:insertDateTime) and sme_id =:sme_id limit 1";
      } else {
        QueryType = QueryTypes.INSERT;
        Query =
        "INSERT INTO revenue_details (sme_id, service_id, mou, revenue , total_calls, date_time, insert_time) VALUES (:sme_id ,2, 0,0, 1, :insertDateTime, :insertDateTime )";
      }


    } else {

      glogger('DEB', "0", 'InsertUpdateTotalCallStatistics', "Invalid Case:" + Query);
      console.log("==========callDirection=========");
      console.log(where["callDirection"]);
      console.log("==========service_id_total=========");
      console.log(where["service_id_total"]);

    }

    glogger('DEB', "0", 'InsertUpdateTotalCallStatistics', "Query:" + Query);

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryType,
      replacements: {
        sme_id: where["sme_id"],
        incomingTotalCalls: where["incomingTotalCalls"],
        incomingFailedCalls: where["incomingFailedCalls"],
        incomingSuccessCalls: where["incomingSuccessCalls"],
        outgoingTotalCalls: where["outgoingTotalCalls"],
        outgoingFailedCalls: where["outgoingFailedCalls"],
        outgoingSuccessCalls: where["outgoingSuccessCalls"],
        insertDateTime: where["insertDateTime"],
        service_id_total: where["service_id_total"],
        service_id_sub_total: where["service_id_sub_total"],
        
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'InsertUpdateTotalCallStatistics', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}
export async function InsertUpdateOthersCallStatistics(where: any, callback: any) {
  try {
    let Query = "";
    let QueryType;
    if ((where["callDirection"] == "INCOMING") && (where["service_id_sub_total"] == 15)) {

      if (where["incomingFailedCalls"] > 0){
        //lets insert
        QueryType = QueryTypes.UPDATE;
        Query =
          "UPDATE  revenue_details set total_calls=total_calls+1 where  service_id=:service_id_sub_total and  date(date_time) = date(:insertDateTime) and sme_id =:sme_id limit 1";
      } else {
        QueryType = QueryTypes.INSERT;
        Query =
        "INSERT INTO revenue_details (sme_id, service_id, mou, revenue , total_calls, date_time, insert_time) VALUES (:sme_id ,:service_id_sub_total, 0,0, 1, :insertDateTime, :insertDateTime )";
      }

    } else if ((where["callDirection"] == "INCOMING") && (where["service_id_sub_total"] == 16)){    
      // incoming success call
      if (where["incomingSuccessCalls"] > 0){
        //lets insert
        QueryType = QueryTypes.UPDATE;
        Query =
          "UPDATE  revenue_details set total_calls=total_calls+1 where  service_id=:service_id_sub_total and  date(date_time) = date(:insertDateTime) and sme_id =:sme_id limit 1";
      } else {
        QueryType = QueryTypes.INSERT;
        Query =
        "INSERT INTO revenue_details (sme_id, service_id, mou, revenue , total_calls, date_time, insert_time) VALUES (:sme_id ,:service_id_sub_total, 0,0, 1, :insertDateTime, :insertDateTime )";
      }


    } else if ((where["callDirection"] == "OUTGOING") && (where["service_id_sub_total"] == 25)){    
      // incoming success call
      if (where["outgoingFailedCalls"] > 0){
        //lets insert
        QueryType = QueryTypes.UPDATE;
        Query =
          "UPDATE  revenue_details set total_calls=total_calls+1 where  service_id=:service_id_sub_total and  date(date_time) = date(:insertDateTime) and sme_id =:sme_id limit 1";
      } else {
        QueryType = QueryTypes.INSERT;
        Query =
        "INSERT INTO revenue_details (sme_id, service_id, mou, revenue , total_calls, date_time, insert_time) VALUES (:sme_id ,:service_id_sub_total, 0,0, 1, :insertDateTime, :insertDateTime )";
      }


    } else if ((where["callDirection"] == "OUTGOING") && (where["service_id_sub_total"] == 26)){    
      // incoming success call
      if (where["outgoingSuccessCalls"] > 0){
        //lets insert
        QueryType = QueryTypes.UPDATE;
        Query =
          "UPDATE  revenue_details set total_calls=total_calls+1 where  service_id=:service_id_sub_total and  date(date_time) = date(:insertDateTime) and sme_id =:sme_id limit 1";
      } else {
        QueryType = QueryTypes.INSERT;
        Query =
        "INSERT INTO revenue_details (sme_id, service_id, mou, revenue , total_calls, date_time, insert_time) VALUES (:sme_id ,:service_id_sub_total, 0,0, 1, :insertDateTime, :insertDateTime )";
      }


    }


    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryType,
      replacements: {
        sme_id: where["sme_id"],
        incomingTotalCalls: where["incomingTotalCalls"],
        incomingFailedCalls: where["incomingFailedCalls"],
        incomingSuccessCalls: where["incomingSuccessCalls"],
        outgoingTotalCalls: where["outgoingTotalCalls"],
        outgoingFailedCalls: where["outgoingFailedCalls"],
        outgoingSuccessCalls: where["outgoingSuccessCalls"],
        insertDateTime: where["insertDateTime"],
        service_id_total: where["service_id_total"],
        service_id_sub_total: where["service_id_sub_total"],
        
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'InsertUpdateOthersCallStatistics', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateOutSuccessStatistics(where: any, callback: any) {
  try {
    let Query = "";
    let QueryType;
    if (where["outgoingFailedCalls"] > 0){
      //lets insert
      QueryType = QueryTypes.UPDATE;
      Query =
        "UPDATE  revenue_details set total_calls=total_calls+1 where  service_id=25 and  date(date_time) = date(:insertDateTime) limit 1";
    } else {
      QueryType = QueryTypes.INSERT;
      Query =
      "INSERT INTO revenue_details (sme_id, service_id, mou, revenue , total_calls, date_time, insert_time) VALUES (:sme_id ,25, 0,0, 1, :insertDateTime, :insertDateTime )";
    }

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryType,
      replacements: {
        sme_id: where["sme_id"],
        incomingTotalCalls: where["incomingTotalCalls"],
        incomingFailedCalls: where["incomingFailedCalls"],
        incomingSuccessCalls: where["incomingSuccessCalls"],
        outgoingTotalCalls: where["outgoingTotalCalls"],
        outgoingFailedCalls: where["outgoingFailedCalls"],
        outgoingSuccessCalls: where["outgoingSuccessCalls"],
        insertDateTime: where["insertDateTime"],
        
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateOutSuccessStatistics', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateOutFailedStatistics(where: any, callback: any) {
  try {
    let Query = "";
    let QueryType;
    if (where["outgoingFailedCalls"] > 0){
      //lets insert
      QueryType = QueryTypes.UPDATE;
      Query =
        "UPDATE  revenue_details set total_calls=total_calls+1 where  service_id=25 and  date(date_time) = date(:insertDateTime) limit 1";
    } else {
      QueryType = QueryTypes.INSERT;
      Query =
      "INSERT INTO revenue_details (sme_id, service_id, mou, revenue , total_calls, date_time, insert_time) VALUES (:sme_id ,25, 0,0, 1, :insertDateTime, :insertDateTime )";
    }

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryType,
      replacements: {
        sme_id: where["sme_id"],
        incomingTotalCalls: where["incomingTotalCalls"],
        incomingFailedCalls: where["incomingFailedCalls"],
        incomingSuccessCalls: where["incomingSuccessCalls"],
        outgoingTotalCalls: where["outgoingTotalCalls"],
        outgoingFailedCalls: where["outgoingFailedCalls"],
        outgoingSuccessCalls: where["outgoingSuccessCalls"],
        insertDateTime: where["insertDateTime"],
        
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateOutFailedStatistics', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateInSuccessStatistics(where: any, callback: any) {
  try {
    let Query = "";
    let QueryType;
    if (where["incomingSuccessCalls"].length > 0){
      //lets insert
      QueryType = QueryTypes.UPDATE;
      Query =
        "UPDATE  revenue_details set total_calls=total_calls+1 where  service_id=16 and  date(date_time) = date(:insertDateTime) limit 1";
    } else {
      QueryType = QueryTypes.INSERT;
      Query =
      "INSERT INTO revenue_details (sme_id, service_id, total_calls, date_time, insert_time) VALUES (:sme_id, 16, 1, :insertDateTime, :insertDateTime )";
    }

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryType,
      replacements: {
        sme_id: where["sme_id"],
        incomingTotalCalls: where["incomingTotalCalls"],
        incomingFailedCalls: where["incomingFailedCalls"],
        incomingSuccessCalls: where["incomingSuccessCalls"],
        outgoingTotalCalls: where["outgoingTotalCalls"],
        outgoingFailedCalls: where["outgoingFailedCalls"],
        outgoingSuccessCalls: where["outgoingSuccessCalls"],
        insertDateTime: where["insertDateTime"],
        
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateInSuccessStatistics', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateInTotalStatistics(where: any, callback: any) {
  try {
    let Query = "";
    let QueryType;
    if (where["incomingSuccessCalls"].length > 0){
      //lets insert
      QueryType = QueryTypes.UPDATE;
      Query =
        "UPDATE  revenue_details set total_calls=total_calls+1 where  service_id=1 and  date(date_time) = date(:insertDateTime) limit 1";
    } else {
      QueryType = QueryTypes.INSERT;
      Query =
      "INSERT INTO revenue_details (sme_id, service_id, total_calls, date_time, insert_time) VALUES (:sme_id, 1, 1, :insertDateTime, :insertDateTime )";
    }

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryType,
      replacements: {
        sme_id: where["sme_id"],
        incomingTotalCalls: where["incomingTotalCalls"],
        incomingFailedCalls: where["incomingFailedCalls"],
        incomingSuccessCalls: where["incomingSuccessCalls"],
        outgoingTotalCalls: where["outgoingTotalCalls"],
        outgoingFailedCalls: where["outgoingFailedCalls"],
        outgoingSuccessCalls: where["outgoingSuccessCalls"],
        insertDateTime: where["insertDateTime"],
        
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateInTotalStatistics', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateCallStatistics(where: any, callback: any) {
  try {
    let Query = "";
    if ( (where["callDirection"] == "INCOMING") &&  (where["callStatus"] == "1") ){
      // Incoming failed call
      Query =
        "UPDATE  incoming_ivr_call_cdr set sme_id=:sme_id, start_date_time=:startDateTime, end_date_time=:endDateTime, duration=:duration, longcode=:longcode, hlr=:hlr, master_shortcode=:masterShortcode, sme_identifier=:smeIdentifier, shortcode_mapping=:shortcodeMapping,call_direction_status=:callDirectionStatus,   call_direction=:callDirection, calling_number=:customerNumber, called_number=:agentNumber, call_recording_status=:callRecordingStatus, call_recorded_file=:callRecordedFile, voicemail_recording_status=:voicemailRecordingStatus, voicemail_recording_file=:voicemailRecordingFile, channel_no=:channelNo, server_ip_address=:serverIpAddress, cdr_mode=:cdrMode, call_mode=:callMode, agent_group=:agentGroup, patched_agent_id=:patchedAgentId, answer=:answer, call_status=:callStatus, disconnected_by=:disconnectedBy, address_book_id=:addressBookId, remarks=:remarks,merge_status=:merge_status,connected_duration=:connectedDuration,ringing_duration=:ringingDuration, call_type=:callType, call_description=:callDescription, ivr_duration=:ivrDuration,customer_status=:customerStatus, call_flow_id =:callflowId, call_flow_name =:callflowName where  session_id=:session_id limit 1";

    } else if ( (where["callDirection"] == "INCOMING") &&  (where["callStatus"] == "0") ){    
      // incoming success call

    } else if ( (where["callDirection"] == "OUTGOING") &&  (where["answer"] == "1") ){    
      // outgoing failed call


    } else if ( (where["callDirection"] == "OUTGOING") &&  (where["answer"] == "2") ){    
      // outgoing success call


    } else if (where["callDirection"] == "OUTGOING") {
      Query =
        "UPDATE outbond_ivr_cdr set sme_id=:sme_id, start_date_time=:startDateTime, end_date_time=:endDateTime, duration=:duration, longcode=:longcode, hlr=:hlr, master_shortcode=:masterShortcode, sme_identifier=:smeIdentifier, shortcode_mapping=:shortcodeMapping,call_direction_status=:callDirectionStatus,   call_direction=:callDirection, calling_number=:agentNumber, called_number=:customerNumber, call_recording_status=:callRecordingStatus,       disconnected_by=:disconnectedBy,call_recorded_file=:callRecordedFile, voicemail_recording_status=:voicemailRecordingStatus, voicemail_recording_file=:voicemailRecordingFile, channel_no=:channelNo, server_ip_address=:serverIpAddress, cdr_mode=:cdrMode, call_mode=:callMode,agent_group=:agentGroup, patched_agent_id=:patchedAgentId, answer=:answer, address_book_id=:addressBookId, remarks=:remarks,merge_status=:merge_status,connected_duration=:connectedDuration,ringing_duration=:ringingDuration, call_type=:callType, call_description=:callDescription, ivr_duration=:ivrDuration,customer_status=:customerStatus where session_id=:session_id limit 1";
    }

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        sme_id: where["sme_id"],
        startDateTime: where["startDateTime"],
        endDateTime: where["endDateTime"],
        duration: where["duration"],
        longcode: where["longcode"],
        hlr: where["hlr"],
        masterShortcode: where["masterShortcode"],
        smeIdentifier: where["smeIdentifier"],
        shortcodeMapping: where["shortcodeMapping"],
        callDirectionStatus: where["callDirectionStatus"],
        callDirection: where["callDirection"],
        customerNumber: where["customerNumber"],
        agentNumber: where["agentNumber"],
        callRecordingStatus: where["callRecordingStatus"],
        callRecordedFile: where["callRecordedFile"],
        voicemailRecordingStatus: where["voicemailRecordingStatus"],
        voicemailRecordingFile: where["voicemailRecordingFile"],
        channelNo: where["channelNo"],
        serverIpAddress: where["serverIpAddress"],
        cdrMode: where["cdrMode"],
        callMode: where["callMode"],
        agentGroup: where["agentGroup"],
        session_id: where["session_id"],
        merge_status: where["merge_status"],
        answer: where["answer"],
        callStatus: where["callStatus"],
        disconnectedBy: where["disconnectedBy"],
        addressBookId: where["addressBookId"],
        remarks: where["remarks"],
        connectedDuration: where["connectedDuration"],
        ringingDuration: where["ringingDuration"],
        patchedAgentId: where["patchedAgentId"],
        callType: where["callType"],
        callDescription: where["callDescription"],
        ivrDuration: where["ivrDuration"],
        customerStatus: where["customerStatus"],
        callflowId: where["callflowId"],
        callflowName: where["callflowName"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateIncomingOutgoingCallCdr', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function  UpdateIncomingOutgoingCallCdr(where: any, callback: any) {
  try {
    let Query = "";
    if (where["callDirection"] == "INCOMING") {
      Query =
        "UPDATE  incoming_ivr_call_cdr set sme_id=:sme_id, start_date_time=:startDateTime, end_date_time=:endDateTime, duration=:duration, longcode=:longcode, hlr=:hlr, master_shortcode=:masterShortcode, sme_identifier=:smeIdentifier, shortcode_mapping=:shortcodeMapping,call_direction_status=:callDirectionStatus,   call_direction=:callDirection, calling_number=:customerNumber, called_number=:agentNumber, call_recording_status=:callRecordingStatus, call_recorded_file=:callRecordedFile, voicemail_recording_status=:voicemailRecordingStatus, voicemail_recording_file=:voicemailRecordingFile, channel_no=:channelNo, server_ip_address=:serverIpAddress, cdr_mode=:cdrMode, call_mode=:callMode, agent_group=:agentGroup, patched_agent_id=:patchedAgentId, answer=:answer, call_status=:callStatus, disconnected_by=:disconnectedBy, address_book_id=:addressBookId, remarks=:remarks,merge_status=:merge_status,connected_duration=:connectedDuration,ringing_duration=:ringingDuration, call_type=:callType, call_description=:callDescription, ivr_duration=:ivrDuration,customer_status=:customerStatus, call_flow_id =:callflowId, call_flow_name =:callflowName, dtmf=:finalDTMF where  session_id=:session_id limit 1";
    } else if (where["callDirection"] == "OUTGOING") {
      Query =
        "UPDATE outbond_ivr_cdr set sme_id=:sme_id, start_date_time=:startDateTime, end_date_time=:endDateTime, duration=:duration, longcode=:longcode, hlr=:hlr, master_shortcode=:masterShortcode, sme_identifier=:smeIdentifier, shortcode_mapping=:shortcodeMapping,call_direction_status=:callDirectionStatus,   call_direction=:callDirection, calling_number=:agentNumber, called_number=:customerNumber, call_recording_status=:callRecordingStatus,       disconnected_by=:disconnectedBy,call_recorded_file=:callRecordedFile, voicemail_recording_status=:voicemailRecordingStatus, voicemail_recording_file=:voicemailRecordingFile, channel_no=:channelNo, server_ip_address=:serverIpAddress, cdr_mode=:cdrMode, call_mode=:callMode,agent_group=:agentGroup, patched_agent_id=:patchedAgentId, answer=:answer, address_book_id=:addressBookId, remarks=:remarks,merge_status=:merge_status,connected_duration=:connectedDuration,ringing_duration=:ringingDuration, call_type=:callType, call_description=:callDescription, ivr_duration=:ivrDuration,customer_status=:customerStatus where session_id=:session_id limit 1";
    }

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        sme_id: where["sme_id"],
        startDateTime: where["startDateTime"],
        endDateTime: where["endDateTime"],
        duration: where["duration"],
        longcode: where["longcode"],
        hlr: where["hlr"],
        masterShortcode: where["masterShortcode"],
        smeIdentifier: where["smeIdentifier"],
        shortcodeMapping: where["shortcodeMapping"],
        callDirectionStatus: where["callDirectionStatus"],
        callDirection: where["callDirection"],
        customerNumber: where["customerNumber"],
        agentNumber: where["agentNumber"],
        callRecordingStatus: where["callRecordingStatus"],
        callRecordedFile: where["callRecordedFile"],
        voicemailRecordingStatus: where["voicemailRecordingStatus"],
        voicemailRecordingFile: where["voicemailRecordingFile"],
        channelNo: where["channelNo"],
        serverIpAddress: where["serverIpAddress"],
        cdrMode: where["cdrMode"],
        callMode: where["callMode"],
        agentGroup: where["agentGroup"],
        session_id: where["session_id"],
        merge_status: where["merge_status"],
        answer: where["answer"],
        callStatus: where["callStatus"],
        disconnectedBy: where["disconnectedBy"],
        addressBookId: where["addressBookId"],
        remarks: where["remarks"],
        connectedDuration: where["connectedDuration"],
        ringingDuration: where["ringingDuration"],
        patchedAgentId: where["patchedAgentId"],
        callType: where["callType"],
        callDescription: where["callDescription"],
        ivrDuration: where["ivrDuration"],
        customerStatus: where["customerStatus"],
        callflowId: where["callflowId"],
        callflowName: where["callflowName"],
        finalDTMF: where["finalDTMF"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateIncomingOutgoingCallCdr', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}



export async function getRecordingStatistics(where: any, callback: any) {
  try {
    let Query = "";
    // Query =
    //     "SELECT  id, service_id, mou, revenue, total_calls, date_time, insert_time, update_time, unique_calls FROM revenue_details where  date(date_time) = date(:startDateTime) and service_id in ('1','2','15','16','25','26') and sme_id =:sme_id";

    
      glogger('DEB', "0", 'GetRecordingStatistics', "recording Statistics");
      Query =
      "SELECT  id, service_id, mou, revenue, total_calls, date_time, insert_time, update_time, unique_calls FROM revenue_details where  date(date_time) = date(:getCurrentDate) and service_id in ('3') and sme_id =:sme_id";
  
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        sme_id: where["sme_id"],
        getCurrentDate: where["getCurrentDate"],
       
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'GetRecordingStatistics', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}



export async function InsertUpdateToRecordingCallStatistics(where: any, callback: any) {
  try {
    let Query = "";
    let QueryType;

      if (where["totalRecordings"] > 0){
        //lets insert
        QueryType = QueryTypes.UPDATE;
        Query =
          "UPDATE  revenue_details set total_calls=total_calls+1 where  service_id=3 and  date(date_time) = date(:insertDateTime) and sme_id =:sme_id limit 1";
      } else {
        QueryType = QueryTypes.INSERT;
        Query =
        "INSERT INTO revenue_details (sme_id, service_id, mou, revenue , total_calls, date_time, insert_time) VALUES (:sme_id ,3, 0,0, 1, :insertDateTime, :insertDateTime )";
      }


    glogger('DEB', "0", 'InsertUpdateToRecordingCallStatistics', "Query:" + Query);

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryType,
      replacements: {
        sme_id: where["sme_id"],
        totalRecordings: where["totalRecordings"],
        insertDateTime: where["insertDateTime"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'InsertUpdateToRecordingCallStatistics', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}



export async function checkUniqueCallsRecords(where: any, callback: any) {
  try {
    let Query =
      "SELECT IFNULL(ucd.id,0) AS record_id, IFNULL(ucd.total_incoming_calls,0) AS total_incoming_calls,IFNULL(ucd.total_outgoing_calls,0) AS total_outgoing_calls, sp.default_lead_sticky, ucd.assigned_agent_id FROM unique_customer_detail AS ucd LEFT JOIN sme_profile AS sp ON ucd.sme_id=sp.id WHERE SUBSTRING(TRIM(ucd.customer_number), -10)= SUBSTRING(:customerNumber, -10) AND ucd.sme_id =:sme_id LIMIT 1 ";
    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], customerNumber: where["customerNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'checkUniqueCallsRecords', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateUniqueCalls(where: any, payload: any, callback: any) {
  try {
    if (where["callDirection"] == "INCOMING") {
      if (where["callanswerFlag"] == "2") {
        //failed incoming handling
        where["callanswerFlag"] = "2";
      } else {
        where["callanswerFlag"] = "1";
      }
    } else if (where["callDirection"] == "OUTGOING") {
      if (where["callanswerFlag"] == "1") {
        //failed outgoing handling
        where["callanswerFlag"] = "2";
      } else {
        where["callanswerFlag"] = "1";
      }
    }
    let freq_tmp="";
    if(where["provisionalFlag"] == 3){

      freq_tmp = " ,frequency = frequency+1"
    }

    var incoming_call_count_temp;
    var outgoing_call_count_temp;
    if (where["callDirection"] == "INCOMING") {
      incoming_call_count_temp = payload["total_incoming_calls"] + 1;
      outgoing_call_count_temp = payload["total_outgoing_calls"];
    } else {
      incoming_call_count_temp = payload["total_incoming_calls"];
      outgoing_call_count_temp = payload["total_outgoing_calls"] + 1;
    }

    let leadSticky ='';
    if (payload["default_lead_sticky"] != 0 && (payload["assigned_agent_id"] == 0 || payload["assigned_agent_id"] == 1 || payload["assigned_agent_id"] == 2)) {
        leadSticky = " ,sticky_type ="+ payload['default_lead_sticky']+", assigned_agent_id="+where["callpatchedAgentId"];
    }

    let Query =
      "update unique_customer_detail set recent_duration = :callDuration, recent_via_longcode = :calllongcode, call_type =:callDirection ,server_ip_address = :ip ,  recent_patched_agent_id=:callpatchedAgentId, answer=:callanswerFlag, total_incoming_calls = " +
      incoming_call_count_temp +
      ", total_outgoing_calls=" +
      outgoing_call_count_temp +
      ", update_date_time=:callstartDateTime, call_mode=:callMode "+freq_tmp+ leadSticky+" WHERE sme_id =:sme_id and id=:record_id limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        sme_id: where["sme_id"],
        callDuration: where["callDuration"],
        calllongcode: where["calllongcode"],
        callDirection: where["callDirection"],
        ip: where["ip"],
        callpatchedAgentId: where["callpatchedAgentId"],
        callanswerFlag: where["callanswerFlag"],
        record_id: payload["record_id"],
        callstartDateTime: where["callstartDateTime"],
        callMode: where["callMode"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateUniqueCalls', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function AddUniqueCalls(where: any, payload: any, callback: any) {
  try {
    var incoming_call_count_temp = 0;
    var outgoing_call_count_temp = 0;
    var stickyType = 0;
    var assignedAgentId = 0;
    if (where["callDirection"] == "INCOMING") {
      if (where["callanswerFlag"] == "2") {
        //failed incoming handling
        where["callanswerFlag"] = "2";
      } else {
        where["callanswerFlag"] = "1";
      }
    }
    if (where["callDirection"] == "INCOMING") {
      incoming_call_count_temp = 1;
    } else {
      outgoing_call_count_temp = 1;
    }

    if (payload["default_lead_sticky"] != 0) {
      stickyType = payload["default_lead_sticky"];
      assignedAgentId = where["callpatchedAgentId"];
    }

    let Query =
      "INSERT INTO unique_customer_detail (sme_id,recent_duration, recent_via_longcode, call_type,customer_number, server_ip_address, recent_patched_agent_id, answer, address_book_id, recent_remarks,total_incoming_calls, total_outgoing_calls, lead_type, lead_status, city_id, product_id, product_price, assigned_agent_id, insert_date_time,update_date_time, call_mode,frequency, sticky_type) VALUES(:sme_id,:callDuration, :calllongcode, :callDirection,:customerNumber, :ip, :callpatchedAgentId, :provisionalFlag, :addressBookId,0, " +
      incoming_call_count_temp +
      ",  " +
      outgoing_call_count_temp +
      ", 'New',0,0,0,0,"+assignedAgentId+",:insertDateTime,:callstartDateTime,:callMode,1,"+stickyType+")";


    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        sme_id: where["sme_id"],
        callDuration: where["callDuration"],
        calllongcode: where["calllongcode"],
        callDirection: where["callDirection"],
        customerNumber: where["customerNumber"],
        ip: where["ip"],
        callpatchedAgentId: where["callpatchedAgentId"],
        callanswerFlag: where["callanswerFlag"],
        addressBookId: where["addressBookId"],
        insertDateTime: where["insertDateTime"],
        callMode: where["callMode"],
        provisionalFlag: where["provisionalFlag"],
        callstartDateTime: where["callstartDateTime"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'AddUniqueCalls', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function AddBlacklistIvrCalls(where: any, callback: any) {
  try {
    let Query =
      "INSERT INTO blacklist_ivr_calls (sme_id, longcode, customer_number, start_date, session_id,insert_date_time) VALUES (:sme_id, :longcode, :customer_number, :start_date, :session_id, :insertDateTime )";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        sme_id: where["sme_id"],
        longcode: where["longcode"],
        customer_number: where["customer_number"],
        start_date: where["start_date"],
        session_id: where["session_id"],
        insertDateTime: where["insertDateTime"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'AddBlacklistIvrCalls', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getKeepAlive(where: any, callback: any) {
  try {
    let Query = "SELECT count(*) FROM sme_profile";
    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { start_date: where["start_date"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'getKeepAlive', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindblacklistIvrCalls(where: any, callback: any) {
  try {
    let Query =
      "SELECT id, sme_id,customer_number,blacklist_status,created_by,inserted_date_time,updated_date_time from black_white_list WHERE sme_id  =:sme_id and SUBSTRING(TRIM(customer_number), -10) = SUBSTRING(:callingNumber, -10) and blacklist_status = 1";
    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], callingNumber: where["callingNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindblacklistIvrCalls', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindclicktoCall(where: any, payload: any, callback: any) {
  try {
    let Query =
      "SELECT call_schedule_id, session_id, virtual_number, to_no, from_no, sme_id, media_file_flag, media_file_id, name_file_flag, name_file_id, group_name, agent_number, custom_dtmf_flag, custom_dtmf, time_limit, recording_flag, call_mode, base_id  FROM click2call_schedule WHERE STATUS =0 and (call_mode = 2 or call_mode = 4) and agent_number = :agentNumber and sme_id = :smeId and virtual_number = :virtualNumber and (DATE_ADD(scheduled_date, INTERVAL 10 MINUTE) > :currentDate AND DATE_ADD(scheduled_date, INTERVAL -10 MINUTE) < :currentDate) ORDER BY scheduled_date DESC LIMIT 1";
    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agentNumber: where["agentNumber"], smeId: where["smeId"], virtualNumber: where["virtualNumber"], currentDate: where["agentNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindclicktoCall', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateclicktoCall(where: any, payload: any, callback: any) {
  try {
    let Query = "UPDATE click2call_schedule SET STATUS =1 WHERE sme_id = :smeId AND call_schedule_id = :call_schedule_id AND STATUS = 0 limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { call_schedule_id: payload["call_schedule_id"], smeId: where["smeId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateclicktoCall', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateclicktoCallbase(where: any, payload: any, callback: any) {
  try {
    let Query = "update call_scheduler_base set call_counter='1' where base_id = :base_id and sme_id =:smeId limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { base_id: payload["base_id"], smeId: where["smeId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateclicktoCallbase', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindAgentFullDetails(where: any, callback: any) {
  try {
    let Query =
      "SELECT ad.*, agd.group_name,agd.group_id,agd.group_status,sm.recording FROM agent_details ad LEFT JOIN agent_group_mapping AS ag ON ad.agent_id = ag.agent_id LEFT JOIN agent_group_detail AS agd ON agd.group_id = ag.group_id LEFT JOIN sme_profile AS sm ON ad.sme_id = sm.id  WHERE ad.sme_id  =:sme_id and SUBSTRING(TRIM(ad.agent_mobile), -10)=SUBSTRING(:agentNumber, -10)  and ad.status !=-9 Limit 1";

    console.log(where);
    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], agentNumber: where["agentNumber"] },
    });
    console.log(executeQuery);
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindAgentFullDetails', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}
export async function FindAutoDialedNo(where: any, callback: any) {
  try {

    let Query ="";
      /*let Query =
      "SELECT call_schedule_id, session_id, virtual_number, to_no, from_no, sme_id, media_file_flag, media_file_id, name_file_flag, name_file_id, group_name, agent_number, custom_dtmf_flag, custom_dtmf, time_limit, recording_flag, call_mode, call_priority        FROM click2call_schedule WHERE STATUS =0 and (call_mode = '1' or call_mode = '3' or call_mode = '6') AND SUBSTRING(virtual_number,  -10, 8) = :virtualNumberString and DATE_ADD(scheduled_date, INTERVAL 10 MINUTE) > :insertDateTime AND DATE_ADD(scheduled_date, INTERVAL -10 MINUTE) < :insertDateTime LIMIT 1";*/

      if ((where["appCallMode"]) && (where["appCallMode"] == "click2call")) {
          //click to call only as KOMM_WEB:3 and CRM_WEB:1 
          Query = 
          "SELECT call_schedule_id, session_id, virtual_number, to_no, from_no, sme_id, media_file_flag, media_file_id, name_file_flag, name_file_id, group_name, agent_number, custom_dtmf_flag, custom_dtmf, time_limit, recording_flag, call_mode, call_priority        FROM click2call_schedule WHERE STATUS =0 and (call_mode = '1' or call_mode = '3') AND longcode_site=:longcodSiteName AND call_priority =:callType LIMIT 1";

          let executeQuery = await sequelize_reader.query<any>(Query, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: { longcodSiteName: where["longcodSiteName"] , insertDateTime: where["insertDateTime"],
            callType: where["callType"]},
          });
          callback(null, executeQuery);

      } else if ((where["appCallMode"]) && (where["appCallMode"] == "autodialer")) {
          //autodialer only
          Query = 
          "SELECT call_schedule_id, session_id, virtual_number, to_no, from_no, sme_id, media_file_flag, media_file_id, name_file_flag, name_file_id, group_name, agent_number, custom_dtmf_flag, custom_dtmf, time_limit, recording_flag, call_mode, call_priority        FROM click2call_schedule WHERE STATUS =0 and (call_mode = '6') AND  longcode_site=:longcodSiteName  AND call_priority =:callType LIMIT 1";

          let executeQuery = await sequelize_reader.query<any>(Query, {
            raw: true,
            type: QueryTypes.SELECT,
            replacements: { longcodSiteName: where["longcodSiteName"] , insertDateTime: where["insertDateTime"],
            callType: where["callType"]},
          });
          callback(null, executeQuery);
      } else {
        callback("invalid appCallMode", null);
        glogger('ERR', "0", 'FindAutoDialedNo', "Invalid appCallMode("+where["appCallMode"]+")");
      }

    
  } catch (error: any) {
    glogger('ERR', "0", 'FindAutoDialedNo', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}
export async function FindAutoDialedNoProfile(where: any, callback: any) {
  try {
    console.log("where");
    console.log(where);
    let Query =
      "SELECT lc.id,lc.longcode,lc.out_short_code,lc.hlr,IFNULL(sp.id,0) as sp_id,IFNULL(sp.recording,0) as recording,IFNULL(sp.masking,0) as masking,IFNULL(sp.voicemail,0) as voicemail,IFNULL(sp.billing_status,0) as billing_status,IFNULL(sp.queue_limit,0) as queue_limit, selection_algo, IFNULL(sp.live_events,0) as live_events, sp.no_agent_calling_flag FROM longcodes AS lc, sme_profile AS sp WHERE SUBSTRING(TRIM(lc.longcode), -10)=SUBSTRING(:longcode, -10) AND sp.id=:sme_id LIMIT 1";

    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { longcode: where["longcode"], sme_id: where["sme_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindAutoDialedNoProfile', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindVirtualNoStatus(where: any, callback: any) {
  try {
    let Query = "select status from longcodes where SUBSTRING(TRIM(longcode), -10)=SUBSTRING(:virtual_number, -10) limit 1";

    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { virtual_number: where["longcode"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindVirtualNoStatus', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}
export async function UpdateAutoDialedNo(where: any, callback: any) {
  try {
    let Query = "update click2call_schedule set status='1' where sme_id =:sme_id and session_id = :session_id limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { sme_id: where["sme_id"], session_id: where["session_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateAutoDialedNo', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateAutoDialedNoError(where: any, callback: any) {
  try {
    console.log("where");
    console.log(where);
    //let Query = "SELECT lc.id,lc.longcode,lc.out_short_code,lc.hlr,IFNULL(sp.id,0) as sp_id,IFNULL(sp.recording,0) as recording,IFNULL(sp.masking,0) as masking,IFNULL(sp.voicemail,0) as voicemail,IFNULL(sp.billing_status,0) as billing_status,IFNULL(sp.queue_limit,0) as queue_limit,selection_algo FROM longcodes AS lc, sme_profile AS sp WHERE SUBSTRING(TRIM(lc.longcode), -10)=SUBSTRING(:longcode, -10) AND sp.longcode_id=lc.id LIMIT 1";
    let Query =
      "SELECT lc.id,lc.longcode,lc.out_short_code,lc.hlr,IFNULL(sp.id,0) as sp_id,IFNULL(sp.recording,0) as recording,IFNULL(sp.masking,0) as masking,IFNULL(sp.voicemail,0) as voicemail,IFNULL(sp.billing_status,0) as billing_status,IFNULL(sp.queue_limit,0) as queue_limit,selection_algo FROM longcodes AS lc, sme_profile AS sp WHERE SUBSTRING(TRIM(lc.longcode), -10)=SUBSTRING(:longcode, -10) AND sp.id =: sme_id LIMIT 1";

    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { longcode: where["longcode"], sme_id: where["sme_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateAutoDialedNoError', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateAutoDialedNoErrorNew(where: any, callback: any) {
  try {
    let Query =
      "update click2call_schedule set status='-1' where call_schedule_id = :schedule_id limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {        
        schedule_id: where["schedule_id"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateAutoDialedNoErrorNew', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateClick2Call(where: any, callback: any) {
  try {
    let Query =
      "update click2call_schedule set status='2', call_duration = :duration, dtmf_received = :dtmf, recording_file_id = :recording_file_id, call_status =:call_status, agent_number_resp =:agent_no, response_msg = :response_msg where sme_id =:sme_id and call_schedule_id = :schedule_id AND session_id =:session_id limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        duration: where["duration"],
        dtmf: where["dtmf"],
        recording_file_id: where["recording_file_id"],
        call_status: where["call_status"],
        agent_no: where["agent_no"],
        response_msg: where["response_msg"],
        sme_id: where["sme_id"],
        schedule_id: where["schedule_id"],
        session_id: where["session_id"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateClick2Call', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function addrevenueProcess(where: any, callback: any) {
  try {
    let Query = "Call revenue_processor (:IN_BACKDAYS)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { IN_BACKDAYS: where["IN_BACKDAYS"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'addrevenueProcess', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindAppOutCallDetail(where: any, callback: any) {
  try {
    let Query =
      "SELECT call_schedule_id, session_id, virtual_number, to_no, from_no, sme_id, media_file_flag, media_file_id, name_file_flag, name_file_id, group_name, agent_number, custom_dtmf_flag, custom_dtmf, time_limit, recording_flag, call_mode, call_priority FROM click2call_schedule WHERE STATUS =0 and (call_mode = '2' or call_mode = '4') and sme_id = :sme_id and agent_number = :agent_no and SUBSTRING(TRIM(virtual_number), -10)=SUBSTRING(:longcode, -10) and DATE_ADD(scheduled_date, INTERVAL 10 MINUTE) > :insertDateTime AND DATE_ADD(scheduled_date, INTERVAL -10 MINUTE) < :insertDateTime ORDER BY scheduled_date DESC LIMIT 1";

    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], agent_no: where["agent_no"], longcode: where["longcode"], insertDateTime: where["insertDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindAppOutCallDetail', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getLastCallAgent(where: any, callback: any) {
  try {
    let Query = "";

    console.log("=======================  active ignore list lenth " + where["g_agent_ignore_list"].length + "=============");
    console.log(where["g_agent_ignore_list"]);
    console.log(where["g_assigned_vn_agent_id"]);
    console.log(where["g_assigned_vn_agent_id"].length);
    //if((where['g_agent_ignore_list']).length >0) {
    if (where["g_agent_ignore_list"].length > 0) {
      console.log("=======================  active ignore list=============");
      //I could not handle the logic for stciky, what I wasnted was if there is ignore list in the request we should not find the stciky instead it should go to random, serial or other as per the algo.
      //to handle this situation i added dummy query, so on no agent the rest of logic will work.
      Query = "select 0 as agent_id, 0 as sticky_agent, 0 as sticky_days, 0 as last_call_day, 0 as status";
    } else {

      if(where["g_assigned_vn_agent_id"]){

        glogger('DEB', "0", 'getLastCallAgent', "virtual no assigned with agentId("+where["g_assigned_vn_agent_id"]+")...");

        //Query = "SELECT ad.*, agd.group_name,agd.group_id,agd.group_status,sm.recording , (  select (case when count(1) > '0' then 'available' else 'off_hours' END ) as status from  agent_details_timing adt where adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a'))       and adt.agent_id = ad.agent_id AND (CASE WHEN adt.in_time > adt.out_time THEN ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE WHEN adt.in_time > adt.out_time THEN (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)) as agent_off_hours_status FROM agent_details ad left JOIN agent_details_timing adt ON ad.agent_id = adt.agent_id LEFT JOIN agent_group_mapping AS ag ON ad.agent_id = ag.agent_id LEFT JOIN agent_group_detail AS agd ON agd.group_id = ag.group_id LEFT JOIN sme_profile AS sm ON ad.sme_id = sm.id  WHERE ad.sme_id  =:sme_id and ad.agent_id =:g_assigned_vn_agent_id  and ad.status !=-9 Limit 1";

        Query =
        "SELECT ad.*, sm.recording , (  select (case when count(1) > '0' then 'available' else 'off_hours' END ) as status from  agent_details_timing adt where adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a'))       and adt.agent_id = ad.agent_id AND (CASE WHEN adt.in_time > adt.out_time THEN ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE WHEN adt.in_time > adt.out_time THEN (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)) as agent_off_hours_status FROM agent_details ad left JOIN agent_details_timing adt ON ad.agent_id = adt.agent_id  LEFT JOIN sme_queue_mapping sqm ON sqm.agent_id  = adt.agent_id LEFT JOIN sme_profile AS sm ON ad.sme_id = sm.id  WHERE ad.sme_id  =:sme_id and ad.agent_id =:g_assigned_vn_agent_id  and ad.status !=-9 Limit 1";

      }
      else if ( ((where["g_assigned_agent_sticky_type"] == "1") || (where["g_assigned_agent_sticky_type"] == "2")) && (where["g_assigned_agent_sticky_id"]) ) {
       
        glogger('DEB', "0", 'getLastCallAgent', "lead sticky part...");

        
        //Query ="SELECT ad.*, agd.group_name,agd.group_id,agd.group_status,sm.recording , (  select (case when count(1) > '0' then 'available' else 'off_hours' END ) as status from              agent_details_timing adt where adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a'))       and adt.agent_id = ad.agent_id AND (CASE WHEN adt.in_time > adt.out_time THEN ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE WHEN adt.in_time > adt.out_time THEN (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)) as agent_off_hours_status FROM agent_details ad left JOIN agent_details_timing adt ON ad.agent_id = adt.agent_id LEFT JOIN agent_group_mapping AS ag ON ad.agent_id = ag.agent_id LEFT JOIN agent_group_detail AS agd ON agd.group_id = ag.group_id LEFT JOIN sme_profile AS sm ON ad.sme_id = sm.id  WHERE ad.sme_id  =:sme_id and ad.agent_id =:g_assigned_agent_sticky_id  and ad.status !=-9 Limit 1";

        Query ="SELECT ad.*, sm.recording , (  select (case when count(1) > '0' then 'available' else 'off_hours' END ) as status from              agent_details_timing adt where adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a'))       and adt.agent_id = ad.agent_id AND (CASE WHEN adt.in_time > adt.out_time THEN ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE WHEN adt.in_time > adt.out_time THEN (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)) as agent_off_hours_status FROM agent_details ad left JOIN agent_details_timing adt ON ad.agent_id = adt.agent_id  LEFT JOIN sme_queue_mapping sqm ON sqm.agent_id  = adt.agent_id LEFT JOIN sme_profile AS sm ON ad.sme_id = sm.id  WHERE ad.sme_id  =:sme_id and ad.agent_id =:g_assigned_agent_sticky_id  and ad.status !=-9 Limit 1";


      }
      else if (where["g_sme_sticky_algo"] == "1") {
        //it means patched calls only
       

        //Query = "select DATEDIFF(date(:currentDate), date(cc.start_date_time)) as last_call_day, cc.patched_agent_id as agent_id, ad.agent_mobile, ad.agent_name , ad.status ,ad.agent_position, ad.agent_extention,ad.agent_email, ad.sticky_agent, ad.sticky_days , ad.webrtc_flag, ad.agent_masking, agd.group_name,(  select (case when count(1) > '0' then 'available' else 'off_hours' END ) as status from              agent_details_timing adt where adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a'))       and adt.agent_id = cc.patched_agent_id AND (CASE WHEN adt.in_time > adt.out_time THEN ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE WHEN adt.in_time > adt.out_time THEN (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)) as agent_off_hours_status from calling_cdr cc left JOIN agent_details ad ON cc.patched_agent_id = ad.agent_id left JOIN agent_details_timing adt ON ad.agent_id = adt.agent_id left JOIN agent_group_mapping agm ON ad.agent_id = agm.agent_id left JOIN agent_group_detail agd ON agm.group_id = agd.group_id where cc.sme_id = :sme_id and cc.customer_number = :g_customer_no and cc.final_status ='patched' and ad.status not in ('-9') AND agd.group_name = ( select agd2.group_name from agent_group_detail agd2 where agd2.group_id =:g_group) order by cc.id desc limit 1";

        Query = "select DATEDIFF(date(:currentDate), date(cc.start_date_time)) as last_call_day, cc.patched_agent_id as agent_id, ad.agent_mobile, ad.agent_name , ad.status ,ad.agent_position, ad.agent_extention,ad.agent_email, ad.sticky_agent, ad.sticky_days , ad.webrtc_flag, ad.agent_masking ,(  select (case when count(1) > '0' then 'available' else 'off_hours' END ) as status from              agent_details_timing adt where adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a'))       and adt.agent_id = cc.patched_agent_id AND (CASE WHEN adt.in_time > adt.out_time THEN ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE WHEN adt.in_time > adt.out_time THEN (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)) as agent_off_hours_status from calling_cdr cc left JOIN agent_details ad ON cc.patched_agent_id = ad.agent_id left JOIN agent_details_timing adt ON ad.agent_id = adt.agent_id LEFT JOIN sme_queue_mapping sqm ON sqm.agent_id  = adt.agent_id  where cc.sme_id = :sme_id and cc.customer_number = :g_customer_no and cc.final_status ='patched' and ad.status not in ('-9') AND sqm.queue_id = :g_queue_id order by cc.id desc limit 1";

      } //default & 0 means any call
      else {
        

        //Query = "select DATEDIFF(date(:currentDate), date(cc.start_date_time)) as last_call_day, cc.patched_agent_id as agent_id, ad.agent_mobile, ad.agent_name , ad.status ,ad.agent_position, ad.agent_extention,ad.agent_email, ad.sticky_agent, ad.sticky_days , ad.webrtc_flag, ad.agent_masking, agd.group_name,(  select (case when count(1) > '0' then 'available' else 'off_hours' END ) as status from              agent_details_timing adt where adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a'))       and adt.agent_id = cc.patched_agent_id AND (CASE WHEN adt.in_time > adt.out_time THEN ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE WHEN adt.in_time > adt.out_time THEN (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)) as agent_off_hours_status from calling_cdr cc left JOIN agent_details ad ON cc.patched_agent_id = ad.agent_id left JOIN agent_details_timing adt ON ad.agent_id = adt.agent_id left JOIN agent_group_mapping agm ON ad.agent_id = agm.agent_id left JOIN agent_group_detail agd ON agm.group_id = agd.group_id where cc.sme_id = :sme_id and cc.customer_number = :g_customer_no  and ad.status not in ('-9') AND agd.group_name = ( select agd2.group_name from agent_group_detail agd2 where agd2.group_id =:g_group) order by cc.id desc limit 1";


        Query = "select DATEDIFF(date(:currentDate), date(cc.start_date_time)) as last_call_day, cc.patched_agent_id as agent_id, ad.agent_mobile, ad.agent_name , ad.status ,ad.agent_position, ad.agent_extention,ad.agent_email, ad.sticky_agent, ad.sticky_days , ad.webrtc_flag, ad.agent_masking,(  select (case when count(1) > '0' then 'available' else 'off_hours' END ) as status from              agent_details_timing adt where adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a'))       and adt.agent_id = cc.patched_agent_id AND (CASE WHEN adt.in_time > adt.out_time THEN ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE WHEN adt.in_time > adt.out_time THEN (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)) as agent_off_hours_status from calling_cdr cc left JOIN agent_details ad ON cc.patched_agent_id = ad.agent_id left JOIN agent_details_timing adt ON ad.agent_id = adt.agent_id LEFT JOIN sme_queue_mapping sqm ON sqm.agent_id  = adt.agent_id where cc.sme_id = :sme_id and cc.customer_number = :g_customer_no  and ad.status not in ('-9') AND  sqm.queue_id = :g_queue_id order by cc.id desc limit 1";
      }
    }

    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        sme_id: where["sme_id"],
        g_customer_no: where["g_customer_no"],
        g_sme_sticky_algo: where["g_sme_sticky_algo"],
        currentDate: where["currentDate"],
        //g_group: where["g_group"],
        g_agent_ignore_list: where["g_agent_ignore_list"],
        g_assigned_agent_sticky_id: where["g_assigned_agent_sticky_id"],
        g_assigned_vn_agent_id: where["g_assigned_vn_agent_id"],
        g_queue_id: where["g_queue_id"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'getLastCallAgent', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getAgentOffHourStatus(where: any, callback: any) {
  try {
    let Query =
      "IF(count(1) < '0','off_hour','available') as agent_status  from from agent_details_timing adt where adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a')) and adt.agent_id =:agentId  AND (CASE WHEN adt.in_time > adt.out_time THEN ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE WHEN adt.in_time > adt.out_time THEN (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END) limit 1";

    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        sme_id: where["sme_id"],
        g_customer_no: where["g_customer_no"],
        g_sme_sticky_algo: where["g_sme_sticky_algo"],
        currentDate: where["currentDate"],
        //g_group: where["g_group"],
        g_agent_ignore_list: where["g_agent_ignore_list"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'getAgentOffHourStatus', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getRandomAgent(where: any, callback: any) {
  try {
    let Query;
    //if(where['g_agent_ignore_list']) {
    if (where["g_agent_ignore_list"].length > 0) {
      
      //Query ="select ad.agent_id, ad.agent_name, ad.agent_mobile, ad.status, ad.agent_position, ad.agent_email, ad.sticky_agent , ad.agent_masking, ad.webrtc_flag, agd.group_name from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id =adt.agent_id left JOIN agent_group_mapping agm ON ad.agent_id =agm.agent_id left JOIN agent_group_detail agd ON agm.group_id =agd.group_id WHERE ad.sme_id =:sme_id and ad.status ='1' and adt.days_week=UPPER(DATE_FORMAT(:currentDate,'%a')) AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)  AND agd.group_name = (select agd2.group_name from agent_group_detail agd2 where agd2.group_id =:g_group) AND ad.agent_id NOT IN (:g_agent_ignore_list) order by rand() limit 1";

      Query ="select ad.agent_id, ad.agent_name, ad.agent_mobile, ad.status, ad.agent_position, ad.agent_email, ad.sticky_agent , ad.agent_masking, ad.webrtc_flag from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id =adt.agent_id LEFT JOIN sme_queue_mapping sqm ON sqm.agent_id  = adt.agent_id WHERE ad.sme_id =:sme_id and ad.status ='1' and adt.days_week=UPPER(DATE_FORMAT(:currentDate,'%a')) AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)  and sqm.queue_id = :g_queue_id  AND ad.agent_id NOT IN (:g_agent_ignore_list) order by rand() limit 1";

    } else {
      
      //Query = "select ad.agent_id, ad.agent_name, ad.agent_mobile, ad.status, ad.agent_position, ad.agent_email, ad.sticky_agent , ad.agent_masking, ad.webrtc_flag, agd.group_name from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id =adt.agent_id left JOIN agent_group_mapping agm ON ad.agent_id =agm.agent_id left JOIN agent_group_detail agd ON agm.group_id =agd.group_id WHERE ad.sme_id =:sme_id and ad.status ='1' and adt.days_week=UPPER(DATE_FORMAT(:currentDate,'%a')) AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END) AND agd.group_name = (select agd2.group_name from agent_group_detail agd2 where agd2.group_id =:g_group) order by rand() limit 1";

      Query = "select ad.agent_id, ad.agent_name, ad.agent_mobile, ad.status, ad.agent_position, ad.agent_email, ad.sticky_agent , ad.agent_masking, ad.webrtc_flag from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id =adt.agent_id LEFT JOIN sme_queue_mapping sqm ON sqm.agent_id  = adt.agent_id WHERE ad.sme_id =:sme_id and ad.status ='1' and adt.days_week=UPPER(DATE_FORMAT(:currentDate,'%a')) AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END) AND sqm.queue_id = :g_queue_id order by rand() limit 1";
    }

    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"],g_queue_id: where["g_queue_id"], currentDate: where["currentDate"], g_agent_ignore_list: where["g_agent_ignore_list"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'getRandomAgent', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getEqualCallDistAgent(where: any, callback: any) {
  try {
    let Query;
    //if(where['g_agent_ignore_list']) {
    if (where["g_agent_ignore_list"].length > 0) {
      
     

      Query ="select ad.agent_id, ad.agent_name, ad.agent_mobile, ad.status, ad.agent_position, ad.agent_email, ad.sticky_agent , ad.agent_masking, ad.webrtc_flag from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id =adt.agent_id LEFT JOIN sme_queue_mapping sqm ON sqm.agent_id  = adt.agent_id WHERE ad.sme_id =:sme_id and ad.status ='1' and adt.days_week=UPPER(DATE_FORMAT(:currentDate,'%a')) AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)  and sqm.queue_id = :g_queue_id  AND ad.agent_id NOT IN (:g_agent_ignore_list) order by ad.recent_call_date_time ASC limit 1";

    } else {
      
      

      Query = "select ad.agent_id, ad.agent_name, ad.agent_mobile, ad.status, ad.agent_position, ad.agent_email, ad.sticky_agent , ad.agent_masking, ad.webrtc_flag from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id =adt.agent_id LEFT JOIN sme_queue_mapping sqm ON sqm.agent_id  = adt.agent_id WHERE ad.sme_id =:sme_id and ad.status ='1' and adt.days_week=UPPER(DATE_FORMAT(:currentDate,'%a')) AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END) AND sqm.queue_id = :g_queue_id order by ad.recent_call_date_time ASC limit 1";
    }

    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"],g_queue_id: where["g_queue_id"], currentDate: where["currentDate"], g_agent_ignore_list: where["g_agent_ignore_list"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'getEqualCallDistAgent', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getSerialAgent(where: any, callback: any) {
  try {
    let Query = "";
    //if(where['g_agent_ignore_list']) {
    if (where["g_agent_ignore_list"].length > 0) {
     
      //Query =  "select ad.agent_id, ad.agent_name, ad.agent_mobile, ad.status, ad.agent_position, ad.agent_email, ad.webrtc_flag, ad.sticky_agent, agd.group_name from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id =adt.agent_id  left JOIN agent_group_mapping agm ON ad.agent_id =agm.agent_id left JOIN agent_group_detail agd ON agm.group_id =agd.group_id WHERE ad.sme_id =:sme_id and ad.status ='1' and adt.days_week=UPPER(DATE_FORMAT(:currentDate,'%a')) AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END) AND agd.group_name = (select agd2.group_name from agent_group_detail agd2 where agd2.group_id =:g_group) AND ad.agent_id NOT IN (:g_agent_ignore_list) order by agent_position limit 1";

      Query =  "select ad.agent_id, ad.agent_name, ad.agent_mobile, ad.status, ad.agent_position, ad.agent_email, ad.webrtc_flag, ad.sticky_agent  from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id =adt.agent_id  LEFT JOIN sme_queue_mapping sqm ON sqm.agent_id  = adt.agent_id   WHERE ad.sme_id =:sme_id and ad.status ='1' and adt.days_week=UPPER(DATE_FORMAT(:currentDate,'%a')) AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END) AND sqm.queue_id = :g_queue_id AND ad.agent_id NOT IN (:g_agent_ignore_list) order by agent_position limit 1";


    } else {
      
      //Query =  "select ad.agent_id, ad.agent_name, ad.agent_mobile, ad.status, ad.agent_position, ad.agent_email, ad.sticky_agent, ad.webrtc_flag, agd.group_name from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id =adt.agent_id  left JOIN agent_group_mapping agm ON ad.agent_id =agm.agent_id left JOIN agent_group_detail agd ON agm.group_id =agd.group_id WHERE ad.sme_id =:sme_id and ad.status ='1' and adt.days_week=UPPER(DATE_FORMAT(:currentDate,'%a')) AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END) AND agd.group_name = (select agd2.group_name from agent_group_detail agd2 where agd2.group_id =:g_group) order by agent_position limit 1";

      Query =  "select ad.agent_id, ad.agent_name, ad.agent_mobile, ad.status, ad.agent_position, ad.agent_email, ad.sticky_agent, ad.webrtc_flag from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id =adt.agent_id  LEFT JOIN sme_queue_mapping sqm ON sqm.agent_id  = adt.agent_id  WHERE ad.sme_id =:sme_id and ad.status ='1' and adt.days_week=UPPER(DATE_FORMAT(:currentDate,'%a')) AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END) AND sqm.queue_id = :g_queue_id order by agent_position limit 1";
    }
    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], g_queue_id: where["g_queue_id"], currentDate: where["currentDate"], g_agent_ignore_list: where["g_agent_ignore_list"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'getSerialAgent', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}
export async function getMaximumAgent(where: any, callback: any) {
  try {
    let Query = "";

    Query = "select count(*) as total_count from agent_details WHERE sme_id =:sme_id and status  not in('-9, 0')";

    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'getMaximumAgent', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}
export async function getEqualAgent(where: any, callback: any) {
  try {
    let Query = "";
    //if(where['g_agent_ignore_list']) {
    if (where["g_agent_ignore_list"].length > 0) {
     
      //Query =   "select ad.agent_id,ad.agent_name,ad.agent_mobile,ad.status,ad.agent_position,ad.agent_email,  ad.webrtc_flag, ad.sticky_agent, ad.agent_masking, agd.group_name,(select count(*) from agent_report_details ard where ard.sme_id =:sme_id and ard.agent_id = ad.agent_id LIMIT :g_total_agent_count ) as total_count from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id = adt.agent_id left JOIN agent_group_mapping agm ON ad.agent_id = agm.agent_id left JOIN agent_group_detail agd ON agm.group_id = agd.group_id  WHERE ad.sme_id =:sme_id  and ad.status = '1' and adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a'))  AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)  AND agd.group_name = (select agd2.group_name from agent_group_detail agd2 where agd2.group_id =:g_group) AND ad.agent_id NOT IN (:g_agent_ignore_list)  ORDER by total_count LIMIT 1 ";

      Query =   "select ad.agent_id,ad.agent_name,ad.agent_mobile,ad.status,ad.agent_position,ad.agent_email,  ad.webrtc_flag, ad.sticky_agent, ad.agent_masking,(select count(*) from agent_report_details ard where ard.sme_id =:sme_id and ard.agent_id = ad.agent_id LIMIT :g_total_agent_count ) as total_count from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id = adt.agent_id LEFT JOIN sme_queue_mapping sqm ON sqm.agent_id  = adt.agent_id  WHERE ad.sme_id =:sme_id  and ad.status = '1' and adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a'))  AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)  AND sqm.queue_id = :g_queue_id AND ad.agent_id NOT IN (:g_agent_ignore_list)  ORDER by total_count LIMIT 1 ";
    } else {
      
      //Query =   "select ad.agent_id,ad.agent_name,ad.agent_mobile,ad.status,ad.agent_position,ad.agent_email,  ad.webrtc_flag, ad.sticky_agent, ad.agent_masking, agd.group_name,(select count(*) from agent_report_details ard where ard.sme_id =:sme_id and ard.agent_id = ad.agent_id LIMIT :g_total_agent_count ) as total_count from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id = adt.agent_id left JOIN agent_group_mapping agm ON ad.agent_id = agm.agent_id left JOIN agent_group_detail agd ON agm.group_id = agd.group_id  WHERE ad.sme_id =:sme_id  and ad.status = '1' and adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a'))  AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)  AND agd.group_name = (select agd2.group_name from agent_group_detail agd2 where agd2.group_id =:g_group) ORDER by total_count LIMIT 1 ";

      Query =   "select ad.agent_id,ad.agent_name,ad.agent_mobile,ad.status,ad.agent_position,ad.agent_email,  ad.webrtc_flag, ad.sticky_agent, ad.agent_masking,(select count(*) from agent_report_details ard where ard.sme_id =:sme_id and ard.agent_id = ad.agent_id LIMIT :g_total_agent_count ) as total_count from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id = adt.agent_id LEFT JOIN sme_queue_mapping sqm ON sqm.agent_id  = adt.agent_id  WHERE ad.sme_id =:sme_id  and ad.status = '1' and adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a'))  AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)  AND sqm.queue_id = :g_queue_id ORDER by total_count LIMIT 1 ";
    }
    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        sme_id: where["sme_id"],
        g_queue_id: where["g_queue_id"],
        g_total_agent_count: where["g_total_agent_count"],
        currentDate: where["currentDate"],
        g_agent_ignore_list: where["g_agent_ignore_list"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'getEqualAgent', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getEqualAgentList(where: any, callback: any) {
  try {
    let Query = "";
    //if(where['g_agent_ignore_list']) {
    if (where["g_agent_ignore_list"].length > 0) {
      
      //Query =   "select ad.agent_id,ad.agent_name,ad.agent_mobile,ad.status,ad.agent_position,ad.agent_email,  ad.webrtc_flag, ad.sticky_agent, ad.agent_masking, agd.group_name from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id = adt.agent_id left JOIN agent_group_mapping agm ON ad.agent_id = agm.agent_id left JOIN agent_group_detail agd ON agm.group_id = agd.group_id  WHERE ad.sme_id =:sme_id  and ad.status = '1' and adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a'))  AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)  AND agd.group_name = (select agd2.group_name from agent_group_detail agd2 where agd2.group_id =:g_group) AND ad.agent_id NOT IN (:g_agent_ignore_list) AND ad.agent_id =:agentId LIMIT 1 ";

      Query =   "select ad.agent_id,ad.agent_name,ad.agent_mobile,ad.status,ad.agent_position,ad.agent_email,  ad.webrtc_flag, ad.sticky_agent, ad.agent_masking from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id = adt.agent_id LEFT JOIN sme_queue_mapping sqm ON sqm.agent_id  = adt.agent_id WHERE ad.sme_id =:sme_id  and ad.status = '1' and adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a'))  AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)  AND sqm.queue_id = :g_queue_id AND ad.agent_id NOT IN (:g_agent_ignore_list) AND ad.agent_id =:agentId LIMIT 1 ";

    } else {
     
      //Query =  "select ad.agent_id,ad.agent_name,ad.agent_mobile,ad.status,ad.agent_position,ad.agent_email, ad.webrtc_flag, ad.sticky_agent, ad.agent_masking, agd.group_name from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id = adt.agent_id left JOIN agent_group_mapping agm ON ad.agent_id = agm.agent_id left JOIN agent_group_detail agd ON agm.group_id = agd.group_id  WHERE ad.sme_id =:sme_id  and ad.status = '1' and adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a'))  AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)  AND agd.group_name = (select agd2.group_name from agent_group_detail agd2 where agd2.group_id =:g_group) AND ad.agent_id = :agentId LIMIT 1 ";

      Query =  "select ad.agent_id,ad.agent_name,ad.agent_mobile,ad.status,ad.agent_position,ad.agent_email, ad.webrtc_flag, ad.sticky_agent, ad.agent_masking from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id = adt.agent_id LEFT JOIN sme_queue_mapping sqm ON sqm.agent_id  = adt.agent_id  WHERE ad.sme_id =:sme_id  and ad.status = '1' and adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a'))  AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)  AND sqm.queue_id = :g_queue_id AND ad.agent_id = :agentId LIMIT 1 ";
    }
    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        sme_id: where["sme_id"],
        g_queue_id: where["g_queue_id"],
        g_total_agent_count: where["g_total_agent_count"],
        currentDate: where["currentDate"],
        g_agent_ignore_list: where["g_agent_ignore_list"],
        agentId: where["agentId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'getEqualAgentList', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getEqualAgentCheck(where: any, callback: any) {
  try {
    let Query1 = "select agent_id from agent_details ard WHERE sme_id =:sme_id AND status=1";

    let executeQueryDetails = await sequelize_reader.query(Query1, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"] },
    });

    let Query = "select agent_id from agent_report_details ard WHERE sme_id =:sme_id AND agent_id NOT IN (:g_agent_ignore_list) order by insert_date desc LIMIT 4";

    let executeQueryReports = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        sme_id: where["sme_id"],
        g_queue_id: where["g_queue_id"],
        g_total_agent_count: where["g_total_agent_count"],
        currentDate: where["currentDate"],
        g_agent_ignore_list: where["g_agent_ignore_list"],
      },
    });
    if (executeQueryDetails.length > 0) {
      let resultAgentDetails: any = executeQueryDetails.map((s: any) => {
        return parseInt(s.agent_id);
      });
      if (executeQueryReports.length > 0) {
        let resultAgentReport: any = executeQueryReports.map((s: any) => {
          return parseInt(s.agent_id);
        });
        let notExistsAgent: any = [];
        resultAgentDetails.map((row: number) => {
          if (resultAgentReport.includes(row) == false) {
            notExistsAgent.push(row);
          }
        });
        if (notExistsAgent.length > 0) {
          callback(null, notExistsAgent[Math.floor(Math.random() * notExistsAgent.length)]);
        } else {
          let agentIdNotCall: any = 0;
          let totalCallagent: any = {};
          resultAgentReport.forEach((x: string | number) => {
            totalCallagent[x] = (totalCallagent[x] || 0) + 1;
          });
          let totalCallagentArr: any = Object.values(totalCallagent);
          let minVal: any = Math.min(...totalCallagentArr);
          agentIdNotCall = Object.keys(totalCallagent).find((key) => totalCallagent[key] === minVal);
          callback(null, agentIdNotCall);
        }
      } else {
        callback(null, resultAgentDetails[Math.floor(Math.random() * resultAgentDetails.length)]);
      }
    } else {
      let agentIdNotCall: any = 0;
      let totalCallagent: any = {};
      let resultAgentReport: any = executeQueryReports.map((s: any) => {
        return parseInt(s.agent_id);
      });
      resultAgentReport.forEach((x: string | number) => {
        totalCallagent[x] = (totalCallagent[x] || 0) + 1;
      });
      let totalCallagentArr: any = Object.values(totalCallagent);
      let minVal: any = Math.min(...totalCallagentArr);
      agentIdNotCall = Object.keys(totalCallagent).find((key) => totalCallagent[key] === minVal);
      callback(null, agentIdNotCall);
    }
  } catch (error: any) {
    glogger('ERR', "0", 'getEqualAgentCheck', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getOffHoursAgent(where: any, callback: any) {
  try {
    console.log("queryyy :currentDate");
    let Query = "";

    

    Query =
      "select (case when adt.agent_id  > '0' then count(adt.agent_id ) else 0 END ) as not_offhours_agents_count from agent_details_timing adt where adt.sme_id =:sme_id and adt.days_week = UPPER (DATE_FORMAT(:currentDate, '%a'))  AND (CASE WHEN adt.in_time > adt.out_time THEN ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')  OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')  END) AND (CASE WHEN adt.in_time > adt.out_time THEN (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END) and adt.status not in('-9','0') LIMIT 1";

    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], currentDate: where["currentDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'getOffHoursAgent', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function getRandomAgentParallelRinging(where: any, callback: any) {
  try {
    let Query;
    if (where["g_agent_ignore_list"].length > 0) {
      
      //Query =  "select ad.agent_id, ad.agent_name, ad.agent_mobile, ad.status, ad.agent_position, ad.agent_email, ad.webrtc_flag, ad.sticky_agent , ad.agent_masking, agd.group_name from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id =adt.agent_id left JOIN agent_group_mapping agm ON ad.agent_id =agm.agent_id left JOIN agent_group_detail agd ON agm.group_id =agd.group_id WHERE ad.sme_id =:sme_id and ad.status ='1' and adt.days_week=UPPER(DATE_FORMAT(:currentDate,'%a')) AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)  AND agd.group_name = (select agd2.group_name from agent_group_detail agd2 where agd2.group_id =:g_group) AND ad.agent_id NOT IN (:g_agent_ignore_list) order by rand() limit :g_total_agents";

      Query =  "select ad.agent_id, ad.agent_name, ad.agent_mobile, ad.status, ad.agent_position, ad.agent_email, ad.webrtc_flag, ad.sticky_agent , ad.agent_masking from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id =adt.agent_id LEFT JOIN sme_queue_mapping sqm ON sqm.agent_id  = adt.agent_id WHERE ad.sme_id =:sme_id and ad.status ='1' and adt.days_week=UPPER(DATE_FORMAT(:currentDate,'%a')) AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)  AND sqm.queue_id = :g_queue_id AND ad.agent_id NOT IN (:g_agent_ignore_list) order by rand() limit :g_total_agents";
    } else {
      
      //Query = "select ad.agent_id, ad.agent_name, ad.agent_mobile, ad.status, ad.agent_position, ad.agent_email, ad.webrtc_flag, ad.sticky_agent , ad.agent_masking, agd.group_name from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id =adt.agent_id left JOIN agent_group_mapping agm ON ad.agent_id =agm.agent_id left JOIN agent_group_detail agd ON agm.group_id =agd.group_id WHERE ad.sme_id =:sme_id and ad.status ='1' and adt.days_week=UPPER(DATE_FORMAT(:currentDate,'%a')) AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END) AND agd.group_name = (select agd2.group_name from agent_group_detail agd2 where agd2.group_id =:g_group) order by rand() limit :g_total_agents";

      Query = "select ad.agent_id, ad.agent_name, ad.agent_mobile, ad.status, ad.agent_position, ad.agent_email, ad.webrtc_flag, ad.sticky_agent , ad.agent_masking from agent_details ad left JOIN agent_details_timing adt ON ad.agent_id =adt.agent_id LEFT JOIN sme_queue_mapping sqm ON sqm.agent_id  = adt.agent_id WHERE ad.sme_id =:sme_id and ad.status ='1' and adt.days_week=UPPER(DATE_FORMAT(:currentDate,'%a')) AND (CASE  WHEN adt.in_time > adt.out_time THEN  ( DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T')   OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') ) ELSE DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE  WHEN adt.in_time > adt.out_time THEN  (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END) AND sqm.queue_id = :g_queue_id order by rand() limit :g_total_agents";
    
  }
 console.log("query:",Query )

  let executeQuery = await sequelize_reader.query(Query, {
    raw: true,
    type: QueryTypes.SELECT,
    replacements: { sme_id: where["sme_id"], g_queue_id: where["g_queue_id"], currentDate: where["currentDate"], g_agent_ignore_list: where["g_agent_ignore_list"], g_total_agents: where["g_total_agents"] },
  });
  callback(null, executeQuery);
} catch (error: any) {
  glogger('ERR', "0", 'getRandomAgentParallelRinging', "error:" + error);
  callback(error, null);
  throw new Error(error);
}
}


export async function checkUserExist(where: any, callback: any) {
  try {
    let Query = "";

    Query = "SELECT username FROM users WHERE username = :username AND password = :password ";

    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { username: where["username"], password: where["password"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'checkUserExist', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function checkAgentHangedData(where: any, callback: any) {
  try {
    let Query = "";

    Query =
      "SELECT ad.agent_id, ad.agent_name, ad.agent_mobile, DATE_FORMAT(ad.recent_call_date_time, '%Y-%m-%d %H:%i:%s') AS recent_call_date_time, sp.name AS client_name , sp.id AS client_id FROM agent_details ad LEFT JOIN sme_profile sp ON sp.id = ad.sme_id WHERE ad.`status` = 2 AND ad.sme_id != 0 AND ad.recent_call_date_time < DATE_SUB(:currentDate, INTERVAL 2 MINUTE) AND NOT EXISTS (SELECT  lc.customer_number FROM  live_calls lc WHERE  lc.sme_id = ad.sme_id AND lc.agent_id = ad.agent_id)";

    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { currentDate: where["currentDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'checkAgentHangedData', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

/* Insert Customer report detail */
export async function InsertCustomerReport(where: any, payload: any, callback: any) {
  try {
    let Query =
      "INSERT INTO customer_report_details (sme_id, status, response_message, response_code, start_date, end_date, insert_date, customer_number, session_id, call_mode, call_info, connected_duration, ringing_duration, call_route_reason, total_duration) values (:sme_id, :g_status, :in_response_message, :g_responseCode, :startDate, :endDate, :currentDate, :g_customerAni, :g_sessionCall, :g_mode, :g_callInfo, :connectedDuration, :ringingDuration, :callRouteReason, :totalDuration) ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        sme_id: where["sme_id"],
        g_status: where["g_status"],
        in_response_message: payload["in_response_message"],
        g_responseCode: where["g_responseCode"],
        startDate: where["startDate"],
        endDate: where["endDate"],
        g_customerAni: where["g_customerAni"],
        g_sessionCall: where["g_sessionCall"],
        g_mode: where["g_mode"],
        g_callInfo: where["g_callInfo"],
        connectedDuration: where["connectedDuration"],
        ringingDuration: where["ringingDuration"],
        currentDate: payload["currentDate"],
        callRouteReason: where["callRouteReason"],
        totalDuration: where["totalDuration"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'InsertCustomerReport', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function checkLiveCallHangedData(where: any, callback: any) {
  try {
    let Query = "";

    Query =
      "SELECT lc.id, lc.sme_id, lc.customer_number, lc.date_time FROM live_calls lc WHERE date_time < DATE_SUB(:currentDate, INTERVAL 5 MINUTE) and call_status in (0,10,20)";

    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { currentDate: where["currentDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'checkLiveCallHangedData', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateHangedLiveCallsFree(where: any, callback: any) {
  try {
    let Query = "delete from live_calls where id =:id limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: { id: where["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateHangedLiveCallsFree', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindDefaultIvrFlow(where: any, callback: any) {
  try {
    //let Query =  " SELECT  mcm.id, mcm.sme_id, mcm.flow_id, mcm.flow_name, mcm.cat_id, mcm.cat_desc, mcm.parent_cat_id, mcm.children, mcm.dtmf, mcm.media_file_status, mcm.media_file, mcm.service_type,mcm.title, mcm.event_type, mcm.type, mcm.date_time, mcm.queue_id FROM   mpbx_category_master AS mcm WHERE  NOT EXISTS (SELECT lsm.self_id, lsm.longcode_id,lsm.sme_id,lsm.agent_id,lsm.call_flow_id FROM   longcodes_sme_mapping AS lsm WHERE  lsm.call_flow_id  = mcm.flow_id AND lsm.sme_id =:sme_id ) AND mcm.sme_id=:sme_id ";

    let Query =  " SELECT  mcm.id, mcm.sme_id, mcm.flow_id, mcm.flow_name, mcm.cat_id, mcm.cat_desc, mcm.parent_cat_id, mcm.children, mcm.dtmf, mcm.media_file_status, mcm.media_file, mcm.service_type,mcm.title, mcm.event_type, mcm.type, mcm.date_time, mcm.queue_id , sq.name as queue_name, md.directory_path FROM   mpbx_category_master AS mcm left JOIN sme_queue sq  ON sq.id = mcm.queue_id left join media_details as md ON md.id=mcm.media_id  WHERE  NOT EXISTS (SELECT lsm.self_id, lsm.longcode_id,lsm.sme_id,lsm.agent_id,lsm.call_flow_id FROM   longcodes_sme_mapping AS lsm  WHERE  lsm.call_flow_id  = mcm.flow_id AND lsm.sme_id =:sme_id ) AND mcm.sme_id=:sme_id and mcm.parent_cat_id =0 limit 1";


    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], longcode: where["longcode"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindDefaultIvrFlow', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function checkDbHanged(where: any, callback: any) {
  try {
    let Query = "";

    Query =
      "SELECT seq_col_name, seq_col_value from sequence_gen limit 1";

    let executeQuery = await sequelize_reader.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { currentDate: where["currentDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'checkDbHanged', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}



export async function addcallEndIvrNotify(where: any, paylod: any,data:any, callback: any) {
  try {
    let Query =
      "INSERT INTO sme_notification (sme_id, insert_date_time, call_direction,customer_number,customer_name, agent_id, event, session_id, mode, username, schedule_date_time,title,message) values (:sme_id, :insertdateTime, :callType, :customerNumber, :customerName, :agentId, :event, :sessionId, :mode, :agent_email, :scheduleDateTime, :title,:message)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        sme_id: where["sme_id"],
        callType: where["callType"],
        agentId: where["agentId"],
        event: where["event"],
        sessionId: where["sessionId"],
        customerNumber: where["customerNumber"],
        customerName: data["customerName"],
        mode: where["mode"],
        agent_email: paylod["agent_email"],
        insertdateTime: where["insertdateTime"],
        scheduleDateTime: where["scheduleDateTime"],
        title: where["title"],
        message: where["message"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'addcallEndIvrNotify', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindAgentEmail(where: any, callback: any) {
  try {
    let Query = "SELECT agent_email  from agent_details where sme_id  =:sme_id and agent_id =:agentId";
    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], agentId: where["agentId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindAgentEmail', "error:" + error);
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
    glogger('ERR', "0", 'updateTotalLeadSummaryData', "error:" + error);
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
/* Lead Status Summary data ends*/

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
    glogger('ERR', "0", 'updateTotalLeadSourceSummaryData', "error:" + error);
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
/* Lead Source Summary data ends*/

export async function updateKommunoSiteStatus(where: any, callback: any) {
  try {
    let Query =
      "Update kommuno_sites set status= :status where name =:siteName limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { siteName: where["siteName"], status: where["status"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'updateKommunoSiteStatus', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function addLogSiteStatusWise(where: any, callback: any) {
  try {
    let Query =
      "INSERT INTO kommuno_site_history (name, status, insert_date_time) values (:siteName, :status, :insertdateTime) ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        siteName: where["siteName"],
        status: where["status"],
        insertdateTime: where["insertdateTime"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'addLogSiteStatusWise', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindAutoDialedNoNew(where: any, callback: any) {
  try {
    let Query =
      "SELECT call_schedule_id, session_id, virtual_number, to_no, from_no, sme_id, media_file_flag, media_file_id, name_file_flag, name_file_id, group_name, agent_number, custom_dtmf_flag, custom_dtmf, time_limit, recording_flag, call_mode, call_priority        FROM click2call_schedule WHERE STATUS =0 and (call_mode = '1' or call_mode = '3' or call_mode = '6') AND longcode_site_id =:siteId LIMIT 1";

    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { siteId: where["siteId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindAutoDialedNoNew', "Exception:" + error);
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
    glogger('ERR', "0", 'updateTotalLeadProductSummaryData', "error:" + error);
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
/* Lead Product Summary data ends*/

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
    glogger('ERR', "0", 'updateTotalLeadTypeSummaryData', "error:" + error);
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
/* Lead Product Summary data ends*/


export async function findCustomerName(where: any, callback: any) {
  try {
    let Query = "SELECT agent_email  from agent_details where sme_id  =:sme_id and agent_id =:agentId";
    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], agentId: where["agentId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindAgentEmail', "error:" + error);
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
    glogger('ERR', "0", 'updateTotalLeadCitySummaryData', "error:" + error);
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


export async function FindAssignedAgentIdIvrCalls(where: any,payload: any, callback: any) {
  try {
    var Query = "SELECT agd.group_name, ad.agent_id,ad.agent_name,ad.agent_mobile,ad.status,ad.agent_email, ad.webrtc_flag, ad.webrtc_registered_flag, ad.webrtc_registered_duration, ucd.sticky_type, (SELECT (CASE WHEN COUNT(1) > '0' THEN 'available' ELSE 'off_hours' END) AS STATUS FROM agent_details_timing adt WHERE adt.days_week = UPPER(DATE_FORMAT(:currentDate, '%a')) AND adt.agent_id = ad.agent_id AND (CASE WHEN adt.in_time > adt.out_time THEN (DATE_FORMAT(adt.in_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.in_time,'%T') < DATE_FORMAT(:currentDate, '%T') END) AND (CASE WHEN adt.in_time > adt.out_time THEN (DATE_FORMAT(adt.out_time, '%T') < DATE_FORMAT(:currentDate, '%T') OR DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T')) ELSE DATE_FORMAT(adt.out_time, '%T') > DATE_FORMAT(:currentDate, '%T') END)) AS agent_status FROM unique_customer_detail  AS ucd LEFT JOIN agent_details AS ad ON ucd.assigned_agent_id = ad.agent_id AND ad.`status`!=-9 AND ad.agent_id NOT IN (1,2) LEFT JOIN agent_group_mapping AS agm  ON  ad.agent_id = agm.agent_id LEFT JOIN agent_group_detail AS agd ON agd.group_id = agm.group_id WHERE  SUBSTRING(TRIM(ucd.customer_number), -10) = SUBSTRING(:callingNumber, -10) AND ucd.sme_id = :sme_id ORDER BY ucd.insert_date_time desc LIMIT 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {sme_id: where["sme_id"], currentDate: where["currentDate"], callingNumber: payload["callingNumber"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindAssignedAgentIdIvrCalls', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindLongcodeType(where: any, callback: any) {
  try {
    let Query =
      "SELECT lc.id,lc.longcode,lc.status,lc.location,lc.type,lc.operator,lc.number_type, ks.name as site_name, lc.site_identifier from longcodes as lc left join kommuno_sites as ks on ks.id = lc.site_identifier where  SUBSTRING(TRIM(lc.longcode), -10) = SUBSTRING(:longcode, -10) limit 1";
    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], longcode: where["longcode"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindLongcodeType', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}


/** find longcodes*/
export async function FindVirtualLongcode(where: any, payload:any, callback: any) {
  try {
    let Query =
      "SELECT lc.id,lc.longcode,lc.status,lc.location,lc.type,lc.operator,lc.number_type,ks.name as site_name FROM longcodes lc INNER JOIN longcodes_sme_mapping lsm ON lsm.longcode_id = lc.id left join kommuno_sites as ks on ks.id = lc.site_identifier WHERE lsm.sme_id = :sme_id and lc.status !=0 and lc.number_type !='did' and lc.site_identifier =:site_id  order by lc.status desc limit 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], site_id: payload["site_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}
export async function FindAllVirtualNumbers(where: any, callback: any) {
  try {
    let Query =
      "SELECT id,longcode,status,location,type,operator,number_type FROM longcodes lc INNER JOIN longcodes_sme_mapping lsm ON lsm.longcode_id = lc.id WHERE lsm.sme_id = :sme_id ";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindagentAssignedLongcode(where: any, callback: any) {
  try {
    let Query =
      "SELECT lc.id,lc.longcode, lc.STATUS,lc.location, lc.TYPE,lc.operator,lc.number_type,lsm.agent_id FROM longcodes lc INNER JOIN longcodes_agent_mapping lsm ON lsm.longcode_id = lc.id WHERE lc.longcode = :longcode AND lc.status =1 AND lc.number_type !='did' LIMIT 1 ";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { longcode: where["longcode"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindagentNonWorkingDays(where: any, callback: any) {
  try {
    let Query =
      "SELECT tsr.file_path,tsr.directory_path, tsr.transcode_status, tsr.file_name, tsr.`type`, mpbx.non_working_days,mpbx.redirect_to_voicemail,mpbx.mode_from, mpbx.mon,mpbx.tue,mpbx.wed,mpbx.thu,mpbx.fri,mpbx.sat,mpbx.sun FROM mpbx_non_working_days AS mpbx left join text_to_speech_record AS tsr ON tsr.id = mpbx.text_to_speech_id WHERE mpbx.sme_id=:sme_id limit 1 ";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindagentNonWorkingHours(where: any, callback: any) {
  try {
    let Query =
      "SELECT tsr.file_path,tsr.directory_path,tsr.file_name, tsr.transcode_status, tsr.`type`, mpbx.non_working_hours,mpbx.in_time,mpbx.out_time,mpbx.redirect_to_voicemail, mpbx.mode_from FROM mpbx_non_working_hours AS mpbx LEFT JOIN text_to_speech_record AS tsr ON tsr.id = mpbx.text_to_speech_id WHERE mpbx.sme_id=:sme_id limit 1  ";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindAllSmeIvrPlan(where: any, callback: any) {
  try {
    let Query =
      "SELECT  DATEDIFF(DATE(spm.expiration_date_time), CURDATE()) AS validay_days_left, spm.package_id ,spm.amount , spm.discount, spm.discount_amount,pp.call_type, spm.minutes ,spm.no_of_calls,spm.unlimited_calls,spm.agent_limit , spm.validity_months, spm.activate_date_time,spm.expiration_date_time, spm.payment_by, spm.pack_type from sme_package_mapping as spm left join product_package as pp on  spm.package_id =pp.id WHERE spm.sme_id=:sme_id limit 1  ";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

  

export async function updateSmeCallsBalnce(where: any,  callback: any) {
  try {
    var Query ='';
    if(where['type'] == 'minute'){
       //Query = "UPDATE sme_package_mapping SET minutes= CASE WHEN (minutes - "+ where['totalMinutes']+ ") < 0 THEN 0 ELSE (minutes - "+ where['totalMinutes']+ ") END  WHERE sme_id = :sme_id limit 1";

       Query = "UPDATE sme_package_mapping SET minutes= minutes - "+ where['totalMinutes']+ "  WHERE sme_id = :sme_id limit 1";
        
    }else if(where['type'] == 'call'){
     // Query = "UPDATE sme_package_mapping SET no_of_calls= CASE WHEN (no_of_calls -1) < 0 THEN 0 ELSE (no_of_calls - 1) END WHERE sme_id = :sme_id limit 1";

       Query = "UPDATE sme_package_mapping SET no_of_calls= no_of_calls -1 WHERE sme_id = :sme_id limit 1";
    }
   
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {  sme_id: where["sme_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'updateSmeCallsBalnce', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function getSmeProfileData(where: any, callback: any) {
  try {
    let Query =
      "SELECT  default_lead_sticky FROM sme_profile WHERE id = :sme_id limit 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getAgentDetailsData(where: any, callback: any) {
  try {
    let Query =
      "SELECT agent_id, sme_id, agent_name, agent_mobile FROM agent_details WHERE sme_id = :smeId and RIGHT(agent_mobile ,10) = RIGHT(:agentNumber ,10) limit 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], agentNumber: where["agentNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getSmeRecordData(where: any, callback: any) {
  try {
    let Query =
      "SELECT  password FROM users WHERE username = :userName limit 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { userName: where["userName"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindAgentDetailById(where: any, callback: any) {
  try {
    let Query = "SELECT sme_id, agent_email, agent_name, agent_mobile, status  from agent_details where  agent_id =:agent_id LIMIT 1";
    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agent_id: where["agent_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'FindAgentEmail', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateOutgoingCampaign(where: any, callback: any) {
  try {
    let updateCount;
    if(where["call_status_v2"] =='1'){
      updateCount= "success_count =success_count+1";
    }else if (where["call_status_v2"] =='3'){
      updateCount= "error_count =error_count+1";
    }else if(where["call_status_v2"] =='2'){
      updateCount= "failed_count =failed_count+1";
    }
    let Query =
      "update outgoing_campaign set "+updateCount+" where sme_id =:sme_id and id = :campaign_id limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        sme_id: where["sme_id"],
        campaign_id: where["campaign_id"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateClick2Call', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function UpdateDialersNumbers(where: any, callback: any) {
  try {
   
    let Query =
      "update upload_dialer_numbers set call_status=:call_status, response_msg = :response_msg where sme_id =:sme_id and campaign_id =:campaign_id and session_id=:session_id limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        sme_id: where["sme_id"],
        campaign_id: where["campaign_id"],
        session_id: where["session_id"],
        response_msg: where["response_msg"],
        call_status: where["call_status"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'UpdateClick2Call', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

// Check live call exist or not in live_calls table
export async function checkLiveCallExist(where: any, callback: any) {
  try {
    let Query = "SELECT sme_id, customer_number from live_calls where  sme_id = :sme_id AND session_id = :session_id LIMIT 1";
    let executeQuery = await sequelize_reader.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], customer_number: where["customer_number"], session_id: where["session_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'checkLiveCallExist', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

//Update recording merge status in calling_cdr

export async function updateRecordingStatusBoth(where: any, callback: any) {
  try {
    let Query = "Update calling_cdr set merge_status= 1 where sme_id =:sme_id and session_id =:session_id limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { sme_id: where["sme_id"], session_id: where["session_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", '/ivr/' + where["sme_id"] + '/updateRecordingStatusBoth', "Exception:" + error);
    callback(error, null);
    throw new Error(error);
  }
}



export async function FindSmeWiseIvrFlows(where: any, callback: any) {
  try {
    let Query =
      "SELECT * FROM mpbx_category_master WHERE id =:ivr_id  AND sme_id=:sme_id  ";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"],dtmf: where["dtmf"],ivr_id: where["ivr_id"],end_of_media_flag: where["end_of_media_flag"] ,retry: where["retry"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindchildrenOfSmeFlow(where: any,payload: any, callback: any) {
  try {
    let Query =
      "SELECT mcm.*, sq.name as queue_name, md.directory_path FROM mpbx_category_master as mcm left join sme_queue as sq on mcm.queue_id=sq.id left join media_details as md ON md.id=mcm.media_id WHERE mcm.flow_id=:flow_id and mcm.sme_id=:sme_id and mcm.parent_cat_id=:cat_id and mcm.dtmf =:dtmf limit 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"],dtmf: where["dtmf"],flow_id: payload["flow_id"], cat_id: payload["cat_id"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindchildrenOfSmeFlowDefault(where: any,payload: any, callback: any) {
  try {
    let Query =
      "SELECT mcm.*, sq.name as queue_name, md.directory_path  FROM mpbx_category_master as mcm left join sme_queue as sq on mcm.queue_id=sq.id left join media_details as md ON md.id=mcm.media_id WHERE mcm.flow_id=:flow_id and mcm.sme_id=:sme_id and mcm.parent_cat_id=:cat_id and mcm.dtmf =:dtmf limit 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"],dtmf: where["dtmf"],flow_id: payload["flow_id"], cat_id: payload["cat_id"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindchildDtmfWait(where: any,payload: any, callback: any) {
  try {
    let Query =
      "SELECT id, GROUP_CONCAT(dtmf SEPARATOR ',') AS expected_dtmf  FROM mpbx_category_master  WHERE flow_id=:flow_id and sme_id=:sme_id and parent_cat_id=:cat_id and dtmf !=99 AND event_type NOT IN('noInput','invalidInput') limit 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"],flow_id: payload["flow_id"], cat_id: payload["cat_id"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindinvalidEventFlow(where: any,payload: any, callback: any) {
  try {
   
      let Query ="  SELECT mcm.*, sq.name as queue_name, md.directory_path  FROM mpbx_category_master as mcm left join sme_queue as sq on mcm.queue_id=sq.id left join media_details as md ON md.id=mcm.media_id WHERE mcm.flow_id=:flow_id and mcm.sme_id=:sme_id and mcm.parent_cat_id=:cat_id and mcm.event_type='invalidInput' limit 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"],flow_id: payload["flow_id"], cat_id: payload["cat_id"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindNoinputEventFlow(where: any,payload: any, callback: any) {
  try {
    
      let Query ="  SELECT mcm.*, sq.name as queue_name, md.directory_path  FROM mpbx_category_master as mcm left join sme_queue as sq on mcm.queue_id=sq.id left join media_details as md ON md.id=mcm.media_id WHERE mcm.flow_id=:flow_id and mcm.sme_id=:sme_id and mcm.parent_cat_id=:cat_id and mcm.event_type='noInput' limit 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"],flow_id: payload["flow_id"], cat_id: payload["cat_id"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindNoinputEventRedirect(where: any,payload: any, callback: any) {
  try {
    let Query ="SELECT mcm.*, sq.name as queue_name, md.directory_path  FROM mpbx_category_master as mcm left join sme_queue as sq on mcm.queue_id=sq.id left join media_details as md ON md.id=mcm.media_id WHERE mcm.flow_id=:flow_id and mcm.cat_id=:redirect_id  AND mcm.sme_id=:sme_id  limit 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"],flow_id: payload["flow_id"], redirect_id: payload["redirect_id"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindInvalidEventRedirect(where: any,payload: any, callback: any) {
  try {
    

      let Query ="  SELECT mcm.*, sq.name as queue_name, md.directory_path  FROM mpbx_category_master as mcm left join sme_queue as sq on mcm.queue_id=sq.id left join media_details as md ON md.id=mcm.media_id WHERE mcm.flow_id=:flow_id and mcm.cat_id=:redirect_id  AND mcm.sme_id=:sme_id  limit 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"],flow_id: payload["flow_id"], redirect_id: payload["redirect_id"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}