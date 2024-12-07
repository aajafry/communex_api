import express from "express";
import { userController } from "../../controllers/index.js";
import { AuthCheck } from "../../middlewares/index.js";

const userRouter = express.Router();

userRouter.use(AuthCheck);

userRouter.get("/me", userController.getUser);
userRouter.get("/users", userController.getUsers);
userRouter.put("/update", userController.updateUser);
userRouter.delete("/delete", userController.deleteUser);

export { userRouter };
