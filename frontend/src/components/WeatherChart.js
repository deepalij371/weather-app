import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const WeatherChart = ({ forecast, isCelsius, theme }) => {
  if (!forecast) return null;

  const convertTemp = (temp) => isCelsius ? temp : (temp * 9/5) + 32;
  const cardStyle = theme?.cardBg || 'bg-white text-slate-800 shadow-lg';
  const accentColor = 'rgba(59, 130, 246, 1)';
  const fillColor = 'rgba(59, 130, 246, 0.15)';

  const hourlyForecast = forecast.list.slice(0, 8);
  const labels = hourlyForecast.map(item => 
    new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  
  const temps = hourlyForecast.map(item => Math.round(convertTemp(item.main.temp)));

  const data = {
    labels,
    datasets: [
      {
        label: `Temperature (°${isCelsius ? 'C' : 'F'})`,
        data: temps,
        fill: true,
        backgroundColor: fillColor,
        borderColor: accentColor,
        borderWidth: 3,
        pointBackgroundColor: accentColor,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { family: 'Outfit', size: 13 },
        bodyFont: { family: 'Outfit', size: 14, weight: 'bold' },
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: { family: 'Outfit', size: 12 }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: { family: 'Outfit', size: 12 }
        }
      }
    }
  };

  return (
    <div className={`p-6 rounded-3xl w-full max-w-4xl mx-auto mt-8 shadow-2xl transition-all duration-300 ${cardStyle}`}>
      <h4 className="text-xl font-bold mb-4 tracking-tight">Hourly Forecast Trend (Next 24 Hours)</h4>
      <div className="h-64 md:h-80 w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default WeatherChart;
