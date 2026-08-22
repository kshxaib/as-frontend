import React from 'react';
import { KeyRound, ArrowRight, X, Sparkles, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
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

  const keyList = [
    { name: 'Google Gemini', isSet: !!user?.has_gemini_key, role: 'Vector Embeddings & RAG' },
    { name: 'Groq Cloud', isSet: !!user?.has_groq_key, role: 'Fast RAG Generation' },
    { name: 'OpenRouter', isSet: !!user?.has_openrouter_key, role: 'Question Extraction (free models)' },
    { name: 'NVIDIA NIM', isSet: !!user?.has_nvidia_key, role: 'Academic Reviewer (10k RPD)' },
  ];

  const configuredCount = keyList.filter((k) => k.isSet).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl shadow-amber-500/10">
        {/* Close Button */}
        <button
          onClick={closeKeyModal}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <KeyRound className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">4 Required Free API Keys</h3>
            <p className="text-xs text-slate-400">
              Blocked Action: <span className="font-semibold text-amber-300">{keyModalFeature || 'AI Feature'}</span>
            </p>
          </div>
        </div>

        {/* Informative Body */}
        <div className="mt-5 space-y-3">
          <p className="text-xs text-slate-300">
            To ensure zero downtime, high speed, and prevent quota exhaustion, all 4 free API providers are required:
          </p>

          <div className="space-y-2 rounded-2xl bg-slate-950/60 border border-slate-800/80 p-3.5">
            {keyList.map((k) => (
              <div key={k.name} className="flex items-center justify-between text-xs py-1 border-b border-slate-900 last:border-0">
                <div>
                  <span className="font-semibold text-slate-200">{k.name}</span>
                  <span className="text-[11px] text-slate-500 ml-2">({k.role})</span>
                </div>
                {k.isSet ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Missing
                  </span>
                )}
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            {configuredCount}/4 keys configured. Keys are 100% free with no credit card required.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={closeKeyModal}
            className="w-full sm:w-1/2 rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleGoToProfile}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-amber-400 hover:to-indigo-500 transition-all"
          >
            <span>Add Missing Keys in Profile</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
