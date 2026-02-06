import { QueryTypes } from "sequelize";
import { sequelize } from "../../../config/db";
import { logger } from "../../../lib/logger";

/**  Get all clients/sme New api */
export async function fetchSmeDataNew(where: any, callback: any) {
  try {
    var Query =
      "SELECT sp.id, sp.account_sid AS accountSid, sp.name AS smeName, sp.allowed_agents AS allowedAgents, sp.email_id AS emailId, sp.sme_mobile AS smeMobile, sp.alternate_number AS alternateNumber, sp.status, sp.`language`, sp.biz_address AS bizAddress, sp.recording, sp.masking, sp.voicemail, sp.sticky_algo AS stickyAlgo, sp.balance AS clientBalance, sp.zone_id AS zoneId, sp.selection_algo AS selectionAlgo, sp.rec_validity AS recValidity, sp.queue_limit AS queueLimit, sp.out_permission_flag AS outPermissionFlag, sp.out_channels AS outgoingChannel,sp.in_permission_flag AS inPermissionFlag, sp.in_channels AS incomingChannel, sp.call_flow_limit AS callFlowLimit,sp.primary_site AS primarySiteId, sp.secondary_site AS secondarySiteId, sp.end_call_notification_flag AS endCallNotification, sp.agent_break_notifcation AS agent_break_notifcation, sp.agent_break_notification_time AS agent_break_notification_time, sp.agent_break_notification_email AS agent_break_notification_email, sp.autodialer_permission_flag AS autoDialerPermissionFlag, sp.autodialer_channel AS autoDialerChannel, sp.webrtc_permission_flag AS webrtcPermissionFlag, sp.webrtc_channel AS webrtcChannel, sp.text_to_speech_permission_flag AS textSpeechPermissionFlag, sp.text_to_speech_count AS textSpeechChannel, sp.incoming_agent AS incomingAgent, sp.outgoing_agent AS outgoingAgent, sp.lead_manager_permission_flag AS leadManagerPermissionFlag, sp.edit_agent_details_permission_flag AS editAgentDetailsPermissionFlag,sp.live_events,sp.crm_flag AS crmIntegration,sp.call_mode, (SELECT CONCAT('[', GROUP_CONCAT(lc.longcode), ']') FROM longcodes lc INNER JOIN longcodes_sme_mapping lsm ON lsm.longcode_id = lc.id  WHERE lsm.sme_id = sp.id) AS longcodesjson,(  SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('idp', lm.primary_longcode, 'idp_val', lm.primary_longcode_id,'ids', lm.secondary_longcode,'ids_val', lm.secondary_longcode_id)), ']')  FROM longcode_mapping lm  WHERE lm.sme_id = sp.id) AS longCodes,spm.id AS packageMapId,spm.package_id AS packId, spm.discount AS planDiscount, spm.discount_amount AS planDicountedPrice, spm.package_quantity AS packQuantity, DATE_FORMAT(spm.activate_date_time, '%Y-%m-%d %H:%i') AS planActivateTime, DATE_FORMAT(spm.expiration_date_time, '%Y-%m-%d %H:%i') AS planExpirationTime, spm.validity_months,spm.payment_by, sp.billing_status AS billingStatus, scd.crm_partner AS crmPartner, scd.recording_url AS crmRecordingUrl, scd.recording_auth_token AS crmRecordingAuthToken,  scd.recording_url_provider AS crmRecordingUrlProvider, scd.outgoing_url AS crmOutgoingUrl, scd.outgoing_auth_token AS crmOutgoingAuthToken, scd.outgoing_url_provider AS crmOutgoingUrlProviders,  scd.incoming_url AS crmIncomingUrl, scd.incoming_auth_token AS crmIncomingToken, scd.incoming_url_provider AS crmIncomingUrlProvider,     scd.call_popup_url AS crmCallPopupUrl , scd.call_popup_auth_token AS crmCallPopupAuthToken, scd.call_popup_provider AS crmCallPopupProvider, scd.pushsms_url AS crmPushSmsUrl,  scd.pushsms_auth_token AS crmPushSmsAuthToken, scd.sms_provider AS crmPushSmsProvider, sp.search_longcode_random as randomSearchLongcode,COALESCE(ssm.balance,0) as smsBalance, sp.parallel_ringing_channels, sp.user_version as userVersion, sp.whatsapp_permission as whatsappPermissionFlag, sp.whatsapp_template_limit as whatsappLimit FROM sme_profile sp  LEFT JOIN sme_package_mapping AS spm ON sp.id=spm.sme_id  LEFT JOIN sme_crm_details AS scd ON sp.id=scd.sme_id LEFT JOIN sme_sms_mapping AS ssm ON sp.id=ssm.sme_id ORDER BY sp.id ASC";

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


/**  Get all clients/sme */
export async function fetchSmeData(where: any, callback: any) {
  try {
    var Query =
      "SELECT sp.id, sp.name AS smeName, sp.allowed_agents AS allowedAgents, sp.email_id AS emailId, sp.sme_mobile AS smeMobile, sp.alternate_number AS alternateNumber, sp.status, sp.`language`, sp.biz_address AS bizAddress, sp.recording, sp.masking, sp.voicemail, sp.sticky_algo AS stickyAlgo, sp.balance AS clientBalance, sp.zone_id AS zoneId, sp.selection_algo AS selectionAlgo, sp.rec_validity AS recValidity, sp.queue_limit AS queueLimit, sp.out_permission_flag AS outPermissionFlag, sp.out_channels AS outChannels, sp.call_flow_limit AS callFlowLimit, (SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('longcode', lc.longcode, 'id', lc.id,'status', lc.status)), ']') FROM longcodes lc INNER JOIN longcodes_sme_mapping lsm ON lsm.longcode_id = lc.id WHERE lsm.sme_id = sp.id) AS longcodesjson FROM sme_profile sp ";

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


/**  Get pending longcodes*/
export async function getPendingLongcodesData(where: any, callback: any) {
  try {
    var Query = "SELECT l.id, l.longcode as longCode, l.`status` FROM longcodes l WHERE l.`status` = 0;";

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

/**  Get pending longcodes*/
export async function getZonesData(where: any, callback: any) {
  try {
    var Query = "SELECT id, zone_name as zoneName, zone_code as zoneCode, status FROM zones";

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

/** check sme email exist*/
export async function checkSmeEmailExist(where: any, callback: any) {
  try {
    let Query = "Select email_id from sme_profile where email_id = :emailId and status != 0 limit 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { emailId: where["emailId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** Get max sme id*/
export async function getMaxSmeId(where: any, callback: any) {
  try {
    let Query = "Select seq_col_value from sequence_gen where seq_col_name = 'sme_profile_seq'";
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

/** add user  */
export async function addUser(payload: any, where:any, callback: any) {
  try {
    let Query = "INSERT INTO users (username, password, enabled) VALUES (:smeId, :password, '0')";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { smeId: payload["smeId"], password: where["password"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** add user role */
export async function addUserRole(where: any, payload: any, callback: any) {
  try {
    let Query = "INSERT INTO user_roles (user_role_id, username, ROLE) select MAX(user_role_id)+1, :smeId, :role FROM user_roles";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { smeId: where["smeId"], role: payload["role"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** Add sme  */
export async function addSmeDataNew(where: any, payload: any, callback: any) {
  try {
    let Query = "INSERT INTO sme_profile (id, name, email_id, sme_mobile, alternate_number, status, insert_time, zone_id,  biz_address,queue_limit,balance,language,billing_status) VALUES (:sme_id, :smeName, :emailId, :smeMobile, :alternateNumber, 2, :insertDateTime, :zoneId,  :bizAddress, :queueLimit,0,1,0 )";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { sme_id: where["smeId"], smeName: payload["smeName"], emailId: payload["emailId"], smeMobile: payload["smeMobile"], alternateNumber: payload["alternateNumber"],   insertDateTime: payload["insertDateTime"], zoneId: payload["zoneId"],  bizAddress: payload["bizAddress"],queueLimit: payload["queueLimit"]  },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function updateSmeAgentsdetails(where: any,  callback: any) {
  try {
    let Query = "update sme_profile set allowed_agents = :allowedAgents, out_channels = :outgoingChannel, in_channels = :incomingChannel, webrtc_channel = :webrtcChannel, text_to_speech_count = :textSpeechChannel, autodialer_channel = :autodialer,update_time=:getCurrentDate WHERE id = :smeId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { smeId: where["smeId"], allowedAgents: where["allowedAgents"], autodialer: where["autodialer"], webrtcChannel: where["webrtcChannel"], textSpeechChannel: where["textSpeechChannel"],  incomingChannel: where["incomingChannel"], outgoingChannel: where["outgoingChannel"],getCurrentDate: where["getCurrentDate"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** Add sme  */
export async function addSmeData(where: any, payload: any, callback: any) {
  try {
    let Query = "INSERT INTO sme_profile (id, name, email_id, sme_mobile, alternate_number, allowed_agents, status, insert_time, zone_id, balance, recording, masking, voicemail, selection_algo, biz_address, language, billing_status, rec_validity, account_sid, sticky_algo, in_permission_flag, out_permission_flag, queue_limit, out_channels, call_flow_limit) VALUES (:sme_id, :smeName, :emailId, :smeMobile, :alternateNumber, :allowedAgents, :status, :insertDateTime, :zoneId, :balance, :recording, :masking, :voicemail, :selectionAlgo, :bizAddress, :language, :billingStatus, :recValidity, :accountSid, :stickyAlgo, :inPermissionFlag, :outPermissionFlag, :queueLimit, :outChannels, :callFlowLimit)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { sme_id: where["smeId"], smeName: payload["smeName"], emailId: payload["emailId"], smeMobile: payload["smeMobile"], alternateNumber: payload["alternateNumber"], allowedAgents: payload["allowedAgents"], status: payload["status"], insertDateTime: payload["insertDateTime"], zoneId: payload["zoneId"], balance: payload["balance"], recording: payload["recording"], masking: payload["masking"], voicemail: payload["voicemail"], selectionAlgo: payload["selectionAlgo"], bizAddress: payload["bizAddress"], language: payload["language"], billingStatus: payload["billingStatus"], recValidity: payload["recValidity"], accountSid: payload["accountSid"], stickyAlgo: payload["stickyAlgo"], inPermissionFlag: payload["inPermissionFlag"], outPermissionFlag: payload["outPermissionFlag"], queueLimit: payload["queueLimit"], outChannels: payload["outChannels"], callFlowLimit: payload["callFlowLimit"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** update sequence gen*/
export async function updateSequenceGen(where: any, callback: any) {
  try {

    let Query = "update sequence_gen set seq_col_value = :smeId WHERE seq_col_name = 'sme_profile_seq'";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        smeId: where["smeId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** add sme longcodes New api*/
export async function addSmelongcodesNew(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO longcodes_sme_mapping (sme_id, longcode_id) values (:smeId, :longcodePrimaryId)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { smeId: payload["smeId"], longcodePrimaryId: payload["longcodePrimaryId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** add sme longcodes */
export async function addSmelongcodes(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO longcodes_sme_mapping (sme_id, longcode_id, insert_date_time) values (:smeId, :longcode,now())";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { smeId: payload["smeId"], longcode: payload["longcode"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** update longcode status New api*/
export async function updateLongcodesStatusNew(where: any, callback: any) {
  try {

    let Query = "update longcodes set status = 1 WHERE id IN(:longcodePrimaryId,:longcodeSecondaryId) ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        longcodePrimaryId: where["longcodePrimaryId"],
        longcodeSecondaryId: where["longcodeSecondaryId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** update longcode status*/
export async function updateLongcodesStatus(where: any, callback: any) {
  try {

    let Query = "update longcodes set status = 1 WHERE id = :id";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        id: where["longcode"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}



/** update sme/client status*/
export async function updateSmeData(payload: any, callback: any) {
  try {

    let Query = "update sme_profile set name = :smeName, sme_mobile = :smeMobile, alternate_number = :alternateNumber, allowed_agents = :allowedAgents, status = :status, rec_validity = :recValidity, zone_id = :zoneId, balance = :balance, recording = :recording, masking = :masking, voicemail = :voicemail, selection_algo = :selectionAlgo, biz_address = :bizAddress, language = :language, billing_status = :billingStatus, insert_time = :insertDateTime, account_sid = :accountSid, sticky_algo = :stickyAlgo, in_permission_flag = :inPermissionFlag, out_permission_flag = :outPermissionFlag, queue_limit = :queueLimit, out_channels = :outChannels, call_flow_limit = :callFlowLimit WHERE id = :smeId";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        smeId: payload["smeId"], smeName: payload["smeName"], smeMobile: payload["smeMobile"], alternateNumber: payload["alternateNumber"], allowedAgents: payload["allowedAgents"], status: payload["status"], insertDateTime: payload["insertDateTime"], zoneId: payload["zoneId"], balance: payload["balance"], recording: payload["recording"], masking: payload["masking"], voicemail: payload["voicemail"], selectionAlgo: payload["selectionAlgo"], bizAddress: payload["bizAddress"], language: payload["language"], billingStatus: payload["billingStatus"], recValidity: payload["recValidity"], accountSid: payload["accountSid"], stickyAlgo: payload["stickyAlgo"], inPermissionFlag: payload["inPermissionFlag"], outPermissionFlag: payload["outPermissionFlag"], queueLimit: payload["queueLimit"], outChannels: payload["outChannels"], callFlowLimit: payload["callFlowLimit"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/**  Get all longcodes*/
export async function getAllLongcodesData(where: any, callback: any) {
  try {
    var Query = "SELECT l.*, ks.name as site_name FROM longcodes as l LEFT JOIN kommuno_sites AS ks ON ks.id=l.site_identifier where l.status !=1 order by l.id desc";

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

/**  Get all longcodes*/
export async function getAllActiveLongcodesData(where: any, callback: any) {
  try {
    var Query = "SELECT l.*,ks.name,lsm.self_id  FROM longcodes AS l  LEFT JOIN longcodes_sme_mapping AS lsm ON l.id = lsm.longcode_id  LEFT JOIN kommuno_sites AS ks ON ks.id=l.site_identifier WHERE l.status =0 OR (l.status =1 OR l.status =-7) AND lsm.sme_id =:sme_id  ";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** add sme lead source longcodes */
export async function addLeadSource(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO lead_source (source, description, created_by, status, insert_date_time, update_date_time) values (:leadSource, :description, :smeId, 1, :insertDateTime, :insertDateTime)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { leadSource: payload["leadSource"], description: payload["description"], smeId: payload["smeId"], insertDateTime: payload["insertDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindAllProductPackage(where: any, callback: any) {
  try {
    var Query = "SELECT id, amount, name,description, status, subscription_type, call_type,minutes,no_of_calls,unlimited_pack,agent_limit, insert_date_time,pack_type FROM product_package where status = 1 ";

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


/** Assign product sme  */
export async function assignProductToSme(where: any,payload:any, callback: any) {
  try {
    let Query = "INSERT INTO sme_package_mapping (sme_id, package_id,  insert_date_time,amount,minutes,no_of_calls,unlimited_calls,agent_limit,package_quantity,activate_date_time,expiration_date_time, validity_months, payment_by,package_status,pack_type ) VALUES (:sme_id, :packId,  :insertDateTime,  :planActualPrice, :minutes, :no_of_calls,:unlimitedCalls,:agentLimit,1,:insertDateTime,:planExpiration_date,:planValidity,:paymentDoneBy,1,:pack_type )";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { sme_id: where["smeId"], packId: where["packId"],  insertDateTime: where["insertDateTime"], planActualPrice: where['planActualPrice'],
      minutes: payload['minutes'],no_of_calls: payload['no_of_calls'],unlimitedCalls: payload['unlimitedCalls'],agentLimit: payload['agentLimit'], planExpiration_date: where["planExpiration_date"],planValidity: where["planValidity"], paymentDoneBy: where["paymentDoneBy"],pack_type: payload["pack_type"] },
    });

    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function getSingleProductDetail(where: any, callback: any) {
  try {
    var Query = "SELECT id, amount, name,description, status, subscription_type,call_type,minutes,no_of_calls,unlimited_pack,agent_limit, insert_date_time,pack_type FROM product_package where status = 1 and id=:packId limit 1 ";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {packId: where["packId"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function enabledSmeAccount(where: any, callback: any) {
  try {

    let Query = "update users set enabled = 1 WHERE username = :smeId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        smeId: where["smeId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdatePaymentHistory(where: any, callback: any) {
  try {
    let Query = "INSERT INTO payment (sme_id, pack_id, amount, status, package_type, insert_date_time,order_id) VALUES (:sme_id, :packId, :amountPaid, 'Success', 'IVR',  :insertDateTime,:orderID)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { sme_id: where["smeId"], packId: where["packId"],  insertDateTime: where["insertDateTime"], planValidity: where['planValidity'],amountPaid: where['amountPaid'],orderID: where['orderID']},
    });

    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function findSmePassword(where: any, callback: any) {
  try {
    var Query = "SELECT u.password,sp.email_id, sp.name FROM users AS u LEFT JOIN sme_profile AS sp ON u.username=sp.id WHERE u.username =:sme_id LIMIT 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {sme_id: where["smeId"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** update sme/client Permission*/
export async function UpdateAgentRequirements(payload: any, callback: any) {
  try {

    let Query = "update sme_profile set  in_permission_flag = :inPermissionFlag, out_permission_flag = :outPermissionFlag, out_channels=:outgoingChannel,in_channels=:incomingChannel, autodialer_channel=:autoDialerChannel, autodialer_permission_flag=:autoDialerPermissionFlag, webrtc_channel=:webrtcChannel,webrtc_permission_flag=:webrtcPermissionFlag,  allowed_agents=:allowedAgents,incoming_agent=:incomingAgent , outgoing_agent=:outgoingAgent, parallel_ringing_channels=:parallel_ringing_channels WHERE id = :smeId limit 1";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        smeId: payload["smeId"], inPermissionFlag: payload["inPermissionFlag"], outPermissionFlag: payload["outPermissionFlag"], outgoingChannel: payload["outgoingChannel"],incomingChannel: payload["incomingChannel"],autoDialerPermissionFlag: payload["autoDialerPermissionFlag"],autoDialerChannel: payload["autoDialerChannel"], webrtcChannel: payload["webrtcChannel"], webrtcPermissionFlag: payload["webrtcPermissionFlag"], allowedAgents: payload["allowedAgents"], incomingAgent: payload["incomingAgent"], outgoingAgent: payload["outgoingAgent"], parallel_ringing_channels: payload["parallel_ringing_channels"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** update sme/client Notification Permission*/
export async function updateSmeNotifyPermission(payload: any, callback: any) {
  try {

    let Query = "update sme_profile set  end_call_notification_flag = :endCallNotification  WHERE id = :smeId limit 1";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        smeId: payload["smeId"], endCallNotification: payload["endCallNotification"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindAllkommunoSites(where: any, callback: any) {
  try {
    var Query = "SELECT id, name FROM kommuno_sites where status = 1 ";

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

export async function findSiteWiseLongcode(where: any, callback: any) {
  try {
    var Query = "SELECT l.id, l.longcode as longCode, l.`status` FROM longcodes l WHERE l.`status` = 0 and l.`site_identifier` =:siteId";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { siteId: where["siteId"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** update sme/client Permission*/
export async function updateSmeSelectedSites(payload: any, callback: any) {
  try {

    let Query = "update sme_profile set  primary_site = :primarySiteId, secondary_site = :secondarySiteId WHERE id = :smeId limit 1";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        smeId: payload["smeId"], primarySiteId: payload["primarySiteId"], secondarySiteId: payload["secondarySiteId"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function addSMEHuntingNumbers(where: any, callback: any) {
  try {
    let Query = "INSERT INTO longcode_mapping (sme_id, primary_longcode_id, secondary_longcode_id,  insert_date_time,primary_longcode,secondary_longcode) VALUES (:smeId, :longcodePrimaryId, :longcodeSecondaryId,   :insertDateTime,:primaryLongcode, :secondaryLongcode)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { smeId: where["smeId"], longcodePrimaryId: where["longcodePrimaryId"], longcodeSecondaryId: where["longcodeSecondaryId"],  insertDateTime: where["insertDateTime"],primaryLongcode: where["primaryLongcode"],secondaryLongcode: where["secondaryLongcode"]},
    });

    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function deleteSMEHuntingNumbers(where: any, callback: any) {
  try {
    var Query = "Delete FROM longcode_mapping where sme_id = :smeId";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: {smeId: where["smeId"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindSmeMapLongcodeExist(where: any, callback: any) {
  try {
    var Query = "SELECT self_id FROM longcodes_sme_mapping where longcode_id = :longcodePrimaryId limit 1 ";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {longcodePrimaryId: where["longcodePrimaryId"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function findSmeExistingpackage(where: any, callback: any) {
  try {
    var Query = "Select * FROM sme_package_mapping where sme_id = :smeId limit 1";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {smeId: where["smeId"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** update sme/client Permission*/
export async function upgradeSmeproduct(where: any,payload:any, callback: any) {
  try {

    let Query = "update sme_package_mapping set package_id=:packId, amount =:planActualPrice,minutes=:minutes,no_of_calls=:no_of_calls,unlimited_calls=:unlimitedCalls,agent_limit=:agentLimit, activate_date_time=:insertDateTime, expiration_date_time =:planExpiration_date, validity_months=:planValidity,payment_by=:paymentDoneBy, package_status=1, pack_type=:pack_type  WHERE sme_id = :smeId limit 1";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        smeId: where["smeId"], packId: where["packId"], planActualPrice: where['planActualPrice'],
        minutes: payload['minutes'],no_of_calls: payload['no_of_calls'],unlimitedCalls: payload['unlimitedCalls'],agentLimit: payload['agentLimit'], planExpiration_date: where["planExpiration_date"],planValidity: where["planValidity"],insertDateTime: where["insertDateTime"],paymentDoneBy: where["paymentDoneBy"],pack_type: payload["pack_type"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function updateAccountSID(where: any, callback: any) {
  try {

    let Query = "update sme_profile set account_sid =:accountSid WHERE id=:smeId ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        accountSid: where["accountSid"],
        smeId: where["smeId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}



/** update sme/client step1 when we create new client and move back to step 1 */
export async function updateSmeStep1(payload: any, callback: any) {
  try {

    let Query = "update sme_profile set name = :smeName, sme_mobile = :smeMobile, alternate_number = :alternateNumber,   zone_id = :zoneId,   biz_address = :bizAddress,   queue_limit = :queueLimit WHERE id = :smeId";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        smeId: payload["smeId"], smeName: payload["smeName"], smeMobile: payload["smeMobile"], alternateNumber: payload["alternateNumber"],  zoneId: payload["zoneId"],  bizAddress: payload["bizAddress"],  queueLimit: payload["queueLimit"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** update sme/client plan validity on final step  */
export async function UpdatePlanValidity(payload: any, callback: any) {
  try {

    let Query = "update sme_package_mapping set activate_date_time=:insertDateTime, expiration_date_time =:planExpiration_date, validity_months=:planValidity,payment_by=:paymentDoneBy, package_status=1  WHERE sme_id = :smeId limit 1";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        smeId: payload["smeId"],  planExpiration_date: payload["planExpiration_date"],planValidity: payload["planValidity"],insertDateTime: payload["insertDateTime"],paymentDoneBy: payload["paymentDoneBy"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** update sme/client Update Client Satus  */
export async function UpdateClientSatus(payload: any, callback: any) {
  try {

    let Query = "update sme_profile set status=:status, billing_status=:billingStatus WHERE id = :smeId limit 1";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        smeId: payload["smeId"],  
        billingStatus: payload["billingStatus"],
        status: payload["status"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}




export async function findAllClients(payload: any, callback: any) {
  try {
    var  filterUserId ='';
    // if(payload["filterUserId"] !='all'){
    //   filterUserId =  ' where id in ('+payload["filterUserId"]+')';
    // }

    let Query = "SELECT COUNT(*) AS total_count, SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS active_count, SUM(CASE WHEN status = 0 || status = 2 THEN 1 ELSE 0 END) AS inactive_count FROM sme_profile"+filterUserId;
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        smeId: payload["smeId"],startDate: payload["startDate"],endDate: payload["endDate"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function findAllAgents(payload: any, callback: any) {
  try {
    var  filterUserId ='';
    if(payload["filterUserId"] !='all'){
      filterUserId =  ' where sme_id in ('+payload["filterUserId"]+')';
    }
    let Query = "SELECT COUNT(*) AS total_agent, SUM(CASE WHEN status = 1 OR STATUS = 2 OR STATUS = 4 THEN 1 ELSE 0 END) AS activeAgent, SUM(CASE WHEN status = 0 OR status = -9 THEN 1 ELSE 0 END) AS inactiveAgent, SUM(CASE WHEN status = -9 THEN 1 ELSE 0 END) AS deletedAgent FROM agent_details "+filterUserId;
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        smeId: payload["smeId"],startDate: payload["startDate"],endDate: payload["endDate"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}



/** find system detail graph*/
export async function FindSystemDetailGraph(where: any, callback: any) {
  try {

    var  filterUserId ='';
    if(where["filterUserId"] !='all'){
      filterUserId =  ' and sme_id in ('+where["filterUserId"]+')';
    }
    let Query =
      "SELECT date_time, SUM(case when service_id = 11 then total_calls else 0 end) as voicemail, SUM(case when service_id = 1 then total_calls else 0 end) as totalIncoming, SUM(case when service_id = 2 then total_calls else 0 end) as totalOutgoing, SUM(case when service_id = 15 then total_calls else 0 end) as incomingFailed, SUM(case when service_id = 25 then total_calls else 0 end) as outgoingFailed, SUM(case when service_id = 16 then total_calls else 0 end) as incomingSuccess, SUM(case when service_id = 26 then total_calls else 0 end) as outgoingSuccess, SUM(case when service_id = 3 then total_calls else 0 end) as recording FROM revenue_details where  date_time BETWEEN :startDate and  :endDate "+ filterUserId;
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {  startDate: where["startDate"], endDate: where["endDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function findAllSmeList(payload: any, callback: any) {
  try {
   

    let Query = "SELECT id, name  FROM sme_profile ORDER BY insert_time DESC ";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function updateSMEStatus(payload: any, callback: any) {
  try {

    let Query = "update sme_profile set status =:status, update_time=:getCurrentDate WHERE id =:smeId";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        smeId: payload["smeId"], status: payload["status"], getCurrentDate: payload["getCurrentDate"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** update sme/client Permission*/
export async function updateNewSmePermission(payload: any, callback: any) {
  try {

    let Query = "update sme_profile set  recording = :recording, masking = :masking, voicemail = :voicemail, text_to_speech_count=:textSpeechChannel,text_to_speech_permission_flag=:textSpeechPermissionFlag , sticky_algo = :stickyAlgo, selection_algo = :selectionAlgo, lead_manager_permission_flag=:leadManagerPermissionFlag , edit_agent_details_permission_flag=:editAgentDetailsPermissionFlag, call_flow_limit =:callFlowLimit, search_longcode_random=:randomSearchLongcode, whatsapp_permission =:whatsappPermissionFlag, user_version =:userVersion, whatsapp_template_limit = :whatsappLimit WHERE id = :smeId limit 1";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        smeId: payload["smeId"], recording: payload["recording"], masking: payload["masking"], voicemail: payload["voicemail"], textSpeechChannel: payload["textSpeechChannel"], textSpeechPermissionFlag: payload["textSpeechPermissionFlag"], selectionAlgo: payload["selectionAlgo"], stickyAlgo: payload["stickyAlgo"],leadManagerPermissionFlag: payload["leadManagerPermissionFlag"], editAgentDetailsPermissionFlag: payload["editAgentDetailsPermissionFlag"], callFlowLimit: payload["callFlowLimit"] , randomSearchLongcode: payload["randomSearchLongcode"], userVersion: payload["userVersion"], whatsappPermissionFlag: payload["whatsappPermissionFlag"], whatsappLimit: payload["whatsappLimit"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function AssignSmeLongcodes(where: any, callback: any) {
  try {

    let Query = "update longcodes set status = 1 WHERE id = :id";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        smeId: where["smeId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function removeLongcodeSme(where: any, callback: any) {
  try {
    var Query = "Delete FROM longcodes_sme_mapping where sme_id = :smeId and longcode_id=:longcode limit 1";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: {smeId: where["smeId"],longcode: where["longcode"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function removeLongcodeSmeAgentMap(where: any, callback: any) {
  try {
    var Query = "Delete FROM longcodes_agent_mapping where longcode_id=:longcode limit 1";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: {smeId: where["smeId"],longcode: where["longcode"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function updateLongcodesSMEStatus(where: any, callback: any) {
  try {

    let Query = "update longcodes set status = 0 WHERE id = :longcode";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        longcode: where["longcode"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** update sme/client Balance*/
export async function updateSmeBalanceData(payload: any, callback: any) {
  try {

    let Query = "update sme_profile set  billing_status = :billingStatus  WHERE id = :smeId limit 1";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        smeId: payload["smeId"], billingStatus: payload["billingStatus"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindDataCenter (where: any, callback: any) {
  try {
    var Query = "SELECT id, name,location FROM datacenter_enum where status = 1 ";

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

export async function  FindTeleOperator(where: any, callback: any) {
  try {
    var Query = "SELECT id, name FROM telco_operator_enum where status = 1 ";

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



/** add user  */
export async function InsertLongcode(payload: any,  callback: any) {
  try {
    let Query = "INSERT INTO longcodes (longcode, insert_time, status,location,type,operator,number_type,site_identifier,dc) VALUES (:longCode, :insertDateTime, '0',:location, :type, :operatorName,:numberType, :siteId, :dataCenter)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { longCode: payload["longCode"], insertDateTime: payload["insertDateTime"],location: payload["location"], type: payload["type"],operatorName: payload["operatorName"], numberType: payload["numberType"],siteId: payload["siteId"], dataCenter: payload["dataCenter"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function  FindLongcodeExist(where: any, callback: any) {
  try {
    var Query = "SELECT id FROM longcodes where SUBSTRING(TRIM(longcode), -10)  = SUBSTRING(TRIM(:longCode), -10) limit 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { longCode: where["longCode"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function  FindlocationOperator(where: any, callback: any) {
  try {
    var Query = "SELECT location FROM datacenter_enum where name  = :dataCenter limit 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { dataCenter: where["dataCenter"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function updateLongcodeState(payload: any, callback: any) {
  try {

    let Query = "update longcodes set status=:status WHERE id = :id limit 1";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        id: payload["id"],  
        status: payload["status"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindAllLiveEvent (where: any, callback: any) {
  try {
    var Query = "SELECT id, event_name,status FROM live_events_enum where status = 1  ";

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


export async function UpdateSmeCrmIntegration(payload: any, callback: any) {
  try {

    let Query = "update sme_profile set  crm_flag = :crmIntegration, live_events=:liveEventTypeState, call_mode=:callModeTypeState  WHERE id = :smeId limit 1";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        smeId: payload["smeId"], crmIntegration: payload["crmIntegration"],liveEventTypeState: payload["liveEventTypeState"], callModeTypeState: payload["callModeTypeState"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function InsertSmeCrmIntegrationDetails(payload: any, callback: any) {
  try {

    let Query = "Insert into  sme_crm_details  ( crm_partner, status ,insert_datetime ,recording_url,recording_url_provider ,outgoing_url ,outgoing_auth_token ,outgoing_url_provider ,incoming_url ,incoming_auth_token ,incoming_url_provider ,call_popup_url ,call_popup_auth_token ,call_popup_provider ,pushsms_url ,sms_provider ,pushsms_auth_token ,recording_auth_token,sme_id )values (  :crmPartner,1, :insert_date_time , :crmRecordingUrl, :crmRecordingUrlProvider ,:crmOutgoingUrl ,:crmOutgoingAuthToken ,:crmOutgoingUrlProviders,:crmIncomingUrl,:crmIncomingToken ,:crmIncomingUrlProvider ,:crmCallPopupUrl ,:crmCallPopupAuthToken ,:crmCallPopupProvider, :crmPushSmsUrl ,:crmPushSmsAuthToken ,:crmPushSmsProvider ,:crmRecordingAuthToken,:smeId )";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"], crmPartner: payload["crmPartner"],crmOutgoingUrl: payload["crmOutgoingUrl"],crmOutgoingAuthToken: payload["crmOutgoingAuthToken"],crmOutgoingUrlProviders: payload["crmOutgoingUrlProviders"],crmIncomingUrl: payload["crmIncomingUrl"],crmIncomingToken: payload["crmIncomingToken"],crmIncomingUrlProvider: payload["crmIncomingUrlProvider"],crmRecordingUrl: payload["crmRecordingUrl"],crmRecordingAuthToken: payload["crmRecordingAuthToken"],crmRecordingUrlProvider: payload["crmRecordingUrlProvider"],crmCallPopupUrl: payload["crmCallPopupUrl"],crmCallPopupAuthToken: payload["crmCallPopupAuthToken"],crmCallPopupProvider: payload["crmCallPopupProvider"],crmPushSmsUrl: payload["crmPushSmsUrl"],crmPushSmsAuthToken: payload["crmPushSmsAuthToken"],crmPushSmsProvider: payload["crmPushSmsProvider"],insert_date_time: payload["insert_date_time"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindsmeCrmIntegrationDetails(payload: any, callback: any) {
  try {

    let Query = "Select sme_id from sme_crm_details  WHERE sme_id = :smeId limit 1";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        smeId: payload["smeId"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function UpdateSmeCrmIntegrationDetails(payload: any, callback: any) {
  try {

    let Query = "update sme_crm_details set  crm_partner = :crmPartner,recording_url = :crmRecordingUrl,recording_url_provider = :crmRecordingUrlProvider,outgoing_url = :crmOutgoingUrl,outgoing_auth_token = :crmOutgoingAuthToken,outgoing_url_provider = :crmOutgoingUrlProviders,incoming_url = :crmIncomingUrl,incoming_auth_token = :crmIncomingToken,incoming_url_provider = :crmIncomingUrlProvider,call_popup_url = :crmCallPopupUrl,call_popup_auth_token = :crmCallPopupAuthToken,call_popup_provider = :crmCallPopupProvider,pushsms_url = :crmPushSmsUrl,sms_provider = :crmPushSmsProvider,pushsms_auth_token = :crmPushSmsAuthToken,recording_auth_token = :crmRecordingAuthToken  WHERE sme_id = :smeId limit 1";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        smeId: payload["smeId"], crmPartner: payload["crmPartner"],crmOutgoingUrl: payload["crmOutgoingUrl"],crmOutgoingAuthToken: payload["crmOutgoingAuthToken"],crmOutgoingUrlProviders: payload["crmOutgoingUrlProviders"],crmIncomingUrl: payload["crmIncomingUrl"],crmIncomingToken: payload["crmIncomingToken"],crmIncomingUrlProvider: payload["crmIncomingUrlProvider"],crmRecordingUrl: payload["crmRecordingUrl"],crmRecordingAuthToken: payload["crmRecordingAuthToken"],crmRecordingUrlProvider: payload["crmRecordingUrlProvider"],crmCallPopupUrl: payload["crmCallPopupUrl"],crmCallPopupAuthToken: payload["crmCallPopupAuthToken"],crmCallPopupProvider: payload["crmCallPopupProvider"],crmPushSmsUrl: payload["crmPushSmsUrl"],crmPushSmsAuthToken: payload["crmPushSmsAuthToken"],crmPushSmsProvider: payload["crmPushSmsProvider"],insert_date_time: payload["insert_date_time"]
      },
    });

    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindgAllCallModes (where: any, callback: any) {
  try {
    var Query = "SELECT id, name ,status FROM call_modes_enum where status = 1  ";

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


export async function FindAllAgentData (where: any, callback: any) {
  try {
    let g_initialRecord = 0;
    let limit_field = "";
    let searchLeads_field = "";
    let smeId_field = "";
    let agentId_field = "";

    if(where["initialRecord"]) {
      g_initialRecord = where["initialRecord"] - 1;
      limit_field = "limit " + g_initialRecord + "," + where["batchSize"] + "";
    }

    //Search Agent Field
    if (where["searchLeads_op"] == "11") {
      if(where["searchLeads_category"] == "smeName"){
        searchLeads_field = ' and sp.name LIKE "%' + where["searchLeads"] + '%" ';
      } else if(where["searchLeads_category"] == "smeId"){
        searchLeads_field = ' and (TRIM(ad.sme_id) LIKE "%' + where["searchLeads"] + '%") ';
      } else if(where["searchLeads_category"] == "agentName"){
        searchLeads_field = ' and ad.agent_name LIKE "%' + where["searchLeads"] + '%" ';
      }
    }

    //sme_id filter
    if (where["smeId_op"] == "11") {
      if(where["smeId"] != ""){
        smeId_field = " and ad.sme_id in(" + where["smeId"] + ")";
      }
    }

    //agent_id filter
    if (where["agentId_op"] == "11") {
      if(where["agentId"] != ""){
        agentId_field = " and ad.agent_id in(" + where["agentId"] + ")";
      }
    }
    var Query = "SELECT ad.agent_id as agentId, ad.agent_name as agentName, ad.status as agentStatus, sp.id AS smeId, sp.name AS smeName FROM agent_details ad LEFT JOIN sme_profile sp on sp.id = ad.sme_id where ad.sme_id != '' and ad.status != -9 "+searchLeads_field+" "+smeId_field+" "+agentId_field+" order by ad.sme_id asc " +limit_field + "";

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


/** find */
export async function findSmeSmsPlan(where: any, callback: any) {
  try {
    let Query = "SELECT pack_id,balance FROM sme_sms_mapping WHERE sme_id=:smeId LIMIT 1";
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

export async function UpdateSmeSmsPlan(where: any, payload: any, callback: any) {
  try {
    let Query = "UPDATE sme_sms_mapping set  balance=:smsCountUpdate  WHERE sme_id = :smeId  limit 1 ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {  smsCountUpdate: payload["smsCountUpdate"], smeId: where["smeId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function InsertSmeSmsPlan(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO sme_sms_mapping (sme_id, pack_id,balance,insert_date_time) values (:smeId,:packageId,:smsbalanceAdd,:insert_date_time )";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { smeId: payload["smeId"], packageId: payload["packageId"], smsbalanceAdd: payload["smsbalanceAdd"], insert_date_time: payload["insert_date_time"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** update  */
export async function UpdateFinalPaymentSMS(where: any, callback: any) {
  try {
    let Query = "INSERT INTO payment (sme_id, pack_id,amount,order_id,package_type,pack_quantity,insert_date_time,status) values (:smeId,:packageId,:amount,:orderID,:packageType,:packQuantity,:insert_date_time,:status )";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { smeId: where["smeId"], packageId: where["packageId"], amount: where["amount"], orderID: where["orderID"],packQuantity: where["packQuantity"], insert_date_time: where["insert_date_time"], packageType: where["packageType"],status: where["status"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    callback(error, null);
    throw new Error(error);
  }
}

/**  find SMS packages*/
export async function getAllSmsPackagesData(where: any, callback: any) {
  try {
    var Query = "SELECT id, name, description, amount, sms_count, 1 as packQuantity from sms_package";
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

/** find */
export async function FindSingleSmsPackdetail(where: any, callback: any) {
  try {
    let Query = "SELECT name,description,amount,sms_count FROM sms_package WHERE id=:packageId LIMIT 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { packageId: where["packageId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}