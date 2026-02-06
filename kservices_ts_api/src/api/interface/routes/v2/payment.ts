import express, { Request, Response } from "express";
import { verifyTokenSME, validateRequest } from "../../../middlewares";
import { createPayment,UpdateFinalPaymentData } from "../../controllers/app/v2/payment/createPayment";

const route = express.Router();

/** SME router function */
export const PaymentRoute = (router: express.Router): void => {

    /** get settings */
    router.post("/payment/create",verifyTokenSME,
    createPayment);

    router.post("/payment/:id/UpdateFinalPaymentData",verifyTokenSME,
    UpdateFinalPaymentData);

};
