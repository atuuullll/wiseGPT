import React, { useState, useEffect } from 'react'
import ContentForm from './components/ContentForm'
import ContentDisplay from './components/ContentDisplay'
import { generateContent, checkHealth } from './services/api'

function App() {
  const [content, setContent] = useState('')
  const [topic, setTopic] = useState('')
  const [contentType, setContentType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [serverStatus, setServerStatus] = useState(false)

  // Check server health on mount and periodically
  useEffect(() => {
    const checkServer = async () => {
      const health = await checkHealth()
      setServerStatus(!!health)
    }

    checkServer()
    const interval = setInterval(checkServer, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const handleGenerate = async (newTopic, newContentType) => {
    setLoading(true)
    setError('')
    setTopic(newTopic)
    setContentType(newContentType)

    try {
      const response = await generateContent(newTopic, newContentType)
      setContent(response.content || response.message || 'No content generated')
    } catch (err) {
      setError(err.message)
      setContent('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">✨ LLM Content Generator</h1>
          <p className="text-blue-100 text-lg">Generate high-quality content powered by Google Gemini AI</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Create Content</h2>
            <ContentForm
              onSubmit={handleGenerate}
              loading={loading}
              serverStatus={serverStatus}
            />
          </div>

          {/* Display Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📄 Generated Content</h2>
            <ContentDisplay
              content={content}
              topic={topic}
              contentType={contentType}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="mb-2">🚀 LLM Content Generator v1.0</p>
          <p className="text-sm text-gray-500">
            Powered by Google Gemini • Built with React & Flask
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
