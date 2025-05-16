import { Schema, model } from "mongoose";
import { ITeam } from "./team.interface";

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Branch", // Replace with actual collection name if different
    },
    tId: {
      type: String,
      required: true,
      unique: true,
    },
    maxEmployee: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Team = model<ITeam>("Team", teamSchema);

export default Team;
