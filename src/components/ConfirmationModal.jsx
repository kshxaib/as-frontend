import React from 'react';
import { Loader2, X } from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary', // 'primary' | 'danger' | 'warning' | 'emerald'
  iconType, // kept for API compat, no longer renders an icon
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getConfirmButtonClasses = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'bg-[var(--error)] text-[var(--error-foreground)] hover:opacity-90 shadow-sm';
      case 'warning':
        return 'bg-[var(--warning)] text-[var(--warning-foreground)] hover:opacity-90 shadow-sm';
      case 'emerald':
        return 'bg-[var(--success)] text-[var(--success-foreground)] hover:opacity-90 shadow-sm';
      case 'primary':
      default:
        return 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 shadow-sm';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[var(--overlay)] p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm rounded-[16px] border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-lg)] my-auto">

        
        {/* Close Button */}
        {!isLoading && (
          <button
            onClick={onCancel}
            className="absolute right-3.5 top-3.5 rounded-[6px] p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-well)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="h-4 w-4 stroke-[1.5]" />
          </button>
        )}

        {/* Title & Message */}
        <div className="pr-6">
          <h3 className="font-display text-base font-normal text-[var(--text-primary)] tracking-tight leading-snug">
            {title}
          </h3>
          <p className="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-end gap-2.5 pt-4 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] px-4 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center gap-1.5 rounded-[6px] px-4 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${getConfirmButtonClasses()}`}
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{isLoading ? 'Processing...' : confirmText}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
