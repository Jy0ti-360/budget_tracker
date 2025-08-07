import React, { useRef, useEffect, useState } from 'react';
import Header from './Header.jsx';
import DashboardContent from '../components/DashboardContent.jsx';
import AnalyticsSection from '../components/AnalyticsSection.jsx';
import Footer from './Footer.jsx';
import useAuth from '../hooks/useAuth';
import * as txnService from '../services/transactionService';
import MonthlyTrendChart from '../components/MonthlyTrendChart.jsx';
import CashFlowChart from '../components/CashFlowChart.jsx';

const DashboardPage = () => {
  const { user } = useAuth();
  const analyticsRef = useRef();

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const [loading, setLoading] = useState(false);

  const loadTransactions = async () => {
    try {
      const data = await txnService.fetchTransactions();
      const normalized = data.map(txn => ({
        ...txn,
        date: typeof txn.date === 'string' ? txn.date : txn.date?.$date || txn.date
      }));
      setTransactions(normalized);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const loadSummary = async () => {
    try {
      const result = await txnService.fetchMonthlySummary();
      setSummary(result);
    } catch (error) {
      console.error("Failed to fetch summary:", error);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadTransactions(), loadSummary()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const scrollToAnalytics = () => {
    analyticsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const [range, setRange] = useState('daily');
  const [count, setCount] = useState(7);

  const spentPercentage = summary.income > 0 ? (summary.expense / summary.income) * 100 : 0;

  let bgColor = 'bg-yellow-100 text-yellow-900 border-yellow-400';
  if (spentPercentage > 80) bgColor = 'bg-red-100 text-red-900 border-red-400';
  else if (spentPercentage < 20) bgColor = 'bg-green-100 text-green-900 border-green-400';

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-4 font-sans">
      <Header onAnalyticsClick={scrollToAnalytics} />

      <header className="mb-8">
        <div className="text-center mt-5 space-y-2">
          <div className="text-lg sm:text-xl font-medium text-[#264653] mb-4">
            Hello, {user?.name || 'User'}!
          </div>
          <div className="text-lg sm:text-xl font-medium text-[#264653]">
            Welcome to the Budget Tracker App!
          </div>

          <div
            className={`relative overflow-hidden whitespace-nowrap mt-4 border rounded-lg ${bgColor}`}
            style={{ height: '40px' }}
          >
            <div
              className="absolute animate-marquee inline-block px-4 py-2 font-semibold"
              style={{
                animation: 'marquee 12s linear infinite',
                whiteSpace: 'nowrap',
              }}
            >
              You have spent <span className="font-bold">{spentPercentage.toFixed(2)}%</span> of your earnings so far.
            </div>
          </div>

          <style>{`
            @keyframes marquee {
              0% {
                transform: translateX(100%);
              }
              100% {
                transform: translateX(-100%);
              }
            }
          `}</style>
        </div>
      </header>

      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600 font-medium">Refreshing data...</span>
        </div>
      )}

      <DashboardContent
        transactions={transactions}
        summary={summary}
        refreshData={refreshData}
      />

      <div ref={analyticsRef}>
        <AnalyticsSection transactions={transactions} summary={summary} />

        <div className="mt-8 px-2 sm:px-4">
          <MonthlyTrendChart months={12} />
        </div>

        <div className="mt-8 px-2 sm:px-4">
          <CashFlowChart
            range={range}
            count={count}
            onRangeChange={(e) => setRange(e.target.value)}
            onCountChange={(e) => setCount(Number(e.target.value))}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;