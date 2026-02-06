import { object, string, number, mixed } from "yup";
import lan from "../../../locales/en.json";

export const getSettingRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const signinRequestValidate = object({
  body: object({
    password: string().max(255).required("Password is required"),
    username: string().max(255).required("Username is required"),
  }),
});

export const updateSettingRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const downloadFileRequestValidate = object({
  body: object({
    filePath: string().required(lan["File Path  field is require"]),
  }),
});


export const generateTokenRequestValidate = object({
  body: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const generateAccessKeyRequestValidate = object({
  body: object({
    clientId: string().max(255).required(lan["Client id field is require"]),
    clientToken: string().max(255).required(lan["Client token field is require"]),
    jwtTime: string().max(255).required(lan["Time field is require"])
  }),
});

export const forgotPasswordRequestValidate = object({
  params: object({
    id: string().max(255).required(lan["Sme id field is require"]),
  }),
});

export const resetPasswordRequestValidate = object({
  params: object({
    id: string().max(255).required(lan["Sme id field is require"]),
  }),
  body: object({
    password: string().max(255).required("Current password is required"),
    newPassword: string().max(255).required("New passord is required"),
    confirmPassword: string().max(255).required("Confirm password is required"),
  }),
});

export const getRemarksRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),

  body: object({
    callDirection: string().max(10).required("CallDirection is required"),
    sessionId: string().max(50).required("SessionId is required"),
  }),
});

export const setRemarksRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),

  body: object({
    sessionId: string().max(50).required("SessionId is required"),
    remarks: string().max(250).required("Remarks is required"),
  }),
});

export const getListRemarksRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),

  body: object({
    customerNumber: number().positive().required("Customer Number is required"),
  }),
});

export const getCitiesRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const getProductsRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const uniqueCallsRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),

  body: object({
    id: number().positive().required("Unique id is required"),
    insertDateTime: string().required("insertDateTime is required")
  }),
});

export const checkAppDetailRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),

  body: object({
    version_name: string().required("App version name is required"),
  }),
});

export const getAgentStatusRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const getSmeRecordingsRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),

  body: object({
    initialRecord: number().positive().required("Invalid request params initialRecord"),
    batchSize: number().positive().required("Invalid request params batchSize"),
  }),
});

export const getlistRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
    type: string().required("Invalid request params type incomming outgoing"),
  }),

  body: object({
    initialRecord: number().positive().required("Invalid request params initialRecord"),
    batchSize: number().positive().required("Invalid request params batchSize"),
  }),
});

export const getUniqueCallsRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),

  body: object({
    initialRecord: number().positive().required("Invalid request params initialRecord"),
    batchSize: number().positive().required("Invalid request params batchSize"),
  }),
});

export const typeDetaillRequestValidate = object({
  params: object({
    id: string().required("Invalid request params username"),
  }),
});

export const getsmecomplaintsRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const setComplaintListRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),

  body: object({
    subject: string().required("Invalid request params subject"),
    complaintDetail: string().required("Invalid request params complaintDetail"),
    emailId: string().required("Invalid request params emailId"),
  }),
});

export const getGroupdetailRequestValidate = object({
  params: object({
    status: number().positive().required("Status id field is require"),
  }),
});

export const getAgentdetailRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const getLeadSettingsRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const getVoiceMailRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const getSmeLongcodesRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});
export const getivrflowRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const createivrflowRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const baseListRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const setNotificationTokenRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),

  body: object({
    username: string().required("Invalid request params username"),
  }),
});

export const getAgentListRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const agentInsightRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),

  body: object({
    agentId: number().required("Invalid request params agentId"),
    endDate: string().required("Invalid request params endDate"),
    startDate: string().required("Invalid request params startDate"),
  }),
});

export const agentReportdetailRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const canCreateAgentRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const addAgentRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const systemDetailRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const setCustomerNameRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),

  body: object({
    customerName: string().required("Invalid request params customerName"),
    customerNumber: string().required("Invalid request params customerNumber"),
  }),
});

export const revokeNotificationTokenRequestValidate = object({
  params: object({
    id: string().required(lan["Sme id field is require"]),
  }),

  body: object({
    username: string().required("Invalid request params username"),
  }),
});

export const updateAgentRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
    agentId: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const deleteAgentRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
    agentId: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const getInsightsAgentStatusRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const getNotificationRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const markAllAsReadRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const getSmsTemplateRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const setSmsTemplateRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const getSmsCampaignRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const setSmsCampaignRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const updateCampaignRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const uploadCampaignRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
    campaignId: string().required("campaignId id field is require"),
  }),
});

