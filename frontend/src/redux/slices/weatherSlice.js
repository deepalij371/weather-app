import { createSlice } from '@reduxjs/toolkit';

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    current: null,
    forecast: null,
    loading: false,
    error: null,
  },
  reducers: {
    setWeather: (state, action) => {
      state.current = action.payload;
      state.loading = false;
      state.error = null;
    },
    setForecast: (state, action) => {
      state.forecast = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setWeather, setForecast, setLoading, setError } = weatherSlice.actions;
export default weatherSlice.reducer;
