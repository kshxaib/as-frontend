import React, { useState } from 'react';
import {
  User,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  Trash2,
  Key,
  Database,
  Lock,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { StatusBadge } from './ui/StatusBadge';

export const ProfileSettings = () => {
  const {
    user,
    isAuthenticated,
    error,
    openAuthModal,
    clearError,
    updateOpenAIKey,
    deleteOpenAIKey,
  } = useAuthStore();

  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-[var(--text-muted)]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[12px] border border-[var(--border)] bg-[var(--surface-well)] text-[var(--primary)]">
          <User className="h-6 w-6 stroke-[1.5]" />
        </div>
        <h2 className="font-display text-xl font-normal text-[var(--text-primary)]">Sign In to Access Profile</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Sign in to manage your scholar account and OpenAI API key.
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

  const hasKey = !!user.has_openai_key;

  const handleSaveKey = async (e) => {
    e?.preventDefault();
    const cleanKey = apiKeyInput.trim();
    if (!cleanKey) return;

    clearError();
    setSuccessMessage(null);
    setIsSubmitting(true);

    const res = await updateOpenAIKey(cleanKey);
    setIsSubmitting(false);

    if (res.success) {
      setApiKeyInput('');
      setIsEditing(false);
      setSuccessMessage('OpenAI API Key successfully encrypted and saved to your profile.');
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const handleDeleteKey = async () => {
    clearError();
    setSuccessMessage(null);
    setIsDeleting(true);

    const res = await deleteOpenAIKey();
    setIsDeleting(false);
    setShowDeleteModal(false);

    if (res.success) {
      setIsEditing(false);
      setApiKeyInput('');
      setSuccessMessage('OpenAI API Key removed from your profile.');
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 text-[var(--text-primary)]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <div className="border-b border-[var(--border)] pb-5">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--primary)]">
            <Key className="h-3.5 w-3.5" />
            <span>Scholar Settings & OpenAI API Engine</span>
          </div>
          <h1 className="mt-1.5 font-display text-2xl sm:text-3xl font-normal tracking-tight text-[var(--text-primary)]">
            Account & API Configuration
          </h1>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Configure your personal OpenAI API Key (BYOK). All AI generation and vector embeddings run strictly on your account.
          </p>
        </div>

        {/* ── Status Feedback Banners ── */}
        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-[8px] border border-[rgba(248,113,113,0.25)] bg-[rgba(248,113,113,0.08)] px-4 py-3 text-xs text-[var(--error)] animate-in fade-in duration-150">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-6 flex items-center gap-2 rounded-[8px] border border-[rgba(52,211,153,0.25)] bg-[rgba(52,211,153,0.08)] px-4 py-3 text-xs text-[var(--success)] animate-in fade-in duration-150">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="mt-8 space-y-6">

          {/* ── 1. OpenAI API Key (BYOK) Card ── */}
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xs overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-normal text-[var(--text-primary)] flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[var(--primary)]" />
                    <span>OpenAI API Key</span>
                  </h3>
                  {hasKey ? (
                    <StatusBadge variant="ready">Active & Ready</StatusBadge>
                  ) : (
                    <StatusBadge variant="error">Key Required</StatusBadge>
                  )}
                </div>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Bring Your Own Key (BYOK). We strictly use your decrypted key for requests — zero server .env reliance.
                </p>
              </div>

              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline self-start sm:self-center"
              >
                <span>Get an OpenAI Key</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Key Content & State */}
            <div className="mt-5">
              {hasKey && !isEditing ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[10px] border border-[var(--border-subtle)] bg-[var(--surface-well)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[rgba(52,211,153,0.12)] text-[var(--success)] border border-[rgba(52,211,153,0.25)]">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[var(--text-primary)] flex items-center gap-2">
                        <span>OpenAI API Key Configured</span>
                        <span className="rounded-[4px] bg-[rgba(52,211,153,0.1)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--success)]">
                          AES-256 Encrypted
                        </span>
                      </div>
                      <p className="mt-0.5 font-mono text-xs text-[var(--text-muted)]">
                        sk-••••••••••••••••••••••••••••••••••••••••
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setApiKeyInput('');
                      }}
                      className="rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all"
                    >
                      Replace Key
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="inline-flex items-center gap-1.5 rounded-[8px] border border-[rgba(248,113,113,0.25)] bg-[rgba(248,113,113,0.06)] px-3 py-1.5 text-xs font-medium text-[var(--error)] hover:bg-[rgba(248,113,113,0.15)] transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveKey} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                      {hasKey ? 'Enter New OpenAI API Key' : 'Enter Your OpenAI API Key'}
                    </label>
                    <div className="relative">
                      <input
                        type={showKey ? 'text' : 'password'}
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="sk-proj-... or sk-..."
                        autoComplete="off"
                        className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] px-3.5 py-2.5 pr-10 font-mono text-xs text-[var(--text-primary)] placeholder-[var(--text-subtle)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        title={showKey ? 'Hide key' : 'Show key'}
                      >
                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="mt-1.5 text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-[var(--primary)]" />
                      Stored with AES-256 database encryption. Used strictly when you make requests.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !apiKeyInput.trim()}
                      className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Saving & Encrypting...</span>
                        </>
                      ) : (
                        <span>Save OpenAI Key</span>
                      )}
                    </button>

                    {hasKey && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setApiKeyInput('');
                        }}
                        className="rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Model & Architecture Specifications */}
            <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
              <h4 className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] mb-3">
                Engine Specifications
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-[8px] border border-[var(--border-subtle)] bg-[var(--surface-well)] p-3">
                  <div className="flex items-center gap-2 text-[var(--primary)] text-xs font-medium">
                    <Zap className="h-3.5 w-3.5" />
                    <span>Answer Generation</span>
                  </div>
                  <div className="mt-1 text-xs font-mono text-[var(--text-primary)]">
                    gpt-4o-mini <span className="text-[var(--text-muted)]">→ gpt-4o</span>
                  </div>
                  <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                    Fast generation with automated failover for complex academic proofs.
                  </p>
                </div>

                <div className="rounded-[8px] border border-[var(--border-subtle)] bg-[var(--surface-well)] p-3">
                  <div className="flex items-center gap-2 text-[var(--primary)] text-xs font-medium">
                    <Database className="h-3.5 w-3.5" />
                    <span>Vector Embeddings</span>
                  </div>
                  <div className="mt-1 text-xs font-mono text-[var(--text-primary)]">
                    text-embedding-3-small
                  </div>
                  <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                    1536-dimensional vectors for accurate textbook and paper search.
                  </p>
                </div>

                <div className="rounded-[8px] border border-[var(--border-subtle)] bg-[var(--surface-well)] p-3">
                  <div className="flex items-center gap-2 text-[var(--primary)] text-xs font-medium">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Security & Privacy</span>
                  </div>
                  <div className="mt-1 text-xs font-mono text-[var(--text-primary)]">
                    AES-256 DB Encrypted
                  </div>
                  <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                    Never shared, never logged in server .env files.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. Scholar Profile Card ── */}
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xs">
            <div className="border-b border-[var(--border-subtle)] pb-4">
              <h3 className="font-display text-base font-normal text-[var(--text-primary)] flex items-center gap-2">
                <User className="h-4 w-4 text-[var(--primary)]" />
                <span>Scholar Information</span>
              </h3>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Your authenticated profile in AcademicStack.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-[8px] border border-[var(--border-subtle)] bg-[var(--surface-well)] p-3.5">
                <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider block">
                  Full Name
                </span>
                <span className="mt-1 text-sm font-medium text-[var(--text-primary)] block">
                  {user.name || 'Scholar User'}
                </span>
              </div>

              <div className="rounded-[8px] border border-[var(--border-subtle)] bg-[var(--surface-well)] p-3.5">
                <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider block">
                  Username
                </span>
                <span className="mt-1 text-sm font-mono text-[var(--text-primary)] block">
                  @{user.username}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Delete Key Confirmation Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(248,113,113,0.12)] text-[var(--error)]">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-medium text-[var(--text-primary)]">
                  Delete OpenAI API Key?
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  AI answer generation and vector search will be disabled until you provide a new key.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteKey}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--error)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90 transition-all shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete Key</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};