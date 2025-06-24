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
  try {
    const players = await playerService.getAllPlayers();
    res.render("players/admin", {
      title: "Manage Players",
      players,
      activePage: "players",
    });
  } catch (error) {
    console.error("Error loading players:", error);
    res.render("players/admin", {
      title: "Manage Players",
      players: [],
      error: "Failed to load players. Please try again.",
      activePage: "players",
    });
  }
});

router.get("/players/new", requireAuth, requireAdminUI, async (req, res) => {
  try {
    const teams = await teamService.getAllTeams();
    res.render("players/new", {
      title: "Add Player",
      teams,
      formData: {},
      error: null,
      activePage: "players",
    });
  } catch (error) {
    console.error("Error loading teams:", error);
    res.render("players/new", {
      title: "Add Player",
      teams: [],
      formData: {},
      error: "Failed to load teams. Please try again.",
      activePage: "players",
    });
  }
});

router.post("/players", requireAuth, requireAdminUI, async (req, res) => {
  const playerData = {
    ...req.body,
    isCaptain: req.body.isCaptain === "true" || req.body.isCaptain === true,
  };
  try {
    await playerService.createPlayer(playerData);
    res.redirect("/admin/players");
  } catch (error) {
    console.error("Error creating player:", error);
    try {
      const teams = await teamService.getAllTeams();
      res.render("players/new", {
        title: "Add Player",
        teams,
        error: error.message || "Error creating player. Please try again.",
        formData: playerData,
        activePage: "players",
      });
    } catch (teamsError) {
      res.render("players/new", {
        title: "Add Player",
        teams: [],
        error: error.message || "Error creating player. Please try again.",
        formData: playerData,
        activePage: "players",
      });
    }
  }
});

router.get(
  "/players/:id/edit",
  requireAuth,
  requireAdminUI,
  async (req, res) => {
    try {
      const player = await playerService.getPlayerById(req.params.id);
      const teams = await teamService.getAllTeams();
      res.render("players/edit", {
        title: "Edit Player",
        player,
        teams,
        error: null,
        activePage: "players",
      });
    } catch (error) {
      console.error("Error loading player for edit:", error);
      res.render("error", {
        title: "Player Not Found",
        message: "The player you're trying to edit could not be found.",
        error: error.message,
        activePage: "players",
      });
    }
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
  } catch (error) {
    console.error("Error updating player:", error);
    try {
      const player = await playerService.getPlayerById(req.params.id);
      const teams = await teamService.getAllTeams();
      res.render("players/edit", {
        title: "Edit Player",
        player: { ...player.toObject(), ...playerData },
        teams,
        error: error.message || "Error updating player. Please try again.",
        activePage: "players",
      });
    } catch (loadError) {
      res.render("error", {
        title: "Error",
        message: "Failed to load player data for editing.",
        error: error.message,
        activePage: "players",
      });
    }
  }
});

router.delete("/players/:id", requireAuth, requireAdminUI, async (req, res) => {
  try {
    await playerService.deletePlayer(req.params.id);
    res.redirect("/admin/players");
  } catch (error) {
    console.error("Error deleting player:", error);
    res.render("error", {
      title: "Error",
      message: "Failed to delete player.",
      error: error.message,
      activePage: "players",
    });
  }
});

// --- TEAM ADMIN ---
router.get("/teams", requireAuth, requireAdminUI, async (req, res) => {
  try {
    const teams = await teamService.getAllTeams();
    res.render("teams/admin", {
      title: "Manage Teams",
      teams,
      error: null,
      activePage: "teams",
    });
  } catch (error) {
    console.error("Error loading teams:", error);
    res.render("teams/admin", {
      title: "Manage Teams",
      teams: [],
      error: "Failed to load teams. Please try again.",
      activePage: "teams",
    });
  }
});

router.get("/teams/new", requireAuth, requireAdminUI, (req, res) => {
  res.render("teams/new", {
    title: "Add Team",
    error: null,
    activePage: "teams",
  });
});

router.post("/teams", requireAuth, requireAdminUI, async (req, res) => {
  try {
    await teamService.createTeam(req.body);
    res.redirect("/admin/teams");
  } catch (error) {
    console.error("Error creating team:", error);
    res.render("teams/new", {
      title: "Add Team",
      error: error.message || "Error creating team. Please try again.",
      formData: req.body,
      activePage: "teams",
    });
  }
});

router.get("/teams/:id/edit", requireAuth, requireAdminUI, async (req, res) => {
  try {
    const team = await teamService.getTeamById(req.params.id);
    res.render("teams/edit", {
      title: "Edit Team",
      team,
      error: null,
      activePage: "teams",
    });
  } catch (error) {
    console.error("Error loading team for edit:", error);
    res.render("error", {
      title: "Team Not Found",
      message: "The team you're trying to edit could not be found.",
      error: error.message,
      activePage: "teams",
    });
  }
});

router.put("/teams/:id", requireAuth, requireAdminUI, async (req, res) => {
  try {
    await teamService.updateTeam(req.params.id, req.body);
    res.redirect("/admin/teams");
  } catch (error) {
    console.error("Error updating team:", error);
    try {
      const team = await teamService.getTeamById(req.params.id);
      res.render("teams/edit", {
        title: "Edit Team",
        team: { ...team.toObject(), ...req.body },
        error: error.message || "Error updating team. Please try again.",
        activePage: "teams",
      });
    } catch (loadError) {
      res.render("error", {
        title: "Error",
        message: "Failed to load team data for editing.",
        error: error.message,
        activePage: "teams",
      });
    }
  }
});

router.delete("/teams/:id", requireAuth, requireAdminUI, async (req, res) => {
  try {
    await teamService.deleteTeam(req.params.id);
    res.redirect("/admin/teams");
  } catch (error) {
    console.error("Error deleting team:", error);
    res.render("error", {
      title: "Error",
      message: "Failed to delete team.",
      error: error.message,
      activePage: "teams",
    });
  }
});

export default router;
