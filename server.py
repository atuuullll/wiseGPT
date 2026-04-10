"""Flask web server for the LLM Content Generator."""

from flask import Flask, request, jsonify
from main import create_content
import traceback
import logging
from functools import wraps
import os
from time import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Enable CORS - Allow requests from frontend on port 3000
@app.after_request
def add_cors_headers(response):
    """Add CORS headers to allow cross-origin requests from frontend."""
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, X-API-Key'
    response.headers['Access-Control-Max-Age'] = '3600'
    return response

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    """Handle OPTIONS requests for CORS preflight."""
    return '', 204

# Load API key from environment
API_KEYS = [key.strip() for key in os.getenv("API_KEYS", "").split(",") if key.strip()]
REQUIRE_AUTH = os.getenv("REQUIRE_AUTH", "false").lower() == "true"

# Rate limiting configuration
RATE_LIMIT_ENABLED = os.getenv("RATE_LIMIT_ENABLED", "true").lower() == "true"
REQUESTS_PER_MINUTE = int(os.getenv("REQUESTS_PER_MINUTE", "30"))

# Validation constants
MAX_TOPIC_LENGTH = 500
MAX_CONTENT_TYPE_LENGTH = 100
ALLOWED_CONTENT_TYPES = ["blog post", "article", "summary", "technical summary", "news article", "social media post"]

# Rate limiting storage
request_history = {}  # Format: {ip: [(timestamp, endpoint), ...]}

def rate_limit(max_requests=REQUESTS_PER_MINUTE, time_window=60):
    """Decorator to implement rate limiting."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not RATE_LIMIT_ENABLED:
                return f(*args, **kwargs)
            
            # Get client IP
            client_ip = request.remote_addr
            current_time = time()
            
            # Initialize request history if needed
            if client_ip not in request_history:
                request_history[client_ip] = []
            
            # Remove old entries outside the time window
            request_history[client_ip] = [
                (ts, ep) for ts, ep in request_history[client_ip]
                if current_time - ts < time_window
            ]
            
            # Check if rate limit exceeded
            requests_in_window = len(request_history[client_ip])
            if requests_in_window >= max_requests:
                logger.warning(f"Rate limit exceeded for IP: {client_ip}")
                return jsonify({
                    "error": f"Rate limit exceeded. Maximum {max_requests} requests per minute allowed.",
                    "retry_after": 60
                }), 429
            
            # Log this request
            request_history[client_ip].append((current_time, request.endpoint))
            logger.info(f"Rate limit check passed for IP: {client_ip} ({requests_in_window + 1}/{max_requests})")
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def require_api_key(f):
    """Decorator to check API key authentication."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not REQUIRE_AUTH:
            return f(*args, **kwargs)
        
        api_key = request.headers.get('X-API-Key')
        
        if not api_key:
            logger.warning("Request missing X-API-Key header")
            return jsonify({"error": "Missing X-API-Key header"}), 401
        
        if api_key not in API_KEYS:
            logger.warning(f"Invalid API key attempted: {api_key[:10]}...")
            return jsonify({"error": "Invalid API key"}), 403
        
        logger.info("API key validated successfully")
        return f(*args, **kwargs)
    
    return decorated_function

@app.route('/')
def home():
    """Home endpoint with API documentation."""
    return jsonify({
        "name": "LLM Content Generator API",
        "version": "1.0.0",
        "endpoints": {
            "POST /generate": "Generate content",
            "POST /generate-blog": "Generate a blog post",
            "POST /generate-summary": "Generate a summary",
            "GET /health": "Health check"
        },
        "authentication": {
            "enabled": REQUIRE_AUTH,
            "method": "X-API-Key header" if REQUIRE_AUTH else "Not required"
        },
        "example": {
            "url": "POST http://localhost:5000/generate",
            "headers": {
                "Content-Type": "application/json",
                "X-API-Key": "your-api-key-here" if REQUIRE_AUTH else "Not required"
            },
            "body": {
                "topic": "Artificial Intelligence",
                "content_type": "blog post"
            }
        }
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "service": "LLM Content Generator"})

