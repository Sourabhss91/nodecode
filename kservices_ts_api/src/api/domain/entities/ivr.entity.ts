import { double } from "aws-sdk/clients/lightsail";
import { string } from "fp-ts";

export type fetchCallProfileRequestValidate = {
  callingNumber: string;
  longcode: string;
};

export type setLiveCallsRequestValidate = {
  sme_id: number;
  date_time: string;
  longcode: string;
  customer_number: string;
  agent_number: string;
  self_ip: string;
  agent_id: number;
  session_id: string;
  call_status: number;
  call_type: string;
  is_auto_dial: number;
  customer_name: string;
};

export type updateLiveCallsRequestValidate = {
  sme_id: number;
  agent_number: string;
  agent_id: number;
  session_id: string;
  call_status: number;
  customer_number: string;
};

export type deleteLiveCallsValidate = {
  session_id: string;
  sme_id: number;
};

export type agentExtentionRequest = {
  in_agent_ext: string;
  sme_id: number;
};

export type addressBookRequest = {
  customerNumber: string;
  sme_id: number;
};

export type fetchAgentstatusRequest = {
  agent_id: number;
};

export type updateAgentRequest = {
  sme_id: number;
  in_flag: number;
  in_call_id: string;
  in_agent_id: number;
  in_customer_ani: string;
  in_duration: number;
  in_filename: string;
  in_status: number;
  in_flag_tbl: string;
  in_ip: number;
  insertDateTime: string;
};

export type failedRecordingRequest = {
  sme_id: number;
  in_flag: number;
  in_call_id: string;
  in_agent_id: number;
  in_customer_ani: string;
  in_duration: number;
  in_filename: string;
  in_status: number;
  in_flag_tbl: string;
  in_ip: number;
  in_session_id: string;
  insertDateTime: string;
};

export type getFailedRecordingRequest = { 
  in_ip: string;
  total_records: number;
};

export type updateFailedRecordingRequest = { 
  in_call_id: string;
  in_sme_id: number;
  in_status: string;
  in_s3url: string;
  
};

export type addAgentCdrRequest = {
  sme_id: number;
  g_inflag: string;
  g_agentId: string;
  g_groupId: string;
  g_status: string;
  g_responseCode: string;
  g_duration: string;
  endDate: string;
  startDate: string;
  g_customerAni: string;
  g_sessionCall: string;
  g_mode: string;
  g_callInfo: string;
  connectedDuration: string;
  ringingDuration: string;
  g_agentgroup: string;
  callRouteReason: string;
  recentCallDateTime: string;
  overallCallStatus: string;
  agentNumber: string;
};


export type endCallStatsRequest = {
  sme_id: number;
  incomingTotalCalls: number;
  incomingFailedCalls: number;
  incomingSuccessCalls: number;
  outgoingTotalCalls: number;
  outgoingFailedCalls: number;
  outgoingSuccessCalls: number;
  voicemailCalls: number;
  insertDateTime: string;
  service_id_total: number;
  service_id_sub_total: number;
  answer: number;
  callStatus: number;
  callDirection: string;
  
};

export type endCallCdrRequest = {
  sme_id: number;
  callDirection: string;
  connectedDuration: number;
  ringingDuration: string;
  customerNumber: string;
  agentNumber: string;
  longcode: string;
  session_id: string;
  addressBookId: number;
  agentGroup: string;
  answer: number;
  callDirectionStatus: string;
  callRecordedFile: string;
  callRecordingStatus: number;
  callStatus: number;
  cdrMode: string;
  callMode: string;
  channelNo: string;
  disconnectedBy: string;
  remarks: string;
  duration: string;
  endDateTime: string;
  merge_status: string;
  insertDateTime: string;
  masterShortcode: string;
  patchedAgentId: number;
  serverIpAddress: string;
  shortcodeMapping: string;
  smeIdentifier: string;
  startDateTime: string;
  voicemailRecordingFile: string;
  voicemailRecordingStatus: string;
  callType: string;
  callDescription: string;
  ivrDuration: string;
  customerStatus: string;
  hlr: string;
  finalStatus: string;
  callflowId: number;
  callflowName: string;
  provisionalFlag: number;
  finalDTMF: number;
};

