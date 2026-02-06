import express, { Request, Response } from "express";
import { verifyAuthAccessKeyToken, validateRequest } from "../../../middlewares";
import { clickToCall, sendIvrOutgoingcallback, callback, sendIvrLiveEvent, sendIvrRecordingEvent, userClickToCall,aiBotClickToCall,clickToCallLiveCall } from "../../controllers/app/crm/clickToCallController";
import { agentSummary,agentDayWiseSummary } from "../../controllers/app/crm/agentSummaryController";
import { clicktodial } from "../../controllers/app/crm/zohointegrationController";
import { addManualLead } from "../../controllers/app/crm/leadController";
import { clickToCallRequestValidate, callbackRequestValidate, sendIvrOutgoingcallbackValidate, sendIvrLiveEventValidate, sendIvrRecordingEventValidate,agentSummaryValidate,agentDayWiseSummaryValidate,addManualLeadValidate,userClickToCallRequestValidate,aiBotClickToCallRequestValidate } from "../../../domain/validator/crm.validator";

const route = express.Router();

/** IVR router function */
export const CRM = (router: express.Router): void => {
  /** get remarks api*/
  router.post("/kcrm/schedule/detail", verifyAuthAccessKeyToken, validateRequest(clickToCallRequestValidate), clickToCall);

  // router.post("/call/schedule/callback", validateRequest(callbackRequestValidate), callback);

  router.post("/kcrm/:id/schedule/sendIvrOutgoingcallback", validateRequest(sendIvrOutgoingcallbackValidate), sendIvrOutgoingcallback);

  router.post("/kcrm/schedule/callback", callback);

  router.post("/kcrm/:id/schedule/sendIvrLiveEvent", validateRequest(sendIvrLiveEventValidate), sendIvrLiveEvent);

  router.post("/kcrm/:id/schedule/sendIvrRecordingEvent", validateRequest(sendIvrRecordingEventValidate), sendIvrRecordingEvent);

  router.post("/kcrm/:id/agent/summary", verifyAuthAccessKeyToken, validateRequest(agentSummaryValidate), agentSummary);

  router.post("/kcrm/:id/agent/dayWiseSummary", verifyAuthAccessKeyToken, validateRequest(agentDayWiseSummaryValidate), agentDayWiseSummary);

  router.post("/kcrm/:id/addLead", verifyAuthAccessKeyToken, validateRequest(addManualLeadValidate), addManualLead);

  /* This api for peru cabs */
  router.post("/kcrm/mobileapp/user/clickToCall", verifyAuthAccessKeyToken, validateRequest(userClickToCallRequestValidate), userClickToCall);

   /* This api for ori bot */
   router.post("/kcrm/aibot/clickToCall", verifyAuthAccessKeyToken, validateRequest(aiBotClickToCallRequestValidate), aiBotClickToCall);

  // create new api site wise IVR api call 
   router.post("/kcrm/clickToCallLiveCall", verifyAuthAccessKeyToken, validateRequest(clickToCallRequestValidate), clickToCallLiveCall);

   router.post("/kcrm/schedule/clicktodial", clicktodial);

};
