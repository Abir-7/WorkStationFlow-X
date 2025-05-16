import { Types } from "mongoose";

export interface IBranch {
  name: string;
  companyId: Types.ObjectId;
  bId: string;
  maxTeam: number;
}
