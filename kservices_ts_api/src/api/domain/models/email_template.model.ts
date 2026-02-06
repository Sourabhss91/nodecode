import { QueryTypes } from "sequelize";
import { sequelize } from "../../config/db";
import { logger } from "../../lib/logger";
import { emailRequest } from "../entities/sme.entity";

/**  find */
export async function getEmailTemplate(where: emailRequest, callback: any) {
  try {

    var Query = "select type, title, content, status from email_templates where type= :type AND status=1 LIMIT 1";
    let executeQuery = await sequelize.query<any>(Query, {
      raw: true,
      type: QueryTypes.SELECT,
      replacements: { type: where["type"] },
    });
    callback(null, executeQuery);
  } catch (error: any) {
    logger.error(error);
    callback(error, null);
    throw new Error(error);
  }
}
