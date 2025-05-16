import { Types } from "mongoose";

export interface ITeam {
  name: string;
  branchId: Types.ObjectId;
  tId: string;
  maxEmployee: number;
}
