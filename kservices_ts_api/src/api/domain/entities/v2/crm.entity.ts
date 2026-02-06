import { double } from "aws-sdk/clients/lightsail";
import { string } from "fp-ts";

export type addClickToCallRequest = {
  Authorization: string;
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
  timeLimit: string;
  to: string;
};
