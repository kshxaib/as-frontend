import React, { useEffect, useState } from 'react';
import {
  FileText,
  Plus,
  ArrowRight,
  RefreshCw,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Layers,
  Workflow,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { QuestionCard } from './QuestionCard';
import { AddQuestionModal } from './AddQuestionModal';
import { ConfirmationModal } from './ConfirmationModal';
import { AiProgressModal } from './AiProgressModal';
import { StatusBadge } from './ui/StatusBadge';
import { EmptyState } from './ui/EmptyState';

export const QuestionReview = () => {
  const {
    questionBanks,
    currentQuestionBank,
    questions,
    isLoading,
    extractingQBs,
    isGeneratingAnswers,
    error,
    successMessage,
    fetchQuestionBanks,
    selectQuestionBank,
    extractQuestions,
    generateAnswers,
    clearFeedback,
  } = useQuestionBankStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGenerateConfirmOpen, setIsGenerateConfirmOpen] = useState(false);
  const [isReExtractConfirmOpen, setIsReExtractConfirmOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarkFilter, setSelectedMarkFilter] = useState('ALL');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState('ALL');

  useEffect(() => {
    fetchQuestionBanks();
  }, [fetchQuestionBanks]);

  // Auto-dismiss feedback after 4 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(clearFeedback, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, clearFeedback]);

  // Calculations for stats
  const totalQuestions = questions.length;
  const totalMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
  const explicitCount = questions.filter((q) => q.marks_source === 'explicit').length;
  const aiEstimatedCount = questions.filter((q) => q.marks_source === 'ai_estimated').length;
  const userModifiedCount = questions.filter((q) => q.marks_source === 'user_modified').length;

  // Filtered questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question_text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMarks =
      selectedMarkFilter === 'ALL' || Number(q.marks) === Number(selectedMarkFilter);
    const matchesSource =
      selectedSourceFilter === 'ALL' || q.marks_source === selectedSourceFilter;
    return matchesSearch && matchesMarks && matchesSource;
  });

  return (
    <div className="min-h-screen bg-[var(--background)] pb-32 text-[var(--text-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Feedback Alert Banners */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-[8px] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] p-3.5 text-xs text-[var(--error)]">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={clearFeedback} className="text-xs hover:underline font-mono">
              Dismiss
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-center justify-between rounded-[8px] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)] p-3.5 text-xs text-[var(--success)]">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={clearFeedback} className="text-xs hover:underline font-mono">
              Dismiss
            </button>
          </div>
        )}

        {/* Top Control Bar */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between pb-6 border-b border-[var(--border)]">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5 mb-1">
              <Layers className="h-3.5 w-3.5 stroke-[1.5]" />
              Editorial Review
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-normal text-[var(--text-primary)] tracking-tight">
              Question Verification & Marks Allocation
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)]">
              Audit parsed questions, customize point weights, and review before generating grounded solution manuscripts.
            </p>
          </div>

          {/* Controls: Switcher & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {questionBanks.length > 0 && (
              <div className="relative">
                <select
                  value={currentQuestionBank?.id || ''}
                  onChange={(e) => selectQuestionBank(Number(e.target.value))}
                  className="rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
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
                onClick={() => {
                  if (currentQuestionBank.status === 'extracted') {
                    setIsReExtractConfirmOpen(true);
                  } else {
                    extractQuestions(currentQuestionBank.id);
                  }
                }}
                disabled={!!extractingQBs[currentQuestionBank.id]}
                className="inline-flex items-center gap-1.5 rounded-[8px] border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.08)] px-3.5 py-2 font-mono text-[11px] font-medium text-[var(--ai)] hover:bg-[rgba(245,158,11,0.15)] transition-all disabled:opacity-40"
              >
                <Workflow className={`h-3.5 w-3.5 stroke-[1.5] ${extractingQBs[currentQuestionBank.id] ? 'animate-spin' : ''}`} />
                <span>
                  {extractingQBs[currentQuestionBank.id]
                    ? 'Extracting...'
                    : currentQuestionBank.status === 'extracted'
                    ? 'Re-extract Questions'
                    : 'Extract with AI'}
                </span>
              </button>
            )}

            {currentQuestionBank && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-[8px] bg-[var(--primary)] px-3.5 py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-sm"
              >
                <Plus className="h-3.5 w-3.5 stroke-[2]" />
                <span>Add Question</span>
              </button>
            )}
          </div>
        </div>

        {/* Current Question Bank Details & Stats */}
        {currentQuestionBank ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-well)] p-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Total Questions</span>
              <p className="mt-1 font-mono text-2xl font-semibold text-[var(--text-primary)]">{totalQuestions}</p>
              <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">Verified question entries</p>
            </div>

            <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-well)] p-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Total Marks</span>
              <p className="mt-1 font-mono text-2xl font-semibold text-[var(--primary)]">{totalMarks} Marks</p>
              <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">Sum of examination weights</p>
            </div>

            <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-well)] p-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Marks Provenance</span>
              <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px]">
                <span className="bg-[rgba(34,197,94,0.1)] text-[var(--success)] px-1.5 py-0.5 rounded border border-[rgba(34,197,94,0.2)]">
                  {explicitCount} Explicit
                </span>
                <span className="bg-[rgba(245,158,11,0.1)] text-[var(--ai)] px-1.5 py-0.5 rounded border border-[rgba(245,158,11,0.2)]">
                  {aiEstimatedCount} AI
                </span>
                {userModifiedCount > 0 && (
                  <span className="bg-[var(--surface)] text-[var(--text-muted)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                    {userModifiedCount} Modified
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-[var(--text-muted)]">Mark allocation sources</p>
            </div>

            <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-well)] p-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Subject Archive</span>
              <p className="mt-1 font-display text-sm font-medium text-[var(--text-primary)] truncate">
                {currentQuestionBank.subject}
              </p>
              <p className="mt-0.5 font-mono text-[10px] text-[var(--text-muted)] truncate">
                Linked IDs: {currentQuestionBank.resource_ids || 'All Notes'}
              </p>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Layers}
            title="No Question Bank Selected"
            description="Select or upload a question bank to review and audit question structures."
          />
        )}

        {/* Filter and Search Bar */}
        {currentQuestionBank && questions.length > 0 && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-[10px] border border-[var(--border)] bg-[var(--surface-well)] p-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter questions by keyword..."
                className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--surface)] py-1.5 pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] text-[var(--text-muted)] mr-1 uppercase">
                Filter:
              </span>
              {['ALL', 2, 5, 10].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedMarkFilter(filter)}
                  className={`rounded-[4px] px-2 py-0.5 font-mono text-[11px] font-medium transition-all ${
                    selectedMarkFilter === filter
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-xs'
                      : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {filter === 'ALL' ? 'All' : `${filter}M`}
                </button>
              ))}

              <div className="h-4 w-px bg-[var(--border)] mx-1" />

              <select
                value={selectedSourceFilter}
                onChange={(e) => setSelectedSourceFilter(e.target.value)}
                className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 font-mono text-xs text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
              >
                <option value="ALL">All Sources</option>
                <option value="explicit">Explicit</option>
                <option value="ai_estimated">AI Estimated</option>
                <option value="user_modified">User Verified</option>
              </select>
            </div>
          </div>
        )}

        {/* Questions List */}
        {currentQuestionBank && (
          <div className="mt-6 space-y-4">
            {isLoading ? (
              <div className="py-20 text-center text-[var(--text-muted)]">
                <RefreshCw className="mx-auto h-6 w-6 animate-spin text-[var(--primary)] mb-2 stroke-[1.5]" />
                <p className="font-mono text-xs">Loading manuscript items...</p>
              </div>
            ) : filteredQuestions.length > 0 ? (
              filteredQuestions.map((question, index) => (
                <QuestionCard key={question.id} question={question} index={index} />
              ))
            ) : (
              <EmptyState
                icon={FileText}
                title="No Questions Match Filter"
                description={
                  questions.length === 0
                    ? 'No questions extracted yet. Click "Extract with AI" or add questions manually.'
                    : 'Try clearing your search query or adjusting marks filter.'
                }
              />
            )}
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar */}
      {currentQuestionBank && questions.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md p-3.5">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--success)]" />
              <div>
                <p className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                  {totalQuestions} Questions Approved · {totalMarks} Total Marks
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Ready to synthesize grounded exam answers from linked notes
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsGenerateConfirmOpen(true)}
              disabled={isGeneratingAnswers}
              className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--primary)] px-5 py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all disabled:opacity-50 shadow-sm"
            >
              <Workflow className={`h-4 w-4 stroke-[1.5] ${isGeneratingAnswers ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAnswers ? 'Generating Answers...' : 'Generate Solution Manuscript'}</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2]" />
            </button>
          </div>
        </div>
      )}

      {/* Re-extract Confirmation Modal */}
      {currentQuestionBank && (
        <ConfirmationModal
          isOpen={isReExtractConfirmOpen}
          title="Re-extract Question Bank?"
          message={`Existing extracted questions for "${currentQuestionBank.name}" will be replaced with fresh AI extraction. Any custom question modifications will be lost.`}
          confirmText="Yes, Re-extract Questions"
          cancelText="Cancel"
          confirmVariant="warning"
          iconType="sparkles"
          onConfirm={() => {
            setIsReExtractConfirmOpen(false);
            extractQuestions(currentQuestionBank.id);
          }}
          onCancel={() => setIsReExtractConfirmOpen(false)}
        />
      )}

      {/* Generate Solutions Confirmation Modal */}
      {currentQuestionBank && (
        <ConfirmationModal
          isOpen={isGenerateConfirmOpen}
          title="Generate Solution Manuscript?"
          message={`AcademicStack will retrieve grounded notes from Qdrant, draft complete examination answers for all ${totalQuestions} questions (${totalMarks} marks total), and run an Academic AI Review pass with LaTeX math verification.`}
          confirmText="Start Solution Generation"
          cancelText="Cancel"
          confirmVariant="primary"
          iconType="ai"
          onConfirm={() => {
            setIsGenerateConfirmOpen(false);
            generateAnswers(currentQuestionBank.id);
          }}
          onCancel={() => setIsGenerateConfirmOpen(false)}
        />
      )}

      {/* Live AI Progress Modal (Extraction & Generation) */}
      <AiProgressModal
        isOpen={Object.values(extractingQBs).some(Boolean)}
        type="extraction"
        title="AI Question Extraction in Progress"
        subtitle="AcademicStack is scanning exam paper layout, parsing questions, and resolving marks with AI router."
      />

      <AiProgressModal
        isOpen={isGeneratingAnswers}
        type="generation"
        title="Generating Solution Manuscript"
        subtitle={`Synthesizing solutions for ${totalQuestions} questions with vector retrieval, multi-provider drafting, and Academic Review pass.`}
      />

      {/* Add Question Modal */}
      {currentQuestionBank && (
        <AddQuestionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          questionBankId={currentQuestionBank.id}
        />
      )}
    </div>
  );
};
