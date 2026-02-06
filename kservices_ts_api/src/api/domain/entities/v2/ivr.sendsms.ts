import { double } from "aws-sdk/clients/lightsail";
import { string } from "fp-ts";



export type sendSmsValidate = {
  smeId: number;
  longcode: string;
  customerNo: string;
  agentNo: string;
};
