import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse, userExistsError } from "./apiResponse";
import { getRandomNumber } from "./utility";
import { findAgentGroup, findAgentFlowId, findAgentLongcode, findVirtualNumberByFlowId, findSmeLongcode, checkLongcodeSiteStatus, FindAgentSecondaryMapLongcode } from "../domain/models/common.model";
import { env } from "../../infrastructure/env";



export const getVirtualNumberByagentId = async function (agentId: number,longcodePriorityFlag:number) {
    let reqData: any = {
        agentId: agentId,
        longcodePriorityFlag:longcodePriorityFlag
    };

    return new Promise((resolve, reject) => {
        findAgentLongcode(reqData, async (err: any, response: any) => {
            if (err) {
                return ErrorEmptyResponse('res', err);
            } else {
                if (response.length > 0 && longcodePriorityFlag ==1 || longcodePriorityFlag ==0) {
                    let logcodeData: any = {
                        "longcodeId": response[0].id,
                        "smeId": response[0].sme_id,
                        "siteId": response[0].site_identifier

                    }
                    checkLongcodeSiteStatus(logcodeData, async (err: any, responseSite: any) => {
                        if (err) {
                            return ErrorEmptyResponse('res', err);
                        } else {
                            if (responseSite.length > 0) {
                                if (responseSite[0].status > 0) {
                                    return resolve(response[0].longcode);
                                } else {
                                    FindAgentSecondaryMapLongcode(logcodeData, async (err: any, responseSecondary: any) => {
                                        if (err) {
                                            return ErrorEmptyResponse('res', err);
                                        } else {
                                            return resolve(responseSecondary[0].secondary_longcode);
                                        }
                                    });
                                }
                            }

                        }
                    });
                } else {
                    findAgentGroup(reqData, (err: any, responseA: any) => {
                        if (err) {
                            return ErrorEmptyResponse('res', err);
                        } else {
                            if (responseA.length > 0) {
                                let reqDataNew: any = {
                                    smeId: responseA[0].sme_id,
                                    groupId: responseA[0].group_id
                                };
                                findAgentFlowId(reqDataNew, (err: any, responseB: any) => {
                                    if (err) {
                                        return ErrorEmptyResponse('res', err);
                                    } else {
                                        if (responseB.length > 0) {
                                            let reqflowdata: any = {
                                                "flowId": responseB[0].flow_id
                                            }
                                            findVirtualNumberByFlowId(reqDataNew, reqflowdata, (err: any, responseC: any) => {
                                                if (err) {
                                                    return ErrorEmptyResponse('res', err);
                                                } else {
                                                    if (responseC.length > 0 && longcodePriorityFlag ==2 || longcodePriorityFlag ==0) {

                                                        let logcodeData: any = {
                                                            "longcodeId": responseC[0].id,
                                                            "smeId": responseA[0].sme_id,
                                                            "siteId": responseC[0].site_identifier

                                                        }
                                                        checkLongcodeSiteStatus(logcodeData, async (err: any, responseSite: any) => {
                                                            if (err) {
                                                                return ErrorEmptyResponse('res', err);
                                                            } else {
                                                                if (responseSite.length > 0) {
                                                                    if (responseSite[0].status > 0) {
                                                                        return resolve(responseC[0].longcode);
                                                                    } else {
                                                                        FindAgentSecondaryMapLongcode(logcodeData, async (err: any, responseSecondary: any) => {
                                                                            if (err) {
                                                                                return ErrorEmptyResponse('res', err);
                                                                            } else {
                                                                                return resolve(responseSecondary[0].secondary_longcode);
                                                                            }
                                                                        });
                                                                    }
                                                                }

                                                            }
                                                        });
                                                    } else {
                                                        findSmeLongcode(reqDataNew, (err: any, responseD: any) => {
                                                            if (err) {
                                                                return ErrorEmptyResponse('res', err);
                                                            } else {
                                                                if (responseD.length > 0 && longcodePriorityFlag ==3 || longcodePriorityFlag ==0) {

                                                                    let randomNumber = getRandomNumber(responseD);
                                                                    let logcodeData: any = {
                                                                        "longcodeId": randomNumber.id,
                                                                        "smeId": responseA[0].sme_id,
                                                                        "siteId": randomNumber.site_identifier

                                                                    }
                                                                    checkLongcodeSiteStatus(logcodeData, async (err: any, responseSite: any) => {
                                                                        if (err) {
                                                                            return ErrorEmptyResponse('res', err);
                                                                        } else {
                                                                            if (responseSite.length > 0) {
                                                                                if (responseSite[0].status > 0) {
                                                                                    return resolve(randomNumber.longcode);
                                                                                } else {
                                                                                    FindAgentSecondaryMapLongcode(logcodeData, async (err: any, responseSecondary: any) => {
                                                                                        if (err) {
                                                                                            return ErrorEmptyResponse('res', err);
                                                                                        } else {
                                                                                            return resolve(responseSecondary[0].secondary_longcode);
                                                                                        }
                                                                                    });
                                                                                }
                                                                            }

                                                                        }
                                                                    });
                                                                } else {
                                                                    return resolve(0);
                                                                }
                                                            }
                                                        });
                                                    }

                                                }
                                            });
                                        } else {
                                            return resolve(0);
                                        }

                                    }
                                });
                            } else {
                                return resolve(0);
                            }
                        }
                    });
                }
            }
        });
    });

};


