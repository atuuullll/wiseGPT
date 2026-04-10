import React from 'react'

export function ContentDisplay({ content, topic, contentType, loading, error }) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
        <p className="text-gray-600 text-lg">Generating your {contentType}...</p>
        <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-300 rounded-lg shadow-md p-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">⚠️</span>
          <h3 className="text-xl font-bold text-red-800">Error</h3>
        </div>
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500 text-lg">📝 Generated content will appear here</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 border-l-4 border-blue-500">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-sm text-gray-600 font-medium">Topic</p>
            <p className="text-2xl font-bold text-gray-800">{topic}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 font-medium">Type</p>
            <p className="text-lg font-semibold text-blue-600 capitalize">{contentType}</p>
          </div>
        </div>
        <hr className="border-gray-200 my-4" />
      </div>

      <div className="prose max-w-none">
        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
        <button
          onClick={() => {
            navigator.clipboard.writeText(content)
            alert('✅ Content copied to clipboard!')
          }}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          📋 Copy Content
        </button>
        <button
          onClick={() => {
            const element = document.createElement('a')
            element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`)
            element.setAttribute('download', `${topic.replace(/\s+/g, '_')}_${Date.now()}.txt`)
            element.style.display = 'none'
            document.body.appendChild(element)
            element.click()
            document.body.removeChild(element)
          }}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          ⬇️ Download
        </button>
      </div>
    </div>
  )
}

export default ContentDisplay
