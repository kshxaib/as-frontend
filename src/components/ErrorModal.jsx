import React from 'react';
import { CircleAlert, TriangleAlert, X } from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';

export const ErrorModal = () => {
  const { isErrorModalOpen, error, closeErrorModal } = useQuestionBankStore();

  if (!isErrorModalOpen) return null;

  const isQuotaError = error && (
    error.toLowerCase().includes('quota') ||
    error.toLowerCase().includes('billing') ||
    error.toLowerCase().includes('rate limit')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#19243B]/40 p-4 sm:p-8 backdrop-blur-xs animate-in fade-in duration-150 selection:bg-[#0057FF] selection:text-white">
      <div className="relative w-full max-w-[480px] rounded-2xl border border-[#E2E0D9] bg-white shadow-[0px_24px_64px_rgba(25,36,59,0.16)] my-auto overflow-hidden text-[#19243B]">
        
        <div className="pt-8 px-6 sm:px-8 pb-6">
          <div className="rounded-xl bg-[#FFF0EE] border border-[#F3C4BE] p-4 flex items-start gap-4">
            {isQuotaError ? (
              <TriangleAlert className="text-[#B42318] mt-0.5 shrink-0 size-6" />
            ) : (
              <CircleAlert className="text-[#B42318] mt-0.5 shrink-0 size-6" />
            )}
            <div className="flex flex-col gap-1.5 min-w-0">
              <h2 className="font-semibold text-lg sm:text-xl text-[#19243B] -tracking-[0.02em]">
                {isQuotaError ? "AI generation couldn't continue" : 'Something went wrong'}
              </h2>
              <p className="text-[#526078] text-sm leading-6">
                {error ||
                  (isQuotaError
                    ? 'The AI provider reported a quota or billing limit. Check your API key and provider billing settings, then try again.'
                    : 'We could not complete that request. Check your connection or API key and try again.')}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E2E0D9] flex pt-4 px-6 sm:px-8 pb-5 justify-end items-center gap-3 bg-[#FCFBF9]">
          <button
            type="button"
            onClick={closeErrorModal}
            className="font-medium rounded-lg border border-[#C6CAD3] bg-white text-[#19243B] hover:bg-[#F8F7F4] px-5 h-11 text-sm transition-colors cursor-pointer"
          >
            Close
          </button>
          
          <button
            type="button"
            onClick={closeErrorModal}
            className="font-medium rounded-lg bg-[#0057FF] text-white hover:bg-[#0047D6] px-5 h-11 text-sm transition-colors cursor-pointer shadow-xs inline-flex items-center justify-center"
          >
            Try again
          </button>
        </div>

      </div>
    </div>
  );
};

export default ErrorModal;
