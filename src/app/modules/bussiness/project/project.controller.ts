import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import status from "http-status";
import { ProjectService } from "./project.service";

// ------------------ LEADER ------------------ //

const addProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.addProject(req.body, req.user.userId);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Project added.",
    data: result,
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.updateProject(
    req.params.id,
    req.body,
    req.user.userId
  );
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Project added.",
    data: result,
  });
});

// ------------------ EMPLOYE ------------------ //

const updatePhaseByMember = catchAsync(async (req: Request, res: Response) => {
  const result = await ProjectService.updatePhaseByMember(
    req.user.userId,
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Project added.",
    data: result,
  });
});

export const ProjectController = {
  addProject,
  updateProject,
  updatePhaseByMember,
};
