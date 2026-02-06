import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";
import  {logger, loggerFileError}  from '../lib/logger';
import { ErrorResponse } from '../helpers/apiResponse';
import { env } from '../../infrastructure/env';

const validate = (schema: AnySchema) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    return next();
  } catch (error) {
    if(env.NODE_ENV_ERROR_LOG == "yes"){
      loggerFileError.info("-------Validation Error Start-------");
      loggerFileError.info(req.originalUrl);
      loggerFileError.info(error);
      loggerFileError.info("-------Validation Error End-------");
    }
    
    logger.error(error);
    let errorMessage = "Failed to do something exceptional";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return ErrorResponse(res,errorMessage);
  }
};

export default validate;