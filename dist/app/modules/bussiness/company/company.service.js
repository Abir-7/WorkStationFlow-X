"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable arrow-body-style */
const uuid_1 = require("uuid");
const auth_interface_1 = require("../../../interface/auth.interface");
const getHashedPassword_1 = __importDefault(require("../../../utils/helper/getHashedPassword"));
const user_model_1 = __importDefault(require("../../users/user/user.model"));
const userProfile_model_1 = require("../../users/userProfile/userProfile.model");
const company_model_1 = require("./company.model");
const logger_1 = __importDefault(require("../../../utils/logger"));
// Create a new company
const mongoose_1 = __importDefault(require("mongoose"));
const createCompany = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const companyData = {
            name: data.companyData.name,
            maxBranch: data.companyData.maxBranch,
            maxEmployee: data.companyData.maxEmployee,
            cId: `C-${(0, uuid_1.v4)()}`,
        };
        const userProfileData = {
            fullName: data.ownerData.fullName,
            phone: data.ownerData.phone,
        };
        const userData = {
            email: data.ownerData.email,
            password: yield (0, getHashedPassword_1.default)(data.ownerData.password),
        };
        const createdCompany = yield company_model_1.Company.create([companyData], { session });
        logger_1.default.info("Company created");
        const createdUser = yield user_model_1.default.create([
            Object.assign(Object.assign({}, userData), { role: auth_interface_1.userRoles.OWNER, companyId: createdCompany[0]._id }),
        ], { session });
        yield userProfile_model_1.UserProfile.create([
            Object.assign(Object.assign({}, userProfileData), { user: createdUser[0]._id }),
        ], { session });
        // Commit transaction before sending email (email can be retried independently)
        yield session.commitTransaction();
        session.endSession();
        return createdCompany[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        logger_1.default.error("Transaction aborted:", error);
        throw new Error(error);
    }
});
// Get a single company by ID
const getCompanyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield company_model_1.Company.findById(id);
});
// Get all companies
const getAllCompanies = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield company_model_1.Company.find();
});
// Update a company by ID
const updateCompany = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield company_model_1.Company.findByIdAndUpdate(id, updateData, { new: true });
});
// Delete a company by ID
const deleteCompany = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield company_model_1.Company.findByIdAndDelete(id);
});
exports.CompanyService = {
    createCompany,
    getCompanyById,
    getAllCompanies,
    updateCompany,
    deleteCompany,
};
