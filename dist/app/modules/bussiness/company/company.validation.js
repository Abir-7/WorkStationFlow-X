"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCompanySchema = exports.createCompanySchema = void 0;
const zod_1 = require("zod");
// Validation schema for creating a company
exports.createCompanySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().nonempty("Name is required"),
        cId: zod_1.z.string().nonempty("Company ID is required"),
        maxBranch: zod_1.z.number().min(1, "Max branch must be at least 1"),
        maxEmployee: zod_1.z.number().min(1, "Max employee must be at least 1"),
    }),
});
// Validation schema for updating a company
exports.updateCompanySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        maxBranch: zod_1.z.number().min(1, "Max branch must be at least 1").optional(),
        maxEmployee: zod_1.z
            .number()
            .min(1, "Max employee must be at least 1")
            .optional(),
    }),
});
