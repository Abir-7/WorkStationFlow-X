import express from "express";
import { PaymentController } from "./payment.controller";

const router = express.Router();

// Route to create a payment
router.post("/", PaymentController.createPayment);

// Route to get all payments
router.get("/", PaymentController.getAllPayments);

// Route to get a single payment by ID
router.get("/:id", PaymentController.getPaymentById);

// Route to update a payment by ID
router.patch("/:id", PaymentController.updatePayment);

// Route to delete a payment by ID
router.delete("/:id", PaymentController.deletePayment);

export const PaymentRoutes = router;
