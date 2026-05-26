import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
const WeatherChart = ({ forecast, isCelsius }) => {
  if (!forecast) return null;
  const convertTemp = (temp) => isCelsius ? temp : (temp * 9/5) + 32;
  const data = {
    labels: forecast.list.slice(0, 8).map(item => new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
    datasets: [{ label: 'Temp', data: forecast.list.slice(0, 8).map(item => convertTemp(item.main.temp)), fill: true, backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgb(59, 130, 246)', tension: 0.4 }]
  };
  return (<div className='bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl mx-auto mt-8'><Line data={data} /></div>);
};
export default WeatherChart;
