import React, { useState } from 'react';
import {
  FileCheck2,
  Sparkles,
  RefreshCw,
  Search,
  BookOpen,
  ArrowLeft,
  Award,
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { AnswerCard } from './AnswerCard';

export const SolutionViewer = () => {
  const {
    currentQuestionBank,
    currentAnswerSet,
    isGeneratingAnswers,
    generateAnswers,
    downloadSolvedPdf,
    toggleAnswerSetShare,
    setActiveTab,
    error,
    successMessage,
    clearFeedback,
  } = useQuestionBankStore();

  const [searchQuery, setSearchQuery] = useState('');

  if (!currentQuestionBank) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p>Please select a Question Bank from the Question Banks or Review tab.</p>
        <button
          onClick={() => setActiveTab('question_banks')}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
        >
          Go to Question Banks
        </button>
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
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Feedback Alert Banners */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={clearFeedback} className="text-xs text-rose-400 hover:underline">Dismiss</button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={clearFeedback} className="text-xs text-emerald-400 hover:underline">Dismiss</button>
          </div>
        )}

        {/* Header Controls */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between pb-8 border-b border-slate-800">
          <div>
            <button
              onClick={() => setActiveTab('review')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Question Review
            </button>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <FileCheck2 className="h-4 w-4" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Solved Solutions — {currentQuestionBank.name}
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Subject: <span className="font-semibold text-slate-200">{currentQuestionBank.subject}</span> • RAG Answers & Phase 7 AI Academic Review
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {currentAnswerSet && (
              <>
                {/* Download PDF Button (Phase 8) */}
                <button
                  onClick={() => downloadSolvedPdf(currentAnswerSet.id)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Solved PDF</span>
                </button>

                {/* Share to Community (Phase 11) */}
                <button
                  onClick={() => toggleAnswerSetShare(currentAnswerSet.id)}
                  className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    isShared
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Share2 className="h-4 w-4" />
                  <span>{isShared ? 'Shared in Community' : 'Share with Community'}</span>
                </button>
              </>
            )}

            <button
              onClick={() => generateAnswers(currentQuestionBank.id)}
              disabled={isGeneratingAnswers}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isGeneratingAnswers ? 'animate-spin' : ''}`} />
              {isGeneratingAnswers ? 'Generating...' : 'Regenerate Answers'}
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        {answers.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Solved Questions</span>
                <FileCheck2 className="h-4 w-4 text-emerald-400" />
              </div>
              <p className="mt-2 text-3xl font-bold text-white">
                {completedCount} <span className="text-lg font-normal text-slate-500">/ {answers.length}</span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Solved Marks</span>
                <Award className="h-4 w-4 text-indigo-400" />
              </div>
              <p className="mt-2 text-3xl font-bold text-indigo-300">{totalMarksSolved} Marks</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">RAG Grounding & AI Review</span>
                <Sparkles className="h-4 w-4 text-cyan-400" />
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-200">Phase 7 AI Reviewer Active</p>
              <p className="mt-0.5 text-xs text-slate-400">Grounded in: {currentQuestionBank.resource_ids || 'All Indexed Resources'}</p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        {answers.length > 0 && (
          <div className="mt-8 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search solutions and key concepts..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline mr-2">
              Showing {filteredAnswers.length} of {answers.length} Solutions
            </span>
          </div>
        )}

        {/* Solutions List */}
        <div className="mt-6 space-y-6">
          {isGeneratingAnswers ? (
            <div className="py-24 text-center rounded-3xl border border-dashed border-indigo-500/30 bg-indigo-500/5">
              <RefreshCw className="mx-auto h-10 w-10 animate-spin text-indigo-400 mb-3" />
              <h3 className="text-lg font-bold text-white">Generating & Reviewing Answers with OpenAI...</h3>
              <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
                Retrieving vector contexts from Qdrant, drafting syllabus-calibrated answers, and passing through Phase 7 Senior AI Academic Review.
              </p>
            </div>
          ) : filteredAnswers.length > 0 ? (
            filteredAnswers.map((answer, index) => (
              <AnswerCard key={answer.id} answer={answer} index={index} />
            ))
          ) : (
            <div className="py-20 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/40">
              <BookOpen className="mx-auto h-12 w-12 text-slate-600" />
              <h3 className="mt-4 text-base font-semibold text-slate-300">No Answers Generated Yet</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                Review your questions in the Review tab and click "Generate Answers" to run the RAG pipeline.
              </p>
              <button
                onClick={() => generateAnswers(currentQuestionBank.id)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500"
              >
                <Sparkles className="h-4 w-4" />
                Generate Answers Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
