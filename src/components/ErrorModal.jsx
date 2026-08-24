import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';

export const ErrorModal = () => {
  const { isErrorModalOpen, error, closeErrorModal } = useQuestionBankStore();

  if (!isErrorModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[var(--overlay)] p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-[16px] border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-lg)] my-auto">

        {/* Close Button */}
        <button
          onClick={closeErrorModal}
          className="absolute right-3.5 top-3.5 rounded-[6px] p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-well)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X className="h-4 w-4 stroke-[1.5]" />
        </button>
        {/* Body */}
        <p className="mt-5 rounded-[8px] bg-[var(--surface-well)] border border-[rgba(239,68,68,0.25)] p-3 text-xs leading-relaxed text-[var(--text-secondary)]">
          {error}
        </p>

        {/* Action Button */}
        <div className="mt-5 pt-4 border-t border-[var(--border-subtle)]">
          <button
            onClick={closeErrorModal}
            className="w-full inline-flex items-center justify-center gap-2 rounded-[8px] bg-[var(--error)] py-2 text-xs font-semibold text-[var(--error-foreground)] hover:opacity-90 transition-all shadow-sm"
          >
            <span>Understood</span>
          </button>
        </div>

      </div>
    </div>
  );
};
