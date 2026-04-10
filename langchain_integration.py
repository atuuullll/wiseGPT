"""LangChain integration for content generation using Google Gemini."""

import logging
from typing import Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from config import GOOGLE_API_KEY, DEFAULT_TEMPERATURE, DEFAULT_MAX_TOKENS

logger = logging.getLogger(__name__)

# Initialize the LangChain LLM
def get_llm(temperature: float = DEFAULT_TEMPERATURE):
    """
    Get a LangChain LLM instance for Google Gemini.
    
    Args:
        temperature: The creativity parameter (0-2)
    
    Returns:
        ChatGoogleGenerativeAI instance
    """
    try:
        llm = ChatGoogleGenerativeAI(
            model="gemini-pro",
            google_api_key=GOOGLE_API_KEY,
            temperature=temperature,
            max_output_tokens=DEFAULT_MAX_TOKENS
        )
        logger.info("LangChain LLM initialized successfully")
        return llm
    except Exception as e:
        logger.error(f"Failed to initialize LangChain LLM: {e}")
        raise


def create_content_chain(content_type: str = "blog post") -> LLMChain:
    """
    Create a LangChain chain for content generation.
    
    Args:
        content_type: Type of content to generate
    
    Returns:
        LLMChain instance
    """
    try:
        llm = get_llm()
        
        # Create a prompt template
        prompt_template = PromptTemplate(
            input_variables=["topic", "content_type"],
            template="Write a {content_type} about {topic}. Make it informative and engaging."
        )
        
        # Create a chain
        chain = LLMChain(
            llm=llm,
            prompt=prompt_template,
            verbose=False
        )
        
        logger.info(f"LangChain chain created for content type: {content_type}")
        return chain
    
    except Exception as e:
        logger.error(f"Failed to create LangChain chain: {e}")
        raise


def generate_content_with_langchain(
    topic: str,
    content_type: str = "blog post",
    temperature: Optional[float] = None
) -> str:
    """
    Generate content using LangChain and Google Gemini.
    
    Args:
        topic: The topic for content generation
        content_type: Type of content to generate
        temperature: Optional temperature override
    
    Returns:
        Generated content as a string
    """
    try:
        if temperature is None:
            temperature = DEFAULT_TEMPERATURE
        
        logger.info(f"Generating content with LangChain: topic={topic}, type={content_type}")
        
        # Create the chain
        chain = create_content_chain(content_type)
        
        # Run the chain
        result = chain.run(topic=topic, content_type=content_type)
        
        logger.info("Content generated successfully with LangChain")
        return result
    
    except Exception as e:
        logger.error(f"Error generating content with LangChain: {e}")
        raise


# Advanced content generation with memory and context
class ContentGenerator:
    """Advanced content generator using LangChain with conversation memory."""
    
    def __init__(self, temperature: float = DEFAULT_TEMPERATURE):
        """
        Initialize the content generator.
        
        Args:
            temperature: The creativity parameter (0-2)
        """
        self.temperature = temperature
        self.llm = get_llm(temperature)
        self.memory = {}  # Store context for multi-turn generations
        logger.info("ContentGenerator initialized")
    
    def generate(self, topic: str, content_type: str = "blog post") -> str:
        """
        Generate content for a given topic.
        
        Args:
            topic: The topic to write about
            content_type: The type of content
        
        Returns:
            Generated content
        """
        try:
            prompt = PromptTemplate(
                input_variables=["topic", "content_type"],
                template="Write a {content_type} about {topic}. Make it informative and engaging."
            )
            
            chain = LLMChain(llm=self.llm, prompt=prompt)
            result = chain.run(topic=topic, content_type=content_type)
            
            # Store in memory for reference
            self.memory[topic] = result
            
            logger.info(f"Content generated for topic: {topic}")
            return result
        
        except Exception as e:
            logger.error(f"Error in ContentGenerator.generate: {e}")
            raise
    
    def get_context(self, topic: str) -> Optional[str]:
        """Get previously generated content for a topic."""
        return self.memory.get(topic)
    
    def clear_memory(self):
        """Clear the conversation memory."""
        self.memory.clear()
        logger.info("Memory cleared")
