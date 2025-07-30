import React, { useState } from 'react';

const Transaction = ({ txn, onUpdate, onDelete }) => {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        type: txn.type,
        amount: txn.amount,
        category: txn.category,
        date: txn.date,
        note: txn.note || ''
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(txn._id, form);
        setEditing(false);
    };

    return (
        <div
            className={`w-full h-16 flex items-center justify-between bg-white rounded-md shadow-sm border-l-4 px-4 ${txn.type === 'expense' ? 'border-l-[#e76f51]' : 'border-l-[#2a9d8f]'
                }`}
        >
            {editing ? (
                <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full">
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded min-w-[100px]"
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>

                    <input
                        name="amount"
                        type="number"
                        value={form.amount}
                        onChange={handleChange}
                        required
                        className="p-2 border border-gray-300 rounded min-w-[100px]"
                    />

                    <input
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        className="p-2 border border-gray-300 rounded min-w-[120px]"
                    />

                    <input
                        name="note"
                        value={form.note}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded min-w-[150px]"
                    />

                    <button
                        type="submit"
                        className="bg-[#264653] text-white px-3 py-1 rounded hover:bg-[#1e3e4c] transition"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                    >
                        Cancel
                    </button>
                </form>
            ) : (
                <>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                            {txn.category}: ₹{txn.amount} ({txn.type})
                        </p>
                        {txn.note && (
                            <small className="text-gray-600 text-sm block truncate">
                                Note: {txn.note}
                            </small>
                        )}
                        <p className="text-xs text-gray-500">
                            {new Date(txn.date).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </p>
                    </div>

                    <div className="flex gap-2 ml-4 flex-shrink-0">
                        <button
                            onClick={() => setEditing(true)}
                            className="bg-[#457b9d] text-white px-3 py-1 rounded hover:bg-[#3b6b8c] transition whitespace-nowrap"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(txn._id)}
                            className="bg-[#e63946] text-white px-3 py-1 rounded hover:bg-[#d62839] transition whitespace-nowrap"
                        >
                            Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Transaction;
