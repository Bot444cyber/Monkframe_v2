import express from 'express';
import { getAllUsers, getAllPayments, getOverviewStats, getRecentActivity, resetData } from '../controllers/admin.controller';

import { authenticateUser } from '../middlewares/auth.middleware';

const router = express.Router();

// Define routes - Protected by Admin/User check? 
// Assuming all admin routes need at least a valid token.
// The controller checks req.user for specific logic.
router.get('/users', authenticateUser, getAllUsers);
router.get('/payments', authenticateUser, getAllPayments);
router.get('/stats', authenticateUser, getOverviewStats);
router.get('/activity', authenticateUser, getRecentActivity);

// Destructive
router.delete('/reset', authenticateUser, resetData);

export default router;
