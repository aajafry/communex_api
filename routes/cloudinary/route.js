import express from "express";
import { AuthCheck } from "../../middlewares/index.js";
import { cloudinaryController } from "../../controllers/index.js";

const cloudinaryRouter = express.Router();

cloudinaryRouter.use(AuthCheck);

cloudinaryRouter.post("/delete-image", cloudinaryController.delete);

export { cloudinaryRouter };
