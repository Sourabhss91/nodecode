import { object, string, number, mixed } from "yup";
import lan from "../../../locales/en.json";

export const getRemarksRequestValidate = object({
  params: object({
    id: number().positive().required("Agent id field is require"),
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
    smeId: string().max(50).required("Sme id is required"),
    customerNumber: string().max(50).required("Customer Number id is required"),
  }),
});

export const getListRemarksRequestValidate = object({
  params: object({
    id: number().positive().required("Agent id field is require"),
  }),

  body: object({
    callDirection: string().max(10).required("Calldirection is required"),
    customerNumber: number().positive().required("Customer Number is required"),
  }),
});

export const appVersionRequestValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),

  body: object({
    platform: string().required("Invalid request params platform"),
    version_name: string().required("Invalid request params Version Name"),
  }),
});

export const getlistRequestValidate = object({
  params: object({
    id: number().positive().required("Agent id field is require"),
    type: string().required("Invalid request params type incomming / outgoing"),
  }),

  body: object({
    initialRecord: number().positive().required("Invalid request params initialRecord"),
    batchSize: number().positive().required("Invalid request params batchSize"),
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

export const getVoiceMailRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const getCdrMisscallRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const getTypeDetailRequestValidate = object({
  params: object({
    id: string().required("id field is require"),
  }),
});

export const deleteaddrbookRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),

  body: object({
    addressBookId: number().required("Invalid request params addressBookId"),
  }),
});

export const clickToCallRequestValidate = object({
  body: object({
    accountSid: string().required("accountSid is required"),
    agentGroup: string().required("agentGroup is required"),
    agentNumber: string().required("agentNumber is required"),
    callMode: string().required("callMode is required"),
    callPriority: string().required("callPriority is required"),
    customDtmf: string().required("customDtmf is required"),
    customDtmfFlag: string().required("customDtmfFlag is required"),
    from: string().required("from is required"),
    liveEvent: string().required("liveEvent is required"),
    liveEventFlag: string().required("liveEvent is required"),
    mediaFileFlag: string().required("mediaFileFlag is required"),
    mediaFileId: string().required("mediaFileId is required"),
    nameFileFlag: string().required("nameFileFlag is required"),
    nameFileId: string().required("nameFileId is required"),
    optionalField: string().required("optionalField is required"),
    pilotNumber: string().required("pilotNumber is required"),
    recordingFlag: string().required("recordingFlag is required"),
    scheduleDateTime: string().required("scheduleDateTime is required"),
    sessionId: string().required("sessionId is required"),
    smeId: string().required("smeId is required"),
    timeLimit: string().required("timeLimit is required"),
    to: string().required("to is required")
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

export const getCallBasetValidate = object({
  params: object({
    id: string().required("id field is require"),
  }),
});

export const setCallscheduletValidate = object({
  params: object({
    id: string().required("id field is require"),
  }),
});

export const updateCustomerNameRequestValidate = object({
  params: object({
    id: string().required("id field is require"),
  }),
  body: object({
    addressBookId: number().required("Invalid request params addressBookId")
  }),
});

export const gtaddrbookRequestValidate = object({
  params: object({
    id: string().required("id field is require"),
  }),
  body: object({
    sme_id: number().required("Sme id is required"),
  }),
});

export const getAddressbookValidate = object({
  params: object({
    id: number().positive().required("id field is require"),
    addressBookId: number().positive().required("addressBookId id is required"),
  }),
});

export const setNotificationTokenRequestValidate = object({
  params: object({
    id: number().positive().required("id field is require"),
  }),

  body: object({
    username: string().required("Invalid request params username"),
  }),
});

export const getCampaignRequestValidate = object({
  params: object({
    id: number().positive().required("id field is require"),
  }),

  body: object({
    smeId: number().required("Invalid request params smeId"),
  }),
});

export const getFollowUpCallsValidate = object({
  params: object({
    id: number().positive().required("id field is require"),
  })
});


export const endcallReasonListValidate = object({
  params: object({
    id: number().positive().required("id field is require"),
  })
});

export const updateEndCallReasonValidate = object({
  params: object({
    id: number().positive().required("id field is require"),
  }),

  body: object({
    sessionId: string().required("Invalid request params sessionId"),
    callDirection: string().required("Invalid request params callDirection"),
    reasonId: string().required("Invalid request params reasonId"),
    smeId: string().required("Invalid request params smeId"),
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


export const getLeadStatusRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const getAgentListRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const getLeadSourceRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const getLeadSettingsRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
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

export const addManualLeadValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
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

export const getScheduledCallsValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const getSettingRequestValidate = object({
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

export const masterApiupdateUniqueCallsAddressRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),

  body: object({
    insertDateTime: string().required("insertDateTime is required")
  }),
});


export const changeScheduleStatusValidate = object({
  params: object({
    id: string().max(255).required(lan["Sme id field is require"]),
  })
});