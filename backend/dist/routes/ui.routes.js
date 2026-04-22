"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const express_1 = __importDefault(require("express"));
const uiController = __importStar(require("../controllers/ui.controller"));
const validateResource_1 = __importDefault(require("../middlewares/validateResource"));
const ui_schema_1 = require("../schema/ui.schema");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const os_1 = __importDefault(require("os"));
const router = express_1.default.Router();
// Ensure uploads use OS temp dir instead of project folder to prevent issues on Hostinger
const uploadDir = os_1.default.tmpdir();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Make filename safe and unique
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// Get all UIs
router.get('/', auth_middleware_1.optionalAuthenticate, uiController.getUIs);
// Get Single UI
router.get('/:id', auth_middleware_1.optionalAuthenticate, uiController.getUI);
// Download UI by ID
router.get('/:id/download', auth_middleware_1.optionalAuthenticate, uiController.downloadUI);
// Stream Image Proxy
router.get('/image/:fileId', uiController.streamImage);
// CRUD
router.post('/', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN', 'EDITOR', 'DEVELOPER'), upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'uiFile', maxCount: 1 },
    { name: 'showcase', maxCount: 4 }
]), (0, validateResource_1.default)(ui_schema_1.createUiSchema), uiController.createUI);
router.put('/:id', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN', 'EDITOR', 'DEVELOPER'), upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'uiFile', maxCount: 1 },
    { name: 'showcase', maxCount: 4 }
]), (0, validateResource_1.default)(ui_schema_1.updateUiSchema), uiController.updateUI);
router.delete('/:id/file', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN', 'EDITOR', 'DEVELOPER'), uiController.deleteUIFile);
router.delete('/:id', auth_middleware_1.authenticateUser, (0, auth_middleware_1.authorizeRoles)('ADMIN', 'EDITOR', 'DEVELOPER'), uiController.deleteUI);
exports.default = router;
