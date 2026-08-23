import React from 'react';
import {
  AlertTriangle,
  FileQuestion,
  Trash2,
  LogOut,
  RefreshCw,
  X,
  Loader2,
} from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary', // 'primary' | 'danger' | 'warning' | 'emerald'
  iconType = 'alert', // 'alert' | 'trash' | 'sparkles' | 'logout' | 'refresh'
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const renderIcon = () => {
    switch (iconType) {
      case 'trash':
        return <Trash2 className="h-5 w-5 text-[var(--error)] stroke-[1.5]" />;
      case 'sparkles':
      case 'ai':
        return <FileQuestion className="h-5 w-5 text-[var(--ai)] stroke-[1.5]" />;
      case 'logout':
        return <LogOut className="h-5 w-5 text-[var(--warning)] stroke-[1.5]" />;
      case 'refresh':
        return <RefreshCw className="h-5 w-5 text-[var(--primary)] stroke-[1.5]" />;
      case 'alert':
      default:
        return <AlertTriangle className="h-5 w-5 text-[var(--warning)] stroke-[1.5]" />;
    }
  };

  const getIconBg = () => {
    switch (iconType) {
      case 'trash':
        return 'bg-[rgba(248,113,113,0.1)] border-[rgba(248,113,113,0.25)]';
      case 'sparkles':
      case 'ai':
        return 'bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.25)]';
      case 'logout':
        return 'bg-[rgba(224,169,43,0.1)] border-[rgba(224,169,43,0.25)]';
      case 'refresh':
        return 'bg-[rgba(20,184,166,0.1)] border-[rgba(20,184,166,0.25)]';
      default:
        return 'bg-[rgba(224,169,43,0.1)] border-[rgba(224,169,43,0.25)]';
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[var(--overlay)] p-4 pt-20 sm:pt-28 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] p-6 sm:p-7 shadow-[var(--shadow-lg)]">
        
        {/* Close Button */}
        {!isLoading && (
          <button
            onClick={onCancel}
            className="absolute right-4 top-4 rounded-[8px] p-2 text-[var(--text-muted)] hover:bg-[var(--surface-well)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="h-4 w-4 stroke-[1.5]" />
          </button>
        )}

        {/* Icon & Title */}
        <div className="flex items-start gap-4">
          <div className={`flex h-11 w-11 items-center justify-center rounded-[12px] border ${getIconBg()} shrink-0 mt-0.5`}>
            {renderIcon()}
          </div>
          <div>
            <h3 className="font-display text-lg font-normal text-[var(--text-primary)] tracking-tight">
              {title}
            </h3>
            <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 rounded-[8px] px-5 py-2 text-xs font-semibold transition-all disabled:opacity-50 ${getConfirmButtonClasses()}`}
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{isLoading ? 'Processing...' : confirmText}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
