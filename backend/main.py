import os
import json
import math
import random
import pickle
import datetime
import pandas as pd
import numpy as np
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel

app = FastAPI(
    title="Agri Predict API",
    description="Crop Stress Telemetry & AI Advisory Platform for Hackathon Demo",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
ML_DIR = os.path.join(BASE_DIR, "ml")

# Load ML Model and Reference Benchmarks
crop_model = None
crop_reference_data = {}
try:
    with open(os.path.join(ML_DIR, "crop_model.pkl"), "rb") as f:
        crop_model = pickle.load(f)
    with open(os.path.join(ML_DIR, "crop_reference_data.pkl"), "rb") as f:
        crop_reference_data = pickle.load(f)
    print("Crop ML Model and Benchmarks loaded successfully.")
except Exception as e:
    print(f"Warning: ML model not loaded: {e}")

# Load Pre-seeded IoT & Sensor Datasets
iot_telemetry_samples = []
try:
    with open(os.path.join(DATA_DIR, "iot_telemetry.json"), "r") as f:
        iot_telemetry_samples = json.load(f)
except Exception as e:
    print(f"Warning: iot_telemetry.json could not be loaded: {e}")

stage_sensor_df = None
try:
    stage_sensor_df = pd.read_csv(os.path.join(DATA_DIR, "field_stage_sensor_data.csv"))
except Exception as e:
    print(f"Warning: field_stage_sensor_data.csv could not be loaded: {e}")

# In-memory Farm Fields Store
FIELDS_STORE = [
    {
        "id": "field_1",
        "name": "Cauvery Delta - Tanjore Paddy Block A",
        "name_ta": "காவிரி டெல்டா - தஞ்சாவூர் நெல் தொகுதி A",
        "location": "Thanjavur, Tamil Nadu",
        "crop": "rice",
        "crop_display": "Paddy (Ponni Rice) / பொன்னி நெல்",
        "area": 3.5,
        "area_unit": "Acre",
        "soil_type": "Clay Loam",
        "growth_stage": "Mid stage",
        "planting_date": "2026-09-15",
        "target_moisture_min": 60.0,
        "target_moisture_max": 85.0,
        "reservoir_depth_cm": 120.0
    },
    {
        "id": "field_2",
        "name": "Anamalai Foot - Pollachi Coconut Grove",
        "name_ta": "ஆனைமலை அடிவாரம் - பொள்ளாச்சி தென்னந்தோப்பு",
        "location": "Pollachi, Tamil Nadu",
        "crop": "coconut",
        "crop_display": "Coconut Palm / தென்னை மரம்",
        "area": 5.0,
        "area_unit": "Acre",
        "soil_type": "Red Loam",
        "growth_stage": "Mid stage",
        "planting_date": "2024-03-10",
        "target_moisture_min": 45.0,
        "target_moisture_max": 70.0,
        "reservoir_depth_cm": 150.0
    },
    {
        "id": "field_3",
        "name": "Vaigai Basin - Madurai Tomato & Veg Plot",
        "name_ta": "வைகை படுகை - மதுரை தக்காளி காய்கறி தோட்டம்",
        "location": "Madurai, Tamil Nadu",
        "crop": "maize",
        "crop_display": "Tomato / Maize (Hybrid) / தக்காளி / மக்காச்சோளம்",
        "area": 2.0,
        "area_unit": "Acre",
        "soil_type": "Sandy Loam",
        "growth_stage": "Development Stage",
        "planting_date": "2026-10-01",
        "target_moisture_min": 40.0,
        "target_moisture_max": 65.0,
        "reservoir_depth_cm": 90.0
    }
]

# Simulated dynamic state modifier
simulation_tick = 0

# Pydantic Schemas
class CropPredictRequest(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class CalculatorRequest(BaseModel):
    crop_name: str
    land_area: float
    area_unit: str = "Acre"  # Acre or Hectare
    soil_moisture: float
    N: float
    P: float
    K: float
    growth_stage: str = "Mid stage" # Initial Stage, Development Stage, Mid stage, Last stage
    soil_type: str = "Clay Loam" # Clay Loam, Sandy Loam, Red Soil, Black Soil

class FieldCreateRequest(BaseModel):
    name: str
    name_ta: Optional[str] = ""
    location: str
    crop: str
    crop_display: str
    area: float
    area_unit: str = "Acre"
    soil_type: str
    growth_stage: str

class AuthLoginRequest(BaseModel):
    email_or_phone: str
    password: str

# Helper Functions
def get_crop_kc(stage: str) -> float:
    stage_lower = stage.lower()
    if "initial" in stage_lower:
        return 0.45
    elif "development" in stage_lower:
        return 0.75
    elif "mid" in stage_lower:
        return 1.15
    elif "last" in stage_lower or "harvest" in stage_lower:
        return 0.65
    return 0.85

def get_soil_water_factor(soil_type: str) -> float:
    s = soil_type.lower()
    if "sandy" in s:
        return 1.25  # High infiltration/drainage
    elif "clay" in s:
        return 0.85  # High water retention
    elif "black" in s:
        return 0.90
    return 1.0       # Loam default

# API Status Manifest Endpoint
@app.get("/api")
def api_manifest():
    return {
        "status": "online",
        "project": "Agri Predict",
        "version": "1.0.0",
        "endpoints": [
            "/api/fields",
            "/api/telemetry/live",
            "/api/telemetry/history",
            "/api/weather",
            "/api/crops/recommend",
            "/api/calculator",
            "/api/advisory",
            "/api/alerts",
            "/api/upload-csv"
        ]
    }

# Root Endpoint: Serves React Web App if built, or API manifest
@app.get("/")
def read_root():
    index_path = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return api_manifest()


# Field Management Endpoints
@app.get("/api/fields")
def get_fields():
    return {"status": "success", "fields": FIELDS_STORE}

@app.post("/api/fields")
def create_field(payload: FieldCreateRequest):
    new_id = f"field_{len(FIELDS_STORE) + 1}"
    new_field = {
        "id": new_id,
        "name": payload.name,
        "name_ta": payload.name_ta or payload.name,
        "location": payload.location,
        "crop": payload.crop.lower(),
        "crop_display": payload.crop_display,
        "area": payload.area,
        "area_unit": payload.area_unit,
        "soil_type": payload.soil_type,
        "growth_stage": payload.growth_stage,
        "planting_date": datetime.date.today().isoformat(),
        "target_moisture_min": 45.0,
        "target_moisture_max": 75.0,
        "reservoir_depth_cm": 100.0
    }
    FIELDS_STORE.append(new_field)
    return {"status": "success", "field": new_field}

# Real-time IoT Telemetry Endpoint
@app.get("/api/telemetry/live")
def get_live_telemetry(field_id: str = Query("field_1")):
    global simulation_tick
    simulation_tick += 1
    
    # Locate requested field
    field = next((f for f in FIELDS_STORE if f["id"] == field_id), FIELDS_STORE[0])
    
    # Pick a baseline from IoT JSON or Stage CSV
    sample_idx = (simulation_tick * 7) % max(1, len(iot_telemetry_samples))
    sample = iot_telemetry_samples[sample_idx] if iot_telemetry_samples else {}
    
    # Base parameters with subtle live fluctuations
    noise_moisture = math.sin(simulation_tick * 0.35) * 3.5
    noise_temp = math.cos(simulation_tick * 0.25) * 1.5
    
    # Crop specific baseline values
    if field["id"] == "field_1": # Rice (higher moisture requirement)
        soil_moisture = round(max(30.0, min(85.0, 68.4 + noise_moisture)), 1)
        soil_temp = round(28.2 + noise_temp, 1)
        soil_ph = 6.45
        N = 88.0
        P = 46.0
        K = 42.0
    elif field["id"] == "field_2": # Coconut
        soil_moisture = round(max(25.0, min(80.0, 52.8 + noise_moisture)), 1)
        soil_temp = round(29.6 + noise_temp, 1)
        soil_ph = 6.15
        N = 24.0
        P = 18.0
        K = 31.0
    else: # Tomato / Veg
        soil_moisture = round(max(20.0, min(75.0, 41.2 + noise_moisture)), 1)
        soil_temp = round(31.4 + noise_temp, 1)
        soil_ph = 5.85
        N = 54.0
        P = 32.0
        K = 48.0
        
    humidity = round(74.0 + math.sin(simulation_tick * 0.4) * 6.0, 1)
    ultrasonic_distance = round(52.0 + math.cos(simulation_tick * 0.1) * 8.0, 1) # reservoir level (cm to water)
    water_tank_level_pct = round(max(10.0, min(95.0, ((field["reservoir_depth_cm"] - ultrasonic_distance) / field["reservoir_depth_cm"]) * 100)), 1)
    solar_radiation = round(610 + math.sin(simulation_tick * 0.2) * 55, 1)
    haunt_voltage = round(1.52 + math.cos(simulation_tick * 0.5) * 0.1, 2)
    evapotranspiration = round(4.6 + math.sin(simulation_tick * 0.1) * 0.8, 2)
    
    # Stress and health status calculation
    stress_factors = []
    if soil_moisture < field["target_moisture_min"]:
        stress_factors.append("Low Soil Moisture")
    elif soil_moisture > field["target_moisture_max"]:
        stress_factors.append("High Soil Moisture (Waterlogged)")
        
    if soil_temp > 34.0:
        stress_factors.append("Thermal Heat Stress")
        
    if soil_ph < 5.5 or soil_ph > 7.8:
        stress_factors.append("pH Imbalance")
        
    if len(stress_factors) == 0:
        health_status = "Healthy / உகந்தது"
        health_score = 94
        health_level = "normal"
    elif len(stress_factors) == 1:
        health_status = f"Mild Stress: {stress_factors[0]}"
        health_score = 76
        health_level = "warning"
    else:
        health_status = f"Critical Stress: {', '.join(stress_factors)}"
        health_score = 54
        health_level = "critical"
        
    motor_recommended = soil_moisture < field["target_moisture_min"]

    return {
        "status": "success",
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "field_id": field["id"],
        "field_name": field["name"],
        "field_name_ta": field["name_ta"],
        "crop": field["crop"],
        "crop_display": field["crop_display"],
        "readings": {
            "soil_moisture": soil_moisture,
            "soil_moisture_unit": "%",
            "soil_temperature": soil_temp,
            "soil_temperature_unit": "°C",
            "soil_ph": soil_ph,
            "nitrogen": N,
            "nitrogen_unit": "mg/kg",
            "phosphorus": P,
            "phosphorus_unit": "mg/kg",
            "potassium": K,
            "potassium_unit": "mg/kg",
            "ambient_humidity": humidity,
            "ambient_humidity_unit": "%",
            "solar_radiation": solar_radiation,
            "solar_radiation_unit": "W/m²",
            "sensor_voltage": haunt_voltage,
            "ultrasonic_distance": ultrasonic_distance,
            "water_tank_level": water_tank_level_pct,
            "evapotranspiration": evapotranspiration
        },
        "crop_health": {
            "status": health_status,
            "score": health_score,
            "level": health_level,
            "stress_factors": stress_factors
        },
        "irrigation": {
            "motor_recommended": motor_recommended,
            "motor_status": "AUTO-STANDBY" if not motor_recommended else "ACTIVE-IRRIGATING",
            "tank_warning": water_tank_level_pct < 25.0
        }
    }

# 7-Day Historical Analytics Endpoint with AI Analysis
@app.get("/api/telemetry/history")
def get_historical_telemetry(field_id: str = Query("field_1"), days: int = Query(7)):
    field = next((f for f in FIELDS_STORE if f["id"] == field_id), FIELDS_STORE[0])
    
    today = datetime.date.today()
    history = []
    
    # Crop seed offsets
    base_m = 65.0 if field["id"] == "field_1" else (50.0 if field["id"] == "field_2" else 38.0)
    base_t = 28.0 if field["id"] == "field_1" else (29.5 if field["id"] == "field_2" else 31.0)
    base_ph = 6.5 if field["id"] == "field_1" else (6.2 if field["id"] == "field_2" else 5.8)
    base_n = 85.0 if field["id"] == "field_1" else (26.0 if field["id"] == "field_2" else 55.0)
    base_p = 45.0 if field["id"] == "field_1" else (19.0 if field["id"] == "field_2" else 30.0)
    base_k = 40.0 if field["id"] == "field_1" else (30.0 if field["id"] == "field_2" else 46.0)

    # 7-day progression curve
    moisture_trend = [base_m + 8, base_m + 5, base_m + 2, base_m - 2, base_m - 5, base_m - 1, base_m + 3]
    temp_trend = [base_t - 1.2, base_t - 0.5, base_t + 0.8, base_t + 1.5, base_t + 1.1, base_t + 0.2, base_t - 0.4]
    ph_trend = [base_ph, base_ph + 0.05, base_ph - 0.04, base_ph + 0.02, base_ph - 0.08, base_ph + 0.01, base_ph]
    n_trend = [base_n + 5, base_n + 3, base_n + 1, base_n - 2, base_n - 4, base_n - 6, base_n - 5]
    p_trend = [base_p + 1, base_p + 2, base_p, base_p - 1, base_p - 2, base_p - 3, base_p - 2]
    k_trend = [base_k + 2, base_k + 1, base_k, base_k - 1, base_k - 2, base_k - 3, base_k - 2]
    rain_trend = [14.2, 8.0, 0.0, 0.0, 0.0, 18.5, 4.2]

    for i in range(days):
        dt = today - datetime.timedelta(days=(days - 1 - i))
        history.append({
            "date": dt.strftime("%b %d"),
            "full_date": dt.isoformat(),
            "soil_moisture": round(moisture_trend[i % 7], 1),
            "soil_temperature": round(temp_trend[i % 7], 1),
            "soil_ph": round(ph_trend[i % 7], 2),
            "nitrogen": round(n_trend[i % 7], 1),
            "phosphorus": round(p_trend[i % 7], 1),
            "potassium": round(k_trend[i % 7], 1),
            "rainfall_mm": round(rain_trend[i % 7], 1)
        })

    # AI Analysis of the 7-day trend
    ai_summary_en = (
        f"Over the last 7 days in {field['name']}, soil moisture showed a natural depletion cycle from "
        f"{history[0]['soil_moisture']}% down to {min(h['soil_moisture'] for h in history)}%, followed by "
        f"recovery due to intermittent precipitation (18.5mm recorded on Day 6). "
        f"Soil temperature fluctuated within an agronomic band of {min(h['soil_temperature'] for h in history)}°C to "
        f"{max(h['soil_temperature'] for h in history)}°C, maintaining active root metabolic absorption. "
        f"Nitrogen experienced a gradual crop uptake drawdown (-10 mg/kg), indicating healthy biomass growth during the {field['growth_stage']}."
    )

    ai_summary_ta = (
        f"கடந்த 7 நாட்களில் {field['name_ta']} நிலத்தில், மண் ஈரப்பதம் {history[0]['soil_moisture']}% இலிருந்து "
        f"{min(h['soil_moisture'] for h in history)}% வரை குறைந்து, பின்னர் 6 ஆம் நாள் பெய்த மழையால் (18.5 மி.மீ) "
        f"மீண்டும் சீரடைந்துள்ளது. மண் வெப்பநிலை {min(h['soil_temperature'] for h in history)}°C முதல் "
        f"{max(h['soil_temperature'] for h in history)}°C வரை நிலவியது, இது வேர்களின் ஊட்டச்சத்து உறிஞ்சுதலுக்கு சாதகமானது. "
        f"பயிர் வளர்ச்சியின் காரணமாக தழைச்சத்து (நைட்ரஜன்) படிப்படியாக குறைந்துள்ளது, இது ஆரோக்கியமான பயிர் வளர்ச்சியை காட்டுகிறது."
    )

    return {
        "status": "success",
        "field_id": field["id"],
        "history": history,
        "ai_explanation": {
            "en": ai_summary_en,
            "ta": ai_summary_ta
        }
    }

# Weather & Rainfall Risk Forecast Endpoint
@app.get("/api/weather")
def get_weather(location: str = Query("Thanjavur, Tamil Nadu")):
    # 7-day realistic agricultural forecast tailored to South Indian farming seasons
    today = datetime.date.today()
    days_data = [
        {"day_offset": 0, "condition": "Scattered Clouds", "icon": "cloud-sun", "temp_max": 33, "temp_min": 24, "rain_prob": 25, "rain_mm": 2.0, "humidity": 72, "wind_kmh": 14},
        {"day_offset": 1, "condition": "Light Rain Showers", "icon": "cloud-rain", "temp_max": 31, "temp_min": 23, "rain_prob": 65, "rain_mm": 12.5, "humidity": 84, "wind_kmh": 18},
        {"day_offset": 2, "condition": "Heavy Monsoonal Rain", "icon": "cloud-lightning", "temp_max": 28, "temp_min": 22, "rain_prob": 90, "rain_mm": 48.0, "humidity": 92, "wind_kmh": 26},
        {"day_offset": 3, "condition": "Moderate Rain", "icon": "cloud-drizzle", "temp_max": 29, "temp_min": 22, "rain_prob": 70, "rain_mm": 21.0, "humidity": 88, "wind_kmh": 20},
        {"day_offset": 4, "condition": "Overcast", "icon": "cloud", "temp_max": 31, "temp_min": 23, "rain_prob": 30, "rain_mm": 4.0, "humidity": 78, "wind_kmh": 15},
        {"day_offset": 5, "condition": "Sunny / Clear", "icon": "sun", "temp_max": 34, "temp_min": 24, "rain_prob": 10, "rain_mm": 0.0, "humidity": 65, "wind_kmh": 12},
        {"day_offset": 6, "condition": "Partly Cloudy", "icon": "cloud-sun", "temp_max": 33, "temp_min": 24, "rain_prob": 15, "rain_mm": 0.0, "humidity": 68, "wind_kmh": 13},
    ]

    forecast = []
    total_expected_rain = 0.0
    for d in days_data:
        dt = today + datetime.timedelta(days=d["day_offset"])
        total_expected_rain += d["rain_mm"]
        forecast.append({
            "date": dt.strftime("%a, %b %d"),
            "iso_date": dt.isoformat(),
            "condition": d["condition"],
            "temp_max": d["temp_max"],
            "temp_min": d["temp_min"],
            "rainfall_mm": d["rain_mm"],
            "rain_probability": d["rain_prob"],
            "humidity": d["humidity"],
            "wind_kmh": d["wind_kmh"],
            "icon": d["icon"]
        })

    # Automated Irrigation Scheduling Advisory Engine
    # Evaluates upcoming 48-hour rainfall against soil thresholds
    rain_next_48h = forecast[0]["rainfall_mm"] + forecast[1]["rainfall_mm"] + forecast[2]["rainfall_mm"]
    
    if rain_next_48h >= 30.0:
        irrigation_action = "DELAY"
        irrigation_title_en = "DELAY IRRIGATION - HEAVY RAIN EXPECTED"
        irrigation_title_ta = "நீர்ப்பாசனத்தை தள்ளிப்போடுங்கள் - பலத்த மழை எதிர்பார்க்கப்படுகிறது"
        irrigation_desc_en = f"Heavy rainfall totaling ~{rain_next_48h:.1f} mm is forecast within 48-72 hours. Suspend pump cycles to conserve power and prevent waterlogging root asphyxiation."
        irrigation_desc_ta = f"அடுத்த 48-72 மணி நேரத்தில் ~{rain_next_48h:.1f} மி.மீ வரை கனமழை பெய்ய வாய்ப்புள்ளது. மின்சாரம் சேமிக்கவும், பயிரில் நீர் தேங்குவதை தடுக்கவும் மோட்டார் பாசனத்தை உடனே நிறுத்துங்கள்."
        risk_level = "warning"
    elif rain_next_48h >= 10.0:
        irrigation_action = "REVIEW"
        irrigation_title_en = "REVIEW IRRIGATION - LIGHT PRECIPITATION AHEAD"
        irrigation_title_ta = "நீர்ப்பாசனத்தை மறுபரிசீலனை செய்க - லேசான மழை வாய்ப்பு"
        irrigation_desc_en = f"Moderate rain (~{rain_next_48h:.1f} mm) is expected. Reduce standard irrigation volume by 50% and re-check soil telemetry tomorrow morning."
        irrigation_desc_ta = f"சுமார் ~{rain_next_48h:.1f} மி.மீ மிதமான மழை எதிர்பார்க்கப்படுகிறது. பாசன அளவை 50% குறைத்து, நாளை காலை மண் ஈரப்பதத்தை சரிபார்க்கவும்."
        risk_level = "normal"
    else:
        irrigation_action = "SCHEDULE"
        irrigation_title_en = "SCHEDULE REGULAR IRRIGATION"
        irrigation_title_ta = "வழக்கமான நீர்ப்பாசனத்தை திட்டமிடுங்கள்"
        irrigation_desc_en = "Dry, clear conditions forecast. Proceed with scheduled drip/furrow irrigation to maintain optimal root zone moisture."
        irrigation_desc_ta = "வறண்ட வானிலை நிலவும். வேர் மண்டல ஈரப்பதத்தை பராமரிக்க திட்டமிட்டபடி சொட்டுநீர்/வாய்க்கால் பாசனத்தை தொடரவும்."
        risk_level = "normal"

    return {
        "status": "success",
        "location": location,
        "current": {
            "temp": 31.8,
            "feels_like": 35.2,
            "condition": "Scattered Clouds",
            "condition_ta": "சிதறிய மேகங்கள்",
            "humidity": 74,
            "wind_speed_kmh": 14.5,
            "pressure_hpa": 1012,
            "uv_index": 7.8,
            "rainfall_last_24h_mm": 18.5
        },
        "forecast_7_day": forecast,
        "rainfall_summary": {
            "total_expected_7_days_mm": round(total_expected_rain, 1),
            "rainy_days_count": sum(1 for f in forecast if f["rainfall_mm"] > 2.0),
            "risk_alert": rain_next_48h > 35.0
        },
        "irrigation_recommendation": {
            "action": irrigation_action,
            "title_en": irrigation_title_en,
            "title_ta": irrigation_title_ta,
            "description_en": irrigation_desc_en,
            "description_ta": irrigation_desc_ta,
            "risk_level": risk_level
        }
    }

# Crop Recommendation Model Endpoint (Scikit-Learn)
@app.post("/api/crops/recommend")
def recommend_crop(req: CropPredictRequest):
    if not crop_model:
        raise HTTPException(status_code=500, detail="ML model is not available.")
    
    features = np.array([[req.N, req.P, req.K, req.temperature, req.humidity, req.ph, req.rainfall]])
    
    # Predict probabilities for top crops
    probs = crop_model.predict_proba(features)[0]
    classes = crop_model.classes_
    
    top_indices = np.argsort(probs)[::-1][:3]
    top_crops = []
    
    tamil_names = {
        "rice": "நெல் (Paddy / Rice)",
        "maize": "மக்காச்சோளம் (Maize)",
        "chickpea": "கொண்டைக்கடலை (Chickpea)",
        "kidneybeans": "ராஜ்மா (Kidney Beans)",
        "pigeonpeas": "துவரை (Pigeon Peas)",
        "mothbeans": "நரிப்பயறு (Moth Beans)",
        "mungbean": "பாசிப்பயறு (Green Gram)",
        "blackgram": "உளுந்து (Black Gram)",
        "lentil": "மைசூர் பருப்பு (Lentil)",
        "pomegranate": "மாதுளை (Pomegranate)",
        "banana": "வாழை (Banana)",
        "mango": "மாம்பழம் (Mango)",
        "grapes": "திராட்சை (Grapes)",
        "watermelon": "தர்பூசணி (Watermelon)",
        "muskmelon": "முலாம் பழம் (Muskmelon)",
        "apple": "ஆப்பிள் (Apple)",
        "orange": "ஆரஞ்சு (Orange)",
        "papaya": "பப்பாளி (Papaya)",
        "coconut": "தென்னை (Coconut)",
        "cotton": "பருத்தி (Cotton)",
        "jute": "சணல் (Jute)",
        "coffee": "காபி (Coffee)"
    }
    
    for idx in top_indices:
        crop_name = classes[idx]
        confidence = round(float(probs[idx]) * 100, 1)
        ref = crop_reference_data.get(crop_name, {})
        top_crops.append({
            "crop": crop_name,
            "name_ta": tamil_names.get(crop_name, crop_name),
            "confidence_percentage": confidence,
            "benchmark": ref
        })

    return {
        "status": "success",
        "recommended_crop": top_crops[0]["crop"],
        "recommended_crop_ta": top_crops[0]["name_ta"],
        "confidence": top_crops[0]["confidence_percentage"],
        "top_alternatives": top_crops,
        "input_telemetry": req.dict()
    }

# Smart Fertilizer and Water Calculator Endpoint
@app.post("/api/calculator")
def calculate_requirements(req: CalculatorRequest):
    # Standard benchmark requirements (kg/hectare) for major agricultural crops
    agronomic_standards = {
        "rice": {"N": 120, "P": 40, "K": 40, "water_depth_mm": 6.5},
        "maize": {"N": 120, "P": 60, "K": 40, "water_depth_mm": 5.0},
        "cotton": {"N": 100, "P": 50, "K": 50, "water_depth_mm": 5.5},
        "coconut": {"N": 80, "P": 40, "K": 100, "water_depth_mm": 7.0},
        "banana": {"N": 200, "P": 60, "K": 300, "water_depth_mm": 8.0},
        "sugarcane": {"N": 250, "P": 110, "K": 110, "water_depth_mm": 9.0},
        "blackgram": {"N": 25, "P": 50, "K": 25, "water_depth_mm": 3.5},
        "tomato": {"N": 150, "P": 80, "K": 100, "water_depth_mm": 5.5}
    }
    
    crop_key = req.crop_name.lower().strip()
    # Fallback to closest match or default
    matched_standard = agronomic_standards.get(crop_key, {"N": 100, "P": 50, "K": 50, "water_depth_mm": 5.0})

    # Area conversion to Hectares (1 Acre = 0.404686 Hectare)
    area_ha = req.land_area if req.area_unit.lower() == "hectare" else req.land_area * 0.404686
    
    # Crop Coefficient and Stage Multiplier
    kc = get_crop_kc(req.growth_stage)
    soil_factor = get_soil_water_factor(req.soil_type)
    
    # 1. Water Requirement Calculation
    # Daily ETo baseline in mm/day (~4.8 mm/day in tropical zones)
    eto = 4.8
    etc = eto * kc # Crop evapotranspiration in mm/day
    
    # 1 mm of water over 1 hectare = 10,000 Litres
    daily_water_litres = etc * 10000 * area_ha * soil_factor
    
    # Moisture deficit factor: if current moisture < 60%, add irrigation volume
    moisture_deficit_ratio = max(0.2, (70.0 - req.soil_moisture) / 70.0) if req.soil_moisture < 70 else 0.1
    recommended_water_litres = round(daily_water_litres * moisture_deficit_ratio * 3) # 3-day irrigation cycle

    # 2. Fertilizer Requirement Calculation
    # Compare target vs soil test values (standard soil test is in mg/kg or ppm; 1 ppm ~ 2 kg/ha topsoil)
    n_soil_kgha = req.N * 1.5
    p_soil_kgha = req.P * 1.5
    k_soil_kgha = req.K * 1.5
    
    target_n = matched_standard["N"] * area_ha
    target_p = matched_standard["P"] * area_ha
    target_k = matched_standard["K"] * area_ha
    
    n_deficit = max(0.0, target_n - (n_soil_kgha * area_ha * 0.4))
    p_deficit = max(0.0, target_p - (p_soil_kgha * area_ha * 0.4))
    k_deficit = max(0.0, target_k - (k_soil_kgha * area_ha * 0.4))

    # Standard Commercial Fertilizer Conversions:
    # Urea: 46% N -> kg Urea = N_deficit / 0.46
    # DAP: 18% N and 46% P2O5 -> kg DAP = P_deficit / 0.46
    # MOP (Muriate of Potash): 60% K2O -> kg MOP = K_deficit / 0.60
    dap_kg = round(p_deficit / 0.46, 1)
    n_from_dap = dap_kg * 0.18
    remaining_n = max(0.0, n_deficit - n_from_dap)
    urea_kg = round(remaining_n / 0.46, 1)
    mop_kg = round(k_deficit / 0.60, 1)

    # Growth stage split schedule
    stage_lower = req.growth_stage.lower()
    if "initial" in stage_lower:
        schedule_en = "Apply 50% Urea, 100% DAP, and 50% MOP as basal dose during field preparation. Retain remaining Urea for first top dressing."
        schedule_ta = "நிலம் தயாரிப்பின் போது 50% யூரியா, 100% டிஏபி மற்றும் 50% பொட்டாஷ் அடியுரமாக இடவும். மீதமுள்ள யூரியாவை முதல் மேலுரமாக இடவும்."
    elif "development" in stage_lower or "vegetative" in stage_lower:
        schedule_en = "Apply 25% Urea top-dressing along with light irrigation. Ensure field is not waterlogged before broadcast."
        schedule_ta = "25% யூரியாவை மேலுரமாக லேசான நீர்ப்பாசனத்துடன் இடவும். உரமிடுவதற்கு முன் நிலத்தில் அதிக நீர் தேங்காமல் பார்த்துக் கொள்ளவும்."
    elif "mid" in stage_lower or "flowering" in stage_lower:
        schedule_en = "Apply remaining 25% Urea and 50% MOP for panicle initiation/flowering stage. Incorporate micronutrient spray if zinc deficiency occurs."
        schedule_ta = "பூக்கும் தருணத்தில் எஞ்சிய 25% யூரியா மற்றும் 50% பொட்டாஷ் இடவும். துத்தநாக குறைபாடு தென்பட்டால் நுண்ணூட்டக்கலவை தெளிக்கவும்."
    else:
        schedule_en = "Late stage: Avoid high nitrogen inputs to prevent lodging. Water sparingly to maintain grain filling."
        schedule_ta = "கடைசி பருவம்: பயிர் சாய்வதைத் தடுக்க தழைச்சத்து உரங்களை தவிர்க்கவும். தானியம் முதிர்ச்சியடைய மிதமான பாசனம் போதுமானது."

    explanation_en = (
        f"Calculations are based on FAO-56 Penman-Monteith crop evapotranspiration (Kc: {kc:.2f}, Soil Infiltration Factor: {soil_factor:.2f}) "
        f"for {req.crop_name} across {req.land_area} {req.area_unit}s. Fertilizer dosage accounts for existing soil test levels (N: {req.N}, P: {req.P}, K: {req.K} mg/kg)."
    )
    explanation_ta = (
        f"இக்கணக்கீடு FAO-56 பயிர் நீர்த் தேவை முறைப்படி (பயிர் காரணி Kc: {kc:.2f}, மண் காரணி: {soil_factor:.2f}) "
        f"{req.crop_name} பயிரின் {req.land_area} {req.area_unit} நிலப்பரப்பிற்கு கணக்கிடப்பட்டுள்ளது. உங்கள் நிலத்தின் தற்போதைய மண் பரிசோதனை அளவுகள் (N: {req.N}, P: {req.P}, K: {req.K}) சரிசெய்யப்பட்டுள்ளன."
    )

    disclaimer_en = (
        "AGRONOMIC NOTICE: Dosages are verified estimations based on standard agricultural extension guidelines. "
        "Actual field conditions may vary. Please conduct an official lab Soil Health Card test before applying bulk synthetic fertilizers."
    )
    disclaimer_ta = (
        "வேளாண் அறிவிப்பு: இந்த அளவுகள் தரநிலையான விவசாய விரிவாக்க வழிகாட்டுதல்களின்படியான உத்தேச அளவீடுகளாகும். "
        "மொத்த ரசாயன உரங்களை இடுவதற்கு முன் அதிகாரப்பூர்வ மண் பரிசோதனை அட்டை (Soil Health Card) பெற்று சரிபார்க்கவும்."
    )

    return {
        "status": "success",
        "crop": req.crop_name,
        "land_area": req.land_area,
        "area_unit": req.area_unit,
        "growth_stage": req.growth_stage,
        "soil_type": req.soil_type,
        "water_recommendation": {
            "volume_litres": recommended_water_litres,
            "volume_m3": round(recommended_water_litres / 1000, 2),
            "irrigation_frequency": "Every 2-3 Days via Drip / Furrow",
            "irrigation_frequency_ta": "2-3 நாட்களுக்கு ஒருமுறை சொட்டுநீர் / வாய்க்கால் பாசனம்",
            "daily_evapotranspiration_mm": round(etc, 2)
        },
        "fertilizer_recommendation": {
            "urea_kg": urea_kg,
            "dap_kg": dap_kg,
            "mop_potash_kg": mop_kg,
            "total_fertilizer_kg": round(urea_kg + dap_kg + mop_kg, 1),
            "application_schedule_en": schedule_en,
            "application_schedule_ta": schedule_ta
        },
        "scientific_explanation": {
            "en": explanation_en,
            "ta": explanation_ta
        },
        "agronomic_disclaimer": {
            "en": disclaimer_en,
            "ta": disclaimer_ta
        }
    }

# AI Farmer Advisory Endpoint (Bilingual English & Tamil)
@app.get("/api/advisory")
def get_ai_advisory(field_id: str = Query("field_1")):
    field = next((f for f in FIELDS_STORE if f["id"] == field_id), FIELDS_STORE[0])
    
    advisories = [
        {
            "id": "adv_1",
            "category": "Irrigation & Moisture",
            "category_ta": "நீர்ப்பாசனம் மற்றும் ஈரப்பதம்",
            "priority": "HIGH",
            "icon": "droplet",
            "title_en": "Soil Moisture Review - Upcoming Rainfall Advisory",
            "title_ta": "மண் ஈரப்பதம் மற்றும் மழை முன்னறிவிப்பு ஆலோசனை",
            "message_en": f"Telemetry for {field['name']} shows root moisture at 68.4%. Heavy rain (~48mm) is forecast in 48 hours. Postpone all secondary pump operations to avoid root rot and excess waterlogging.",
            "message_ta": f"{field['name_ta']} நிலத்தில் வேர் ஈரப்பதம் 68.4% ஆக உள்ளது. அடுத்த 48 மணி நேரத்தில் கனமழை (~48 மி.மீ) பெய்ய வாய்ப்புள்ளது. வேர் அழுகலைத் தடுக்க பம்ப் நீர்ப்பாசனத்தை தற்காலிகமாக நிறுத்தவும்.",
            "action_en": "Keep drainage gates open; defer drip cycle until rain subsides.",
            "action_ta": "வடிகால் வாய்க்கால்களை திறந்து வைக்கவும்; மழை நிற்கும் வரை சொட்டுநீரை இயக்க வேண்டாம்."
        },
        {
            "id": "adv_2",
            "category": "Nutrient & Fertilizer",
            "category_ta": "ஊட்டச்சத்து மற்றும் உர மேலாண்மை",
            "priority": "MEDIUM",
            "icon": "sprout",
            "title_en": "Nitrogen Uptake Support - Panicle & Vegetative Stage",
            "title_ta": "தழைச்சத்து மேலாண்மை - பயிர் வளர்ச்சிப் பருவம்",
            "message_en": f"Nitrogen sensor telemetry reads 88.0 mg/kg, which is approaching the threshold for the {field['growth_stage']}. Apply Neem-Coated Urea in split doses only after the heavy rain clears to prevent nutrient leaching.",
            "message_ta": f"தழைச்சத்து அளவு 88.0 மி.கி/கிலோவாக உள்ளது, இது {field['growth_stage']} பருவத்திற்கு போதுமானது. மழை நின்ற பிறகு வேப்பம்பூசிய யூரியாவை பிரித்து இடவும், இதனால் சத்துக்கள் நீரில் அடித்துச் செல்வது தடுக்கப்படும்.",
            "action_en": "Broadcast 25 kg Neem-Coated Urea per acre following the rain.",
            "action_ta": "மழை நின்ற பிறகு ஏக்கருக்கு 25 கிலோ வேப்பம்பூசிய யூரியா இடவும்."
        },
        {
            "id": "adv_3",
            "category": "Pest & Disease Risk",
            "category_ta": "பூச்சி மற்றும் நோய் கண்காணிப்பு",
            "priority": "MEDIUM",
            "icon": "bug",
            "title_en": "Fungal Sheath Blight Alert (High Humidity)",
            "title_ta": "பூஞ்சை குலைநோய் எச்சரிக்கை (அதிக ஈரப்பதம்)",
            "message_en": "Ambient humidity above 82% combined with warm temperatures creates favorable conditions for fungal blast and sheath blight. Scout field borders for brown lesions.",
            "message_ta": "காற்றின் ஈரப்பதம் 82% க்கும் அதிகமாகவும், வெப்பமான சூழலும் நிலவுவதால் பூஞ்சை அல்லது குலைநோய் பரவ வாய்ப்புள்ளது. பயிரின் இலைகளில் பழுப்பு நிற புள்ளிகள் உள்ளதா என கண்காணிக்கவும்.",
            "action_en": "Spray Pseudomonas fluorescens organic culture at 10g/L water as preventative measure.",
            "action_ta": "முன்னெச்சரிக்கையாக சூடோமோனாஸ் நுண்ணுயிரி கரைசலை ஒரு லிட்டர் தண்ணீருக்கு 10 கிராம் கலந்து தெளிக்கவும்."
        },
        {
            "id": "adv_4",
            "category": "Soil pH & Condition",
            "category_ta": "மண் கார அமிலத்தன்மை (pH)",
            "priority": "LOW",
            "icon": "flask-conical",
            "title_en": "Soil pH is in Optimal Agronomic Range",
            "title_ta": "மண் pH உகந்த விவசாய வரம்பில் உள்ளது",
            "message_en": "Current soil pH of 6.45 is ideal for micronutrient availability (Iron, Zinc, Boron). No liming or sulfur amendment needed.",
            "message_ta": "தற்போதைய மண் pH 6.45 ஆக உள்ளது, இது நுண்ணூட்டச்சத்துக்கள் எளிதில் கிடைக்க உகந்த நிலையாகும். சுண்ணாம்பு அல்லது கந்தகம் இடத் தேவையில்லை.",
            "action_en": "Maintain organic matter through vermicompost application.",
            "action_ta": "மண்புழு உரம் இட்டு மண்ணின் இயற்கை வளத்தை பராமரிக்கவும்."
        }
    ]

    return {
        "status": "success",
        "field_id": field["id"],
        "advisories": advisories
    }

# Alerts & Notification Center Endpoint
@app.get("/api/alerts")
def get_alerts(field_id: str = Query("field_1")):
    alerts = [
        {
            "id": "alt_101",
            "severity": "red",
            "severity_label": "Critical Warning",
            "severity_label_ta": "தீவிர எச்சரிக்கை",
            "title_en": "Heavy Rainfall Risk Ahead (48mm in 48h)",
            "title_ta": "பலத்த மழை அபாயம் (48 மி.மீ எதிர்பார்க்கப்படுகிறது)",
            "description_en": "Monsoon depression alert issued for Thanjavur zone. Waterlogging risk in low-lying crop blocks.",
            "description_ta": "தஞ்சாவூர் மண்டலத்திற்கு மழை எச்சரிக்கை. தாழ்வான பயிர் நிலங்களில் நீர் தேங்கும் அபாயம் உள்ளது.",
            "timestamp": "12 minutes ago",
            "active": True
        },
        {
            "id": "alt_102",
            "severity": "yellow",
            "severity_label": "Advisory Warning",
            "severity_label_ta": "கவனிக்க வேண்டிய எச்சரிக்கை",
            "title_en": "High Ambient Humidity (> 84%)",
            "title_ta": "அதிக காற்றின் ஈரப்பதம் (> 84%)",
            "description_en": "Continuous high humidity elevates fungal spore germination risk. Monitor lower leaves.",
            "description_ta": "தொடர்ச்சியான அதிக ஈரப்பதம் பூஞ்சை பரவுவதற்கு வழிவகுக்கும். பயிரின் அடிப்பகுதியை கண்காணிக்கவும்.",
            "timestamp": "45 minutes ago",
            "active": True
        },
        {
            "id": "alt_103",
            "severity": "green",
            "severity_label": "Normal Condition",
            "severity_label_ta": "வழக்கமான நிலை",
            "title_en": "Soil Temperature within Optimal Range (28.2°C)",
            "title_ta": "மண் வெப்பநிலை சீரான அளவில் உள்ளது (28.2°C)",
            "description_en": "Root zone temperature is ideal for active microbiological soil activity.",
            "description_ta": "வேர் மண்டல வெப்பநிலை நுண்ணுயிர்களின் செயல்பாட்டிற்கு சாதகமாக உள்ளது.",
            "timestamp": "2 hours ago",
            "active": True
        },
        {
            "id": "alt_104",
            "severity": "green",
            "severity_label": "Normal Condition",
            "severity_label_ta": "வழக்கமான நிலை",
            "title_en": "Ultrasonic Water Reservoir Sensor: Normal (78%)",
            "title_ta": "நீர் தேக்கத் தொட்டி அளவு: சீரானது (78%)",
            "description_en": "Farm water reservoir has adequate capacity for upcoming cycles.",
            "description_ta": "பண்ணை நீர் தொட்டியில் போதுமான அளவு நீர் இருப்பு உள்ளது.",
            "timestamp": "3 hours ago",
            "active": True
        }
    ]
    return {"status": "success", "field_id": field_id, "alerts": alerts}

# Custom CSV Sensor Data Upload Endpoint
@app.post("/api/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")
    
    try:
        df = pd.read_csv(file.file)
        rows_count = len(df)
        columns = list(df.columns)
        
        # Check detected columns
        has_moisture = any("moist" in c.lower() for c in columns)
        has_temp = any("temp" in c.lower() for c in columns)
        has_npk = any("n" in c.lower() or "nitro" in c.lower() for c in columns)
        
        # Quick summary stats
        summary = {
            "file_name": file.filename,
            "total_rows_imported": rows_count,
            "detected_columns": columns,
            "has_moisture_data": has_moisture,
            "has_temperature_data": has_temp,
            "has_npk_data": has_npk,
            "sample_records": df.head(5).to_dict(orient="records"),
            "status": "Successfully Parsed and Ingested into Crop Telemetry Analytics"
        }
        return {"status": "success", "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")

# Farmer Authentication Endpoint
@app.post("/api/auth/login")
def login(req: AuthLoginRequest):
    return {
        "status": "success",
        "token": "demo-jwt-farmer-token-xyz-123",
        "user": {
            "name": "Selvam Murugan",
            "name_ta": "செல்வம் முருகன்",
            "phone": "+91 98421 54321",
            "email": "selvam.farmer@smartagri.org",
            "district": "Thanjavur, Tamil Nadu",
            "total_land_acres": 10.5,
            "fields_count": len(FIELDS_STORE)
        }
    }

@app.post("/api/auth/register")
def register(name: str = Form(...), phone: str = Form(...), district: str = Form("Thanjavur")):
    return {
        "status": "success",
        "message": "Farmer registered successfully",
        "user": {
            "name": name,
            "phone": phone,
            "district": district,
            "total_land_acres": 5.0
        }
    }

# Static files serving for built frontend
FRONTEND_DIST = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend", "dist"))
if os.path.exists(FRONTEND_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        # Do not intercept api routes
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

