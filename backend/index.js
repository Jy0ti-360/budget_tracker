import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/dbConnectivity.js';
import authRoutes from './src/route/auth.js';
import txnRoutes from './src/route/transactions.js';

dotenv.config();
connectDB();

const app = express();
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/transactions', txnRoutes);

export default app;
