# Crop Stress Telemetry & Advisory (AgentX Starter)
### AI-Powered Smart Agriculture Monitoring and Advisory Platform

A submission-ready autonomous ReAct agent architecture for smart farming, soil IoT telemetry diagnostics, 7-day soil trend analysis, rainfall risk forecasting, and FAO-56 precision water/fertilizer formulation in English and Tamil (தமிழ்).

---

## 📁 Repository Structure

```
agentx-starter/
├── agent/
│   ├── core.py             # ReAct loop, step cap, repeat guard, error recovery
│   ├── llm.py              # Gemini / Groq wrapper with 429 retry & offline mock
│   └── prompt_builder.py   # System prompt with Crop Stress & Agronomy ROLE
├── tools/
│   ├── __init__.py         # Tool base class + registry
│   ├── calculator.py       # Safe arithmetic via AST evaluation
│   ├── data_query.py       # list_files, read_file, sql_query over CSVs
│   └── web_search.py       # DuckDuckGo search & agricultural knowledge
├── config/__init__.py      # Models, MAX_ITERATIONS, data folder paths
├── data/                   # Datasets: crop_recommendation.csv, iot_telemetry.json, field_stage_sensor_data.csv
├── tests/test_agent.py     # Offline unit tests (no API key required)
├── notebooks/agentx_colab.ipynb # Google Colab demonstration notebook
├── main.py                 # CLI entry point + judging contract (--json)
├── .env.example            # GEMINI_API_KEY / GROQ_API_KEY template
├── requirements.txt
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Installation
```bash
git clone <repo-url>
cd agentx-starter
pip install -r requirements.txt
```

### 2. Environment Configuration (Optional)
Copy `.env.example` to `.env` to connect live LLM providers:
```bash
cp .env.example .env
```
*Note: If no API key is provided, the agent runs using deterministic agronomic offline mocks, ensuring all tests and judging contracts succeed out of the box.*

### 3. Run Offline Unit Tests
Verify all tools, repeat guards, and ReAct loops offline:
```bash
python tests/test_agent.py
```

### 4. Run CLI with Automated Judging Contract (`--json`)
```bash
python main.py --json "What are the optimal soil and rainfall conditions for Rice?"
```
Outputs standard JSON evaluation payload:
```json
{
  "query": "What are the optimal soil and rainfall conditions for Rice?",
  "success": true,
  "steps_taken": 2,
  "final_answer": "Rice grows optimally at N=90, P=42, K=43 with rainfall > 200mm...",
  "trajectory": [ ... ]
}
```

---

## 🧠 Key Agent Capabilities
- **ReAct Loop with Safety Caps**: Enforces `MAX_ITERATIONS` and `MAX_REPEATS` to avoid endless tool calling.
- **Safe Calculator**: AST-based mathematical parser executing agricultural formulas without risky arbitrary `eval()`.
- **SQL Data Query Tool**: Queries SQLite in-memory tables populated from real farm sensor CSVs (`crop_recommendation.csv`, `field_stage_sensor_data.csv`).
- **Bilingual Delivery**: Outputs farming advisories in both English and Tamil.
