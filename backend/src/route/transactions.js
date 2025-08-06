import express from 'express';
import { getTransactions, addTransaction, editTransaction, deleteTransaction, getMonthlySummary } from '../controller/transactionControlller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';
import { extractTransactionsFromUpload } from '../controller/transactionControlller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(authMiddleware);
router.get('/monthly-summary', getMonthlySummary);
router.post('/extract', upload.single('file'), extractTransactionsFromUpload);
router.route('/')
  .get(getTransactions)
  .post(addTransaction);
router.route('/:id')
  .put(editTransaction)
  .delete(deleteTransaction);

export default router;