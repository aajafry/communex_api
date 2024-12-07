import express from "express";
import { groupController } from "../../controllers/index.js";
import { AuthCheck } from "../../middlewares/index.js";

const groupRouter = express.Router();

groupRouter.use(AuthCheck);

groupRouter.post("/create", groupController.create);
groupRouter.get("/getUserGroups", groupController.getUserGroups);
groupRouter.post("/getGroupMessages", groupController.getGroupMessages);

export { groupRouter };
