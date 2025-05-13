/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import AppError from "../../errors/AppError";
import status from "http-status";
import { TUserRole } from "../../interface/auth.interface";

import { jsonWebToken } from "../../utils/jwt/jwt";
import { appConfig } from "../../config";
import User from "../../modules/users/user/user.model";
import { Company } from "../../modules/bussiness/company/company.model";

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
        token,
        appConfig.jwt.jwt_access_secret as string
      );

      const userData = await User.findById(decodedData.userId);

      if (!userData) {
        return next(
          new AppError(status.UNAUTHORIZED, "You are not authorized")
        );
      }

      if (userRole.length && !userRole.includes(decodedData.userRole)) {
        return next(
          new AppError(status.UNAUTHORIZED, "You are not authorized")
        );
      }

      if (
        userData.role !== decodedData.userRole ||
        userData.email !== decodedData.userEmail
      ) {
        return next(
          new AppError(status.UNAUTHORIZED, "You are not authorized")
        );
      }

      //--------------------------------------------------------
      //check employee working status and company
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

        if (userData.companyId) {
          const companyData = await Company.findById(userData.companyId);
          if (
            companyData?.status === "DEACTIVATED" ||
            companyData?.status === "REJECTED" ||
            companyData?.status === "HOLD" ||
            companyData?.status === "PENDING" ||
            companyData?.status === "ACCEPTED"
          ) {
            return next(
              new AppError(
                status.UNAUTHORIZED,
                `${
                  companyData?.status === "DEACTIVATED"
                    ? "Your Company is DEACTIVATED."
                    : companyData?.status === "REJECTED"
                    ? "Your Company is REJECTED."
                    : companyData?.status === "HOLD"
                    ? "Wait for verify your payment"
                    : companyData?.status === "PENDING"
                    ? "Your company is under review"
                    : "Your company is accepted, you can pay now."
                }`
              )
            );
          }
        }

        if (!userData.companyId) {
          return next(
            new AppError(
              status.UNAUTHORIZED,
              "You don't have connection with any company."
            )
          );
        }
      }
      //--------------------------------------------------------
      req.user = decodedData;
      return next();
    } catch (error) {
      return next(
        new AppError(status.UNAUTHORIZED, "Invalid or expired token")
      );
    }
  };
