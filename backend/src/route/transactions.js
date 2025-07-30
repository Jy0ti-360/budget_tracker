import express from 'express';
import { getTransactions, addTransaction, editTransaction, deleteTransaction, getMonthlySummary } from '../controller/transactionControlller.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();
router.use(authMiddleware);
router.get('/monthly-summary', getMonthlySummary);
router.route('/')
  .get(getTransactions)
  .post(addTransaction);
router.route('/:id')
  .put(editTransaction)
  .delete(deleteTransaction);

export default router;