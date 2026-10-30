import React, { useState } from 'react';
import { translations } from '../i18n';
import { 
  Calculator, 
  Droplet, 
  Atom, 
  Sparkles, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { calculateRequirements } from '../api';

export default function CalculatorPage({ lang, telemetry, currentField }) {
  const t = translations[lang];

  // Form State
  const [cropName, setCropName] = useState(currentField?.crop || 'rice');
  const [landArea, setLandArea] = useState(currentField?.area || 2.5);
  const [areaUnit, setAreaUnit] = useState(currentField?.area_unit || 'Acre');
  const [soilMoisture, setSoilMoisture] = useState(telemetry?.readings?.soil_moisture || 68.4);
  const [soilN, setSoilN] = useState(telemetry?.readings?.nitrogen || 88.0);
  const [soilP, setSoilP] = useState(telemetry?.readings?.phosphorus || 46.0);
  const [soilK, setSoilK] = useState(telemetry?.readings?.potassium || 42.0);
  const [growthStage, setGrowthStage] = useState(currentField?.growth_stage || 'Mid stage');
  const [soilType, setSoilType] = useState(currentField?.soil_type || 'Clay Loam');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const cropsList = [
    { id: 'rice', name: 'Paddy / Rice (நெல்)' },
    { id: 'maize', name: 'Maize (மக்காச்சோளம்)' },
    { id: 'coconut', name: 'Coconut (தென்னை)' },
    { id: 'banana', name: 'Banana (வாழை)' },
    { id: 'cotton', name: 'Cotton (பருத்தி)' },
    { id: 'sugarcane', name: 'Sugarcane (கரும்பு)' },
    { id: 'tomato', name: 'Tomato (தக்காளி)' },
    { id: 'blackgram', name: 'Blackgram (உளுந்து)' }
  ];

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await calculateRequirements({
        crop_name: cropName,
        land_area: parseFloat(landArea),
        area_unit: areaUnit,
        soil_moisture: parseFloat(soilMoisture),
        N: parseFloat(soilN),
        P: parseFloat(soilP),
        K: parseFloat(soilK),
        growth_stage: growthStage,
        soil_type: soilType
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <Calculator className="w-4 h-4" />
          <span>{t.calc_header}</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mt-1">
          {lang === 'ta' ? 'விஞ்ஞானபூர்வ உரம் & நீர்ப்பாசன கணக்கீடு' : 'Precision Agronomic Dosage Engine'}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {t.calc_sub}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2 pb-2 border-b border-slate-100">
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>{lang === 'ta' ? 'நிலம் & உணரி அளவீடுகள்' : 'Field Parameters & Soil Data'}</span>
          </h3>

          <form onSubmit={handleCalculate} className="space-y-4 text-xs">
            {/* Crop Select */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.select_crop}</label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-600"
              >
                {cropsList.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Land Area & Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.land_area}</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-600 font-bold"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.area_unit}</label>
                <select
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-emerald-600"
                >
                  <option value="Acre">Acre (ஏக்கர்)</option>
                  <option value="Hectare">Hectare (ஹெக்டேர்)</option>
                </select>
              </div>
            </div>

            {/* Soil Moisture */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700">{t.current_soil_moist}</label>
                <span className="font-bold text-blue-600">{soilMoisture}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(e.target.value)}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Pre-filled from root capacitive sensor</span>
            </div>

            {/* NPK Inputs */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-semibold text-emerald-800 mb-1">N (mg/kg)</label>
                <input
                  type="number"
                  value={soilN}
                  onChange={(e) => setSoilN(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 font-bold outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-orange-800 mb-1">P (mg/kg)</label>
                <input
                  type="number"
                  value={soilP}
                  onChange={(e) => setSoilP(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 font-bold outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-indigo-800 mb-1">K (mg/kg)</label>
                <input
                  type="number"
                  value={soilK}
                  onChange={(e) => setSoilK(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-800 font-bold outline-none"
                />
              </div>
            </div>

            {/* Growth Stage & Soil Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.growth_stage}</label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-800 outline-none"
                >
                  <option value="Initial Stage">Initial Stage (நாற்று பருவம்)</option>
                  <option value="Development Stage">Development Stage (வளர்ச்சிப் பருவம்)</option>
                  <option value="Mid stage">Mid stage (பூக்கும் / கதிர் பருவம்)</option>
                  <option value="Last stage">Last stage (முதிர்ச்சி / அறுவடை)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.soil_type}</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-800 outline-none"
                >
                  <option value="Clay Loam">Clay Loam (களிமண் கலவை)</option>
                  <option value="Sandy Loam">Sandy Loam (மணல் கலவை)</option>
                  <option value="Red Soil">Red Soil (செம்மண்)</option>
                  <option value="Black Soil">Black Soil (கரிசல் மண்)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition shadow-md shadow-emerald-700/20 text-xs flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-lime-300" />
              <span>{loading ? 'Calculating...' : t.btn_calculate}</span>
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-4">
          {!result ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 space-y-3">
              <Calculator className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">
                {lang === 'ta' ? 'அளவீடுகளை தேர்வு செய்து "தேவையை கணக்கிடுக" பொத்தானை அழுத்தவும்' : 'Enter field parameters and click "Calculate Scientific Dosage" to view verified agronomic recommendations.'}
              </p>
              <p className="text-xs text-slate-400">
                Estimates include FAO-56 crop coefficients and nutrient deficit compensation.
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Water Requirement Card */}
              <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-blue-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Droplet className="w-5 h-5 text-blue-400" />
                    <span className="text-xs uppercase font-bold tracking-wider text-blue-200">
                      {t.rec_water}
                    </span>
                  </div>
                  <span className="text-xs font-bold bg-blue-500/30 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                    3-Day Cycle
                  </span>
                </div>

                <div className="flex items-baseline space-x-3">
                  <span className="text-4xl font-black text-white">
                    {result.water_recommendation?.volume_litres?.toLocaleString()}
                  </span>
                  <span className="text-xl font-bold text-blue-300">Litres</span>
                  <span className="text-xs text-blue-200/80">
                    (~{result.water_recommendation?.volume_m3} m³ volume)
                  </span>
                </div>

                <p className="text-xs text-blue-100/90 leading-relaxed">
                  <strong>Frequency:</strong> {lang === 'ta' ? result.water_recommendation?.irrigation_frequency_ta : result.water_recommendation?.irrigation_frequency}
                </p>
              </div>

              {/* Fertilizer Split Breakdown Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Atom className="w-5 h-5 text-emerald-700" />
                    <h4 className="font-bold text-slate-800 text-sm">{t.rec_fertilizer}</h4>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Total: {result.fertilizer_recommendation?.total_fertilizer_kg} kg
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-center">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase block">Urea (46% N)</span>
                    <span className="text-2xl font-black text-emerald-950 mt-1 block">
                      {result.fertilizer_recommendation?.urea_kg} kg
                    </span>
                    <span className="text-[10px] text-emerald-700 block">Nitrogen booster</span>
                  </div>

                  <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-3.5 text-center">
                    <span className="text-[11px] font-bold text-orange-800 uppercase block">DAP (18-46-0)</span>
                    <span className="text-2xl font-black text-orange-950 mt-1 block">
                      {result.fertilizer_recommendation?.dap_kg} kg
                    </span>
                    <span className="text-[10px] text-orange-700 block">Phosphorus & root initiator</span>
                  </div>

                  <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3.5 text-center">
                    <span className="text-[11px] font-bold text-indigo-800 uppercase block">MOP Potash (60%)</span>
                    <span className="text-2xl font-black text-indigo-950 mt-1 block">
                      {result.fertilizer_recommendation?.mop_potash_kg} kg
                    </span>
                    <span className="text-[10px] text-indigo-700 block">Potassium grain filler</span>
                  </div>
                </div>

                {/* Application Timing Schedule */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    <span>{t.application_schedule}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {lang === 'ta' 
                      ? result.fertilizer_recommendation?.application_schedule_ta 
                      : result.fertilizer_recommendation?.application_schedule_en}
                  </p>
                </div>

                {/* Scientific Explanation */}
                <div className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                  <p>
                    {lang === 'ta' 
                      ? result.scientific_explanation?.ta 
                      : result.scientific_explanation?.en}
                  </p>
                </div>
              </div>

              {/* Mandatory Agronomic Disclaimer Alert */}
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start space-x-3 text-xs text-amber-900">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block uppercase tracking-wider text-[11px] text-amber-950">
                    {t.agri_disclaimer}
                  </span>
                  <p className="leading-relaxed">
                    {lang === 'ta'
                      ? result.agronomic_disclaimer?.ta
                      : result.agronomic_disclaimer?.en}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
