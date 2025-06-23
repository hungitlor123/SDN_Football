import teamService from "../services/teamService.js";

const createTeam = async (req, res) => {
  try {
    await teamService.createTeam(req.body);
    res
      .status(201)
      .json({ success: true, message: "Team created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllTeams = async (req, res) => {
  try {
    const teams = await teamService.getAllTeams();
    res.status(200).json({ success: true, data: teams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await teamService.getTeamById(req.params.id);
    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTeam = async (req, res) => {
  try {
    const updatedTeam = await teamService.updateTeam(req.params.id, req.body);
    if (!updatedTeam) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Team updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const result = await teamService.deleteTeam(req.params.id);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createTeam, getAllTeams, getTeamById, updateTeam, deleteTeam };
