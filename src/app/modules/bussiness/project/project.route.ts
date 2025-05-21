import { Router } from "express";
import { auth } from "../../../middleware/auth/auth";
import { ProjectController } from "./project.controller";

const router = Router();

router.post("/add-project", auth("LEADER"), ProjectController.addProject);

export const ProjectRoute = router;
