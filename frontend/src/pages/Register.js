import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, setAuthError, setAuthLoading } from '../redux/slices/authSlice';
import { authApi, getApiErrorMessage } from '../services/api';
import { User, Mail, Lock, UserPlus, CloudLightning, AlertCircle, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
  ];
  if (!password) return null;
  return (
    <div className='flex gap-2 mt-2'>
      {checks.map(c => (
        <div key={c.label} className={`flex items-center gap-1 text-xs font-medium transition-colors duration-200 ${c.ok ? 'text-green-400' : 'text-slate-600'}`}>
          <CheckCircle2 size={11} />
          <span>{c.label}</span>
        </div>
      ))}
    </div>
  );
};

const Register = () => {
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      dispatch(setAuthError('Please fill in all fields.'));
      return;
    }
    dispatch(setAuthLoading());
    try {
      const res = await authApi.register({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      dispatch(loginSuccess(res.data));
      navigate('/');
    } catch (err) {
      dispatch(setAuthError(getApiErrorMessage(err, 'Registration failed. Try again.')));
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

        {/* Accent top line */}
        <div className='absolute top-0 left-0 right-0 h-px rounded-t-3xl'
          style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.8), rgba(99,102,241,0.8), transparent)' }} />

        {/* Brand */}
        <div className='text-center mb-8'>
          <div className='relative inline-flex mb-4'>
            <div className='absolute inset-0 bg-violet-500 rounded-2xl blur-xl opacity-50 animate-glow-pulse' />
            <div className='relative p-4 rounded-2xl'
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', boxShadow: '0 8px 24px rgba(139,92,246,0.4)' }}>
              <CloudLightning size={32} className='text-white' />
            </div>
          </div>
          <h1 className='text-3xl font-black tracking-tight text-white mb-1'>Create account</h1>
          <p className='text-slate-400 text-sm font-medium'>Join Atmosphere for live weather insights</p>
        </div>

        {/* Error */}
        {error && (
          <div className='mb-5 flex items-start gap-3 p-4 rounded-2xl animate-slide-down'
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <AlertCircle size={18} className='text-red-400 flex-shrink-0 mt-0.5' />
            <span className='text-red-300 text-sm font-medium'>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Username */}
          <div className='space-y-1.5'>
            <label className='text-xs uppercase tracking-widest font-bold text-slate-400'>Username</label>
            <div className='relative'>
              <User size={16} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none' />
              <input className='premium-input' value={username} onChange={ev => setUsername(ev.target.value)}
                placeholder='Choose a username' autoComplete='username' />
            </div>
          </div>

          {/* Email */}
          <div className='space-y-1.5'>
            <label className='text-xs uppercase tracking-widest font-bold text-slate-400'>Email Address</label>
            <div className='relative'>
              <Mail size={16} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none' />
              <input className='premium-input' type='email' value={email} onChange={ev => setEmail(ev.target.value)}
                placeholder='you@example.com' autoComplete='email' />
            </div>
          </div>

          {/* Password */}
          <div className='space-y-1.5'>
            <label className='text-xs uppercase tracking-widest font-bold text-slate-400'>Password</label>
            <div className='relative'>
              <Lock size={16} className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none' />
              <input className='premium-input' type={showPass ? 'text' : 'password'} value={password}
                onChange={ev => setPassword(ev.target.value)} placeholder='Create a strong password'
                autoComplete='new-password' style={{ paddingRight: '46px' }} />
              <button type='button' onClick={() => setShowPass(!showPass)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors'>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <PasswordStrength password={password} />
          </div>

          <button type='submit' disabled={loading} className='btn-primary mt-1'>
            {loading
              ? <Loader2 className='w-5 h-5 animate-spin' />
              : <><UserPlus size={18} /><span>Create Account</span></>}
          </button>
        </form>

        <div className='flex items-center gap-3 my-6'>
          <div className='flex-1 h-px' style={{ background: 'rgba(255,255,255,0.08)' }} />
          <span className='text-xs text-slate-600 font-medium'>Already a member?</span>
          <div className='flex-1 h-px' style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>

        <Link to='/login'
          className='flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-bold text-violet-300 transition-all duration-200 hover:text-white'
          style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.18)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.1)'; }}>
          Sign in to existing account
        </Link>
      </div>
    </div>
  );
};

export default Register;
