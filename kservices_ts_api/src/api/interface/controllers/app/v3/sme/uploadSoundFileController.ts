import { Request, Response } from "express"
import { toLowerCase } from "fp-ts/lib/string";
import { s3Upload } from '../../../../../lib/awsS3'
import { env } from "../../../../../../infrastructure/env";
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../../helpers/apiResponse";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { logger, loggerFile, loggerFileError } from "../../../../../lib/logger";
let uploadPath = env.IVR_FLOW_FILE_PATH;
//let uploadPath = './uploads';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath+req.params.id);
    },
    filename: function (req: any, file: any, cb: any) {
        let fileName = req.params.id+"-"+ Date.now() + Date.now() + path.extname(file.originalname)
        cb(null, fileName)
    }
});
/**
 * add file.
 *
 * @returns {Object}
 */

export const uploadSoundFile = (req: Request, res : Response): any =>{
    try{
        
        let dir = uploadPath+req.params.id;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        multer({ storage:storage, fileFilter:function(req,file:any,callback:any){
            if (file.mimetype == "audio/wav" || file.mimetype == "audio/wave" || file.mimetype == "audio/mp3" || file.mimetype == "audio/MP4") {
                callback(null, file);
            }else{
                callback(null, false);
                console.log(res,'Only .wave, .wav, .mp3 and .MP4 format allowed!');
            }
        } }).array('file',1)(req,res,function(err){
            if(err){
                console.log(err);
            }else{
                if(req.files != undefined && req.files.length != 0){
                    
                    return SuccessResponse(res, "Successfully", req.files); 
                }
            }
        })
    }catch(e){
        if(env.NODE_ENV_ERROR_LOG == "yes"){
            loggerFileError.error(e);
            loggerFileError.error(req.originalUrl);
            loggerFileError.error(req.body);
          }
        console.log(e);
    }
}
