import express from "express";
import {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  addComment,
  updateComment,
} from "../controllers/playerController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// All player routes are admin-only
router.get("/", protect, authorize("admin"), getAllPlayers);

router.get("/:id", protect, authorize("admin"), getPlayerById);

router.post("/", protect, authorize("admin"), createPlayer);

router.put("/:id", protect, authorize("admin"), updatePlayer);

router.delete("/:id", protect, authorize("admin"), deletePlayer);

// Comment routes (not part of admin-only requirement)
router.post("/:id/comments", protect, authorize("admin", "member"), addComment);

router.put(
  "/:playerId/comments/:commentId",
  protect,
  authorize("admin", "member"),
  updateComment
);

export default router;
