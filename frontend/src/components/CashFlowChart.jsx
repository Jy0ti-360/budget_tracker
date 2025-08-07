import React, { useEffect, useState } from 'react';
import { getCashFlow } from '../services/analyticsService';
import { Bar } from 'react-chartjs-2';

const CashFlowChart = ({ range = 'daily', count = 7, onRangeChange, onCountChange }) => {
  const [data, setData] = useState({
    labels: [],
    inflow: [],
    outflow: [],
    net: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCashFlow(range, count);
        if (res && res.data) {
          setData({
            labels: res.data.labels || [],
            inflow: res.data.inflow || [],
            outflow: res.data.outflow || [],
            net: res.data.net || []
          });
        } else {
          console.error('Cash flow response is empty or malformed:', res);
          setData({ labels: [], inflow: [], outflow: [], net: [] });
        }
      } catch (err) {
        console.error('Cash flow error:', err);
        setData({ labels: [], inflow: [], outflow: [], net: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range, count]);

  if (loading) return <p>Loading Cash Flow Chart...</p>;

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Inflow',
        data: data.inflow,
        backgroundColor: '#4caf50',
        stack: 'cash',
      },
      {
        label: 'Outflow',
        data: data.outflow,
        backgroundColor: '#f44336',
        stack: 'cash',
      },
      {
        label: 'Net Flow',
        data: data.net,
        type: 'line',
        borderColor: '#2196f3',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        yAxisID: 'y',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      }
    }
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-semibold mb-4">
        Cash Flow Chart ({range})
      </h2>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
        <select
          value={range}
          onChange={onRangeChange}
          className="border border-gray-300 rounded px-3 py-1"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>

        <input
          type="number"
          value={count}
          onChange={onCountChange}
          className="border border-gray-300 rounded px-3 py-2 w-24"
          min={1}
        />
      </div>

      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default CashFlowChart;
