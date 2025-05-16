// Service functions for employee (no DB calls, just placeholders)

import getHashedPassword from "../../../utils/helper/getHashedPassword";
import User from "../../users/user/user.model";
import { UserProfile } from "../../users/userProfile/userProfile.model";

const createEmployee = async (
  data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  },
  leaderId: string
): Promise<object> => {
  const leaderData = await User.findOne({ _id: leaderId });
  const hashedPassword = await getHashedPassword(data.password);

  const createNewEmployee = await User.create({
    email: data.email,
    password: hashedPassword,
    teamId: leaderData?.teamId,
    role: "EMPLOYEE",
    status: "WORKING",
  });

  await UserProfile.create({
    fullName: data.fullName,
    phone: data.phone,
    user: createNewEmployee._id,
  });

  return createNewEmployee;
};

const getEmployeeById = async (id: string): Promise<object> => ({
  message: `Mock employee with id ${id} retrieved`,
});

const getAllEmployees = async (): Promise<object[]> => [
  { message: "Mock employee list" },
];

const updateEmployee = async (
  id: string,
  updateData: unknown
): Promise<object> => ({
  message: `Mock employee with id ${id} updated`,
  updateData,
});

const deleteEmployee = async (id: string): Promise<object> => ({
  message: `Mock employee with id ${id} deleted`,
});

export const EmployeeService = {
  createEmployee,
  getEmployeeById,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
};
