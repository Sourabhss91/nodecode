import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import { FindIvrFlow, insertUpdateIvrFlow, getMaxFlowId, deleteIvrFlow, getIvrByUniqueFlowIdData, getIvrFlowCountData, updateSmeLongcodeMapping, getIvrFlowlongcodeIdData, getQueueData, addQueueData, updateQueueData, addQueueMappingData, getQueueAssignedAgentsData, getMediaData, addMediaData, updateMediaData } from "../../../../../domain/models/v3/sme.model";
import { getivrflowRequestValidate } from "../../../../../domain/entities/v3/sme.entity";
import { env } from '../../../../../../infrastructure/env';
let uploadPath = env.IVR_FLOW_FILE_PATH;
import multer from "multer";
import fs from "fs";
const AWS = require('aws-sdk');

const mediaFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath +"/"+ req.params.id+"/media/");
  },
  filename: function (req: any, file: any, cb: any) {
    let fileName = file.originalname;
    cb(null, fileName);
  },
});

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
            queueId: data["queue"] ? data["queue"] : 0,
            mediaId: data["media"] ? data["media"] : 0,
            retry: data["retry"] ? data["retry"] : 0,
            redirectTo: data["redirectTo"] ? data["redirectTo"] : "",
            dtmfWaitTime: data["waitTime"] ? data["waitTime"] : 0,
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
        if(req.body.longcode && req.body.longcode > 0){
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
        }
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
                flowName:flowName,
                queueId: data["queue"] ? data["queue"] : 0,
                mediaId: data["media"] ? data["media"] : 0,
                retry: data["retry"] ? data["retry"] : 0,
                redirectTo: data["redirectTo"] ? data["redirectTo"] : "",
                dtmfWaitTime: data["waitTime"] ? data["waitTime"] : 0,
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
        return SuccessResponse(res, "Successfully added", response);
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
        return SuccessResponse(res, "Successfully updated", response);
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


export const getMedia = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      initialRecord: req.body.initialRecord,
      batchSize: req.body.batchSize, 
    };

    await getMediaData(reqData, (err: any, response: any) => {
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

export const uploadMediaFile = async (req: Request, res: Response) => {
  try {

    let pathDir = env.WRINGG_SITE_URL +"uploads/"+ req.params.id;
    let dir = uploadPath +"/"+ req.params.id;
    
    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir);
    }

    let dir1 = uploadPath +"/"+ req.params.id;

    if (!fs.existsSync(dir1)) {
      await fs.mkdirSync(dir1);
    }

    let finalUploadPath: string = dir1 + "/";
    let finalUploadFile: string = pathDir + "/";

    multer({
      storage: mediaFileStorage,
      fileFilter: function (req, file: any, callback: any) {
        if (file.mimetype == "audio/wav" || file.mimetype == "audio/wave" || file.mimetype == "audio/mp3" || file.mimetype == "audio/MP4") {
          callback(null, file);
        } else {
          callback(null, false);
          console.log(res, "Only .wave, .wav, .mp3 and .MP4 format allowed!");
        }
      },
    }).array("base_file", 1)(req, res, function (err) {
      if (err) {
        console.log(err);
      } else {
        if (req.files != undefined && req.files.length != 0) {
          let fileUpload: any = req.files;
          let fileName = fileUpload[0].originalname;

          let customResponse: any = {
            finalUploadFilePath: finalUploadPath,
            finalUploadFileName: finalUploadFile+fileName,
            fileName: fileName,
          };
          return SuccessResponse(res, "Successfully uploaded", customResponse);
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


export const addMedia = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      name: req.body.name ? req.body.name : "",
      mediaType: req.body.mediaType ? req.body.mediaType : "",
      language: req.body.language ? req.body.language : "",
      textToSpeech: req.body.textToSpeech ? req.body.textToSpeech : "",
      filePath: req.body.filePath ? req.body.filePath : "",
      directoryPath: req.body.directoryPath ? req.body.directoryPath : "",
      fileName: req.body.fileName ? req.body.fileName : "",
      fileOriginalName: req.body.fileOriginalName ? req.body.fileOriginalName : "",
      status: req.body.status ? req.body.status : 1,
      insertDateTime: req.body.insertDateTime ? req.body.insertDateTime : '0000-00-00 00:00:00',
      updateDateTime: req.body.updateDateTime ? req.body.updateDateTime : '0000-00-00 00:00:00',
    };

    await addMediaData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully added", response);
      }
    });
  } catch (e) {
    ErrorResponse(res, e);
  }
};

export const generateMedia = async (req: Request, res: Response) => {
  try {

    let finalUploadFilePath: string = "";
    let finalUploadFilePathPolly: string = "";
    let finalUploadFileName: string = "";
    let fileName: string = "";
    let finalUploadPath: string = "";

    
    let dir = uploadPath +"/"+ req.params.id;
    let pathDir = env.WRINGG_SITE_URL +"uploads/"+ req.params.id+"/polly";
    
    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir);
    }

    let dir1 = uploadPath +"/"+ req.params.id + "/polly";

    if (!fs.existsSync(dir1)) {
      await fs.mkdirSync(dir1);
    }

    finalUploadPath = dir1 + "/";
    let finalUploadFile: string = pathDir + "/";
    fileName = Date.now()+Date.now()+".mp3";
    finalUploadFilePath = finalUploadPath;
    finalUploadFilePathPolly = finalUploadPath+fileName;
    finalUploadFileName = finalUploadFile+fileName;

    const Polly = new AWS.Polly({
      signatureVersion: 'v4',
      region: 'us-east-1'
    })
    
    let params = {
      'Text': req.body.speechText && req.body.speechText != "" ? req.body.speechText : "You are Welcome",
      'OutputFormat': 'mp3',
      'VoiceId': 'Kajal',
      'LanguageCode': req.body.language && req.body.language != "" ? req.body.language : 'hi-IN',
      "Engine": "neural"
    }
  
    Polly.synthesizeSpeech(params, (err: any, data: any) => {
        if (err) {
            console.log(err);
            console.log(err.code);
        } else if (data) {
          if (data.AudioStream instanceof Buffer) {
            fs.writeFile(finalUploadFilePathPolly, data.AudioStream, function(err: any) {
                if (err) {
                    return console.log(err)
                }
                console.log("The file was saved!");
                let customResponse: any = {
                  fileName : fileName,
                  filePath : finalUploadFileName,
                  directoryPath: finalUploadFilePathPolly
                }
                return SuccessResponse(res, "Successfully generated", customResponse);
            })
          }
        }
    });
  } catch (e) {
    logger.error(e);
    ErrorResponse(res, e);
  }
};

export const updateMedia = async (req: Request, res: Response) => {
  try {
    let reqData: any = {
      smeId: parseInt(req.params.id),
      status: req.body.status ? req.body.status : 0,
      mediaId: req.body.mediaId ? req.body.mediaId : 0,
    };
    await updateMediaData(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponse(res, "Successfully updated", response);
      }
    });
  } catch (e) {
    ErrorResponse(res, e);
  }
};
