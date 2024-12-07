import { Server } from "socket.io";
import { corsConfig } from "../utilities/index.js";

/**
 * Initializes a Socket.IO server.
 *
 * @param {object} server - The HTTP server instance.
 * @returns {Server} - An instance of the Socket.IO server.
 * @throws {Error} - Throws an error if the server is not provided.
 */

export const socket = (server) => {
  if (!server) {
    throw new Error("Server is required");
  }

  return new Server(server, {
    cors: corsConfig, // Use predefined CORS configuration
    connectionStateRecovery: {}, // Enable reconnection recovery
  });
};
