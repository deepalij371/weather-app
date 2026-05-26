import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWeather, setForecast, setLoading, setError } from '../redux/slices/weatherSlice';
import { weatherApi, locationApi, getUserLocation } from '../services/api';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import Forecast from '../components/Forecast';
import WeatherChart from '../components/WeatherChart';
import SavedLocations from '../components/SavedLocations';
import { MapPin, BookmarkPlus } from 'lucide-react';
import useWeatherTheme from '../hooks/useWeatherTheme';
const Dashboard = () => {
  const dispatch = useDispatch();
  const { current, forecast, loading, error } = useSelector((state) => state.weather);
  const { token } = useSelector((state) => state.auth);
  const [isCelsius, setIsCelsius] = useState(true);
  const theme = useWeatherTheme(current?.weather[0]?.main);
  useEffect(() => { handleAuto(); }, []);
  const handleAuto = async () => { try { const c = await getUserLocation(); fetchW(c); } catch (e) {} };
  const fetchW = async (p) => { try { dispatch(setLoading()); const [w, f] = await Promise.all([weatherApi.getCurrentWeather(p), weatherApi.getForecast(p)]); dispatch(setWeather(w.data)); dispatch(setForecast(f.data)); } catch (e) { dispatch(setError('Error')); } };
  const save = async () => { try { await locationApi.saveLocation({ cityName: current.name, latitude: current.coord.lat, longitude: current.coord.lon }); } catch (e) {} };
  return (
    <div className={'min-h-screen transition-colors ' + theme + ' p-8'}>
      <div className='max-w-4xl mx-auto'>
        <div className='flex gap-4 mb-8 justify-center'>
          <SearchBar onSearch={(city) => fetchW({ city })} />
          <button onClick={() => setIsCelsius(!isCelsius)} className='p-2 bg-white rounded shadow'>{isCelsius ? '°C' : '°F'}</button>
          <button onClick={handleAuto} className='p-2 bg-white rounded shadow'><MapPin className='text-blue-500' /></button>
        </div>
        {current && (
          <div className='space-y-8'>
            <div className='relative max-w-md mx-auto'>
              <CurrentWeather weather={current} isCelsius={isCelsius} />
              {token && <button onClick={save} className='absolute top-4 right-4'><BookmarkPlus className='text-blue-500' /></button>}
            </div>
            <WeatherChart forecast={forecast} isCelsius={isCelsius} />
            <Forecast forecast={forecast} isCelsius={isCelsius} />
            <SavedLocations onSelectLocation={(city) => fetchW({ city })} />
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
