import React, { useEffect, useState } from 'react';
import * as txnService from '../services/transactionService';
import Transaction from './TransactionList';

const DashboardContent = () => {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    type: 'income',
    category: '',
    amount: '',
    date: '',
    note: ''
  });
  const [showAll, setShowAll] = useState(false);
  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const [filter, setFilter] = useState({
    type: '',
    date: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const load = async () => {
    const data = await txnService.fetchTransactions();
    const normalized = data.map(txn => ({
      ...txn,
      date: typeof txn.date === 'string' ? txn.date : txn.date?.$date || txn.date
    }));

    setTransactions(normalized);
  };

  const loadSummary = async () => {
    try {
      const result = await txnService.fetchMonthlySummary();
      setSummary(result);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    }
  };

  useEffect(() => {
    load();
    loadSummary();
  }, []);

  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  const handleNew = async (e) => {
    e.preventDefault();
    await txnService.createTransaction(form);
    setForm({ type: '', category: '', amount: '', note: '', date: '' });
    await load();
    await loadSummary();
  };

  const handleUpdate = async (id, updated) => {
    await txnService.updateTransaction(id, updated);
    await load();
    await loadSummary();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure to want to delete this transaction?");
    if (confirmed) {
      try {
        await txnService.deleteTransaction(id);
      } catch (error) {
        console.error("Failed to delete the transaction : ", error);
      }
    }
    await load();
    await loadSummary();
  };

  const getMonthYear = () => {
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' }); // e.g., "July"
    const year = now.getFullYear(); // e.g., 2025
    return `${month} ${year}`;
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesType = filter.type ? txn.type === filter.type : true;
    const matchesDate = filter.date ? txn.date?.slice(0, 10) === filter.date : true;
    const matchesSearch = filter.search
      ? Object.values(txn).some(val =>
        String(val).toLowerCase().includes(filter.search.toLowerCase())
      )
      : true;

    return matchesType && matchesDate && matchesSearch;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="dashboard px-8 py-5 max-w-[600px] mx-auto font-sans">
      <h1 className="summary-title text-center text-xl mb-2 text-gray-800 font-bold">
        Transactions Summary of {getMonthYear()}
      </h1>

      <div className="monthly-summary flex justify-between items-center gap-8 flex-wrap my-8">
        <div className="summary-circle income w-[180px] h-[180px] rounded-full flex flex-col justify-center items-center text-white font-bold shadow-md transition-transform duration-300 hover:scale-105 bg-gradient-to-br from-teal-600 to-teal-500">
          <div className="summary-label text-lg mb-2 opacity-95">Income</div>
          <div className="summary-amount text-4xl">₹{summary.income.toFixed(2)}</div>
        </div>
        <div className="summary-circle expense w-[180px] h-[180px] rounded-full flex flex-col justify-center items-center text-white font-bold shadow-md transition-transform duration-300 hover:scale-105 bg-gradient-to-br from-red-500 to-red-400">
          <div className="summary-label text-lg mb-2 opacity-95">Expense</div>
          <div className="summary-amount text-4xl">₹{summary.expense.toFixed(2)}</div>
        </div>
      </div>

      <h1 className="text-2xl py-4 font-bold mb-6 text-gray-800">Add a new Transaction</h1>

      <form
        onSubmit={handleNew}
        className="create-form grid grid-cols-2 gap-x-4 gap-y-4 max-w-[600px] mx-auto mb-8"
      >
        <select
          name="type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="col-span-1 p-2 text-sm border border-gray-300 rounded h-10 w-full appearance-none"
          required
        >
          <option value="" disabled>
            --select transaction type--
          </option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
          className="col-span-1 p-2 text-sm border border-gray-300 rounded h-10 w-full"
        />

        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
          className="col-span-1 p-2 text-sm border border-gray-300 rounded h-10 w-full"
        />

        <input
          name="date"
          type="date"
          placeholder="Select Date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
          className="col-span-1 p-2 text-sm border border-gray-300 rounded h-10 w-full"
        />

        <input
          name="note"
          placeholder="Note (optional)"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="col-span-2 p-2 text-sm border border-gray-300 rounded h-10 w-full"
        />

        <button
          type="submit"
          className="col-span-2 mx-auto px-6 py-2 bg-[#2876a7] text-white rounded hover:bg-[#215188] transition font-medium text-base cursor-pointer"
        >
          Add
        </button>
      </form>

      <h1 className="text-2xl py-4 font-bold mb-4 text-gray-800">Recent Transactions</h1>

      <div className="filter-section flex flex-wrap gap-4 mb-8">
        <select
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          className="flex-1 min-w-[200px] p-2 border border-gray-300 rounded text-base"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="date"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          className="flex-1 min-w-[200px] p-2 border border-gray-300 rounded text-base"
        />

        <input
          type="text"
          placeholder="Search by category, note..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className="flex-1 min-w-[200px] p-2 border border-gray-300 rounded text-base"
        />
      </div>

      <div className="list flex flex-col gap-4">
        {paginatedTransactions.map((txn) => (
          <Transaction
            key={txn._id}
            txn={txn}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="flex items-center">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
