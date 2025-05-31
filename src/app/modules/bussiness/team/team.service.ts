/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Service functions for team (no DB calls, just placeholders)
import { v4 as uuidv4 } from "uuid";
import User from "../../users/user/user.model";
import getHashedPassword from "../../../utils/helper/getHashedPassword";

import { UserProfile } from "../../users/userProfile/userProfile.model";
import mongoose, { PipelineStage } from "mongoose";
import Team from "./team.model";
import AppError from "../../../errors/AppError";
import status from "http-status";

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

const getAllTeams = async (userId: string) => {
  const user = await User.findById(userId);

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found.");
  }

  const aggregateArray: PipelineStage[] = [
    {
      $match: {
        branchId: new mongoose.Types.ObjectId(user.branchId),
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "_id",
        foreignField: "teamId",
        as: "allProjects",
      },
    },
  ];

  if (user.role === "MANAGER") {
    if (!user.branchId) {
      throw new AppError(status.NOT_FOUND, "User branchId not found.");
    }

    aggregateArray.push({
      $addFields: {
        presentMonthTotalDelivery: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: {
                    $reduce: {
                      input: "$allProjects",
                      initialValue: [],
                      in: {
                        $concatArrays: ["$$value", "$$this.phases"],
                      },
                    },
                  },
                  as: "phase",
                  cond: {
                    $and: [
                      { $eq: ["$$phase.status", "COMPLETED"] },
                      { $gte: ["$$phase.updatedAt", firstDayOfMonth] },
                      { $lt: ["$$phase.updatedAt", firstDayOfNextMonth] },
                    ],
                  },
                },
              },
              as: "completedPhase",
              in: "$$completedPhase.budget",
            },
          },
        },

        totalWorkload: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: "$allProjects",
                  as: "project",
                  cond: {
                    $in: ["$$project.status", ["HOLD", "ONGOING"]],
                  },
                },
              },
              as: "project",
              in: "$$project.totalBudget",
            },
          },
        },

        totalDeliver: {
          $sum: {
            $map: {
              input: "$allProjects",
              as: "project",
              in: {
                $reduce: {
                  input: {
                    $filter: {
                      input: "$$project.phases",
                      as: "phase",
                      cond: { $eq: ["$$phase.status", "COMPLETED"] },
                    },
                  },
                  initialValue: 0,
                  in: { $add: ["$$value", "$$this.budget"] },
                },
              },
            },
          },
        },

        runningProjectsThisMonth: {
          $size: {
            $filter: {
              input: "$allProjects",
              as: "project",
              cond: {
                $and: [
                  { $eq: ["$$project.status", "ONGOING"] },
                  { $gte: ["$$project.createdAt", firstDayOfMonth] },
                  { $lt: ["$$project.createdAt", firstDayOfNextMonth] },
                ],
              },
            },
          },
        },
        completedProjectsThisMonth: {
          $size: {
            $filter: {
              input: "$allProjects",
              as: "project",
              cond: {
                $and: [
                  { $eq: ["$$project.status", "COMPLETED"] },
                  { $gte: ["$$project.createdAt", firstDayOfMonth] },
                  { $lt: ["$$project.createdAt", firstDayOfNextMonth] },
                ],
              },
            },
          },
        },
      },
    });
  }
  const teamData = await Team.aggregate(aggregateArray);
  return teamData;
};

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
