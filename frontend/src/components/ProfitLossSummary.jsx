import React, { useEffect, useState } from 'react';
import { getProfitLoss } from '../services/analyticsService';

const ProfitLossSummary = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data whenever both dates are valid
  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProfitLoss(startDate, endDate);
        setData(res);
      } catch (err) {
        setError('Failed to load Profit & Loss data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const handleExport = () => {
    if (!data) return;
    const csv = [
      ['Period', 'Income', 'Expenses', 'Net Profit'],
      [data.period, data.income, data.expenses, data.netProfit]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profit_loss_${data.period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto' }}>
      <h3>Profit & Loss Summary</h3>

      <div style={{ marginBottom: '12px' }}>
        <label>
          Start Date:{' '}
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            max={endDate || undefined}
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          End Date:{' '}
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            min={startDate || undefined}
          />
        </label>
      </div>

      {!startDate || !endDate ? (
        <p>Please select both start and end dates.</p>
      ) : loading ? (
        <p>Loading Profit & Loss summary...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : data ? (
        <>
          <table
            border="1"
            cellPadding="8"
            style={{ borderCollapse: 'collapse', width: '100%' }}
          >
            <tbody>
              <tr>
                <td>Period</td>
                <td>{data.period}</td>
              </tr>
              <tr>
                <td>Income</td>
                <td>${data.income.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Expenses</td>
                <td>${data.expenses.toLocaleString()}</td>
              </tr>
              <tr>
                <td>
                  <b>Net Profit</b>
                </td>
                <td>
                  <b>${data.netProfit.toLocaleString()}</b>
                </td>
              </tr>
            </tbody>
          </table>
          <button onClick={handleExport} style={{ marginTop: '10px' }}>
            Export CSV
          </button>
        </>
      ) : null}
    </div>
  );
};

export default ProfitLossSummary;
