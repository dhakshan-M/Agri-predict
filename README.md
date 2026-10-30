# Crop Stress Telemetry & Advisory
### AI-Powered Smart Agriculture Monitoring and Advisory Platform
**Built for Smart Agriculture Hackathon | Dual Language: English & தமிழ் (Tamil)**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20TailwindCSS-61DAFB.svg)](https://reactjs.org/)
[![Scikit-Learn](https://img.shields.io/badge/ML%20Accuracy-99.55%25-orange.svg)](https://scikit-learn.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌾 Project Overview

**Crop Stress Telemetry & Advisory** is an end-to-end intelligent agriculture platform designed to help farmers optimize irrigation, protect soil fertility, and prevent crop stress. 

By integrating continuous **IoT sensor telemetry** (capacitive soil moisture, temperature, pH, optical NPK, and ultrasonic reservoir monitoring), **7-day trend analytics**, predictive **weather & rainfall risk alerts**, and **FAO-56 precision water/fertilizer calculations**, the system delivers actionable, voice-ready farming advice in both **English and Tamil**.

---

## 🌟 Key Platform Features

### 1. Main Farmer Dashboard
- **8 Interactive Telemetry Cards**: Real-time Soil Moisture (%), Soil Temperature (°C), Soil pH, Nitrogen (N), Phosphorus (P), Potassium (K), Current Weather, and Crop Health Score (0-100).
- **Edge Pump Actuator**: Interactive smart motor controller with AUTO-STANDBY and manual FORCE PUMP ON/OFF overrides.
- **Ultrasonic Reservoir Level**: Tracks water tank level percentage and distance (cm) to prevent dry pump cavitation.

### 2. Seven-Day Soil Trend Analysis
- **Multi-Parameter Interactive Graphs**: Smooth Chart.js time-series tracking Soil Moisture vs Rainfall, Soil Temperature, pH variations, and NPK nutrient depletion.
- **AI Agronomic Diagnostic Interpretation**: Automated contextual summary in English and Tamil explaining soil dynamics over the past 7 days.

### 3. Weather and Rainfall Risk
- **Integrated Live Weather API**: 7-day meteorological forecast with precipitation probabilities and mm gauges.
- **Automated Irrigation Decision Engine**: Evaluates 48-hour rainfall against root moisture to automatically recommend:
  - `DELAY IRRIGATION` (Heavy rain expected, risk of waterlogging)
  - `REVIEW IRRIGATION` (Light/moderate showers, cut volume by 50%)
  - `SCHEDULE IRRIGATION` (Dry weather, run drip cycles).

### 4. Smart Fertilizer and Water Calculator
- **Scientifically Formulated Dosage**: Inputs include Crop Name, Land Area (Acre/Hectare), Current Moisture %, Soil NPK test values, Growth Stage, and Soil Classification (Clay Loam, Sandy Loam, Red Soil, Black Soil).
- **Outputs**:
  - Exact water volume required in **Litres** and cubic meters (m³).
  - Commercial fertilizer breakdown: **Urea (46% N)**, **DAP (18-46-0)**, and **MOP Potash (60% K2O)** in kilograms.
  - Split-dose application timing schedule.
  - Verified agronomic disclaimer advising laboratory soil testing.

### 5. Bilingual AI Farmer Advisory (English & தமிழ்)
- Real-time recommendations categorized into **Irrigation & Moisture**, **Nutrient Management**, **Pest & Disease Risk**, and **Soil pH**.
- **Speech Synthesis (TTS) Integration**: Click "Listen Audio / கேளுங்கள்" to hear advice spoken aloud in Tamil or English.
- **Instant Language Switcher**: Seamless 1-click toggle between English and Tamil across all screens.

### 6. Reports, Alert Center & CSV Ingestion
- **Tri-Color Alert Ticker**: Filter alerts by `Green (Normal)`, `Yellow (Warning)`, and `Red (Critical)`.
- **Custom CSV Sensor Data Upload**: Drag & drop field telemetry files for instant schema parsing and analytics ingestion.
- **Printable Official Advisory Report**: Clean, printer-friendly summary report with field metrics, soil audit table, and bilingual directives.

### 7. Multi-Field Management & Farmer Profile
- Monitor multiple agricultural blocks:
  - *Cauvery Delta - Tanjore Paddy Block A*
  - *Anamalai Foot - Pollachi Coconut Grove*
  - *Vaigai Basin - Madurai Tomato & Veg Plot*
- Register and add new field blocks dynamically.

---

## 🤖 GitHub AgentX Template (`agentx-starter/`)

Included in the repository is the complete **AgentX ReAct Autonomous Agent** conforming to the judging contract:

```
agentx-starter/
├── agent/
│   ├── core.py             # ReAct loop, step cap, repeat guard, error recovery
│   ├── llm.py              # Gemini / Groq wrapper with 429 retry & offline mock
│   └── prompt_builder.py   # Specialized AGRI-INTELLIGENCE system prompt
├── tools/
│   ├── __init__.py         # Tool registry and base class
│   ├── calculator.py       # Safe AST-based arithmetic calculator
│   ├── data_query.py       # list_files, read_file, sql_query over CSVs via SQLite
│   └── web_search.py       # DuckDuckGo agricultural search
├── config/__init__.py      # Configurations, MAX_ITERATIONS, data paths
├── data/                   # crop_recommendation.csv, field_stage_sensor_data.csv, iot_telemetry.json
├── tests/test_agent.py     # Offline unit tests (100% pass without API key)
├── notebooks/agentx_colab.ipynb # Google Colab demo notebook
├── main.py                 # CLI entry point + judging contract (--json)
├── .env.example
├── requirements.txt
└── README.md
```

### Running the Agent Offline Tests:
```bash
cd agentx-starter
python tests/test_agent.py
```

### Evaluating Judging Contract via CLI (`--json`):
```bash
python main.py --json "What are the optimal soil and rainfall conditions for Rice?"
```

---

## 🚀 Running the Full-Stack Application

### Prerequisites
- Python 3.10+
- Node.js 18+ (for frontend development)

### Quick Run (Production Single-Entry Mode)
The backend is configured to serve both the FastAPI REST API and the React production build on port 8000:
```bash
python run_platform.py
```
Open **[http://localhost:8000](http://localhost:8000)** in your web browser!

Interactive Swagger API Documentation:
- **[http://localhost:8000/docs](http://localhost:8000/docs)**

### Development Mode (Hot Reloading)
**Terminal 1 (Backend):**
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** for Vite live hot reload.

---

## 📊 9 Required Website Pages

| # | Page / Module | Status | Features |
|---|---|---|---|
| 1 | **Home Page** | ✅ Complete | Hero banner, real-time telemetry card, system architecture flow, quick actions |
| 2 | **Farmer Dashboard** | ✅ Complete | 8 real-time sensor cards (Moisture, Temp, pH, NPK, Weather, Health), Smart Motor Switch |
| 3 | **Soil Monitoring** | ✅ Complete | Multi-depth gauges, NPK nutrient balance, DS18B20 & capacitive sensor diagnostics |
| 4 | **Seven-Day Analytics** | ✅ Complete | Interactive Chart.js graphs (Moisture, Temp, pH, NPK), AI 7-day soil summary in EN & தமிழ் |
| 5 | **Weather Forecast** | ✅ Complete | 7-day weather outlook, rain probability %, automated SCHEDULE/DELAY/REVIEW irrigation rule |
| 6 | **Fertilizer & Water Calculator** | ✅ Complete | FAO-56 Penman-Monteith formulas, Water (L), Urea/DAP/MOP (kg), split timing, disclaimer |
| 7 | **AI Farmer Advisory** | ✅ Complete | Bilingual advice feed, priority badges, Speech Synthesis voice playback, ML Crop Predictor |
| 8 | **Reports & Alerts** | ✅ Complete | Tri-color priority filter (Green/Yellow/Red), CSV upload engine, printable official PDF report |
| 9 | **Farm Profile & Login** | ✅ Complete | Cultivator profile, Soil Health Card link, multi-field switcher, dynamic field registration |

---

## 📜 Agronomic Disclaimer
Dosages and recommendations calculated by the platform are verified scientific estimations based on FAO-56 and agricultural university extension standards. Farmers are strongly encouraged to obtain an official Soil Health Card test from their local agricultural extension office prior to bulk agrochemical application.
