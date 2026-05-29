import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BookmarkCheck,
  CloudSun,
  Compass,
  Gauge,
  MapPin,
  Radar,
  Sparkles,
  Wind,
} from 'lucide-react';

const sampleForecast = [
  { day: 'Mon', temp: '24', state: 'Clear' },
  { day: 'Tue', temp: '21', state: 'Rain' },
  { day: 'Wed', temp: '26', state: 'Warm' },
  { day: 'Thu', temp: '22', state: 'Clouds' },
];

const features = [
  {
    icon: Radar,
    title: 'Live Conditions',
    copy: 'Search any city or use your location for current weather, wind, visibility, humidity, and pressure.',
  },
  {
    icon: BarChart3,
    title: 'Hourly Intelligence',
    copy: 'Readable temperature and humidity trends help you understand what is changing through the day.',
  },
  {
    icon: BookmarkCheck,
    title: 'Saved Locations',
    copy: 'Sign in to keep favourite cities close and move between them without repeating searches.',
  },
];

const LandingPage = () => {
  return (
    <div className="professional-bg text-white">
      <section className="relative min-h-[calc(100vh-76px)] overflow-hidden">
        <div className="weather-sky" aria-hidden="true">
          <div className="sky-sun" />
          <div className="sky-cloud sky-cloud-a" />
          <div className="sky-cloud sky-cloud-b" />
          <div className="sky-rain" />
        </div>

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-12 md:grid-cols-[1.02fr_0.98fr] md:px-6 md:pb-20 md:pt-16">
          <div className="max-w-2xl animate-slide-right">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
              <Sparkles size={14} className="text-amber-300" />
              Weather intelligence dashboard
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Atmosphere
            </h1>
            <p className="mt-5 max-w-xl text-base font-medium leading-7 text-slate-200 sm:text-lg">
              Real-time weather intelligence with precise conditions, readable trends, and location-aware forecasting.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/dashboard" className="btn-hero">
                <span>Open dashboard</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn-secondary">
                Create account
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {[
                ['5 min', 'Auto refresh'],
                ['24 hr', 'Hourly trend'],
                ['5 day', 'Forecast view'],
              ].map(([value, label]) => (
                <div key={label} className="metric-tile">
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/45">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-slide-up md:justify-self-end">
            <div className="dashboard-preview">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Live now</p>
                  <h2 className="mt-1 text-2xl font-black">New Delhi</h2>
                </div>
                <div className="rounded-2xl bg-amber-300/15 p-3 text-amber-200">
                  <CloudSun size={32} />
                </div>
              </div>

              <div className="grid gap-4 p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-7xl font-black leading-none tracking-tight">31°C</p>
                    <p className="mt-2 text-sm font-semibold capitalize text-white/55">Partly cloudy</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-right">
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-200/70">Air</p>
                    <p className="text-lg font-black text-emerald-100">Good</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    [Wind, 'Wind', '3.8 m/s'],
                    [Gauge, 'Pressure', '1008 hPa'],
                    [MapPin, 'Visibility', '8 km'],
                  ].map(([Icon, label, value]) => (
                    <div key={label} className="preview-stat">
                      <Icon size={17} className="text-cyan-200" />
                      <p className="mt-2 text-[11px] font-bold uppercase tracking-widest text-white/35">{label}</p>
                      <p className="text-sm font-black text-white">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-black">Forecast</p>
                    <Compass size={16} className="text-white/35" />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {sampleForecast.map((item) => (
                      <div key={item.day} className="rounded-xl bg-white/7 p-3 text-center">
                        <p className="text-xs font-bold text-white/45">{item.day}</p>
                        <p className="mt-2 text-xl font-black">{item.temp}°C</p>
                        <p className="mt-1 text-[11px] font-semibold text-white/40">{item.state}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/8 bg-slate-950/55 py-16">
        <div className="mx-auto max-w-6xl px-5 md:px-6">
          <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
                Weather insights designed for fast daily decisions.
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-slate-300">
                Check live city conditions, monitor hourly changes, and keep important locations ready for quick review.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="feature-card">
                <div className="mb-5 inline-flex rounded-2xl bg-cyan-300/10 p-3 text-cyan-200 ring-1 ring-cyan-200/15">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-black text-white">{title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-300">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/8 bg-slate-950 px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black text-white">Atmosphere</p>
            <p className="mt-1 text-xs font-medium text-slate-500">Real-time weather intelligence for modern workflows.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
            <span>Live conditions</span>
            <span>Hourly trends</span>
            <span>Saved locations</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
