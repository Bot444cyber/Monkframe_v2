import express from 'express';
import multer from 'multer';
import { listFiles, uploadFile, deleteFile, renameFile, bulkDelete, getStorageUsage } from '../controllers/googleDrive.controller';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Only ADMIN and DEVELOPER should access Drive tools
router.get('/usage', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), getStorageUsage);
router.get('/files', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), listFiles);
router.post('/files', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), upload.single('file'), uploadFile);
router.post('/bulk-delete', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), bulkDelete);
router.patch('/files/:id', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), renameFile);
router.delete('/files/:id', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), deleteFile);

export default router;
