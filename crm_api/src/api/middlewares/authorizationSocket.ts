import { decode } from '../lib/jwt'

export function authSocketToken (accessToken:string) {
    const { decoded, expired } = decode(accessToken);
    if(expired){
        return 0;
    }
    if(decoded){
        const data:any=[];
        data.user = decoded;
        return data.user.userId;
    }
    return 0;
}
