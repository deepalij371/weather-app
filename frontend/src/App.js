import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './redux/slices/authSlice';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import {
  BarChart3,
  Bookmark,
  CloudLightning,
  Compass,
  LayoutDashboard,
  LogOut,
  MapPinned,
  PlusCircle,
  Search,
  ShieldCheck,
  User,
} from 'lucide-react';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to === '/dashboard' && location.pathname === '/');

  return (
    <Link
      to={to}
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
        isActive
          ? 'border border-white/10 bg-white/15 text-white shadow-inner'
          : 'text-slate-400 hover:bg-white/8 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
};

const SidebarLink = ({ to, icon: Icon, label, description }) => {
  const location = useLocation();
  const [targetPath, targetHash = ''] = to.split('#');
  const isDashboardHome = targetPath === '/dashboard' && location.pathname === '/' && !targetHash;
  const isActive = isDashboardHome || (location.pathname === targetPath && location.hash === (targetHash ? `#${targetHash}` : ''));

  return (
    <Link
      to={to}
      className={`group flex items-center gap-3 rounded-2xl border px-3.5 py-3 transition-all duration-200 ${
        isActive
          ? 'border-cyan-300/25 bg-cyan-300/12 text-white shadow-lg shadow-cyan-950/20'
          : 'border-transparent text-slate-400 hover:border-white/10 hover:bg-white/7 hover:text-white'
      }`}
    >
      <span
        className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl border transition-colors ${
          isActive
            ? 'border-cyan-300/25 bg-cyan-300/15 text-cyan-200'
            : 'border-white/8 bg-white/6 text-slate-400 group-hover:text-cyan-200'
        }`}
      >
        <Icon size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold leading-tight">{label}</span>
        <span className="mt-0.5 block truncate text-xs font-medium text-white/35">{description}</span>
      </span>
    </Link>
  );
};

const AppSidebar = ({ onLogout }) => (
  <aside className="fixed bottom-0 left-0 top-[73px] z-40 hidden w-72 border-r border-white/10 bg-slate-950/82 px-4 py-5 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl lg:block">
    <div className="flex h-full flex-col">
      <div className="rounded-2xl border border-white/10 bg-white/7 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 shadow-lg shadow-cyan-950/30">
            <User size={20} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-white">Weather Desk</p>
            <p className="truncate text-xs font-semibold text-slate-400">Signed in workspace</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/10 p-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-emerald-300">Live</span>
            </div>
            <p className="mt-1 text-[11px] font-medium text-white/35">API ready</p>
          </div>
          <div className="rounded-xl border border-cyan-300/15 bg-cyan-300/10 p-3">
            <ShieldCheck size={15} className="text-cyan-200" />
            <p className="mt-1 text-[11px] font-medium text-white/35">Protected</p>
          </div>
        </div>
      </div>

      <nav className="mt-5 space-y-2">
        <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" description="Current conditions" />
        <SidebarLink to="/dashboard#search" icon={Search} label="Search Weather" description="Find any city" />
        <SidebarLink to="/dashboard#saved" icon={Bookmark} label="Saved Cities" description="Your locations" />
        <SidebarLink to="/dashboard#trends" icon={BarChart3} label="Forecast Trends" description="Hourly insights" />
        <SidebarLink to="/dashboard#forecast" icon={MapPinned} label="Forecast" description="Five-day outlook" />
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
          <div className="flex items-center gap-2">
            <Compass size={17} className="text-amber-200" />
            <p className="text-sm font-bold text-white">Atmosphere Pro</p>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Fast weather lookups, saved places, and live dashboard refresh in one workspace.
          </p>
        </div>

        <button
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-100 transition-all duration-200 hover:bg-red-400/18 hover:text-white active:scale-95"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  </aside>
);

function AppInner() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white antialiased">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Link to="/" className="group flex select-none items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-cyan-400/35 blur-md opacity-60 transition-opacity duration-300 group-hover:opacity-90" />
              <div className="relative rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 p-2.5 shadow-lg shadow-cyan-950/40">
                <CloudLightning size={20} className="text-white" />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-gradient text-lg font-black tracking-tight">Atmosphere</span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-white/35">
                Weather Intelligence
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {token ? (
              <>
                <NavLink to="/dashboard">
                  <span className="flex items-center gap-1.5">
                    <LayoutDashboard size={14} />
                    Dashboard
                  </span>
                </NavLink>

                <div className="hidden items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 sm:flex">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-xs font-semibold text-emerald-300">Live</span>
                </div>

                <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/6 px-3 py-1.5 md:flex">
                  <User size={14} className="text-cyan-300" />
                  <span className="text-xs font-medium text-slate-300">Signed in</span>
                </div>

                <button
                  onClick={() => dispatch(logout())}
                  className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-100 transition-all duration-200 hover:bg-red-400/20 hover:text-white active:scale-95"
                >
                  <LogOut size={15} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-400 transition-all duration-200 hover:bg-white/8 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-cyan-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-700/30 active:scale-95"
                >
                  <PlusCircle size={15} />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {token && <AppSidebar onLogout={() => dispatch(logout())} />}

      <main className={token ? 'lg:pl-72' : ''}>
        <Routes>
          <Route path="/" element={token ? <Dashboard /> : <LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;
