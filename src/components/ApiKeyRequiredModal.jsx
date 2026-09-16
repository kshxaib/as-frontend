import React from 'react';
import { KeyRound, ArrowRight, X, Sparkles } from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { useAuthStore } from '../store/useAuthStore';
import { StatusBadge } from './ui/StatusBadge';

export const ApiKeyRequiredModal = () => {
  const { isKeyModalOpen, keyModalFeature, closeKeyModal, setActiveTab } = useQuestionBankStore();
  const { user } = useAuthStore();

  if (!isKeyModalOpen) return null;

  const handleGoToProfile = () => {
    closeKeyModal();
    setActiveTab('profile');
  };

  const hasOpenAI = !!user?.has_openai_key;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[var(--overlay)] p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] p-6 sm:p-7 shadow-[var(--shadow-lg)] my-auto">
        {/* Close Button */}
        <button
          onClick={closeKeyModal}
          className="absolute right-4 top-4 rounded-[8px] p-2 text-[var(--text-muted)] hover:bg-[var(--surface-well)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X className="h-4 w-4 stroke-[1.5]" />
        </button>

        {/* Icon Header */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[rgba(20,184,166,0.1)] border border-[rgba(20,184,166,0.25)] text-[var(--primary)] shrink-0">
            <KeyRound className="h-5 w-5 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="font-display text-lg font-normal text-[var(--text-primary)] tracking-tight">
              OpenAI API Key Required
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Action Blocked: <span className="font-mono text-[var(--warning)]">{keyModalFeature || 'AI Pipeline Task'}</span>
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="mt-5 space-y-3">
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            AcademicStack runs 100% on OpenAI. Add your OpenAI API key in Profile settings to unlock:
          </p>

          <div className="space-y-2 rounded-[10px] bg-[var(--surface-well)] border border-[var(--border)] p-3.5">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" />
                <span className="font-semibold text-[var(--text-primary)]">OpenAI API (GPT-4o Mini / 4o)</span>
              </div>
              {hasOpenAI ? (
                <StatusBadge variant="success">Active</StatusBadge>
              ) : (
                <StatusBadge variant="error">Missing</StatusBadge>
              )}
            </div>
            <div className="text-[11px] text-[var(--text-muted)] space-y-1">
              <p>• 1536-dim Vector Embeddings (PDF indexing)</p>
              <p>• Automated Question Bank extraction</p>
              <p>• Syllabus-grounded RAG answers & AI Review</p>
            </div>
          </div>

          <p className="text-[11px] text-[var(--text-muted)] text-center">
            Encrypted with AES-256 before storage · Strictly your own API key (BYOK).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5 pt-4 border-t border-[var(--border-subtle)]">
          <button
            onClick={closeKeyModal}
            className="w-full sm:w-1/3 rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleGoToProfile}
            className="w-full sm:w-2/3 inline-flex items-center justify-center gap-2 rounded-[8px] bg-[var(--primary)] py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-sm"
          >
            <span>Add OpenAI Key</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  );
};
