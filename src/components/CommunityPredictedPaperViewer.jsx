import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Download,
  ShieldCheck,
  Sparkles,
  Calendar,
  Eye,
  Copy,
  Check,
  FolderPlus,
  LoaderCircle,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';

const formatSectionHeader = (secName, secInst, marksSummary) => {
  const rawName = (secName || '').trim();
  const rawInst = (secInst || marksSummary || '').trim();

  const match = rawName.match(/^(Q\s*\.?\s*\d+|Question\s*\d+|Section\s*[A-Z0-9]+)(?:[:\.\-—\s]+(.*))?$/i);
  let cleanedName = rawName;
  let nameExtra = '';
  if (match) {
    cleanedName = match[1].trim();
    nameExtra = (match[2] || '').trim();
  }

  let cleanedInst = rawInst.replace(/\[\d+\s*marks?\]/gi, '').trim();

  if (!cleanedInst && nameExtra) {
    cleanedInst = nameExtra.replace(/\[\d+\s*marks?\]/gi, '').trim();
  } else if (cleanedInst && nameExtra) {
    const lowerExtra = nameExtra.toLowerCase();
    const lowerInst = cleanedInst.toLowerCase();
    if (
      lowerExtra.includes(lowerInst) ||
      lowerInst.includes(lowerExtra) ||
      (lowerExtra.includes('any') && lowerInst.includes('any')) ||
      (lowerExtra.includes('answer') && lowerInst.includes('answer')) ||
      (lowerExtra.includes('solve') && lowerInst.includes('solve')) ||
      (lowerExtra.includes('short note') && lowerInst.includes('short note'))
    ) {
      cleanedInst = cleanedInst.length >= nameExtra.length ? cleanedInst : nameExtra;
    }
  }

  cleanedInst = cleanedInst.replace(/^[:\-—\s]+|[:\-—\s]+$/g, '').trim();

  return {
    sectionName: cleanedName,
    sectionInstruction: cleanedInst,
  };
};