export const setBlackWhiteListRequestValidate = object({
  params: object({
    id: string().max(255).required(lan["Sme id field is require"]),
  }),
  body: object({
    customer_number: string().max(255).required("Customer Number is required"),
    blacklist_status: number().required("Number Status is required"),
  }),
});

export const longcodeSpamRequestValidate = object({
  params: object({
    id: string().max(255).required(lan["Sme id field is require"]),
  }),
  body: object({
    longcodeId: number().required("Longcode Number is required"),
    status: number().required("Longcode Number is required")
  }),
});

export const setAgentsOrderRequestValidate = object({
  params: object({
    id: string().max(255).required(lan["Sme id field is require"]),
  }),
});

export const agentReportDataRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    sessionId: string().required("sessionId is required")
  }),
});

export const verifyOtpForgotRequestValidate = object({
  params: object({
    id: string().max(255).required("username field is require"),
  }),
  body: object({
    oneTimeCode: string().required("oneTimeCode is required")
  }),
});

export const forgotChangePasswordRequestValidate = object({
  params: object({
    id: string().max(255).required("username field is require"),
  }),
  body: object({
    newPassword: string().required("newPassword is required")
  }),
});

export const getLeadCustomerDetailsValidate = object({
  params: object({
    id: string().max(255).required("id field is require"),
  }),
  body: object({
    customerNumber: string().required("customerNumber is required")
  }),
});

export const getCallsPerformanceRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  
});

export const getSmsHeaderRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  
});

export const setSmsHeaderRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  
});

export const updateSmsHeaderRequestValidate = object({
  params: object({
    id: number().positive().required("Header id field is require"),
  }),
  
});

export const updateSmsTemplateRequestValidate = object({
  params: object({
    id: number().positive().required("Template id field is require"),
  }),
  
});

export const deleteTemplateRequestValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  
});

export const deleteHeaderRequestValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  
});

export const deleteSmsCampaignListRequestValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  
});

export const getHeaderlistRequestValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  
});


export const getTemplateListRequestValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  
});

export const uploadCampaignMediaFileRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const uploadCampaignScheduleRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const addCampaignRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});


export const getScheduledCallsValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const addNewCustomerValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const addManualLeadValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const updateAgentStatusValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const agentActInactTimeValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const getLeadSourceRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const addLeadSourceRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    source: string().required("source is required")
  }),
});

export const deleteLeadSourceRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    sourceId: string().required("source id is required")
  }),
});

export const editLeadSourceRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    sourceId: string().required("Source id is required")
  }),
});

export const deleteUniqueDetailRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    leadId: string().required("Lead id is required")
  }),
});

export const getCampaignDataAfterCallsValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const demoRequestValidate = object({
  body: object({
    mobileNumber: number().positive().required("Mobile Number Required"),
  })
});

export const getAgentCampaignValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const addAutodialerCampaignBaseValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const SmeProductPackageRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const addCustomerNoteRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const setFollowUpCallRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const getEndCallReasonsListRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});


export const updateEndCallReasonValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const getAllSmsPackagesValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});


export const getSmeSmsPackageValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const getSmsEndCallEnumValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const getTotalLeadsSummaryValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const setSmeSmsNotifyPermissionValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const getLeadStatusRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const addLeadStatusRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    leadStatus: string().required("Status is required")
  }),
});

export const deleteLeadStatusRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    statusId: string().required("Status id is required")
  }),
});

export const editLeadStatusRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    statusId: string().required("Status id is required")
  }),
});

export const EndcallSmsPermissionValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const getSmsPaymentHistoryValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const uploadLeadRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const leadTransferDataRequestValidate = object({
  params: object({
    id: string().max(255).required(lan["Sme id field is require"]),
  }),
  body: object({
    agentId: string().max(255).required("Agent id is require"),
    leadId: string().max(255).required("Lead id is require"),
  }),
});

export const uploadLeadDataRequestValidate = object({
  params: object({
    id: string().max(255).required(lan["Sme id field is require"]),
  }),
});

export const getSingleAgentRequestValidate = object({
  params: object({
    id: string().max(255).required(lan["Sme id field is require"]),
  }),
  body: object({
    agentId: string().max(255).required("Agent id is require"),
  }),
});


