import { object, string, number, mixed } from "yup";
import lan from "../../../locales/en.json";

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
    callDirection: string().max(10).required("CallDirection is required"),
    sessionId: string().max(50).required("SessionId is required"),
    remarks: string().max(50).required("Remarks is required"),
  }),
});

export const getListRemarksRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),

  body: object({
    callDirection: string().max(10).required("Calldirection is required"),
    customerNumber: number().positive().required("Customer Number is required"),
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

export const getAgentCampaignSummaryValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});


