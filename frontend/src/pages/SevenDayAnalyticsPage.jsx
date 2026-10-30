import React, { useState } from 'react';
import { translations } from '../i18n';
import { 
  TrendingUp, 
  Bot, 
  Droplet, 
  Thermometer, 
  TestTube, 
  Atom, 
  Calendar,
  Sparkles,
  Info,
  Table as TableIcon,
  BarChart3,
  Volume2,
  CloudRain,
  CheckCircle2
} from 'lucide-react';
import { speakText } from '../api';

// Full registration of Chart.js elements & controllers
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(...registerables);

export default function SevenDayAnalyticsPage({ lang, historyData, currentField }) {
  const t = translations[lang];
  const [activeMetric, setActiveMetric] = useState('moisture'); // 'moisture', 'temp', 'ph', 'npk', 'rain'
  const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'table'
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Fallback 7-day data if historyData is still loading
  const history = historyData?.history?.length ? historyData.history : [
    { date: "Oct 24", full_date: "2026-10-24", soil_moisture: 73.0, soil_temperature: 26.8, soil_ph: 6.50, nitrogen: 90.0, phosphorus: 46.0, potassium: 42.0, rainfall_mm: 14.2 },
    { date: "Oct 25", full_date: "2026-10-25", soil_moisture: 70.0, soil_temperature: 27.5, soil_ph: 6.55, nitrogen: 88.0, phosphorus: 47.0, potassium: 41.0, rainfall_mm: 8.0 },
    { date: "Oct 26", full_date: "2026-10-26", soil_moisture: 67.0, soil_temperature: 28.8, soil_ph: 6.46, nitrogen: 86.0, phosphorus: 45.0, potassium: 40.0, rainfall_mm: 0.0 },
    { date: "Oct 27", full_date: "2026-10-27", soil_moisture: 63.0, soil_temperature: 29.5, soil_ph: 6.52, nitrogen: 83.0, phosphorus: 44.0, potassium: 39.0, rainfall_mm: 0.0 },
    { date: "Oct 28", full_date: "2026-10-28", soil_moisture: 60.0, soil_temperature: 29.1, soil_ph: 6.42, nitrogen: 81.0, phosphorus: 43.0, potassium: 38.0, rainfall_mm: 0.0 },
    { date: "Oct 29", full_date: "2026-10-29", soil_moisture: 72.0, soil_temperature: 28.2, soil_ph: 6.46, nitrogen: 88.0, phosphorus: 46.0, potassium: 41.0, rainfall_mm: 18.5 },
    { date: "Oct 30", full_date: "2026-10-30", soil_moisture: 68.4, soil_temperature: 28.2, soil_ph: 6.45, nitrogen: 88.0, phosphorus: 46.0, potassium: 42.0, rainfall_mm: 4.2 }
  ];

  const labels = history.map(h => h.date);

  // Derived 7-Day Statistics
  const avgMoisture = (history.reduce((acc, h) => acc + h.soil_moisture, 0) / history.length).toFixed(1);
  const minTemp = Math.min(...history.map(h => h.soil_temperature));
  const maxTemp = Math.max(...history.map(h => h.soil_temperature));
  const avgPh = (history.reduce((acc, h) => acc + h.soil_ph, 0) / history.length).toFixed(2);
  const totalRain = history.reduce((acc, h) => acc + h.rainfall_mm, 0).toFixed(1);

  // 1. Moisture Chart Data
  const moistureChartData = {
    labels,
    datasets: [
      {
        type: 'line',
        label: `${t.soil_moisture} (%)`,
        data: history.map(h => h.soil_moisture),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#1d4ed8',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        yAxisID: 'yMoist'
      },
      {
        type: 'bar',
        label: 'Precipitation / Rain (mm)',
        data: history.map(h => h.rainfall_mm),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.65)',
        borderRadius: 6,
        yAxisID: 'yRain'
      }
    ]
  };

  // 2. Temperature Chart Data
  const tempChartData = {
    labels,
    datasets: [
      {
        label: `${t.soil_temp} (°C)`,
        data: history.map(h => h.soil_temperature),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.18)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#b45309',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6
      }
    ]
  };

  // 3. Soil pH Chart Data
  const phChartData = {
    labels,
    datasets: [
      {
        label: `${t.soil_ph} Level`,
        data: history.map(h => h.soil_ph),
        borderColor: '#9333ea',
        backgroundColor: 'rgba(147, 51, 234, 0.15)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#7e22ce',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6
      }
    ]
  };

  // 4. NPK Nutrients Chart Data
  const npkChartData = {
    labels,
    datasets: [
      {
        label: 'Nitrogen (N) mg/kg',
        data: history.map(h => h.nitrogen),
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: '#15803d'
      },
      {
        label: 'Phosphorus (P) mg/kg',
        data: history.map(h => h.phosphorus),
        borderColor: '#ea580c',
        backgroundColor: 'rgba(234, 88, 12, 0.1)',
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: '#c2410c'
      },
      {
        label: 'Potassium (K) mg/kg',
        data: history.map(h => h.potassium),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: '#3730a3'
      }
    ]
  };

  // 5. Rainfall Only Bar Chart
  const rainChartData = {
    labels,
    datasets: [
      {
        label: 'Daily Rainfall (mm)',
        data: history.map(h => h.rainfall_mm),
        backgroundColor: '#0284c7',
        borderRadius: 8
      }
    ]
  };

  // Common Responsive Chart Options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 12, font: { size: 12, weight: '600' }, color: '#334155' }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        cornerRadius: 10,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: { color: '#64748b', font: { weight: '600' } }
      },
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: { color: '#64748b' }
      }
    }
  };

  // Moisture dual axis chart options
  const moistureOptions = {
    ...commonOptions,
    scales: {
      x: commonOptions.scales.x,
      yMoist: {
        type: 'linear',
        position: 'left',
        min: 30,
        max: 100,
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        title: { display: true, text: 'Soil Moisture (%)', color: '#2563eb', font: { weight: 'bold' } },
        ticks: { color: '#2563eb' }
      },
      yRain: {
        type: 'linear',
        position: 'right',
        min: 0,
        max: 30,
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Rainfall (mm)', color: '#06b6d4', font: { weight: 'bold' } },
        ticks: { color: '#06b6d4' }
      }
    }
  };

  const handleAudioPlay = () => {
    setIsSpeaking(true);
    const explanationText = lang === 'ta'
      ? (historyData?.ai_explanation?.ta || "கடந்த 7 நாட்களில் மண் ஈரப்பதம் சீராக உறிஞ்சப்பட்டு, 18.5 மி.மீ மழையால் மீண்டும் பாதுகாப்பான நிலையை எட்டியுள்ளது.")
      : (historyData?.ai_explanation?.en || "Over the last 7 days, soil moisture showed a natural depletion cycle followed by rapid replenishment from precipitation.");
    
    speakText(explanationText, lang);
    setTimeout(() => setIsSpeaking(false), 6000);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>{t.analytics_header}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mt-1">
            {lang === 'ta' && currentField?.name_ta ? currentField.name_ta : currentField?.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.analytics_sub} • {lang === 'ta' ? 'கடந்த 7 நாட்கள் தரவுகள்' : 'Continuous 7-Day Historical Sensor Audit'}
          </p>
        </div>

        {/* View Mode Toggle (Chart vs Data Table) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('chart')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'chart'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{lang === 'ta' ? 'வரைபடம்' : 'Chart View'}</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'table'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>{lang === 'ta' ? 'அட்டவணை' : 'Data Table'}</span>
          </button>
        </div>
      </div>

      {/* 5 High-Impact 7-Day Stat Summary Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">7-Day Avg Moisture</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">{avgMoisture}%</span>
          <span className="text-[10px] text-emerald-600 font-medium">Optimal root zone</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Temp Range</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{minTemp}° - {maxTemp}°C</span>
          <span className="text-[10px] text-slate-400 font-medium">No thermal scorch</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Mean Soil pH</span>
          <span className="text-2xl font-black text-purple-600 mt-1 block">{avgPh}</span>
          <span className="text-[10px] text-emerald-600 font-medium">Nutrient accessible</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">7-Day Cumulative Rain</span>
          <span className="text-2xl font-black text-cyan-700 mt-1 block">{totalRain} mm</span>
          <span className="text-[10px] text-cyan-600 font-medium">3 rainy episodes</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Nitrogen Balance</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">88 mg/kg</span>
          <span className="text-[10px] text-emerald-600 font-medium">Vigorous tillering</span>
        </div>
      </div>

      {/* Main Interactive Graph or Tabular View */}
      {viewMode === 'chart' ? (
        <div className="space-y-4">
          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveMetric('moisture')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                activeMetric === 'moisture'
                  ? 'bg-blue-600 text-white shadow-blue-500/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Droplet className="w-4 h-4" />
              <span>{t.soil_moisture} & Rainfall</span>
            </button>

            <button
              onClick={() => setActiveMetric('temp')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                activeMetric === 'temp'
                  ? 'bg-amber-600 text-white shadow-amber-500/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Thermometer className="w-4 h-4" />
              <span>{t.soil_temp} Curve</span>
            </button>

            <button
              onClick={() => setActiveMetric('ph')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                activeMetric === 'ph'
                  ? 'bg-purple-600 text-white shadow-purple-500/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <TestTube className="w-4 h-4" />
              <span>{t.soil_ph} Variations</span>
            </button>

            <button
              onClick={() => setActiveMetric('npk')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                activeMetric === 'npk'
                  ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Atom className="w-4 h-4" />
              <span>NPK Nutrient Balance</span>
            </button>

            <button
              onClick={() => setActiveMetric('rain')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                activeMetric === 'rain'
                  ? 'bg-cyan-700 text-white shadow-cyan-700/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <CloudRain className="w-4 h-4" />
              <span>Precipitation (mm)</span>
            </button>
          </div>

          {/* Interactive Chart Canvas Container */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                <span>
                  {activeMetric === 'moisture' && `${t.soil_moisture} vs Precipitation History`}
                  {activeMetric === 'temp' && `${t.soil_temp} Thermal Fluctuation Curve`}
                  {activeMetric === 'ph' && `${t.soil_ph} Equilibrium Stability`}
                  {activeMetric === 'npk' && 'NPK Nutrient Absorption Progression'}
                  {activeMetric === 'rain' && 'Daily Rainfall Events (mm)'}
                </span>
              </h3>
              <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Last 7 Days (Oct 24 - Oct 30)</span>
              </span>
            </div>

            <div className="h-80 w-full relative">
              {activeMetric === 'moisture' && (
                <Line data={moistureChartData} options={moistureOptions} />
              )}
              {activeMetric === 'temp' && (
                <Line data={tempChartData} options={commonOptions} />
              )}
              {activeMetric === 'ph' && (
                <Line data={phChartData} options={commonOptions} />
              )}
              {activeMetric === 'npk' && (
                <Line data={npkChartData} options={commonOptions} />
              )}
              {activeMetric === 'rain' && (
                <Bar data={rainChartData} options={commonOptions} />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Tabular Data View for Detailed Audit */
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <TableIcon className="w-4 h-4 text-emerald-700" />
              <span>Daily Telemetry Sensor Log (7-Day Chronological Data)</span>
            </h3>
            <span className="text-xs text-slate-400">7 Verified Daily Readings</span>
          </div>

          <table className="w-full text-xs text-left border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold">
              <tr>
                <th className="p-3 border-b">Timeline</th>
                <th className="p-3 border-b text-blue-700">Moisture (%)</th>
                <th className="p-3 border-b text-amber-700">Temp (°C)</th>
                <th className="p-3 border-b text-purple-700">pH Level</th>
                <th className="p-3 border-b text-emerald-700">Nitrogen (N)</th>
                <th className="p-3 border-b text-orange-700">Phosphorus (P)</th>
                <th className="p-3 border-b text-indigo-700">Potassium (K)</th>
                <th className="p-3 border-b text-cyan-700">Rain (mm)</th>
                <th className="p-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {history.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="p-3 font-bold">{row.date}</td>
                  <td className="p-3 font-bold text-blue-600">{row.soil_moisture}%</td>
                  <td className="p-3 font-semibold text-amber-600">{row.soil_temperature}°C</td>
                  <td className="p-3 font-semibold text-purple-600">{row.soil_ph}</td>
                  <td className="p-3 font-semibold text-emerald-600">{row.nitrogen} mg/kg</td>
                  <td className="p-3 font-semibold text-orange-600">{row.phosphorus} mg/kg</td>
                  <td className="p-3 font-semibold text-indigo-600">{row.potassium} mg/kg</td>
                  <td className="p-3 font-bold text-cyan-700">{row.rainfall_mm} mm</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Normal
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* AI-Generated Soil Explanation Card (English & Tamil with Audio) */}
      <div className="bg-gradient-to-br from-emerald-900 to-green-950 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-emerald-700/50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-lime-300" />
            <h4 className="font-bold text-base text-white">
              {t.ai_interpretation}
            </h4>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleAudioPlay}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                isSpeaking
                  ? 'bg-lime-400 text-slate-950 animate-pulse'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white'
              }`}
              title="Listen to 7-Day AI explanation aloud"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeaking ? 'Speaking...' : (lang === 'ta' ? 'கேளுங்கள்' : 'Listen')}</span>
            </button>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-lime-400 text-emerald-950">
              {lang === 'ta' ? 'தானியங்கி வேளாண் பகுப்பாய்வு' : 'AI Reasoning'}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 text-xs md:text-sm leading-relaxed text-emerald-100">
          <p>
            {lang === 'ta'
              ? (historyData?.ai_explanation?.ta || "கடந்த 7 நாட்களில் மண் ஈரப்பதம் சீராக உறிஞ்சப்பட்டு, 18.5 மி.மீ மழையால் மீண்டும் பாதுகாப்பான நிலையை எட்டியுள்ளது. பயிர் வேர்களின் ஊட்டச்சத்து உறிஞ்சுதல் சிறப்பாக உள்ளது. தழைச்சத்து பயன்பாடு ஆரோக்கியமான பயிர் வளர்ச்சியை காட்டுகிறது.")
              : (historyData?.ai_explanation?.en || "Over the last 7 days in Cauvery Delta, soil moisture showed active root hydration and replenishment from intermittent rainfall (18.5mm). Soil temperature fluctuated within an ideal metabolic window (26.8°C to 29.5°C), maintaining active root absorption. Nitrogen experienced natural crop uptake, indicating healthy tillering progress.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-300 font-medium block">Moisture Volatility</span>
              <span className="text-lime-300 font-bold">Stable (Hydration maintained)</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-300 font-medium block">Thermal Heat Stress</span>
              <span className="text-lime-300 font-bold">None detected (&lt;32°C max)</span>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-300 font-medium block">Bioavailability Index</span>
              <span className="text-lime-300 font-bold">High (pH 6.42 - 6.55)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
