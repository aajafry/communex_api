import jwt from "jsonwebtoken";

/**
 * Generates a JSON Web Token (JWT) with the specified payload.
 *
 * @param {Object} payload - The payload data to encode into the JWT.
 * @param {string} payload.id - The user ID.
 * @param {string} payload.name - The user name.
 * @param {string} payload.email - The user email.
 * @param {string} [payload.avatar] - The user's avatar (optional).
 * @returns {string} The generated JWT.
 * @throws {Error} Throws an error if the payload is not provided.
 */

export const generateToken = (payload) => {
  if (!payload) throw new Error("Payload is required");
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "3d", // Token expires in 3 days
  });
};
