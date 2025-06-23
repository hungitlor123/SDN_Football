import express from "express";
import { requireAuth } from "../middleware/auth.js";
import playerService from "../services/playerService.js";
import teamService from "../services/teamService.js";

const router = express.Router();

// Middleware: only allow admin
function requireAdminUI(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).render("error", {
      title: "Forbidden",
      message: "You do not have permission to access this page.",
      error: "Admin access required.",
      activePage: null,
    });
  }
  next();
}

// --- PLAYER ADMIN ---
router.get("/players", requireAuth, requireAdminUI, async (req, res) => {
  const players = await playerService.getAllPlayers();
  res.render("players/admin", {
    title: "Manage Players",
    players,
    activePage: "players",
  });
});

router.get("/players/new", requireAuth, requireAdminUI, async (req, res) => {
  const teams = await teamService.getAllTeams();
  res.render("players/new", {
    title: "Add Player",
    teams,
    formData: {},
    activePage: "players",
  });
});

router.post("/players", requireAuth, requireAdminUI, async (req, res) => {
  const playerData = {
    ...req.body,
    isCaptain: req.body.isCaptain === "true" || req.body.isCaptain === true,
  };
  try {
    await playerService.createPlayer(playerData);
    res.redirect("/admin/players");
  } catch (err) {
    const teams = await teamService.getAllTeams();
    res.render("players/new", {
      title: "Add Player",
      teams,
      error: err.message || "Error creating player",
      formData: playerData,
      activePage: "players",
    });
  }
});

router.get(
  "/players/:id/edit",
  requireAuth,
  requireAdminUI,
  async (req, res) => {
    const player = await playerService.getPlayerById(req.params.id);
    const teams = await teamService.getAllTeams();
    res.render("players/edit", {
      title: "Edit Player",
      player,
      teams,
      activePage: "players",
    });
  }
);

router.put("/players/:id", requireAuth, requireAdminUI, async (req, res) => {
  const playerData = {
    ...req.body,
    isCaptain: req.body.isCaptain === "true" || req.body.isCaptain === true,
  };
  try {
    await playerService.updatePlayer(req.params.id, playerData);
    res.redirect("/admin/players");
  } catch (err) {
    const player = await playerService.getPlayerById(req.params.id);
    const teams = await teamService.getAllTeams();
    res.render("players/edit", {
      title: "Edit Player",
      player: { ...player.toObject(), ...playerData },
      teams,
      error: err.message || "Error updating player",
      activePage: "players",
    });
  }
});

router.delete("/players/:id", requireAuth, requireAdminUI, async (req, res) => {
  await playerService.deletePlayer(req.params.id);
  res.redirect("/admin/players");
});

// --- TEAM ADMIN ---
router.get("/teams", requireAuth, requireAdminUI, async (req, res) => {
  const teams = await teamService.getAllTeams();
  res.render("teams/admin", {
    title: "Manage Teams",
    teams,
    activePage: "teams",
  });
});

router.get("/teams/new", requireAuth, requireAdminUI, (req, res) => {
  res.render("teams/new", { title: "Add Team", activePage: "teams" });
});

router.post("/teams", requireAuth, requireAdminUI, async (req, res) => {
  await teamService.createTeam(req.body);
  res.redirect("/admin/teams");
});

router.get("/teams/:id/edit", requireAuth, requireAdminUI, async (req, res) => {
  const team = await teamService.getTeamById(req.params.id);
  res.render("teams/edit", { title: "Edit Team", team, activePage: "teams" });
});

router.put("/teams/:id", requireAuth, requireAdminUI, async (req, res) => {
  await teamService.updateTeam(req.params.id, req.body);
  res.redirect("/admin/teams");
});

router.delete("/teams/:id", requireAuth, requireAdminUI, async (req, res) => {
  await teamService.deleteTeam(req.params.id);
  res.redirect("/admin/teams");
});

export default router;
