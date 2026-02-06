import User   from '../../schema/User.schema'
import { logger } from '../../../lib/logger'


/** add guide */
export function Signup (data: object,callback:any){
    try{
       /*Signup(data, callback)*/
    }catch(error: any){
        logger.error(error);
        throw new Error(error);
    }
}