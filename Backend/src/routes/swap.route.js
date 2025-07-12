import express from "express";
import {
  createSwapRequest,
  getMySwaps,
  updateSwapRequest,
  deleteSwapRequest,
} from "../controllers/swap.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { swapRequestSchema, updateSwapSchema } from "../validations/swap.validation.js";

const router = express.Router();

router.post("/:targetUserId", verifyToken, validate(swapRequestSchema), createSwapRequest);
router.get("/", verifyToken, getMySwaps);
router.put("/:requestId", verifyToken, validate(updateSwapSchema), updateSwapRequest);
router.delete("/:requestId", verifyToken, deleteSwapRequest);

export default router;
