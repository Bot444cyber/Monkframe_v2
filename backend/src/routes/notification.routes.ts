
import { Router } from 'express';
import { getNotifications } from '../controllers/notification.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = Router();

router.get('/get-notifications', authenticateUser, getNotifications);

export default router;
