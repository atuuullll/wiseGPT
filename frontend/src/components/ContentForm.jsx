import React from 'react'

const SpeechRecognitionApi =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

function ContentForm({ onSubmit, loading, serverStatus }) {
  const [topic, setTopic] = React.useState('')
  const [contentType, setContentType] = React.useState('blog post')
  const [isListening, setIsListening] = React.useState(false)
  const [micError, setMicError] = React.useState('')
  const recognitionRef = React.useRef(null)
  const speechSupported = Boolean(SpeechRecognitionApi)
  const waveformBars = [0, 150, 300, 450]

  React.useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null
        recognitionRef.current.onerror = null
        recognitionRef.current.onend = null
        recognitionRef.current.stop()
      }
    }
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (topic.trim()) {
      onSubmit(topic, contentType)
      setTopic('')
      setMicError('')
    }
  }

  const handleMicToggle = () => {
    if (!speechSupported || loading || !serverStatus) {
      return
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      return
    }

    const recognition = new SpeechRecognitionApi()
    recognition.lang = 'en-US'
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setMicError('')
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || '')
        .join(' ')
        .trim()

      setTopic(transcript)

      const latestResult = event.results[event.results.length - 1]
      if (latestResult?.isFinal) {
        recognition.stop()
      }
    }

    recognition.onerror = (event) => {
      const errorMessages = {
        'audio-capture': 'No microphone was detected. Check your device and try again.',
        'not-allowed': 'Microphone permission was denied. Allow access and try again.',
        'service-not-allowed': 'Speech recognition is blocked in this browser.',
        'network': 'Speech recognition needs a network connection right now.',
        'no-speech': 'No speech was detected. Please try again.',
      }

      setMicError(errorMessages[event.error] || 'Voice input could not start. Please try again.')
    }

    recognition.onend = () => {
      setIsListening(false)
      recognitionRef.current = null
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="topic" className="mb-3 block text-sm font-semibold text-white">
          Content Topic
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Enter a topic or use the mic to speak it"
              maxLength={500}
              disabled={loading || !serverStatus}
              className="w-full rounded-2xl border border-white/20 bg-black/30 px-5 py-4 pr-20 text-white placeholder-gray-500 focus:border-amber-300/60 focus:bg-black/50 focus:outline-none disabled:cursor-not-allowed disabled:bg-black/10"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-white/60">
              {topic.length}/500
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !serverStatus || !topic.trim()}
            aria-label="Send typed topic"
            className="flex min-w-[64px] items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-400/15 px-4 py-4 text-emerald-100 shadow-lg shadow-emerald-500/10 transition-all hover:border-emerald-200/60 hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 12 20 4 13 20 11 13 4 12Z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleMicToggle}
            disabled={!speechSupported || loading || !serverStatus}
            aria-pressed={isListening}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
            className={`flex min-w-[64px] items-center justify-center rounded-2xl border px-4 py-4 transition-all ${
              isListening
                ? 'border-rose-300/60 bg-rose-400/15 text-rose-100 shadow-lg shadow-rose-500/20'
                : 'border-white/15 bg-white/8 text-white hover:border-amber-300/50 hover:bg-white/12'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4a3 3 0 0 1 3 3v5a3 3 0 1 1-6 0V7a3 3 0 0 1 3-3Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 0 1-14 0M12 18v3M8 21h8" />
            </svg>
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 ${
            isListening
              ? 'border-rose-400/20 bg-rose-400/10 text-rose-100'
              : 'border-white/10 bg-black/20 text-slate-300'
          }`}>
            <span className={`h-2 w-2 rounded-full ${isListening ? 'bg-rose-400 animate-pulse' : 'bg-slate-500'}`}></span>
            <span>{isListening ? 'Listening...' : 'Voice input ready'}</span>
          </div>

          {isListening && (
            <div className="inline-flex items-center gap-1 rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-2">
              {waveformBars.map((delay) => (
                <span
                  key={delay}
                  className="h-4 w-1 rounded-full bg-rose-300 animate-[waveform_1s_ease-in-out_infinite]"
                  style={{ animationDelay: `${delay}ms` }}
                ></span>
              ))}
            </div>
          )}

          {!speechSupported && (
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-amber-100">
              <span className="h-2 w-2 rounded-full bg-amber-300"></span>
              <span>Speech input is not supported in this browser</span>
            </div>
          )}
        </div>

        {micError && (
          <div className="mt-3 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {micError}
          </div>
        )}

        <div className="mt-3 h-1 overflow-hidden rounded-full border border-white/20 bg-black/40">
          <div
            className="h-full bg-gradient-to-r from-amber-200 via-white to-emerald-200 transition-all duration-300"
            style={{ width: `${(topic.length / 500) * 100}%` }}
          ></div>
        </div>
      </div>

      <div>
        <label htmlFor="contentType" className="mb-3 block text-sm font-semibold text-white">
          Content Type
        </label>
        <div className="relative">
          <select
            id="contentType"
            value={contentType}
            onChange={(event) => setContentType(event.target.value)}
            disabled={loading || !serverStatus}
            className="w-full appearance-none rounded-2xl border border-white/20 bg-black/30 px-5 py-4 text-white transition-all duration-300 focus:border-amber-300/60 focus:bg-black/50 focus:outline-none disabled:cursor-not-allowed disabled:bg-black/10"
          >
            <option value="blog post" className="bg-slate-900">Blog Post</option>
            <option value="article" className="bg-slate-900">Article</option>
            <option value="technical summary" className="bg-slate-900">Technical Summary</option>
            <option value="news article" className="bg-slate-900">News Article</option>
            <option value="social media post" className="bg-slate-900">Social Media Post</option>
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/70">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-medium text-white">
          Tip: speak naturally or enter a specific topic for sharper content drafts.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || !serverStatus || !topic.trim()}
        className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white px-6 py-4 font-bold text-black shadow-lg transition-all duration-300 hover:border-white hover:bg-gray-100 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"></div>
            <span>Generating content...</span>
          </>
        ) : (
          <>
            <span className="text-lg transition-transform group-hover:scale-110">Generate</span>
            <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
              AI
            </span>
          </>
        )}
      </button>
    </form>
  )
}

export default ContentForm
