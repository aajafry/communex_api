import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 40,
  message:
    "too many requests from this IP, please try again later after a minute.",
  legacyHeaders: true,
  skip: (req) => req.method === "GET",
  validate: { trustProxy: true },
});
