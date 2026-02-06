import AWS from "aws-sdk";
import e from "express";
import fs from "fs";
import { env } from "../../infrastructure/env";
const privateKey = env.JWT_SECRET as string;

const s3 = new AWS.S3({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
});

/**
 * s3 file upload base64
 * @param {string}
 */
export function s3Play(res: any, folder: string, fileName: string, callback: any) {
  try {
    var filePath = "./upload/20002008/BabyElephantWalk60.wav";
    const params: any = {
      Bucket: env.AWS_BUCKET_NAME !== undefined ? env.AWS_BUCKET_NAME : "kumono",
      Key: folder + "/" + fileName,
    };
    var url = s3.getSignedUrl("getObject", params);
    console.log("The URL is", url);
    var stat = fs.statSync(url);

    res.writeHead(200, {
      "Content-Type": "audio/mpeg",
      "Content-Length": stat.size,
    });
    var readStream = fs.createReadStream(url, { highWaterMark: 1 * 16 });
    readStream.on("data", (chunk) => {
      res.write(chunk);
    });

    // s3.getObject(
    //   params,
    //   (err, file) => {
    //     if (err){
    //       callback(err,null)
    //     }else{

    // res.writeHead(200, {
    //   'Content-Type': 'audio/mpeg',
    //   'Content-Length': file.ContentLength
    // });

    //   res.writeHead(200, {
    //         "Accept-Ranges": "bytes",
    //         "Content-Length": file.ContentLength,
    //         "Content-Type": "audio/wav"
    // });

    //callback(null,file)
    //     }
    //   }
    // );

    // const file = require('fs').createWriteStream(folder+"/"+fileName);
    //let readStream = s3.getObject(params).createReadStream().pipe(file);
    // readStream.on('data', (chunk: any) => {
    //           res.write(chunk);
    //          });

    // s3.getObject(
    //   params,
    //   (err, file) => {
    //     if (err){
    //       callback(err,null)
    //     }else{
    //       callback(null,file)
    //     }
    //   }
    // );

    // var out = fs.createWriteStream('https://dev-kommuno.s3.amazonaws.com/20002002/KService-16604687849181660468784918.wav');
    //s3.getObject(params).createReadStream().pipe(out);
    //response.Body.pipe(res);
    callback(null, null);
    return;
  } catch (error) {
    console.log(error);
    return error;
  }
}

/**
 * s3 file upload base64
 * @param {string}
 */
export function s3UploadBase64(folder: string, bufEncode: any, fileName: string, callback: any) {
  try {
    const params: any = {
      Bucket: env.AWS_BUCKET_NAME !== undefined ? env.AWS_BUCKET_NAME : "kumono",
      Key: folder + "/" + fileName,
      Body: bufEncode,
      ContentEncoding: "base64",
      ContentType: "image/png",
      ACL: "public-read",
    };
    s3.upload(params, function (s3Err: any, data: any) {
      if (s3Err) throw s3Err;

      callback(null, data);
      console.log(`File uploaded successfully at ${data.Location}`);
    });
    return;
  } catch (error) {
    console.log(error);
    return error;
  }
}

/**
 * s3 file upload
 * @param {string}
 */
export function s3Upload(folder: string, file: any, callback: any) {
  try {
    const fileStream = fs.createReadStream(file[0].path);
    const params: any = {
      Bucket: env.AWS_BUCKET_NAME !== undefined ? env.AWS_BUCKET_NAME : "dev-kommuno",
      Key: folder + "/" + file[0].filename,
      Body: fileStream,
    };
    s3.upload(params, function (s3Err: any, data: any) {
      if (s3Err) throw s3Err;

      callback(null, data);
      console.log(`File uploaded successfully at ${data.Location}`);
    });
    return;
  } catch (error) {
    console.log(error);
    return error;
  }
}

/**
 * s3 file upload multiple
 * @param {string}
 */
export function s3UploadMultiple(folder: string, file: any, callback: any) {
  try {
    var ResponseData: any = [];
    file.map((item: any) => {
      const fileStream = fs.createReadStream(item.path);
      var params = {
        Bucket: env.AWS_BUCKET_NAME !== undefined ? env.AWS_BUCKET_NAME : "curlytales",
        Key: folder + "/" + item.filename,
        Body: fileStream,
      };
      s3.upload(params, function (s3Err: any, data: any) {
        if (s3Err) {
          if (s3Err) throw s3Err;
        } else {
          ResponseData.push(data);
          callback(null, ResponseData);
        }
      });
    });
    return;
  } catch (error) {
    console.log(error);
    return error;
  }
}
