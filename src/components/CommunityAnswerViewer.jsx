import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  BookOpen,
  CheckCircle2,
  LoaderCircle,
  ArrowLeft,
  FolderPlus,
  Sparkles,
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
    downloadCheatsheetPdf,
    cloneCommunityAnswerSetToWorkspace,
    isCloningCommunityAnswerSet,
    copiedAnswerSetIds,
  } = useQuestionBankStore();

  const [isDownloadingSolved, setIsDownloadingSolved] = useState(false);
  const [isDownloadingCheatsheet, setIsDownloadingCheatsheet] = useState(false);
  const [copySuccessMessage, setCopySuccessMessage] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeCommunityViewer();
      }
    };
    if (communityViewerOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [communityViewerOpen, closeCommunityViewer]);

  if (!communityViewerOpen) return null;

  const meta = communityViewerMeta || {};
  const answers = communityViewerAnswers || [];
  const totalMarks = answers.reduce((sum, a) => sum + (Number(a.marks) || 0), 0);
  const isCopied = Boolean(meta.answer_set_id && copiedAnswerSetIds?.has(meta.answer_set_id));

  const handleDownloadSolved = async () => {
    if (!meta.answer_set_id || isDownloadingSolved) return;
    setIsDownloadingSolved(true);
    try {
      const filename = `AcademicStack_${(meta.subject || 'Subject').replace(/\s+/g, '_')}_${(meta.question_bank_name || 'Solved_QB').replace(/\s+/g, '_')}.pdf`;
      await downloadSolvedPdf(meta.answer_set_id, filename);
    } finally {
      setIsDownloadingSolved(false);
    }
  };

  const handleDownloadCheatsheet = async () => {
    if (!meta.answer_set_id || isDownloadingCheatsheet) return;
    setIsDownloadingCheatsheet(true);
    try {
      const filename = `Cheatsheet_${(meta.subject || 'Subject').replace(/\s+/g, '_')}_${(meta.question_bank_name || 'Exam').replace(/\s+/g, '_')}.pdf`;
      await downloadCheatsheetPdf(meta.answer_set_id, filename);
    } finally {
      setIsDownloadingCheatsheet(false);
    }
  };

  const handleClone = async () => {
    if (!meta.answer_set_id || isCopied || isCloningCommunityAnswerSet) return;
    const res = await cloneCommunityAnswerSetToWorkspace(meta.answer_set_id);
    if (res?.success) {
      setCopySuccessMessage(`"${meta.question_bank_name}" solved paper has been copied to your workspace.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F8F7F4] text-[#19243B] font-sans animate-in fade-in duration-150 overflow-hidden">
      <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#E2E0D9] bg-white shrink-0 z-10">
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            type="button"
            onClick={closeCommunityViewer}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E0D9] bg-[#F8F7F4] px-3 py-1.5 text-xs font-semibold text-[#19243B] hover:bg-[#EAE8E3] transition-all shrink-0 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 stroke-[2]" />
            <span className="hidden sm:inline">Back to Community</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="h-5 w-px bg-[#E2E0D9] hidden sm:block" />

          <div className="min-w-0 flex items-center gap-2">
            <span className="text-xs font-semibold text-[#0057FF] bg-[#EAF0FF] px-2.5 py-0.5 rounded-md border border-[#C8D8FF] shrink-0">
              {meta.subject || 'Solved Paper'}
            </span>
            <h1 className="text-base sm:text-lg font-bold text-[#19243B] tracking-tight truncate">
              {meta.question_bank_name || 'Solved Examination Manuscript'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleClone}
            disabled={isCloningCommunityAnswerSet || isCopied}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
              isCopied
                ? 'border border-[#A6F4C5] bg-[#EAF5EF] text-[#187347] cursor-default'
                : 'border border-[#C6CAD3] bg-white text-[#19243B] hover:bg-[#F1F0EC] disabled:opacity-50'
            }`}
            title={isCopied ? 'Already copied to your workspace' : 'Clone this Solved Question Bank to your workspace'}
          >
            {isCloningCommunityAnswerSet ? (
              <LoaderCircle className="size-3.5 animate-spin text-[#0057FF]" />
            ) : isCopied ? (
              <CheckCircle2 className="size-3.5 text-[#187347]" />
            ) : (
              <FolderPlus className="size-3.5 text-[#187347]" />
            )}
            <span>{isCloningCommunityAnswerSet ? 'Adding...' : isCopied ? 'Copied' : 'Add to workspace'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCheatsheet}
            disabled={isDownloadingCheatsheet}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#C6CAD3] bg-white px-3.5 py-2 text-xs font-semibold text-[#19243B] hover:bg-[#F1F0EC] transition-all shadow-2xs cursor-pointer disabled:opacity-60"
            title="Download quick revision bullet points & formula cheatsheet"
          >
            {isDownloadingCheatsheet ? (
              <LoaderCircle className="size-3.5 animate-spin text-[#0057FF]" />
            ) : (
              <Sparkles className="size-3.5 text-[#C8A820]" />
            )}
            <span>{isDownloadingCheatsheet ? 'Building...' : 'Cheatsheet PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadSolved}
            disabled={isDownloadingSolved}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0057FF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0047D6] transition-all shadow-xs cursor-pointer disabled:opacity-60"
          >
            {isDownloadingSolved ? (
              <LoaderCircle className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5 stroke-[2]" />
            )}
            <span>{isDownloadingSolved ? 'Generating PDF...' : 'Download Solved PDF'}</span>
          </button>

          <button
            type="button"
            onClick={closeCommunityViewer}
            className="rounded-xl border border-[#E2E0D9] bg-[#F8F7F4] p-2 text-[#687184] hover:bg-[#EAE8E3] hover:text-[#19243B] transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 bg-[#F8F7F4]">
        <div className="mx-auto max-w-4xl space-y-8">
          {copySuccessMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>{copySuccessMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setCopySuccessMessage('')}
                className="text-emerald-700 hover:text-emerald-900 font-medium text-xs cursor-pointer underline"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E0D9] shadow-xs text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#19243B] tracking-tight">
              {meta.question_bank_name}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#687184]">
              <span>Subject: <strong className="text-[#19243B]">{meta.subject}</strong></span>
              {meta.author_name && (
                <>
                  <span>•</span>
                  <span>Curated by <strong className="text-[#0057FF]">{meta.author_name}</strong></span>
                </>
              )}
            </div>

            <div className="inline-flex items-center gap-3 rounded-full border border-[#C8D8FF] bg-[#EAF0FF] px-4 py-1.5 text-xs text-[#0057FF] font-medium mx-auto">
              <span>{meta.completed_questions || answers.length} Questions Solved</span>
              <span>•</span>
              <span>{totalMarks} Total Marks</span>
            </div>
          </div>

          {isLoadingCommunityViewer ? (
            <div className="py-32 text-center text-[#687184]">
              <LoaderCircle className="size-8 animate-spin text-[#0057FF] mb-3 mx-auto" />
              <p className="text-sm font-medium">Opening solved answers from The Commons...</p>
            </div>
          ) : answers.length > 0 ? (
            <div className="space-y-8">
              {answers.map((ans, idx) => (
                <div
                  key={ans.id || idx}
                  id={`community-q-${ans.id}`}
                  className="scroll-mt-6"
                >
                  <AnswerCard
                    answer={ans}
                    index={idx}
                    readOnly={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-[#687184] rounded-2xl border border-dashed border-[#E2E0D9] bg-white">
              <BookOpen className="size-10 text-[#C6CAD3] mb-3 mx-auto" />
              <p className="text-lg font-bold text-[#19243B]">No answers found</p>
            </div>
          )}

          {answers.length > 0 && (
            <div className="pt-8 pb-16 text-center border-t border-[#E2E0D9]">
              <p className="text-sm text-[#687184] italic">
                — End of Solved Examination Manuscript —
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default CommunityAnswerViewer;
