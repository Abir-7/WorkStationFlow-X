import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import status from "http-status";
import { TeamService } from "./team.service";

const createTeam = catchAsync(async (req: Request, res: Response) => {
  const result = await TeamService.createTeam(req.body, req.user.userId);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Team created (mock)",
    data: result,
  });
});

const getTeamById = catchAsync(async (req: Request, res: Response) => {
  const result = await TeamService.getTeamById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Team retrieved (mock)",
    data: result,
  });
});

// branch manager
const getAllTeamsBasicData = catchAsync(async (req: Request, res: Response) => {
  const result = await TeamService.getAllTeamsBasicData(req.user.userId);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Teams retrieved",
    data: result,
  });
});

const getBrarchQuickViewData = catchAsync(
  async (req: Request, res: Response) => {
    const result = await TeamService.getBrarchQuickViewData(req.user.userId);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Teams retrieved",
      data: result,
    });
  }
);

const updateTeam = catchAsync(async (req: Request, res: Response) => {
  const result = await TeamService.updateTeam(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Team updated (mock)",
    data: result,
  });
});

const deleteTeam = catchAsync(async (req: Request, res: Response) => {
  const result = await TeamService.deleteTeam(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Team deleted (mock)",
    data: result,
  });
});

export const TeamController = {
  createTeam,
  getTeamById,
  getAllTeamsBasicData,
  updateTeam,
  deleteTeam,
  getBrarchQuickViewData,
};
