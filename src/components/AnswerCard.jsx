import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { BookOpen, CheckCircle2, AlertCircle, RefreshCw, ChevronDown, ChevronUp, Zap, Eye, EyeOff, Check, RotateCcw } from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { usePracticeStore } from '../store/usePracticeStore';
import { ConfirmationModal } from './ConfirmationModal';
import { MermaidDiagram } from './MermaidDiagram';
import { StatusBadge } from './ui/StatusBadge';

// ─── Quick Recall Extractor ──────────────────────────────────────────────────
function extractFirstSentence(text, maxWords = 18) {
  if (!text) return '';
  const cleaned = text.replace(/^[:—–-]\s*/, '').trim();
  const sentenceMatch = cleaned.match(/^([^.?!]+[.?!])(?:\s|$)/);
  let first = sentenceMatch ? sentenceMatch[1].trim() : cleaned;
  const words = first.split(/\s+/);
  if (words.length > maxWords) {
    first = words.slice(0, maxWords).join(' ') + '...';
  }
  return first;
}

const BLACKLIST_TERM_REGEX = /^(step\s*\d+|given|total\s*outcomes?|favorable\s*outcomes?|outcomes?|total|sample\s*space|example|calculation|dice|coin|note|figure|table|proof|solution|assume|marks?|q\d+|case\s*\d+|where|let|using\s+the\s+formula)/i;

