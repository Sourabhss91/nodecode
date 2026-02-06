import express, { Request, Response } from "express";
import { verifyTokenSME, validateRequest, verifyTokenIVR, verifyTokenIVRCustom } from "../../../middlewares";
import { fetchCallProfile } from "../../controllers/app/ivr/profileController";
import { setLiveCalls, upddateLiveCalls, deleteLiveCalls, setUniqueCalls, blacklistIvrCalls, keepAlive } from "../../controllers/app/ivr/LiveCallsController";
import { agentExtention, setAgentFree, setAgentBusy, setAgentCdr, setAgentOut, setCustomerCdr, releaseAgent, getSmeRecord } from "../../controllers/app/ivr/agentController";
import { getFreeAgent, getFreeAgentParallelRinging } from "../../controllers/app/ivr/agentSearchController"; 
import { getAddressbook } from "../../controllers/app/ivr/addressBookController";
import { saveRecording, saveFailedRecordingInfo, getFailedRecordingInfo, updateFailedRecordingRetry } from "../../controllers/app/ivr/recordingController";
import { recordingUpload, saveRecordingData } from "../../controllers/app/ivr/s3RecordingController";
import { endCallCdr, callEndIvrNotify,updateCallBalance } from "../../controllers/app/ivr/endCallCdrController";
import { getclicktocall, getAutoDialerNo , updateClick2Call, getAppOutCallDetail,getAppOutCallDetailNew,getAutoDialerNoNew,updateClick2CallLiveCall} from "../../controllers/app/ivr/clicktocallController";
import { endcallSms } from "../../controllers/app/ivr/sendSms";
import { revenueProcess,revenueProcessToday,updateSiteStatus } from "../../controllers/app/ivr/revenueProcessController";
import { getToken } from "../../controllers/app/ivr/tokenController";


import {
  fetchCallProfileRequestValidate,
  setLiveCallsRequestValidate,
  updateLiveCallsValidate,
  deleteLiveCallsValidate,
  agentExtentionValidate,
  getAddressbookValidate,
  setAgentBusyValidate,
  setAgentFreeValidate,
  saveRecordingValidate,
  saveFailedRecordingInfoValidate,
  getFailedRecordingInfoValidate,
  updateFailedRecordingInfoValidate,
  updateRecordingValidate,
  setAgentCdrValidate,
  endCallCdrValidate,
  setUniqueCallsValidate,
  blacklistIvrCallsRequestValidate,
  getclicktocallRequestValidate,
  setAgentOutValidate,
  revenueProcessValidate,
  getFreeAgentValidate,
  getTokenValidate,
  setCustomerCdrValidate,
  setcallEndIvrNotifyValidate,
  endcallSmsValidate
} from "../../../domain/validator/ivr.validator";

const route = express.Router();

