import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../helpers/apiResponse";
import { FindIvrFlow, insertUpdateIvrFlow, getMaxFlowId, deleteIvrFlow, getIvrByUniqueFlowIdData, getIvrFlowCountData, updateSmeLongcodeMapping, getIvrFlowlongcodeIdData, getQueueData, addQueueData, updateQueueData, addQueueMappingData, getQueueAssignedAgentsData } from "../../../../domain/models/sme.model";
import { getivrflowRequestValidate } from "../../../../domain/entities/sme.entity";
import { env } from '../../../../../infrastructure/env';

/**
 * get group details.
 *
 * @returns {Object}
 */

export const getivrflow = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      id: parseInt(req.params.id),
      flowId: req.body.flowId ? req.body.flowId : '',
    };
    await FindIvrFlow(reqData, (err: any, response: any) => {
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

export const createivrflow = async (req: Request, res: Response) => {
  try {
    var ivrData = req.body.list;
    let where: any = {
      sme_id: req.params.id,
    };

    await getMaxFlowId(where, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        var flowId = 0;
        if(response && response[0].flow_id != null){
          flowId = (response[0].flow_id+1);
        } else {
          flowId = 1;
        }
        
        var flowName = req.body.flowName ? req.body.flowName: "";
        for (let data of ivrData) {
          let reqData: any = {
            sme_id: req.params.id,
            catDescription: data["catDescription"],
            catId: data["catId"],
            catTitle: data["catTitle"],
            child: data["child"] ? data["child"] : 0,
            dtmf: data["dtmf"],
            status: data["status"],
            eventType: data["eventType"],
            mediaFilePath: data["mediaFilePath"],
            mediaFileStatus: data["mediaFileStatus"],
            parentId: data["parentId"],
            title: data["title"],
            type: data["type"],
            id: data["id"],
            queueId: data["queueId"] ? data["queueId"] : 0,
            insertDateTime : req.body.insertDateTime ? req.body.insertDateTime : "0000-00-00 00:00:00",
            flowId:flowId,
            flowName:flowName
          };

          insertUpdateIvrFlow(reqData, (err: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              
            }
          });
        }

        if(req.body.longcode && req.body.longcode > 0) {
          let reqDataNew: any = {
            smeId: req.params.id,
            longcode: req.body.longcode,
            flowId: flowId
          };
          updateSmeLongcodeMapping(reqDataNew, (err: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
              
            }
          });
        }
        return SuccessResponse(res, "Successfully added", response);
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

export const deleteIvrCallFlow = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      sme_id: parseInt(req.params.id),
      flowId: req.body.flowId
    };
    await deleteIvrFlow(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        let reqDataNew: any = {
          smeId: req.params.id,
          longcode: req.body.longcode,
          flowId: 0
        };
        updateSmeLongcodeMapping(reqDataNew, (err: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
            
          }
        });
        return SuccessResponse(res, "Successfully deleted", response);
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

export const getIvrByUniqueFlowId = async (req: Request, res: Response) => {
  try {
    let reqData: getivrflowRequestValidate = {
      id: parseInt(req.params.id),
    };
    await getIvrByUniqueFlowIdData(reqData, (err: any, response: any) => {
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

export const getIvrFlowCount = async (req: Request, res: Response) => {
  try {
    let reqData: getivrflowRequestValidate = {
      id: parseInt(req.params.id),
    };
    await getIvrFlowCountData(reqData, (err: any, response: any) => {
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

export const updateivrflow = async (req: Request, res: Response) => {
  try {
    
    let reqData: any = {
      sme_id: parseInt(req.params.id),
      flowId: req.body.flowId
    };
    var ivrData = req.body.list;
    await deleteIvrFlow(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        getMaxFlowId(reqData, (err: any, response: any) => {
          if (err) {
            return ErrorEmptyResponse(res, err);
          } else {
            var flowId = 0;
            if(response && response[0].flow_id != null){
              flowId = (response[0].flow_id+1);
            } else {
              flowId = 1;
            }
            var flowName = req.body.flowName ? req.body.flowName: "";
            for (let data of ivrData) {
              let reqDataNew: any = {
                sme_id: req.params.id,
                catDescription: data["catDescription"],
                catId: data["catId"],
                catTitle: data["catTitle"],
                child: data["child"],
                dtmf: data["dtmf"],
                status: data["status"],
                eventType: data["eventType"],
                mediaFilePath: data["mediaFilePath"],
                mediaFileStatus: data["mediaFileStatus"],
                parentId: data["parentId"],
                title: data["title"],
                type: data["type"],
                id: data["id"],
                insertDateTime : req.body.insertDateTime ? req.body.insertDateTime : "0000-00-00 00:00:00",
                flowId:flowId,
                flowName:flowName
              };
    
              insertUpdateIvrFlow(reqDataNew, (err: any) => {
                if (err) {
                  return ErrorEmptyResponse(res, err);
                } else {
                  
                }
              });
            }
    
            if(req.body.longcode && req.body.longcode > 0) {
              let reqDataNew: any = {
                smeId: req.params.id,
                longcode: req.body.longcode,
                flowId: flowId
              };
              updateSmeLongcodeMapping(reqDataNew, (err: any) => {
                if (err) {
                  return ErrorEmptyResponse(res, err);
                } else {
                  
                }
              });
            }
            return SuccessResponse(res, "Successfully Updated", response);
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

export const getIvrFlowlongcodeId = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      sme_id: parseInt(req.params.id),
      flowId: req.body.flowId ? req.body.flowId : '',
    };
    await getIvrFlowlongcodeIdData(reqData, (err: any, response: any) => {
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

export const getQueue = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      initialRecord: req.body.initialRecord,
      batchSize: req.body.batchSize,
    };
    await getQueueData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    ErrorResponse(res, e);
  }
};

export const addQueue = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      status: req.body.status ? req.body.status : 0,
      name: req.body.name ? req.body.name : "",
      description: req.body.description ? req.body.description : "",
      agentId: req.body.agentId ? req.body.agentId : "",
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : '0000-00-00 00:00:00',
    };

    await addQueueData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if(reqData["agentId"] && reqData["agentId"].length > 0){
          for(var i=0; i<reqData["agentId"].length; i++){
            let reqData1: any = {
              smeId: parseInt(req.params.id),
              queueId: response[0] ? response[0] : 0,
              agentId: reqData["agentId"][i].id,
              insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : '0000-00-00 00:00:00',
            };
            addQueueMappingData(reqData1, (err: any, response: any) => {
              if (err) {
                return ErrorEmptyResponse(res, err);
              } else {
              }
            });
          }
        }
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    ErrorResponse(res, e);
  }
};

export const updateQueue = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      status: req.body.status ? req.body.status : 0,
      name: req.body.name ? req.body.name : "",
      description: req.body.description ? req.body.description : "",
      queueId: req.body.queueId ? req.body.queueId : 0,
    };
    await updateQueueData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    ErrorResponse(res, e);
  }
};


export const getQueueAssignedAgents = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      queueId: req.body.queueId ? req.body.queueId : 0 
    };

    await getQueueAssignedAgentsData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully listed", response);
      }
    });
  } catch (e) {
    ErrorResponse(res, e);
  }
};
