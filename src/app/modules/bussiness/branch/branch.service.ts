/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable arrow-body-style */
// Service functions for branch (no DB calls, just placeholders)

import { v4 as uuidv4 } from "uuid";
import User from "../../users/user/user.model";

import getHashedPassword from "../../../utils/helper/getHashedPassword";
import { Branch } from "./branch.model";
import { UserProfile } from "../../users/userProfile/userProfile.model";
import mongoose from "mongoose";

const createBranch = async (
  data: {
    branchData: {
      name: string;
      maxTeam: number;
      maxEmployee: number;
    };
    userData: {
      fullName: string;
      email: string;
      phone: string;
      password: string;
    };
  },
  ownerId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userInfo = await User.findById(ownerId).session(session);
    if (!userInfo) {
      throw new Error("Owner not found");
    }
    const branchData = {
      name: data.branchData.name,
      maxTeam: data.branchData.maxTeam,
      bId: `B-${uuidv4()}`,
      companyId: userInfo.companyId,
    };

    const userData = {
      email: data.userData.email,
      password: await getHashedPassword(data.userData.password),
    };

    const userProfileData = {
      fullName: data.userData.fullName,
      phone: data.userData.phone,
    };

    const createNewBranch = await Branch.create([branchData], { session });
    const createUser = await User.create(
      [
        {
          ...userData,
          branchId: createNewBranch[0]._id,
          role: "MANAGER",
          status: "WORKING",
        },
      ],
      { session }
    );

    await UserProfile.create(
      [
        {
          ...userProfileData,
          user: createUser[0]._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return createNewBranch[0];
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error);
  }
};

const getBranchById = async (id: string) => {
  return { message: `Mock branch with id ${id} retrieved` };
};

const getAllBranches = async () => {
  return [{ message: "Mock branch list" }];
};

const updateBranch = async (id: string, updateData: unknown) => {
  return { message: `Mock branch with id ${id} updated`, updateData };
};

const deleteBranch = async (id: string) => {
  return { message: `Mock branch with id ${id} deleted` };
};

export const BranchService = {
  createBranch,
  getBranchById,
  getAllBranches,
  updateBranch,
  deleteBranch,
};