/** IVR router function */
export const IVR = (router: express.Router): void => {
  /** get remarks api*/
  router.post("/ivr/fetchCallProfile/",verifyTokenIVR, validateRequest(fetchCallProfileRequestValidate), fetchCallProfile);

  /** set live calls api */
  router.post("/ivr/:id/setLiveCalls", verifyTokenIVR, validateRequest(setLiveCallsRequestValidate), setLiveCalls);

  /** update live calls api */
  router.post("/ivr/:id/updateLiveCalls", verifyTokenIVR, validateRequest(updateLiveCallsValidate), upddateLiveCalls);

  /** delete live calls api */
  router.post("/ivr/:id/deleteLiveCalls", verifyTokenIVR, validateRequest(deleteLiveCallsValidate), deleteLiveCalls);

  /** delete Connected live calls api  for ts_cron No need to add verifyToken in this api */
  router.post("/ivr/:id/deleteConnectedLiveCalls", validateRequest(deleteLiveCallsValidate), deleteLiveCalls);

  /** API validate agent extention */
  router.post("/ivr/:id/agentExtention", verifyTokenIVR, validateRequest(agentExtentionValidate), agentExtention);

  /** address book API for IVR */
  router.post("/ivr/:id/getAddressbook", verifyTokenIVR, validateRequest(getAddressbookValidate), getAddressbook);

  /** make agent busy API for IVR */
  router.post("/ivr/:id/setAgentBusy", verifyTokenIVR, validateRequest(setAgentBusyValidate), setAgentBusy);

  /** make agent free  API for IVR */
  router.post("/ivr/:id/setAgentFree", verifyTokenIVR, validateRequest(setAgentFreeValidate), setAgentFree);

  /** make saveRecording  API for IVR */
  router.post("/ivr/:id/saveRecording", verifyTokenIVR, validateRequest(saveRecordingValidate), saveRecording);

  /** make uploadRecording  API for IVR */
  router.post("/ivr/:id/uploadRecording", validateRequest(updateRecordingValidate), recordingUpload);

  /** make uploadRecording  API for IVR */
  router.post("/ivr/:id/saveRecordingData", validateRequest(updateRecordingValidate), saveRecordingData);

  /** make setAgentCdr  API for IVR */
  router.post("/ivr/:id/setAgentCdr", verifyTokenIVR, validateRequest(setAgentCdrValidate), setAgentCdr);

  /** make endCallCdr API for IVR */
  router.post("/ivr/:id/endCallCdr", verifyTokenIVR, validateRequest(endCallCdrValidate), endCallCdr);

  /** Set unique Calls */
  router.post("/ivr/:id/setUniqueCalls", validateRequest(setUniqueCallsValidate), setUniqueCalls);

  router.post("/ivr/:id/setBlacklistIvrCalls", verifyTokenIVR, validateRequest(blacklistIvrCallsRequestValidate), blacklistIvrCalls);

  router.post("/ivr/:id/getclicktocall",verifyTokenIVR, validateRequest(getclicktocallRequestValidate), getclicktocall);

/** Set setAgentOut  */
  router.post("/ivr/:id/setAgentOutInfo", verifyTokenIVR, validateRequest(setAgentOutValidate), setAgentOut);

/** Get getClickToCallNos  */
router.post("/ivr/getAutoDialerNo", verifyTokenIVR, getAutoDialerNo);

/** Get customer detail from table of ougoing call through APP.  */
router.post("/ivr/:id/getAppOutCallDetail", verifyTokenIVR, getAppOutCallDetail);

/** updateClick2Call for update the click2call table for response.  */
router.post("/ivr/:id/updateClick2Call", verifyTokenIVR, updateClick2Call);

/** updateClick2CallLiveCall for update the click2call table for response.  */
router.post("/ivr/:id/updateClick2CallLiveCall", verifyTokenIVR, updateClick2CallLiveCall);

/** this API to call procedure and set the calls */
router.post("/ivr/revenueProcess",validateRequest(revenueProcessValidate), revenueProcess);

/** this API to call procedure for today and set the calls */
router.get("/ivr/revenueProcessToday", revenueProcessToday);

/** make agent free  API for IVR */
router.post("/ivr/:id/getFreeAgent", verifyTokenIVR, validateRequest(getFreeAgentValidate), getFreeAgent);

/** make agent free parellel ringing API for IVR */
router.post("/ivr/:id/getFreeAgentParallelRinging", verifyTokenIVR, validateRequest(getFreeAgentValidate), getFreeAgentParallelRinging);

/** make IVR alive all the time */
router.post("/ivr/keepAlive", verifyTokenIVR, keepAlive);

/** Get token through atob on basis username and password */
router.post("/ivr/getToken", validateRequest(getTokenValidate), getToken);

/** make setCustomerCdr  API for IVR */
router.post("/ivr/:id/setCustomerCdr", verifyTokenIVR, validateRequest(setCustomerCdrValidate), setCustomerCdr);

router.post("/ivr/:id/callEndIvrNotify",verifyTokenIVR, validateRequest(setcallEndIvrNotifyValidate), callEndIvrNotify);

/** Get customer detail from table of ougoing call through APP New API  */
router.post("/ivr/:id/getAppOutCallDetailNew", verifyTokenIVR, getAppOutCallDetailNew);

/** Get getClickToCallNos duplicate with find virtual number by agentid  */
router.post("/ivr/getAutoDialerNoNew", verifyTokenIVR, getAutoDialerNoNew);
/* to send sms to end party*/
router.post("/ivr/:id/sendEndcallSms", validateRequest(endcallSmsValidate), endcallSms);

/** save failed call s3 recording info */
router.post("/ivr/:id/saveFailedRecordingInfo", verifyTokenIVR, validateRequest(saveFailedRecordingInfoValidate), saveFailedRecordingInfo);

/** get failed recording to process again */
router.post("/ivr/getFailedRecordingInfo", verifyTokenIVR, validateRequest(getFailedRecordingInfoValidate), getFailedRecordingInfo);

/** update failed recording status */
router.post("/ivr/updateFailedRecordingRetry", verifyTokenIVR,  updateFailedRecordingRetry);

/** update Site status */
router.post("/ivr/updateSiteStatus",  updateSiteStatus);

router.post("/ivr/:id/updateCallBalance", verifyTokenIVR,  updateCallBalance);

/** Release Agent Directly */
router.post("/ivr/releaseAgent", verifyTokenIVRCustom , releaseAgent);

/** Get Sme Record */
router.post("/ivr/getSmeRecord", verifyTokenIVRCustom, getSmeRecord);

};
