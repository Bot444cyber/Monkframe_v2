import { Router } from 'express';
import { createPaymentIntent, confirmPayment } from '../controllers/payment.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = Router();

router.post('/create-payment-intent', authenticateUser, createPaymentIntent);
router.post('/confirm-payment', authenticateUser, confirmPayment);

export default router;
