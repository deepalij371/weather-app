import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './redux/slices/authSlice';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { LogOut, CloudSun } from 'lucide-react';
function App() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  return (
    <Router>
      <div className='min-h-screen bg-white'>
        <nav className='bg-white shadow-md p-4 flex justify-between items-center container mx-auto'>
          <Link to='/' className='flex items-center gap-2 text-2xl font-bold text-blue-600'><CloudSun size={32} /><span>WeatherApp</span></Link>
          <div className='flex gap-4 items-center'>
            {token ? (
              <button onClick={() => dispatch(logout())} className='flex items-center gap-2 text-gray-600 hover:text-red-500'><LogOut size={20} /> Logout</button>
            ) : (
              <>
                <Link to='/login' className='text-gray-600'>Login</Link>
                <Link to='/register' className='bg-blue-500 text-white px-4 py-2 rounded-lg'>Register</Link>
              </>
            )}
          </div>
        </nav>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
