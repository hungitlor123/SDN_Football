import playerService from "../services/playerService.js";

const createPlayer = async (req, res) => {
  try {
    await playerService.createPlayer(req.body);
    res
      .status(201)
      .json({ success: true, message: "Player created successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ success: false, message: error.message, errors: error.errors });
    }
    if (
      error.message === "Team not found" ||
      error.message === "Team is required"
    ) {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllPlayers = async (req, res) => {
  try {
    const players = await playerService.getAllPlayers(req.query);
    res.status(200).json({ success: true, data: players });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPlayerById = async (req, res) => {
  try {
    const player = await playerService.getPlayerById(req.params.id);
    if (!player) {
      return res
        .status(404)
        .json({ success: false, message: "Player not found" });
    }
    res.status(200).json({ success: true, data: player });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePlayer = async (req, res) => {
  try {
    const updatedPlayer = await playerService.updatePlayer(
      req.params.id,
      req.body
    );
    if (!updatedPlayer) {
      return res
        .status(404)
        .json({ success: false, message: "Player not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Player updated successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ success: false, message: error.message, errors: error.errors });
    }
    if (error.message === "Team not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePlayer = async (req, res) => {
  try {
    const result = await playerService.deletePlayer(req.params.id);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Player not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Player deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    // Validate input
    const { content, rating } = req.body;
    if (!content || typeof content !== "string" || !rating) {
      return res
        .status(400)
        .json({ success: false, message: "Content and rating are required." });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 3) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 3.",
      });
    }
    // req.user is from the protect middleware
    const authorId = req.user.id;
    await playerService.addComment(req.params.id, authorId, req.body);
    res
      .status(201)
      .json({ success: true, message: "Comment added successfully" });
  } catch (error) {
    if (error.message === "You have already commented on this player") {
      return res.status(409).json({ success: false, message: error.message });
    }
    if (error.message === "Player not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id: userId, isAdmin } = req.user;
    await playerService.deleteComment(
      req.params.playerId,
      req.params.commentId,
      userId,
      isAdmin
    );
    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    if (error.message === "User not authorized to delete this comment") {
      return res.status(403).json({ success: false, message: error.message });
    }
    if (
      error.message === "Player not found" ||
      error.message === "Comment not found"
    ) {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { content, rating } = req.body;
    const { playerId, commentId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;

    // Validation
    if (!content || !rating) {
      return res.status(400).json({
        success: false,
        message: "Content and rating are required.",
      });
    }
    if (!Number.isInteger(Number(rating)) || rating < 1 || rating > 3) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 3.",
      });
    }

    const result = await playerService.updateComment(
      playerId,
      commentId,
      userId,
      isAdmin,
      { content, rating }
    );
    if (!result.success) {
      return res.status(result.statusCode || 400).json(result);
    }
    res
      .status(200)
      .json({ success: true, message: "Comment updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createPlayer,
  getAllPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
  addComment,
  deleteComment,
  updateComment,
};
