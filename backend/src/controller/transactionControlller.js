import Transaction from '../model/Transaction.js';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import fs from 'fs';
import xlsx from 'xlsx';
dayjs.extend(customParseFormat);

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

    if (type && !['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be income or expense' });
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
    res.status(500).json({ message: 'Error while updating document' });
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

//Add the utc time to last hour minute.
// Now it is taking as starting time take last time, so 5.5 hours will be deducted and exact date will come
export const extractTransactionsFromUpload = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const supportedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (!supportedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: 'Only Excel (.xls, .xlsx) files are supported' });
    }

    const workbook = xlsx.readFile(file.path, { cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: '' });

    const pad = (num) => String(num).padStart(2, '0');

    const transactions = jsonData.map((row, index) => {
      const { type, category, amount, date, note } = row;

      if (!type || !category || !amount || !date) {
        throw new Error(`Missing data in row ${index + 2}`);
      }

      let yyyy, mm, dd;

      if (typeof date === 'number') {
        const dt = xlsx.SSF.parse_date_code(date);
        if (!dt || !dt.y || !dt.m || !dt.d) {
          throw new Error(`Invalid Excel date at row ${index + 2}`);
        }
        yyyy = dt.y;
        mm = dt.m;
        dd = dt.d;
      } else if (date instanceof Date) {
        yyyy = date.getFullYear();
        mm = date.getMonth() + 1;
        dd = date.getDate();
      } else if (typeof date === 'string') {
        let parts;
        if (date.includes('-')) parts = date.split('-');
        else if (date.includes('/')) parts = date.split('/');
        else throw new Error(`Invalid date string format at row ${index + 2}`);

        if (parts[0].length === 4) {
          yyyy = Number(parts[0]);
          mm = Number(parts[1]);
          dd = Number(parts[2]);
        } else {
          dd = Number(parts[0]);
          mm = Number(parts[1]);
          yyyy = Number(parts[2]);
        }
        if (isNaN(yyyy) || isNaN(mm) || isNaN(dd)) {
          throw new Error(`Invalid date numbers at row ${index + 2}`);
        }
      } else {
        throw new Error(`Unsupported date format at row ${index + 2}`);
      }

      const dateObj = new Date(yyyy, mm - 1, dd);
      dateObj.setDate(dateObj.getDate() + 1);

      const fixedYear = dateObj.getFullYear();
      const fixedMonth = dateObj.getMonth() + 1;
      const fixedDay = dateObj.getDate();

      const formattedDate = `${fixedYear}-${pad(fixedMonth)}-${pad(fixedDay)}`;

      return {
        type: type.toString().trim().toLowerCase(),
        category: category.toString().trim(),
        amount: parseFloat(amount),
        date: formattedDate,
        note: note ? note.toString().trim() : '',
      };
    });

    fs.unlinkSync(file.path);
    res.json({ data: transactions });
  } catch (error) {
    console.error('Excel File processing failed:', error);
    res.status(500).json({ error: error.message || 'Failed to process Excel file' });
  }
};
