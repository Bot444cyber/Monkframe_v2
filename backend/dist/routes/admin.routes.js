"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// Define routes - Protected by Admin/User check? 
// Assuming all admin routes need at least a valid token.
// The controller checks req.user for specific logic.
router.get('/users', auth_middleware_1.authenticateUser, admin_controller_1.getAllUsers);
router.get('/payments', auth_middleware_1.authenticateUser, admin_controller_1.getAllPayments);
router.get('/stats', auth_middleware_1.authenticateUser, admin_controller_1.getOverviewStats);
router.get('/activity', auth_middleware_1.authenticateUser, admin_controller_1.getRecentActivity);
// Destructive
router.delete('/reset', auth_middleware_1.authenticateUser, admin_controller_1.resetData);
exports.default = router;
