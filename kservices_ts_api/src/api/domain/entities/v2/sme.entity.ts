import { double, integer } from "aws-sdk/clients/lightsail";
import { date, string } from "fp-ts";


export type fetchRequest = {
  id: number;
};

export type tokenRequest = {
  id: string;
  token: string;
};

export type fetchLeadCustomerDetailRequest = {
  id: number;
  customerNumber: string;
  offset: number;
  mode: string;
};

export type forgotPasswordRequest = {
  username: string;
  mode: string;
};

export type resetPasswordRequest = {
  sme_id: string;
  token: string;
};

export type signinRequest = {
  username: string;
  password: string;
};


export type updateSettingsRequest = {
  id: number;
  agent_relax_time: number;
  call_back_url: string;
  gui_timer: number;
  in_permission_flag: number;
  language: number;
  masking: number;
  out_permission_flag: number;
  queue_limit: number;
  rec_validity: number;
  recording: number;
  selection_algo: string;
  sticky_algo: number;
  voicemail: number;
  balance: double;
  email_id: string;
  principle_id: string;
  end_call_notification_flag: number;
  agent_break_notifcation: number,
  agent_break_notification_email: number,
  agent_break_notification_time: string
  sme_mobile: string,
  default_lead_sticky: number,
  eod_report_emails: string,
  eod_report_flag: number
};

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
  customerNumber: string;
  createdBy: number;
  insertDateTime: string;
};

export type fetchListRemarksRequest = {
  id: number;
  callDirection: string;
  customerNumber: number;
};

export type updateUniqueCallsRequest = {
  id: number;
  smeId: number;
  callId: number;
  cityId: number;
  productId: number;
  productPrice: number;
  leadAssignedAgent: number;
  leadType: string;
  leadStatus: string;
  customerName: string;
  insertDateTime : string;
  sourceId : number;
  oldValue : string;
  agentId : number;
  leadStatusCount : number;
  leadSourceCount : number;
  leadProductCount : number;
  leadTypeCount : number;
  leadCityCount : number;
  other : string;
};

export type getAppDetailRequest = {
  id: number;
  version_name: string;
};

export type getCallDetailsRequest = {
  id: number;
  type: string;
  initialRecord: number;
  batchSize: number;
};

export type agentStatusRequest = {
  id: number;
  agentStatus: string;
  agentStatus_op: string;
  agentId: string;
  agentId_op: number;
};


export type recordingGetRequest = {
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
  agentId: string;
  agentId_op: string;
  agentName: string;
  agentName_op: string;
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
  callFlow: string,
  callFlow_op: string,
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
  searchLeads_category: string;
  sortLeadDateVar: string;
  sortLeadDateVar_op: string;
  companyName: string;
  companyName_op: string;
  uniqueId: string,
  uniqueId_op: string,
  abandoned: string,
  abandoned_op: string,
};

export type updateComplaintRequest = {
  smeId : number;
  category: number;
  complaintDetail: string;
  emailId: string;
  status: number;
  subject: string;
  id: number;
  insertDateTime:string;
};

export type addComplaintRequest = {
  smeId : number;
  category: number;
  complaintDetail: string;
  emailId: string;
  status: number;
  subject: string;
  insertDateTime:string;
};

export type groupdetailsRequest = {
  status : number;
};

export type getAgentdetailRequestValidate = {
  id : number;
};

