import Transaction from '../model/Transaction.js';
import dayjs from 'dayjs';

export const addTransaction = async (req, res) => {
  const { type, amount, category, date } = req.body;

  if (!type || !amount || !category || !date) {
    return res.status(400).json({ message: 'Type, amount, date and category are required' });
  }

  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ message: 'Type must be income or expense' });
  }

  try {
    const txn = await Transaction.create({ ...req.body, user: req.user._id });
    res.status(201).json(txn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const txns = await Transaction.find({ user: req.user._id }).sort('-date');
    res.json(txns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const editTransaction = async (req, res) => {
  try {
    const { type, amount, category, note } = req.body;

    if(type && !['income', 'expense'].includes(type)){
      return res.status(400).json({message: 'Type must be income or expense'});
    }

    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { type, amount, category, note } },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(updated);

  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error while updating document'});
  }
}

export const deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) return res.status(404).json({ message: 'Transaction not found' });

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const startOfMonth = dayjs().startOf('month').toDate();
    const endOfMonth = dayjs().endOf('month').toDate();

    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const summary = transactions.reduce(
      (acc, txn) => {
        if (txn.type === 'income') {
          acc.income += txn.amount;
        } else if (txn.type === 'expense') {
          acc.expense += txn.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server error' });
  }
};
