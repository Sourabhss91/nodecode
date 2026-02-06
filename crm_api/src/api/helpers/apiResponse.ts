import { Constants  } from "../config/constants";

/** success created */
export const successCreated = (res:any,msg:string): void =>{
    const dataRes = {
		status: 1,
		message: msg
	};
	return res.status(Constants.ERROR_CODES.SUCCESS_CODE).json(dataRes);
}

/** success response with data */
export const SuccessResponse = (res:any,msg:string,data:any): void =>{
    const dataRes = {
		status: 200,
		message: msg,
        data: data
	};
	return res.status(Constants.ERROR_CODES.SUCCESS_CODE).json(dataRes);
}

/** empty response with data */
export const ErrorEmptyResponse = (res:any,msg:string): void =>{
    const dataRes = {
		status: 0,
		message: msg
	};
	return res.status(Constants.ERROR_CODES.SUCCESS_CODE).json(dataRes);
}


/** success response with data count */
export const SuccessResponseWithCount = (res:any,msg:string,data:any,totRec:any): void =>{
    const dataRes = {
		status: 200,
		message: msg,
		totalRecords: totRec,
        data: data
	};
	return res.status(Constants.ERROR_CODES.SUCCESS_CODE).json(dataRes);
}

/** error code */
export const ErrorResponse = (res:any,msg:any): void =>{
    const dataRes = {
        status: 400,
		message: msg,
	};
	return res.status(Constants.ERROR_CODES.FAIL_CODE).json(dataRes);
}

/** not found code */
export const ErrorResWithSuccess = (res:any,msg:string): void =>{
    const dataRes = {
        status: 0,
		message: msg,
		data: []
	};
	return res.status(Constants.ERROR_CODES.SUCCESS_CODE).json(dataRes);
}


/** not found code */
export const notFoundResponse = (res:any,msg:string): void =>{
    const dataRes = {
        status: 404,
		message: msg,
		data: []
	};
	return res.status(Constants.ERROR_CODES.NOT_FOUND_CODE).json(dataRes);
}

/** not found code */
export const validationErrorWithData = (res:any,msg:string,data:any): void =>{
    const dataRes = {
        status: 0,
		message: msg,
        data:data
	};
	return res.status(Constants.ERROR_CODES.REQUIRE_PARAMETER).json(dataRes);
}

/** for token expire */
export const unauthorizedResponse = (res:any,msg:string): void =>{
    const dataRes = {
        status: 0,
		message: msg,
	};
	return res.status(Constants.ERROR_CODES.UNAUTHORIZED_CODE).json(dataRes);
}

/** not found code */
export const userExistsError = (res:any,msg:string): void =>{
    const dataRes = {
        status: 0,
		message: msg,
	};
	return res.status(Constants.ERROR_CODES.USER_EXISTS).json(dataRes);
}