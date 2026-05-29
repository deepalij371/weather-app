import React, { useState, useEffect } from 'react';
import { Trash2, MapPin, Loader2, Star, Navigation } from 'lucide-react';
import { useSelector } from 'react-redux';
import { locationApi } from '../services/api';

const SavedLocations = ({ onSelectLocation, refreshTrigger, theme }) => {
  const [locations, setLocations] = useState([]);
  const [fetching,  setFetching]  = useState(false);
  const [deletingId,setDeletingId]= useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) fetchLocations();
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
    e.stopPropagation();
    setDeletingId(id);
    try {
      await locationApi.deleteLocation(id);
      setLocations(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to delete location', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!token) return null;

  return (
    <div className='glass-card p-6 md:p-8 w-full'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <div className='h-5 w-1 rounded-full'
            style={{ background: 'linear-gradient(180deg, #f59e0b, #ef4444)' }} />
          <h3 className='text-xl font-black text-white tracking-tight'>Saved Locations</h3>
          {locations.length > 0 && (
            <span className='px-2 py-0.5 rounded-full text-xs font-bold text-amber-300'
              style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.2)' }}>
              {locations.length}
            </span>
          )}
        </div>
        <Star size={16} className='text-amber-400/50' />
      </div>

      {/* Loading */}
      {fetching && locations.length === 0 ? (
        <div className='flex justify-center py-10'>
          <div className='flex flex-col items-center gap-3'>
            <Loader2 className='w-7 h-7 text-white/30 animate-spin' />
            <p className='text-xs text-white/30 font-medium'>Loading favourites...</p>
          </div>
        </div>

      /* Empty */
      ) : locations.length === 0 ? (
        <div className='flex flex-col items-center gap-3 py-10 text-center'>
          <div className='p-4 rounded-2xl' style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <MapPin className='w-8 h-8 text-white/20' />
          </div>
          <p className='text-sm text-white/35 font-medium max-w-xs'>
            No saved locations yet. Search for a city and tap the bookmark icon to save it.
          </p>
        </div>

      /* Grid */
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
          {locations.map((loc, i) => (
            <button
              key={loc.id}
              onClick={() => onSelectLocation(loc.cityName)}
              className='group glass-card-hover text-left p-4 flex items-center justify-between gap-3 card-enter'
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className='flex items-center gap-3 min-w-0'>
                <div className='flex-shrink-0 p-2 rounded-xl transition-all duration-200 group-hover:scale-110'
                  style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <Navigation size={14} className='text-amber-400' />
                </div>
                <div className='min-w-0'>
                  <p className='text-sm font-bold text-white truncate'>{loc.cityName}</p>
                  {loc.latitude && (
                    <p className='text-[10px] text-white/30 font-medium mt-0.5'>
                      {Number(loc.latitude).toFixed(1)}, {Number(loc.longitude).toFixed(1)}
                    </p>
                  )}
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => handleDelete(loc.id, e)}
                disabled={deletingId === loc.id}
                className='flex-shrink-0 p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100'
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.15)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.22)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
              >
                {deletingId === loc.id
                  ? <Loader2 size={14} className='text-red-400 animate-spin' />
                  : <Trash2  size={14} className='text-red-400' />}
              </button>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedLocations;
