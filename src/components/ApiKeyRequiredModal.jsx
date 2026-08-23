import React from 'react';
import { KeyRound, ArrowRight, X, CheckCircle2, AlertCircle } from 'lucide-react';
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

  const keyList = [
    { name: 'Google Gemini', isSet: !!user?.has_gemini_key, role: 'Vector Embeddings & RAG' },
    { name: 'Groq Cloud', isSet: !!user?.has_groq_key, role: 'Fast RAG Generation' },
    { name: 'OpenRouter', isSet: !!user?.has_openrouter_key, role: 'Question Extraction (free models)' },
    { name: 'NVIDIA NIM', isSet: !!user?.has_nvidia_key, role: 'Academic Reviewer (10k RPD)' },
  ];

  const configuredCount = keyList.filter((k) => k.isSet).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[var(--overlay)] p-4 pt-16 sm:pt-24 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] p-6 sm:p-7 shadow-[var(--shadow-lg)]">
        
        {/* Close Button */}
        <button
          onClick={closeKeyModal}
          className="absolute right-4 top-4 rounded-[8px] p-2 text-[var(--text-muted)] hover:bg-[var(--surface-well)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X className="h-4 w-4 stroke-[1.5]" />
        </button>

        {/* Icon Header */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.25)] text-[var(--ai)] shrink-0">
            <KeyRound className="h-5 w-5 stroke-[1.5]" />
          </div>
          <div>
            <h3 className="font-display text-lg font-normal text-[var(--text-primary)] tracking-tight">
              API Keys Configuration Required
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Action Blocked: <span className="font-mono text-[var(--warning)]">{keyModalFeature || 'AI Pipeline Task'}</span>
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="mt-5 space-y-3">
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            To ensure zero downtime and prevent rate limit failure, 4 free provider keys are used for failover routing:
          </p>

          <div className="space-y-1.5 rounded-[8px] bg-[var(--surface-well)] border border-[var(--border)] p-3">
            {keyList.map((k) => (
              <div key={k.name} className="flex items-center justify-between text-xs py-1 border-b border-[var(--border-subtle)] last:border-0">
                <div>
                  <span className="font-medium text-[var(--text-primary)]">{k.name}</span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] ml-2">({k.role})</span>
                </div>
                {k.isSet ? (
                  <StatusBadge variant="success">Active</StatusBadge>
                ) : (
                  <StatusBadge variant="error">Missing</StatusBadge>
                )}
              </div>
            ))}
          </div>

          <p className="font-mono text-[11px] text-[var(--text-muted)] text-center">
            {configuredCount}/4 keys active · All 4 providers offer 100% free tiers.
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
            <span>Add Keys in Profile</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  );
};
