import { Schema, model } from "mongoose";

const chatSchema = new Schema(
  {
    members: Array,
  },
  {
    timestamps: true,
  }
);

const chatModel = model("Chat", chatSchema);

export default chatModel;
