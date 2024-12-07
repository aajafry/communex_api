import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    contentType: {
      type: String,
      enum: ["text", "file"],
      default: "text",
      required: true,
    },
    content: {
      type: String,
      required: function () {
        return this.contentType === "text";
      },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    attachmentUrl: {
      type: String,
      required: function () {
        return this.contentType === "file";
      },
    },
  },
  {
    timestamps: true,
    collection: "messages",
  }
);

export const messageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
