import React, { useEffect, useState } from 'react';
import {
  Cpu,
  Database,
  FileText,
  CheckCircle2,
  Loader2,
  Workflow,
  Sparkles,
  Check,
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

    // Dynamic step progression
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
    { label: 'Analyzing Exam Structure', icon: Cpu, desc: 'Multi-provider failover routing' },
    { label: 'Parsing Questions & Marks', icon: Workflow, desc: 'Explicit marks & sequential numbering' },
    { label: 'Saving to Question Archive', icon: Database, desc: 'Finalizing question bank' },
  ];

  const generationSteps = [
    { label: 'Retrieving Notes from Qdrant', icon: Database, desc: 'Cosine similarity vector search' },
    { label: 'Drafting Manuscript Answers', icon: Cpu, desc: 'Grounded RAG synthesis' },
    { label: 'Academic Reviewer Pass', icon: Workflow, desc: 'LaTeX math & alignment check' },
    { label: 'Finalizing Solution Set', icon: CheckCircle2, desc: 'Building PDF & citation links' },
  ];

  const indexingSteps = [
    { label: 'Chunking Document Text', icon: FileText, desc: 'Semantic chapter chunking' },
    { label: 'Computing Vector Embeddings', icon: Cpu, desc: '3072-dimensional vector computation' },
    { label: 'Indexing into Qdrant', icon: Database, desc: 'Storing searchable vector points' },
    { label: 'Document Library Ready', icon: CheckCircle2, desc: 'Resource verified' },
  ];

  const steps =
    type === 'extraction'
      ? extractionSteps
      : type === 'indexing'
      ? indexingSteps
      : generationSteps;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[var(--overlay)] p-4 pt-16 sm:pt-24 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] p-6 sm:p-7 shadow-[var(--shadow-lg)]">
        
        {/* Header Block */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.25)] text-[var(--ai)] shrink-0">
            <Workflow className="h-5 w-5 stroke-[1.5]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-base font-normal text-[var(--text-primary)] tracking-tight truncate">
                {title}
              </h3>
              <span className="font-mono text-[11px] font-medium text-[var(--text-muted)] bg-[var(--surface-well)] px-2 py-0.5 rounded-[4px] border border-[var(--border)] shrink-0">
                {elapsedSeconds}s
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{subtitle}</p>
          </div>
        </div>

        {/* Live Progress Stages */}
        <div className="mt-5 space-y-2.5">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isDone = activeStep > idx;
            const isCurrent = activeStep === idx;

            return (
              <div
                key={step.label}
                className={`flex items-center justify-between rounded-[10px] p-3 border transition-all duration-200 ${
                  isCurrent
                    ? 'bg-[var(--surface-well)] border-[var(--primary)]'
                    : isDone
                    ? 'bg-[var(--surface)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                    : 'bg-[var(--surface-muted)] border-[var(--border-subtle)] opacity-50 text-[var(--text-disabled)]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-[6px] border shrink-0 ${
                      isDone
                        ? 'bg-[rgba(34,197,94,0.1)] border-[rgba(34,197,94,0.25)] text-[var(--success)]'
                        : isCurrent
                        ? 'bg-[var(--primary)] border-[var(--primary)] text-[var(--primary-foreground)]'
                        : 'bg-[var(--surface-well)] border-[var(--border)] text-[var(--text-muted)]'
                    }`}
                  >
                    {isDone ? (
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    ) : isCurrent ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Icon className="h-3.5 w-3.5 stroke-[1.5]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4
                      className={`text-xs font-medium truncate ${
                        isCurrent ? 'text-[var(--text-primary)] font-semibold' : isDone ? 'text-[var(--text-secondary)]' : 'text-[var(--text-disabled)]'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] truncate">{step.desc}</p>
                  </div>
                </div>

                <span className="font-mono text-[10px] uppercase tracking-wider shrink-0 ml-3">
                  {isDone ? (
                    <span className="text-[var(--success)] font-medium">Done</span>
                  ) : isCurrent ? (
                    <span className="text-[var(--primary)] font-medium">Active</span>
                  ) : (
                    <span className="text-[var(--text-disabled)]">Pending</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Restrained Informative Footer */}
        <div className="mt-5 rounded-[8px] bg-[var(--surface-well)] border border-[var(--border)] p-2.5 text-center">
          <p className="text-[11px] text-[var(--text-muted)] font-mono flex items-center justify-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
            <span>Multi-provider failover active (Gemini · Groq · OpenRouter · NVIDIA)</span>
          </p>
        </div>

      </div>
    </div>
  );
};
