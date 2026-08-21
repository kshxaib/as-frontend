import React from 'react';
import { BookOpen, Sparkles, Layers, ShieldCheck } from 'lucide-react';

export const Navbar = () => {
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
                Phase 5
              </span>
            </div>
            <p className="text-xs text-slate-400">AI-Powered Exam Preparation & RAG Engine</p>
          </div>
        </div>

        {/* Phase Progress Indicator */}
        <div className="hidden md:flex items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Phases 1-4 Complete</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2 text-indigo-400 font-medium">
            <Layers className="h-4 w-4 animate-pulse" />
            <span>Question Review Active</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2 text-slate-500">
            <Sparkles className="h-4 w-4" />
            <span>Next: Phase 6 RAG</span>
          </div>
        </div>
      </div>
    </header>
  );
};
