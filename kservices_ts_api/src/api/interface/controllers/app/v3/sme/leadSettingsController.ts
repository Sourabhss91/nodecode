import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { glogger } from "../../../../../helpers/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, SuccessResponseWithCount } from "../../../../../helpers/apiResponse";
import {
  FindleadSettings,
  updateleadSettings,
  FindcallScheduleBase,
  FindCustomerAddressbookDetail,
  FindCustomerRemarks,
  FindCustomerCalls,
  FindProductsActivity,
  getLeadSourceData,
  addLeadSourceData,
  deleteLeadSourceData,
  editLeadSourceData,
  FindCustomerNotes,
  getTotalLeadStatusData,
  getTotalLeadSourceData,
  getTotalLeadProductData,
  getTotalLeadTypeData,
  customerLeadDetailTotalCalls,
  getTotalLeadStatusSummaryData,
  getTodayLeadStatusSummaryData,
  getTotalLeadSourceSummaryData,
  getTodayLeadSourceSummaryData,
  getTotalLeadProductSummaryData,
  getTodayLeadProductSummaryData,
  getTotalLeadTypeSummaryData,
  getTotalLeadFollowupSummaryData,
  getLeadStatusData,
  addLeadStatusData,
  deleteLeadStatusData,
  editLeadStatusData,
  getTotalLeadCityData,
  getTotalLeadCitySummaryData,
  getTodayLeadCitySummaryData,
  isdeletedAgentLeadExistData
} from "../../../../../domain/models/v3/sme.model";
import { insertTotalLeadStatusSummaryData, insertTotalLeadSourceSummaryData, insertTotalLeadProductSummaryData, insertTotalLeadTypeSummaryData, insertTotalLeadCitySummaryData  } from "../../../../../domain/models/v3/ivr.model";
import { fetchRequest, fetchLeadCustomerDetailRequest, updateLeadSettingsRequest, getLeadSourceRequest, getLeadStatusRequest} from "../../../../../domain/entities/v3/sme.entity";
import { env } from '../../../../../../infrastructure/env';
import { convertTimeZone } from "../../../../../helpers/utility";

/**
 * get settings.
 *
 * @returns {Object}
 */

