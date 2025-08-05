import React, { useMemo } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const AnalyticsSection = ({ transactions }) => {
  const getCurrentMonthYear = () => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  };

  const isSameMonthYear = (dateStr) => {
    const date = new Date(dateStr);
    const { month, year } = getCurrentMonthYear();
    return date.getMonth() === month && date.getFullYear() === year;
  };

  const { summary, categorySummary } = useMemo(() => {
    const currentMonthTxns = transactions.filter(txn => txn.date && isSameMonthYear(txn.date));

    const income = currentMonthTxns
      .filter(txn => txn.type === 'income')
      .reduce((acc, txn) => acc + Number(txn.amount), 0);

    const expense = currentMonthTxns
      .filter(txn => txn.type === 'expense')
      .reduce((acc, txn) => acc + Number(txn.amount), 0);

    const expenses = currentMonthTxns.filter(txn => txn.type === 'expense');
    const categoryData = expenses.reduce((acc, txn) => {
      acc[txn.category] = (acc[txn.category] || 0) + Number(txn.amount);
      return acc;
    }, {});

    return {
      summary: { income, expense },
      categorySummary: categoryData,
    };
  }, [transactions]);

  const incomeExpenseData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        label: '₹ Amount',
        data: [summary.income, summary.expense],
        backgroundColor: ['#14b8a6', '#ef4444'],
      },
    ],
  };

  const pieData = {
    labels: Object.keys(categorySummary),
    datasets: [
      {
        label: '₹ Expense by Category',
        data: Object.values(categorySummary),
        backgroundColor: [
          '#f87171', '#fb923c', '#facc15', '#4ade80',
          '#60a5fa', '#a78bfa', '#f472b6', '#c084fc',
        ],
      },
    ],
  };

  return (
    <div className="analytics-section mt-10 px-4 w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center sm:text-left">
        Analytics Overview (This Month)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white shadow rounded w-full">
          <h3 className="text-md font-semibold mb-4 text-center">Income vs Expense</h3>
          <Bar data={incomeExpenseData} />
        </div>

        <div className="p-4 bg-white shadow rounded w-full">
          <h3 className="text-md font-semibold mb-4 text-center">Expense by Category</h3>
          {Object.keys(categorySummary).length > 0 ? (
            <Pie data={pieData} />
          ) : (
            <p className="text-center text-gray-500">No expense data available for this month</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
