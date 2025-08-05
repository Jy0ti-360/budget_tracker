import Transaction from "../model/Transaction.js";
import mongoose from "mongoose";

export const getMonthlyTrend = async (req, res) => {
    const monthsBack = parseInt(req.query.months) || 12;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1);

    const data = await Transaction.aggregate([
        { $match: { date: { $gte: start } } },
        {
            $group: {
                _id: {
                    year: { $year: '$date' },
                    month: { $month: '$date' },
                    type: '$type'
                },
                total: { $sum: '$amount' }
            }
        }
    ]);

    const trend = {};
    for (let i = 0; i < monthsBack; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
        trend[key] = { income: 0, expense: 0 };
    }
    data.forEach(d => {
        const key = `${d._id.year}-${d._id.month}`;
        if (trend[key]) {
            trend[key][d._id.type || 'expense'] = d.total;
        }
    });

    const labels = Object.keys(trend).sort((a, b) => new Date(a) - new Date(b));
    const income = labels.map(l => trend[l].income);
    const expense = labels.map(l => trend[l].expense);

    res.json({ labels, income, expense });
}

export const getCashFlow = async (req, res) => {
  try {
    const { range = 'daily', days = 7, weeks = 4 } = req.query;
    const count = range === 'weekly' ? parseInt(weeks, 10) : parseInt(days, 10);
    const userId = req.user._id;

    const now = new Date();
    const labels = [];
    const inflow = [];
    const outflow = [];
    const net = [];

    for (let i = count - 1; i >= 0; i--) {
      let start, end, label;

      if (range === 'weekly') {
        start = new Date(now);
        start.setDate(start.getDate() - (i * 7));
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        label = `Week ${getWeekNumber(start)}`;
      } else {
        start = new Date(now);
        start.setDate(start.getDate() - i);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
        label = `${start.getMonth() + 1}/${start.getDate()}`;
      }

      const incomeSum = await sumAmount(userId, 'income', start, end);
      const expenseSum = await sumAmount(userId, 'expense', start, end);

      labels.push(label);
      inflow.push(incomeSum);
      outflow.push(expenseSum);
      net.push(incomeSum - expenseSum);
    }

    res.json({ labels, inflow, outflow, net });

  } catch (err) {
    console.error('Cash Flow Error:', err);
    res.status(500).json({ message: 'Failed to fetch cash flow data' });
  }
};

const sumAmount = async (userId, type, start, end) => {
  const result = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        type,
        date: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  return result[0]?.total || 0;
};

const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};