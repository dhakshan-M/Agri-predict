import React, { useState } from 'react';
import { translations } from '../i18n';
import { 
  CloudRain, 
  Sun, 
  Cloud, 
  CloudDrizzle, 
  CloudLightning, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Compass,
  Search
} from 'lucide-react';

export default function WeatherForecastPage({ lang, weather, telemetry, currentField, onSearchLocation }) {
  const t = translations[lang];
  const [locationInput, setLocationInput] = useState('Thanjavur, Tamil Nadu');

  const curr = weather?.current || {
    temp: 31.8,
    feels_like: 35.2,
    condition: "Scattered Clouds",
    humidity: 74,
    wind_speed_kmh: 14.5,
    rainfall_last_24h_mm: 18.5
  };

  const forecast = weather?.forecast_7_day || [
    { date: "Today", condition: "Scattered Clouds", temp_max: 33, temp_min: 24, rainfall_mm: 2.0, rain_probability: 25, humidity: 72 },
    { date: "Tomorrow", condition: "Light Rain Showers", temp_max: 31, temp_min: 23, rainfall_mm: 12.5, rain_probability: 65, humidity: 84 },
    { date: "+2 Days", condition: "Heavy Monsoonal Rain", temp_max: 28, temp_min: 22, rainfall_mm: 48.0, rain_probability: 90, humidity: 92 },
    { date: "+3 Days", condition: "Moderate Rain", temp_max: 29, temp_min: 22, rainfall_mm: 21.0, rain_probability: 70, humidity: 88 },
    { date: "+4 Days", condition: "Overcast", temp_max: 31, temp_min: 23, rainfall_mm: 4.0, rain_probability: 30, humidity: 78 },
    { date: "+5 Days", condition: "Sunny / Clear", temp_max: 34, temp_min: 24, rainfall_mm: 0.0, rain_probability: 10, humidity: 65 },
    { date: "+6 Days", condition: "Partly Cloudy", temp_max: 33, temp_min: 24, rainfall_mm: 0.0, rain_probability: 15, humidity: 68 }
  ];

  const rec = weather?.irrigation_recommendation || {
    action: "DELAY",
    title_en: "DELAY IRRIGATION - HEAVY RAIN EXPECTED",
    title_ta: "நீர்ப்பாசனத்தை தள்ளிப்போடுங்கள் - பலத்த மழை எதிர்பார்க்கப்படுகிறது",
    description_en: "Heavy rainfall totaling ~48mm is forecast within 48 hours. Suspend pump cycles.",
    description_ta: "அடுத்த 48 மணி நேரத்தில் ~48 மி.மீ வரை கனமழை பெய்ய வாய்ப்புள்ளது. மோட்டார் பாசனத்தை உடனே நிறுத்துங்கள்.",
    risk_level: "warning"
  };

  const getWeatherIcon = (cond) => {
    const c = cond.toLowerCase();
    if (c.includes('lightning') || c.includes('thunder')) return <CloudLightning className="w-6 h-6 text-amber-500" />;
    if (c.includes('rain') || c.includes('shower')) return <CloudRain className="w-6 h-6 text-blue-500" />;
    if (c.includes('drizzle')) return <CloudDrizzle className="w-6 h-6 text-cyan-500" />;
    if (c.includes('sun') || c.includes('clear')) return <Sun className="w-6 h-6 text-amber-400" />;
    return <Cloud className="w-6 h-6 text-slate-400" />;
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (locationInput.trim()) {
      onSearchLocation(locationInput);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header with Location Search */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-700 text-xs font-bold uppercase tracking-wider">
            <CloudRain className="w-4 h-4" />
            <span>{t.weather_header}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">
            {weather?.location || 'Thanjavur, Tamil Nadu'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.weather_sub}
          </p>
        </div>

        {/* Location selector form */}
        <form onSubmit={handleLocationSubmit} className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Enter District (e.g. Madurai, Coimbatore)"
              className="px-3 py-2 pl-8 text-xs border border-slate-300 rounded-xl focus:border-cyan-500 focus:outline-none w-56 md:w-64"
            />
            <Compass className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-semibold rounded-xl transition"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* AUTOMATED IRRIGATION DECISION HERO BANNER */}
      <div className={`rounded-2xl p-6 border shadow-md ${
        rec.action === 'DELAY'
          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-500'
          : rec.action === 'REVIEW'
          ? 'bg-gradient-to-r from-blue-700 to-cyan-800 text-white border-blue-600'
          : 'bg-gradient-to-r from-emerald-700 to-green-800 text-white border-emerald-600'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                {rec.action}: {lang === 'ta' ? 'தானியங்கி பாசன முடிவு' : 'Automated Irrigation Recommendation'}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-black">
              {lang === 'ta' ? rec.title_ta : rec.title_en}
            </h3>
            <p className="text-xs md:text-sm text-white/90 leading-relaxed max-w-3xl">
              {lang === 'ta' ? rec.description_ta : rec.description_en}
            </p>
          </div>

          <div className="bg-black/20 p-4 rounded-xl text-center shrink-0 border border-white/10">
            <span className="text-[11px] uppercase tracking-wider block opacity-80">Next 48h Rain</span>
            <span className="text-3xl font-black">48.0 mm</span>
            <span className="text-[10px] block text-amber-200 font-semibold">High Infiltration Risk</span>
          </div>
        </div>
      </div>

      {/* Current Conditions Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Sun className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Temperature</span>
            <span className="text-2xl font-black text-slate-800">{curr.temp}°C</span>
            <span className="text-[11px] text-slate-400 block">Feels like {curr.feels_like}°C</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Droplets className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Relative Humidity</span>
            <span className="text-2xl font-black text-slate-800">{curr.humidity}%</span>
            <span className="text-[11px] text-blue-600 font-medium block">High moisture air</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Wind className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Wind Velocity</span>
            <span className="text-2xl font-black text-slate-800">{curr.wind_speed_kmh} km/h</span>
            <span className="text-[11px] text-slate-400 block">Gentle breeze (SSW)</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <CloudRain className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Past 24h Rain</span>
            <span className="text-2xl font-black text-slate-800">{curr.rainfall_last_24h_mm} mm</span>
            <span className="text-[11px] text-cyan-700 font-semibold block">Cumulative gauge</span>
          </div>
        </div>
      </div>

      {/* 7-Day Weather Forecast Horizontal Cards */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-cyan-600" />
            <span>{t.next_7_days}</span>
          </h3>
          <span className="text-xs text-slate-400">Total 7-Day Rainfall: ~87.5 mm</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecast.map((day, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border text-center space-y-2 transition ${
                day.rainfall_mm >= 20
                  ? 'bg-cyan-50/70 border-cyan-300 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200'
              }`}
            >
              <span className="text-xs font-bold text-slate-700 block">{day.date}</span>
              <div className="flex justify-center py-1">
                {getWeatherIcon(day.condition)}
              </div>
              <p className="text-[11px] font-medium text-slate-600 line-clamp-1">{day.condition}</p>
              
              <div className="pt-1 border-t border-slate-200 text-xs">
                <span className="font-bold text-slate-800">{day.temp_max}°</span>
                <span className="text-slate-400 ml-1">/ {day.temp_min}°</span>
              </div>

              <div className="bg-white rounded-md py-1 px-1.5 text-[10px] text-cyan-800 font-bold border border-cyan-100">
                <span>🌧️ {day.rainfall_mm} mm</span>
                <span className="block text-[9px] text-slate-400 font-normal">({day.rain_probability}% prob)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
