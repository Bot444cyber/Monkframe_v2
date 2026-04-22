"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// Define routes
router.get('/stats', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN', 'DEVELOPER'), dashboard_controller_1.getStats);
exports.default = router;
