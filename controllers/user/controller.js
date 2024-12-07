import { userModel } from "../../models/index.js";
import { cloudinary } from "../../config/index.js";
import { hashPassword } from "../../utilities/index.js";

export const userController = {
  getUsers: async (req, res) => {
    try {
      const users = await userModel
        .find()
        .sort({ isOnline: -1 })
        .select("_id name email avatar isOnline address");
      if (users.length === 0)
        return res.status(404).json({ message: "Users not found" });

      res.status(200).json({
        message: "Users fetched successfully",
        users,
      });
    } catch (error) {
      console.error("An error occurred while retrieving users", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving users. Please try again.",
        error: error.message,
      });
    }
  },
  getUser: async (req, res) => {
    const { id: userId } = req.user;
    try {
      const user = await userModel
        .findById(userId)
        .select("_id name email avatar isOnline address");
      if (!user) return res.status(404).json({ message: "User not found" });

      res.status(200).json({
        message: "User fetched successfully",
        user,
      });
    } catch (error) {
      console.error("An error occurred while retrieving user", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while retrieving user. Please try again.",
        error: error.message,
      });
    }
  },
  updateUser: async (req, res) => {
    const { id: userId } = req.user;
    try {
      if (req.body.password) {
        const hashedPassword = await hashPassword(req.body.password);
        req.body.password = hashedPassword;
      } else {
        delete req.body.password;
      }

      const updatedUser = await userModel
        .findByIdAndUpdate(userId, req.body, {
          new: true,
        })
        .select("_id name email avatar isOnline address");

      if (!updatedUser)
        return res.status(404).json({ message: "User not found" });

      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("An error occurred while updating user", error);
      res.status(500).json({
        message:
          "An unexpected error occurred while updating user. Please try again.",
        error: error.message,
      });
    }
  },
  deleteUser: async (req, res) => {
    const { id: userId } = req.user;
    try {
      const deletedUser = await userModel.findByIdAndDelete(userId);

      if (!deletedUser)
        return res.status(404).json({ message: "User not found" });

      const avatarPublicId = deletedUser?.avatar
        ?.split("/")
        .pop()
        .split(".")[0];
      if (avatarPublicId) {
        await cloudinary.uploader.destroy(`communex/${avatarPublicId}`);
      }

       res.clearCookie("communexToken", {
         secure: process.env.NODE_ENV === "production",
         maxAge: 0,
         sameSite: "Lax",
         httpOnly: true,
       });

      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("An error occurred while deleting user", error);

      res.status(500).json({
        message:
          "An unexpected error occurred while deleting user. Please try again.",
        error: error.message,
      });
    }
  },
};
