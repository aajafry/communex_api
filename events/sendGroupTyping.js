import { groupModel } from "../models/index.js";

export const sendGroupTyping = async (socket, io, typing) => {
  const { sender, groupId } = typing;

  const group = await groupModel.findById(groupId);

  if (group && group.members) {
    group.members.forEach((member) => {
      const memberIdString = member._id.toString();
      const memberSocketId = onlineUsers.get(memberIdString);
      if (memberSocketId) {
        io.to(memberSocketId).emit("receiveGroupTyping", sender);
      }
    });
  }
};
