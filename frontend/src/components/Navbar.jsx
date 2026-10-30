import React from 'react';
import { translations } from '../i18n';
import { 
  Sprout, 
  LayoutDashboard, 
  Layers, 
  TrendingUp, 
  CloudRain, 
  Calculator, 
  Bot, 
  Bell, 
  User, 
  Languages, 
  MapPin, 
  Radio 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, lang, setLang, fields, currentFieldId, setCurrentFieldId }) {
  const t = translations[lang];

  const navItems = [
    { id: 'home', label: t.nav_home, icon: Sprout },
    { id: 'dashboard', label: t.nav_dashboard, icon: LayoutDashboard },
    { id: 'soil', label: t.nav_soil, icon: Layers },
    { id: 'analytics', label: t.nav_analytics, icon: TrendingUp },
    { id: 'weather', label: t.nav_weather, icon: CloudRain },
    { id: 'calculator', label: t.nav_calculator, icon: Calculator },
    { id: 'advisory', label: t.nav_advisory, icon: Bot },
    { id: 'reports', label: t.nav_reports, icon: Bell },
    { id: 'profile', label: t.nav_profile, icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      {/* Top Banner Ticker */}
      <div className="bg-emerald-800 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
            </span>
            <span className="font-semibold tracking-wide text-emerald-200">
              {t.live_badge}:
            </span>
            <span>ESP32 Telemetry Gateway Active (Ch-104 Node)</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-emerald-100">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>{t.field_select}</span>
              <select 
                value={currentFieldId} 
                onChange={(e) => setCurrentFieldId(e.target.value)}
                className="bg-emerald-900 text-emerald-100 text-xs rounded px-2 py-0.5 border border-emerald-700 outline-none cursor-pointer hover:bg-emerald-950 transition"
              >
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {lang === 'ta' && f.name_ta ? f.name_ta : f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Switcher Button */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
              className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-600 px-2.5 py-0.5 rounded text-white font-medium transition shadow-xs"
              title="Toggle Language / மொழியை மாற்றுக"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{t.language_btn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none group-hover:text-emerald-700 transition">
                {t.app_title}
              </h1>
              <span className="hidden sm:inline-block text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                AI + IoT 2.0
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden md:block">
              {t.app_subtitle}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/30'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
