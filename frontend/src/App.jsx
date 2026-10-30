import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// 9 Page Views
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import SoilMonitoringPage from './pages/SoilMonitoringPage';
import SevenDayAnalyticsPage from './pages/SevenDayAnalyticsPage';
import WeatherForecastPage from './pages/WeatherForecastPage';
import CalculatorPage from './pages/CalculatorPage';
import AdvisoryPage from './pages/AdvisoryPage';
import ReportsAlertsPage from './pages/ReportsAlertsPage';
import AuthProfilePage from './pages/AuthProfilePage';

// API Services
import { 
  fetchFields, 
  fetchLiveTelemetry, 
  fetchHistory, 
  fetchWeather, 
  fetchAdvisories, 
  fetchAlerts 
} from './api';

export default function App() {
  const [lang, setLang] = useState('en'); // 'en' or 'ta'
  const [activeTab, setActiveTab] = useState('home');
  const [fields, setFields] = useState([]);
  const [currentFieldId, setCurrentFieldId] = useState('field_1');

  // Live Telemetry & Data States
  const [telemetry, setTelemetry] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [advisories, setAdvisories] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial Load of Fields and Data
  useEffect(() => {
    async function initData() {
      setLoading(true);
      const fieldsRes = await fetchFields();
      if (fieldsRes?.fields?.length) {
        setFields(fieldsRes.fields);
        setCurrentFieldId(fieldsRes.fields[0].id);
      }
      const [w, hist, adv, alt] = await Promise.all([
        fetchWeather('Thanjavur, Tamil Nadu'),
        fetchHistory('field_1'),
        fetchAdvisories('field_1'),
        fetchAlerts('field_1')
      ]);
      setWeather(w);
      setHistoryData(hist);
      setAdvisories(adv?.advisories || []);
      setAlerts(alt?.alerts || []);
      setLoading(false);
    }
    initData();
  }, []);

  // Poll / Refresh Live Telemetry when field changes or interval fires
  const refreshTelemetry = async () => {
    const data = await fetchLiveTelemetry(currentFieldId);
    setTelemetry(data);
  };

  useEffect(() => {
    refreshTelemetry();
    const interval = setInterval(refreshTelemetry, 8000); // Live poll every 8 seconds
    return () => clearInterval(interval);
  }, [currentFieldId]);

  // When field changes, refresh history and advisories
  useEffect(() => {
    async function updateFieldData() {
      const [hist, adv, alt] = await Promise.all([
        fetchHistory(currentFieldId),
        fetchAdvisories(currentFieldId),
        fetchAlerts(currentFieldId)
      ]);
      setHistoryData(hist);
      setAdvisories(adv?.advisories || []);
      setAlerts(alt?.alerts || []);
    }
    updateFieldData();
  }, [currentFieldId]);

  const handleSearchLocation = async (loc) => {
    const w = await fetchWeather(loc);
    setWeather(w);
  };

  const handleAddField = (newField) => {
    const id = `field_${fields.length + 1}`;
    const fieldObj = { ...newField, id };
    setFields([...fields, fieldObj]);
    setCurrentFieldId(id);
  };

  const currentField = fields.find(f => f.id === currentFieldId) || fields[0] || {
    id: "field_1",
    name: "Cauvery Delta - Tanjore Paddy Block A",
    name_ta: "காவிரி டெல்டா - தஞ்சாவூர் நெல் தொகுதி A",
    crop: "rice",
    crop_display: "Paddy (Ponni Rice)",
    area: 3.5,
    area_unit: "Acre",
    soil_type: "Clay Loam",
    growth_stage: "Mid stage"
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        fields={fields}
        currentFieldId={currentFieldId}
        setCurrentFieldId={setCurrentFieldId}
      />

      {/* Main Page Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={setActiveTab}
            lang={lang}
            telemetry={telemetry}
            weather={weather}
            currentField={currentField}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            lang={lang}
            telemetry={telemetry}
            weather={weather}
            currentField={currentField}
            onRefreshTelemetry={refreshTelemetry}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'soil' && (
          <SoilMonitoringPage
            lang={lang}
            telemetry={telemetry}
            currentField={currentField}
          />
        )}

        {activeTab === 'analytics' && (
          <SevenDayAnalyticsPage
            lang={lang}
            historyData={historyData}
            currentField={currentField}
          />
        )}

        {activeTab === 'weather' && (
          <WeatherForecastPage
            lang={lang}
            weather={weather}
            telemetry={telemetry}
            currentField={currentField}
            onSearchLocation={handleSearchLocation}
          />
        )}

        {activeTab === 'calculator' && (
          <CalculatorPage
            lang={lang}
            telemetry={telemetry}
            currentField={currentField}
          />
        )}

        {activeTab === 'advisory' && (
          <AdvisoryPage
            lang={lang}
            setLang={setLang}
            advisories={advisories}
            currentField={currentField}
            telemetry={telemetry}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsAlertsPage
            lang={lang}
            alerts={alerts}
            currentField={currentField}
            telemetry={telemetry}
            weather={weather}
          />
        )}

        {activeTab === 'profile' && (
          <AuthProfilePage
            lang={lang}
            fields={fields}
            currentFieldId={currentFieldId}
            setCurrentFieldId={setCurrentFieldId}
            onAddField={handleAddField}
          />
        )}
      </main>

      {/* Page Footer */}
      <Footer lang={lang} />
    </div>
  );
}
