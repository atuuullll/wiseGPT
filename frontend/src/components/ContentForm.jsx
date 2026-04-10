export function ContentForm({ onSubmit, loading, serverStatus }) {
  const [topic, setTopic] = React.useState('')
  const [contentType, setContentType] = React.useState('blog post')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (topic.trim()) {
      onSubmit(topic, contentType)
      setTopic('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Topic Input */}
      <div>
        <label htmlFor="topic" className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <span className="text-lg">🎯</span> Content Topic
        </label>
        <div className="relative">
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g., AI, Web Dev)"
            maxLength={500}
            disabled={loading || !serverStatus}
            className="w-full px-5 py-3 bg-black/30 border-2 border-white/30 rounded-xl focus:outline-none focus:border-white/50 focus:bg-black/50 disabled:bg-black/10 disabled:cursor-not-allowed transition-all duration-300 text-white placeholder-gray-500"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 text-sm font-medium">
            {topic.length}/500
          </div>
        </div>
        <div className="mt-2 h-1 bg-black/40 rounded-full overflow-hidden border border-white/20">
          <div 
            className="h-full bg-gradient-to-r from-white to-gray-300 transition-all duration-300" 
            style={{ width: `${(topic.length / 500) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Content Type Selection */}
      <div>
        <label htmlFor="contentType" className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <span className="text-lg">📋</span> Content Type
        </label>
        <div className="relative">
          <select
            id="contentType"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            disabled={loading || !serverStatus}
            className="w-full px-5 py-3 bg-black/30 border-2 border-white/30 rounded-xl focus:outline-none focus:border-white/50 focus:bg-black/50 disabled:bg-black/10 disabled:cursor-not-allowed transition-all duration-300 text-white appearance-none"
          >
            <option value="blog post" className="bg-slate-900">Blog Post</option>
            <option value="article" className="bg-slate-900">Article</option>
            <option value="technical summary" className="bg-slate-900">Technical Summary</option>
            <option value="news article" className="bg-slate-900">News Article</option>
            <option value="social media post" className="bg-slate-900">Social Media Post</option>
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-white/70">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-white/10 border border-white/20 rounded-xl p-4">
        <p className="text-sm text-white font-medium">💡 Tip: Be specific with your topics for better results</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !serverStatus || !topic.trim()}
        className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl group border border-white/50 hover:border-white"
      >
        {loading ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Generating incredible content...</span>
          </>
        ) : (
          <>
            <span className="text-xl group-hover:animate-bounce">✨</span>
            <span>Generate Content</span>
          </>
        )}
      </button>
    </form>
  )
}

import React from 'react'
export default ContentForm
