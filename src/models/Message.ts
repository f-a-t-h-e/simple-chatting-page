import mongoose from "mongoose";
import { IMessage } from "../types";

const MessageSchema = new mongoose.Schema({
  chatId: {
    type: String,
  },
  content: {
    text: String,
    attachments: [{ type: String }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username: String,
  },
});

const Message = mongoose.model("Messages", MessageSchema);

export default Message;
