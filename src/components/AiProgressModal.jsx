import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Cpu,
  Database,
  FileText,
  CheckCircle2,
  Loader2,
  Zap,
} from 'lucide-react';

export const AiProgressModal = ({
  isOpen,
  type = 'extraction', // 'extraction' | 'generation' | 'indexing'
  title = 'AI Processing in Progress',
  subtitle = 'Please wait while AcademicStack processes your academic materials.',
  totalItems = 0,
  currentItem = 0,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setActiveStep(0);
      setElapsedSeconds(0);
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    // Dynamic step progression for extraction & generation
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 3200);

    return () => {
      clearInterval(timer);
      clearInterval(stepInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const extractionSteps = [
    { label: 'Reading PDF & Extracting Text', icon: FileText, desc: 'PyMuPDF layout parsing' },
    { label: 'AI Model Analyzing Questions', icon: Cpu, desc: 'Multi-provider failover routing' },
    { label: 'Extracting Marks & Formatting', icon: Sparkles, desc: 'Assigning sequential numbering' },
    { label: 'Saving to Database', icon: Database, desc: 'Finalizing question bank' },
  ];

  const generationSteps = [
    { label: 'Retrieving Notes from Qdrant', icon: Database, desc: 'Cosine similarity vector search' },
    { label: 'Drafting Answers with AI Router', icon: Zap, desc: 'Groq / Gemini / OpenRouter pipeline' },
    { label: 'Academic Reviewer Verification', icon: Sparkles, desc: 'Scoring alignment & LaTeX math cleanup' },
    { label: 'Generating Final Solution Set', icon: CheckCircle2, desc: 'Building PDF & citation links' },
  ];

  const indexingSteps = [
    { label: 'Chunking Document Text', icon: FileText, desc: 'Semantic chapter chunking' },
    { label: 'Generating Gemini Embeddings', icon: Cpu, desc: '3072-dimensional vector computation' },
    { label: 'Upserting to Qdrant Collection', icon: Database, desc: 'Indexing searchable chunks' },
    { label: 'Ready for Grounded RAG', icon: CheckCircle2, desc: 'Resource verified' },
  ];

  const steps =
    type === 'extraction'
      ? extractionSteps
      : type === 'indexing'
      ? indexingSteps
      : generationSteps;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/85 p-4 pt-16 sm:pt-24 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl shadow-indigo-500/10">
        
        {/* Animated Glow Header */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-slate-800">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Sparkles className="h-6 w-6 animate-pulse" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-indigo-500 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
              <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-indigo-300">
                {elapsedSeconds}s
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Live Progress Stages */}
        <div className="mt-6 space-y-3.5">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isDone = activeStep > idx;
            const isCurrent = activeStep === idx;

            return (
              <div
                key={step.label}
                className={`flex items-center justify-between rounded-2xl p-3.5 border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-indigo-500/10 border-indigo-500/30 shadow-md shadow-indigo-500/5'
                    : isDone
                    ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                    : 'bg-slate-950/30 border-slate-900 text-slate-600 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl border ${
                      isDone
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : isCurrent
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold ${
                        isCurrent ? 'text-white' : isDone ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-slate-500">{step.desc}</p>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-medium">
                  {isDone ? (
                    <span className="text-emerald-400 font-semibold">Done</span>
                  ) : isCurrent ? (
                    <span className="text-indigo-400 animate-pulse font-semibold">In Progress...</span>
                  ) : (
                    <span className="text-slate-600">Pending</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Informative Footer */}
        <div className="mt-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 p-3 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Automatic multi-provider failover active. Task will continue without interruption.</span>
          </p>
        </div>

      </div>
    </div>
  );
};
