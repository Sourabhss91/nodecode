import { object, string, number, mixed } from "yup";
import lan from "../../../locales/en.json";

export const clickToCallRequestValidate = object({
  body: object({
    Authorization: string().required("Authorization is required"),
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
