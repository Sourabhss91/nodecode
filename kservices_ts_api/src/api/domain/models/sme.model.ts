import { QueryTypes } from "sequelize";
import { sequelize, sequelize_reader, sequelize_webrtc } from "../../config/db";
import { logger } from "../../lib/logger";
import { SME_CITY } from "../schema/SmeCity.schema";
import { FORGOT_PASSWORD } from "../schema/ForgotPassword.schema";
import { SME_PRODUCT } from "../schema/SmeProduct.schema";
import { CALL_BASE_HISTORY } from "../schema/CallBaseHistory.schema";
import { ADDRESS_BOOK } from "../schema/addressBook.schema";
import {
  fetchRequest,
  signinRequest,
  remarksRequest,
  setRemarksRequest,
  fetchListRemarksRequest,
  updateUniqueCallsRequest,
  getAppDetailRequest,
  recordingGetRequest,
  callListFetchRequest,
  groupdetailsRequest,
  getAgentdetailRequestValidate,
  getivrflowRequestValidate,
  fetchInsightRequest,
  addAgentRequest,
  addAgentGroupMappingRequest,
  addAgentDetailsTimingRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
  tokenRequest,
  mergeCallFetchRequest
} from "../entities/sme.entity";
import { env } from "../../../infrastructure/env";

import { glogger } from "../../helpers/logger";
const {BigQuery} = require('@google-cloud/bigquery');

const options:any = {
  keyFilename: 'google_cred.json',
  projectId: env.BIGQUERY_DATA_PROJECTID,
};
// Creates a client
const bigquery = new BigQuery(options);

