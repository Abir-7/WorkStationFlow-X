/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable arrow-body-style */
import { v4 as uuidv4 } from "uuid";
import { userRoles } from "../../../interface/auth.interface";
import getHashedPassword from "../../../utils/helper/getHashedPassword";
import User from "../../users/user/user.model";
import { UserProfile } from "../../users/userProfile/userProfile.model";
import { ICompany } from "./company.interface";
import { Company } from "./company.model";
import logger from "../../../utils/logger";

// Create a new company
import mongoose from "mongoose";

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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const companyData = {
      name: data.companyData.name,
      maxBranch: data.companyData.maxBranch,
      maxEmployee: data.companyData.maxEmployee,
      cId: `C-${uuidv4()}`,
    };

    const userProfileData = {
      fullName: data.ownerData.fullName,
      phone: data.ownerData.phone,
    };

    const userData = {
      email: data.ownerData.email,
      password: await getHashedPassword(data.ownerData.password),
    };

    const createdCompany = await Company.create([companyData], { session });
    logger.info("Company created");

    const createdUser = await User.create(
      [
        {
          ...userData,
          role: userRoles.OWNER,

          companyId: createdCompany[0]._id,
        },
      ],
      { session }
    );

    await UserProfile.create(
      [
        {
          ...userProfileData,
          user: createdUser[0]._id,
        },
      ],
      { session }
    );

    // Commit transaction before sending email (email can be retried independently)
    await session.commitTransaction();
    session.endSession();

    return createdCompany[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error("Transaction aborted:", error);
    throw new Error("Can't create company. Try again.");
  }
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
