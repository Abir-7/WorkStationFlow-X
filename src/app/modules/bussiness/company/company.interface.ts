import { Types } from "mongoose";

export interface ICompany {
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
    paymentId: string;
    expireDate: Date;
    status: TCompanyPaymentStatus;
  };
}
export const companyPaymentStatus = [
  "ACTIVATED",
  "DEACTIVATED",
  "UNPAID",
] as const;

export type TCompanyPaymentStatus = (typeof companyPaymentStatus)[number];
