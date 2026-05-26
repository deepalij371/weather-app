import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, setAuthError, setAuthLoading } from '../redux/slices/authSlice';
import { Mail, Lock, LogIn, CloudSun, AlertCircle, RefreshCw } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      dispatch(setAuthError('Please fill in all fields.'));
      return;
    }

    dispatch(setAuthLoading());
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', {
        username: username.trim(),
        password: password
      });
      dispatch(loginSuccess(res.data));
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid username or password';
      dispatch(setAuthError(message));
    }
  };

  return (
    <div className='min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6'>
      <div className='w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-8 md:p-10 rounded-3xl shadow-2xl text-white transform hover:scale-101 transition-all duration-300'>
        
        {/* Brand Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex p-4 bg-blue-500/20 rounded-full border border-blue-400/20 mb-3 animate-pulse'>
            <CloudSun size={40} className="text-blue-400" />
          </div>
          <h2 className='text-3xl font-extrabold tracking-tight'>Welcome Back</h2>
          <p className='text-slate-300 font-light mt-1'>Access premium real-time forecasts</p>
        </div>

        {/* Warning messages */}
        {error && (
          <div className='mb-6 flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-200 text-sm'>
            <AlertCircle size={20} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Username Input */}
          <div className='space-y-2'>
            <label className='text-xs uppercase tracking-wider font-semibold text-slate-300'>Username</label>
            <div className='relative flex items-center'>
              <Mail className='absolute left-4 text-slate-400 w-5 h-5' />
              <input 
                className='w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 text-white placeholder-slate-500 transition-colors' 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                placeholder='Enter your username'
              />
            </div>
          </div>

          {/* Password Input */}
          <div className='space-y-2'>
            <label className='text-xs uppercase tracking-wider font-semibold text-slate-300'>Password</label>
            <div className='relative flex items-center'>
              <Lock className='absolute left-4 text-slate-400 w-5 h-5' />
              <input 
                className='w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-blue-500 text-white placeholder-slate-500 transition-colors' 
                type='password' 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder='••••••••'
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type='submit'
            disabled={loading}
            className='w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-98 transition-all duration-200 disabled:opacity-50'
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <LogIn size={20} />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

        {/* Navigation link */}
        <p className='text-center text-sm font-light mt-8 text-slate-300'>
          Don't have an account?{' '}
          <Link to='/register' className='text-blue-400 font-bold hover:underline ml-1'>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
