import express from "express";
import {
  getAllPublicUsers,
  getUserById,
  updateProfile,
  toggleProfileVisibility,
  deleteAccount,
} from "../controllers/user.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import { updateProfileSchema } from "../validations/user.validation.js";
import {validate} from "../middlewares/validate.middleware.js";

const router = express.Router();

router.get("/", getAllPublicUsers);
router.get("/:id", getUserById);
router.put("/me",validate(updateProfileSchema), verifyToken, updateProfile);
router.put("/me/visibility", verifyToken, toggleProfileVisibility);
router.delete("/me", verifyToken, deleteAccount);

export default router;