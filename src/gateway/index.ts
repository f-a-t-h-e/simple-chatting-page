import { WebSocket } from "ws";
import * as http from "http";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { IMessage, INewMessage } from "../types";
import User from "../models/User";
import { keys } from "../utils/config";
import Chat from "../models/Chat";
import Message from "../models/Message";

export const createWS = async (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", async (ws: WebSocket & { userId?: string }, req) => {
    try {
      // Get cookies
      const cookiesArr = req.headers.cookie?.split(";") || [];
      const cookies = cookiesArr?.reduce((prev: any, curr) => {
        const [cookieName, payload] = curr.split("=");
        prev[cookieName.trim()] = payload.trim();
        return prev;
      }, {});

      if (!cookies["authorize-chat"]) {
        throw new Error("No cookie was found, please sign in first");
      }
      const payload = jwt.verify(
        cookies["authorize-chat"],
        keys.JWT_SECRET_KEY
      ) as any;
      const user = await User.findById(payload.id);

      if (!user) {
        throw new Error("Unauthorized");
      }

      // ws.rooms = user.chatRooms.map((roomId) => roomId.toString());
      ws.userId = user.id;

      ws.on("message", async (data: string, isBinary) => {
        try {
          const message: INewMessage = JSON.parse(data.toString());

          switch (message.event) {
            case "NEW_MESSAGE":
              const { content, chatId } = message;

              const chatRoom = await Chat.findById(chatId);

              if (!chatRoom) {
                throw new Error("This Room doesn't exit");
              }

              if (
                !content.text?.trim() &&
                !(
                  content.attachments &&
                  Array.isArray(content.attachments) &&
                  content.attachments.length > 1
                )
              ) {
                throw new Error("Users can't send empty messages");
              }

              const messageToShare: IMessage = {
                chatId,
                content,
                userId: user.id,
                username: user.username,
              };

              const createdMessage = await Message.create(messageToShare);

              console.log(chatRoom);

              wss.clients.forEach((client) => {
                if (
                  /*client !== ws && */ client.readyState === WebSocket.OPEN
                ) {
                  client.send(JSON.stringify(createdMessage));
                }
              });

              break;
            default:
              console.log("Unknown event");
          }
        } catch (error) {
          console.log("🚀 ws.on ~ error:", error);
        }
      });
      // ws.send(JSON.stringify({ message: "Welcome to chat !!" }));
      // ws.on("something", (data: string, isBinary) => {
      //   console.log("🚀 ~ file: index.ts:26 ~ ws.on ~ data:", data);
      // });
    } catch (error) {
      console.log("🚀 ~ file: index.ts:18 ~ wss.on ~ error:", error);
      ws.close();
    }
  });

  wss.on("error", (error) => {
    console.log("🚀 ~ file: index.ts: ~ wss.on ~ error:", error);
  });
};
