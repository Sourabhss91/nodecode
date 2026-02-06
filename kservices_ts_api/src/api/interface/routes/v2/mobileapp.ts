import express, { Request, Response } from "express";
import { verifyTokenSME, validateRequest } from "../../../middlewares";
import { getRemarks, setRemarks, getListRemarks, setNotificationToken } from "../../controllers/app/v2/mobileapp/remarksController";
import { appVersion } from "../../controllers/app/v2/mobileapp/versionController";
import { getlist, getCallBase, setCallSchedule, getOutgoingCampaign, getFollowUpCalls, endcallReasonList,updateEndCallReason, changeScheduleStatus } from "../../controllers/app/v2/mobileapp/callDetailsController";
import { agentInsight, getCdrMisscall, getTypeDetail,getAgentList } from "../../controllers/app/mobileapp/agentController";
import { getVoiceMail } from "../../controllers/app/v2/mobileapp/voiceMailController";
import { deleteAddressbook, setCustomerName, getAddressbookList, getAddressbook, updateCustomerName, getAddressbookListNew } from "../../controllers/app/v2/mobileapp/addressBookController";
import { userBreakIn, userBreakOut, userBreakList } from "../../controllers/app/v2/mobileapp/userBreakController";
import { clickToCall } from "../../controllers/app/v2/mobileapp/clickToCallController";
import { getCities } from "../../controllers/app/v2/mobileapp/getCitiesController";
import { getProducts } from "../../controllers/app/v2/mobileapp/getProductsController";
import {  getLeadStatus,getLeadSource,getLeadSettings,addManualLead,getUniqueCalls,getLeadCustomerDetails,getLeadDetailProduct,getLeadDetailNotes,getScheduledCalls,getLeadDetailCalls,getAddressbookDetail,setAddressbookDetail,updateUniqueCalls,masterApiSourceCityProductStatus,addCustomerNote,setFollowUpCall,masterApiupdateUniqueCallsAddress } from "../../controllers/app/v2/mobileapp/leadSettingsController";

import {   } from "../../controllers/app/v2/sme/uniqueCallsController";

import {
  getRemarksRequestValidate,
  setRemarksRequestValidate,
  getListRemarksRequestValidate,
  appVersionRequestValidate,
  getlistRequestValidate,
  agentInsightRequestValidate,
  getVoiceMailRequestValidate,
  getCdrMisscallRequestValidate,
  getTypeDetailRequestValidate,
  deleteaddrbookRequestValidate,
  setCustomerNameRequestValidate,
  getCallBasetValidate,
  setCallscheduletValidate,
  gtaddrbookRequestValidate,
  getAddressbookValidate,
  updateCustomerNameRequestValidate,
  setNotificationTokenRequestValidate,
  getCampaignRequestValidate,
  getFollowUpCallsValidate,
  updateEndCallReasonValidate,
  getCitiesRequestValidate,
  getProductsRequestValidate,
  getAgentListRequestValidate,
  getLeadStatusRequestValidate,
  getLeadSourceRequestValidate,
  getLeadSettingsRequestValidate,
  getUniqueCallsRequestValidate,
  addManualLeadValidate,
  getLeadCustomerDetailsValidate,
  getScheduledCallsValidate,
  getSettingRequestValidate,
  uniqueCallsRequestValidate,
  masterApiupdateUniqueCallsAddressRequestValidate,
  addCustomerNoteRequestValidate,
  setFollowUpCallRequestValidate,
  changeScheduleStatusValidate
} from "../../../domain/validator/mobileapp.validator";

const route = express.Router();

