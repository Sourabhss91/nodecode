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

export async function UserSignin(where: any, callback: any) {
  try {
    let Query = "SELECT U.username, UR.ROLE, UR.user_role_id FROM users U, user_roles UR WHERE UR.username=U.username AND U.username = :username AND U.password= :password AND UR.ROLE = 'Reseller' LIMIT 1";
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

export async function FindProfileDetail(where: any, callback: any) {
    try {
      let Query = "SELECT rp.reseller_name AS resellerName, rp.status, ur.ROLE AS roles, ur.username AS userName, u.user_token, u.user_key, u.user_time FROM reseller_profile rp INNER JOIN user_roles ur ON ur.username = rp.reseller_email INNER JOIN users u ON u.username = ur.username WHERE rp.reseller_email = :username LIMIT 1";

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
