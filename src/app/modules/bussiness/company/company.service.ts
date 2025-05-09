/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable arrow-body-style */

import { userRoles } from "../../../interface/auth.interface";
import getHashedPassword from "../../../utils/helper/getHashedPassword";
import User from "../../users/user/user.model";
import { UserProfile } from "../../users/userProfile/userProfile.model";
import { ICompany } from "./company.interface";
import { Company } from "./company.model";
import logger from "../../../utils/logger";
import { sendEmail } from "../../../utils/sendEmail";
import getExpiryTime from "../../../utils/helper/getExpiryTime";
import getOtp from "../../../utils/helper/getOtp";

// Create a new company
const createCompany = async (data: {
  ownerData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  };
  companyData: {
    name: string;
    maxBranch: string;
    maxEmployee: string;
  };
}) => {
  const otp = getOtp(4);
  const expDate = getExpiryTime(10);

  const companyData = {
    name: data.companyData.name,
    maxBranch: data.companyData.maxBranch,
    maxEmployee: data.companyData.maxEmployee,
    cId: "iio",
  };
  let createdCompany;
  createdCompany = await Company.create(companyData);
  logger.info("create company");
  const userData = {
    email: data.ownerData.email,
    password: await getHashedPassword(data.ownerData.password),
  };
  const userProfileData = {
    fullName: data.ownerData.fullName,
    phone: data.ownerData.phone,
  };

  const createdUser = await User.create({
    ...userData,
    role: userRoles.OWNER,
    authentication: { otp, expDate },
    companyId: createdCompany._id,
  });

  await UserProfile.create({
    ...userProfileData,
    user: createdUser._id,
  });

  createdCompany = await Company.findByIdAndUpdate(
    createdCompany._id,
    {
      owner: createdUser._id,
    },
    { new: true }
  )
    .populate("owner")
    .lean();

  await sendEmail(
    data.ownerData.email,
    "Email Verification Code",
    `Your code is: ${otp}`
  );

  return createdCompany;
};

// Get a single company by ID
const getCompanyById = async (id: string) => {
  return await Company.findById(id);
};

// Get all companies
const getAllCompanies = async () => {
  return await Company.find();
};

// Update a company by ID
const updateCompany = async (
  id: string,
  updateData: any
): Promise<ICompany | null> => {
  return await Company.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete a company by ID
const deleteCompany = async (id: string): Promise<ICompany | null> => {
  return await Company.findByIdAndDelete(id);
};

export const CompanyService = {
  createCompany,
  getCompanyById,
  getAllCompanies,
  updateCompany,
  deleteCompany,
};
