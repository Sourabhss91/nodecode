import express, { Request, Response } from "express";
import { verifyTokenSME, validateRequest } from "../../../middlewares";
import { bigQuery,getlist,agentReportdetail } from "../../controllers/app/v2/bigQuery/bigQuery";

const route = express.Router();
import {
  getlistRequestValidate,
  agentReportdetailRequestValidate
} from "../../../domain/validator/sme.validator";

/** SME router function */
export const BigQuery = (router: express.Router): void => {

  /** get settings */
  router.post("/bq/:id/cdr/:type/list", validateRequest(getlistRequestValidate),
  getlist);

    /**  Agent reportdetail  */
    router.post("/bq/:id/agent/reportdetail", validateRequest(agentReportdetailRequestValidate), agentReportdetail);

};
