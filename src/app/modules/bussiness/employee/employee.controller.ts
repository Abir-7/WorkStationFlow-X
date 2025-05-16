import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import status from "http-status";
import { EmployeeService } from "./employee.service";

const createEmployee = catchAsync(async (req: Request, res: Response) => {
  const result = await EmployeeService.createEmployee(
    req.body,
    req.user.userId
  );
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Employee created (mock)",
    data: result,
  });
});

const getEmployeeById = catchAsync(async (req: Request, res: Response) => {
  const result = await EmployeeService.getEmployeeById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Employee retrieved (mock)",
    data: result,
  });
});

const getAllEmployees = catchAsync(async (req: Request, res: Response) => {
  const result = await EmployeeService.getAllEmployees();
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Employees retrieved (mock)",
    data: result,
  });
});

const updateEmployee = catchAsync(async (req: Request, res: Response) => {
  const result = await EmployeeService.updateEmployee(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Employee updated (mock)",
    data: result,
  });
});

const deleteEmployee = catchAsync(async (req: Request, res: Response) => {
  const result = await EmployeeService.deleteEmployee(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Employee deleted (mock)",
    data: result,
  });
});

export const EmployeeController = {
  createEmployee,
  getEmployeeById,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
};
