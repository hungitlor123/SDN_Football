import playerService from "../services/playerService.js";
import teamService from "../services/teamService.js";
import { authService } from "../services/authService.js";
import memberService from "../services/memberService.js";
import bcrypt from "bcrypt";

// View rendering methods
export const getAllPlayersView = async (req, res) => {
  try {
    const { q: playerName, team: teamId } = req.query;
    const players = await playerService.getAllPlayers({ playerName, teamId });
    const teams = await teamService.getAllTeams();

    res.render("players/index", {
      title: "Football Players",
      players,
      teams,
      searchQuery: playerName || "",
      selectedTeam: teamId || null,
      user: req.user,
      activePage: "home",
    });
  } catch (error) {
    console.error("Error in getAllPlayersView:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load players",
      error: error.message,
    });
  }
};

export const getPlayerDetailView = async (req, res) => {
  try {
    const player = await playerService.getPlayerById(req.params.id);
    if (!player) {
      return res.status(404).render("error", {
        title: "Player Not Found",
        message: "The requested player could not be found",
        error: "Player does not exist",
      });
    }

    res.render("players/detail", {
      title: player.playerName,
      player,
      user: req.user,
      activePage: "home",
    });
  } catch (error) {
    console.error("Error in getPlayerDetailView:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load player details",
      error: error.message,
    });
  }
};

export const searchPlayersView = async (req, res) => {
  try {
    const { q: playerName, team: teamId } = req.query;
    const players = await playerService.getAllPlayers({ playerName, teamId });
    const teams = await teamService.getAllTeams();

    res.render("players/index", {
      title: "Search Results",
      players,
      teams,
      searchQuery: playerName || "",
      selectedTeam: teamId || null,
      user: req.user,
      activePage: "home",
    });
  } catch (error) {
    console.error("Error in searchPlayersView:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to search players",
      error: error.message,
    });
  }
};

export const filterPlayersByTeamView = async (req, res) => {
  try {
    const { team: teamId } = req.query;
    const players = await playerService.getAllPlayers({ teamId });
    const teams = await teamService.getAllTeams();

    res.render("players/index", {
      title: "Players by Team",
      players,
      teams,
      searchQuery: "",
      selectedTeam: teamId || null,
      user: req.user,
      activePage: "home",
    });
  } catch (error) {
    console.error("Error in filterPlayersByTeamView:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to filter players",
      error: error.message,
    });
  }
};

// Authentication view methods
export const getRegisterView = (req, res) => {
  res.render("auth/register", {
    title: "Register",
    user: req.user,
    error: null,
    formData: {},
    activePage: "register",
  });
};

export const getLoginView = (req, res) => {
  res.render("auth/login", {
    title: "Login",
    user: req.user,
    error: null,
    formData: {},
    activePage: "login",
  });
};

// Authentication action methods
export const registerMember = async (req, res) => {
  try {
    const { membername, password, name, YOB } = req.body;

    // Validation
    if (!membername || !password || !name || !YOB) {
      return res.render("auth/register", {
        title: "Register",
        user: req.user,
        error: "All fields are required",
        formData: req.body,
        activePage: "register",
      });
    }

    if (password.length < 6) {
      return res.render("auth/register", {
        title: "Register",
        user: req.user,
        error: "Password must be at least 6 characters long",
        formData: req.body,
        activePage: "register",
      });
    }

    const member = await authService.registerMember(req.body);

    // Auto-login after registration
    req.session.user = {
      _id: member.id.toString(),
      membername: member.membername,
      name: member.name,
      YOB: member.YOB,
      isAdmin: member.isAdmin,
    };

    res.redirect("/");
  } catch (error) {
    console.error("Registration error:", error);
    res.render("auth/register", {
      title: "Register",
      user: req.user,
      error: error.message,
      formData: req.body,
      activePage: "register",
    });
  }
};

