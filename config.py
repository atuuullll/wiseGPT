"""Configuration for LLM Content Generator."""

import os
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

# Google Gemini Configuration
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "").strip()
MODEL_NAME = os.getenv("MODEL_NAME", "gemini-flash-latest").strip()
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models"

# Content Generation Settings
try:
    DEFAULT_TEMPERATURE = float(os.getenv("TEMPERATURE", 0.7))
except ValueError:
    logger.warning("Invalid TEMPERATURE value, using default 0.7")
    DEFAULT_TEMPERATURE = 0.7

try:
    DEFAULT_MAX_TOKENS = int(os.getenv("MAX_TOKENS", 1000))
except ValueError:
    logger.warning("Invalid MAX_TOKENS value, using default 1000")
    DEFAULT_MAX_TOKENS = 1000

# Validate configuration
if not GOOGLE_API_KEY:
    logger.warning("GOOGLE_API_KEY environment variable is not set. Configure it in your .env file.")
elif GOOGLE_API_KEY == "your-google-api-key-here":
    logger.warning("GOOGLE_API_KEY is still set to placeholder value. Please update your .env file with your actual API key.")

logger.info(f"Configuration loaded - Model: {MODEL_NAME}, Temperature: {DEFAULT_TEMPERATURE}, Max Tokens: {DEFAULT_MAX_TOKENS}")
