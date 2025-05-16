import express from "express";
import { TeamController } from "./team.controller";
import { auth } from "../../../middleware/auth/auth";

const router = express.Router();

router.post("/add-team", auth("MANAGER"), TeamController.createTeam);
router.get("/", TeamController.getAllTeams);
router.get("/:id", TeamController.getTeamById);
router.patch("/:id", TeamController.updateTeam);
router.delete("/:id", TeamController.deleteTeam);

export const TeamRoutes = router;
