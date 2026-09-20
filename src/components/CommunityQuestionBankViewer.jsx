import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Award,
  Calendar,
  FolderPlus,
  LoaderCircle,
  FileText,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';

const formatQuestionDisplay = (rawText, fallbackNum) => {
  if (!rawText) return { label: `${fallbackNum}.`, body: '' };
  const trimmed = rawText.trim();
  const match = trimmed.match(/^\[?(Q\s*\.?\s*\d+\s*[a-z]?\.?|\d+\s*[a-z]?\.)\]?\s*([\s\S]*)$/i);
  if (match) {
    let label = match[1].replace(/[\[\]]/g, '').trim();
    if (!label.endsWith('.')) label += '.';
    return {
      label,
      body: match[2].trim(),
    };
  }
  return {
    label: `${fallbackNum}.`,
    body: trimmed,
  };
};

export const CommunityQuestionBankViewer = () => {
  const {
    communityQBViewerOpen,
    communityQBViewerData,
    isLoadingCommunityQBViewer,
    isCloningCommunityQB,
    closeCommunityQBViewer,
    cloneQuestionBankToWorkspace,
    downloadQuestionBankFile,
    copiedQbIds,
  } = useQuestionBankStore();

  const [copySuccessMessage, setCopySuccessMessage] = useState('');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  if (!communityQBViewerOpen) return null;

  const qb = communityQBViewerData?.question_bank;
  const questions = communityQBViewerData?.questions || [];
  const isCopied = Boolean(qb?.id && copiedQbIds?.has(qb.id));

  const handleClone = async () => {
    if (!qb?.id || isCopied || isCloningCommunityQB) return;
    const res = await cloneQuestionBankToWorkspace(qb.id);
    if (res?.success) {
      setCopySuccessMessage(`"${qb.name}" has been copied to your workspace.`);
    }
  };

  const handleDownload = async () => {
    if (!qb?.id || isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      await downloadQuestionBankFile(qb.id, `${(qb.name || 'Exam_Paper').replace(/\s+/g, '_')}.pdf`);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#19243B]/60 p-4 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-[#E2E0D9] bg-white shadow-2xl overflow-hidden">
        <div className="border-b border-[#E2E0D9] bg-[#F8F7F4] px-6 py-5 flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#0057FF] bg-[#EAF0FF] px-2.5 py-0.5 rounded-md border border-[#C8D8FF]">
                {qb?.subject || 'Subject Archive'}
              </span>
              <span className="text-xs text-[#19243B] flex items-center gap-1.5 bg-white px-2.5 py-0.5 rounded-md border border-[#E2E0D9]">
                <div className="size-4 rounded-full bg-[#0057FF] text-white font-bold text-[10px] flex items-center justify-center uppercase shrink-0">
                  {(qb?.author_name || 'S')[0]}
                </div>
                Curated by <strong className="text-[#0057FF]">{qb?.author_name || 'Academic Scholar'}</strong>
              </span>
            </div>

            <h2 className="text-xl font-bold text-[#19243B] tracking-tight truncate">
              {qb?.name || 'Question Bank Examination Paper'}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#687184]">
              <span className="flex items-center gap-1.5 font-medium text-[#19243B]">
                <FileText className="size-3.5 text-[#0057FF]" />
                {questions.length} Questions
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium text-[#19243B]">
                <Award className="size-3.5 text-[#0057FF]" />
                {qb?.total_marks || 80} Total Marks
              </span>
              {qb?.created_at && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 text-[#687184]">
                    <Calendar className="size-3.5" />
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

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleClone}
              disabled={isCloningCommunityQB || isLoadingCommunityQBViewer || isCopied}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                isCopied
                  ? 'border border-[#A6F4C5] bg-[#EAF5EF] text-[#187347] cursor-default'
                  : 'bg-[#0057FF] text-white hover:bg-[#0047D6] disabled:opacity-50'
              }`}
              title={isCopied ? 'Already copied to your workspace' : 'Clone all questions into your own workspace'}
            >
              {isCloningCommunityQB ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : isCopied ? (
                <CheckCircle2 className="size-3.5 text-[#187347]" />
              ) : (
                <FolderPlus className="size-3.5 stroke-[2]" />
              )}
              <span>
                {isCloningCommunityQB
                  ? 'Adding...'
                  : isCopied
                  ? 'Copied to Workspace'
                  : 'Copy to My Workspace'}
              </span>
            </button>

            {qb?.id && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloadingPdf}
                title="Download Question Paper PDF"
                className="rounded-xl border border-[#C6CAD3] bg-white p-2 text-[#687184] hover:text-[#19243B] hover:bg-[#F1F0EC] transition-colors cursor-pointer disabled:opacity-60"
              >
                {isDownloadingPdf ? (
                  <LoaderCircle className="size-4 animate-spin text-[#0057FF]" />
                ) : (
                  <Download className="size-4 stroke-[1.5]" />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={closeCommunityQBViewer}
              className="rounded-xl border border-[#E2E0D9] bg-white p-2 text-[#687184] hover:text-[#19243B] hover:bg-[#F8F7F4] transition-colors cursor-pointer"
            >
              <X className="size-4 stroke-[2]" />
            </button>
          </div>
        </div>

        {copySuccessMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in duration-200">
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

        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-white">
          {isLoadingCommunityQBViewer ? (
            <div className="py-20 text-center">
              <LoaderCircle className="mx-auto size-7 animate-spin text-[#0057FF] mb-3" />
              <p className="text-xs text-[#687184]">
                Loading questions...
              </p>
            </div>
          ) : questions.length > 0 ? (
            <div className="divide-y divide-[#E2E0D9] border border-[#E2E0D9] rounded-2xl p-4 sm:p-6 bg-white shadow-2xs">
              {questions.map((q, idx) => {
                const { label, body } = formatQuestionDisplay(q.question_text, q.question_number || idx + 1);
                return (
                  <div key={q.id || idx} className="py-3.5 space-y-2 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start gap-4">
                      <p className="font-normal text-[#19243B] text-sm flex-1 leading-relaxed">
                        <span className="font-bold text-[#19243B] mr-2">{label}</span>
                        {body}
                      </p>
                      {q.marks && (
                        <span className="font-semibold text-[#526078] text-xs shrink-0 bg-[#F8F7F4] border border-[#E2E0D9] px-2 py-0.5 rounded">
                          [{q.marks} Marks]
                        </span>
                      )}
                    </div>

                    {q.is_or_choice && (
                      <div className="pt-1">
                        <div className="font-bold text-[#687184] text-xs tracking-widest flex items-center gap-3 my-2">
                          <div className="bg-[#E2E0D9] flex-1 h-px" />
                          OR
                          <div className="bg-[#E2E0D9] flex-1 h-px" />
                        </div>
                        <div className="flex justify-between items-start gap-4">
                          <p className="font-normal text-[#19243B] text-sm flex-1 leading-relaxed">
                            {q.or_question_text}
                          </p>
                          {q.marks && (
                            <span className="font-semibold text-[#526078] text-xs shrink-0 bg-[#F8F7F4] border border-[#E2E0D9] px-2 py-0.5 rounded">
                              [{q.marks} Marks]
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-[#687184]">
              <BookOpen className="mx-auto size-8 text-[#C6CAD3] mb-2 stroke-[1.5]" />
              <p className="font-semibold text-sm text-[#19243B]">No questions found</p>
              <p className="text-xs text-[#687184] mt-1">
                This question bank currently has no questions.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-[#E2E0D9] bg-[#F8F7F4] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#687184]">
            <span className="size-2 rounded-full bg-[#187347]" />
            <span>Ready to practice and solve in your workspace.</span>
          </div>

          <button
            type="button"
            onClick={closeCommunityQBViewer}
            className="text-xs text-[#526078] hover:text-[#19243B] font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityQuestionBankViewer;
