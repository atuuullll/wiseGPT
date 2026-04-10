"""Content Generation Application using Google Gemini."""

import requests
import json
import logging
import time
from config import GOOGLE_API_KEY, MODEL_NAME, DEFAULT_TEMPERATURE, DEFAULT_MAX_TOKENS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Retry configuration
MAX_RETRIES = 3
INITIAL_RETRY_DELAY = 1  # Start with 1 second
MAX_RETRY_DELAY = 32  # Cap at 32 seconds

# Google Gemini API endpoint
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent"


def create_content(topic: str, content_type: str = "blog post") -> str:
    """
    Generate content using Google Gemini API.
    
    Args:
        topic: The topic for content generation
        content_type: Type of content to generate (blog post, article, summary, etc.)
    
    Returns:
        Generated content as a string
        
    Raises:
        ValueError: If topic is empty or invalid
        Exception: If API request fails
    """
    # Validate inputs
    if not topic or not isinstance(topic, str):
        logger.error("Invalid topic provided")
        raise ValueError("Topic must be a non-empty string")
    
    topic = topic.strip()
    if len(topic) == 0:
        logger.error("Topic is empty after stripping")
        raise ValueError("Topic cannot be empty")
    
    if not isinstance(content_type, str):
        logger.error("Invalid content_type provided")
        raise ValueError("Content type must be a string")
    
    # Prepare the request payload
    prompt = f"Write a {content_type} about {topic}. Make it informative and engaging."
    
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }
    
    # Make API request to Gemini
    headers = {
        "Content-Type": "application/json"
    }
    
    params = {
        "key": GOOGLE_API_KEY
    }
    
    try:
        logger.info(f"Calling Gemini API for topic: {topic}")
        
        # Retry logic with exponential backoff
        retry_delay = INITIAL_RETRY_DELAY
        for attempt in range(MAX_RETRIES):
            try:
                response = requests.post(
                    GEMINI_API_URL,
                    headers=headers,
                    params=params,
                    json=payload,
                    timeout=30
                )
                
                # Handle specific error codes with retry
                if response.status_code == 503:
                    logger.warning(f"API returned 503 (Service Unavailable). Attempt {attempt + 1}/{MAX_RETRIES}")
                    if attempt < MAX_RETRIES - 1:
                        logger.info(f"Retrying in {retry_delay} seconds...")
                        time.sleep(retry_delay)
                        retry_delay = min(retry_delay * 2, MAX_RETRY_DELAY)  # Exponential backoff
                        continue
                    else:
                        logger.error(f"API Service Unavailable after {MAX_RETRIES} attempts")
                        raise Exception(f"API Service Unavailable after {MAX_RETRIES} attempts. Try again later.")
                
                if response.status_code == 429:
                    logger.warning(f"Rate limited (429). Attempt {attempt + 1}/{MAX_RETRIES}")
                    if attempt < MAX_RETRIES - 1:
                        wait_time = min(retry_delay * 2, MAX_RETRY_DELAY)
                        logger.info(f"Retrying in {wait_time} seconds...")
                        time.sleep(wait_time)
                        retry_delay = wait_time
                        continue
                    else:
                        raise Exception(f"Rate limit exceeded after {MAX_RETRIES} attempts")
                
                if response.status_code != 200:
                    logger.error(f"API Error: {response.status_code} - {response.text}")
                    raise Exception(f"API Error: {response.status_code} - {response.text}")
                
                # Success - break out of retry loop
                break
                
            except (requests.exceptions.Timeout, requests.exceptions.ConnectionError) as e:
                logger.warning(f"Connection issue on attempt {attempt + 1}/{MAX_RETRIES}: {e}")
                if attempt < MAX_RETRIES - 1:
                    logger.info(f"Retrying in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                    retry_delay = min(retry_delay * 2, MAX_RETRY_DELAY)
                else:
                    raise Exception("Network error after multiple attempts. Please check your internet connection.")
        
        result = response.json()
        
        # Extract the generated text
        if "candidates" in result and len(result["candidates"]) > 0:
            candidate = result["candidates"][0]
            if "content" in candidate and "parts" in candidate["content"]:
                parts = candidate["content"]["parts"]
                if len(parts) > 0:
                    generated_text = parts[0].get("text", "No content generated")
                    logger.info("Content generated successfully")
                    return generated_text
        
        logger.warning("No content found in API response")
        return "No content generated"
    
    except requests.exceptions.Timeout:
        logger.error("API request timed out after retries")
        raise Exception("API request timed out. Please try again later.")
    except requests.exceptions.ConnectionError as e:
        logger.error(f"Connection error: {e}")
        raise Exception("Failed to connect to API. Please check your internet connection.")
    except json.JSONDecodeError:
        logger.error("Failed to parse API response")
        raise Exception("Invalid response from API")


def main():
    """Main function to demonstrate content generation."""
    print("=" * 50)
    print("LLM Content Generator (Google Gemini)")
    print("=" * 50)
    
    if not GOOGLE_API_KEY or GOOGLE_API_KEY == "your-google-api-key-here":
        print("\n❌ Error: Google Gemini API key is not configured!")
        print("\nPlease follow these steps:")
        print("1. Get your free API key from: https://makersuite.google.com/app/apikey")
        print("2. Edit the .env file in this directory")
        print("3. Replace 'your-google-api-key-here' with your actual API key")
        print("4. Save and run the script again")
        logger.error("Google Gemini API key not configured")
        return
    
    # Example 1: Generate a blog post
    print("\n[1] Generating a blog post about AI...\n")
    try:
        blog_content = create_content("Artificial Intelligence", "blog post")
        print(blog_content)
    except Exception as e:
        print(f"❌ Error: {e}")
        logger.error(f"Failed to generate blog post: {e}")
        return
    
    # Example 2: Generate a different type of content
    print("\n" + "=" * 50)
    print("[2] Generating a summary about Machine Learning...\n")
    try:
        summary = create_content("Machine Learning fundamentals", "technical summary")
        print(summary)
    except Exception as e:
        print(f"❌ Error: {e}")
        logger.error(f"Failed to generate summary: {e}")
        return
    
    print("\n" + "=" * 50)
    print("✅ Content generation completed successfully!")
    print("=" * 50)


if __name__ == "__main__":
    main()
