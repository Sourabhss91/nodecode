import { object, string, number, mixed } from "yup";
import lan from "../../../locales/en.json";

export const fetchCallProfileRequestValidate = object({
 
  body: object({
    callingNumber: string().required("callingNumber is required"),
    longcode: string().required("callingNumber is longcode")
  }),
});

export const setLiveCallsRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    session_id: string().required("session_id is required")
  }),
});

export const updateLiveCallsValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    session_id: string().required("session_id is required"),
    customer_number: string().required("customer_number is required")
  }),
});

export const deleteLiveCallsValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    session_id: string().required("session_id is required")
  }),
});


export const agentExtentionValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    in_agent_ext: string().required("in_agent_ext is required")
  }),
});

export const getAddressbookValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
  body: object({
    customerNumber: string().required("customerNumber is required")
  }),
});


export const setAgentBusyValidate = object({
  params: object({
    id: number().positive().required("Agent id field is require"),
  }),
});

export const setAgentFreeValidate = object({
  params: object({
    id: number().positive().required("Agent id field is require"),
  }),
});

export const getFreeAgentValidate = object({
  params: object({
    id: number().positive().required("SME id field is require"),
  }),
});

export const saveRecordingValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
});

export const saveFailedRecordingInfoValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
});

export const getFailedRecordingInfoValidate = object({
  body: object({
    in_ip: string().required("in_ip is required")
  }),
});
export const updateFailedRecordingInfoValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
});
export const updateRecordingValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
});

export const setAgentCdrValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  body: object({
    responseCode: string().required("g_responseCode is required")
  }),

});


export const endCallCdrValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  body: object({
    longcode: string().required("longcode is required"),
    callDirection: string().required("callDirection is required"),
    session_id: string().required("session id is required"),
    customerNumber: string().required("customerNumber is required"),
    agentNumber: string().required("agentNumber is required")
  }),
});

export const setUniqueCallsValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  body: object({
    insertDateTime: string().required("insertDateTime is required")
  }),
});


export const blacklistIvrCallsRequestValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
});

export const getclicktocallRequestValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  body: object({
    agentNumber: string().required("agentNumber is required"),
    virtualNumber: string().required("virtualNumber is required")
  }),
});
  
export const setAgentOutValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  body: object({
    agentNumber: string().required("Agent Number is required")
  }),
});

export const revenueProcessValidate = object({
 
  body: object({
    IN_BACKDAYS: string().required("IN_BACKDAYS is required")
  }),
});

export const getTokenValidate = object({
 
  body: object({
    username: string().required("Username is required"),
    password: string().required("Password is required"),
  }),
});

export const setCustomerCdrValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  body: object({
    responseCode: string().required("g_responseCode is required")
  }),

});

export const setcallEndIvrNotifyValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  body: object({
    callType: string().required("callType is required"),
    sessionId: string().required("sessionId is required"),
    agentId: string().required("agentId is required")
  }),

});

export const endcallSmsValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  body: object({
    callType: string().required("callType is required"),
    customerNo: string().required("customerNo is required"),
    agentNo: string().required("agentNo is required")
  }),

});




