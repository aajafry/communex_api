import jwt from "jsonwebtoken";

/**
 * Middleware to authenticate and authorize requests using a JWT.
 * Verifies the token provided in the `communexToken` cookie.
 *
 * @throws {Error} If the JWT_SECRET environment variable is not set.
 */
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is not set.");
}

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
  try {
    const authHeader = req.cookies.communexToken;
    // const { authorization: authHeader } = req.headers;

    // Ensure the token is provided and formatted correctly
    if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication token is required.",
      });
    }

    // Extract the token part from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, jwtSecret);
    if (!decoded) {
      return next(new Error("Invalid token."));
    }

    // Attach the decoded user data to the request object
    req.user = decoded;
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
