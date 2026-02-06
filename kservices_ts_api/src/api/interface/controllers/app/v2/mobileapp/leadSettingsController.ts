import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { glogger } from "../../../../../helpers/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, SuccessResponseWithCount } from "../../../../../helpers/apiResponse";
import {
  getLeadStatusData,getLeadSourceData,FindleadSettings,checkManualLeadExist,addManualLeadData,checkTotalLeadStatusSummaryExist,updateTotalLeadStatusSummaryData,insertTotalLeadStatusSummaryData,checkTotalLeadSourceSummaryExist,updateTotalLeadSourceSummaryData,insertTotalLeadSourceSummaryData,checkTotalLeadProductSummaryExist,updateTotalLeadProductSummaryData,insertTotalLeadProductSummaryData,checkTotalLeadCitySummaryExist,updateTotalLeadCitySummaryData,insertTotalLeadCitySummaryData,GetUniqueCalls,FindCustomerAddressbookDetail,customerLeadDetailTotalCalls,FindProductsActivity,getScheduledCallsPastData,getScheduledCallsTodayData,getScheduledCallsUpcomingData,FindCustomerCalls,FindAddressbookDetail,checkAddressBookCustomerExist, addAddressBookCustomer,updateAddressBookCustomer,FindCustomerNotes,UpdateUniqueCall,checkTotalLeadTypeSummaryExist,updateTotalLeadTypeSummaryData,insertTotalLeadTypeSummaryData,FindCities,FindProducts,addCustomerNoteData,setFollowUpCallData,followNumberExistInUniqueDetails,updateUniqueCustomerData,insertUniqueCustomerData,UpdateUniqueCallAddressId, updateUniqueRecentRemarks
} from "../../../../../domain/models/v2/mobileapp.model";
import { getLeadStatusRequest,getLeadSourceRequest} from "../../../../../domain/entities/v2/mobileapp.entity";
import { env } from '../../../../../../infrastructure/env';
import { convertTimeZone } from "../../../../../helpers/utility";

/**
 * get settings.
 *
 * @returns {Object}
 */

export const getLeadSettings = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
    };
    await FindleadSettings(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
          if(response.length > 0){
            var data = [];
            console.log(response[0].lead_settings);
            if(response[0].lead_settings != '' || response[0].lead_settings != null){
                data  = JSON.parse(response[0].lead_settings);
            } 
            return SuccessResponse(res, "Successfully listed", data);
          }
          
        }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};


