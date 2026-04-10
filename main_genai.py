"""Content Generation Application using Google Generative AI (newer library)."""

import logging
from config import GOOGLE_API_KEY, MODEL_NAME, DEFAULT_TEMPERATURE, DEFAULT_MAX_TOKENS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import Google Generative AI
try:
    import google.generativeai as genai
    genai.configure(api_key=GOOGLE_API_KEY)
    print("✓ Using google.generativeai library (more reliable)")
except ImportError:
    print("ERROR: google-generativeai package not found")
    print("Install with: pip install google-generativeai")
    exit(1)


def create_content(topic: str, content_type: str = "blog post") -> str:
    """
    Generate content using Google Generative AI.
    
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
    
    try:
        logger.info(f"Generating {content_type} for: {topic}")
        
        # Use the specified model
        model = genai.GenerativeModel(MODEL_NAME)
        
        # Create the prompt
        prompt = f"Write a {content_type} about {topic}. Make it informative and engaging."
        
        # Generate content with timeout
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=DEFAULT_TEMPERATURE,
                max_output_tokens=DEFAULT_MAX_TOKENS,
            )
        )
        
        if response and response.text:
            logger.info("Content generated successfully")
            return response.text
        else:
            logger.warning("No content generated")
            return "No content generated"
            
    except Exception as e:
        logger.error(f"API Error: {str(e)}")
        raise Exception(f"Failed to generate content: {str(e)}")


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
