import express, { Request, Response } from "express";
import { verifyTokenSME, validateRequest } from "../../../middlewares";
import { getSetting, updateSetting, downloadFile, checkSmeAutodialerPermission, generateReport, getDownloadReport, getWebrtcNumber, getTrainingVideos, getFaq } from "../../controllers/app/sme/getSettingController";
import { setCities } from "../../controllers/app/sme/setCitiesController";
import { setProducts } from "../../controllers/app/sme/setProductsController";
import { setCustomerName, getCustomerName } from "../../controllers/app/sme/setCustomerNameController";
import { authSignin, generateToken, generateAccessKey } from "../../controllers/app/sme/authSigninController";
import { forgotPassword, resetPassword, verifyOtpForgotPassword, forgotChangePassword } from "../../controllers/app/sme/forgotPasswordController";
import { getRemarks, setRemarks, getListRemarks } from "../../controllers/app/sme/getRemarksController";
import { getCities } from "../../controllers/app/sme/getCitiesController";
import { getProducts } from "../../controllers/app/sme/getProductsController";
import { getAllPrompt } from "../../controllers/app/sme/getPromtsController";
import { updateUniqueCalls, getUniqueCalls, getCallsPerformance, addManualLead, deleteUniqueDetail, demoRequest, leadTransfer, uploadLeadData, bulkLeadTransfer, updateLeadStatusOnLiveCall, viewFrequency, copyCampaignToLead } from "../../controllers/app/sme/uniqueCallsController";
import { checkAppDetail } from "../../controllers/app/sme/getAppVersionController";
import { getlist, setFollowUpCall, getMergeCalls, clearLiveCall, setCallColumnSettings, getAgentLiveCallLead, getAgentLiveCallCampaignLead } from "../../controllers/app/sme/callDetailsController";
import {
  getAgentStatus,
  getAgentList,
  getActiveAgentList,
  agentInsight,
  canCreateAgent,
  addAgent,
  updateAgent,
  deleteAgent,
  getInsightsAgentStatus,
  setAgentsOrder,
  getAgentsInsightDayWise,
  updateAgentStatus,
  agentActInactTime,
  getSingleAgent,
  addWebrtcAgent,
  updateWebrtcAgentStatus,
  isWebrtcAgentRegister,
  getAbandonedCalls,
  isAgentEmailExist,
  isAgentMobileExist
} from "../../controllers/app/sme/agentController";
import { getSmeRecordings } from "../../controllers/app/sme/recordingController";
import { getTypeDetail } from "../../controllers/app/sme/userController";
import { getComplaintList, setComplaint } from "../../controllers/app/sme/complaintController";
import { getGroupdetail } from "../../controllers/app/sme/groupDetailsController";
import { getAgentDetail, agentReportdetail, agentReportData, getOutCallsReport, transferLiveCall } from "../../controllers/app/sme/agentDetailsController";
import { getLeadSettings, setLeadSettings, getLeadCustomerDetails, getLeadSource, addLeadSource, deleteLeadSource, editLeadSource, getLeadDetailProduct, getLeadDetailNotes, getLeadDetailRemarks, getLeadDetailCalls, getTotalLeadStatusSummary, getTotalLeadSourceSummary, getTotalLeadProductSummary, getTotalLeadTypeSummary, getTotalLeadFollowupSummary, getLeadStatus, addLeadStatus, deleteLeadStatus, editLeadStatus, getTotalLeadCitySummary, isdeletedAgentLeadExist} from "../../controllers/app/sme/leadSettingsController";
import { getVoiceMail } from "../../controllers/app/sme/voiceMailController";
import { getSmeLongcodes, getAgentLongcodes } from "../../controllers/app/sme/longcodesController";
import { setNotificationToken, revokeNotificationToken, getNotifications, markAllAsReadNotification } from "../../controllers/app/sme/notificationController";
import { getivrflow, createivrflow, deleteIvrCallFlow, getIvrByUniqueFlowId, getIvrFlowCount, updateivrflow, getIvrFlowlongcodeId, getQueue, updateQueue, addQueue, getQueueAssignedAgents } from "../../controllers/app/sme/ivrFlowController";
import { uploadBaseList, changeScheduleStatus } from "../../controllers/app/sme/callScheduleController";
import { uploadSoundFile } from "../../controllers/app/sme/uploadSoundFileController";
import { systemDetail, getSystemDetailGraphData } from "../../controllers/app/sme/systemDetailController";
import {
  getSmsTemplate,
  setSmsTemplate,
  getSmsCampaign,
  setSmsCampaign,
  getSmsHeader,
  setSmsHeader,
  updateSmsHeader,
  updateSmsTemplate,
  deleteSMSTemplate,
  deleteHeader,
  getHeaderList,
  updateCampaign,
  getTemplateList,
  uploadCampaign,
  uploadCampaignSheet,
  uploadCampaignSheetAll,
  deleteSmsCampaign,
  uploadCampaignNumbers,
  getAllSmsPackages,
  getSmeSmsPackage,
  getSmsEndCallEnum,
  setSmeSmsNotifyPermission,
 getEndcallSmsPermission,
 getSmsPaymentHistory,
 setCommSmsSettings,
 sendCommSms,
 getCommSmsSettings
} from "../../controllers/app/sme/smsController";
import { getCampaignMediaFile, uploadCampaignMediaFile, setCampaignMediaFile, uploadScheduleCampaign, addCampaign, getOutgoingCampaign, getScheduledCalls, addCampaignBase, updateOutgoingCampaign, getOutgoingCampaigAgentWise, getAgentCampaign, addAutodialerCampaignBase, getPastScheduledCalls, getTodayScheduledCalls, getUpcomingScheduledCalls, uploadLead, getCampaignAssignedAgents, saveNonWorkingFlow, saveNonWorkingDays, getNonWorkingFlow, getNonWorkingMappingFlow, getNonWorkingDays, uploadNonWorkingFile, getUploadedFileColumnsData, addInformativeObdCampaignBase, addAutodialerCampaignBaseNew,  getOutgoingCampaignBeta, getCampaignBetaAssignedAgents} from "../../controllers/app/sme/campaignMediaController";

