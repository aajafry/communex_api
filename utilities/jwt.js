import jwt from "jsonwebtoken";

if (
  !process.env.ACCESS_TOKEN_SECRET ||
  !process.env.ACCESS_TOKEN_EXPIRY ||
  !process.env.REFRESH_TOKEN_SECRET ||
  !process.env.REFRESH_TOKEN_EXPIRY
) {
  throw new Error("JWT environment variables must be defined");
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;

const generateAccessToken = (payload) => {
  if (!payload) throw new Error("Payload is required");
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (payload) => {
  if (!payload) throw new Error("Payload is required");
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

const verifyToken = (token, secret) => {
  if (!token || !secret) throw new Error("token and secret are required");
  try {
    const decoded = jwt.verify(token, secret);
    if (!decoded || typeof decoded === "string") {
      throw new Error("Invalid token payload");
    }
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token has expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    throw error;
  }
};

export { generateAccessToken, generateRefreshToken, verifyToken };

