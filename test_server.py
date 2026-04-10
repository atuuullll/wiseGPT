"""Unit tests for server.py Flask API."""

import unittest
import json
import os
from unittest.mock import patch
from server import app


class TestFlaskAPI(unittest.TestCase):
    """Test suite for Flask API endpoints."""
    
    def setUp(self):
        """Set up test client before each test."""
        self.app = app
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()
    
    def test_home_endpoint(self):
        """Test home endpoint returns API documentation."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        
        self.assertIn('name', data)
        self.assertIn('endpoints', data)
        self.assertEqual(data['name'], "LLM Content Generator API")
    
    def test_health_endpoint(self):
        """Test health check endpoint."""
        response = self.client.get('/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        
        self.assertEqual(data['status'], "healthy")
        self.assertEqual(data['service'], "LLM Content Generator")
    
    @patch('server.create_content')
    def test_generate_endpoint_success(self, mock_create_content):
        """Test /generate endpoint with valid input."""
        # Mock the create_content function
        mock_create_content.return_value = "Generated content about AI"
        
        # Send POST request
        response = self.client.post(
            '/generate',
            data=json.dumps({
                'topic': 'Artificial Intelligence',
                'content_type': 'blog post'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        
        self.assertTrue(data['success'])
        self.assertEqual(data['topic'], 'Artificial Intelligence')
        self.assertEqual(data['content'], "Generated content about AI")
    
    def test_generate_endpoint_missing_data(self):
        """Test /generate endpoint with missing JSON data."""
        response = self.client.post(
            '/generate',
            data=None,
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)
    
    def test_generate_endpoint_missing_topic(self):
        """Test /generate endpoint with missing topic field."""
        response = self.client.post(
            '/generate',
            data=json.dumps({
                'content_type': 'blog post'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('topic', data['error'].lower())
    
    def test_generate_endpoint_topic_too_long(self):
        """Test /generate endpoint with topic exceeding max length."""
        long_topic = 'a' * 501  # Exceeds MAX_TOPIC_LENGTH of 500
        
        response = self.client.post(
            '/generate',
            data=json.dumps({
                'topic': long_topic,
                'content_type': 'blog post'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('exceed', data['error'].lower())
    
    @patch('server.create_content')
    def test_generate_blog_endpoint(self, mock_create_content):
        """Test /generate-blog endpoint."""
        mock_create_content.return_value = "Blog post about Python"
        
        response = self.client.post(
            '/generate-blog',
            data=json.dumps({'topic': 'Python Programming'}),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        
        self.assertTrue(data['success'])
        self.assertEqual(data['content_type'], 'blog post')
    
    @patch('server.create_content')
    def test_generate_summary_endpoint(self, mock_create_content):
        """Test /generate-summary endpoint."""
        mock_create_content.return_value = "Summary about ML"
        
        response = self.client.post(
            '/generate-summary',
            data=json.dumps({'topic': 'Machine Learning'}),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        
        self.assertTrue(data['success'])
        self.assertEqual(data['content_type'], 'technical summary')
    
    @patch('server.create_content')
    def test_generate_endpoint_whitespace_handling(self, mock_create_content):
        """Test that whitespace is properly stripped from input."""
        mock_create_content.return_value = "Content"
        
        response = self.client.post(
            '/generate',
            data=json.dumps({
                'topic': '  Artificial Intelligence  ',
                'content_type': 'blog post'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['topic'], 'Artificial Intelligence')


class TestAPIAuthentication(unittest.TestCase):
    """Test suite for API authentication."""
    
    def setUp(self):
        """Set up test client before each test."""
        # Temporarily set REQUIRE_AUTH
        os.environ['REQUIRE_AUTH'] = 'false'
        self.app = app
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()
    
    def test_auth_disabled_by_default(self):
        """Test that authentication is disabled by default."""
        # REQUIRE_AUTH should be false by default
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()
