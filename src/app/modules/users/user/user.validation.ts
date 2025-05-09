import { z } from "zod";

export const zodCreateUserSchema = z.object({
  body: z.object({
    userData: z.object({
      email: z.string().email({ message: "Invalid email format" }),
      password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
      role: z.enum(["OWNER", "ADMIN", "USER"]),
    }),
    userProfileData: z.object({
      fullName: z.string().min(1, { message: "Full name is required" }),
      phone: z.string().min(6, { message: "Phone number is required" }),
    }),
    companyData: z.object({
      companyId: z.string().min(1, { message: "Company ID is required" }),
      branchId: z.string(), // Optional: add `.min(1)` if you want it to be required
    }),
  }),
});
