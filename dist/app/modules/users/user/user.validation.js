"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodCreateUserSchema = void 0;
const zod_1 = require("zod");
exports.zodCreateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        userData: zod_1.z.object({
            email: zod_1.z.string().email({ message: "Invalid email format" }),
            password: zod_1.z
                .string()
                .min(6, { message: "Password must be at least 6 characters" }),
            role: zod_1.z.enum(["OWNER", "ADMIN", "USER"]),
        }),
        userProfileData: zod_1.z.object({
            fullName: zod_1.z.string().min(1, { message: "Full name is required" }),
            phone: zod_1.z.string().min(6, { message: "Phone number is required" }),
        }),
        companyData: zod_1.z.object({
            companyId: zod_1.z.string().min(1, { message: "Company ID is required" }),
            branchId: zod_1.z.string(), // Optional: add `.min(1)` if you want it to be required
        }),
    }),
});
