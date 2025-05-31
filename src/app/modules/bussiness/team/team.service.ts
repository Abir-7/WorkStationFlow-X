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

// branch manager-------------->
const getAllTeamsBasicData = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(status.NOT_FOUND, "User not found.");
  if (!user.branchId)
    throw new AppError(status.NOT_FOUND, "User branchId not found.");

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  // const firstDayOfNextMonth = new Date(
  //   now.getFullYear(),
  //   now.getMonth() + 1,
  //   1
  // );
  const lastDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0, // Day 0 of next month = last day of current month
    23,
    59,
    59,
    999
  );

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
    {
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
                      in: { $concatArrays: ["$$value", "$$this.phases"] },
                    },
                  },
                  as: "phase",
                  cond: {
                    $and: [
                      { $eq: ["$$phase.status", "COMPLETED"] },
                      { $gte: ["$$phase.updatedAt", firstDayOfMonth] },
                      { $lt: ["$$phase.updatedAt", lastDayOfMonth] },
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
                  { $lt: ["$$project.createdAt", lastDayOfMonth] },
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
                  { $lt: ["$$project.createdAt", lastDayOfMonth] },
                ],
              },
            },
          },
        },
      },
    },
    {
      $project: {
        allProjects: 0, // exclude large array from response
      },
    },
  ];

  const teamData = await Team.aggregate(aggregateArray);
  return teamData;
};

const getBrarchQuickViewData = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(status.NOT_FOUND, "User not found.");
  if (!user.branchId)
    throw new AppError(status.NOT_FOUND, "User branchId not found.");

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

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
    {
      $addFields: {
        completedPhaseBudgetThisMonth: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: {
                    $reduce: {
                      input: "$allProjects.phases",
                      initialValue: [],
                      in: { $concatArrays: ["$$value", "$$this"] },
                    },
                  },
                  as: "phase",
                  cond: {
                    $and: [
                      { $eq: ["$$phase.status", "COMPLETED"] },
                      { $gte: ["$$phase.updatedAt", firstDayOfMonth] },
                      { $lte: ["$$phase.updatedAt", lastDayOfMonth] },
                    ],
                  },
                },
              },
              as: "phase",
              in: "$$phase.budget",
            },
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        totalTeams: { $sum: 1 },
        totalDeliveryTarget: { $sum: "$delivaryTarget" },
        totalMonthlyDelivery: { $sum: "$completedPhaseBudgetThisMonth" },
      },
    },
    {
      $addFields: {
        totalDueDelivery: {
          $subtract: ["$totalDeliveryTarget", "$totalMonthlyDelivery"],
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalTeams: 1,
        totalDeliveryTarget: 1,
        totalMonthlyDelivery: 1,
        totalDueDelivery: 1,
      },
    },
  ];

  const result = await Team.aggregate(aggregateArray);
  return (
    result[0] || {
      totalTeams: 0,
      totalDeliveryTarget: 0,
      totalMonthlyDelivery: 0,
      totalDueDelivery: 0,
    }
  );
};

const updateTeam = async (
  id: string,
  updateData: unknown
): Promise<object> => ({
  message: ` team with id ${id} updated`,
  updateData,
});

const deleteTeam = async (id: string): Promise<object> => ({
  message: ` team with id ${id} deleted`,
});

export const TeamService = {
  createTeam,
  getTeamById,
  getAllTeamsBasicData,
  updateTeam,
  deleteTeam,
  getBrarchQuickViewData,
};
