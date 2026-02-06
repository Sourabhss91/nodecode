import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import {
  FindFailedSmsDetail, FindSuccessSmsDetail, FindSmeSMSPack, FindAgentSmeData, FindSMSPermissionsToUsers, FindSmsEndcalltemplate, updateSmsBalanceSME, FindCustomerName, FindSmeData
} from "../../../../../domain/models/v2/sendsms.model";
import { endCallCdrRequest } from "../../../../../domain/entities/v2/ivr.entity";
import { env } from "../../../../../../infrastructure/env";
import { glogger } from "../../../../../helpers/logger";
import { convertTimeZone, secondsToHms } from "../../../../../helpers/utility";

var requestClient = require('request');

/**
 * get settings.
 *
 * @returns {Object}
 */

export const endcallSms = async (req: Request, res: Response) => {
  try {

    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let finalDuration = secondsToHms(req.body.duration);
    const customerNumberWithoutPlus = req.body.customerNo.replace(/\+/g, '');
    const agentNumberWithoutPlus = req.body.agentNo.replace(/\+/g, '');
    let reqData: any = {
      smeId: parseInt(req.params.id),
      callType: req.body.callType,
      customerNo: customerNumberWithoutPlus,
      sessionId: req.body.sessionId,
      agentNo: agentNumberWithoutPlus,
      dateTime: req.body.dateTime,
      callStatus: req.body.callStatus,
      duration: finalDuration,
      agentName: req.body.agentName == 0 ? '' : req.body.agentName
    };

    glogger('IMP', ""+req.body.sessionId+"", 'endcallSms', "API Request Customer No:" + req.body.customer_number);
    await FindSmeSMSPack(reqData, (err: any, responseA: any) => {
      if (err) {
        glogger('ERR', ""+req.body.sessionId+"", 'endcallSms', "FindSmeSMSPack, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (responseA.length > 0) {
          if (responseA[0].balance > 0) {
            var smsBalance = responseA[0].balance;
            FindSMSPermissionsToUsers(reqData, (err: any, responseB: any) => {
              if (err) {
                glogger('ERR', ""+req.body.sessionId+"", 'endcallSms', "FindSMSPermissionsToUsers, error:" + err);
                return ErrorEmptyResponse(res, err);
              } else {
                if (responseB.length > 0) {
                  for (let permisisonID of responseB) {
                    let reqData2: any = [
                      permisisonID.msgId1,
                      permisisonID.msgId2,
                      permisisonID.msgId3,
                      permisisonID.msgId4,
                      permisisonID.msgId5,
                      permisisonID.msgId6,
                      permisisonID.msgId7,
                    ];
                    for (let i = 0; i < reqData2.length; i++) {
                      console.log(reqData2[i])
                      if (reqData2[i] > 0) {
                        let reqData3: any = {
                          "permissionId": reqData2[i]
                        }
                      
                        FindSmsEndcalltemplate(reqData3, (err: any, responseC: any) => {
                          if (err) {
                            glogger('ERR', ""+req.body.sessionId+"", 'endcallSms', "FindSmsEndcalltemplate, error:" + err);
                            return ErrorEmptyResponse(res, err);
                          } else {
                            if (responseC.length > 0) {
                              FindSmeData(reqData, (err: any, SmeData: any) => {
                                if (err) {
                                  glogger('ERR', ""+req.body.sessionId+"", 'endcallSms', "FindSmeData, error:" + err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  FindCustomerName(reqData, (err: any, customerNameResp: any) => {
                                    if (err) {
                                      glogger('ERR', ""+req.body.sessionId+"", 'endcallSms', "FindCustomerName, error:" + err);
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      var CustomerNameNumber = '';
                                      if (customerNameResp && customerNameResp[0] && (customerNameResp[0].customer_name != '' || customerNameResp[0].customer_name != null)) {
                                        CustomerNameNumber = customerNumberWithoutPlus + ' ' + customerNameResp[0].customer_name;
                                      } else {
                                        CustomerNameNumber = customerNumberWithoutPlus;
                                      }
                                      var url = '';
                                      var mesage = responseC[0].message.replace("<Agent Name>", reqData['agentName']).replace("<Duration>", reqData['duration']).replace("<Business Name>", SmeData[0].name).replace("<Customer Number/Customer Name>", CustomerNameNumber).replace("<Customer Number>", reqData['customerNo']).replace("<Date Time>", getCurrentDate)
    
                                      if (responseC[0].name == 'CUSTOMER_FAILED' && reqData['callStatus'] == 'FAILED') {
                                        smsBalance = smsBalance - 1;
                                        var url = "" + env.SEND_SMS_END_CALL_URL + "username=" + env.SEND_SMS_END_CALL_USERNAME + "&password=" + env.SEND_SMS_END_CALL_PASSWORD + "&unicode=" + responseC[0].unicode + "&from=" + responseC[0].v_from + "&to=" + reqData['customerNo'] + "&text=" + mesage + "&dltContentId=" + responseC[0].dlt_content_id + "&dltPrincipalEntityId=" + responseC[0].dlt_principal_id + ""
                                      }
    
                                      if (responseC[0].name == 'CUSTOMER_ANSWERED' && reqData['callStatus'] == 'SUCCESS' && reqData['agentNo'] >0) {
                                        smsBalance = smsBalance - 1;
                                        var url = "" + env.SEND_SMS_END_CALL_URL + "username=" + env.SEND_SMS_END_CALL_USERNAME + "&password=" + env.SEND_SMS_END_CALL_PASSWORD + "&unicode=" + responseC[0].unicode + "&from=" + responseC[0].v_from + "&to=" + reqData['customerNo'] + "&text=" + mesage + "&dltContentId=" + responseC[0].dlt_content_id + "&dltPrincipalEntityId=" + responseC[0].dlt_principal_id + ""
                                      }
    
                                      if (responseC[0].name == 'AGENT_FAILED' && reqData['callStatus'] == 'FAILED' && reqData['agentNo'] >0) {
                                        smsBalance = smsBalance - 1;
                                        var url = "" + env.SEND_SMS_END_CALL_URL + "username=" + env.SEND_SMS_END_CALL_USERNAME + "&password=" + env.SEND_SMS_END_CALL_PASSWORD + "&unicode=" + responseC[0].unicode + "&from=" + responseC[0].v_from + "&to=" + reqData['agentNo'] + "&text=" + mesage + "&dltContentId=" + responseC[0].dlt_content_id + "&dltPrincipalEntityId=" + responseC[0].dlt_principal_id + ""
                                      }
    
                                      if (responseC[0].name == 'AGENT_ANSWERED' && reqData['callStatus'] == 'SUCCESS' && reqData['agentNo'] >0) {
                                        smsBalance = smsBalance - 1;
                                        var url = "" + env.SEND_SMS_END_CALL_URL + "username=" + env.SEND_SMS_END_CALL_USERNAME + "&password=" + env.SEND_SMS_END_CALL_PASSWORD + "&unicode=" + responseC[0].unicode + "&from=" + responseC[0].v_from + "&to=" + reqData['agentNo'] + "&text=" + mesage + "&dltContentId=" + responseC[0].dlt_content_id + "&dltPrincipalEntityId=" + responseC[0].dlt_principal_id + ""
                                      }
    
                                      if (responseC[0].name == 'ADMIN_SUCCESS' && reqData['callStatus'] == 'SUCCESS' && reqData['agentNo'] >0) {
                                        smsBalance = smsBalance - 1;
                                        var url = "" + env.SEND_SMS_END_CALL_URL + "username=" + env.SEND_SMS_END_CALL_USERNAME + "&password=" + env.SEND_SMS_END_CALL_PASSWORD + "&unicode=" + responseC[0].unicode + "&from=" + responseC[0].v_from + "&to=" + SmeData[0].sme_mobile + "&text=" + mesage + "&dltContentId=" + responseC[0].dlt_content_id + "&dltPrincipalEntityId=" + responseC[0].dlt_principal_id + ""
                                      }
    
    
                                      if (responseC[0].name == 'ADMIN_FAILED' && reqData['callStatus'] == 'FAILED' && reqData['agentNo'] >0) {
                                        smsBalance = smsBalance - 1;
                                        var url = "" + env.SEND_SMS_END_CALL_URL + "username=" + env.SEND_SMS_END_CALL_USERNAME + "&password=" + env.SEND_SMS_END_CALL_PASSWORD + "&unicode=" + responseC[0].unicode + "&from=" + responseC[0].v_from + "&to=" + SmeData[0].sme_mobile + "&text=" + mesage + "&dltContentId=" + responseC[0].dlt_content_id + "&dltPrincipalEntityId=" + responseC[0].dlt_principal_id + ""
                                      }
                                      if (responseC[0].name == 'ADMIN_ABANDONED' && reqData['callStatus'] == 'FAILED' && reqData['agentNo'] ==0) {
                                        smsBalance = smsBalance - 1;
                                        var url = "" + env.SEND_SMS_END_CALL_URL + "username=" + env.SEND_SMS_END_CALL_USERNAME + "&password=" + env.SEND_SMS_END_CALL_PASSWORD + "&unicode=" + responseC[0].unicode + "&from=" + responseC[0].v_from + "&to=" + SmeData[0].sme_mobile + "&text=" + mesage + "&dltContentId=" + responseC[0].dlt_content_id + "&dltPrincipalEntityId=" + responseC[0].dlt_principal_id + ""
                                      }

                                      if (url != '') {
                                        console.log(url)
                                        var options = {
                                          'method': 'GET',
                                          'url': url,
                                          'headers': {
                                            'Content-Type': 'application/x-www-form-urlencoded',
                                          },
    
                                        };
                                        requestClient(options, function (error: string | undefined, response: any) {
                                          if (error) {
                                            glogger('ERR', ""+req.body.sessionId+"", '/kcrm/' + req.params.id + '/schedule/sendIvrOutgoingcallback', "" + url + ", error:" + error);
                                          }
                                          
                                          if (response.statusCode == 200) {
                                            glogger('DEB', ""+req.body.sessionId+"", '/kcrm/' + req.params.id + '/schedule/sendIvrOutgoingcallback', "" + url + ", success:" + "Successfully");
                                            let updateBalanceData: any = {
                                              smeId: parseInt(req.params.id),
                                              balane: smsBalance
                                            }
    
                                            updateSmsBalanceSME(updateBalanceData, (err: any, responseBalance: any) => {
                                              if (err) {
                                                glogger('ERR', ""+req.body.sessionId+"", 'endcallSms', "updateSmsBalanceSME, error:" + err);
                                              } else {
                                                return SuccessResponse(res, "Successfully Sent ", responseBalance);
                                              }
                                            });
    
                                          }
                                        });
                                      }
                                    }
                                  });
    
                                }
                              });
                            } else {
                              return SuccessResponse(res, "No Sms template found", responseC);
                            }
                          }
                        });

                      }
                    }
                    break;
                  }
                } else {
                  return SuccessResponse(res, "No SMS permisison assigned by SME", responseA);
                }
              }
            });
          } else {
            return SuccessResponse(res, "Your sms balance is 0. Please recharge ", responseA);
          }
        } else {
          return SuccessResponse(res, "No sms plan Activated", responseA);
        }
      }
    });



    // FindFailedSmsDetail(reqData, (err: any, responseA: any) => {
    //   if (err) {
    //     glogger('ERR', ""+req.body.sessionId+"", 'endcallSms', "FindFailedSmsDetail, error:"+err);
    //     return ErrorEmptyResponse(res, err);
    //   } else {
    //     glogger('DEB', ""+req.body.sessionId+"", 'endcallSms', "FindFailedSmsDetail SuccessResponse");

    //     var agent_email = null;
    //     if((responseA[0]) && (responseA[0].template_name) && (responseA[0].template_name == 'FAILED_CALL') && (responseA[0].notify_admin == '1')){
    //       //send failed sms to admin
    //     } 
    //     if((responseA[0]) && (responseA[0].template_name) && (responseA[0].template_name == 'FAILED_CALL') && (responseA[0].notify_agent == '1')){
    //       //send failed sms to agent
    //     } 
    //     if((responseA[0]) && (responseA[0].template_name) && (responseA[0].template_name == 'FAILED_CALL') && (responseA[0].notify_customer == '1')){
    //       //send failed sms to customer
    //     } 

    //     FindSuccessSmsDetail(reqData, (err: any, responseB: any) => {
    //       if (err) {
    //         glogger('ERR', "" + req.body.sessionId + "", 'endcallSms', "FindSuccessSmsDetail, error:" + err);
    //         return ErrorEmptyResponse(res, err);
    //       } else {
    //         glogger('DEB', "" + req.body.sessionId + "", 'endcallSms', "SuccessResponse");

    //         if((responseA[0]) && (responseA[0].template_name) && (responseA[0].template_name == 'SUCCESS_CALL') && (responseA[0].notify_admin == '1')){
    //           //send success sms to admin
    //         } 
    //         if((responseA[0]) && (responseA[0].template_name) && (responseA[0].template_name == 'SUCCESS_CALL') && (responseA[0].notify_agent == '1')){
    //           //send success sms to agent
    //         } 
    //         if((responseA[0]) && (responseA[0].template_name) && (responseA[0].template_name == 'SUCCESS_CALL') && (responseA[0].notify_customer == '1')){
    //           //send success sms to customer
    //         } 

    //         return SuccessResponse(res, "system is alive", responseB);
    //       }
    //     });
    //   }
    // });



  } catch (e) {
    glogger('ERR', ""+req.body.sessionId+"", 'endcallSms', "Exception:" + e);
    ErrorResponse(res, e);
  }
};