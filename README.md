# LLM Content Generator

A Python content generation application using **Google Gemini** and **LangChain** framework.

## Features

- 🤖 Generate high-quality content using Google Gemini (FREE tier available!)
- 🔗 Built with LangChain for structured LLM interactions
- ⚙️ Easy configuration with environment variables
- 📝 Support for multiple content types (blog posts, articles, summaries, etc.)
- 🔄 Flexible prompt templates

## Prerequisites

- Python 3.8 or higher
- Google Gemini API key (get a **free one** at [makersuite.google.com](https://makersuite.google.com/app/apikey))

## Installation

1. **Clone or download this project**

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and replace `your-google-api-key-here` with your actual Google Gemini API key

## Usage

### Basic Usage

Run the main application:
```bash
python main.py
```

### Using It Programmatically

```python
from main import create_content

# Generate a blog post
content = create_content("Python Programming", "blog post")
print(content)

# Generate different content types
summary = create_content("Web Development", "technical summary")
article = create_content("Cloud Computing", "news article")
```

## Configuration

Edit the `.env` file to customize:

- `GOOGLE_API_KEY` - Your Google Gemini API key (required)
- `MODEL_NAME` - Model to use (default: `gemini-flash-latest`)
- `TEMPERATURE` - Creativity level 0-2 (default: `0.7`)
- `MAX_TOKENS` - Maximum response length (default: `1000`)

## Project Structure

```
.
├── main.py              # Core content generation logic
├── config.py            # Configuration and settings
├── requirements.txt     # Project dependencies
├── .env.example         # Environment variables template
├── .env                 # Environment variables (local, not committed)
└── README.md            # This file
```

## Extending the Project

### Add New Content Generators

```python
def generate_social_media_post(topic: str) -> str:
    """Generate a social media post."""
    return create_content(topic, "engaging social media post")
```

### Use Advanced LangChain Features

```python
from langchain.chains import LLMChain
from langchain.memory import ConversationMemory

# Add conversation memory
# Set up multi-step chains
# Integrate with external tools
```

## Troubleshooting

### "ModuleNotFoundError: No module named 'openai'"
- Make sure you've activated the virtual environment
- Run `pip install -r requirements.txt`

### "OPENAI_API_KEY environment variable is not set"
- Copy `.env.example` to `.env`
- Add your API key to `.env`
- Make sure you're in the project directory

### API Rate Limiting
- OpenAI accounts have rate limits
- Wait before making requests or upgrade your account

## Requirements

- langchain
- langchain-openai
- openai
- python-dotenv

See `requirements.txt` for specific versions.

## Next Steps

1. **Test the setup**: Run `python main.py`
2. **Explore LangChain**: Check [LangChain documentation](https://python.langchain.com/)
3. **Customize prompts**: Edit the prompt template in `main.py`
4. **Build features**: Add more content generation functions

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [LangChain Documentation](https://python.langchain.com/)
- [OpenAI Models](https://platform.openai.com/docs/models)

## License

MIT License - feel free to use this project for your own purposes.
