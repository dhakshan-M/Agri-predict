import React from 'react';
import { translations } from '../i18n';
import { Sprout, ShieldCheck, Cpu, Droplets, Heart } from 'lucide-react';

export default function Footer({ lang }) {
  const t = translations[lang];

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-white font-bold text-base">
            <Sprout className="w-5 h-5 text-emerald-400" />
            <span>{t.app_title}</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            {lang === 'ta'
              ? 'விவசாயிகளின் வாழ்வாதாரத்தை மேம்படுத்தும் IoT உணரி மற்றும் செயற்கை நுண்ணறிவு தொழில்நுட்ப தளம்.'
              : 'Empowering smallholder and commercial farmers with real-time IoT root-zone telemetry, predictive weather intelligence, and precision agrochemical calculations.'}
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 flex items-center space-x-1.5">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>IoT Hardware Nodes</span>
          </h4>
          <ul className="space-y-1.5">
            <li>ESP32 Dual-Core Microcontroller</li>
            <li>Capacitive Soil Moisture Probe (v2.0)</li>
            <li>DS18B20 Sealed Soil Temp Sensor</li>
            <li>Optical NPK Spectrometer (mg/kg)</li>
            <li>Ultrasonic HC-SR04 Tank Level Meter</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 flex items-center space-x-1.5">
            <Droplets className="w-4 h-4 text-emerald-400" />
            <span>Scientific Agronomy</span>
          </h4>
          <ul className="space-y-1.5">
            <li>FAO-56 Penman-Monteith Evapotranspiration</li>
            <li>Tamil Nadu Agricultural University Standards</li>
            <li>Soil Health Card Deficit Formulation</li>
            <li>Tri-Band Stress Severity Warnings</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ta' ? 'அதிகாரப்பூர்வ அறிவிப்பு' : 'Agronomic Disclaimer'}</span>
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {lang === 'ta'
              ? 'அனைத்து அளவீடுகளும் உத்தேச வழிகாட்டுதல்களாகும். ரசாயன உரங்களை இடுவதற்கு முன் அதிகாரப்பூர்வ மண் ஆய்வு முடிவுகளை உறுதிப்படுத்தவும்.'
              : 'Fertilizer dosages and irrigation volumes are scientific model recommendations. Please conduct laboratory soil testing prior to commercial bulk application.'}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 px-4 text-center text-slate-500 text-[11px]">
        <span>© 2026 Crop Stress Telemetry & Advisory Platform • Built for Smart Agriculture Hackathon • English & தமிழ் Support</span>
      </div>
    </footer>
  );
}
