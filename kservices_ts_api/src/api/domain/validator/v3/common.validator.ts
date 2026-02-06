import { object, string, number, mixed } from "yup";
import lan from "../../../locales/en.json";

export const getGenralCitiesRequestValidate = object({
    params: object({
        country: string().required("Country field is required"),
    }),
  });


  export const getActivityLogsValidate = object({
    params: object({
      id: string().required("id field is require"),
    })
  });

  export const setActivityLogsValidate = object({
    params: object({
      id: string().required("id field is require"),
    }),
    body: object({
      agentId: string().max(50).required("agent Id is required")
    }),
  });
