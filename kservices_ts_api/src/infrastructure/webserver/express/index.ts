import { env } from "../../env";
import { sequelize, dbConnectionCreate } from "../../../api/config/db";
import express from "express";
import bodyParser from "body-parser";
import { CronJob } from "cron";
import { createRouter } from "./v1/routes";
import { createRouterV2 } from "./v2/routes";
import { createRouterV3 } from "./v3/routes";
//import { logger, loggerFile } from "../../../api/lib/logger";
import Socket from "../../../api/interface/controllers/app/socket/socketController";
import { addTotalLeadSummaryData } from "../../../api/interface/controllers/app/sme/leadSettingsController";
import { glogger } from "../../../api/helpers/logger";
//require('newrelic');

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });

export const getSocketIo = function () {
  return io;
};
/** create server module */
export const createServer = (): void => {
  const port = env.APPPORT;
  const host = env.HOST;

  /* To handle invalid JSON data request */
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
  app.set("view engine", "ejs");
  /* For parsing urlencoded data */
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  /** add header */
  app.use(function (req, res, next) {
    //loggerFs('ERR', 123456, 'agent_processor', 'Internal Function [freeAgent]');

    glogger("DEB", "0", "index", "Request URL:" + req.originalUrl);
    glogger("DEB", "0", "index", "Body:" + JSON.stringify(req.body));

    //if (env.NODE_ENV_LOG == "yes") {
    /** set logger every http request */
    //loggerFile.info(req.originalUrl);
    //loggerFile.info(req.body);

    //}
    /*CORS headers*/
    var responseSettings = {
      AccessControlAllowOrigin: req.headers.origin,
      AccessControlAllowHeaders: "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name, Origin",
      AccessControlAllowMethods: "POST, GET, PUT, DELETE, OPTIONS",
      AccessControlAllowCredentials: "true",
    };
    // Set custom headers for CORS
    res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
    res.header("Access-Control-Allow-Origin", responseSettings.AccessControlAllowOrigin);
    res.header("Access-Control-Allow-Headers", req.headers["access-control-request-headers"] ? req.headers["access-control-request-headers"] : "x-requested-with");
    res.header("Access-Control-Allow-Methods", req.headers["access-control-request-method"] ? req.headers["access-control-request-method"] : responseSettings.AccessControlAllowMethods);
    if ("OPTIONS" == req.method) {
      res.send(200).end();
    } else {
      next();
    }
  });

  app.get("/test-socket", function (req, res) {
    res.render("sockettest.ejs");
  });

  io.on("connection", function (socket: any) {
    //logger.info("Socket connected");
    //logger.info(socket.id);
    glogger("INFO", "0", "index", "Socket connected, id:" + socket.id);

    new Socket(socket, io.sockets);
  });
  /** create database connection */
  //dbConnectionCreate();
  sequelize.authenticate();
  /** router */
  app.use("/v1", createRouter());

  /* V2 version router */
  app.use("/v2", createRouterV2());

  /* V3 version router */
  app.use("/v3", createRouterV3());


  //Cron for add total lead summary 
  /*const ADD_TOTAL_LEAD_SUMMARY = env.ADD_TOTAL_LEAD_SUMMARY;
  var addTotalLeadSummaryCronJob = new CronJob("" + ADD_TOTAL_LEAD_SUMMARY + "", async () => {
    try {
      console.log("ADD_TOTAL_LEAD_SUMMARY Cron job run------------");
      addTotalLeadSummaryData();
    } catch (e) {
      console.error(e);
    }
  });
  addTotalLeadSummaryCronJob.start();*/

  let abc: any = "12,34,56";
  console.log(abc.split(","));

  /** listen server */
  http.listen(port, () => {
    //logger.info(`APP listening on port http://${host}:${port}`);
    glogger("DEB", "0", "index", `APP listening on port http://${host}:${port}`);
  });
};
