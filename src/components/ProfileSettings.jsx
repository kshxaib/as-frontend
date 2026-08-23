import React, { useState } from 'react';
import {
  User,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  Loader2,
  Lock,
  Cpu,
  Workflow,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { ConfirmationModal } from './ConfirmationModal';
import { StatusBadge } from './ui/StatusBadge';

export const ProfileSettings = () => {
  const {
    user,
    isAuthenticated,
    error,
    updateGeminiKey,
    deleteGeminiKey,
    updateGroqKey,
    deleteGroqKey,
    updateOpenRouterKey,
    deleteOpenRouterKey,
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
    openrouter: '',
    nvidia: '',
    openai: '',
  });

  const [showKey, setShowKey] = useState({
    gemini: false,
    groq: false,
    openrouter: false,
    nvidia: false,
    openai: false,
  });

  const [actionLoading, setActionLoading] = useState({
    gemini: false,
    groq: false,
    openrouter: false,
    nvidia: false,
    openai: false,
  });

  const [deleteKeyCandidate, setDeleteKeyCandidate] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [validationError, setValidationError] = useState(null);

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-[var(--text-muted)]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[12px] border border-[var(--border)] bg-[var(--surface-well)] text-[var(--primary)]">
          <User className="h-6 w-6 stroke-[1.5]" />
        </div>
        <h2 className="font-display text-xl font-normal text-[var(--text-primary)]">Sign In to Access Profile</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Sign in to manage your account and API credentials.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-[var(--primary)] px-5 py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-sm"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const handleInputChange = (provider, value) => {
    setKeysInput((prev) => ({ ...prev, [provider]: value }));
    setValidationError(null);
  };

  const toggleShowKey = (provider) => {
    setShowKey((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const validateKeyFormat = (provider, key) => {
    const clean = key.trim();
    if (provider === 'gemini') {
      if (clean.startsWith('gsk_') || clean.startsWith('nvapi-') || clean.startsWith('sk-or-') || clean.length < 25) {
        return "Invalid Gemini key format. Keys start with 'AIzaSy' or 'AQ.' (min 25 chars).";
      }
    } else if (provider === 'groq') {
      if (!clean.startsWith('gsk_') || clean.length < 20) {
        return "Invalid Groq key format. Keys start with 'gsk_'.";
      }
    } else if (provider === 'openrouter') {
      if (!clean.startsWith('sk-or-') || clean.length < 20) {
        return "Invalid OpenRouter key format. Keys start with 'sk-or-'.";
      }
    } else if (provider === 'nvidia') {
      if (!clean.startsWith('nvapi-') || clean.length < 20) {
        return "Invalid NVIDIA key format. Keys start with 'nvapi-'.";
      }
    } else if (provider === 'openai') {
      if (!clean.startsWith('sk-') || clean.startsWith('sk-or-') || clean.length < 20) {
        return "Invalid OpenAI key format. Keys start with 'sk-'.";
      }
    }
    return null;
  };

  const handleSaveSingleKey = async (provider, providerName) => {
    const val = keysInput[provider]?.trim();
    if (!val) return;

    const formatErr = validateKeyFormat(provider, val);
    if (formatErr) {
      setValidationError(formatErr);
      return;
    }

    setValidationError(null);
    setSuccessMsg(null);
    clearError();
    setActionLoading((prev) => ({ ...prev, [provider]: true }));

    let res;
    if (provider === 'gemini') res = await updateGeminiKey(val);
    else if (provider === 'groq') res = await updateGroqKey(val);
    else if (provider === 'openrouter') res = await updateOpenRouterKey(val);
    else if (provider === 'nvidia') res = await updateNvidiaKey(val);
    else if (provider === 'openai') res = await updateOpenAIKey(val);

    setActionLoading((prev) => ({ ...prev, [provider]: false }));

    if (res?.success) {
      setKeysInput((prev) => ({ ...prev, [provider]: '' }));
      setSuccessMsg(`${providerName} key saved successfully.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteKeyCandidate) return;
    const { provider, providerName } = deleteKeyCandidate;
    setDeleteKeyCandidate(null);

    setSuccessMsg(null);
    clearError();
    setActionLoading((prev) => ({ ...prev, [provider]: true }));

    let res;
    if (provider === 'gemini') res = await deleteGeminiKey();
    else if (provider === 'groq') res = await deleteGroqKey();
    else if (provider === 'openrouter') res = await deleteOpenRouterKey();
    else if (provider === 'nvidia') res = await deleteNvidiaKey();
    else if (provider === 'openai') res = await deleteOpenAIKey();

    setActionLoading((prev) => ({ ...prev, [provider]: false }));

    if (res?.success) {
      setSuccessMsg(`${providerName} key removed.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const primaryProviders = [
    {
      id: 'gemini',
      name: 'Google Gemini',
      tag: 'Embeddings & RAG',
      placeholder: 'AQ.... or AIzaSy...',
      hasKey: user.has_gemini_key,
      getKeyUrl: 'https://aistudio.google.com/app/api-keys',
      icon: Server,
    },
    {
      id: 'groq',
      name: 'Groq Cloud',
      tag: 'Fast Inference',
      placeholder: 'gsk_...',
      hasKey: user.has_groq_key,
      getKeyUrl: 'https://console.groq.com/keys',
      icon: Cpu,
    },
    {
      id: 'openrouter',
      name: 'OpenRouter',
      tag: 'Extraction',
      placeholder: 'sk-or-v1-...',
      hasKey: user.has_openrouter_key,
      getKeyUrl: 'https://openrouter.ai/workspaces/default/keys',
      icon: Workflow,
    },
    {
      id: 'nvidia',
      name: 'NVIDIA NIM',
      tag: 'AI Reviewer',
      placeholder: 'nvapi-...',
      hasKey: user.has_nvidia_key,
      getKeyUrl: 'https://build.nvidia.com/',
      icon: Layers,
    },
  ];

  const backupProviders = [
    {
      id: 'openai',
      name: 'OpenAI API',
      tag: 'Optional Backup',
      placeholder: 'sk-proj-...',
      hasKey: user.has_openai_key,
      getKeyUrl: 'https://platform.openai.com/api-keys',
      icon: KeyRound,
    },
  ];

  const configuredCount = [user.has_gemini_key, user.has_groq_key, user.has_openrouter_key, user.has_nvidia_key].filter(Boolean).length;

  const renderProviderRow = (p) => {
    const Icon = p.icon;
    const isConfigured = p.hasKey;
    const inputVal = keysInput[p.id];
    const isShowing = showKey[p.id];
    const isProcessing = actionLoading[p.id];

    return (
      <div
        key={p.id}
        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--surface-muted)]/40 transition-colors"
      >
        {/* Left: Provider Info */}
        <div className="w-full sm:w-48 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[var(--border-subtle)] bg-[var(--surface-well)] text-[var(--text-secondary)] shrink-0">
              <Icon className="h-3.5 w-3.5 stroke-[1.5]" />
            </div>
            <div>
              <span className="font-medium text-xs text-[var(--text-primary)] block leading-tight">
                {p.name}
              </span>
              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                {p.tag}
              </span>
            </div>
          </div>
          <div className="mt-1 pl-9">
            <a
              href={p.getKeyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-mono text-[10px] text-[var(--primary)] hover:underline"
            >
              <span>Get Free Key</span>
              <ExternalLink className="h-2.5 w-2.5 stroke-[1.5]" />
            </a>
          </div>
        </div>

        {/* Center: Input Box */}
        <div className="relative flex-1">
          <input
            type={isShowing ? 'text' : 'password'}
            value={inputVal}
            onChange={(e) => handleInputChange(p.id, e.target.value)}
            placeholder={isConfigured ? '••••••••••••••••••••••••••••••••' : p.placeholder}
            disabled={isProcessing}
            className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] py-1.5 pl-3 pr-8 font-mono text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => toggleShowKey(p.id)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs"
          >
            {isShowing ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {isConfigured ? (
            <>
              <StatusBadge variant="success">Active</StatusBadge>
              {inputVal.trim() && (
                <button
                  type="button"
                  onClick={() => handleSaveSingleKey(p.id, p.name)}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1 rounded-[6px] bg-[var(--primary)] px-2.5 py-1 font-mono text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isProcessing && <Loader2 className="h-3 w-3 animate-spin" />}
                  <span>Update</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setDeleteKeyCandidate({ provider: p.id, providerName: p.name })}
                disabled={isProcessing}
                className="rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] p-1 text-[var(--text-muted)] hover:bg-[rgba(239,68,68,0.1)] hover:text-[var(--error)] hover:border-[rgba(239,68,68,0.3)] transition-all disabled:opacity-50"
                title={`Remove ${p.name} key`}
              >
                {isProcessing ? <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--error)]" /> : <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => handleSaveSingleKey(p.id, p.name)}
              disabled={isProcessing || !inputVal.trim()}
              className="inline-flex items-center gap-1 rounded-[6px] bg-[var(--primary)] px-3 py-1 font-mono text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all disabled:opacity-40"
            >
              {isProcessing && <Loader2 className="h-3 w-3 animate-spin" />}
              <span>Save</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-28 text-[var(--text-primary)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        
        {/* User Masthead */}
        <div className="flex items-center justify-between pb-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[var(--border)] bg-[var(--surface-well)] text-sm font-bold text-[var(--primary)] uppercase font-mono">
              {user.name?.[0] || 'U'}
            </div>
            <div>
              <h1 className="font-display text-lg font-normal text-[var(--text-primary)] leading-tight">
                {user.name}
              </h1>
              <p className="font-mono text-xs text-[var(--text-muted)] mt-0.5">
                @{user.username} 
              </p>
            </div>
          </div>

          <StatusBadge variant={configuredCount === 4 ? 'success' : 'amber'}>
            {configuredCount}/4 Keys Ready
          </StatusBadge>
        </div>

        {/* Feedback Banners */}
        {validationError && (
          <div className="mt-4 flex items-center justify-between rounded-[8px] border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.08)] p-3 text-xs text-[var(--warning)] animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{validationError}</span>
            </div>
            <button onClick={() => setValidationError(null)} className="font-mono text-[11px] hover:underline">Dismiss</button>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center justify-between rounded-[8px] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] p-3 text-xs text-[var(--error)] animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={clearError} className="font-mono text-[11px] hover:underline">Dismiss</button>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 flex items-center justify-between rounded-[8px] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)] p-3 text-xs text-[var(--success)] animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="font-mono text-[11px] hover:underline">Dismiss</button>
          </div>
        )}

        {/* ── Section 1: Required Free Tier Providers ── */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--text-primary)] font-semibold">
                Required AI Providers (100% Free)
              </h2>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Powers automated failover for embeddings, question extraction, and answer synthesis.
              </p>
            </div>
          </div>

          <div className="divide-y divide-[var(--border-subtle)] rounded-[12px] border border-[var(--border)] bg-[var(--surface)] shadow-xs">
            {primaryProviders.map(renderProviderRow)}
          </div>
        </div>

        {/* Section Divider */}
        <div className="editorial-rule my-8" />

        {/* ── Section 2: Optional Backup Provider ── */}
        <div>
          <div className="mb-3 px-1">
            <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
              Emergency Backup (Optional)
            </h2>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              Used only if free provider quotas are temporarily exhausted.
            </p>
          </div>

          <div className="divide-y divide-[var(--border-subtle)] rounded-[12px] border border-[var(--border)] bg-[var(--surface)] shadow-xs">
            {backupProviders.map(renderProviderRow)}
          </div>
        </div>

        {/* Delete API Key Confirmation Modal */}
        <ConfirmationModal
          isOpen={!!deleteKeyCandidate}
          title={`Remove ${deleteKeyCandidate?.providerName} Key?`}
          message={`Are you sure you want to remove your stored ${deleteKeyCandidate?.providerName} API key?`}
          confirmText="Yes, Remove Key"
          cancelText="Cancel"
          confirmVariant="danger"
          iconType="trash"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteKeyCandidate(null)}
        />
      </div>
    </div>
  );
};