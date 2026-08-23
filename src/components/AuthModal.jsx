import React, { useState } from 'react';
import { LogIn, UserPlus, Lock, User, X, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    isLoading,
    error,
    closeAuthModal,
    setAuthModalMode,
    login,
    register,
    clearError,
  } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authModalMode === 'login') {
      await login(username, password);
    } else {
      await register(username, password, name);
    }
  };

  const switchMode = (mode) => {
    clearError();
    setAuthModalMode(mode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[var(--overlay)] p-4 pt-16 sm:pt-24 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] p-6 sm:p-7 shadow-[var(--shadow-lg)]">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-[8px] p-2 text-[var(--text-muted)] hover:bg-[var(--surface-well)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X className="h-4 w-4 stroke-[1.5]" />
        </button>

        {/* Brand & Title */}
        <div className="text-center">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-[var(--border)] bg-[var(--surface-well)] text-[var(--primary)] mb-3">
            {authModalMode === 'login' ? <LogIn className="h-5 w-5 stroke-[1.5]" /> : <UserPlus className="h-5 w-5 stroke-[1.5]" />}
          </div>
          <h3 className="font-display text-xl font-normal tracking-tight text-[var(--text-primary)]">
            {authModalMode === 'login' ? 'AcademicStack Access' : 'Create Scholar Account'}
          </h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            {authModalMode === 'login'
              ? 'Enter credentials to open your academic workspace.'
              : 'Register to manage study materials and generate grounded solutions.'}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="mt-5 flex rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] p-1">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 rounded-[6px] py-1.5 font-mono text-xs transition-all ${
              authModalMode === 'login'
                ? 'bg-[var(--surface)] text-[var(--text-primary)] font-semibold border border-[var(--border)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`flex-1 rounded-[6px] py-1.5 font-mono text-xs transition-all ${
              authModalMode === 'register'
                ? 'bg-[var(--surface)] text-[var(--text-primary)] font-semibold border border-[var(--border)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-center gap-2.5 rounded-[8px] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] p-3 text-xs text-[var(--error)]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          {authModalMode === 'register' && (
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] py-2 pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. scholar42"
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] py-2 pl-9 pr-3 font-mono text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] py-2 pl-9 pr-3 font-mono text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 inline-flex items-center justify-center gap-2 rounded-[8px] bg-[var(--primary)] py-2.5 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all disabled:opacity-50 shadow-sm"
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>
              {isLoading
                ? 'Authenticating...'
                : authModalMode === 'login'
                ? 'Sign In to Workspace'
                : 'Create Account'}
            </span>
          </button>
        </form>

        <p className="mt-5 text-center font-mono text-[11px] text-[var(--text-muted)]">
          {authModalMode === 'login' ? "Don't have an account? " : 'Already registered? '}
          <button
            onClick={() => switchMode(authModalMode === 'login' ? 'register' : 'login')}
            className="text-[var(--primary)] hover:underline font-semibold"
          >
            {authModalMode === 'login' ? 'Register now' : 'Sign in here'}
          </button>
        </p>
      </div>
    </div>
  );
};
