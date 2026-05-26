import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});
export const weatherApi = {
  getCurrentWeather: (params) => api.get('/weather/current', { params }),
  getForecast: (params) => api.get('/weather/forecast', { params }),
  getHistorical: (city) => api.get('/weather/historical', { params: { city } }),
};
export const locationApi = {
  getSavedLocations: () => api.get('/locations'),
  saveLocation: (l) => api.post('/locations', l),
  deleteLocation: (id) => api.delete('/locations/' + id),
};
export const getUserLocation = () => new Promise((res, rej) => {
  if (!navigator.geolocation) rej(new Error('No geo'));
  else navigator.geolocation.getCurrentPosition((p) => res({ lat: p.coords.latitude, lon: p.coords.longitude }), () => rej(new Error('Fail')));
});
export default api;
