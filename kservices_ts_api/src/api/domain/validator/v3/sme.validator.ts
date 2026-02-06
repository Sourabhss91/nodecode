import { object, string, number } from "yup";
import lan from "../../../locales/en.json";

export const uniqueCallsRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),

  body: object({
    id: number().positive().required("Unique id is required"),
    insertDateTime: string().required("insertDateTime is required")
  }),
});

export const getMergeCallsValidate = object({
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

export const getSettingRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

export const addNewCustomerValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),
});

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
    sessionId: string().max(50).required("SessionId is required"),
    remarks: string().max(250).required("Remarks is required"),
  }),
});

export const getListRemarksRequestValidate = object({
  params: object({
    id: number().positive().required(lan["Sme id field is require"]),
  }),

  body: object({
    customerNumber: number().positive().required("Customer Number is required"),
  }),
});

