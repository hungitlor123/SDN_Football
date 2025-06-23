import mongoose from "mongoose";

const Schema = mongoose.Schema;

const memberSchema = new Schema(
  {
    membername: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    YOB: { type: Number, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Members", memberSchema);
