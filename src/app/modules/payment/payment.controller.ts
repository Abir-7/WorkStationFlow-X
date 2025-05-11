import { Request, Response } from "express";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";
import { PaymentService } from "./payment.service";
import { PaymentMethod } from "./payment.interface";

// Create a new payment
const createPayment = catchAsync(async (req: Request, res: Response) => {
  const paymentData: {
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
  } = req.body;
  const result = await PaymentService.createPayment(paymentData);

  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Payment created successfully",
    data: result,
  });
});

// Get a single payment by ID
const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentService.getPaymentById(id);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Payment retrieved successfully",
    data: result,
  });
});

// Get all payments
const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getAllPayments();

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Payments retrieved successfully",
    data: result,
  });
});

// Update a payment by ID
const updatePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: Partial<{
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
  }> = req.body;
  const result = await PaymentService.updatePayment(id, updateData);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Payment updated successfully",
    data: result,
  });
});

// Delete a payment by ID
const deletePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentService.deletePayment(id);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Payment deleted successfully",
    data: result,
  });
});

export const PaymentController = {
  createPayment,
  getPaymentById,
  getAllPayments,
  updatePayment,
  deletePayment,
};
