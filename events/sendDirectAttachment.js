import { messageModel } from "../models/index.js";

export const sendDirectAttachment = async (socket, io, attachment, callback) => {
  try {
    const { sender, recipient, attachmentUrl } = attachment;
    if (!sender || !recipient || !attachmentUrl) {
      socket.emit("error", "Invalid attachment data");
      return;
    }
    const senderSocketId = global.onlineUsers.get(sender);
    const recipientSocketId = global.onlineUsers.get(recipient);

    const newAttachment = new messageModel({
      sender,
      recipient,
      attachmentUrl: attachmentUrl,
      contentType: "file",
    });

    const savedAttachment = await newAttachment.save();
    if (!savedAttachment) {
      socket.emit("error", "Failed to save attachment");
      return;
    }

    const populatedAttachment = await messageModel
      .findById(savedAttachment._id)
      .populate("sender", "id name email avatar")
      .populate("recipient", "id name email avatar");

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveDirectAttachment", attachmentData);
    }
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveDirectAttachment", attachmentData);
    }
    callback?.({ status: "success", message: "Attachment sent successfully" });
  } catch (error) {
    console.error("Error in send direct attachment:", error);
    socket.emit("error", `An unexpected error occurred: ${error.message}`);
    callback?.({ status: "error", message: error.message });
  }
};
