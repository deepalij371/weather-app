import React from 'react';
import { Search } from 'lucide-react';
const SearchBar = ({ onSearch }) => {
  const [city, setCity] = React.useState('');
  const handleSubmit = (e) => { e.preventDefault(); if (city.trim()) onSearch(city); };
  return (
    <form onSubmit={handleSubmit} className='flex w-full max-w-md mx-auto mb-8'>
      <input type='text' className='w-full px-4 py-2 border rounded-l-lg' placeholder='Search city...' value={city} onChange={(e) => setCity(e.target.value)} />
      <button type='submit' className='px-4 py-2 bg-blue-500 text-white rounded-r-lg'><Search size={20} /></button>
    </form>
  );
};
export default SearchBar;
