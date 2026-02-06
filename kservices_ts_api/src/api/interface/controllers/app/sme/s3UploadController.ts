import { Request, Response } from "express"
import { toLowerCase } from "fp-ts/lib/string";
import { s3Upload,s3Play } from '../../../../lib/awsS3'
import { ErrorResponse, SuccessResponse, ErrorEmptyResponse } from "../../../../helpers/apiResponse";
import multer from 'multer';
import path from 'path';
import  mongoose  from 'mongoose'
import fs from 'fs'
import { FindAudioUrlRrcording } from "../../../../domain/models/sme.model";
var playAudioURL = require('play-audio-url');
import { logger, loggerFile, loggerFileError } from "../../../../lib/logger";
import { env } from '../../../../../infrastructure/env';


/** Object id data type */
const ObjectId = mongoose.Types.ObjectId;

const storage = multer.diskStorage({
   
    filename: function (req: any, file: any, cb: any) {
        let fileName = 'KService-'+ Date.now() + Date.now() + path.extname(file.originalname)
        cb(null, fileName)
    }
});
/**
 * add file.
 *
 * @returns {Object}
 */

export const s3UploadData = (req: Request, res : Response): any =>{
    try{
        
        multer({ storage:storage,fileFilter:function(req,file:any,callback:any){
            if (file.mimetype == "audio/wav" || file.mimetype == "audio/wave" || file.mimetype == "audio/mp3" || file.mimetype == "audio/MP4") {
                callback(null, file);
            }else{
                callback(null, true);
                console.log(res,'Only .wave, .wav, .mp3 and .MP4 format allowed!');
                return ErrorEmptyResponse(res, "'Only .wave, .wav, .mp3 and .MP4 format allowed!'");
            }
        } }).array('kservice_file',1)(req,res,function(err){

            if(err){
                if(env.NODE_ENV_ERROR_LOG == "yes"){
                    loggerFileError.error(err);
                    loggerFileError.error(req.originalUrl);
                    loggerFileError.error(req.body);
                  }
                console.log(err);
                return ErrorEmptyResponse(res, err);
            }else{
                if(req.files != undefined && req.files.length != 0){
                    const filePath = s3Upload('kservice',req.files,(err:any,s3Data:any)=>{

                        console.log(s3Data)
                        return SuccessResponse(res, "Successfully upload", s3Data);
                    })
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



/**
 * play audio.
 *
 * @returns {Object}
 */

 export const playAudio = async (req: Request, res : Response) =>{
    try{
          let call_id:any = req.params.id;

          await FindAudioUrlRrcording(call_id, (err: any, response: any) => {
            if (err) {
              return ErrorEmptyResponse(res, err);
            } else {
                if(response.length > 0){
                    console.log(response[0].s3_url)
                    //var filePath = './upload/20002008/BabyElephantWalk60.wav';
                    //var filePath = response[0].s3_url;

                    const filePath = s3Play(res,'20002002','KService-16604687849181660468784918.wav',(err:any,s3Data:any)=>{

                        console.log(s3Data)
                   //  var stat = fs.statSync(s3Data);
                
                    // res.writeHead(200, {
                    //     'Content-Type': 'audio/mpeg',
                    //     'Content-Length': s3Data.ContentLength
                    // });
                    // res.write(s3Data.body.toString('utf-8'));
                    // var readStream = fs.createReadStream(s3Data.body.toString('utf-8'),{ highWaterMark: 1 * 16 });
                    // readStream.on('data', (chunk) => {
                    //     res.write(chunk);
                    //    });
                    })


                    // var stat = fs.statSync(filePath);
                
                    // res.writeHead(200, {
                    //     'Content-Type': 'audio/mpeg',
                    //     'Content-Length': stat.size
                    // });
                    // var readStream = fs.createReadStream(filePath,{ highWaterMark: 1 * 16 });
                    // readStream.on('data', (chunk) => {
                    //     res.write(chunk);
                    //    });
                           //console.log("Serving");
                  /*  player.play({
                        //path: './upload/20002008/BabyElephantWalk60.wav',
                        path: response[0].s3_url,
                      }).then(() => {
                        console.log('The wav file started to be played successfully.');
                      }).catch((error:any) => {
                        console.error(error);
                      });*/

                     // load('./upload/20002008/BabyElephantWalk60.wav').then(play);
                    
                    //const buffer = Buffer.from(response[0].s3_url);
                    //console.log('from()', buffer);
                    // from() <Buffer 43 68 61 6e 67 65 20 6d 65 20 74 6f 20 62 75 66 66 65 72>
                   // console.log('length', buffer.length); 
                    // length 19
                    //console.log('toString()', buffer.toString());
                    // toString() Change me to buffer
                    
                    //const array = [Buffer.from('skip '), Buffer.from('skip '), Buffer.from('skipping ')];
                    //const buffer2 = Buffer.concat(array);
                    //console.log('concat():', buffer2.toString());
                    // concat(): skip skip skipping
                    
                    //const buffer3 = Buffer.alloc(5);
                    //console.log('alloc():', buffer3);

                   // return SuccessResponse(res, "streaming.............", "");

                }else{
                   // return ErrorEmptyResponse(res, "Records not found");
                }
            }
          }); 
        

      
        // return res.status(200).send({message: "streaming..."})

        //return SuccessResponse(res, "Successfully upload", s3Data);

   
    }catch(e){
        console.log(e);
    }
}

/**
 * play audio.
 *
 * @returns {Object}
 */

 export const playAudioOls = async (req: Request, res : Response) =>{
    try{
        res.render('play',{url:"https://dev-kommuno.s3.amazonaws.com/20002002/KService-16604687849181660468784918.wav"});
    }catch(e){
        console.log(e);
    }
}