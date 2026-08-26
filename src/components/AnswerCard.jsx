import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { BookOpen, CheckCircle2, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { ConfirmationModal } from './ConfirmationModal';
import { StatusBadge } from './ui/StatusBadge';

// ─── LaTeX & Markdown Preprocessor ──────────────────────────────────────────
function formatMarkdownMath(content) {
  if (!content) return '';

  // 1. Strip accidental rubric/evaluation leakage
  let cleaned = content.replace(/(?:^|\n)(?:Mark Allocation|Grading Rubric|Scoring Breakdown|Reviewer Assessment):\s*[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi, '\n');

  // 1b. Strip a trailing self-referential meta paragraph that describes the answer
  //     itself (e.g. "This answer is concise, uses plain English, and follows the
  //     2-mark requirement..."). Only the FINAL paragraph is considered so long
  //     answers are never truncated. Backup so already-saved answers are cleaned.
  cleaned = cleaned.replace(
    /\n\s*\n\s*(?:This answer|This response|This solution|This explanation|The above answer|The answer above|The response above)\b(?:(?!\n\s*\n)[\s\S])*?(?:concise|plain English|simple English|bullet|mark requirement|marks requirement|jargon|explains? them simply|explains? it simply|brief introduction|as requested|as required|proportional to the marks?|easy to (?:understand|memori[sz]e))(?:(?!\n\s*\n)[\s\S])*\s*$/i,
    ''
  );

  // 2. Protect code blocks / ASCII diagrams from regex alterations
  const parts = cleaned.split(/(```[\s\S]*?```)/g);

  const processed = parts.map((part) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      // Return code block / diagram 100% unaltered
      return part;
    }

    let text = part;

    // Fix isolated single dollars on their own lines: $\n\n[formula]\n\n$ -> $$\n[formula]\n$$
    text = text.replace(/(?:^|\n)\s*\$\s*\n+([\s\S]*?)\n+\s*\$\s*(?=\n|$)/g, (match, formula) => {
      return `\n\n$$\n${formula.trim()}\n$$\n\n`;
    });

    // Convert standard bracketed display math \[ ... \] to $$ ... $$
    text = text.replace(/\\\[([\s\S]*?)\\\]/g, (match, formula) => `\n\n$$\n${formula.trim()}\n$$\n\n`);

    // Convert \( ... \) to $ ... $ (inline)
    text = text.replace(/\\\(([\s\S]*?)\\\)/g, (match, formula) => `$${formula.replace(/\s+/g, ' ').trim()}$`);

    // Convert bracketed LaTeX environments like [ \mu... ], [ \begin{cases}... ] to $$ ... $$
    text = text.replace(/\[\s*(\\mu|\\max|\\min|\\begin\{cases\}|\\neg|\\text|\\sum|\\frac|\\int|\\lim|\\sigma|\\alpha|\\beta|\\gamma|\\delta|\\theta)([\s\S]*?)\]/g, 
      (match, prefix, rest) => `\n\n$$\n${prefix}${rest.trim()}\n$$\n\n`
    );

    // Fix any broken inline math split across multiple newlines: $\n A \n$ -> $A$
    text = text.replace(/\$([^$\n]+)\$/g, (match, inner) => `$${inner.trim()}$`);

    // Clean up excessive consecutive blank lines (limit to max 2 newlines = 1 blank line)
    text = text.replace(/\n{3,}/g, '\n\n');

    // Ensure clean spacing before subquestions / numbered topics
    text = text.replace(/([^\n])\n(\d+\.\s+[A-Za-z])/g, '$1\n\n$2');
    text = text.replace(/([^\n])\n(###?\s+)/g, '$1\n\n$2');

    return text;
  });

  return processed.join('').trim();
}

export const AnswerCard = React.memo(function AnswerCard({ answer, index, readOnly = false }) {
  // Subscribe only to the retryAnswer action (a stable reference) so this card
  // does NOT re-render when unrelated store slices change (success banner,
  // other answers' retry flags, or the currentAnswerSet swap for other cards).
  const retryAnswer = useQuestionBankStore((s) => s.retryAnswer);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRetryConfirmOpen, setIsRetryConfirmOpen] = useState(false);
  const [retryInstruction, setRetryInstruction] = useState('');
  const [referenceAnswer, setReferenceAnswer] = useState('');

  const handleRetry = async () => {
    if (readOnly) return;
    setIsRetryConfirmOpen(false);
    setIsRetrying(true);
    await retryAnswer(answer.id, retryInstruction, referenceAnswer);
    setRetryInstruction('');
    setReferenceAnswer('');
    setIsRetrying(false);
  };

  const sources = answer.sources || [];

  const formattedContent = useMemo(() => {
    return formatMarkdownMath(answer.content);
  }, [answer.content]);

  const formattedQNum = String(answer.question_number || index + 1).padStart(2, '0');

  return (
    <>
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] transition-all">
        
        {/* Manuscript Entry Header */}
        <div className="flex items-start justify-between gap-4 p-5 border-b border-[var(--border-subtle)] bg-[var(--surface-well)]">
          <div className="flex items-start gap-3.5 min-w-0">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-[var(--border-subtle)] bg-[var(--surface)] font-mono text-xs font-semibold text-[var(--primary)] mt-0.5">
              Q{formattedQNum}
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-base font-normal text-[var(--text-primary)] leading-snug">
                {answer.question_text}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[11px]">
                <span className="bg-[var(--surface)] px-2 py-0.5 rounded-[4px] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-medium">
                  {answer.marks} Marks
                </span>
                {answer.status === 'completed' && (
                  <StatusBadge variant="success" icon={CheckCircle2}>
                    Grounded Solution
                  </StatusBadge>
                )}
                {answer.status === 'failed' && (
                  <StatusBadge variant="error" icon={AlertCircle}>
                    Generation Failed
                  </StatusBadge>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {!readOnly && (
              <button
                onClick={() => setIsRetryConfirmOpen(true)}
                disabled={isRetrying}
                className="flex items-center gap-1 rounded-[6px] border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.08)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--ai)] hover:bg-[rgba(245,158,11,0.15)] transition-all disabled:opacity-40"
                title="Regenerate this answer"
              >
                <RefreshCw className={`h-3 w-3 stroke-[1.5] ${isRetrying ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Regenerate</span>
              </button>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              title={isCollapsed ? 'Expand Answer' : 'Collapse Answer'}
            >
              {isCollapsed ? <ChevronDown className="h-3.5 w-3.5 stroke-[1.5]" /> : <ChevronUp className="h-3.5 w-3.5 stroke-[1.5]" />}
            </button>
          </div>
        </div>


        {/* Answer Content */}
        {!isCollapsed && (
          <div className="p-6">
            {answer.status === 'failed' ? (
              <div className="rounded-[8px] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] p-4 text-xs text-[var(--error)]">
                <p className="font-semibold">Failed to generate answer:</p>
                <p className="mt-1">{answer.error_message || 'Multi-provider failover exhausted without completing answer.'}</p>
                <button
                  onClick={handleRetry}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-[6px] bg-[var(--error)] px-3 py-1.5 text-xs font-semibold text-[var(--error-foreground)] hover:opacity-90"
                >
                  <RefreshCw className="h-3 w-3 stroke-[1.5]" /> Retry Solution
                </button>
              </div>
            ) : (
              <div className="markdown-answer-body">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {formattedContent || '_No answer generated yet._'}
                </ReactMarkdown>
              </div>
            )}

            {/* Source Citations Section */}
            {sources.length > 0 && (
              <div className="mt-8 pt-5 border-t border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[var(--community)] mb-3">
                  <BookOpen className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>Verified Study Citations ({sources.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sources.map((src, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-[6px] border border-[rgba(200,168,32,0.25)] bg-[rgba(200,168,32,0.05)] px-2.5 py-1 font-mono text-[11px] text-[var(--text-secondary)]"
                    >
                      <span className="flex h-4 w-4 items-center justify-center rounded-[3px] bg-[rgba(200,168,32,0.15)] text-[9px] font-bold text-[var(--community)]">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-[var(--text-primary)]">{src.resource_name}</span>
                      <span className="text-[var(--text-muted)]">
                        Page {src.page}
                        {src.chapter && src.chapter !== 'General' ? ` · ${src.chapter}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Retry / Regenerate Confirmation Modal */}
      <ConfirmationModal
        isOpen={isRetryConfirmOpen}
        title={`Regenerate Solution for Q${formattedQNum}?`}
        message={`AcademicStack will perform a fresh vector query on your study notes and generate a new verified answer with AI review.`}
        confirmText="Yes, Regenerate Answer"
        cancelText="Cancel"
        confirmVariant="primary"
        iconType="ai"
        withInput
        inputValue={retryInstruction}
        onInputChange={setRetryInstruction}
        inputLabel="Add your own instructions (optional)"
        inputPlaceholder="e.g. make it shorter, add a diagram, focus on real-world examples..."
        withSecondInput
        secondInputValue={referenceAnswer}
        onSecondInputChange={setReferenceAnswer}
        secondInputLabel="Reference answer (optional)"
        secondInputPlaceholder="Paste an answer to steer regeneration. To keep it word-for-word, type 'use this answer exactly' in the instructions above."
        onConfirm={handleRetry}
        onCancel={() => {
          setRetryInstruction('');
          setReferenceAnswer('');
          setIsRetryConfirmOpen(false);
        }}
      />
    </>
  );
});
