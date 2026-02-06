import express, { Request, Response } from "express";
import { ApiDocsRoute } from "../../../../api/interface/routes/v1/apiDocs";
import { CRM } from "../../../../api/interface/routes/v1/crm";
/** crate global router */
export const createRouter = (): express.Router => {
  const router = express.Router();
  ApiDocsRoute(router);
  CRM(router);
  return router;
};
