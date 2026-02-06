import express, { Request, Response } from "express";
import { verifyTokenSME, validateRequest } from "../../../middlewares";
import { getGenralCities, getGeneralLeadType, getGeneralLeadStatus,getActivityLogs, setActivityLogs } from "../../controllers/app/v2/common/commonController";

import { getGenralCitiesRequestValidate,getActivityLogsValidate,setActivityLogsValidate } from "../../../domain/validator/common.validator";

const route = express.Router();

/** Common router function */
export const CommonRoute = (router: express.Router): void => {
  router.get("/common/:country/getGeneralCities", validateRequest(getGenralCitiesRequestValidate), getGenralCities);

  router.get("/common/getGeneralLeadType", getGeneralLeadType);

  router.get("/common/getGeneralLeadStatus", getGeneralLeadStatus);

  router.post("/common/:id/getActivityLogs", validateRequest(getActivityLogsValidate),  getActivityLogs);

  router.post("/common/:id/setActivityLogs", validateRequest(setActivityLogsValidate),  setActivityLogs);
};
