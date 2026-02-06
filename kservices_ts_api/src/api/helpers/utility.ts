import moment from "moment";
import mooment_timezone from "moment-timezone";
import { env } from "../../infrastructure/env";
const crypto = require("crypto");
const https = require("https");

export const encodeRequest = (payload: any) =>{
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export const  signRequest = (payload : any) => {
  return crypto
    .createHash("sha256")
    .update(payload)
    .digest("hex");
}


export const getOffset = (pageNo: number, limit: number): any => {
  if (pageNo === 0) {
    pageNo = 1;
  }
  let offsetVal: number = (pageNo - 1) * limit;
  return offsetVal;
};

export const randomString = function (length: number) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};
export const getRandomNumber = function (data: any) {
  var randomNumber = data[Math.floor(Math.random() * data.length)];
  return randomNumber;
};



export const calculateDuration = function (startDate: string, endDate: string) {
  var start_date = moment(startDate, "YYYY-MM-DD HH:mm:ss");
  var end_date = moment(endDate, "YYYY-MM-DD HH:mm:ss");

  var duration = moment.duration(end_date.diff(start_date));
  var seconds = duration.asSeconds();
  return seconds;
};

export const secondsToHms = function (duration: number) {
  var h = Math.floor(duration / 3600);
  var m = Math.floor((duration % 3600) / 60);
  var s = Math.floor((duration % 3600) % 60);
  
  var hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? "m " : "m ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
  return hDisplay + mDisplay + sDisplay;
};

export const convertTimeZone = function (currentTimeZone: any, resultTimeZone: any, time: any) {
  var current_time;

  if( currentTimeZone && currentTimeZone == "IST") {
    current_time = mooment_timezone(time.asSeconds).tz('Asia/Calcutta').format('YYYY-MM-DD HH:mm:ss');
  } else {
    current_time = "Invalid Time Zone";
  }
  
  return current_time;
};

export const generateSecretToken  = function (days: any) {
    var myCurrentDate=new Date();
    var myPastDate=new Date(myCurrentDate);
    
    let day = days.replace('-', '');
    myPastDate.setDate(myPastDate.getDate() - day);
    
    var month = '' + (myPastDate.getMonth() + 1);
    var daynumber = '' + myPastDate.getDate();
    var year = myPastDate.getFullYear();
    let dateToken = year+month+daynumber;
    return dateToken;
};

// Helper function to convert time (HH:mm:ss) to minutes from midnight
export const timeToMinutes = function(timeStr: string) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Helper function to get the current time in HH:mm:ss format
export const  getCurrentTime =function(currentTimeZone: any, resultTimeZone: any, time: any) {
  var current_time;

  if( currentTimeZone && currentTimeZone == "IST") {
    current_time = mooment_timezone(time.asSeconds).tz('Asia/Calcutta').format('HH:mm:ss');
  } else {
    current_time = "Invalid Time Zone";
  }
  
  return current_time;
}