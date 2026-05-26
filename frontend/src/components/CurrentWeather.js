import React from 'react';
import { Droplets, Wind, Compass, Sun, Eye, Thermometer } from 'lucide-react';

const CurrentWeather = ({ weather, isCelsius, theme }) => {
  if (!weather) return null;

  const convertTemp = (temp) => isCelsius ? Math.round(temp) : Math.round((temp * 9/5) + 32);
  const cardStyle = theme?.cardBg || 'bg-white text-slate-800 shadow-lg';
  const textSecondary = theme?.textSecondary || 'text-slate-500';
  const accentStyle = theme?.accent || 'bg-blue-50 text-blue-800';

  // Format sunrise/sunset
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`p-8 rounded-3xl w-full max-w-xl mx-auto shadow-2xl transition-all duration-500 hover:shadow-3xl ${cardStyle}`}>
      <div className='flex justify-between items-start mb-8'>
        <div>
          <h2 className='text-4xl font-extrabold tracking-tight mb-1'>{weather.name}</h2>
          <p className={`text-lg font-light capitalize tracking-wide ${textSecondary}`}>{weather.weather[0].description}</p>
        </div>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
          <img 
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} 
            alt='weather' 
            className='w-24 h-24 relative transform hover:scale-105 transition-transform duration-300' 
          />
        </div>
      </div>

      <div className='text-7xl font-extrabold tracking-tighter mb-8 text-center flex items-start justify-center gap-1'>
        <span>{convertTemp(weather.main.temp)}</span>
        <span className="text-4xl font-light mt-2 text-white/80">°{isCelsius ? 'C' : 'F'}</span>
      </div>

      <div className='grid grid-cols-2 gap-4 mt-8'>
        <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/20 ${accentStyle}`}>
          <div className="p-3 bg-white/10 rounded-xl"><Droplets className='w-6 h-6' /></div>
          <div>
            <p className={`text-xs uppercase tracking-wider font-semibold ${textSecondary}`}>Humidity</p>
            <p className='text-lg font-bold'>{weather.main.humidity}%</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/20 ${accentStyle}`}>
          <div className="p-3 bg-white/10 rounded-xl"><Wind className='w-6 h-6' /></div>
          <div>
            <p className={`text-xs uppercase tracking-wider font-semibold ${textSecondary}`}>Wind Speed</p>
            <p className='text-lg font-bold'>{weather.wind.speed} m/s</p>
          </div>
        </div>

        <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/20 ${accentStyle}`}>
          <div className="p-3 bg-white/10 rounded-xl"><Thermometer className='w-6 h-6' /></div>
          <div>
            <p className={`text-xs uppercase tracking-wider font-semibold ${textSecondary}`}>Feels Like</p>
            <p className='text-lg font-bold'>{convertTemp(weather.main.feels_like)}°{isCelsius ? 'C' : 'F'}</p>
          </div>
        </div>

        <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/20 ${accentStyle}`}>
          <div className="p-3 bg-white/10 rounded-xl"><Compass className='w-6 h-6' /></div>
          <div>
            <p className={`text-xs uppercase tracking-wider font-semibold ${textSecondary}`}>Pressure</p>
            <p className='text-lg font-bold'>{weather.main.pressure} hPa</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/20 ${accentStyle}`}>
          <div className="p-3 bg-white/10 rounded-xl"><Sun className='w-6 h-6' /></div>
          <div>
            <p className={`text-xs uppercase tracking-wider font-semibold ${textSecondary}`}>Sunrise</p>
            <p className='text-lg font-bold'>{formatTime(weather.sys.sunrise)}</p>
          </div>
        </div>

        <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-white/20 ${accentStyle}`}>
          <div className="p-3 bg-white/10 rounded-xl"><Eye className='w-6 h-6' /></div>
          <div>
            <p className={`text-xs uppercase tracking-wider font-semibold ${textSecondary}`}>Visibility</p>
            <p className='text-lg font-bold'>{Math.round(weather.visibility / 1000)} km</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
