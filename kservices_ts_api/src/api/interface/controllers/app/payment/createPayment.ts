import { Request, Response } from "express"
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../helpers/apiResponse";
import { FindAudioUrlRrcording } from "../../../../domain/models/sme.model";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { env } from '../../../../../infrastructure/env';
import {
  findOnePackage,
  createPaymentOrder,
  updatePaymentOrder,
  UpdateFinalPayment,
  findSmeSmsPlan,
  FindSingleSmsPackdetail,
  UpdateSmeSmsPlan,
  InsertSmeSmsPlan
} from "../../../../domain/models/sme.model";
const Razorpay = require('razorpay');
import { convertTimeZone } from "../../../../helpers/utility";

// This razorpayInstance will be used to
// access any resource from razorpay
const razorpayInstance = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET
});

/**
 * create payment
 *
 * @returns {Object}
 */

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { packageId, smeId, packageType } = req.body;
    
    var packQuantity=  req.body.packQuantity ? req.body.packQuantity : 1
    var d = new Date();
    findOnePackage({ id: packageId, packageType: packageType }, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
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
              let amount: any = actualAmount * 100;
              let currency: any = "INR";
              let receipt: any = responseOrder[0];
              let notes: any = packageType;
              razorpayInstance.orders.create({ amount, currency, receipt, notes },
                (err: any, order: any) => {
                  if (!err) {
                    updatePaymentOrder({ id: responseOrder[0], order_id: order['id'] }, (err: any, response5: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        reqData.notes = response[0].description
                        reqData.receipt = responseOrder[0]
                        reqData.paymentId = responseOrder[0]
                        reqData.currency = currency
                        reqData.order_id = order['id']
                        order.paymentData = reqData;
                        return SuccessResponse(res, "Successfully payment created", order);
                      }
                    });
                  } else {
                    return ErrorEmptyResponse(res, err.error.description);
                  }
                }
              )
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


export const UpdateFinalPaymentData = async (req: Request, res: Response) => {
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