export const bulkLeadTransferDataRequestValidate = object({
  params: object({
    id: string().max(255).required(lan["Sme id field is require"]),
  }),
  body: object({
    assignedFrom: string().max(255).required("Assigned from agent is require"),
    assignedTo: string().max(255).required("Assigned to agent require"),
  }),
});

export const setThirdPartyLeadSettingsValidate = object({
  params: object({
    id: string().max(255).required(lan["Sme id field is require"]),
  }),
  body: object({
    key: string().max(255).required("key id is require"),
    url: string().max(255).required("url id is require")
  }),
});

export const getThirdPartyLeadSettingsValidate = object({
  params: object({
    id: string().max(255).required(lan["Sme id field is require"]),
  }),
  body: object({
    thirdPartyName: string().max(255).required("thirdPartyName id is require"),
  }),
});

export const getAllThirdPartyLeadSettingsValidate = object({
  params: object({
    id: string().max(255).required(lan["Sme id field is require"]),
  }),
  body: object({
  }),
});

export const updateLeadStatusOnLiveCallValidate = object({
  params: object({
    id: string().max(255).required(lan["Sme id field is require"]),
  })
});


export const changeScheduleStatusValidate = object({
  params: object({
    id: string().max(255).required(lan["Sme id field is require"]),
  })
});

export const getsmePackagePaymentHistoryValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});


export const getCampaignAssignedAgentsValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const generateReportValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const getDownloadReportValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const setCommSmsSettingsRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    url: string().max(255).required("url id is require"),
    commPassword: string().max(255).required("password is require"),
    commUsername: string().max(255).required("username is require"),
  }),
});

export const sendCommSmsRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    message: string().required("message id is require"),
    customerNumber: string().required("customerNumber id is require"),
    templateId: number().required("templateId id is require"),
  }),
});

export const getCommSmsSettingsRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});


export const viewFrequencyRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const getWebrtcNumberRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const saveNonWorkingFlowRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const saveNonWorkingDaysRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const isdeletedAgentLeadExistRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    agent_id: string().required("Agent id is require"),
  }),
});


export const getNonWorkingFlowRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});


export const getNonWorkingMappingFlowRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const updateWebrtcAgentStatusRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const isWebrtcAgentRegisterRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const checkFacebookAccessTokenValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    token: string().required("token  is require"),
  }),
});

export const getFacebookAdsCampaignValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    token: string().required("token  is require"),
  }),
});

export const getFacebookAdsetDataValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    token: string().required("token  is require"),
    campaignId: string().required("campaignId  is require"),
  }),
});

export const getFacebookAdsDataValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    token: string().required("token  is require"),
    adsetId: string().required("adsetId  is require"),
  }),
});

export const getAbandonedCallsRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const getTrainingVideosRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const getFaqRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});


export const setFacebookLeadSettingsValidate = object({
  params: object({
    id: string().max(255).required(lan["Sme id field is require"]),
  }),
  body: object({
    clientId: string().max(500).required("clientId is require"),
    secretKey: string().required("secretKey is require"),
    status: string().required("status is require"),
    token: string().required("token  is require"),
  }),
});

export const getAgentLongcodesValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const getCustomerNameValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const getAllPromptValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const isAgentEmailExistValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    agentEmail: string().required("Email is require"),
  })
});

export const isAgentMobileExistValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    agentMobile: string().required("Mobile Number is require"),
  })
});

export const getMergeCallsValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const clearLiveCallRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});


export const transferLiveCallRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    operation: string().required("Operation is require"),
    customerNumber: string().required("Customer Number is require"),
  })
});

export const getAgentLiveCallLeadRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    customerNumber: string().required("Customer Number is require"),
  })
});


export const copyCampaignToLeadRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    customerNumber: string().required("Customer Number is require"),
  })
});


export const getQueueRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const addQueueRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const updateQueueRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const getAgentQueueRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const getMediaRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const uploadMediaFileRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const addMediaRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const generateMediaRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const updateMediaRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});


export const updateIsPickedRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const getLiveAprRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const getWhatsappRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const addWhatsappTemplateRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const deleteWhatsappTemplateValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const addWhatsAppMappingValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

export const getWhatsappMappingValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});


export const getWhatsappEnumValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});


export const editWhatsappTemplateValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  })
});

