import { Document, Types } from "mongoose";
import { TUserRole } from "../../../interface/auth.interface";

export interface IBaseUser {
  email: string;
  companyId: Types.ObjectId;
  branchId: Types.ObjectId;
  role: TUserRole;
  password: string;
  authentication: {
    expDate: Date;
    otp: number;
    token: string;
  };
  isVerified: boolean;
  needToResetPass: boolean;
}

export interface IUser extends IBaseUser, Document {
  comparePassword(enteredPassword: string): Promise<boolean>;
}
