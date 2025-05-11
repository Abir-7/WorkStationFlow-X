export enum PaymentMethod {
  BIKASH = "bikash",
  NAGAD = "nagad",
  ROKET = "roket",
}

export interface IPayment {
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
}
