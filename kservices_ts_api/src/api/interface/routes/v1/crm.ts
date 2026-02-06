import express, { Request, Response } from "express";
import { verifyTokenSME, validateRequest } from "../../../middlewares";
import { clickToCall,clickToCallNew,clickToCallNew2,clickToCallLiveCall } from "../../controllers/app/crm/clickToCallController";
import { clickToCallRequestValidate } from "../../../domain/validator/crm.validator";

const route = express.Router();

/** IVR router function */
export const CRM = (router: express.Router): void => {
  /** clickToCall*/
  router.post("/crm/clickToCallOld", verifyTokenSME, validateRequest(clickToCallRequestValidate), clickToCall);
  router.post("/crm/clickToCallNew",  validateRequest(clickToCallRequestValidate), clickToCallNew);
  //clickToCallNew2
  router.post("/crm/clickToCall", verifyTokenSME, validateRequest(clickToCallRequestValidate), clickToCallNew2);
  //clickToCall Autodialer
  router.post("/crm/clickToCallAutodialer", validateRequest(clickToCallRequestValidate), clickToCallNew2);

  // create new api site wise IVR api call 
  router.post("/crm/clickToCallLiveCall", validateRequest(clickToCallRequestValidate), clickToCallLiveCall);
  
};