export type updateLeadSettingsRequest = {
  id : number;
  leadColumns:string;
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

export type UpdatenotificationRequest = {
  id : number;
  token: string;
  username: string;
};
export type getivrflowRequestValidate = {
  id : number;
};

export type createivrflowRequestValidate = {
  sme_id : number;
  catDescription: string;
  catId: number;
  catTitle: string;
  child: string;
  dtmf: number;
  eventType:string;
  id: number;
  mediaFilePath: string;
  mediaFileStatus: string;
  parentId: number
  title: string;
  type: string;
};

export type baseListRequest = {
  sme_id : number;
  agentId: number;
  mobile: string;
  desc: string;
  insertDateTime: string;
};

export type fetchInsightRequest = {
  sme_id : number;
  agentId: number;
  endDate: string;
  startDate: string;
};

export type fetchAgentReport = {
  sme_id: number;
  isDownload: string;
  initialRecord: number;
  batchSize: number;
  startDate: string;
  startDate_op: string;
  endDate: string;
  endDate_op: string;
  duration: string;
  duration_op: string;
  customerAni: string;
  customerAni_op: string;
  agentNumber: string;
  agentNumber_op: string;
  agentName: string;
  agentName_op: string;
  responseMessage: string;
  responseMessage_op: string;
  callMode: string;
  callMode_op: string;
  sessionId: string;
  sessionId_op: string;
  orderBy: string;
  orderBy_op: string;
  status: string;
  status_op: string;
};

export type addAgentRequest = {
  id: number;
  agentName: string;
  agentMobile: number;
  status: string;
  inTime: string;
  outTime: string;
  daysFlag: number;
  agentEmail: string;
  stickyAgent: number;
  agentMasking: number;
  stickyDays: number;
  assignFailedCalls: number;
  assignVoicemailCalls: number;
  inPermissionFlag: number;
  outPermissionFlag: number;
  role: string;
  password: string;
  selectedLongCode: any;
  clientName: string;
  insertDateTime : string;
  breakPermissionFlag : number;
  virtualNumberPriority : number;
  recordingType : number;
};

export type addAgentGroupMappingRequest = {
  agentId: number;
  groupId: number;
  insertDateTime: string;
};

export type addAgentDetailsTimingRequest = {
  agentId: number;
  smeId: number;
  agentName: string;
  agentMobile: number;
  status: string;
  inTime: string;
  outTime: string;
  daysWeek: string;
  insertDateTime: string;
};

export type fetchSystemRequest = {
  id : number;
  endDate: string;
  startDate: string;
};

export type updateAgentRequest = {
  id: number;
  agentId: number;
  agentName: string;
  agentMobile: number;
  status: string;
  inTime: string;
  outTime: string;
  daysFlag: number;
  agentEmail: string;
  stickyAgent: number;
  agentMasking: number;
  stickyDays: number;
  assignFailedCalls: number;
  assignVoicemailCalls: number;
  inPermissionFlag: number;
  outPermissionFlag: number;
  agentExtension: number;
  selectedLongCode:any;
  insertDateTime:any;
  role:any;
  password:any;
  clientName:string;
  breakPermissionFlag:any;
  virtualNumberPriority:any;
  webrtcFlag:any;
  recordingType:number;
};

export type deleteAgentRequest = {
  id: number;
  agentId: number;
  status: string;
  agentEmail: string;
  agentName: string;
  agentNumber: string;
};

export type getInsightsAgentStatusRequestValidate = {
  id: number;
};

export type getTypeDetailRequest = {
  id: string;
  userRole: string;
};

export type getNotificationRequest = {
  id : number;
  agentId: number;
  agentEmail: string;
};

export type markAllAsReadRequest = {
  id : number;
  notificationId: string;
  isRead: string;
};

export type emailRequest = {
  type: string;
};

export type setSmsRequest = {
  smeId: number;
  status: string;
  message_text: string;
  message_type: string;
  insertDateTime: string;
  principle_id: string;
  template_name: string;
};

export type setSmsHeaderRequest = {
  smeId: number;
  status: string;
  headerName: string;
  type: string;
  principalId: string;
  insertDateTime: string;
};

export type updateHeaderfecth = {
  smeId: number;
  header_name: string;
  type: string;
  principalId: string;
  headerId: number;
};

export type deletetemplateFetch = {
  id: number;
  templateId: number;
};

export type deleteHeaderFetch = {
  id: number;
  headerId: number;
};

export type deleteCampaignFetch = {
  id: number;
  campaignId: number;
};

export type getHeaderTemplateFetch = {
  id: number;
  type: string;
};

export type uploadSmsCampaignRequest = {
  base_file : string;
  base_count : number;
  fail_count : number;
  invalid_count : number;
  campaign_id : number;
  failed_file : string;
  duplicate_file : string;
  invalid_file : string;
  filtered_count: number;
  filtered_file: string;
  duplicate_count: number;
  LastInsertedId: number;
  campaignSelect :number;
};

export type setSmsCampaignRequest = {
     sme_id: number;
     template_id : any;
     base_file : string;
     campaign_message : string;
     cli : any;
     base_count : number;
     //insert_date : string;
     start_time : any;
     end_time : any;
     sucess_count : number;
     fail_count : number;
     invalid_count : number;
     campaign_name : any;
     upload_file : string;
     failed_file : string;
     success_file : string;
     duplicate_file : string;
     invalid_file : string;
     insertDateTime : any;
     filtered_count: number;
     filtered_file: string;
     duplicate_count: number;
     principal_id :string;
     campaign_type : string;
     header_id :number;
};

export type setBlackWhiteListNumbersRequest = {
  smeId: number;
  customer_number: string;
  blacklist_status: number;
  reason:string;
  created_by: number;
  insertDateTime: string;
};

export type setAgentsOrderRequest = {
  smeId: number;
  agentId: number;
  order: number;
};

export type addAgentExtensionRequest = {
  agentExtension: number;
  agentPosition: number;
};


export type AgentReportDataRequestValidate = {
  smeId : number;
  sessionId:string;
};

export type fetchCallperformance = {
  id: number;
  currentdateTime: string;
  agentId: number;
};

export type getLeadSourceRequest = {
  smeId: number;
};

export type getLeadStatusRequest = {
  smeId: number;
};

export type mergeCallFetchRequest = {
  smeId: number;
  initialRecord: number;
  batchSize: number;
  startDate: string;
  startDate_op: string;
  endDate: string;
  endDate_op: string;
  callDirection: string;
  callDirection_op: string;
  duration: string;
  duration_op: string;
  customerNumber: string;
  customerNumber_op: string;
  customerName: string;
  customerName_op: string;
  agentNumber: string;
  agentNumber_op: string;
  agentName: string;
  agentName_op: string;
  callStatus: string;
  callStatus_op: string;
  remarks: string;
  remarks_op: string;
  callFlow: string,
  callFlow_op: string,
  searchLeads: string,
  searchLeads_op: string,
  searchLeads_category: string,
  callQueue: string,
  callQueue_op: string,
};