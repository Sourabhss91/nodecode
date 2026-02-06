
import moment from "moment";
import mooment_timezone from "moment-timezone"
export const getOffset = (pageNo: number, limit: number): any => {
  if (pageNo === 0) {
    pageNo = 1
  }
  let offsetVal: number = (pageNo - 1) * limit;
  return offsetVal;
}

export const randomString = function (length: number) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

export const calculateDuration = function (startDate: string, endDate: string) {
  var start_date = moment(startDate, 'YYYY-MM-DD HH:mm:ss');
  var end_date = moment(endDate, 'YYYY-MM-DD HH:mm:ss');

  var duration = moment.duration(end_date.diff(start_date));
  var seconds = duration.asSeconds();
  return seconds;
};

export const secondsToHms = function (duration: number,) {
  var h = Math.floor(duration / 3600);
  var m = Math.floor(duration % 3600 / 60);
  var s = Math.floor(duration % 3600 % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? "h " : "h ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? "m " : "m ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
  return hDisplay + mDisplay + sDisplay;
};

export const getRandomNumber = function (data: any) {
  var randomNumber = data[Math.floor(Math.random() * data.length)];
  return randomNumber;
};

export const convertTimeZone = function (currentTimeZone: any, resultTimeZone: any, time: any) {
  var current_time;

  if (currentTimeZone && currentTimeZone == "IST") {
    current_time = mooment_timezone(time.asSeconds).tz('Asia/Calcutta').format('YYYY-MM-DD HH:mm:ss');
  } else {
    current_time = "Invalid Time Zone";
  }

  return current_time;
};

export const getNumberOfDays = function (a: any, b: any) {
  const date1 = new Date(a);
  const date2 = new Date(b);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  return diffInDays;
}



// Helper function to convert time (HH:mm:ss) to minutes from midnight
export const timeToMinutes = function(timeStr: string) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Helper function to get the current time in HH:mm:ss format
export const  getCurrentTime =function() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}