# API Documentation

## LLM Content Generator REST API

Comprehensive documentation for the LLM Content Generator API built with Flask and Google Gemini.

### Base URL
- Development: `http://localhost:5000`
- Production: `https://api.example.com`

### Authentication

If `REQUIRE_AUTH=true` is set in `.env`, all endpoints require an API key:

**Header:**
```
X-API-Key: your-api-key-here
```

### Rate Limiting

By default, rate limiting is enabled (configurable via environment variables):
- **Default Limit:** 30 requests per minute per IP address
- **Configure:** Set `REQUESTS_PER_MINUTE` and `RATE_LIMIT_ENABLED` in `.env`
- **Response:** HTTP 429 when limit exceeded

---

## Endpoints

### 1. Home / API Documentation
**GET** `/`

Get API documentation and available endpoints.

**Response:**
```json
{
  "name": "LLM Content Generator API",
  "version": "1.0.0",
  "endpoints": {
    "POST /generate": "Generate content",
    "POST /generate-blog": "Generate a blog post",
    "POST /generate-summary": "Generate a summary",
    "GET /health": "Health check"
  },
  "authentication": {
    "enabled": false,
    "method": "X-API-Key header"
  }
}
```

---

### 2. Health Check
**GET** `/health`

Check if the API service is running and healthy.

**Response:**
```json
{
  "status": "healthy",
  "service": "LLM Content Generator"
}
```

**Status Code:** `200 OK`

---

### 3. Generate Content
**POST** `/generate`

Generate content based on a topic and content type.

**Headers:**
```
Content-Type: application/json
X-API-Key: your-api-key-here (if REQUIRE_AUTH=true)
```

**Request Body:**
```json
{
  "topic": "Artificial Intelligence",
  "content_type": "blog post"
}
```

**Parameters:**
- `topic` (required, string, max 500 chars): The topic to generate content about
- `content_type` (optional, string): Type of content (default: "blog post")
  - Supported: blog post, article, summary, technical summary, news article, social media post

**Success Response (200):**
```json
{
  "success": true,
  "topic": "Artificial Intelligence",
  "content_type": "blog post",
  "content": "The generated blog post content here..."
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or validation error
- `401 Unauthorized`: Missing or invalid API key
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

**Example cURL:**
```bash
curl -X POST http://localhost:5000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Machine Learning",
    "content_type": "article"
  }'
```

---

### 4. Generate Blog Post
**POST** `/generate-blog`

Generate a blog post about a specific topic.

**Headers:**
```
Content-Type: application/json
X-API-Key: your-api-key-here (if REQUIRE_AUTH=true)
```

**Request Body:**
```json
{
  "topic": "Web Development Trends"
}
```

**Parameters:**
- `topic` (required, string, max 500 chars): Topic for the blog post

**Success Response (200):**
```json
{
  "success": true,
  "topic": "Web Development Trends",
  "content_type": "blog post",
  "content": "The generated blog post content..."
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5000/generate-blog \
  -H "Content-Type: application/json" \
  -d '{"topic": "Python Tips and Tricks"}'
```

---

### 5. Generate Summary
**POST** `/generate-summary`

Generate a technical summary about a specific topic.

**Headers:**
```
Content-Type: application/json
X-API-Key: your-api-key-here (if REQUIRE_AUTH=true)
```

**Request Body:**
```json
{
  "topic": "Cloud Computing Fundamentals"
}
```

**Parameters:**
- `topic` (required, string, max 500 chars): Topic to summarize

**Success Response (200):**
```json
{
  "success": true,
  "topic": "Cloud Computing Fundamentals",
  "content_type": "technical summary",
  "content": "The generated summary content..."
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:5000/generate-summary \
  -H "Content-Type: application/json" \
  -d '{"topic": "Data Science Basics"}'
```

---

## Error Handling

### Common Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - Invalid input |
| 401  | Unauthorized - Missing or invalid API key |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error |

### Error Response Format

```json
{
  "success": false,
  "error": "Description of the error"
}
```

### Rate Limit Error

```json
{
  "error": "Rate limit exceeded. Maximum 30 requests per minute allowed.",
  "retry_after": 60
}
```

---

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| GOOGLE_API_KEY | - | Google Gemini API key (required) |
| MODEL_NAME | gemini-flash-latest | Gemini model to use |
| TEMPERATURE | 0.7 | Creativity level (0-2) |
| MAX_TOKENS | 1000 | Maximum response length |
| FLASK_ENV | development | Flask environment |
| FLASK_PORT | 5000 | Server port |
| REQUIRE_AUTH | false | Enable API key authentication |
| API_KEYS | - | Comma-separated API keys |
| RATE_LIMIT_ENABLED | true | Enable rate limiting |
| REQUESTS_PER_MINUTE | 30 | Max requests per minute per IP |

---

## Examples

### Python

```python
import requests
import json

BASE_URL = "http://localhost:5000"

# Generate content
response = requests.post(
    f"{BASE_URL}/generate",
    headers={"Content-Type": "application/json"},
    json={
        "topic": "Artificial Intelligence",
        "content_type": "blog post"
    }
)

if response.status_code == 200:
    data = response.json()
    print(f"Topic: {data['topic']}")
    print(f"Type: {data['content_type']}")
    print(f"Content: {data['content']}")
else:
    print(f"Error: {response.status_code}")
    print(response.json())
```

### JavaScript

```javascript
const API_BASE = "http://localhost:5000";

async function generateContent(topic, contentType = "blog post") {
  const response = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      topic,
      content_type: contentType
    })
  });

  if (response.ok) {
    const data = await response.json();
    console.log("Generated content:", data.content);
  } else {
    console.error("Error:", response.status, await response.json());
  }
}

generateContent("Web Development", "article");
```

### cURL

```bash
# Generate a blog post
curl -X POST http://localhost:5000/generate-blog \
  -H "Content-Type: application/json" \
  -d '{"topic": "Python Programming Tips"}'

# With authentication
curl -X POST http://localhost:5000/generate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key-here" \
  -d '{"topic": "AI Trends", "content_type": "news article"}'
```

---

## Response Times

Expected response times (varies based on content length and API):
- Simple content: 5-15 seconds
- Complex content: 15-30 seconds
- Timeout: 30 seconds

---

## Support

For issues or questions:
1. Check the logs: `python server.py` shows application logs
2. Verify `.env` configuration
3. Ensure Google Gemini API key is valid
4. Check rate limiting hasn't been exceeded
5. Open an issue on GitHub

---

## Version History

### v1.0.0 (Current)
- Initial release
- Google Gemini integration
- Rate limiting
- API key authentication
- Full API documentation
