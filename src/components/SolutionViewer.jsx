import React, { useState } from 'react';
import {
  FileCheck2,
  Sparkles,
  RefreshCw,
  Search,
  BookOpen,
  ArrowLeft,
  Award,
  Layers,
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
    setActiveTab,
  } = useQuestionBankStore();

  const [searchQuery, setSearchQuery] = useState('');

  if (!currentQuestionBank) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p>Please select a Question Bank first.</p>
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

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-400">
                <FileCheck2 className="h-4 w-4" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Solved Question Bank — {currentQuestionBank.name}
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Subject: <span className="font-semibold text-slate-200">{currentQuestionBank.subject}</span> • RAG Answers with citations
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => generateAnswers(currentQuestionBank.id)}
              disabled={isGeneratingAnswers}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-indigo-400 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isGeneratingAnswers ? 'animate-spin' : ''}`} />
              {isGeneratingAnswers ? 'Generating Answers...' : 'Regenerate Entire Set'}
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
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">RAG Grounding</span>
                <Sparkles className="h-4 w-4 text-cyan-400" />
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-200">Qdrant Vector Filter Active</p>
              <p className="mt-0.5 text-xs text-slate-400">Resources: {currentQuestionBank.resource_ids || 'All'}</p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        {answers.length > 0 && (
          <div className="mt-8 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search solutions and key concepts..."
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Showing {filteredAnswers.length} of {answers.length} Solutions
            </span>
          </div>
        )}

        {/* Solutions List */}
        <div className="mt-6 space-y-6">
          {isGeneratingAnswers ? (
            <div className="py-24 text-center rounded-2xl border border-dashed border-indigo-500/30 bg-indigo-500/5">
              <RefreshCw className="mx-auto h-10 w-10 animate-spin text-indigo-400 mb-3" />
              <h3 className="text-lg font-bold text-white">Generating Answers with RAG Engine...</h3>
              <p className="mt-1 text-xs text-slate-400">
                Searching Qdrant vectors for linked study materials and generating syllabus-calibrated answers via OpenAI.
              </p>
            </div>
          ) : filteredAnswers.length > 0 ? (
            filteredAnswers.map((answer, index) => (
              <AnswerCard key={answer.id} answer={answer} index={index} />
            ))
          ) : (
            <div className="py-20 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
              <BookOpen className="mx-auto h-12 w-12 text-slate-600" />
              <h3 className="mt-4 text-base font-semibold text-slate-300">No Answers Generated Yet</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                Review your questions in Phase 5 and click "Generate Answers" to run the RAG pipeline.
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
