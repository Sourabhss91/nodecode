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
};

export type fetchListRemarksRequest = {
  id: number;
  callDirection: string;
  customerNumber: number;
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
  agentId: number;

};

