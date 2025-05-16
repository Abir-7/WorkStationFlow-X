import { Router } from "express";
import { UserController } from "./user.controller";

import { upload } from "../../../middleware/fileUpload/fileUploadHandler";
import { auth } from "../../../middleware/auth/auth";

const router = Router();

router.patch(
  "/update-profile-image",
  auth("ADMIN", "EMPLOYEE", "LEADER", "MANAGER", "OWNER"),
  upload.single("file"),
  UserController.updateProfileImage
);

router.patch(
  "/update-profile-data",
  auth("ADMIN", "EMPLOYEE", "LEADER", "MANAGER", "OWNER"),
  UserController.updateProfileData
);

export const UserRoute = router;
