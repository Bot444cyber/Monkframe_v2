
import { Router } from 'express';
import { getNotifications, resolveNotification, dismissNotification } from '../controllers/notification.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = Router();

router.get('/get-notifications', authenticateUser, getNotifications);
router.patch('/resolve/:id', authenticateUser, resolveNotification);
router.patch('/dismiss/:id', authenticateUser, dismissNotification);

export default router;
