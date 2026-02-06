import { double } from "aws-sdk/clients/lightsail";
import { string } from "fp-ts";

export type remarksRequest = {
  id: number;
  callDirection: string;
  sessionId: string;
};

export type setRemarksRequest = {
  id: number;
  callDirection: string;
  sessionId: string;
  remarks: string;
  smeId: string;
  customerNumber: string;
  createdBy: number;
  insertDateTime: string;
};

export type fetchListRemarksRequest = {
  id: number;
  callDirection: string;
  customerNumber: number;
  smeId: number;
};

export type fetchAppversion = {
  agent_id: string;
  platform: string;
  version_name: string;
  sme_id: string;
  update_date_time: string;
  insert_date_time: string;
};

export type callListFetchRequest = {
  id: number;
  type: string;
  isDownload: string;
  initialRecord: number;
  batchSize: number;
  startDate: string;
  startDate_op: string;
  endDate: string;
  endDate_op: string;
  callDirectionStatus: string;
  callDirectionStatus_op: string;
  duration: string;
  duration_op: string;
  calledNumber: string;
  calledNumber_op: string;
  callingNumber: string;
  callingNumber_op: string;
  agentName: string;
  agentName_op: string;
  callStatus: string;
  callStatus_op: string;
  answerStatus: string;
  answerStatus_op: string;
  remarks: string;
  remarks_op: string;
  callId: string;
  callId_op: string;
  smeId: string;
};

export type fetchInsightRequest = {
  sme_id : number;
  agentId: number;
  endDate: string;
  startDate: string;
};

export type fetchVoiceMailRequest = {
  id : number;
  initialRecord: number;
  batchSize: number;
  startDate: string;
  startDate_op: string;
  endDate: string;
  endDate_op: string;
  customerNumber: number,
  customerNumber_op: number,
  duration: number,
  duration_op: number,
  sessionId: string,
  sessionId_op: string,
};

export type fetchCdrMisscallRequest = {
  id : number;
  endDate:string;
  startDate:string;
  startDate_op: string;
  endDate_op:string;
  initialRecord:string;
  batchSize:number;

};

export type fetchTypedDetailRequest = {
  id : string;
};

export type deleteAddressBookRequest = {
  id : number;
  addressBookId:number;
};


export type launchIn = {
  sme_id: number,
  agent_id: number,
  insert_date: string,
  in_time:string,
  message: string
  start_date: string,
  end_date: string
};

export type launchInAgent = {
  sme_id: number,
  agent_id: number,
  insert_time: string,
  in_time:string,
  status:number
};


export type launchInOut = {
  sme_id: number,
  agent_id: number,
  out_time: string,
  in_time:string,
  message: string,
  status:number,
  currentDateTime:string,
};

export type launchInOutWhere ={
  id:number
}

export type launchInWhereGet ={
  agent_id:number,
  start_date:string,
  end_date:string
}



export type addClickToCallRequest = {
  accountSid: string;
  agentGroup: string;
  agentNumber: string;
  callMode: string;
  callPriority: string;
  customDtmf: string;
  customDtmfFlag: string;
  from: string;
  liveEvent: string;
  liveEventFlag: string;
  mediaFileFlag: string;
  mediaFileId: string;
  nameFileFlag: string;
  nameFileId: string;
  optionalField: string;
  pilotNumber: string;
  recordingFlag: string;
  scheduleDateTime: string;
  sessionId: string;
  smeId: string;
  agent_id: string;
  timeLimit: string;
  to: string;
  insertDateTime : string;
  baseId: number;
};


export type setCustomerNameRequest ={
  id: number;
}


export type fetchcallbaeRequest ={
  id: number
}

export type setcallscheduleRequest ={
  agent_id: number;
  sme_id:string;
  callCounter: string;
  callType: string;
  description: string;
  mobile:string;
  scheduleDateTime: string;
  status: string;
  insertDateTime: string;
  message: string;
}

export type getAddressbookListRequest ={
  id: number;
  sme_id: number;
}

export type getAddressbookListRequestNew ={
  id: number;
  sme_id: number;
  initialRecord: number;
  batchSize: number
}

export type FetchAddressbookRequest ={
  agentId: number;
  addressBookId: number;
}

export type UpdatenotificationRequest = {
  id : number;
  token: string;
  username: string;
  mode: string;
};

export type getLeadStatusRequest = {
  smeId: number;
};

export type getLeadSourceRequest = {
  smeId: number;
};

export type getUniqueCallsRequest = {
  id: number;
  isDownload: string;
  initialRecord: number;
  batchSize: number;
  startDate: string;
  startDate_op: string;
  endDate: string;
  endDate_op: string;
  duration: string;
  duration_op: string;
  customerNumber: string;
  customerNumber_op: string;
  agentNumber: string;
  agentNumber_op: string;
  agentName: string;
  agentName_op: string;
  answerStatus: string;
  answerStatus_op: string;
  cityId: string;
  cityId_op: string;
  productId: string;
  productId_op: string;
  leadType: string;
  leadType_op: string;
  customerName: string;
  customerName_op: string;
  productPrice: string;
  productPrice_op: string;
  leadStatus: string;
  leadStatus_op: string;
  agentId: string;
  agentId_op: string;
  sourceId: string;
  sourceId_op: string;
  campaignId: string;
  campaignId_op: string;
  searchLeads: string;
  searchLeads_op: string;
  sortLeadDateVar: string;
  sortLeadDateVar_op: string;
  companyName: string;
  companyName_op: string;
};