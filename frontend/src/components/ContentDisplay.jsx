import React from 'react'

export function ContentDisplay({ content, topic, contentType, loading, error }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`)
    element.setAttribute('download', `${topic.replace(/\s+/g, '_')}_${Date.now()}.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (loading) {
    return (
      <div className="bg-gray-900/30 backdrop-blur-lg rounded-2xl shadow-2xl p-12 text-center border border-white/30 animate-pulse">
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-300 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
            <div className="absolute inset-2 bg-slate-900 rounded-full"></div>
          </div>
        </div>
        <p className="text-white text-lg font-semibold mb-2">Creating your {contentType}</p>
        <p className="text-gray-400 text-sm">Our AI is crafting amazing content for you...</p>
        <div className="mt-6 flex justify-center gap-1">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 backdrop-blur-lg border-2 border-red-600/50 rounded-2xl shadow-2xl p-8">
        <div className="flex items-start gap-4">
          <span className="text-4xl animate-bounce" style={{ animationDuration: '1s' }}>⚠️</span>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-red-300 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-200 leading-relaxed">{error}</p>
            <p className="text-sm text-red-300/70 mt-3">💡 Try checking your internet connection or simplifying your topic</p>
          </div>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="bg-white/5 backdrop-blur-lg border-2 border-dashed border-white/20 rounded-2xl shadow-2xl p-12 text-center hover:border-white/40 transition-all duration-300">
        <div className="text-6xl mb-4 animate-bounce" style={{ animationDuration: '2s' }}>📝</div>
        <p className="text-white text-lg font-medium">Your content will appear here</p>
        <p className="text-gray-400 text-sm mt-2">Enter a topic and click generate to get started</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/30 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden hover:border-white/40 transition-all duration-300 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-white/10 to-gray-300/10 border-b border-white/20 p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Topic</p>
            <p className="text-xl font-bold text-white mt-1 line-clamp-2">{topic}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Content Type</p>
            <div className="mt-1 inline-block bg-white/10 px-3 py-1 rounded-full border border-white/30">
              <p className="text-sm font-semibold text-white capitalize">{contentType}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="prose prose-invert max-w-none">
          <div className="text-gray-100 leading-relaxed whitespace-pre-wrap font-medium text-lg">
            {content}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-black/50 border-t border-white/20 px-8 py-6 flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 bg-white hover:bg-gray-100 text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group border border-white/50"
        >
          <span className={`text-xl transition-transform duration-300 ${copied ? 'scale-110' : 'group-hover:scale-110'}`}>
            {copied ? '✅' : '📋'}
          </span>
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 bg-gradient-to-r from-gray-400 to-gray-300 hover:from-gray-300 hover:to-gray-200 text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group border border-gray-300/50"
        >
          <span className="text-xl group-hover:scale-110 transition-transform duration-300">⬇️</span>
          <span>Download</span>
        </button>
      </div>
    </div>
  )
}

export default ContentDisplay
