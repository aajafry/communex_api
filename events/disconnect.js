import { userModel } from "../models/index.js";

export const disconnect = async (socket, userId, reason) => {
  if (!userId) {
    socket.emit(
      "error",
      `An unauthenticated user disconnected: ${socket.id} due to ${reason}`
    );
    console.log(
      `An unauthenticated user disconnected: ${socket.id} due to ${reason}`
    );
    return;
  }
  console.log(`User disconnected: ${userId} due to reson: ${reason}`);
  global.onlineUsers.delete(userId);
};
