import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, theme }) => {
  const [city, setCity] = React.useState('');
  const buttonStyle = theme?.searchBtn || 'bg-blue-600 hover:bg-blue-700 text-white';
  const cardStyle = theme?.cardBg || 'bg-white shadow-md';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`flex w-full max-w-lg mx-auto overflow-hidden rounded-2xl shadow-xl transition-all duration-300 ${cardStyle}`}
    >
      <input 
        type='text' 
        className='w-full px-6 py-4 bg-transparent outline-none border-none placeholder-white/60 font-light text-lg text-white' 
        placeholder='Enter city or country...' 
        value={city} 
        onChange={(e) => setCity(e.target.value)} 
      />
      <button 
        type='submit' 
        className={`px-6 py-4 flex items-center justify-center transition-all duration-300 ${buttonStyle}`}
      >
        <Search size={22} className="transform hover:scale-110 transition-transform duration-200" />
      </button>
    </form>
  );
};

export default SearchBar;
