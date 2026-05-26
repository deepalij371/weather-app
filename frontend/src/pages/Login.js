import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess, setAuthError } from '../redux/slices/authSlice';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password
      });
      dispatch(loginSuccess(response.data));
      navigate('/');
    } catch (error) {
      dispatch(setAuthError('Authentication failed. Please check your credentials.'));
    }
  };

  return (
    <div className='flex justify-center mt-20'>
      <form onSubmit={handleLogin} className='bg-white p-8 rounded shadow-md w-full max-w-sm'>
        <h2 className='text-2xl mb-4 font-bold'>Login</h2>
        <input
          className='w-full p-2 border mb-4 rounded'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Username'
          required
        />
        <input
          className='w-full p-2 border mb-4 rounded'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          required
        />
        <button className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors'>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
