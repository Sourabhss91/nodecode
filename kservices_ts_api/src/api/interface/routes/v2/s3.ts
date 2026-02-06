import express, { Request, Response } from "express";
import { verifyTokenSME, validateRequest } from "../../../middlewares";
import { s3UploadData, playAudio } from "../../controllers/app/v2/sme/s3UploadController";

const route = express.Router();

/** SME router function */
export const S3Route = (router: express.Router): void => {

  /** get settings */
  router.post("/sme/fileUpload",
   s3UploadData);


  /** get settings */
  router.get("/sme/:id/playAudio",
  playAudio);


};
