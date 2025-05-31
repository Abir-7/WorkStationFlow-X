"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const team_route_1 = require("./../modules/bussiness/team/team.route");
const express_1 = require("express");
const user_route_1 = require("../modules/users/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const company_route_1 = require("../modules/bussiness/company/company.route");
const payment_route_1 = require("../modules/payment/payment.route");
const branch_route_1 = require("../modules/bussiness/branch/branch.route");
const employee_route_1 = require("../modules/bussiness/employee/employee.route");
const project_route_1 = require("../modules/bussiness/project/project.route");
const router = (0, express_1.Router)();
const apiRoutes = [
    { path: "/user", route: user_route_1.UserRoute },
    { path: "/auth", route: auth_route_1.AuthRoute },
    { path: "/company", route: company_route_1.CompanyRoute },
    { path: "/branch", route: branch_route_1.BranchRoutes },
    { path: "/team", route: team_route_1.TeamRoutes },
    { path: "/employee", route: employee_route_1.EmployeeRoutes },
    { path: "/payment", route: payment_route_1.PaymentRoutes },
    { path: "/project", route: project_route_1.ProjectRoute },
];
apiRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
