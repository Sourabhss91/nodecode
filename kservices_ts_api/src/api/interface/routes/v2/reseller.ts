import express, { Request, Response } from "express";
import { verifyTokenSME, validateRequest } from "../../../middlewares";
import { resellerSignin, getTypeDetail } from "../../controllers/app/v2/reseller/reseller";
import { signinRequestValidate, typeDetaillRequestValidate } from "../../../domain/validator/reseller.validator";

const route = express.Router();

/** Reseller router function */
export const Reseller = (router: express.Router): void => {
  router.post("/reseller/signin", validateRequest(signinRequestValidate), resellerSignin);
  router.post("/reseller/:id/typedetail", verifyTokenSME, validateRequest(typeDetaillRequestValidate), getTypeDetail);
  router.post("/reseller/:id/requestForm", verifyTokenSME, validateRequest(typeDetaillRequestValidate), getTypeDetail);
};
