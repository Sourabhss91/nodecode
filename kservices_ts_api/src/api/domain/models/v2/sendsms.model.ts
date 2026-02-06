import { cons } from "fp-ts/lib/ReadonlyNonEmptyArray";
import { QueryTypes } from "sequelize";
import { sequelize } from "../../../config/db";
import { logger } from "../../../lib/logger";
import { glogger } from "../../../helpers/logger";

import { sendSmsValidate } from "../../entities/ivr.sendsms";

/** find failed sms details */
export async function FindFailedSmsDetail(where: sendSmsValidate, callback: any) {
  try {

    let Query =
      "select ecs.template_name, ecs.notify_admin ,ecs.notify_agent ,ecs.notify_customer, sb.balance  from endcall_sms as ecs LEFT JOIN sms_billing as sb on sb.sme_id = ecs.sme_id  where ecs.sme_id =:smeId	and ecs.template_name ='FAILED_CALL' limit 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {

    glogger('ERR', "0", 'FindSmsDetail', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
};


/** find success sms details */
export async function FindSuccessSmsDetail(where: sendSmsValidate, callback: any) {
  try {

    let Query =
      "select ecs.template_name, ecs.notify_admin ,ecs.notify_agent ,ecs.notify_customer, sb.balance  from endcall_sms as ecs LEFT JOIN sms_billing as sb on sb.sme_id = ecs.sme_id  where ecs.sme_id =:smeId	and ecs.template_name ='SUCCESS_CALL' limit 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {

    glogger('ERR', "0", 'FindSmsDetail', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
};


export async function FindSmeSMSPack(where: any, callback: any) {
  try {

    let Query =
      "Select balance, pack_id from sme_sms_mapping where sme_id =:smeId limit 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {

    glogger('ERR', "0", 'FindSmeSMSPack', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
};


export async function FindSMSPermissionsToUsers(where: any, callback: any) {
  try {

    let Query =
      "Select customer_success_msg_id as msgId1,customer_failed_msg_id as msgId2,agent_failed_msg_id as  msgId3,agent_success_msg_id as  msgId4,admin_failed_msg_id as msgId5,admin_success_msg_id as msgId6, admin_abandoned_msg_id as msgId7 from endcall_sms where sme_id =:smeId";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {

    glogger('ERR', "0", 'FindSMSPermissionsToUsers', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
};


export async function FindSmsEndcalltemplate(where: any, callback: any) {
  try {
    let Query =
      "Select message,name,dlt_principal_id,dlt_content_id,unicode,v_from from endcall_sms_enum where id =:permissionId";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { permissionId: where["permissionId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {

    glogger('ERR', "0", 'FindSmsEndcalltemplate', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
};


export async function FindSmsEndcallEventType(where: any, callback: any) {
  try {
    let Query =
      "Select customer_success,customer_failed,agent_failed,agent_success,admin_failed,admin_success,admin_abandoned from endcall_sms where sme_id =:smeId limit 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {

    glogger('ERR', "0", 'FindSmsEndcallEventType', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
};

export async function FindAgentSmeData(where: any, callback: any) {
  try {
    let Query =
      "SELECT ad.agent_name, ad.agent_mobile , sp.name, sp.sme_mobile FROM agent_details AS ad LEFT JOIN sme_profile AS sp ON ad.sme_id= sp.id WHERE  SUBSTRING(TRIM(ad.agent_mobile), -10)=SUBSTRING(:agentNo, -10) AND ad.sme_id = :smeId limit 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], agentNo: where["agentNo"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {

    glogger('ERR', "0", 'FindAgentSmeData', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
};


export async function updateSmsBalanceSME(where: any, callback: any) {
  try {
    var Query = 'UPDATE sme_sms_mapping SET balance=:balane WHERE sme_id=:smeId limit 1';

    let executeQuery = await sequelize.query(Query, {
      raw: true,
      type: QueryTypes.UPDATE,
      replacements: { balane: where["balane"], smeId: where["smeId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function FindCustomerName(where: any, callback: any) {
  try {
    let Query =
      "SELECT customer_name, customer_number_primary FROM address_book   WHERE  SUBSTRING(TRIM(customer_number_primary), -10)=SUBSTRING(:customerNo, -10) AND sme_id = :smeId and status != -9 limit 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], customerNo: where["customerNo"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {

    glogger('ERR', "0", 'FindCustomerName', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
};

export async function FindSmeData(where: any, callback: any) {
  try {
    let Query =
      "SELECT  sp.name, sp.sme_mobile FROM  sme_profile AS sp where sp.id = :smeId limit 1";

    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"]},
    });
    callback(null, executeQuery);
  } catch (error: any) {

    glogger('ERR', "0", 'FindSmeData', "error:" + error);
    callback(error, null);
    throw new Error(error);
  }
};