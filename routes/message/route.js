import express from "express";
import { messageController } from "../../controllers/index.js";
import { AuthCheck } from "../../middlewares/index.js";

const messageRouter = express.Router();

messageRouter.use(AuthCheck);

messageRouter.post("/messages", messageController.getMessages);

export { messageRouter };
