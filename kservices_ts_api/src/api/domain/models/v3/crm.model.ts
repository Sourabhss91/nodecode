import { QueryTypes } from "sequelize";
import { sequelize } from "../../../config/db";
import { logger } from "../../../lib/logger";

import { addClickToCallRequest } from "../../entities/crm.entity";

/** find */
export async function addClickToCall(payload: addClickToCallRequest, where:any, callback: any) {
  try {
    let Query =
      "INSERT INTO click2call_schedule (account_sid, group_name, agent_number, call_mode, call_priority, custom_dtmf, custom_dtmf_flag, from_no, live_event, live_event_flag, media_file_flag, media_file_id, name_file_flag, name_file_id, optional_field, virtual_number, recording_flag, scheduled_date, session_id, sme_id, time_limit, to_no, status,longcode_site) VALUES (:accountSid, :agentGroup, :agentNumber, :callMode, :callPriority, :customDtmf, :customDtmfFlag, :from, :liveEvent, :liveEventFlag, :mediaFileFlag, :mediaFileId, :nameFileFlag, :nameFileId, :optionalField, :pilotNumber, :recordingFlag, :scheduleDateTime, :sessionId, :smeId, :timeLimit, :to, 0,:longcodeSiteName)  ";
      let executeQuery = await sequelize.query(Query, {
        raw: true,
        type: QueryTypes.INSERT,
        replacements: { accountSid: payload["accountSid"], agentGroup: payload["agentGroup"], agentNumber: payload["agentNumber"], callMode: payload["callMode"], callPriority: payload["callPriority"], customDtmf: payload["customDtmf"], customDtmfFlag: payload["customDtmfFlag"], from: payload["from"], liveEvent: payload["liveEvent"], liveEventFlag: payload["liveEventFlag"], mediaFileFlag: payload["mediaFileFlag"], mediaFileId: payload["mediaFileId"], nameFileFlag: payload["nameFileFlag"], nameFileId: payload["nameFileId"], optionalField: payload["optionalField"], pilotNumber: payload["pilotNumber"], recordingFlag: payload["recordingFlag"], scheduleDateTime: payload["scheduleDateTime"], sessionId: payload["sessionId"], smeId: payload["smeId"], timeLimit: payload["timeLimit"], to: payload["to"],longcodeSiteName: where["longcodeSiteName"] },
      });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/**  find */
export async function FidnAgentIdByAgentNumber(where: any, callback: any) {
  try {
    let Query =
      "select agent_id, longcode_priority_flag from agent_details where SUBSTRING(TRIM(agent_mobile), -10)  = SUBSTRING(TRIM(:agentNumber), -10) Limit 1";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agentNumber: where["agentNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** find */
export async function addClickToCallNew(payload: any,where: any, callback: any) {
  try {
    let Query =
      "INSERT INTO click2call_schedule (account_sid, group_name, agent_number, call_mode, call_priority, custom_dtmf, custom_dtmf_flag, from_no, live_event, live_event_flag, media_file_flag, media_file_id, name_file_flag, name_file_id, optional_field, virtual_number, recording_flag, scheduled_date, session_id, sme_id, time_limit, to_no, status,longcode_site_id) VALUES (:accountSid, :agentGroup, :agentNumber, :callMode, :callPriority, :customDtmf, :customDtmfFlag, :virtualNumber, :liveEvent, :liveEventFlag, :mediaFileFlag, :mediaFileId, :nameFileFlag, :nameFileId, :optionalField, :virtualNumber, :recordingFlag, :scheduleDateTime, :sessionId, :smeId, :timeLimit, :to, 0, :siteId)  ";
      let executeQuery = await sequelize.query(Query, {
        raw: true,
        type: QueryTypes.INSERT,
        replacements: { accountSid: payload["accountSid"], agentGroup: payload["agentGroup"], agentNumber: payload["agentNumber"], callMode: payload["callMode"], callPriority: payload["callPriority"], customDtmf: payload["customDtmf"], customDtmfFlag: payload["customDtmfFlag"], virtualNumber: where["virtualNumber"], liveEvent: payload["liveEvent"], liveEventFlag: payload["liveEventFlag"], mediaFileFlag: payload["mediaFileFlag"], mediaFileId: payload["mediaFileId"], nameFileFlag: payload["nameFileFlag"], nameFileId: payload["nameFileId"], optionalField: payload["optionalField"],  recordingFlag: payload["recordingFlag"], scheduleDateTime: payload["scheduleDateTime"], sessionId: payload["sessionId"], smeId: payload["smeId"], timeLimit: payload["timeLimit"], to: payload["to"],siteId: where["siteId"] },
      });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/**  find */
export async function FindSiteidVirtualNumber(where: any, callback: any) {
  try {
    let Query =
      "select site_identifier from longcodes where SUBSTRING(TRIM(longcode), -10)  = SUBSTRING(TRIM(:virtualNumber), -10) Limit 1";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agentNumber: where["agentNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/**  find */
export async function checkVirtualNumberStatus(where: any, callback: any) {
  try {
    let Query =
      "SELECT lg.id,ks.name,ks.id as site_id FROM longcodes AS lg LEFT JOIN  kommuno_sites AS ks ON ks.id=lg.site_identifier where  SUBSTRING(TRIM(lg.longcode), -10)  = SUBSTRING(TRIM(:from), -10) and lg.status !=-7 Limit 1";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { from: where["from"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function findVirtualNumberSmeWise(where: any, callback: any) {
  try {
    let Query = "SELECT  lg.longcode, lg.id, lg.site_identifier,ks.name,ks.id as site_id FROM longcodes_sme_mapping AS lgm LEFT JOIN longcodes AS lg ON lg.id =lgm.longcode_id LEFT JOIN  kommuno_sites AS ks ON ks.id=lg.site_identifier WHERE lgm.sme_id = :smeId and lg.status = 1 and lg.number_type !='did'";
    let executeQuery = await sequelize.query<any>(Query, {
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


export async function findSmeExist(where: any, callback: any) {
  try {
    let Query = "SELECT *  FROM sme_profile  WHERE id = :smeId and status = 1 limit 1";
    let executeQuery = await sequelize.query<any>(Query, {
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


export async function findAgentDetails(where: any, callback: any) {
  try {
    let Query = "SELECT  *  from agent_details WHERE sme_id = :smeId and  SUBSTRING(TRIM(agent_mobile), -10) = SUBSTRING(:agentNumber, -10)  and status != -9 limit 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], agentNumber: where["agentNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    callback(error, null);
    throw new Error(error);
  }
}

export async function findAgentLongcode(where: any, payload: any, callback: any) {
  try {
    let Query = "SELECT lg.longcode, ks.name,ks.id as site_id FROM longcodes_agent_mapping AS lgm LEFT JOIN longcodes AS lg ON lg.id =lgm.longcode_id  LEFT JOIN  kommuno_sites AS ks ON ks.id=lg.site_identifier WHERE lgm.agent_id = :agent_id and lg.status = 1 and  lg.number_type !='did'";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agent_id: payload["agent_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    callback(error, null);
    throw new Error(error);
  }
}

export async function findSmeLongcode(where: any, callback: any) {
  try {
    let Query = "SELECT  lg.longcode, ks.name,ks.id as site_id FROM longcodes_sme_mapping AS lgm LEFT JOIN longcodes AS lg ON lg.id =lgm.longcode_id LEFT JOIN  kommuno_sites AS ks ON ks.id=lg.site_identifier WHERE lgm.sme_id = :smeId and lg.status = 1 and  lg.number_type !='did'";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    callback(error, null);
    throw new Error(error);
  }
}


export async function getAgentTimeForToday(where: any, payload:any, callback: any) {
  try {
    let Query = "SELECT * from agent_details_timing  where agent_id =:agent_id  and days_week= UPPER(DATE_FORMAT(:currentDate,'%a'))  limit 1";

    
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

export async function findKomunoSitesUrlByCallMode(where: any, payload:any,callback: any) {
  try {
    let Query = "SELECT id, kommuno_sites_id,url from ivr_site_endpoint_url  where mode =:callMode  and priority=:callPriority and kommuno_sites_id =:longcodeSiteId   limit 1";

    
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { callMode: where["callMode"],callPriority: where["callPriority"],longcodeSiteId: payload["longcodeSiteId"]},
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
      "SELECT  DATEDIFF(DATE(spm.expiration_date_time), CURDATE()) AS validay_days_left, spm.package_id ,spm.amount , spm.discount, spm.discount_amount,pp.call_type, spm.minutes ,spm.no_of_calls,spm.unlimited_calls,spm.agent_limit , spm.validity_months, spm.activate_date_time,spm.expiration_date_time, spm.payment_by, spm.pack_type from sme_package_mapping as spm left join product_package as pp on  spm.package_id =pp.id WHERE spm.sme_id=:smeId limit 1  ";

    let executeQuery = await sequelize.query<any>(Query, {
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