import express, { Request, Response } from "express";
import { verifyTokenSME, validateRequest } from "../../../middlewares";
import { createPayment,UpdateFinalPaymentData } from "../../controllers/app/v2/payment/createPayment";
import { createPaymentPay,UpdateFinalPaymentDataPay } from "../../controllers/app/v3/payment/phonePay";
import { env } from '../../../../infrastructure/env'

const route = express.Router();

/** SME router function */
export const PaymentRoute = (router: express.Router): void => {

  if(env.PAYMENT_TYPE === "RAZORPAY"){
    /** get settings */
    router.post("/payment/create",verifyTokenSME,
    createPayment);

    router.post("/payment/:id/UpdateFinalPaymentData",verifyTokenSME,
    UpdateFinalPaymentData);
  }else if(env.PAYMENT_TYPE === "PHONEPAY"){
    /** get settings */
    router.post("/payment/create",verifyTokenSME,
    createPaymentPay);

    router.post("/payment/:id/UpdateFinalPaymentData",verifyTokenSME,
    UpdateFinalPaymentDataPay);
  }


};