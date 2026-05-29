import React, { useState, useEffect } from 'react';

const LiveClock = ({ className = '' }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours   = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');
  const day     = time.toLocaleDateString('en-US', { weekday: 'long' });
  const date    = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className={`flex flex-col items-end ${className}`}>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black tracking-tight text-white tabular-nums">
          {hours}:{minutes}
        </span>
        <span className="text-sm font-bold text-white/50 tabular-nums animate-live-dot">
          :{seconds}
        </span>
      </div>
      <p className="text-xs text-white/40 font-medium tracking-wide">{day}, {date}</p>
    </div>
  );
};

export default LiveClock;
