import { double } from "aws-sdk/clients/lightsail";
import { string } from "fp-ts";

export type addClickToCallRequest = {
  accountSid: string;
  agentGroup: string;
  agentNumber: string;
  callMode: number;
  callPriority: string;
  customDtmf: string;
  customDtmfFlag: string;
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
  timeLimit: number;
  to: string;
};

export type fetchCallbackRequest = {
  callScheduleId: number;
  sessionId: string;
  smeId: string;
};

export type fetchivrOutgoingCallbackRequest = {
  callScheduleId: number;
  smeId: number;
  startTime:string;
  endTime:string; 
};

