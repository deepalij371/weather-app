import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const convertTemp = (temp, isCelsius) => isCelsius ? temp : (temp * 9 / 5) + 32;

const WeatherChart = ({ forecast, isCelsius, theme }) => {
  if (!forecast) return null;

  const unit          = isCelsius ? '\u00B0C' : '\u00B0F';
  const hourly        = forecast.list.slice(0, 8);
  const labels        = hourly.map(item =>
    new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const temps         = hourly.map(item => Math.round(convertTemp(item.main.temp, isCelsius)));
  const humidityData  = hourly.map(item => item.main.humidity);

  const data = {
    labels,
    datasets: [
      {
        label: `Temp (${unit})`,
        data: temps,
        fill: true,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
          gradient.addColorStop(0,   'rgba(99, 102, 241, 0.35)');
          gradient.addColorStop(0.6, 'rgba(99, 102, 241, 0.08)');
          gradient.addColorStop(1,   'rgba(99, 102, 241, 0.00)');
          return gradient;
        },
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2.5,
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        pointBorderColor: 'rgba(255,255,255,0.8)',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#a78bfa',
        pointHoverBorderColor: '#ffffff',
        tension: 0.45,
        yAxisID: 'y',
      },
      {
        label: 'Humidity (%)',
        data: humidityData,
        fill: false,
        borderColor: 'rgba(34, 211, 238, 0.6)',
        borderWidth: 1.5,
        borderDash: [5, 4],
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgba(34,211,238,0.8)',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: 'rgba(255,255,255,0.55)',
          font: { family: 'Outfit', size: 11, weight: '600' },
          boxWidth: 12,
          boxHeight: 3,
          borderRadius: 2,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(8,12,30,0.92)',
        titleColor: 'rgba(255,255,255,0.7)',
        bodyColor: '#ffffff',
        titleFont: { family: 'Outfit', size: 12 },
        bodyFont:  { family: 'Outfit', size: 14, weight: '700' },
        padding: 14,
        cornerRadius: 14,
        displayColors: true,
        borderColor: 'rgba(99,102,241,0.3)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid:  { color: 'rgba(255,255,255,0.05)', drawBorder: false },
        ticks: { color: 'rgba(255,255,255,0.45)', font: { family: 'Outfit', size: 11 } },
        border: { display: false },
      },
      y: {
        position: 'left',
        grid:  { color: 'rgba(255,255,255,0.06)', drawBorder: false },
        ticks: {
          color: 'rgba(139,92,246,0.8)',
          font: { family: 'Outfit', size: 11, weight: '600' },
          callback: (v) => `${v}${unit}`,
        },
        border: { display: false },
      },
      y1: {
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: {
          color: 'rgba(34,211,238,0.6)',
          font: { family: 'Outfit', size: 11 },
          callback: (v) => `${v}%`,
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className='glass-card p-6 md:p-8 w-full'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <div className='h-5 w-1 rounded-full'
            style={{ background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }} />
          <h4 className='text-xl font-black text-white tracking-tight'>Hourly Trend</h4>
          <span className='text-xs font-medium text-white/30'>Next 24 hours</span>
        </div>
        <div className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl'
          style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <TrendingUp size={13} className='text-indigo-400' />
          <span className='text-xs font-bold text-indigo-300'>Live</span>
        </div>
      </div>

      {/* Chart */}
      <div className='h-64 md:h-80 w-full'>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default WeatherChart;
