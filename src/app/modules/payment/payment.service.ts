/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable arrow-body-style */
import { Payment } from "./payment.model";
import { PaymentMethod } from "./payment.interface";
import User from "../users/user/user.model";
import AppError from "../../errors/AppError";
import status from "http-status";
import { Company } from "../bussiness/company/company.model";

// Create a new payment
const createPayment = async (data: {
  amount: number;
  method: PaymentMethod;
  email: string;
  mobile: string;
  txId: string;
}) => {
  const userData = await User.findOne({ email: data.email });

  if (!userData) {
    throw new AppError(status.NOT_FOUND, "No user found with that email");
  }

  if (userData.role !== "OWNER") {
    throw new AppError(status.NOT_FOUND, "You are not owner of any company");
  }

  if (!userData.companyId) {
    throw new AppError(status.NOT_FOUND, "You are not owner of any company");
  }

  const now = new Date();
  const year =
    now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
  const month = (now.getMonth() + 1) % 12;

  const paymentData = {
    companyId: userData.companyId,
    user: userData._id,
    expDate: new Date(year, month, 10),
    amount: data.amount,
    method: data.method,
    txId: data.txId,
    mobile: data.mobile,
  };

  const companydata = await Company.findOne({
    owner: userData._id,
    _id: userData.companyId,
  });

  if (!companydata) {
    throw new AppError(status.NOT_FOUND, "Your Company not found");
  }

  if (
    companydata.status === "PENDING" ||
    companydata.status === "REJECTED" ||
    companydata.status === "HOLD"
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      `Your Company status is:${companydata.status}`
    );
  }

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const existingPayment = await Payment.findOne({
    companyId: userData.companyId,
    createdAt: {
      $gte: monthStart,
      $lte: monthEnd,
    },
  });

  if (existingPayment) {
    throw new AppError(
      status.CONFLICT,
      "Payment for this company has already been made this month"
    );
  }

  const newPayment = await Payment.create(paymentData);

  companydata.paymentInfo.paymentId = newPayment._id;
  companydata.status = "HOLD";
  companydata.paymentInfo.expireDate = new Date(year, month, 10);
  return await companydata.save();
};

const verifyPayment = async (id: string) => {
  const data = await Payment.findOne({ _id: id.trim() });

  if (!data) {
    throw new AppError(status.NOT_FOUND, "Payment data not found");
  }

  const companyData = await Company.findOne({
    _id: data.companyId,
    owner: data.user,
  });
  if (!companyData) {
    throw new AppError(status.NOT_FOUND, "Company data not found");
  }
  companyData.status = "ACTIVATED";
  return await companyData.save();
};

// Get a single payment by ID
const getPaymentById = async (id: string) => {
  return await Payment.findById(id);
};

// Get all payments
const getAllPayments = async () => {
  return await Payment.find();
};

// Update a payment by ID
const updatePayment = async (
  id: string,
  updateData: Partial<{
    amount: number;
    method: PaymentMethod;
    status: string;
    user: string; // Renamed from userId
    companyId: string; // Added companyId
    mobileNumber: string;
    txId: string;
    expDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }>
) => {
  return await Payment.findByIdAndUpdate(id, updateData, { new: true });
};

// Delete a payment by ID
const deletePayment = async (id: string) => {
  return await Payment.findByIdAndDelete(id);
};

export const PaymentService = {
  createPayment,
  verifyPayment,
  getPaymentById,
  getAllPayments,
  updatePayment,
  deletePayment,
};
