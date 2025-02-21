export { hashPassword } from "./hashPassword.js";
export { limiter } from "./limiter.js";
export { corsConfig } from "./corsConfig.js";
export {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "./jwt.js";

/**
 * Maximum age for cookies or tokens in milliseconds.
 * Represents 3 days (3 * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds).
 *
 * @constant {number}
 */
export const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days
