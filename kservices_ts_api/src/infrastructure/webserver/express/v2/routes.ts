import express, { Request, Response } from "express";
import { ApiDocsRoute } from "../../../../api/interface/routes/v2/apiDocs";
import { SMERoute } from "../../../../api/interface/routes/v2/sme";
import { AgentRoute } from "../../../../api/interface/routes/v2/agent";
import { CommonRoute } from "../../../../api/interface/routes/v2/common";
import { S3Route } from "../../../../api/interface/routes/v2/s3";
import { IVR } from "../../../../api/interface/routes/v2/ivr";
import { CRM } from "../../../../api/interface/routes/v2/crm";
import { Mobileapp } from "../../../../api/interface/routes/v2/mobileapp";
import { adminRoute } from "../../../../api/interface/routes/v2/admin";
import { PaymentRoute } from "../../../../api/interface/routes/v2/payment";
import { BigQuery } from "../../../../api/interface/routes/v2/bigQuery";
/** crate global router */
export const createRouterV2 = (): express.Router => {
  const router = express.Router();
  ApiDocsRoute(router);
  SMERoute(router);
  AgentRoute(router);
  CommonRoute(router);
  S3Route(router);
  IVR(router);
  CRM(router);
  Mobileapp(router);
  adminRoute(router);
  PaymentRoute(router);
  BigQuery(router);
  return router;
};
