import React from 'react';

export const StatusBadge = ({ variant = 'neutral', children, pulse = false, icon: Icon }) => {
  const getStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-[#EAF5EF] text-[#187347] border-[#A6F4C5]';
      case 'amber':
      case 'warning':
        return 'bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]';
      case 'error':
      case 'danger':
        return 'bg-[#FFF0EE] text-[#B42318] border-[#FECDCA]';
      case 'community':
      case 'gold':
      case 'primary':
      case 'teal':
        return 'bg-[#EAF0FF] text-[#0057FF] border-[#C8D8FF]';
      case 'neutral':
      default:
        return 'bg-[#F8F7F4] text-[#687184] border-[#E2E0D9]';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-xs font-semibold tracking-wide transition-colors ${getStyles()}`}
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
