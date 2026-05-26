import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess, setAuthError } from '../redux/slices/authSlice';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username,
        email,
        password
      });
      dispatch(loginSuccess(response.data));
      navigate('/');
    } catch (err) {
      dispatch(setAuthError('Registration failed. Username or email might be taken.'));
    }
  };

  return (
    <div className='flex justify-center mt-20'>
      <form onSubmit={handleRegister} className='bg-white p-8 rounded shadow-md w-full max-w-sm'>
        <h2 className='text-2xl mb-4 font-bold'>Register</h2>
        <input
          className='w-full p-2 border mb-4 rounded'
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          placeholder='Username'
          required
        />
        <input
          className='w-full p-2 border mb-4 rounded'
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder='Email'
          type='email'
          required
        />
        <input
          className='w-full p-2 border mb-4 rounded'
          type='password'
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          placeholder='Password'
          required
        />
        <button className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors'>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
