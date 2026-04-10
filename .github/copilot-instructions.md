# Content Generation LLM Project Setup

This project is a content generation application using OpenAI GPT and LangChain.

## Project Overview
- **Type**: Content Generation with LLM
- **LLM Provider**: OpenAI (GPT-4, GPT-3.5)
- **Framework**: LangChain
- **Language**: Python

## Setup Steps

- [x] Verify copilot-instructions.md file is created
- [x] Project requirements clarified (Content generation, OpenAI, LangChain)
- [ ] Install required dependencies
- [ ] Configure environment variables
- [ ] Test basic functionality

## Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # On Windows
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key

4. Run the application:
   ```bash
   python main.py
   ```

## Project Structure
- `main.py` - Core content generation application
- `config.py` - Configuration and API setup
- `requirements.txt` - Project dependencies
- `.env.example` - Environment variable template
