import React, { useState, useEffect } from 'react';
const useWeatherTheme = (condition) => {
  const [theme, setTheme] = useState('bg-blue-50');
  useEffect(() => {
    if (!condition) return;
    const cond = condition.toLowerCase();
    if (cond.includes('clear')) setTheme('bg-yellow-50');
    else if (cond.includes('cloud')) setTheme('bg-gray-100');
    else if (cond.includes('rain')) setTheme('bg-blue-100');
    else setTheme('bg-blue-50');
  }, [condition]);
  return theme;
};
export default useWeatherTheme;
