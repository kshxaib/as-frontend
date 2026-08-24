import React from 'react';
import {
  BookOpen,
  Layers,
  FileCheck2,
  Globe,
  ArrowRight,
  Upload,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useQuestionBankStore } from '../store/useQuestionBankStore';

export const LandingPage = ({ justLoggedOut }) => {
  const { openAuthModal } = useAuthStore();
  const { setActiveTab } = useQuestionBankStore();

  const workflowModules = [
    {
      step: '01',
      title: 'Digital Reading Room',
      subtitle: 'Study Resources',
      description: 'Upload course notes, textbook chapters, and syllabus PDFs. Structured chapter chunking and vector indexing make your materials instantly retrievable.',
      icon: BookOpen,
      tag: 'Vector RAG Library',
    },
    {
      step: '02',
      title: 'Examination Archive',
      subtitle: 'Question Banks',
      description: 'Ingest university past papers. Our parser extracts multi-part questions, explicit mark distributions, and links related study units automatically.',
      icon: FileText,
      tag: 'Automated Extraction',
    },
    {
      step: '03',
      title: 'Manuscript Review',
      subtitle: 'Question Verification',
      description: 'Audit questions in an editorial editor. Adjust point allocations, add bespoke questions, and inspect mark sources before generating solutions.',
      icon: Layers,
      tag: 'Editorial Control',
    },
    {
      step: '04',
      title: 'Multi-Agent Solution Synthesis',
      subtitle: 'Autonomous RAG Pipeline',
      description: 'Autonomous multi-agent orchestration (Retrieval Agent, Synthesis Agent, LaTeX Reviewer) generates step-by-step examination solutions strictly grounded in your indexed notes with mathematical rigor.',
      icon: Cpu,
      tag: 'Multi-Agent RAG',
    },
    {
      step: '05',
      title: 'The Commons',
      subtitle: 'Academic Hub',
      description: 'Access and share solved answer sets and study materials with the wider academic community without friction.',
      icon: Globe,
      tag: 'Shared Archive',
    },
    {
      step: '06',
      title: 'Typeset PDF Export',
      subtitle: 'Solution Manuscript',
      description: 'Export beautifully formatted, publication-ready PDF manuscripts with precise pagination, citation references, and clean typography.',
      icon: Download,
      tag: 'Publication Output',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      
      {/* ── Top Masthead / Hero ── */}
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 text-center">
        {justLoggedOut && (
          <div className="mb-8 mx-auto inline-flex items-center gap-2 rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] px-4 py-2 text-xs text-[var(--text-secondary)]">
            <CheckCircle2 className="h-3.5 w-3.5 text-[var(--success)]" />
            <span>You have been signed out successfully.</span>
          </div>
        )}

        <div className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] px-3.5 py-1 font-mono text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-8 shadow-xs">
          <Cpu className="h-3 w-3 text-[var(--primary)]" />
          <span>Multi-Agent Research & Exam Workspace</span>
        </div>


        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[var(--text-primary)] leading-[1.12]">
          From Study Material to <br className="hidden sm:inline" />
          <span className="italic">Solution Manuscript.</span>
        </h1>

        <p className="mt-6 mx-auto max-w-2xl text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-normal">
          An academic workspace for syllabus-grounded exam preparation powered by <span className="text-[var(--text-primary)] font-semibold border-b border-[var(--primary)]/60 pb-0.5">autonomous multi-agent orchestration</span>. Index your lecture notes, extract past papers with structured mark allocation, and synthesize citation-verified examination answers with <span className="text-[var(--text-primary)] font-semibold border-b border-[var(--primary)]/60 pb-0.5">0% downtime</span> across multi-provider AI failover.
        </p>


        {/* Primary Action Row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => openAuthModal('register')}
            className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--primary)] px-5 py-2.5 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-sm"
          >
            <span>Get Started</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => openAuthModal('login')}
            className="inline-flex items-center gap-2 rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] px-5 py-2.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-all"
          >
            <span>Sign In</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className="inline-flex items-center gap-2 rounded-[8px] border border-[rgba(200,168,32,0.3)] bg-[rgba(200,168,32,0.06)] px-5 py-2.5 text-xs font-medium text-[var(--community)] hover:bg-[rgba(200,168,32,0.12)] transition-all"
          >
            <Globe className="h-3.5 w-3.5 stroke-[1.5]" />
            <span>Browse The Commons</span>
          </button>
        </div>
      </section>



      <div className="editorial-rule max-w-5xl mx-auto" />

      {/* ── Workflow Modules ── */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-12">
          <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
            Core Architecture
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-normal text-[var(--text-primary)] mt-1 tracking-tight">
            Academic Research Workflow
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl">
            A cohesive pipeline designed to transform unstructured study documents into verified examination solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workflowModules.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="group flex flex-col justify-between rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--border-strong)] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="font-mono text-xs font-semibold text-[var(--primary)]">
                      {item.step}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] bg-[var(--surface-well)] px-2 py-0.5 rounded-[4px] border border-[var(--border-subtle)]">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-normal text-[var(--text-primary)] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-mono text-[var(--text-muted)] mb-3">
                    {item.subtitle}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Editorial Footer ── */}
      <footer className="border-t border-[var(--border)] py-8 px-4 sm:px-6 bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-medium text-[var(--text-primary)]">AcademicStack</span>
            <span>·</span>
            <span>Research Workspace</span>
          </div>
          <p className="font-mono text-[11px]">
            Strictly for syllabus research & exam preparation.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => openAuthModal('login')} className="hover:text-[var(--text-primary)] transition-colors">
              Sign In
            </button>
            <button onClick={() => openAuthModal('register')} className="hover:text-[var(--text-primary)] transition-colors">
              Register
            </button>
            <button onClick={() => setActiveTab('community')} className="text-[var(--community)] hover:opacity-80 transition-colors">
              The Commons
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
