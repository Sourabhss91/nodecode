import { double } from "aws-sdk/clients/lightsail";
import { string } from "fp-ts";

export type countryFetchRequest = {
  country: string;
};

export type logFetchrequest = {
  smeId: string;
  agentId: string;
  agentId_op: string;
  moduleName: string;
  moduleName_op: string;
};


export type setActivityLogFetchrequest = {
  smeId:  string;
  agentId: string;
  ip: string;
  message: string;
  userRole: string;
  moduleName: string;
  action: string;
  insertDate: string;
  customerNumber: string;
};