import { Types } from "mongoose";

export interface IProject {
  name: string;
  clientName: string;
  teamId: Types.ObjectId;
  totalBudget: number;
  duration: number;
  phases: IProjectPhase[];
  description: string;
  salesName: string;

  googleSheetLink: string;
  projectGroup?: Types.ObjectId;
  status: IProjectStatus;
  isDeleted: boolean;
}

export interface IProjectPhase {
  _id: string;
  name: TPhase;
  budget: number;
  members: Types.ObjectId[];
  deadline: Date;
  status: IPhaseStatus;
}

export const phases = [
  "UI/UX",
  "R&D",
  "API_DEVELOPMENT",
  "API_INTIGRATION",
  "DASHBOARD_DESIGN",
  "DASHBOARD_INTIGRATION",
  "WEBSITE_DESIGN",
  "WEBSITE_DEPLOYMENT",
  "APP_DEPLOYMENT",
  "APP_DESIGN",
] as const;
type TPhase = (typeof phases)[number];

export const ProjectStatus = {
  COMPLETED: "COMPLETED",
  ONGOING: "ONGOING",
  CENCELED: "CENCELED",
} as const;

export const projectStatus = Object.values(ProjectStatus);
export type IProjectStatus = keyof typeof ProjectStatus;

export const phaseStatus = {
  COMPLETED: "COMPLETED",
  ONGOING: "ONGOING",
  INACTIVE: "INACTIVE",
  CENCELED: "CENCELED",
} as const;
export const projectPhaseStatus = Object.values(phaseStatus);
export type IPhaseStatus = keyof typeof phaseStatus;
