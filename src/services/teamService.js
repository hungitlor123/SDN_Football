import Teams from "../models/team.js";
import Players from "../models/player.js";

const createTeam = async (teamData) => {
  try {
    // Check if team name already exists
    const existingTeam = await Teams.findOne({ teamName: teamData.teamName });
    if (existingTeam) {
      throw new Error("Team name already exists");
    }

    const newTeam = new Teams(teamData);
    await newTeam.save();
    return newTeam;
  } catch (error) {
    throw error;
  }
};

const getAllTeams = async () => {
  try {
    const teams = await Teams.find();
    return teams;
  } catch (error) {
    throw error;
  }
};

const getTeamById = async (teamId) => {
  try {
    const team = await Teams.findById(teamId);
    return team;
  } catch (error) {
    throw error;
  }
};

const updateTeam = async (teamId, teamData) => {
  try {
    // Check if team name already exists (excluding current team)
    if (teamData.teamName) {
      const existingTeam = await Teams.findOne({
        teamName: teamData.teamName,
        _id: { $ne: teamId },
      });
      if (existingTeam) {
        throw new Error("Team name already exists");
      }
    }

    const updatedTeam = await Teams.findByIdAndUpdate(teamId, teamData, {
      new: true,
    });
    return updatedTeam;
  } catch (error) {
    throw error;
  }
};

const deleteTeam = async (teamId) => {
  try {
    // Check if any player belongs to this team
    const playerCount = await Players.countDocuments({ team: teamId });
    if (playerCount > 0) {
      throw new Error("Cannot delete team: There are players in this team");
    }
    const deletedTeam = await Teams.findByIdAndDelete(teamId);
    if (!deletedTeam) {
      return null;
    }
    return { message: "Team deleted successfully" };
  } catch (error) {
    throw error;
  }
};

export default {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
};
