import { Types } from "mongoose";

export interface ICompany {
  _id: string | Types.ObjectId;
  name: string;
  cId: string;
  maxBranch: number;
  maxEmployee: number;
  currentUsage: {
    totalBranch: number;
    totalEmployee: number;
  };
  website: string;
  owner: Types.ObjectId;
  paymentInfo: {
    paymentId: Types.ObjectId;
    expireDate: Date;
  };
  status: TCompanyPaymentStatus;
}

export const companyPaymentStatus = [
  "ACTIVATED", // when payment done in time
  "DEACTIVATED", // when payment not done in time
  "HOLD", // payment done wait for payment review
  "ACCEPTED", // accepted after review
  "REJECTED", // rejected after review
  "PENDING", // details under review
] as const;

export type TCompanyPaymentStatus = (typeof companyPaymentStatus)[number];
