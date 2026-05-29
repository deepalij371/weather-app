import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, setAuthError, setAuthLoading } from '../redux/slices/authSlice';
import { authApi, getApiErrorMessage } from '../services/api';
import { Mail, Lock, LogIn, CloudLightning, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [showPass,  setShowPass]        = useState(false);
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      dispatch(setAuthError('Please fill in all fields.'));
      return;
    }
    dispatch(setAuthLoading());
    try {
      const res = await authApi.login({
        username: username.trim(),
        password,
      });
      dispatch(loginSuccess(res.data));
      navigate('/');
    } catch (err) {
      dispatch(setAuthError(getApiErrorMessage(err, 'Invalid username or password')));
    }
  };

  return (
    <div className='professional-bg relative flex min-h-[92vh] items-center justify-center overflow-hidden p-6'>
      <div className="weather-sky" aria-hidden="true">
        <div className="sky-sun" />
        <div className="sky-cloud sky-cloud-a" />
        <div className="sky-rain" />
      </div>

      {/* Card */}
      <div className='glass-card w-full max-w-md animate-scale-up'
        style={{ padding: '40px', boxShadow: '0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)' }}>

        {/* Top accent line */}
        <div className='absolute top-0 left-0 right-0 h-px rounded-t-3xl'
          style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.8), rgba(139,92,246,0.8), transparent)' }} />

        {/* Brand */}
        <div className='text-center mb-9'>
          <div className='relative inline-flex mb-5'>
            <div className='absolute inset-0 bg-indigo-500 rounded-2xl blur-xl opacity-50 animate-glow-pulse' />
            <div className='relative p-4 rounded-2xl'
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>
              <CloudLightning size={32} className='text-white' />
            </div>
          </div>
          <h1 className='text-3xl font-black tracking-tight text-white mb-1'>Welcome back</h1>
          <p className='text-slate-400 text-sm font-medium'>Sign in to your Atmosphere account</p>
        </div>

        {/* Error */}
        {error && (
          <div className='mb-6 flex items-start gap-3 p-4 rounded-2xl animate-slide-down'
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <AlertCircle size={18} className='text-red-400 flex-shrink-0 mt-0.5' />
            <span className='text-red-300 text-sm font-medium'>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* Username */}
          <div className='space-y-1.5'>
            <label className='text-xs uppercase tracking-widest font-bold text-slate-400'>Username</label>
            <div className='relative'>
              <Mail size={16} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none' />
              <input
                className='premium-input'
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder='Your username'
                autoComplete='username'
              />
            </div>
          </div>

          {/* Password */}
          <div className='space-y-1.5'>
            <label className='text-xs uppercase tracking-widest font-bold text-slate-400'>Password</label>
            <div className='relative'>
              <Lock size={16} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none' />
              <input
                className='premium-input'
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Password'
                autoComplete='current-password'
                style={{ paddingRight: '46px' }}
              />
              <button type='button' onClick={() => setShowPass(!showPass)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors'>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type='submit' disabled={loading} className='btn-primary mt-2'>
            {loading
              ? <Loader2 className='w-5 h-5 animate-spin' />
              : <><LogIn size={18} /><span>Sign In</span></>}
          </button>
        </form>

        {/* Divider */}
        <div className='flex items-center gap-3 my-7'>
          <div className='flex-1 h-px' style={{ background: 'rgba(255,255,255,0.08)' }} />
          <span className='text-xs text-slate-600 font-medium'>New to Atmosphere?</span>
          <div className='flex-1 h-px' style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>

        <Link to='/register'
          className='flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-bold text-indigo-300 transition-all duration-200 hover:text-white'
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; }}>
          Create a free account
        </Link>
      </div>
    </div>
  );
};

export default Login;
