import { QueryTypes } from "sequelize";
import { sequelize } from "../../config/db";
import { logger } from "../../lib/logger";


/** find */
export async function AddActivityLogs(where: any, callback: any) {
    try {
      let Query = "INSERT INTO log_history (action,user_role,module_name,message,ip,insert_date_time,sme_id,agent_id,customer_number) VALUES (:action,:userRole,:moduleName,:message,:ip,:insertDate,:smeId,:agentId,:customerNumber)";

      let executeQuery = await sequelize.query(Query, {
        raw: true,
        type: QueryTypes.INSERT,
        replacements: { smeId: where["smeId"],agentId: where["agentId"],moduleName: where["moduleName"],message: where["message"],action: where["action"],ip: where["ip"],insertDate: where["insertDate"],userRole: where["userRole"],customerNumber: where["customerNumber"] },
      });
      callback(null, executeQuery);
    } catch (error: any) {
      logger.error(error);
      callback(error, null);
      throw new Error(error);
    }
  }


  
  export async function FindActivityLogs(where: any, callback: any) {
    try {

      var agent_id_field = "";
      var agent_detials = "";
      var agentName ='';
      var module_field ='';
      let limit_field = "";
      let initialRecord;

      if(where["initialRecord"]) {
        initialRecord = where["initialRecord"] - 1;
        limit_field = "limit " + initialRecord + "," + where["batchSize"] + "";
      }

      if(where["agentId"] && where["agentId"] != "") {
        agent_detials = 'left join agent_details as ad ON ad.agent_id=lh.agent_id';
        agent_id_field = " and lh.agent_id = "+ where["agentId"];
        agentName ='ad.agent_name';
      }

      if(where["moduleName"] && where["moduleName"] != "") {
        module_field = ' and lh.module_name = "'+where["moduleName"]+'"';
      }

      let Query =
        'select lh.id, ad.agent_name, sp.name, lh.action,lh. message,lh.ip, lh.module_name, lh.user_role, DATE_FORMAT(lh.insert_date_time, "%Y-%m-%d %H:%i:%s") as insert_date_time, lh.sme_id, lh.agent_id from log_history as lh left join sme_profile as sp ON sp.id=lh.sme_id left join agent_details as ad ON ad.agent_id=lh.agent_id  where lh.sme_id =:smeId AND lh.insert_date_time > now() - INTERVAL 30 day'  + agent_id_field + ' '+ module_field +' order by insert_date_time desc '+limit_field;
      let executeQuery = await sequelize.query<any>(Query, {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: { smeId: where["smeId"], agentId: where["agentId"], module: where["module"] },
      });
      callback(null, executeQuery);
    } catch (error: any) {
      logger.error(error);
      callback(error, null);
      throw new Error(error);
    }
  }

  export async function totalActivityLogs(where: any, callback: any) {
    try {

      var agent_id_field = "";
      var agent_detials = "";
      var agentName ='';
      var module_field ='';
      if(where["agentId"] && where["agentId"] != "") {
        agent_detials = ' left join agent_details as ad ON ad.agent_id=lh.agent_id';
        agent_id_field = " and lh.agent_id = "+ where["agentId"];
        agentName =' ad.agent_name';
      }

      if(where["moduleName"] && where["moduleName"] != "") {
        module_field = ' and lh.module_name = "'+where["moduleName"]+'"';
      }

      let Query =
        'SELECT count(*) as total_records from log_history as lh left join sme_profile as sp ON sp.id=lh.sme_id left join agent_details as ad ON ad.agent_id=lh.agent_id  where lh.sme_id =:smeId'  + agent_id_field + ' '+ module_field +' order by insert_date_time desc';
      let executeQuery = await sequelize.query<any>(Query, {
        raw: true,
        type: QueryTypes.SELECT,
        replacements: { smeId: where["smeId"], agentId: where["agentId"], module: where["module"] },
      });
      callback(null, executeQuery);
    } catch (error: any) {
      logger.error(error);
      callback(error, null);
      throw new Error(error);
    }
  }


