import React from 'react';
import { BookOpen, Sparkles, Layers, ShieldCheck, FileCheck2 } from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';

export const Navbar = () => {
  const { activeTab, setActiveTab, currentAnswerSet } = useQuestionBankStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">AcademicStack</span>
              <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                Phase 6 Active
              </span>
            </div>
            <p className="text-xs text-slate-400">AI-Powered Exam Preparation & RAG Engine</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/80 p-1">
          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'review'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Question Review</span>
          </button>

          <button
            onClick={() => setActiveTab('solutions')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'solutions'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            <span>Solved Answers</span>
            {currentAnswerSet && (
              <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-bold">
                {currentAnswerSet.completed_questions || currentAnswerSet.answers?.length || 0}
              </span>
            )}
          </button>
        </div>

        {/* Phase Progress Indicator */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="h-4 w-4" />
            <span>Qdrant Filtered</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-1.5 text-indigo-400 font-medium">
            <Sparkles className="h-4 w-4" />
            <span>GPT-4o mini</span>
          </div>
        </div>
      </div>
    </header>
  );
};
