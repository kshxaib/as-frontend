import React from 'react';
import { KeyRound, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useQuestionBankStore } from '../../store/useQuestionBankStore';

export const ApiKeyBanner = ({ feature = 'AI Features' }) => {
  const { user } = useAuthStore();
  const { setActiveTab } = useQuestionBankStore();

  const hasOpenAI = !!user?.has_openai_key;

  if (hasOpenAI) return null;

  return (
    <div className="mb-6 rounded-[12px] border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-900 dark:text-amber-200 shadow-sm animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <KeyRound className="h-4 w-4 stroke-[2]" />
          </div>
          <div>
            <p className="font-semibold text-amber-950 dark:text-amber-100">
              OpenAI API Key Required for {feature}
            </p>
            <p className="text-[11px] text-amber-800 dark:text-amber-300/80 mt-0.5">
              AcademicStack uses your personal OpenAI API key (GPT-4o Mini / 4o) for AI analysis, question extraction, and answer synthesis.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('profile')}
          className="inline-flex items-center justify-center gap-1.5 rounded-[8px] bg-amber-600 dark:bg-amber-500 px-3.5 py-1.5 font-medium text-xs text-white dark:text-slate-950 hover:opacity-90 transition-all shrink-0 shadow-xs"
        >
          <span>Configure Key in Profile</span>
          <ArrowRight className="h-3.5 w-3.5 stroke-[2]" />
        </button>
      </div>
    </div>
  );
};
