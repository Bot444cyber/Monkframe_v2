import express from 'express';
import passport from 'passport';
import * as userController from '../controllers/user.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = express.Router();

// Authentication Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/callback/google', userController.googleAuthCallback);
router.get('/logout', userController.logout);
router.get('/current_user', userController.getCurrentUser);
router.get('/profile', authenticateUser, userController.getUserProfile);
router.post('/heartbeat', authenticateUser, userController.heartbeat);

export default router;
