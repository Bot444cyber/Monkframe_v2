import express from 'express';
import { getAllUsers, getAllPayments, getOverviewStats, getRecentActivity, resetData } from '../controllers/admin.controller';

import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware';

const router = express.Router();

// Define routes - Restricted to ADMIN only
router.get('/users', authenticateUser, authorizeRoles('ADMIN'), getAllUsers);
router.get('/payments', authenticateUser, authorizeRoles('ADMIN'), getAllPayments);
router.get('/stats', authenticateUser, authorizeRoles('ADMIN'), getOverviewStats);
router.get('/activity', authenticateUser, authorizeRoles('ADMIN'), getRecentActivity);

// Destructive
router.delete('/reset', authenticateUser, authorizeRoles('ADMIN'), resetData);

export default router;
