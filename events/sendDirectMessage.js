import { messageModel } from "../models/index.js";

export const sendDirectMessage = async (socket, io, message, callback) => {
  try {
    const { sender, recipient, content } = message;

    if (!sender || !recipient || !content) {
      console.log("invalid sender or recipient or content");
      socket.emit("error", "Invalid message data");
      return;
    }

    const senderSocketId = global.onlineUsers.get(sender);
    const recipientSocketId = global.onlineUsers.get(recipient);

    const newMessage = new messageModel({
      sender,
      recipient,
      content,
      contentType: "text",
      attachmentUrl: undefined,
    });

    const savedMessage = await newMessage.save();
    if (!savedMessage) {
      socket.emit("error", "Failed to save message");
      return;
    }

    const populatedMessage = await messageModel
      .findById(savedMessage._id)
      .populate("sender", "id name email avatar")
      .populate("recipient", "id name email avatar");

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveDirectMessage", populatedMessage);
    }
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveDirectMessage", populatedMessage);
    }
    callback?.({ status: "success", message: "Message sent successfully" });
  } catch (error) {
    console.error("Error in send direct message:", error);
    socket.emit("error", `An unexpected error occurred ${error.message}`);
    callback?.({ status: "error", message: error.message });
  }
};
