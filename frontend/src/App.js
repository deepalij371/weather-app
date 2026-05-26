import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './redux/slices/authSlice';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { LogOut, CloudSun, User, PlusCircle } from 'lucide-react';

function App() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <Router>
      <div className='min-h-screen bg-slate-950 font-sans text-white antialiased'>
        {/* Modern sticky glassmorphic navigation header */}
        <header className='sticky top-0 z-50 bg-slate-900/60 backdrop-blur-md border-b border-white/10 shadow-lg'>
          <nav className='max-w-6xl mx-auto px-6 py-4 flex justify-between items-center'>
            <Link 
              to='/' 
              className='flex items-center gap-3 text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent transform hover:scale-102 transition-all duration-300'
            >
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md shadow-blue-500/20">
                <CloudSun size={24} className="text-white animate-pulse" />
              </div>
              <span>Atmosphere</span>
            </Link>

            <div className='flex gap-4 items-center'>
              {token ? (
                <div className='flex items-center gap-4'>
                  <div className='hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5'>
                    <User size={16} className="text-blue-400" />
                    <span className="text-sm font-light text-slate-300">Dashboard active</span>
                  </div>
                  
                  <button 
                    onClick={() => dispatch(logout())} 
                    className='flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 hover:border-red-500/40 text-red-200 hover:text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-md shadow-red-950/20 active:scale-95'
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className='flex gap-3 items-center'>
                  <Link 
                    to='/login' 
                    className='text-slate-300 hover:text-white font-medium px-4 py-2.5 transition-colors duration-200'
                  >
                    Login
                  </Link>
                  <Link 
                    to='/register' 
                    className='flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 active:scale-95 transition-all duration-300 border border-white/10'
                  >
                    <PlusCircle size={16} />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