function extractQuickRecall(rawContent, _questionText = '') {
  if (!rawContent) return null;

  // 1. Explicit Quick Recall block (from prompt or blockquote / heading)
  const explicitMatch = rawContent.match(
    /(?:^|\n)\s*(?:>\s*)?(?:\*{0,2}|#{1,4}\s*)⚡?\s*(?:2-Min\s+)?Quick\s+Recall[^\n]*\n([\s\S]*?)(?=\n\s*(?:#{1,4}\s+|[A-Z][A-Za-z0-9\s]{2,40}\n={2,}|\n(?![>*-]))|$)/i
  );

  if (explicitMatch && explicitMatch[1]) {
    const lines = explicitMatch[1]
      .split('\n')
      .map((l) => l.replace(/^>\s*/, '').trim())
      .filter((l) => l && (l.startsWith('-') || l.startsWith('*') || l.startsWith('•') || /^\d+\./.test(l)))
      .map((l) => l.replace(/^(?:[-*•]|\d+\.)\s*/, '').trim())
      .filter(Boolean);

    if (lines.length > 0) {
      return lines;
    }
  }

  // Also check standard blockquote lines matching Quick Recall
  const blockquoteLinesMatch = rawContent.match(
    />\s*\*{0,2}⚡?\s*(?:2-Min\s+)?Quick\s+Recall[^\n]*\*{0,2}\s*\n((?:>\s*[-*•\d].*\n?)+)/i
  );
  if (blockquoteLinesMatch && blockquoteLinesMatch[1]) {
    const lines = blockquoteLinesMatch[1]
      .split('\n')
      .map((l) => l.replace(/^>\s*[-*•\d.]*\s*/, '').trim())
      .filter(Boolean);
    if (lines.length > 0) return lines;
  }

  // 2. Legacy / Fallback Strategy for existing answers without explicit block
  const points = [];
  const lines = rawContent.split('\n').map((l) => l.trim()).filter(Boolean);

  // 2a. Always extract Core Definition / Core Concept from the opening paragraph or summary
  const introPara = lines.find(
    (l) =>
      !l.startsWith('#') &&
      !l.startsWith('```') &&
      !l.startsWith('>') &&
      !l.startsWith('|') &&
      !/^(?:\d+\.|\*|-)/.test(l) &&
      l.length > 30 &&
      /\b(is a|is an|is the|refers to|deals with|defined as|measures|models|describes|difference between|two ways to|captures)\b/i.test(l)
  );
  if (introPara) {
    const coreSentence = extractFirstSentence(introPara, 24);
    points.push(`**Core Concept** — ${coreSentence}`);
  }

  // 2b. Extract from Markdown Comparison Table if present (e.g. | Aspect | Fuzziness | Probability |)
  const tableRows = lines.filter((l) => l.startsWith('|') && l.endsWith('|') && !l.includes('---'));
  if (tableRows.length >= 2) {
    const headerRow = tableRows[0].split('|').map((c) => c.trim()).filter(Boolean);
    const colA = headerRow[1] || 'Concept A';
    const colB = headerRow[2] || 'Concept B';

    for (let r = 1; r < tableRows.length; r++) {
      const cells = tableRows[r].split('|').map((c) => c.trim()).filter(Boolean);
      if (cells.length >= 3) {
        const aspect = cells[0].replace(/^\*\*|\*\*$/g, '').trim();
        const valA = extractFirstSentence(cells[1], 12);
        const valB = extractFirstSentence(cells[2], 12);
        if (aspect && valA && valB && !BLACKLIST_TERM_REGEX.test(aspect)) {
          points.push(`**${aspect}** — ${colA}: ${valA} | ${colB}: ${valB}`);
        }
      }
    }
  }

  // 2c. Check for lines with "Term: Explanation" or "**Term**: Explanation" or "- **Term**: Explanation"
  // (e.g. "States (S): These are...", "**Actions (A)**: These are...", "- **Probability**: Measures...")
  const termLineRegex = /^(?:[-*•]|\d+\.)?\s*(?:\*\*)?([A-Za-z0-9\s/()_–—\\]{2,35})(?:\*\*)?\s*[:—–-]\s*(.+)$/;

  for (const line of lines) {
    if (line.startsWith('#') || line.startsWith('```') || line.startsWith('|')) continue;
    const match = line.match(termLineRegex);
    if (match) {
      const term = match[1].trim().replace(/^\*\*|\*\*$/g, '');
      const rawExp = match[2].trim();
      if (!BLACKLIST_TERM_REGEX.test(term) && term.length >= 2 && rawExp.length > 5) {
        const crispExp = extractFirstSentence(rawExp);
        // Avoid adding duplicate term if already covered
        if (!points.some((p) => p.toLowerCase().includes(term.toLowerCase()))) {
          points.push(`**${term}** — ${crispExp}`);
        }
      }
    }
  }

  // 2d. Check bullet points fallback if points are still few
  if (points.length < 3) {
    const bulletMatches = rawContent.match(/^(?:[-*•]|\d+\.)\s+(.+)$/gm);
    if (bulletMatches && bulletMatches.length > 0) {
      for (const b of bulletMatches) {
        const cleanB = b.replace(/^(?:[-*•]|\d+\.)\s+/, '').trim();
        const boldLead = cleanB.match(/^\*\*([^*]+)\*\*[:—–-]?\s*(.*)$/);
        if (boldLead) {
          const term = boldLead[1].trim();
          if (!BLACKLIST_TERM_REGEX.test(term) && !points.some((p) => p.toLowerCase().includes(term.toLowerCase()))) {
            const exp = extractFirstSentence(boldLead[2]);
            points.push(`**${term}** — ${exp}`);
          }
        } else if (!BLACKLIST_TERM_REGEX.test(cleanB)) {
          points.push(extractFirstSentence(cleanB, 20));
        }
        if (points.length >= 6) break;
      }
    }
  }

  // Final guarantee: Core concept must always exist
  if (points.length === 0) {
    const firstPara = lines.find((l) => !l.startsWith('#') && !l.startsWith('```') && !l.startsWith('>') && l.length > 25);
    if (firstPara) {
      points.push(`**Core Concept** — ${extractFirstSentence(firstPara, 25)}`);
    } else {
      points.push('**Core Concept** — Key academic concept reviewed and grounded in study material.');
    }
  }

  return points.slice(0, 8);
}

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

export const AnswerCard = React.memo(function AnswerCard({ answer, index, readOnly = false, globalTldrMode = false }) {
  // Subscribe only to the retryAnswer action (a stable reference) so this card
  // does NOT re-render when unrelated store slices change (success banner,
  // other answers' retry flags, or the currentAnswerSet swap for other cards).
  const retryAnswer = useQuestionBankStore((s) => s.retryAnswer);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRetryConfirmOpen, setIsRetryConfirmOpen] = useState(false);
  const [retryInstruction, setRetryInstruction] = useState('');
  const [cardTab, setCardTab] = useState('full'); // 'full' | 'tldr'

  // Active Recall practice store
  const isTestMode = usePracticeStore((s) => s.isTestMode);
  const masteryStatus = usePracticeStore((s) => s.masteryMap[answer.id]);
  const isRevealed = usePracticeStore((s) => !!s.revealedMap[answer.id]);
  const revealAnswer = usePracticeStore((s) => s.revealAnswer);
  const hideAnswer = usePracticeStore((s) => s.hideAnswer);
  const setMastery = usePracticeStore((s) => s.setMastery);

  const handleRetry = async () => {
    if (readOnly) return;
    setIsRetryConfirmOpen(false);
    setIsRetrying(true);
    await retryAnswer(answer.id, retryInstruction);
    setRetryInstruction('');
    setIsRetrying(false);
  };

  const sources = answer.sources || [];

  const formattedContent = useMemo(() => {
    return formatMarkdownMath(answer.content);
  }, [answer.content]);

  const quickRecallPoints = useMemo(() => {
    return extractQuickRecall(answer.content, answer.question_text);
  }, [answer.content, answer.question_text]);

  const isTldrActive = globalTldrMode || cardTab === 'tldr';
  const formattedQNum = String(answer.question_number || index + 1).padStart(2, '0');

  const cardBorderClass = isTestMode
    ? masteryStatus === 'mastered'
      ? 'border-emerald-500/40 bg-emerald-500/[0.015] shadow-xs'
      : masteryStatus === 'need_practice'
      ? 'border-amber-500/40 bg-amber-500/[0.015] shadow-xs'
      : 'border-[var(--border)] bg-[var(--surface)]'
    : 'border-[var(--border)] bg-[var(--surface)]';

  return (
    <>
      <div className={`rounded-[12px] border ${cardBorderClass} transition-all`}>
        
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
                {answer.repeat_count > 1 && (
                  <span className="flex items-center gap-1 font-mono text-[10px] font-semibold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-[4px] border border-orange-500/20">
                    🔥 Repeated {answer.repeat_count}x
                  </span>
                )}
                {isTestMode && (
                  <>
                    {masteryStatus === 'mastered' && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-[4px] border border-emerald-500/25">
                        <Check className="h-3 w-3 stroke-[2.5]" /> Mastered
                      </span>
                    )}
                    {masteryStatus === 'need_practice' && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-[4px] border border-amber-500/25">
                        <RotateCcw className="h-3 w-3 stroke-[2]" /> Needs Practice
                      </span>
                    )}
                    {!masteryStatus && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[var(--text-muted)] bg-[var(--surface)] px-2 py-0.5 rounded-[4px] border border-[var(--border-subtle)]">
                        ⚪ Untested
                      </span>
                    )}
                  </>
                )}
                {!isTestMode && answer.status === 'completed' && (
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
            {isTestMode && answer.status === 'completed' && (
              <button
                onClick={() => (isRevealed ? hideAnswer(answer.id) : revealAnswer(answer.id))}
                className={`flex items-center gap-1 rounded-[6px] border px-2.5 py-1 font-mono text-[11px] font-medium transition-all ${
                  isRevealed
                    ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title={isRevealed ? 'Conceal solution' : 'Reveal solution'}
              >
                {isRevealed ? <EyeOff className="h-3 w-3 stroke-[1.5]" /> : <Eye className="h-3 w-3 stroke-[1.5]" />}
                <span className="hidden sm:inline">{isRevealed ? 'Hide' : 'Reveal'}</span>
              </button>
            )}

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


        {/* Sub-navigation Strip: Full Solution vs 2-Min Quick Recall */}
        {!isCollapsed && answer.status === 'completed' && (!isTestMode || isRevealed) && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] px-6 py-2.5 bg-[var(--surface-well)]/40">
            <div className="inline-flex rounded-[8px] bg-[var(--surface-well)] p-0.5 border border-[var(--border-subtle)] text-xs font-mono">
              <button
                onClick={() => setCardTab('full')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-[6px] transition-all cursor-pointer ${
                  !isTldrActive
                    ? 'bg-[var(--surface)] text-[var(--primary)] font-semibold shadow-xs border border-[var(--border-subtle)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5 stroke-[1.5]" />
                <span>Full Solution</span>
              </button>
              <button
                onClick={() => setCardTab('tldr')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-[6px] transition-all cursor-pointer ${
                  isTldrActive
                    ? 'bg-amber-500/15 text-amber-400 font-semibold shadow-xs border border-amber-500/30'
                    : 'text-[var(--text-muted)] hover:text-amber-400/80'
                }`}
              >
                <Zap className="h-3.5 w-3.5 stroke-[1.5] text-amber-400 fill-amber-400/20" />
                <span>⚡ 2-Min Quick Recall</span>
              </button>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--text-muted)]">
              {isTldrActive ? (
                <span className="text-amber-400 font-medium">⚡ Exam-Hall Fast Scan (30s)</span>
              ) : (
                <span>{answer.marks <= 2 ? '2M Crisp Mode' : answer.marks <= 7 ? '5-7M Core + Flow' : '10M Deep + Architecture'}</span>
              )}
            </div>
          </div>
        )}

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
            ) : isTestMode && !isRevealed ? (
              /* ── Active Recall Concealment Canvas ── */
              <div className="py-10 px-6 text-center rounded-[10px] border border-dashed border-[var(--border)] bg-[var(--surface-well)]/40">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)] text-indigo-400 mb-3 shadow-xs">
                  <EyeOff className="h-5 w-5 stroke-[1.5]" />
                </div>
                <h4 className="font-display text-base font-normal text-[var(--text-primary)]">
                  Active Recall Challenge
                </h4>
                <p className="mt-1.5 text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                  Don't rely on recognition. Test yourself: jot down keywords, steps, or equations on rough paper before checking the answer.
                </p>

                {masteryStatus && (
                  <div className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="text-[var(--text-muted)]">Previous rating:</span>
                    {masteryStatus === 'mastered' ? (
                      <span className="text-emerald-500 font-semibold">Mastered</span>
                    ) : (
                      <span className="text-amber-500 font-semibold">Needs Practice</span>
                    )}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => revealAnswer(answer.id)}
                    className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--primary)] px-4 py-2 font-mono text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-xs cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 stroke-[2]" />
                    <span>Reveal Solution</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Self-Assessment Bar (when in Test Mode and revealed) */}
                {isTestMode && isRevealed && (
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-indigo-500/25 bg-indigo-500/[0.05] p-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-primary)]">
                      <span className="text-indigo-400 font-semibold">Self-Assessment:</span>
                      <span className="text-[var(--text-secondary)]">How well did you recall this answer?</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setMastery(answer.id, 'mastered')}
                        className={`inline-flex items-center gap-1.5 rounded-[6px] px-3 py-1 font-mono text-xs transition-all cursor-pointer ${
                          masteryStatus === 'mastered'
                            ? 'bg-emerald-500 text-white font-semibold shadow-xs'
                            : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>Mastered</span>
                      </button>

                      <button
                        onClick={() => setMastery(answer.id, 'need_practice')}
                        className={`inline-flex items-center gap-1.5 rounded-[6px] px-3 py-1 font-mono text-xs transition-all cursor-pointer ${
                          masteryStatus === 'need_practice'
                            ? 'bg-amber-500 text-black font-semibold shadow-xs'
                            : 'border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                        }`}
                      >
                        <RotateCcw className="h-3.5 w-3.5 stroke-[2]" />
                        <span>Need Practice</span>
                      </button>

                      <button
                        onClick={() => hideAnswer(answer.id)}
                        className="inline-flex items-center gap-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                        title="Hide answer to practice again"
                      >
                        <EyeOff className="h-3.5 w-3.5 stroke-[1.5]" />
                        <span className="hidden sm:inline">Hide Again</span>
                      </button>
                    </div>
                  </div>
                )}

                {isTldrActive && quickRecallPoints && quickRecallPoints.length > 0 ? (
                  <div className="rounded-[10px] border border-amber-500/25 bg-amber-500/[0.04] p-5">
                    <div className="flex items-center justify-between gap-2 mb-4 pb-2.5 border-b border-amber-500/15">
                      <div className="flex items-center gap-2 font-mono text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                        <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>Exam-Hall Quick Recall · 2-Min Revision</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {quickRecallPoints.map((pt, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--text-primary)]">
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 font-mono text-[10px] font-bold text-amber-400">
                            {i + 1}
                          </span>
                          <div className="markdown-answer-body text-sm font-sans">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                            >
                              {pt}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 pt-3 border-t border-amber-500/15 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--text-muted)]">
                      <span>Memorize keywords before entering exam hall</span>
                      <button
                        onClick={() => setCardTab('full')}
                        className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        View complete {answer.marks}M solution &rarr;
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="markdown-answer-body">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        code({ className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          const lang = match ? match[1] : '';
                          if (lang === 'mermaid') {
                            return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
                          }
                          // Standard code block rendering
                          return <code className={className} {...props}>{children}</code>;
                        },
                      }}
                    >
                      {formattedContent || '_No answer generated yet._'}
                    </ReactMarkdown>
                  </div>
                )}
              </>
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
        onConfirm={handleRetry}
        onCancel={() => {
          setRetryInstruction('');
          setIsRetryConfirmOpen(false);
        }}
      />
    </>
  );
});
