import { TeamRoutes } from "./../modules/bussiness/team/team.route";
import { Router } from "express";
import { UserRoute } from "../modules/users/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { CompanyRoute } from "../modules/bussiness/company/company.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { BranchRoutes } from "../modules/bussiness/branch/branch.route";

const router = Router();
const apiRoutes = [
  { path: "/user", route: UserRoute },
  { path: "/auth", route: AuthRoute },
  { path: "/company", route: CompanyRoute },
  { path: "/branch", route: BranchRoutes },
  { path: "/team", route: TeamRoutes },
  { path: "/payment", route: PaymentRoutes },
];
apiRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
