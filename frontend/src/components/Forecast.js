import React from 'react';
import { Droplets } from 'lucide-react';

const convertTemp = (temp, isCelsius) =>
  isCelsius ? Math.round(temp) : Math.round((temp * 9) / 5 + 32);

const formatTemp = (temp, isCelsius) => `${convertTemp(temp, isCelsius)}\u00B0${isCelsius ? 'C' : 'F'}`;

const Forecast = ({ forecast, isCelsius, theme }) => {
  if (!forecast) return null;

  // one reading per day (every 8th = ~24h apart), 5 days
  const daily = forecast.list.filter((_, i) => i % 8 === 0).slice(0, 5);

  return (
    <div className='glass-card p-6 md:p-8 w-full'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-6'>
        <div className='h-5 w-1 rounded-full'
          style={{ background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }} />
        <h3 className='text-xl font-black text-white tracking-tight'>5-Day Forecast</h3>
      </div>

      {/* Horizontal scrollable row */}
      <div className='scroll-row flex gap-4 pb-2'>
        {daily.map((item, i) => {
          const t    = formatTemp(item.main.temp, isCelsius);
          const tMin = formatTemp(item.main.temp_min, isCelsius);
          const tMax = formatTemp(item.main.temp_max, isCelsius);
          const day  = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
          const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const pop  = Math.round((item.pop ?? 0) * 100); // precipitation %

          return (
            <div
              key={i}
              className='glass-card-hover flex-shrink-0 w-36 flex flex-col items-center p-4 cursor-default'
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Day */}
              <p className='text-sm font-black text-white tracking-wider'>{day}</p>
              <p className='text-[11px] text-white/35 font-medium mb-3'>{date}</p>

              {/* Icon */}
              <div className='relative mb-2'>
                <div className='absolute inset-0 bg-amber-400/15 rounded-full blur-lg pointer-events-none' />
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt={item.weather[0].main}
                  className='w-14 h-14 relative drop-shadow-lg'
                />
              </div>

              {/* Condition */}
              <p className='text-[11px] font-semibold text-white/50 capitalize mb-3 text-center leading-tight'>
                {item.weather[0].description}
              </p>

              {/* Temperature */}
              <p className='text-2xl font-black text-white mb-1'>{t}</p>
              <div className='flex gap-2 text-xs font-bold'>
                <span className='text-red-300'>High {tMax}</span>
                <span className='text-blue-300'>Low {tMin}</span>
              </div>

              {/* Precipitation */}
              {pop > 0 && (
                <div className='flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full'
                  style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <Droplets size={10} className='text-blue-400' />
                  <span className='text-[10px] font-bold text-blue-300'>{pop}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;
