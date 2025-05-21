import { model, Schema } from "mongoose";
import {
  IProject,
  IProjectPhase,
  phases,
  projectPhaseStatus,
  projectStatus,
} from "./project.interface";

const projectPhaseSchema = new Schema<IProjectPhase>(
  {
    name: {
      type: String,
      enum: phases,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    members: {
      type: [Schema.Types.ObjectId],
      ref: "User", // change 'User' to your actual user model name
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: projectPhaseStatus,
      required: true,
    },
  },
  { _id: true }
);

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team", // change 'Team' to your actual team model name
    },
    totalBudget: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    phases: {
      type: [projectPhaseSchema],
    },
    description: {
      type: String,
    },
    salesName: {
      type: String,
      required: true,
    },
    googleSheetLink: {
      type: String,
    },
    projectGrouplink: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: projectStatus,
      default: "HOLD",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Project = model("Project", projectSchema);
