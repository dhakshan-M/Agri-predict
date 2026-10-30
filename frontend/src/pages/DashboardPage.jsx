import React, { useState } from 'react';
import { translations } from '../i18n';
import { 
  Droplet, 
  Thermometer, 
  TestTube, 
  Atom, 
  Sun, 
  CloudRain, 
  Activity, 
  Zap, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  ArrowUpRight,
  Gauge,
  Sliders,
  Power
} from 'lucide-react';

export default function DashboardPage({ lang, telemetry, weather, currentField, onRefreshTelemetry, setActiveTab }) {
  const t = translations[lang];
  const [motorOverride, setMotorOverride] = useState(null); // null = auto, true = manual ON, false = manual OFF
  const readings = telemetry?.readings || {};
  const cropHealth = telemetry?.crop_health || { score: 92, level: 'normal', status: 'Healthy' };

  const isMotorActive = motorOverride !== null 
    ? motorOverride 
    : telemetry?.irrigation?.motor_recommended;

  const getHealthBadge = () => {
    if (cropHealth.level === 'critical') {
      return {
        bg: 'bg-rose-50 border-rose-200 text-rose-800',
        dot: 'bg-rose-500',
        icon: AlertCircle,
        label: t.status_critical
      };
    } else if (cropHealth.level === 'warning') {
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-800',
        dot: 'bg-amber-500',
        icon: AlertTriangle,
        label: t.status_warning
      };
    }
    return {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      dot: 'bg-emerald-500',
      icon: CheckCircle,
      label: t.status_healthy
    };
  };

  const badge = getHealthBadge();

  return (
    <div className="space-y-8">
      {/* Top Header & Field Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
              {lang === 'ta' ? 'செயலில் உள்ள நிலம்' : 'Active Telemetry Node'}
            </span>
            <span className="text-xs text-slate-400">
              {telemetry?.timestamp ? `Updated: ${telemetry.timestamp}` : 'Real-time Live Sync'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">
            {lang === 'ta' && currentField?.name_ta ? currentField.name_ta : currentField?.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentField?.crop_display} • {currentField?.area} {currentField?.area_unit}s • {currentField?.soil_type} • {currentField?.growth_stage}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRefreshTelemetry}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            title="Poll immediate reading"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'ta' ? 'புதுப்பி' : 'Sync IoT'}</span>
          </button>

          <button
            onClick={() => setActiveTab('soil')}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
          >
            <span>{t.nav_soil}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Real-Time 8 Sensor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Soil Moisture */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.soil_moisture}</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-800">{readings.soil_moisture ?? 68.4}</span>
            <span className="text-sm font-bold text-slate-400">%</span>
          </div>
          {/* Progress gauge bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                (readings.soil_moisture || 68.4) < 45 ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(10, readings.soil_moisture || 68.4))}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>Target: 60 - 85%</span>
            <span className="text-emerald-600 font-semibold">Optimal</span>
          </div>
        </div>

        {/* 2. Soil Temperature */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.soil_temp}</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Thermometer className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-800">{readings.soil_temperature ?? 28.2}</span>
            <span className="text-sm font-bold text-slate-400">°C</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full rounded-full bg-amber-500 transition-all duration-500"
              style={{ width: `${Math.min(100, ((readings.soil_temperature || 28.2) / 45) * 100)}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>Optimal: 24 - 32°C</span>
            <span className="text-emerald-600 font-semibold">Normal</span>
          </div>
        </div>

        {/* 3. Soil pH */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.soil_ph}</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TestTube className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-800">{readings.soil_ph ?? 6.45}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
              Slightly Acidic
            </span>
          </div>
          <div className="w-full bg-gradient-to-r from-red-300 via-green-300 to-blue-300 h-2 rounded-full mt-3"></div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>Scale: 0 (Acidic) - 14 (Base)</span>
            <span className="text-emerald-600 font-semibold">Healthy Range</span>
          </div>
        </div>

        {/* 4. Crop Health Status */}
        <div className={`rounded-2xl p-5 border shadow-xs relative overflow-hidden ${badge.bg}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">{t.health_score}</span>
            <badge.icon className="w-5 h-5" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black">{cropHealth.score}/100</span>
            <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-white/70">
              {cropHealth.level}
            </span>
          </div>
          <p className="mt-2 text-xs font-medium line-clamp-1">{cropHealth.status}</p>
          <div className="mt-2 flex justify-between text-[11px] opacity-80">
            <span>Stress Assessment:</span>
            <span className="font-bold">{cropHealth.stress_factors?.length || 0} alerts</span>
          </div>
        </div>

        {/* 5. Nitrogen (N) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.nitrogen}</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Atom className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-800">{readings.nitrogen ?? 88.0}</span>
            <span className="text-xs font-bold text-slate-400">mg/kg</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full rounded-full bg-emerald-600"
              style={{ width: `${Math.min(100, ((readings.nitrogen || 88) / 120) * 100)}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>Target: 70 - 110 mg/kg</span>
            <span className="text-emerald-600 font-semibold">Adequate</span>
          </div>
        </div>

        {/* 6. Phosphorus (P) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.phosphorus}</span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Atom className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-800">{readings.phosphorus ?? 46.0}</span>
            <span className="text-xs font-bold text-slate-400">mg/kg</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full rounded-full bg-orange-500"
              style={{ width: `${Math.min(100, ((readings.phosphorus || 46) / 80) * 100)}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>Target: 35 - 60 mg/kg</span>
            <span className="text-emerald-600 font-semibold">Good</span>
          </div>
        </div>

        {/* 7. Potassium (K) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.potassium}</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Atom className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-800">{readings.potassium ?? 42.0}</span>
            <span className="text-xs font-bold text-slate-400">mg/kg</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full rounded-full bg-indigo-600"
              style={{ width: `${Math.min(100, ((readings.potassium || 42) / 70) * 100)}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>Target: 30 - 55 mg/kg</span>
            <span className="text-emerald-600 font-semibold">Sufficient</span>
          </div>
        </div>

        {/* 8. Current Weather & Rainfall */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weather & Rain</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <CloudRain className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-800">{weather?.current?.temp ?? 31.8}°C</span>
            <span className="text-xs font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded">
              {weather?.current?.condition ?? 'Cloudy'}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Humidity: {weather?.current?.humidity ?? 74}%</span>
              <span>Wind: {weather?.current?.wind_speed_kmh ?? 14} km/h</span>
            </div>
            <div className="flex justify-between font-semibold text-cyan-800">
              <span>Rain last 24h:</span>
              <span>{weather?.current?.rainfall_last_24h_mm ?? 18.5} mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* IoT Irrigation Motor Controller & Tank Level Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Automated Motor Controller Box */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Power className={`w-5 h-5 ${isMotorActive ? 'text-lime-400 animate-pulse' : 'text-slate-400'}`} />
              <h3 className="font-bold text-base">
                {lang === 'ta' ? 'ஸ்மார்ட் மோட்டார் மற்றும் பாசனக் கட்டுப்படுத்தி' : 'Smart IoT Motor & Irrigation Actuator'}
              </h3>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className={`px-2.5 py-1 rounded-full font-bold ${
                isMotorActive 
                  ? 'bg-lime-400 text-slate-950 shadow-sm shadow-lime-400/50' 
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {isMotorActive ? t.motor_running : t.motor_standby}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ta'
              ? 'மண் ஈரப்பதம் மற்றும் மழை முன்னறிவிப்பை ஒப்பிட்டு தானியங்கி முறையில் நீர் மோட்டார் இயக்கப்படுகிறது. விவசாயி தேவைக்கேற்ப நேரடியாகவும் இயக்கலாம்.'
              : 'The edge actuator operates via closed-loop feedback from root moisture sensors and weather forecast risk thresholds. Manual override commands take precedence.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block">Ultrasonic Tank Distance</span>
              <span className="text-xl font-bold text-white">{readings.ultrasonic_distance ?? 58.5} cm</span>
              <span className="text-[10px] text-emerald-400 block">Reservoir 78% full</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block">Solar Radiation GHI</span>
              <span className="text-xl font-bold text-white">{readings.solar_radiation ?? 615} W/m²</span>
              <span className="text-[10px] text-amber-300 block">Active photosynthetic light</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block">Sensor Bus Haunt Voltage</span>
              <span className="text-xl font-bold text-white">{readings.sensor_voltage ?? 1.54} V</span>
              <span className="text-[10px] text-lime-400 block">Telemetry signal stable</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-700/80 items-center justify-between">
            <div className="text-xs text-slate-400">
              <span>{lang === 'ta' ? 'மோட்டார் மேனுவல் இயக்கம்:' : 'Manual Motor Control:'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setMotorOverride(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  motorOverride === true
                    ? 'bg-lime-400 text-slate-950'
                    : 'bg-emerald-800 text-white hover:bg-emerald-700'
                }`}
              >
                {lang === 'ta' ? 'மோட்டார் ஆன் (ON)' : 'FORCE PUMP ON'}
              </button>
              <button
                onClick={() => setMotorOverride(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  motorOverride === false
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {lang === 'ta' ? 'மோட்டார் ஆஃப் (OFF)' : 'FORCE PUMP OFF'}
              </button>
              <button
                onClick={() => setMotorOverride(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-600 transition ${
                  motorOverride === null
                    ? 'bg-slate-800 text-lime-300 border-lime-400'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {lang === 'ta' ? 'தானியங்கி பயன்முறை (Auto)' : 'AUTO-STANDBY'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Weather & Advisory Callout */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-amber-800">
              <CloudRain className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {lang === 'ta' ? 'தானியங்கி பாசன முடிவு' : 'Automated Irrigation Rule'}
              </span>
            </div>

            <h4 className="text-base font-bold text-amber-950">
              {weather?.irrigation_recommendation?.[lang === 'ta' ? 'title_ta' : 'title_en'] ?? 'Rainfall Risk Alert'}
            </h4>

            <p className="text-xs text-amber-900/80 leading-relaxed">
              {weather?.irrigation_recommendation?.[lang === 'ta' ? 'description_ta' : 'description_en'] ?? 'Rainfall expected within 48h.'}
            </p>
          </div>

          <div className="pt-4 border-t border-amber-200/60 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('weather')}
              className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center space-x-1"
            >
              <span>{lang === 'ta' ? 'முழு வானிலை அறிக்கை' : 'View Rain Radar'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('advisory')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <span>{t.nav_advisory}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
