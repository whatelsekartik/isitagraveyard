import React, { useState } from 'react';
import { GlassModal } from './GlassModal';
import { useGraveyard } from '../../context/GraveyardContext';
import { Lock, Mail, User, Sparkles, Database, AlertCircle } from 'lucide-react';

export function AuthModal() {
  const { authModalOpen, setAuthModalOpen, signIn, signUp, isSupabaseConfigured } = useGraveyard();

  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    const res =
      mode === 'signin'
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password, displayName.trim());
    setSubmitting(false);

    if (res?.error) {
      setError(res.error);
    }
  };

  return (
    <GlassModal
      open={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
      subtitle="Identity & Persistence"
      title={mode === 'signin' ? 'Sign In to the Archive' : 'Claim your Developer Passport'}
      maxWidth="max-w-md"
    >
      <div className="mb-5 flex rounded-full border border-[#181614]/15 bg-[#EFE8DA] p-1">
        <button
          type="button"
          onClick={() => {
            setMode('signin');
            setError('');
          }}
          className={`flex-1 rounded-full py-2 text-xs font-semibold transition ${
            mode === 'signin'
              ? 'bg-[#181614] text-[#FFFDF9] shadow-sm'
              : 'text-[#5E584E] hover:text-[#181614]'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('signup');
            setError('');
          }}
          className={`flex-1 rounded-full py-2 text-xs font-semibold transition ${
            mode === 'signup'
              ? 'bg-[#181614] text-[#FFFDF9] shadow-sm'
              : 'text-[#5E584E] hover:text-[#181614]'
          }`}
        >
          Create Account
        </button>
      </div>

      {!isSupabaseConfigured ? (
        <div className="mb-5 rounded-2xl border border-[#1E4E8C]/25 bg-[#E8EEF5] p-4 text-xs leading-relaxed text-[#181614]">
          <p className="font-semibold text-[#1E4E8C]">Demo Sandbox Active</p>
          <p className="mt-1 text-[#5E584E]">
            Live backend credentials are not configured in this environment. You can continue using
            every feature in local Demo Sandbox mode.
          </p>
        </div>
      ) : (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#17663F]/25 bg-[#EAF5DC] p-3.5 text-xs text-[#5E584E]">
          <Database className="mt-0.5 h-4 w-4 shrink-0 text-[#17663F]" />
          <span>
            Connected to live <strong className="text-[#181614]">Supabase</strong> auth &amp;
            PostgreSQL with Row Level Security. Or close this modal to keep exploring in Demo
            Sandbox mode.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
              Display Name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E584E]" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Elena Vance"
                className="paper-input w-full rounded-xl py-2.5 pl-10 pr-4 text-sm"
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
            Email Address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E584E]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.dev"
              className="paper-input w-full rounded-xl py-2.5 pl-10 pr-4 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E584E]" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="paper-input w-full rounded-xl py-2.5 pl-10 pr-4 text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-[#B4432C]/35 bg-[#F9EAE6] p-3 text-xs text-[#B4432C]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !isSupabaseConfigured}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#181614] px-4 py-3 text-sm font-semibold text-[#FFFDF9] shadow-sm transition hover:bg-[#17663F] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4 text-[#D8F29B]" />
          {submitting
            ? 'Authenticating...'
            : mode === 'signin'
              ? 'Sign In'
              : 'Create Account & Continue'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setAuthModalOpen(false)}
        className="mt-4 w-full rounded-xl border border-[#181614]/15 py-2.5 text-xs font-medium text-[#5E584E] transition hover:bg-[#EFE8DA] hover:text-[#181614]"
      >
        Continue in Guest Demo Sandbox
      </button>
    </GlassModal>
  );
}
