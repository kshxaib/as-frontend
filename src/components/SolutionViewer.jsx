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
  Zap,
  Workflow,
  Eye,
  EyeOff,
  RotateCcw,
  Target,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { usePracticeStore } from '../store/usePracticeStore';
import { AnswerCard } from './AnswerCard';
import { ConfirmationModal } from './ConfirmationModal';
import { AiProgressModal } from './AiProgressModal';
import { EmptyState } from './ui/EmptyState';

export const SolutionViewer = () => {
  const {
    questionBanks,
    currentQuestionBank,
    currentAnswerSet,
    answerSetsList,
    isGeneratingAnswers,
    isLoading,
    fetchQuestionBanks,
    selectQuestionBank,
    generateAnswers,
    downloadSolvedPdf,
    downloadCheatsheetPdf,
    toggleAnswerSetShare,
    shareUpdatedAnswerSet,
    setActiveTab,
    error,
    successMessage,
    clearFeedback,
  } = useQuestionBankStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showHighYieldOnly, setShowHighYieldOnly] = useState(false);
  const [selectedMarkFilter, setSelectedMarkFilter] = useState('ALL');
  const [isExamHallMode, setIsExamHallMode] = useState(false);
  const [isRegenerateConfirmOpen, setIsRegenerateConfirmOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Active Recall practice store
  const {
    isTestMode,
    toggleTestMode,
    practiceFilter,
    setPracticeFilter,
    masteryMap,
    revealAll,
    hideAll,
    resetBankMastery,
  } = usePracticeStore();

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

  const masteredCount = answers.filter((a) => masteryMap[a.id] === 'mastered').length;
  const needPracticeCount = answers.filter((a) => masteryMap[a.id] === 'need_practice').length;
  const untestedCount = Math.max(0, answers.length - masteredCount - needPracticeCount);
  const readinessPercent = answers.length > 0 ? Math.round((masteredCount / answers.length) * 100) : 0;

  const filteredAnswers = answers.filter((a) => {
    const matchesSearch =
      a.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.content && a.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesHighYield = showHighYieldOnly ? (a.repeat_count > 1) : true;
    const matchesMarks = selectedMarkFilter === 'ALL' || Number(a.marks) === Number(selectedMarkFilter);

    // Filter by mastery status in Self-Test Mode
    let matchesPractice = true;
    if (isTestMode && practiceFilter !== 'ALL') {
      const status = masteryMap[a.id];
      if (practiceFilter === 'MASTERED') matchesPractice = status === 'mastered';
      else if (practiceFilter === 'NEED_PRACTICE') matchesPractice = status === 'need_practice';
      else if (practiceFilter === 'UNTESTED') matchesPractice = !status;
    }

    return matchesSearch && matchesHighYield && matchesMarks && matchesPractice;
  });

  const isShared = currentAnswerSet?.visibility === 'community';

  // A previously-shared version of this bank exists, but the current (regenerated)
  // set is not the shared one — offer to push the update into that Hub entry.
  const sharedSibling = (answerSetsList || []).find(
    (a) => a.visibility === 'community' && a.id !== currentAnswerSet?.id
  );

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

                    {/* Export 2-Page Cheatsheet Button */}
                    <button
                      onClick={() =>
                        downloadCheatsheetPdf(
                          currentAnswerSet.id,
                          `AcademicStack_${(currentQuestionBank?.subject || 'Subject').replace(/\s+/g, '_')}_${(currentQuestionBank?.name || 'QB').replace(/\s+/g, '_')}_Cheatsheet.pdf`
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-[8px] border border-amber-500/35 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-all shadow-sm cursor-pointer"
                      title="Export dense 2-column formula, diagram & definition cheatsheet (4x-5x more compact than full PDF)"
                    >
                      <Download className="h-3.5 w-3.5 stroke-[2]" />
                      <span>Export Cheatsheet (Compact)</span>
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

                    {/* Share Updated Answer Set — updates the existing Hub entry in place (no duplicate) */}
                    {!isShared && sharedSibling && (
                      <button
                        onClick={() => shareUpdatedAnswerSet(currentAnswerSet.id)}
                        className="inline-flex items-center gap-2 rounded-[8px] border border-[rgba(200,168,32,0.3)] bg-[rgba(200,168,32,0.1)] px-3 py-1.5 text-xs font-medium text-[var(--community)] hover:opacity-90 transition-all"
                        title="Replace the version already shared in The Commons with this regenerated set (no duplicate)"
                      >
                        <RefreshCw className="h-3.5 w-3.5 stroke-[1.5]" />
                        <span>Share Updated Answer Set</span>
                      </button>
                    )}
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

        {/* ── Search + Filter Bar ── */}
        {answers.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2 rounded-[10px] border border-[var(--border)] bg-[var(--surface-well)] p-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search solutions by concept, keyword, or equation..."
                className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--surface)] py-1.5 pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>

            <div className="h-4 w-px bg-[var(--border)]" />

            {['ALL', 2, 5, 10].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedMarkFilter(f)}
                className={`rounded-[4px] px-2 py-0.5 font-mono text-[11px] font-medium transition-all ${
                  selectedMarkFilter === f
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-xs'
                    : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {f === 'ALL' ? 'All' : `${f}M`}
              </button>
            ))}

            <div className="h-4 w-px bg-[var(--border)]" />

            <button
              onClick={() => setShowHighYieldOnly(!showHighYieldOnly)}
              className={`shrink-0 h-8 px-3 rounded-[6px] border font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                showHighYieldOnly
                  ? 'border-orange-500/50 bg-orange-500/10 text-orange-500'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]'
              }`}
            >
              🔥 High-Yield Only
            </button>

            <button
              onClick={() => setIsExamHallMode(!isExamHallMode)}
              className={`shrink-0 h-8 px-3 rounded-[6px] border font-mono text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                isExamHallMode
                  ? 'border-amber-500/50 bg-amber-500/15 text-amber-400 font-semibold shadow-xs'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-amber-400'
              }`}
              title="Toggle 2-Minute Quick Recall Mode across all answers"
            >
              <Zap className={`h-3 w-3 ${isExamHallMode ? 'fill-amber-400 text-amber-400' : 'text-amber-400'}`} />
              <span>⚡ Exam-Hall Mode</span>
            </button>

            <button
              onClick={toggleTestMode}
              className={`shrink-0 h-8 px-3 rounded-[6px] border font-mono text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                isTestMode
                  ? 'border-indigo-500/50 bg-indigo-500/15 text-indigo-400 font-semibold shadow-xs'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-indigo-400'
              }`}
              title="Toggle Active Recall Self-Test Mode (conceal solutions until tested)"
            >
              <EyeOff className={`h-3.5 w-3.5 ${isTestMode ? 'text-indigo-400' : 'text-[var(--text-muted)]'}`} />
              <span>🎯 Self-Test Mode</span>
            </button>

            <span className="font-mono text-[11px] text-[var(--text-muted)] ml-auto hidden sm:inline shrink-0">
              Showing {filteredAnswers.length} of {answers.length} Solutions
            </span>
          </div>
        )}

        {/* ── Active Recall Scorecard Banner (when Self-Test Mode is active) ── */}
        {isTestMode && answers.length > 0 && (
          <div className="mt-6 rounded-[12px] border border-indigo-500/30 bg-gradient-to-r from-indigo-500/[0.08] via-indigo-500/[0.03] to-transparent p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              
              {/* Title & Readiness Progress */}
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                  <Target className="h-5 w-5 stroke-[1.8]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-base font-normal text-[var(--text-primary)]">
                      Active Recall · Blind Rehearsal
                    </h3>
                    <span className="font-mono text-[10px] font-semibold text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded-[4px] border border-indigo-500/30">
                      {readinessPercent}% Exam Ready
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                    Solutions are concealed. Recall or write steps on paper, then reveal and rate your mastery.
                  </p>
                </div>
              </div>

              {/* Quick Action Buttons (Reveal All, Hide All, Reset) */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => revealAll(answers.map((a) => a.id))}
                  className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                  title="Reveal all solutions at once"
                >
                  <Eye className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>Reveal All</span>
                </button>

                <button
                  onClick={() => hideAll(answers.map((a) => a.id))}
                  className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                  title="Hide all solutions"
                >
                  <EyeOff className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>Hide All</span>
                </button>

                {(masteredCount > 0 || needPracticeCount > 0) && (
                  <button
                    onClick={() => setIsResetConfirmOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-[6px] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.06)] px-2.5 py-1.5 font-mono text-xs text-[var(--error)] hover:bg-[rgba(239,68,68,0.12)] transition-all cursor-pointer"
                    title="Reset practice ratings for this question bank"
                  >
                    <RotateCcw className="h-3 w-3 stroke-[1.5]" />
                    <span>Reset Stats</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mastery Filter Tabs Strip */}
            <div className="mt-4 pt-3 border-t border-indigo-500/20 flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="text-[11px] text-[var(--text-muted)] mr-1">Filter By Mastery:</span>
              {[
                { id: 'ALL', label: 'All Questions', count: answers.length, badge: 'border-[var(--border)] bg-[var(--surface-well)] text-[var(--text-secondary)]' },
                { id: 'NEED_PRACTICE', label: 'Need Practice', count: needPracticeCount, badge: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
                { id: 'UNTESTED', label: 'Untested', count: untestedCount, badge: 'text-[var(--text-muted)] bg-[var(--surface)] border-[var(--border)]' },
                { id: 'MASTERED', label: 'Mastered', count: masteredCount, badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
              ].map((tab) => {
                const isSelected = practiceFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setPracticeFilter(tab.id)}
                    className={`flex items-center gap-1.5 rounded-[6px] px-3 py-1 text-xs transition-all cursor-pointer border ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 font-semibold shadow-xs'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-[4px] text-[10px] font-bold border ${tab.badge}`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
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
              // Key on the stable question_id (copied verbatim across a private
              // fork) rather than answer.id, which changes when a shared set is
              // regenerated into a working copy. This keeps each card's instance
              // mounted so its expand/collapse state and scroll position survive.
              <AnswerCard
                key={answer.question_id ?? answer.id}
                answer={answer}
                index={index}
                globalTldrMode={isExamHallMode}
              />
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

        {/* Reset Practice Stats Confirmation Modal */}
        {currentQuestionBank && (
          <ConfirmationModal
            isOpen={isResetConfirmOpen}
            title="Reset Practice Stats?"
            message={`This will clear all "Mastered" and "Needs Practice" ratings for questions in "${currentQuestionBank.name}". You can start a fresh blind-test rehearsal.`}
            confirmText="Yes, Reset Practice Stats"
            cancelText="Cancel"
            confirmVariant="danger"
            iconType="danger"
            onConfirm={() => {
              resetBankMastery(answers.map((a) => a.id));
              setIsResetConfirmOpen(false);
            }}
            onCancel={() => setIsResetConfirmOpen(false)}
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
