import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BookOpen, CheckCircle, AlertCircle, RefreshCw, ChevronDown, ChevronUp, Sparkles, ExternalLink } from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';

export const AnswerCard = ({ answer, index }) => {
  const { retryAnswer } = useQuestionBankStore();
  const [isRetrying, setIsRetrying] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await retryAnswer(answer.id);
    setIsRetrying(false);
  };

  const sources = answer.sources || [];

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-md transition-all duration-200 hover:border-slate-700">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-800 bg-slate-950/60 p-5">
        <div className="flex items-start gap-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-xs font-bold text-white shadow-md shadow-indigo-500/20">
            Q{answer.question_number || index + 1}
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-100 leading-snug">
              {answer.question_text}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-md bg-indigo-500/10 px-2.5 py-0.5 font-semibold text-indigo-300 border border-indigo-500/20">
                {answer.marks} Marks
              </span>
              {answer.status === 'completed' && (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Generated via RAG
                </span>
              )}
              {answer.status === 'failed' && (
                <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Generation Failed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-50"
            title="Regenerate this answer"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-indigo-400 ${isRetrying ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Regenerate</span>
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-xl border border-slate-800 bg-slate-950 p-1.5 text-slate-400 hover:text-slate-200"
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Answer Content */}
      {!isCollapsed && (
        <div className="p-6">
          {answer.status === 'failed' ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
              <p className="font-semibold">Failed to generate answer:</p>
              <p className="mt-1">{answer.error_message || 'Unknown error occurred.'}</p>
              <button
                onClick={handleRetry}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
              >
                <RefreshCw className="h-3 w-3" /> Retry Question
              </button>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none prose-p:text-sm prose-p:leading-relaxed prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-indigo-200 prose-code:text-amber-300 prose-code:bg-slate-950 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-li:text-sm prose-li:text-slate-300">
              <ReactMarkdown>{answer.content || '_No answer generated yet._'}</ReactMarkdown>
            </div>
          )}

          {/* Source Citations Section */}
          {sources.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                Verified Study Material Sources ({sources.length})
              </div>
              <div className="flex flex-wrap gap-2.5">
                {sources.map((src, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-3 py-1.5 text-xs text-slate-300"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/20 text-[10px] font-bold text-indigo-400">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-indigo-200">{src.resource_name}</span>
                    <span className="text-slate-400 font-medium">
                      Page {src.page}
                      {src.chapter && src.chapter !== 'General' ? ` • ${src.chapter}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
