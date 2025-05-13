"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
const mongoose_1 = require("mongoose");
const company_interface_1 = require("./company.interface");
const companySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    cId: { type: String, required: true, unique: true },
    maxBranch: { type: Number, required: true },
    maxEmployee: { type: Number, required: true },
    currentUsage: {
        totalBranch: { type: Number, default: 0 },
        totalEmployee: { type: Number, default: 0 },
    },
    website: { type: String, unique: true },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    paymentInfo: {
        paymentId: { type: mongoose_1.Types.ObjectId, default: null, ref: "Payment" },
        expireDate: { type: Date, default: null },
    },
    status: {
        type: String,
        enum: company_interface_1.companyPaymentStatus,
        required: true,
        default: "PENDING",
    },
}, {
    timestamps: true,
});
exports.Company = (0, mongoose_1.model)("Company", companySchema);
