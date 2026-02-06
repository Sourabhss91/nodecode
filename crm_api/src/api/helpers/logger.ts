import moment from "moment";
import fs from "fs";
import { env } from "../../infrastructure/env";
import { getDateTimeString, getDateString } from "../../api/helpers/datetime";
var gwriteStream: any = null;
var gwriteStreamErr: any = null;
var gFiledDate: any = null;
var gFiledDateErr: any = null;
var gwriteStreamCdr: any = null;
var gFiledDateCdr: any = null;
export const glogger = (type: any, session: any, funcfile: any, string: any): any => {
  var postFix: any = "";
  var postFixError: any = "";
  var postFixCdr: any = "";

  var getStream = function () {
    var options: any = {
      flags: "a",
      defaultEncoding: "utf8",
      fd: null,
      mode: 0o666,
      autoClose: true,
    };

    /*console.log("level: ", env.log_level);
    console.log("file_size: ", env.log_file_size);
    console.log("write_to_console_flag: ", env.log_write_to_console_flag);
    console.log("general_log_path: ", env.log_general_log_path);
    console.log("general_log_file: ", env.log_general_log_file);
    console.log("summary_log_path: ", env.log_summary_log_path);
    console.log("summary_log_file: ", env.log_summary_log_file);
    console.log("error_log_path: ", env.log_error_log_path);
    console.log("error_log_file: ", env.log_error_log_file);
    console.log("cdr_log_path: ", env.log_cdr_log_path);
    console.log("cdr_log_file: ", env.log_cdr_log_file);*/

    var dateTime = Date();

    var curPostFix = getDateString();
    gFiledDate = curPostFix;
    if (curPostFix != postFix) {
       var loggerFileName = (env.log_general_log_path as string) + env.log_general_log_file + "_" + curPostFix + ".txt";
      //  console.log("Logger File(%s)", loggerFileName);
       if (gwriteStream) gwriteStream.close();
       gwriteStream = null;
       gwriteStream = fs.createWriteStream(loggerFileName, options);
       postFix = curPostFix;
    }

    var curPostFixError = getDateString();
    gFiledDateErr = curPostFixError;
    if (curPostFixError != postFixError) {
      var loggerFileName = (env.log_error_log_path as string) + env.log_error_log_file + "_" + curPostFixError + ".txt";
      console.log("Logger File(%s)", loggerFileName);
      if (gwriteStreamErr) gwriteStreamErr.close();
      gwriteStreamErr = null;
      gwriteStreamErr = fs.createWriteStream(loggerFileName, options);
      postFixError = curPostFixError;
    }

    var curPostFixCdr = getDateString();
    gFiledDateCdr = curPostFixCdr;
    if (curPostFixCdr != postFixCdr) {
      var loggerFileName = (env.log_cdr_log_path as string) + env.log_cdr_log_file + "_" + curPostFixCdr + ".txt";
      console.log("Logger File(%s)", loggerFileName);
      if (gwriteStreamCdr) gwriteStreamCdr.close();
      gwriteStreamCdr = null;
      gwriteStreamCdr = fs.createWriteStream(loggerFileName, options);
      postFixCdr = curPostFixCdr;
    }

  };

  /*glogger.prototype.init = function (type:any, session:any, string:any) {
  getStream();
  if (gwriteStream){
          var dateTime = new dt();
          var dateTimeString = dateTime.getDateTimeString();
          gwriteStream.write('['+type+'] ['+dateTimeString+'] ['+session+'] ['+string+']'+'\n');
          if(cfg.log.write_to_console_flag === '1')
          {
              console.log('['+type+'] ['+dateTimeString+'] ['+session+'] ['+string+']');
          }
      } else {
          console.log('ERROR: Writestream is null, Could not write logss'+ dateTimeString+'#'+string);
      }
   }

   glogger.prototype.log = function (type:any, session:any, funcfile:any, string:any) {
   getStream();*/

  //writing error logs in seperate file.
  // if (gwriteStreamErr) {
  var dateTime = new Date();
  var dateTimeString = getDateTimeString();
  var dateString = getDateString();
  if (dateString != gFiledDateErr) {
    console.log("generating new log file.." + dateTimeString + "#" + gFiledDateErr);
    getStream();
    //creating new day log file
  }

  if (type === "ERR") {
     gwriteStreamErr.write("[" + type + "] [" + dateTimeString + "] [" + session + "] [" + funcfile + "] " + string + "" + "\n");
   }

  if (type === "CDR") {
    gwriteStreamCdr.write("[" + type + "] [" + dateTimeString + "] [" + session + "] [" + funcfile + "] " + string + "" + "\n");
  }

  //writing general logs
  if (gwriteStream) {
    var dateTimes: any = Date();
    var dateTimeString = getDateTimeString();
    var dateString = getDateString();
    if (dateString != gFiledDate) {
      console.log("generating new log file.." + dateTimeString + "#" + gFiledDate);
      getStream();
      //creating new day log file
    }

    //4 {DEB, INFO, IMP, ERR}
    //3 {INFO, IMP, ERR}
    //2 {IMP, ERR}
    //1 {ERR}

    //console.log("level:"+cfg.log.level+", type:"+type+"");

    if (type === "IMP") {
      gwriteStream.write("\n");
      if (env.log_write_to_console_flag === "1") {
        console.log("");
      } else {
        console.log("ERROR: Writestream is null, Could not write logss" + dateTimeString + "#" + string);
      }
    }

    if (env.log_level === "4" && (type === "DEB" || type === "INFO" || type === "IMP" || type === "ERR" || type === "CDR")) {

      //console.log("=======>  [" + type + "] [" + dateTimeString + "] [" + session + "] [" + funcfile + "] " + string + "<<<<<<<<< end");

      gwriteStream.write("[" + type + "] [" + dateTimeString + "] [" + session + "] [" + funcfile + "] " + string + "" + "\n");
      if (env.log_write_to_console_flag === "1") {
        console.log("[" + type + "] [" + dateTimeString + "] [" + session + "] [" + funcfile + "] " + string + "");
      } else {
        console.log("ERROR: Writestream is null, Could not write logss" + dateTimeString + "#" + string);
      }
    } else if (env.log_level === "3" && (type === "INFO" || type === "IMP" || type === "ERR"  || type === "CDR")) {
      gwriteStream.write("[" + type + "] [" + dateTimeString + "] [" + session + "] [" + funcfile + "] " + string + "" + "\n");
      if (env.log_write_to_console_flag === "1") {
        console.log("[" + type + "] [" + dateTimeString + "] [" + session + "] [" + funcfile + "] " + string + "");
      } else {
        console.log("ERROR: Writestream is null, Could not write logss" + dateTimeString + "#" + string);
      }
    } else if (env.log_level === "2" && (type === "IMP" || type === "ERR" || type === "CDR")) {
      gwriteStream.write("[" + type + "] [" + dateTimeString + "] [" + session + "] [" + funcfile + "] " + string + "" + "\n");
      if (env.log_write_to_console_flag === "1") {
        console.log("[" + type + "] [" + dateTimeString + "] [" + session + "] [" + funcfile + "] " + string + "");
      } else {
        console.log("ERROR: Writestream is null, Could not write logss" + dateTimeString + "#" + string);
      }
    } else if (env.log_level === "1" && type === "ERR" || type === "CDR") {
      gwriteStream.write("[" + type + "] [" + dateTimeString + "] [" + session + "] [" + funcfile + "] " + string + "" + "\n");
      if (env.log_write_to_console_flag === "1") {
        console.log("[" + type + "] [" + dateTimeString + "] [" + session + "] [" + funcfile + "] " + string + "");
      } else {
        console.log("ERROR: Writestream is null, Could not write logss" + dateTimeString + "#" + string);
      }
    }
  }

  //}
  return this;
};
