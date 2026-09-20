import React from 'react';
import { ArrowRight, X, Sparkles } from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { useAuthStore } from '../store/useAuthStore';

export const ApiKeyRequiredModal = () => {
  const { isKeyModalOpen, keyModalFeature, closeKeyModal, setActiveTab } = useQuestionBankStore();
  const { user } = useAuthStore();

  if (!isKeyModalOpen) return null;

  const handleGoToProfile = () => {
    closeKeyModal();
    setActiveTab('profile');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#19243B]/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-[#E2E0D9] bg-white p-6 sm:p-7 shadow-2xl my-auto text-[#19243B] space-y-4">
        
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg sm:text-xl text-[#19243B] tracking-tight">
              Add your API key to use AI tools
            </h3>
            <p className="text-[#687184] text-sm mt-2 leading-relaxed">
              Configure your OpenAI API key in <b>Profile & API key</b> to generate answers and synthesize practice examination papers.
            </p>
          </div>
          <button
            onClick={closeKeyModal}
            className="rounded-lg p-1.5 text-[#687184] hover:bg-[#F1F0EC] hover:text-[#19243B] transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {keyModalFeature && (
          <div className="rounded-xl bg-[#EAF0FF] border border-[#C8D8FF] p-3 text-xs text-[#0057FF] flex items-center gap-2">
            <Sparkles className="size-4 shrink-0" />
            <span>Target action: <b>{keyModalFeature}</b></span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E0D9]">
          <button
            type="button"
            onClick={closeKeyModal}
            className="font-medium rounded-[10px] text-sm border border-[#C6CAD3] bg-white text-[#19243B] hover:bg-[#F8F7F4] px-4 h-11 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleGoToProfile}
            className="font-medium rounded-[10px] bg-[#0057FF] text-white hover:bg-[#0047D6] text-sm px-5 h-11 inline-flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <span>Go to settings</span>
            <ArrowRight className="size-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ApiKeyRequiredModal;
