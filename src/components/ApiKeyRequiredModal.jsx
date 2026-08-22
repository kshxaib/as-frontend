import React from 'react';
import { KeyRound, ArrowRight, X, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';

export const ApiKeyRequiredModal = () => {
  const { isKeyModalOpen, keyModalFeature, closeKeyModal, setActiveTab } = useQuestionBankStore();

  if (!isKeyModalOpen) return null;

  const handleGoToProfile = () => {
    closeKeyModal();
    setActiveTab('profile');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl shadow-indigo-500/10">
        {/* Close Button */}
        <button
          onClick={closeKeyModal}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <KeyRound className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Configure AI Provider Keys</h3>
            <p className="text-xs text-slate-400">Feature: <span className="font-semibold text-indigo-300">{keyModalFeature || 'AI Pipeline'}</span></p>
          </div>
        </div>

        {/* Informative Body */}
        <div className="mt-5 space-y-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 p-4 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>100% Free AI Providers:</strong> AcademicStack connects with free Gemini (1.5k RPD), Groq (1k RPD), Cerebras (14.4k RPD), and NVIDIA NIM (10k RPD) APIs.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong>Automatic Failover:</strong> Set your free keys in your Profile so extraction and answer generation never stall or hit rate limits.
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-400 text-center">
          Keys are encrypted at rest with Fernet cryptography and never exposed to other users.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={closeKeyModal}
            className="w-full sm:w-1/2 rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            Continue Browsing
          </button>
          <button
            onClick={handleGoToProfile}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-indigo-400 transition-all"
          >
            <span>Set Keys in Profile</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
