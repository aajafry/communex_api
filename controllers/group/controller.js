import { groupModel, userModel } from "../../models/index.js";

export const groupController = {
  create: async (req, res) => {
    const { avatar, name, members } = req.body;

    try {
      const validMembers = await userModel.find({
        _id: { $in: members },
      });

      if (validMembers.length !== members.length) {
        return res.status(400).json({
          message: "One or more members are invalid",
        });
      }
      const existingGroup = await groupModel.findOne({ name });
      if (existingGroup) {
        return res.status(400).json({
          message: "A group with this name already exists",
        });
      }

      const newGroup = new groupModel({
        avatar: avatar || null,
        name,
        members,
      });

      await newGroup.save();

      res.status(201).json({
        message: "Group created successfully",
        group: newGroup,
      });
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(500).json({
        message: "An unexpected error occurred while creating the group",
        error: error.message,
      });
    }
  },

  getUserGroups: async (req, res) => {
    const { id: userId } = req.user;
    try {
      const groups = await groupModel
        .find({
          members: { $in: [userId] },
        })
        .populate("members", "_id name email avatar isOnline")
        .populate("messages");

      if (groups.length === 0)
        return res.status(404).json({
          message: "No groups found for this user",
        });

      res.status(200).json({
        message: "User groups fetched successfully",
        groups,
      });
    } catch (error) {
      console.error("Error fetching user groups:", error);
      res.status(500).json({
        message: "An unexpected error occurred while fetching user groups",
        error: error.message,
      });
    }
  },

  getGroupMessages: async (req, res) => {
    const { id: groupId } = req.body;
    try {
      const group = await groupModel
        .findById(groupId)
        .populate({
          path: "messages",
          select: "_id sender contentType content isRead createdAt",
          populate: {
            path: "sender",
            select: "_id name email avatar",
          },
        })
        .exec();

      if (!group) {
        return res.status(404).json({ message: "No group found" });
      }

      const messages = group?.messages || [];

      res.status(200).json({
        message: "Group messages fetched successfully",
        messages: group?.messages,
      });
    } catch (error) {
      console.error("Error fetching group messages:", error);
      res.status(500).json({
        message: "An unexpected error occurred while fetching group messages",
        error: error.message,
      });
    }
  },
};
