import React from 'react'

function getInitials(name, email) {
  if (name?.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
  }

  return email?.slice(0, 2).toUpperCase() || 'WG'
}

function ProfileCard({ user, onSignOut, authError, compact = false }) {
  const displayName = user?.displayName?.trim() || 'wiseGPT User'
  const email = user?.email || 'No email available'
  const initials = getInitials(user?.displayName, user?.email)
  const provider = user?.providerData?.[0]?.providerId === 'password' ? 'Email and password' : 'Firebase account'

  if (compact) {
    return (
      <section className="rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur-xl lg:min-w-[24rem]">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300 text-lg font-semibold text-slate-950 shadow-lg shadow-amber-300/20">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Profile</p>
            <p className="mt-2 truncate text-lg font-semibold text-white">{displayName}</p>
            <p className="truncate text-sm text-slate-300">{email}</p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-2xl border border-white/[0.15] bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/[0.15]"
          >
            Sign Out
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Authentication</p>
            <p className="mt-2 text-sm font-medium text-white">{provider}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Status</p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm font-medium text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              Signed in
            </div>
          </div>
        </div>

        {authError && (
          <div className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {authError}
          </div>
        )}
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-emerald-200/70">Profile</p>
          <h2 className="text-2xl font-semibold text-white">Account details</h2>
          <p className="mt-3 text-sm text-slate-300">
            Your signed-in identity and access status for the workspace.
          </p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300 text-lg font-semibold text-slate-950">
          {initials}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Name</p>
          <p className="mt-2 text-lg font-medium text-white">{displayName}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Email</p>
          <p className="mt-2 break-all text-lg font-medium text-white">{email}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Authentication</p>
          <p className="mt-2 text-base font-medium text-white">{provider}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Status</p>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm font-medium text-emerald-100">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            Signed in
          </div>
        </div>
      </div>

      {authError && (
        <div className="mt-5 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {authError}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onSignOut}
          className="rounded-2xl border border-white/[0.15] bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/[0.15]"
        >
          Sign Out
        </button>
      </div>
    </section>
  )
}

export default ProfileCard
