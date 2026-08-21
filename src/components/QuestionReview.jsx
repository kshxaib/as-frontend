import React, { useEffect, useState } from 'react';
import {
  FileText,
  Sparkles,
  Plus,
  ArrowRight,
  RefreshCw,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Layers,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { QuestionCard } from './QuestionCard';
import { AddQuestionModal } from './AddQuestionModal';

export const QuestionReview = () => {
  const {
    questionBanks,
    currentQuestionBank,
    questions,
    isLoading,
    isExtracting,
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
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Feedback Alert Banners */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={clearFeedback} className="text-xs text-rose-400 hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={clearFeedback} className="text-xs text-emerald-400 hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Top Control Bar: Question Bank Selection & Actions */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <Layers className="h-4 w-4" />
              Phase 5 Workspace
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Question Review & Marks Tuning
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Review extracted questions, adjust marks, and approve before triggering RAG answer generation.
            </p>
          </div>

          {/* Question Bank Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {questionBanks.length > 0 && (
              <div className="relative">
                <select
                  value={currentQuestionBank?.id || ''}
                  onChange={(e) => selectQuestionBank(Number(e.target.value))}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {questionBanks.map((qb) => (
                    <option key={qb.id} value={qb.id}>
                      {qb.name} ({qb.subject})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* AI Extract / Re-extract Button */}
            {currentQuestionBank && (
              <button
                onClick={() => extractQuestions(currentQuestionBank.id)}
                disabled={isExtracting}
                className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-50"
              >
                <Sparkles className={`h-4 w-4 text-indigo-400 ${isExtracting ? 'animate-spin' : ''}`} />
                {isExtracting
                  ? 'Extracting with OpenAI...'
                  : currentQuestionBank.status === 'extracted'
                  ? 'Re-extract Questions'
                  : 'Extract Questions (AI)'}
              </button>
            )}

            {/* Add Manual Question Button */}
            {currentQuestionBank && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </button>
            )}
          </div>
        </div>

        {/* Current Question Bank Details & Stats Dashboard */}
        {currentQuestionBank ? (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Questions Stat */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Questions</span>
                <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white">{totalQuestions}</p>
              <p className="mt-1 text-xs text-slate-400">Questions in this bank</p>
            </div>

            {/* Total Marks Stat */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Marks</span>
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                  <BarChart3 className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-400">{totalMarks}</p>
              <p className="mt-1 text-xs text-slate-400">Sum of all question weights</p>
            </div>

            {/* Marks Breakdown Stat */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Marks Source</span>
                <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs font-medium">
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-400 border border-emerald-500/20" title="Explicit from paper">
                  {explicitCount} Explicit
                </span>
                <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-amber-400 border border-amber-500/20" title="Estimated by AI">
                  {aiEstimatedCount} AI
                </span>
                <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-indigo-400 border border-indigo-500/20" title="Modified by user">
                  {userModifiedCount} Modified
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400">Verification distribution</p>
            </div>

            {/* Status & Linked Resources */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Linked Resources</span>
                <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 uppercase">
                  {currentQuestionBank.status}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-200">
                Subject: {currentQuestionBank.subject}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Resource IDs: {currentQuestionBank.resource_ids || 'None linked'}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-12 text-center py-16 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
            <FileText className="mx-auto h-12 w-12 text-slate-600" />
            <h3 className="mt-4 text-base font-semibold text-slate-300">No Question Bank Selected</h3>
            <p className="mt-1 text-xs text-slate-500">
              Upload a question bank PDF via API or select one to begin reviewing questions.
            </p>
          </div>
        )}

        {/* Filter and Search Bar */}
        {currentQuestionBank && questions.length > 0 && (
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions by keyword..."
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-400 mr-1">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filter Marks:
              </span>
              {['ALL', 2, 5, 10].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedMarkFilter(filter)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    selectedMarkFilter === filter
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {filter === 'ALL' ? 'All' : `${filter}M`}
                </button>
              ))}

              <div className="h-4 w-px bg-slate-800 mx-1" />

              <select
                value={selectedSourceFilter}
                onChange={(e) => setSelectedSourceFilter(e.target.value)}
                className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none"
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
              <div className="py-16 text-center text-slate-400">
                <RefreshCw className="mx-auto h-8 w-8 animate-spin text-indigo-500 mb-2" />
                <p className="text-xs">Loading question bank data...</p>
              </div>
            ) : filteredQuestions.length > 0 ? (
              filteredQuestions.map((question, index) => (
                <QuestionCard key={question.id} question={question} index={index} />
              ))
            ) : (
              <div className="py-16 text-center rounded-2xl border border-slate-800/80 bg-slate-900/40">
                <p className="text-sm font-semibold text-slate-300">
                  {questions.length === 0
                    ? 'No questions extracted yet. Click "Extract Questions (AI)" or add questions manually.'
                    : 'No questions match your current search / filter.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar (Proceed to Phase 6) */}
      {currentQuestionBank && questions.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-800 bg-slate-950/90 backdrop-blur-md p-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  {totalQuestions} Questions Approved ({totalMarks} Total Marks)
                </p>
                <p className="text-[11px] text-slate-400">
                  Ready for Phase 6 RAG Answer Generation using linked resources
                </p>
              </div>
            </div>

            <button
              onClick={() => generateAnswers(currentQuestionBank.id)}
              disabled={isGeneratingAnswers}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Sparkles className={`h-4 w-4 ${isGeneratingAnswers ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAnswers ? 'Generating Answers...' : 'Approve & Generate Answers'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

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
