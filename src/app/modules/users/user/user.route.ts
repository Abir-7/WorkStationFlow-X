import { Router } from "express";
import { UserController } from "./user.controller";

import { zodCreateUserSchema } from "./user.validation";
import zodValidator from "../../../middleware/zodValidator";
import { upload } from "../../../middleware/fileUpload/fileUploadHandler";
import { auth } from "../../../middleware/auth/auth";
import { parseDataField } from "../../../middleware/fileUpload/parseDataField";

const router = Router();

router.post(
  "/create-user",
  upload.single("image"),
  parseDataField("data"),
  zodValidator(zodCreateUserSchema),
  UserController.createUser
);

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
