import { Router } from "express";
import { UserRoute } from "../modules/users/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { CompanyRoute } from "../modules/bussiness/company/company.route";

const router = Router();
const apiRoutes = [
  { path: "/user", route: UserRoute },
  { path: "/auth", route: AuthRoute },
  { path: "/company", route: CompanyRoute },
];
apiRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
