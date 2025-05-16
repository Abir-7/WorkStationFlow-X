/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import { userRole } from "../../../interface/auth.interface";
import bcrypt from "bcryptjs";

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  role: { type: String, enum: userRole, required: true },
  authentication: {
    expDate: { type: Date, default: null },
    otp: { type: Number, default: null },
    token: { type: String, default: null },
  },
  isVerified: { type: Boolean, default: false },
  needToResetPass: { type: Boolean, default: false },

  companyId: {
    type: Schema.Types.ObjectId,
    required: function (this: any) {
      return ["OWNER"].includes(this.role);
    },
    ref: "Company", // assuming you have a Company model
  },
  // Required for MANAGER, EMPLOYEE, LEADER
  branchId: {
    type: Schema.Types.ObjectId,
    required: function (this: any) {
      return ["MANAGER"].includes(this.role);
    },
    ref: "Branch", // assuming you have a Branch model
  },
  teamId: {
    type: Schema.Types.ObjectId,
    required: function (this: any) {
      return ["EMPLOYEE", "LEADER"].includes(this.role);
    },
    ref: "Team", // assuming you have a Branch model
  },
  status: {
    type: String,
    required: function (this: any) {
      return ["MANAGER", "EMPLOYEE", "LEADER"].includes(this.role);
    },
  },
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error("Error comparing password");
  }
};

const User = model<IUser>("User", userSchema);

export default User;
