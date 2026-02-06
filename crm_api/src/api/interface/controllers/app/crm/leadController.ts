import { Request, Response } from "express";
import { logger } from "../../../../lib/logger";
import { ErrorResponse, ErrorResWithSuccess, SuccessResponse, ErrorEmptyResponse, notFoundResponse } from "../../../../helpers/apiResponse";
import { checkManualLeadExist, addManualLeadData, checkTotalLeadStatusSummaryExist, updateTotalLeadStatusSummaryData, insertTotalLeadStatusSummaryData, checkTotalLeadSourceSummaryExist, updateTotalLeadSourceSummaryData, insertTotalLeadSourceSummaryData, checkTotalLeadProductSummaryExist, updateTotalLeadProductSummaryData, insertTotalLeadProductSummaryData, checkTotalLeadCitySummaryExist, updateTotalLeadCitySummaryData, insertTotalLeadCitySummaryData, findLeadSource, findCity, findProduct, findLeadStatus,findAgentData } from "../../../../domain/models/crm.model";
import { } from "../../../../domain/entities/crm.entity";
import { convertTimeZone, getNumberOfDays } from "../../../../helpers/utility";
import { glogger } from "../../../../helpers/logger";

var requestClient = require('request');
/**
 * get settings.
 *
 * @returns {Object}
 */

