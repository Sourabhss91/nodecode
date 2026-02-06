require('custom-env').env('dev')

import dotenv from 'dotenv'

dotenv.config()

/** export env constant */
export const env = {
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    TOKEN_HEADER_KEY: process.env.TOKEN_HEADER_KEY,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    DIALECT: process.env.DIALECT,
    POOL_MAX: process.env.POOL_MAX,
    POOL_MIN: process.env.POOL_MIN,
    POOL_ACQUIRE: process.env.POOL_ACQUIRE,
    POOL_IDLE: process.env.POOL_IDLE,
    APPPORT: process.env.PORT,
    JWT_TIMEOUT_DURATION: process.env.JWT_TIMEOUT_DURATION,
    JWT_TIMEOUT_DURATION_APP: process.env.JWT_TIMEOUT_DURATION_APP,
    JWT_TIMEOUT_DURATION_WEB: process.env.JWT_TIMEOUT_DURATION_WEB,
    LOG_LEVEL:process.env.LOG_LEVEL,
    HOST:process.env.HOST,
    NODE_ENV:process.env.NODE_ENV,
    FCM_SERVER_KEY:process.env.FCM_SERVER_KEY,
    SITE_TITLE:process.env.SITE_TITLE,
    AWS_ACCESS_KEY_ID:process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY:process.env.AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME:process.env.AWS_BUCKET_NAME,
    FIREBASE_DOMAIN_PREFIX:process.env.FIREBASE_DOMAIN_PREFIX,
    FIREBASE_LINK:process.env.FIREBASE_LINK,
    ANDROID_PACKAGE:process.env.ANDROID_PACKAGE,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_USERNAME: process.env.EMAIL_USERNAME,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    log_level: process.env.log_level,
    log_file_size : process.env.log_file_size,
    log_write_to_console_flag : process.env.log_write_to_console_flag,
    log_general_log_path : process.env.log_general_log_path,
    log_general_log_file : process.env.log_general_log_file,
    log_summary_log_path : process.env.log_summary_log_path,
    log_summary_log_file : process.env.log_summary_log_file,
    log_error_log_path : process.env.log_error_log_path,
    log_error_log_file:process.env.log_error_log_file,
    log_cdr_log_path :process.env.log_cdr_log_path,
    log_cdr_log_file : process.env.log_cdr_log_file
}