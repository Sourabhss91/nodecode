import { Request, Response } from "express"
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse,SuccessResponseWithCount } from "../../../../helpers/apiResponse";
import { FindCallList,FetchAgentReport } from "../../../../domain/models/bigQuery.model";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { env } from '../../../../../infrastructure/env';
import { callListFetchRequest,fetchAgentReport } from "../../../../domain/entities/sme.entity";
const {BigQuery} = require('@google-cloud/bigquery');
import {
    findOnePackage,
    createPaymentOrder,
    updatePaymentOrder
  } from "../../../../domain/models/sme.model";

const options:any = {
  keyFilename: 'google_cred.json',
  projectId: 'kommuno-347914',
};
const datasetId:any = 'kommuno-347914.kommuno_prod_bq';
// Creates a client
const bigquery = new BigQuery(options);


/**
 * get dataset
 *
 * @returns {Object}
 */

 export const bigQuery = async (req: Request, res : Response) =>{
    try{

  //const sqlQuery ='SELECT agent_id FROM [kommuno-347914:kommuno_prod_bq.agent_details] LIMIT 10;';
  const sqlQuery ='SELECT sme_id FROM [kommuno-347914:kommuno_prod_bq.incoming_ivr_call_cdr] LIMIT 10;';

  const options = {
    query: sqlQuery,
    //location: 'US',
    useLegacySql: true,
  };

  // Run the query as a job
  const [job] = await bigquery.createQueryJob(options);
  console.log(`Job ${job.id} started.`);

  // Wait for the query to finish
  const [rows] = await job.getQueryResults();

  // Print the results
  console.log('Rows:');
  //rows.forEach((row: any) => console.log(row['agent_id']));

  SuccessResponse(res, "Successfully listed", rows);

    }catch(e){
        console.log(e);
    }
}

/**
 * get list
 *
 * @returns {Object}
 */
