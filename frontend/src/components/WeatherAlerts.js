import React from 'react';
import { AlertTriangle } from 'lucide-react';
const WeatherAlerts = ({ condition }) => {
  const alerts = [];
  if (condition?.toLowerCase().includes('rain')) alerts.push('Heavy rain expected. Take an umbrella!');
  if (condition?.toLowerCase().includes('thunder')) alerts.push('Thunderstorm warning in your area.');
  if (alerts.length === 0) return null;
  return (
    <div className='bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded shadow-sm'>
      <div className='flex items-center gap-2 text-red-700 font-bold mb-2'>
        <AlertTriangle size={20} /> Weather Alerts
      </div>
      <ul className='list-disc list-inside text-red-600'>
        {alerts.map((a, i) => <li key={i}>{a}</li>)}
      </ul>
    </div>
  );
};
export default WeatherAlerts;
