import React from 'react';

/**
 * StatusBadge — DESIGN_TOKENS §14
 * Types:
 * - 'success' (green): Indexed, Complete, Active key
 * - 'amber' (amber): Indexing, Extracting, AI Action, Pending
 * - 'error' (brick): Failed, Error
 * - 'neutral' (slate): Draft, Unindexed, Inactive
 * - 'community' (gold): Community, Public
 */
export const StatusBadge = ({ variant = 'neutral', children, pulse = false, icon: Icon }) => {
  const getStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-[rgba(34,197,94,0.1)] text-[#22c55e] dark:text-[#4ade80] border-[rgba(34,197,94,0.25)]';
      case 'amber':
      case 'warning':
        return 'bg-[rgba(245,158,11,0.1)] text-[#d97706] dark:text-[#fbbf24] border-[rgba(245,158,11,0.25)]';
      case 'error':
      case 'danger':
        return 'bg-[rgba(239,68,68,0.1)] text-[#dc2626] dark:text-[#f87171] border-[rgba(239,68,68,0.25)]';
      case 'community':
      case 'gold':
        return 'bg-[rgba(200,168,32,0.1)] text-[#a88a16] dark:text-[#eab308] border-[rgba(200,168,32,0.25)]';
      case 'primary':
      case 'teal':
        return 'bg-[rgba(20,184,166,0.1)] text-[#0f766e] dark:text-[#2dd4bf] border-[rgba(20,184,166,0.25)]';
      case 'neutral':
      default:
        return 'bg-[var(--surface-well)] text-[var(--text-muted)] border-[var(--border)]';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] border font-mono text-[11px] font-medium tracking-wider uppercase transition-colors ${getStyles()}`}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {Icon && <Icon className="h-3 w-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
};
