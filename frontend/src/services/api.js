import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const generateContent = async (topic, contentType = 'blog post') => {
  try {
    const response = await api.post('/generate', {
      topic,
      content_type: contentType,
    })
    return response.data
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.error || 'Failed to generate content')
    } else if (error.request) {
      throw new Error('No response from server. Make sure the backend is running on port 5000.')
    } else {
      throw new Error(error.message)
    }
  }
}

export const generateBlog = async (topic) => {
  return generateContent(topic, 'blog post')
}

export const generateSummary = async (topic) => {
  return generateContent(topic, 'technical summary')
}

export const checkHealth = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    return null
  }
}
