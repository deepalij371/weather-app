import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWeather, setForecast, setLoading, setError } from '../redux/slices/weatherSlice';
import { weatherApi, locationApi, getUserLocation } from '../services/api';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import Forecast from '../components/Forecast';
import WeatherChart from '../components/WeatherChart';
import SavedLocations from '../components/SavedLocations';
import { MapPin, BookmarkPlus, Compass, AlertCircle, RefreshCw } from 'lucide-react';
import useWeatherTheme from '../hooks/useWeatherTheme';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { current, forecast, loading, error } = useSelector((state) => state.weather);
  const { token } = useSelector((state) => state.auth);
  
  const [isCelsius, setIsCelsius] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [savingLocation, setSavingLocation] = useState(false);

  const theme = useWeatherTheme(current?.weather[0]?.main);

  const fetchWeatherAndForecast = useCallback(async (params) => {
    dispatch(setLoading());
    try {
      const [w, f] = await Promise.all([
        weatherApi.getCurrentWeather(params),
        weatherApi.getForecast(params)
      ]);
      dispatch(setWeather(w.data));
      dispatch(setForecast(f.data));
    } catch (e) {
      const message = e.response?.data?.message || 'City not found. Please try another name.';
      dispatch(setError(message));
    }
  }, [dispatch]);

  const handleAuto = useCallback(async () => {
    dispatch(setLoading());
    try {
      const coords = await getUserLocation();
      fetchWeatherAndForecast(coords);
    } catch (e) {
      // Default fallback search: London
      fetchWeatherAndForecast({ city: 'London' });
    }
  }, [dispatch, fetchWeatherAndForecast]);

  useEffect(() => {
    handleAuto();
  }, [handleAuto]);

  const handleSaveLocation = async () => {
    if (!current) return;
    setSavingLocation(true);
    try {
      await locationApi.saveLocation({
        cityName: current.name,
        latitude: current.coord.lat,
        longitude: current.coord.lon
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (e) {
      console.error('Failed to save location', e);
    } finally {
      setSavingLocation(false);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${theme.background} p-4 md:p-8 font-sans pb-16`}>
      <div className='max-w-5xl mx-auto'>
        {/* Top interactive panel */}
        <div className='flex flex-col md:flex-row gap-4 mb-10 items-center justify-between bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-lg'>
          <div className="w-full md:w-auto">
            <SearchBar onSearch={(city) => fetchWeatherAndForecast({ city })} theme={theme} />
          </div>
          
          <div className='flex gap-3 items-center justify-end w-full md:w-auto'>
            {/* Unit toggle */}
            <button 
              onClick={() => setIsCelsius(!isCelsius)} 
              className={`px-5 py-3 rounded-2xl font-bold transition-all duration-300 border border-white/20 flex items-center gap-1 shadow-md hover:scale-105 ${theme.cardBg}`}
            >
              <span>Unit:</span>
              <span className="text-blue-400 font-extrabold">{isCelsius ? '°C' : '°F'}</span>
            </button>
            
            {/* Geolocation Button */}
            <button 
              onClick={handleAuto} 
              className={`p-3 rounded-2xl transition-all duration-300 border border-white/20 shadow-md hover:scale-105 hover:rotate-12 ${theme.cardBg}`}
              title="Detect my current location"
            >
              <MapPin className='text-red-400 w-6 h-6' />
            </button>
          </div>
        </div>

        {/* Dynamic Display state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-blue-500/20 blur animate-pulse"></div>
              <Compass className="animate-spin text-white w-16 h-16" />
            </div>
            <p className="text-xl font-light tracking-widest text-white animate-pulse">Loading live weather data...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto my-12 bg-red-500/25 border border-red-500/30 p-6 rounded-3xl text-center shadow-xl backdrop-blur-md">
            <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
            <p className="text-red-100 font-light mb-6">{error}</p>
            <button 
              onClick={handleAuto} 
              className="px-6 py-2.5 bg-white text-blue-900 rounded-xl font-bold shadow hover:bg-slate-100 transition-all duration-200"
            >
              Reset Search
            </button>
          </div>
        ) : current ? (
          <div className='space-y-8 animate-fadeIn duration-500'>
            {/* Hero Weather Section */}
            <div className='relative max-w-xl mx-auto'>
              <CurrentWeather weather={current} isCelsius={isCelsius} theme={theme} />
              {token && (
                <button 
                  onClick={handleSaveLocation} 
                  disabled={savingLocation}
                  className={`absolute top-6 right-6 p-3 rounded-2xl hover:scale-110 hover:rotate-12 active:scale-95 transition-all duration-300 border border-white/10 ${theme.cardBg}`}
                  title="Bookmark this location"
                >
                  {savingLocation ? (
                    <RefreshCw className="w-6 h-6 text-yellow-300 animate-spin" />
                  ) : (
                    <BookmarkPlus className='text-yellow-400 w-6 h-6' />
                  )}
                </button>
              )}
            </div>

            {/* Weather Trends Visualization */}
            <WeatherChart forecast={forecast} isCelsius={isCelsius} theme={theme} />

            {/* Extended Forecast Cards */}
            <Forecast forecast={forecast} isCelsius={isCelsius} theme={theme} />

            {/* Favorites Manager */}
            <SavedLocations 
              onSelectLocation={(city) => fetchWeatherAndForecast({ city })} 
              refreshTrigger={refreshTrigger}
              theme={theme}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
