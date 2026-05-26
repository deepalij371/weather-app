import React from 'react';

const Forecast = ({ forecast, isCelsius, theme }) => {
  if (!forecast) return null;

  const convertTemp = (temp) => isCelsius ? Math.round(temp) : Math.round((temp * 9/5) + 32);
  // Pick one forecast per day (every 8th item representing a 24h jump)
  const daily = forecast.list.filter((_, i) => i % 8 === 0).slice(0, 5);

  const cardStyle = theme?.cardBg || 'bg-white text-slate-800 shadow-md';
  const textSecondary = theme?.textSecondary || 'text-slate-500';

  return (
    <div className='mt-12 w-full max-w-4xl mx-auto'>
      <h3 className='text-3xl font-extrabold mb-8 text-center tracking-tight'>5-Day Extended Forecast</h3>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5'>
        {daily.map((item, i) => (
          <div 
            key={i} 
            className={`p-6 rounded-2xl text-center transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ${cardStyle}`}
          >
            <p className='font-bold text-lg mb-2'>
              {new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
            <p className={`text-xs font-light tracking-wide mb-3 ${textSecondary}`}>
              {new Date(item.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            
            <div className="relative inline-block my-2">
              <img 
                src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} 
                alt='weather icon' 
                className='mx-auto w-16 h-16' 
              />
            </div>
            
            <p className='text-2xl font-extrabold mt-2'>
              {convertTemp(item.main.temp)}°
            </p>
            <p className={`text-xs capitalize font-medium mt-1 truncate ${textSecondary}`}>
              {item.weather[0].main}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
