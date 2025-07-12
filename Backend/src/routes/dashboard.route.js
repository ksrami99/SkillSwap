import express from "express";
import {
  getDashboardStats,
  getRecentRequests,
} from "../controllers/dashboard.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/stats", verifyToken, getDashboardStats);
router.get("/recent-requests", verifyToken, getRecentRequests);

export default router; 