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
  Sparkles,
  Zap,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { ConfirmationModal } from './ConfirmationModal';
import { StatusBadge } from './ui/StatusBadge';

export const ProfileSettings = () => {
  const {
    user,
    isAuthenticated,
    error,
    updateOpenAIKey,
    deleteOpenAIKey,
    openAuthModal,
    clearError,
  } = useAuthStore();

  const [openaiKeyInput, setOpenaiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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

  const isOpenAIConfigured = !!user.has_openai_key;

  const validateOpenAIKey = (key) => {
    const clean = key.trim();
    if (!clean) return 'Please enter your OpenAI API key.';
    if (!clean.startsWith('sk-') || clean.length < 20) {
      return "Invalid key format. OpenAI API keys start with 'sk-' and are typically 40+ characters long.";
    }
    return null;
  };

  const handleSaveKey = async (e) => {
    e?.preventDefault();
    const cleanKey = openaiKeyInput.trim();
    const formatErr = validateOpenAIKey(cleanKey);
    if (formatErr) {
      setValidationError(formatErr);
      return;
    }

    setValidationError(null);
    setSuccessMsg(null);
    clearError();
    setActionLoading(true);

    const res = await updateOpenAIKey(cleanKey);
    setActionLoading(false);

    if (res?.success) {
      setOpenaiKeyInput('');
      setSuccessMsg('OpenAI API key saved & encrypted successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);
    setSuccessMsg(null);
    clearError();
    setActionLoading(true);

    const res = await deleteOpenAIKey();
    setActionLoading(false);

    if (res?.success) {
      setSuccessMsg('OpenAI API key removed.');
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 text-[var(--text-primary)]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <div className="border-b border-[var(--border)] pb-5">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--primary)]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Configuration & Profile</span>
          </div>
          <h1 className="mt-1.5 font-display text-2xl sm:text-3xl font-normal tracking-tight text-[var(--text-primary)]">
            Account & API Settings
          </h1>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            AcademicStack runs 100% on OpenAI. Connect your API key to unlock all capabilities.
          </p>
        </div>

        {/* ── Feedback Alerts ── */}
        {successMsg && (
          <div className="mt-6 flex items-center gap-2 rounded-[8px] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)] px-4 py-3 text-xs text-[var(--success)] animate-in fade-in duration-150">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {(validationError || error) && (
          <div className="mt-6 flex items-center gap-2 rounded-[8px] border border-[rgba(248,113,113,0.25)] bg-[rgba(248,113,113,0.08)] px-4 py-3 text-xs text-[var(--error)] animate-in fade-in duration-150">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{validationError || error}</span>
          </div>
        )}

        <div className="mt-8 space-y-6">

          {/* ── 1. User Profile Card ── */}
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xs">
            <h3 className="font-display text-base font-normal text-[var(--text-primary)]">
              Scholar Profile
            </h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-[8px] border border-[var(--border-subtle)] bg-[var(--surface-well)] p-3">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                  Full Name
                </span>
                <span className="text-xs font-semibold text-[var(--text-primary)] mt-0.5 block">
                  {user.name}
                </span>
              </div>
              <div className="rounded-[8px] border border-[var(--border-subtle)] bg-[var(--surface-well)] p-3">
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                  Username
                </span>
                <span className="text-xs font-mono font-medium text-[var(--text-primary)] mt-0.5 block">
                  @{user.username}
                </span>
              </div>
            </div>
          </div>

          {/* ── 2. Unified OpenAI API Key Card ── */}
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xs overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-normal text-[var(--text-primary)]">
                    OpenAI API Key
                  </h3>
                  {isOpenAIConfigured ? (
                    <StatusBadge variant="success">Active & Ready</StatusBadge>
                  ) : (
                    <StatusBadge variant="error">Key Missing</StatusBadge>
                  )}
                </div>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Powers all features: 1536-dim Vector Indexing, Question Extraction, RAG Answers & Academic Review.
                </p>
              </div>

              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-[6px] border border-[rgba(20,184,166,0.3)] bg-[rgba(20,184,166,0.08)] px-3 py-1.5 font-mono text-xs font-medium text-[var(--primary)] hover:bg-[rgba(20,184,166,0.15)] transition-colors shrink-0"
              >
                <span>Get OpenAI Key</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Key Input / Management Section */}
            <form onSubmit={handleSaveKey} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
                  {isOpenAIConfigured ? 'Update / Replace API Key' : 'Enter your OpenAI API Key'}
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={openaiKeyInput}
                    onChange={(e) => {
                      setOpenaiKeyInput(e.target.value);
                      setValidationError(null);
                    }}
                    placeholder={isOpenAIConfigured ? '••••••••••••••••••••••••••••••••••••••••' : 'sk-... or sk-proj-... (from platform.openai.com)'}
                    disabled={actionLoading}
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] py-2.5 pl-3.5 pr-10 font-mono text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={actionLoading || !openaiKeyInput.trim()}
                    className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-40 transition-all shadow-xs"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Save OpenAI Key</span>
                      </>
                    )}
                  </button>

                  {isOpenAIConfigured && (
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-[8px] border border-[rgba(248,113,113,0.3)] bg-[rgba(248,113,113,0.08)] px-3 py-2 text-xs font-semibold text-[var(--error)] hover:bg-[rgba(248,113,113,0.15)] transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove Key</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                  <Lock className="h-3 w-3 text-[var(--primary)]" />
                  <span>Encrypted via AES-256 before storage</span>
                </div>
              </div>
            </form>

            {/* Benefits & Model Info Box */}
            <div className="mt-6 rounded-[8px] bg-[var(--surface-well)] border border-[var(--border-subtle)] p-4">
              <h4 className="font-display text-xs font-medium text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[var(--ai)]" />
                <span>How AcademicStack Uses Your OpenAI Key</span>
              </h4>
              <ul className="text-[11px] text-[var(--text-muted)] space-y-1.5">
                <li className="flex items-start gap-1.5">
                  <span className="text-[var(--primary)] font-bold">1.</span>
                  <span><strong>Vector Embeddings:</strong> Generates semantic 1536-dim embeddings for textbook PDFs into Qdrant Cloud via <code className="text-[var(--text-secondary)] font-mono">text-embedding-3-small</code>.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[var(--primary)] font-bold">2.</span>
                  <span><strong>Question Extraction:</strong> Converts university exam papers into structured questions with exact mark weights using <code className="text-[var(--text-secondary)] font-mono">gpt-4o-mini</code>.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[var(--primary)] font-bold">3.</span>
                  <span><strong>RAG Answers & Review:</strong> Synthesizes syllabus-grounded solutions with math formulas, diagrams, and examiner grading passes.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[var(--primary)] font-bold">4.</span>
                  <span><strong>Automatic Model Failover:</strong> Seamless failover: <code className="text-[var(--text-secondary)] font-mono">gpt-4o-mini → gpt-4o</code>.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ── 3. Privacy Guarantee ── */}
          <div className="rounded-[12px] border border-[var(--border-subtle)] bg-[var(--surface-well)]/60 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[rgba(20,184,166,0.1)] text-[var(--primary)] shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[var(--text-primary)]">
                  Total Privacy & Strict BYOK
                </h4>
                <p className="mt-0.5 text-[11px] text-[var(--text-muted)] leading-relaxed">
                  Your OpenAI API key is encrypted using AES-128-CBC + HMAC SHA256 before being saved to PostgreSQL. Plaintext keys are never exposed in browser requests or backend logs, and are only decrypted in volatile memory during active AI tasks for your account.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove OpenAI Key?"
        description="Are you sure you want to remove your OpenAI API key? You will not be able to index PDFs or generate answers until a key is added."
        confirmText="Remove Key"
        isDanger={true}
      />
    </div>
  );
};