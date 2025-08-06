import React, { useState, useEffect } from 'react';
import * as txnService from '../services/transactionService';
import Transaction from './TransactionList';
import useNotifier from '../hooks/useNotifier';
import { ToastContainer } from 'react-toastify';
import { uploadAndExtractTransactions } from '../services/transactionService';

const DashboardContent = ({ transactions, summary, refreshData }) => {
  const [form, setForm] = useState({
    type: 'income',
    category: '',
    amount: '',
    date: '',
    note: ''
  });

  const [filter, setFilter] = useState({
    type: '',
    date: '',
    search: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const [uploadFile, setUploadFile] = useState(null);
  const [extractedData, setExtractedData] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);

  const { notifySuccess, notifyError, notifyWarning } = useNotifier();

  const handleNew = async (e) => {
    e.preventDefault();

    if (!form.type || !form.category || !form.amount || !form.date) {
      notifyWarning("Please fill all the required fields!");
      return;
    }

    try {
      await txnService.createTransaction(form);
      notifySuccess("Transaction added!")
      setForm({ type: 'income', category: '', amount: '', note: '', date: '' });
      await refreshData();
    } catch (error) {
      notifyError("Failed to add transaction!");
      console.error("Failed to create transaction:", error);
    }
  };

  const handleUpdate = async (id, updated) => {
    try {
      await txnService.updateTransaction(id, updated);
      await refreshData();
    } catch (error) {
      console.error("Failed to update transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirmed) return;

    try {
      await txnService.deleteTransaction(id);
      await refreshData();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const getMonthYear = () => {
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
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

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
  };

    const handleUpload = async () => {
    if (!uploadFile) {
      notifyWarning("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const response = await uploadAndExtractTransactions(formData);
      setExtractedData(response.data);
      setPreviewMode(true);
      setUploadFile(null); // Reset file after successful upload
      document.getElementById("fileInput").value = ""; // Reset file input
    } catch (error) {
      notifyError("Failed to extract data.");
      console.error('Error extracting file', error);
    }
  };

  const handleConfirmUpload = async () => {
    try {
      for (const txn of extractedData) {
        await txnService.createTransaction(txn);
      }
      notifySuccess("Transactions saved!");
      setPreviewMode(false);
      setUploadFile(null);
      setExtractedData([]);
      await refreshData();
    } catch (err) {
      notifyError("Error saving transactions.");
      console.error(err);
    }
  };

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

      <div className="mt-10">
        <h2 className="text-lg font-bold mb-2">Upload Transaction File (Excel file)</h2>
        <input
          type="file"
          id="fileInput"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="mb-2"
        />
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Extract Transactions
        </button>
      </div>

      {previewMode && (
        <div className="mt-6 border p-4 rounded bg-gray-50">
          <h4 className="font-bold mb-4 text-lg">Preview Extracted Transactions</h4>
          <table className="w-full text-sm table-auto border-collapse mb-4">
            <thead>
              <tr className="bg-gray-200">
                <th>Type</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {extractedData.map((txn, idx) => (
                <tr key={idx}>
                  {['type', 'category', 'amount', 'date', 'note'].map((field) => (
                    <td key={field}>
                      <input
                        value={txn[field]}
                        onChange={(e) => {
                          const updated = [...extractedData];
                          updated[idx][field] = e.target.value;
                          setExtractedData(updated);
                        }}
                        className="w-full border border-gray-300 p-1"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-4">
            <button
              onClick={handleConfirmUpload}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Confirm and Save
            </button>
            <button
              onClick={() => setPreviewMode(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default DashboardContent;
