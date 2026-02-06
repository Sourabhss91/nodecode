import { QueryTypes } from "sequelize";
import { sequelize } from "../../../config/db";
import { logger } from "../../../lib/logger";

import { countryFetchRequest } from "../../entities/common.entity";

/** find */
export async function FindGenralCities(where: countryFetchRequest, callback: any) {
  try {
    let Query = "SELECT id, country_name, city_name, status from country_cities where country_name  =:country ORDER BY city_name ASC";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { country: where["country"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}


export async function findAgentGroup(where: any, callback: any) {
  try {
    let Query = "SELECT agm.group_id, ad.sme_id from agent_group_mapping as agm left join agent_details as ad ON ad.agent_id= agm.agent_id where agm.agent_id  =:agentId limit 1 ";
    let executeQuery = await sequelize.query<any>(Query, {
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

export async function findAgentFlowId(where: any, callback: any) {
  try {
    let Query = "SELECT flow_id from mpbx_category_master where sme_id =:smeId and  cat_desc= :groupId ";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], groupId: where["groupId"] },
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
    let Query = "SELECT lg.longcode,lg.site_identifier, lg.id,ad.sme_id from longcodes_agent_mapping as lgm left join longcodes as lg ON lg.id= lgm.longcode_id left join agent_details as ad ON ad.agent_id = lgm.agent_id  where lgm.agent_id= :agentId  and lg.status = 1";
    let executeQuery = await sequelize.query<any>(Query, {
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

export async function findVirtualNumberByFlowId(where: any, payload: any, callback: any) {
  try {
    let Query = "SELECT lg.longcode,lg.id, lg.site_identifier from longcodes_sme_mapping as lsm left join longcodes as lg ON lg.id= lsm.longcode_id  where lsm.sme_id= :smeId and lsm.call_flow_id = :flowId and lg.status = 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { agentId: where["agentId"], smeId: where["smeId"], flowId: payload["flowId"] },
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
    let Query = "SELECT  lg.longcode, lg.id, lg.site_identifier FROM longcodes_sme_mapping AS lgm LEFT JOIN longcodes AS lg ON lg.id =lgm.longcode_id WHERE lgm.sme_id = :smeId and lg.status = 1";
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


export async function checkLongcodeSiteStatus(where: any, callback: any) {
  try {
    let Query = "Select status,id from kommuno_sites where id =:siteId limit 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { siteId: where["siteId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}

export async function FindAgentSecondaryMapLongcode(where: any, callback: any) {
  try {
    let Query = "Select secondary_longcode_id,secondary_longcode from longcode_mapping where primary_longcode_id =:longcodeId  and sme_id =:smeId limit 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { smeId: where["smeId"], longcodeId: where["longcodeId"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}



