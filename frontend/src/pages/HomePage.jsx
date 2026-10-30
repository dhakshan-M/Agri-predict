import React from 'react';
import { translations } from '../i18n';
import { 
  Sprout, 
  Activity, 
  TrendingUp, 
  CloudRain, 
  Calculator, 
  Bot, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Droplet, 
  Cpu, 
  Languages, 
  Sparkles 
} from 'lucide-react';

export default function HomePage({ setActiveTab, lang, telemetry, weather, currentField }) {
  const t = translations[lang];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 text-white p-8 md:p-12 shadow-xl border border-emerald-700/40">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-10 bottom-0 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-800/80 border border-emerald-600/50 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'ta' ? 'அடுத்த தலைமுறை வேளாண் நுண்ணறிவு' : 'Next-Gen Agricultural Intelligence'}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {t.hero_title}
            </h1>

            <p className="text-emerald-100/90 text-sm md:text-base leading-relaxed max-w-2xl">
              {t.hero_subtitle}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center space-x-2 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold px-5 py-3 rounded-xl transition shadow-lg shadow-lime-400/20 transform hover:-translate-y-0.5"
              >
                <span>{t.explore_dashboard}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className="flex items-center space-x-2 bg-emerald-700/80 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-xl border border-emerald-500/40 transition hover:border-emerald-400"
              >
                <TrendingUp className="w-4 h-4 text-emerald-300" />
                <span>{t.learn_more}</span>
              </button>

              <button
                onClick={() => setActiveTab('calculator')}
                className="flex items-center space-x-2 bg-amber-500/90 hover:bg-amber-500 text-slate-950 font-semibold px-5 py-3 rounded-xl transition shadow-md"
              >
                <Calculator className="w-4 h-4" />
                <span>{t.nav_calculator}</span>
              </button>
            </div>

            {/* Quick highlight checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-emerald-700/60 text-xs text-emerald-200">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                <span>{lang === 'ta' ? 'IoT நேரடி உணரி' : 'IoT Live Telemetry'}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                <span>{lang === 'ta' ? 'மழை அபாய கணிப்பு' : 'Rainfall Risk Shield'}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                <span>{lang === 'ta' ? 'தமிழ் & ஆங்கில AI' : 'Tamil & English AI'}</span>
              </div>
            </div>
          </div>

          {/* Quick Telemetry Preview Card in Hero */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                  {lang === 'ta' ? 'தற்போதைய நிலம்' : 'Active Field Monitoring'}
                </span>
                <h3 className="text-sm font-bold truncate">
                  {lang === 'ta' && currentField?.name_ta ? currentField.name_ta : currentField?.name}
                </h3>
              </div>
              <div className="bg-emerald-400/20 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-300/30 flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                <span className="text-[11px] text-emerald-200 block">{t.soil_moisture}</span>
                <span className="text-2xl font-black text-white">
                  {telemetry?.readings?.soil_moisture ?? 68.4}%
                </span>
                <span className="text-[10px] text-lime-300 block font-medium">Optimal root hydration</span>
              </div>

              <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                <span className="text-[11px] text-emerald-200 block">{t.soil_temp}</span>
                <span className="text-2xl font-black text-white">
                  {telemetry?.readings?.soil_temperature ?? 28.2}°C
                </span>
                <span className="text-[10px] text-lime-300 block font-medium">Healthy microbial zone</span>
              </div>

              <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                <span className="text-[11px] text-emerald-200 block">{t.soil_ph}</span>
                <span className="text-2xl font-black text-white">
                  {telemetry?.readings?.soil_ph ?? 6.45}
                </span>
                <span className="text-[10px] text-lime-300 block font-medium">Ideal bioavailability</span>
              </div>

              <div className="bg-black/20 rounded-xl p-3 border border-white/10">
                <span className="text-[11px] text-emerald-200 block">{t.health_score}</span>
                <span className="text-2xl font-black text-lime-300">
                  {telemetry?.crop_health?.score ?? 94}/100
                </span>
                <span className="text-[10px] text-emerald-200 block font-medium">Low crop stress</span>
              </div>
            </div>

            {/* Weather alert banner inside card */}
            <div className="bg-amber-500/20 border border-amber-400/40 rounded-xl p-3 flex items-center space-x-3 text-xs">
              <CloudRain className="w-5 h-5 text-amber-300 shrink-0" />
              <div>
                <span className="font-bold text-amber-200 block">
                  {weather?.irrigation_recommendation?.[lang === 'ta' ? 'title_ta' : 'title_en'] ?? 'Rainfall Risk Alert'}
                </span>
                <span className="text-amber-100/80 text-[11px]">
                  {lang === 'ta' ? 'அடுத்த 48 மணி நேரத்தில் மழை வாய்ப்பு' : '48mm rainfall predicted within 48h. Irrigation delay advised.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Core Feature Cards */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">
            {t.key_capabilities}
          </h2>
          <p className="text-xs md:text-sm text-slate-500">
            {lang === 'ta'
              ? 'மண் ஆரோக்கியம், நீர் சேமிப்பு மற்றும் விளைச்சலை உறுதி செய்யும் 5 முக்கிய தூண்கள்'
              : 'End-to-end intelligent architecture connecting field sensors to automated decision support.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div 
            onClick={() => setActiveTab('soil')}
            className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-700 group-hover:text-white transition">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">{t.feat_1_title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed">{t.feat_1_desc}</p>
          </div>

          <div 
            onClick={() => setActiveTab('analytics')}
            className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-700 group-hover:text-white transition">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">{t.feat_2_title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed">{t.feat_2_desc}</p>
          </div>

          <div 
            onClick={() => setActiveTab('weather')}
            className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-700 group-hover:text-white transition">
              <CloudRain className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">{t.feat_3_title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed">{t.feat_3_desc}</p>
          </div>

          <div 
            onClick={() => setActiveTab('calculator')}
            className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-700 group-hover:text-white transition">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">{t.feat_4_title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed">{t.feat_4_desc}</p>
          </div>

          <div 
            onClick={() => setActiveTab('advisory')}
            className="group cursor-pointer bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-700 group-hover:text-white transition">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">{t.feat_5_title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed">{t.feat_5_desc}</p>
          </div>
        </div>
      </section>

      {/* System Architecture Flow Diagram */}
      <section className="bg-gradient-to-r from-emerald-50 via-white to-green-50 rounded-2xl p-6 md:p-8 border border-emerald-100">
        <h3 className="text-base font-bold text-emerald-900 mb-6 text-center">
          {lang === 'ta' ? 'அமைப்பின் தொழில்நுட்ப கட்டமைப்பு முறைமை' : 'End-to-End Agri-IoT & AI Processing Pipeline'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="bg-white p-4 rounded-xl shadow-xs border border-emerald-200/60 text-center space-y-2">
            <div className="w-8 h-8 mx-auto rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h4 className="font-bold text-slate-800 text-xs">IoT Field Probes</h4>
            <p className="text-[11px] text-slate-500">Capacitive Moisture, Temp, pH, Optical NPK & Ultrasonic distance</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs border border-emerald-200/60 text-center space-y-2">
            <div className="w-8 h-8 mx-auto rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h4 className="font-bold text-slate-800 text-xs">Edge Telemetry Node</h4>
            <p className="text-[11px] text-slate-500">ESP32 gateway with WiFi/GSM transmitting telemetry snapshots</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs border border-emerald-200/60 text-center space-y-2">
            <div className="w-8 h-8 mx-auto rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h4 className="font-bold text-slate-800 text-xs">Cloud AI & ML Engine</h4>
            <p className="text-[11px] text-slate-500">Scikit-Learn crop model, FAO-56 calculator & weather risk alerts</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs border border-emerald-200/60 text-center space-y-2">
            <div className="w-8 h-8 mx-auto rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <h4 className="font-bold text-slate-800 text-xs">Bilingual Farmer Action</h4>
            <p className="text-[11px] text-slate-500">Immediate Tamil & English advice with voice TTS & auto pump signals</p>
          </div>
        </div>
      </section>
    </div>
  );
}
