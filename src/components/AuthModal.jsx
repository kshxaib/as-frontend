import React, { useState } from 'react';
import { LogIn, UserPlus, Lock, User, Sparkles, X, AlertCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand & Title */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mb-3">
            {authModalMode === 'login' ? <LogIn className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            {authModalMode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            {authModalMode === 'login'
              ? 'Enter your credentials to access your exam materials.'
              : 'Register to manage resources, solve papers, and tune AI answers.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="mt-6 flex rounded-xl border border-slate-800 bg-slate-950 p-1">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              authModalMode === 'login'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              authModalMode === 'register'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. student42"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-indigo-400 transition-all disabled:opacity-50"
          >
            {isLoading
              ? 'Authenticating...'
              : authModalMode === 'login'
              ? 'Sign In to AcademicStack'
              : 'Create Account'}
          </button>
        </form>

        <p className="mt-5 text-center text-[11px] text-slate-500">
          {authModalMode === 'login' ? "Don't have an account? " : 'Already registered? '}
          <button
            onClick={() => switchMode(authModalMode === 'login' ? 'register' : 'login')}
            className="text-indigo-400 hover:underline font-medium"
          >
            {authModalMode === 'login' ? 'Create one now' : 'Sign in here'}
          </button>
        </p>
      </div>
    </div>
  );
};
