import AWS from 'aws-sdk'
import fs from 'fs'
import { env } from '../../infrastructure/env'
const privateKey = env.JWT_SECRET as string;

const s3 = new AWS.S3({
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY
  })

  /**
     * s3 file upload base64
     * @param {string}
  */
export function s3UploadBase64(folder:string,bufEncode:any,fileName:string,callback:any) {
  try {
              const params:any = {
                  Bucket: (env.AWS_BUCKET_NAME !== undefined) ? env.AWS_BUCKET_NAME : "petapp",
                  Key: folder+"/"+fileName, 
                  Body: bufEncode,
                  ContentEncoding: 'base64',
                  ContentType: 'image/png',
                  ACL:'public-read'
              };
              s3.upload(params, function(s3Err:any, data:any) {
                  if (s3Err) throw s3Err
  
                  callback(null,data)
                  console.log(`File uploaded successfully at ${data.Location}`)
              });

  } catch (error) {
      console.log(error)
      return error;
  }
}

  /**
     * s3 file upload
     * @param {string}
    */
export function s3Upload(folder:string,file: any, callback:any) {
    try {
                const fileStream = fs.createReadStream(file[0].path);
                const params:any = {
                    Bucket: (env.AWS_BUCKET_NAME !== undefined) ? env.AWS_BUCKET_NAME : "petapp",
                    Key: folder+"/"+file[0].filename, 
                    Body: fileStream
                };
                s3.upload(params, function(s3Err:any, data:any) {
                    if (s3Err) throw s3Err
    
                    callback(null,data)
                    console.log(`File uploaded successfully at ${data.Location}`)
                });

    } catch (error) {
        console.log(error)
        return error;
    }
  }

    /**
     * s3 file upload multiple
     * @param {string}
    */
export function s3UploadMultiple(folder:string,file: any, callback:any) {
    try {
                
                var ResponseData:any = [];
                file.map((item:any) => {
                    const fileStream = fs.createReadStream(item.path);
                    var params = {
                      Bucket: (env.AWS_BUCKET_NAME !== undefined) ? env.AWS_BUCKET_NAME : "curlytales",
                      Key: folder+"/"+item.filename, 
                      Body: fileStream
                };
                s3.upload(params, function (s3Err:any, data:any) {
                      if (s3Err) {
                        if (s3Err) throw s3Err
                      }else{
                          ResponseData.push(data);
                          callback(null,ResponseData)
                        }
                     });
                   });

    } catch (error) {
        console.log(error)
        return error;
    }
  }