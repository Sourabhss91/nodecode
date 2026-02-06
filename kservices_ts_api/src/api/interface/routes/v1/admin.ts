import express, { Request, Response } from "express";
import { verifyTokenSME, validateRequest } from "../../../middlewares";
import { fetchSme, getPendingLongcodes, getZones, addSme, updateSme, getAllLongcodes,addSmeLongcodes,removeLongcode,getAllActiveLongcodes,getAllProductPackage,updateClientPlan,UpdateAgentRequirement, updateSmeNotifyPermissions,getkommunoSitesList, getSiteWiseLongcodeList,UpdateSMEHuntingNumbers,addSmeNew,fetchSmenew,updateSmeAgentDetailsNew,finalclientCreateSubmission,updatestep1,updateClientStatus,UpdateClientPermission, updateSmeBalance,getdataCenter,getteleOperator,addLongcode,updateLongcodeStatus,getAllLiveEvent,UpdateClientCrmIntegration,getAllCallModes, getAllAgents,UpdateSmeSMSBalance,getAllSmsPackages } from "../../controllers/app/admin/adminController";
import { updateClientPlanValidate,addLongcodePlanValidate,updateSmeSMSBalanceValidate } from "../../../domain/validator/admin.validator";

import {  getSystemDetailGraphData, systemdetail,allSmeList } from "../../controllers/app/admin/dashboardController";

const route = express.Router();

/** Admin router function */
export const adminRoute = (router: express.Router): void => {
  /** Get all sme */
  router.post("/admin/sme/fetch",  verifyTokenSME, fetchSme);

  router.post("/admin/sme/fetchSmenew",  verifyTokenSME, fetchSmenew);

  /** Get pending longcodes */
  router.post("/admin/getPendingLongcodes",  verifyTokenSME, getPendingLongcodes);

  /** Get zones */
  router.post("/admin/getZones",  verifyTokenSME, getZones);

  /** Add Sme/Client */
  router.post("/admin/sme/add",  verifyTokenSME, addSme);

   /** Add Sme/Client New api step 1 */
   router.post("/admin/sme/addnew",  verifyTokenSME, addSmeNew);

  /** Add Sme/Client New api step new 2 */
  //router.post("/admin/:id/updateSmeAgentDetails",  verifyTokenSME, updateSmeAgentDetailsNew);

  /** Update Sme/Client */
  router.post("/admin/sme/update",  verifyTokenSME,  updateSme);

  router.post("/admin/:id/updatestep1",  verifyTokenSME,  updatestep1);

   /** Get all longcodes */
   router.post("/admin/getAllLongcodes",  verifyTokenSME, getAllLongcodes);

   router.post("/admin/:id/addSmeLongcodes",  verifyTokenSME, addSmeLongcodes);

   router.post("/admin/:id/removeLongcode",  verifyTokenSME, removeLongcode);

   router.post("/admin/:id/getAllActiveLongcodes",  verifyTokenSME, getAllActiveLongcodes);

  /** Get all getAllProductPackage */
  router.post("/admin/getAllProductPackage", verifyTokenSME, getAllProductPackage);

  /**assign Plan to sme */
  router.post("/admin/:id/updateClientPlan", verifyTokenSME, validateRequest(updateClientPlanValidate), updateClientPlan);

  /* Final client Create submission last step */
  router.post("/admin/:id/finalclientCreateSubmission", verifyTokenSME, finalclientCreateSubmission);

  /**assign Permission to sme */
  router.post("/admin/:id/UpdateAgentRequirements",verifyTokenSME,  UpdateAgentRequirement);

  router.post("/admin/:id/UpdateClientPermission",verifyTokenSME,  UpdateClientPermission);

    /**assign SmeNotifyPermissions to sme */
  router.post("/admin/:id/updateSmeNotifyPermissions", verifyTokenSME, updateSmeNotifyPermissions);

  router.post("/admin/:id/UpdateClientCrmIntegration", verifyTokenSME, UpdateClientCrmIntegration);

  /** get kommuno Sites List to sme */
  router.post("/admin/getkommunoSitesList",verifyTokenSME,  getkommunoSitesList);

  /** get kommuno Sites List to sme */
  router.post("/admin/getSiteWiseLongcodeList", verifyTokenSME,  getSiteWiseLongcodeList);

  /** get UpdateSMEHuntingNumbers   sme */
  router.post("/admin/:id/UpdateSMEHuntingNumbers", verifyTokenSME,  UpdateSMEHuntingNumbers);


  router.post("/admin/dashboard/systemdetail", verifyTokenSME,  systemdetail);

  router.post("/admin/dashboard/allSmeList", verifyTokenSME,  allSmeList);

  router.post("/admin/dashboard/getSystemDetailGraphData", verifyTokenSME,  getSystemDetailGraphData);

  router.post("/admin/updateClientStatus", verifyTokenSME,  updateClientStatus);

  router.post("/admin/:id/updateSmeBalance", verifyTokenSME,  updateSmeBalance);


  router.post("/admin/getdataCenter",verifyTokenSME,  getdataCenter );

  router.post("/admin/getteleOperator",verifyTokenSME,   getteleOperator);
 
  router.post("/admin/longcode/add", verifyTokenSME,  validateRequest(addLongcodePlanValidate), addLongcode);

  router.post("/admin/longcode/:id/update/:status", verifyTokenSME, updateLongcodeStatus);

  router.post("/admin/getAllLiveEvent", verifyTokenSME,   getAllLiveEvent);

  router.post("/admin/getAllCallMode", verifyTokenSME,   getAllCallModes);

  router.post("/admin/getAllAgents", verifyTokenSME, getAllAgents);

  router.post("/admin/:id/UpdateSmeSMSBalance", verifyTokenSME, validateRequest(updateSmeSMSBalanceValidate),  UpdateSmeSMSBalance);
 
  router.post("/admin/:id/getAllSmsPackages/", verifyTokenSME, getAllSmsPackages);


};