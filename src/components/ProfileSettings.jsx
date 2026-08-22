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
  Calendar,
  ExternalLink,
  Zap,
  Cpu,
  Flame,
  Layers,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const ProfileSettings = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    updateGeminiKey,
    deleteGeminiKey,
    updateGroqKey,
    deleteGroqKey,
    updateCerebrasKey,
    deleteCerebrasKey,
    updateNvidiaKey,
    deleteNvidiaKey,
    updateOpenAIKey,
    deleteOpenAIKey,
    openAuthModal,
    clearError,
  } = useAuthStore();

  const [keysInput, setKeysInput] = useState({
    gemini: '',
    groq: '',
    cerebras: '',
    nvidia: '',
    openai: '',
  });

  const [showKey, setShowKey] = useState({
    gemini: false,
    groq: false,
    cerebras: false,
    nvidia: false,
    openai: false,
  });

  const [successMsg, setSuccessMsg] = useState(null);

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-slate-400">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <User className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Sign In to Manage Your Profile</h2>
        <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
          Create an account or login to configure your API keys and unlock high-speed RAG and Question Bank tools.
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

  const handleInputChange = (provider, value) => {
    setKeysInput((prev) => ({ ...prev, [provider]: value }));
  };

  const toggleShowKey = (provider) => {
    setShowKey((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleSaveSingleKey = async (provider) => {
    const val = keysInput[provider]?.trim();
    if (!val) return;

    setSuccessMsg(null);
    clearError();

    let res;
    if (provider === 'gemini') res = await updateGeminiKey(val);
    else if (provider === 'groq') res = await updateGroqKey(val);
    else if (provider === 'cerebras') res = await updateCerebrasKey(val);
    else if (provider === 'nvidia') res = await updateNvidiaKey(val);
    else if (provider === 'openai') res = await updateOpenAIKey(val);

    if (res?.success) {
      setKeysInput((prev) => ({ ...prev, [provider]: '' }));
      setSuccessMsg(`${provider.toUpperCase()} API key saved successfully!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const handleDeleteSingleKey = async (provider) => {
    if (!window.confirm(`Are you sure you want to remove your ${provider.toUpperCase()} API key?`)) return;

    setSuccessMsg(null);
    clearError();

    let res;
    if (provider === 'gemini') res = await deleteGeminiKey();
    else if (provider === 'groq') res = await deleteGroqKey();
    else if (provider === 'cerebras') res = await deleteCerebrasKey();
    else if (provider === 'nvidia') res = await deleteNvidiaKey();
    else if (provider === 'openai') res = await deleteOpenAIKey();

    if (res?.success) {
      setSuccessMsg(`${provider.toUpperCase()} API key removed.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const providers = [
    {
      id: 'gemini',
      name: 'Google Gemini',
      tag: 'Required (100% Free)',
      tagColor: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
      description: 'Used for Free Vector Embeddings (text-embedding-004) and RAG fallback generation (1,500 RPD).',
      placeholder: 'AIzaSy...',
      hasKey: user.has_gemini_key,
      getKeyUrl: 'https://aistudio.google.com/app/api-keys?project=gen-lang-client-0528736665',
      icon: Sparkles,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'groq',
      name: 'Groq Cloud',
      tag: 'Required (100% Free)',
      tagColor: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
      description: 'Ultra-fast RAG Generation (Llama 3.3 70B, 300+ tokens/sec, 1,000 RPD).',
      placeholder: 'gsk_...',
      hasKey: user.has_groq_key,
      getKeyUrl: 'https://console.groq.com/keys',
      icon: Zap,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'cerebras',
      name: 'Cerebras Cloud',
      tag: 'Required (100% Free)',
      tagColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
      description: 'High-Volume Question Extraction & AI Reviewer (14,400 Requests/day free!).',
      placeholder: 'csk-...',
      hasKey: user.has_cerebras_key,
      getKeyUrl: 'https://cloud.cerebras.ai/platform/org_x4tk2yfxf9j2m3j4kyf8hxdc/project/prj_3355h68j2dwwcmex8rmxrtrt/apikeys',
      icon: Cpu,
      iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      id: 'nvidia',
      name: 'NVIDIA NIM',
      tag: 'Required (100% Free)',
      tagColor: 'text-lime-300 bg-lime-500/10 border-lime-500/20',
      description: 'Heavy Academic Reviewer & High-Grade RAG Verification (10,000 RPD free).',
      placeholder: 'nvapi-...',
      hasKey: user.has_nvidia_key,
      getKeyUrl: 'https://build.nvidia.com/',
      icon: Flame,
      iconColor: 'text-lime-400 bg-lime-500/10 border-lime-500/20',
    },
    {
      id: 'openai',
      name: 'OpenAI API',
      tag: 'Optional (Emergency Backup)',
      tagColor: 'text-slate-400 bg-slate-800 border-slate-700',
      description: 'Optional final safety net (gpt-4o-mini). Used only if all 4 free providers above are exhausted.',
      placeholder: 'sk-proj-...',
      hasKey: user.has_openai_key,
      getKeyUrl: 'https://platform.openai.com/api-keys',
      icon: Layers,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <User className="h-4 w-4" />
            Account & API Configuration
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            User Profile & Multi-Provider Keys
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Configure your free AI API keys with automatic failover. Tasks will never stall midway.
          </p>
        </div>

        {/* Feedback Banners */}
        {error && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={clearError} className="text-rose-400 hover:underline">Dismiss</button>
          </div>
        )}

        {successMsg && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:underline">Dismiss</button>
          </div>
        )}

        <div className="mt-8 space-y-8">
          {/* User Info Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
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

          {/* AI Providers Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-indigo-400" />
                  AI Provider Keys & Failover Setup
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter all 4 free keys below. OpenAI is optional backup. All keys are encrypted at rest.
                </p>
              </div>
            </div>

            {/* Required Keys Progress Status Banner */}
            {(() => {
              const requiredCount = [user.has_gemini_key, user.has_groq_key, user.has_cerebras_key, user.has_nvidia_key].filter(Boolean).length;
              const isFullyConfigured = requiredCount === 4;
              return (
                <div className={`flex items-center justify-between rounded-2xl p-4 border ${
                  isFullyConfigured
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                }`}>
                  <div className="flex items-center gap-2.5">
                    {isFullyConfigured ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-xs">
                        {isFullyConfigured
                          ? 'All 4 Required AI Keys Active — Pipeline Ready!'
                          : `Setup Incomplete (${requiredCount}/4 Required Keys Configured)`}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {isFullyConfigured
                          ? 'Multi-provider automatic failover is active. You can now extract questions, index notes, and generate answers.'
                          : 'Please add all 4 free provider keys below (Gemini, Groq, Cerebras, and NVIDIA NIM) to unlock AI pipeline features.'}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-950/60 border border-slate-800 shrink-0 ml-3">
                    {requiredCount}/4
                  </span>
                </div>
              );
            })()}

            {/* Provider Cards List */}
            <div className="space-y-4">
              {providers.map((p) => {
                const Icon = p.icon;
                const isConfigured = p.hasKey;
                const inputVal = keysInput[p.id];
                const isShowing = showKey[p.id];

                return (
                  <div
                    key={p.id}
                    className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-sm hover:border-slate-700/80 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-4">
                      <div className="flex items-start gap-3.5">
                        <div className={`p-2.5 rounded-2xl border ${p.iconColor} shrink-0`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white">{p.name}</h3>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${p.tagColor}`}>
                              {p.tag}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 max-w-xl">
                            {p.description}
                          </p>
                        </div>
                      </div>

                      {/* Get Key Link */}
                      <a
                        href={p.getKeyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 self-start sm:self-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline shrink-0"
                      >
                        <span>Get Free Key</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    {/* Key Input / Status Row */}
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="relative flex-1">
                        <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input
                          type={isShowing ? 'text' : 'password'}
                          value={inputVal}
                          onChange={(e) => handleInputChange(p.id, e.target.value)}
                          placeholder={isConfigured ? '••••••••••••••••••••••••••••••••' : p.placeholder}
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-10 pr-16 text-xs font-mono text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => toggleShowKey(p.id)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                        >
                          {isShowing ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {isConfigured ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-400">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Active</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteSingleKey(p.id)}
                              disabled={isLoading}
                              className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-all"
                              title="Delete stored key"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSaveSingleKey(p.id)}
                            disabled={isLoading || !inputVal.trim()}
                            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 transition-all disabled:opacity-40"
                          >
                            Save Key
                          </button>
                        )}

                        {isConfigured && inputVal.trim() && (
                          <button
                            type="button"
                            onClick={() => handleSaveSingleKey(p.id)}
                            disabled={isLoading}
                            className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 transition-all"
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};