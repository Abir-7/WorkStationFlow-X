/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable arrow-body-style */
import { Payment } from "./payment.model";
import { PaymentMethod } from "./payment.interface";

// Create a new payment
const createPayment = async (data: {
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
}) => {
  return await Payment.create(data);
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
  getPaymentById,
  getAllPayments,
  updatePayment,
  deletePayment,
};
