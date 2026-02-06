import mongoose from 'mongoose'
import { env } from '../../infrastructure/env'
import {logger} from '../../api/lib/logger'
import { Sequelize } from 'sequelize'
/** mongodb connection**/
type ORM = {
  sequelize: Sequelize
}



export const dbConnectionCreate = () : void =>{
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    };
    mongoose .connect(env.MONGO_URL!, options)
        .then((res) => {
          logger.info(
            'Connected to Distribution API Database - Initial Connection ' + env.MONGO_URL
          );
        })
        .catch((err) => {
          logger.error(
            `Initial Distribution API Database connection error occured -`,
            err
          );
        });

   const db = mongoose.connection;
}

const retry = {
  max: Infinity,
  report: (msg: string | Record<string, unknown>) => {
    console.log('Unable to connect to database; retrying.')
    console.log(msg)
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
}

const dialectOptions = {
  charset: 'utf8mb4',
  // ssl:
  //   env.SSL_CERT === undefined
  //     ? { rejectUnauthorized: false }
  //     : { cert: env.SSL_CERT },
} as Record<string, unknown>

const db = (env.DB_NAME != undefined) ? env.DB_NAME : "wringg_db_dev"
const username = (env.DB_USER != undefined) ? env.DB_USER : "devqa"
const password = (env.DB_PASS != undefined) ? env.DB_PASS : "Jwejkdcb@@1123"

export const sequelize: Sequelize = new Sequelize(
  db,
  username,
  password,
  {
    host: env.DB_HOST,
    dialect: 'mariadb',
    retry,
    define: {
      freezeTableName: true,
      timestamps: false
    },
    logging: (msg) => console.log(msg),
    
    // SSL needs to remain enabled for deployment.
    // If you need to disable SSL for you local server,
    // you need to do it by setting the DB_SSL_REQUIRED environment variable to 'false'.
    dialectOptions,
  }
)

export const ORM ={
  sequelize
}


