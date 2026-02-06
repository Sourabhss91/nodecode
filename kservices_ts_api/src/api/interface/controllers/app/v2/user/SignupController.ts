import { Request, Response } from "express"
import {logger} from '../../../../../lib/logger'
import { ErrorResponse, SuccessResponse, ErrorResWithSuccess } from '../../../../../helpers/apiResponse'
import { Signup } from '../../../../../domain/models/v2/user.model'
import { env } from '../../../../../../infrastructure/env'
import multer from 'multer';
import path from 'path';
import  mongoose  from 'mongoose'
/** Object id data type */
const ObjectId = mongoose.Types.ObjectId;

const storage = multer.diskStorage({
    
    filename: function (req: any, file: any, cb: any) {
        console.log(file)
        let fileName = 'USER-'+ Date.now() + Date.now() + path.extname(file.originalname)
        cb(null, fileName)
    }
});

/**
 * social create.
 *
 * @returns {Object}
 */

export const SignupUser = async (req: Request, res : Response) =>{
    try{
        /*let payloadRequest : object = {
            user_id:parseInt(req.body.user_id),
            about: req.body.about,
        }
        signup(payloadRequest,(err:any,data:any)=>{
                if(err){
                    return ErrorResponse(res,err); 
                }else{
                    return successResponse(res,"User created", data); 
                }
        })*/
    }catch(e){
        logger.error(e);
        ErrorResponse(res,e);
    }
}
