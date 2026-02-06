var btoa = require('btoa');
import moment from "moment";


export const getDateTimeString = function () {
    var date = new Date();

    var hour:any = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min:any  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec:any  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month:any = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day:any  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "_" + month + "_" + day + " " + hour + ":" + min + ":" + sec;
  };


  export const getDateString = function () {
    var date = new Date();

    var year:any = date.getFullYear();

    var month:any = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day:any  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "_" + month + "_" + day;
  };


  export const getDateTimeString2V = function () {
    var date = new Date();

    var hour:any = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min:any  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec:any  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year:any = date.getFullYear();

    var month:any = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day:any  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "" + month + "" + day + "_" + hour + "" + min + "" + sec;
};


export const getAgentDateTime = function () {
    var date = new Date();

    var hour:any = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min:any  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec:any  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    //var msec  = date.getMilliseconds();
    //msec = (msec < 10 ? "0" : "") + msec;


    var year = date.getFullYear();

    var month:any = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day:any  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

   
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
};


export const getcallDateTime = function () {
    var date = new Date();

    var hour:any = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min:any  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec:any  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var msec:any  = date.getMilliseconds();
    msec = (msec < 10 ? "0" : "") + msec;


    var year = date.getFullYear();

    var month:any = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day:any  = date.getDate();
    day = (day < 10 ? "0" : "") + day;


    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec +"."+ msec;
};


export const getcallDateTimeV2 = function () {
    var date = new Date();

    var hour:any = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min:any  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec:any  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var msec:any  = date.getMilliseconds();
    msec = (msec < 10 ? "0" : "") + msec;


    var year:any = date.getFullYear();

    var month:any = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day:any  = date.getDate();
    day = (day < 10 ? "0" : "") + day;


    return year + "-" + month + "-" + day + "T" + hour + ":" + min + ":" + sec +"."+ msec+"Z";
};


export const calculateDuration = function (startDate:any, endDate:any) {
    var start_date:any = moment(startDate, 'YYYY-MM-DD HH:mm:ss');
    var end_date:any = moment(endDate, 'YYYY-MM-DD HH:mm:ss');
 
    var duration:any = moment.duration(end_date.diff(start_date));
    var seconds:any = duration.asSeconds();
    return seconds;
};


export const generateSecretToken = function (days:any) {
    //let days:any = days;  // -2
    var myCurrentDate:any=new Date();
    var myPastDate:any=new Date(myCurrentDate);
    
    let day:any = days.replace('-', '');
    myPastDate.setDate(myPastDate.getDate() - day);
    
    var month:any = '' + (myPastDate.getMonth() + 1);
    var daynumber:any = '' + myPastDate.getDate();
    var year:any = myPastDate.getFullYear();
    let dateToken:any = year+month+daynumber;
    var token:any = btoa(dateToken);
    return token;
};