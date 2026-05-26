import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWeather, setForecast, setLoading, setError } from '../redux/slices/weatherSlice';
import { weatherApi, locationApi, getUserLocation } from '../services/api';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import Forecast from '../components/Forecast';
import WeatherChart from '../components/WeatherChart';
import SavedLocations from '../components/SavedLocations';
import Analytics from '../components/Analytics';
import WeatherAlerts from '../components/WeatherAlerts';
import HistoricalData from '../components/HistoricalData';
import { MapPin, BookmarkPlus } from 'lucide-react';
import useWeatherTheme from '../hooks/useWeatherTheme';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { current, forecast, loading, error } = useSelector((state) => state.weather);
  const { token } = useSelector((state) => state.auth);

  const [isCelsius, setIsCelsius] = useState(true);
  const theme = useWeatherTheme(current?.weather[0]?.main);

  useEffect(() => {
    handleAutoLocation();
  }, []);

  const handleAutoLocation = async () => {
    try {
      const coords = await getUserLocation();
      fetchWeatherData(coords);
    } catch (err) {
      console.error('Auto-location failed', err);
    }
  };

  const fetchWeatherData = async (params) => {
    try {
      dispatch(setLoading());
      const [weatherRes, forecastRes] = await Promise.all([
        weatherApi.getCurrentWeather(params),
        weatherApi.getForecast(params)
      ]);
      dispatch(setWeather(weatherRes.data));
      dispatch(setForecast(forecastRes.data));
    } catch (err) {
      dispatch(setError('Error fetching weather data. Please check your API key or connection.'));
    }
  };

  const handleSearch = (city) => {
    fetchWeatherData({ city });
  };

  const handleSaveLocation = async () => {
    if (!current) return;
    try {
      await locationApi.saveLocation({
        cityName: current.name,
        latitude: current.coord.lat,
        longitude: current.coord.lon
      });
      alert('Location saved to favorites!');
    } catch (err) {
      console.error('Failed to save location', err);
    }
  };

  return (
    <div className={'min-h-screen transition-colors duration-500 ' + theme + ' p-8'}>
      <div className='max-w-6xl mx-auto'>
        <div className='flex gap-4 mb-8 justify-center items-center'>
          <SearchBar onSearch={handleSearch} />
          <button
            onClick={() => setIsCelsius(!isCelsius)}
            className='p-2 bg-white rounded shadow hover:bg-gray-50 font-bold'
          >
            {isCelsius ? '°C' : '°F'}
          </button>
          <button
            onClick={handleAutoLocation}
            title='Current Location'
            className='p-2 bg-white rounded shadow hover:bg-gray-50'
          >
            <MapPin className='text-blue-500' />
          </button>
        </div>

        {loading && (
          <div className='text-center text-blue-600 font-bold mb-4 animate-pulse'>
            Loading Weather Data...
          </div>
        )}

        {error && (
          <div className='text-center text-red-500 font-bold mb-4'>
            {error}
          </div>
        )}

        {current && (
          <div className='space-y-8'>
            <WeatherAlerts condition={current.weather[0].main} />

            <div className='relative max-w-md mx-auto'>
              <CurrentWeather weather={current} isCelsius={isCelsius} />
              {token && (
                <button
                  onClick={handleSaveLocation}
                  title='Save Location'
                  className='absolute top-4 right-4 p-2 bg-white rounded-full shadow hover:bg-blue-50'
                >
                  <BookmarkPlus className='text-blue-500' />
                </button>
              )}
            </div>

            <WeatherChart forecast={forecast} isCelsius={isCelsius} />

            <Forecast forecast={forecast} isCelsius={isCelsius} />

            <div className='grid md:grid-cols-3 gap-8'>
              <SavedLocations onSelectLocation={handleSearch} />
              <Analytics />
              <HistoricalData city={current.name} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
