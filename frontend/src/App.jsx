import React, { useEffect, useState } from 'react'
import AuthForm from './components/AuthForm'
import ContentDisplay from './components/ContentDisplay'
import ContentForm from './components/ContentForm'
import ProfileCard from './components/ProfileCard'
import { checkHealth, generateContent } from './services/api'
import { signOutUser, subscribeToAuthChanges } from './services/auth'

function App() {
  const [content, setContent] = useState('')
  const [topic, setTopic] = useState('')
  const [contentType, setContentType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [serverStatus, setServerStatus] = useState(false)
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    const checkServer = async () => {
      const health = await checkHealth()
      setServerStatus(!!health)
    }

    checkServer()
    const interval = setInterval(checkServer, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((nextUser) => {
      setUser(nextUser)
      setAuthReady(true)
      setAuthError('')
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!user) {
      setContent('')
      setTopic('')
      setContentType('')
      setLoading(false)
      setError('')
    }
  }, [user])

  const handleGenerate = async (newTopic, newContentType) => {
    if (!user) {
      setError('Sign in to generate content.')
      return
    }

    setLoading(true)
    setError('')
    setTopic(newTopic)
    setContentType(newContentType)

    try {
      const response = await generateContent(newTopic, newContentType)
      setContent(response.content || response.message || 'No content generated')
    } catch (requestError) {
      setError(requestError.message)
      setContent('')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOutUser()
    } catch (signOutError) {
      setAuthError(signOutError.message || 'Unable to sign out right now.')
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_28%),linear-gradient(160deg,_#0f172a_0%,_#111827_45%,_#1f2937_100%)]">
      <header className="relative overflow-hidden border-b border-white/10 bg-slate-950/80 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-[-8rem] top-[-8rem] h-72 w-72 rounded-full bg-amber-300/30 blur-3xl"></div>
          <div className="absolute right-[-6rem] top-10 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl"></div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">wiseGPT</h1>
              <p className="mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
                AI-powered content generation for articles, summaries, and more.
              </p>
            </div>

            {user ? (
              <ProfileCard
                user={user}
                onSignOut={handleSignOut}
                authError={authError}
                compact
              />
            ) : (
              <div className="rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur-xl lg:min-w-[24rem]">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Access</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {authReady ? 'Sign in to continue' : 'Checking authentication...'}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Use your account to unlock content generation and saved session access.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-slate-200">
                    <span className={`h-2 w-2 rounded-full ${serverStatus ? 'bg-emerald-400' : 'bg-amber-300'}`}></span>
                    <span>{serverStatus ? 'Backend connected' : 'Backend unavailable'}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-slate-200">
                    <span className="h-2 w-2 rounded-full bg-slate-500"></span>
                    <span>Signed out</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        {!authReady ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-slate-200 backdrop-blur-lg">
            Checking your Firebase session...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              {user ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-lg">
                  <p className="mb-3 text-xs uppercase tracking-[0.3em] text-emerald-200/70">Content Console</p>
                  <h2 className="mb-3 text-2xl font-semibold text-white">Create Content</h2>
                  <p className="mb-8 text-sm text-slate-300">
                    Pick a format, describe the topic, and let the generator draft the first version for you.
                  </p>
                  <ContentForm
                    onSubmit={handleGenerate}
                    loading={loading}
                    serverStatus={serverStatus}
                  />
                </div>
              ) : (
                <AuthForm />
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="mt-3 text-3xl font-semibold text-white">
                  {user ? 'Generated Content' : 'Authentication required'}
                </h2>
                <p className="mt-3 max-w-2xl text-slate-300">
                  {user
                    ? 'Your generated copy appears here, ready to review, copy, or download.'
                    : 'Create an account or sign in with email and password to unlock the content generator.'}
                </p>
              </div>

              {user ? (
                <ContentDisplay
                  content={content}
                  topic={topic}
                  contentType={contentType}
                  loading={loading}
                  error={error}
                />
              ) : (
                <div className="rounded-3xl border border-dashed border-white/[0.15] bg-white/5 p-10 shadow-2xl backdrop-blur-lg">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200/70">Sign Up</p>
                      <p className="mt-4 text-2xl font-semibold text-white">Create a new account</p>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        Use Firebase Authentication with your email and password. Once you are in, the content tools become available immediately.
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200/70">Sign In</p>
                      <p className="mt-4 text-2xl font-semibold text-white">Return to the studio</p>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        Existing users can sign in and continue from the same browser session with Firebase persistence enabled by default.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-white/10 bg-slate-950/70 py-12 text-gray-200 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-3 text-lg font-bold text-amber-300">About</h3>
              <p className="text-sm text-gray-400">An AI-driven content workspace with Firebase authentication and a focused authoring flow.</p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-bold text-amber-300">Features</h3>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>Fast content generation</li>
                <li>Email/password sign up and sign in</li>
                <li>Simple export options</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-bold text-amber-300">Tech Stack</h3>
              <p className="text-sm text-gray-400">Google Gemini, React, Firebase Auth, Flask, and Vite.</p>
            </div>
          </div>
          <hr className="my-6 border-amber-300/[0.15]" />
          <div className="text-center">
            <p className="mb-2 font-semibold text-amber-200">wiseGPT v1.0</p>
            <p className="text-sm text-gray-500">Built for secure content creation in 2026.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