@app.route('/generate', methods=['POST'])
@require_api_key
def generate():
    """Generate content based on topic and type."""
    try:
        # Handle JSON parsing errors
        try:
            data = request.get_json()
        except Exception as e:
            logger.warning("Invalid JSON provided in request")
            return jsonify({"error": "Invalid JSON format"}), 400
        
        if not data:
            logger.warning("No JSON data provided")
            return jsonify({"error": "No JSON data provided"}), 400
        
        topic = data.get('topic', '').strip()
        content_type = data.get('content_type', 'blog post').strip().lower()
        
        # Validate topic
        if not topic:
            logger.warning("Missing topic field")
            return jsonify({"error": "Missing 'topic' field"}), 400
        
        if len(topic) > MAX_TOPIC_LENGTH:
            logger.warning(f"Topic exceeds max length of {MAX_TOPIC_LENGTH}")
            return jsonify({"error": f"Topic cannot exceed {MAX_TOPIC_LENGTH} characters"}), 400
        
        # Validate content_type
        if len(content_type) > MAX_CONTENT_TYPE_LENGTH:
            logger.warning(f"Content type exceeds max length of {MAX_CONTENT_TYPE_LENGTH}")
            return jsonify({"error": f"Content type cannot exceed {MAX_CONTENT_TYPE_LENGTH} characters"}), 400
        
        if content_type and content_type not in ALLOWED_CONTENT_TYPES:
            logger.info(f"Using custom content type: {content_type}")
        
        logger.info(f"Generating {content_type} about: {topic}")
        content = create_content(topic, content_type)
        
        return jsonify({
            "success": True,
            "topic": topic,
            "content_type": content_type,
            "content": content
        })
    
    except Exception as e:
        logger.error(f"Error in /generate: {traceback.format_exc()}")
        return jsonify({
            "success": False,
            "error": "Internal server error. Please try again later."
        }), 500

@rate_limit(max_requests=REQUESTS_PER_MINUTE)
@app.route('/generate-blog', methods=['POST'])
@require_api_key
def generate_blog():
    """Generate a blog post."""
    try:
        data = request.get_json()
        topic = data.get('topic', '').strip() if data else None
        
        if not topic:
            logger.warning("Missing topic field in /generate-blog")
            return jsonify({"error": "Missing 'topic' field"}), 400
        
        if len(topic) > MAX_TOPIC_LENGTH:
            logger.warning(f"Topic exceeds max length of {MAX_TOPIC_LENGTH}")
            return jsonify({"error": f"Topic cannot exceed {MAX_TOPIC_LENGTH} characters"}), 400
        
        logger.info(f"Generating blog post about: {topic}")
        content = create_content(topic, "blog post")
        
        return jsonify({
            "success": True,
            "topic": topic,
            "content_type": "blog post",
            "content": content
        })
    
    except Exception as e:
        logger.error(f"Error in /generate-blog: {traceback.format_exc()}")
        return jsonify({
            "success": False,
            "error": "Internal server error. Please try again later."
        }), 500

@rate_limit(max_requests=REQUESTS_PER_MINUTE)
@app.route('/generate-summary', methods=['POST'])
@require_api_key
def generate_summary():
    """Generate a summary."""
    try:
        data = request.get_json()
        topic = data.get('topic', '').strip() if data else None
        
        if not topic:
            logger.warning("Missing topic field in /generate-summary")
            return jsonify({"error": "Missing 'topic' field"}), 400
        
        if len(topic) > MAX_TOPIC_LENGTH:
            logger.warning(f"Topic exceeds max length of {MAX_TOPIC_LENGTH}")
            return jsonify({"error": f"Topic cannot exceed {MAX_TOPIC_LENGTH} characters"}), 400
        
        logger.info(f"Generating summary about: {topic}")
        content = create_content(topic, "technical summary")
        
        return jsonify({
            "success": True,
            "topic": topic,
            "content_type": "technical summary",
            "content": content
        })
    
    except Exception as e:
        logger.error(f"Error in /generate-summary: {traceback.format_exc()}")
        return jsonify({
            "success": False,
            "error": "Internal server error. Please try again later."
        }), 500

if __name__ == '__main__':
    print("Starting LLM Content Generator API Server...")
    print("Server running at http://localhost:5000")
    print("Visit http://localhost:5000 for API documentation")
    if REQUIRE_AUTH:
        print("⚠️  Authentication is ENABLED - API key required in X-API-Key header")
    else:
        print("ℹ️  Authentication is DISABLED - Set REQUIRE_AUTH=true to enable")
    app.run(debug=True, host='0.0.0.0', port=5000)
