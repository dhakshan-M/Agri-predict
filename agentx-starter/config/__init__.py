import os
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


# Model configurations
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "gemini-2.0-flash")
FALLBACK_MODEL = os.getenv("FALLBACK_MODEL", "llama-3.3-70b-versatile")

# ReAct Loop Safety Limits
MAX_ITERATIONS = int(os.getenv("MAX_ITERATIONS", "10"))
MAX_REPEATS = int(os.getenv("MAX_REPEATS", "2"))
TIMEOUT_SECONDS = int(os.getenv("TIMEOUT_SECONDS", "30"))

# Base Directories
CONFIG_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CONFIG_DIR, ".."))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
