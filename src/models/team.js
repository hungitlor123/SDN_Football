import mongoose from "mongoose";

const Schema = mongoose.Schema;

const teamSchema = new Schema(
  {
    teamName: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Teams", teamSchema);
