import express from "express";
import { authController } from "../../controllers/index.js";
import { AuthCheck } from "../../middlewares/index.js";

const authRouter = express.Router();

authRouter.post("/signup", authController.signup);
authRouter.post("/login", authController.login);
authRouter.post("/logout", AuthCheck, authController.logout);
authRouter.post("/refresh-token", authController.refreshToken);

export { authRouter };
