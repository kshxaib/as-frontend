import React, { useState } from 'react';
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
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);

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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[var(--overlay)] p-2 sm:p-4 pt-6 sm:pt-10 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative flex flex-col w-full max-w-5xl rounded-[16px] border border-[var(--border)] bg-[var(--surface-elevated)] shadow-[var(--shadow-lg)] max-h-[92vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="flex flex-col gap-3 p-5 sm:p-6 border-b border-[var(--border-subtle)] bg-[var(--surface-well)] shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5 font-mono text-[11px]">
                <span className="inline-flex items-center gap-1 text-[var(--community)] bg-[rgba(200,168,32,0.1)] px-2.5 py-0.5 rounded-[4px] border border-[rgba(200,168,32,0.25)] font-semibold">
                  <Globe className="h-3 w-3 stroke-[1.5]" />
                  The Commons Archive
                </span>
                <span className="bg-[var(--surface)] text-[var(--text-secondary)] px-2 py-0.5 rounded-[4px] border border-[var(--border-subtle)] font-medium">
                  {meta.subject || 'Subject'}
                </span>
                <span className="text-[var(--text-muted)] hidden sm:inline">•</span>
                <span className="text-[var(--text-muted)] hidden sm:inline flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Shared by {meta.author_name || 'AcademicStack Scholar'}
                </span>
              </div>

              <h2 className="font-display text-xl sm:text-2xl font-normal text-[var(--text-primary)] tracking-tight truncate">
                {meta.question_bank_name || 'Solved Examination Manuscript'}
              </h2>
            </div>

            {/* Close & Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 rounded-[6px] bg-[var(--community)] px-3.5 py-1.5 font-mono text-xs font-semibold text-[var(--community-foreground)] hover:opacity-90 transition-all shadow-xs"
              >
                <Download className="h-3.5 w-3.5 stroke-[2]" />
                <span className="hidden sm:inline">Download PDF</span>
              </button>

              <button
                onClick={closeCommunityViewer}
                className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors"
                title="Close Viewer"
              >
                <X className="h-4 w-4 stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[var(--border-subtle)]">
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--text-muted)]">
              <span>
                <strong className="text-[var(--text-primary)] font-semibold">{meta.completed_questions || answers.length}</strong> / {meta.total_questions || answers.length} Questions Solved
              </span>
              <span>•</span>
              <span>
                Total Marks: <strong className="text-[var(--primary)] font-semibold">{totalMarks}</strong>
              </span>
              <span>•</span>
              <span className="text-[var(--success)] flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                RAG Grounded & Verified
              </span>
            </div>

            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter questions or formulas..."
                className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--surface)] py-1.5 pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Answers List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-[var(--background)]">
          {isLoadingCommunityViewer ? (
            <div className="py-24 text-center text-[var(--text-muted)]">
              <Loader2 className="mx-auto h-7 w-7 animate-spin text-[var(--primary)] mb-3 stroke-[1.5]" />
              <p className="font-mono text-xs">Loading verified solution manuscript from The Commons...</p>
            </div>
          ) : filteredAnswers.length > 0 ? (
            filteredAnswers.map((ans, idx) => (
              <AnswerCard
                key={ans.id || idx}
                answer={ans}
                index={idx}
                readOnly={true}
              />
            ))
          ) : (
            <div className="py-16 text-center text-[var(--text-muted)] rounded-[12px] border border-dashed border-[var(--border)] bg-[var(--surface)]">
              <BookOpen className="mx-auto h-8 w-8 text-[var(--text-disabled)] mb-2 stroke-[1.5]" />
              <p className="font-display text-base text-[var(--text-primary)]">No matching answers found</p>
              <p className="mt-1 text-xs font-mono">Try adjusting your search query filter.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[var(--border-subtle)] bg-[var(--surface-well)] font-mono text-[11px] text-[var(--text-muted)] shrink-0">
          <span>AcademicStack • Public Research Archive</span>
          <button
            onClick={closeCommunityViewer}
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            Close Viewer [Esc]
          </button>
        </div>

      </div>
    </div>
  );
};
