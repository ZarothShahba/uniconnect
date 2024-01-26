import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    chatId: String,
    senderId: String,
    text: String,
  },
  {
    timestamps: true,
  }
);

const Message = model("Message", messageSchema);

export default Message;
