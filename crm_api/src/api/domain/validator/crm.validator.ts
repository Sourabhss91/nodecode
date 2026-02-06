import { Integer } from "read-excel-file/types";
import { object, string, number, mixed } from "yup";
import lan from "../../locales/en.json";

export const clickToCallRequestValidate = object({
  body: object({
    accountSid: string().required("accountSid is required"),
    sessionId: string().required("sessionId is required"),
    to: string().min(10).required("Customer Number is required"),
    smeId: string().required("smeId is required"),
    pilotNumber: string().min(10).required("pilotNumber is required"),
    agentNumber: string().min(10).required("agentNumber is required"),
    callMode: number().required("callMode is required"),
    countryCode: string().min(3).max(3).required("countryCode is required"),
  }),
});


export const callbackRequestValidate = object({
  body: object({
    callScheduleId: number().required("callScheduleId is required"),
    sessionId: string().required("sessionId is required"),
    smeId: string().required("smeId is required"),
  }),
});

export const sendIvrOutgoingcallbackValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  body: object({
    callScheduleId: number().required("callScheduleId is required")
  }),
});

export const sendIvrLiveEventValidate = object({

  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  body: object({
    liveEvent: string().required("liveEvent is required"),
    accountSid: string().required("accountSid is required"),
    sessionId: string().required("sessionId is required"),
    to: string().required("to is required"),
    from: string().required("from is required"),
    dateTime: string().required("dateTime is required")
  }),
});

export const sendIvrRecordingEventValidate = object({

  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  body: object({
    liveEvent: string().required("liveEvent is required"),
    accountSid: string().required("accountSid is required"),
    sessionId: string().required("sessionId is required"),
    to: string().required("to is required"),
    from: string().required("from is required"),
    dateTime: string().required("dateTime is required"),
    customDtmf: string().required("customDtmf is required"),
    recordingId: string().required("recordingId is required"),
    //responseMsg: string().required("responseMsg is required"),
    agentNumber: string().required("agentNumber is required"),
    callMode: string().required("callMode is required"),
    callType: string().required("callType is required"),
  }),
});


export const agentSummaryValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  body: object({
    startDate: string().required("startDate is required"),
    endDate: string().required("endDate is required")
  }),
});

export const agentDayWiseSummaryValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  body: object({
    startDate: string().required("startDate is required"),
    endDate: string().required("endDate is required"),
    agentNumber: string().required("agentNumber is required")
  }),
});


export const addManualLeadValidate = object({
  params: object({
    id: number().positive().required("Sme id field is require"),
  }),
  body: object({
    customerNumber: string().required("customerNumber is required"),
  }),
});


export const userClickToCallRequestValidate = object({
  body: object({
    
    calledNumber: string().min(10).required("calledNumber is required"),
    smeId: string().required("smeId is required"),
    callingNumber: string().min(10).required("callingNumber is required"),
    callMode: number().required("callMode is required")
  }),
});

export const aiBotClickToCallRequestValidate = object({
  body: object({
    
    to: string().min(10).required("to is required"),
    smeId: string().required("smeId is required"),
    callMode: number().required("callMode is required")
  }),
});