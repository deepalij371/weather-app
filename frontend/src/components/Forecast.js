import React from 'react';
const Forecast = ({ forecast, isCelsius }) => {
  if (!forecast) return null;
  const convertTemp = (temp) => isCelsius ? Math.round(temp) : Math.round((temp * 9/5) + 32);
  const daily = forecast.list.filter((_, i) => i % 8 === 0);
  return (
    <div className='mt-12 w-full max-w-4xl mx-auto'>
      <h3 className='text-2xl font-bold mb-6 text-center'>5-Day Forecast</h3>
      <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
        {daily.map((item, i) => (
          <div key={i} className='bg-white p-4 rounded-lg shadow text-center'>
            <p className='font-semibold'>{new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <img src={'http://openweathermap.org/img/wn/' + item.weather[0].icon + '.png'} alt='weather' className='mx-auto' />
            <p className='text-xl font-bold'>{convertTemp(item.main.temp)}°{isCelsius ? 'C' : 'F'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Forecast;
