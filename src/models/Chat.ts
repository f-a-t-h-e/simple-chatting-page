import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    name: String,
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    id: true,
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
