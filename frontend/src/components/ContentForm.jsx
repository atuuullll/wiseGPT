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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Server Status Indicator */}
      <div className={`p-3 rounded-lg text-sm font-medium ${
        serverStatus 
          ? 'bg-green-100 text-green-800 border border-green-300' 
          : 'bg-red-100 text-red-800 border border-red-300'
      }`}>
        {serverStatus ? '✅ Server Connected' : '❌ Server Offline'}
      </div>

      {/* Topic Input */}
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
          Content Topic
        </label>
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic (e.g., Artificial Intelligence, Web Development)"
          maxLength={500}
          disabled={loading || !serverStatus}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
        />
        <p className="text-xs text-gray-500 mt-1">{topic.length}/500 characters</p>
      </div>

      {/* Content Type Selection */}
      <div>
        <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-2">
          Content Type
        </label>
        <select
          id="contentType"
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          disabled={loading || !serverStatus}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
        >
          <option value="blog post">Blog Post</option>
          <option value="article">Article</option>
          <option value="technical summary">Technical Summary</option>
          <option value="news article">News Article</option>
          <option value="social media post">Social Media Post</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !serverStatus || !topic.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            Generating...
          </>
        ) : (
          <>
            ✨ Generate Content
          </>
        )}
      </button>
    </form>
  )
}

import React from 'react'
export default ContentForm
