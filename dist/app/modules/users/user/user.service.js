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
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const getRelativeFilePath_1 = require("../../../middleware/fileUpload/getRelativeFilePath");
const getExpiryTime_1 = __importDefault(require("../../../utils/helper/getExpiryTime"));
const getHashedPassword_1 = __importDefault(require("../../../utils/helper/getHashedPassword"));
const getOtp_1 = __importDefault(require("../../../utils/helper/getOtp"));
const sendEmail_1 = require("../../../utils/sendEmail");
const userProfile_model_1 = require("../userProfile/userProfile.model");
const user_model_1 = __importDefault(require("./user.model"));
const removeFalsyField_1 = require("../../../utils/helper/removeFalsyField");
const config_1 = require("../../../config");
const mongoose_1 = __importDefault(require("mongoose"));
const unlinkFiles_1 = __importDefault(require("../../../utils/unlinkFiles"));
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const hashedPassword = yield (0, getHashedPassword_1.default)(data.userData.password || config_1.appConfig.user.password);
        const otp = (0, getOtp_1.default)(4);
        const expDate = (0, getExpiryTime_1.default)(10);
        // user creation
        let userData;
        if (data.userData.role === "EMPLOYEE" ||
            data.userData.role === "LEADER" ||
            data.userData.role === "MANAGER") {
            userData = {
                email: data.userData.email,
                password: hashedPassword,
                authentication: { otp, expDate },
                role: data.userData.role,
                companyId: data.companyData.companyId,
                branchId: data.companyData.branchId,
            };
        }
        else {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This role not allowed.");
        }
        const createdUser = yield user_model_1.default.create([userData], { session });
        const userId = createdUser[0]._id;
        // user profile creation
        const userProfileData = Object.assign(Object.assign({}, data.userProfileData), { user: userId, image: data.userProfileData.image || "/default/user.jpg" });
        yield userProfile_model_1.UserProfile.create([userProfileData], { session });
        // Try sending email BEFORE committing
        yield (0, sendEmail_1.sendEmail)(data.userData.email, "Email Verification Code", `Your code is: ${otp}`);
        // If everything is successful, commit
        yield session.commitTransaction();
        session.endSession();
        return {
            email: createdUser[0].email,
            isVerified: createdUser[0].isVerified,
        };
    }
    catch (err) {
        // If anything fails including email, rollback
        yield session.abortTransaction();
        session.endSession();
        if (data.userProfileData.image) {
            (0, unlinkFiles_1.default)(data.userProfileData.image);
        }
        throw new AppError_1.default(500, `Faile to create user. ${err.message && err.message}`);
    }
});
const updateProfileImage = (path, email) => __awaiter(void 0, void 0, void 0, function* () {
    const image = (0, getRelativeFilePath_1.getRelativePath)(path);
    const updated = yield userProfile_model_1.UserProfile.findOneAndUpdate({ email: email }, { image }, { new: true });
    if (!updated) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update image.");
    }
    return updated;
});
const updateProfileData = (userdata, email) => __awaiter(void 0, void 0, void 0, function* () {
    const data = (0, removeFalsyField_1.removeFalsyFields)(userdata);
    const updated = yield userProfile_model_1.UserProfile.findOneAndUpdate({ email: email }, data, {
        new: true,
    });
    if (!updated) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update user info.");
    }
    return updated;
});
exports.UserService = {
    createUser,
    updateProfileImage,
    updateProfileData,
};
