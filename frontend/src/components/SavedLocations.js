import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, MapPin } from 'lucide-react';
import { useSelector } from 'react-redux';
const SavedLocations = ({ onSelectLocation }) => {
  const [locations, setLocations] = useState([]);
  const { token } = useSelector((state) => state.auth);
  useEffect(() => { if (token) fetch(); }, [token]);
  const fetch = async () => { try { const res = await axios.get('http://localhost:8080/api/locations', { headers: { Authorization: 'Bearer ' + token } }); setLocations(res.data); } catch (e) {} };
  const del = async (id) => { try { await axios.delete('http://localhost:8080/api/locations/' + id, { headers: { Authorization: 'Bearer ' + token } }); setLocations(locations.filter(l => l.id !== id)); } catch (e) {} };
  if (!token) return null;
  return (
    <div className='bg-white p-6 rounded-xl shadow-lg w-full mx-auto'>
      <h3 className='text-xl font-bold mb-4 flex items-center gap-2'><MapPin className='text-blue-500' /> Saved Locations</h3>
      <ul className='divide-y'>{locations.map((l) => (<li key={l.id} className='py-3 flex justify-between items-center'><button onClick={() => onSelectLocation(l.cityName)} className='hover:text-blue-500'>{l.cityName}</button><button onClick={() => del(l.id)} className='text-red-500'><Trash2 size={18} /></button></li>))}</ul>
    </div>
  );
};
export default SavedLocations;
