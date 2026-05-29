import React from 'react';
import { Droplets, Wind, Thermometer, Gauge, Eye, Sunrise, Sunset, ArrowUp, ArrowDown } from 'lucide-react';

const convertTemp = (temp, isCelsius) =>
  isCelsius ? Math.round(temp) : Math.round((temp * 9) / 5 + 32);

const formatTemp = (temp, isCelsius) => `${convertTemp(temp, isCelsius)}\u00B0${isCelsius ? 'C' : 'F'}`;

const formatTime = (ts) =>
  new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const StatTile = ({ icon: Icon, iconColor, label, value }) => (
  <div className='stat-card flex items-center gap-3'>
    <div className='flex-shrink-0 p-2.5 rounded-xl' style={{ background: 'rgba(255,255,255,0.08)' }}>
      <Icon size={18} className={iconColor} />
    </div>
    <div className='min-w-0'>
      <p className='text-[11px] uppercase tracking-widest font-bold text-white/35 mb-0.5'>{label}</p>
      <p className='text-base font-bold text-white truncate'>{value}</p>
    </div>
  </div>
);

const CurrentWeather = ({ weather, isCelsius, theme }) => {
  if (!weather) return null;

  const temp     = convertTemp(weather.main.temp, isCelsius);
  const tempMin  = formatTemp(weather.main.temp_min, isCelsius);
  const tempMax  = formatTemp(weather.main.temp_max, isCelsius);
  const unit     = isCelsius ? '\u00B0C' : '\u00B0F';
  const desc     = weather.weather[0].description;
  const icon     = weather.weather[0].icon;

  const stats = [
    { icon: Droplets,    iconColor: 'text-cyan-400',   label: 'Humidity',    value: `${weather.main.humidity}%` },
    { icon: Wind,        iconColor: 'text-teal-400',   label: 'Wind',        value: `${weather.wind.speed} m/s` },
    { icon: Thermometer, iconColor: 'text-orange-400', label: 'Feels Like',  value: formatTemp(weather.main.feels_like, isCelsius) },
    { icon: Gauge,       iconColor: 'text-violet-400', label: 'Pressure',    value: `${weather.main.pressure} hPa` },
    { icon: Eye,         iconColor: 'text-sky-400',    label: 'Visibility',  value: `${Math.round(weather.visibility / 1000)} km` },
    { icon: Sunrise,     iconColor: 'text-amber-400',  label: 'Sunrise',     value: formatTime(weather.sys.sunrise) },
    { icon: Sunset,      iconColor: 'text-rose-400',   label: 'Sunset',      value: formatTime(weather.sys.sunset) },
    { icon: Droplets,    iconColor: 'text-blue-300',   label: 'Cloud Cover', value: `${weather.clouds?.all ?? 0}%` },
  ];

  return (
    <div className='glass-card overflow-hidden w-full'>
      {/* Top gradient accent */}
      <div className='absolute top-0 left-0 right-0 h-0.5'
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.8), rgba(139,92,246,0.6), transparent)' }} />

      {/* Ambient glow behind icon */}
      <div className='absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none'
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

      <div className='p-6 md:p-8'>
        {/* Header row */}
        <div className='flex justify-between items-start mb-4'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <span className='text-xs font-bold uppercase tracking-widest text-white/40'>
                {weather.sys.country}
              </span>
              <span className='w-1 h-1 rounded-full bg-white/20' />
              <span className='text-xs font-medium text-white/30'>
                {weather.coord.lat.toFixed(2)} N, {weather.coord.lon.toFixed(2)} E
              </span>
            </div>
            <h2 className='text-4xl md:text-5xl font-black tracking-tight text-white'>{weather.name}</h2>
            <p className='text-lg capitalize text-white/55 font-medium mt-1'>{desc}</p>
          </div>

          {/* Weather icon */}
          <div className='flex-shrink-0 relative'>
            <div className='absolute inset-0 bg-amber-400/20 rounded-full blur-2xl animate-glow-pulse pointer-events-none' />
            <img
              src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
              alt={desc}
              className='w-24 h-24 md:w-28 md:h-28 relative animate-weather-icon drop-shadow-2xl'
            />
          </div>
        </div>

        {/* Temperature */}
        <div className='flex items-end gap-4 mb-3'>
          <div className='flex items-start gap-1'>
            <span className='text-8xl md:text-9xl font-black text-white tracking-tighter leading-none'>
              {temp}
            </span>
            <span className='text-3xl font-bold text-white/50 mt-3'>{unit}</span>
          </div>
          <div className='flex flex-col gap-1.5 pb-2'>
            <div className='flex items-center gap-1.5 text-sm font-bold text-red-300'>
              <ArrowUp size={14} className='text-red-400' />
              <span>{tempMax}</span>
            </div>
            <div className='flex items-center gap-1.5 text-sm font-bold text-blue-300'>
              <ArrowDown size={14} className='text-blue-400' />
              <span>{tempMin}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='h-px my-6' style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />

        {/* Stats grid */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
          {stats.map(s => (
            <StatTile key={s.label} {...s} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