export const getlist = async (req: Request, res: Response) => {
  try {
      var g_startDate ='';
      var g_startDate_op ='';
      var g_endDate='';
      var g_endDate_op='';
      var callDirectionStatus ='';
      var callDirectionStatus_op ='';
      var duration='';
      var duration_op='';
      var calledNumber='';
      var calledNumber_op='';
      var callingNumber='';
      var callingNumber_op='';
      var agentName='';
      var agentName_op='';
      var callStatus='';
      var callStatus_op='';
      var answerStatus='';
      var answerStatus_op='';
      var remarks='';
      var remarks_op='';
      var callId='';
      var callId_op='';
      var callFlow='';
      var callFlow_op='';

      if (req.body.filterList) {
          var filterData = req.body.filterList;
          for (let data of filterData) {
              if(data["name"] =="startDate"){
                  g_startDate = data["val"];
                  g_startDate_op = data["op"];
              }

              if(data["name"] =="endDate"){
                  g_endDate = data["val"];
                  g_endDate_op = data["op"];
              }

              if(data["name"] =="duration"){
                duration = data["val"];
                duration_op = data["op"];
              }

              if(data["name"] =="callDirectionStatus"){
                callDirectionStatus = data["val"];
                callDirectionStatus_op = data["op"];
              }

              if(data["name"] =="callId"){
                callId = data["val"];
                callId_op = data["op"];
              }

              if(data["name"] =="called_number"){
                calledNumber = data["val"];
                calledNumber_op = data["op"];
              }

              if(data["name"] =="calling_number"){
                callingNumber = data["val"];
                callingNumber_op = data["op"];
              }
              if(data["name"] =="agent_name"){
                agentName = data["val"];
                agentName_op = data["op"];
              }

              if(data["name"] =="callStatus"){
                callStatus = data["val"];
                callStatus_op = data["op"];
              }

              if(data["name"] =="answer"){
                answerStatus = data["val"];
                answerStatus_op = data["op"];
              }

              if(data["name"] =="remarks"){
                remarks = data["val"];
                remarks_op = data["op"];
              }

              if(data["name"] =="flow_name"){
                callFlow = data["val"];
                callFlow_op = data["op"];
              }
          }
      }
      
     
    let reqData: callListFetchRequest = {
      id: parseInt(req.params.id),
      type: req.params.type,
      isDownload: req.body.isDownload,
      callDirectionStatus: req.body.callDirectionStatus,
      callDirectionStatus_op: req.body.callDirectionStatus_op,
      initialRecord:req.body.initialRecord,
      batchSize: req.body.batchSize,
      startDate: g_startDate,
      startDate_op: g_startDate_op,
      endDate: g_endDate,
      endDate_op: g_endDate_op,
      duration: duration,
      duration_op: duration_op,
      calledNumber: calledNumber,
      calledNumber_op: calledNumber_op,
      callingNumber: callingNumber,
      callingNumber_op: callingNumber_op,
      agentName: agentName,
      agentName_op: agentName_op,
      callStatus: callStatus,
      callStatus_op: callStatus_op,
      answerStatus: answerStatus,
      answerStatus_op: answerStatus_op,
      remarks: remarks,
      remarks_op: remarks_op,
      callId: callId,
      callId_op: callId_op,
      callFlow: callFlow,
      callFlow_op: callFlow_op,
    };
    await FindCallList(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        if(response.length > 0){
          return  SuccessResponseWithCount(res, "Successfully listed", response, 0); 
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


export const agentReportdetail = async (req: Request, res: Response) => {
  try {
    var g_startDate = "";
    var g_startDate_op = "";
    var g_endDate = "";
    var g_endDate_op = "";
    var g_duration = "";
    var g_duration_op = "";
    var customerAni = "";
    var customerAni_op = "";
    var agentNumber = "";
    var agentNumber_op = "";
    var agentName = "";
    var agentName_op = "";
    var responseMessage = "";
    var responseMessage_op = "";
    var callMode = "";
    var callMode_op = "";
    var sessionId = "";
    var sessionId_op = "";
    var orderBy = "";
    var orderBy_op = "";
    var status = "";
    var status_op = "";

    if (req.body.filterList) {
      var getreportDetailData = req.body.filterList;
      for (let data of getreportDetailData) {
        if (data["name"] == "startDate") {
          g_startDate = data["val"];
          g_startDate_op = data["op"];
        }

        if (data["name"] == "endDate") {
          g_endDate = data["val"];
          g_endDate_op = data["op"];
        }

        if (data["name"] == "duration") {
          g_duration = data["val"];
          g_duration_op = data["op"];
        }

        if (data["name"] == "session_id" || data["name"] == "sessionId") {
          sessionId = data["val"];
          sessionId_op = data["op"];
        }

        if (data["name"] == "customer_ani") {
          customerAni = data["val"];
          customerAni_op = data["op"];
        }

        if (data["name"] == "agent_number") {
          agentNumber = data["val"];
          agentNumber_op = data["op"];
        }

        if (data["name"] == "agent_name") {
          agentName = data["val"];
          agentName_op = data["op"];
        }

        if (data["name"] == "response_message") {
          responseMessage = data["val"];
          responseMessage_op = data["op"];
        }

        if (data["name"] == "call_mode") {
          callMode = data["val"];
          callMode_op = data["op"];
        }

        if (data["name"] == "orderBy") {
          orderBy = data["val"];
          orderBy_op = data["op"];
        }

        if (data["name"] == "status") {
          status = data["val"];
          status_op = data["op"];
        }
      }
    }

    let reqData: fetchAgentReport = {
      sme_id: parseInt(req.params.id),
      isDownload: req.body.isDownload,
      initialRecord: req.body.initialRecord,
      batchSize: req.body.batchSize,
      startDate: g_startDate,
      startDate_op: g_startDate_op,
      endDate: g_endDate,
      endDate_op: g_endDate_op,
      duration: g_duration,
      duration_op: g_duration_op,
      customerAni: customerAni,
      customerAni_op: customerAni_op,
      agentNumber: agentNumber,
      agentNumber_op: agentNumber_op,
      agentName: agentName,
      agentName_op: agentName_op,
      responseMessage: responseMessage,
      responseMessage_op: responseMessage_op,
      callMode: callMode,
      callMode_op: callMode_op,
      sessionId: sessionId,
      sessionId_op: sessionId_op,
      orderBy: orderBy,
      orderBy_op: orderBy_op,
      status: status,
      status_op: status_op
    };
    await FetchAgentReport(reqData, (err: any, response: any) => {
      if (err) {
        return ErrorEmptyResponse(res, err);
      } else {
        return SuccessResponseWithCount(res, "Successfully listed", response, 0);
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