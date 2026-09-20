import React from 'react';

export const EmptyState = ({ icon: Icon, title, description, actionText, onAction, actionVariant = 'primary' }) => {
  const getButtonClasses = () => {
    switch (actionVariant) {
      case 'amber':
      case 'ai':
        return 'border border-[#FEDF89] bg-[#FFFAEB] text-[#B54708] hover:bg-[#FEF0C7]';
      case 'gold':
      case 'community':
        return 'border border-[#C8D8FF] bg-[#EAF0FF] text-[#0057FF] hover:bg-[#D4E4FF]';
      case 'secondary':
        return 'border border-[#E2E0D9] bg-white text-[#19243B] hover:bg-[#F8F7F4]';
      case 'primary':
      default:
        return 'bg-[#0057FF] text-white hover:bg-[#0046CC] shadow-xs';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-10 sm:p-14 text-center border border-dashed border-[#E2E0D9] rounded-2xl bg-[#F8F7F4] my-4 font-sans max-w-xl mx-auto">
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E2E0D9] bg-white text-[#0057FF] mb-4 shadow-xs">
          <Icon className="h-7 w-7 stroke-[1.75]" />
        </div>
      )}
      <h3 className="text-lg font-bold text-[#19243B] tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-xs text-[#687184] max-w-md leading-relaxed mb-6">
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${getButtonClasses()}`}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