export type setUniqueCallsRequestValidate = {
  sme_id: number;
  channel: string;
  callpatchedAgentGroup: string;
  callDirection: string;
  callDirectionStatus: string;
  callRecordedFile: string;
  callRecordingStatus: string;
  customerNumber: string;
  agentNumber: string;
  callcdrMode: string;
  callMode: string;
  callchannelNo: string;
  callDuration: string;
  callendDateTime: string;
  callHlr: string;
  callinsertDateTime: string;
  calllongcode: string;
  callmasterShortcode: string;
  callpatchedAgentId: string;
  ip: string;
  callshortcodeMapping: string;

  callsmeIdentifier: string;
  callstartDateTime: string;
  voicemailRecordingFile: string;
  voicemailRecordingStatus: string;
  callgroupid: string;
  callSessionId: string;
  callcdrFlag: string;
  callanswerFlag: string;
  callfinalStatus: string;
  calldisconnectedBy: string;
  addressBookName: string;
  addressBookId: string;
  insertDateTime: string;
  provisionalFlag: number;
};

export type setblacklistRequestValidate = {
  sme_id: number;
  start_date: string;
  longcode: string;
  customer_number: string;
  session_id: string;
  insertDateTime: string;
};

export type setKeepAliveRequest = {
  start_date: string;
};

export type getclicktocallRequest = {
  smeId: number;
  mode: string;
  flag: string;
  sessionId: string;
  scheduleId: string;
  callDuration: string;
  dtmf: string;
  recordingFileId: string;
  callStatus: string;
  agentNumber: string;
  virtualNumber: string;
};

export type updateClick2CallRequest = {
  sme_id: number;
  session_id: string;
  schedule_id: string;
  duration: string;
  dtmf: string;
  recording_file_id: string;
  call_status: string;
  agent_no: string;
  response_msg: string;
};
export type getAppOutCallDetailRequest = {
  sme_id: number;
  agent_no: string;
  longcode: string;
  insertDateTime: string;
};

export type getAutoDialerNoRequest = {
  virtualNumberString: string;
  insertDateTime: string;
  appCallMode: string;
  longcodSiteName: string;
  callType: string;
};

export type fetchAgentOutRequest = {
  sme_id: number;
  agentNumber: string;
};

export type fetchRevenueRequest = {
  IN_BACKDAYS: string;
};

export type updateS3Recording = {
  sme_id: number;
  in_flag: number;
  in_call_id: string;
  in_agent_id: number;
  in_customer_ani: string;
  in_duration: number;
  in_filename: string;
  in_status: number;
  in_flag_tbl: string;
  in_ip: string;
  insertDateTime: string;
  in_file: string;
  session_id: string;
  call_direction: string;
  crm_url: string;
  komm_url: string;
};

export type updateS3RecordingStatus = {
  sme_id: number;
  session_id: string;
  call_direction: string;
  getCurrentDate: string;
};
export type getFreeAgentRequest = {
  sme_id: number;
  g_group: string;
  g_agent_ignore_list: string;
  g_alogtype: string;
  g_customer_no: string;
  g_sme_sticky_algo: number;
  currentDate: string;
  g_assigned_agent_sticky_type: number;
  g_assigned_agent_sticky_id : number;
  g_assigned_vn_agent_id : number;
};

export type getFreeAgentParallelRingingRequest = {
  sme_id: number;
  g_group: string;
  g_agent_ignore_list: string;
  g_alogtype: string;
  g_customer_no: string;
  g_sme_sticky_algo: number;
  g_total_agents: number;
  currentDate: string;
};

export type getFreeAgentRequestV2 = {
  sme_id: number;
  g_group: string;
  g_agent_ignore_list: string;
  g_alogtype: string;
  g_customer_no: string;
  g_sme_sticky_algo: number;
  currentDate: string;
  agentId: any;
};
export type getFreeAgentEqualRequest = {
  sme_id: number;
  g_group: string;
  g_agent_ignore_list: string;
  g_alogtype: string;
  g_customer_no: string;
  g_sme_sticky_algo: number;
  g_total_agent_count: number;
  currentDate: string;
  agentId?: any;
};

export type getTokenRequest = {
  username: string;
  password: string;
};

export type addCustomerCdrRequest = {
  sme_id: number;
  g_inflag: string;
  g_status: string;
  g_responseCode: string;
  endDate: string;
  startDate: string;
  g_customerAni: string;
  g_sessionCall: string;
  g_mode: string;
  g_callInfo: string;
  connectedDuration: string;
  ringingDuration: string;
  callRouteReason: string;
  recentCallDateTime: string;
  totalDuration: string;
};
