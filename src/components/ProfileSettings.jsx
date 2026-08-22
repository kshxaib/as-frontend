import React, { useState } from 'react';
import {
  User,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  Sparkles,
  Lock,
  Layers,
  Database,
  FileCheck,
  Calendar,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const ProfileSettings = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    updateOpenAIKey,
    deleteOpenAIKey,
    openAuthModal,
    clearError,
  } = useAuthStore();

  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-slate-400">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <User className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Sign In to Manage Your Profile</h2>
        <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
          Create an account or login to configure your OpenAI API key, manage your personal resources, and solve exam question banks.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const handleSaveKey = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);
    clearError();

    if (!apiKeyInput.trim()) return;

    const res = await updateOpenAIKey(apiKeyInput.trim());
    if (res.success) {
      setApiKeyInput('');
      setSuccessMsg('OpenAI API key encrypted & saved successfully! All AI features are now unlocked.');
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  };

  const handleDeleteKey = async () => {
    if (window.confirm('Are you sure you want to remove your stored OpenAI API key? AI indexing, extraction, and generation will be locked.')) {
      setSuccessMsg(null);
      const res = await deleteOpenAIKey();
      if (res.success) {
        setSuccessMsg('OpenAI API key removed. Your account is now in View-Only mode.');
        setTimeout(() => setSuccessMsg(null), 5000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <User className="h-4 w-4" />
            Account & Governance
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            User Profile & OpenAI Settings
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your personal credentials, OpenAI API key encryption, and feature access permissions.
          </p>
        </div>

        {/* Feedback Banners */}
        {error && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-6">
          {/* User Info Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Profile Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <span className="text-[11px] text-slate-500 uppercase font-medium">Full Name</span>
                <p className="mt-1 text-base font-bold text-white">{user.name}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <span className="text-[11px] text-slate-500 uppercase font-medium">Username</span>
                <p className="mt-1 text-base font-bold text-indigo-300">@{user.username}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <span className="text-[11px] text-slate-500 uppercase font-medium">Member Since</span>
                <p className="mt-1 text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* OpenAI API Key Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">OpenAI API Key Configuration</h2>
                  {user.has_openai_key ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Active & Encrypted
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Key Missing (View-Only Mode)
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Required to execute PDF Vector Indexing, Question Bank Extraction, and RAG Answer Generation.
                </p>
              </div>

              {user.has_openai_key && (
                <button
                  onClick={handleDeleteKey}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove Key
                </button>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSaveKey} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {user.has_openai_key ? 'Update OpenAI API Key' : 'Enter OpenAI API Key'}
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="absolute left-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder={user.has_openai_key ? '••••••••••••••••••••••••••••••••' : 'sk-proj-...'}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-24 text-xs font-mono text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span>{showKey ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Lock className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Encrypted at rest with Fernet. Never exposed in API responses.</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !apiKeyInput.trim()}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all disabled:opacity-40"
                >
                  {isLoading ? 'Saving...' : user.has_openai_key ? 'Update Key' : 'Save & Unlock AI'}
                </button>
              </div>
            </form>

            {/* Feature Unlock Grid */}
            <div className="mt-8 rounded-2xl bg-slate-950/60 border border-slate-800/80 p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                Feature Access Matrix
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-slate-900/60 p-3 border border-slate-800/60">
                  <span className="text-slate-300">View Resources & Solved Sets</span>
                  <span className="text-emerald-400 font-bold">Free (Always Open)</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-900/60 p-3 border border-slate-800/60">
                  <span className="text-slate-300">Download Community & Solved PDFs</span>
                  <span className="text-emerald-400 font-bold">Free (Always Open)</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-900/60 p-3 border border-slate-800/60">
                  <span className="text-slate-300">PyMuPDF Text & Vector Indexing</span>
                  <span className={user.has_openai_key ? 'text-emerald-400 font-bold' : 'text-amber-400 font-semibold'}>
                    {user.has_openai_key ? 'Unlocked' : 'Requires API Key'}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-900/60 p-3 border border-slate-800/60">
                  <span className="text-slate-300">RAG Generation & Phase 7 Review</span>
                  <span className={user.has_openai_key ? 'text-emerald-400 font-bold' : 'text-amber-400 font-semibold'}>
                    {user.has_openai_key ? 'Unlocked' : 'Requires API Key'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
