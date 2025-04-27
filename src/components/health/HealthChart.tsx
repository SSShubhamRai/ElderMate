import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { HealthData } from '../../mocks/healthData';

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

interface HealthChartProps {
  data: HealthData[];
  metric: 'heartRate' | 'bloodPressureSystolic' | 'bloodPressureDiastolic' | 'temperature' | 'oxygenLevel' | 'glucoseLevel';
  title: string;
  color: string;
  rangeMin?: number;
  rangeMax?: number;
}

const HealthChart: React.FC<HealthChartProps> = ({ 
  data, 
  metric, 
  title, 
  color, 
  rangeMin, 
  rangeMax 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse h-64">
        <div className="h-4 bg-neutral-200 rounded w-1/3 mb-8"></div>
        <div className="h-40 bg-neutral-100 rounded"></div>
      </div>
    );
  }

  // Sort data by timestamp
  const sortedData = [...data].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Prepare chart data
  const labels = sortedData.map(d => format(new Date(d.timestamp), 'HH:mm'));
  const values = sortedData.map(d => d[metric]);

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        borderColor: color,
        backgroundColor: `${color}20`,
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
        callbacks: {
          title: (items: any) => {
            if (!items.length) return '';
            const index = items[0].dataIndex;
            return format(new Date(sortedData[index].timestamp), 'MMM d, yyyy HH:mm');
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#f5f5f5',
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        },
      },
      y: {
        min: rangeMin,
        max: rangeMax,
        grid: {
          color: '#f5f5f5',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="font-medium text-neutral-900 mb-4">{title} Trends</h3>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default HealthChart;