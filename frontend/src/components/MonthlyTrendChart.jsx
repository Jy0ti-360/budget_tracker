import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { getMonthlyTrend } from '../services/analyticsService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MonthlyTrendChart = ({ months = 12 }) => {
  const [trend, setTrend] = useState({ labels: [], income: [], expense: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMonthlyTrend(months);
        setTrend(data);
      } catch (err) {
        console.error('Failed to fetch monthly trend:', err);
      }
    };

    fetchData();
  }, [months]);

  const data = {
    labels: trend.labels.map(label => {
      const [year, month] = label.split('-');
      return new Date(year, month - 1).toLocaleString('default', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: 'Income',
        data: trend.income,
        borderColor: '#14b8a6',
        backgroundColor: '#14b8a625',
        fill: true,
      },
      {
        label: 'Expense',
        data: trend.expense,
        borderColor: '#ef4444',
        backgroundColor: '#ef444425',
        fill: true,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return(
    <div>
        <h2 className='text-centre text-2xl font-semibold mt-4 mb-4' >
            Income Vs Expense (last {months} months)
        </h2>
        <Line data={data} options={options} />;
    </div>
  );
};

export default MonthlyTrendChart;
