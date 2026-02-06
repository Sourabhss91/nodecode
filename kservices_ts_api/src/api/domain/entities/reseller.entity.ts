import { double } from "aws-sdk/clients/lightsail";
import { string } from "fp-ts";

export type signinRequest = {
  username: string;
  password: string;
};

export type getTypeDetailRequest = {
  username: string;
  userRole: string;
};
