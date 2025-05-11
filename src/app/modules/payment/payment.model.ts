import { Schema, model } from "mongoose";
import { IPayment, PaymentMethod } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    status: { type: String, required: true },
    user: { type: String, required: true, ref: "User" }, // Renamed from userId
    companyId: { type: String, required: true, ref: "Company" }, // Added companyId
    mobileNumber: { type: String, required: true },
    txId: { type: String, required: true },
    expDate: { type: Date, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export const Payment = model<IPayment>("Payment", paymentSchema);
