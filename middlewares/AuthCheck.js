import jwt from "jsonwebtoken";
import { verifyToken } from "../utilities/index.js";

/**
 * Middleware to authenticate and authorize requests using a JWT.
 * Verifies the token provided in the `communexToken` cookie.
 *
 * @throws {Error} If the JWT_SECRET environment variable is not set.
 */

if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error(
    "JWT access token secret environment variables must be defined"
  );
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

/**
 * Middleware to check authentication.
 *
 * @function AuthCheck
 *
 * @returns {void} Calls `next()` on success or sends an error response.
 *
 * @throws {Error} If the token is missing or invalid.
 *
 * @example
 * // Protect a route with AuthCheck
 * app.get("/protected-route", AuthCheck, (req, res) => {
 *   res.json({ message: "Access granted!" });
 * });
 */

export const AuthCheck = (req, res, next) => {
  // const { communexToken: authHeader } = req.cookies;
  const { authorization: authHeader } = req.headers;

  // Ensure the token is provided and formatted correctly
  if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication token is required.",
    });
  }
  try {
    // Extract the token part from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = verifyToken(token, ACCESS_TOKEN_SECRET);

    // Attach the decoded user data to the request object
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      avatar: decoded.avatar,
    };
    return next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    // Determine the response status and message based on the error type
    const statusCode = error.name === "TokenExpiredError" ? 401 : 403;
    const message =
      error.name === "TokenExpiredError"
        ? "Token has expired."
        : "Authentication failed.";

    return res.status(statusCode).json({ message });
  }
};
