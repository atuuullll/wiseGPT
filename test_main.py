"""Unit tests for main.py content generation module."""

import unittest
from unittest.mock import patch, MagicMock
from main import create_content
import json


class TestCreateContent(unittest.TestCase):
    """Test suite for create_content function."""
    
    @patch('main.requests.post')
    def test_create_content_success(self, mock_post):
        """Test successful content generation."""
        # Mock the API response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {
                                "text": "This is generated content about AI."
                            }
                        ]
                    }
                }
            ]
        }
        mock_post.return_value = mock_response
        
        # Call the function
        result = create_content("Artificial Intelligence", "blog post")
        
        # Assert the result
        self.assertEqual(result, "This is generated content about AI.")
        mock_post.assert_called_once()
    
    @patch('main.requests.post')
    def test_create_content_api_error(self, mock_post):
        """Test handling of API errors."""
        # Mock an API error response
        mock_response = MagicMock()
        mock_response.status_code = 400
        mock_response.text = "Bad request"
        mock_post.return_value = mock_response
        
        # Assert that an exception is raised
        with self.assertRaises(Exception) as context:
            create_content("Test", "blog post")
        
        self.assertIn("API Error", str(context.exception))
    
    @patch('main.requests.post')
    def test_create_content_empty_response(self, mock_post):
        """Test handling of empty API response."""
        # Mock an empty response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"candidates": []}
        mock_post.return_value = mock_response
        
        # Call the function
        result = create_content("Test", "blog post")
        
        # Assert the result
        self.assertEqual(result, "No content generated")
    
    def test_create_content_invalid_topic_empty(self):
        """Test validation of empty topic."""
        with self.assertRaises(ValueError) as context:
            create_content("", "blog post")
        
        self.assertIn("Topic", str(context.exception))
    
    def test_create_content_invalid_topic_whitespace(self):
        """Test validation of whitespace-only topic."""
        with self.assertRaises(ValueError) as context:
            create_content("   ", "blog post")
        
        self.assertIn("Topic", str(context.exception))
    
    def test_create_content_invalid_topic_type(self):
        """Test validation of invalid topic type."""
        with self.assertRaises(ValueError) as context:
            create_content(123, "blog post")
        
        self.assertIn("string", str(context.exception))
    
    @patch('main.requests.post')
    def test_create_content_connection_error(self, mock_post):
        """Test handling of connection errors."""
        import requests
        # Mock a connection error
        mock_post.side_effect = requests.exceptions.ConnectionError("Network issue")
        
        # Assert that an exception is raised
        with self.assertRaises(Exception) as context:
            create_content("Test", "blog post")
        
        self.assertIn("connect", str(context.exception).lower())
    
    @patch('main.requests.post')
    def test_create_content_timeout(self, mock_post):
        """Test handling of request timeouts."""
        import requests
        # Mock a timeout
        mock_post.side_effect = requests.exceptions.Timeout("Request timed out")
        
        # Assert that an exception is raised
        with self.assertRaises(Exception) as context:
            create_content("Test", "blog post")
        
        self.assertIn("attempts", str(context.exception).lower())
    
    @patch('main.requests.post')
    def test_create_content_custom_type(self, mock_post):
        """Test content generation with custom content type."""
        # Mock the API response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {
                                "text": "This is a custom type content."
                            }
                        ]
                    }
                }
            ]
        }
        mock_post.return_value = mock_response
        
        # Call the function with custom content type
        result = create_content("Test", "custom content type")
        
        # Assert the result
        self.assertEqual(result, "This is a custom type content.")


if __name__ == '__main__':
    unittest.main()
