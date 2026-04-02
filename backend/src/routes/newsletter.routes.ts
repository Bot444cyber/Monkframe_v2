import { Router } from 'express';
import { subscribeToNewsletter } from '../controllers/newsletter.controller';
import { generalLimiter } from '../middlewares/rateLimit.middleware';

const router = Router();

// Endpoint for newsletter subscriptions
router.post('/subscribe', generalLimiter, subscribeToNewsletter);

export default router;