export const addManualLead = async (req: Request, res: Response) => {
  try {

    let currentDate = new Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);

    let reqData: any = {
      id: parseInt(req.params.id),
      customer_number: req.body.customerNumber ? req.body.customerNumber : "",
      agent_number: req.body.assignedAgentNumber ? req.body.assignedAgentNumber : "",
      product_name: req.body.productName ? req.body.productName : "",
      city: req.body.city ? req.body.city : "",
      recent_duration: req.body.recentDuration ? req.body.recentDuration : 0,
      recent_via_longcode: req.body.recentViaLongcode ? req.body.recentViaLongcode : 0,
      server_ip_address: req.body.Ip ? req.body.Ip : 0,
      recent_patched_agent_id: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
      total_incoming_calls: req.body.totalIncomingCalls ? req.body.totalIncomingCalls : 0,
      total_outgoing_calls: req.body.totalOutgoingCalls ? req.body.totalOutgoingCalls : 0,
      lead_type: req.body.leadType ? req.body.leadType : "",
      lead_status_name: req.body.leadStatusName ? req.body.leadStatusName : "",
      lead_status: req.body.leadstatus ? req.body.leadstatus : 0,
      city_id: req.body.cityId ? req.body.cityId : 0,
      product_id: req.body.productId ? req.body.productId : 0,
      product_price: req.body.productPrice ? req.body.productPrice : 0,
      assigned_agent_id: req.body.assignedAgentId ? req.body.assignedAgentId : 0,
      connected_call_duration: req.body.connectedCallDuration ? req.body.connectedCallDuration : 0,
      sticky_type: req.body.stickyType ? req.body.stickyType : 0,
      insert_date_time: getCurrentDate,
      update_date_time: getCurrentDate,
      call_type: "CRM",
      lead_source: req.body.leadSource ? req.body.leadSource : 0,
      lead_source_id: 0,
    };
    console.log(reqData)
    await checkManualLeadExist(reqData, (err: any, response: any) => {
      if (err) {
        glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "checkManualLeadExist, error:" + err);
        return ErrorEmptyResponse(res, err);
      } else {
        if (response && response.length > 0) {
          return SuccessResponse(res, "Listed successfully", response);
        } else {
          findLeadStatus(reqData, (err: any, responseLeadStatus: any) => {
            if (err) {
              glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "findLeadStatus, error:" + err);
              return ErrorEmptyResponse(res, err);
            } else {
              if (responseLeadStatus.length > 0) {
                reqData['lead_status'] = responseLeadStatus[0].id
              }
              findAgentData(reqData, (err: any, responseAgentData: any) => {
                if (err) {
                  glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "findAgentData, error:" + err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  if (responseAgentData.length > 0) {
                    reqData['assigned_agent_id'] = responseAgentData[0].id
                  }
                  findLeadSource(reqData, (err: any, responseLead: any) => {
                    if (err) {
                      glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "findLeadSource, error:" + err);
                      return ErrorEmptyResponse(res, err);
                    } else {
                      if (responseLead.length > 0) {
                        reqData['lead_source_id'] = responseLead[0].id
                      }
                      findCity(reqData, (err: any, responseCity: any) => {
                        if (err) {
                          glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "findCity, error:" + err);
                          return ErrorEmptyResponse(res, err);
                        } else {
                          if (responseCity.length > 0) {
                            reqData['city_id'] = responseCity[0].id
                          }
                          findProduct(reqData, (err: any, responseProduct: any) => {
                            if (err) {
                              glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "findProduct, error:" + err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              if (responseProduct.length > 0) {
                                reqData['product_id'] = responseProduct[0].id
                              }
                              console.log(reqData)
                              addManualLeadData(reqData, (err: any, response1: any) => {
                                if (err) {
                                  glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "addManualLeadData, error:" + err);
                                  return ErrorEmptyResponse(res, err);
                                } else {
                                  let reqData1: any = {
                                    "smeId": reqData["id"],
                                    "agentId": reqData["assigned_agent_id"],
                                    "leadStatus": reqData["lead_status"],
                                    "sourceId":  reqData["lead_source_id"],
                                    "productId": reqData["product_id"],
                                    "leadType":  '',
                                    "cityId":  reqData["city_id"],
                                    "insertDateTime": getCurrentDate,
                                    "leadStatusCount": 1,
                                    "leadSourceCount": 1,
                                    "leadProductCount": 1,
                                    "leadTypeCount": 1,
                                    "leadCityCount": 1,
                                  };
                                  checkTotalLeadStatusSummaryExist(reqData1, (err: any, response5: any) => {
                                    if (err) {
                                      glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "checkTotalLeadStatusSummaryExist, error:" + err);
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      if (response5.length > 0) {
                                        let reqData2: any = {
                                          "id": response5[0].id,
                                          "leadStatusCount": response5[0].lead_status_count + 1,
                                        };
                                        updateTotalLeadStatusSummaryData(reqData2, (err: any, response6: any) => {
                                          if (err) {
                                            glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "updateTotalLeadStatusSummaryData, error:" + err);
                                            return ErrorEmptyResponse(res, err);
                                          } else {

                                          }
                                        });
                                      } else {
                                        insertTotalLeadStatusSummaryData(reqData1, async (err: any, response7: any) => {
                                          if (err) {
                                            glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "insertTotalLeadStatusSummaryData, error:" + err);
                                            return ErrorEmptyResponse(res, err);
                                          } else {

                                          }
                                        });
                                      }
                                    }
                                  });

                                  checkTotalLeadSourceSummaryExist(reqData1, (err: any, response6: any) => {
                                    if (err) {
                                      glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "checkTotalLeadSourceSummaryExist, error:" + err);
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      if (response6.length > 0) {
                                        let reqData2: any = {
                                          "id": response6[0].id,
                                          "leadSourceCount": response6[0].lead_source_count + 1,
                                        };
                                        updateTotalLeadSourceSummaryData(reqData2, (err: any, response7: any) => {
                                          if (err) {
                                            glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "updateTotalLeadSourceSummaryData, error:" + err);
                                            return ErrorEmptyResponse(res, err);
                                          } else {

                                          }
                                        });
                                      } else {
                                        insertTotalLeadSourceSummaryData(reqData1, async (err: any, response7: any) => {
                                          if (err) {
                                            glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "insertTotalLeadSourceSummaryData, error:" + err);
                                            return ErrorEmptyResponse(res, err);
                                          } else {

                                          }
                                        });
                                      }
                                    }
                                  });

                                  checkTotalLeadProductSummaryExist(reqData1, (err: any, response6: any) => {
                                    if (err) {
                                      glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "checkTotalLeadProductSummaryExist, error:" + err);
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      if (response6.length > 0) {
                                        let reqData2: any = {
                                          "id": response6[0].id,
                                          "leadProductCount": response6[0].lead_product_count + 1,
                                        };
                                        updateTotalLeadProductSummaryData(reqData2, (err: any, response7: any) => {
                                          if (err) {
                                            glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "updateTotalLeadProductSummaryData, error:" + err);
                                            return ErrorEmptyResponse(res, err);
                                          } else {

                                          }
                                        });
                                      } else {
                                        insertTotalLeadProductSummaryData(reqData1, async (err: any, response7: any) => {
                                          if (err) {
                                            glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "insertTotalLeadProductSummaryData, error:" + err);
                                            return ErrorEmptyResponse(res, err);
                                          } else {

                                          }
                                        });
                                      }
                                    }
                                  });

                                  /*checkTotalLeadTypeSummaryExist(reqData1, (err: any, response6: any) => {
                                    if (err) {
                                      glogger('ERR', ""+req.body.callSessionId+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "checkTotalLeadTypeSummaryExist, error:"+err);
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      if(response6.length > 0){
                                        let reqData2: any = {
                                          "id": response6[0].id,
                                          "leadTypeCount": response6[0].lead_type_count+1,
                                        };
                                        updateTotalLeadTypeSummaryData(reqData2,  (err: any, response7: any) => {
                                          if (err) {
                                            glogger('ERR', ""+req.body.callSessionId+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "updateTotalLeadTypeSummaryData, error:"+err);
                                            return ErrorEmptyResponse(res, err);
                                          } else {
                                            
                                          }
                                        });
                                      } else {
                                        insertTotalLeadTypeSummaryData(reqData1, async (err: any, response7: any) => {
                                          if (err) {
                                            glogger('ERR', ""+req.body.callSessionId+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "insertTotalLeadTypeSummaryData, error:"+err);
                                            return ErrorEmptyResponse(res, err);
                                          } else {
                                            
                                          }
                                        });
                                      }
                                    }
                                  });*/

                                  checkTotalLeadCitySummaryExist(reqData1, (err: any, response7: any) => {
                                    if (err) {
                                      glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "checkTotalLeadCitySummaryExist, error:" + err);
                                      return ErrorEmptyResponse(res, err);
                                    } else {
                                      if (response7.length > 0) {
                                        let reqData2: any = {
                                          "id": response7[0].id,
                                          "leadCityCount": response7[0].lead_city_count + 1,
                                        };
                                        updateTotalLeadCitySummaryData(reqData2, (err: any, response8: any) => {
                                          if (err) {
                                            glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "updateTotalLeadCitySummaryData, error:" + err);
                                            return ErrorEmptyResponse(res, err);
                                          } else {

                                          }
                                        });
                                      } else {
                                        insertTotalLeadCitySummaryData(reqData1, async (err: any, response8: any) => {
                                          if (err) {
                                            glogger('ERR', "" + req.body.customer_number + "", '/kcrm/' + req.params.id + '/addManualLead', "insertTotalLeadCitySummaryData, error:" + err);
                                            return ErrorEmptyResponse(res, err);
                                          } else {

                                          }
                                        });
                                      }
                                    }
                                  });
                                  return SuccessResponse(res, "Lead added successfully", response1);
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }

      }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};