/**  find all chat message*/
export async function findAllChatMessage(where: any, callback: any) {
  try {
    var Query = 'select messageId, userId, chatId, message, messageType, media, deleteStatus, status,   entryDate from (SELECT messageId, userId, chatId, message, messageType, media, deleteStatus, status,  entryDate   FROM chat_message where chatId = :chatId order by entryDate desc LIMIT :limit OFFSET :offset  ) a  order BY  a.messageId asc';


    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { chatId: where["chatId"], limit: where["limit"], offset: where["offset"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function findAllUserOnlineOfline(where: any, callback: any) {
  try {
    //  var Query = 'SELECT ad.agent_name as name, u.onlineStatus as onlineStatus ,ad.agent_email as email FROM agent_details as ad left join users as u on ad.agent_email = u.username where  u.username != :loginUser and ad.sme_id = :username ';

    var Query = "SELECT ad.agent_name as name, u.onlineStatus as onlineStatus ,ad.agent_email as email ,(SELECT count(*) from chat C,chat_message CM WHERE C.chatId = CM.chatId and CM.userId !=:loginUser AND (C.userId = u.username OR C.toUserId = u.username) AND (C.userId = :loginUser OR C.toUserId = :loginUser) AND CM.status=0 ) as total FROM agent_details as ad left join users as u on ad.agent_email = u.username where  u.username != :loginUser and ad.sme_id = :username and ad.status = 1"
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { username: where["username"], loginUser: where["loginUser"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function findAndUpdateChatMessages(where: any, callback: any) {
  try {
    var Query = 'UPDATE chat_message SET status=1 WHERE chatId=:chat_id AND userId !=:loginUser';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { chat_id: where["chat_id"], loginUser: where["loginUser"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function findSmeDetails(where: any, callback: any) {
  try {
    var Query = 'SELECT sp.name as name, sp.id as email, u.onlineStatus as onlineStatus,(SELECT count(*) from chat C,chat_message CM WHERE C.chatId = CM.chatId and CM.userId !=:loginUser AND (C.userId = u.username OR C.toUserId = u.username) AND (C.userId = :loginUser OR C.toUserId = :loginUser) AND CM.status=0 ) as total FROM sme_profile as sp left join users as u on sp.id = u.username where u.username != :loginUser and sp.id = :username  limit 1';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { username: where["username"], loginUser: where["loginUser"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** create */
export async function createChatMessage(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO chat_message (userId, chatId, message, messageType,entryDate) values (:userId, :chatId, :message, :messageType, :insertDateTime)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { userId: payload["userId"], chatId: payload["chatId"], message: payload["message"], messageType: payload["messageType"], insertDateTime: payload["insertDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** create */
export async function createChatRoom(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO chat (userId, toUserId) values (:userId, :toUserId )";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { userId: payload["userId"], toUserId: payload["toUserId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function findOneUserChat(where: any, callback: any) {
  try {
    let Query = "SELECT chatId,userId,toUserId FROM chat WHERE ( userId=:userId and toUserId=:toUserId OR  userId=:toUserId and toUserId=:userId) LIMIT 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { userId: where["userId"], toUserId: where["toUserId"] },
    });
    if (executeQuery) {
      callback(null, executeQuery);
    } else {
      let Query = "SELECT chatId FROM chat WHERE userId=:userId and toUserId=:toUserId LIMIT 1";
      let executeQuery = await sequelize.query<any>(Query, {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: { userId: where["toUserId"], toUserId: where["userId"] },
      });
      callback(null, executeQuery);
    }
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function findOnePackage(where: any, callback: any) {
  try {
    var Query = '';
    if (where['packageType'] == 'SMS') {
      Query = "SELECT id,amount,name,description,sms_count FROM sms_package WHERE id=:id LIMIT 1";
    } else {
      Query = "SELECT id,amount,name,description FROM product_package WHERE id=:id LIMIT 1";
    }

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'findOnePackage', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

/** create */
export async function createPaymentOrder(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO payment (sme_id, pack_id,amount,order_id,package_type,pack_quantity,insert_date_time) values (:sme_id,:pack_id,:amount,:order_id,:packageType,:packQuantity,:insert_date_time )";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { sme_id: payload["sme_id"], pack_id: payload["pack_id"], amount: payload["amount"], order_id: payload["order_id"],packQuantity: payload["packQuantity"], insert_date_time: payload["insert_date_time"], packageType: payload["packageType"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'createPaymentOrder', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
}

/** update users */
export async function updatePaymentOrder(where: any, callback: any) {
  try {
    let Query = "UPDATE payment set order_id = :order_id WHERE id = :id ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { id: where["id"], order_id: where["order_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function findOneChat(where: any, callback: any) {
  try {
    let Query = "SELECT chatId,userId,toUserId FROM chat WHERE chatId=:chatId LIMIT 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { chatId: where["chatId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** update users */
export async function UpdateUserStatus(where: any, callback: any) {
  try {
    let Query = "UPDATE users set onlineStatus = :onlineStatus WHERE username = :username ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { username: where["username"], onlineStatus: where["onlineStatus"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** get event live call*/
export async function GetEventLiveCall(where: any, callback: any) {
  try {
    let Query =
      'SELECT lc.id, lc.sme_id, IFNULL(ab.customer_name,0) customer_name, lc.customer_number, lc.agent_id, lc.call_status, lc.call_type, ad.agent_mobile, ad.agent_name, DATE_FORMAT(lc.date_time, "%Y-%m-%d %H:%i:%s") AS date_time, NOW() AS cnow_time FROM live_calls lc LEFT JOIN agent_details ad on SUBSTRING(TRIM(lc.agent_number), -10)=SUBSTRING(ad.agent_mobile, -10) AND ad.sme_id = :sme_id LEFT JOIN address_book ab ON SUBSTRING(TRIM(ab.customer_number_primary), -10)=SUBSTRING(lc.customer_number, -10) AND ab.`status` != -9 AND lc.sme_id = ab.sme_id where DATE(date_time) = DATE(:currentDateTime) and lc.sme_id= :sme_id';
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["id"], currentDateTime: where["currentDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** get event agent live call*/
export async function GetEventAgentLiveCall(where: any, callback: any) {
  try {
    let Query =
      'select lc.id, lc.sme_id, IFNULL(ab.customer_name,"No Name") customer_name, lc.customer_number, lc.agent_id,  lc.call_status, lc.call_type, lc.agent_number, lc.session_id, lc.is_auto_dial, ad.agent_name, DATE_FORMAT(lc.date_time, "%Y-%m-%d %H:%i:%s") as date_time, now() as cnow_time, iicc.remarks from live_calls lc left join agent_details ad on lc.agent_id = ad.agent_id LEFT JOIN incoming_ivr_call_cdr iicc ON iicc.session_id = lc.session_id LEFT JOIN address_book ab ON SUBSTRING(TRIM(ab.customer_number_primary), -10)=SUBSTRING(lc.customer_number, -10) AND ab.`status` != -9 AND lc.sme_id = ab.sme_id where DATE(date_time) = DATE(:currentDateTime) and lc.sme_id= :sme_id and ad.agent_id= :agent_id limit 1';
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["id"], agent_id: where["agentId"], currentDateTime: where["currentDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** get event agent live call*/
export async function GetEventClickToCall(where: any, callback: any) {
  try {
    let Query =
      'select lc.sme_id, IFNULL(ab.customer_name,0) customer_name, lc.customer_number, lc.agent_id,  lc.call_status, lc.call_type, lc.agent_number, ad.agent_name, DATE_FORMAT(lc.date_time, "%Y-%m-%d %H:%i:%s") as date_time, now() as cnow_time from live_calls lc left join agent_details ad on lc.agent_id = ad.agent_id LEFT JOIN address_book ab ON SUBSTRING(TRIM(ab.customer_number_primary), -10)= SUBSTRING(lc.customer_number, -10) AND ab.`status` != -9 and ab.sme_id = :sme_id where DATE(date_time) = DATE(:currentDateTime) and lc.sme_id= :sme_id and ad.agent_id = :agent_id and SUBSTRING(TRIM(ad.agent_mobile), -10)=SUBSTRING(:agentNumber, -10)  and SUBSTRING(TRIM(lc.customer_number), -10)=SUBSTRING(:customerNumber, -10)';
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["id"], agent_id: where["agentId"], agentNumber: where["agentNumber"], customerNumber: where["customerNumber"], currentDateTime: where["currentDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find settings*/
export async function FindSetting(where: fetchRequest, callback: any) {
  try {
    let Query =
      "select ifnull(balance,0) as balance, call_back_url, recording, masking, voicemail, language, queue_limit, selection_algo,sticky_algo,rec_validity, gui_timer, agent_relax_time, in_permission_flag, out_permission_flag, email_id, out_channels,principle_id, call_flow_limit, end_call_notification_flag, agent_break_notifcation, agent_break_notification_time, agent_break_notification_email, live_events, lead_manager_permission_flag, outgoing_agent, sme_mobile, default_lead_sticky, eod_report_flag, eod_report_emails, edit_agent_details_permission_flag, user_version from sme_profile WHERE id= :id LIMIT 1";
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
export async function UserSignin(where: signinRequest, callback: any) {
  try {
    let Query = "SELECT U.username, UR.ROLE, UR.user_role_id FROM users U, user_roles UR WHERE UR.username=U.username AND BINARY U.username = :username AND BINARY U.password= :password LIMIT 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { username: where["username"], password: where["password"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function UserSingleDetails(where: fetchRequest, callback: any) {
  try {
    let Query = "SELECT U.username, UR.ROLE, UR.user_role_id FROM users U, user_roles UR WHERE UR.username=U.username AND U.username = :id LIMIT 1";
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
export async function findUserAccessKey(where: tokenRequest, callback: any) {
  try {
    let Query = "SELECT U.username, U.user_token FROM users U WHERE U.username = :id AND U.user_token = :token LIMIT 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"], token: where["token"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function GetUserDetails(where: forgotPasswordRequest, callback: any) {
  try {
    let Query = "";
    if (where["username"] && where["username"].includes("@")) {
      Query = "SELECT u.username as email_id, ad.agent_name as user_name, status FROM users u LEFT JOIN agent_details ad ON ad.agent_email = u.username WHERE username = :username LIMIT 1";
    } else {
      Query = "SELECT sp.email_id, sp.name AS user_name, status FROM users as u LEFT JOIN sme_profile sp ON sp.id=u.username where username = :username LIMIT 1";
    }

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { username: where["username"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function TokenVerify(where: resetPasswordRequest, callback: any) {
  try {
    let Query = "SELECT token FROM forget_password WHERE sme_id=:sme_id and token=:token LIMIT 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], token: where["token"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** update users */
export async function UpdateUserToken(where: any, callback: any) {
  try {
    let Query = "UPDATE users set user_token = :user_token WHERE username = :username ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { user_token: where["access_token"], username: where["username"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** update users */
export async function UpdateUserAccessKey(where: any, callback: any) {
  try {
    let Query = "UPDATE users set user_key = :user_key, user_time = :user_time WHERE username = :username ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { user_key: where["user_key"], user_time: where["user_time"], username: where["username"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateSettings(where: any, payload: any, callback: any) {
  try {
    let Query =
      "update sme_profile set call_back_url = :call_back_url, recording = :recording , sticky_algo = :sticky_algo , masking = :masking, voicemail = :voicemail , language = :language , queue_limit = :queue_limit , selection_algo = :selection_algo, gui_timer = :gui_timer, agent_relax_time = :agent_relax_time, update_time=:currentDate, email_id=:email_id, principle_id= :principle_id, end_call_notification_flag= :end_call_notification_flag, agent_break_notifcation= :agent_break_notifcation, agent_break_notification_email= :agent_break_notification_email, agent_break_notification_time= :agent_break_notification_time, sme_mobile= :sme_mobile, default_lead_sticky= :default_lead_sticky, eod_report_flag= :eod_report_flag, eod_report_emails= :eod_report_emails WHERE id = :id";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        call_back_url: where["call_back_url"],
        recording: where["recording"],
        sticky_algo: where["sticky_algo"],
        masking: where["masking"],
        voicemail: where["voicemail"],
        language: where["language"],
        queue_limit: where["queue_limit"],
        selection_algo: where["selection_algo"],
        gui_timer: where["gui_timer"],
        agent_relax_time: where["agent_relax_time"],
        id: where["id"],
        currentDate: payload["currentDate"],
        email_id: where["email_id"],
        principle_id: where["principle_id"],
        end_call_notification_flag: where["end_call_notification_flag"],
        agent_break_notifcation: where["agent_break_notifcation"],
        agent_break_notification_email: where["agent_break_notification_email"],
        agent_break_notification_time: where["agent_break_notification_time"],
        sme_mobile: where["sme_mobile"],
        default_lead_sticky: where["default_lead_sticky"],
        eod_report_flag: where["eod_report_flag"],
        eod_report_emails: where["eod_report_emails"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function FindSmeCities(where: any, callback: any) {
  try {
    let Query = "Select id from sme_cities_list where sme_id = :smeId and city_id = :cityId LIMIT 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], cityId: where["cityId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function insertBulkCities(payload: any, callback: any) {
  try {
    let executeQuery = SME_CITY.bulkCreate(payload);
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function insertBulkCallBaseHistory(payload: any, callback: any) {
  try {
    let executeQuery = CALL_BASE_HISTORY.create(payload);
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function insertBulkProducts(payload: any, callback: any) {
  try {
    let executeQuery = SME_PRODUCT.bulkCreate(payload);
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function insertUpdateBulkProducts(payload: any, condition: any, callback: any) {
  SME_PRODUCT.findOne({ where: condition }).then(function (obj) {
    // update
    if (obj) {
      obj.update(payload);
      callback(null, { status: 1 });
    } else {
      // insert
      SME_PRODUCT.create(payload);
      callback(null, { status: 1 });
    }
  });

  try {
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function insertProduct(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO sme_product_list (sme_id, product_name, status) values (:sme_id, :productName, :status )";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { sme_id: payload["sme_id"], productName: payload["product_name"], status: payload["status"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

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
export async function checkRemarksExist(where: any, callback: any) {
  try {
    var Query = "select remarks from customer_remarks where session_id= :sessionId AND sme_id = :id LIMIT 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sessionId: where["sessionId"], id: where["id"] },
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
    let Query =
      "Insert into customer_remarks (sme_id, customer_number, call_direction, session_id, remarks, created_by, start_date_time) values ( :id, :customerNumber, :callDirection, :sessionId, :remarks, :createdBy, :insertDateTime)";
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
export async function UpdateCustomerRemarks(where: any, callback: any) {
  try {
    var Query = "UPDATE customer_remarks set remarks =  :remarks , updated_date_time=:insertDateTime where session_id = :sessionId  and sme_id = :id LIMIT 1";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { remarks: where["remarks"], sessionId: where["sessionId"], callDirection: where["callDirection"], insertDateTime: where["insertDateTime"], id: where["id"] },
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
    var Query =
      'SELECT DATE_FORMAT(cr.start_date_time, "%Y-%m-%d %H:%i:%s") as start_date_time , cr.remarks, sp.name, ad.agent_name FROM customer_remarks cr LEFT JOIN sme_profile sp ON sp.id = cr.created_by LEFT JOIN agent_details ad ON ad.agent_id = cr.created_by WHERE cr.remarks != "NULL" AND cr.remarks != "" AND SUBSTRING(TRIM(cr.customer_number), -10)= SUBSTRING(:customerNumber, -10) AND cr.sme_id = :smeId ORDER BY cr.start_date_time DESC LIMIT 0,5';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { customerNumber: where["customerNumber"], callDirection: where["callDirection"], smeId: where["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/**  find */
export async function FindCities(where: fetchRequest, callback: any) {
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
export async function FindProducts(where: fetchRequest, callback: any) {
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

/** Update Unique Calls */
export async function UpdateUniqueCall(where: any, callback: any) {
  try {
    let Query =
      "update unique_customer_detail set city_id = :cityId, product_id = :productId , product_price = :productPrice, assigned_agent_id = :leadAssignedAgent, lead_type = :leadType, lead_status = :leadStatus, source_id = :sourceId, other = :other, uploaded_date_time = :currentdateTime, sticky_type = :stickyType WHERE sme_id = :id  and id = :callId LIMIT 1";
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
        other: where["other"],
        currentdateTime: where["currentdateTime"],
        stickyType: where["stickyType"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/**  find */
export async function FindAppVersion(where: getAppDetailRequest, callback: any) {
  try {
    let Query = "SELECT platform, version_code, version_name, file_url, description FROM apk_detail LIMIT 1";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { version_name: where["version_name"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function FindCustomerBook(where: any, callback: any) {
  try {
    let Query = "Select id, customer_name, customer_name as customerName, company_name as company, email_id as email, address from address_book where sme_id = :sme_id and SUBSTRING(TRIM(customer_number_primary), -10) = SUBSTRING(:customerNumber, -10) and status != -9 LIMIT 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["smeId"], customerNumber: where["customerNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function FindAgentStatus(where: any, payload: any, callback: any) {
  try {
    let agentStatus_field = "";
    if (where["agentStatus_op"] == 11) {
      //Equals to
      agentStatus_field = "and ad.status = :agentStatus_op";
    }
    let agentId_field = "";
    //Agent ID filter
    if (where["agentId_op"] == 11) {
      //Equals to
      agentId_field = " and ad.agent_id =" + where["agentId"];
    }

    let Query =
      "SELECT ad.agent_id, ad.sme_id, ad.status, DATE_FORMAT(ad.insert_time, '%Y-%m-%d') as insert_date, ad.in_time, ad.out_time, TIME(:currentDate) AS curr_time, date(:currentDate) as curr_date, ad.days_flag, ad.agent_position, ad.agent_extention, ad.agent_email, ad.sticky_agent, ad.agent_masking, ad.agent_score, ad.sticky_days, ad.is_updated, ad.assign_failed_calls, ad.assign_voicemail_calls , agd.group_name , agd.group_id, :currentDate as curr_date_time, ad.recent_call_date_time, ad.agent_mobile, ad.agent_name, ad.out_permission_flag, ad.in_permission_flag, ad.break_permission_flag, ad.webrtc_flag, ad.webrtc_registered_flag FROM agent_details ad left join agent_group_mapping agm on agm.agent_id = ad.agent_id left join agent_group_detail agd on agd.group_id = agm.group_id WHERE ad.sme_id =:id " +
      agentStatus_field +
      "  and ad.status != -9 " +
      agentId_field;
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"], agentStatus_op: where["agentStatus_op"], currentDate: payload["currentDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function FindRecording(where: recordingGetRequest, callback: any) {
  try {
    let duration_field = "";
    let customer_number_field = "";
    let agent_id_field = "";
    let limit_field = "";
    let agent_name_field = "";
    let initialRecord;
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

    // check as customer number
    if (where["customerNumber_op"] == "1") {
      //Equals to
      customer_number_field = 'and TRIM(cr.customer_number) = "' + where["customerNumber"] + '"';
    } else if (where["customerNumber_op"] == "2") {
      //Not Equals to
      customer_number_field = 'and TRIM(cr.customer_number) != "' + where["customerNumber"] + '"';
    } else if (where["customerNumber_op"] == "3") {
      //Start with
      customer_number_field = 'and TRIM(cr.customer_number) LIKE "' + where["customerNumber"] + '%"';
    } else if (where["customerNumber_op"] == "4") {
      //it contains
      customer_number_field = 'and TRIM(cr.customer_number) LIKE "%' + where["customerNumber"] + '%"';
    } else if (where["customerNumber_op"] == "5") {
      //it does not contains
      customer_number_field = 'and TRIM(cr.customer_number) NOT LIKE "%' + where["customerNumber"] + '%"';
    } else if (where["customerNumber_op"] == "6") {
      //it end with
      customer_number_field = 'and TRIM(cr.customer_number) LIKE "%' + where["customerNumber"] + '"';
    }

    //agentid filter
    if (where["agentId_op"] == "1") {
      //Equals to
      agent_id_field = 'and TRIM(cr.agent_id) = "' + where["agentId"] + '"';
    } else if (where["agentId_op"] == "2") {
      //Not Equals to
      agent_id_field = 'and TRIM(cr.agent_id) != "' + where["agentId"] + '"';
    } else if (where["agentId_op"] == "3") {
      //Start with
      agent_id_field = 'and TRIM(cr.agent_id) LIKE "' + where["agentId"] + '%"';
    } else if (where["agentId_op"] == "4") {
      //it contains
      agent_id_field = 'and TRIM(cr.agent_id) LIKE "%' + where["agentId"] + '%"';
    } else if (where["agentId_op"] == "5") {
      //it does not contains
      agent_id_field = 'and TRIM(cr.agent_id) NOT LIKE "%' + where["agentId"] + '%"';
    } else if (where["agentId_op"] == "6") {
      //it end with
      agent_id_field = 'and TRIM(cr.agent_id) LIKE "%' + where["agentId"] + '"';
    }

    //agent name filter
    if (where["agentName_op"] == "1") {
      //Equals to
      agent_name_field = ' and TRIM(ad.agent_name) = "' + where["agentName"] + '"';
    } else if (where["agentName_op"] == "2") {
      //Not Equals to
      agent_name_field = ' and TRIM(ad.agent_name) != "' + where["agentName"] + '"';
    } else if (where["agentName_op"] == "3") {
      //Start with
      agent_name_field = ' and TRIM(ad.agent_name) LIKE "' + where["agentName"] + '%"';
    } else if (where["agentName_op"] == "4") {
      //it contains
      agent_name_field = ' and TRIM(ad.agent_name) LIKE "%' + where["agentName"] + '%"';
    } else if (where["agentName_op"] == "5") {
      //it does not contains
      agent_name_field = ' and TRIM(ad.agent_name) NOT LIKE "%' + where["agentName"] + '%"';
    } else if (where["agentName_op"] == "6") {
      //it end with
      agent_name_field = ' and TRIM(ad.agent_name) LIKE "%' + where["agentName"] + '"';
    }

    let Query =
      'select  cr.id, cr.call_id, cr.sme_id, cr.agent_id, cr.customer_ani, cr.duration, cr.filename, cr.status, cr.flag, DATE_FORMAT(cr.insert_date, "%Y-%m-%d %H:%i:%s") as insert_date, cr.merged_file, cr.rec_server,  ad.agent_mobile, ad.agent_name, ad.agent_email from mpbx_call_recording cr left join agent_details ad on cr.agent_id = ad.agent_id where (cr.insert_date  BETWEEN :startDate AND :endDate ) and cr.sme_id = :id  and cr.merged_file LIKE "%https%"  ' +
      duration_field +
      " " +
      customer_number_field +
      " " +
      agent_id_field +
      " " +
      agent_name_field +
      " order  by id desc " +
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
      callFlow_field = "and cdr.call_flow_name = '" + where["callFlow"] + "'";
    }

    let Query = "";
    if (table_name == "outbond_ivr_cdr") {
      Query =
        'select ad.agent_name, ad.recording_type, cdr.id, cdr.disconnected_by, cdr.sme_id, DATE_FORMAT(cdr.start_date_time, "%Y-%m-%d %H:%i:%s") as start_date_time, DATE_FORMAT(cdr.end_date_time, "%Y-%m-%d %H:%i:%s") as end_date_time , DATE_FORMAT(cdr.insert_date_time, "%Y-%m-%d %H:%i:%s") as insert_date_time , cdr.duration, cdr.longcode, cdr.hlr, cdr.master_shortcode, cdr.sme_identifier, cdr.shortcode_mapping, if(cdr.call_direction_status="1","TRUE","FALSE") as call_direction_status, cdr.call_direction, cdr.calling_number, cdr.called_number, cdr.call_recording_status,cdr.call_recorded_file, if(cdr.voicemail_recording_status="1","TRUE","FALSE") as voicemail_recording_status, cdr.voicemail_recording_file, cdr.channel_no, cdr.server_ip_address, if(cdr.cdr_mode="1","INCOMING_IVR_CALL","I dont know") as cdr_mode, cdr.cdr_mode as cdr_mode_int, cdr.agent_group, cdr.agent_group AS group_name, cdr.patched_agent_id, cdr.session_id, cdr.merge_status, cdr.answer, if(cdr.answer="2","0","1") as call_status, cdr.address_book_id, cdr.call_mode, ab.customer_name, cr.remarks, cdr.connected_call_duration, cdr.connected_duration, cdr.ringing_duration, cdr.call_type, cdr.call_description, cdr.ivr_duration, cdr.customer_status, rec.merged_file, rec.duration as recording_duration, bwl.blacklist_status from outbond_ivr_cdr cdr left join agent_details ad on cdr.patched_agent_id = ad.agent_id left join mpbx_call_recording rec on rec.call_id = cdr.call_recorded_file LEFT JOIN black_white_list bwl ON SUBSTRING(TRIM(bwl.customer_number), -10)=SUBSTRING(cdr.called_number, -10) AND bwl.sme_id = cdr.sme_id and bwl.blacklist_status != -9 LEFT JOIN address_book ab on ab.customer_number_primary = cdr.called_number AND ab.sme_id = cdr.sme_id LEFT JOIN customer_remarks cr ON cr.session_id = cdr.session_id AND cr.sme_id = cdr.sme_id where (cdr.start_date_time  BETWEEN :startDate AND :endDate) and cdr.sme_id = :id AND cdr.customer_status = 0' +
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
        " " +
        callId_fiels +
        " GROUP BY cdr.session_id order  by id desc " +
        limit_field +
        "";
    } else {
      Query =
        'select ad.agent_name, ad.agent_mobile, cdr.id, cdr.sme_id, DATE_FORMAT(cdr.start_date_time, "%Y-%m-%d %H:%i:%s") as start_date_time, DATE_FORMAT(cdr.end_date_time, "%Y-%m-%d %H:%i:%s") as end_date_time, DATE_FORMAT(cdr.insert_date_time, "%Y-%m-%d %H:%i:%s") as insert_date_time, cdr.duration, cdr.longcode, cdr.hlr, cdr.master_shortcode, cdr.sme_identifier, cdr.shortcode_mapping, if(cdr.call_direction_status="1","TRUE","FALSE") as call_direction_status, cdr.call_direction, cdr.calling_number, cdr.called_number, cdr.call_recording_status,cdr.call_recorded_file, if(cdr.voicemail_recording_status="1","TRUE","FALSE") as voicemail_recording_status, cdr.voicemail_recording_file, cdr.channel_no, cdr.server_ip_address, if(cdr.cdr_mode="1","INCOMING_IVR_CALL","I dont know") as cdr_mode, cdr.agent_group, cdr.agent_group as group_name, cdr.patched_agent_id, cdr.session_id, cdr.merge_status, cdr.answer, cdr.call_flow_id, cdr.call_status, cdr.disconnected_by, cdr.address_book_id, ab.customer_name, cr.remarks, cdr.connected_call_duration, cdr.connected_duration, cdr.ringing_duration, cdr.call_type, cdr.call_description, cdr.ivr_duration,cdr.customer_status, cdr.call_mode, cdr.dtmf, rec.merged_file, rec.duration as recording_duration, bwl.blacklist_status, cdr.call_flow_name as flow_name from ' +
        table_name +
        " cdr left join agent_details ad on cdr.patched_agent_id = ad.agent_id left join mpbx_call_recording rec on rec.call_id = cdr.call_recorded_file LEFT JOIN black_white_list bwl ON SUBSTRING(TRIM(bwl.customer_number), -10)=SUBSTRING(cdr.calling_number, -10) AND bwl.sme_id = cdr.sme_id AND bwl.blacklist_status != -9 LEFT JOIN address_book ab on ab.customer_number_primary = cdr.calling_number AND ab.sme_id = cdr.sme_id LEFT JOIN customer_remarks cr ON cr.session_id = cdr.session_id AND cr.sme_id = cdr.sme_id  where (cdr.start_date_time  BETWEEN :startDate AND :endDate) and cdr.sme_id = :id AND cdr.customer_status = 0 AND cdr.call_type != '3'" +
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
        " " +
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
    let Query = "";
    if (table_name == "outbond_ivr_cdr") {
      Query =
        "select count(*) as total_records from " +
        table_name +
        " cdr left join agent_details ad on cdr.patched_agent_id = ad.agent_id LEFT JOIN customer_remarks cr ON cr.session_id = cdr.session_id where (cdr.start_date_time  BETWEEN :startDate  AND :endDate ) and cdr.sme_id = :id AND cdr.customer_status = 0 " +
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
        "select count(*) as total_records from " +
        table_name +
        " cdr left join agent_details ad on cdr.patched_agent_id = ad.agent_id LEFT JOIN customer_remarks cr ON cr.session_id = cdr.session_id  where (cdr.start_date_time  BETWEEN  :startDate  AND :endDate) and cdr.sme_id = :id AND cdr.customer_status = 0 AND cdr.call_type != '3'" +
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
export async function totalRecordingList(where: any, callback: any) {
  try {
    let duration_field = "";
    let customer_number_field = "";
    let agent_id_field = "";
    let limit_field = "";
    let agent_name_field = "";
    let initialRecord;
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

    // check as customer number
    if (where["customerNumber_op"] == "1") {
      //Equals to
      customer_number_field = 'and TRIM(cr.customer_number) = "' + where["customerNumber"] + '"';
    } else if (where["customerNumber_op"] == "2") {
      //Not Equals to
      customer_number_field = 'and TRIM(cr.customer_number) != "' + where["customerNumber"] + '"';
    } else if (where["customerNumber_op"] == "3") {
      //Start with
      customer_number_field = 'and TRIM(cr.customer_number) LIKE "' + where["customerNumber"] + '%"';
    } else if (where["customerNumber_op"] == "4") {
      //it contains
      customer_number_field = 'and TRIM(cr.customer_number) LIKE "%' + where["customerNumber"] + '%"';
    } else if (where["customerNumber_op"] == "5") {
      //it does not contains
      customer_number_field = 'and TRIM(cr.customer_number) NOT LIKE "%' + where["customerNumber"] + '%"';
    } else if (where["customerNumber_op"] == "6") {
      //it end with
      customer_number_field = 'and TRIM(cr.customer_number) LIKE "%' + where["customerNumber"] + '"';
    }

    //agentid filter
    if (where["agentId_op"] == "1") {
      //Equals to
      agent_id_field = 'and TRIM(cr.agent_id) = "' + where["agentId"] + '"';
    } else if (where["agentId_op"] == "2") {
      //Not Equals to
      agent_id_field = 'and TRIM(cr.agent_id) != "' + where["agentId"] + '"';
    } else if (where["agentId_op"] == "3") {
      //Start with
      agent_id_field = 'and TRIM(cr.agent_id) LIKE "' + where["agentId"] + '%"';
    } else if (where["agentId_op"] == "4") {
      //it contains
      agent_id_field = 'and TRIM(cr.agent_id) LIKE "%' + where["agentId"] + '%"';
    } else if (where["agentId_op"] == "5") {
      //it does not contains
      agent_id_field = 'and TRIM(cr.agent_id) NOT LIKE "%' + where["agentId"] + '%"';
    } else if (where["agentId_op"] == "6") {
      //it end with
      agent_id_field = 'and TRIM(cr.agent_id) LIKE "%' + where["agentId"] + '"';
    }

    if (where["agentName_op"] == "1") {
      agent_name_field = ' and TRIM(ad.agent_name) LIKE "%' + where["agentName"] + '"';
    }
    let Query =
      'select count(*) as total_records from mpbx_call_recording cr left join agent_details ad on cr.agent_id = ad.agent_id where (cr.insert_date  BETWEEN :startDate  AND :endDate ) and cr.sme_id = :id and cr.merged_file LIKE "%https%" ' +
      duration_field +
      " " +
      customer_number_field +
      " " +
      agent_id_field +
      " " +
      agent_name_field +
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
      
      if(where["cityId"] != ""){
        cityId_field = " and ucd.city_id in(" + where["cityId"] + ")";
      } else {
        LeadStatus_field = " and ucd.city_id in(0)";
      }
    }

    //product_id
    if (where["productId_op"] == "11") {
      //Equals to
      
      if(where["productId"] != ""){
        productId_field = "and ucd.product_id in(" + where["productId"] + ")";
      } else {
        LeadStatus_field = " and ucd.product_id in(0)";
      }
    }

    //campaignId
    if (where["campaignId_op"] == "11") {
      //Equals to
      campaignId_field = " and ucd.campaign_id = " + where["campaignId"] + "";
      answer_field = " and ucd.answer = 3";
    } else {
      answer_field = " and (ucd.answer != 3 OR ucd.frequency != 0)";
    }

    //source_id
    if (where["sourceId_op"] == "11") {
      //Equals to
      
      if(where["sourceId"] != ""){
        sourceId_field = "and ucd.source_id in(" + where["sourceId"] + ")";
      } else {
        LeadStatus_field = " and ucd.source_id in(0)";
      }
    }

    //lead_type
    if (where["leadType_op"] == "11" && where["leadType"] != "") {
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
      if(where["leadStatus"] != ""){
        LeadStatus_field = " and ucd.lead_status in(" + where["leadStatus"] + ")";
      } else {
        LeadStatus_field = " and ucd.lead_status in(0)";
      }
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
      if(where["searchLeads_category"] == "name"){
        searchLeads_field = ' and ab.customer_name LIKE "%' + where["searchLeads"] + '%" ';
      } else if(where["searchLeads_category"] == "mobile"){
        searchLeads_field = ' and (TRIM(ucd.customer_number) LIKE "%' + where["searchLeads"] + '%") ';
      } else if(where["searchLeads_category"] == "company"){
        searchLeads_field = ' and ab.company_name LIKE "%' + where["searchLeads"] + '%" ';
      }
    }

    if (where["startDate"] && where["endDate"] && where["campaignId_op"] == "" && where["searchLeads_op"] == "") { 
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

    if (where["abandoned_op"] == "11") {
      if (where["abandoned"] == "all") {
        answer_field = " and ucd.answer = 2";
      } else if(where["abandoned"] == "incoming"){
        answer_field = " and ucd.answer = 2 and ucd.call_type = 'INCOMING'";
      } else if(where["abandoned"] == "outgoing"){
        answer_field = " and ucd.answer = 2 and ucd.call_type = 'OUTGOING'";
      }
    } 

    let Query =
      'SELECT ucd.id, ucd.sme_id, DATE_FORMAT(ucd.update_date_time, "%Y-%m-%d %H:%i:%s") as update_date_time, DATE_FORMAT(ucd.insert_date_time, "%Y-%m-%d %H:%i:%s") as insert_date_time, ucd.recent_duration, ucd.recent_via_longcode, ucd.call_type, ucd.customer_number, ucd.customer_number as customerNumber, SUBSTRING(TRIM(ucd.customer_number), -12) as whattsappNumber, ucd.server_ip_address, ucd.recent_patched_agent_id, ad.agent_name, ad.agent_mobile, ad.agent_id, ucd.answer, ucd.address_book_id, ab.customer_name, ab.company_name, ucd.recent_remarks, ucd.total_incoming_calls, ucd.total_outgoing_calls, ucd.lead_type, ucd.city_id, cc.city_name,  ucd.product_id, pl.product_name, ucd.product_price, ucd.assigned_to, ucd.sticky_type, ad.agent_name as lead_assigned_agent_name, ad.agent_mobile as lead_assigned_agent_number, ucd.assigned_agent_id, ucd.frequency, bwl.blacklist_status, ls.source as lead_source, ucd.source_id, ucd.lead_status, cr.remarks, lst.lead_status as lead_status_name, ucd.other, ad1.agent_name AS connected_agent FROM unique_customer_detail ucd LEFT JOIN country_cities cc ON ucd.city_id = cc.id LEFT JOIN sme_product_list pl ON ucd.product_id = pl.id LEFT JOIN agent_details ad ON (ucd.assigned_agent_id = ad.agent_id) LEFT JOIN agent_details ad1 ON (ad1.agent_id = ucd.recent_patched_agent_id) LEFT JOIN lead_status lst ON lst.created_by = ucd.sme_id AND lst.id = ucd.lead_status LEFT JOIN lead_source ls ON ls.id = ucd.source_id LEFT JOIN black_white_list bwl ON bwl.customer_number = ucd.customer_number AND bwl.sme_id = ucd.sme_id AND bwl.blacklist_status != -9 LEFT JOIN address_book ab ON ab.customer_number_primary = ucd.customer_number AND ucd.sme_id = ab.sme_id AND ab.status != -9 LEFT JOIN customer_remarks cr ON cr.sme_id = ucd.sme_id AND SUBSTRING(TRIM(cr.customer_number), -10)= SUBSTRING(ucd.customer_number, -10) AND cr.id = ucd.recent_remarks WHERE ucd.sme_id = :id AND ucd.status != -9 AND bwl.blacklist_status IS NULL' +
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

/** find */
export async function TotalUniqueCall(where: any, callback: any) {
  try {
    let table_name = "";
    let duration_field = "";
    let agent_number_field = "";
    let customer_number_field = "";
    let agent_name_field = "";
    let call_answer_field = "";
    let answer_status_field = "";
    let remarks_field = "";
    let callId_field = "";
    let productId_field = "";
    let cityId_field = "";
    let insert_date_time_field = "";
    let leadType_field = "";
    let customerName_field = "";
    let g_initialRecord = "";
    let agentId_field = "";
    let LeadStatus_field = "";
    let productPrice_field = "";
    let sourceId_field = "";
    let searchLeads_field = "";
    let sortLeadDateVar_field = "";
    let companyName_field = "";

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
      cityId_field = "and ucd.city_id = " + where["cityId"] + "";
    }

    //product_id
    if (where["productId_op"] == "11") {
      //Equals to
      productId_field = "and ucd.product_id = " + where["productId"] + "";
    }

    //source_id
    if (where["sourceId_op"] == "11") {
      //Equals to
      sourceId_field = "and ucd.source_id = " + where["sourceId"] + "";
    }

    //lead_type
    if (where["leadType_op"] == "11") {
      //Equals to
      leadType_field = 'and ucd.lead_type = "' + where["leadType"] + '"';
    }

    //customer_name
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
      productPrice_field = "and ucd.product_price = " + where["productPrice"] + "";
    }

    //product_price
    if (where["leadStatus_op"] == "11") {
      //Equals to
      LeadStatus_field = ' and ucd.lead_status = "' + where["leadStatus"] + '"';
    }

    //Agent Id
    if (where["agentId_op"] == "34") {
      //Equals to
      agentId_field = " and ucd.recent_patched_agent_id = " + where["agentId"] + "";
    }

    //checking the intial record if 1 then better to start from 0.
    if (where["initialRecord"] == "1") {
      //Equals to
      g_initialRecord = "0";
    } else {
      g_initialRecord = where["initialRecord"];
    }

    //Search Leads Field
    if (where["searchLeads_op"] == "11") {
      searchLeads_field = ' and (TRIM(ab.customer_name) LIKE "%' + where["searchLeads"] + '%" OR TRIM(ucd.customer_number) LIKE "%' + where["searchLeads"] + '%" OR TRIM(ab.company_name) LIKE "%' + where["searchLeads"] + '%") ';
    }

    if (where["startDate"] && where["endDate"] && searchLeads_field == "") {
      insert_date_time_field = ' AND ucd.update_date_time BETWEEN "' + where["startDate"] + '" AND "' + where["endDate"] + '"';
    }

    if (where["sortLeadDateVar_op"] == "11") {
      sortLeadDateVar_field = "  order by  " + where["sortLeadDateVar"] + " ";
    } else {
      sortLeadDateVar_field = "  order by ucd.update_date_time desc ";
    }

    let Query =
      "SELECT count(*) as total_records FROM unique_customer_detail ucd left join agent_details ad on ucd.assigned_agent_id = ad.agent_id left join address_book ab on ab.customer_number_primary = ucd.customer_number and ucd.sme_id = ab.sme_id AND ab.status != -9 left join country_cities cc on ucd.city_id = cc.id left join sme_product_list pl on ucd.product_id = pl.id LEFT JOIN black_white_list bwl ON SUBSTRING(TRIM(bwl.customer_number), -10)=SUBSTRING(ucd.customer_number, -10) AND bwl.sme_id = ucd.sme_id and bwl.blacklist_status != -9 LEFT JOIN lead_source ls ON ls.id = ucd.source_id WHERE ucd.sme_id = :id AND (ucd.answer != 3 OR ucd.frequency != 0) AND ucd.status != -9" +
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
      productPrice_field +
      " " +
      searchLeads_field +
      " " +
      sortLeadDateVar_field +
      " ";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"], startDate: where["startDate"], endDate: where["endDate"], batchSize: where["batchSize"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function FindProfileDetail(where: any, callback: any) {
  try {
    let Query = "";
    if (where["userRole"] && where["userRole"] == "Client") {
      Query =
        "SELECT sp.*, sp.name as smeName, ur.ROLE as roles, ur.username as userName, u.user_token, u.user_key, u.user_time FROM sme_profile sp INNER JOIN user_roles ur on ur.username = sp.id INNER JOIN users u on u.username = ur.username  WHERE id = :id LIMIT 1";
    } else if ((where["userRole"] && where["userRole"] == "Agent") || where["userRole"] == "ADMIN") {
      Query =
        "SELECT sp.account_sid, ad.agent_email, ad.agent_extention, ad.agent_id, agm.group_id, ad.agent_masking, ad.agent_mobile, agent_name AS agentName, ad.agent_score, sp.agent_relax_time, sp.allowed_agents, sp.alternate_number, ad.assign_failed_calls, ad.assign_voicemail_calls, ad.webrtc_flag, ad.webrtc_secret, ad.webrtc_registered_flag, sp.balance, sp.biz_address, sp.call_back_url, ad.days_flag, ad.in_time, ad.out_time, ad.recording_type, sp.gui_timer, sp.in_channels, sp.insert_time, sp.in_permission_flag AS sme_in_call_permission, ad.in_permission_flag AS agent_in_call_permission, ad.break_permission_flag AS agent_break_permission, sp.out_permission_flag AS sme_out_call_permission, ad.out_permission_flag AS agent_out_call_permission, sp.in_queue_channels, sp.`language`, sp.masking, l.longcode, l.id AS longcode_id, sp.out_channels, sp.recording, sp.rec_validity, sp.eod_report_flag, sp.selection_algo, sp.service_flag, sp.id AS smeId, sp.sme_mobile, sp.email_id AS sme_name, sp.`status` AS sme_status, ad.`status` AS agent_status, sp.sticky_algo, ad.sticky_agent, ad.sticky_days, ur.ROLE as roles, sp.name AS smeName, sp.lead_manager_permission_flag, sp.billing_status, u.username AS userName, sp.user_version FROM sme_profile sp LEFT JOIN agent_details ad ON ad.sme_id = sp.id LEFT JOIN agent_group_mapping agm ON agm.agent_id = ad.agent_id LEFT JOIN users u ON u.username = ad.agent_email LEFT JOIN user_roles ur ON ur.username = u.username LEFT JOIN longcodes_sme_mapping lsm ON lsm.sme_id = sp.id LEFT JOIN longcodes l ON l.id = lsm.longcode_id  WHERE u.username = :id and ad.`status` != -9 and u.enabled=1 LIMIT 1";
    }
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

export async function insertUpdateBulkCity(payload: any, condition: any, callback: any) {
  SME_CITY.findOne({ where: condition }).then(function (obj) {
    // update
    if (obj) {
      obj.update(payload);
      callback(null, { status: 1 });
    } else {
      // insert
      SME_CITY.create(payload);
      callback(null, { status: 1 });
    }
  });
}

export async function updatePassword(payload: any, callback: any) {
  try {
    let Query = "update users set password = :password where username  = :username LIMIT 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        password: payload["password"],
        username: payload["username"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function deleteToken(payload: any, callback: any) {
  try {
    let Query = "delete from forget_password where sme_id  = :sme_id LIMIT 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        sme_id: payload["sme_id"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function insertUpdateForgotPassword(payload: any, condition: any, callback: any) {
  FORGOT_PASSWORD.findOne({ where: condition }).then(function (obj) {
    // update
    if (obj) {
      obj.update(payload);
      callback(null, { status: 1 });
    } else {
      // insert
      FORGOT_PASSWORD.create(payload);
      callback(null, { status: 1 });
    }
  });
}

/**  find */
export async function FindComplaint(where: fetchRequest, callback: any) {
  try {
    let Query =
      "select id, subject, complaint_detail, email_id, category, solution, status, DATE_FORMAT(complaint_date_time, '%Y-%m-%d %H:%i:%s')as complaint_date_time, DATE_FORMAT(solution_date_time, '%Y-%m-%d %H:%i:%s') as solution_date_time, DATE_FORMAT(update_date_time, '%Y-%m-%d %H:%i:%s') as update_date_time, assignee_name, parent_id, sme_id from sme_complaints where sme_id  = :id and status = 0";

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

export async function insertComplaint(where: any, callback: any) {
  try {
    let Query =
      "Insert into sme_complaints (subject, complaint_detail, email_id, category, status, sme_id,complaint_date_time) values ( :subject, :complaintDetail, :emailId, :category, :status, :smeId, :insertDateTime)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        category: where["category"],
        complaintDetail: where["complaintDetail"],
        emailId: where["emailId"],
        status: where["status"],
        subject: where["subject"],
        smeId: where["smeId"],
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

export async function UpdateComplaint(where: any, callback: any) {
  try {
    let Query =
      "UPDATE sme_complaints SET subject = :subject, complaint_detail = :complaintDetail, email_id = :emailId, category = :category,  status = :status, sme_id = :smeId, update_date_time=:insertDateTime where id= :id";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        category: where["category"],
        complaintDetail: where["complaintDetail"],
        emailId: where["emailId"],
        status: where["status"],
        subject: where["subject"],
        smeId: where["smeId"],
        id: where["id"],
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

/** find */
export async function FindGroupDetails(where: groupdetailsRequest, callback: any) {
  try {
    let Query =
      "Select group_id, group_id as agentGroupId, group_name, group_name as agentGroupName, group_status, create_date_time, update_date_time from agent_group_detail where group_status = :status";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { status: where["status"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function FindagentDetails(where: getAgentdetailRequestValidate, callback: any) {
  try {
    let Query =
      "Select agent_id, sme_id, agent_name, agent_mobile, status, insert_time, in_time, out_time, days_flag, agent_position, agent_extention, agent_email, sticky_agent, agent_masking, agent_score, sticky_days, is_updated, assign_failed_calls, assign_voicemail_calls, recent_call_date_time, in_permission_flag, out_permission_flag, break_permission_flag from agent_details where sme_id = :id and status = 1";
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

/** find lead settings*/
export async function FindleadSettings(where: fetchRequest, callback: any) {
  try {
    let Query = "select lead_settings, call_settings from sme_profile where id  = :id";
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

export async function updateleadSettings(where: any, callback: any) {
  try {
    let Query = "update sme_profile set lead_settings = :leadColumns where id = :id and status = 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        id: where["id"],
        leadColumns: where["leadColumns"],
      },
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
      insert_customer_number_field = " AND SUBSTRING(TRIM(vcc.calling_number), -10) = SUBSTRING(:customerNumber, -10)";
    }

    if (where["duration"] && where["duration"] > 0) {
      insert_duration_field = " AND vcc.duration = :duration";
    }

    if (where["sessionId"] && where["sessionId"] != "") {
      insert_session_id_field = " AND vcc.session_id = :session_id";
    }

    let Query =
      "select vcc.id, vcc.sme_id, DATE_FORMAT(vcc.start_date_time, '%Y-%m-%d %H:%i:%s') as start_date_time, DATE_FORMAT(vcc.end_date_time, '%Y-%m-%d %H:%i:%s') as end_date_time, DATE_FORMAT(vcc.insert_date_time, '%Y-%m-%d %H:%i:%s') as insert_date_time,  DATE_FORMAT(rec.insert_date, '%Y-%m-%d %H:%i:%s') as rec_date_time, vcc.duration, vcc.longcode, vcc.hlr, vcc.master_shortcode, vcc.sme_identifier, vcc.shortcode_mapping, vcc.call_direction_status, vcc.call_direction, vcc.calling_number, vcc.called_number, vcc.call_recording_status, vcc.call_recorded_file, vcc.voicemail_recording_status, vcc.voicemail_recording_file, vcc.channel_no, vcc.server_ip_address, vcc.cdr_mode, vcc.agent_group, vcc.patched_agent_id, vcc.session_id, vcc.merge_status, vcc.answer, vcc.address_book_id, vcc.customer_name,rec.call_id, rec.merged_file, rec.filename from incoming_ivr_call_cdr vcc left join mpbx_call_recording rec on rec.call_id = vcc.call_recorded_file  where vcc.sme_id = :id  and vcc.call_type = 3" +
      insert_date_time_field +
      " " +
      insert_customer_number_field +
      " " +
      insert_duration_field +
      " " +
      insert_session_id_field +
      " order by vcc.insert_date_time desc limit" +
      " " +
      g_initialRecord +
      ", :batchSize";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        id: where["id"],
        startDate: where["startDate"],
        endDate: where["endDate"],
        customerNumber: where["customerNumber"],
        duration: where["duration"],
        session_id: where["sessionId"],
        batchSize: where["batchSize"],
      },
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

    let Query = "SELECT count(*) as total_records from voicemail_call_cdr vcc where sme_id = :id " + insert_date_time_field + " order by vcc.insert_date_time desc";

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

/** find longcodes*/
export async function FindLongcodes(where: any, callback: any) {
  try {
    let longcode_agent_mapping = "";

    if(where["mode"] && (where["mode"] == "add_agent" || where["mode"] == "edit_agent") ){
      longcode_agent_mapping = " AND NOT EXISTS (SELECT longcode_id FROM longcodes_agent_mapping lam1 WHERE lsm.longcode_id = lam1.longcode_id)";
    }
    let Query =
      "SELECT SUBSTRING(TRIM(lc.longcode), -10) as longcode, lc.id, lc.status, lc.number_type, lsm.call_flow_id FROM longcodes lc INNER JOIN longcodes_sme_mapping lsm ON lsm.longcode_id = lc.id WHERE lsm.sme_id = :id";
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

/** update notification token*/
export async function UpdatenotificationToken(where: any, callback: any) {
  try {

    let Query = "update users set notification_token = :token where username = :username";

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

/** find agent list */
export async function FindAgentList(where: any, callback: any) {
  try {
    let Query =
      "SELECT ad.agent_id,ad.longcode_priority_flag as virtualNumberPriority, ad.sme_id, ad.agent_name, ad.agent_mobile, ad.`status`, DATE_FORMAT(ad.insert_time, '%Y-%m-%d %H:%i:%s') as insert_time, DATE_FORMAT(ad.insert_time, '%Y-%m-%d') as insert_date, DATE_FORMAT(ad.in_time, '%H:%i') AS in_time, DATE_FORMAT(ad.out_time, '%H:%i') AS out_time, ad.days_flag, ad.agent_position, ad.agent_extention, ad.agent_email, ad.sticky_agent, ad.sticky_days, ad.is_updated,ad.assign_failed_calls, ad.assign_voicemail_calls, ad.recent_call_date_time, ad.in_permission_flag, ad.out_permission_flag, ad.break_permission_flag, ad.agent_masking, ad.webrtc_flag as webrtcFlag, ad.recording_type as recordingType, agd.group_name,agd.group_id, u.username as user_name, u.password, ( SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('longcode', lc.longcode, 'id', lc.id,'status', lc.status)), ']') FROM longcodes lc INNER JOIN longcodes_agent_mapping lsm ON lsm.longcode_id = lc.id WHERE lsm.agent_id = ad.agent_id) AS longcodesjson FROM agent_details ad LEFT JOIN agent_group_mapping agm ON agm.agent_id = ad.agent_id LEFT JOIN agent_group_detail agd ON agd.group_id = agm.group_id LEFT JOIN users u ON u.username = ad.agent_email WHERE ad.sme_id = :id AND ad.`status` != -9  ORDER BY ad.agent_position ASC ";
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

/** find ivr*/
export async function FindIvrFlow(where: any, callback: any) {
  try {
    let Query =
      "Select id, sme_id as smeId, cat_id as catId, flow_id as flowId, flow_name as flowName, cat_desc as catDescription, parent_cat_id as parentId, children as child, dtmf, media_file_status as mediaFileStatus, media_file as mediaFilePath, service_type as servicrType, title as catTitle, event_type as eventType, type from mpbx_category_master where sme_id = :id AND (flow_id = :flowId OR flow_id IS NULL OR flow_id = '') ORDER BY id ASC";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"], flowId: where["flowId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** Insert insertUpdateIvrFlow*/
export async function insertUpdateIvrFlow(payload: any, callback: any) {
  try {
    let Query =
      "INSERT INTO mpbx_category_master (sme_id, cat_id, cat_desc, parent_cat_id,children, dtmf, media_file_status, media_file, title, event_type,type,date_time, flow_id, flow_name) values (:sme_id, :catId, :catDescription , :parentId, :child, :dtmf, :mediaFileStatus, :mediaFilePath, :catTitle, :eventType, :type, :insertDateTime, :flowId, :flowName)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        sme_id: payload["sme_id"],
        catId: payload["catId"],
        catDescription: payload["catDescription"],
        parentId: payload["parentId"],
        child: payload["child"],
        dtmf: payload["dtmf"],
        mediaFileStatus: payload["mediaFileStatus"],
        mediaFilePath: payload["mediaFilePath"],
        catTitle: payload["catTitle"],
        eventType: payload["eventType"],
        type: payload["type"],
        insertDateTime: payload["insertDateTime"],
        flowId: payload["flowId"],
        flowName: payload["flowName"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getMaxFlowId(where: any, callback: any) {
  try {
    let Query = "select max(flow_id) as flow_id from mpbx_category_master where sme_id = :sme_id";
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

export async function insertUpdateBulkBaselist(payload: any, callback: any) {
  try {
    let Query = "Insert into call_scheduler_base (sme_id, agent_id, description, mobile,insert_time) values(:sme_id, :agentId, :desc, :mobile,:insertDateTime)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { sme_id: payload["sme_id"], agentId: payload["agentId"], desc: payload["desc"], mobile: payload["mobile"], insertDateTime: payload["insertDateTime"] },
    });
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
    let agent_id = "";

    if (where["agentId"] != 0) {
      agent_id = "and agent_id=" + where["agentId"];
    }

    let Query =
      "Select SUM(total_in_calls) AS totalInCalls, SUM(avg_call_duration) AS avgCallDuration, SUM(in_failed_calls) AS inFailedCalls, SUM(in_success_calls) AS inSuccessCalls, SUM(total_out_calls) AS totalOutCalls, SUM(total_calls) AS totalCalls, SUM(total_call_duration) AS totalCallDuration, SUM(out_success_calls) AS outSuccessCalls, (SUM(out_success_calls) * 100) / (SUM(total_out_calls)) AS outSuccess, SUM(out_failed_calls) AS outFailedCalls, SUM(office_hours) AS officeHours,SUM(no_answer) AS noAnswer ,SUM(lunch_hours) AS lunchHours, (SUM(in_success_calls) * 100)/(SUM(total_in_calls)) AS inSuccess, SUM(total_connected_duration) AS totalConnectedDuration, SUM(avg_connected_duration) AS avgConnectedDuration, SUM(total_ringing_duration) AS totalRingingDuration, SUM(avg_ringing_duration) AS avgRingingDuration from agent_calling_details  where sme_id = :sme_id " +
      agent_id +
      "  and insert_date BETWEEN :startDate and :endDate";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], agentId: where["agentId"], startDate: where["startDate"], endDate: where["endDate"] },
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
      status_field = ' and ucd.status =  "' + where["status"] + '"';
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
      limit_field = " limit " + g_initialRecord + "," + where["batchSize"] + "";
    }

    let Query =
      'SELECT ucd.id, ucd.sme_id,  DATE_FORMAT(ucd.insert_date, "%Y-%m-%d %H:%i:%s") as insert_date, ucd.duration, ucd.status, ucd.agent_id, ucd.response_message, ucd.agent_group, DATE_FORMAT(ucd.start_date, "%Y-%m-%d %H:%i:%s") as start_date, DATE_FORMAT(ucd.end_date, "%Y-%m-%d %H:%i:%s") as end_date, ucd.response_code, ucd.connected_duration, ucd.ringing_duration, ucd.customer_ani, ucd.session_id, ucd.call_mode,  ucd.call_info, ucd.call_route_reason, ucd.agent_number AS agent_report_detail_agent_number, ad.agent_name as agent_name, ad.agent_mobile as agent_number FROM agent_report_details ucd left join agent_details ad on ucd.agent_id = ad.agent_id  WHERE ucd.sme_id = :sme_id  ' +
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

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], startDate: where["startDate"], endDate: where["endDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** check can create agent  */
export async function checkCanCreateAgent(where: fetchRequest, callback: any) {
  try {
    let Query = "SELECT sp.allowed_agents, COUNT(ad.agent_id) AS total_agents FROM sme_profile sp LEFT JOIN agent_details ad ON sp.id = ad.sme_id WHERE ad.`status` != -9 AND sp.id = :id";
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

/** check agent mobile exist*/
export async function checkAgentMobileExist(where: any, callback: any) {
  try {
    var agent_id_field = "";
    if (where["agentId"] && where["agentId"] != "") {
      agent_id_field = " AND agent_id != " + where["agentId"] + "";
    }
    let Query = "Select agent_mobile from agent_details where sme_id = :id and SUBSTRING(TRIM(agent_mobile), -10) = SUBSTRING(:agentMobile, -10) and status != '-9' " + agent_id_field + "";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"], agentMobile: where["agentMobile"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** check agent email exist*/
export async function checkAgentEmailExist(where: any, callback: any) {
  try {
    var agent_id_field = "";
    if (where["agentId"] && where["agentId"] != "") {
      agent_id_field = " AND agent_id != " + where["agentId"] + "";
    }

    let Query = "Select agent_email from agent_details where agent_email = :agentEmail and status != '-9' " + agent_id_field + " limit 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agentEmail: where["agentEmail"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** add user  */
export async function addUser(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO users (username, password, enabled) VALUES (:username, :password, '1')";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { username: payload["agentEmail"], password: payload["password"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** add user role */
export async function addUserRole(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO user_roles (user_role_id, username, ROLE) select MAX(user_role_id)+1, :agentEmail, :role FROM user_roles";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { agentEmail: payload["agentEmail"], role: payload["role"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** Add agent  */
export async function addAgentData(payload: addAgentRequest, where: any, callback: any) {
  try {
    var Query;
    if (where["agentExtension"] == null) {
      Query =
        "INSERT INTO agent_details (sme_id, agent_name, agent_mobile, status, in_time, out_time, days_flag, agent_email, sticky_agent, agent_masking, sticky_days, assign_failed_calls, assign_voicemail_calls, in_permission_flag, out_permission_flag, agent_extention, agent_position, insert_time, break_permission_flag,longcode_priority_flag, recording_type) values(:id, :agentName, :agentMobile, :status, :inTime, :outTime, :daysFlag, :agentEmail, :stickyAgent, :agentMasking, :stickyDays, :assignFailedCalls, :assignVoicemailCalls, :inPermissionFlag, :outPermissionFlag,  1001, 1, :insertDateTime, :breakPermissionFlag, :virtualNumberPriority, :recordingType)";
    } else {
      Query =
        "INSERT INTO agent_details (sme_id, agent_name, agent_mobile, status, in_time, out_time, days_flag, agent_email, sticky_agent, agent_masking, sticky_days, assign_failed_calls, assign_voicemail_calls, in_permission_flag, out_permission_flag,break_permission_flag, agent_extention, agent_position, insert_time,longcode_priority_flag, recording_type) values(:id, :agentName, :agentMobile, :status, :inTime, :outTime, :daysFlag, :agentEmail, :stickyAgent, :agentMasking, :stickyDays, :assignFailedCalls, :assignVoicemailCalls, :inPermissionFlag, :outPermissionFlag, :breakPermissionFlag, :agentExtension, :agentPosition, :insertDateTime,:virtualNumberPriority, :recordingType)";
    }

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        id: payload["id"],
        agentName: payload["agentName"],
        agentMobile: payload["agentMobile"],
        status: payload["status"],
        inTime: payload["inTime"],
        outTime: payload["outTime"],
        daysFlag: payload["daysFlag"],
        agentEmail: payload["agentEmail"],
        stickyAgent: payload["stickyAgent"],
        agentMasking: payload["agentMasking"],
        stickyDays: payload["stickyDays"],
        assignFailedCalls: payload["assignFailedCalls"],
        assignVoicemailCalls: payload["assignVoicemailCalls"],
        inPermissionFlag: payload["inPermissionFlag"],
        outPermissionFlag: payload["outPermissionFlag"],
        insertDateTime: payload["insertDateTime"],
        breakPermissionFlag: payload["breakPermissionFlag"],
        agentExtension: where["agentExtension"],
        agentPosition: where["agentPosition"],
        virtualNumberPriority: payload["virtualNumberPriority"],
        recordingType: payload["recordingType"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** add agent group mapping  */
export async function addAgentGroupMapping(payload: addAgentGroupMappingRequest, callback: any) {
  try {
    let Query = "INSERT INTO agent_group_mapping (agent_id, group_id, insert_date_time) VALUES (:agentId, :groupId, :insertDateTime)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { agentId: payload["agentId"], groupId: payload["groupId"], insertDateTime: payload["insertDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** add agent details timing  */
export async function addAgentDetailsTiming(payload: addAgentDetailsTimingRequest, callback: any) {
  try {
    let Query =
      "INSERT INTO agent_details_timing (agent_id, sme_id, agent_name, agent_mobile, status, in_time, out_time, days_week, insert_time) VALUES (:agentId, :smeId, :agentName, :agentMobile, :status, :inTime, :outTime, :daysWeek, :insertDateTime)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        agentId: payload["agentId"],
        smeId: payload["smeId"],
        agentName: payload["agentName"],
        agentMobile: payload["agentMobile"],
        status: payload["status"],
        inTime: payload["inTime"],
        outTime: payload["outTime"],
        daysWeek: payload["daysWeek"],
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
/** find system detail*/
export async function FindSystemDetail(where: any, callback: any) {
  try {
    let Query =
      "SELECT SUM(case when service_id = 11 then total_calls else 0 end) as voicemail, SUM(case when service_id = 1 then total_calls else 0 end) as totalIncoming, SUM(case when service_id = 2 then total_calls else 0 end) as totalOutgoing, SUM(case when service_id = 15 then total_calls else 0 end) as incomingFailed, SUM(case when service_id = 25 then total_calls else 0 end) as outgoingFailed, SUM(case when service_id = 16 then total_calls else 0 end) as incomingSuccess, SUM(case when service_id = 26 then total_calls else 0 end) as outgoingSuccess, SUM(case when service_id = 3 then total_calls else 0 end) as recording FROM revenue_details where sme_id = :id and date_time BETWEEN :startDate and  :endDate";
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

/** update customer name in address book*/
export async function UpdateAddressBookCustomername(where: any, callback: any) {
  try {
    let Query =
      "update address_book set customer_name = :customerName, updated_date_time= :insertDateTime, status = 1 where SUBSTRING(TRIM(customer_number_primary), -10)=SUBSTRING(:customerNumber, -10) and sme_id = :sme_id";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        customerName: where["customerName"],
        customerNumber: where["customerNumber"],
        sme_id: where["smeId"],
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

/** update customer name in address book*/
export async function UpdateAddressBookReturnUpdateRow(where: any, callback: any) {
  try {
    ADDRESS_BOOK.update(
      {
        customer_name: where["customerName"],
      },
      { where: { customer_number_primary: where["customerNumber"], sme_id: where["sme_id"] } }
    )
      .then(function (rowsUpdate) {
        // use affectedRows here
        console.log(rowsUpdate);
      })
      .catch((err: any) => {
        console.log(err);
      });
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** update customer name in unique customer details*/
export async function UpdateUniqueCustomername(where: any, callback: any) {
  try {
    let Query = "update unique_customer_detail set address_book_id = :addressBookId where id  = :uniqueId and sme_id = :sme_id";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        addressBookId: where["addressBookId"],
        uniqueId: where["uniqueId"],
        sme_id: where["sme_id"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** update customer name in incoming ivr cdr*/
export async function UpdateIncomingCustomername(where: any, callback: any) {
  try {
    let Query = "update incoming_ivr_call_cdr set address_book_id = :addressBookId where SUBSTRING(TRIM(calling_number), -10)=SUBSTRING(:customerNumber, -10) and sme_id = :sme_id";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        addressBookId: where["addressBookId"],
        customerNumber: where["customerNumber"],
        sme_id: where["sme_id"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** update customer name in outbond ivr cdr*/
export async function UpdateOutgoingCustomername(where: any, callback: any) {
  try {
    let Query = "update outbond_ivr_cdr set address_book_id = :addressBookId where SUBSTRING(TRIM(called_number), -10) = SUBSTRING(:customerNumber, -10) and sme_id = :sme_id";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        addressBookId: where["addressBookId"],
        customerNumber: where["customerNumber"],
        sme_id: where["sme_id"],
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
    payload["customerNumber"] = payload["customerNumber"].toString().indexOf("+91") !== -1 ? payload["customerNumber"].toString().trim() : "+91"+payload["customerNumber"].toString().trim();

    let Query =
      "INSERT INTO address_book (sme_id, customer_name, customer_number_primary, created_by, insert_date_time, status) VALUES (:sme_id, :customerName, :customerNumber, :createdBy,:insertDateTime, 1)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        sme_id: payload["smeId"],
        customerName: payload["customerName"],
        customerNumber: payload["customerNumber"],
        createdBy: payload["createdBy"],
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

/** revoke notification token*/
export async function removeNotificationToken(where: any, callback: any) {
  try {
    let Query = "update users set notification_token = :token where username  = :username";
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

/** update agent  */
export async function updateAgentData(payload: any, callback: any) {
  try {
    let Query =
      "UPDATE agent_details SET agent_name = :agentName , agent_mobile = :agentMobile, status = :status, in_time = :inTime, out_time = :outTime, days_flag = :daysFlag, agent_email = :agentEmail, sticky_agent = :stickyAgent, agent_masking = :agentMasking, sticky_days = :stickyDays, assign_failed_calls = :assignFailedCalls, assign_voicemail_calls = :assignVoicemailCalls, in_permission_flag = :inPermissionFlag, out_permission_flag = :outPermissionFlag, agent_extention = :agentExtension, break_permission_flag = :breakPermissionFlag, longcode_priority_flag = :virtualNumberPriority, webrtc_flag = :webrtcFlag, recording_type = :recordingType WHERE sme_id = :id and agent_id = :agentId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        agentName: payload["agentName"],
        agentMobile: payload["agentMobile"],
        status: payload["status"],
        inTime: payload["inTime"],
        outTime: payload["outTime"],
        daysFlag: payload["daysFlag"],
        agentEmail: payload["agentEmail"],
        stickyAgent: payload["stickyAgent"],
        agentMasking: payload["agentMasking"],
        stickyDays: payload["stickyDays"],
        assignFailedCalls: payload["assignFailedCalls"],
        assignVoicemailCalls: payload["assignVoicemailCalls"],
        inPermissionFlag: payload["inPermissionFlag"],
        outPermissionFlag: payload["outPermissionFlag"],
        agentExtension: payload["agentExtension"],
        id: payload["id"],
        agentId: payload["agentId"],
        breakPermissionFlag: payload["breakPermissionFlag"],
        virtualNumberPriority: payload["virtualNumberPriority"],
        webrtcFlag: payload["webrtcFlag"],
        recordingType: payload["recordingType"]
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** update agent group mapping  */
export async function updateAgentGroupMapping(payload: addAgentGroupMappingRequest, callback: any) {
  try {
    let Query = "UPDATE agent_group_mapping SET group_id = :groupId, update_date_time=:insertDateTime WHERE agent_id = :agentId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { groupId: payload["groupId"], agentId: payload["agentId"], insertDateTime: payload["insertDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** delete agent details timing  */
export async function deleteAgentDetailsTiming(payload: addAgentDetailsTimingRequest, callback: any) {
  try {
    let Query = "DELETE from agent_details_timing  WHERE agent_id = :agentId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: { agentId: payload["agentId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** delete agent  */
export async function deleteAgentData(payload: any, callback: any) {
  try {
    let Query = "DELETE from agent_details  WHERE sme_id = :id and agent_id = :agentId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: { status: payload["status"], id: payload["id"], agentId: payload["agentId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** delete agent  */
export async function deleteAgentFromDetailsTiming(payload: any, callback: any) {
  try {
    let Query = "DELETE from agent_details_timing  WHERE sme_id = :id and agent_id = :agentId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: { id: payload["id"], agentId: payload["agentId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** delete agent  */
export async function deleteAgentDataFromUserRoles(payload: any, callback: any) {
  try {
    let Query = "DELETE from user_roles  WHERE username = :agentEmail";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: { agentEmail: payload["agentEmail"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** delete agent  */
export async function deleteAgentDataFromUsers(payload: any, callback: any) {
  try {
    let Query = "DELETE from users  WHERE username = :agentEmail";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: { agentEmail: payload["agentEmail"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** Add logs to agent  */
export async function addAgentLogs(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO agent_delete_logs (agent_id, agent_name, agent_email, agent_number, status, action) VALUES (:agentId, :agentName, :agentEmail, :agentNumber, :status, 'Deleted')";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { agentId: payload["agentId"], agentName: payload["agentName"], agentEmail: payload["agentEmail"], agentNumber: payload["agentNumber"], status: payload["status"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** get insights agent status */
export async function FindgetInsightsAgentStatus(where: any, callback: any) {
  try {
    let Query =
      "SELECT SUM(CASE WHEN ad.STATUS = 2 THEN 1 ELSE 0 END) AS busyAgents, SUM(CASE WHEN ad.STATUS = 1 THEN 1 ELSE 0 END) AS freeAgents, SUM(CASE WHEN ad.STATUS = 0 THEN 1 ELSE 0 END) AS inactiveAgents, SUM(CASE WHEN ad.STATUS = 4 THEN 1 ELSE 0 END) AS lunchBreak, SUM(CASE WHEN ad.STATUS = 2 OR ad.STATUS = 1 OR ad.STATUS = 4 OR ad.STATUS = 0 THEN 1 ELSE 0 END) AS totalAgents, sp.allowed_agents - SUM(CASE WHEN ad.STATUS = 2 OR ad.STATUS = 1 OR ad.STATUS = 4 OR ad.STATUS = 0 THEN 1 ELSE 0 END) AS unregisteredAgents FROM agent_details AS ad LEFT JOIN sme_profile AS sp ON sp.id =ad.sme_id  where ad.sme_id = :id and ad.status != -9";
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

/** find system detail graph*/
export async function FindSystemDetailGraph(where: any, callback: any) {
  try {
    let Query =
      "SELECT date_time, SUM(case when service_id = 11 then total_calls else 0 end) as voicemail, SUM(case when service_id = 1 then total_calls else 0 end) as totalIncoming, SUM(case when service_id = 2 then total_calls else 0 end) as totalOutgoing, SUM(case when service_id = 15 then total_calls else 0 end) as incomingFailed, SUM(case when service_id = 25 then total_calls else 0 end) as outgoingFailed, SUM(case when service_id = 16 then total_calls else 0 end) as incomingSuccess, SUM(case when service_id = 26 then total_calls else 0 end) as outgoingSuccess, SUM(case when service_id = 3 then total_calls else 0 end) as recording FROM revenue_details where sme_id = :id and date_time BETWEEN :startDate and  :endDate GROUP BY DATE_FORMAT(insert_time, '%Y-%m-%d')";
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

/** find system detail graph*/
export async function getNotificationData(where: any, callback: any) {
  try {
    let agent_Id_field ;
    if (where["agentId"] && where["agentId"] != "") {
      agent_Id_field = " and sm.username ='" + where["agentEmail"]+"'";
    } else {
      agent_Id_field = " and sm.username =" + where["id"];
    }
    let Query =
      "SELECT sm.`event`, sm.message, sm.title, sm.priority, sm.is_read, sm.customer_number as customerNumber, sm.id AS notification_id, DATE_FORMAT(sm.insert_date_time, '%Y-%m-%d %H:%i:%s') AS notification_date_time, sm.session_id, iicd.connected_duration, iicd.duration, iicd.calling_number, iicd.call_direction ,ad.agent_name FROM sme_notification AS sm LEFT JOIN incoming_ivr_call_cdr AS iicd ON sm.session_id = iicd.session_id LEFT JOIN agent_details AS ad ON sm.agent_id = ad.agent_id WHERE sm.sme_id = :id" +
      agent_Id_field +
      "  AND sm.mode = 'WEB' AND sm.insert_date_time >= DATE_ADD(CURDATE(), INTERVAL -3 DAY) order BY sm.insert_date_time DESC";
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

/** notification mark all as read  */
export async function markAllAsReadData(payload: any, callback: any) {
  try {
    let is_read_field = "";
    let notification_id_field = "";

    if (payload["notificationId"]) {
      notification_id_field = " and id = " + payload["notificationId"] + "";
      is_read_field = " is_read = " + payload["isRead"] + "";
    } else {
      is_read_field = " is_read = 1";
    }

    let Query = "update sme_notification set " + is_read_field + " where  sme_id  = :id " + notification_id_field + "";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { id: payload["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindSmsTemplate(where: any, callback: any) {
  try {
    let Query = "Select id, template_name, message, dlt_principal_id,dlt_content_id,dlt_telemarketer_id,unicode, v_from,insert_date_time from comm_sme_sms_template where sme_id=:id and status !=-9 order by insert_date_time desc";
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

export async function FindAudioUrlRrcording(call_id: any, callback: any) {
  try {
    let Query = "Select s3_url from mpbx_call_recording where call_id=:id";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: call_id },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function addSmstemplate(payload: any, callback: any) {
  try {
    let Query =
      "INSERT INTO comm_sme_sms_template (sme_id, dlt_content_id, message,unicode,insert_date_time, dlt_principal_id, template_name,v_from) values (:smeId, :template_id, :message_text,:unicode, :insertDateTime,  :principle_id , :template_name, :v_from )";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        template_id: payload["template_id"],
        message_text: payload["message_text"],
        insertDateTime: payload["insertDateTime"],
        principle_id: payload["principle_id"],
        template_name: payload["template_name"],
        unicode: payload["unicode"],
        v_from: payload["v_from"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindSmsCampaign(where: any, callback: any) {
  try {
    let Query =
      "Select scamp.upload_type, scamp.id,scamp.template_id as templateLabel,scamp.base_file,cli,scamp.base_count,scamp.insert_date,scamp.start_time,scamp.end_time,scamp.status,scamp.sucess_count, scamp.fail_count, scamp.invalid_count, scamp.sme_id,scamp.campaign_name as name,scamp.filtered_file,scamp.failed_file,scamp.success_file, scamp.duplicate_file,scamp.invalid_file,scamp.duplicate_count,scamp.filtered_count,scamp.principal_id,scamp.campaign_type as type,scamp.header_id as header, scamp.campaign_message as campaignMessage,smh.header_name as header_name from sms_campaign scamp  left join sms_header as smh on scamp.header_id =smh.id  where scamp.sme_id =:id and scamp.status !=-9";
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

export async function addSmsCampaign(where: any, callback: any) {
  try {
    let Query =
      "INSERT INTO sms_campaign (template_id,header_id,principal_id,campaign_name, base_file, cli, base_count, insert_date,start_time,end_time,sucess_count,fail_count,invalid_count,sme_id,filtered_count,duplicate_count,duplicate_file,filtered_file,invalid_file,campaign_type,campaign_message) values ( :template_id,:header_id,:principal_id, :campaign_name, :base_file,  :cli,  :base_count,  :insertDateTime,  :start_time,  :end_time,  :sucess_count,  :fail_count,  :invalid_count, :sme_id, :filtered_count, :duplicate_count, :duplicate_file, :filtered_file, :invalid_file, :campaign_type, :campaign_message) ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        template_id: where["template_id"],
        base_file: where["base_file"],
        cli: where["cli"],
        base_count: where["base_count"],
        insert_date: where["insert_date"],
        start_time: where["start_time"],
        end_time: where["end_time"],
        sucess_count: where["sucess_count"],
        fail_count: where["fail_count"],
        invalid_count: where["invalid_count"],
        sme_id: where["sme_id"],
        insertDateTime: where["insertDateTime"],
        filtered_file: where["filtered_file"],
        duplicate_file: where["duplicate_file"],
        duplicate_count: where["duplicate_count"],
        filtered_count: where["filtered_count"],
        invalid_file: where["invalid_file"],
        header_id: where["header_id"],
        principal_id: where["principal_id"],
        campaign_type: where["campaign_type"],
        campaign_name: where["campaign_name"],
        campaign_message: where["campaign_message"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** get blacklist numbers*/
export async function FindBlacklistNumbers(where: fetchRequest, callback: any) {
  try {
    let Query =
      'SELECT bwl.customer_number, ab.customer_name, bwl.reason, DATE_FORMAT(bwl.inserted_date_time, "%Y-%m-%d %H:%i:%s") as inserted_date_time, bwl.created_by, sp.name as client_name, ad.agent_name as agent_name FROM black_white_list bwl LEFT JOIN address_book ab ON SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(bwl.customer_number, -10) AND ab.sme_id = bwl.sme_id AND ab.`status` != -9 LEFT JOIN sme_profile sp on sp.id = bwl.created_by LEFT JOIN agent_details ad on ad.agent_id = bwl.created_by WHERE bwl.sme_id = :sme_id AND bwl.blacklist_status = 1';
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

/** check customers exist in blacklist */
export async function checkBlacllistCustomerExist(where: any, callback: any) {
  try {
    let Query = "SELECT id FROM black_white_list bwl WHERE bwl.sme_id = :sme_id AND SUBSTRING(TRIM(bwl.customer_number), -10) = SUBSTRING(:customer_number, -10) and blacklist_status != -9";
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

/** add customers to blacklist */
export async function addBlackWhiteListNumbers(where: any, callback: any) {
  try {
    let Query =
      "INSERT INTO black_white_list (sme_id, created_by, customer_number, blacklist_status, reason,inserted_date_time) values (:sme_id, :created_by, :customer_number, :blacklist_status, :reason, :insertDateTime )";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        sme_id: where["smeId"],
        created_by: where["created_by"],
        customer_number: where["customer_number"],
        blacklist_status: where["blacklist_status"],
        reason: where["reason"],
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

/** Update customers to blacklist */
export async function updateBlackWhiteListNumbers(where: any, callback: any) {
  try {
    let Query =
      "UPDATE black_white_list set blacklist_status = :blacklist_status, updated_date_time=:insertDateTime WHERE sme_id = :smeId AND SUBSTRING(customer_number, -10) = SUBSTRING(:customer_number, -10)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { blacklist_status: where["blacklist_status"], smeId: where["smeId"], customer_number: where["customer_number"], insertDateTime: where["insertDateTime"] },
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
    let unique_customer_detail_join = "";
    let searchLeads_field = "";

    if(where["initialRecord"]) {
      initialRecord = where["initialRecord"] - 1;
      limit_field = "limit " + initialRecord + "," + where["batchSize"] + "";
    }

    if (where["customer_number"] != "") {
      customer_number_field = " and SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(" + where["customer_number"] + ", -10)";
    }
    if (where["agent_id"] != "") {
      agent_id_field = " and  (ab.created_by = " + where["agent_id"] + " OR (ucd.assigned_agent_id = " + where["agent_id"] + " AND RIGHT(ucd.customer_number, 10) = RIGHT(ab.customer_number_primary, 10)))";
      unique_customer_detail_join = " LEFT JOIN unique_customer_detail ucd ON ucd.sme_id = ab.sme_id AND RIGHT(ucd.customer_number, 10) = RIGHT(ab.customer_number_primary, 10)";
    }

    //company name
    if (where["companyName_op"] == "1") {
      //Equals to
      company_name_field = ' and ab.company_name = "' + where["companyName"] + '"';
    } else if (where["companyName_op"] == "2") {
      //Not Equals to
      company_name_field = ' and ab.company_name != "' + where["companyName"] + '"';
    } else if (where["companyName_op"] == "3") {
      //Start with
      company_name_field = ' and ab.company_name LIKE "' + where["companyName"] + '%"';
    } else if (where["companyName_op"] == "4") {
      //it contains
      company_name_field = ' and ab.company_name LIKE "%' + where["companyName"] + '%"';
    } else if (where["companyName_op"] == "5") {
      //it does not contains
      company_name_field = ' and ab.company_name NOT LIKE "%' + where["companyName"] + '%"';
    } else if (where["companyName_op"] == "6") {
      //it end with
      company_name_field = ' and ab.company_name LIKE "%' + where["companyName"] + '"';
    }

    //customer name
    if (where["customerName_op"] == "1") {
      //Equals to
      customer_name_field = ' and ab.customer_name = "' + where["customerName"] + '"';
    } else if (where["customerName_op"] == "2") {
      //Not Equals to
      customer_name_field = ' and ab.customer_name != "' + where["customerName"] + '"';
    } else if (where["customerName_op"] == "3") {
      //Start with
      customer_name_field = ' and ab.customer_name LIKE "' + where["customerName"] + '%"';
    } else if (where["customerName_op"] == "4") {
      //it contains
      customer_name_field = ' and ab.customer_name LIKE "%' + where["customerName"] + '%"';
    } else if (where["customerName_op"] == "5") {
      //it does not contains
      customer_name_field = ' and ab.customer_name NOT LIKE "%' + where["customerName"] + '%"';
    } else if (where["customerName_op"] == "6") {
      //it end with
      customer_name_field = ' and ab.customer_name LIKE "%' + where["customerName"] + '"';
    }

    //Search Leads Field
    if (where["searchLeads_op"] == "11") {
      if(where["searchLeads_category"] == "name"){
        searchLeads_field = ' and ab.customer_name LIKE "%' + where["searchLeads"] + '%" ';
      } else if(where["searchLeads_category"] == "mobile"){
        searchLeads_field = ' and (TRIM(ab.customer_number_primary) LIKE "%' + where["searchLeads"] + '%") ';
      } else if(where["searchLeads_category"] == "email"){
        searchLeads_field = ' and (TRIM(ab.email_id) LIKE "%' + where["searchLeads"] + '%") ';
      } else if(where["searchLeads_category"] == "company"){
        searchLeads_field = ' and ab.company_name LIKE "%' + where["searchLeads"] + '%" ';
      }
    }

    let Query =
      "SELECT ab.id, ab.customer_name, ab.company_name, RIGHT(ab.customer_number_primary , 10) AS customer_number_primary, ab.email_id, ab.address, ab.created_by  FROM address_book ab "+unique_customer_detail_join+" WHERE ab.sme_id = :sme_id AND ab.status = 1  " +
      customer_number_field +
      " " +
      agent_id_field +
      " " +
      company_name_field +
      " " +
      customer_name_field +
      " " +
      searchLeads_field +
      " order by ab.customer_name asc"+
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
      replacements: { 
        sme_id: where["smeId"], 
        customer_number: where["customer_number"] 
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

/** Update customers to address book */
export async function updateAddressBookCustomer(where: any, callback: any) {
  try {
    let id_field = "";
    if (where["id"] && where["id"] != "") {
      id_field = " AND id = " + where["id"];
    }
    let Query =
      "UPDATE address_book set customer_name = :customer_name, company_name = :company_name, email_id = :email_id, address = :address, created_by = :created_by, status = :status, updated_date_time=:insertDateTime  WHERE sme_id = :smeId AND SUBSTRING(customer_number_primary, -10) = SUBSTRING(:customer_number_primary, -10) AND status = 1 ";
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

/** Update longcodes */
export async function setLongcodesData(where: any, callback: any) {
  try {
    let Query = "UPDATE longcodes set status = :status, update_time=:insertDateTime WHERE  id = :longcode";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { status: where["status"], longcode: where["longcode"], insertDateTime: where["insertDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** delete agent longcodes  */
export async function deleteAgentLoncodes(payload: any, callback: any) {
  try {
    let Query = "DELETE from longcodes_agent_mapping  WHERE agent_id = :agentId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: { agentId: payload["agentId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** add agent longcodes */
export async function addAgentlongcodes(where: any, callback: any) {
  try {
    let Query = "INSERT INTO longcodes_agent_mapping (agent_id, longcode_id) values (:agentId, :longcode)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { agentId: where["agentId"], longcode: where["longcode"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** Update longcodes */
export async function updatetAgentPosition(where: any, callback: any) {
  try {
    let Query = "UPDATE agent_details set agent_position = :order WHERE  sme_id = :smeId and agent_id = :agentId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { order: where["order"], smeId: where["smeId"], agentId: where["agentId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function VerifyPassword(where: any, callback: any) {
  try {
    let Query = "SELECT username  FROM users WHERE username=:username and password=:current_password LIMIT 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { username: where["username"], current_password: where["current_password"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/**  find */
export async function AgentReportTotalRecord(where: any, callback: any) {
  try {
    let table_name = "";
    let duration_field = "";
    let agent_number_field = "";
    let customer_number_field = "";
    let agent_name_field = "";
    let call_answer_field = "";
    let answer_status_field = "";
    let remarks_field = "";
    let callId_field = "";
    let productId_field = "";
    let cityId_field = "";
    let insert_date_time_field = "";
    let leadType_field = "";
    let customerName_field = "";
    let g_initialRecord = "";
    let agentId_field = "";
    let LeadStatus_field = "";
    let productPrice_field = "";

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
      customer_number_field = ' and SUBSTRING(TRIM(ucd.customer_ani), -10) "%' + where["customerAni"] + '"';
    }

    let g_mode = "";
    let responseMessage = "";
    let sessionId = "";

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
      responseMessage = 'and TRIM(ucd.session_id) = "' + where["sessionId"] + '"';
    } else if (where["sessionId_op"] == "2") {
      //Not Equals to
      responseMessage = 'and TRIM(ucd.session_id) != "' + where["sessionId"] + '"';
    } else if (where["sessionId_op"] == "3") {
      //Start with
      responseMessage = 'and TRIM(ucd.session_id) LIKE "' + where["sessionId"] + '%"';
    } else if (where["sessionId_op"] == "4") {
      //it contains
      responseMessage = 'and TRIM(ucd.session_id) LIKE "%' + where["sessionId"] + '%"';
    } else if (where["sessionId_op"] == "5") {
      //it does not contains
      responseMessage = 'and TRIM(ucd.session_id) NOT LIKE "%' + where["sessionId"] + '%"';
    } else if (where["sessionId_op"] == "6") {
      //it end with
      responseMessage = 'and TRIM(ucd.session_id) LIKE "%' + where["sessionId"] + '"';
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

    let Query =
      "SELECT count(*) as total_records FROM agent_report_details ucd left join agent_details ad on ucd.agent_id = ad.agent_id  WHERE ucd.sme_id = :sme_id  " +
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
      " order by ucd.insert_date desc ";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], startDate: where["startDate"], endDate: where["endDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getAgentExtensionCount(where: any, callback: any) {
  try {
    let Query = "Select MAX(agent_extention) as agent_extention,  MAX(agent_position) as agent_position FROM agent_details where sme_id = :smeId";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** get total contact numbers*/
export async function totalContactsRecordList(where: any, callback: any) {
  try {
    let customer_number_field = "";
    let agent_id_field = "";
    if (where["customer_number"] != "") {
      customer_number_field = " and SUBSTRING(TRIM(customer_number_primary), -10) = SUBSTRING(" + where["customer_number"] + ", -10)";
    }
    if (where["agent_id"] != "") {
      agent_id_field = " and  created_by = " + where["agent_id"] + "";
    }
    let Query = "select count(*) as total_records  FROM address_book WHERE sme_id = :sme_id AND status = 1 " + customer_number_field + " " + agent_id_field + "";
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

/** find */
export async function FindAgentReportData(where: any, callback: any) {
  try {
    let Query =
      "Select ad.agent_name, ad.agent_mobile, ard.agent_id, COUNT(*) as retry from agent_report_details ard LEFT JOIN agent_details ad ON ad.agent_id = ard.agent_id where ard.sme_id = :smeId AND ard.session_id = :sessionId GROUP BY ard.agent_id";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], sessionId: where["sessionId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** get event agent info*/
export async function GetEventAgentInfo(where: any, callback: any) {
  try {
    let Query =
      "SELECT IFNULL(lc.customer_number,0) customerNumber, IFNULL(ab.customer_name,0) customerName, IFNULL(ad.agent_masking,0) masking FROM live_calls AS lc LEFT JOIN agent_details ad ON SUBSTRING(lc.agent_number, -10) = SUBSTRING(ad.agent_mobile, -10) LEFT JOIN address_book ab ON SUBSTRING(TRIM(ab.customer_number_primary), -10)= SUBSTRING(lc.customer_number, -10) AND ab.`status` != -9 WHERE SUBSTRING(lc.longcode, -10)= SUBSTRING(:callingNumber, -10) AND SUBSTRING(lc.agent_number, -10)= SUBSTRING(:calledNumber, -10) AND ad.status = 2 AND DATE(date_time) = DATE(NOW()) limit 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { callingNumber: where["callingNumber"], calledNumber: where["calledNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** delete agent longcodes  */
export async function deleteIvrFlow(payload: any, callback: any) {
  try {
    let Query = "DELETE from mpbx_category_master  WHERE sme_id = :sme_id AND flow_id = :flowId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: { sme_id: payload["sme_id"], flowId: payload["flowId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function VerifyOTP(where: any, callback: any) {
  try {
    let Query = "SELECT sme_id,insertion_date FROM forget_password WHERE sme_id=:username and otp=:oneTimeCode LIMIT 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { username: where["username"], oneTimeCode: where["oneTimeCode"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function updateForgotPassword(payload: any, callback: any) {
  try {
    let Query = "update users set password = :newPassword where username  = :username LIMIT 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        newPassword: payload["newPassword"],
        username: payload["username"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getLongcodeCount(payload: any, callback: any) {
  try {
    let Query = "SELECT count(lsm.longcode_id) AS count FROM longcodes_sme_mapping lsm LEFT JOIN longcodes l ON l.id = lsm.longcode_id WHERE lsm.sme_id = :smeId AND l.status = 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: payload["smeId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindcallScheduleBase(where: any, callback: any) {
  try {
    let Query =
      "Select base_id, response_msg, DATE_FORMAT(schedule_date_time, '%Y-%m-%d %H:%i:%s') as schedule_date_time, call_type, status, sme_id, agent_id, description, mobile,  DATE_FORMAT(insert_time, '%Y-%m-%d %H:%i:%s') as insert_time from call_scheduler_base where sme_id=:id and SUBSTRING(TRIM(mobile), -10)= SUBSTRING(TRIM(:customerNumber), -10) AND schedule_date_time <= NOW()";
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

export async function FindCustomerAddressbookDetail(where: any, callback: any) {
  try {
    let Query =
      "SELECT ucd.id, ucd.frequency, ab.customer_name, ab.company_name, ab.email_id, DATE_FORMAT(ab.insert_date_time, '%Y-%m-%d %H:%i:%s') AS insert_date_time, ab.address, ab.status, ab.mode, ab.created_by, ab.customer_number_primary, ls.lead_status as lead_status_name, lsr.source as lead_source, cc.city_name FROM unique_customer_detail ucd LEFT JOIN address_book ab ON ab.sme_id = ucd.sme_id AND ab.customer_number_primary = ucd.customer_number LEFT JOIN lead_status ls ON ls.id = ucd.lead_status LEFT JOIN lead_source lsr ON lsr.id = ucd.source_id LEFT JOIN country_cities cc ON cc.id = ucd.city_id WHERE ucd.sme_id = :id AND SUBSTRING(TRIM(ucd.customer_number), -10)= SUBSTRING(TRIM(:customerNumber), -10) LIMIT 1";
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

/**  find remarks*/
export async function FindCustomerRemarks(where: any, callback: any) {
  try {
    var Query =
      "SELECT DATE_FORMAT(cr.start_date_time, '%Y-%m-%d %H:%i:%s') as start_date_time , cr.remarks, sp.name, ad.agent_name FROM customer_remarks cr LEFT JOIN sme_profile sp ON sp.id = cr.created_by LEFT JOIN agent_details ad ON ad.agent_id = cr.created_by WHERE cr.remarks != 'NULL' AND cr.remarks != '' AND SUBSTRING(TRIM(cr.customer_number), -10)= SUBSTRING(:customerNumber, -10)  AND cr.sme_id = :smeId ORDER BY cr.start_date_time DESC LIMIT 0,5";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["id"], customerNumber: where["customerNumber"] },
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
    if ((where["offset"] && where["offset"] != "") && (where["mode"] && where["mode"] == "calls")) {
      offset_field = " offset " + where["offset"];
    }

    if(where["databaseMode"] && where["databaseMode"] == "bigquery"){
      Query = "SELECT call_direction, call_status, agent_mobile as agent_number, concat( DATE(TIMESTAMP(start_date_time)), ' ',TIME(TIMESTAMP(start_date_time)) )  AS start_date_time, remarks as customerRemarks, agent_name, recording_url as merged_file FROM ["+env.BIGQUERY_DATABASE_NAME+".calls_report]  WHERE sme_id = "+where['id']+ " and customer_number like '%"+where['customerNumber']+"%' order by start_date_time desc LIMIT 20 " + offset_field + "";
      
      const options = {
        query: Query,
        //location: 'US',
        useLegacySql: true,
      };
      // Run the query as a job
      const [job] = await bigquery.createQueryJob(options);
      console.log(`Job ${job.id} started.`);

      // Wait for the query to finish
      const [rows] = await job.getQueryResults();
      callback(null, rows);
    } else {
      var Query =
      "SELECT COUNT(*) AS total_calls, cc.id, cc.sme_id, DATE_FORMAT(cc.start_date_time, '%Y-%m-%d %H:%i:%s') AS start_date_time, DATE_FORMAT(cc.end_date_time, '%Y-%m-%d %H:%i:%s') AS end_date_time, DATE_FORMAT(cc.insert_date_time, '%Y-%m-%d %H:%i:%s') AS insert_date_time, cc.duration, cc.longcode, cc.hlr, cc.master_shortcode, cc.sme_identifier, cc.shortcode_mapping, cc.call_direction_status, cc.call_direction, cc.customer_number, cc.agent_number, cc.call_recording_status, cc.call_recorded_file, cc.voicemail_recording_status, cc.voicemail_recording_file, cc.channel_no, cc.server_ip_address, cc.cdr_mode, cc.agent_group, cc.patched_agent_id, cc.session_id, cc.merge_status, cc.answer, cc.call_status, cc.disconnected_by, cc.address_book_id, cc.remarks, cc.connected_duration, cc.ringing_duration, cc.call_type, cc.call_description, cc.ivr_duration, cc.customer_status, cr.remarks AS customerRemarks, mcr.merged_file, ad.agent_name FROM calling_cdr cc LEFT JOIN customer_remarks cr ON cr.sme_id = cc.sme_id AND cr.customer_number = cc.customer_number AND cr.session_id = cc.session_id LEFT JOIN mpbx_call_recording mcr ON mcr.sme_id = cc.sme_id AND cc.call_recorded_file = mcr.call_id AND cc.customer_number = mcr.customer_ani LEFT JOIN agent_details ad ON RIGHT(ad.agent_mobile, 10) = RIGHT(cc.agent_number, 10) AND ad.sme_id = cc.sme_id WHERE cc.sme_id= :id AND SUBSTRING(TRIM(cc.customer_number), -10)= SUBSTRING(TRIM(:customerNumber), -10) GROUP BY cc.id ORDER BY cc.start_date_time DESC LIMIT 20 " + offset_field + "";

      let executeQuery = await sequelize.query<any>(Query, {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: { id: where["id"], customerNumber: where["customerNumber"] },
      });
      callback(null, executeQuery);
    }
    
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/**  find remarks*/
export async function FindProductsActivity(where: any, callback: any) {
  try {
    var Query =
      "SELECT DATE_FORMAT(lh.insert_date_time, '%Y-%m-%d %H:%i:%s') AS insert_date_time, lh.message, sp.name, ad.agent_name FROM log_history lh LEFT JOIN sme_profile sp ON sp.id = lh.sme_id LEFT JOIN agent_details ad ON ad.agent_id = lh.agent_id WHERE SUBSTRING(TRIM(lh.customer_number), -10)= SUBSTRING(:customerNumber, -10) AND lh.sme_id = :id AND lh.module_name = 'product' ORDER BY lh.insert_date_time DESC LIMIT 0,5";

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

/**  Get agent insights daywise*/
export async function getAgentsInsightDayWiseData(where: any, callback: any) {
  try {
    var agent_id_field = "";
    if (where["agentId"] && where["agentId"] != "") {
      agent_id_field = " and agent_id = " + where["agentId"];
    }

    var Query =
      "SELECT sum(in_failed_calls) as in_failed_calls, sum(in_success_calls) as in_success_calls, sum(total_in_calls) as total_in_calls, sum(out_failed_calls) as out_failed_calls, sum(out_success_calls) as out_success_calls, sum(total_out_calls) as total_out_calls, sum(total_calls) as total_calls, sum(avg_call_duration) as avg_call_duration, sum(total_call_duration) as total_call_duration, sum(office_hours) as office_hours, sum(lunch_hours) as lunch_hours, sum(no_answer) as no_answer, insert_date, DATE_FORMAT(insert_date, '%Y-%m-%d') as insert_date_format, sum(connected_duration) as connected_duration, sum(ringing_duration) as ringing_duration FROM agent_calling_details WHERE sme_id = :id AND insert_date BETWEEN :startDate AND :endDate " +
      agent_id_field +
      " GROUP BY DATE_FORMAT(insert_date, '%Y-%m-%d') order by insert_date asc";

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
export async function getCallsPerformanceData(where: any, callback: any) {
  try {
    let agentQuery = "";
    if (where["agentId"] > 0) {
      agentQuery = "And patched_agent_id =" + where["agentId"];
    }

    let Query =
      "SELECT COUNT(*) AS TotalCalls,( SELECT COUNT(*) FROM calling_cdr cc2 left join agent_report_details ard ON ard.session_id = cc2.session_id AND ard.sme_id = cc2.sme_id AND DATE(ard.insert_date) = DATE(:currentdateTime) WHERE ard.ringing_duration < 15 AND cc2.call_status=0 AND cc2.sme_id =:id " +
      agentQuery +
      " AND DATE(cc2.insert_date_time)= DATE(:currentdateTime) AND ard.`status`= 0) AS LessThenFifteenSeconds, ( SELECT COUNT(*) FROM calling_cdr cc3 left join agent_report_details ard ON ard.session_id = cc3.session_id AND ard.sme_id = cc3.sme_id AND DATE(ard.insert_date) = DATE(:currentdateTime) WHERE ard.connected_duration > 60 AND cc3.call_status=0 AND cc3.sme_id =:id " +
      agentQuery +
      " AND DATE(cc3.insert_date_time)= DATE(:currentdateTime) AND ard.`status`= 0) AS GreaterThenOneMinute FROM calling_cdr cc1 LEFT JOIN agent_report_details ard ON ard.session_id = cc1.session_id AND ard.sme_id = cc1.sme_id AND DATE(ard.insert_date) = DATE(:currentdateTime) WHERE cc1.call_status=0 AND cc1.sme_id =:id " +
      agentQuery +
      " AND DATE(cc1.insert_date_time)= DATE(:currentdateTime) AND ard.`status`= 0";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"], currentdateTime: where["currentdateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindSmsHeader(where: any, callback: any) {
  try {
    let Query = "Select id,sme_id,header_name,user, type,principle_id, status, insert_date_time from sms_header where sme_id=:id and status !=-9";
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

export async function addSmsHeader(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO sms_header (sme_id, type, status, header_name, insert_date_time, principle_id) values (:smeId, :type, :status,:headerName, :insertDateTime,:principalId )";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        type: payload["type"],
        status: payload["status"],
        headerName: payload["headerName"],
        insertDateTime: payload["insertDateTime"],
        principalId: payload["principalId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateHeaderSms(payload: any, callback: any) {
  try {
    let Query = "Update sms_header set header_name=:header_name, principle_id=:principalId, type=:type where sme_id =:smeId and id=:headerId";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { smeId: payload["smeId"], header_name: payload["header_name"], principalId: payload["principalId"], type: payload["type"], headerId: payload["headerId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateSmsTemplate(payload: any, callback: any) {
  try {
    let Query = "Update comm_sme_sms_template set dlt_content_id=:template_id, message=:message_text,dlt_principal_id=:principle_id, template_name=:template_name,unicode=:unicode,v_from=:v_from  where id=:templateId and sme_id =:smeId";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        smeId: payload["smeId"],
        templateId: payload["templateId"],
        template_id: payload["template_id"],
        principle_id: payload["principle_id"],
        message_text: payload["message_text"],
        template_name: payload["template_name"],
        unicode: payload["unicode"],
        v_from: payload["v_from"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function deleteSmsTemplate(payload: any, callback: any) {
  try {
    let Query = "update comm_sme_sms_template set status =-9 WHERE id = :templateId and sme_id=:id";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { templateId: payload["templateId"], id: payload["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function deleteCampaign(payload: any, callback: any) {
  try {
    let Query = "update sms_campaign set status =-9 WHERE id = :campaignId and sme_id=:id";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { campaignId: payload["campaignId"], id: payload["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function deleteSmsHeader(payload: any, callback: any) {
  try {
    let Query = "update sms_header set status =-9 WHERE id = :headerId and sme_id=:id";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { headerId: payload["headerId"], id: payload["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function findHeader(where: any, callback: any) {
  try {
    let Query = "Select id,sme_id,header_name,user, type,principle_id, status, insert_date_time from sms_header where sme_id=:id and type=:type and status !=-9";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"], type: where["type"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function findTemplate(where: any, callback: any) {
  try {
    let Query = "Select id, status, principle_id, message_text,message_type,sme_id,template_name, create_date_time from sms_template where sme_id=:id  and message_type=:type and status !=-9";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"], type: where["type"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function uploadCampaignData(payload: any, callback: any) {
  try {
    let Query =
      "Update sms_campaign set base_file=:base_file, base_count=:base_count,fail_count=:fail_count, invalid_count=:invalid_count , failed_file=:failed_file, duplicate_file=:duplicate_file,invalid_file=:invalid_file, filtered_count=:filtered_count, filtered_file=:filtered_file, duplicate_count=:duplicate_count, upload_type=:campaignSelect where id=:LastInsertedId";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        base_file: payload["base_file"],
        base_count: payload["base_count"],
        fail_count: payload["fail_count"],
        invalid_count: payload["invalid_count"],
        failed_file: payload["failed_file"],
        duplicate_file: payload["duplicate_file"],
        invalid_file: payload["invalid_file"],
        filtered_count: payload["filtered_count"],
        filtered_file: payload["filtered_file"],
        duplicate_count: payload["duplicate_count"],
        LastInsertedId: payload["LastInsertedId"],
        campaignSelect: payload["campaignSelect"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindLatInsertCampaign(where: any, callback: any) {
  try {
    let Query =
      "Select id,template_id,base_file,cli,base_count,insert_date,start_time,end_time,status,sucess_count, fail_count, invalid_count, sme_id,campaign_name,filtered_file,failed_file,success_file, duplicate_file,invalid_file,duplicate_count,filtered_count,principal_id,campaign_type,header_id from sms_campaign where id =:LastInsertedId and status !=-9";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { LastInsertedId: where["LastInsertedId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function UpdateSmsCampaignData(payload: any, callback: any) {
  try {
    var Query = "";
    if (payload["fomrStep"] == "step3") {
      Query = "Update sms_campaign set status=1 where id=:lastInsertedId";
    } else {
      Query =
        "Update sms_campaign set template_id=:template_id, header_id=:header_id,principal_id=:principal_id, campaign_name=:campaign_name , campaign_type=:campaign_type, campaign_message=:campaign_message where id=:lastInsertedId";
    }

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        template_id: payload["template_id"],
        header_id: payload["header_id"],
        principal_id: payload["principal_id"],
        campaign_name: payload["campaign_name"],
        campaign_type: payload["campaign_type"],
        campaign_message: payload["campaign_message"],
        lastInsertedId: payload["lastInsertedId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find ivr by unique flow id*/
export async function getIvrByUniqueFlowIdData(where: getivrflowRequestValidate, callback: any) {
  try {
    let Query = "SELECT flow_id AS flowId, flow_name AS flowName from mpbx_category_master where sme_id = :id group by flow_id ORDER BY id";
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

/** find ivr flow count*/
export async function getIvrFlowCountData(where: getivrflowRequestValidate, callback: any) {
  try {
    let Query = "SELECT flow_id, sme_id FROM mpbx_category_master where sme_id = :id GROUP BY flow_id, sme_id";
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

/** update sme longcodes mapping ivr flow id */
export async function updateSmeLongcodeMapping(where: any, callback: any) {
  try {
    let Query = "UPDATE longcodes_sme_mapping set call_flow_id = :flowId WHERE sme_id = :smeId AND longcode_id = :longcode ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { flowId: where["flowId"], smeId: where["smeId"], longcode: where["longcode"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** get longcode of ivr flow */
export async function getIvrFlowlongcodeIdData(where: any, callback: any) {
  try {
    let Query = "SELECT lsm.longcode_id as longcodeId , l.longcode FROM longcodes_sme_mapping lsm LEFT JOIN longcodes l ON l.id = lsm.longcode_id WHERE lsm.sme_id = :sme_id AND lsm.call_flow_id = :flowId ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], flowId: where["flowId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** get campaign media file data */
export async function getCampaignMediaFileData(where: any, callback: any) {
  try {
    let Query = "SELECT template_name, original_file_path, DATE_FORMAT(date_time, '%Y-%m-%d %H:%i:%s') AS date_time from campaign_media_details where sme_id = :sme_id ";
    let executeQuery = await sequelize.query(Query, {
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

/** set campaign media file data */
export async function setCampaignMediaFileData(payload: any, callback: any) {
  try {
    let Query =
      "INSERT INTO campaign_media_details (template_name, sme_id, original_file_path, final_file_path, status, date_time) values (:smeId, :type, :status,:headerName, :insertDateTime,:principalId )";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        type: payload["type"],
        status: payload["status"],
        headerName: payload["headerName"],
        insertDateTime: payload["insertDateTime"],
        principalId: payload["principalId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** check agent exist in users */
export async function checkAgentEmailExistInUser(where: any, callback: any) {
  try {
    let Query = "SELECT username from users where username = :agentEmail ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agentEmail: where["agentEmail"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function uploadScheduleCampaignData(payload: any, callback: any) {
  try {
    let Query =
      "Update sms_campaign set base_file=:base_file, base_count=:base_count,fail_count=:fail_count, invalid_count=:invalid_count , failed_file=:failed_file, duplicate_file=:duplicate_file,invalid_file=:invalid_file, filtered_count=:filtered_count, filtered_file=:filtered_file, duplicate_count=:duplicate_count where id=:LastInsertedId";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        base_file: payload["base_file"],
        base_count: payload["base_count"],
        fail_count: payload["fail_count"],
        invalid_count: payload["invalid_count"],
        failed_file: payload["failed_file"],
        duplicate_file: payload["duplicate_file"],
        invalid_file: payload["invalid_file"],
        filtered_count: payload["filtered_count"],
        filtered_file: payload["filtered_file"],
        duplicate_count: payload["duplicate_count"],
        LastInsertedId: payload["LastInsertedId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** add campaign */
export async function addCampaignData(payload: any, callback: any) {
  try {
    let Query =
      "INSERT INTO outgoing_campaign (sme_id, campaign_name, campaign_description, campaign_type, status, date_time) values (:smeId, :campaignName, :campaignDescription, :campaignType, :status, :insertDateTime)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        campaignName: payload["campaignName"],
        campaignDescription: payload["campaignDescription"],
        campaignType: payload["campaignType"],
        status: payload["status"],
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

/** get outgoing campaign data */
export async function getOutgoingCampaignData(where: any, callback: any) {
  try {
    let campaign_name_field = "";
    let campaign_description_field = "";
    let campaign_type_field = "";
    let limit_field = "";
    let g_initialRecord = 0;
    let campaign_id_field = "";

    if (where["isDownload"] == "1") {
      limit_field = "";
    } else {
      g_initialRecord = where["initialRecord"] - 1;
      limit_field = "limit " + g_initialRecord + "," + where["batchSize"] + "";
    }

    //Campaign Name check
    if (where["campaignName_op"] == "1") {
      //Equals to
      campaign_name_field = ' and TRIM(oc.campaign_name) = "' + where["campaignName"] + '"';
    } else if (where["campaignName_op"] == "2") {
      //Not Equals to
      campaign_name_field = ' and TRIM(oc.campaign_name) != "' + where["campaignName"] + '"';
    } else if (where["campaignName_op"] == "3") {
      //Start with
      campaign_name_field = ' and TRIM(oc.campaign_name) LIKE "' + where["campaignName"] + '%"';
    } else if (where["campaignName_op"] == "4") {
      //it contains
      campaign_name_field = ' and TRIM(oc.campaign_name) LIKE "%' + where["campaignName"] + '%"';
    } else if (where["campaignName_op"] == "5") {
      //it does not contains
      campaign_name_field = ' and TRIM(oc.campaign_name) NOT LIKE "%' + where["campaignName"] + '%"';
    } else if (where["campaignName_op"] == "6") {
      //it end with
      campaign_name_field = ' and TRIM(oc.campaign_name) LIKE "%' + where["campaignName"] + '"';
    }

    //Campaign Description check
    if (where["campaignDescription_op"] == "1") {
      //Equals to
      campaign_description_field = ' and TRIM(oc.campaign_description) = "' + where["campaignDescription"] + '"';
    } else if (where["campaignDescription_op"] == "2") {
      //Not Equals to
      campaign_description_field = ' and TRIM(oc.campaign_description) != "' + where["campaignDescription"] + '"';
    } else if (where["campaignDescription_op"] == "3") {
      //Start with
      campaign_description_field = ' and TRIM(oc.campaign_description) LIKE "' + where["campaignDescription"] + '%"';
    } else if (where["campaignDescription_op"] == "4") {
      //it contains
      campaign_description_field = ' and TRIM(oc.campaign_description) LIKE "%' + where["campaignDescription"] + '%"';
    } else if (where["campaignDescription_op"] == "5") {
      //it does not contains
      campaign_description_field = ' and TRIM(oc.campaign_description) NOT LIKE "%' + where["campaignDescription"] + '%"';
    } else if (where["campaignDescription_op"] == "6") {
      //it end with
      campaign_description_field = ' and TRIM(oc.campaign_description) LIKE "%' + where["campaignDescription"] + '"';
    }

    //Campaign Type check
    if (where["campaignType_op"] == "1") {
      //Equals to
      campaign_type_field = ' and TRIM(oc.campaign_type) = "' + where["campaignType"] + '"';
    } else if (where["campaignType_op"] == "2") {
      //Not Equals to
      campaign_type_field = ' and TRIM(oc.campaign_type) != "' + where["campaignType"] + '"';
    } else if (where["campaignType_op"] == "3") {
      //Start with
      campaign_type_field = ' and TRIM(oc.campaign_type) LIKE "' + where["campaignType"] + '%"';
    } else if (where["campaignType_op"] == "4") {
      //it contains
      campaign_type_field = ' and TRIM(oc.campaign_type) LIKE "%' + where["campaignType"] + '%"';
    } else if (where["campaignType_op"] == "5") {
      //it does not contains
      campaign_type_field = ' and TRIM(oc.campaign_type) NOT LIKE "%' + where["campaignType"] + '%"';
    } else if (where["campaignType_op"] == "6") {
      //it end with
      campaign_type_field = ' and TRIM(oc.campaign_type) LIKE "%' + where["campaignType"] + '"';
    }

    //Campaign Id check
    if (where["campaignId"] && where["campaignId"] > 0) {
      //Equals to
      campaign_id_field = ' and oc.id = "' + where["campaignId"] + '"';

    }

    let Query = 'SELECT oc.id, oc.campaign_name, oc.is_report_generated, oc.campaign_description, oc.campaign_type, oc.status,  DATE_FORMAT(oc.date_time, "%Y-%m-%d %H:%i:%s") AS date_time, DATE_FORMAT(oc.start_date_time, "%Y-%m-%d %H:%i:%s") AS start_date_time, DATE_FORMAT(oc.end_date_time, "%Y-%m-%d %H:%i:%s") AS end_date_time, oc.base_count, oc.invalid_count, oc.filtered_count, oc.duplicate_count, oc.already_assigned, oc.agent_wise_report_path, oc.answered_report_path, oc.failed_report_path, oc.pending_report_path, oc.campaign_report_path, oc.start_stop_status, oc.failed_count, oc.success_count, oc.pending_count, oc.assigned_agents, (oc.failed_count+oc.success_count) AS executed FROM outgoing_campaign oc WHERE oc.sme_id = :smeId and oc.status != -9 AND oc.campaign_type != "Autodialer New"' +
    campaign_name_field +
    ''+
    campaign_description_field +
    ''+
    campaign_type_field +
    '' +
    campaign_id_field +
    ''+
    ' order BY date_time DESC ' +
    limit_field +
    '';
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

export async function updateCampaignData(payload: any, callback: any) {
  try {
    let Query =
      "Update outgoing_campaign set base_file=:base_file, base_count=:base_count,failed_count=:failed_count, invalid_count=:invalid_count , failed_file=:failed_file, duplicate_file=:duplicate_file,invalid_file=:invalid_file, filtered_count=:filtered_count, filtered_file=:filtered_file, duplicate_count=:duplicate_count, success_file=:success_file, success_count=:success_count, error_count=:error_count where id=:campaign_id";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        base_file: payload["base_file"],
        base_count: payload["base_count"],
        failed_count: payload["failed_count"],
        invalid_count: payload["invalid_count"],
        failed_file: payload["failed_file"],
        duplicate_file: payload["duplicate_file"],
        invalid_file: payload["invalid_file"],
        filtered_count: payload["filtered_count"],
        filtered_file: payload["filtered_file"],
        duplicate_count: payload["duplicate_count"],
        success_file: payload["success_file"],
        success_count: payload["success_count"],
        campaign_id: payload["campaign_id"],
        error_count: payload["error_count"],
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
      "SELECT ab.customer_name, ab.company_name, ad.agent_name, cf.id, cf.customer_number, cf.customer_number as customerNumber, DATE_FORMAT(cf.reminder_date_time, '%Y-%m-%d %H:%i:%s') as scheduleDateTime, cf.sme_id, cf.created_by, cf.message, cf.status, ucd.recent_duration, ucd.recent_via_longcode, ucd.server_ip_address, ucd.recent_patched_agent_id, ucd.total_incoming_calls, ucd.total_outgoing_calls, ucd.lead_type, ucd.lead_status, ucd.city_id, ucd.product_id, ucd.product_price, ucd.assigned_agent_id, ucd.connected_call_duration, ucd.sticky_type, ucd.insert_date_time, ucd.update_date_time, ucd.call_type,ucd.answer   from customer_followup as cf LEFT JOIN unique_customer_detail AS ucd ON ucd.sme_id = cf.sme_id AND SUBSTRING(TRIM(ucd.customer_number), -10) = SUBSTRING(cf.customer_number, -10) AND ucd.customer_followup_id = cf.id and (ucd.answer != 3 OR ucd.frequency != 0) LEFT JOIN address_book ab on SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(cf.customer_number, -10) AND ab.`status` != -9 AND ab.sme_id= cf.sme_id LEFT JOIN agent_details ad ON ad.sme_id = cf.sme_id AND ad.agent_id = cf.created_by where cf.sme_id= :smeId " + agentId_field + " " + customer_number_field + " AND cf.reminder_date_time BETWEEN DATE(:insertDateTime) - INTERVAL 5 DAY AND DATE(:insertDateTime) GROUP BY cf.id order by cf.reminder_date_time desc " + limit_field +
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

/** get total past scheduled call data */
export async function totalgetScheduledCallsPastData(where: any, callback: any) {
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
      "SELECT count(*) as total_records from customer_followup as cf left join unique_customer_detail as ucd on cf.id =ucd.customer_followup_id LEFT   JOIN address_book ab on SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(cf.customer_number, -10) AND ab.`status` != -9 AND ab.sme_id= cf.sme_id where cf.sme_id= :smeId " + agentId_field + " " + customer_number_field + " AND DATE(cf.reminder_date_time) < DATE(:insertDateTime)";
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

/** add campaign base data*/
export async function addCampaignBaseData(payload: any, where: any, callback: any) {
  try {
    let Query =
      "INSERT INTO outgoing_campaign_base (sme_id, agent_id, customer_number, campaign_id, status, insert_time, schedule_date_time) values (:smeId, :agentId, :customerNumber, :campaignId, :status, :insertDateTime, :startDateTime)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        agentId: where["agentId"],
        customerNumber: where["customerNumber"],
        campaignId: payload["campaignId"],
        status: payload["status"],
        insertDateTime: payload["startDateTime"],
        startDateTime: payload["startDateTime"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function updateCampaignDataSchedule(alreadyExistCount: any, payload: any, callback: any) {
  try {
    let Query = "Update outgoing_campaign set start_date_time = :startDateTime, end_date_time = :endDateTime, status = 'Pending', assigned_agents = :allAgents, already_assigned = :alreadyExistCount, next_call_try = :nextCallTry, time_difference = :timeDifference, call_priority = :callPriority where id = :campaignId";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { startDateTime: payload["startDateTime"], endDateTime: payload["endDateTime"], allAgents: payload["allAgents"], alreadyExistCount: alreadyExistCount, campaignId: payload["campaignId"], nextCallTry: payload["nextCallTry"], timeDifference: payload["timeDifference"], callPriority: payload["callPriority"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function findNewFirebaseNotification(where: any, callback: any) {
  try {
    let Query = "SELECT u.notification_token, ntf.id, ntf.event, ntf.insert_date_time, ntf.schedule_date_time, ntf.agent_id, ntf.session_id, ntf.agent_email, ntf.title, ntf.is_read, ntf.mode, ntf.username, ntf.message, ntf.customer_number, ntf.call_direction FROM users u INNER JOIN sme_notification ntf ON ntf.username = u.username where ntf.is_sent=0 and ntf.mode='WEB'  and u.notification_token !=''";
    let executeQuery = await sequelize.query(Query, {
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

export async function updateNotificationStatus(where: any, callback: any) {
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

/*Update agent status*/

export async function updateAgentStatusData(where: any, callback: any) {
  try {
    let Query = "Update agent_details set status = :status where agent_id= :agentId and sme_id = :id";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { status: where["status"], agentId: where["agentId"], id: where["id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** insert agent inactive in time  */
export async function agentActInactTimeDataIn(where: any, callback: any) {
  try {
    const sql = `
    INSERT INTO agent_status_change (sme_id, agent_id, insert_date, in_time)
    VALUES (:id, :agent_id, :insert_date, :in_time);
  `
    let executeQuery = sequelize.query(sql, {
      type: QueryTypes.INSERT,
      replacements: { id: where["id"], agent_id: where["agent_id"], insert_date: where["insert_date"], in_time: where["in_time"] },
    })

    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** insert agent inactive out time  */
export async function getAgentActInactTimeData(where: any, callback: any) {
  try {
    let Query = "SELECT id, agent_id, insert_date, out_time  from agent_status_change where agent_id = :agent_id ORDER BY id desc limit 1 ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agent_id: where["agent_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** insert agent inactive in time  */
export async function agentActInactTimeDataOut(where: any, payload: any, callback: any) {
  try {

    var Query = "UPDATE agent_status_change set out_time =  :out_time where id = :id LIMIT 1";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { id: where["id"], out_time: payload["in_time"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/**  find */
export async function FetchOutCallsReport(where: any, callback: any) {
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
    let g_initialRecord = "";
    let orderBy_field = "";

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
      customer_number_field = ' and SUBSTRING(TRIM(ucd.customer_ani), -10) "%' + where["customerAni"] + '"';
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

    let Query =
      'SELECT ucd.id, ucd.sme_id, DATE_FORMAT(ucd.insert_date, "%Y-%m-%d %H:%i:%s") AS insert_date, ucd.status, ucd.response_message, DATE_FORMAT(ucd.start_date, "%Y-%m-%d %H:%i:%s") AS start_date, DATE_FORMAT(ucd.end_date, "%Y-%m-%d %H:%i:%s") AS end_date, ucd.response_code, ucd.connected_duration, ucd.ringing_duration, ucd.customer_number as called_number, ucd.session_id, ucd.call_mode, ucd.call_info, ucd.call_route_reason, ucd.total_duration FROM customer_report_details ucd WHERE ucd.sme_id =:sme_id   ' +
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
      " order by ucd.start_date" +
      orderBy_field;

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], startDate: where["startDate"], endDate: where["endDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** Check if number exist in unique customer details  */
export async function numberExistInUniqueDetails(where: any, payload: any, callback: any) {
  try {
    let Query = "SELECT ucd.id, ucd.customer_number, oc.id AS campaign_id, oc.campaign_name, oc.status, DATE_FORMAT(oc.end_date_time, '%Y-%m-%d %H:%i:%s') AS end_date_time, ucd.assigned_to FROM unique_customer_detail ucd LEFT JOIN outgoing_campaign oc ON oc.id = ucd.campaign_id WHERE ucd.sme_id = :smeId AND SUBSTRING(TRIM(ucd.customer_number), -10)= SUBSTRING(:customerNumber, -10) LIMIT 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        smeId: where["smeId"],
        customerNumber: payload["customerNumber"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** update unique customer campaign*/
export async function updateUniqueCustomerCampaign(where: any, payload: any, reqData: any, callback: any) {
  try {
    let Query = "update unique_customer_detail set answer = 3, assigned_to = :agentId, campaign_id = :campaignId, source_id = :sourceId, is_auto_dialed = :isAutoDialer, other = :other, uploaded_date_time = :insertDateTime where right(customer_number, 10)  = right(:customerNumber, 10) and sme_id = :smeId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        agentId: payload["agentId"],
        campaignId: reqData["campaignId"],
        sourceId: payload["sourceId"],
        isAutoDialer: reqData["isAutoDialer"],
        leadStatus: payload["leadStatus"],
        cityId: payload["cityId"],
        productId: payload["productId"],
        productPrice: payload["productId"],
        other: payload["other"],
        uniqueId: where["uniqueId"],
        insertDateTime: reqData["insertDateTime"],
        customerNumber: where["customerNumber"],
        smeId: reqData["smeId"],
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
export async function insertUniqueCustomerCampaign(payload: any, reqData: any, callback: any) {
  try {
    let Query =
      "INSERT INTO unique_customer_detail (sme_id, customer_number, recent_duration, recent_via_longcode, server_ip_address, recent_patched_agent_id, total_incoming_calls, total_outgoing_calls, lead_type, lead_status, city_id, product_id, product_price, assigned_agent_id, connected_call_duration, sticky_type, insert_date_time, update_date_time, call_type, assigned_to, answer, campaign_id, source_id, other) values (:smeId, :customerNumber, :recentDuration, :recentViaLongcode, :serverIpAddress, :recentPatchedAgentId, :totalIncomingCalls, :totalOutgoingCalls, :leadType, :leadStatus, :cityId, :productId, :productPrice, :assignedAgentId, :connectedCallDuration, :stickyType, :insertDateTime, :updateDateTime, :callType, :agentId, 3, :campaignId, :sourceId, :other)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        customerNumber: payload["customerNumber"],
        recentDuration: payload["recentDuration"],
        recentViaLongcode: payload["recentViaLongcode"],
        serverIpAddress: payload["serverIpAddress"],
        recentPatchedAgentId: payload["recentPatchedAgentId"],
        totalIncomingCalls: payload["totalIncomingCalls"],
        totalOutgoingCalls: payload["totalOutgoingCalls"],
        leadType: payload["leadType"],
        leadStatus: payload["leadStatus"],
        cityId: payload["cityId"],
        productId: payload["productId"],
        productPrice: payload["productPrice"],
        assignedAgentId: payload["assignedAgentId"],
        connectedCallDuration: payload["connectedCallDuration"],
        stickyType: payload["stickyType"],
        insertDateTime: payload["insertDateTime"],
        updateDateTime: payload["updateDateTime"],
        callType: payload["callType"],
        agentId: payload["agentId"],
        campaignId: reqData["campaignId"],
        sourceId: payload["sourceId"],
        other: payload["other"],
      },
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


/** add sme lead source longcodes */
export async function addLeadSourceData(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO lead_source (source, description, created_by, status, insert_date_time,update_date_time) values (:leadSource, :description, :smeId, :status, :insertDateTime, :insertDateTime)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { leadSource: payload["leadSource"], description: payload["description"], smeId: payload["smeId"], status: payload["status"], insertDateTime: payload["insertDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** delete lead source*/
export async function deleteLeadSourceData(where: any, callback: any) {
  try {
    let Query = "update lead_source set status = :status, update_date_time = :updateDateTime where id = :sourceId AND created_by = :smeId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        status: where["status"],
        sourceId: where["sourceId"],
        smeId: where["smeId"],
        updateDateTime: where["updateDateTime"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** update lead source*/
export async function editLeadSourceData(where: any, callback: any) {
  try {
    let Query = "update lead_source set source = :source, description = :description, update_date_time = :updateDateTime where id = :sourceId AND created_by = :smeId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        source: where["source"],
        description: where["description"],
        updateDateTime: where["updateDateTime"],
        sourceId: where["sourceId"],
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

/** Delete lead*/
export async function deleteUniqueDetailData(where: any, callback: any) {
  try {
    let Query = "DELETE from unique_customer_detail where id = :leadId AND sme_id = :smeId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: {
        status: where["status"],
        leadId: where["leadId"],
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

/** Update outgoing campaign*/
export async function updateOutgoingCampaignData(where: any, callback: any) {
  try {
    let Query = "update outgoing_campaign set campaign_name = :campaignName, campaign_type = :campaignType, campaign_description = :campaignDescription, status = :status, start_stop_status = :startStopStatus where id = :campaignId AND sme_id = :smeId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        campaignName: where["campaignName"],
        campaignType: where["campaignType"],
        campaignDescription: where["campaignDescription"],
        status: where["status"],
        campaignId: where["campaignId"],
        smeId: where["smeId"],
        startStopStatus: where["startStopStatus"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** Delete campaign from unique*/
export async function deleteCampaignBaseData(where: any, callback: any) {
  try {
    let Query = "update unique_customer_detail set campaign_id = 0 where campaign_id = :campaignId AND sme_id = :smeId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        campaignId: where["campaignId"],
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

/** get campaign from unique*/
export async function getOutgoingCampaigAgentWiseData(where: any, callback: any) {
  try {
    let Query = "SELECT ucd.customer_number, ucd.answer, ucd.campaign_id, ad.agent_id, ad.agent_name, oc.campaign_name, oc.campaign_type, oc.filtered_count, ucd.is_auto_dialed FROM unique_customer_detail ucd LEFT JOIN agent_details ad ON ad.agent_id = ucd.assigned_to OR ad.agent_id = ucd.recent_patched_agent_id LEFT JOIN outgoing_campaign oc ON oc.id = ucd.campaign_id WHERE ucd.sme_id = :smeId AND ucd.campaign_id = :campaignId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        campaignId: where["campaignId"],
        smeId: where["smeId"],
        startDate: where["startDate"],
        endDate: where["endDate"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function FindAllAgentsData(where: any, callback: any) {
  try {
    let Query =
      "SELECT agent_id, sme_id, agent_mobile, agent_name, agent_extention FROM agent_details WHERE (STATUS = '1' OR STATUS = '2') and sme_id =:id ";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"], },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function getFailedCallCount(where: any, callback: any) {
  try {
    let Query =
      "SELECT COUNT(*) as failedCount FROM agent_report_details WHERE sme_id = :sme_id AND agent_id = :agent_id and status = '1' AND DATE(start_date) > DATE(NOW() - INTERVAL 30 DAY) GROUP BY STATUS;";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        sme_id: where["sme_id"],
        agent_id: where["agent_id"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** find */
export async function getSuccessCallCount(where: any, callback: any) {
  try {
    let Query =
      "SELECT COUNT(*) as successCount FROM agent_report_details WHERE sme_id = :sme_id AND agent_id = :agent_id and status = '0' AND DATE(start_date) > DATE(NOW() - INTERVAL 30 DAY) GROUP BY STATUS";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        sme_id: where["sme_id"],
        agent_id: where["agent_id"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function updateSuccessCallCount(where: any, payload: any, callback: any) {
  try {
    var Query = 'UPDATE agent_details SET agent_score = :callscore WHERE agent_id = :agent_id and sme_id = :sme_id limit 1';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { sme_id: where["sme_id"], agent_id: where["agent_id"], callscore: payload["callscore"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function toBreakTime(where: any, callback: any) {
  try {
    let Query =
      "SELECT SUM(TIME_TO_SEC(TIMEDIFF(out_time, in_time))) as break_time FROM agent_lunch_details WHERE agent_id=:agent_id AND sme_id= :sme_id AND DATE(insert_date) = DATE(NOW())";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], agent_id: where["agent_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function toActiveTime(where: any, callback: any) {
  try {
    let Query =
      "SELECT TIME_TO_SEC(TIMEDIFF(out_time, in_time)) as active_time FROM agent_details_timing WHERE agent_id=:agent_id AND sme_id= :sme_id AND days_week = UPPER(DATE_FORMAT(NOW(),'%a'))";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], agent_id: where["agent_id"] },
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
    var Query = 'UPDATE agent_calling_details SET  lunch_hours = :TotalBreakTime, office_hours = :TotalActiveTime WHERE agent_id = :agent_id and sme_id = :sme_id and date(insert_date) = date(now()) limit 1';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { sme_id: where["sme_id"], agent_id: where["agent_id"], TotalBreakTime: payload["TotalBreakTime"], TotalActiveTime: payload["TotalActiveTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** find */
export async function avgSuccessCallCount(where: any, payload: any, callback: any) {
  try {
    let Query =
      "SELECT COUNT(*) as count, SUM(connected_duration) as connected_duration FROM agent_report_details WHERE sme_id =:sme_id AND agent_id = :agent_id and status = '0' AND DATE(start_date) = :currentDateWithoutTime";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], agent_id: where["agent_id"], currentDateWithoutTime: payload["currentDateWithoutTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function avgTotalDuration(where: any, payload: any, callback: any) {
  try {
    let Query =
      "SELECT COUNT(*) as count, SUM(duration) as duration FROM agent_report_details WHERE sme_id =:sme_id AND agent_id = :agent_id AND DATE(start_date) = :currentDateWithoutTime";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], agent_id: where["agent_id"], currentDateWithoutTime: payload["currentDateWithoutTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}



/** find */
export async function avgRingingCallCount(where: any, payload: any, callback: any) {
  try {
    let Query =
      "SELECT COUNT(*) as total, SUM(ringing_duration) as ringing_duration FROM agent_report_details WHERE sme_id = :sme_id AND agent_id = :agent_id AND DATE(start_date) = :currentDateWithoutTime";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], agent_id: where["agent_id"], currentDateWithoutTime: payload["currentDateWithoutTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function updateAvgCallCountSummary(where: any, payload: any, date: any, callback: any) {
  try {
    var Query = 'UPDATE agent_calling_details SET total_call_duration = :gDuration, avg_call_duration = :gAvgDuration, avg_connected_duration = :gAvgConnectedDuration, connected_duration = :gConnectedDuration, ringing_duration = :gRingingDuration, avg_ringing_duration = :gAvgRingingDuration, total_ringing_duration =:TotalRingingCallDuration , total_connected_duration =:TotalConnectedCallDuration   WHERE agent_id = :agent_id and sme_id = :sme_id and date(insert_date) = :currentDateWithoutTime limit 1';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { sme_id: where["sme_id"], agent_id: where["agent_id"], gDuration: payload["gDuration"], gAvgDuration: payload["gAvgDuration"], gConnectedDuration: payload["gConnectedDuration"], gAvgConnectedDuration: payload["gAvgConnectedDuration"], gRingingDuration: payload["gRingingDuration"], gAvgRingingDuration: payload["gAvgRingingDuration"], TotalRingingCallDuration: payload["TotalRingingCallDuration"], TotalConnectedCallDuration: payload["TotalConnectedCallDuration"], currentDateWithoutTime: date["currentDateWithoutTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindSmeData(where: fetchRequest, callback: any) {
  try {
    let Query = "select id, agent_break_notifcation, agent_break_notification_time, agent_break_notification_email, email_id from sme_profile where  status = 1";
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
export async function FindAgentBreakTime(where: any, callback: any) {
  try {
    let Query =
      "SELECT TIME_TO_SEC(TIMEDIFF(:getCurrentDate, in_time)) as break_time from agent_lunch_details where agent_id = :agent_id AND DATE(insert_date)= DATE(:getCurrentDate) AND out_time IS NULL ORDER BY id desc";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { sme_id: where["sme_id"], agent_id: where["agent_id"], getCurrentDate: where["getCurrentDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}



export async function SendFirebaseNotificationSME(where: any, callback: any) {
  try {
    const sql = `
    INSERT INTO sme_notification (sme_id, agent_id, insert_date_time, schedule_date_time, event, message,username, title,  mode)
    VALUES (:sme_id, :agent_id, :insert_date_time, :schedule_date_time, :event, :message, :username, :title, :mode);
  `
    let executeQuery = sequelize.query(sql, {
      type: QueryTypes.INSERT,
      replacements: { sme_id: where["sme_id"], agent_id: where["agent_id"], insert_date_time: where["insert_date_time"], schedule_date_time: where["schedule_date_time"], event: where["event"], message: where["message"], username: where["username"], title: where["title"], mode: where["mode"] },
    })

    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function SendFirebaseNotificationAgent(where: any, callback: any) {
  try {
    const sql = `
    INSERT INTO sme_notification (sme_id, agent_id, insert_date_time, schedule_date_time, event, message,username, title,  mode)
    VALUES (:sme_id, :agent_id, :insert_date_time, :schedule_date_time, :event, :message, :username, :title, :mode);
  `
    let executeQuery = sequelize.query(sql, {
      type: QueryTypes.INSERT,
      replacements: { sme_id: where["sme_id"], agent_id: where["agent_id"], insert_date_time: where["insert_date_time"], schedule_date_time: where["schedule_date_time"], event: where["event"], message: where["message"], username: where["username"], title: where["title"], mode: where["mode"] },
    })

    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getAgentCampaignData(where: any, callback: any) {
  try {

    let limit_field = "";
    let initialRecord;
    if(where["initialRecord"]) {
      initialRecord = where["initialRecord"] - 1;
      limit_field = "limit " + initialRecord + "," + where["batchSize"] + "";
    }
    
    let Query = "SELECT ucd.customer_number, ucd.customer_number as customerNumber, ucd.assigned_to, ucd.other, oc.campaign_name, oc.campaign_description, DATE_FORMAT(oc.start_date_time, '%Y-%m-%d %H:%i:%s') as campaign_start_date, DATE_FORMAT(oc.end_date_time, '%Y-%m-%d %H:%i:%s') as campaign_end_date, oc.status, ab.customer_name  FROM unique_customer_detail AS ucd LEFT JOIN outgoing_campaign oc ON oc.id = ucd.campaign_id LEFT JOIN address_book ab ON ab.sme_id = ucd.sme_id AND ab.customer_number_primary = ucd.customer_number WHERE ucd.sme_id = :smeId AND ucd.assigned_to = :agentId and ucd.answer = 3 AND (oc.start_date_time < :currentDate AND oc.end_date_time > :currentDate) "+limit_field+" ";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], agentId: where["agentId"], currentDate: where["currentDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function totalgetAgentCampaignData(where: any, callback: any) {
  try {
    let Query = "SELECT count(*) as total_records FROM unique_customer_detail AS ucd LEFT JOIN outgoing_campaign AS oc ON ucd.campaign_id = ucd.campaign_id WHERE ucd.sme_id = :smeId AND ucd.answer = 3 AND ucd.assigned_to = :agentId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], agentId: where["agentId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function FindAllAgentsList(where: any, callback: any) {
  try {
    let Query =
      "SELECT agent_id, sme_id, agent_email, agent_mobile, agent_name, agent_extention, break_permission_flag, status FROM agent_details WHERE STATUS != -9 and sme_id =:id ";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"], },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function findSmeProductPackage(where: any, callback: any) {
  try {
    var Query = 'SELECT spm.id, spm.package_id, spm.sme_id,spm.package_status,spm.package_quantity,spm.amount,spm.discount,spm.discount_amount,spm.minutes as remainingMinutes,spm.no_of_calls as remainingCalls,spm.unlimited_calls, spm.agent_limit, DATE_FORMAT(spm.activate_date_time, "%Y-%m-%d ") AS activate_date_time, DATE_FORMAT(spm.expiration_date_time, "%Y-%m-%d") AS expiration_date_time,  DATE_FORMAT(spm.insert_date_time, "%Y-%m-%d %H:%i:%s") AS insert_date_time, pp.call_type,pp.subscription_type, pp.name,  pp.description,pp.minutes,pp.no_of_calls,spm.validity_months FROM sme_package_mapping AS spm LEFT JOIN product_package AS pp ON spm.package_id=pp.id  WHERE spm.sme_id = :id ';

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

/** get campaign report data*/
export async function checkCampaignReportdData(where: any, callback: any) {
  try {
    let Query = 'SELECT id, sme_id, campaign_name, campaign_type, campaign_description, status, is_report_generated, invalid_count, duplicate_count, already_assigned, filtered_count, DATE_FORMAT(start_date_time, "%Y-%m-%d %H:%i:%s") AS start_date_time, DATE_FORMAT(end_date_time, "%Y-%m-%d %H:%i:%s") AS end_date_time FROM outgoing_campaign WHERE (end_date_time < :currentDate OR status = "Completed") AND is_report_generated = 0';
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        currentDate: where["currentDate"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** get answered campaign report data*/
export async function answeredCampaignReportdData(where: any, callback: any) {
  try {
    let Query = 'SELECT ucd.customer_number, ucd.assigned_to, oic.answer FROM unique_customer_detail ucd LEFT JOIN outbond_ivr_cdr oic ON oic.sme_id = ucd.sme_id AND oic.called_number = ucd.customer_number WHERE ucd.campaign_id = :campaignId AND oic.start_date_time BETWEEN :startDate AND :endDate AND oic.answer = 2 GROUP BY ucd.customer_number';
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        campaignId: where["campaignId"],
        startDate: where["startDate"],
        endDate: where["endDate"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** get failed campaign report data*/
export async function failedCampaignReportdData(where: any, callback: any) {
  try {
    let Query = 'SELECT ucd.customer_number, ucd.assigned_to, oic.answer FROM unique_customer_detail ucd LEFT JOIN outbond_ivr_cdr oic ON oic.sme_id = ucd.sme_id AND oic.called_number = ucd.customer_number WHERE ucd.campaign_id = :campaignId AND oic.start_date_time BETWEEN :startDate AND :endDate AND oic.answer = 1 GROUP BY ucd.customer_number';
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        campaignId: where["campaignId"],
        startDate: where["startDate"],
        endDate: where["endDate"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** get pending campaign report data*/
export async function pendingCampaignReportdData(where: any, callback: any) {
  try {
    let Query = 'SELECT ucd.customer_number, ucd.assigned_to FROM unique_customer_detail ucd WHERE ucd.campaign_id = :campaignId AND NOT EXISTS (SELECT oic.called_number FROM outbond_ivr_cdr oic where oic.sme_id = ucd.sme_id AND oic.called_number = ucd.customer_number AND oic.start_date_time BETWEEN :startDate AND :endDate) GROUP BY ucd.customer_number';
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        campaignId: where["campaignId"],
        startDate: where["startDate"],
        endDate: where["endDate"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** Update IsReportGenerated campaign*/
export async function updateIsReportGeneratedStatus(where: any, callback: any) {
  try {
    let Query = "update outgoing_campaign set answered_report_path = :answeredFilePath, failed_report_path = :failedFilePath, pending_report_path = :pendingFilePath, agent_wise_report_path = :agentWiseFilePath, campaign_report_path = :campaignReportPath, is_report_generated = 1 where id = :campaignId AND sme_id = :smeId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        answeredFilePath: where["answeredFilePath"],
        failedFilePath: where["failedFilePath"],
        pendingFilePath: where["pendingFilePath"],
        agentWiseFilePath: where["agentWiseFilePath"],
        campaignId: where["campaignId"],
        smeId: where["smeId"],
        campaignReportPath: where["campaignReportPath"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function insertIvrCampaignSummary(where: any, callback: any) {
  try {
    const sql = `INSERT INTO ivr_campaign_summary (sme_id, agent_id, campaign_id, assigned, answered, failed, pending, insert_date_time)
    VALUES (:smeId, :agentId, :campaignId, :assigned, :answered, :failed, :pending, :insert_date_time);`
    let executeQuery = sequelize.query(sql, {
      type: QueryTypes.INSERT,
      replacements: { smeId: where["smeId"], agentId: where["agentId"], campaignId: where["campaignId"], assigned: where["assigned"], answered: where["answered"], failed: where["failed"], pending: where["pending"], insert_date_time: where["insert_date_time"] },
    })

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

/** get customer Notes*/
export async function FindCustomerNotes(where: any, callback: any) {
  try {
    var offset_field = "";
    if ((where["offset"] && where["offset"] != "") && (where["mode"] && where["mode"] == "notes")) {
      offset_field = " offset " + where["offset"];
    }
    let Query = "SELECT DATE_FORMAT(cr.start_date_time, '%Y-%m-%d %H:%i:%s') as start_date_time , cr.remarks, cr.mode, sp.name, ad.agent_name FROM customer_remarks cr LEFT JOIN sme_profile sp ON sp.id = cr.created_by LEFT JOIN agent_details ad ON ad.agent_id = cr.created_by WHERE cr.remarks != 'NULL' AND cr.remarks != '' AND SUBSTRING(TRIM(cr.customer_number), -10)= SUBSTRING(:customerNumber, -10)  AND cr.sme_id = :smeId ORDER BY cr.start_date_time DESC LIMIT 20 " + offset_field + "";
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


/** update unique customer campaign*/
export async function updateUniqueCustomerData(where: any, reqData: any, callback: any) {
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
export async function insertUniqueCustomerData(payload: any, where: any, callback: any) {
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
      "SELECT ab.customer_name, ab.company_name, ad.agent_name, cf.id, cf.customer_number,  cf.customer_number as customerNumber, DATE_FORMAT(cf.reminder_date_time, '%Y-%m-%d %H:%i:%s') as scheduleDateTime, cf.sme_id, cf.created_by, cf.message, cf.status, ucd.recent_duration, ucd.recent_via_longcode, ucd.server_ip_address, ucd.recent_patched_agent_id, ucd.total_incoming_calls, ucd.total_outgoing_calls, ucd.lead_type, ucd.lead_status, ucd.city_id, ucd.product_id, ucd.product_price, ucd.assigned_agent_id, ucd.connected_call_duration, ucd.sticky_type, ucd.insert_date_time, ucd.update_date_time, ucd.call_type,ucd.answer   from customer_followup as cf LEFT JOIN unique_customer_detail AS ucd ON ucd.sme_id = cf.sme_id AND SUBSTRING(TRIM(ucd.customer_number), -10) = SUBSTRING(cf.customer_number, -10) AND ucd.customer_followup_id = cf.id and (ucd.answer != 3 OR ucd.frequency != 0) LEFT JOIN address_book ab on SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(cf.customer_number, -10) AND ab.`status` != -9 AND ab.sme_id= cf.sme_id LEFT JOIN agent_details ad ON ad.sme_id = cf.sme_id AND ad.agent_id = cf.created_by where cf.sme_id= :smeId " + agentId_field + " " + customer_number_field + "AND DATE(cf.reminder_date_time) = DATE(:insertDateTime) GROUP BY cf.id order by cf.reminder_date_time asc";
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

/** get total today scheduled call data */
export async function totalgetScheduledCallsTodayData(where: any, callback: any) {
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
      "SELECT count(*) as total_records from customer_followup as cf left join unique_customer_detail as ucd on cf.id =ucd.customer_followup_id LEFT   JOIN address_book ab on SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(cf.customer_number, -10) AND ab.`status` != -9 AND ab.sme_id= cf.sme_id where cf.sme_id= :smeId " + agentId_field + " " + customer_number_field + " AND DATE(cf.reminder_date_time) = DATE(:insertDateTime)";
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
      "SELECT ab.customer_name, ab.company_name, ad.agent_name, cf.id, cf.customer_number,  cf.customer_number as customerNumber, DATE_FORMAT(cf.reminder_date_time, '%Y-%m-%d %H:%i:%s') as scheduleDateTime, cf.sme_id, cf.created_by, cf.message, cf.status, ucd.recent_duration, ucd.recent_via_longcode, ucd.server_ip_address, ucd.recent_patched_agent_id, ucd.total_incoming_calls, ucd.total_outgoing_calls, ucd.lead_type, ucd.lead_status, ucd.city_id, ucd.product_id, ucd.product_price, ucd.assigned_agent_id, ucd.connected_call_duration, ucd.sticky_type, ucd.insert_date_time, ucd.update_date_time, ucd.call_type,ucd.answer   from customer_followup as cf LEFT JOIN unique_customer_detail AS ucd ON ucd.sme_id = cf.sme_id AND SUBSTRING(TRIM(ucd.customer_number), -10) = SUBSTRING(cf.customer_number, -10) AND ucd.customer_followup_id = cf.id and (ucd.answer != 3 OR ucd.frequency != 0) LEFT JOIN address_book ab on SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(cf.customer_number, -10) AND ab.`status` != -9 AND ab.sme_id= cf.sme_id LEFT JOIN agent_details ad ON ad.sme_id = cf.sme_id AND ad.agent_id = cf.created_by where cf.sme_id= :smeId " + agentId_field + " " + customer_number_field + "AND DATE(cf.reminder_date_time) > DATE(:insertDateTime) GROUP BY cf.id order by cf.reminder_date_time asc";
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


/** get upcoming today scheduled call data */
export async function totalgetScheduledCallsUpcomingData(where: any, callback: any) {
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
      "SELECT count(*) as total_records from customer_followup as cf left join unique_customer_detail as ucd on cf.id =ucd.customer_followup_id LEFT   JOIN address_book ab on SUBSTRING(TRIM(ab.customer_number_primary), -10) = SUBSTRING(cf.customer_number, -10) AND ab.`status` != -9 AND ab.sme_id= cf.sme_id where cf.sme_id= :smeId " + agentId_field + " " + customer_number_field + " AND DATE(cf.reminder_date_time) > DATE(:insertDateTime)";
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

export async function getEndCallReasonsListData(where: any, callback: any) {
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

export async function UpdateEndCallReasonCommnCdr(where: any, callback: any) {
  try {
    let Query = "Update calling_cdr set end_call_reason_id=:reasonId where session_id= :sessionId and sme_id=:smeId and call_direction=:callDirection limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { reasonId: where["reasonId"], smeId: where["smeId"], sessionId: where["sessionId"], callDirection: where["callDirection"] },
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
    let Query = "Update outbond_ivr_cdr set end_call_reason_id=:reasonId where session_id= :sessionId and sme_id=:smeId limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { reasonId: where["reasonId"], smeId: where["smeId"], sessionId: where["sessionId"] },
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

export async function insertFollowUpCallsNotification(payload: any, callback: any) {
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


export async function deleteAgentDataFromChangePassword(payload: any, callback: any) {
  try {
    let Query = "delete from forget_password where sme_id  = :agentEmail LIMIT 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        agentEmail: payload["agentEmail"],
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

/**  find SME SMS packages*/
export async function getSmeSmsPackageData(where: any, callback: any) {
  try {
    var Query = "SELECT sp.name, sp.description, sp.amount, sp.sms_count, sb.billing_type, sb.balance, sb.price_per_unit FROM sms_package sp LEFT JOIN sme_sms_mapping sb ON sb.pack_id = sp.id  WHERE sb.sme_id = :smeId";
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

/**  find End Call SMS Enum*/
export async function getSmsEndCallEnumData(where: any, callback: any) {
  try {
    var Query = "SELECT id, name, message from endcall_sms_enum";
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

export async function getTotalLeadStatusSummaryData(where: any, callback: any) {
  try {
    let agenId_field = "";
    if (where["agentId"] && where["agentId"] != "") {
      agenId_field = " AND agent_id = " + where["agentId"] + " ";
    }
    var Query = "SELECT tlss.sme_id, tlss.agent_id, tlss.lead_status, SUM(tlss.lead_status_count) as lead_status_count, ls.lead_status as lead_status_name FROM total_lead_status_summary tlss LEFT JOIN lead_status ls ON ls.id = tlss.lead_status WHERE tlss.sme_id = :smeId AND (ls.status = 1 OR ls.status IS NULL AND tlss.lead_status = 0)  "+agenId_field+" GROUP BY tlss.lead_status ORDER BY lead_status_count DESC";
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

export async function getTotalLeadSourceSummaryData(where: any, callback: any) {
  try {
    let agenId_field = "";
    if (where["agentId"] && where["agentId"] != "") {
      agenId_field = " AND agent_id = " + where["agentId"] + " ";
    }
    var Query = "SELECT tlss.sme_id, tlss.agent_id, tlss.source_id, SUM(tlss.lead_source_count) as lead_source_count, ls.source FROM total_lead_source_summary tlss LEFT JOIN lead_source ls ON ls.id = tlss.source_id WHERE tlss.sme_id = :smeId AND (ls.status = 1 OR ls.status IS NULL AND  tlss.source_id = 0) "+agenId_field+" GROUP BY tlss.source_id ORDER BY lead_source_count DESC";
    
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

export async function getTotalLeadProductSummaryData(where: any, callback: any) {
  try {
    let agenId_field = "";
    if (where["agentId"] && where["agentId"] != "") {
      agenId_field = " AND agent_id = " + where["agentId"] + " ";
    }
    var Query = "SELECT tlps.sme_id, tlps.agent_id, tlps.product_id, SUM(tlps.lead_product_count) as lead_product_count, spl.product_name FROM total_lead_product_summary tlps LEFT JOIN sme_product_list spl ON spl.id = tlps.product_id AND spl.sme_id = tlps.sme_id AND (spl.status = 0 OR spl.status IS NULL AND tlps.product_id = 0) WHERE tlps.sme_id = :smeId AND (spl.status = 0 OR spl.status IS NULL AND tlps.product_id = 0) "+agenId_field+" GROUP BY tlps.product_id ORDER BY lead_product_count DESC";
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

export async function getTotalLeadTypeSummaryData(where: any, callback: any) {
  try {
    let agenId_field = "";
    if (where["agentId"] && where["agentId"] != "") {
      agenId_field = " AND agent_id = " + where["agentId"] + " ";
    }
    var Query = "SELECT tlts.sme_id, tlts.agent_id, tlts.lead_type, SUM(tlts.lead_type_count) AS lead_type_count FROM total_lead_type_summary tlts WHERE tlts.sme_id = :smeId " + agenId_field + " GROUP BY tlts.lead_type ORDER BY lead_type_count DESC";
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

export async function getTotalLeadFollowupSummaryData(where: any, callback: any) {
  try {
    let agenId_field = "";
    if (where["agentId"] && where["agentId"] != "") {
      agenId_field = " AND agent_id = " + where["agentId"] + " ";
    }
    var Query = "SELECT tlts.sme_id, tlts.agent_id, tlts.lead_type, SUM(tlts.lead_type_count) AS lead_type_count FROM total_lead_type_summary tlts WHERE tlts.sme_id = :smeId " + agenId_field + " GROUP BY tlts.lead_type ORDER BY lead_type_count DESC";
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

export async function getTotalLeadStatusData(where: any, callback: any) {
  try {
    var Query = "SELECT sme_id, recent_patched_agent_id, lead_status, COUNT(*) AS lead_status_count FROM unique_customer_detail GROUP BY lead_status, recent_patched_agent_id, sme_id ORDER BY lead_status_count DESC";
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

export async function getTotalLeadSourceData(where: any, callback: any) {
  try {
    var Query = "SELECT sme_id, recent_patched_agent_id, source_id, COUNT(*) AS lead_source_count FROM unique_customer_detail GROUP BY source_id, recent_patched_agent_id, sme_id ORDER BY lead_source_count DESC";
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

export async function getTotalLeadProductData(where: any, callback: any) {
  try {
    var Query = "SELECT sme_id, recent_patched_agent_id, product_id, COUNT(*) AS lead_product_count FROM unique_customer_detail GROUP BY product_id, recent_patched_agent_id, sme_id ORDER BY lead_product_count DESC";
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

export async function getTotalLeadTypeData(where: any, callback: any) {
  try {
    var Query = "SELECT sme_id, recent_patched_agent_id, lead_type, COUNT(*) AS lead_type_count FROM unique_customer_detail GROUP BY lead_type, recent_patched_agent_id, sme_id ORDER BY lead_type_count DESC";
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

export async function updateSmeSmsNotifyPermission(where: any, callback: any) {
  try {
    let Query = "Update endcall_sms set customer_success=:customerAnswer,customer_success_msg_id=:customerSuccessMsgId ,customer_failed=:customerFailed ,customer_failed_msg_id=:customerFailedMessageId ,agent_failed=:agentFailed ,agent_failed_msg_id=:agentFailedMsgId ,agent_success=:agentAnswer ,agent_success_msg_id=:agentAnswerMsgId ,admin_failed=:adminFailed ,admin_failed_msg_id=:adminFailedMsgId ,admin_success=:adminSuccess ,admin_success_msg_id=:adminSuccessMsgId, admin_abandoned=:adminabandoned, admin_abandoned_msg_id =:adminabandonedMsgId where sme_id=:smeId ";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        customerFailedMessageId: where["customerFailedMessageId"],
        smeId: where["smeId"],
        customerSuccessMsgId: where["customerSuccessMsgId"],
        agentFailedMsgId: where["agentFailedMsgId"],
        agentAnswerMsgId: where["agentAnswerMsgId"],
        adminFailedMsgId: where["adminFailedMsgId"],
        adminSuccessMsgId: where["adminSuccessMsgId"],
        customerFailed: where["customerFailed"],
        customerAnswer: where["customerAnswer"],
        adminSuccess: where["adminSuccess"],
        adminFailed: where["adminFailed"],
        agentAnswer: where["agentAnswer"],
        agentFailed: where["agentFailed"],
        adminabandoned: where["adminabandoned"],
        adminabandonedMsgId: where["adminabandonedMsgId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function checkSmeAutodialerPermissionData(where: any, callback: any) {
  try {
    var Query = "SELECT autodialer_permission_flag FROM sme_profile WHERE id = :smeId";
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

export async function FindEndCallSms(where: any, callback: any) {
  try {
    let Query = "Select id from endcall_sms where sme_id=:smeId limit 1";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
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

export async function getTodayLeadStatusSummaryData(where: any, callback: any) {
  try {
    let agentId_field = "";
    if(where["agentId"] && where["agentId"] != "") {
      agentId_field = " AND (recent_patched_agent_id = "+where["agentId"]+" OR assigned_agent_id = "+where["agentId"]+") ";
    }
    var Query = "SELECT lead_status, COUNT(*) AS lead_status_count FROM unique_customer_detail WHERE sme_id = :smeId AND date(insert_date_time) = DATE(:currentDate) "+agentId_field+" GROUP BY lead_status, sme_id ORDER BY lead_status_count DESC";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], currentDate: where["currentDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getTodayLeadSourceSummaryData(where: any, callback: any) {
  try {
    let agentId_field = "";
    if(where["agentId"] && where["agentId"] != "") {
      agentId_field = " AND (recent_patched_agent_id = "+where["agentId"]+" OR assigned_agent_id = "+where["agentId"]+") ";
    }
    var Query = "SELECT ucd.sme_id, ucd.source_id, ucd.insert_date_time, COUNT(*) AS lead_source_count, ls.source FROM unique_customer_detail ucd JOIN lead_source ls ON ls.created_by = ucd.sme_id AND ls.id = ucd.source_id WHERE ucd.sme_id = :smeId AND date(ucd.insert_date_time) = DATE(:currentDate) "+agentId_field+" GROUP BY ucd.source_id, ucd.sme_id ORDER BY lead_source_count DESC";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], currentDate: where["currentDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getTodayLeadProductSummaryData(where: any, callback: any) {
  try {
    let agentId_field = "";
    if(where["agentId"] && where["agentId"] != "") {
      agentId_field = " AND (recent_patched_agent_id = "+where["agentId"]+" OR assigned_agent_id = "+where["agentId"]+") ";
    }
    var Query = "SELECT ucd.sme_id, ucd.product_id, ucd.insert_date_time, COUNT(*) AS lead_product_count, spl.product_name FROM unique_customer_detail ucd JOIN sme_product_list spl ON spl.sme_id = ucd.sme_id AND spl.id = ucd.product_id WHERE ucd.sme_id = :smeId AND DATE(ucd.insert_date_time) = DATE(:currentDate) "+agentId_field+" GROUP BY ucd.product_id, ucd.sme_id ORDER BY lead_product_count DESC";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], currentDate: where["currentDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function addEndCallSMSPermission(where: any, callback: any) {
  try {
    let Query = "Insert into endcall_sms (customer_success,customer_success_msg_id,customer_failed,customer_failed_msg_id,agent_failed,agent_failed_msg_id,agent_success,agent_success_msg_id,admin_failed,admin_failed_msg_id,admin_success,admin_success_msg_id, sme_id,admin_abandoned, admin_abandoned_msg_id) values(:customerAnswer,:customerSuccessMsgId,:customerFailedMessageId,:customerFailed,:agentFailed,:agentFailedMsgId,:agentAnswer,:agentAnswerMsgId,:adminFailed,:adminFailedMsgId,:adminSuccess,:adminSuccessMsgId,:smeId,:adminabandoned, :adminabandonedMsgId)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        customerFailedMessageId: where["customerFailedMessageId"],
        smeId: where["smeId"],
        customerSuccessMsgId: where["customerSuccessMsgId"],
        agentFailedMsgId: where["agentFailedMsgId"],
        agentAnswerMsgId: where["agentAnswerMsgId"],
        adminFailedMsgId: where["adminFailedMsgId"],
        adminSuccessMsgId: where["adminSuccessMsgId"],
        customerFailed: where["customerFailed"],
        customerAnswer: where["customerAnswer"],
        adminSuccess: where["adminSuccess"],
        adminFailed: where["adminFailed"],
        agentAnswer: where["agentAnswer"],
        agentFailed: where["agentFailed"],
        adminabandoned: where["adminabandoned"],
        adminabandonedMsgId: where["adminabandonedMsgId"],
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


 //Add lead status 
export async function addLeadStatusData(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO lead_status (lead_status, description, created_by, status, insert_date_time,update_date_time) values (:leadStatus, :description, :smeId, :status, :insertDateTime, :insertDateTime)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { leadStatus: payload["leadStatus"], description: payload["description"], smeId: payload["smeId"], status: payload["status"], insertDateTime: payload["insertDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** Delete lead status*/
export async function deleteLeadStatusData(where: any, callback: any) {
  try {
    let Query = "update lead_status set status = :status, update_date_time = :updateDateTime where id = :statusId AND created_by = :smeId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        status: where["status"],
        statusId: where["statusId"],
        smeId: where["smeId"],
        updateDateTime: where["updateDateTime"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** Update lead status*/
export async function editLeadStatusData(where: any, callback: any) {
  try {
    let Query = "update lead_status set lead_status = :leadStatus, description = :description, update_date_time = :updateDateTime where id = :statusId AND created_by = :smeId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        leadStatus: where["leadStatus"],
        description: where["description"],
        updateDateTime: where["updateDateTime"],
        statusId: where["statusId"],
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

export async function findEndcallSmsPermissions(where: any, callback: any) {
  try {
    let Query = "Select customer_success as customerAnswer,customer_success_msg_id as customerSuccessMsgId,customer_failed as customerFailed,customer_failed_msg_id as customerFailedMessageId,agent_failed as agentFailed,agent_failed_msg_id as agentFailedMsgId,agent_success as agentAnswer,agent_success_msg_id as agentAnswerMsgId,admin_failed as adminFailed,admin_failed_msg_id as adminFailedMsgId,admin_success as adminSuccess,admin_success_msg_id as adminSuccessMsgId, sme_id, admin_abandoned as adminabandoned, admin_abandoned_msg_id as adminabandonedMsgId from endcall_sms where sme_id=:smeId limit 1";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
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


/** update  */
export async function UpdateFinalPayment(where: any, callback: any) {
  try {
    let Query = "UPDATE payment set status = :status, payment_response=:response  WHERE sme_id = :smeId  and id=:paymentId limit 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { status: where["status"], response: where["response"], paymentId: where["paymentId"], smeId: where["smeId"] },
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


/**  UpdateSmeSmsPlan */
export async function UpdateSmeSmsPlan(where: any, payload: any, callback: any) {
  try {
    let Query = "UPDATE sme_sms_mapping set pack_id = :packageId, balance=:smsCountUpdate  WHERE sme_id = :smeId  limit 1 ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { packageId: where["packageId"], smsCountUpdate: payload["smsCountUpdate"], smeId: where["smeId"] },
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
    let Query = "INSERT INTO sme_sms_mapping (sme_id, pack_id,balance,insert_date_time) values (:smeId,:packageId,:smsCount,:insert_date_time )";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { smeId: payload["smeId"], packageId: payload["packageId"], smsCount: payload["smsCount"], insert_date_time: payload["insert_date_time"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find */
export async function FindSmsPaymentHistory(where: any, callback: any) {
  try {

    var initialRecord = where["initialRecord"] - 1;
    var limit_field = "limit " + initialRecord + "," + where["batchSize"] + "";

    let Query = "SELECT p.pack_quantity, p.amount, p.status, p.order_id,smsp.name, DATE_FORMAT(p.insert_date_time, '%Y-%m-%d %H:%i:%s') as insert_date_time  FROM payment as p left join sms_package as smsp ON smsp.id = p.pack_id  WHERE p.sme_id=:smeId and p.status !='Draft' and p.package_type='SMS' order by p.insert_date_time desc "+
    limit_field +
    "";
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

export async function getTotalLeadCityData(where: any, callback: any) {
  try {
    var Query = "SELECT sme_id, recent_patched_agent_id, city_id, COUNT(*) AS lead_city_count FROM unique_customer_detail GROUP BY city_id, recent_patched_agent_id, sme_id ORDER BY lead_city_count DESC";
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

export async function getTotalLeadCitySummaryData(where: any, callback: any) {
  try {
    let agentId_field = "";
    if(where["agentId"] && where["agentId"] != "") {
      agentId_field = " AND agent_id = "+where["agentId"]+" ";
    }
    var Query = "SELECT tlps.sme_id, tlps.agent_id, tlps.city_id, SUM(tlps.lead_city_count) as lead_city_count, spl.city_name FROM total_lead_city_summary tlps LEFT JOIN country_cities spl ON spl.id = tlps.city_id LEFT JOIN sme_cities_list scl ON scl.city_id = tlps.city_id AND scl.sme_id = tlps.sme_id WHERE tlps.sme_id = :smeId AND (scl.status = 0 OR scl.status IS NULL AND tlps.city_id = 0) "+agentId_field+" GROUP BY tlps.city_id ORDER BY lead_city_count DESC";
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

export async function getTodayLeadCitySummaryData(where: any, callback: any) {
  try {
    let agentId_field = "";
    if(where["agentId"] && where["agentId"] != "") {
      agentId_field = " AND recent_patched_agent_id = "+where["agentId"]+" ";
    }
    var Query = "SELECT ucd.sme_id, ucd.city_id, ucd.insert_date_time, COUNT(*) AS lead_city_count, spl.city_name FROM unique_customer_detail ucd JOIN country_cities spl ON spl.id = ucd.city_id WHERE ucd.sme_id = :smeId AND DATE(ucd.insert_date_time) = DATE(:currentDate) "+agentId_field+" GROUP BY ucd.city_id, ucd.sme_id ORDER BY lead_city_count DESC";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], currentDate: where["currentDate"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function updateLeadUploadData(where: any, callback: any) {
  try {
    const sql = `
    INSERT INTO lead_upload (sme_id, base_file, base_count, invalid_file, invalid_count, filtered_file, filtered_count, duplicate_file,  duplicate_count, date_time)
    VALUES (:smeId, :base_file, :base_count, :invalid_file, :invalid_count, :filtered_file, :filtered_count, :duplicate_file, :duplicate_count, :insertDateTime);
  `
    let executeQuery = sequelize.query(sql, {
      type: QueryTypes.INSERT,
      replacements: { smeId: where["smeId"], base_file: where["base_file"], base_count: where["base_count"], invalid_file: where["invalid_file"], invalid_count: where["invalid_count"], filtered_file: where["filtered_file"], filtered_count: where["filtered_count"], duplicate_file: where["duplicate_file"], duplicate_count: where["duplicate_count"], insertDateTime: where["insertDateTime"] },
    })

    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function updateSmsEventSmeProfile(where: any, callback: any) {
  try {
    let Query = "UPDATE sme_profile set live_events = :SMSEVENT WHERE id = :SMEID ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { SMSEVENT: where["SMSEVENT"], SMEID: where["SMEID"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/**  Lead Transfer */
export async function leadTransferData(where: any, callback: any) {
  try {
    let Query = "UPDATE unique_customer_detail set assigned_agent_id = :agentId, sticky_type = :stickyType WHERE sme_id = :smeId and id= :leadId limit 1 ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { smeId: where["smeId"], agentId: where["agentId"], stickyType: where["stickyType"], leadId: where["leadId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/**  Upload Lead data */
export async function uploadLeadNumbers(where: any, callback: any) {
  try {
    let Query = "UPDATE unique_customer_detail set assigned_to = :agentId, sticky_type = :stickyType WHERE sme_id = :smeId and id= :leadId limit 1 ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { smeId: where["smeId"], agentId: where["agentId"], stickyType: where["stickyType"], leadId: where["leadId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/* Get Single Agent */
export async function getSingleAgentData(where: any, callback: any) {
  try {
    var Query = "SELECT agent_id, sme_id, agent_name, agent_mobile, STATUS, agent_email FROM agent_details WHERE sme_id = :smeId AND agent_id = :agentId LIMIT 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], agentId: where["agentId"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/**  Bulk Lead Transfer */
export async function bulkLeadTransferData(where: any, callback: any) {
  try {
    var Query = 'UPDATE unique_customer_detail SET assigned_agent_id = :assignedTo, sticky_type = :stickyType WHERE (recent_patched_agent_id = :assignedFrom OR assigned_agent_id = :assignedFrom) AND sme_id = :smeId';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { smeId: where["smeId"], assignedFrom: where["assignedFrom"], assignedTo: where["assignedTo"], stickyType: where["stickyType"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function updateManualLeadData(where: any, payload: any, callback: any) {
  try {
    let Query = "UPDATE unique_customer_detail set assigned_agent_id = :assigned_agent_id, sticky_type = :sticky_type, uploaded_date_time = :insert_date_time WHERE sme_id = :id and id= :leadId limit 1 ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { id: where["id"], assigned_agent_id: where["assigned_agent_id"], sticky_type: where["sticky_type"], insert_date_time: where["insert_date_time"], leadId: payload["leadId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function findThirdPartyleadSetting(where: any, callback: any) {
  try {
    var Query = 'SELECT id, third_party_code,name,sme_id,generated_key,generated_key_expire_status,generated_key_expire_message,url,status,lead_source from third_party_lead_settings where sme_id =:id and third_party_code=:thirdPartyName';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"],thirdPartyName: where["thirdPartyName"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}



export async function updatehirdPartyleadSetting(where: any,payload: any,  callback: any) {
  try {
    var Query = 'UPDATE third_party_lead_settings SET status=:status,lead_source=:defaultlead, generated_key=:generatedKey,url=:url WHERE sme_id=:id and id=:getId';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { id: where["id"],defaultlead: where["defaultlead"],status: where["status"] ,url: where["url"] ,generatedKey: where["generatedKey"],getId: payload["getId"]   },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function InserthirdPartyleadSetting(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO third_party_lead_settings (status, generated_key, url, third_party_code,sme_id,insert_date_time,lead_source) values (:status, :generatedKey, :url, :thirdPartyName, :id,:insertDateTime,:defaultlead)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { status: payload["status"], generatedKey: payload["generatedKey"], url: payload["url"], thirdPartyName: payload["thirdPartyName"],id: payload["id"], insertDateTime: payload["insertDateTime"],defaultlead: payload["defaultlead"], },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function findThirdPartyleadAssignedAgentId(where: any,payload: any, callback: any) {
  try {
    var Query = 'SELECT agent_id as id FROM third_party_lead_agent_mapping WHERE sme_id =:id and third_party_lead_id=:thirdPartyLeadId';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"],thirdPartyLeadId: payload["thirdPartyLeadId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function deleteAgentFromThirdPartyLead(where: any,payload: any, callback: any) {
  try {
    var Query = 'Delete from third_party_lead_agent_mapping where sme_id =:id and third_party_lead_id=:getId';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: { id: where["id"],getId: payload["getId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function AddAgentFromThirdPartyLead(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO third_party_lead_agent_mapping (agent_id, sme_id, third_party_lead_id, insert_date_time) values (:agentId, :sme_id, :thirdPartyLeadId, :insertDateTime)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { agentId: payload["agentId"], sme_id: payload["sme_id"], thirdPartyLeadId: payload["thirdPartyLeadId"], insertDateTime: payload["insertDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function findAllThirdPartyLeadSettings(where: any, callback: any) {
  try {
    var Query = 'SELECT id, third_party_code,name,sme_id,generated_key,generated_key_expire_status,generated_key_expire_message,url,status,lead_source FROM third_party_lead_settings WHERE sme_id =:id ';

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

export async function updateLeadStatusOnLiveCallData(payload: any, callback: any) {
  try {
    let Query = "Update unique_customer_detail set lead_status= :leadStatus where sme_id = :smeId AND SUBSTRING(TRIM(customer_number), -10) = SUBSTRING(:customerNumber, -10) limit 1 ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { leadStatus: payload["leadStatus"],  smeId: payload["smeId"],  customerNumber: payload["customerNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    glogger('ERR', "0", 'updateLeadStatusOnLiveCallData', "error:" + error);
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


/** find */
export async function FindSmePackagePaymentHistory(where: any, callback: any) {
  try {

    var initialRecord = where["initialRecord"] - 1;
    var limit_field = "limit " + initialRecord + "," + where["batchSize"] + "";

    let Query = "SELECT p.pack_quantity, p.amount, p.status, p.order_id,pk.name, DATE_FORMAT(p.insert_date_time, '%Y-%m-%d %H:%i:%s') as insert_date_time  FROM payment as p left join product_package as pk ON pk.id = p.pack_id  WHERE p.sme_id=:smeId and p.status !='Draft' and p.package_type='IVR' order by p.insert_date_time desc "+
    limit_field +
    "";
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


export async function getCampaignAssignedAgentsData(where: any, payload: any, callback: any) {
  try {
    var Query = 'SELECT agent_name, agent_mobile FROM agent_details WHERE sme_id = :smeId and agent_id in(:assignedAgents)';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], assignedAgents: payload["assignedAgents"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function generateReportData(where: any, callback: any) {
  try {
    let Query = "INSERT INTO downloaded_reports (sme_id, status, agent_id, call_flow, call_status, call_type, duration, duration_value, report_name, report_type, start_date_time, end_date_time, insert_date_time, city, lead_source, lead_status, product, email, database_mode) values (:smeId, :status, :agentId, :callFlow, :callStatus, :callType, :duration, :durationValue, :reportName, :reportType, :startDateTime, :endDateTime, :insertDateTime, :city, :leadSource, :leadStatus, :product, :email, :databaseMode)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { smeId: where["smeId"], status: where["status"], agentId: where["agentId"], callFlow: where["callFlow"], callStatus: where["callStatus"], callType: where["callType"], duration: where["duration"], durationValue: where["durationValue"], reportName: where["reportName"], reportType: where["reportType"], startDateTime: where["startDateTime"], endDateTime: where["endDateTime"], insertDateTime: where["insertDateTime"], city: where["city"], leadSource: where["leadSource"], leadStatus: where["leadStatus"], product: where["product"], email: where["email"], databaseMode: where["databaseMode"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getDownloadReportData(where: any, callback: any) {
  try {
    var Query = 'SELECT id, report_path, report_name, report_type, status, DATE_FORMAT(start_date_time, "%Y-%m-%d %H:%i:%s") AS start_date_time , DATE_FORMAT(end_date_time, "%Y-%m-%d %H:%i:%s") AS end_date_time,  DATE_FORMAT(insert_date_time, "%Y-%m-%d %H:%i:%s") AS insert_date_time FROM downloaded_reports WHERE sme_id = :smeId order by insert_date_time desc';

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

export async function FindCommSmsSettings(where: any, callback: any) {
  try {
    let Query = "Select id,sme_id, username as commUsername, url,password as commPassword from comm_sme_sms_settings where sme_id=:smeId";
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

export async function updateCommSmsSettings(payload: any, callback: any) {
  try {
    let Query = "Update comm_sme_sms_settings set url=:url, username=:username, password=:password where sme_id =:smeId";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { smeId: payload["smeId"], username: payload["username"], url: payload["url"], password: payload["password"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function addCommSmsSettings(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO comm_sme_sms_settings (sme_id, url, username, password, insert_date_time) values (:smeId, :url, :username,:password, :insertDateTime )";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        url: payload["url"],
        username: payload["username"],
        password: payload["password"],
        insertDateTime: payload["insertDateTime"],
        principalId: payload["principalId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindtemplateData(where: any, callback: any) {
  try {
    let Query = "Select id, template_name, message, dlt_principal_id,dlt_content_id,dlt_telemarketer_id,unicode, v_from,insert_date_time from comm_sme_sms_template where sme_id=:smeId and status !=-9  and id=:templateId";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"] , templateId: where["templateId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function getFrequencyCalls(where: any, callback: any) {
  try {
    let call_direction_field = "";
    let agent_id_field = "";
    let limit_field = "";

    if(where["callDirection"] && where["callDirection"] == "Incoming") {
      call_direction_field = " and cc.call_direction = 'Incoming'";
    } else if(where["callDirection"] && where["callDirection"] == "Outgoing") {
      call_direction_field = " and cc.call_direction = 'Outgoing'";
    }

    if(where["initialRecord"] && where["initialRecord"] > 0){
      limit_field = "limit " + where["initialRecord"] + "," + where["batchSize"] + "";
    } else {
      limit_field = "limit 0,5";
    }

    let Query = "SELECT cc.sme_id, DATE_FORMAT(cc.start_date_time, '%Y-%m-%d %H:%i:%s') AS start_date_time, cc.duration, cc.call_direction, cc.customer_number, cc.agent_number, cc.call_status, cr.remarks FROM calling_cdr cc LEFT JOIN customer_remarks cr ON cr.sme_id = cc.sme_id AND cr.customer_number = cc.customer_number AND cr.session_id = cc.session_id WHERE cc.sme_id = :smeId AND SUBSTRING(TRIM(cc.customer_number), -10) = SUBSTRING(:customerNumber, -10)"
    +call_direction_field+ " "
    +agent_id_field+ " order by cc.start_date_time DESC "+limit_field+"";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"] , customerNumber: where["customerNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getWebrtcNumberData(where: any, callback: any) {
  try {
    let Query = "Select seq_col_value from sequence_gen where seq_col_name = 'webrtc_agent_number'";
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

/** Add webrtc agent  */
export async function addWebrtcAgentData(payload: any, where: any, callback: any) {
  try {
    var Query;
    if (where["agentExtension"] == null) {
      Query =
        "INSERT INTO agent_details (sme_id, agent_name, agent_mobile, status, in_time, out_time, days_flag, agent_email, sticky_agent, agent_masking, sticky_days, assign_failed_calls, assign_voicemail_calls, in_permission_flag, out_permission_flag, agent_extention, agent_position, insert_time, break_permission_flag,longcode_priority_flag, webrtc_flag, webrtc_secret, recording_type) values(:id, :agentName, :agentMobile, :status, :inTime, :outTime, :daysFlag, :agentEmail, :stickyAgent, :agentMasking, :stickyDays, :assignFailedCalls, :assignVoicemailCalls, :inPermissionFlag, :outPermissionFlag,  1001, 1, :insertDateTime, :breakPermissionFlag, :virtualNumberPriority, :webrtcFlag, :secret, :recordingType)";
    } else {
      Query =
        "INSERT INTO agent_details (sme_id, agent_name, agent_mobile, status, in_time, out_time, days_flag, agent_email, sticky_agent, agent_masking, sticky_days, assign_failed_calls, assign_voicemail_calls, in_permission_flag, out_permission_flag,break_permission_flag, agent_extention, agent_position, insert_time,longcode_priority_flag, webrtc_flag, webrtc_secret, recording_type) values(:id, :agentName, :agentMobile, :status, :inTime, :outTime, :daysFlag, :agentEmail, :stickyAgent, :agentMasking, :stickyDays, :assignFailedCalls, :assignVoicemailCalls, :inPermissionFlag, :outPermissionFlag, :breakPermissionFlag, :agentExtension, :agentPosition, :insertDateTime,:virtualNumberPriority, :webrtcFlag, :secret, :recordingType)";
    }

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        id: payload["id"],
        agentName: payload["agentName"],
        agentMobile: where["agentMobile"],
        status: payload["status"],
        inTime: payload["inTime"],
        outTime: payload["outTime"],
        daysFlag: payload["daysFlag"],
        agentEmail: payload["agentEmail"],
        stickyAgent: payload["stickyAgent"],
        agentMasking: payload["agentMasking"],
        stickyDays: payload["stickyDays"],
        assignFailedCalls: payload["assignFailedCalls"],
        assignVoicemailCalls: payload["assignVoicemailCalls"],
        inPermissionFlag: payload["inPermissionFlag"],
        outPermissionFlag: payload["outPermissionFlag"],
        insertDateTime: payload["insertDateTime"],
        breakPermissionFlag: payload["breakPermissionFlag"],
        agentExtension: where["agentExtension"],
        agentPosition: where["agentPosition"],
        virtualNumberPriority: payload["virtualNumberPriority"],
        webrtcFlag: payload["webrtcFlag"],
        secret: payload["secret"],
        recordingType: payload["recordingType"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


/** Add SIP Buddies  */
export async function addSipBuddies(payload: any, callback: any) {
  try {
    var Query =
        "INSERT INTO cc_sip_buddies (name, secret, transport, host, context, nat, type, amaflags, dtmfmode, qualify, regexten, disallow, allow, fullcontact, ipaddr, port, username, directmedia, trustrpid, sendrpid, timert1, callcounter, allowoverlap, allowsubscribe, allowtransfer, ignoresdpversion, videosupport, rfc2833compensate, dtlsverify, useragent, regseconds, regserver, lastms, qualifyfreq, encryption) values(:agentMobile, :secret, :transport, :host, :context, :nat, :type, :amaflags, :dtmfmode, :qualify, :regexten, :disallow, :allow, :fullcontact, :ipaddr, :port, :username, :directmedia, :trustrpid, :sendrpid, :timert1, :callcounter, :allowoverlap, :allowsubscribe, :allowtransfer, :ignoresdpversion, :videosupport, :rfc2833compensate, :dtlsverify, :useragent, :regseconds, :regserver, :lastms, :qualifyfreq, :encryption)";

    let executeQuery = await sequelize_webrtc.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        agentMobile: payload["agentMobile"],
        secret: payload["secret"],
        transport: payload["transport"],
        host: payload["host"],
        context: payload["context"],
        nat: payload["nat"],
        type: payload["type"],
        accountcode: payload["agentMobile"],
        amaflags: payload["amaflags"],
        dtmfmode: payload["dtmfmode"],
        qualify: payload["qualify"],
        regexten: payload["agentMobile"],
        disallow: payload["disallow"],
        allow: payload["allow"],
        fullcontact: payload["fullcontact"],
        ipaddr: payload["ipaddr"],
        port: payload["port"],
        username: payload["agentMobile"],
        directmedia: payload["directmedia"],
        trustrpid: payload["trustrpid"],
        sendrpid: payload["sendrpid"],
        timert1: payload["timert1"],
        callcounter: payload["callcounter"],
        allowoverlap: payload["allowoverlap"],
        allowsubscribe: payload["allowsubscribe"],
        allowtransfer: payload["allowtransfer"],
        ignoresdpversion: payload["ignoresdpversion"],
        videosupport: payload["videosupport"],
        rfc2833compensate: payload["rfc2833compensate"],
        session_timers: payload["session_timers"],
        dtlsverify: payload["dtlsverify"],
        useragent: payload["useragent"],
        regseconds: payload["regseconds"],
        regserver: payload["regserver"],
        lastms: payload["lastms"],
        qualifyfreq: payload["qualifyfreq"],
        encryption: payload["encryption"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function updateSeqWebrtcNumber(payload: any, callback: any) {
  try {
    let Query = "Update sequence_gen set seq_col_value = :webrtcNumber where seq_col_name = 'webrtc_agent_number'";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { webrtcNumber: payload["webrtcNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function isdeletedAgentLeadExistData(where: any, callback: any) {
  try {
    let Query = "SELECT count(DISTINCT(ucd.customer_number)) AS totalLeads FROM unique_customer_detail ucd WHERE ucd.sme_id = :smeId AND ucd.assigned_agent_id = :agentId";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], agentId: where["agentId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/*Non Working Hours*/
export async function getNonWorkingFlowData(where: any, callback: any) {
  try {
    let Query = "SELECT mnwh.id, mnwh.text_to_speech_id as welcomeGreeting , mnwh.sme_id AS smeId, mnwh.non_working_hours AS workingHours, mnwh.in_time AS inTime, mnwh.out_time AS outTime, mnwh.redirect_to_voicemail AS voicemail, mnwh.insert_date AS insertDate, ttsr.file_path AS filePath, ttsr.file_name AS fileName, ttsr.language FROM mpbx_non_working_hours mnwh LEFT JOIN text_to_speech_record ttsr ON ttsr.id = mnwh.text_to_speech_id AND ttsr.sme_id = mnwh.sme_id WHERE mnwh.sme_id = :smeId LIMIT 1";
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

export async function saveNonWorkingFlowData(payload: any, where: any, callback: any) {
  try {
    var Query =
        "INSERT INTO mpbx_non_working_hours (sme_id, text_to_speech_id, non_working_hours, in_time, out_time, redirect_to_voicemail, mode_from, insert_date, insert_date_time, update_date_time) values(:smeId, :textToSpeechId, :workingHours, :inTime, :outTime,:voicemail, :modeFrom, :insertDate, :insertDateTime, :updateDateTime)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        textToSpeechId: where["textToSpeechId"],
        workingHours: payload["workingHours"],
        inTime: payload["inTime"],
        outTime: payload["outTime"],
        voicemail: payload["voicemail"],
        modeFrom: payload["modeFrom"],
        insertDate: payload["insertDate"],
        insertDateTime: payload["insertDateTime"],
        updateDateTime: payload["updateDateTime"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getNonWorkingMappingFlowData(where: any, callback: any) {
  try {
    let Query = "SELECT id, file_name, file_path, insert_date_time, mode_from, sme_id, transcode_status, type, welcome_greeting_name FROM text_to_speech_record WHERE sme_id = :smeId AND type = :nonWorkingType";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], nonWorkingType: where["nonWorkingType"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function saveNonWorkingFlowMappingData(payload: any, callback: any) {
  try {
    var Query =
        "INSERT INTO text_to_speech_record (sme_id, type, file_path, file_name, mode_from, welcome_greeting_name, language, insert_date_time, directory_path) values(:smeId, :nonWorkingType, :filePath, :fileName, :modeFrom, :welcomeGreetingName, :language, :insertDateTime, :directoryPath)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        nonWorkingType: payload["nonWorkingType"],
        filePath: payload["filePath"],
        fileName: payload["fileName"],
        modeFrom: payload["modeFrom"],
        welcomeGreetingName: payload["welcomeGreetingName"],
        welcomeGreeting: payload["welcomeGreeting"],
        language: payload["language"],
        insertDateTime: payload["insertDateTime"],
        directoryPath: payload["directoryPath"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function updateNonWorkingFlowData(payload: any, where: any, callback: any) {
  try {
    let Query = "UPDATE mpbx_non_working_hours SET non_working_hours = :workingHours, in_time = :inTime, out_time = :outTime, redirect_to_voicemail = :voicemail, text_to_speech_id = :textToSpeechId WHERE sme_id = :smeId AND id = :id";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { 
        smeId: payload["smeId"],
        workingHours: payload["workingHours"],
        inTime: payload["inTime"],
        outTime: payload["outTime"],
        welcomeGreeting: payload["welcomeGreeting"],
        voicemail: payload["voicemail"],
        filePath: payload["filePath"],
        fileName: payload["fileName"],
        id: payload["id"],
        textToSpeechId: where["textToSpeechId"],
        updateDateTime: payload["updateDateTime"], 
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/*Non Working Days*/

export async function getNonWorkingDayData(where: any, callback: any) {
  try {
    let Query = "SELECT mnwh.id, mnwh.text_to_speech_id as welcomeGreeting , mnwh.sme_id AS smeId, mnwh.non_working_days AS workingDays, mnwh.redirect_to_voicemail AS voicemail, mnwh.mon, mnwh.tue, mnwh.wed, mnwh.thu, mnwh.fri, mnwh.sat, mnwh.sun, mnwh.insert_date_time AS insertDateTime, ttsr.file_path AS filePath, ttsr.file_name AS fileName, ttsr.language FROM mpbx_non_working_days mnwh LEFT JOIN text_to_speech_record ttsr ON ttsr.id = mnwh.text_to_speech_id AND ttsr.sme_id = mnwh.sme_id WHERE mnwh.sme_id = :smeId LIMIT 1";
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

export async function saveNonWorkingDaysData(payload: any, where: any, callback: any) {
  try {
    var Query =
        "INSERT INTO mpbx_non_working_days (sme_id, text_to_speech_id, non_working_days, redirect_to_voicemail, mode_from, mon, tue, wed, thu, fri, sat, sun, insert_date_time) values(:smeId, :textToSpeechId, :workingDays, :voicemail, :modeFrom, :mon, :tue, :wed, :thu, :fri, :sat, :sun, :insertDateTime)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        textToSpeechId: where["textToSpeechId"],
        workingDays: payload["workingDays"],
        voicemail: payload["voicemail"],
        modeFrom: payload["modeFrom"],
        mon: payload["mon"],
        tue: payload["tue"],
        wed: payload["wed"],
        thu: payload["thu"],
        fri: payload["fri"],
        sat: payload["sat"],
        sun: payload["sun"],
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

export async function updateNonWorkingDaysData(payload: any, where: any, callback: any) {
  try {
    let Query = "UPDATE mpbx_non_working_days SET non_working_days = :workingDays, redirect_to_voicemail = :voicemail, text_to_speech_id = :textToSpeechId, redirect_to_voicemail = :voicemail, mon = :mon, tue = :tue, wed = :wed, thu = :thu, fri = :fri, sat = :sat, sun = :sun WHERE sme_id = :smeId AND id = :id";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { 
        smeId: payload["smeId"],
        workingDays: payload["workingDays"],
        mon: payload["mon"],
        tue: payload["tue"],
        wed: payload["wed"],
        thu: payload["thu"],
        fri: payload["fri"],
        sat: payload["sat"],
        sun: payload["sun"],
        voicemail: payload["voicemail"],
        id: payload["id"],
        textToSpeechId: where["textToSpeechId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function updateTextToSpeechCount(payload: any, callback: any) {
  try {
    var Query = "";
    if(payload["welcomeGreetingName"] && payload["welcomeGreetingName"] != ''){
      Query = "UPDATE sme_profile SET text_to_speech_count = (text_to_speech_count-1) WHERE id = :smeId";
    } else {
      Query = "UPDATE sme_profile SET text_to_speech_count = text_to_speech_count WHERE id = :smeId";
    }
    
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { 
        smeId: payload["smeId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function bulkLeadStatusTransferData(payload: any, callback: any) {
  try {
    let Query = "UPDATE total_lead_status_summary SET agent_id = :assignedTo WHERE agent_id = :assignedFrom AND sme_id = :smeId";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { 
        smeId: payload["smeId"],
        assignedFrom: payload["assignedFrom"],
        assignedTo: payload["assignedTo"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function updateWebrtcAgentData(payload: any, callback: any) {
  try {
    let Query = "UPDATE agent_details SET webrtc_registered_flag = :status, webrtc_registered_duration = :insertDateTime WHERE sme_id = :smeId and agent_id = :agentId";
    
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { 
        status: payload["status"],
        insertDateTime: payload["insertDateTime"],
        smeId: payload["smeId"],
        agentId: payload["agentId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function deleteAgentFromLongcodeMapping(payload: any, callback: any) {
  try {
    let Query = "delete from longcodes_agent_mapping where agent_id  = :agentId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        agentId: payload["agentId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function isWebrtcAgentRegisterData(where: any, callback: any) {
  try {
    let Query = "SELECT name, fullcontact, port FROM cc_sip_buddies WHERE name in('"+where["webrtcAgentNumbers"]+"')";
    let executeQuery = await sequelize_webrtc.query<any>(Query, {
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


export async function getAbandonedCallsData(where: any, callback: any) {
  try {
    let Query = "SELECT SUM(CASE WHEN ucd.answer = 2 AND ucd.call_type = 'INCOMING' THEN 1 ELSE 0 END) AS incoming_failed_calls, SUM(CASE WHEN ucd.answer = 2 AND ucd.call_type = 'OUTGOING' THEN 1 ELSE 0 END) AS outgoing_failed_calls FROM unique_customer_detail ucd LEFT JOIN black_white_list bwl ON SUBSTRING(TRIM(bwl.customer_number), -10)= SUBSTRING(ucd.customer_number, -10) AND bwl.sme_id = ucd.sme_id AND bwl.blacklist_status != -9 WHERE ucd.sme_id = :smeId AND ucd.update_date_time BETWEEN :startDateTime AND :endDateTime AND bwl.blacklist_status IS NULL";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { 
        smeId: where["smeId"],
        startDateTime: where["startDateTime"],
        endDateTime: where["endDateTime"],
      }
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function getTrainingVideosData(where: any, callback: any) {
  try {
    let Query = "SELECT * from training_videos";
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


export async function getFaqData(where: any, callback: any) {
  try {
    let Query = "SELECT * from faq";
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


/**  Followup Transfer */
export async function followupTransferData(where: any, callback: any) {
  try {
    let Query = "UPDATE customer_followup set created_by = :assignedTo  WHERE created_by = :assignedFrom and sme_id = :smeId and right(customer_number, 10) = right(:customerNumber, 10)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { 
        smeId: where["smeId"], 
        assignedTo: where["assignedTo"], 
        assignedFrom: where["assignedFrom"], 
        customerNumber: where["customerNumber"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function findFacebookLeadSetting(where: any, callback: any) {
  try {
    var Query = 'SELECT * from facebook_lead_setting where sme_id =:id limit 1';

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


export async function updateFacebookleadSetting(where: any,payload: any,  callback: any) {
  try {
    var Query = 'UPDATE facebook_lead_setting SET status=:status,client_id=:clientId, secret_key=:secretKey,access_token=:token, token_expired_date=:tokenExpired WHERE sme_id=:id and id=:getId';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { id: where["id"],clientId: where["clientId"],status: where["status"] ,token: where["token"] ,secretKey: where["secretKey"],getId: payload["getId"] ,tokenExpired: where["tokenExpired"]   },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function InserFacebookleadSetting(where: any, callback: any) {
  try {
    let Query = "INSERT INTO facebook_lead_setting (status, client_id, secret_key, access_token,sme_id,insert_date_time,token_expired_date) values (:status, :clientId, :secretKey, :token, :id,:insertDateTime,:tokenExpired)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { clientId: where["clientId"],status: where["status"] ,token: where["token"] ,secretKey: where["secretKey"],id: where["id"] ,tokenExpired: where["tokenExpired"],insertDateTime: where["insertDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function findfacebookCampaignSettings(where: any, callback: any) {
  try {
    var Query = "SELECT fcds.id, fcds.sme_id, fcds.campaign_id as campaignId, fcds.campaign_name, fcds.name, fcds.status, fcds.adset_id as adsetId, fcds.adset_name, fcds.ads_id as adsId, fcds.ads_name, fcds.lead_source_id as lead_source, fcds.lead_status, fcds.insert_date_time,lst.lead_status as lead_status_name, lsr.source as source_name from facebook_campaign_ads_setting as fcds left join lead_source as lsr on lsr.id = fcds.lead_source_id left join lead_status as lst on lst.id =fcds.lead_status  where sme_id =:id";

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


export async function InserFacebookcampaignData(where: any, callback: any) {
  try {
    let Query = "INSERT INTO facebook_campaign_ads_setting (name,campaign_id, adset_id, ads_id, lead_source_id,sme_id,insert_date_time,lead_status,campaign_name,adset_name,ads_name) values (:name, :campaignId, :adsetId, :adsId, :lead_source, :id,:insertDateTime,:lead_status,:campaign_name, :adset_name,:ads_name )";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { adsetId: where["adsetId"],campaignId: where["campaignId"] ,lead_source: where["lead_source"] ,adsId: where["adsId"],name: where["name"],id: where["id"] ,lead_status: where["lead_status"],insertDateTime: where["insertDateTime"],ads_name: where["ads_name"],adset_name: where["adset_name"],campaign_name: where["campaign_name"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function AddAgentFromFacebookLead(payload: any, callback: any) {
  try {
    let Query = "INSERT INTO facebook_lead_agent_mapping (agent_id, sme_id, facebook_campaign_ads_id, insert_date_time) values (:agentId, :sme_id, :facebookCampId, :insertDateTime)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: { agentId: payload["agentId"], sme_id: payload["sme_id"], facebookCampId: payload["facebookCampId"], insertDateTime: payload["insertDateTime"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindfacebookCampaignAssignedAgentId(where: any,payload: any, callback: any) {
  try {
    var Query = 'SELECT agent_id as id FROM facebook_lead_agent_mapping WHERE sme_id =:id and facebook_campaign_ads_id=:facebook_campaign_ads_id';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"],facebook_campaign_ads_id: payload["facebook_campaign_ads_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindSinglefacebookCampaignadsdata(where: any,payload: any, callback: any) {
  try {
    var Query = 'SELECT *  FROM facebook_campaign_ads_setting WHERE sme_id =:id and id=:facebook_campaign_ads_id limit 1';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { id: where["id"],facebook_campaign_ads_id: payload["facebook_campaign_ads_id"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function UpdatefaceBookCampaignStatus(where: any,  callback: any) {
  try {
    var Query = 'UPDATE facebook_campaign_ads_setting SET status=:status WHERE sme_id=:id and id=:facebook_campaign_ads_id';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { id: where["id"],facebook_campaign_ads_id: where["facebook_campaign_ads_id"],status: where["status"]   },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function DeleteFacebookCampaignData(where: any, callback: any) {
  try {
    var Query = 'Delete from facebook_campaign_ads_setting where sme_id =:id and id=:campaignId limit 1' ;

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: { id: where["id"],campaignId: where["campaignId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function DeleteFacebookCampaignAssignedAgents(where: any, callback: any) {
  try {
    var Query = 'Delete from facebook_lead_agent_mapping where sme_id =:id and facebook_campaign_ads_id=:campaignId ';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: { id: where["id"],campaignId: where["campaignId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}



export async function updateFacebookcampaignData(where: any,  callback: any) {
  try {
    var Query = 'UPDATE facebook_campaign_ads_setting SET name=:name,campaign_id=:campaignId, adset_id=:adsetId, ads_id=:adsId, lead_source_id=:lead_source,sme_id=:id,insert_date_time=:insertDateTime,lead_status=:lead_status,campaign_name=:campaign_name,adset_name=:adset_name,ads_name=:ads_name WHERE sme_id=:id and id=:campaign_edit_id';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {adsetId: where["adsetId"],campaignId: where["campaignId"] ,lead_source: where["lead_source"] ,adsId: where["adsId"],name: where["name"],id: where["id"] ,lead_status: where["lead_status"],insertDateTime: where["insertDateTime"],ads_name: where["ads_name"],adset_name: where["adset_name"],campaign_name: where["campaign_name"],campaign_edit_id: where["campaign_edit_id"]   },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindAgentLongcodes(where: any, callback: any) {
  try {
    var Query = 'SELECT lam.agent_id, lam.longcode_id, l.longcode  FROM longcodes_agent_mapping lam LEFT JOIN longcodes l ON l.id = lam.longcode_id where lam.agent_id = :agentId';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agentId: where["agentId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** Check if number exist in informative obd  */
export async function numberExistInInformativeObd(where: any, payload: any, callback: any) {
  try {
    let Query = "SELECT ucd.id, ucd.customer_number, oc.id AS campaign_id, oc.campaign_name, oc.status, DATE_FORMAT(oc.end_date_time, '%Y-%m-%d %H:%i:%s') AS end_date_time, ucd.assigned_to FROM informative_obd ucd LEFT JOIN outgoing_campaign oc ON oc.id = ucd.campaign_id WHERE ucd.sme_id = :smeId AND SUBSTRING(TRIM(ucd.customer_number), -10) = SUBSTRING(:customerNumber, -10) LIMIT 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        smeId: where["smeId"],
        customerNumber: payload["customerNumber"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** update Informative Obd Lead*/
export async function updateInformativeObd(where: any, payload: any, reqData: any, callback: any) {
  try {
    let Query = "update informative_obd set answer = 3, assigned_to = :agentId, campaign_id = :campaignId, source_id = :sourceId, is_auto_dialed = :isAutoDialer, other = :other, uploaded_date_time = :insertDateTime where sme_id = :smeId AND RIGHT(customer_number, 10)  = RIGHT(:customerNumber, 10)";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        agentId: payload["agentId"],
        campaignId: reqData["campaignId"],
        sourceId: payload["sourceId"],
        isAutoDialer: reqData["isAutoDialer"],
        leadStatus: payload["leadStatus"],
        cityId: payload["cityId"],
        productId: payload["productId"],
        productPrice: payload["productId"],
        other: payload["other"],
        customerNumber: where["customerNumber"],
        insertDateTime: reqData["insertDateTime"],
        smeId: reqData["smeId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** insert informative obd leads*/
export async function insertInformativeObd(payload: any, reqData: any, callback: any) {
  try {
    let Query =
      "INSERT INTO informative_obd (sme_id, customer_number, recent_duration, recent_via_longcode, server_ip_address, recent_patched_agent_id, total_incoming_calls, total_outgoing_calls, lead_type, lead_status, city_id, product_id, product_price, assigned_agent_id, connected_call_duration, sticky_type, insert_date_time, update_date_time, call_type, assigned_to, answer, campaign_id, source_id, other) values (:smeId, :customerNumber, :recentDuration, :recentViaLongcode, :serverIpAddress, :recentPatchedAgentId, :totalIncomingCalls, :totalOutgoingCalls, :leadType, :leadStatus, :cityId, :productId, :productPrice, :assignedAgentId, :connectedCallDuration, :stickyType, :insertDateTime, :updateDateTime, :callType, :agentId, 3, :campaignId, :sourceId, :other)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        customerNumber: payload["customerNumber"],
        recentDuration: payload["recentDuration"],
        recentViaLongcode: payload["recentViaLongcode"],
        serverIpAddress: payload["serverIpAddress"],
        recentPatchedAgentId: payload["recentPatchedAgentId"],
        totalIncomingCalls: payload["totalIncomingCalls"],
        totalOutgoingCalls: payload["totalOutgoingCalls"],
        leadType: payload["leadType"],
        leadStatus: payload["leadStatus"],
        cityId: payload["cityId"],
        productId: payload["productId"],
        productPrice: payload["productPrice"],
        assignedAgentId: payload["assignedAgentId"],
        connectedCallDuration: payload["connectedCallDuration"],
        stickyType: payload["stickyType"],
        insertDateTime: payload["insertDateTime"],
        updateDateTime: payload["updateDateTime"],
        callType: payload["callType"],
        agentId: payload["agentId"],
        campaignId: reqData["campaignId"],
        sourceId: payload["sourceId"],
        other: payload["other"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindallPrompts(where: any, callback: any) {
  try {
    let Query = "select * from sme_prompts where sme_id  = :id and status = 1";

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

export async function insertUniqueCustomerCampaignNew(payload: any, reqData: any, callback: any) {
  try {
    let Query =
      "INSERT INTO upload_dialer_numbers (sme_id, customer_number, lead_status, city_id, product_id, product_price, assigned_agent_id, insert_date_time, update_date_time, call_type, assigned_to, campaign_id, source_id, other, call_status, session_id) values (:smeId, :customerNumber, :leadStatus, :cityId, :productId, :productPrice, :assignedAgentId, :insertDateTime, :updateDateTime, :callType, :agentId, :campaignId, :sourceId, :other, :callStatus, :sessionId)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        customerNumber: payload["customerNumber"],
        leadStatus: payload["leadStatus"],
        cityId: payload["cityId"],
        productId: payload["productId"],
        productPrice: payload["productPrice"],
        assignedAgentId: payload["assignedAgentId"],
        insertDateTime: payload["insertDateTime"],
        updateDateTime: payload["updateDateTime"],
        callType: payload["callType"],
        agentId: payload["agentId"],
        campaignId: reqData["campaignId"],
        sourceId: payload["sourceId"],
        other: payload["other"],
        callStatus: payload["callStatus"],
        sessionId: payload["sessionId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function ifExistInUploadDialerNumbers (where: any, callback: any) {
  try {
    let Query = "select id from upload_dialer_numbers where sme_id  = :smeId and RIGHT(customer_number, 10) = RIGHT(:customer_number, 10) AND campaign_id = :campaignId";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], customer_number: where["customer_number"], campaignId: where["campaignId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** get outgoing campaign data */
export async function getOutgoingCampaignBetaData(where: any, callback: any) {
  try {
    let campaign_name_field = "";
    let campaign_description_field = "";
    let campaign_type_field = "";
    let limit_field = "";
    let g_initialRecord = 0;
    let campaign_id_field = "";

    if (where["isDownload"] == "1") {
      limit_field = "";
    } else {
      g_initialRecord = where["initialRecord"] - 1;
      limit_field = "limit " + g_initialRecord + "," + where["batchSize"] + "";
    }

    //Campaign Name check
    if (where["campaignName_op"] == "1") {
      //Equals to
      campaign_name_field = ' and TRIM(oc.campaign_name) = "' + where["campaignName"] + '"';
    } else if (where["campaignName_op"] == "2") {
      //Not Equals to
      campaign_name_field = ' and TRIM(oc.campaign_name) != "' + where["campaignName"] + '"';
    } else if (where["campaignName_op"] == "3") {
      //Start with
      campaign_name_field = ' and TRIM(oc.campaign_name) LIKE "' + where["campaignName"] + '%"';
    } else if (where["campaignName_op"] == "4") {
      //it contains
      campaign_name_field = ' and TRIM(oc.campaign_name) LIKE "%' + where["campaignName"] + '%"';
    } else if (where["campaignName_op"] == "5") {
      //it does not contains
      campaign_name_field = ' and TRIM(oc.campaign_name) NOT LIKE "%' + where["campaignName"] + '%"';
    } else if (where["campaignName_op"] == "6") {
      //it end with
      campaign_name_field = ' and TRIM(oc.campaign_name) LIKE "%' + where["campaignName"] + '"';
    }

    //Campaign Description check
    if (where["campaignDescription_op"] == "1") {
      //Equals to
      campaign_description_field = ' and TRIM(oc.campaign_description) = "' + where["campaignDescription"] + '"';
    } else if (where["campaignDescription_op"] == "2") {
      //Not Equals to
      campaign_description_field = ' and TRIM(oc.campaign_description) != "' + where["campaignDescription"] + '"';
    } else if (where["campaignDescription_op"] == "3") {
      //Start with
      campaign_description_field = ' and TRIM(oc.campaign_description) LIKE "' + where["campaignDescription"] + '%"';
    } else if (where["campaignDescription_op"] == "4") {
      //it contains
      campaign_description_field = ' and TRIM(oc.campaign_description) LIKE "%' + where["campaignDescription"] + '%"';
    } else if (where["campaignDescription_op"] == "5") {
      //it does not contains
      campaign_description_field = ' and TRIM(oc.campaign_description) NOT LIKE "%' + where["campaignDescription"] + '%"';
    } else if (where["campaignDescription_op"] == "6") {
      //it end with
      campaign_description_field = ' and TRIM(oc.campaign_description) LIKE "%' + where["campaignDescription"] + '"';
    }

    //Campaign Type check
    if (where["campaignType_op"] == "1") {
      //Equals to
      campaign_type_field = ' and TRIM(oc.campaign_type) = "' + where["campaignType"] + '"';
    } else if (where["campaignType_op"] == "2") {
      //Not Equals to
      campaign_type_field = ' and TRIM(oc.campaign_type) != "' + where["campaignType"] + '"';
    } else if (where["campaignType_op"] == "3") {
      //Start with
      campaign_type_field = ' and TRIM(oc.campaign_type) LIKE "' + where["campaignType"] + '%"';
    } else if (where["campaignType_op"] == "4") {
      //it contains
      campaign_type_field = ' and TRIM(oc.campaign_type) LIKE "%' + where["campaignType"] + '%"';
    } else if (where["campaignType_op"] == "5") {
      //it does not contains
      campaign_type_field = ' and TRIM(oc.campaign_type) NOT LIKE "%' + where["campaignType"] + '%"';
    } else if (where["campaignType_op"] == "6") {
      //it end with
      campaign_type_field = ' and TRIM(oc.campaign_type) LIKE "%' + where["campaignType"] + '"';
    }

    //Campaign Id check
    if (where["campaignId"] && where["campaignId"] > 0) {
      //Equals to
      campaign_id_field = ' and oc.id = "' + where["campaignId"] + '"';

    }

    let Query = 'SELECT oc.id, oc.campaign_name, oc.is_report_generated, oc.campaign_description, oc.campaign_type, oc.status,   DATE_FORMAT(oc.date_time, "%Y-%m-%d %H:%i:%s") AS date_time, DATE_FORMAT(oc.start_date_time, "%Y-%m-%d %H:%i:%s") AS start_date_time,    DATE_FORMAT(oc.end_date_time, "%Y-%m-%d %H:%i:%s") AS end_date_time, oc.base_count, oc.invalid_count, oc.filtered_count, oc.duplicate_count,  oc.already_assigned, oc.agent_wise_report_path, oc.answered_report_path, oc.failed_report_path, oc.pending_report_path, oc.campaign_report_path,  oc.start_stop_status, oc.failed_count, oc.success_count, oc.pending_count, oc.assigned_agents, oc.executed  FROM outgoing_campaign oc  WHERE oc.sme_id = :smeId AND oc.status != -9 AND oc.campaign_type = "Autodialer New"' +
    campaign_name_field +
    ''+
    campaign_description_field +
    ''+
    campaign_type_field +
    '' +
    campaign_id_field +
    ''+
    ' order BY date_time DESC ' +
    limit_field +
    '';
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

export async function getMergeCallsData(where: mergeCallFetchRequest, callback: any) {
  try {
    let customer_number_field = "";
    let customer_name_field = "";
    let agent_number_field = "";
    let agent_name_field = "";
    let call_direction_field = "";
    let remarks_field = "";
    let call_status_field = "";
    let duration_field = "";
    let limit_field = "";
    let initialRecord;
    let callFlow_field = "";
    let search_leads_field = "";
    
    initialRecord = where["initialRecord"] - 1;
    limit_field = "limit " + initialRecord + "," + where["batchSize"] + "";

    //calledNumber check as agent Number
    if (where["customerNumber_op"] == "1") {
      //Equals to
      customer_number_field = 'and SUBSTRING(TRIM(cdr.customer_number), -10) LIKE "%' + where["customerNumber"] + '%"';
    } 

    if (where["customerName_op"] == "1") {
      //Equals to
      customer_name_field = 'and ab.customer_name LIKE "%' + where["customerName"] + '%"';
    }

    if (where["agentNumber_op"] == "1") {
      //Equals to
      agent_number_field = 'and SUBSTRING(TRIM(cdr.agent_number), -10) = SUBSTRING(TRIM("'+where["agentNumber"]+'"), -10)';
    } 

    if (where["agentName_op"] == "1") {
      //Equals to
      agent_name_field = 'and ad.agent_name LIKE "%' + where["agentName"] + '%"';
    }

    if (where["remarks_op"] == "1") {
      //Equals to
      remarks_field = 'and cr.remarks LIKE "%' + where["remarks"] + '%"';
    }

    if (where["callDirection_op"] == "1") {
      //Equals to
      call_direction_field = 'and cdr.call_direction = "' + where["callDirection"] + '"';
    }

    //duration check
    if (where["duration_op"] == "11") {
      //Equals to
      duration_field = "and cdr.duration = " + where["duration"] + "";
    } else if (where["duration_op"] == "12") {
      //Not Equals to
      duration_field = "and cdr.duration != " + where["duration"] + "";
    } else if (where["duration_op"] == "13") {
      //Is greater than
      duration_field = "and cdr.duration > " + where["duration"] + "";
    } else if (where["duration_op"] == "14") {
      //Is less than
      duration_field = "and cdr.duration < " + where["duration"] + "";
    }

    //Call Staus for incoming Answer/Failed filter  1:failed,  0:success
    if (where["callStatus_op"] == "1") {
      //Equals to
      call_status_field = "and cdr.call_status = " + where["callStatus"] + "";
    }

    if (where["callFlow_op"] == "1") {
      //Equals to
      callFlow_field = "and cdr.call_flow_name in('" + where["callFlow"] + "')";
    }

    if (where["searchLeads_op"] == "1") {
      if(where["searchLeads_category"] == "name"){
        search_leads_field = ' and ab.customer_name LIKE "%' + where["searchLeads"] + '%" ';
      } else if(where["searchLeads_category"] == "mobile"){
        search_leads_field = ' and (TRIM(cdr.customer_number) LIKE "%' + where["searchLeads"] + '%") ';
      }
    }

    var Query =
        'SELECT ad.agent_name, ad.agent_mobile, cdr.id, cdr.sme_id, DATE_FORMAT(cdr.start_date_time, "%Y-%m-%d %H:%i:%s") AS start_date_time, DATE_FORMAT(cdr.end_date_time, "%Y-%m-%d %H:%i:%s") AS end_date_time, DATE_FORMAT(cdr.insert_date_time, "%Y-%m-%d %H:%i:%s") AS insert_date_time, cdr.duration, cdr.longcode, cdr.hlr, cdr.master_shortcode, cdr.sme_identifier, cdr.shortcode_mapping, if(cdr.call_direction_status="1","TRUE","FALSE") AS call_direction_status, cdr.call_direction, cdr.customer_number, cdr.customer_number as customerNumber, cdr.agent_number, cdr.call_recording_status,cdr.call_recorded_file, if(cdr.voicemail_recording_status="1","TRUE","FALSE") AS voicemail_recording_status, cdr.voicemail_recording_file, cdr.channel_no, cdr.server_ip_address, if(cdr.cdr_mode="1","INCOMING_IVR_CALL","I dont know") AS cdr_mode, cdr.agent_group, cdr.agent_group AS group_name, cdr.patched_agent_id, cdr.session_id, cdr.merge_status, cdr.answer, cdr.call_flow_id, cdr.call_status, cdr.disconnected_by, cdr.address_book_id, ab.customer_name, cr.remarks, cdr.connected_duration, cdr.ringing_duration, cdr.call_type, cdr.call_description, cdr.ivr_duration,cdr.customer_status, cdr.call_mode, cdr.dtmf, SUBSTRING(TRIM(cdr.customer_number), -12) as whattsappNumber, rec.merged_file, rec.duration AS recording_duration, bwl.blacklist_status, cdr.call_flow_name AS flow_name, cdr.queue_name, cdr.queue_id FROM calling_cdr cdr LEFT JOIN mpbx_call_recording rec ON rec.call_id = cdr.call_recorded_file AND rec.sme_id = cdr.sme_id LEFT JOIN address_book ab ON ab.customer_number_primary = cdr.customer_number AND ab.sme_id = cdr.sme_id LEFT JOIN customer_remarks cr ON cr.session_id = cdr.session_id AND cr.sme_id = cdr.sme_id LEFT JOIN black_white_list bwl ON bwl.customer_number = cdr.customer_number AND bwl.sme_id = cdr.sme_id AND bwl.blacklist_status != -9 LEFT JOIN agent_details ad ON cdr.patched_agent_id = ad.agent_id WHERE (cdr.start_date_time BETWEEN :startDate AND :endDate) AND cdr.sme_id = :smeId AND cdr.customer_status = 0 AND cdr.call_type != "3"' + 
        " " +
        duration_field +
        " " +
        customer_number_field +
        " " +
        customer_name_field +
        " " +
        agent_number_field +
        "  " +
        agent_name_field +
        " " +
        call_status_field +
        " " +
        remarks_field +
        " " +
        callFlow_field +
        " " +
        call_direction_field +
        " " +
        search_leads_field +
        " GROUP BY cdr.session_id order  by id desc " +
        limit_field +
        "";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], startDate: where["startDate"], endDate: where["endDate"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

/** find agent list */
export async function FindActiveAgentOnly(where: any, callback: any) {
  try {
    let Query =
      "SELECT ad.agent_id,ad.longcode_priority_flag as virtualNumberPriority, ad.sme_id, ad.agent_name, ad.agent_mobile, ad.`status`, DATE_FORMAT(ad.insert_time, '%Y-%m-%d %H:%i:%s') as insert_time, DATE_FORMAT(ad.insert_time, '%Y-%m-%d') as insert_date, DATE_FORMAT(ad.in_time, '%H:%i') AS in_time, DATE_FORMAT(ad.out_time, '%H:%i') AS out_time, ad.days_flag, ad.agent_position, ad.agent_extention, ad.agent_email, ad.sticky_agent, ad.sticky_days, ad.is_updated,ad.assign_failed_calls, ad.assign_voicemail_calls, ad.recent_call_date_time, ad.in_permission_flag, ad.out_permission_flag, ad.break_permission_flag, ad.agent_masking, ad.webrtc_flag as webrtcFlag, ad.recording_type as recordingType, agd.group_name,agd.group_id, u.username, u.password, ( SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('longcode', lc.longcode, 'id', lc.id,'status', lc.status)), ']') FROM longcodes lc INNER JOIN longcodes_agent_mapping lsm ON lsm.longcode_id = lc.id WHERE lsm.agent_id = ad.agent_id) AS longcodesjson FROM agent_details ad LEFT JOIN agent_group_mapping agm ON agm.agent_id = ad.agent_id LEFT JOIN agent_group_detail agd ON agd.group_id = agm.group_id LEFT JOIN users u ON u.username = ad.agent_email WHERE ad.sme_id = :id AND ad.`status` != -9 AND ad.`status` != 0 ORDER BY ad.agent_position ASC ";
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

export async function clearLiveCallData(reqData: any, callback: any) {
  try {
    let Query = "delete from live_calls where sme_id = :smeId and id = :id";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.DELETE,
      replacements: {
        smeId: reqData["smeId"],
        id: reqData["id"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function updateCallColumnSettings(where: any, callback: any) {
  try {
    let Query = "update sme_profile set call_settings = :callColumns where id = :id and status = 1";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        id: where["id"],
        callColumns: where["callColumns"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function getAgentLiveCallLeadData(where: any, callback: any) {
  try {
    let Query =
      "SELECT ucd.customer_number, ucd.id as uniqueId, CASE WHEN (ucd.sticky_type = 1) THEN 'Soft' WHEN (ucd.sticky_type = 2) THEN 'Hard' ELSE 'No sticky' END AS stickyType, ucd.sticky_type as stickyTypeId, ucd.other, ucd.product_price AS price, ucd.lead_status AS statusId, ucd.source_id AS sourceId, ucd.product_id AS productId, ucd.city_id AS cityId, ls.lead_status as status, lsr.source as source, cc.city_name as city, spl.product_name as product FROM unique_customer_detail ucd LEFT JOIN lead_status ls ON ls.id = ucd.lead_status AND ls.created_by =  ucd.sme_id LEFT JOIN lead_source lsr ON lsr.id = ucd.source_id AND lsr.created_by = ucd.sme_id LEFT JOIN country_cities cc ON cc.id = ucd.city_id LEFT JOIN sme_product_list spl ON spl.id = ucd.product_id AND spl.sme_id = ucd.sme_id WHERE ucd.sme_id = :smeId AND SUBSTRING(TRIM(ucd.customer_number), -10) = SUBSTRING(:customerNumber, -10) LIMIT 1 ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        smeId: where["smeId"],
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


export async function getAgentLiveCallCampaignLeadData(where: any, callback: any) {
  try {
    let Query =
      "SELECT udn.customer_number, udn.id AS uniqueId, udn.other, udn.product_price AS price, udn.lead_status AS statusId, udn.source_id AS sourceId, udn.product_id AS productId, udn.city_id AS cityId, ls.lead_status AS status, lsr.source AS source, cc.city_name AS city, spl.product_name AS product FROM upload_dialer_numbers udn LEFT JOIN lead_status ls ON ls.id = udn.lead_status AND ls.created_by = udn.sme_id LEFT JOIN lead_source lsr ON lsr.id = udn.source_id AND lsr.created_by = udn.sme_id LEFT JOIN country_cities cc ON cc.id = udn.city_id LEFT JOIN sme_product_list spl ON spl.id = udn.product_id AND spl.sme_id = udn.sme_id WHERE udn.sme_id = :smeId AND SUBSTRING(TRIM(udn.customer_number), -10) = SUBSTRING(:customerNumber, -10) LIMIT 1 ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        smeId: where["smeId"],
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

export async function copyCampaignToLeadData(where: any, callback: any) {
  try {

    let cityId = "";
    let statusId = "";
    let sourceId = "";
    let productId = "";
    let price = "";
    let other = "";
    if(where["cityId"]) {
      cityId = " ,city_id="+where["cityId"]+"";
    }
    if(where["statusId"]) {
      statusId = " ,lead_status="+where["statusId"]+"";
    }
    if(where["sourceId"]) {
      sourceId = " ,source_id="+where["sourceId"]+"";
    }
    if(where["productId"]) {
      productId = " ,product_id="+where["productId"]+"";
    }
    if(where["price"]) {
      price = " ,product_price="+where["price"]+"";
    }
    if(where["other"] != "") {
      other = " ,other='"+where["other"]+"'";
    }
    
    let Query = "update unique_customer_detail set  customer_number = :customerNumber "+cityId+" "+statusId+" "+sourceId+" "+productId+" "+price+" "+other+" where sme_id = :smeId and SUBSTRING(customer_number, -10) = SUBSTRING(:customerNumber, -10) Limit 1";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        smeId: where["smeId"],
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

export async function getQueueData(where: any, callback: any) {
  try {
    let limit_field = "";
    let initialRecord;

    if(where["batchSize"]) {
      initialRecord = where["initialRecord"] - 1;
      limit_field = "limit " + initialRecord + "," + where["batchSize"] + "";
    }

    let Query = "SELECT sq.id, sq.sme_id, sq.name, sq.description, sq.`status`, DATE_FORMAT(sq.insert_date_time, '%Y-%m-%d %H:%i:%s') as insert_date_time FROM sme_queue sq WHERE sq.sme_id = :smeId AND sq.`status` != -9  ORDER BY sq.insert_date_time DESC "+limit_field+" ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
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

export async function addQueueData(payload: any, callback: any) {
  try {
    let Query =
      "INSERT INTO sme_queue (sme_id, name, description, status, insert_date_time) values (:smeId, :name, :description, :status, :insertDateTime)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        name: payload["name"],
        description: payload["description"],
        status: payload["status"],
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

export async function updateQueueData(where: any, callback: any) {
  try {
    let Query = "update sme_queue set name = :name, description = :description, status = :status where sme_id = :smeId AND id = :queueId";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: {
        name: where["name"],
        description: where["description"],
        status: where["status"],
        smeId: where["smeId"],
        queueId: where["queueId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function addQueueMappingData(payload: any, callback: any) {
  try {
    let Query =
      "INSERT INTO sme_queue_mapping (sme_id, queue_id, agent_id, insert_date_time) values (:smeId, :queueId, :agentId, :insertDateTime)";

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.INSERT,
      replacements: {
        smeId: payload["smeId"],
        queueId: payload["queueId"],
        agentId: payload["agentId"],
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

export async function getQueueAssignedAgentsData(where: any, callback: any) {
  try {
    let Query = "SELECT sqm.sme_id, sqm.agent_id, ad.agent_name FROM sme_queue_mapping sqm LEFT JOIN agent_details ad ON ad.agent_id = sqm.agent_id WHERE sqm.sme_id = :smeId AND sqm.queue_id = :queueId ";
    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: {
        smeId: where["smeId"],
        queueId: where["queueId"],
      },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}
