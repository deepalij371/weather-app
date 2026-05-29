import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ onSearch, theme }) => {
  const [city,    setCity]    = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = city.trim();
    if (trimmed) {
      onSearch(trimmed);
      setCity('');
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setCity('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className='relative w-full max-w-lg'>
      {/* Search icon */}
      <Search
        size={17}
        className='absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200'
        style={{ color: focused ? 'rgba(139,92,246,0.9)' : 'rgba(255,255,255,0.35)' }}
      />

      <input
        ref={inputRef}
        type='text'
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder='Search city or country...'
        className='w-full pl-11 pr-20 py-3.5 rounded-2xl text-sm font-medium text-white placeholder-white/35 outline-none transition-all duration-300'
        style={{
          background: focused
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(255,255,255,0.06)',
          border: focused
            ? '1px solid rgba(139,92,246,0.55)'
            : '1px solid rgba(255,255,255,0.1)',
          boxShadow: focused
            ? '0 0 0 3px rgba(99,102,241,0.12), 0 4px 16px rgba(0,0,0,0.2)'
            : 'none',
          fontFamily: 'Outfit, sans-serif',
        }}
      />

      {/* Clear button */}
      {city && (
        <button
          type='button'
          onClick={handleClear}
          className='absolute right-14 top-1/2 -translate-y-1/2 p-1 rounded-lg text-white/30 hover:text-white/70 transition-colors duration-200'
        >
          <X size={14} />
        </button>
      )}

      {/* Submit button */}
      <button
        type='submit'
        className='absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl font-bold text-xs text-white transition-all duration-200 hover:scale-105 active:scale-95'
        style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: '0 2px 12px rgba(99,102,241,0.4)',
          fontFamily: 'Outfit, sans-serif',
        }}
      >
        Go
      </button>
    </form>
  );
};

export default SearchBar;
