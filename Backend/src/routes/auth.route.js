import express from "express";
import {
  register,
  login,
  getCurrentUser,
  getAccessToken,
  logout,
} from "../controllers/auth.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", verifyToken, getCurrentUser);
router.post("/refresh-token", getAccessToken);
router.post("/logout", logout);


export default router;
