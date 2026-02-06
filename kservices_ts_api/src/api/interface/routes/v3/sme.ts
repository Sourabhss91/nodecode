import express from "express";
import { verifyTokenSME, validateRequest } from "../../../middlewares";
import { updateUniqueCalls, getUniqueCalls } from "../../controllers/app/v3/sme/uniqueCallsController";
import { getMergeCalls } from "../../controllers/app/v3/sme/callDetailsController";
import { getAddressbookDetail, setAddressbookDetail, addNewCustomer} from "../../controllers/app/v3/sme/contactsController";
import { getRemarks, setRemarks, getListRemarks } from "../../controllers/app/v3/sme/getRemarksController";
import { uniqueCallsRequestValidate, getMergeCallsValidate, getUniqueCallsRequestValidate, getSettingRequestValidate, addNewCustomerValidate, getRemarksRequestValidate, setRemarksRequestValidate, getListRemarksRequestValidate, } from "../../../domain/validator/v3/sme.validator";

/** SME router function */
export const SMERoute = (router: express.Router): void => {
  /**  Update  Unique Calls */
  router.post("/sme/:id/updateUniqueCalls", verifyTokenSME, validateRequest(uniqueCallsRequestValidate), updateUniqueCalls);

  /** Get calls list  */
  router.post("/sme/:id/getMergeCalls/", verifyTokenSME, validateRequest(getMergeCallsValidate), getMergeCalls);

  /** Get Unique Calls  */
  router.post("/sme/:id/getUniqueCalls", verifyTokenSME, validateRequest(getUniqueCallsRequestValidate), getUniqueCalls);

  /** Get Contacts from Address Book */
  router.post("/sme/:id/getAddressbookDetail", verifyTokenSME, validateRequest(getSettingRequestValidate), getAddressbookDetail);

  /** Set Contacts into Address Book */
  router.post("/sme/:id/setAddressbookDetail", verifyTokenSME, validateRequest(getSettingRequestValidate), setAddressbookDetail);

  /** Add New Contact into Address Book */
  router.post("/sme/:id/addNewCustomer", verifyTokenSME, validateRequest(addNewCustomerValidate), addNewCustomer);

  /** Get Single Remark*/
  router.post("/sme/:id/getRemarks",  validateRequest(getRemarksRequestValidate), getRemarks);

  /** Set Remarks */
  router.post("/sme/:id/setRemarks",  validateRequest(setRemarksRequestValidate), setRemarks);

  /** Get Recent Remarks */
  router.post("/sme/:id/getListRemarks", validateRequest(getListRemarksRequestValidate), getListRemarks);
};
