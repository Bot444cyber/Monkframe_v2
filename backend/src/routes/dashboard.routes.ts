import express from 'express';
import { getStats } from '../controllers/dashboard.controller';

const router = express.Router();

// Define routes
router.get('/stats', getStats);

export default router;
