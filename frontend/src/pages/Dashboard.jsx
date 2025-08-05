import React, { useRef, useEffect, useState } from 'react';
import Header from './Header.jsx';
import DashboardContent from '../components/Dashboard.jsx';
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
      console.error("Error refreshing data : ", error);
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

  return (
    <div className="w-full p-4 font-sans">
      <Header onAnalyticsClick={scrollToAnalytics} />
      <header className="mb-8">
        <div className="text-center mt-5 space-y-2">
          <div className="text-xl font-medium text-[#264653] mb-5 mt-10">
            Hello, {user?.name || 'User'}!
          </div>
          <div className="text-xl font-medium text-[#264653]">
            Welcome to the Budget Tracker App!
          </div>
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
        <AnalyticsSection
          transactions={transactions}
          summary={summary}
        />

        <div className='mt-8'>
          <MonthlyTrendChart months={12} />
        </div>

        <div className="chart-container">
          <select value={range} onChange={(e) => setRange(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>
      <input
        type="number"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
      />
      <CashFlowChart range={range} count={count} />
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;
