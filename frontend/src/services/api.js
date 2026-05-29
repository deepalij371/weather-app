import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const weatherApi = {
  getCurrentWeather: (params) => api.get('/weather/current', { params }),
  getForecast: (params) => api.get('/weather/forecast', { params }),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (payload) => api.post('/auth/register', payload),
};

export const locationApi = {
  getSavedLocations: () => api.get('/locations'),
  saveLocation: (location) => api.post('/locations', location),
  deleteLocation: (id) => api.delete(`/locations/${id}`),
};

export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => {
          reject(new Error('Unable to retrieve your location'));
        }
      );
    }
  });
};

export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (error.code === 'ECONNABORTED') {
    return 'The weather service took too long to respond. Please try again.';
  }

  if (!error.response) {
    return 'Cannot reach the backend service. Please make sure it is running on port 8080.';
  }

  const message = error.response?.data?.message;
  if (!message) return fallback;

  if (/openweathermap api key/i.test(message)) {
    return 'Weather provider access is not ready yet. Demo weather data is available while the API key is being configured.';
  }

  return message;
};

export default api;
