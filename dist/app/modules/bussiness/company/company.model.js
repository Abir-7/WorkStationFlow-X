"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
const mongoose_1 = require("mongoose");
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
}, {
    timestamps: true,
});
exports.Company = (0, mongoose_1.model)("Company", companySchema);
