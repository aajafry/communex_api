import { messageModel } from "../../models/index.js";

export const messageController = {
  getMessages: async (req, res) => {
    const { id: senderId } = req.user;
    const { id: recipientId } = req.body;

    try {
      if (!senderId || !recipientId) {
        return res
          .status(400)
          .json({ message: "Missing sender or recipient ID" });
      }

      if (senderId === recipientId) {
        return res
          .status(400)
          .json({ message: "Sender and recipient cannot be the same user" });
      }

      const messages = await messageModel
        .find({
          $or: [
            { sender: senderId, recipient: recipientId },
            { sender: recipientId, recipient: senderId },
          ],
        })
        .populate("sender", "id name email avatar")
        .populate("recipient", "id name email avatar")
        .sort({ createdAt: 1 });

      if (messages.length === 0) {
        return res.status(404).json({ message: "No messages found" });
      }
      res.status(200).json({
        message: "Messages fetched successfully",
        messages,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({
        message: "An unexpected error occurred while fetching messages",
        error: error.message,
      });
    }
  },
};
