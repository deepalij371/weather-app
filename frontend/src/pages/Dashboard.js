import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWeather, setForecast, setLoading, setError } from '../redux/slices/weatherSlice';
import { weatherApi, locationApi, getUserLocation, getApiErrorMessage } from '../services/api';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import Forecast from '../components/Forecast';
import WeatherChart from '../components/WeatherChart';
import SavedLocations from '../components/SavedLocations';
import LiveClock from '../components/LiveClock';
import { MapPin, BookmarkPlus, AlertCircle, RefreshCw, Loader2, RotateCcw } from 'lucide-react';
import useWeatherTheme from '../hooks/useWeatherTheme';

const AUTO_REFRESH_MS = 5 * 60 * 1000;

const Dashboard = () => {
  const dispatch = useDispatch();
  const { current, forecast, loading, error } = useSelector((state) => state.weather);
  const { token } = useSelector((state) => state.auth);

  const [isCelsius, setIsCelsius] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [savingLocation, setSavingLocation] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefreshing, setAutoRefreshing] = useState(false);
  const lastParamsRef = useRef(null);

  const theme = useWeatherTheme(current?.weather[0]?.main);

  const fetchWeatherAndForecast = useCallback(async (params) => {
    dispatch(setLoading());
    lastParamsRef.current = params;

    try {
      const [weather, forecastData] = await Promise.all([
        weatherApi.getCurrentWeather(params),
        weatherApi.getForecast(params),
      ]);
      dispatch(setWeather(weather.data));
      dispatch(setForecast(forecastData.data));
      setLastUpdated(new Date());
    } catch (e) {
      dispatch(setError(getApiErrorMessage(e, 'City not found. Please try another name.')));
    }
  }, [dispatch]);

  const handleAuto = useCallback(async () => {
    dispatch(setLoading());
    try {
      const coords = await getUserLocation();
      fetchWeatherAndForecast(coords);
    } catch {
      fetchWeatherAndForecast({ city: 'London' });
    }
  }, [dispatch, fetchWeatherAndForecast]);

  const silentRefresh = useCallback(async () => {
    if (!lastParamsRef.current) return;
    setAutoRefreshing(true);
    try {
      const [weather, forecastData] = await Promise.all([
        weatherApi.getCurrentWeather(lastParamsRef.current),
        weatherApi.getForecast(lastParamsRef.current),
      ]);
      dispatch(setWeather(weather.data));
      dispatch(setForecast(forecastData.data));
      setLastUpdated(new Date());
    } catch {
      // Keep the current dashboard visible if a background refresh fails.
    } finally {
      setAutoRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => { handleAuto(); }, [handleAuto]);

  useEffect(() => {
    const id = setInterval(silentRefresh, AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, [silentRefresh]);

  const handleSaveLocation = async () => {
    if (!current) return;
    setSavingLocation(true);
    try {
      await locationApi.saveLocation({
        cityName: current.name,
        latitude: current.coord.lat,
        longitude: current.coord.lon,
      });
      setRefreshTrigger(prev => prev + 1);
    } catch (e) {
      console.error('Failed to save location', e);
    } finally {
      setSavingLocation(false);
    }
  };

  const updatedLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="professional-dashboard min-h-screen font-sans text-white transition-all duration-700">
      <div className="dashboard-backdrop" aria-hidden="true">
        <div className="dashboard-mesh" />
        <div className="dashboard-horizon" />
        <div className="dashboard-orbit dashboard-orbit-a" />
        <div className="dashboard-orbit dashboard-orbit-b" />
        <div className="dashboard-rain" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-6 pb-20 md:px-6 lg:py-8">
        <section className="mb-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="animate-slide-right">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-200/70">
              Live weather command center
            </p>
            <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
              Professional weather intelligence for every saved city.
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-300 md:text-base">
              Search conditions, compare forecast trends, and keep frequently checked locations close at hand.
            </p>
          </div>

          <div className="dashboard-status-panel animate-slide-down">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">Workspace</p>
              <p className="mt-1 text-lg font-black text-white">Atmosphere Pro</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="metric-tile">
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-300">API</p>
                <p className="mt-1 text-sm font-black text-white">Live</p>
              </div>
              <div className="metric-tile">
                <p className="text-[11px] font-bold uppercase tracking-widest text-cyan-300">Refresh</p>
                <p className="mt-1 text-sm font-black text-white">5 min</p>
              </div>
            </div>
          </div>
        </section>

        <div id="search" className="control-bar mb-8 scroll-mt-28 p-4 animate-slide-down">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <div className="w-full md:flex-1">
              <SearchBar onSearch={(city) => fetchWeatherAndForecast({ city })} theme={theme} />
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                onClick={() => setIsCelsius(!isCelsius)}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <span className="text-white/60">Unit:</span>
                <span className="font-black text-cyan-200">{isCelsius ? '\u00B0C' : '\u00B0F'}</span>
              </button>

              <button
                onClick={handleAuto}
                title="Detect my location"
                className="rounded-xl border border-white/15 bg-white/10 p-2.5 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <MapPin className="h-5 w-5 text-rose-300" />
              </button>

              <div className="hidden border-l border-white/10 pl-3 lg:block">
                <LiveClock />
              </div>
            </div>
          </div>

          {updatedLabel && (
            <div className="mt-3 flex items-center gap-3 border-t border-white/8 pt-3">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-white/45">Updated at {updatedLabel}</span>
              </div>
              {autoRefreshing && (
                <div className="flex items-center gap-1 text-xs text-cyan-200/75">
                  <RefreshCw size={10} className="animate-spin" />
                  <span>Refreshing...</span>
                </div>
              )}
              <span className="ml-auto hidden text-xs text-white/30 sm:block">Auto-refresh every 5 min</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-6 py-40 animate-slide-up">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl animate-glow-pulse" />
              <div className="glass-card relative rounded-full p-6">
                <Loader2 className="h-12 w-12 animate-spin text-cyan-300" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold tracking-wide text-white/85">Fetching live weather data</p>
              <p className="mt-1 text-sm text-white/40">Connecting to weather servers...</p>
            </div>
          </div>
        ) : error ? (
          <div className="glass-card mx-auto my-16 max-w-sm p-8 text-center animate-scale-up">
            <div className="mb-4 inline-flex rounded-2xl border border-red-400/25 bg-red-400/15 p-4">
              <AlertCircle className="h-10 w-10 text-red-300" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">Could not load weather</h3>
            <p className="mb-6 text-sm font-medium text-red-200/85">{error}</p>
            <button onClick={handleAuto} className="btn-hero mx-auto">
              <RotateCcw size={16} />
              Try again
            </button>
          </div>
        ) : current ? (
          <div className="space-y-6">
            <div className="relative card-enter">
              <CurrentWeather weather={current} isCelsius={isCelsius} theme={theme} />
              {token && (
                <button
                  onClick={handleSaveLocation}
                  disabled={savingLocation}
                  title="Save this location"
                  className="absolute right-5 top-5 rounded-2xl border border-white/15 bg-white/10 p-3 transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50"
                >
                  {savingLocation
                    ? <RefreshCw className="h-5 w-5 animate-spin text-amber-200" />
                    : <BookmarkPlus className="h-5 w-5 text-amber-300" />}
                </button>
              )}
            </div>

            <div id="trends" className="card-enter scroll-mt-28 delay-200">
              <WeatherChart forecast={forecast} isCelsius={isCelsius} theme={theme} />
            </div>

            <div id="forecast" className="card-enter scroll-mt-28 delay-300">
              <Forecast forecast={forecast} isCelsius={isCelsius} theme={theme} />
            </div>

            {token && (
              <div id="saved" className="card-enter scroll-mt-28 delay-400">
                <SavedLocations
                  onSelectLocation={(city) => fetchWeatherAndForecast({ city })}
                  refreshTrigger={refreshTrigger}
                  theme={theme}
                />
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