import { getBlacklistNumbers, setBlackWhiteListNumbers } from "../../controllers/app/sme/blocklistController";
import { getAddressbookDetail, setAddressbookDetail, addNewCustomer, addCustomerNote } from "../../controllers/app/sme/contactsController";
import { setLongcodes, getEndCallReasonsList, updateEndCallReason } from "../../controllers/app/sme/longcodeController";
import { getSmeProductPackage,getsmePackagePaymentHistory } from "../../controllers/app/sme/planDetailsController";
import { setThirdPartyLeadSettings,getThirdPartyLeadSettings,getAllThirdPartyLeadSettings,checkFacebookAccessToken,getFacebookAdsCampaign,getFacebookAdsetData,getFacebookAdsData,setFacebookLeadSettings,getFacebookLeadSettings,getfacebookCampaignSettings,setFacebookCampaignData,getfacebookCampaignAssignedAgentId,getfacebookCampaignadsdata,updatefaceBookCampaignStatus,deleteFacebookCampaigndata } from "../../controllers/app/sme/thirdPartyLeadController";

import { setAgentFree } from "../../controllers/app/ivr/agentController";

import {
  signinRequestValidate,
  getSettingRequestValidate,
  updateSettingRequestValidate,
  getRemarksRequestValidate,
  setRemarksRequestValidate,
  getListRemarksRequestValidate,
  getCitiesRequestValidate,
  getProductsRequestValidate,
  uniqueCallsRequestValidate,
  checkAppDetailRequestValidate,
  getAgentStatusRequestValidate,
  getSmeRecordingsRequestValidate,
  getlistRequestValidate,
  getUniqueCallsRequestValidate,
  typeDetaillRequestValidate,
  getsmecomplaintsRequestValidate,
  setComplaintListRequestValidate,
  getGroupdetailRequestValidate,
  getAgentdetailRequestValidate,
  getLeadSettingsRequestValidate,
  getVoiceMailRequestValidate,
  getSmeLongcodesRequestValidate,
  setNotificationTokenRequestValidate,
  getAgentListRequestValidate,
  getivrflowRequestValidate,
  createivrflowRequestValidate,
  baseListRequestValidate,
  agentInsightRequestValidate,
  agentReportdetailRequestValidate,
  canCreateAgentRequestValidate,
  addAgentRequestValidate,
  systemDetailRequestValidate,
  forgotPasswordRequestValidate,
  setCustomerNameRequestValidate,
  revokeNotificationTokenRequestValidate,
  updateAgentRequestValidate,
  deleteAgentRequestValidate,
  resetPasswordRequestValidate,
  getInsightsAgentStatusRequestValidate,
  generateTokenRequestValidate,
  getNotificationRequestValidate,
  markAllAsReadRequestValidate,
  getSmsTemplateRequestValidate,
  setSmsTemplateRequestValidate,
  getSmsCampaignRequestValidate,
  setSmsCampaignRequestValidate,
  uploadCampaignRequestValidate,
  setBlackWhiteListRequestValidate,
  longcodeSpamRequestValidate,
  setAgentsOrderRequestValidate,
  agentReportDataRequestValidate,
  verifyOtpForgotRequestValidate,
  forgotChangePasswordRequestValidate,
  getLeadCustomerDetailsValidate,
  getCallsPerformanceRequestValidate,
  getSmsHeaderRequestValidate,
  setSmsHeaderRequestValidate,
  updateSmsHeaderRequestValidate,
  updateSmsTemplateRequestValidate,
  deleteTemplateRequestValidate,
  deleteHeaderRequestValidate,
  getHeaderlistRequestValidate,
  getTemplateListRequestValidate,
  deleteSmsCampaignListRequestValidate,
  updateCampaignRequestValidate,
  generateAccessKeyRequestValidate,
  uploadCampaignMediaFileRequestValidate,
  uploadCampaignScheduleRequestValidate,
  addCampaignRequestValidate,
  getScheduledCallsValidate,
  addNewCustomerValidate,
  addManualLeadValidate,
  updateAgentStatusValidate,
  agentActInactTimeValidate,
  getLeadSourceRequestValidate,
  addLeadSourceRequestValidate,
  deleteLeadSourceRequestValidate,
  editLeadSourceRequestValidate,
  deleteUniqueDetailRequestValidate,
  getCampaignDataAfterCallsValidate,
  demoRequestValidate,
  downloadFileRequestValidate,
  getAgentCampaignValidate,
  addAutodialerCampaignBaseValidate,
  SmeProductPackageRequestValidate,
  addCustomerNoteRequestValidate,
  setFollowUpCallRequestValidate,
  getEndCallReasonsListRequestValidate,
  updateEndCallReasonValidate,
  getAllSmsPackagesValidate,
  getSmeSmsPackageValidate,
  getSmsEndCallEnumValidate,
  setSmeSmsNotifyPermissionValidate,
  getTotalLeadsSummaryValidate,
  getLeadStatusRequestValidate,
  addLeadStatusRequestValidate,
  deleteLeadStatusRequestValidate,
  editLeadStatusRequestValidate,
  EndcallSmsPermissionValidate,
  getSmsPaymentHistoryValidate,
  uploadLeadRequestValidate,
  leadTransferDataRequestValidate,
  uploadLeadDataRequestValidate,
  getSingleAgentRequestValidate,
  bulkLeadTransferDataRequestValidate,
  setThirdPartyLeadSettingsValidate,
  getThirdPartyLeadSettingsValidate,
  getAllThirdPartyLeadSettingsValidate,
  updateLeadStatusOnLiveCallValidate,
  changeScheduleStatusValidate,
  getsmePackagePaymentHistoryValidate,
  getCampaignAssignedAgentsValidate,
  generateReportValidate,
  getDownloadReportValidate,
  setCommSmsSettingsRequestValidate,
  sendCommSmsRequestValidate,
  getCommSmsSettingsRequestValidate,
  viewFrequencyRequestValidate,
  getWebrtcNumberRequestValidate,
  saveNonWorkingFlowRequestValidate,
  saveNonWorkingDaysRequestValidate,
  isdeletedAgentLeadExistRequestValidate,
  getNonWorkingFlowRequestValidate,
  getNonWorkingMappingFlowRequestValidate,
  updateWebrtcAgentStatusRequestValidate,
  isWebrtcAgentRegisterRequestValidate,
  checkFacebookAccessTokenValidate,
  getFacebookAdsCampaignValidate,
  getFacebookAdsetDataValidate,
  getFacebookAdsDataValidate,
  getAbandonedCallsRequestValidate,
  getTrainingVideosRequestValidate,
  getFaqRequestValidate,
  setFacebookLeadSettingsValidate,
  getAgentLongcodesValidate,
  getCustomerNameValidate,
  getAllPromptValidate,
  isAgentEmailExistValidate,
  isAgentMobileExistValidate,
  getMergeCallsValidate,
  clearLiveCallRequestValidate,
  transferLiveCallRequestValidate,
  getAgentLiveCallLeadRequestValidate,
  copyCampaignToLeadRequestValidate,
  getQueueRequestValidate,
  updateQueueRequestValidate,
  addQueueRequestValidate,
} from "../../../domain/validator/sme.validator";

