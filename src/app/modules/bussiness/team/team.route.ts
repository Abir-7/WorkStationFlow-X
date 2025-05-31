import express from "express";
import { TeamController } from "./team.controller";
import { auth } from "../../../middleware/auth/auth";

const router = express.Router();

router.post("/add-team", auth("MANAGER"), TeamController.createTeam);
// branch manager --dashboard
router.get(
  "/get-all-team-basic-data",
  auth("MANAGER"),
  TeamController.getAllTeamsBasicData
);
router.get(
  "/get-branch-quick-view-data",
  auth("MANAGER"),
  TeamController.getBrarchQuickViewData
);

router.get("/:id", TeamController.getTeamById);
router.patch("/:id", TeamController.updateTeam);
router.delete("/:id", TeamController.deleteTeam);

export const TeamRoutes = router;
