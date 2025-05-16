/* eslint-disable @typescript-eslint/no-explicit-any */
// Service functions for team (no DB calls, just placeholders)
import { v4 as uuidv4 } from "uuid";
import User from "../../users/user/user.model";
import getHashedPassword from "../../../utils/helper/getHashedPassword";

import { UserProfile } from "../../users/userProfile/userProfile.model";
import mongoose from "mongoose";
import Team from "./team.model";
const createTeam = async (
  data: {
    teamData: {
      name: string;
      maxEmployee: number;
    };
    userData: {
      fullName: string;
      email: string;
      phone: string;
      password: string;
    };
  },
  managerId: string
): Promise<object> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userInfo = await User.findById(managerId).session(session);
    if (!userInfo) {
      throw new Error("Manager not found");
    }

    const teamData = {
      name: data.teamData.name,
      maxEmployee: data.teamData.maxEmployee,
      tId: `T-${uuidv4()}`,
      branchId: userInfo.branchId,
    };

    const hashedPassword = await getHashedPassword(data.userData.password);

    const createNewTeam = await Team.create([teamData], { session });

    const createUser = await User.create(
      [
        {
          email: data.userData.email,
          password: hashedPassword,
          teamId: createNewTeam[0]._id,
          role: "LEADER",
          status: "WORKING",
        },
      ],
      { session }
    );

    await UserProfile.create(
      [
        {
          fullName: data.userData.fullName,
          phone: data.userData.phone,
          user: createUser[0]._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return createNewTeam[0];
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error);
  }
};
const getTeamById = async (id: string): Promise<object> => ({
  message: `Mock team with id ${id} retrieved`,
});

const getAllTeams = async (): Promise<object[]> => [
  { message: "Mock team list" },
];

const updateTeam = async (
  id: string,
  updateData: unknown
): Promise<object> => ({
  message: `Mock team with id ${id} updated`,
  updateData,
});

const deleteTeam = async (id: string): Promise<object> => ({
  message: `Mock team with id ${id} deleted`,
});

export const TeamService = {
  createTeam,
  getTeamById,
  getAllTeams,
  updateTeam,
  deleteTeam,
};
