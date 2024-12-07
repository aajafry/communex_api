import "dotenv/config";
import app from "./app.js";
import {
  disconnect,
  sendDirectMessage,
  sendDirectTyping,
  sendGroupMessage,
  sendGroupTyping,
  sendDirectAttachment,
} from "./events/index.js";
import { connectDatabase, socket } from "./lib/index.js";
import { groupModel, messageModel } from "./models/index.js";

const port = process.env.PORT || 3000;
const dbUrl = process.env.DB_ENDPOINT;

const httpServer = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  connectDatabase(dbUrl);
});

// Initialize Socket.IO
const io = socket(httpServer);
global.onlineUsers = new Map();

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  global.onlineUsers.set(userId, socket.id);
  console.log(`A user connected: ${userId} with socket ID: ${socket.id}`);

  try {
    // Listen for send and receive message events
    socket.on("sendDirectMessage", (message, callback) =>
      sendDirectMessage(socket, io, message, callback)
    );

    // Listen for direct typing events
    socket.on("sendDirectTyping", (typing) =>
      sendDirectTyping(socket, io, typing)
    );

    // Listen for send and receive groups messages events
    socket.on("sendGroupMessage", (message, callback) =>
      sendGroupMessage(socket, io, message, callback)
    );

    // Listen for group typing events
    socket.on("sendGroupTyping", (typing) =>
      sendGroupTyping(socket, io, typing)
    );

    // Listen for send and receive attachment events
    socket.on("sendDirectAttachment", (attachment, callback) =>
      sendDirectAttachment(socket, io, attachment, callback)
    );

    // Listen for disconnect events
    socket.on("disconnect", (reason) => disconnect(socket, userId, reason));
  } catch (error) {
    console.error("An error occurred while handling socket connection:", error);
    socket.disconnect(true);
  }
});
