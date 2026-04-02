"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// Define routes - Restricted to ADMIN only
router.get('/users', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN'), admin_controller_1.getAllUsers);
router.patch('/users/:id/role', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN'), admin_controller_1.updateUserRole);
router.patch('/users/:id/status', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN'), admin_controller_1.updateUserStatus);
router.get('/payments', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN'), admin_controller_1.getAllPayments);
router.delete('/payments/:id', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN'), admin_controller_1.deletePayment);
router.get('/stats', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN'), admin_controller_1.getOverviewStats);
router.get('/activity', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN'), admin_controller_1.getRecentActivity);
// Destructive
router.delete('/reset', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN'), admin_controller_1.resetData);
exports.default = router;
