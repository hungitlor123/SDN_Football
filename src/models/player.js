import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 3,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Members",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const playerSchema = new Schema(
  {
    playerName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    isCaptain: {
      type: Boolean,
      default: false,
    },
    infomation: {
      type: String,
      required: true,
    },
    comments: [commentSchema],
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teams",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Players", playerSchema);
