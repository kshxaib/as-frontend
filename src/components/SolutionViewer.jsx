import React, { useEffect, useState, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import {
  BookOpen,
  ChevronDown,
  Download,
  FileText,
  Copy,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  CircleAlert,
  ArrowUpRight,
  Workflow,
  Share2,
  Zap,
  LoaderCircle,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { useAuthStore } from '../store/useAuthStore';
import { AnswerCard, extractQuickRecall } from './AnswerCard';
import { ConfirmationModal } from './ConfirmationModal';
import { AiProgressModal } from './AiProgressModal';
import { EmptyState } from './ui/EmptyState';
import { ApiKeyBanner } from './ui/ApiKeyBanner';

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
    triggerKeyModal,
  } = useQuestionBankStore();

  const { user } = useAuthStore();

  const [studyMode, setStudyMode] = useState('read');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isRegenerateConfirmOpen, setIsRegenerateConfirmOpen] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isDownloadingSolved, setIsDownloadingSolved] = useState(false);
  const [isDownloadingCheatsheet, setIsDownloadingCheatsheet] = useState(false);

  const exportMenuRef = useRef(null);

  const handleDownloadSolved = async () => {
    if (!currentAnswerSet || isDownloadingSolved) return;
    setIsDownloadingSolved(true);
    try {
      await downloadSolvedPdf(
        currentAnswerSet.id,
        `AcademicStack_${(currentQuestionBank?.subject || 'Subject').replace(/\s+/g, '_')}_${(currentQuestionBank?.name || 'QB').replace(/\s+/g, '_')}_Solved.pdf`
      );
    } finally {
      setIsDownloadingSolved(false);
    }
  };

  const handleDownloadCheatsheet = async () => {
    if (!currentAnswerSet || isDownloadingCheatsheet) return;
    setIsDownloadingCheatsheet(true);
    try {
      await downloadCheatsheetPdf(
        currentAnswerSet.id,
        `AcademicStack_${(currentQuestionBank?.subject || 'Subject').replace(/\s+/g, '_')}_${(currentQuestionBank?.name || 'QB').replace(/\s+/g, '_')}_Cheatsheet.pdf`
      );
    } finally {
      setIsDownloadingCheatsheet(false);
    }
  };

  useEffect(() => {
    fetchQuestionBanks();
  }, [fetchQuestionBanks]);

  useEffect(() => {
    if (questionBanks.length > 0 && !currentQuestionBank) {
      selectQuestionBank(questionBanks[0].id);
    }
  }, [questionBanks, currentQuestionBank, selectQuestionBank]);

  const currentBankId = currentQuestionBank?.id;
  const currentAnswerSetBankId = currentAnswerSet?.question_bank_id;
  useEffect(() => {
    if (currentBankId && (!currentAnswerSetBankId || currentAnswerSetBankId !== currentBankId)) {
      selectQuestionBank(currentBankId);
    }
  }, [currentBankId, currentAnswerSetBankId, selectQuestionBank]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(clearFeedback, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, clearFeedback]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setIsExportMenuOpen(false);
      }
    };
    if (isExportMenuOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [isExportMenuOpen]);

  const answers = useMemo(() => {
    return (currentAnswerSet?.answers || []).filter(Boolean);
  }, [currentAnswerSet]);

  const totalMarks = useMemo(() => {
    return answers.reduce((acc, a) => acc + (Number(a.marks) || 0), 0);
  }, [answers]);

  const filteredAnswers = useMemo(() => {
    return answers.filter((a) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        a.question_text?.toLowerCase().includes(q) ||
        (a.content && a.content.toLowerCase().includes(q))
      );
    });
  }, [answers, searchQuery]);

  const isClickingQuestionRef = useRef(false);

  useEffect(() => {
    if (studyMode !== 'read' || filteredAnswers.length === 0) return;

    const handleScroll = () => {
      if (isClickingQuestionRef.current) return;
      const triggerY = window.scrollY + 200;

      for (let i = filteredAnswers.length - 1; i >= 0; i--) {
        const el = document.getElementById(`q-${filteredAnswers[i].id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          if (triggerY >= top) {
            setSelectedQuestionIndex(i);
            const sideBtn = document.getElementById(`side-q-${filteredAnswers[i].id}`);
            if (sideBtn) {
              sideBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [studyMode, filteredAnswers]);

  const activeQuestion = filteredAnswers[selectedQuestionIndex] || filteredAnswers[0] || answers[0];

  const handleCopyAllAnswers = () => {
    if (answers.length === 0) return;
    const compiled = answers
      .map(
        (a, idx) =>
          `### Q${String(a.question_number || idx + 1).padStart(2, '0')} (${a.marks || 5} marks)\n**${a.question_text}**\n\n${a.content || ''}\n\n---`
      )
      .join('\n\n');
    navigator.clipboard.writeText(compiled);
    setCopiedAll(true);
    setIsExportMenuOpen(false);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleOpenFullAnswer = (index) => {
    isClickingQuestionRef.current = true;
    setSelectedQuestionIndex(index);
    setStudyMode('read');
    setTimeout(() => {
      const el = document.getElementById(`q-${answers[index]?.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setTimeout(() => {
        isClickingQuestionRef.current = false;
      }, 800);
    }, 100);
  };

  const handleTriggerGenerate = () => {
    if (!currentQuestionBank) return;
    if (!user?.has_openai_key) {
      triggerKeyModal('RAG Answer Generation & AI Review');
      return;
    }
    if (answers.length > 0) {
      setIsRegenerateConfirmOpen(true);
    } else {
      generateAnswers(currentQuestionBank.id);
    }
  };

  const isShared = currentAnswerSet?.visibility === 'community';
  const sharedSibling = (answerSetsList || []).find(
    (a) => a.visibility === 'community' && a.id !== currentAnswerSet?.id
  );

  if (!isLoading && questionBanks.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <EmptyState
          icon={BookOpen}
          title="No Question Banks Available"
          description="Upload an examination past paper in the Past papers section to extract questions and synthesize grounded solutions."
          actionText="Go to Past papers"
          onAction={() => setActiveTab('question_banks')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-150">
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="size-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <button onClick={clearFeedback} className="font-medium hover:underline text-xs cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button onClick={clearFeedback} className="font-medium hover:underline text-xs cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      <ApiKeyBanner feature="Solution Manuscript Synthesis & AI Review" />

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-1">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-2xl sm:text-3xl tracking-tight text-[#19243B]">
            Answers
          </h1>
          <p className="text-[#526078] text-sm sm:text-base mt-0.5">
            Review generated answers and their linked study sources.
          </p>
        </div>

        {questionBanks && questionBanks.length > 0 && (
          <div className="w-full sm:w-80">
            <select
              value={currentQuestionBank?.id || ''}
              onChange={(e) => selectQuestionBank(Number(e.target.value))}
              className="w-full rounded-xl bg-white border border-[#E2E0D9] px-4 h-11 text-sm font-medium text-[#19243B] focus:border-[#0057FF] focus:outline-none transition-colors shadow-2xs cursor-pointer"
            >
              {questionBanks.map((qb) => (
                <option key={qb.id} value={qb.id}>
                  {qb.name} ({qb.subject})
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      <div className="flex items-center gap-3 overflow-x-auto pb-1 text-xs">
        <span className="font-medium px-3 py-1.5 rounded-lg bg-white border border-[#E2E0D9] text-[#19243B] shadow-2xs">
          Answers: <strong className="text-[#0057FF]">{answers.length}</strong>
        </span>
        <span className="font-medium px-3 py-1.5 rounded-lg bg-white border border-[#E2E0D9] text-[#19243B] shadow-2xs">
          Total Marks: <strong className="text-[#0057FF]">{totalMarks}</strong>
        </span>
      </div>

      <div className="flex flex-col sm:flex-row mt-6 items-stretch sm:items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="text-[#687184] absolute top-3.5 left-3.5 size-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search answers, concepts, equations..."
            className="w-full rounded-xl bg-white border border-[#E2E0D9] pl-10 pr-4 h-11 text-sm text-[#19243B] placeholder-[#687184] focus:border-[#0057FF] focus:outline-none transition-colors shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap">
          <div className="rounded-xl bg-white border border-[#E2E0D9] p-1 flex items-center gap-1 shadow-2xs h-11">
            <button
              type="button"
              onClick={() => setStudyMode('read')}
              className={`font-medium rounded-lg text-xs sm:text-sm px-3.5 h-full transition-all cursor-pointer ${
                studyMode === 'read'
                  ? 'bg-[#0057FF] text-white font-semibold shadow-xs'
                  : 'text-[#526078] hover:text-[#19243B] hover:bg-[#F1F0EC]'
              }`}
            >
              Read mode
            </button>
            <button
              type="button"
              onClick={() => setStudyMode('revision')}
              className={`font-medium rounded-lg text-xs sm:text-sm px-3.5 h-full transition-all cursor-pointer ${
                studyMode === 'revision'
                  ? 'bg-[#0057FF] text-white font-semibold shadow-xs'
                  : 'text-[#526078] hover:text-[#19243B] hover:bg-[#F1F0EC]'
              }`}
            >
              Quick revision
            </button>
          </div>

          {currentAnswerSet && answers.length > 0 && (
            <div className="relative" ref={exportMenuRef}>
              <button
                type="button"
                onClick={() => setIsExportMenuOpen((prev) => !prev)}
                disabled={isDownloadingSolved || isDownloadingCheatsheet}
                className="font-medium rounded-xl bg-white text-[#19243B] text-sm border border-[#E2E0D9] flex h-11 px-4 items-center justify-center gap-2 hover:bg-[#F1F0EC] transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
              >
                {isDownloadingSolved || isDownloadingCheatsheet ? (
                  <LoaderCircle className="size-4 animate-spin text-[#0057FF]" />
                ) : (
                  <Download className="size-4 text-[#0057FF]" />
                )}
                <span className="hidden sm:inline">
                  {isDownloadingSolved || isDownloadingCheatsheet ? 'Exporting...' : 'Export'}
                </span>
                <ChevronDown className="size-4 text-[#526078]" />
              </button>

              {isExportMenuOpen && (
                <div className="absolute right-0 top-12 z-30 w-56 rounded-xl border border-[#E2E0D9] bg-white p-1.5 shadow-[0px_8px_24px_rgba(25,36,59,0.1)] animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      handleDownloadSolved();
                    }}
                    disabled={isDownloadingSolved}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[#19243B] hover:bg-[#F1F0EC] transition-colors text-left font-medium cursor-pointer disabled:opacity-60"
                  >
                    {isDownloadingSolved ? (
                      <LoaderCircle className="size-4 animate-spin text-[#0057FF]" />
                    ) : (
                      <FileText className="size-4 text-[#0057FF]" />
                    )}
                    <span>{isDownloadingSolved ? 'Generating Solved PDF...' : 'Export Solved PDF'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      handleDownloadCheatsheet();
                    }}
                    disabled={isDownloadingCheatsheet}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[#19243B] hover:bg-[#F1F0EC] transition-colors text-left font-medium cursor-pointer disabled:opacity-60"
                  >
                    {isDownloadingCheatsheet ? (
                      <LoaderCircle className="size-4 animate-spin text-[#0057FF]" />
                    ) : (
                      <Zap className="size-4 text-[#0057FF]" />
                    )}
                    <span>{isDownloadingCheatsheet ? 'Generating Cheatsheet...' : 'Export Cheatsheet PDF'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyAllAnswers}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[#19243B] hover:bg-[#F1F0EC] transition-colors text-left font-medium cursor-pointer"
                  >
                    <Copy className="size-4 text-[#526078]" />
                    <span>{copiedAll ? 'Copied all answers!' : 'Copy all answers'}</span>
                  </button>

                  <div className="border-t border-[#E2E0D9] my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      toggleAnswerSetShare(currentAnswerSet.id);
                    }}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[#19243B] hover:bg-[#F1F0EC] transition-colors text-left font-medium cursor-pointer"
                  >
                    <Share2 className="size-4 text-[#C8A820]" />
                    <span>{isShared ? 'Shared with The Commons' : 'Share with Community'}</span>
                  </button>

                  {!isShared && sharedSibling && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsExportMenuOpen(false);
                        shareUpdatedAnswerSet(currentAnswerSet.id);
                      }}
                      className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[#C8A820] hover:bg-amber-50 transition-colors text-left font-medium cursor-pointer"
                    >
                      <RefreshCw className="size-4 text-[#C8A820]" />
                      <span>Share Updated Set</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {currentQuestionBank && (
            <button
              type="button"
              onClick={handleTriggerGenerate}
              disabled={isGeneratingAnswers}
              className="font-semibold rounded-xl bg-[#0057FF] hover:bg-[#0047D4] text-white text-sm flex h-11 px-5 items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex-1 sm:flex-initial"
            >
              <Workflow className={`size-4 ${isGeneratingAnswers ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAnswers ? 'Synthesizing...' : answers.length > 0 ? 'Regenerate all' : 'Generate Solutions (AI)'}</span>
            </button>
          )}
        </div>
      </div>

      {studyMode === 'read' && (
        <div className="grid grid-cols-1 lg:grid-cols-[160px_minmax(0,1fr)] gap-6 items-start">
          <aside className="hidden lg:block sticky top-24 rounded-2xl bg-white border border-[#E2E0D9] p-3 shadow-[0px_1px_3px_rgba(0,0,0,0.04)]">
            <p className="font-semibold uppercase text-[#526078] text-[10px] tracking-wider mb-2 px-1">
              Questions ({filteredAnswers.length})
            </p>
            <div className="space-y-1 max-h-[75vh] overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5">
              {filteredAnswers.map((ans, idx) => {
                const qNum = String(ans.question_number || idx + 1).padStart(2, '0');
                const isSelected = activeQuestion?.id === ans.id;
                const isFailed = ans.status === 'failed';

                return (
                  <button
                    key={ans.id}
                    id={`side-q-${ans.id}`}
                    type="button"
                    onClick={() => {
                      isClickingQuestionRef.current = true;
                      setSelectedQuestionIndex(idx);
                      const el = document.getElementById(`q-${ans.id}`);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                      setTimeout(() => {
                        isClickingQuestionRef.current = false;
                      }, 800);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-[#0057FF] text-white font-semibold shadow-xs'
                        : isFailed
                        ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                        : 'text-[#526078] hover:bg-[#F1F0EC] hover:text-[#19243B]'
                    }`}
                  >
                    <span className="font-mono flex items-center gap-1.5">
                      {isFailed && (
                        <CircleAlert className={`size-3.5 ${isSelected ? 'text-white' : 'text-red-600'}`} />
                      )}
                      <span>Q{qNum}</span>
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-[#526078]'}`}>
                      {ans.marks || 5}M
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="space-y-6 min-w-0">
            {isLoading ? (
              <div className="py-20 text-center rounded-2xl bg-white border border-[#E2E0D9] text-[#526078] shadow-xs">
                <RefreshCw className="mx-auto size-6 animate-spin text-[#0057FF] mb-2" />
                <p className="text-xs font-medium">Loading solutions...</p>
              </div>
            ) : filteredAnswers.length > 0 ? (
              filteredAnswers.map((answer, index) => (
                <AnswerCard
                  key={answer.question_id ?? answer.id}
                  id={`q-${answer.id}`}
                  answer={answer}
                  index={index}
                  hasPrev={index > 0}
                  hasNext={index < filteredAnswers.length - 1}
                  onNavigatePrev={() => {
                    isClickingQuestionRef.current = true;
                    setSelectedQuestionIndex(index - 1);
                    const prevEl = document.getElementById(`q-${filteredAnswers[index - 1]?.id}`);
                    if (prevEl) prevEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    const sideBtn = document.getElementById(`side-q-${filteredAnswers[index - 1]?.id}`);
                    if (sideBtn) sideBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    setTimeout(() => { isClickingQuestionRef.current = false; }, 800);
                  }}
                  onNavigateNext={() => {
                    isClickingQuestionRef.current = true;
                    setSelectedQuestionIndex(index + 1);
                    const nextEl = document.getElementById(`q-${filteredAnswers[index + 1]?.id}`);
                    if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    const sideBtn = document.getElementById(`side-q-${filteredAnswers[index + 1]?.id}`);
                    if (sideBtn) sideBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    setTimeout(() => { isClickingQuestionRef.current = false; }, 800);
                  }}
                />
              ))
            ) : answers.length === 0 ? (
              <div className="rounded-2xl bg-white border border-[#E2E0D9] p-8 sm:p-12 text-center shadow-xs">
                <EmptyState
                  icon={Sparkles}
                  title="No Solutions Generated Yet"
                  description="Synthesize syllabus-grounded, step-by-step examination solutions directly from your lecture notes and reference textbooks."
                  actionText={isGeneratingAnswers ? "Generating Solutions..." : "Generate Solutions (AI)"}
                  onAction={handleTriggerGenerate}
                  actionVariant="primary"
                />
              </div>
            ) : (
              <div className="rounded-2xl bg-white border border-[#E2E0D9] p-8 sm:p-12 text-center shadow-xs">
                <EmptyState
                  icon={BookOpen}
                  title="No Answers Found"
                  description="Try searching with different terms or keywords."
                  actionText="Clear Search"
                  onAction={() => setSearchQuery('')}
                  actionVariant="secondary"
                />
              </div>
            )}
          </main>
        </div>
      )}

      {studyMode === 'revision' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAnswers.map((ans, idx) => {
              const qNum = String(ans.question_number || idx + 1).padStart(2, '0');
              const quickPoints = extractQuickRecall(ans.content, ans.question_text) || [];

              return (
                <div
                  key={ans.id}
                  className="rounded-2xl bg-white border border-[#E2E0D9] p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between gap-4 transition-all hover:shadow-[0px_4px_12px_rgba(25,36,59,0.06)]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-[#0057FF] text-sm bg-[#0057FF]/10 px-2 py-0.5 rounded-md">
                          Q{qNum}
                        </span>
                        <span className="font-medium rounded-full bg-[#F8F7F4] border border-[#E2E0D9] text-[#526078] text-xs px-2.5 py-0.5">
                          {ans.marks || 5} marks
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenFullAnswer(idx)}
                        className="font-medium rounded-lg text-xs text-[#0057FF] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Full answer</span>
                        <ArrowUpRight className="size-3.5" />
                      </button>
                    </div>

                    <h4 className="font-semibold text-sm sm:text-base text-[#19243B] leading-snug">
                      {ans.question_text}
                    </h4>

                    <div className="rounded-xl bg-[#F0F5FF]/60 border border-[#D0E1FD]/80 p-3.5 space-y-2 text-xs sm:text-sm text-[#24355A] leading-relaxed">
                      {quickPoints.length > 0 ? (
                        quickPoints.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2">
                            <span className="size-1.5 rounded-full bg-[#0057FF] mt-2 shrink-0" />
                            <div className="flex-1">
                              <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {pt}
                              </ReactMarkdown>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-start gap-2">
                          <span className="size-1.5 rounded-full bg-[#0057FF] mt-2 shrink-0" />
                          <div className="flex-1">
                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                              {ans.content?.slice(0, 180) + '...'}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
            if (!user?.has_openai_key) {
              setIsRegenerateConfirmOpen(false);
              triggerKeyModal('RAG Answer Generation & AI Review');
              return;
            }
            setIsRegenerateConfirmOpen(false);
            generateAnswers(currentQuestionBank.id);
          }}
          onCancel={() => setIsRegenerateConfirmOpen(false)}
        />
      )}

      <AiProgressModal
        isOpen={isGeneratingAnswers}
        type="generation"
        title="Creating your answers"
        itemName={currentQuestionBank?.name}
        subjectName={currentQuestionBank?.subject}
      />
    </div>
  );
};

export default SolutionViewer;
