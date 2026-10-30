import React from 'react';
import { translations } from '../i18n';
import { 
  Layers, 
  Droplet, 
  Thermometer, 
  TestTube, 
  Atom, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function SoilMonitoringPage({ lang, telemetry, currentField }) {
  const t = translations[lang];
  const readings = telemetry?.readings || {
    soil_moisture: 68.4,
    soil_temperature: 28.2,
    soil_ph: 6.45,
    nitrogen: 88.0,
    phosphorus: 46.0,
    potassium: 42.0,
    ambient_humidity: 74.5,
    sensor_voltage: 1.54,
    evapotranspiration: 4.62
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>{t.soil_header}</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mt-1">
          {lang === 'ta' && currentField?.name_ta ? currentField.name_ta : currentField?.name}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {t.soil_sub} • {lang === 'ta' ? 'மண் வகை:' : 'Soil Classification:'} <strong>{currentField?.soil_type}</strong>
        </p>
      </div>

      {/* Primary Tri-Gauge: Moisture, Temp, pH */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Moisture Gauge */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">{t.soil_moisture}</h3>
            <div className="text-4xl font-black text-slate-800 mt-2">
              {readings.soil_moisture}%
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 inline-block mt-2">
              {readings.soil_moisture < 45 ? 'Deficit' : readings.soil_moisture > 80 ? 'Saturated' : 'Field Capacity'}
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 text-left space-y-1.5">
            <div className="flex justify-between">
              <span>Probe Depth:</span>
              <span className="font-semibold text-slate-800">15 - 30 cm</span>
            </div>
            <div className="flex justify-between">
              <span>Capacitive Frequency:</span>
              <span className="font-semibold text-slate-800">100 MHz AC</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-semibold text-emerald-600">Active Calibrated</span>
            </div>
          </div>
        </div>

        {/* Temperature Gauge */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">{t.soil_temp}</h3>
            <div className="text-4xl font-black text-slate-800 mt-2">
              {readings.soil_temperature}°C
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 inline-block mt-2">
              {readings.soil_temperature > 35 ? 'Thermal Stress' : 'Favorable Bio-activity'}
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 text-left space-y-1.5">
            <div className="flex justify-between">
              <span>Sensor Model:</span>
              <span className="font-semibold text-slate-800">DS18B20 1-Wire</span>
            </div>
            <div className="flex justify-between">
              <span>Accuracy:</span>
              <span className="font-semibold text-slate-800">±0.5°C</span>
            </div>
            <div className="flex justify-between">
              <span>Root Temp:</span>
              <span className="font-semibold text-emerald-600">Normal Range</span>
            </div>
          </div>
        </div>

        {/* Soil pH Gauge */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TestTube className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">{t.soil_ph}</h3>
            <div className="text-4xl font-black text-slate-800 mt-2">
              {readings.soil_ph}
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 inline-block mt-2">
              Slightly Acidic (6.0 - 6.8 Optimal)
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 text-left space-y-1.5">
            <div className="flex justify-between">
              <span>Electrode Bias:</span>
              <span className="font-semibold text-slate-800">-42.5 mV</span>
            </div>
            <div className="flex justify-between">
              <span>Nutrient Avail:</span>
              <span className="font-semibold text-emerald-600">High (N, P, K & Micro)</span>
            </div>
            <div className="flex justify-between">
              <span>Liming Need:</span>
              <span className="font-semibold text-slate-800">None</span>
            </div>
          </div>
        </div>
      </div>

      {/* NPK Macronutrient Detailed Balance */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
            <Atom className="w-5 h-5 text-emerald-700" />
            <span>{t.npk_title}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'ta'
              ? 'பயிரின் வேர் மண்டலத்தில் உள்ள தழைச்சத்து, மணிச்சத்து, சாம்பல் சத்து அளவீடுகள்'
              : 'Precision spectroscopy and ISE root zone readings compared with crop benchmark targets.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Nitrogen */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{t.nitrogen}</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                88.0 mg/kg
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Low (&lt;50)</span>
              <span className="font-bold text-emerald-700">Target: 70 - 110</span>
              <span>High (&gt;130)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Essential for leaf expansion, chlorophyll synthesis, and vegetative tiller production.
            </p>
          </div>

          {/* Phosphorus */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{t.phosphorus}</span>
              <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                46.0 mg/kg
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full rounded-full" style={{ width: '68%' }}></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Low (&lt;25)</span>
              <span className="font-bold text-orange-700">Target: 35 - 60</span>
              <span>High (&gt;75)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Stimulates vigorous root system development, early heading, and reproductive flowering.
            </p>
          </div>

          {/* Potassium */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">{t.potassium}</span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                42.0 mg/kg
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Low (&lt;20)</span>
              <span className="font-bold text-indigo-700">Target: 30 - 55</span>
              <span>High (&gt;70)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Enhances cellular turgor pressure, drought tolerance, and resistance against blast fungi.
            </p>
          </div>
        </div>
      </div>

      {/* IoT Hardware Diagnostics Box */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-sm">IoT Telemetry Hardware Status (ESP32 Station #04)</h4>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
            ALL NODES SYNCHRONIZED
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[11px]">Sensor Bus Voltage</span>
            <span className="text-base font-bold text-white mt-1 block">{readings.sensor_voltage} V</span>
            <span className="text-[10px] text-emerald-400">Regulated 3.3V Step</span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[11px]">Sampling Frequency</span>
            <span className="text-base font-bold text-white mt-1 block">Every 15 Sec</span>
            <span className="text-[10px] text-emerald-400">Live Telemetry</span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[11px]">Daily ETo Rate</span>
            <span className="text-base font-bold text-white mt-1 block">{readings.evapotranspiration} mm/day</span>
            <span className="text-[10px] text-emerald-400">Penman-Monteith</span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[11px]">WiFi RSSI Signal</span>
            <span className="text-base font-bold text-white mt-1 block">-62 dBm</span>
            <span className="text-[10px] text-emerald-400">Strong Link</span>
          </div>
        </div>
      </div>
    </div>
  );
}
