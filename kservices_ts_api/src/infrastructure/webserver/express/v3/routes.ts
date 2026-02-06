import express from "express";
import { SMERoute } from "../../../../api/interface/routes/v3/sme";
import { CommonRoute } from "../../../../api/interface/routes/v3/common";
import { IVR } from "../../../../api/interface/routes/v3/ivr";
/** crate global router */
export const createRouterV3 = (): express.Router => {
  const router = express.Router();
  SMERoute(router);
  CommonRoute(router);
  IVR(router);
  return router;
};