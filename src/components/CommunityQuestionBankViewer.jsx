import React from 'react';
import {
  X,
  BookOpen,
  User,
  Layers,
  Award,
  Calendar,
  FolderPlus,
  Loader2,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  Download,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';

export const CommunityQuestionBankViewer = () => {
  const {
    communityQBViewerOpen,
    communityQBViewerData,
    isLoadingCommunityQBViewer,
    isCloningCommunityQB,
    closeCommunityQBViewer,
    cloneQuestionBankToWorkspace,
    downloadQuestionBankFile,
  } = useQuestionBankStore();

  if (!communityQBViewerOpen) return null;

  const qb = communityQBViewerData?.question_bank;
  const questions = communityQBViewerData?.questions || [];

  const handleClone = async () => {
    if (!qb?.id) return;
    await cloneQuestionBankToWorkspace(qb.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-[16px] border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="border-b border-[var(--border)] bg-[var(--surface-well)] px-6 py-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-[11px] font-medium text-[var(--community)] bg-[rgba(200,168,32,0.1)] px-2 py-0.5 rounded-[4px] border border-[rgba(200,168,32,0.25)]">
                {qb?.subject || 'Subject Archive'}
              </span>
              <span className="font-mono text-[11px] text-[var(--text-primary)] flex items-center gap-1.5 bg-[var(--surface)] px-2.5 py-0.5 rounded-[4px] border border-[var(--border-subtle)]">
                <div className="h-4 w-4 rounded-full bg-[var(--ai)] text-black font-bold text-[10px] flex items-center justify-center uppercase shrink-0">
                  {(qb?.author_name || 'S')[0]}
                </div>
                Curated & Shared by <strong className="text-[var(--ai)]">{qb?.author_name || 'Academic Scholar'}</strong>
              </span>
            </div>

            <h2 className="font-display text-xl font-semibold text-[var(--text-primary)] truncate">
              {qb?.name || 'Question Bank Examination Paper'}
            </h2>

            {/* Quick Metrics Bar */}
            <div className="mt-2.5 flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--text-secondary)]">
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-[var(--primary)]" />
                {questions.length} Extracted Questions
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-[var(--community)]" />
                {qb?.total_marks || 0} Total Marks
              </span>
              {qb?.created_at && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[var(--text-muted)]">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(qb.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons & Close */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleClone}
              disabled={isCloningCommunityQB || isLoadingCommunityQBViewer}
              className="inline-flex items-center gap-1.5 rounded-[8px] bg-[var(--primary)] px-3.5 py-1.5 font-mono text-xs font-semibold text-[var(--primary-foreground)] shadow-xs hover:opacity-90 transition-all disabled:opacity-50"
              title="Clone all questions into your own workspace"
            >
              {isCloningCommunityQB ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FolderPlus className="h-3.5 w-3.5 stroke-[2]" />
              )}
              <span>{isCloningCommunityQB ? 'Cloning...' : 'Clone to My Workspace'}</span>
            </button>

            {qb?.id && (
              <button
                onClick={() => downloadQuestionBankFile(qb.id, `${(qb.name || 'Exam_Paper').replace(/\s+/g, '_')}.pdf`)}
                title="Download Original Exam PDF"
                className="rounded-[8px] border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Download className="h-4 w-4 stroke-[1.5]" />
              </button>
            )}

            <button
              onClick={closeCommunityQBViewer}
              className="rounded-[8px] border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-well)] transition-colors"
            >
              <X className="h-4 w-4 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Modal Body / Questions List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoadingCommunityQBViewer ? (
            <div className="py-20 text-center">
              <Loader2 className="mx-auto h-7 w-7 animate-spin text-[var(--primary)] mb-3 stroke-[1.5]" />
              <p className="font-mono text-xs text-[var(--text-muted)]">
                Loading extracted questions & taxonomy...
              </p>
            </div>
          ) : questions.length > 0 ? (
            questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-well)]/40 p-4 hover:border-[var(--border-strong)] transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[var(--surface-well)] font-mono text-xs font-semibold text-[var(--text-primary)] border border-[var(--border-subtle)]">
                      {q.question_number || idx + 1}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-[var(--primary)] bg-[rgba(15,118,110,0.1)] px-2 py-0.5 rounded-[4px] border border-[rgba(15,118,110,0.2)]">
                      {q.marks ? `${q.marks} Marks` : 'Marks N/A'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {q.repeat_count > 1 && (
                      <span className="font-mono text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-[4px] border border-amber-500/20 font-medium">
                        Repeated {q.repeat_count}x
                      </span>
                    )}
                    {q.years_appeared && (
                      <span className="font-mono text-[10px] text-[var(--text-muted)] bg-[var(--surface)] px-2 py-0.5 rounded-[4px] border border-[var(--border-subtle)]">
                        {q.years_appeared}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line pl-8 font-sans">
                  {q.question_text}
                </p>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-[var(--text-muted)]">
              <BookOpen className="mx-auto h-8 w-8 text-[var(--text-disabled)] mb-2 stroke-[1.5]" />
              <p className="font-medium text-sm text-[var(--text-secondary)]">No questions extracted yet</p>
              <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
                This question bank has not been extracted or has no approved questions.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Banner */}
        <div className="border-t border-[var(--border)] bg-[var(--surface-well)] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--community)]" />
            <span>Zero OpenAI API Key Required to practice or review these questions.</span>
          </div>

          <button
            onClick={handleClone}
            disabled={isCloningCommunityQB || isLoadingCommunityQBViewer}
            className="font-mono text-xs text-[var(--primary)] hover:underline font-semibold flex items-center gap-1 transition-colors"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            <span>Copy to My Workspace</span>
          </button>
        </div>

      </div>
    </div>
  );
};
