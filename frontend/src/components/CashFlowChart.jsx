import React, { useEffect, useState } from 'react';
import { getCashFlow } from '../services/analyticsService';
import { Bar } from 'react-chartjs-2';

const CashFlowChart = ({ range = 'daily', count = 7 }) => {
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
      <h4>Cash Flow Chart ({range})</h4>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default CashFlowChart;
