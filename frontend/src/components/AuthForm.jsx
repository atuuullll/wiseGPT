import React, { useState } from 'react'
import {
  formatAuthError,
  signInWithEmail,
  signUpWithEmail,
} from '../services/auth'

function AuthForm() {
  const [mode, setMode] = useState('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isSignUp = mode === 'signup'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (isSignUp) {
        await signUpWithEmail({ name, email, password })
      } else {
        await signInWithEmail({ email, password })
      }

      setName('')
      setEmail('')
      setPassword('')
    } catch (authError) {
      setError(formatAuthError(authError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-3xl border border-white/[0.15] shadow-2xl p-8 md:p-10 animate-slideUp">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80 mb-3">Access</p>
          <h2 className="text-3xl font-semibold text-white">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-slate-300 mt-3">
            {isSignUp
              ? 'Start with email and password, then continue into the content studio.'
              : 'Sign in to continue generating and managing your content.'}
          </p>
        </div>
        <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-amber-100">
          Firebase Auth
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-white/5 border border-white/10 mb-8">
        <button
          type="button"
          onClick={() => {
            setMode('signin')
            setError('')
          }}
          className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
            !isSignUp
              ? 'bg-white text-slate-950 shadow-lg'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('signup')
            setError('')
          }}
          className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
            isSignUp
              ? 'bg-white text-slate-950 shadow-lg'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {isSignUp && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="w-full rounded-2xl border border-white/[0.15] bg-white/[0.08] px-4 py-3 text-white placeholder:text-slate-400 focus:border-amber-300/60 focus:bg-white/[0.12]"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="w-full rounded-2xl border border-white/[0.15] bg-white/[0.08] px-4 py-3 text-white placeholder:text-slate-400 focus:border-amber-300/60 focus:bg-white/[0.12]"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            required
            minLength={6}
            className="w-full rounded-2xl border border-white/[0.15] bg-white/[0.08] px-4 py-3 text-white placeholder:text-slate-400 focus:border-amber-300/60 focus:bg-white/[0.12]"
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-amber-300 px-4 py-3 font-semibold text-slate-950 shadow-lg shadow-amber-300/20 transition-all hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

export default AuthForm
