"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable arrow-body-style */
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
const auth_interface_1 = require("../../../interface/auth.interface");
const getHashedPassword_1 = __importDefault(require("../../../utils/helper/getHashedPassword"));
const user_model_1 = __importDefault(require("../../users/user/user.model"));
const userProfile_model_1 = require("../../users/userProfile/userProfile.model");
const company_model_1 = require("./company.model");
const logger_1 = __importDefault(require("../../../utils/logger"));
const sendEmail_1 = require("../../../utils/sendEmail");
const getExpiryTime_1 = __importDefault(require("../../../utils/helper/getExpiryTime"));
const getOtp_1 = __importDefault(require("../../../utils/helper/getOtp"));
// Create a new company
const createCompany = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = (0, getOtp_1.default)(4);
    const expDate = (0, getExpiryTime_1.default)(10);
    const companyData = {
        name: data.companyData.name,
        maxBranch: data.companyData.maxBranch,
        maxEmployee: data.companyData.maxEmployee,
        cId: "iio",
    };
    const userProfileData = {
        fullName: data.ownerData.fullName,
        phone: data.ownerData.phone,
    };
    const createdCompany = yield company_model_1.Company.create(companyData);
    logger_1.default.info("create company");
    const userData = {
        email: data.ownerData.email,
        password: yield (0, getHashedPassword_1.default)(data.ownerData.password),
    };
    const createdUser = yield user_model_1.default.create(Object.assign(Object.assign({}, userData), { role: auth_interface_1.userRoles.OWNER, authentication: { otp, expDate }, companyId: createdCompany._id }));
    yield userProfile_model_1.UserProfile.create(Object.assign(Object.assign({}, userProfileData), { user: createdUser._id }));
    yield (0, sendEmail_1.sendEmail)(data.ownerData.email, "Email Verification Code", `Your code is: ${otp}`);
    return createdCompany;
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