export const getLeadSettings = async (req: Request, res: Response) => {
  try {
    let reqData: fetchRequest = {
      id: parseInt(req.params.id),
    };
    await FindleadSettings(reqData, (err: any, response: any) => {
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

export const setLeadSettings = async (req: Request, res: Response) => {
  try {
    let reqData: updateLeadSettingsRequest = {
      id: parseInt(req.params.id),
      leadColumns: req.body.leadColumns,
    };
    await updateleadSettings(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
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

export const getLeadCustomerDetails = async (req: Request, res: Response) => {
  try {
    let reqData: fetchLeadCustomerDetailRequest = {
      id: parseInt(req.params.id),
      customerNumber: req.body.customerNumber,
      offset: req.body.offset ? req.body.offset : "",
      mode: req.body.mode ? req.body.mode : "",
    };

    let responseData: any = {};

    await FindCustomerAddressbookDetail(reqData, (err: any, responseAddr: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        responseData["addressBook"] = responseAddr;
        return SuccessResponse(res, "Successfully listed", responseData);
        /*customerLeadDetailTotalCalls(reqData, (err: any, responseTotalCalls: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
            responseData["totalCalls"] = responseTotalCalls;
            return SuccessResponse(res, "Successfully listed", responseData);
          }
        });*/
        
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

export const addLeadSource = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      smeId: parseInt(req.params.id),
      leadSource: req.body.source,
      description: req.body.description,
      insertDateTime: getCurrentDate,
      status: req.body.status ? req.body.status : 1
    };
    
    await addLeadSourceData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Added", response);
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

export const deleteLeadSource = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      sourceId: req.body.sourceId,
      status: req.body.status,
      updateDateTime: req.body.updateDateTime,
    };
    
    await deleteLeadSourceData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Source deleted Successfully", response);
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

export const editLeadSource = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      source: req.body.source,
      description: req.body.description,
      sourceId: req.body.sourceId,
      updateDateTime: req.body.updateDateTime,
    };
    
    await editLeadSourceData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Source updated Successfully", response);
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

export const getLeadDetailProduct = async (req: Request, res: Response) => {
  try {
    let reqData: fetchLeadCustomerDetailRequest = {
      id: parseInt(req.params.id),
      customerNumber: req.body.customerNumber,
      offset: req.body.offset ? req.body.offset : "",
      mode: req.body.mode ? req.body.mode : "",
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
    let reqData: fetchLeadCustomerDetailRequest = {
      id: parseInt(req.params.id),
      customerNumber: req.body.customerNumber,
      offset: req.body.offset ? req.body.offset : "",
      mode: req.body.mode ? req.body.mode : "",
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

export const getLeadDetailRemarks = async (req: Request, res: Response) => {
  try {
    let reqData: fetchLeadCustomerDetailRequest = {
      id: parseInt(req.params.id),
      customerNumber: req.body.customerNumber,
      offset: req.body.offset ? req.body.offset : "",
      mode: req.body.mode ? req.body.mode : "",
    };

    FindCustomerRemarks(reqData, (err: any, responseremarks: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", responseremarks);
        
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

export const getLeadDetailCalls = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
      customerNumber: req.body.customerNumber,
      offset: req.body.offset ? req.body.offset : "",
      mode: req.body.mode ? req.body.mode : "",
      databaseMode: req.body.databaseMode ? req.body.databaseMode : "",
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

export const getTotalLeadStatusSummary = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agentId ? req.body.agentId : "",
      currentDate: getCurrentDate
    };

    getTotalLeadStatusSummaryData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          getTodayLeadStatusSummaryData(reqData, (err: any, response1: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              response1 = response1;
              return SuccessResponseWithCount(res, "Successfully listed", response, response1);
            }
          });
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

export const getTotalLeadSourceSummary = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agentId ? req.body.agentId : "",
      currentDate: getCurrentDate
    };

    getTotalLeadSourceSummaryData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          getTodayLeadSourceSummaryData(reqData, (err: any, response1: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              response1 = response1;
              return SuccessResponseWithCount(res, "Successfully listed", response, response1);
            }
          });
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

export const getTotalLeadProductSummary = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agentId ? req.body.agentId : "",
      currentDate: getCurrentDate
    };

    getTotalLeadProductSummaryData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          getTodayLeadProductSummaryData(reqData, (err: any, response1: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              response1 = response1;
              return SuccessResponseWithCount(res, "Successfully listed", response, response1);
            }
          });
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

export const getTotalLeadTypeSummary = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agentId ? req.body.agentId : ""
    };

    getTotalLeadTypeSummaryData(reqData, (err: any, response: any) => {
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

export const getTotalLeadFollowupSummary = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agentId ? req.body.agentId : ""
    };

    getTotalLeadFollowupSummaryData(reqData, (err: any, response: any) => {
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

export const addLeadStatus = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      smeId: parseInt(req.params.id),
      leadStatus: req.body.leadStatus,
      description: req.body.description ? req.body.description : "",
      insertDateTime: getCurrentDate,
      status: req.body.status ? req.body.status : 1
    };
    
    await addLeadStatusData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully Added", response);
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

export const deleteLeadStatus = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      statusId: req.body.statusId,
      status: req.body.status,
      updateDateTime: req.body.updateDateTime,
    };
    
    await deleteLeadStatusData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Status deleted Successfully", response);
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

export const editLeadStatus = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      leadStatus: req.body.leadStatus,
      description: req.body.description,
      statusId: req.body.statusId,
      updateDateTime: req.body.updateDateTime,
    };
    
    await editLeadStatusData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Status updated Successfully", response);
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

export const getTotalLeadCitySummary = async (req: Request, res: Response) => {
  try {
    let currentDate = Date();
    let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agentId ? req.body.agentId : "",
      currentDate: getCurrentDate
    };

    getTotalLeadCitySummaryData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if (response.length > 0) {
          getTodayLeadCitySummaryData(reqData, (err: any, response1: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              response1 = response1;
              return SuccessResponseWithCount(res, "Successfully listed", response, response1);
            }
          });
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

export const isdeletedAgentLeadExist = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      agentId: req.body.agent_id,
    };
    
    await isdeletedAgentLeadExistData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Lead listing Successfully", response);
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





