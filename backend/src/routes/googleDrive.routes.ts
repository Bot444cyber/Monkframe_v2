import express from 'express';
import multer from 'multer';
import { listFiles, uploadFile, deleteFile, renameFile } from '../controllers/googleDrive.controller';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// All drive routes are restricted to ADMIN only
router.get('/files', authenticateUser, authorizeRoles('ADMIN'), listFiles);
router.post('/files', authenticateUser, authorizeRoles('ADMIN'), upload.single('file'), uploadFile);
router.patch('/files/:id', authenticateUser, authorizeRoles('ADMIN'), renameFile);
router.delete('/files/:id', authenticateUser, authorizeRoles('ADMIN'), deleteFile);

export default router;
