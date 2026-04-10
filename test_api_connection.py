"""Diagnostic script to test Google Gemini API connection."""

import requests
import json
import logging
from config import GOOGLE_API_KEY, MODEL_NAME

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

print("=" * 60)
print("GOOGLE GEMINI API CONNECTION DIAGNOSTIC")
print("=" * 60)

# 1. Check API Key
print("\n[1] Checking API Key Configuration...")
if not GOOGLE_API_KEY:
    print("❌ ERROR: GOOGLE_API_KEY is not set!")
    exit(1)
elif GOOGLE_API_KEY == "your-google-api-key-here":
    print("❌ ERROR: GOOGLE_API_KEY is still using placeholder value!")
    exit(1)
else:
    print(f"✓ API Key configured: ***{GOOGLE_API_KEY[-8:]}")

# 2. Check Model Name
print("\n[2] Checking Model Name...")
print(f"✓ Model: {MODEL_NAME}")

# 3. Test API Endpoint
print("\n[3] Testing API Endpoint Connection...")
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent"
print(f"   URL: {GEMINI_API_URL}")

# Prepare test payload
payload = {
    "contents": [
        {
            "parts": [
                {
                    "text": "Say 'Hello, I am working properly.' in one sentence."
                }
            ]
        }
    ]
}

headers = {
    "Content-Type": "application/json"
}

params = {
    "key": GOOGLE_API_KEY
}

try:
    print("\n   Sending test request (timeout: 30 seconds)...")
    response = requests.post(
        GEMINI_API_URL,
        headers=headers,
        params=params,
        json=payload,
        timeout=30
    )
    
    print(f"   HTTP Status: {response.status_code}")
    
    if response.status_code == 200:
        print("   ✓ API Connection Successful!")
        result = response.json()
        
        # Try to extract generated text
        if "candidates" in result and len(result["candidates"]) > 0:
            candidate = result["candidates"][0]
            if "content" in candidate and "parts" in candidate["content"]:
                parts = candidate["content"]["parts"]
                if len(parts) > 0:
                    generated_text = parts[0].get("text", "No content")
                    print(f"\n   Generated Response: {generated_text}")
        
        print("\n✓ API is working correctly! You can now run: python main.py")
        
    elif response.status_code == 400:
        print("   ❌ ERROR 400: Bad Request")
        print("      - Check if your API key is valid")
        print("      - Check if the model name is correct")
        print(f"\n   Response: {response.text}")
        
    elif response.status_code == 401:
        print("   ❌ ERROR 401: Unauthorized")
        print("      - Your API key is invalid or expired")
        print("      - Get a new key from: https://makersuite.google.com/app/apikey")
        
    elif response.status_code == 403:
        print("   ❌ ERROR 403: Forbidden")
        print("      - Check if the API is enabled in your Google Cloud project")
        
    elif response.status_code == 429:
        print("   ❌ ERROR 429: Rate Limited")
        print("      - Too many requests sent too quickly")
        print("      - Wait a few minutes and try again")
        
    elif response.status_code == 500:
        print("   ❌ ERROR 500: Google API Server Error")
        print("      - The Google API service may be experiencing issues")
        print("      - Try again in a few moments")
        
    else:
        print(f"   ❌ ERROR {response.status_code}: Unexpected error")
        print(f"   Response: {response.text}")
        
except requests.exceptions.Timeout:
    print("   ❌ ERROR: Connection Timed Out (30 seconds)")
    print("      Possible causes:")
    print("      1. Your internet connection is slow or unstable")
    print("      2. Google API servers are not responding")
    print("      3. Your firewall/network is blocking the connection")
    print("\n   Solutions:")
    print("      - Check your internet connection")
    print("      - Try again in a few moments")
    print("      - Check if you can access: https://generativelanguage.googleapis.com")
    
except requests.exceptions.ConnectionError as e:
    print(f"   ❌ ERROR: Connection Failed")
    print(f"      Details: {str(e)}")
    print("      - Check your internet connection")
    print("      - Firewall/VPN might be blocking the connection")
    
except json.JSONDecodeError as e:
    print(f"   ❌ ERROR: Invalid JSON Response")
    print(f"      Details: {str(e)}")
    
except Exception as e:
    print(f"   ❌ ERROR: {str(e)}")

print("\n" + "=" * 60)
