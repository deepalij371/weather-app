import React, { useState, useEffect } from 'react';
import { weatherApi } from '../services/api';
import { History } from 'lucide-react';
const HistoricalData = ({ city }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (city) {
      weatherApi.getHistorical(city).then(res => setData(res.data));
    }
  }, [city]);
  if (data.length === 0) return null;
  return (
    <div className='bg-white p-6 rounded-xl shadow-lg w-full mx-auto mt-8'>
      <h3 className='text-xl font-bold mb-4 flex items-center gap-2'><History className='text-blue-500' /> Historical Trends (Simulated)</h3>
      <div className='space-y-2'>
        {data.map((d, i) => (
          <div key={i} className='flex justify-between border-b pb-1'>
            <span>{new Date(d.date).toLocaleDateString()}</span>
            <span className='font-bold'>{Math.round(d.temp)}°C</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default HistoricalData;