export const CommunityPredictedPaperViewer = () => {
  const {
    communityPredictedViewerOpen,
    communityPredictedViewerPaper,
    isLoadingCommunityPredictedViewer,
    closeCommunityPredictedViewer,
    downloadPredictedPaperPdf,
    cloneCommunityPredictedPaperToWorkspace,
    isCloningCommunityPredictedPaper,
    copiedPredictedPaperIds,
  } = useQuestionBankStore();

  const [copied, setCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [copySuccessMessage, setCopySuccessMessage] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeCommunityPredictedViewer();
      }
    };
    if (communityPredictedViewerOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [communityPredictedViewerOpen, closeCommunityPredictedViewer]);

  if (!communityPredictedViewerOpen) return null;

  const paper = communityPredictedViewerPaper || {};
  const paperData = paper.paper_data || {};
  const examMeta = paperData.exam_meta || {};
  const sections = paperData.sections || [];
  const questions = paperData.predicted_questions || [];
  const isCopied = Boolean(paper?.id && copiedPredictedPaperIds?.has(paper.id));
  const insights =
    typeof paperData.pattern_insights === 'object' && paperData.pattern_insights !== null
      ? paperData.pattern_insights
      : typeof paperData.pattern_insights === 'string'
      ? { analysis_summary: paperData.pattern_insights }
      : {};

  const handleDownload = async () => {
    if (!paperData || isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      const filename = `Predicted_${(paper.subject || 'Exam').replace(/\s+/g, '_')}_Paper.pdf`;
      await downloadPredictedPaperPdf(paperData, filename);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleClone = async () => {
    if (!paper?.id || isCopied || isCloningCommunityPredictedPaper) return;
    const res = await cloneCommunityPredictedPaperToWorkspace(paper.id);
    if (res?.success) {
      setCopySuccessMessage(`"${paper.title || 'Practice Paper'}" has been copied to your Question Papers.`);
    }
  };

  const handleCopyText = () => {
    try {
      let text = `ACADEMICSTACK\n`;
      text += `${examMeta.paper_title || paper.title || 'Practice Examination Paper'}\n`;
      text += `Subject: ${examMeta.subject || paper.subject}\n`;
      text += `Time Allowed: ${examMeta.time_allowed || '03 Hours'} | Session: ${examMeta.session || 'Model Exam'} | Max Marks: ${examMeta.maximum_marks || 80}\n\n`;
      text += `--- GENERAL INSTRUCTIONS ---\n`;
      (examMeta.general_instructions || []).forEach((inst, i) => {
        text += `${i + 1}. ${inst}\n`;
      });
      text += `\n--- PREDICTED QUESTIONS ---\n`;
      if (sections.length > 0) {
        sections.forEach((sec) => {
          text += `\n=== ${sec.section_name} ===\n`;
          if (sec.section_instruction) text += `${sec.section_instruction}\n\n`;
          (sec.questions || []).forEach((q) => {
            text += `  ${q.question_number || '•'} ${q.question_text} [${q.marks || 0} Marks]\n`;
          });
        });
      } else {
        questions.forEach((q) => {
          text += `\n${q.question_number || 'Q'} ${q.question_header || ''} [${q.total_marks || ''} Marks]\n`;
          (q.sub_questions || []).forEach((sub) => {
            text += `  ${sub.sub_label || '•'} ${sub.question_text} [${sub.marks || 0} Marks]\n`;
          });
        });
      }
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F8F7F4] text-[#19243B] font-sans animate-in fade-in duration-150 overflow-hidden">
      <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#E2E0D9] bg-white shrink-0 z-10">
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            type="button"
            onClick={closeCommunityPredictedViewer}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E0D9] bg-[#F8F7F4] px-3 py-1.5 text-xs font-semibold text-[#19243B] hover:bg-[#EAE8E3] transition-all shrink-0 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 stroke-[2]" />
            <span className="hidden sm:inline">Back to Community</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="h-5 w-px bg-[#E2E0D9] hidden sm:block" />

          <div className="min-w-0 flex items-center gap-2">
            <span className="text-xs font-semibold text-[#0057FF] bg-[#EAF0FF] px-2.5 py-0.5 rounded-md border border-[#C8D8FF] shrink-0">
              {paper.subject || 'Practice Paper'}
            </span>
            <h1 className="text-base sm:text-lg font-bold text-[#19243B] tracking-tight truncate">
              {paper.title || 'Practice Examination Paper'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#C6CAD3] bg-white px-3 py-2 text-xs font-semibold text-[#687184] hover:text-[#19243B] hover:bg-[#F1F0EC] transition-all cursor-pointer shadow-2xs"
            title="Copy plain text"
          >
            {copied ? <Check className="size-3.5 text-[#187347]" /> : <Copy className="size-3.5" />}
            <span className="hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handleClone}
            disabled={isCloningCommunityPredictedPaper || isCopied}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
              isCopied
                ? 'border border-[#A6F4C5] bg-[#EAF5EF] text-[#187347] cursor-default'
                : 'border border-[#C6CAD3] bg-white text-[#19243B] hover:bg-[#F1F0EC] disabled:opacity-50'
            }`}
            title={isCopied ? 'Already copied to your workspace' : 'Clone this paper to your workspace'}
          >
            {isCloningCommunityPredictedPaper ? (
              <LoaderCircle className="size-3.5 animate-spin text-[#0057FF]" />
            ) : isCopied ? (
              <CheckCircle2 className="size-3.5 text-[#187347]" />
            ) : (
              <FolderPlus className="size-3.5 text-[#187347]" />
            )}
            <span>{isCloningCommunityPredictedPaper ? 'Adding...' : isCopied ? 'Copied' : 'Add to workspace'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloadingPdf}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0057FF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0047D6] transition-all shadow-xs cursor-pointer disabled:opacity-60"
          >
            {isDownloadingPdf ? (
              <LoaderCircle className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5 stroke-[2]" />
            )}
            <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>

          <button
            type="button"
            onClick={closeCommunityPredictedViewer}
            className="rounded-xl border border-[#E2E0D9] bg-[#F8F7F4] p-2 text-[#687184] hover:bg-[#EAE8E3] hover:text-[#19243B] transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
        {isLoadingCommunityPredictedViewer ? (
          <div className="flex flex-col items-center justify-center py-32 text-[#687184]">
            <LoaderCircle className="size-8 animate-spin text-[#0057FF] mb-3" />
            <p className="text-sm font-medium">Loading practice paper from The Commons...</p>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-6">
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

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#526078] px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#0057FF] bg-[#EAF0FF] px-2.5 py-0.5 rounded-md border border-[#C8D8FF]">
                  {paper.subject || 'Practice Paper'}
                </span>
                <span>•</span>
                <span>Curated by <strong className="text-[#19243B]">{paper.creator_name || 'Student Scholar'}</strong></span>
              </div>
              {paper.created_at && (
                <span className="flex items-center gap-1 text-[#687184]">
                  <Calendar className="size-3.5" />
                  {new Date(paper.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>

            <div className="bg-[#F1F0EC] p-3 sm:p-6 rounded-2xl">
              <article className="shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] bg-white mx-auto p-6 sm:p-10 max-w-2xl text-[#19243B] space-y-6">
                
                <div className="border-b-2 border-[#19243B] pb-6 text-center space-y-4">
                  <span className="text-xs font-bold tracking-[0.22em] text-[#0057FF] uppercase block">
                    ACADEMICSTACK
                  </span>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#19243B] uppercase">
                      {examMeta.paper_title || paper.title || 'Practice Examination Paper'}
                    </h3>
                    <p className="text-xs font-semibold text-[#687184] mt-1">
                      Subject: <span className="text-[#19243B] font-bold">{examMeta.subject || paper.subject}</span>
                    </p>
                  </div>

                  <div className="w-full flex justify-center">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FEDF89] bg-[#FFFAEB] px-3 py-1 text-[11px] sm:text-xs font-medium text-[#B54708]">
                      <ShieldCheck className="size-3.5 shrink-0" />
                      <span>FOR PRACTICE ONLY • NOT AN OFFICIAL PAPER</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-b border-[#E2E0D9] py-2.5 text-xs text-[#687184] px-1 sm:px-4">
                    <span>Time Allowed: <b className="text-[#19243B]">{examMeta.time_allowed || '03 Hours'}</b></span>
                    <span>Session: <b className="text-[#19243B]">{examMeta.session || `Model Exam ${new Date().getFullYear()}`}</b></span>
                    <span>Maximum Marks: <b className="text-[#19243B]">{examMeta.maximum_marks || 80}</b></span>
                  </div>

                  {((examMeta.general_instructions && examMeta.general_instructions.length > 0) || true) && (
                    <div className="pt-2 text-xs text-[#526078] text-left">
                      <p className="font-bold text-[#19243B] mb-2">
                        General Instructions to Candidates:
                      </p>
                      <ol className="list-none space-y-1.5 pl-0">
                        {(examMeta.general_instructions && examMeta.general_instructions.length > 0
                          ? examMeta.general_instructions
                          : [
                              'Question No. 1 is compulsory.',
                              'Attempt any three questions out of remaining five questions.',
                              'Assume suitable data wherever necessary.',
                            ]
                        ).map((inst, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="font-semibold text-[#19243B] shrink-0">({i + 1})</span>
                            <span>{inst}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {(sections.length > 0 ? sections : []).map((section, sIdx) => {
                    const { sectionName, sectionInstruction } = formatSectionHeader(
                      section.section_name || `Q.${sIdx + 1}`,
                      section.section_instruction,
                      section.marks_summary
                    );
                    const rawInst = (section.section_instruction || section.marks_summary || '').trim();
                    const totalMarksDisplay = section.total_marks
                      ? `[${section.total_marks} Marks]`
                      : (rawInst.match(/\[\d+\s*marks?\]/i) ? rawInst.match(/\[\d+\s*marks?\]/i)[0] : '');

                    return (
                      <div key={sIdx} className={sIdx > 0 ? 'border-t-2 border-[#19243B] pt-5 mt-5' : 'mt-5'}>
                        <div className="flex justify-between items-baseline gap-3 pb-2 border-b border-[#E2E0D9]">
                          <div className="flex items-baseline gap-2.5 flex-wrap">
                            <span className="font-bold text-[#19243B] text-base">
                              {sectionName}
                            </span>
                            {sectionInstruction && (
                              <span className="text-xs sm:text-sm font-medium text-[#526078] italic">
                                {sectionInstruction}
                              </span>
                            )}
                          </div>

                          {totalMarksDisplay && (
                            <span className="text-xs font-bold text-[#19243B] shrink-0 bg-[#F1F0EC] px-2.5 py-0.5 rounded-md">
                              {totalMarksDisplay}
                            </span>
                          )}
                        </div>

                        <div className="divide-y divide-[#E2E0D9]">
                          {(section.questions || []).map((q, qIdx) => {
                            const qLabel = q.question_number || `${String.fromCharCode(97 + qIdx)}.`;
                            return (
                              <div key={qIdx} className="py-3.5 space-y-2">
                                <div className="flex justify-between items-start gap-4">
                                  <p className="font-normal text-[#19243B] text-sm flex-1 leading-relaxed">
                                    <span className="font-bold text-[#19243B] mr-2">{qLabel}</span>
                                    {q.question_text}
                                  </p>
                                  {q.marks && (
                                    <span className="font-semibold text-[#526078] text-xs shrink-0 bg-[#F8F7F4] border border-[#E2E0D9] px-2 py-0.5 rounded">
                                      [{q.marks}]
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
                                        {q.or_question_text || 'Discuss alternate system implementation details.'}
                                      </p>
                                      {q.marks && (
                                        <span className="font-semibold text-[#526078] text-xs shrink-0 bg-[#F8F7F4] border border-[#E2E0D9] px-2 py-0.5 rounded">
                                          [{q.marks}]
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-[#E2E0D9] pt-4 text-center">
                  <p className="text-[#687184] text-xs leading-5">
                    Based on patterns in the papers provided — not a guarantee of future exam questions.
                  </p>
                </div>

              </article>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloadingPdf}
                className="font-semibold rounded-xl bg-[#0057FF] text-white hover:bg-[#0047D6] px-5 h-11 text-xs sm:text-sm inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-60"
              >
                {isDownloadingPdf ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Download className="size-4" />
                )}
                <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
              </button>

              <button
                type="button"
                onClick={handleClone}
                disabled={isCloningCommunityPredictedPaper || isCopied}
                className={`font-semibold rounded-xl px-5 h-11 text-xs sm:text-sm inline-flex items-center gap-2 transition-colors cursor-pointer shadow-2xs ${
                  isCopied
                    ? 'border border-[#A6F4C5] bg-[#EAF5EF] text-[#187347] cursor-default'
                    : 'border border-[#C6CAD3] bg-white text-[#19243B] hover:bg-[#F1F0EC] disabled:opacity-50'
                }`}
              >
                {isCloningCommunityPredictedPaper ? (
                  <LoaderCircle className="size-4 animate-spin text-[#0057FF]" />
                ) : isCopied ? (
                  <CheckCircle2 className="size-4 text-[#187347]" />
                ) : (
                  <FolderPlus className="size-4 text-[#187347]" />
                )}
                <span>{isCloningCommunityPredictedPaper ? 'Adding...' : isCopied ? 'Copied to Workspace' : 'Add to workspace'}</span>
              </button>

              <button
                type="button"
                onClick={closeCommunityPredictedViewer}
                className="font-semibold rounded-xl border border-[#C6CAD3] bg-white text-[#526078] hover:text-[#19243B] hover:bg-[#F1F0EC] px-4 h-11 text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                Back to Community
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPredictedPaperViewer;
