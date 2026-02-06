import { Request, Response } from "express";
import { toLowerCase } from "fp-ts/lib/string";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";
import { UpdateUserStatus,findOneUserChat,createChatRoom,findOneChat,createChatMessage,findAllChatMessage,findAllUserOnlineOfline,findSmeDetails,findAndUpdateChatMessages } from "../../../../domain/models/sme.model";
import { getOffset, convertTimeZone } from "../../../../helpers/utility";
/** Object id data type */
const ObjectId = mongoose.Types.ObjectId;


 export const UserOnlineOffline = async (payload: any, socketId: any, callback: any) => {
    try {
      let where: any = {
        username: payload["sme_id"],
        onlineStatus: payload["onlineStatus"],
      };
      await UpdateUserStatus(where, (err: any, response: any) => {
        if (response) {
            let result = {
                data: response,
                status: 1,
                message:"Successfully status updated"
            };
            callback(null, result);
        } 
      });
    } catch (e) {
      console.log(e);
    }
  };

  export const getAllUsersOnlineOffline = async (payload: any, socketId: any, callback: any) => {
    try {
      let where: any = {
        username: payload["sme_id"],
        loginUser: payload["loginUser"],
      };
      await findAllUserOnlineOfline(where, (err: any, response: any) => {
        if (response) {
          findSmeDetails(where, (err: any, responseSme: any) => {
            if (responseSme) {
              let result = {
                  data: responseSme.concat(response),
                  message:"Successfully listed"
              };
              callback(null, result);
            }
          });

        } 
      
      });
    } catch (e) {
      console.log(e);
    }
  };

  export const findAndUpdateChatMessage = async (payload: any, socketId: any, callback: any) => {
    try {
      let where: any = {
        chat_id: payload["chat_id"],
        loginUser: payload["loginUser"],
      };
      await findAndUpdateChatMessages(where, (err: any, response: any) => {
        if (response) {
          callback(null, response);
        } 
      
      });
    } catch (e) {
      console.log(e);
    }
  };


  export const UserChatRoom = async (payload: any, socketId: any, callback: any) => {
    try {
      let userId: any = payload['userId'];
      let toUserId: any = payload['toUserId'];
      let where: any = {
        userId: userId,
        toUserId: toUserId,
      };
      if(userId != toUserId){
        await findOneUserChat(where, (err: any, response: any) => {
          if (response.length == 0) {
            createChatRoom(where,(err:any,response:any)=>{
                where['chatId'] = response[0];
                let result = {
                  data: where,
                  status: 1,
                  message:"Successfully room created"
              };
              callback(null, result);
            })
          }else{
            let result = {
              data: response[0],
              status: 1,
              message:"Successfully room created"
          };
            callback(null, result);
          } 
        });
      }else{
          let result = {
            data: [],
            status: 0,
            message:"You can not add self chat"
        };
        callback(null, result);
      }
    } catch (e) {
      console.log(e);
    }
  };

  export const UserChatRoomMessage = async (payload: any, socketId: any, callback: any) => {
    try {
      let userId: any = payload['userId'];
      let chatId: any = payload['chatId'];
      let message: any = payload['message'];
      let currentDate = Date();
      let getCurrentDate = convertTimeZone("IST","resultTimeZone",currentDate);
      let where: any = {
        userId: userId,
        chatId: chatId,
        message: message,
        messageType:"Text",
        insertDateTime: getCurrentDate
      };
      await findOneChat(where, (err: any, response: any) => {
          if (response.length > 0) {
            createChatMessage(where,(err:any,response:any)=>{
                where['messageId'] = response[0];
                let result = {
                  data: where,
                  status: 200,
                  message:"Successfully message sent"
              };
              callback(null, result);
            })
          }else{
            let result = {
              data: [],
              status: 0,
              message:"Invalid chat room"
          };
            callback(null, result);
          } 
        });

    } catch (e) {
      console.log(e);
    }
  };

  export const UserChatRoomMessageInbox = async (payload: any, socketId: any, callback: any) => {
    try {
      let limit = (payload['limit']) ? parseInt((payload['limit'] as string)) : 10;
      let offset = (payload['pageNo']) ? getOffset(parseInt((payload['pageNo'] as string)),limit) : 0;
      let chatId: any = payload['chatId'];
      let where: any = {
        chatId: chatId,
        limit:limit,
        offset:offset
      };
      await findOneChat(where, (err: any, response: any) => {
          if (response.length > 0) {
            findAllChatMessage(where,(err:any,response:any)=>{
                let result = {
                  data: response,
                  status: 200,
                  message:"Successfully message list"
              };
              callback(null, result);
            })
          }else{
            let result = {
              data: [],
              status: 0,
              message:"Invalid chat room"
          };
            callback(null, result);
          } 
        });

    } catch (e) {
      console.log(e);
    }
  };