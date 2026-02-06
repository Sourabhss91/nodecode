import { Request, Response } from "express";
import { logger } from "../../../../lib/logger";
import lan from "../../../../locales/en.json";
import { authSocketToken } from "../../../../middlewares/authorizationSocket";
import { eventLiveCall, eventAgentLiveCall, eventClickToCall, eventAgentInfo } from "../../../../interface/controllers/app/socket/eventLiveCallController";
import { UserOnlineOffline,UserChatRoom,UserChatRoomMessage,UserChatRoomMessageInbox,getAllUsersOnlineOffline,findAndUpdateChatMessage } from "../../../../interface/controllers/app/socket/chatController";
export default class Socket {
  constructor(socket: any, io: any) {
    var self = this;

    /** authentication token validate */
    const token = socket.conn.request._query["token"];
    const authUserId = authSocketToken(token);

    /* To manage user online
     * @param {string} userId
     * @param {string} token
     */
      socket.on('online', function(requestData:any){
            let payload : any ={
              onlineStatus:"Online",
              sme_id : requestData["sme_id"]
            }
            UserOnlineOffline(payload, socket.id, (err: any, response: any) => {
                socket.emit("online", response);
            });
      });

      /* To get chat online&offline users
     * @param {string} userId
     * @param {string} token
     */
      socket.on('users', function(requestData:any){
        let payload : any ={
          sme_id : requestData["sme_id"],
          loginUser : requestData["loginUser"],
        }
        getAllUsersOnlineOffline(payload, socket.id, (err: any, response: any) => {
          socket.emit("users", response);
        });
      });

            /* To get chat online&offline users
     * @param {string} userId
     * @param {string} token
     */
      socket.on('chat_message_read', function(requestData:any){
          let payload : any ={
            chat_id : requestData["chat_id"],
            loginUser : requestData["loginUser"],
          }
          findAndUpdateChatMessage(payload, socket.id, (err: any, response: any) => {
              socket.emit("chat_message_read", response);
          });
      });

    /* To manage user offline
      * @param {string} userId
      * @param {string} token
     */
      socket.on('offline', function(requestData:any){
        let payload : any ={
          onlineStatus:"Offline",
          sme_id : requestData["sme_id"]
        }
        UserOnlineOffline(payload, socket.id, (err: any, response: any) => {
            socket.emit("online", response);
        });
     });

    /* To manage user chat room
      * @param {string} userId
      * @param {string} token
     */

    socket.on('chat_room', function(requestData:any){
      UserChatRoom(requestData, socket.id, (err: any, response: any) => {
          socket.emit("chat_room", response);
      });
   });

    /* To manage user chat message
      * @param {string} userId
      * @param {string} token
     */

    socket.on('chat_message_sent_in_room', function(requestData:any){
        UserChatRoomMessage(requestData, socket.id, (err: any, response: any) => {
            io.emit("chat_message_sent_in_room", response);
        });
     });

    /* To manage get chat message
      * @param {string} userId
      * @param {string} token
     */

    socket.on('chat_message_inbox', function(requestData:any){
      UserChatRoomMessageInbox(requestData, socket.id, (err: any, response: any) => {
        
          socket.emit("chat_message_inbox", response);
      });
   });



    /**
     * To manage evt_live_calls
     * @param {string} userId
     * @param {string} token
     */
    socket.on("evt_live_calls", function (requestData: any) {
      eventLiveCall(requestData, socket.id, (err: any, response: any) => {
        socket.emit("evt_live_calls_resp", response);
      });
    });

    socket.on("evt_agent_live_calls", function (requestData: any) {
      eventAgentLiveCall(requestData, socket.id, (err: any, response: any) => {
        socket.emit("evt_agent_live_calls_resp", response);
      });
    });

    socket.on("evt_click_to_calls", function (requestData: any) {
      eventClickToCall(requestData, socket.id, (err: any, response: any) => {
        socket.emit("evt_click_to_calls_resp", response);
      });
    });

    socket.on("evt_agent_info", function (requestData: any) {
      eventAgentInfo(requestData, socket.id, (err: any, response: any) => {
        socket.emit("evt_agent_info_resp", response);
      });
    });

    /**
     * To manage user offline
     * @param {string} userId
     */
    socket.on("disconnect", function (requestData: any) {});
  }
}
