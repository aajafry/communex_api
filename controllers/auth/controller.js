import { userModel } from "../../models/index.js";
import bcrypt from "bcrypt";
import {
  hashPassword,
  maxAge,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../utilities/index.js";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Authentication Controller
export const authController = {
  // User signup
  signup: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          message: `A user with the email "${email}" already exists. Please use a different email.`,
        });
      }

      const hashedPassword = await hashPassword(password);
      const newUser = new userModel({ name, email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({
        message: `User "${name}" has been registered successfully.`,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    } catch (error) {
      console.error("Error during user signup:", error);
      res.status(500).json({
        message:
          "An unexpected error occurred during signup. Please try again.",
        error: error.message,
      });
    }
  },

  // User login
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      user.isOnline = true;
      await user.save();

      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      res.cookie("communexToken", refreshToken, {
        secure: process.env.NODE_ENV === "production",
        maxAge: maxAge,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        httpOnly: true,
      });

      res.json({
        message: `User "${payload.name}" has been logged in successfully.`,
        user: payload,
        accessToken,
      });
    } catch (error) {
      console.error("Error during user login:", error);
      res.status(500).json({
        message: "An unexpected error occurred during login. Please try again.",
        error: error.message,
      });
    }
  },

  // User logout
  logout: async (req, res) => {
    const { id: userId } = req.user;
    try {
      const user = await userModel.findByIdAndUpdate(
        userId,
        { isOnline: false },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.clearCookie("communexToken", {
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        httpOnly: true,
      });

      res.json({
        message: `User "${user.name}" has been logged out successfully.`,
      });
    } catch (error) {
      console.error("Error during user logout:", error);
      res.status(500).json({
        message:
          "An unexpected error occurred during logout. Please try again.",
        error: error.message,
      });
    }
  },

  // User refresh token
  refreshToken: async (req, res) => {
    if (!REFRESH_TOKEN_SECRET) {
      return res.status(500).json({
        message:
          "JWT refresh token secret environment variables must be defined",
      });
    }
    try {
      const { communexToken: refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const decoded = verifyToken(refreshToken, REFRESH_TOKEN_SECRET);

      const payload = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.avatar,
      };

      const accessToken = generateAccessToken(payload);
      res.json({
        message: "Token refreshed successfully",
        accessToken,
      });
    } catch (error) {
      console.error("Error during token refresh:", error);
      res.status(500).json({
        message:
          "An unexpected error occurred during token refresh. Please try again.",
        error: error.message,
      });
    }
  },
};
