import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3 } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/weather/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching search stats:', error);
      }
    };
    fetchStats();
  }, []);

  const entries = Object.entries(stats);
  if (entries.length === 0) return null;

  const sortedEntries = entries.sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className='bg-white p-6 rounded-xl shadow-lg w-full mx-auto mt-8'>
      <h3 className='text-xl font-bold mb-4 flex items-center gap-2'>
        <BarChart3 className='text-green-500' /> Most Searched Cities
      </h3>
      <div className='space-y-2'>
        {sortedEntries.map(([city, count]) => (
          <div key={city} className='flex justify-between items-center'>
            <span className='capitalize'>{city}</span>
            <span className='bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold'>
              {count} searches
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
