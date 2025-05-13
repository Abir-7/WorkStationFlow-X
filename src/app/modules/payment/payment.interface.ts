import { Types } from "mongoose";

export enum PaymentMethod {
  BIKASH = "bkash",
  NAGAD = "nagad",
  ROKET = "roket",
}

export interface IPayment {
  amount: number;
  method: PaymentMethod;
  user: Types.ObjectId;
  companyId: Types.ObjectId;
  mobile: string;
  txId: string;
  expDate: Date;
}
