import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getMonthlyTrend, getCashFlow  } from '../controller/analyticsController.js';

const router = express.Router();
router.use(authMiddleware);
router.get('/monthly-trend', getMonthlyTrend );
router.get('/cash-flow', getCashFlow);

export default router;
