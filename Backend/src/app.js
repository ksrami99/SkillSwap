import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import authRoutes from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import swapRoutes from "./routes/swap.route.js";
import feedbackRoutes from "./routes/feedback.route.js";

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/swaps", swapRoutes);
app.use("/api/v1/feedbacks", feedbackRoutes);

export { app };
