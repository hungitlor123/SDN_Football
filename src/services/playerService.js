import Players from "../models/player.js";
import Teams from "../models/team.js";
import Members from "../models/member.js";

const createPlayer = async (playerData) => {
  try {
    const { team } = playerData;
    if (!team) {
      throw new Error("Team is required");
    }

    const teamExists = await Teams.findById(team);
    if (!teamExists) {
      throw new Error("Team not found");
    }
    const newPlayer = new Players(playerData);
    await newPlayer.save();
    return newPlayer;
  } catch (error) {
    throw error;
  }
};

const getAllPlayers = async (queryParams) => {
  try {
    const { playerName, teamId } = queryParams || {};
    let filter = {};

    if (teamId) {
      filter.team = teamId;
    }

    if (playerName) {
      filter.playerName = { $regex: new RegExp(playerName, "i") };
    }

    const players = await Players.find(filter)
      .populate("team", "teamName")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name",
        },
      });
    return players;
  } catch (error) {
    throw error;
  }
};

const getPlayerById = async (playerId) => {
  try {
    const player = await Players.findById(playerId)
      .populate("team", "teamName")
      .populate("comments.author", "name");
    return player;
  } catch (error) {
    throw error;
  }
};

const updatePlayer = async (playerId, playerData) => {
  try {
    if (playerData.team) {
      const teamExists = await Teams.findById(playerData.team);
      if (!teamExists) {
        throw new Error("Team not found");
      }
    }
    const updatedPlayer = await Players.findByIdAndUpdate(
      playerId,
      playerData,
      {
        new: true,
        runValidators: true,
      }
    );
    return updatedPlayer;
  } catch (error) {
    throw error;
  }
};

const deletePlayer = async (playerId) => {
  try {
    const deletedPlayer = await Players.findByIdAndDelete(playerId);
    if (!deletedPlayer) {
      return null;
    }
    return { message: "Player deleted successfully" };
  } catch (error) {
    throw error;
  }
};

// Helper to get author id as string
const getAuthorIdString = (author) => {
  if (!author) return null;
  if (typeof author === "object" && author._id) return author._id.toString();
  return author.toString();
};

const addComment = async (playerId, authorId, commentData) => {
  try {
    const player = await Players.findById(playerId);
    if (!player) {
      throw new Error("Player not found");
    }

    const alreadyCommented = player.comments.some(
      (comment) => getAuthorIdString(comment.author) === authorId.toString()
    );

    if (alreadyCommented) {
      throw new Error("You have already commented on this player");
    }

    const newComment = {
      ...commentData,
      author: authorId,
    };

    player.comments.push(newComment);
    await player.save();
    return { message: "Comment added successfully" };
  } catch (error) {
    throw error;
  }
};

const deleteComment = async (playerId, commentId, userId, isAdmin) => {
  try {
    const player = await Players.findById(playerId);
    if (!player) {
      throw new Error("Player not found");
    }

    const comment = player.comments.id(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (getAuthorIdString(comment.author) !== userId.toString() && !isAdmin) {
      throw new Error("User not authorized to delete this comment");
    }

    comment.remove();
    await player.save();
    return { message: "Comment deleted successfully" };
  } catch (error) {
    throw error;
  }
};

export default {
  createPlayer,
  getAllPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
  addComment,
  deleteComment,
};
