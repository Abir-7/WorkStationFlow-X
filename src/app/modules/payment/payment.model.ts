import { model, Schema } from "mongoose";
import { IPayment, PaymentMethod } from "./payment.interface";

const PaymentSchema = new Schema<IPayment>(
  {
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    txId: {
      type: String,
      required: true,
    },
    expDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = model<IPayment>("Payment", PaymentSchema);
