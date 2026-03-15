import multer from 'multer';
import express from 'express';
import * as uiController from '../controllers/ui.controller';
import validateResource from '../middlewares/validateResource';
import { createUiSchema, updateUiSchema } from '../schema/ui.schema';
import { authenticateUser, optionalAuthenticate } from '../middlewares/auth.middleware';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure uploads directory exists (Absolute Path)
const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
    console.log("DEBUG: Creating upload directory at:", uploadDir);
    fs.mkdirSync(uploadDir, { recursive: true });
}
else {
    console.log("DEBUG: Upload directory exists at:", uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Make filename safe and unique
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});

const upload = multer({ storage: storage });

// Get all UIs
router.get('/', optionalAuthenticate, uiController.getUIs);

// Get Single UI
router.get('/:id', optionalAuthenticate, uiController.getUI);

// Download UI by ID
router.get('/:id/download', uiController.downloadUI);

// Stream Image Proxy
router.get('/image/:fileId', uiController.streamImage);

// CRUD
router.post('/', authenticateUser, upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'uiFile', maxCount: 1 },
    { name: 'showcase', maxCount: 3 }
]), validateResource(createUiSchema), uiController.createUI);

router.put('/:id', authenticateUser, upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'uiFile', maxCount: 1 },
    { name: 'showcase', maxCount: 3 }
]), validateResource(updateUiSchema), uiController.updateUI);
router.delete('/:id', authenticateUser, uiController.deleteUI);

export default router;
