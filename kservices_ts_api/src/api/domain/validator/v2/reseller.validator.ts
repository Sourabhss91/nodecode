import { object, string, number, mixed } from "yup";
import lan from "../../../locales/en.json";

export const signinRequestValidate = object({
  body: object({
    password: string().max(255).required("Password is required"),
    username: string().max(255).required("Username is required"),
  }),
});

export const typeDetaillRequestValidate = object({
  params: object({
    id: string().required("Invalid request params username"),
  }),
});
