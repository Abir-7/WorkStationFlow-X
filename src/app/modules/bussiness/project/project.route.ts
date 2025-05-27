import { Router } from "express";
import { auth } from "../../../middleware/auth/auth";
import { ProjectController } from "./project.controller";

const router = Router();

router.post("/add-project", auth("LEADER"), ProjectController.addProject);
router.patch(
  "/update-project/:id",
  auth("LEADER"),
  ProjectController.updateProject
);
router.patch(
  "/update-project-phase-by-member/:id",
  auth("EMPLOYEE"),
  ProjectController.updatePhaseByMember
);

export const ProjectRoute = router;
