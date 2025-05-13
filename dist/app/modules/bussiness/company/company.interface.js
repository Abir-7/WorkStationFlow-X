"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyPaymentStatus = void 0;
exports.companyPaymentStatus = [
    "ACTIVATED", // when payment done in time
    "DEACTIVATED", // when payment not done in time
    "HOLD", // payment done wait for payment review
    "ACCEPTED", // accepted after review
    "REJECTED", // rejected after review
    "PENDING", // details under review
];
