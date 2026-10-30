import React, { useState } from 'react';
import { translations } from '../i18n';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  PlusCircle, 
  Layers, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Sprout 
} from 'lucide-react';

export default function AuthProfilePage({ lang, fields, currentFieldId, setCurrentFieldId, onAddField }) {
  const t = translations[lang];
  const [isLoggedIn, setIsLoggedIn] = useState(true); // default logged in for smooth hackathon demo
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  
  // Login form state
  const [phone, setPhone] = useState('+91 98421 54321');
  const [password, setPassword] = useState('farmer123');

  // Add field modal form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldNameTa, setNewFieldNameTa] = useState('');
  const [newLocation, setNewLocation] = useState('Coimbatore, Tamil Nadu');
  const [newCrop, setNewCrop] = useState('banana');
  const [newArea, setNewArea] = useState(2.0);
  const [newSoil, setNewSoil] = useState('Red Loam');
  const [newStage, setNewStage] = useState('Vegetative Stage');

  const farmerProfile = {
    name: 'Selvam Murugan',
    name_ta: 'செல்வம் முருகன்',
    phone: '+91 98421 54321',
    email: 'selvam.farmer@smartagri.org',
    district: 'Thanjavur, Tamil Nadu',
    totalAcres: 10.5,
    aadhaar_masked: 'XXXX-XXXX-4819',
    soilHealthCardId: 'SHC-TN-2026-9042'
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newFieldName) return;

    onAddField({
      name: newFieldName,
      name_ta: newFieldNameTa || newFieldName,
      location: newLocation,
      crop: newCrop,
      crop_display: newCrop.toUpperCase(),
      area: parseFloat(newArea),
      area_unit: 'Acre',
      soil_type: newSoil,
      growth_stage: newStage
    });

    setNewFieldName('');
    setNewFieldNameTa('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <User className="w-4 h-4" />
          <span>{lang === 'ta' ? 'விவசாயி சுயவிவரம் மற்றும் நில மேலாண்மை' : 'Farmer Profile & Multi-Field Management'}</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mt-1">
          {lang === 'ta' ? farmerProfile.name_ta : farmerProfile.name}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {farmerProfile.district} • Soil Health Card ID: <strong>{farmerProfile.soilHealthCardId}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Farmer Credentials & Details */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-emerald-700/20">
              SM
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                {lang === 'ta' ? farmerProfile.name_ta : farmerProfile.name}
              </h3>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                Verified Cultivator
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Phone className="w-4 h-4 text-emerald-700" />
              <div>
                <span className="text-slate-400 block text-[10px]">Contact Mobile</span>
                <span className="font-semibold text-slate-700">{farmerProfile.phone}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Mail className="w-4 h-4 text-emerald-700" />
              <div>
                <span className="text-slate-400 block text-[10px]">Email Address</span>
                <span className="font-semibold text-slate-700">{farmerProfile.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <div>
                <span className="text-slate-400 block text-[10px]">District & State</span>
                <span className="font-semibold text-slate-700">{farmerProfile.district}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <div>
                <span className="text-slate-400 block text-[10px]">Registered Land Holding</span>
                <span className="font-semibold text-slate-700">{farmerProfile.totalAcres} Acres ({fields.length} Active Blocks)</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            Account authenticated with AgriStack & National Farmer Registry database.
          </div>
        </div>

        {/* Right Column: Multi-Field Monitoring & Switcher */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                {lang === 'ta' ? 'கண்காணிக்கப்படும் நிலப் பிரிவுகள்' : 'Monitored Agricultural Fields'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'ta' ? 'டாஷ்போர்டில் பார்க்க விரும்பும் நிலத்தை தேர்வு செய்யவும்' : 'Select a field to switch telemetry stream and tailored advisories'}
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'ta' ? 'புதிய நிலம் சேர்' : 'Add Field'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field) => {
              const isSelected = field.id === currentFieldId;

              return (
                <div
                  key={field.id}
                  onClick={() => setCurrentFieldId(field.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-400 shadow-xs ring-1 ring-emerald-300'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-800">
                        {lang === 'ta' && field.name_ta ? field.name_ta : field.name}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                          ACTIVE STREAM
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 space-x-2">
                      <span>🌱 {field.crop_display}</span>
                      <span>•</span>
                      <span>📏 {field.area} {field.area_unit}s</span>
                      <span>•</span>
                      <span>🪨 {field.soil_type}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-800 block">
                      {field.growth_stage}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Telemetry Node Connected
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Field Modal Form */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <h3 className="font-bold text-slate-800 text-base">
              {lang === 'ta' ? 'புதிய விவசாய நிலத்தை பதிவு செய்தல்' : 'Register New Agricultural Field'}
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Field Name (English)</label>
                <input
                  type="text"
                  placeholder="e.g. Kongu Belt - Tiruppur Maize Plot"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">நிலத்தின் பெயர் (தமிழ்)</label>
                <input
                  type="text"
                  placeholder="எ.கா: திருப்பூர் மக்காச்சோளம் தோட்டம்"
                  value={newFieldNameTa}
                  onChange={(e) => setNewFieldNameTa(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Crop Type</label>
                  <select
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="rice">Rice / நெல்</option>
                    <option value="banana">Banana / வாழை</option>
                    <option value="maize">Maize / மக்காச்சோளம்</option>
                    <option value="cotton">Cotton / பருத்தி</option>
                    <option value="tomato">Tomato / தக்காளி</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs"
                >
                  Save & Connect Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
