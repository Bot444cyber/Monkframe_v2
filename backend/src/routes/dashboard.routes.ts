import express from 'express';
import { getStats } from '../controllers/dashboard.controller';
import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware';

const router = express.Router();

// Define routes
router.get('/stats', authenticateUser, authorizeRoles('ADMIN'), getStats);

export default router;
