import { CompanyService } from "./company.service";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import status from "http-status";

const createCompany = catchAsync(async (req, res) => {
  const companyData = req.body;
  const result = await CompanyService.createCompany(companyData);

  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Company created successfully",
    data: result,
  });
});

const getCompanyById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CompanyService.getCompanyById(id);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Company retrieved successfully",
    data: result,
  });
});

const getAllCompanies = catchAsync(async (req, res) => {
  const result = await CompanyService.getAllCompanies();

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Companies retrieved successfully",
    data: result,
  });
});

const updateCompany = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await CompanyService.updateCompany(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Company updated successfully",
    data: result,
  });
});

const deleteCompany = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CompanyService.deleteCompany(id);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Company deleted successfully",
    data: result,
  });
});

export const CompanyController = {
  createCompany,
  getCompanyById,
  getAllCompanies,
  updateCompany,
  deleteCompany,
};
