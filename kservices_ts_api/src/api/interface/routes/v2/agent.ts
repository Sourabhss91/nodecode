import express, { Request, Response } from "express";
import { verifyTokenSME, validateRequest } from "../../../middlewares";
import { getRemarks, setRemarks, getListRemarks, userBreakIn, userBreakOut} from "../../controllers/app/v2/agent/remarksController";
import { getlist, getAgentCampaignSummary} from "../../controllers/app/v2/agent/callDetailsController";

import {
    getRemarksRequestValidate,
    setRemarksRequestValidate,
    getListRemarksRequestValidate,
    getlistRequestValidate,
    getAgentCampaignSummaryValidate,
} from "../../../domain/validator/agent.validator";

const route = express.Router();

/** SME router function */
export const AgentRoute = (router: express.Router): void => {
    /** get remarks api for APP*/
    router.post("/agent/:id/getRemarks", verifyTokenSME, validateRequest(getRemarksRequestValidate), getRemarks);

    /** set remarks */
    router.post("/agent/:id/setRemarks", verifyTokenSME, validateRequest(setRemarksRequestValidate), setRemarks);
  
    /**  get getListRemarks */
    router.post("/agent/:id/getListRemarks", verifyTokenSME, validateRequest(getListRemarksRequestValidate), getListRemarks);

    /** get calls list  */
    router.post("/agent/:id/cdr/:type/list", verifyTokenSME, validateRequest(getlistRequestValidate), getlist);

    router.post("/agent/:id/getAgentCampaignSummary", verifyTokenSME, validateRequest(getAgentCampaignSummaryValidate), getAgentCampaignSummary);

    router.post("/agent/:id/break/in", verifyTokenSME, userBreakIn);

    router.post("/agent/:id/break/out", verifyTokenSME, userBreakOut);

};
