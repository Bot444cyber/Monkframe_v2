import express from 'express';
import { getAllUsers, getAllPayments, getOverviewStats, getRecentActivity, resetData, updateUserRole, updateUserStatus, deletePayment, deleteUser } from '../controllers/admin.controller';

import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware';

const router = express.Router();

// Define routes - Restricted to ADMIN only
router.get('/users', authenticateUser, authorizeRoles('ADMIN'), getAllUsers);
router.patch('/users/:id/role', authenticateUser, authorizeRoles('ADMIN'), updateUserRole);
router.patch('/users/:id/status', authenticateUser, authorizeRoles('ADMIN'), updateUserStatus);
router.delete('/users/:id', authenticateUser, authorizeRoles('ADMIN'), deleteUser);
router.get('/payments', authenticateUser, authorizeRoles('ADMIN'), getAllPayments);
router.delete('/payments/:id', authenticateUser, authorizeRoles('ADMIN'), deletePayment);
router.get('/stats', authenticateUser, authorizeRoles('ADMIN'), getOverviewStats);
router.get('/activity', authenticateUser, authorizeRoles('ADMIN'), getRecentActivity);

// Destructive
router.delete('/reset', authenticateUser, authorizeRoles('ADMIN'), resetData);

export default router;
