import express from 'express';
import { getAllUsers, getAllPayments, getOverviewStats, getRecentActivity, resetData, updateUserRole, updateUserStatus, deletePayment, deleteUser, updateDashboardAccess } from '../controllers/admin.controller';

import { authenticateUser, authorizeRoles } from '../middlewares/auth.middleware';

const router = express.Router();

// Define routes - Restricted to ADMIN and DEVELOPER
router.get('/users', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), getAllUsers);
router.patch('/users/:id/role', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), updateUserRole); // ADMIN & DEV
router.patch('/users/:id/status', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), updateUserStatus);
router.patch('/users/:id/dashboard-access', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), updateDashboardAccess);
router.delete('/users/:id', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), deleteUser); // ADMIN & DEV
router.get('/payments', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), getAllPayments);
router.delete('/payments/:id', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), deletePayment); // ADMIN & DEV
router.get('/stats', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), getOverviewStats);
router.get('/activity', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), getRecentActivity);

// Destructive
router.delete('/reset', authenticateUser, authorizeRoles('ADMIN', 'DEVELOPER'), resetData);

export default router;
