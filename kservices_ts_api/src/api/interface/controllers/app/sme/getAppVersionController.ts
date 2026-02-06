import { Request, Response } from "express"
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from '../../../../helpers/apiResponse'
import { FindAppVersion } from '../../../../domain/models/sme.model'
import { getAppDetailRequest} from '../../../../domain/entities/sme.entity'
import { env } from '../../../../../infrastructure/env';

/**
 * get settings.
 *
 * @returns {Object}
 */

export const checkAppDetail = async (req: Request, res : Response) =>{
    try{
        
        let reqData: getAppDetailRequest = {
            'id': parseInt(req.params.id),
            'version_name':req.body.version_name,
        };
        await FindAppVersion(reqData,(err:any,response:any) => {
            if(err){
                return ErrorEmptyResponse(res,err);
            }else{
                return SuccessResponse(res,"Successfully listed",response)  
            }
        })
    }catch(e){
        if(env.NODE_ENV_ERROR_LOG == "yes"){
            loggerFileError.error(e);
            loggerFileError.error(req.originalUrl);
            loggerFileError.error(req.body);
        }
        logger.error(e);
        ErrorResponse(res,e);
    }
}



