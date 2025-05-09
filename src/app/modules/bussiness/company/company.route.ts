import express from "express";
import { CompanyController } from "./company.controller";
import { auth } from "../../../middleware/auth/auth";

const router = express.Router();

// Route to create a company
router.post("/make-request", auth("ADMIN"), CompanyController.createCompany);

// Route to get all companies
router.get("/", CompanyController.getAllCompanies);

// Route to get a single company by ID
router.get("/:id", CompanyController.getCompanyById);

// Route to update a company by ID
router.patch("/:id", CompanyController.updateCompany);

// Route to delete a company by ID
router.delete("/:id", CompanyController.deleteCompany);

export const CompanyRoute = router;
