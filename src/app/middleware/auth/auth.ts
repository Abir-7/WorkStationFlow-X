/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import AppError from "../../errors/AppError";
import status from "http-status";
import { TUserRole } from "../../interface/auth.interface";

import { jsonWebToken } from "../../utils/jwt/jwt";
import { appConfig } from "../../config";
import User from "../../modules/users/user/user.model";
import { Company } from "../../modules/bussiness/company/company.model";
import path from "path";
import { populate } from "dotenv";

export const auth =
  (...userRole: TUserRole[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tokenWithBearer = req.headers.authorization as string;

      if (!tokenWithBearer || !tokenWithBearer.startsWith("Bearer")) {
        return next(
          new AppError(status.UNAUTHORIZED, "You are not authorized")
        );
      }

      const token = tokenWithBearer.split(" ")[1];

      if (token === "null") {
        return next(
          new AppError(status.UNAUTHORIZED, "You are not authorized")
        );
      }

      const decodedData = jsonWebToken.verifyJwt(
        token.trim(),
        appConfig.jwt.jwt_access_secret as string
      );

      const userData = (await User.findById(decodedData.userId)) as any;

      if (!userData) {
        return next(
          new AppError(status.UNAUTHORIZED, "You are not authorized")
        );
      }
      if (!userData.isVerified) {
        return next(
          new AppError(status.UNAUTHORIZED, "You are not authorized")
        );
      }

      if (userRole.length && !userRole.includes(decodedData.userRole)) {
        return next(
          new AppError(status.UNAUTHORIZED, "You are not authorized")
        );
      }

      //--------------------------------------------------------
      //check employee working status and company

      let companyStaus;

      if (userData.role !== "ADMIN") {
        if (
          userData.role === "EMPLOYEE" ||
          userData.role === "LEADER" ||
          userData.role === "MANAGER"
        ) {
          if (
            userData.status === "RESIGNED" ||
            userData.status === "TERMINATED"
          ) {
            return next(
              new AppError(status.UNAUTHORIZED, `You are ${userData.status}.`)
            );
          }
        }

        //for owner
        if (userData.role === "OWNER") {
          //populate company
          await userData.populate("companyId");
          if (!userData.companyId._id) {
            return next(
              new AppError(status.UNAUTHORIZED, "You don't have any company")
            );
          }
          companyStaus = userData.companyId.status;
        }

        //for manager
        if (userData.role === "MANAGER") {
          await userData.populate({
            path: "branchId",
            populate: "companyId",
          });
          if (!userData.branchId._id || !userData.branchId.companyId._id) {
            return next(
              new AppError(status.UNAUTHORIZED, "You are not a branch manager")
            );
          }
          companyStaus = userData.branchId.companyId.status;
        }

        if (userData.role === "LEADER" || userData.role === "EMPLOYEE") {
          await userData.populate({
            path: "teamId",
            populate: {
              path: "branchId",
              populate: "companyId",
            },
          });

          if (!userData.teamId._id || !userData.teamId.branchId.companyId._id) {
            return next(
              new AppError(status.UNAUTHORIZED, "You do not work here")
            );
          }

          companyStaus = userData.teamId.branchId.companyId.status;
        }
        console.log(userData);
        if (
          companyStaus === "DEACTIVATED" ||
          companyStaus === "REJECTED" ||
          companyStaus === "HOLD" ||
          companyStaus === "PENDING" ||
          companyStaus === "ACCEPTED"
        ) {
          return next(
            new AppError(
              status.UNAUTHORIZED,
              `${
                companyStaus === "DEACTIVATED"
                  ? "Your Company is DEACTIVATED."
                  : companyStaus === "REJECTED"
                  ? "Your Company is REJECTED."
                  : companyStaus === "HOLD"
                  ? "Wait for verify your payment"
                  : companyStaus === "PENDING"
                  ? "Your company is under review"
                  : "Your company is accepted, you can pay now."
              }`
            )
          );
        }
      }
      console.log(companyStaus);
      //--------------------------------------------------------
      req.user = decodedData;
      return next();
    } catch (error) {
      return next(
        new AppError(status.UNAUTHORIZED, "Invalid or expired token")
      );
    }
  };
