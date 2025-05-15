import express from "express";
import { BranchController } from "./branch.controller";
import { auth } from "../../../middleware/auth/auth";

const router = express.Router();

router.post("/add-branch", auth("OWNER"), BranchController.createBranch);
router.get("/", BranchController.getAllBranches);
router.get("/:id", BranchController.getBranchById);
router.patch("/:id", BranchController.updateBranch);
router.delete("/:id", BranchController.deleteBranch);

export const BranchRoutes = router;
