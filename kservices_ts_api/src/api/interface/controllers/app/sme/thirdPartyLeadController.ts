import { Request, Response } from "express";
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../helpers/apiResponse";
//const parse = require('csv-parse');
import {
    findThirdPartyleadSetting,
    updatehirdPartyleadSetting,
    InserthirdPartyleadSetting,
    findThirdPartyleadAssignedAgentId,
    deleteAgentFromThirdPartyLead,
    AddAgentFromThirdPartyLead,
    findAllThirdPartyLeadSettings,
    findFacebookLeadSetting,
    updateFacebookleadSetting,
    InserFacebookleadSetting,
    findfacebookCampaignSettings,
    InserFacebookcampaignData,
    AddAgentFromFacebookLead,
    FindfacebookCampaignAssignedAgentId,
    FindSinglefacebookCampaignadsdata,
    UpdatefaceBookCampaignStatus,
    DeleteFacebookCampaignData,
    DeleteFacebookCampaignAssignedAgents,
    updateFacebookcampaignData
} from "../../../../domain/models/sme.model";
import {
} from "../../../../domain/entities/sme.entity";
import { env } from "../../../../../infrastructure/env";
import { convertTimeZone } from "../../../../helpers/utility";
var requestClient = require('request');

export const setThirdPartyLeadSettings = async (req: Request, res: Response) => {
    try {
        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
        let reqData: any = {
            id: parseInt(req.params.id),
            assignedAgents: req.body.agentData,
            generatedKey: req.body.key,
            url: req.body.url,
            status: req.body.status ? req.body.status : 0,
            thirdPartyName: req.body.thirdPartyName ? req.body.thirdPartyName : '',
            insertDateTime: getCurrentDate,
            defaultlead: req.body.defaultlead ? req.body.defaultlead : '',
        };
        await findThirdPartyleadSetting(reqData, (err: any, response: any) => {
            if (err) {
                return ErrorEmptyResponse(res, err);
            } else {
                if (response.length > 0) {
                    let reqDataNew: any = {
                        getId: response[0].id
                    }
                    updatehirdPartyleadSetting(reqData, reqDataNew, (err: any, response2: any) => {
                        if (err) {
                            return ErrorEmptyResponse(res, err);
                        } else {
                            deleteAgentFromThirdPartyLead(reqData, reqDataNew, (err: any, responseDeleteAgent: any) => {
                                if (err) {
                                    return ErrorEmptyResponse(res, err);
                                } else {
                                    for (let data of reqData['assignedAgents']) {
                                        let reqData4: any = {
                                            agentId: data.id,
                                            sme_id: req.params.id,
                                            thirdPartyLeadId: response[0].id,
                                            insertDateTime: getCurrentDate
                                        }
                                        AddAgentFromThirdPartyLead(reqData4, (err: any, responseAddAgent: any) => {
                                            if (err) {
                                                return ErrorEmptyResponse(res, err);
                                            } else {

                                            }
                                        });
                                    }
                                    return SuccessResponse(res, "Successfully updated", []);
                                }
                            });
                        }
                    });
                } else {
                    InserthirdPartyleadSetting(reqData, (err: any, response3: any) => {
                        if (err) {
                            return ErrorEmptyResponse(res, err);
                        } else {
                            for (let data of reqData['assignedAgents']) {
                                let reqData4: any = {
                                    agentId: data.id,
                                    sme_id: req.params.id,
                                    thirdPartyLeadId: response3[0],
                                    insertDateTime: getCurrentDate
                                }
                                AddAgentFromThirdPartyLead(reqData4, (err: any, responseAddAgent: any) => {
                                    if (err) {
                                        return ErrorEmptyResponse(res, err);
                                    } else {
                                        return SuccessResponse(res, "Successfully updated", responseAddAgent);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    } catch (e) {
        if (env.NODE_ENV_ERROR_LOG == "yes") {
            loggerFileError.error(e);
            loggerFileError.error(req.originalUrl);
            loggerFileError.error(req.body);
        }
        logger.error(e);
        ErrorResponse(res, e);
    }
};


export const getThirdPartyLeadSettings = async (req: Request, res: Response) => {
    try {
        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
        let reqData: any = {
            id: parseInt(req.params.id),
            thirdPartyName: req.body.thirdPartyName ? req.body.thirdPartyName : ''
        };
        await findThirdPartyleadSetting(reqData, (err: any, response: any) => {
            if (err) {
                return ErrorEmptyResponse(res, err);
            } else {
                if (response.length > 0) {
                    let regData2: any = {
                        thirdPartyLeadId: response[0].id
                    }
                    findThirdPartyleadAssignedAgentId(reqData, regData2, (err: any, response2: any) => {
                        if (err) {
                            return ErrorEmptyResponse(res, err);
                        } else {
                            var responseData: any = {
                                "id": response[0].id,
                                "third_party_code": response[0].third_party_code,
                                "name": response[0].name,
                                "sme_id": response[0].sme_id,
                                "key": response[0].generated_key,
                                "generated_key_expire_status": response[0].generated_key_expire_status,
                                "generated_key_expire_message": response[0].generated_key_expire_message,
                                "url": response[0].url,
                                "status": response[0].status,
                                "agentData": response2,
                                "lead_source": response[0].lead_source
                            }

                            return SuccessResponse(res, "Successfully updated", responseData);
                        }
                    });
                } else {
                    return SuccessResponse(res, "No data found", []);
                }

            }
        });
    } catch (e) {
        if (env.NODE_ENV_ERROR_LOG == "yes") {
            loggerFileError.error(e);
            loggerFileError.error(req.originalUrl);
            loggerFileError.error(req.body);
        }
        logger.error(e);
        ErrorResponse(res, e);
    }
};


export const getAllThirdPartyLeadSettings = async (req: Request, res: Response) => {
    try {
        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
        let reqData: any = {
            id: parseInt(req.params.id)
        };
        await findAllThirdPartyLeadSettings(reqData, (err: any, response: any) => {
            if (err) {
                return ErrorEmptyResponse(res, err);
            } else {
                return SuccessResponse(res, "Successfully updated", response);
            }
        });
    } catch (e) {
        if (env.NODE_ENV_ERROR_LOG == "yes") {
            loggerFileError.error(e);
            loggerFileError.error(req.originalUrl);
            loggerFileError.error(req.body);
        }
        logger.error(e);
        ErrorResponse(res, e);
    }
};




export const checkFacebookAccessToken = async (req: Request, res: Response) => {
    try {
        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
        let reqData: any = {
            id: parseInt(req.params.id),
            token: req.body.token,
            secretKey: req.body.secretKey,
            clientId: req.body.clientId
        };
        var options = {
            'method': 'GET',
            'url': 'https://graph.facebook.com/v16.0/oauth/access_token?grant_type=fb_exchange_token& client_id=' + req.body.clientId + '&client_secret=' + req.body.secretKey + '&fb_exchange_token=' + req.body.token,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };
        requestClient(options, async function (error: string | undefined, response: any) {
            if (error) throw new Error(error);

            if (response.statusCode == 200) {
                var data = JSON.parse(response.body);
                var accessToken = data.access_token;
                var tokenExpired = data.expires_in
                console.log(data)
                let reqDataNew: any = {
                    id: parseInt(req.params.id),
                    clientId: req.body.clientId,
                    secretKey: req.body.secretKey,
                    accessToken: accessToken,
                    tokenExpired: tokenExpired
                };
                return SuccessResponse(res, "Token verified", reqDataNew);

            } else {
                var data = JSON.parse(response.body);
                return SuccessResponse(res, "Invalid Token", data.error);
            }
        });

    } catch (e) {
        if (env.NODE_ENV_ERROR_LOG == "yes") {
            loggerFileError.error(e);
            loggerFileError.error(req.originalUrl);
            loggerFileError.error(req.body);
        }
        logger.error(e);
        ErrorResponse(res, e);
    }
};


export const getFacebookAdsCampaign = async (req: Request, res: Response) => {
    try {
        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
        let reqData: any = {
            id: parseInt(req.params.id),
            token: req.body.token
        };
        var options = {
            'method': 'GET',
            'url': 'https://graph.facebook.com/v16.0/me?fields=id,name,adaccounts{campaigns{name}}&access_token=' + req.body.token,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };
        requestClient(options, async function (error: string | undefined, response: any) {
            if (error) throw new Error(error);

            if (response.statusCode == 200) {
                var acounData = JSON.parse(response.body);
                var campaignIds = acounData.adaccounts.data[0].campaigns.data;

                return SuccessResponse(res, "campaign verified", campaignIds);
            } else {
                return ErrorEmptyResponse(res, 'Api failed for getting Campaign');
            }
        });

    } catch (e) {
        if (env.NODE_ENV_ERROR_LOG == "yes") {
            loggerFileError.error(e);
            loggerFileError.error(req.originalUrl);
            loggerFileError.error(req.body);
        }
        logger.error(e);
        ErrorResponse(res, e);
    }
};

export const getFacebookAdsetData = async (req: Request, res: Response) => {
    try {
        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
        let reqData: any = {
            id: parseInt(req.params.id),
            token: req.body.token,
            campaignId: req.body.campaignId,
        };
        var options = {
            'method': 'GET',
            'url': 'https://graph.facebook.com/v16.0/' + req.body.campaignId + '/adsets?fields=adlabels,name,status,id&access_token=' + req.body.token,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };
        requestClient(options, async function (error: string | undefined, response: any) {
            if (error) throw new Error(error);

            if (response.statusCode == 200) {
                var response2Data = JSON.parse(response.body);
                var adsetData = response2Data.data

                return SuccessResponse(res, "adset verified", adsetData);
            } else {
                return ErrorEmptyResponse(res, 'Api failed for getting Adset');
            }
        });

    } catch (e) {
        if (env.NODE_ENV_ERROR_LOG == "yes") {
            loggerFileError.error(e);
            loggerFileError.error(req.originalUrl);
            loggerFileError.error(req.body);
        }
        logger.error(e);
        ErrorResponse(res, e);
    }
};


export const getFacebookAdsData = async (req: Request, res: Response) => {
    try {
        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
        let reqData: any = {
            id: parseInt(req.params.id),
            token: req.body.token,
            adsetId: req.body.adsetId,
        };
        var options = {
            'method': 'GET',
            'url': 'https://graph.facebook.com/v16.0/' + req.body.adsetId + '/ads?fields=name,status,id&access_token=' + req.body.token,
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };

        requestClient(options, async function (error: string | undefined, response: any) {
            if (error) throw new Error(error);

            console.log(response.body)

            if (response.statusCode == 200) {
                var response3Data = JSON.parse(response.body);
                var adsData = response3Data.data;

                return SuccessResponse(res, "ads verified", adsData);
            } else {
                return ErrorEmptyResponse(res, 'Api failed for getting adsData');
            }
        });

    } catch (e) {
        if (env.NODE_ENV_ERROR_LOG == "yes") {
            loggerFileError.error(e);
            loggerFileError.error(req.originalUrl);
            loggerFileError.error(req.body);
        }
        logger.error(e);
        ErrorResponse(res, e);
    }
};


export const setFacebookLeadSettings = async (req: Request, res: Response) => {
    try {
        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
        let reqData: any = {
            id: parseInt(req.params.id),
            clientId: req.body.clientId,
            secretKey: req.body.secretKey,
            token: req.body.token,
            status: req.body.status ? req.body.status : 0,
            tokenExpired: req.body.tokenExpired ? req.body.tokenExpired : '',
            insertDateTime: getCurrentDate
        };
        await findFacebookLeadSetting(reqData, (err: any, response: any) => {
            if (err) {
                return ErrorEmptyResponse(res, err);
            } else {
                if (response.length > 0) {
                    let reqDataNew: any = {
                        getId: response[0].id
                    }
                    updateFacebookleadSetting(reqData, reqDataNew, (err: any, response2: any) => {
                        if (err) {
                            return ErrorEmptyResponse(res, err);
                        } else {
                            return SuccessResponse(res, "Successfully updated", []);
                        }
                    });
                } else {
                    InserFacebookleadSetting(reqData, (err: any, response3: any) => {
                        if (err) {
                            return ErrorEmptyResponse(res, err);
                        } else {
                            return SuccessResponse(res, "Successfully updated", response3);
                        }
                    });
                }
            }
        });
    } catch (e) {
        if (env.NODE_ENV_ERROR_LOG == "yes") {
            loggerFileError.error(e);
            loggerFileError.error(req.originalUrl);
            loggerFileError.error(req.body);
        }
        logger.error(e);
        ErrorResponse(res, e);
    }
};

export const getFacebookLeadSettings = async (req: Request, res: Response) => {
    try {
        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
        let reqData: any = {
            id: parseInt(req.params.id),

        };
        await findFacebookLeadSetting(reqData, (err: any, response: any) => {
            if (err) {
                return ErrorEmptyResponse(res, err);
            } else {
                if (response.length > 0) {

                    return SuccessResponse(res, "Successfully updated", response);
                } else {
                    return SuccessResponse(res, "No data found", []);
                }

            }
        });
    } catch (e) {
        if (env.NODE_ENV_ERROR_LOG == "yes") {
            loggerFileError.error(e);
            loggerFileError.error(req.originalUrl);
            loggerFileError.error(req.body);
        }
        logger.error(e);
        ErrorResponse(res, e);
    }
};

export const getfacebookCampaignSettings = async (req: Request, res: Response) => {
    try {
        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
        let reqData: any = {
            id: parseInt(req.params.id),

        };
        await findfacebookCampaignSettings(reqData, (err: any, response: any) => {
            if (err) {
                return ErrorEmptyResponse(res, err);
            } else {
                if (response.length > 0) {
                    return SuccessResponse(res, "Successfully listed", response);
                } else {
                    return SuccessResponse(res, "No data found", []);
                }

            }
        });
    } catch (e) {
        if (env.NODE_ENV_ERROR_LOG == "yes") {
            loggerFileError.error(e);
            loggerFileError.error(req.originalUrl);
            loggerFileError.error(req.body);
        }
        logger.error(e);
        ErrorResponse(res, e);
    }
};


export const setFacebookCampaignData = async (req: Request, res: Response) => {
    try {
        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
        let reqData: any = {
            id: parseInt(req.params.id),
            campaignId: req.body.campaignId,
            adsetId: req.body.adsetId,
            adsId: req.body.adsId,
            lead_status: req.body.lead_status ? req.body.lead_status : 0,
            lead_source: req.body.lead_source ? req.body.lead_source : 0,
            agentData: req.body.agentData,
            insertDateTime: getCurrentDate,
            name: req.body.name ? req.body.name : '',
            ads_name: req.body.ads_name ? req.body.ads_name : '',
            adset_name: req.body.adset_name ? req.body.adset_name : '',
            campaign_name: req.body.campaign_name ? req.body.campaign_name : '',
            campaign_edit_id: req.body.campaign_edit_id ? req.body.campaign_edit_id : 0,
        };
        if (reqData['campaign_edit_id'] != 0) {

            await updateFacebookcampaignData(reqData, (err: any, response3: any) => {
                if (err) {
                    return ErrorEmptyResponse(res, err);
                } else {
                    let reqDataNew1: any = {
                        id: req.params.id,
                        campaignId: req.body.campaign_edit_id
                    }
                    DeleteFacebookCampaignAssignedAgents(reqDataNew1, (err: any, responseNew: any) => {
                        if (err) {
                            return ErrorEmptyResponse(res, err);
                        } else {
                            for (let data of reqData['agentData']) {
                                let reqData4: any = {
                                    agentId: data.id,
                                    sme_id: req.params.id,
                                    facebookCampId: req.body.campaign_edit_id,
                                    insertDateTime: getCurrentDate
                                }
                                AddAgentFromFacebookLead(reqData4, (err: any, responseAddAgent: any) => {
                                    if (err) {
                                        return ErrorEmptyResponse(res, err);
                                    } else {
        
                                    }
                                });
                            }
                            return SuccessResponse(res, "Successfully updated", response3);
                        }
                    });
                }
            });
        } else {

            await InserFacebookcampaignData(reqData, (err: any, response3: any) => {
                if (err) {
                    return ErrorEmptyResponse(res, err);
                } else {
                    for (let data of reqData['agentData']) {
                        let reqData4: any = {
                            agentId: data.id,
                            sme_id: req.params.id,
                            facebookCampId: response3[0],
                            insertDateTime: getCurrentDate
                        }
                        AddAgentFromFacebookLead(reqData4, (err: any, responseAddAgent: any) => {
                            if (err) {
                                return ErrorEmptyResponse(res, err);
                            } else {

                            }
                        });
                    }
                    return SuccessResponse(res, "Successfully updated", response3);
                }
            });
        }

    } catch (e) {
        if (env.NODE_ENV_ERROR_LOG == "yes") {
            loggerFileError.error(e);
            loggerFileError.error(req.originalUrl);
            loggerFileError.error(req.body);
        }
        logger.error(e);
        ErrorResponse(res, e);
    }
};


export const getfacebookCampaignAssignedAgentId = async (req: Request, res: Response) => {
    try {
        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
        let reqData: any = {
            id: parseInt(req.params.id),
        };
        let reqData2: any = {
            facebook_campaign_ads_id: req.body.facebook_campaign_ads_id
        };
        await FindfacebookCampaignAssignedAgentId(reqData, reqData2, (err: any, response: any) => {
            if (err) {
                return ErrorEmptyResponse(res, err);
            } else {
                if (response.length > 0) {
                    return SuccessResponse(res, "Successfully listed", response);
                } else {
                    return SuccessResponse(res, "No data found", []);
                }

            }
        });
    } catch (e) {
        if (env.NODE_ENV_ERROR_LOG == "yes") {
            loggerFileError.error(e);
            loggerFileError.error(req.originalUrl);
            loggerFileError.error(req.body);
        }
        logger.error(e);
        ErrorResponse(res, e);
    }
};



export const getfacebookCampaignadsdata = async (req: Request, res: Response) => {
    try {
        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
        let reqData: any = {
            id: parseInt(req.params.id),
        };
        let reqData2: any = {
            facebook_campaign_ads_id: req.body.facebook_campaign_ads_id
        };
        await FindSinglefacebookCampaignadsdata(reqData, reqData2, (err: any, response: any) => {
            if (err) {
                return ErrorEmptyResponse(res, err);
            } else {
                if (response.length > 0) {
                    return SuccessResponse(res, "Successfully listed", response);
                } else {
                    return SuccessResponse(res, "No data found", []);
                }

            }
        });
    } catch (e) {
        if (env.NODE_ENV_ERROR_LOG == "yes") {
            loggerFileError.error(e);
            loggerFileError.error(req.originalUrl);
            loggerFileError.error(req.body);
        }
        logger.error(e);
        ErrorResponse(res, e);
    }
};


export const updatefaceBookCampaignStatus = async (req: Request, res: Response) => {
    try {
        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);

        let reqData2: any = {
            id: parseInt(req.params.id),
            facebook_campaign_ads_id: req.body.facebook_campaign_ads_id,
            status: req.body.status,
        };
        await UpdatefaceBookCampaignStatus(reqData2, (err: any, response: any) => {
            if (err) {
                return ErrorEmptyResponse(res, err);
            } else {
                if (response.length > 0) {
                    return SuccessResponse(res, "Successfully updated", response);
                } else {
                    return SuccessResponse(res, "No data found", []);
                }

            }
        });
    } catch (e) {
        if (env.NODE_ENV_ERROR_LOG == "yes") {
            loggerFileError.error(e);
            loggerFileError.error(req.originalUrl);
            loggerFileError.error(req.body);
        }
        logger.error(e);
        ErrorResponse(res, e);
    }
};



export const deleteFacebookCampaigndata = async (req: Request, res: Response) => {
    try {
        let currentDate = Date();
        let getCurrentDate = convertTimeZone("IST", "resultTimeZone", currentDate);
        let reqData: any = {
            id: parseInt(req.params.id),
            campaignId: req.body.campaignId,

        };
        await DeleteFacebookCampaignData(reqData, (err: any, response: any) => {
            if (err) {
                return ErrorEmptyResponse(res, err);
            } else {
                DeleteFacebookCampaignAssignedAgents(reqData, (err: any, response: any) => {
                    if (err) {
                        return ErrorEmptyResponse(res, err);
                    } else {
                        return SuccessResponse(res, "Successfully updated", response);
                    }
                });

            }
        });
    } catch (e) {
        if (env.NODE_ENV_ERROR_LOG == "yes") {
            loggerFileError.error(e);
            loggerFileError.error(req.originalUrl);
            loggerFileError.error(req.body);
        }
        logger.error(e);
        ErrorResponse(res, e);
    }
};