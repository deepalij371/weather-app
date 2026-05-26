import React from 'react';
import { Droplets, Wind, Thermometer, Sun } from 'lucide-react';

const CurrentWeather = ({ weather, isCelsius }) => {
  if (!weather) return null;

  const convertTemp = (temp) => {
    if (isCelsius) return Math.round(temp);
    return Math.round((temp * 9/5) + 32);
  };

  const convertWind = (speed) => {
    if (isCelsius) return speed + ' m/s';
    return (speed * 2.237).toFixed(1) + ' mph';
  };

  return (
    <div className='bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-3xl font-bold'>{weather.name}</h2>
          <p className='text-gray-500 capitalize'>{weather.weather[0].description}</p>
        </div>
        <img
          src={'http://openweathermap.org/img/wn/' + weather.weather[0].icon + '@2x.png'}
          alt='weather icon'
          className='w-20 h-20'
        />
      </div>

      <div className='text-6xl font-bold mb-8 text-center'>
        {convertTemp(weather.main.temp)}°{isCelsius ? 'C' : 'F'}
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='flex items-center gap-3 p-3 bg-blue-50 rounded-lg'>
          <Droplets className='text-blue-500' />
          <div>
            <p className='text-sm text-gray-500'>Humidity</p>
            <p className='font-semibold'>{weather.main.humidity}%</p>
          </div>
        </div>
        <div className='flex items-center gap-3 p-3 bg-green-50 rounded-lg'>
          <Wind className='text-green-500' />
          <div>
            <p className='text-sm text-gray-500'>Wind</p>
            <p className='font-semibold'>{convertWind(weather.wind.speed)}</p>
          </div>
        </div>
        <div className='flex items-center gap-3 p-3 bg-orange-50 rounded-lg'>
          <Thermometer className='text-orange-500' />
          <div>
            <p className='text-sm text-gray-500'>Feels Like</p>
            <p className='font-semibold'>{convertTemp(weather.main.feels_like)}°</p>
          </div>
        </div>
        <div className='flex items-center gap-3 p-3 bg-yellow-50 rounded-lg'>
          <Sun className='text-yellow-500' />
          <div>
            <p className='text-sm text-gray-500'>UV Index</p>
            <p className='font-semibold'>{weather.uvi || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
