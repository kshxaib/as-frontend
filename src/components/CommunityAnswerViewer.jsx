import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  BookOpen,
  User,
  Calendar,
  Layers,
  Search,
  CheckCircle2,
  Globe,
  Loader2,
  ArrowLeft,
  ChevronRight,
  ListOrdered,
  FileText,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { AnswerCard } from './AnswerCard';

export const CommunityAnswerViewer = () => {
  const {
    communityViewerOpen,
    communityViewerMeta,
    communityViewerAnswers,
    isLoadingCommunityViewer,
    closeCommunityViewer,
    downloadSolvedPdf,
  } = useQuestionBankStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeCommunityViewer();
      }
    };
    if (communityViewerOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [communityViewerOpen, closeCommunityViewer]);

  if (!communityViewerOpen) return null;

  const meta = communityViewerMeta || {};
  const answers = communityViewerAnswers || [];

  const filteredAnswers = answers.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (a.question_text && a.question_text.toLowerCase().includes(q)) ||
      (a.content && a.content.toLowerCase().includes(q)) ||
      String(a.question_number).includes(q)
    );
  });

  const totalMarks = answers.reduce((sum, a) => sum + (Number(a.marks) || 0), 0);

  const handleDownload = () => {
    if (!meta.answer_set_id) return;
    const filename = `AcademicStack_${(meta.subject || 'Subject').replace(/\s+/g, '_')}_${(meta.question_bank_name || 'Solved_QB').replace(/\s+/g, '_')}.pdf`;
    downloadSolvedPdf(meta.answer_set_id, filename);
  };

  const scrollToQuestion = (id) => {
    setActiveQuestionId(id);
    const element = document.getElementById(`community-q-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--background)] text-[var(--text-primary)] animate-in fade-in duration-150 overflow-hidden">
      
      {/* ── Top Sticky Masthead / Navigation Bar ── */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[var(--border)] bg-[var(--surface)] shrink-0 z-10">
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            onClick={closeCommunityViewer}
            className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] px-3 py-1.5 font-mono text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-all shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5 stroke-[1.5]" />
            <span className="hidden sm:inline">Back to The Commons</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="h-5 w-px bg-[var(--border-subtle)] hidden sm:block" />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--community)] bg-[rgba(200,168,32,0.1)] px-2 py-0.5 rounded-[4px] border border-[rgba(200,168,32,0.25)] font-semibold shrink-0">
                {meta.subject || 'Academic Subject'}
              </span>
              <h1 className="font-display text-base sm:text-lg font-normal text-[var(--text-primary)] tracking-tight truncate">
                {meta.question_bank_name || 'Solved Examination Manuscript'}
              </h1>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden lg:flex items-center gap-3 font-mono text-[11px] text-[var(--text-muted)] pr-2 border-r border-[var(--border-subtle)]">
            <span>
              <strong className="text-[var(--text-primary)]">{meta.completed_questions || answers.length}</strong> / {meta.total_questions || answers.length} Solved
            </span>
            <span>•</span>
            <span>
              <strong className="text-[var(--primary)]">{totalMarks}</strong> Total Marks
            </span>
            <span>•</span>
            <span className="text-[var(--success)] flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Verified Solution Set
            </span>
          </div>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-[8px] bg-[var(--community)] px-4 py-2 font-mono text-xs font-semibold text-[var(--community-foreground)] hover:opacity-90 transition-all shadow-xs"
          >
            <Download className="h-3.5 w-3.5 stroke-[2]" />
            <span>Download Typeset PDF</span>
          </button>

          <button
            onClick={closeCommunityViewer}
            className="rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] p-2 text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors"
            title="Close Viewer (Esc)"
          >
            <X className="h-4 w-4 stroke-[1.5]" />
          </button>
        </div>
      </header>

      {/* ── Main Workspace Body (2-Column Desktop: Sidebar + Manuscript) ── */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* ── Left Table of Contents / Question Index ── */}
        <aside className="w-80 xl:w-96 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col shrink-0 hidden md:flex">
          
          {/* Search & Meta Box */}
          <div className="p-4 border-b border-[var(--border-subtle)] space-y-3 bg-[var(--surface-well)]">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5 text-[var(--text-secondary)] font-medium">
                <ListOrdered className="h-3.5 w-3.5 text-[var(--primary)]" />
                Table of Contents
              </span>
              <span>{answers.length} Questions</span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter questions..."
                className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--surface)] py-1.5 pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
          </div>

          {/* Detailed Question List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">

            {filteredAnswers.map((ans, idx) => {
              const qNum = ans.question_number || idx + 1;
              const isSelected = activeQuestionId === ans.id;
              return (
                <button
                  key={ans.id || idx}
                  onClick={() => scrollToQuestion(ans.id)}
                  className={`w-full text-left p-3 rounded-[8px] border transition-all text-xs ${
                    isSelected
                      ? 'border-[var(--primary)] bg-[var(--surface-well)] shadow-xs'
                      : 'border-[var(--border-subtle)] bg-[var(--surface)] hover:bg-[var(--surface-well)] hover:border-[var(--border)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-xs font-semibold text-[var(--primary)]">
                      Question {qNum}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)] bg-[var(--surface-well)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">
                      {ans.marks} Marks
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {ans.question_text}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Author Footnote in Sidebar */}
          <div className="p-3.5 border-t border-[var(--border-subtle)] bg-[var(--surface-well)] font-mono text-[11px] text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5 truncate">
              <User className="h-3 w-3 shrink-0" />
              <span>Contributed by <strong>{meta.author_name || 'AcademicStack Scholar'}</strong></span>
            </span>
          </div>
        </aside>

        {/* ── Right Main Manuscript Reading Canvas ── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 bg-[var(--background)]">
          <div className="mx-auto max-w-4xl space-y-8">
            
            {/* Manuscript Title Banner */}
            <div className="pb-6 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--community)]">
                  The Commons Solved Manuscript
                </span>
                <span className="text-[var(--text-muted)]">·</span>
                <span className="font-mono text-[11px] text-[var(--text-muted)]">
                  {meta.created_at ? new Date(meta.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Verified Archive'}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-[var(--text-primary)] tracking-tight leading-tight">
                {meta.question_bank_name}
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Syllabus-grounded step-by-step examination solutions compiled from verified lecture resources.
              </p>
            </div>

            {/* Answers Feed */}
            {isLoadingCommunityViewer ? (
              <div className="py-32 text-center text-[var(--text-muted)]">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--primary)] mb-3 stroke-[1.5]" />
                <p className="font-mono text-sm">Opening full examination manuscript from The Commons...</p>
              </div>
            ) : filteredAnswers.length > 0 ? (
              <div className="space-y-8">
                {filteredAnswers.map((ans, idx) => (
                  <div
                    key={ans.id || idx}
                    id={`community-q-${ans.id}`}
                    className="scroll-mt-6"
                  >
                    <AnswerCard
                      answer={ans}
                      index={idx}
                      readOnly={true}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center text-[var(--text-muted)] rounded-[12px] border border-dashed border-[var(--border)] bg-[var(--surface)]">
                <BookOpen className="mx-auto h-10 w-10 text-[var(--text-disabled)] mb-3 stroke-[1.5]" />
                <p className="font-display text-lg text-[var(--text-primary)]">No matching answers found</p>
                <p className="mt-1 text-xs font-mono">Try adjusting your filter keyword.</p>
              </div>
            )}

            {/* Bottom End of Paper Mark */}
            {filteredAnswers.length > 0 && (
              <div className="pt-12 pb-16 text-center border-t border-[var(--border)]">
                <p className="font-display text-sm text-[var(--text-muted)] italic">
                  — End of Solved Examination Manuscript —
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--community)] px-5 py-2.5 font-mono text-xs font-semibold text-[var(--community-foreground)] hover:opacity-90 transition-all shadow-sm"
                  >
                    <Download className="h-4 w-4 stroke-[2]" />
                    <span>Download Complete PDF</span>
                  </button>
                  <button
                    onClick={closeCommunityViewer}
                    className="rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 font-mono text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    Back to The Commons
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>

      </div>
    </div>
  );
};
