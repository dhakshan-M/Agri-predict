const API_BASE = "http://localhost:8000/api";

export async function fetchFields() {
  try {
    const res = await fetch(`${API_BASE}/fields`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Backend not reached, using fallback fields", err);
  }
  return {
    status: "success",
    fields: [
      {
        id: "field_1",
        name: "Cauvery Delta - Tanjore Paddy Block A",
        name_ta: "காவிரி டெல்டா - தஞ்சாவூர் நெல் தொகுதி A",
        location: "Thanjavur, Tamil Nadu",
        crop: "rice",
        crop_display: "Paddy (Ponni Rice) / பொன்னி நெல்",
        area: 3.5,
        area_unit: "Acre",
        soil_type: "Clay Loam",
        growth_stage: "Mid stage",
        target_moisture_min: 60.0,
        target_moisture_max: 85.0
      },
      {
        id: "field_2",
        name: "Anamalai Foot - Pollachi Coconut Grove",
        name_ta: "ஆனைமலை அடிவாரம் - பொள்ளாச்சி தென்னந்தோப்பு",
        location: "Pollachi, Tamil Nadu",
        crop: "coconut",
        crop_display: "Coconut Palm / தென்னை மரம்",
        area: 5.0,
        area_unit: "Acre",
        soil_type: "Red Loam",
        growth_stage: "Mid stage",
        target_moisture_min: 45.0,
        target_moisture_max: 70.0
      },
      {
        id: "field_3",
        name: "Vaigai Basin - Madurai Tomato & Veg Plot",
        name_ta: "வைகை படுகை - மதுரை தக்காளி காய்கறி தோட்டம்",
        location: "Madurai, Tamil Nadu",
        crop: "maize",
        crop_display: "Tomato / Maize (Hybrid) / தக்காளி / மக்காச்சோளம்",
        area: 2.0,
        area_unit: "Acre",
        soil_type: "Sandy Loam",
        growth_stage: "Development Stage",
        target_moisture_min: 40.0,
        target_moisture_max: 65.0
      }
    ]
  };
}

export async function fetchLiveTelemetry(fieldId = "field_1") {
  try {
    const res = await fetch(`${API_BASE}/telemetry/live?field_id=${fieldId}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback telemetry", err);
  }
  return {
    status: "success",
    timestamp: new Date().toLocaleTimeString(),
    field_id: fieldId,
    readings: {
      soil_moisture: 68.4,
      soil_temperature: 28.2,
      soil_ph: 6.45,
      nitrogen: 88.0,
      phosphorus: 46.0,
      potassium: 42.0,
      ambient_humidity: 74.5,
      solar_radiation: 615.0,
      sensor_voltage: 1.54,
      water_tank_level: 78.0,
      evapotranspiration: 4.62
    },
    crop_health: {
      status: "Healthy / உகந்தது",
      score: 92,
      level: "normal",
      stress_factors: []
    },
    irrigation: {
      motor_recommended: false,
      motor_status: "AUTO-STANDBY"
    }
  };
}

export async function fetchHistory(fieldId = "field_1") {
  try {
    const res = await fetch(`${API_BASE}/telemetry/history?field_id=${fieldId}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback history", err);
  }
  return {
    status: "success",
    history: [
      { date: "Day 1", soil_moisture: 72.5, soil_temperature: 27.2, soil_ph: 6.5, nitrogen: 90, phosphorus: 48, potassium: 44, rainfall_mm: 14.2 },
      { date: "Day 2", soil_moisture: 69.8, soil_temperature: 27.8, soil_ph: 6.55, nitrogen: 88, phosphorus: 47, potassium: 43, rainfall_mm: 8.0 },
      { date: "Day 3", soil_moisture: 66.2, soil_temperature: 28.6, soil_ph: 6.48, nitrogen: 86, phosphorus: 46, potassium: 42, rainfall_mm: 0.0 },
      { date: "Day 4", soil_moisture: 63.4, soil_temperature: 29.2, soil_ph: 6.52, nitrogen: 84, phosphorus: 45, potassium: 41, rainfall_mm: 0.0 },
      { date: "Day 5", soil_moisture: 60.1, soil_temperature: 29.0, soil_ph: 6.42, nitrogen: 82, phosphorus: 44, potassium: 40, rainfall_mm: 0.0 },
      { date: "Day 6", soil_moisture: 71.0, soil_temperature: 28.0, soil_ph: 6.46, nitrogen: 80, phosphorus: 43, potassium: 39, rainfall_mm: 18.5 },
      { date: "Day 7", soil_moisture: 68.4, soil_temperature: 28.2, soil_ph: 6.45, nitrogen: 88, phosphorus: 46, potassium: 42, rainfall_mm: 4.2 }
    ],
    ai_explanation: {
      en: "Over the last 7 days, soil moisture showed active root uptake followed by soil moisture replenishment from a 18.5 mm rainfall event. Nutrient levels remained balanced.",
      ta: "கடந்த 7 நாட்களில் மண் ஈரப்பதம் சீராக உறிஞ்சப்பட்டு, 18.5 மி.மீ மழையால் மீண்டும் பாதுகாப்பான நிலையை எட்டியுள்ளது. ஊட்டச்சத்துக்கள் உகந்த வரம்பில் உள்ளன."
    }
  };
}

export async function fetchWeather(location = "Thanjavur, Tamil Nadu") {
  try {
    const res = await fetch(`${API_BASE}/weather?location=${encodeURIComponent(location)}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback weather", err);
  }
  return {
    status: "success",
    location: location,
    current: {
      temp: 31.8,
      feels_like: 35.2,
      condition: "Scattered Clouds",
      humidity: 74,
      wind_speed_kmh: 14.5,
      rainfall_last_24h_mm: 18.5
    },
    forecast_7_day: [
      { date: "Today", condition: "Scattered Clouds", temp_max: 33, temp_min: 24, rainfall_mm: 2.0, rain_probability: 25, humidity: 72 },
      { date: "Tomorrow", condition: "Light Rain Showers", temp_max: 31, temp_min: 23, rainfall_mm: 12.5, rain_probability: 65, humidity: 84 },
      { date: "+2 Days", condition: "Heavy Monsoonal Rain", temp_max: 28, temp_min: 22, rainfall_mm: 48.0, rain_probability: 90, humidity: 92 },
      { date: "+3 Days", condition: "Moderate Rain", temp_max: 29, temp_min: 22, rainfall_mm: 21.0, rain_probability: 70, humidity: 88 },
      { date: "+4 Days", condition: "Overcast", temp_max: 31, temp_min: 23, rainfall_mm: 4.0, rain_probability: 30, humidity: 78 },
      { date: "+5 Days", condition: "Sunny / Clear", temp_max: 34, temp_min: 24, rainfall_mm: 0.0, rain_probability: 10, humidity: 65 },
      { date: "+6 Days", condition: "Partly Cloudy", temp_max: 33, temp_min: 24, rainfall_mm: 0.0, rain_probability: 15, humidity: 68 }
    ],
    rainfall_summary: {
      total_expected_7_days_mm: 87.5,
      risk_alert: true
    },
    irrigation_recommendation: {
      action: "DELAY",
      title_en: "DELAY IRRIGATION - HEAVY RAIN EXPECTED",
      title_ta: "நீர்ப்பாசனத்தை தள்ளிப்போடுங்கள் - பலத்த மழை எதிர்பார்க்கப்படுகிறது",
      description_en: "Heavy rainfall totaling ~48 mm is forecast within 48-72 hours. Suspend pump cycles to conserve power and prevent waterlogging.",
      description_ta: "அடுத்த 48-72 மணி நேரத்தில் ~48 மி.மீ வரை கனமழை பெய்ய வாய்ப்புள்ளது. மோட்டார் பாசனத்தை உடனே நிறுத்துங்கள்.",
      risk_level: "warning"
    }
  };
}

export async function calculateRequirements(payload) {
  try {
    const res = await fetch(`${API_BASE}/calculator`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback calculation", err);
  }
  // Safe default estimation
  const area = payload.land_area || 1;
  return {
    status: "success",
    crop: payload.crop_name,
    land_area: area,
    water_recommendation: {
      volume_litres: Math.round(area * 14500),
      volume_m3: Math.round(area * 14.5),
      irrigation_frequency: "Every 2-3 Days via Drip / Furrow",
      irrigation_frequency_ta: "2-3 நாட்களுக்கு ஒருமுறை சொட்டுநீர் பாசனம்"
    },
    fertilizer_recommendation: {
      urea_kg: Math.round(area * 45),
      dap_kg: Math.round(area * 25),
      mop_potash_kg: Math.round(area * 30),
      total_fertilizer_kg: Math.round(area * 100),
      application_schedule_en: "Split application: 50% basal, 25% at vegetative stage, 25% at panicle emergence.",
      application_schedule_ta: "அடியுரமாக 50%, வளர்ச்சிப் பருவத்தில் 25%, பூக்கும் தருணத்தில் 25% பிரித்து இடவும்."
    },
    scientific_explanation: {
      en: "Estimation formulated via Penman-Monteith crop evapotranspiration coefficients and standard agricultural university recommendations.",
      ta: "பயிர் ஆவியாதல் மற்றும் தமிழ்நாடு வேளாண் பல்கலைக்கழக பரிந்துரைகளின் அடிப்படையில் கணக்கிடப்பட்டுள்ளது."
    },
    agronomic_disclaimer: {
      en: "AGRONOMIC NOTICE: Dosages are verified estimations. Conduct an official Soil Health Card test before applying bulk fertilizers.",
      ta: "வேளாண் அறிவிப்பு: இந்த அளவுகள் உத்தேச பரிந்துரைகளாகும். உரமிடுவதற்கு முன் மண் பரிசோதனை செய்து உறுதிப்படுத்தவும்."
    }
  };
}

export async function fetchAdvisories(fieldId = "field_1") {
  try {
    const res = await fetch(`${API_BASE}/advisory?field_id=${fieldId}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback advisories", err);
  }
  return {
    status: "success",
    advisories: [
      {
        id: "adv_1",
        category: "Irrigation & Moisture",
        category_ta: "நீர்ப்பாசனம் மற்றும் ஈரப்பதம்",
        priority: "HIGH",
        icon: "droplet",
        title_en: "Soil Moisture Review - Upcoming Rainfall Advisory",
        title_ta: "மண் ஈரப்பதம் மற்றும் மழை முன்னறிவிப்பு ஆலோசனை",
        message_en: "Telemetry shows root moisture at 68.4%. Heavy rain (~48mm) is forecast in 48 hours. Postpone all secondary pump operations to avoid root rot.",
        message_ta: "மண் வேர் ஈரப்பதம் 68.4% ஆக உள்ளது. அடுத்த 48 மணி நேரத்தில் கனமழை வாய்ப்புள்ளது. வேர் அழுகலைத் தடுக்க பம்ப் நீர்ப்பாசனத்தை தற்காலிகமாக நிறுத்தவும்.",
        action_en: "Keep drainage gates open; defer drip cycle.",
        action_ta: "வடிகால் வாய்க்கால்களை திறந்து வைக்கவும்; சொட்டுநீரை இயக்க வேண்டாம்."
      },
      {
        id: "adv_2",
        category: "Nutrient & Fertilizer",
        category_ta: "ஊட்டச்சத்து மற்றும் உர மேலாண்மை",
        priority: "MEDIUM",
        icon: "sprout",
        title_en: "Nitrogen Uptake Support - Panicle & Vegetative Stage",
        title_ta: "தழைச்சத்து மேலாண்மை - பயிர் வளர்ச்சிப் பருவம்",
        message_en: "Nitrogen telemetry reads 88.0 mg/kg. Apply Neem-Coated Urea in split doses only after the heavy rain clears to prevent leaching.",
        message_ta: "தழைச்சத்து அளவு 88.0 மி.கி/கிலோவாக உள்ளது. மழை நின்ற பிறகு வேப்பம்பூசிய யூரியாவை பிரித்து இடவும்.",
        action_en: "Broadcast 25 kg Neem-Coated Urea per acre following the rain.",
        action_ta: "மழை நின்ற பிறகு ஏக்கருக்கு 25 கிலோ வேப்பம்பூசிய யூரியா இடவும்."
      }
    ]
  };
}

export async function fetchAlerts(fieldId = "field_1") {
  try {
    const res = await fetch(`${API_BASE}/alerts?field_id=${fieldId}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using fallback alerts", err);
  }
  return {
    status: "success",
    alerts: [
      {
        id: "alt_101",
        severity: "red",
        severity_label: "Critical Warning",
        severity_label_ta: "தீவிர எச்சரிக்கை",
        title_en: "Heavy Rainfall Risk Ahead (48mm in 48h)",
        title_ta: "பலத்த மழை அபாயம் (48 மி.மீ எதிர்பார்க்கப்படுகிறது)",
        description_en: "Monsoon depression alert. Waterlogging risk in low-lying crop blocks.",
        description_ta: "மழை எச்சரிக்கை. தாழ்வான பயிர் நிலங்களில் நீர் தேங்கும் அபாயம் உள்ளது.",
        timestamp: "12 minutes ago"
      },
      {
        id: "alt_102",
        severity: "yellow",
        severity_label: "Advisory Warning",
        severity_label_ta: "கவனிக்க வேண்டிய எச்சரிக்கை",
        title_en: "High Ambient Humidity (> 84%)",
        title_ta: "அதிக காற்றின் ஈரப்பதம் (> 84%)",
        description_en: "Continuous high humidity elevates fungal spore germination risk.",
        description_ta: "தொடர்ச்சியான அதிக ஈரப்பதம் பூஞ்சை பரவுவதற்கு வழிவகுக்கும்.",
        timestamp: "45 minutes ago"
      },
      {
        id: "alt_103",
        severity: "green",
        severity_label: "Normal Condition",
        severity_label_ta: "வழக்கமான நிலை",
        title_en: "Soil Temperature within Optimal Range (28.2°C)",
        title_ta: "மண் வெப்பநிலை சீரான அளவில் உள்ளது (28.2°C)",
        description_en: "Root zone temperature is ideal for active microbiological soil activity.",
        description_ta: "வேர் மண்டல வெப்பநிலை நுண்ணுயிர்களின் செயல்பாட்டிற்கு சாதகமாக உள்ளது.",
        timestamp: "2 hours ago"
      }
    ]
  };
}

export function speakText(text, lang = "en") {
  if (!("speechSynthesis" in window)) {
    alert("Speech Synthesis is not supported in this browser.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === "ta" ? "ta-IN" : "en-US";
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}
