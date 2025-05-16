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
exports.auth = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const jwt_1 = require("../../utils/jwt/jwt");
const config_1 = require("../../config");
const user_model_1 = __importDefault(require("../../modules/users/user/user.model"));
const auth = (...userRole) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenWithBearer = req.headers.authorization;
        if (!tokenWithBearer || !tokenWithBearer.startsWith("Bearer")) {
            return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized"));
        }
        const token = tokenWithBearer.split(" ")[1];
        if (token === "null") {
            return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized"));
        }
        const decodedData = jwt_1.jsonWebToken.verifyJwt(token.trim(), config_1.appConfig.jwt.jwt_access_secret);
        const userData = (yield user_model_1.default.findById(decodedData.userId));
        if (!userData) {
            return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized"));
        }
        if (!userData.isVerified) {
            return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized"));
        }
        if (userRole.length && !userRole.includes(decodedData.userRole)) {
            return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized"));
        }
        //--------------------------------------------------------
        //check employee working status and company
        let companyStaus;
        if (userData.role !== "ADMIN") {
            if (userData.role === "EMPLOYEE" ||
                userData.role === "LEADER" ||
                userData.role === "MANAGER") {
                if (userData.status === "RESIGNED" ||
                    userData.status === "TERMINATED") {
                    return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, `You are ${userData.status}.`));
                }
            }
            //for owner
            if (userData.role === "OWNER") {
                //populate company
                yield userData.populate("companyId");
                if (!userData.companyId._id) {
                    return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You don't have any company"));
                }
                companyStaus = userData.companyId.status;
            }
            //for manager
            if (userData.role === "MANAGER") {
                yield userData.populate({
                    path: "branchId",
                    populate: "companyId",
                });
                if (!userData.branchId._id || !userData.branchId.companyId._id) {
                    return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not a branch manager"));
                }
                companyStaus = userData.branchId.companyId.status;
            }
            if (userData.role === "LEADER" || userData.role === "EMPLOYEE") {
                yield userData.populate({
                    path: "teamId",
                    //! todo -------
                });
            }
            if (companyStaus === "DEACTIVATED" ||
                companyStaus === "REJECTED" ||
                companyStaus === "HOLD" ||
                companyStaus === "PENDING" ||
                companyStaus === "ACCEPTED") {
                return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, `${companyStaus === "DEACTIVATED"
                    ? "Your Company is DEACTIVATED."
                    : companyStaus === "REJECTED"
                        ? "Your Company is REJECTED."
                        : companyStaus === "HOLD"
                            ? "Wait for verify your payment"
                            : companyStaus === "PENDING"
                                ? "Your company is under review"
                                : "Your company is accepted, you can pay now."}`));
            }
        }
        console.log(companyStaus);
        //--------------------------------------------------------
        req.user = decodedData;
        return next();
    }
    catch (error) {
        return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or expired token"));
    }
});
exports.auth = auth;
