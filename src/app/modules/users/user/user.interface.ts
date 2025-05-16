import { Document, Types } from "mongoose";
import { TUserRole } from "../../../interface/auth.interface";

export interface IBaseUser {
  email: string;
  companyId: Types.ObjectId;
  branchId: Types.ObjectId;
  teamId: Types.ObjectId;
  role: TUserRole;
  password: string;
  authentication: {
    expDate: Date;
    otp: number;
    token: string;
  };
  isVerified: boolean;
  needToResetPass: boolean;
  status: TUserStatus;
}

export const userStatus = ["WORKING", "TERMINATED", "RESIGNED"] as const;

export type TUserStatus = (typeof userStatus)[number];
export interface IUser extends IBaseUser, Document {
  comparePassword(enteredPassword: string): Promise<boolean>;
}
