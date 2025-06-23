import express from "express";
import {
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
} from "../controllers/memberController.js";
import {
  protect,
  authorize,
  authenticateToken,
  requireAdmin,
  checkOwnership,
} from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getAllMembers);

router.get("/:id", protect, authorize("admin"), getMemberById);

router.put("/:id", authenticateToken, checkOwnership, updateMember);

router.delete("/:id", authenticateToken, requireAdmin, deleteMember);

export default router;