export const addManualLead = async (req: Request, res: Response) => {
  try {

    let reqData: any = {
      id: parseInt(req.params.id),
      customer_number: req.body.customerNumber ? req.body.customerNumber : "" ,
      recent_duration: req.body.recent_duration ? req.body.recent_duration : 0 ,
      recent_via_longcode: req.body.recent_via_longcode ? req.body.recent_via_longcode : 0 ,
      server_ip_address: req.body.ip ? req.body.ip : 0 ,
      recent_patched_agent_id: req.body.recent_patched_agent_id ? req.body.recent_patched_agent_id : 0 ,
      total_incoming_calls: req.body.total_incoming_calls ? req.body.total_incoming_calls : 0 ,
      total_outgoing_calls: req.body.total_outgoing_calls ? req.body.total_outgoing_calls : 0 ,
      lead_type: req.body.lead_type ? req.body.lead_type : "" ,
      lead_status: req.body.lead_status ? req.body.lead_status : 0 ,
      city_id: req.body.city_id ? req.body.city_id : 0 ,
      product_id: req.body.product_id ? req.body.product_id : 0 ,
      product_price: req.body.product_price ? req.body.product_price : 0 ,
      assigned_agent_id: req.body.assigned_agent_id ? req.body.assigned_agent_id : 0 ,
      connected_call_duration: req.body.connected_call_duration ? req.body.connected_call_duration : 0 ,
      sticky_type: req.body.sticky_type ? req.body.sticky_type : 0 ,
      insert_date_time : req.body.insertDateTime,
      update_date_time : req.body.insertDateTime,
      call_type : req.body.call_type ? req.body.call_type : "" ,
      source_id: req.body.source_id ? req.body.source_id : 0 ,
    };

    await checkManualLeadExist(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if(response && response.length > 0) {
          return SuccessResponse(res, "Listed successfully", response);
        } else {
          addManualLeadData(reqData, (err: any, response1: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              let currentDate = new Date();
              let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
              let reqData1: any = {
                "smeId": reqData["id"],
                "agentId": reqData["recent_patched_agent_id"] ? reqData["recent_patched_agent_id"] : reqData["assigned_agent_id"],
                "leadStatus": 0,
                "sourceId": 0,
                "productId": 0,
                "leadType": '',
                "cityId": 0,
                "insertDateTime": getCurrentDate,
                "leadStatusCount": 1,
                "leadSourceCount": 1,
                "leadProductCount": 1,
                "leadTypeCount": 1, 
                "leadCityCount": 1,
              }; 
              checkTotalLeadStatusSummaryExist(reqData1, (err: any, response5: any) => {
                if (err) {
                  glogger('ERR', ""+req.body.callSessionId+"", '/mobileapp/'+req.params.id+'/setUniqueCalls/', "checkTotalLeadStatusSummaryExist, error:"+err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  if(response5.length > 0){
                    let reqData2: any = {
                      "id": response5[0].id,
                      "leadStatusCount": response5[0].lead_status_count+1,
                    };
                    updateTotalLeadStatusSummaryData(reqData2,  (err: any, response6: any) => {
                      if (err) {
                        glogger('ERR', ""+req.body.callSessionId+"", '/mobileapp/'+req.params.id+'/setUniqueCalls/', "updateTotalLeadStatusSummaryData, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        
                      }
                    });
                  } else {
                    insertTotalLeadStatusSummaryData(reqData1, async (err: any, response7: any) => {
                      if (err) {
                        glogger('ERR', ""+req.body.callSessionId+"", '/mobileapp/'+req.params.id+'/setUniqueCalls/', "insertTotalLeadStatusSummaryData, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        
                      }
                    });
                  }
                }
              });

              checkTotalLeadSourceSummaryExist(reqData1, (err: any, response6: any) => {
                if (err) {
                  glogger('ERR', ""+req.body.callSessionId+"", '/mobileapp/'+req.params.id+'/setUniqueCalls/', "checkTotalLeadSourceSummaryExist, error:"+err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  if(response6.length > 0){
                    let reqData2: any = {
                      "id": response6[0].id,
                      "leadSourceCount": response6[0].lead_source_count+1,
                    };
                    updateTotalLeadSourceSummaryData(reqData2,  (err: any, response7: any) => {
                      if (err) {
                        glogger('ERR', ""+req.body.callSessionId+"", '/mobileapp/'+req.params.id+'/setUniqueCalls/', "updateTotalLeadSourceSummaryData, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        
                      }
                    });
                  } else {
                    insertTotalLeadSourceSummaryData(reqData1, async (err: any, response7: any) => {
                      if (err) {
                        glogger('ERR', ""+req.body.callSessionId+"", '/mobileapp/'+req.params.id+'/setUniqueCalls/', "insertTotalLeadSourceSummaryData, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        
                      }
                    });
                  }
                }
              });

              checkTotalLeadProductSummaryExist(reqData1, (err: any, response6: any) => {
                if (err) {
                  glogger('ERR', ""+req.body.callSessionId+"", '/mobileapp/'+req.params.id+'/setUniqueCalls/', "checkTotalLeadProductSummaryExist, error:"+err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  if(response6.length > 0){
                    let reqData2: any = {
                      "id": response6[0].id,
                      "leadProductCount": response6[0].lead_product_count+1,
                    };
                    updateTotalLeadProductSummaryData(reqData2,  (err: any, response7: any) => {
                      if (err) {
                        glogger('ERR', ""+req.body.callSessionId+"", '/mobileapp/'+req.params.id+'/setUniqueCalls/', "updateTotalLeadProductSummaryData, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        
                      }
                    });
                  } else {
                    insertTotalLeadProductSummaryData(reqData1, async (err: any, response7: any) => {
                      if (err) {
                        glogger('ERR', ""+req.body.callSessionId+"", '/mobileapp/'+req.params.id+'/setUniqueCalls/', "insertTotalLeadProductSummaryData, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        
                      }
                    });
                  }
                }
              });

              /*checkTotalLeadTypeSummaryExist(reqData1, (err: any, response6: any) => {
                if (err) {
                  glogger('ERR', ""+req.body.callSessionId+"", '/mobileapp/'+req.params.id+'/setUniqueCalls/', "checkTotalLeadTypeSummaryExist, error:"+err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  if(response6.length > 0){
                    let reqData2: any = {
                      "id": response6[0].id,
                      "leadTypeCount": response6[0].lead_type_count+1,
                    };
                    updateTotalLeadTypeSummaryData(reqData2,  (err: any, response7: any) => {
                      if (err) {
                        glogger('ERR', ""+req.body.callSessionId+"", '/mobileapp/'+req.params.id+'/setUniqueCalls/', "updateTotalLeadTypeSummaryData, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        
                      }
                    });
                  } else {
                    insertTotalLeadTypeSummaryData(reqData1, async (err: any, response7: any) => {
                      if (err) {
                        glogger('ERR', ""+req.body.callSessionId+"", '/mobileapp/'+req.params.id+'/setUniqueCalls/', "insertTotalLeadTypeSummaryData, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        
                      }
                    });
                  }
                }
              });*/
              
              checkTotalLeadCitySummaryExist(reqData1, (err: any, response7: any) => {
                if (err) {
                  glogger('ERR', ""+req.body.callSessionId+"", '/mobileapp/'+req.params.id+'/setUniqueCalls/', "checkTotalLeadCitySummaryExist, error:"+err);
                  return ErrorEmptyResponse(res, err);
                } else {
                  if(response7.length > 0){
                    let reqData2: any = {
                      "id": response7[0].id,
                      "leadCityCount": response7[0].lead_city_count+1,
                    };
                    updateTotalLeadCitySummaryData(reqData2,  (err: any, response8: any) => {
                      if (err) {
                        glogger('ERR', ""+req.body.callSessionId+"", '/mobileapp/'+req.params.id+'/setUniqueCalls/', "updateTotalLeadCitySummaryData, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        
                      }
                    });
                  } else {
                    insertTotalLeadCitySummaryData(reqData1, async (err: any, response8: any) => {
                      if (err) {
                        glogger('ERR', ""+req.body.callSessionId+"", '/mobileapp/'+req.params.id+'/setUniqueCalls/', "insertTotalLeadCitySummaryData, error:"+err);
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
        
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};


export const getLeadCustomerDetails = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
      customerNumber: req.body.customerNumber,
      initialRecord: req.body.initialRecord ? req.body.initialRecord : "",
      mode: req.body.mode ? req.body.mode : "",
      batchSize: req.body.batchSize ? req.body.batchSize : 20,
    };

    let responseData: any = {};

    await FindCustomerAddressbookDetail(reqData, (err: any, responseAddr: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        responseData["addressBook"] = responseAddr;
        customerLeadDetailTotalCalls(reqData, (err: any, responseTotalCalls: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
            responseData["totalCalls"] = responseTotalCalls;
            return SuccessResponse(res, "Successfully listed", responseData);
          }
        });
        
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const getLeadSource = async (req: Request, res: Response) => {
  try {
    let reqData: getLeadSourceRequest = {
      smeId: parseInt(req.params.id),
    };
    
    await getLeadSourceData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};

// export const addLeadSource = async (req: Request, res: Response) => {
//   try {
//     let currentDate = Date();
//     let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
//     let reqData: any = {
//       smeId: parseInt(req.params.id),
//       leadSource: req.body.source,
//       description: req.body.description,
//       insertDateTime: getCurrentDate,
//       status: req.body.status ? req.body.status : 1
//     };
    
//     await addLeadSourceData(reqData, (err: any, response: any) => {
//       if (err) {
//         return ErrorEmptyResponse(res, err);
//       } else {
//         return SuccessResponse(res, "Successfully Added", response);
//       }
//     });
//   } catch (e) {
//     if(env.NODE_ENV_ERROR_LOG == "yes"){
//       loggerFileError.error(e);
//       loggerFileError.error(req.originalUrl);
//       loggerFileError.error(req.body);
//     }
//     logger.error(e);
//     ErrorResponse(res, e);
//   }
// };

// export const deleteLeadSource = async (req: Request, res: Response) => {
//   try {
//     let reqData: any = {
//       smeId: parseInt(req.params.id),
//       sourceId: req.body.sourceId,
//       status: req.body.status,
//       updateDateTime: req.body.updateDateTime,
//     };
    
//     await deleteLeadSourceData(reqData, (err: any, response: any) => {
//       if (err) {
//         return ErrorEmptyResponse(res, err);
//       } else {
//         return SuccessResponse(res, "Source deleted Successfully", response);
//       }
//     });
//   } catch (e) {
//     if(env.NODE_ENV_ERROR_LOG == "yes"){
//       loggerFileError.error(e);
//       loggerFileError.error(req.originalUrl);
//       loggerFileError.error(req.body);
//     }
//     logger.error(e);
//     ErrorResponse(res, e);
//   }
// };

// export const editLeadSource = async (req: Request, res: Response) => {
//   try {
//     let reqData: any = {
//       smeId: parseInt(req.params.id),
//       source: req.body.source,
//       description: req.body.description,
//       sourceId: req.body.sourceId,
//       updateDateTime: req.body.updateDateTime,
//     };
    
//     await editLeadSourceData(reqData, (err: any, response: any) => {
//       if (err) {
//         return ErrorEmptyResponse(res, err);
//       } else {
//         return SuccessResponse(res, "Source updated Successfully", response);
//       }
//     });
//   } catch (e) {
//     if(env.NODE_ENV_ERROR_LOG == "yes"){
//       loggerFileError.error(e);
//       loggerFileError.error(req.originalUrl);
//       loggerFileError.error(req.body);
//     }
//     logger.error(e);
//     ErrorResponse(res, e);
//   }
// };

export const getLeadDetailProduct = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
      customerNumber: req.body.customerNumber,
      initialRecord: req.body.initialRecord ? req.body.initialRecord : 0,
      mode: req.body.mode ? req.body.mode : "",
      batchSize: req.body.batchSize ? req.body.batchSize : 20,
    };

    await FindProductsActivity(reqData, (err: any, responseProducts: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", responseProducts);
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const getLeadDetailNotes = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
      customerNumber: req.body.customerNumber,
      initialRecord: req.body.initialRecord ? req.body.initialRecord : 0,
      mode: req.body.mode ? req.body.mode : "",
      batchSize: req.body.batchSize ? req.body.batchSize : 20,
    };

    FindCustomerNotes(reqData, (err: any, responseNotes: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", responseNotes);
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};

// export const getLeadDetailRemarks = async (req: Request, res: Response) => {
//   try {
//     let reqData: fetchLeadCustomerDetailRequest = {
//       id: parseInt(req.params.id),
//       customerNumber: req.body.customerNumber,
//       offset: req.body.offset ? req.body.offset : "",
//       mode: req.body.mode ? req.body.mode : "",
//     };

//     FindCustomerRemarks(reqData, (err: any, responseremarks: any) => {
//       if (err) {
//         return ErrorEmptyResponse(res, err);
//       } else {
//         return SuccessResponse(res, "Successfully listed", responseremarks);
        
//       }
//     });
//   } catch (e) {
//     if(env.NODE_ENV_ERROR_LOG == "yes"){
//       loggerFileError.error(e);
//       loggerFileError.error(req.originalUrl);
//       loggerFileError.error(req.body);
//     }
//     logger.error(e);
//     ErrorResponse(res, e);
//   }
// };

export const getLeadDetailCalls = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
      customerNumber: req.body.customerNumber,
      initialRecord: req.body.initialRecord ? req.body.initialRecord : 0,
      mode: req.body.mode ? req.body.mode : "",
      batchSize: req.body.batchSize ? req.body.batchSize : 20,
    };

    FindCustomerCalls(reqData, (err: any, responseCalls: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", responseCalls);
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};

// export const getTotalLeadStatusSummary = async (req: Request, res: Response) => {
//   try {
//     let currentDate = Date();
//     let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
//     let reqData: any = {
//       smeId: parseInt(req.params.id),
//       agentId: req.body.agentId ? req.body.agentId : "",
//       currentDate: getCurrentDate
//     };

//     getTotalLeadStatusSummaryData(reqData, (err: any, response: any) => {
//       if (err) {
//         return ErrorEmptyResponse(res, err);
//       } else {
//         if (response.length > 0) {
//           getTodayLeadStatusSummaryData(reqData, (err: any, response1: any) => {
//             if (err) {
//               return ErrorEmptyResponse(res, err);
//             } else {
//               response1 = response1;
//               return SuccessResponseWithCount(res, "Successfully listed", response, response1);
//             }
//           });
//         } else {
//           return SuccessResponseWithCount(res, "Successfully listed", response, 0);
//         }
//       }
//     });
//   } catch (e) {
//     if(env.NODE_ENV_ERROR_LOG == "yes"){
//       loggerFileError.error(e);
//       loggerFileError.error(req.originalUrl);
//       loggerFileError.error(req.body);
//     }
//     logger.error(e);
//     ErrorResponse(res, e);
//   }
// };

// export const getTotalLeadSourceSummary = async (req: Request, res: Response) => {
//   try {
//     let currentDate = Date();
//     let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
//     let reqData: any = {
//       smeId: parseInt(req.params.id),
//       agentId: req.body.agentId ? req.body.agentId : "",
//       currentDate: getCurrentDate
//     };

//     getTotalLeadSourceSummaryData(reqData, (err: any, response: any) => {
//       if (err) {
//         return ErrorEmptyResponse(res, err);
//       } else {
//         if (response.length > 0) {
//           getTodayLeadSourceSummaryData(reqData, (err: any, response1: any) => {
//             if (err) {
//               return ErrorEmptyResponse(res, err);
//             } else {
//               response1 = response1;
//               return SuccessResponseWithCount(res, "Successfully listed", response, response1);
//             }
//           });
//         } else {
//           return SuccessResponseWithCount(res, "Successfully listed", response, 0);
//         }
//       }
//     });
//   } catch (e) {
//     if(env.NODE_ENV_ERROR_LOG == "yes"){
//       loggerFileError.error(e);
//       loggerFileError.error(req.originalUrl);
//       loggerFileError.error(req.body);
//     }
//     logger.error(e);
//     ErrorResponse(res, e);
//   }
// };

// export const getTotalLeadProductSummary = async (req: Request, res: Response) => {
//   try {
//     let currentDate = Date();
//     let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
//     let reqData: any = {
//       smeId: parseInt(req.params.id),
//       agentId: req.body.agentId ? req.body.agentId : "",
//       currentDate: getCurrentDate
//     };

//     getTotalLeadProductSummaryData(reqData, (err: any, response: any) => {
//       if (err) {
//         return ErrorEmptyResponse(res, err);
//       } else {
//         if (response.length > 0) {
//           getTodayLeadProductSummaryData(reqData, (err: any, response1: any) => {
//             if (err) {
//               return ErrorEmptyResponse(res, err);
//             } else {
//               response1 = response1;
//               return SuccessResponseWithCount(res, "Successfully listed", response, response1);
//             }
//           });
//         } else {
//           return SuccessResponseWithCount(res, "Successfully listed", response, 0);
//         }
//       }
//     });
//   } catch (e) {
//     if(env.NODE_ENV_ERROR_LOG == "yes"){
//       loggerFileError.error(e);
//       loggerFileError.error(req.originalUrl);
//       loggerFileError.error(req.body);
//     }
//     logger.error(e);
//     ErrorResponse(res, e);
//   }
// };

// export const getTotalLeadTypeSummary = async (req: Request, res: Response) => {
//   try {
//     let reqData: any = {
//       smeId: parseInt(req.params.id),
//       agentId: req.body.agentId ? req.body.agentId : ""
//     };

//     getTotalLeadTypeSummaryData(reqData, (err: any, response: any) => {
//       if (err) {
//         return ErrorEmptyResponse(res, err);
//       } else {
//         return SuccessResponse(res, "Successfully listed", response);
//       }
//     });
//   } catch (e) {
//     if(env.NODE_ENV_ERROR_LOG == "yes"){
//       loggerFileError.error(e);
//       loggerFileError.error(req.originalUrl);
//       loggerFileError.error(req.body);
//     }
//     logger.error(e);
//     ErrorResponse(res, e);
//   }
// };

// export const getTotalLeadFollowupSummary = async (req: Request, res: Response) => {
//   try {
//     let reqData: any = {
//       smeId: parseInt(req.params.id),
//       agentId: req.body.agentId ? req.body.agentId : ""
//     };

//     getTotalLeadFollowupSummaryData(reqData, (err: any, response: any) => {
//       if (err) {
//         return ErrorEmptyResponse(res, err);
//       } else {
//         return SuccessResponse(res, "Successfully listed", response);
//       }
//     });
//   } catch (e) {
//     if(env.NODE_ENV_ERROR_LOG == "yes"){
//       loggerFileError.error(e);
//       loggerFileError.error(req.originalUrl);
//       loggerFileError.error(req.body);
//     }
//     logger.error(e);
//     ErrorResponse(res, e);
//   }
// };

export const addTotalLeadSummaryData = async () => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqDateTime: any = {
      currentDate: getCurrentDate,
    };
    /*await getTotalLeadStatusData(null, async (err: any, response: any) => {
      if (err) {
        glogger("ERR", "Cron", "getTotalLeadStatusData", err);
      } else {
        if (response.length > 0) {
          for (let data of response) {
            let reqData: any = {
              "smeId": data.sme_id,
              "agentId": data.recent_patched_agent_id,
              "leadStatus": data.lead_status,
              "leadStatusCount": data.lead_status_count,
              "insertDateTime": getCurrentDate,
            }; 
            await insertTotalLeadStatusSummaryData(reqData, async (err: any, response3: any) => {
              if (err) {
                glogger("ERR", "Cron", "insertTotalLeadStatusSummaryData", err);
              } else {
                
              }
            });
          }
        }
      }
    });*/

    /*await getTotalLeadSourceData(null, async (err: any, response: any) => {
      if (err) {
        glogger("ERR", "Cron", "getTotalLeadSourceData", err);
      } else {
        if (response.length > 0) {
          for (let data of response) {
            let reqData: any = {
              "smeId": data.sme_id,
              "agentId": data.recent_patched_agent_id,
              "sourceId": data.source_id,
              "leadSourceCount": data.lead_source_count,
              "insertDateTime": getCurrentDate,
            }; 
            await insertTotalLeadSourceSummaryData(reqData, async (err: any, response3: any) => {
              if (err) {
                glogger("ERR", "Cron", "insertTotalLeadSourceSummaryData", err);
              } else {
                
              }
            });
          }
        }
      }
    });*/

    /*await getTotalLeadProductData(null, async (err: any, response: any) => {
      if (err) {
        glogger("ERR", "Cron", "getTotalLeadProductData", err);
      } else {
        if (response.length > 0) {
          for (let data of response) {
            let reqData: any = {
              "smeId": data.sme_id,
              "agentId": data.recent_patched_agent_id,
              "productId": data.product_id,
              "leadProductCount": data.lead_product_count,
              "insertDateTime": getCurrentDate,
            }; 
            await insertTotalLeadProductSummaryData(reqData, async (err: any, response3: any) => {
              if (err) {
                glogger("ERR", "Cron", "insertTotalLeadProductSummaryData", err);
              } else {
                
              }
            });
          }
        }
      }
    });*/

    /*await getTotalLeadTypeData(null, async (err: any, response: any) => {
      if (err) {
        glogger("ERR", "Cron", "getTotalLeadTypeData", err);
      } else {
        if (response.length > 0) {
          for (let data of response) {
            let reqData: any = {
              "smeId": data.sme_id,
              "agentId": data.recent_patched_agent_id,
              "leadType": data.lead_type,
              "leadTypeCount": data.lead_type_count,
              "insertDateTime": getCurrentDate,
            }; 
            await insertTotalLeadTypeSummaryData(reqData, async (err: any, response3: any) => {
              if (err) {
                glogger("ERR", "Cron", "insertTotalLeadTypeSummaryData", err);
              } else {
                
              }
            });
          }
        }
      }
    });*/

    /*await getTotalLeadCityData(null, async (err: any, response: any) => {
      if (err) {
        glogger("ERR", "Cron", "getTotalLeadCityData", err);
      } else {
        if (response.length > 0) {
          for (let data of response) {
            let reqData: any = {
              "smeId": data.sme_id,
              "agentId": data.recent_patched_agent_id,
              "cityId": data.city_id,
              "leadCityCount": data.lead_city_count,
              "insertDateTime": getCurrentDate,
            }; 
            await insertTotalLeadCitySummaryData(reqData, async (err: any, response3: any) => {
              if (err) {
                glogger("ERR", "Cron", "insertTotalLeadCitySummaryData", err);
              } else {
                
              }
            });
          }
        }
      }
    });*/
  } catch (e) {
    logger.error(e);
  }
};

export const getLeadStatus = async (req: Request, res: Response) => {
  try {
    let reqData: getLeadStatusRequest = {
      smeId: parseInt(req.params.id),
    };
    
    await getLeadStatusData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};

// export const addLeadStatus = async (req: Request, res: Response) => {
//   try {
//     let currentDate = Date();
//     let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
//     let reqData: any = {
//       smeId: parseInt(req.params.id),
//       leadStatus: req.body.leadStatus,
//       description: req.body.description ? req.body.description : "",
//       insertDateTime: getCurrentDate,
//       status: req.body.status ? req.body.status : 1
//     };
    
//     await addLeadStatusData(reqData, (err: any, response: any) => {
//       if (err) {
//         return ErrorEmptyResponse(res, err);
//       } else {
//         return SuccessResponse(res, "Successfully Added", response);
//       }
//     });
//   } catch (e) {
//     if(env.NODE_ENV_ERROR_LOG == "yes"){
//       loggerFileError.error(e);
//       loggerFileError.error(req.originalUrl);
//       loggerFileError.error(req.body);
//     }
//     logger.error(e);
//     ErrorResponse(res, e);
//   }
// };

// export const deleteLeadStatus = async (req: Request, res: Response) => {
//   try {
//     let reqData: any = {
//       smeId: parseInt(req.params.id),
//       statusId: req.body.statusId,
//       status: req.body.status,
//       updateDateTime: req.body.updateDateTime,
//     };
    
//     await deleteLeadStatusData(reqData, (err: any, response: any) => {
//       if (err) {
//         return ErrorEmptyResponse(res, err);
//       } else {
//         return SuccessResponse(res, "Status deleted Successfully", response);
//       }
//     });
//   } catch (e) {
//     if(env.NODE_ENV_ERROR_LOG == "yes"){
//       loggerFileError.error(e);
//       loggerFileError.error(req.originalUrl);
//       loggerFileError.error(req.body);
//     }
//     logger.error(e);
//     ErrorResponse(res, e);
//   }
// };

// export const editLeadStatus = async (req: Request, res: Response) => {
//   try {
//     let reqData: any = {
//       smeId: parseInt(req.params.id),
//       leadStatus: req.body.leadStatus,
//       description: req.body.description,
//       statusId: req.body.statusId,
//       updateDateTime: req.body.updateDateTime,
//     };
    
//     await editLeadStatusData(reqData, (err: any, response: any) => {
//       if (err) {
//         return ErrorEmptyResponse(res, err);
//       } else {
//         return SuccessResponse(res, "Status updated Successfully", response);
//       }
//     });
//   } catch (e) {
//     if(env.NODE_ENV_ERROR_LOG == "yes"){
//       loggerFileError.error(e);
//       loggerFileError.error(req.originalUrl);
//       loggerFileError.error(req.body);
//     }
//     logger.error(e);
//     ErrorResponse(res, e);
//   }
// };

// export const getTotalLeadCitySummary = async (req: Request, res: Response) => {
//   try {
//     let currentDate = Date();
//     let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
//     let reqData: any = {
//       smeId: parseInt(req.params.id),
//       agentId: req.body.agentId ? req.body.agentId : "",
//       currentDate: getCurrentDate
//     };

//     getTotalLeadCitySummaryData(reqData, (err: any, response: any) => {
//       if (err) {
//         return ErrorEmptyResponse(res, err);
//       } else {
//         if (response.length > 0) {
//           getTodayLeadCitySummaryData(reqData, (err: any, response1: any) => {
//             if (err) {
//               return ErrorEmptyResponse(res, err);
//             } else {
//               response1 = response1;
//               return SuccessResponseWithCount(res, "Successfully listed", response, response1);
//             }
//           });
//         } else {
//           return SuccessResponseWithCount(res, "Successfully listed", response, 0);
//         }
//       }
//     });
//   } catch (e) {
//     if(env.NODE_ENV_ERROR_LOG == "yes"){
//       loggerFileError.error(e);
//       loggerFileError.error(req.originalUrl);
//       loggerFileError.error(req.body);
//     }
//     logger.error(e);
//     ErrorResponse(res, e);
//   }
// };





export const getUniqueCalls = async (req: Request, res: Response) => {
  try {
      var g_startDate ='';
      var g_startDate_op ='';
      var g_endDate='';
      var g_endDate_op='';
      var g_duration='';
      var g_duration_op='';
      var customerNumber='';
      var customerNumber_op='';
      var agentNumber='';
      var agentNumber_op='';
      var agentName='';
      var agentName_op='';
      var answerStatus='';
      var answerStatus_op='';
      var cityId='';
      var cityId_op='';
      var productId='';
      var productId_op='';
      var leadType='';
      var leadType_op='';
      var customerName='';
      var customerName_op='';
      var productPrice='';
      var productPrice_op='';
      var leadStatus='';
      var leadStatus_op='';
      var agentId='';
      var agentId_op='';
      var sourceId='';
      var sourceId_op='';
      var campaignId='';
      var campaignId_op='';
      var searchLeads='';
      var searchLeads_op='';
      var sortLeadDateVar='';
      var sortLeadDateVar_op='';
      var companyName='';
      var companyName_op='';
      var uniqueId='';
      var uniqueId_op='';

      if (req.body.filterList) {
          var getUniqueCallsData = req.body.filterList;
          for (let data of getUniqueCallsData) {
              if(data["name"] =="startDate"){
                  g_startDate = data["val"];
                  g_startDate_op = data["op"];
              }

              if(data["name"] =="endDate"){
                  g_endDate = data["val"];
                  g_endDate_op = data["op"];
              }

              if(data["name"] =="duration"){
                  g_duration = data["val"];
                  g_duration_op = data["op"];
              }

              if(data["name"] =="customer_number"){
                customerNumber = data["val"];
                customerNumber_op = data["op"];
              }

              if(data["name"] =="agentNumber"){
                agentNumber = data["val"];
                agentNumber_op = data["op"];
              }

              if(data["name"] =="agentName"){
                agentName = data["val"];
                agentName_op = data["op"];
              }

              if(data["name"] =="answer"){
                answerStatus = data["val"];
                answerStatus_op = data["op"];
              }

              if(data["name"] =="cityId"){
                cityId = data["val"];
                cityId_op = data["op"];
              }

              if(data["name"] =="productId"){
                productId = data["val"];
                productId_op = data["op"];
              }

              if(data["name"] =="lead_type"){
                leadType = data["val"];
                leadType_op = data["op"];
              }

              if(data["name"] =="customer_name"){
                customerName = data["val"];
                customerName_op = data["op"];
              }

              if(data["name"] =="product_price"){
                productPrice = data["val"];
                productPrice_op = data["op"];
              }

              if(data["name"] =="lead_status"){
                leadStatus = data["val"];
                leadStatus_op = data["op"];
              }

              if(data["name"] =="agentId"){
                agentId = data["val"];
                agentId_op = data["op"];
              }

              if(data["name"] =="lead_source"){
                sourceId = data["val"];
                sourceId_op = data["op"];
              }

              if(data["name"] =="campaignId"){
                campaignId = data["val"];
                campaignId_op = data["op"];
              }

              if(data["name"] =="searchLeads"){
                searchLeads = data["val"];
                searchLeads_op = data["op"];
              }

              if(data["name"] =="sortLeadDateVar"){
                sortLeadDateVar = data["val"];
                sortLeadDateVar_op = data["op"];
              }

              if(data["name"] =="company_name"){
                companyName = data["val"];
                companyName_op = data["op"];
              }

              if(data["name"] =="unique_id"){
                uniqueId = data["val"];
                uniqueId_op = data["op"];
              }
          }
      }
      
     
    let reqData: any = {
      id: parseInt(req.params.id),
      isDownload: req.body.isDownload,
      initialRecord:req.body.initialRecord,
      batchSize: req.body.batchSize,
      startDate: g_startDate,
      startDate_op: g_startDate_op,
      endDate: g_endDate,
      endDate_op: g_endDate_op,
      duration: g_duration,
      duration_op: g_duration_op,
      customerNumber: customerNumber,
      customerNumber_op: customerNumber_op,
      agentNumber: agentNumber,
      agentNumber_op: agentNumber_op,
      agentName: agentName,
      agentName_op: agentName_op,
      answerStatus: answerStatus,
      answerStatus_op: answerStatus_op,
      cityId: cityId,
      cityId_op: cityId_op,
      productId: productId,
      productId_op: productId_op,
      leadType: leadType,
      leadType_op: leadType_op,
      customerName: customerName,
      customerName_op: customerName_op,
      productPrice: productPrice,
      productPrice_op: productPrice_op,
      leadStatus: leadStatus,
      leadStatus_op: leadStatus_op,
      agentId: agentId,
      agentId_op: agentId_op,
      sourceId: sourceId,
      sourceId_op: sourceId_op,
      campaignId: campaignId,
      campaignId_op: campaignId_op,
      searchLeads: searchLeads,
      searchLeads_op: searchLeads_op,
      sortLeadDateVar: sortLeadDateVar,
      sortLeadDateVar_op: sortLeadDateVar_op,
      companyName: companyName,
      companyName_op: companyName_op,
      uniqueId: uniqueId,
      uniqueId_op: uniqueId_op
    };

    await GetUniqueCalls(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          return SuccessResponseWithCount(res, "Successfully listed", response, response.length);
        } else {
          return SuccessResponseWithCount(res, "Successfully listed", response, 0);
        }
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const getScheduledCalls = async (req: Request, res: Response) => {
  try {

    var g_insertDateTime ='';
    var g_insertDateTime_op ='';
    var agent_id ='';
    var agent_id_op ='';
    
    if (req.body.filterList) {
      var filterData = req.body.filterList;
      for (let data of filterData) {
        if(data["name"] =="insertDateTime"){
          g_insertDateTime = data["val"];
          g_insertDateTime_op = data["op"];
        }

        if(data["name"] == "agent_id"){
          agent_id = data["val"];
          agent_id_op = data["op"];
        }
      }
    }
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agent_id ? req.body.agent_id : agent_id,
      insertDateTime: getCurrentDate,
      customerNumber: req.body.customerNumber ? req.body.customerNumber : "",
      initialRecord: req.body.initialRecord ? req.body.initialRecord : 1,
      batchSize: req.body.batchSize ? req.body.batchSize : 60,
    };

    let responseData: any = {};
    await getScheduledCallsPastData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        responseData["pastSchedule"] = response;
        getScheduledCallsTodayData(reqData, (err: any, response1: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
            responseData["todaySchedule"] = response1;
            getScheduledCallsUpcomingData(reqData, (err: any, response2: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                responseData["upcomingSchedule"] = response2;
                return SuccessResponse(res, "Successfully listed", responseData);
              }
            });
          }
        });
      }
    });
  } catch (e) {
    if (env.NODE_ENV_ERROR_LOG == "yes") {
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};


export const getAddressbookDetail = async (req: Request, res: Response) => {
  try {

    var g_agentId = "";
    var companyName = "";
    var companyName_op = "";
    var customerName = "";
    var customerName_op = "";
    var customerNumber = "";
    var customerNumber_op = "";

    if (req.body.customer_number_primary) {
      customerNumber = req.body.customer_number_primary;
    }

    if (req.body.filterList) {
      var filterData = req.body.filterList;
      for (let data of filterData) {
        if (data["name"] == "agentId") {
          g_agentId = data["val"];
        }

        if (data["name"] == "company_name") {
          companyName = data["val"];
          companyName_op = data["op"];
        }

        if (data["name"] == "customer_name") {
          customerName = data["val"];
          customerName_op = data["op"];
        }
        if (data["name"] == "customer_number_primary") {
          customerNumber = data["val"];
          customerNumber_op = data["op"];
        }
      }
    }
    let reqData: any = {
      id: parseInt(req.params.id),
      agent_id: g_agentId,
      companyName: companyName,
      companyName_op: companyName_op,
      customerName: customerName,
      customerName_op: customerName_op,
      customer_number: customerNumber,
      customerNumber_op: customerNumber_op,
      initialRecord: req.body.initialRecord,
      batchSize: req.body.batchSize,
    };
    await FindAddressbookDetail(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          return SuccessResponseWithCount(res, "Successfully listed", response, 0);
        } else {
          return SuccessResponseWithCount(res, "Successfully listed", response, 0);
        }
      }
    });
  } catch (e) {
    logger.error(e);
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    ErrorResponse(res, e);
  }
};

export const setAddressbookDetail = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      customer_number: req.body.customer_number_primary.toString().trim(),
      customer_name: req.body.customer_name ? req.body.customer_name : "",
      company_name: req.body.company_name ? req.body.company_name : "",
      email_id: req.body.email_id ? req.body.email_id : "",
      address: req.body.address ? req.body.address : "",
      city: req.body.city ? req.body.city : "",
      created_by: req.body.created_by ? req.body.created_by : 0,
      status: req.body.status ? req.body.status : 1,
      insertDateTime: req.body.insertDateTime,
      id: req.body.id ? req.body.id : "",
    };
    await checkAddressBookCustomerExist(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response && response.length > 0) {
          updateAddressBookCustomer(reqData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Successfully Updated", response);
            }
          });
        } else { 
          addAddressBookCustomer(reqData, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              return SuccessResponse(res, "Successfully Added to Blacklist", response);
            }
          });
        }
      }
    });
  } catch (e) {
    logger.error(e);
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    ErrorResponse(res, e);
  }
};

export const updateUniqueCalls = async (req: Request, res: Response) => {
  try {
    
    let reqData: any = {
      id: parseInt(req.params.id),
      smeId: parseInt(req.params.id),
      callId: parseInt(req.body.id),
      cityId: req.body.cityId ? req.body.cityId : 0,
      productId: req.body.productId ? parseInt(req.body.productId) : 0,
      productPrice: req.body.productPrice ? parseInt(req.body.productPrice) : 0,
      leadAssignedAgent: req.body.leadAssignedAgent ? parseInt(req.body.leadAssignedAgent) : 0,
      leadType: req.body.leadType ? req.body.leadType : 0,
      leadStatus: req.body.leadStatus ? req.body.leadStatus : 0,
      customerName: req.body.customerName ? req.body.customerName : "",
      insertDateTime : req.body.insertDateTime,
      sourceId: req.body.sourceId ? req.body.sourceId : 0,
      oldValue: req.body.oldValue,
      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
      leadStatusCount: 1,
      leadSourceCount: 1,
      leadProductCount: 1,
      leadTypeCount: 1,
      leadCityCount: 1,
    };

    await UpdateUniqueCall(reqData, async(err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        /* Get Total Lead Status Summary data*/
        if(req.body && req.body.field && req.body.field == "lead_status") {
          await checkTotalLeadStatusSummaryExist(reqData, async(err: any, response2: any) => {
            if (err) {
              glogger('ERR', "", '/mobileapp/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadStatusSummaryExist, error:"+err);
              return ErrorEmptyResponse(res, err);
            } else {
              if(response2.length > 0){
                let reqData2: any = {
                  "id": response2[0].id,
                  "leadStatusCount": response2[0].lead_status_count+1,
                };
                await updateTotalLeadStatusSummaryData(reqData2,  async(err: any, response3: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadSummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      leadStatus: req.body.oldValue ? req.body.oldValue : '',
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadStatusSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadStatusSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_status_count > 0){
                          let reqData3: any = {
                            "id": response5[0].id,
                            "leadStatusCount": response5[0].lead_status_count-1,
                          };
                          await updateTotalLeadStatusSummaryData(reqData3,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
                            }
                          });
                        }
                      }
                    });
                  }
                });
              } else {
                await insertTotalLeadStatusSummaryData(reqData, async (err: any, response4: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "insertTotalLeadSummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      leadStatus: req.body.oldValue ? req.body.oldValue : '',
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadStatusSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadStatusSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_status_count > 0){
                          let reqData4: any = {
                            "id": response5[0].id,
                            "leadStatusCount": response5[0].lead_status_count-1,
                          };
                          await updateTotalLeadStatusSummaryData(reqData4,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
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
        }

        /* Get Total Lead Source Summary data*/
        if(req.body && req.body.field && req.body.field == "lead_source") {
          await checkTotalLeadSourceSummaryExist(reqData, async(err: any, response2: any) => {
            if (err) {
              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadSourceSummaryExist, error:"+err);
              return ErrorEmptyResponse(res, err);
            } else {
              if(response2.length > 0){
                let reqData2: any = {
                  "id": response2[0].id,
                  "leadSourceCount": response2[0].lead_source_count+1,
                };
                await updateTotalLeadSourceSummaryData(reqData2,  async(err: any, response3: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadSourceSummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      sourceId: req.body.oldValue,
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadSourceSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadSourceSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_source_count > 0){
                          let reqData3: any = {
                            "id": response5[0].id,
                            "leadSourceCount": response5[0].lead_source_count-1,
                          };
                          await updateTotalLeadSourceSummaryData(reqData3,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadSourceSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
                            }
                          });
                        }
                      }
                    });
                  }
                });
              } else {
                await insertTotalLeadSourceSummaryData(reqData, async (err: any, response4: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "insertTotalLeadSourceSummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      sourceId: req.body.oldValue ? req.body.oldValue : '',
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadSourceSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadSourceSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_source_count > 0){
                          let reqData3: any = {
                            "id": response5[0].id,
                            "leadSourceCount": response5[0].lead_source_count-1,
                          };
                          await updateTotalLeadSourceSummaryData(reqData3,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadSourceSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
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
        }

        /* Get Total Lead Product Summary data*/
        if(req.body && req.body.field && req.body.field == "product") {
          await checkTotalLeadProductSummaryExist(reqData, async(err: any, response2: any) => {
            if (err) {
              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadProductSummaryExist, error:"+err);
              return ErrorEmptyResponse(res, err);
            } else {
              if(response2.length > 0){
                let reqData2: any = {
                  "id": response2[0].id,
                  "leadProductCount": response2[0].lead_product_count+1,
                };
                await updateTotalLeadProductSummaryData(reqData2,  async(err: any, response3: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadProductSummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      productId: req.body.oldValue,
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadProductSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadProductSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_product_count > 0){
                          let reqData3: any = {
                            "id": response5[0].id,
                            "leadProductCount": response5[0].lead_product_count-1,
                          };
                          await updateTotalLeadProductSummaryData(reqData3,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadProductSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
                            }
                          });
                        }
                      }
                    });
                  }
                });
              } else {
                await insertTotalLeadProductSummaryData(reqData, async (err: any, response4: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "insertTotalLeadProductSummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      productId: req.body.oldValue,
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadProductSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadProductSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_product_count > 0){
                          let reqData3: any = {
                            "id": response5[0].id,
                            "leadProductCount": response5[0].lead_product_count-1,
                          };
                          await updateTotalLeadProductSummaryData(reqData3,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadProductSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
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
        }

        /* Get Total Lead Type Summary data*/
        if(req.body && req.body.field && req.body.field == "lead_type") {
          await checkTotalLeadTypeSummaryExist(reqData, async(err: any, response2: any) => {
            if (err) {
              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadTypeSummaryExist, error:"+err);
              return ErrorEmptyResponse(res, err);
            } else {
              if(response2.length > 0){
                let reqData2: any = {
                  "id": response2[0].id,
                  "leadTypeCount": response2[0].lead_type_count+1,
                };
                await updateTotalLeadTypeSummaryData(reqData2,  async(err: any, response3: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadTypeSummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      leadType: req.body.oldValue ? req.body.oldValue : '',
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadTypeSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadTypeSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_type_count > 0){
                          let reqData3: any = {
                            "id": response5[0].id,
                            "leadTypeCount": response5[0].lead_type_count-1,
                          };
                          await updateTotalLeadTypeSummaryData(reqData3,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadTypeSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
                            }
                          });
                        }
                      }
                    });
                  }
                });
              } else {
                await insertTotalLeadTypeSummaryData(reqData, async (err: any, response4: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "insertTotalLeadTypeSummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      leadType: req.body.oldValue ? req.body.oldValue : '',
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadTypeSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadTypeSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_type_count > 0){
                          let reqData4: any = {
                            "id": response5[0].id,
                            "leadTypeCount": response5[0].lead_type_count-1,
                          };
                          await updateTotalLeadTypeSummaryData(reqData4,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadTypeSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
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
        }

        /* Get Total Lead City Summary data*/
        if(req.body && req.body.field && req.body.field == "city") {
          await checkTotalLeadCitySummaryExist(reqData, async(err: any, response2: any) => {
            if (err) {
              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadCitySummaryExist, error:"+err);
              return ErrorEmptyResponse(res, err);
            } else {
              if(response2.length > 0){
                let reqData2: any = {
                  "id": response2[0].id,
                  "leadCityCount": response2[0].lead_city_count+1,
                };
                await updateTotalLeadCitySummaryData(reqData2,  async(err: any, response3: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadCitySummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      cityId: req.body.oldValue,
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadCitySummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadCitySummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_city_count > 0){
                          let reqData3: any = {
                            "id": response5[0].id,
                            "leadCityCount": response5[0].lead_city_count-1,
                          };
                          await updateTotalLeadCitySummaryData(reqData3,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadCitySummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
                            }
                          });
                        }
                      }
                    });
                  }
                });
              } else {
                await insertTotalLeadCitySummaryData(reqData, async (err: any, response4: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "insertTotalLeadCitySummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      cityId: req.body.oldValue,
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadCitySummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadCitySummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_city_count > 0){
                          let reqData3: any = {
                            "id": response5[0].id,
                            "leadCityCount": response5[0].lead_city_count-1,
                          };
                          await updateTotalLeadCitySummaryData(reqData3,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadCitySummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
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
        }
        return SuccessResponse(res, "Successfully Updated", response);
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const masterApiSourceCityProductStatus = async (req: Request, res: Response) => {
  try {
    let reqData: getLeadStatusRequest = {
      smeId: parseInt(req.params.id),
    };
    let data: any = {};
    await getLeadStatusData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        data['leadStatus'] = response;
        getLeadSourceData(reqData, (err: any, response2: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
            data['leadSource'] = response2;
            let reqData2: any = {
              id: parseInt(req.params.id),
            };
            FindCities(reqData2, (err: any, response3: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
                data['cities'] = response3;
                FindProducts(reqData2, (err: any, response4: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    data['products'] = response4;
                    return SuccessResponse(res, "Successfully listed", data);
                  }
                });
              }
            });
          }
        });
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};


export const addCustomerNote = async (req: Request, res: Response) => {
  try {
    
    var created_by = 0;
    if(req.body.agentId) {
      created_by = parseInt(req.body.agentId);
    } else {
      created_by = parseInt(req.params.id);
    }
    let reqData: any = {
      id: parseInt(req.params.id),
      callDirection: req.body.callDirection ? req.body.callDirection : "",
      sessionId: req.body.sessionId ? req.body.sessionId : "",
      remarks: req.body.remarks,
      customerNumber: req.body.customerNumber ? req.body.customerNumber : "",
      createdBy: created_by,
      insertDateTime : req.body.insertDateTime,
      mode : req.body.callMode ? req.body.callMode : ""
    };

    await addCustomerNoteData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        var reqData1 = {
          "customerRemarksId": response[0]
        }
        updateUniqueRecentRemarks(reqData, reqData1, (err: any, response3: any) => {
          if (err) {
          } else {
          }
        });
        return SuccessResponse(res, "Customer note added successfully", response);
      }
    });
  } catch (e) {
    logger.error(e);
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    ErrorResponse(res, e);
  }
};


export const setFollowUpCall = async (req: Request, res: Response) => {
  try {

    let reqData: any = {
      sme_id: parseInt(req.params.id),
      agent_id: req.body.agentId ? req.body.agentId : 0,
      mobile: req.body.customerNumber,
      scheduleDateTime: req.body.scheduleDateTime,
      status: req.body.status,
      message: req.body.message ? req.body.message : "",
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : '0000:00:00 00:00:00'
    };

    await setFollowUpCallData(reqData, (err: any, response1: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response1) {
          followNumberExistInUniqueDetails(reqData,  (err: any, response2: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              if (response2 && response2.length > 0) {
                let where: any = { 'uniqueId': response2[0]['id'], 'lastInsertedId': response1[0] }
                updateUniqueCustomerData(where, reqData, (err: any, response3: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    return SuccessResponse(res, "Successfully schedule", response1);
                  }
                });
              } else {
                let reqInsertData: any = {
                  id: req.params.id,
                  recent_duration: req.body.recent_duration ? req.body.recent_duration : 0,
                  recent_via_longcode: req.body.recent_via_longcode ? req.body.recent_via_longcode : 0,
                  server_ip_address: req.body.ip ? req.body.ip : 0,
                  recent_patched_agent_id: req.body.recent_patched_agent_id ? req.body.recent_patched_agent_id : 0,
                  total_incoming_calls: req.body.total_incoming_calls ? req.body.total_incoming_calls : 0,
                  total_outgoing_calls: req.body.total_outgoing_calls ? req.body.total_outgoing_calls : 0,
                  lead_type: req.body.lead_type ? req.body.lead_type : "",
                  lead_status: req.body.lead_status ? req.body.lead_status : 0,
                  city_id: req.body.city_id ? req.body.city_id : 0,
                  product_id: req.body.product_id ? req.body.product_id : 0,
                  product_price: req.body.product_price ? req.body.product_price : 0,
                  assigned_agent_id: req.body.assigned_agent_id ? req.body.assigned_agent_id : 0,
                  connected_call_duration: req.body.connected_call_duration ? req.body.connected_call_duration : 0,
                  sticky_type: req.body.sticky_type ? req.body.sticky_type : 0,
                  insert_date_time: req.body.insertDateTime,
                  update_date_time: req.body.insertDateTime,
                  call_type: "SCHEDULE",
                  assigned_to: req.body.agentId,
                  customer_followup_id: response1[0],
                };
                insertUniqueCustomerData(reqInsertData, reqData, (err: any, response4: any) => {
                  if (err) {
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let currentDate = new Date();
                    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
                    let reqData1: any = {
                      "smeId": reqInsertData["id"],
                      "agentId": reqInsertData["recent_patched_agent_id"],
                      "leadStatus": '',
                      "sourceId": 0,
                      "productId": 0,
                      "leadType": '',
                      "insertDateTime": getCurrentDate,
                      "leadStatusCount": 1,
                      "leadSourceCount": 1,
                      "leadProductCount": 1,
                      "leadTypeCount": 1, 
                    }; 
                    checkTotalLeadStatusSummaryExist(reqData1, (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', ""+req.body.callSessionId+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "checkTotalLeadStatusSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0){
                          let reqData2: any = {
                            "id": response5[0].id,
                            "leadStatusCount": response5[0].lead_status_count+1,
                          };
                          updateTotalLeadStatusSummaryData(reqData2,  (err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', ""+req.body.callSessionId+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "updateTotalLeadStatusSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
                            }
                          });
                        } else {
                          insertTotalLeadStatusSummaryData(reqData1, async (err: any, response7: any) => {
                            if (err) {
                              glogger('ERR', ""+req.body.callSessionId+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "insertTotalLeadStatusSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
                            }
                          });
                        }
                      }
                    });

                    checkTotalLeadSourceSummaryExist(reqData1, (err: any, response6: any) => {
                      if (err) {
                        glogger('ERR', ""+req.body.callSessionId+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "checkTotalLeadSourceSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response6.length > 0){
                          let reqData2: any = {
                            "id": response6[0].id,
                            "leadSourceCount": response6[0].lead_source_count+1,
                          };
                          updateTotalLeadSourceSummaryData(reqData2,  (err: any, response7: any) => {
                            if (err) {
                              glogger('ERR', ""+req.body.callSessionId+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "updateTotalLeadSourceSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
                            }
                          });
                        } else {
                          insertTotalLeadSourceSummaryData(reqData1, async (err: any, response7: any) => {
                            if (err) {
                              glogger('ERR', ""+req.body.callSessionId+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "insertTotalLeadSourceSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
                            }
                          });
                        }
                      }
                    });

                    checkTotalLeadProductSummaryExist(reqData1, (err: any, response6: any) => {
                      if (err) {
                        glogger('ERR', ""+req.body.callSessionId+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "checkTotalLeadProductSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response6.length > 0){
                          let reqData2: any = {
                            "id": response6[0].id,
                            "leadProductCount": response6[0].lead_product_count+1,
                          };
                          updateTotalLeadProductSummaryData(reqData2,  (err: any, response7: any) => {
                            if (err) {
                              glogger('ERR', ""+req.body.callSessionId+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "updateTotalLeadProductSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
                            }
                          });
                        } else {
                          insertTotalLeadProductSummaryData(reqData1, async (err: any, response7: any) => {
                            if (err) {
                              glogger('ERR', ""+req.body.callSessionId+"", '/ivr/'+req.params.id+'/setUniqueCalls/', "insertTotalLeadProductSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
                            }
                          });
                        }
                      }
                    });

                    checkTotalLeadTypeSummaryExist(reqData1, (err: any, response6: any) => {
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
                    });
                    return SuccessResponse(res, "Successfully schedule", response1);
                  }
                });
              }
            }
          });

        }
      }
    });
  } catch (e) {
    if (env.NODE_ENV_ERROR_LOG == "yes") {
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};



export const masterApiupdateUniqueCallsAddress = async (req: Request, res: Response) => {
  try {
    
    let reqData: any = {
      id: parseInt(req.params.id),
      smeId: parseInt(req.params.id),
      callId: parseInt(req.body.id),
      cityId: req.body.cityId ? req.body.cityId : 0,
      productId: req.body.productId ? parseInt(req.body.productId) : 0,
      productPrice: req.body.productPrice ? parseInt(req.body.productPrice) : 0,
      leadAssignedAgent: req.body.leadAssignedAgent ? parseInt(req.body.leadAssignedAgent) : 0,
      leadType: req.body.leadType ? req.body.leadType : 0,
      leadStatus: req.body.leadStatus ? req.body.leadStatus : 0,
      customerName: req.body.customerName ? req.body.customerName : "",
      insertDateTime : req.body.insertDateTime,
      sourceId: req.body.sourceId ? req.body.sourceId : 0,
      oldValue: req.body.oldValue,
      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
      leadStatusCount: 1,
      leadSourceCount: 1,
      leadProductCount: 1,
      leadTypeCount: 1,
      leadCityCount: 1,
    };

    await UpdateUniqueCall(reqData, async(err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        /* Get Total Lead Status Summary data*/
        if(req.body && req.body.field && req.body.field == "lead_status") {
          await checkTotalLeadStatusSummaryExist(reqData, async(err: any, response2: any) => {
            if (err) {
              glogger('ERR', "", '/mobileapp/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadStatusSummaryExist, error:"+err);
              return ErrorEmptyResponse(res, err);
            } else {
              if(response2.length > 0){
                let reqData2: any = {
                  "id": response2[0].id,
                  "leadStatusCount": response2[0].lead_status_count+1,
                };
                await updateTotalLeadStatusSummaryData(reqData2,  async(err: any, response3: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadSummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      leadStatus: req.body.oldValue ? req.body.oldValue : '',
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadStatusSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadStatusSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_status_count > 0){
                          let reqData3: any = {
                            "id": response5[0].id,
                            "leadStatusCount": response5[0].lead_status_count-1,
                          };
                          await updateTotalLeadStatusSummaryData(reqData3,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
                            }
                          });
                        }
                      }
                    });
                  }
                });
              } else {
                await insertTotalLeadStatusSummaryData(reqData, async (err: any, response4: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "insertTotalLeadSummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      leadStatus: req.body.oldValue ? req.body.oldValue : '',
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadStatusSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadStatusSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_status_count > 0){
                          let reqData4: any = {
                            "id": response5[0].id,
                            "leadStatusCount": response5[0].lead_status_count-1,
                          };
                          await updateTotalLeadStatusSummaryData(reqData4,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
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
        }

        /* Get Total Lead Source Summary data*/
        if(req.body && req.body.field && req.body.field == "lead_source") {
          await checkTotalLeadSourceSummaryExist(reqData, async(err: any, response2: any) => {
            if (err) {
              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadSourceSummaryExist, error:"+err);
              return ErrorEmptyResponse(res, err);
            } else {
              if(response2.length > 0){
                let reqData2: any = {
                  "id": response2[0].id,
                  "leadSourceCount": response2[0].lead_source_count+1,
                };
                await updateTotalLeadSourceSummaryData(reqData2,  async(err: any, response3: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadSourceSummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      sourceId: req.body.oldValue,
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadSourceSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadSourceSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_source_count > 0){
                          let reqData3: any = {
                            "id": response5[0].id,
                            "leadSourceCount": response5[0].lead_source_count-1,
                          };
                          await updateTotalLeadSourceSummaryData(reqData3,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadSourceSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
                            }
                          });
                        }
                      }
                    });
                  }
                });
              } else {
                await insertTotalLeadSourceSummaryData(reqData, async (err: any, response4: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "insertTotalLeadSourceSummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      sourceId: req.body.oldValue ? req.body.oldValue : '',
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadSourceSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadSourceSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_source_count > 0){
                          let reqData3: any = {
                            "id": response5[0].id,
                            "leadSourceCount": response5[0].lead_source_count-1,
                          };
                          await updateTotalLeadSourceSummaryData(reqData3,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadSourceSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
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
        }

        /* Get Total Lead Product Summary data*/
        if(req.body && req.body.field && req.body.field == "product") {
          await checkTotalLeadProductSummaryExist(reqData, async(err: any, response2: any) => {
            if (err) {
              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadProductSummaryExist, error:"+err);
              return ErrorEmptyResponse(res, err);
            } else {
              if(response2.length > 0){
                let reqData2: any = {
                  "id": response2[0].id,
                  "leadProductCount": response2[0].lead_product_count+1,
                };
                await updateTotalLeadProductSummaryData(reqData2,  async(err: any, response3: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadProductSummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      productId: req.body.oldValue,
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadProductSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadProductSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_product_count > 0){
                          let reqData3: any = {
                            "id": response5[0].id,
                            "leadProductCount": response5[0].lead_product_count-1,
                          };
                          await updateTotalLeadProductSummaryData(reqData3,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadProductSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
                            }
                          });
                        }
                      }
                    });
                  }
                });
              } else {
                await insertTotalLeadProductSummaryData(reqData, async (err: any, response4: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "insertTotalLeadProductSummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      productId: req.body.oldValue,
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadProductSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadProductSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_product_count > 0){
                          let reqData3: any = {
                            "id": response5[0].id,
                            "leadProductCount": response5[0].lead_product_count-1,
                          };
                          await updateTotalLeadProductSummaryData(reqData3,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadProductSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
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
        }

        /* Get Total Lead Type Summary data*/
        if(req.body && req.body.field && req.body.field == "lead_type") {
          await checkTotalLeadTypeSummaryExist(reqData, async(err: any, response2: any) => {
            if (err) {
              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadTypeSummaryExist, error:"+err);
              return ErrorEmptyResponse(res, err);
            } else {
              if(response2.length > 0){
                let reqData2: any = {
                  "id": response2[0].id,
                  "leadTypeCount": response2[0].lead_type_count+1,
                };
                await updateTotalLeadTypeSummaryData(reqData2,  async(err: any, response3: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadTypeSummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      leadType: req.body.oldValue ? req.body.oldValue : '',
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadTypeSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadTypeSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_type_count > 0){
                          let reqData3: any = {
                            "id": response5[0].id,
                            "leadTypeCount": response5[0].lead_type_count-1,
                          };
                          await updateTotalLeadTypeSummaryData(reqData3,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadTypeSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
                            }
                          });
                        }
                      }
                    });
                  }
                });
              } else {
                await insertTotalLeadTypeSummaryData(reqData, async (err: any, response4: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "insertTotalLeadTypeSummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      leadType: req.body.oldValue ? req.body.oldValue : '',
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadTypeSummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadTypeSummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_type_count > 0){
                          let reqData4: any = {
                            "id": response5[0].id,
                            "leadTypeCount": response5[0].lead_type_count-1,
                          };
                          await updateTotalLeadTypeSummaryData(reqData4,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadTypeSummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
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
        }

        /* Get Total Lead City Summary data*/
        if(req.body && req.body.field && req.body.field == "city") {
          await checkTotalLeadCitySummaryExist(reqData, async(err: any, response2: any) => {
            if (err) {
              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadCitySummaryExist, error:"+err);
              return ErrorEmptyResponse(res, err);
            } else {
              if(response2.length > 0){
                let reqData2: any = {
                  "id": response2[0].id,
                  "leadCityCount": response2[0].lead_city_count+1,
                };
                await updateTotalLeadCitySummaryData(reqData2,  async(err: any, response3: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadCitySummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      cityId: req.body.oldValue,
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadCitySummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadCitySummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_city_count > 0){
                          let reqData3: any = {
                            "id": response5[0].id,
                            "leadCityCount": response5[0].lead_city_count-1,
                          };
                          await updateTotalLeadCitySummaryData(reqData3,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadCitySummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
                            }
                          });
                        }
                      }
                    });
                  }
                });
              } else {
                await insertTotalLeadCitySummaryData(reqData, async (err: any, response4: any) => {
                  if (err) {
                    glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "insertTotalLeadCitySummaryData, error:"+err);
                    return ErrorEmptyResponse(res, err);
                  } else {
                    let reqDataWithOldValue: any = {
                      smeId: parseInt(req.params.id),
                      cityId: req.body.oldValue,
                      agentId: req.body.recentPatchedAgentId ? req.body.recentPatchedAgentId : 0,
                    };
                    await checkTotalLeadCitySummaryExist(reqDataWithOldValue, async (err: any, response5: any) => {
                      if (err) {
                        glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "checkTotalLeadCitySummaryExist, error:"+err);
                        return ErrorEmptyResponse(res, err);
                      } else {
                        if(response5.length > 0 && response5[0].lead_city_count > 0){
                          let reqData3: any = {
                            "id": response5[0].id,
                            "leadCityCount": response5[0].lead_city_count-1,
                          };
                          await updateTotalLeadCitySummaryData(reqData3,  async(err: any, response6: any) => {
                            if (err) {
                              glogger('ERR', "", '/sme/'+req.params.id+'/UpdateUniqueCall/', "updateTotalLeadCitySummaryData, error:"+err);
                              return ErrorEmptyResponse(res, err);
                            } else {
                              
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
        }

        let reqData2: any = {
          smeId: parseInt(req.params.id),
          customer_number: req.body.customer_number_primary.toString().trim(),
          customer_name: req.body.customerName ? req.body.customerName : "",
          company_name: req.body.company_name ? req.body.company_name : "",
          email_id: req.body.email_id ? req.body.email_id : "",
          address: req.body.address ? req.body.address : "",
          city: req.body.city ? req.body.city : "",
          created_by: req.body.created_by ? req.body.created_by : 0,
          status: req.body.status ? req.body.status : 1,
          insertDateTime: req.body.insertDateTime,
          id: req.body.address_book_id ? req.body.address_book_id : "",
        };
        await checkAddressBookCustomerExist(reqData2, (err: any, response1: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
            if (response1 && response1.length > 0) {
              updateAddressBookCustomer(reqData2, (err: any, response: any) => {
                if (err) {
                  return ErrorEmptyResponse(res, err);
                } else {
                  return SuccessResponse(res, "Successfully Updated", response);
                }
              });
            } else { 
              addAddressBookCustomer(reqData2, (err: any, responseAddr: any) => {
                if (err) {
                  return ErrorEmptyResponse(res, err);
                } else {
                  if(responseAddr.length > 0){
                    let reqDataUpd : any ={
                      smeId: parseInt(req.params.id),
                     addressBookId :  responseAddr[0],
                     callId: parseInt(req.body.id),
                    }
                    UpdateUniqueCallAddressId(reqDataUpd, (err: any, response: any) => {
                      if (err) {
                        return ErrorEmptyResponse(res, err);
                      } else {
                        return SuccessResponse(res, "Successfully Updated", response);
                      }
                    });
                  }
                  
                }
              });
            }
          }
        });
      }
    });
  } catch (e) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.error(e);
      loggerFileError.error(req.originalUrl);
      loggerFileError.error(req.body);
    }
    logger.error(e);
    ErrorResponse(res, e);
  }
};
