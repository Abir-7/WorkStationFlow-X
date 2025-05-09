"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRoute = void 0;
const express_1 = __importDefault(require("express"));
const company_controller_1 = require("./company.controller");
const auth_1 = require("../../../middleware/auth/auth");
const router = express_1.default.Router();
// Route to create a company
router.post("/make-request", (0, auth_1.auth)("ADMIN"), company_controller_1.CompanyController.createCompany);
// Route to get all companies
router.get("/", company_controller_1.CompanyController.getAllCompanies);
// Route to get a single company by ID
router.get("/:id", company_controller_1.CompanyController.getCompanyById);
// Route to update a company by ID
router.patch("/:id", company_controller_1.CompanyController.updateCompany);
// Route to delete a company by ID
router.delete("/:id", company_controller_1.CompanyController.deleteCompany);
exports.CompanyRoute = router;
