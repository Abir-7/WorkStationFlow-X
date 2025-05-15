import { Schema, model } from "mongoose";
import { IBranch } from "./branch.interface";

const BranchSchema = new Schema<IBranch>(
  {
    name: { type: String, required: true },
    companyId: { type: String, required: true },
    bId: { type: String, required: true, unique: true },
    maxTeam: { type: Number, required: true },
    maxEmployee: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const Branch = model<IBranch>("Branch", BranchSchema);