export const loginMember = async (req, res) => {
  try {
    const { membername, password } = req.body;

    // Validation
    if (!membername || !password) {
      return res.render("auth/login", {
        title: "Login",
        user: req.user,
        error: "Username and password are required",
        formData: req.body,
        activePage: "login",
      });
    }

    const result = await authService.loginMember({ membername, password });

    // Store user in session
    req.session.user = {
      _id: result.member.id.toString(),
      membername: result.member.membername,
      name: result.member.name,
      YOB: result.member.YOB,
      isAdmin: result.member.isAdmin,
    };

    // Redirect based on admin status
    if (result.member.isAdmin) {
      res.redirect("/admin/players"); // Redirect admins to the admin dashboard
    } else {
      res.redirect("/"); // Redirect regular members to the homepage
    }
  } catch (error) {
    console.error("Login error:", error);
    res.render("auth/login", {
      title: "Login",
      user: req.user,
      error: error.message,
      formData: req.body,
      activePage: "login",
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/");
  });
};

// Profile management methods
export const getProfileView = async (req, res) => {
  try {
    const member = await memberService.getMemberById(req.user._id);
    if (!member) {
      return res.status(404).render("error", {
        title: "Profile Not Found",
        message: "User profile not found.",
        error: "No member found for this user.",
      });
    }
    res.render("members/profile", {
      title: "My Profile",
      member,
      user: req.user,
      success: null,
      activePage: "profile",
    });
  } catch (error) {
    console.error("Error in getProfileView:", error);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load profile",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, YOB } = req.body;

    // Validation
    if (!name || !YOB) {
      const member = await memberService.getMemberById(
        req.user._id || req.user.id
      );
      return res.render("members/profile", {
        title: "My Profile",
        member: member || req.user,
        user: req.user,
        error: "Name and Year of Birth are required",
        success: null,
        activePage: "profile",
      });
    }

    const updatedMember = await memberService.updateMember(
      req.user.id || req.user._id,
      {
        name,
        YOB,
      }
    );

    // Update session
    req.session.user = {
      ...req.session.user,
      name: updatedMember.name,
      YOB: updatedMember.YOB,
    };

    res.render("members/profile", {
      title: "My Profile",
      member: updatedMember,
      user: req.session.user,
      error: null,
      success: "Profile updated successfully",
      activePage: "profile",
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    const member = await memberService.getMemberById(
      req.user._id || req.user.id
    );
    res.render("members/profile", {
      title: "My Profile",
      member: member || req.user,
      user: req.user,
      error: error.message,
      success: null,
      activePage: "profile",
    });
  }
};

export const getChangePasswordView = (req, res) => {
  res.render("members/change-password", {
    title: "Change Password",
    user: req.user,
    error: null,
    success: null,
    activePage: "profile",
  });
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      const member = await memberService.getMemberById(
        req.user._id || req.user.id
      );
      return res.render("members/change-password", {
        title: "Change Password",
        user: req.user,
        error: "All fields are required",
        success: null,
        activePage: "profile",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.render("members/change-password", {
        title: "Change Password",
        user: req.user,
        error: "New passwords do not match",
        success: null,
        activePage: "profile",
      });
    }

    if (newPassword.length < 6) {
      return res.render("members/change-password", {
        title: "Change Password",
        user: req.user,
        error: "New password must be at least 6 characters long",
        success: null,
        activePage: "profile",
      });
    }

    // Verify current password
    const member = await memberService.getMemberById(
      req.user._id || req.user.id,
      true
    );
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      member.password
    );

    if (!isCurrentPasswordValid) {
      return res.render("members/change-password", {
        title: "Change Password",
        user: req.user,
        error: "Current password is incorrect",
        success: null,
        activePage: "profile",
      });
    }

    // Update password
    await memberService.updateMember(req.user._id || req.user.id, {
      password: newPassword,
    });

    res.render("members/change-password", {
      title: "Change Password",
      user: req.user,
      error: null,
      success: "Password changed successfully",
      activePage: "profile",
    });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.render("members/change-password", {
      title: "Change Password",
      user: req.user,
      error: error.message,
      success: null,
      activePage: "profile",
    });
  }
};

// Player interaction methods
export const addPlayerComment = async (req, res) => {
  try {
    const { content, rating } = req.body;
    const playerId = req.params.id;
    const authorId = (req.user._id || req.user.id).toString();

    // Validation
    if (!content || !rating) {
      return res.status(400).json({
        success: false,
        message: "Content and rating are required",
      });
    }

    if (!Number.isInteger(Number(rating)) || rating < 1 || rating > 3) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 3",
      });
    }

    await playerService.addComment(playerId, authorId, { content, rating });

    res.redirect(`/players/${playerId}`);
  } catch (error) {
    console.error("Error in addPlayerComment:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin methods
export const listAccounts = async (req, res) => {
  try {
    const members = await memberService.getAllMembers();
    res.render("members/accounts", {
      title: "All Accounts",
      members,
      activePage: "accounts",
    });
  } catch (error) {
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load accounts",
      error: error.message,
    });
  }
};
