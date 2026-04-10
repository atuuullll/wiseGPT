"""Test Google Gemini API connection"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
MODEL = "gemini-flash-latest"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"

if not API_KEY or API_KEY == "your-google-api-key-here":
    print("❌ Error: GOOGLE_API_KEY is not set in .env file!")
    print("Please add your API key to the .env file and try again.")
    exit(1)

payload = {
    "contents": [
        {
            "parts": [
                {
                    "text": "Say hello in one word"
                }
            ]
        }
    ]
}

headers = {
    "Content-Type": "application/json"
}

params = {
    "key": API_KEY
}

print("Testing Google Gemini API...")
print(f"URL: {URL}")
print(f"API Key: {API_KEY[:20]}...")

try:
    print("\nSending request...")
    response = requests.post(
        URL,
        headers=headers,
        params=params,
        json=payload,
        timeout=30
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
except requests.exceptions.Timeout:
    print("ERROR: Request timed out")
except requests.exceptions.ConnectionError as e:
    print(f"ERROR: Connection error - {e}")
except Exception as e:
    print(f"ERROR: {e}")
