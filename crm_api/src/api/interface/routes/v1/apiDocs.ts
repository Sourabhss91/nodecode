import express, { Request, Response } from "express";
import * as swaggerDocument from '../../../../../api-docs/swagger.json';
import swaggerUi from "swagger-ui-express";
import { logger } from '../../../lib/logger'
const route = express.Router();

/** create user router function */
export const ApiDocsRoute = (router: express.Router): void => {
    router.use('/v1',router)
    /** Swagger Route */
    try {
        router.use('/api-docs', swaggerUi.serve);
        router.get('/api-docs', swaggerUi.setup(swaggerDocument));
    } catch (error) {
        logger.error(error);
    }
};