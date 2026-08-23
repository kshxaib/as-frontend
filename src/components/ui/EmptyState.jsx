import React from 'react';

export const EmptyState = ({ icon: Icon, title, description, actionText, onAction, actionVariant = 'primary' }) => {
  const getButtonClasses = () => {
    switch (actionVariant) {
      case 'amber':
      case 'ai':
        return 'border border-[var(--ai)] bg-[rgba(245,158,11,0.1)] text-[var(--ai)] hover:bg-[rgba(245,158,11,0.2)]';
      case 'gold':
      case 'community':
        return 'border border-[var(--community)] bg-[rgba(200,168,32,0.1)] text-[var(--community)] hover:bg-[rgba(200,168,32,0.2)]';
      case 'primary':
      default:
        return 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[var(--border)] rounded-[12px] bg-[var(--surface-well)] my-6">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-[12px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] mb-4">
          <Icon className="h-6 w-6 stroke-[1.5]" />
        </div>
      )}
      <h3 className="font-display text-lg font-normal text-[var(--text-primary)] tracking-tight mb-1.5">
        {title}
      </h3>
      <p className="text-xs text-[var(--text-muted)] max-w-md leading-relaxed mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className={`inline-flex items-center gap-2 rounded-[8px] px-4 py-2 text-xs font-semibold transition-all ${getButtonClasses()}`}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
