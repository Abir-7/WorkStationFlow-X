/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUserProfile } from "./../userProfile/userProfile.interface";
import status from "http-status";
import AppError from "../../../errors/AppError";
import { getRelativePath } from "../../../middleware/fileUpload/getRelativeFilePath";
import getExpiryTime from "../../../utils/helper/getExpiryTime";
import getHashedPassword from "../../../utils/helper/getHashedPassword";
import getOtp from "../../../utils/helper/getOtp";
import { sendEmail } from "../../../utils/sendEmail";
import { UserProfile } from "../userProfile/userProfile.model";

import { IUser } from "./user.interface";
import User from "./user.model";

import { removeFalsyFields } from "../../../utils/helper/removeFalsyField";
import { appConfig } from "../../../config";
import { TUserRole } from "../../../interface/auth.interface";

import mongoose, { Types } from "mongoose";
import unlinkFile from "../../../utils/unlinkFiles";

const createUser = async (data: {
  userData: {
    email: string;
    password: string;
    role: Exclude<TUserRole, "ADMIN" | "OWNER">; // Add or modify roles as needed
  };
  userProfileData: {
    fullName: string;
    phone: string;
    image: string;
  };
  companyData: {
    companyId: Types.ObjectId;
    branchId: Types.ObjectId;
  };
}): Promise<Partial<IUser>> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const hashedPassword = await getHashedPassword(
      data.userData.password || (appConfig.user.password as string)
    );
    const otp = getOtp(4);
    const expDate = getExpiryTime(10);

    // user creation
    let userData;

    if (
      data.userData.role === "EMPLOYEE" ||
      data.userData.role === "LEADER" ||
      data.userData.role === "MANAGER"
    ) {
      userData = {
        email: data.userData.email,
        password: hashedPassword,
        authentication: { otp, expDate },
        role: data.userData.role,
        companyId: data.companyData.companyId,
        branchId: data.companyData.branchId,
      };
    } else {
      throw new AppError(status.BAD_REQUEST, "This role not allowed.");
    }

    const createdUser = await User.create([userData], { session });
    const userId = createdUser[0]._id;

    // user profile creation
    const userProfileData = {
      ...data.userProfileData,
      user: userId,
      image: data.userProfileData.image || "/default/user.jpg",
    };
    await UserProfile.create([userProfileData], { session });

    // Try sending email BEFORE committing
    await sendEmail(
      data.userData.email,
      "Email Verification Code",
      `Your code is: ${otp}`
    );

    // If everything is successful, commit
    await session.commitTransaction();
    session.endSession();

    return {
      email: createdUser[0].email,
      isVerified: createdUser[0].isVerified,
    };
  } catch (err: any) {
    // If anything fails including email, rollback

    await session.abortTransaction();
    session.endSession();
    if (data.userProfileData.image) {
      unlinkFile(data.userProfileData.image as string);
    }
    throw new AppError(
      500,
      `Faile to create user. ${err.message && err.message}`
    );
  }
};

const updateProfileImage = async (
  path: string,
  email: string
): Promise<IUserProfile | null> => {
  const image = getRelativePath(path);

  const updated = await UserProfile.findOneAndUpdate(
    { email: email },
    { image },
    { new: true }
  );

  if (!updated) {
    throw new AppError(status.BAD_REQUEST, "Failed to update image.");
  }

  return updated;
};

const updateProfileData = async (
  userdata: Partial<IUserProfile>,
  email: string
): Promise<IUserProfile | null> => {
  const data = removeFalsyFields(userdata);

  const updated = await UserProfile.findOneAndUpdate({ email: email }, data, {
    new: true,
  });

  if (!updated) {
    throw new AppError(status.BAD_REQUEST, "Failed to update user info.");
  }

  return updated;
};

export const UserService = {
  createUser,
  updateProfileImage,
  updateProfileData,
};
