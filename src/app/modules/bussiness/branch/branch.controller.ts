import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import status from "http-status";
import { BranchService } from "./branch.service";

const createBranch = catchAsync(async (req: Request, res: Response) => {
  const result = await BranchService.createBranch(req.body, req.user.userId);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Branch created (mock)",
    data: result,
  });
});

const getBranchById = catchAsync(async (req: Request, res: Response) => {
  const result = await BranchService.getBranchById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Branch retrieved (mock)",
    data: result,
  });
});

const getAllBranches = catchAsync(async (req: Request, res: Response) => {
  const result = await BranchService.getAllBranches();
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Branches retrieved (mock)",
    data: result,
  });
});

const updateBranch = catchAsync(async (req: Request, res: Response) => {
  const result = await BranchService.updateBranch(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Branch updated (mock)",
    data: result,
  });
});

const deleteBranch = catchAsync(async (req: Request, res: Response) => {
  const result = await BranchService.deleteBranch(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Branch deleted (mock)",
    data: result,
  });
});

export const BranchController = {
  createBranch,
  getBranchById,
  getAllBranches,
  updateBranch,
  deleteBranch,
};