/** SME router function */
export const Mobileapp = (router: express.Router): void => {
  /** get remarks api for APP*/
  router.post("/mobileapp/:id/getRemarks", verifyTokenSME, validateRequest(getRemarksRequestValidate), getRemarks);

  /** set remarks */
  router.post("/mobileapp/:id/setRemarks", verifyTokenSME, validateRequest(setRemarksRequestValidate), setRemarks);

  /**  get getListRemarks */
  router.post("/mobileapp/:id/getListRemarks", verifyTokenSME, validateRequest(getListRemarksRequestValidate), getListRemarks);

  /** get app version */
  router.post("/mobileapp/:id/appVersion", validateRequest(appVersionRequestValidate), appVersion);

  /** get call details list */
  router.post("/mobileapp/:id/cdr/:type/list", validateRequest(getlistRequestValidate), getlist);

  router.post("/mobileapp/:id/break/in", verifyTokenSME, userBreakIn);

  router.post("/mobileapp/:id/break/out", verifyTokenSME, userBreakOut);

  router.post("/mobileapp/:id/break/list", verifyTokenSME, userBreakList);

  /**  sme agent insight  */
  router.post("/mobileapp/user/:id/insight", verifyTokenSME, validateRequest(agentInsightRequestValidate), agentInsight);

  /** get lead  settings */
  router.post("/mobileapp/user/:id/voicemail/list", verifyTokenSME, validateRequest(getVoiceMailRequestValidate), getVoiceMail);

  /** get missed call */
  router.post("/mobileapp/user/:id/cdr/misscall", validateRequest(getCdrMisscallRequestValidate), getCdrMisscall);

  /** get typedetails  */
  router.get("/mobileapp/user/:id/typedetail",  validateRequest(getTypeDetailRequestValidate), getTypeDetail);
  /** get typedetails  */
  router.post("/mobileapp/user/:id/addressbook/delete", verifyTokenSME, validateRequest(deleteaddrbookRequestValidate), deleteAddressbook);

  /** get clickToCall api*/
  router.post("/mobileapp/user/clickToCall", verifyTokenSME, clickToCall);

  router.post("/mobileapp/user/:id/setCustomerName", verifyTokenSME, validateRequest(setCustomerNameRequestValidate), setCustomerName);

  router.post("/mobileapp/user/:id/updateCustomerName", verifyTokenSME, validateRequest(updateCustomerNameRequestValidate), updateCustomerName);

  router.post("/mobileapp/user/:id/call/base", verifyTokenSME, validateRequest(getCallBasetValidate), getCallBase);

  router.post("/mobileapp/user/:id/call/schedule", validateRequest(setCallscheduletValidate), setCallSchedule);

  router.post("/mobileapp/user/:id/addressbook/list", verifyTokenSME, validateRequest(gtaddrbookRequestValidate), getAddressbookList);

  router.get("/mobileapp/user/:id/address/book/:addressBookId/", verifyTokenSME, validateRequest(getAddressbookValidate), getAddressbook);

  router.post("/mobileapp/:id/setNotificationToken", validateRequest(setNotificationTokenRequestValidate), setNotificationToken);

  router.post("/mobileapp/:id/getOutgoingCampaign/",verifyTokenSME,  validateRequest(getCampaignRequestValidate), getOutgoingCampaign);

  router.post("/mobileapp/:id/getFollowUpCalls/", validateRequest(getFollowUpCallsValidate), getFollowUpCalls);

  router.get("/mobileapp/endcallReasonList/", endcallReasonList);

  router.post("/mobileapp/:id/updateEndCallReason/", verifyTokenSME, validateRequest(updateEndCallReasonValidate), updateEndCallReason);

  router.post("/mobileapp/user/:id/addressbook/listnew", verifyTokenSME, validateRequest(gtaddrbookRequestValidate), getAddressbookListNew);

  /* start lead module api */
    router.get("/mobileapp/:id/getCities", verifyTokenSME, validateRequest(getCitiesRequestValidate), getCities);

    router.get("/mobileapp/:id/getProducts", verifyTokenSME, validateRequest(getProductsRequestValidate), getProducts);

    /** get agent list*/
     router.get("/mobileapp/:id/getAgentList", verifyTokenSME, validateRequest(getAgentListRequestValidate), getAgentList);

    router.post("/mobileapp/:id/getLeadStatus", verifyTokenSME, validateRequest(getLeadStatusRequestValidate), getLeadStatus);

    router.post("/mobileapp/:id/getLeadSource", verifyTokenSME, validateRequest(getLeadSourceRequestValidate), getLeadSource);

     /** get lead  settings */
    router.get("/mobileapp/:id/getLeadSettings", validateRequest(getLeadSettingsRequestValidate), getLeadSettings);

    /** get UniqueCalls  */
    router.post("/mobileapp/:id/getUniqueCalls",verifyTokenSME, verifyTokenSME, validateRequest(getUniqueCallsRequestValidate), getUniqueCalls);

    /** add manual lead   */
    router.post("/mobileapp/:id/addManualLead", verifyTokenSME, validateRequest(addManualLeadValidate), addManualLead);

    /**  Get Lead Crm Customer Details   */
    router.post("/mobileapp/:id/getLeadCustomerDetails", verifyTokenSME, validateRequest(getLeadCustomerDetailsValidate), getLeadCustomerDetails);

      /**  Get Lead Crm product Details   */
    router.post("/mobileapp/:id/getLeadDetailProduct", verifyTokenSME, validateRequest(getLeadCustomerDetailsValidate), getLeadDetailProduct);

    router.post("/mobileapp/:id/getLeadDetailNotes", verifyTokenSME, validateRequest(getLeadCustomerDetailsValidate), getLeadDetailNotes);

    router.post("/mobileapp/:id/getScheduledCalls/", verifyTokenSME, validateRequest(getScheduledCallsValidate), getScheduledCalls);

    router.post("/mobileapp/:id/getLeadDetailCalls", verifyTokenSME, validateRequest(getLeadCustomerDetailsValidate), getLeadDetailCalls);

     /** Get Address Book Details */
    router.post("/mobileapp/:id/getAddressbookDetail", verifyTokenSME, validateRequest(getSettingRequestValidate), getAddressbookDetail);

     /** Set Address Book Details */
    router.post("/mobileapp/:id/setAddressbookDetail", verifyTokenSME, validateRequest(getSettingRequestValidate), setAddressbookDetail);

    /**  update  Unique Calls */
    router.post("/mobileapp/:id/updateUniqueCalls", verifyTokenSME, validateRequest(uniqueCallsRequestValidate), updateUniqueCalls);

    router.post("/mobileapp/:id/masterApiSourceCityProductStatus",  validateRequest(getLeadStatusRequestValidate), masterApiSourceCityProductStatus);

    router.post("/mobileapp/:id/addCustomerNote", verifyTokenSME, validateRequest(addCustomerNoteRequestValidate), addCustomerNote);

    router.post("/mobileapp/:id/setFollowUpCall", verifyTokenSME, validateRequest(setFollowUpCallRequestValidate), setFollowUpCall);


     /**  Master api for update  Unique Calls with lead status and lead contact detsila */
     router.post("/mobileapp/:id/masterApiupdateUniqueCallsAddress", validateRequest(masterApiupdateUniqueCallsAddressRequestValidate), masterApiupdateUniqueCallsAddress);

  /* end lead module api */

  router.post("/mobileapp/:id/changeScheduleStatus", verifyTokenSME, validateRequest(changeScheduleStatusValidate), changeScheduleStatus);
};