"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const googleDrive_controller_1 = require("../controllers/googleDrive.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// All drive routes are restricted to ADMIN only
router.get('/files', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN'), googleDrive_controller_1.listFiles);
router.post('/files', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN'), upload.single('file'), googleDrive_controller_1.uploadFile);
router.patch('/files/:id', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN'), googleDrive_controller_1.renameFile);
router.delete('/files/:id', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN'), googleDrive_controller_1.deleteFile);
exports.default = router;
