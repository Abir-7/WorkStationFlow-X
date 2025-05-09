import { z } from "zod";

// Validation schema for creating a company
export const createCompanySchema = z.object({
  body: z.object({
    name: z.string().nonempty("Name is required"),
    cId: z.string().nonempty("Company ID is required"),
    maxBranch: z.number().min(1, "Max branch must be at least 1"),
    maxEmployee: z.number().min(1, "Max employee must be at least 1"),
  }),
});

// Validation schema for updating a company
export const updateCompanySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    maxBranch: z.number().min(1, "Max branch must be at least 1").optional(),
    maxEmployee: z
      .number()
      .min(1, "Max employee must be at least 1")
      .optional(),
  }),
});
