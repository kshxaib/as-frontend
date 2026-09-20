import React from 'react';
import { Loader2, X } from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary', 
  _iconType,
  isLoading = false,
  onConfirm,
  onCancel,
  withInput = false,
  inputValue = '',
  onInputChange,
  inputLabel,
  inputPlaceholder,
  subtext,
  disclaimer,
  infoBox,
}) => {
  if (!isOpen) return null;

  const getConfirmButtonClasses = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-xs';
      case 'warning':
        return 'bg-[#D97706] text-white hover:bg-[#B45309] shadow-xs';
      case 'emerald':
        return 'bg-[#16A34A] text-white hover:bg-[#15803D] shadow-xs';
      case 'primary':
      default:
        return 'bg-[#0057FF] text-white hover:bg-[#0047D6] shadow-xs';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#19243B]/40 p-4 sm:p-8 backdrop-blur-xs animate-in fade-in duration-150 selection:bg-[#0057FF] selection:text-white">
      <div className={`relative w-full ${withInput ? 'max-w-[560px]' : 'max-w-[480px]'} rounded-2xl border border-[#E2E0D9] bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] my-auto overflow-hidden text-[#19243B]`}>
        
        <div className="border-b border-[#E2E0D9] flex pt-6 px-6 sm:px-8 pb-5 justify-between items-center">
          <h2 className="font-semibold text-xl tracking-tight text-[#19243B]">
            {title}
          </h2>
          {!isLoading && (
            <button
              onClick={onCancel}
              className="rounded-lg p-1 text-[#526078] hover:bg-[#F1F0EC] hover:text-[#19243B] transition-colors"
              title="Close modal"
              type="button"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        <div className="pt-6 px-6 sm:px-8 pb-6 space-y-4">
          {message && (
            <p className="text-[#526078] text-sm leading-6">
              {message}
            </p>
          )}

          {infoBox && (
            <div className="rounded-xl bg-[#EAF0FF] border border-[#C8D8FF] p-4">
              <p className="font-medium text-[#19243B] text-sm leading-6">
                {infoBox}
              </p>
            </div>
          )}

          {withInput && (
            <div className="space-y-4">
              {inputLabel && (
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#526078]">
                  {inputLabel}
                </label>
              )}
              <textarea
                rows={4}
                value={inputValue}
                onChange={(e) => onInputChange?.(e.target.value)}
                disabled={isLoading}
                placeholder={inputPlaceholder || 'Tell AcademicStack what you want changed...'}
                className="w-full resize-none rounded-xl border border-[#E2E0D9] bg-white p-4 text-sm text-[#19243B] placeholder-[#8A97AA] focus:border-[#0057FF] focus:outline-none leading-relaxed transition-colors disabled:opacity-50 min-h-[140px]"
              />
              <p className="text-[#526078] text-sm leading-6">
                {subtext || 'For example: add a worked example, simplify the explanation, or focus on the exam steps.'}
              </p>
              <p className="text-[#526078] text-sm leading-6">
                {disclaimer || 'Regenerating an answer uses your configured API key and retrieves fresh context from your linked materials.'}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-[#E2E0D9] flex pt-4 px-6 sm:px-8 pb-5 justify-end items-center gap-3 bg-[#FCFBF9]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="font-medium rounded-lg border border-[#E2E0D9] bg-white text-[#19243B] hover:bg-[#F1F0EC] px-4 py-2 text-sm transition-colors disabled:opacity-50 h-10 cursor-pointer"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`font-medium rounded-lg text-sm inline-flex items-center justify-center gap-2 px-5 py-2 transition-all disabled:opacity-50 h-10 cursor-pointer ${getConfirmButtonClasses()}`}
          >
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            <span>{isLoading ? 'Processing...' : confirmText}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmationModal;
