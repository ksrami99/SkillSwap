import express from "express";
import { giveFeedback, getFeedbackForUser } from "../controllers/feedback.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { feedbackSchema } from "../validations/feedback.validation.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:userId/:swapId", verifyToken, validate(feedbackSchema), giveFeedback);
router.post("/:userId", verifyToken, validate(feedbackSchema), giveFeedback);
router.get("/:userId", getFeedbackForUser);

export default router;