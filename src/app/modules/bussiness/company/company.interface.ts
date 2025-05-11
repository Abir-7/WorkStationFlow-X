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
  "ACTIVATED",
  "DEACTIVATED",
  "UNPAID",
  "REJECTED",
  "PENDING",
] as const;

export type TCompanyPaymentStatus = (typeof companyPaymentStatus)[number];
