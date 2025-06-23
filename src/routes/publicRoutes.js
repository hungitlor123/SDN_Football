import express from "express";
import * as publicController from "../controllers/publicController.js";
import {
  requireAuth,
  requireMember,
  requireAdmin,
} from "../middleware/auth.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/", publicController.getAllPlayersView);
router.get("/players/:id", publicController.getPlayerDetailView);
router.get("/search", publicController.searchPlayersView);
router.get("/filter", publicController.filterPlayersByTeamView);

// Authentication routes
router.get("/register", publicController.getRegisterView);
router.post("/register", publicController.registerMember);
router.get("/login", publicController.getLoginView);
router.post("/login", publicController.loginMember);
router.get("/logout", publicController.logout);

// Protected routes (authentication required)
router.get("/profile", requireAuth, publicController.getProfileView);
router.post("/profile", requireAuth, publicController.updateProfile);
router.get(
  "/change-password",
  requireAuth,
  publicController.getChangePasswordView
);
router.post("/change-password", requireAuth, publicController.changePassword);

// Player feedback routes
router.post(
  "/players/:id/comment",
  requireAuth,
  requireMember,
  publicController.addPlayerComment
);

// Admin-only: List all members
router.get(
  "/accounts",
  requireAuth,
  requireAdmin,
  publicController.listAccounts
);

export default router;
