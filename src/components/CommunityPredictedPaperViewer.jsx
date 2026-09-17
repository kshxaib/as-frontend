import React, { useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  ShieldCheck,
  Sparkles,
  User,
  Calendar,
  Eye,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';

export const CommunityPredictedPaperViewer = () => {
  const {
    communityPredictedViewerOpen,
    communityPredictedViewerPaper,
    isLoadingCommunityPredictedViewer,
    closeCommunityPredictedViewer,
    downloadPredictedPaperPdf,
  } = useQuestionBankStore();

  const [copied, setCopied] = React.useState(false);

  // Close on Escape key
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
  const insights = paperData.pattern_insights || {};

  const handleDownload = () => {
    if (!paperData) return;
    const filename = `Predicted_${(paper.subject || 'Exam').replace(/\s+/g, '_')}_Model_Paper.pdf`;
    downloadPredictedPaperPdf(paperData, filename);
  };

  const handleCopyText = () => {
    try {
      let text = `${examMeta.university_heading || 'ACADEMICSTACK PREDICTED EXAMINATION'}\n`;
      text += `${examMeta.paper_title || paper.title}\n`;
      text += `Course / Subject: ${examMeta.subject || paper.subject}\n`;
      text += `Time Allowed: ${examMeta.time_allowed || '3 Hours'} | Max Marks: ${examMeta.maximum_marks || 80}\n\n`;
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
            text += `  ${sub.sub_label || '•'} ${sub.question_text} [${sub.marks || 0} Marks] (${sub.probability_score || 85}% Prob)\n`;
          });
        });
      }
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--background)] text-[var(--text-primary)] animate-in fade-in duration-150 overflow-hidden">
      
      {/* ── Top Sticky Masthead / Navigation Bar ── */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[var(--border)] bg-[var(--surface)] shrink-0 z-10">
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            onClick={closeCommunityPredictedViewer}
            className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] px-3 py-1.5 font-mono text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-all shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5 stroke-[1.5]" />
            <span className="hidden sm:inline">Back to The Commons</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="h-5 w-px bg-[var(--border-subtle)] hidden sm:block" />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--community)] bg-[rgba(200,168,32,0.1)] px-2 py-0.5 rounded-[4px] border border-[rgba(200,168,32,0.25)] font-semibold shrink-0">
                {paper.subject || 'Predicted Paper'}
              </span>
              <h1 className="font-display text-base sm:text-lg font-normal text-[var(--text-primary)] tracking-tight truncate">
                {paper.title || 'Predicted Model Examination Paper'}
              </h1>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] px-3 py-1.5 font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            title="Copy plain text"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-[var(--success)]" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-[6px] bg-[var(--primary)] px-3.5 py-1.5 font-mono text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-xs"
          >
            <Download className="h-3.5 w-3.5 stroke-[2]" />
            <span>Download Model PDF</span>
          </button>
        </div>
      </header>

      {/* ── Scrollable Body Canvas ── */}
      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
        {isLoadingCommunityPredictedViewer ? (
          <div className="flex flex-col items-center justify-center py-32 text-[var(--text-muted)]">
            <RefreshCw className="h-8 w-8 animate-spin text-[var(--primary)] mb-3 stroke-[1.5]" />
            <p className="font-mono text-sm">Opening full predicted examination paper from The Commons...</p>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-6">

            {/* ── Creator Highlight Banner ── */}
            <div className="rounded-[12px] border border-[var(--primary)]/40 bg-gradient-to-r from-[rgba(15,118,110,0.14)] via-[rgba(15,118,110,0.06)] to-transparent p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-lg shadow-sm shrink-0 uppercase">
                    {(paper.creator_name || 'S')[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[var(--primary)] bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--primary)]/30">
                        The Commons • Shared Paper
                      </span>
                      {paper.views !== undefined && (
                        <span className="font-mono text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {paper.views} view{paper.views === 1 ? '' : 's'}
                        </span>
                      )}
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mt-1">
                      🎓 Predicted & Shared by <span className="text-[var(--primary)] underline decoration-[var(--primary)]/40 underline-offset-2 font-black">{paper.creator_name || 'Student Scholar'}</span>
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      Synthesized examination paper for <b>{paper.subject}</b> • Shared for collaborative student preparation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                  {paper.created_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(paper.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── AI Pattern Insights Card (if available) ── */}
            {insights.analysis_summary && (
              <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-well)] p-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--primary)] flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Blueprint Synthesis Highlights
                </span>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {insights.analysis_summary}
                </p>

                {insights.recurring_topics && insights.recurring_topics.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-mono text-[var(--text-muted)] mr-1">Recurring Themes:</span>
                    {insights.recurring_topics.map((topic, i) => (
                      <span
                        key={i}
                        className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-mono text-[var(--text-secondary)]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Realistic University Examination Paper Canvas ── */}
            <div className="rounded-[12px] border border-[var(--border-strong)] bg-[var(--surface)] p-8 sm:p-12 shadow-md">
              
              {/* University Exam Masthead */}
              <div className="text-center pb-6 border-b-2 border-[var(--text-primary)]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--primary)] block mb-1">
                  {examMeta.university_heading || 'ACADEMICSTACK PREDICTED MODEL EXAMINATION'}
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] uppercase">
                  {examMeta.paper_title || paper.title || 'Predicted Examination Paper'}
                </h2>
                <p className="font-mono text-xs font-semibold text-[var(--text-secondary)] mt-1">
                  Course / Subject: <span className="text-[var(--text-primary)]">{examMeta.subject || paper.subject}</span>
                </p>

                {/* Disclaimer Badge */}
                <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                  <span>Strictly for Preparation & Practice • Not an Official Examination Paper</span>
                </div>

                {/* Exam Meta Strip */}
                <div className="mt-4 flex items-center justify-between border-t border-b border-[var(--border)] py-2 text-xs font-mono text-[var(--text-secondary)]">
                  <span>Time Allowed: <b>{examMeta.time_allowed || '3 Hours'}</b></span>
                  <span>Session: <b>Model Exam {new Date().getFullYear()}</b></span>
                  <span>Maximum Marks: <b>{examMeta.maximum_marks || 80}</b></span>
                </div>
              </div>

              {/* Instructions Box */}
              {examMeta.general_instructions && examMeta.general_instructions.length > 0 && (
                <div className="mt-4 rounded-[6px] border border-[var(--border-subtle)] bg-[var(--surface-well)] p-3 text-[11px] text-[var(--text-muted)] italic">
                  <p className="font-bold font-sans not-italic text-[var(--text-secondary)] mb-1">
                    General Instructions to Candidates:
                  </p>
                  <ol className="list-decimal pl-4 space-y-0.5">
                    {examMeta.general_instructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Questions Stream */}
              {sections.length > 0 ? (
                <div className="mt-8 space-y-8">
                  {sections.map((sec, secIdx) => (
                    <div key={secIdx} className="space-y-4">
                      {/* Section Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-[var(--border-strong)] pb-1.5">
                        <h3 className="font-display text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                          {sec.section_name}
                        </h3>
                        {sec.section_instruction && (
                          <span className="font-mono text-[11px] text-[var(--primary)] font-medium">
                            {sec.section_instruction}
                          </span>
                        )}
                      </div>

                      {/* Questions List */}
                      <div className="divide-y divide-[var(--border-subtle)]">
                        {(sec.questions || []).map((q, qIdx) => {
                          if (q.is_or_choice) {
                            return (
                              <div key={qIdx} className="py-2.5 text-center font-bold font-mono text-xs text-[var(--text-muted)] tracking-wider">
                                — OR —
                              </div>
                            );
                          }

                          return (
                            <div key={qIdx} className="py-3 flex items-start justify-between gap-4 group">
                              <div className="flex items-start gap-3">
                                <span className="font-mono font-bold text-xs text-[var(--primary)] shrink-0 mt-0.5">
                                  {q.question_label || q.question_number || `${qIdx + 1}.`}
                                </span>
                                <div className="text-xs text-[var(--text-primary)] leading-relaxed font-serif">
                                  <span>{q.question_text}</span>

                                  {q.probability_score && (
                                    <span className="ml-2 inline-flex items-center gap-1 rounded-[4px] bg-[rgba(15,118,110,0.1)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--primary)] border border-[rgba(15,118,110,0.25)] align-middle">
                                      <Sparkles className="h-2.5 w-2.5" />
                                      {q.probability_score}% Prob
                                    </span>
                                  )}

                                  {/* Sub-questions if nested */}
                                  {q.sub_questions && q.sub_questions.length > 0 && (
                                    <div className="mt-3 space-y-2.5 pl-3 border-l-2 border-[var(--border-subtle)]">
                                      {q.sub_questions.map((sub, sIdx) => (
                                        <div key={sIdx} className="flex items-start justify-between gap-2 text-xs">
                                          <div className="flex items-start gap-2">
                                            <span className="font-mono font-semibold text-[var(--text-secondary)]">
                                              {sub.sub_label || `${String.fromCharCode(97 + sIdx)}.`}
                                            </span>
                                            <span>{sub.question_text}</span>
                                          </div>
                                          {sub.marks && (
                                            <span className="font-mono text-[11px] font-bold text-[var(--text-secondary)] shrink-0">
                                              [{sub.marks}]
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {q.marks && (
                                <div className="shrink-0 text-right">
                                  <span className="font-mono text-xs font-bold text-[var(--text-secondary)] bg-[var(--surface-well)] px-2 py-0.5 rounded-[4px] border border-[var(--border-subtle)]">
                                    [{q.marks}]
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-8 space-y-8 divide-y divide-[var(--border-subtle)]">
                  {questions.map((q, qIdx) => (
                    <div key={q.question_id || qIdx} className={qIdx > 0 ? 'pt-8' : ''}>
                      {/* Question Header */}
                      <div className="flex items-start justify-between gap-4 pb-2 border-b border-[var(--border)]">
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif font-black text-lg sm:text-xl text-[var(--text-primary)]">
                            {q.question_number || `Q.${qIdx + 1}`}
                          </span>
                          {q.question_header && (
                            <span className="text-sm font-semibold text-[var(--text-primary)] italic">
                              {q.question_header}
                            </span>
                          )}
                        </div>
                        {q.total_marks && (
                          <span className="font-mono text-xs font-bold text-[var(--text-secondary)] bg-[var(--surface-well)] px-2.5 py-1 rounded-[4px] border border-[var(--border-subtle)] shrink-0">
                            [{q.total_marks} Marks]
                          </span>
                        )}
                      </div>

                      {/* Sub Questions List */}
                      <div className="mt-4 space-y-4 pl-2 sm:pl-4">
                        {(q.sub_questions || []).map((sub, sIdx) => (
                          <div
                            key={sub.sub_id || sIdx}
                            className="group relative flex flex-col gap-2 rounded-[8px] p-3 hover:bg-[var(--surface-well)] transition-colors border border-transparent hover:border-[var(--border-subtle)]"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-2.5 min-w-0">
                                <span className="font-mono font-bold text-sm text-[var(--primary)] shrink-0 mt-0.5">
                                  {sub.sub_label || `${String.fromCharCode(97 + sIdx)}.`}
                                </span>
                                <div className="text-sm text-[var(--text-primary)] leading-relaxed font-serif">
                                  <span>{sub.question_text}</span>

                                  {/* AI Probability Badge */}
                                  {sub.probability_score && (
                                    <span className="ml-2 inline-flex items-center gap-1 rounded-[4px] bg-[rgba(15,118,110,0.1)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--primary)] border border-[rgba(15,118,110,0.25)] align-middle">
                                      <Sparkles className="h-2.5 w-2.5" />
                                      {sub.probability_score}% Prob
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Right Marks Figure */}
                              <div className="shrink-0 text-right">
                                <span className="font-mono text-xs font-black text-[var(--text-primary)]">
                                  [{sub.marks || 5}]
                                </span>
                              </div>
                            </div>

                            {/* Nested Sub-sub-questions */}
                            {sub.sub_sub_questions && sub.sub_sub_questions.length > 0 && (
                              <div className="mt-2 space-y-2 pl-6 sm:pl-8 border-l-2 border-[var(--border-subtle)] ml-4">
                                {sub.sub_sub_questions.map((ssub, ssIdx) => (
                                  <div key={ssIdx} className="flex items-start justify-between gap-3 text-xs">
                                    <div className="flex items-start gap-2">
                                      <span className="font-mono font-semibold text-[var(--text-muted)]">
                                        {ssub.label || `(${ssIdx + 1})`}
                                      </span>
                                      <span className="text-[var(--text-secondary)] font-serif">
                                        {ssub.text}
                                      </span>
                                    </div>
                                    {ssub.marks && (
                                      <span className="font-mono text-[11px] text-[var(--text-muted)] shrink-0">
                                        [{ssub.marks}]
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Pattern Correlation Note */}
                            {sub.pattern_note && (
                              <div className="pl-6 text-[10px] font-mono text-[var(--text-muted)]">
                                ↳ Reason: {sub.pattern_note}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* End of Examination Footer */}
              <div className="mt-12 text-center pt-6 border-t-2 border-[var(--text-primary)]">
                <span className="font-mono text-xs font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                  *** END OF QUESTION PAPER ***
                </span>
              </div>
            </div>

            {/* Bottom Floating Bar for PDF Download */}
            <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-well)] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-[var(--text-secondary)]">
                Need to print this exam paper for mock testing or offline revision?
              </p>
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[8px] bg-[var(--primary)] px-5 py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-xs"
              >
                <Download className="h-3.5 w-3.5 stroke-[2]" />
                <span>Download Model Paper PDF</span>
              </button>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
