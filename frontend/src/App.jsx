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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black text-white shadow-2xl relative overflow-hidden border-b-4 border-white/20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl animate-bounce" style={{ animationDuration: '2s' }}>✨</div>
            <h1 className="text-5xl md:text-6xl font-bold">Content Generator</h1>
          </div>
          <p className="text-white text-lg md:text-xl">Powered by Google Gemini AI • Create stunning content in seconds</p>
          {serverStatus && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full border border-white/40">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="text-sm font-medium text-white">Server Connected</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/40 backdrop-blur-lg rounded-2xl shadow-2xl p-8 h-fit border border-white/20 hover:border-white/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-4xl">📝</span>
                <h2 className="text-2xl font-bold text-white">Create Content</h2>
              </div>
              <ContentForm
                onSubmit={handleGenerate}
                loading={loading}
                serverStatus={serverStatus}
              />
            </div>
          </div>

          {/* Display Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">📄</span>
              <h2 className="text-2xl font-bold text-white">Generated Content</h2>
            </div>
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
      <footer className="bg-black/60 backdrop-blur-sm text-gray-200 mt-20 py-12 border-t-2 border-emerald-600/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-emerald-400 font-bold text-lg mb-3">About</h3>
              <p className="text-sm text-gray-400">A powerful AI-driven content generation platform using cutting-edge LLM technology.</p>
            </div>
            <div>
              <h3 className="text-emerald-400 font-bold text-lg mb-3">Features</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Fast content generation</li>
                <li>• Multiple content types</li>
                <li>• Easy export options</li>
              </ul>
            </div>
            <div>
              <h3 className="text-emerald-400 font-bold text-lg mb-3">Tech Stack</h3>
              <p className="text-sm text-gray-400">Google Gemini • React • Flask • Vite</p>
            </div>
          </div>
          <hr className="border-emerald-600/30 my-6" />
          <div className="text-center">
            <p className="mb-2 text-emerald-300 font-semibold">🚀 LLM Content Generator v1.0</p>
            <p className="text-sm text-gray-500">
              Built with ❤️ • © 2026 Your Project
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
