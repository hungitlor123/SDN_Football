import Teams from "../models/team.js";

const createTeam = async (teamData) => {
  try {
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
