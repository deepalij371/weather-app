import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess, setAuthError } from '../redux/slices/authSlice';
const Login = () => {
  const [u, setU] = useState(''); const [p, setP] = useState('');
  const navigate = useNavigate(); const dispatch = useDispatch();
  const sub = async (e) => { e.preventDefault(); try { const r = await axios.post('http://localhost:8080/api/auth/login', { username: u, password: p }); dispatch(loginSuccess(r.data)); navigate('/'); } catch (e) { dispatch(setAuthError('Fail')); } };
  return (<div className='flex justify-center mt-20'><form onSubmit={sub} className='bg-white p-8 rounded shadow-md w-full max-w-sm'><h2 className='text-2xl mb-4'>Login</h2><input className='w-full p-2 border mb-4' value={u} onChange={e=>setU(e.target.value)} placeholder='Username'/><input className='w-full p-2 border mb-4' type='password' value={p} onChange={e=>setP(e.target.value)} placeholder='Password'/><button className='w-full bg-blue-500 text-white p-2 rounded'>Login</button></form></div>);
};
export default Login;
