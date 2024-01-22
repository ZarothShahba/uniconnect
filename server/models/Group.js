import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupName: {
      type: String,
      required: true,
    },
    groupDescription: {
      type: String,
      required: true,
    },
    groupMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    profilePicture: String,
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);
export default Group;
