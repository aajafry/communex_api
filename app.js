import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import {
  authRouter,
  userRouter,
  groupRouter,
  messageRouter,
  cloudinaryRouter,
} from "./routes/index.js";
import { corsConfig, limiter } from "./utilities/index.js";

const app = express();
app.set("trust proxy", 1);

app.use(limiter);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsConfig));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("wellcome to communeX server");
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/group", groupRouter);
app.use("/message", messageRouter);
app.use("/cloudinary", cloudinaryRouter);

export default app;
