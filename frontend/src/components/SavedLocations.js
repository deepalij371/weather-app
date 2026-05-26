import React, { useState, useEffect } from 'react';
import { Trash2, MapPin, Compass } from 'lucide-react';
import { useSelector } from 'react-redux';
import { locationApi } from '../services/api';

const SavedLocations = ({ onSelectLocation, refreshTrigger, theme }) => {
  const [locations, setLocations] = useState([]);
  const [fetching, setFetching] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const cardStyle = theme?.cardBg || 'bg-white text-slate-800 shadow-lg';
  const textSecondary = theme?.textSecondary || 'text-slate-500';
  const accentStyle = theme?.accent || 'bg-blue-50 text-blue-800';

  useEffect(() => {
    if (token) {
      fetchLocations();
    }
  }, [token, refreshTrigger]);

  const fetchLocations = async () => {
    setFetching(true);
    try {
      const res = await locationApi.getSavedLocations();
      setLocations(res.data);
    } catch (e) {
      console.error('Failed to load saved locations', e);
    } finally {
      setFetching(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Avoid selecting location when deleting
    try {
      await locationApi.deleteLocation(id);
      setLocations(locations.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to delete location', err);
    }
  };

  if (!token) return null;

  return (
    <div className={`p-6 rounded-3xl w-full mx-auto shadow-2xl transition-all duration-300 ${cardStyle}`}>
      <h3 className='text-2xl font-bold mb-6 flex items-center gap-2 tracking-tight'>
        <MapPin className='text-red-400 w-6 h-6 animate-pulse' /> Saved Favorites
      </h3>
      {fetching && locations.length === 0 ? (
        <div className="flex justify-center py-4">
          <Compass className="animate-spin text-white/50 w-8 h-8" />
        </div>
      ) : locations.length === 0 ? (
        <p className={`text-center py-4 font-light ${textSecondary}`}>No saved locations yet. Search for a city and save it!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {locations.map((l) => (
            <div 
              key={l.id} 
              onClick={() => onSelectLocation(l.cityName)}
              className={`p-4 rounded-2xl flex justify-between items-center cursor-pointer transition-all duration-200 hover:scale-102 hover:bg-white/20 border border-white/5 ${accentStyle}`}
            >
              <span className="font-semibold text-lg truncate pr-2">{l.cityName}</span>
              <button 
                onClick={(e) => handleDelete(l.id, e)} 
                className='p-2 bg-white/10 hover:bg-red-500/20 text-red-300 hover:text-red-100 rounded-xl transition-all duration-200'
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedLocations;
