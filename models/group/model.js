import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    collection: "groups",
  }
);

export const groupModel =
  mongoose.models.Group || mongoose.model("Group", groupSchema);
