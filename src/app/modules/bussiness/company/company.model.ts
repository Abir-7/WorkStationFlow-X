import { Schema, Types, model } from "mongoose";
import { companyPaymentStatus, ICompany } from "./company.interface";

const companySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    cId: { type: String, required: true, unique: true },
    maxBranch: { type: Number, required: true },
    maxEmployee: { type: Number, required: true },
    currentUsage: {
      totalBranch: { type: Number, default: 0 },
      totalEmployee: { type: Number, default: 0 },
    },
    website: { type: String, unique: true, sparse: true },
    paymentInfo: {
      paymentId: { type: Types.ObjectId, default: null, ref: "Payment" },
      expireDate: { type: Date, default: null },
    },
    status: {
      type: String,
      enum: companyPaymentStatus,
      required: true,
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

export const Company = model<ICompany>("Company", companySchema);
