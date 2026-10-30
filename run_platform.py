"""
Crop Stress Telemetry & Advisory - Single-Entry Platform Launcher
Serves both the FastAPI REST APIs and the React Production UI on http://localhost:8000
"""
import os
import sys
import webbrowser

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from main import app
import uvicorn

if __name__ == "__main__":
    print("=" * 70)
    print(" 🌾 Crop Stress Telemetry & Advisory Platform")
    print(" AI-Powered Smart Agriculture Monitoring and Advisory Platform")
    print("=" * 70)
    print(" Serving Web UI & REST API at: http://127.0.0.1:8000")
    print(" Interactive Swagger Docs at:   http://127.0.0.1:8000/docs")
    print(" Languages Supported:           English & தமிழ் (Tamil)")
    print("=" * 70)
    
    uvicorn.run(app, host="127.0.0.1", port=8000)
