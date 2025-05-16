import express from "express";
import { EmployeeController } from "./employee.controller";
import { auth } from "../../../middleware/auth/auth";

const router = express.Router();

router.post("/add-employee", auth("LEADER"), EmployeeController.createEmployee);
router.get("/", EmployeeController.getAllEmployees);
router.get("/:id", EmployeeController.getEmployeeById);
router.patch("/:id", EmployeeController.updateEmployee);
router.delete("/:id", EmployeeController.deleteEmployee);

export const EmployeeRoutes = router;