import {  setAgentFreeValidate } from "../../../domain/validator/ivr.validator";

const route = express.Router();

/** SME router function */
export const SMERoute = (router: express.Router): void => {
  /** signin */
  router.post("/oauth/signin", validateRequest(signinRequestValidate), authSignin);

  router.post("/oauth/generateToken", validateRequest(generateTokenRequestValidate), generateToken);

  router.post("/oauth/generateAccessKey", validateRequest(generateAccessKeyRequestValidate), generateAccessKey);

  /** signin */
  router.post("/component/:id/forget/password", validateRequest(forgotPasswordRequestValidate), forgotPassword);

  router.post("/component/:id/forget/otp/verify", validateRequest(verifyOtpForgotRequestValidate), verifyOtpForgotPassword);

  router.post("/component/:id/forget/change/password", validateRequest(forgotChangePasswordRequestValidate), forgotChangePassword);

  router.post("/component/:id/reset/password", validateRequest(resetPasswordRequestValidate), resetPassword);
  /** get settings */
  router.get("/sme/:id/fetchSetting", verifyTokenSME, validateRequest(getSettingRequestValidate), getSetting);

  /** update settings */
  router.post("/sme/:id/updateSetting", validateRequest(updateSettingRequestValidate), updateSetting);

  /** update settings */
  router.post("/sme/downloadFile", verifyTokenSME, validateRequest(downloadFileRequestValidate), downloadFile);

  /** set cities */
  router.post("/sme/:id/setCities", verifyTokenSME, setCities);

  /** get remarks api for APP*/
  router.post("/sme/:id/getRemarks", verifyTokenSME, validateRequest(getRemarksRequestValidate), getRemarks);

  /** set remarks */
  router.post("/sme/:id/setRemarks", verifyTokenSME, validateRequest(setRemarksRequestValidate), setRemarks);

  /**  get getListRemarks */
  router.post("/sme/:id/getListRemarks", verifyTokenSME, validateRequest(getListRemarksRequestValidate), getListRemarks);

  /**  get Cities */
  router.get("/sme/:id/getCities", verifyTokenSME, validateRequest(getCitiesRequestValidate), getCities);

  /**  get Cities */
  router.get("/sme/:id/getProducts", verifyTokenSME, validateRequest(getProductsRequestValidate), getProducts);

  /**  update  Unique Calls */
  router.post("/sme/:id/updateUniqueCalls", verifyTokenSME, validateRequest(uniqueCallsRequestValidate), updateUniqueCalls);

  /**  Check App Version */
  router.get("/sme/:id/app/checkAppDetail", validateRequest(checkAppDetailRequestValidate), checkAppDetail);

  /** Set Products */
  router.post("/sme/:id/setProducts", verifyTokenSME, setProducts);

  /** Set Customer Name */
  router.post("/sme/:id/setCustomerName", verifyTokenSME, validateRequest(setCustomerNameRequestValidate), setCustomerName);

  /** get agent status  */
  router.post("/sme/:id/getAgentStatus", verifyTokenSME, validateRequest(getAgentStatusRequestValidate), getAgentStatus);

  /** get downloadRecordings  */
  router.post("/sme/:id/downloadRecordings", verifyTokenSME, validateRequest(getSmeRecordingsRequestValidate), getSmeRecordings);

  /** get calls list  */
  router.post("/sme/:id/cdr/:type/list", validateRequest(getlistRequestValidate), getlist);

  /** get UniqueCalls  */
  router.post("/sme/:id/getUniqueCalls", verifyTokenSME, validateRequest(getUniqueCallsRequestValidate), getUniqueCalls);

  /** get profile detail  */
  router.post("/user/:id/typedetail", verifyTokenSME, validateRequest(typeDetaillRequestValidate), getTypeDetail);

  /** get complaint  */
  router.get("/sme/:id/getComplaint", verifyTokenSME, validateRequest(getsmecomplaintsRequestValidate), getComplaintList);

  /** set complaint  */
  router.post("/sme/:id/setComplaint", verifyTokenSME, validateRequest(setComplaintListRequestValidate), setComplaint);

  /** get group details  */
  router.post("/sme/:status/groupdetail", verifyTokenSME, validateRequest(getGroupdetailRequestValidate), getGroupdetail);

  /** get agent  details */
  router.get("/sme/:id/dashboard/agentdetail", verifyTokenSME, validateRequest(getAgentdetailRequestValidate), getAgentDetail);

  /** get lead  settings */
  router.get("/sme/:id/getLeadSettings", verifyTokenSME, validateRequest(getLeadSettingsRequestValidate), getLeadSettings);

  /** get lead  settings */
  router.post("/sme/:id/setLeadSettings", verifyTokenSME, validateRequest(getLeadSettingsRequestValidate), setLeadSettings);

  /** get ivrflow  */
  router.post("/sme/:id/getivrflow", verifyTokenSME, validateRequest(getivrflowRequestValidate), getivrflow);

  /** create  ivrflow  */
  router.post("/sme/:id/createivrflow", verifyTokenSME, validateRequest(createivrflowRequestValidate), createivrflow);

  /** create  ivrflow  */
  router.post("/sme/:id/upload/base/list/:countryCode", verifyTokenSME, validateRequest(baseListRequestValidate), uploadBaseList);

  /** upload file  */
  router.post("/sme/:id/uploadSoundFile", uploadSoundFile);

  /** get lead  settings */
  router.post("/sme/:id/getVoiceMail", verifyTokenSME, validateRequest(getVoiceMailRequestValidate), getVoiceMail);

  /** get sme longcodes */
  router.post("/sme/:id/getSmeLongcodes", verifyTokenSME, validateRequest(getSmeLongcodesRequestValidate), getSmeLongcodes);

  /** set notification token */
  router.post("/sme/:id/setNotificationToken", validateRequest(setNotificationTokenRequestValidate), setNotificationToken);

  /** get agent list*/
  router.get("/sme/:id/getAgentList", verifyTokenSME, validateRequest(getAgentListRequestValidate), getAgentList);

  /**  sme agent insight  */
  router.post("/sme/:id/insight", verifyTokenSME, validateRequest(agentInsightRequestValidate), agentInsight);

  /**  sme system detail  */
  router.post("/sme/:id/dashboard/systemdetail", verifyTokenSME, validateRequest(systemDetailRequestValidate), systemDetail);

  /**  Agent reportdetail  */
  router.post("/sme/:id/agent/reportdetail", verifyTokenSME, validateRequest(agentReportdetailRequestValidate), agentReportdetail);

  /** Check agent mobile is exist or not while creating new agent */
  router.post("/sme/:id/agent/cancreate", verifyTokenSME, validateRequest(canCreateAgentRequestValidate), canCreateAgent);

  /** Add new agent */
  router.post("/sme/:id/agent/add", verifyTokenSME, validateRequest(addAgentRequestValidate), addAgent);

  /** Revoke Notification Token */
  router.post("/sme/:id/revokeNotificationToken", validateRequest(revokeNotificationTokenRequestValidate), revokeNotificationToken);

  /** update agent */
  router.post("/sme/:id/agent/update/:agentId", verifyTokenSME, validateRequest(updateAgentRequestValidate), updateAgent);

  /** update agent */
  router.post("/sme/:id/agent/delete/:agentId", verifyTokenSME, validateRequest(deleteAgentRequestValidate), deleteAgent);

  /** get insights agent status */
  router.get("/sme/:id/getInsightsAgentStatus", verifyTokenSME, validateRequest(getInsightsAgentStatusRequestValidate), getInsightsAgentStatus);

  /** get insights agent status */
  router.post("/sme/:id/getSystemDetailGraphData", verifyTokenSME, validateRequest(systemDetailRequestValidate), getSystemDetailGraphData);

  /** get inotifications */
  router.post("/sme/:id/getNotifications", verifyTokenSME, validateRequest(getNotificationRequestValidate), getNotifications);

  /** Notifications mark all as read */
  router.post("/sme/:id/markAllAsReadNotification", verifyTokenSME, validateRequest(markAllAsReadRequestValidate), markAllAsReadNotification);

  router.post("/sme/:id/getSmsCampaign", validateRequest(getSmsCampaignRequestValidate), getSmsCampaign);

  router.post("/sme/:id/setSmsCampaign", validateRequest(setSmsCampaignRequestValidate), setSmsCampaign);

  router.post("/sme/:id/uploadCampaign/:campaignId", validateRequest(uploadCampaignRequestValidate), uploadCampaign);

  router.post("/sme/:id/uploadCampaignSheet/:campaignId", validateRequest(uploadCampaignRequestValidate), uploadCampaignSheet);

  router.post("/sme/:id/uploadCampaignSheetAll/:campaignId", validateRequest(uploadCampaignRequestValidate), uploadCampaignSheetAll);

  router.post("/sme/:id/updateCampaign", validateRequest(updateCampaignRequestValidate), updateCampaign);

  /** Get Blacklist Numbers */
  router.get("/sme/:id/getBlacklistNumbers", verifyTokenSME, validateRequest(getSettingRequestValidate), getBlacklistNumbers);

  /** Set Blacklist / Whitelist Numbers */
  router.post("/sme/:id/setBlackWhiteListNumbers", verifyTokenSME, validateRequest(setBlackWhiteListRequestValidate), setBlackWhiteListNumbers);

  /** Get Address Book Details */
  router.post("/sme/:id/getAddressbookDetail", verifyTokenSME, validateRequest(getSettingRequestValidate), getAddressbookDetail);

  /** Set Address Book Details */
  router.post("/sme/:id/setAddressbookDetail", verifyTokenSME, validateRequest(getSettingRequestValidate), setAddressbookDetail);

  /** Longcode add to spam */
  router.post("/sme/:id/setLongcodes", verifyTokenSME, validateRequest(longcodeSpamRequestValidate), setLongcodes);

  /** Set agents order */
  router.post("/sme/:id/setAgentsOrder", verifyTokenSME, validateRequest(setAgentsOrderRequestValidate), setAgentsOrder);

  /**  Agent reportdetail  */
  router.post("/sme/:id/agent/agentReportData", validateRequest(agentReportDataRequestValidate), agentReportData);

  /**  Delete Ivr Call Flow  */
  router.post("/sme/:id/deleteIvrCallFlow", validateRequest(getSettingRequestValidate), deleteIvrCallFlow);

  /**  Get Lead Crm Customer Details   */
  router.post("/sme/:id/getLeadCustomerDetails", verifyTokenSME, validateRequest(getLeadCustomerDetailsValidate), getLeadCustomerDetails);

  /**  Get agent insight day wise   */
  router.post("/sme/:id/getAgentsInsightDayWise", verifyTokenSME, validateRequest(getSettingRequestValidate), getAgentsInsightDayWise);

  /**  Get Calls Performance   */
  router.post("/sme/:id/getCallsPerformance", validateRequest(getCallsPerformanceRequestValidate), getCallsPerformance);

  /**  Get sms header   */
  router.post("/sme/:id/getSmsHeader", validateRequest(getSmsHeaderRequestValidate), getSmsHeader);

  /**  set sms header   */
  router.post("/sme/:id/setSmsHeader", validateRequest(setSmsHeaderRequestValidate), setSmsHeader);

  /**  update sms header by id   */
  router.post("/sme/smsHeader/update/:id", validateRequest(updateSmsHeaderRequestValidate), updateSmsHeader);

  router.post("/sme/:id/deleteHeader", validateRequest(deleteHeaderRequestValidate), deleteHeader);

  router.post("/sme/:id/getHeaderlist", validateRequest(getHeaderlistRequestValidate), getHeaderList);

  router.post("/sme/:id/getTemplateList", validateRequest(getTemplateListRequestValidate), getTemplateList);

  router.post("/sme/:id/deleteSmsCampaign", validateRequest(deleteSmsCampaignListRequestValidate), deleteSmsCampaign);

  router.post("/sme/:id/getIvrByUniqueFlowId", verifyTokenSME, validateRequest(getivrflowRequestValidate), getIvrByUniqueFlowId);

  router.post("/sme/:id/getIvrFlowCount", verifyTokenSME, validateRequest(getivrflowRequestValidate), getIvrFlowCount);

  router.post("/sme/:id/updateivrflow", verifyTokenSME, validateRequest(createivrflowRequestValidate), updateivrflow);

  router.post("/sme/:id/getIvrFlowlongcodeId", verifyTokenSME, validateRequest(createivrflowRequestValidate), getIvrFlowlongcodeId);

  router.post("/sme/:id/getCampaignMediaFile", verifyTokenSME, validateRequest(uploadCampaignMediaFileRequestValidate), getCampaignMediaFile);

  router.post("/sme/:id/uploadCampaignMediaFile", verifyTokenSME, validateRequest(uploadCampaignMediaFileRequestValidate), uploadCampaignMediaFile);

  router.post("/sme/:id/setCampaignMediaFile", verifyTokenSME, validateRequest(uploadCampaignMediaFileRequestValidate), setCampaignMediaFile);

  router.post("/sme/:id/uploadCampaignSchedule/:campaignId/:customerNumberColumn", verifyTokenSME, validateRequest(uploadCampaignScheduleRequestValidate), uploadScheduleCampaign);

  router.post("/sme/:id/addCampaign/", verifyTokenSME, validateRequest(addCampaignRequestValidate), addCampaign);

  router.post("/sme/:id/getOutgoingCampaign/", verifyTokenSME, validateRequest(addCampaignRequestValidate), getOutgoingCampaign);

  router.post("/sme/:id/getScheduledCalls/", verifyTokenSME, validateRequest(getScheduledCallsValidate), getScheduledCalls);

  router.post("/sme/:id/addCampaignBase/", verifyTokenSME, validateRequest(getScheduledCallsValidate), addCampaignBase);

  router.post("/sme/:id/uploadCampaignNumbers/:campaignId", verifyTokenSME, validateRequest(uploadCampaignRequestValidate), uploadCampaignNumbers);

  router.post("/sme/:id/addNewCustomer", verifyTokenSME, validateRequest(addNewCustomerValidate), addNewCustomer);

  router.post("/sme/:id/addManualLead", verifyTokenSME, validateRequest(addManualLeadValidate), addManualLead);

  router.post("/sme/:id/updateAgentStatus", verifyTokenSME, validateRequest(updateAgentStatusValidate), updateAgentStatus);

  router.post("/sme/:id/agentActInactTime", verifyTokenSME, validateRequest(agentActInactTimeValidate), agentActInactTime);

  router.post("/sme/:id/getOutCallsReport", verifyTokenSME, validateRequest(agentReportdetailRequestValidate), getOutCallsReport);

  router.post("/sme/:id/getLeadSource", verifyTokenSME, validateRequest(getLeadSourceRequestValidate), getLeadSource);

  router.post("/sme/:id/addLeadSource", verifyTokenSME, validateRequest(addLeadSourceRequestValidate), addLeadSource);

  router.post("/sme/:id/deleteLeadSource", verifyTokenSME, validateRequest(deleteLeadSourceRequestValidate), deleteLeadSource);

  router.post("/sme/:id/editLeadSource", verifyTokenSME, validateRequest(editLeadSourceRequestValidate), editLeadSource);

  router.post("/sme/:id/deleteUniqueDetail", verifyTokenSME, validateRequest(deleteUniqueDetailRequestValidate), deleteUniqueDetail);

  router.post("/sme/:id/updateOutgoingCampaign", verifyTokenSME, validateRequest(addCampaignRequestValidate), updateOutgoingCampaign);

  router.post("/sme/demoRequest", validateRequest(demoRequestValidate), demoRequest);

  router.post("/sme/:id/getOutgoingCampaigAgentWise", verifyTokenSME, validateRequest(getCampaignDataAfterCallsValidate), getOutgoingCampaigAgentWise);

  router.post("/sme/:id/getAgentCampaign", verifyTokenSME, validateRequest(getAgentCampaignValidate), getAgentCampaign);

  router.post("/sme/:id/addAutodialerCampaignBase", verifyTokenSME, validateRequest(addAutodialerCampaignBaseValidate), addAutodialerCampaignBase);

  /** Get all getAllProductPackage */
  router.post("/sme/:id/getSmeProductPackage", verifyTokenSME, validateRequest(SmeProductPackageRequestValidate), getSmeProductPackage);

  router.post("/sme/:id/addCustomerNote", verifyTokenSME, validateRequest(addCustomerNoteRequestValidate), addCustomerNote);

  router.post("/sme/:id/setFollowUpCall", verifyTokenSME, validateRequest(setFollowUpCallRequestValidate), setFollowUpCall);

  /**  Get Lead Crm product Details   */
  router.post("/sme/:id/getLeadDetailProduct", verifyTokenSME, validateRequest(getLeadCustomerDetailsValidate), getLeadDetailProduct);

  router.post("/sme/:id/getLeadDetailNotes", verifyTokenSME, validateRequest(getLeadCustomerDetailsValidate), getLeadDetailNotes);

  router.post("/sme/:id/getLeadDetailRemarks", verifyTokenSME, validateRequest(getLeadCustomerDetailsValidate), getLeadDetailRemarks);

  router.post("/sme/:id/getLeadDetailCalls", verifyTokenSME, validateRequest(getLeadCustomerDetailsValidate), getLeadDetailCalls);

  router.post("/sme/:id/getPastScheduledCalls", verifyTokenSME, validateRequest(getScheduledCallsValidate), getPastScheduledCalls);

  router.post("/sme/:id/getTodayScheduledCalls", verifyTokenSME, validateRequest(getScheduledCallsValidate), getTodayScheduledCalls);

  router.post("/sme/:id/getUpcomingScheduledCalls", verifyTokenSME, validateRequest(getScheduledCallsValidate), getUpcomingScheduledCalls);

  router.post("/sme/:id/getEndCallReasonsList", verifyTokenSME, validateRequest(getEndCallReasonsListRequestValidate), getEndCallReasonsList);

  router.post("/sme/:id/updateEndCallReason/", verifyTokenSME, validateRequest(updateEndCallReasonValidate), updateEndCallReason);

  router.post("/sme/:id/getAllSmsPackages/", verifyTokenSME, validateRequest(getAllSmsPackagesValidate), getAllSmsPackages);

  router.post("/sme/:id/getSmeSmsPackage/", verifyTokenSME, validateRequest(getSmeSmsPackageValidate), getSmeSmsPackage);

  router.post("/sme/:id/getSmsEndCallEnum/", verifyTokenSME, validateRequest(getSmsEndCallEnumValidate), getSmsEndCallEnum);

  router.post("/sme/:id/setSmeSmsNotifyPermission/",  validateRequest(setSmeSmsNotifyPermissionValidate), setSmeSmsNotifyPermission);


  router.post("/sme/:id/getTotalLeadStatusSummary/", verifyTokenSME, validateRequest(getTotalLeadsSummaryValidate), getTotalLeadStatusSummary);

  router.post("/sme/:id/getTotalLeadSourceSummary/", verifyTokenSME, validateRequest(getTotalLeadsSummaryValidate), getTotalLeadSourceSummary);

  router.post("/sme/:id/getTotalLeadProductSummary/", verifyTokenSME, validateRequest(getTotalLeadsSummaryValidate), getTotalLeadProductSummary);

  router.post("/sme/:id/getTotalLeadTypeSummary/", verifyTokenSME, validateRequest(getTotalLeadsSummaryValidate), getTotalLeadTypeSummary);

  router.post("/sme/:id/getTotalLeadFollowupSummary/", verifyTokenSME, validateRequest(getTotalLeadsSummaryValidate), getTotalLeadFollowupSummary);

  router.post("/sme/:id/checkSmeAutodialerPermission/", verifyTokenSME, validateRequest(getTotalLeadsSummaryValidate), checkSmeAutodialerPermission);

  router.post("/sme/:id/getLeadStatus", verifyTokenSME, validateRequest(getLeadStatusRequestValidate), getLeadStatus);

  router.post("/sme/:id/addLeadStatus", verifyTokenSME, validateRequest(addLeadStatusRequestValidate), addLeadStatus);

  router.post("/sme/:id/deleteLeadStatus", verifyTokenSME, validateRequest(deleteLeadStatusRequestValidate), deleteLeadStatus);

  router.post("/sme/:id/editLeadStatus", verifyTokenSME, validateRequest(editLeadStatusRequestValidate), editLeadStatus);

  router.post("/sme/:id/getEndcallSmsPermission/", verifyTokenSME, validateRequest(EndcallSmsPermissionValidate), getEndcallSmsPermission);

  router.post("/sme/:id/getSmsPaymentHistory/", verifyTokenSME, validateRequest(getSmsPaymentHistoryValidate), getSmsPaymentHistory);

  router.post("/sme/:id/getTotalLeadCitySummary", verifyTokenSME, validateRequest(getTotalLeadsSummaryValidate), getTotalLeadCitySummary);

  router.post("/sme/:id/uploadLead", verifyTokenSME, validateRequest(uploadLeadRequestValidate), uploadLead);

  router.post("/sme/:id/leadTransfer", verifyTokenSME, validateRequest(leadTransferDataRequestValidate), leadTransfer);

  router.post("/sme/:id/uploadLeadData", verifyTokenSME, validateRequest(uploadLeadDataRequestValidate), uploadLeadData);

  router.post("/sme/:id/getSingleAgent", verifyTokenSME, validateRequest(getSingleAgentRequestValidate), getSingleAgent);

  /* START Third party integration Api's */
  router.post("/sme/:id/bulkLeadTransfer", verifyTokenSME, validateRequest(bulkLeadTransferDataRequestValidate), bulkLeadTransfer);

  router.post("/sme/:id/setThirdPartyLeadSettings", verifyTokenSME, validateRequest(setThirdPartyLeadSettingsValidate), setThirdPartyLeadSettings);

  router.post("/sme/:id/getThirdPartyLeadSettings", verifyTokenSME, validateRequest(getThirdPartyLeadSettingsValidate), getThirdPartyLeadSettings);

  router.post("/sme/:id/getAllThirdPartyLeadSettings", verifyTokenSME, validateRequest(getAllThirdPartyLeadSettingsValidate), getAllThirdPartyLeadSettings);

  router.post("/sme/:id/checkFacebookAccessToken", validateRequest(checkFacebookAccessTokenValidate), checkFacebookAccessToken);

  router.post("/sme/:id/getFacebookAdsCampaign", validateRequest(getFacebookAdsCampaignValidate), getFacebookAdsCampaign);

  router.post("/sme/:id/getFacebookAdsetData", validateRequest(getFacebookAdsetDataValidate), getFacebookAdsetData);

  router.post("/sme/:id/getFacebookAdsData", validateRequest(getFacebookAdsDataValidate), getFacebookAdsData);


  /* END Third party integration Api's */

  router.post("/sme/:id/updateLeadStatusOnLiveCall", verifyTokenSME, validateRequest(updateLeadStatusOnLiveCallValidate), updateLeadStatusOnLiveCall);

  router.post("/sme/:id/changeScheduleStatus", verifyTokenSME, validateRequest(changeScheduleStatusValidate), changeScheduleStatus);
  
  router.post("/sme/:id/getsmePackagePaymentHistory/", verifyTokenSME, validateRequest(getsmePackagePaymentHistoryValidate), getsmePackagePaymentHistory);

  router.post("/sme/:id/getCampaignAssignedAgents/", verifyTokenSME, validateRequest(getCampaignAssignedAgentsValidate), getCampaignAssignedAgents);

  router.post("/sme/:id/getCampaignBetaAssignedAgents/", verifyTokenSME, validateRequest(getCampaignAssignedAgentsValidate), getCampaignBetaAssignedAgents);

  router.post("/sme/:id/generateReport/", verifyTokenSME, validateRequest(generateReportValidate), generateReport);

  router.post("/sme/:id/getDownloadReport/", verifyTokenSME, validateRequest(getDownloadReportValidate), getDownloadReport);

  /* start Communication SMS api */

      /** Get sms template */
      router.post("/sme/:id/getSmsTemplate", verifyTokenSME, validateRequest(getSmsTemplateRequestValidate), getSmsTemplate);

      /** Set sms template */
      router.post("/sme/:id/setSmsTemplate", verifyTokenSME, validateRequest(setSmsTemplateRequestValidate), setSmsTemplate);

      /** delete sms template */
      router.post("/sme/:id/deleteTemplate", verifyTokenSME,  validateRequest(deleteTemplateRequestValidate), deleteSMSTemplate);

      router.post("/sme/:id/setCommSmsSettings", verifyTokenSME,  validateRequest(setCommSmsSettingsRequestValidate), setCommSmsSettings);

      /** update sms template */
      router.post("/sme/smsTemplate/update/:id", verifyTokenSME, validateRequest(updateSmsTemplateRequestValidate), updateSmsTemplate);

      /** sendCommSms */
       router.post("/sme/:id/sendCommSms", verifyTokenSME, validateRequest(sendCommSmsRequestValidate), sendCommSms);

       /** sendCommSms */
       router.post("/sme/:id/getCommSmsSettings", verifyTokenSME, validateRequest(getCommSmsSettingsRequestValidate), getCommSmsSettings);

  /* end  Lead Manager SMS api */

  /* Start Frequency API */
      router.post("/sme/:id/viewFrequency", verifyTokenSME, validateRequest(viewFrequencyRequestValidate), viewFrequency);
  /* End Frequency API */

  /* Webrtc API START*/
    router.post("/sme/:id/getWebrtcNumber", verifyTokenSME, validateRequest(getWebrtcNumberRequestValidate), getWebrtcNumber);

    router.post("/sme/:id/webrtcAgent/add", verifyTokenSME, validateRequest(addAgentRequestValidate), addWebrtcAgent);
  /* Webrtc API END*/

  /* Non Working Flow API START*/
    router.post("/sme/:id/getNonWorkingFlow", verifyTokenSME, validateRequest(getNonWorkingFlowRequestValidate), getNonWorkingFlow);
    router.post("/sme/:id/getNonWorkingDays", verifyTokenSME, validateRequest(getNonWorkingFlowRequestValidate), getNonWorkingDays);

    router.post("/sme/:id/saveNonWorkingFlow", verifyTokenSME, validateRequest(saveNonWorkingFlowRequestValidate), saveNonWorkingFlow);
    router.post("/sme/:id/saveNonWorkingDays", verifyTokenSME, validateRequest(saveNonWorkingDaysRequestValidate), saveNonWorkingDays);
  /* Non Working Flow API END*/

  router.post("/sme/:id/isdeletedAgentLeadExist", verifyTokenSME, validateRequest(isdeletedAgentLeadExistRequestValidate), isdeletedAgentLeadExist);

  router.post("/sme/:id/getNonWorkingMappingFlow", verifyTokenSME, validateRequest(getNonWorkingMappingFlowRequestValidate), getNonWorkingMappingFlow);

  router.post("/sme/:id/updateWebrtcAgentStatus", verifyTokenSME, validateRequest(updateWebrtcAgentStatusRequestValidate), updateWebrtcAgentStatus);

  router.post("/sme/:id/isWebrtcAgentRegister", verifyTokenSME, validateRequest(isWebrtcAgentRegisterRequestValidate), isWebrtcAgentRegister);

  router.post("/sme/:id/uploadNonWorkingFile/", verifyTokenSME, validateRequest(uploadCampaignScheduleRequestValidate), uploadNonWorkingFile);

  router.post("/sme/:id/getAbandonedCalls/", verifyTokenSME, validateRequest(getAbandonedCallsRequestValidate), getAbandonedCalls);

  router.post("/sme/:id/getTrainingVideos/", verifyTokenSME, validateRequest(getTrainingVideosRequestValidate), getTrainingVideos);

  router.post("/sme/:id/getFaq/", verifyTokenSME, validateRequest(getFaqRequestValidate), getFaq);

  router.post("/sme/:id/getUploadedFileColumnsData/:campaignId", verifyTokenSME, validateRequest(uploadCampaignScheduleRequestValidate), getUploadedFileColumnsData);


  router.post("/sme/:id/setFacebookLeadSettings", verifyTokenSME, validateRequest(setFacebookLeadSettingsValidate), setFacebookLeadSettings);
  
  router.post("/sme/:id/getFacebookLeadSettings", verifyTokenSME,  getFacebookLeadSettings);

  router.post("/sme/:id/getfacebookCampaignSettings", verifyTokenSME,  getfacebookCampaignSettings);

  router.post("/sme/:id/setFacebookCampaignData", verifyTokenSME,  setFacebookCampaignData);

  router.post("/sme/:id/getfacebookCampaignAssignedAgentId", verifyTokenSME,  getfacebookCampaignAssignedAgentId);

  router.post("/sme/:id/getfacebookCampaignadsdata", verifyTokenSME,  getfacebookCampaignadsdata);

  router.post("/sme/:id/updatefaceBookCampaignStatus", verifyTokenSME,  updatefaceBookCampaignStatus);

  router.post("/sme/:id/deleteFacebookCampaigndata", verifyTokenSME,  deleteFacebookCampaigndata);

  router.post("/sme/:id/getAgentLongcodes", verifyTokenSME, validateRequest(getAgentLongcodesValidate), getAgentLongcodes);

  router.post("/sme/:id/getCustomerName", verifyTokenSME, validateRequest(getCustomerNameValidate), getCustomerName);

  router.post("/sme/:id/addInformativeObdCampaignBase", verifyTokenSME, validateRequest(getScheduledCallsValidate), addInformativeObdCampaignBase);

  router.post("/sme/:id/getAllPrompt", verifyTokenSME, validateRequest(getAllPromptValidate), getAllPrompt);

  router.post("/sme/:id/isAgentEmailExist", verifyTokenSME, validateRequest(isAgentEmailExistValidate), isAgentEmailExist);

  router.post("/sme/:id/isAgentMobileExist", verifyTokenSME, validateRequest(isAgentMobileExistValidate), isAgentMobileExist);

  router.post("/sme/:id/setAgentFree", verifyTokenSME, validateRequest(setAgentFreeValidate), setAgentFree);

  router.post("/sme/:id/addAutodialerCampaignBetaBase", verifyTokenSME, validateRequest(addAutodialerCampaignBaseValidate), addAutodialerCampaignBaseNew);

  router.post("/sme/:id/getOutgoingCampaignBeta/", verifyTokenSME, validateRequest(addCampaignRequestValidate), getOutgoingCampaignBeta);

  router.post("/sme/:id/getMergeCalls/", verifyTokenSME, validateRequest(getMergeCallsValidate), getMergeCalls);

  router.get("/sme/:id/getActiveAgentList", verifyTokenSME, validateRequest(getAgentListRequestValidate), getActiveAgentList);

  router.post("/sme/:id/clearLiveCall", verifyTokenSME, validateRequest(clearLiveCallRequestValidate), clearLiveCall);

  /** get call column  settings */
  router.post("/sme/:id/setCallColumnSettings", verifyTokenSME, validateRequest(getLeadSettingsRequestValidate), setCallColumnSettings);

  router.post("/sme/:id/transferLiveCall", verifyTokenSME, validateRequest(transferLiveCallRequestValidate), transferLiveCall);

  router.post("/sme/:id/getAgentLiveCallLead", verifyTokenSME, validateRequest(getAgentLiveCallLeadRequestValidate), getAgentLiveCallLead);

  router.post("/sme/:id/getAgentLiveCallCampaignLead", verifyTokenSME, validateRequest(getAgentLiveCallLeadRequestValidate), getAgentLiveCallCampaignLead);

  router.post("/sme/:id/copyCampaignToLead", verifyTokenSME, validateRequest(copyCampaignToLeadRequestValidate), copyCampaignToLead);

  router.post("/sme/:id/getQueue", verifyTokenSME, validateRequest(getQueueRequestValidate), getQueue);

  router.post("/sme/:id/addQueue", verifyTokenSME, validateRequest(addQueueRequestValidate), addQueue);

  router.post("/sme/:id/updateQueue", verifyTokenSME, validateRequest(updateQueueRequestValidate), updateQueue);

  router.post("/sme/:id/getQueueAssignedAgents", verifyTokenSME, validateRequest(updateQueueRequestValidate), getQueueAssignedAgents);
};
