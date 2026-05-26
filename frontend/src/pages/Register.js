import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess, setAuthError } from '../redux/slices/authSlice';
const Register = () => {
  const [u, setU] = useState(''); const [e, setE] = useState(''); const [p, setP] = useState('');
  const navigate = useNavigate(); const dispatch = useDispatch();
  const sub = async (ev) => { ev.preventDefault(); try { const r = await axios.post('http://localhost:8080/api/auth/register', { username: u, email: e, password: p }); dispatch(loginSuccess(r.data)); navigate('/'); } catch (err) { dispatch(setAuthError('Fail')); } };
  return (<div className='flex justify-center mt-20'><form onSubmit={sub} className='bg-white p-8 rounded shadow-md w-full max-w-sm'><h2 className='text-2xl mb-4'>Register</h2><input className='w-full p-2 border mb-4' value={u} onChange={ev=>setU(ev.target.value)} placeholder='Username'/><input className='w-full p-2 border mb-4' value={e} onChange={ev=>setE(ev.target.value)} placeholder='Email'/><input className='w-full p-2 border mb-4' type='password' value={p} onChange={ev=>setP(ev.target.value)} placeholder='Password'/><button className='w-full bg-blue-500 text-white p-2 rounded'>Register</button></form></div>);
};
export default Register;
