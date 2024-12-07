import { messageModel, groupModel } from "../models/index.js";

export const sendGroupMessage = async (socket, io, message, callback) => {
  try {
    const { groupId, sender, content } = message;

    if (!groupId) {
      console.error("Group ID is required");
      socket.emit("error", "Group ID is required.");
      return;
    }

    if (!sender) {
      console.error("Sender ID is required");
      socket.emit("error", "Sender ID is required.");
      return;
    }

    if (!content || typeof content !== "string") {
      console.error("Content is required and must be a string");
      socket.emit(
        "error",
        "Content is required and must be a string."
      );
      return;
    }

    const newMessage = new messageModel({
      sender,
      recipient: null,
      content,
      contentType: "text",
    });

    const savedMessage = await newMessage.save();
    if (!savedMessage) {
      socket.emit("error", "Failed to save message");
      return;
    }

    const populatedMessage = await messageModel
      .findById(savedMessage._id)
      .populate("sender", "id name email avatar")
      .exec();

    await groupModel.findByIdAndUpdate(groupId, {
      $push: { messages: savedMessage._id },
    });

    const group = await groupModel.findById(groupId).populate("members");

    const finalMessage = { ...populatedMessage._doc, groupId: group._id };

    if (group && group.members) {
      group.members.forEach((member) => {
        const memberIdString = member._id.toString();
        const memberSocketId = onlineUsers.get(memberIdString);
        if (memberSocketId) {
          io.to(memberSocketId).emit("receiveGroupMessage", finalMessage);
        } else {
          console.error(`User ${member._id} is not online`);
          io.to(memberSocketId).emit("receiveGroupMessage", finalMessage);
        }
      });
    }
    callback?.({ status: "success", message: "Message sent successfully" });
  } catch (error) {
    console.error("An error occurred while sending message:", error);
    socket.emit("error", error.message);
    callback?.({ status: "error", message: error.message });
  }
};
