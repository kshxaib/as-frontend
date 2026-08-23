import React, { useEffect, useState } from 'react';
import {
  FileCheck2,
  RefreshCw,
  Search,
  BookOpen,
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  Layers,
  Workflow,
  Check,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { AnswerCard } from './AnswerCard';
import { ConfirmationModal } from './ConfirmationModal';
import { AiProgressModal } from './AiProgressModal';
import { StatusBadge } from './ui/StatusBadge';
import { EmptyState } from './ui/EmptyState';

export const SolutionViewer = () => {
  const {
    questionBanks,
    currentQuestionBank,
    currentAnswerSet,
    isGeneratingAnswers,
    isLoading,
    fetchQuestionBanks,
    selectQuestionBank,
    generateAnswers,
    downloadSolvedPdf,
    toggleAnswerSetShare,
    setActiveTab,
    error,
    successMessage,
    clearFeedback,
  } = useQuestionBankStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isRegenerateConfirmOpen, setIsRegenerateConfirmOpen] = useState(false);

  // 1. On mount: Fetch question banks if list is empty or ensure current is selected
  useEffect(() => {
    fetchQuestionBanks();
  }, [fetchQuestionBanks]);

  // 2. If question banks exist but none selected, select the first one
  useEffect(() => {
    if (questionBanks.length > 0 && !currentQuestionBank) {
      selectQuestionBank(questionBanks[0].id);
    }
  }, [questionBanks, currentQuestionBank, selectQuestionBank]);

  // 3. If currentQuestionBank is set but currentAnswerSet is missing or lacks answers, refresh it
  useEffect(() => {
    if (currentQuestionBank && (!currentAnswerSet || currentAnswerSet.question_bank_id !== currentQuestionBank.id)) {
      selectQuestionBank(currentQuestionBank.id);
    }
  }, [currentQuestionBank?.id]);

  // 4. Auto dismiss feedback
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(clearFeedback, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, clearFeedback]);

  // If no Question Banks at all in user's account
  if (!isLoading && questionBanks.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--background)] pb-24 text-[var(--text-primary)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <EmptyState
            icon={BookOpen}
            title="No Question Banks Available"
            description="Upload an examination paper in the Question Banks section to extract questions and synthesize grounded solutions."
            actionText="Go to Question Banks"
            onAction={() => setActiveTab('question_banks')}
          />
        </div>
      </div>
    );
  }

  const answers = (currentAnswerSet?.answers || []).filter(Boolean);
  const completedCount = answers.filter((a) => a.status === 'completed').length;
  const totalMarksSolved = answers
    .filter((a) => a.status === 'completed')
    .reduce((sum, a) => sum + (Number(a.marks) || 0), 0);

  const filteredAnswers = answers.filter((a) =>
    a.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.content && a.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isShared = currentAnswerSet?.visibility === 'community';

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 text-[var(--text-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Feedback Alert Banners */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-[8px] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] p-3.5 text-xs text-[var(--error)]">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={clearFeedback} className="text-xs hover:underline font-mono">Dismiss</button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-center justify-between rounded-[8px] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)] p-3.5 text-xs text-[var(--success)]">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={clearFeedback} className="text-xs hover:underline font-mono">Dismiss</button>
          </div>
        )}

        {/* ── Top Bar: Navigation, Question Bank Switcher & Actions ── */}
        <div className="flex flex-col gap-6 pb-6 border-b border-[var(--border)]">
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5 mb-1">
                <FileCheck2 className="h-3.5 w-3.5 stroke-[1.5]" />
                Solution Manuscript Reader
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-normal text-[var(--text-primary)] tracking-tight">
                {currentQuestionBank ? currentQuestionBank.name : 'Select a Question Bank'}
              </h1>
              {currentQuestionBank && (
                <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)]">
                  Subject: <span className="font-semibold text-[var(--text-primary)]">{currentQuestionBank.subject}</span> · Grounded in linked study notes
                </p>
              )}
            </div>

            {/* Selection & Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {questionBanks.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase hidden sm:inline">Bank:</span>
                  <select
                    value={currentQuestionBank?.id || ''}
                    onChange={(e) => selectQuestionBank(Number(e.target.value))}
                    className="rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
                  >
                    {questionBanks.map((qb) => (
                      <option key={qb.id} value={qb.id}>
                        {qb.name} ({qb.subject})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {currentQuestionBank && (
                <button
                  onClick={() => setActiveTab('review')}
                  className="inline-flex items-center gap-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors"
                >
                  <Layers className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>Review Questions</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Bank Tabs Strip (if user has multiple question banks) */}
          {questionBanks.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase mr-1 whitespace-nowrap">Archives:</span>
              {questionBanks.map((qb) => {
                const isSelected = currentQuestionBank?.id === qb.id;
                return (
                  <button
                    key={qb.id}
                    onClick={() => selectQuestionBank(qb.id)}
                    className={`flex items-center gap-2 rounded-[6px] px-3 py-1 font-mono text-xs transition-all ${
                      isSelected
                        ? 'bg-[var(--sidebar-active-bg)] text-[var(--primary)] font-semibold border border-[rgba(20,184,166,0.3)]'
                        : 'border border-[var(--border)] bg-[var(--surface-well)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{qb.name}</span>
                    <span className="text-[10px] opacity-75">[{qb.subject}]</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Action Buttons Row */}
          {currentQuestionBank && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2.5">
                {currentAnswerSet && answers.length > 0 && (
                  <>
                    {/* Download PDF Button */}
                    <button
                      onClick={() =>
                        downloadSolvedPdf(
                          currentAnswerSet.id,
                          `AcademicStack_${(currentQuestionBank?.subject || 'Subject').replace(/\s+/g, '_')}_${(currentQuestionBank?.name || 'QB').replace(/\s+/g, '_')}_Solved.pdf`
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--community)] px-3.5 py-1.5 text-xs font-semibold text-[var(--community-foreground)] hover:opacity-90 transition-all shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5 stroke-[2]" />
                      <span>Download Solved PDF</span>
                    </button>

                    {/* Share to Community */}
                    <button
                      onClick={() => toggleAnswerSetShare(currentAnswerSet.id)}
                      className={`inline-flex items-center gap-2 rounded-[8px] border px-3 py-1.5 text-xs font-medium transition-all ${
                        isShared
                          ? 'border-[rgba(200,168,32,0.3)] bg-[rgba(200,168,32,0.1)] text-[var(--community)]'
                          : 'border-[var(--border)] bg-[var(--surface-well)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Share2 className="h-3.5 w-3.5 stroke-[1.5]" />
                      <span>{isShared ? 'Shared with The Commons' : 'Share with The Commons'}</span>
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => {
                  if (answers.length > 0) {
                    setIsRegenerateConfirmOpen(true);
                  } else {
                    generateAnswers(currentQuestionBank.id);
                  }
                }}
                disabled={isGeneratingAnswers}
                className="inline-flex items-center gap-1.5 rounded-[8px] border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.08)] px-3.5 py-1.5 font-mono text-xs font-medium text-[var(--ai)] hover:bg-[rgba(245,158,11,0.15)] transition-all disabled:opacity-40"
              >
                <Workflow className={`h-3.5 w-3.5 stroke-[1.5] ${isGeneratingAnswers ? 'animate-spin' : ''}`} />
                <span>{isGeneratingAnswers ? 'Synthesizing Answers...' : answers.length > 0 ? 'Regenerate Answers' : 'Generate Solutions (AI)'}</span>
              </button>
            </div>
          )}
        </div>

        {/* ── Stats Strip ── */}
        {currentQuestionBank && answers.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-well)] p-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Completed Answers</span>
              <p className="mt-1 font-mono text-2xl font-semibold text-[var(--text-primary)]">
                {completedCount} <span className="text-sm font-normal text-[var(--text-muted)]">/ {answers.length}</span>
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">Total questions solved</p>
            </div>

            <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-well)] p-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Solved Points</span>
              <p className="mt-1 font-mono text-2xl font-semibold text-[var(--primary)]">{totalMarksSolved} Marks</p>
              <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">Calculated question marks</p>
            </div>

            <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-well)] p-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Grounded Pipeline</span>
              <p className="mt-1 font-mono text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                <span>Vector RAG Grounded</span>
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-[var(--text-muted)] truncate">
                Linked: {currentQuestionBank.resource_ids || 'All Indexed Notes'}
              </p>
            </div>
          </div>
        )}

        {/* ── Search Bar ── */}
        {answers.length > 0 && (
          <div className="mt-6 flex items-center justify-between rounded-[10px] border border-[var(--border)] bg-[var(--surface-well)] p-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search solutions by concept, keyword, or equation..."
                className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--surface)] py-1.5 pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
            <span className="font-mono text-[11px] text-[var(--text-muted)] hidden sm:inline mr-2">
              Showing {filteredAnswers.length} of {answers.length} Solutions
            </span>
          </div>
        )}

        {/* ── Solutions List ── */}
        <div className="mt-6 space-y-6">
          {isLoading ? (
            <div className="py-20 text-center text-[var(--text-muted)]">
              <RefreshCw className="mx-auto h-6 w-6 animate-spin text-[var(--primary)] mb-2 stroke-[1.5]" />
              <p className="font-mono text-xs">Loading solutions for {currentQuestionBank?.name}...</p>
            </div>
          ) : isGeneratingAnswers ? (
            <div className="py-24 text-center rounded-[12px] border border-dashed border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.04)]">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-[var(--ai)] mb-3 stroke-[1.5]" />
              <h3 className="font-display text-lg font-normal text-[var(--text-primary)]">Synthesizing Examination Solutions...</h3>
              <p className="mt-1 text-xs text-[var(--text-muted)] max-w-md mx-auto">
                Retrieving vector contexts from Qdrant, drafting syllabus-calibrated answers, and passing through Academic Review.
              </p>
            </div>
          ) : filteredAnswers.length > 0 ? (
            filteredAnswers.map((answer, index) => (
              <AnswerCard key={answer.id} answer={answer} index={index} />
            ))
          ) : (
            <EmptyState
              icon={BookOpen}
              title={
                currentQuestionBank
                  ? `No Solutions Generated for "${currentQuestionBank.name}" Yet`
                  : 'No Answers Generated Yet'
              }
              description="Click 'Generate Solutions' to synthesize complete, step-by-step examination solutions strictly grounded in your indexed study notes."
              actionText="Generate Solutions (AI)"
              actionVariant="amber"
              onAction={() => currentQuestionBank && generateAnswers(currentQuestionBank.id)}
            />
          )}
        </div>

        {/* Regenerate Confirmation Modal */}
        {currentQuestionBank && (
          <ConfirmationModal
            isOpen={isRegenerateConfirmOpen}
            title="Regenerate All Exam Solutions?"
            message={`All existing answers for "${currentQuestionBank.name}" will be regenerated from scratch using Qdrant vector retrieval and Academic AI Review.`}
            confirmText="Yes, Regenerate Answers"
            cancelText="Cancel"
            confirmVariant="warning"
            iconType="ai"
            onConfirm={() => {
              setIsRegenerateConfirmOpen(false);
              generateAnswers(currentQuestionBank.id);
            }}
            onCancel={() => setIsRegenerateConfirmOpen(false)}
          />
        )}

        {/* Live Answer Generation Progress Modal */}
        <AiProgressModal
          isOpen={isGeneratingAnswers}
          type="generation"
          title="Synthesizing Solution Manuscript"
          subtitle={`Solving questions with Qdrant vector retrieval, multi-provider drafting, and Academic Review.`}
        />
      </div>
    </div>
  );
};
