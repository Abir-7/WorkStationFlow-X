import { IUserProfile } from "./../userProfile/userProfile.interface";
import status from "http-status";
import AppError from "../../../errors/AppError";
import { getRelativePath } from "../../../middleware/fileUpload/getRelativeFilePath";

import { UserProfile } from "../userProfile/userProfile.model";

import { removeFalsyFields } from "../../../utils/helper/removeFalsyField";

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
  updateProfileImage,
  updateProfileData,
};
