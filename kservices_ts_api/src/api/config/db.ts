import mongoose from "mongoose";
import { env } from "../../infrastructure/env";
import { logger } from "../../api/lib/logger";
import { Sequelize } from "sequelize";
/** mongodb connection**/
type ORM = {
  sequelize: Sequelize;
};

export const dbConnectionCreate = (): void => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  };
  mongoose
    .connect(env.MONGO_URL!, options)
    .then((res) => {
      logger.info("Connected to Distribution API Database - Initial Connection " + env.MONGO_URL);
    })
    .catch((err) => {
      logger.error(`Initial Distribution API Database connection error occured -`, err);
    });

    mongoose.set("debug", (collectionName, method, query, doc) => {
      console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
    });

  const db = mongoose.connection;
};

const retry = {
  max: Infinity,
  report: (msg: string | Record<string, unknown>) => {
    console.log("Unable to connect to database; retrying.");
    console.log(msg);
  },
  match: [
    /ConnectionError/,
    /SequelizeConnectionError/,
    /SequelizeConnectionRefusedError/,
    /SequelizeHostNotFoundError/,
    /SequelizeHostNotReachableError/,
    /SequelizeInvalidConnectionError/,
    /SequelizeConnectionTimedOutError/,
    /SequelizeConnectionAcquireTimeoutError/,
    /Connection terminated unexpectedly/,
  ],
};

const dialectOptions = {
  charset: "utf8mb4",
  // ssl:
  //   env.SSL_CERT === undefined
  //     ? { rejectUnauthorized: false }
  //     : { cert: env.SSL_CERT },
} as Record<string, unknown>;

const db = env.DB_NAME != undefined ? env.DB_NAME : "kommuno_dev";
const username = env.DB_USER != undefined ? env.DB_USER : "devqa";
const password = env.DB_PASS != undefined ? env.DB_PASS : "Jwejkdcb@@1123";

export const sequelize: Sequelize = new Sequelize(db, username, password, {
  host: env.DB_HOST,
  dialect: "mariadb",
  retry,
  define: {
    freezeTableName: true,
    timestamps: false,
  },
  logging: (msg) => console.log(msg),

  // SSL needs to remain enabled for deployment.
  // If you need to disable SSL for you local server,
  // you need to do it by setting the DB_SSL_REQUIRED environment variable to 'false'.
  dialectOptions,
});

/* Another new Reader DB Connection*/
const db_reader = env.READER_DB_NAME != undefined ? env.READER_DB_NAME : "kommuno_dev";
const username_reader = env.READER_DB_USER != undefined ? env.READER_DB_USER : "devqa";
const password_reader = env.READER_DB_PASS != undefined ? env.READER_DB_PASS : "Jwejkdcb@@1123";

export const sequelize_reader: Sequelize = new Sequelize(db_reader, username_reader, password_reader, {
  host: env.READER_DB_HOST,
  dialect: "mariadb",
  retry,
  define: {
    freezeTableName: true,
    timestamps: false,
  },
  logging: (msg) => console.log(msg),

  // SSL needs to remain enabled for deployment.
  // If you need to disable SSL for you local server,
  // you need to do it by setting the DB_SSL_REQUIRED environment variable to 'false'.
  dialectOptions,
});

/* Another new Webrtc DB Connection*/
const db_webrtc = env.WEBRTC_DB_NAME != undefined ? env.WEBRTC_DB_NAME : "kommuno_webrtc";
const username_webrtc = env.WEBRTC_DB_USER != undefined ? env.WEBRTC_DB_USER : "webrtc";
const password_webrtc = env.WEBRTC_DB_PASS != undefined ? env.WEBRTC_DB_PASS : "WebRTC@@1123";

export const sequelize_webrtc: Sequelize = new Sequelize(db_webrtc, username_webrtc, password_webrtc, {
  host: env.WEBRTC_DB_HOST,
  dialect: "mariadb",
  retry,
  define: {
    freezeTableName: true,
    timestamps: false,
  },
  logging: (msg) => console.log(msg),

  // SSL needs to remain enabled for deployment.
  // If you need to disable SSL for you local server,
  // you need to do it by setting the DB_SSL_REQUIRED environment variable to 'false'.
  dialectOptions,
});

export const ORM = {
  sequelize,
};
