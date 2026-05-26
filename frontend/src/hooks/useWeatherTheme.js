import { useState, useEffect } from 'react';

const useWeatherTheme = (condition) => {
  const [theme, setTheme] = useState({
    background: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white',
    cardBg: 'bg-white/10 backdrop-blur-md border border-white/20',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    accent: 'bg-blue-500/30 text-blue-200 border-blue-400/20',
    searchBtn: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20',
    tabActive: 'bg-white/20 text-white',
    tabInactive: 'hover:bg-white/5 text-slate-400'
  });

  useEffect(() => {
    if (!condition) return;
    const cond = condition.toLowerCase();

    if (cond.includes('clear')) {
      // Sunny / Clear Sunset theme
      setTheme({
        background: 'bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 text-white',
        cardBg: 'bg-white/15 backdrop-blur-lg border border-white/20 shadow-xl shadow-orange-950/20',
        textPrimary: 'text-white',
        textSecondary: 'text-orange-100',
        accent: 'bg-amber-400/30 text-amber-100 border-amber-300/30',
        searchBtn: 'bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white shadow-lg shadow-orange-600/20',
        tabActive: 'bg-white/35 text-white shadow-inner',
        tabInactive: 'hover:bg-white/10 text-orange-200'
      });
    } else if (cond.includes('cloud')) {
      // Cloudy / Overcast theme
      setTheme({
        background: 'bg-gradient-to-br from-slate-600 via-gray-700 to-zinc-800 text-white',
        cardBg: 'bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl shadow-slate-950/20',
        textPrimary: 'text-white',
        textSecondary: 'text-slate-300',
        accent: 'bg-slate-500/30 text-slate-200 border-slate-400/20',
        searchBtn: 'bg-gradient-to-r from-slate-500 to-zinc-600 hover:from-slate-600 hover:to-zinc-700 text-white shadow-lg shadow-slate-500/20',
        tabActive: 'bg-white/20 text-white shadow-inner',
        tabInactive: 'hover:bg-white/5 text-slate-400'
      });
    } else if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('thunderstorm')) {
      // Rainy / Stormy theme
      setTheme({
        background: 'bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white',
        cardBg: 'bg-white/10 backdrop-blur-lg border border-white/10 shadow-xl shadow-blue-950/30',
        textPrimary: 'text-white',
        textSecondary: 'text-blue-200',
        accent: 'bg-blue-500/20 text-blue-200 border-blue-400/25',
        searchBtn: 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg shadow-blue-600/30',
        tabActive: 'bg-white/20 text-white shadow-inner',
        tabInactive: 'hover:bg-white/5 text-blue-300'
      });
    } else if (cond.includes('snow')) {
      // Snowy theme
      setTheme({
        background: 'bg-gradient-to-br from-sky-400 via-indigo-400 to-slate-500 text-slate-950',
        cardBg: 'bg-white/50 backdrop-blur-lg border border-white/40 shadow-xl shadow-indigo-950/10',
        textPrimary: 'text-slate-900',
        textSecondary: 'text-slate-700',
        accent: 'bg-white/70 text-indigo-900 border-white/60',
        searchBtn: 'bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-600 hover:to-sky-700 text-white shadow-lg shadow-indigo-500/20',
        tabActive: 'bg-white/60 text-slate-900 shadow-inner',
        tabInactive: 'hover:bg-white/30 text-slate-800'
      });
    } else {
      // General atmospheric / fallback theme
      setTheme({
        background: 'bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white',
        cardBg: 'bg-white/15 backdrop-blur-lg border border-white/25 shadow-xl shadow-blue-950/20',
        textPrimary: 'text-white',
        textSecondary: 'text-blue-100',
        accent: 'bg-sky-400/30 text-sky-100 border-sky-300/30',
        searchBtn: 'bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white shadow-lg shadow-sky-600/20',
        tabActive: 'bg-white/30 text-white shadow-inner',
        tabInactive: 'hover:bg-white/10 text-blue-200'
      });
    }
  }, [condition]);

  return theme;
};

export default useWeatherTheme;
