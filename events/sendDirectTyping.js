export const sendDirectTyping = (socket, io, typing) => {
  const { sender, recipient } = typing;
  const recipientSocketId = global.onlineUsers.get(recipient);

  if (recipientSocketId) {
    io.to(recipientSocketId).emit("receiveDirectTyping", sender);
  }
};
