import { Request, Response } from "express"
const request = require('request');
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { FindAudioUrlRrcording } from "../../../../../domain/models/sme.model";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { env } from '../../../../../../infrastructure/env';
const crypto = require("crypto");
import axios from 'axios';
import {
  findOnePackage,
  createPaymentOrder,
  updatePaymentOrder,
  UpdateFinalPayment,
  findSmeSmsPlan,
  FindSingleSmsPackdetail,
  UpdateSmeSmsPlan,
  InsertSmeSmsPlan
} from "../../../../../domain/models/sme.model";
const Razorpay = require('razorpay');
import { convertTimeZone, encodeRequest , signRequest} from "../../../../../helpers/utility";
const CHARGE_ENDPOINT = "/v3/charge";
const QRINIT_ENDPOINT = "/v3/qr/init";
const TRANSACTION_ENDPOINT = "/v3/transaction";
const REFUND_ENDPOINT = "/v3/credit/backToSource";
// This razorpayInstance will be used to
// access any resource from razorpay
const config = {
  key_id: "KOMMUNOONLINEUAT",
  key_secret: "6c31fc84-13f0-4526-84d7-35b33cbd1aec",
  merchant_id:"KOMMUNOONLINEUAT"
};

const phonepay = {
  "UAT": "https://mercury-uat.phonepe.com",
  "PROD": "https://mercury.phonepe.com"
}


/**
 * create payment
 *
 * @returns {Object}
 */

export const createPaymentPay = async (req: Request, res: Response) => {
  try {
  
    const { packageId, smeId, packageType } = req.body;
    var packQuantity=  req.body.packQuantity ? req.body.packQuantity : 1
    var d = new Date();
    findOnePackage({ id: packageId, packageType: packageType }, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        console.log('response',response)
        if (response.length > 0) {
          
          var actualAmount = response[0].amount * packQuantity;
          
          let reqData: any = {
            sme_id: parseInt(smeId),
            pack_id: packageId,
            amount: actualAmount,
            order_id: 0,
            packageType: packageType ? packageType : '',
            packQuantity: packQuantity,
            insert_date_time: d.toJSON().slice(0, 19).replace('T', ':')
          };
          createPaymentOrder(reqData, (err: any, responseOrder: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              let amount: any = 500;
              let currency: any = "INR";
              let receipt: any = responseOrder[0];
              let notes: any = packageType;

              const mobile = "9856963302";
              const apiKeyIndex = 1;
              const new_transaction_id = "#" + Date.now();
              let apiKey = "f247b7e4-f07f-4190-91e9-1d9211e34cfa";

              const payload = {
                "merchantId": "KOMMUNOONLINEUAT",
                "merchantTransactionId": new_transaction_id,
                "merchantUserId": "2000020",
                "amount": 500,
                "redirectUrl": "http://localhost:3000/phonePayAuth",
                "redirectMode": "REDIRECT",
                "callbackUrl": "http://localhost:3000/phonePayAuth",
                "mobileNumber": mobile,
                "paymentInstrument": {
                  "type": "PAY_PAGE"  
                }
              }
              var hash = crypto.createHash('sha256');
              let buff = Buffer.from(JSON.stringify(payload));
              const base64 = buff.toString('base64');
              const sign = base64 + "/pg/v1/pay" + apiKey ;
              const sha256 = hash.update(sign);
              const X_VERIFY = sha256 + "###" + apiKeyIndex;
              try{
                    axios.post("https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay", {
                      headers: {
                        accept: 'application/json', 'Content-Type': 'application/json',
                       'X-VERIFY':X_VERIFY
                    },
                    data:JSON.stringify({request:base64})
                  })      
                  .then((response) => {
                    console.log(response);
                  })
                  .catch((error) => {
                    console.log('errorerrorerrorerror',error);
                  })
              }catch(err){
                console.log('err',err);
              }

            }
          });
        } else {
          return ErrorEmptyResponse(res, "Invalid package id");
        }
      }
    });

  } catch (e) {
    console.log(e);
  }
}


export const UpdateFinalPaymentDataPay = async (req: Request, res: Response) => {
  try {

    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);

    let reqData: any = {
      smeId: parseInt(req.params.id),
      paymentId: req.body.paymentId,
      response: req.body.response,
      packageId: req.body.packageId,
      status: req.body.status == 1 ? "Success" : "Failed",
      packQuantity: req.body.packQuantity ? req.body.packQuantity : 1,

    };

    await FindSingleSmsPackdetail(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          let reqData2: any = {
            smsCount: response[0].sms_count,
            packageId: req.body.packageId,
            smeId: parseInt(req.params.id),
            insert_date_time: getCurrentDate
          }
          UpdateFinalPayment(reqData, (err: any, responseA: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              findSmeSmsPlan(reqData, (err: any, responseB: any) => {
                if (err) {
                  return ErrorEmptyResponse(res, err);
                } else {
                  if (responseB.length > 0) {
                    let reqData3: any = {
                      smsCountUpdate: responseB[0].balance + (response[0].sms_count * reqData['packQuantity']),
                    }
                    UpdateSmeSmsPlan(reqData2, reqData3, (err: any, responseC: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        return SuccessResponse(res, "Successfully payment created", responseC);
                      }
                    });
                  } else {
                    InsertSmeSmsPlan(reqData2, (err: any, responsD: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        return SuccessResponse(res, "Successfully payment created", responsD);
                      }
                    });
                  }
                }
              });
            }
          });

        }
      }
    });
  } catch (e) {
    console.log(e);
  }
}