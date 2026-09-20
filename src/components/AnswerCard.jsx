import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Eye,
  EyeOff,
  Check,
  RotateCcw,
  Copy,
  ExternalLink,
  MoreHorizontal,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { ConfirmationModal } from './ConfirmationModal';
import { MermaidDiagram } from './MermaidDiagram';

function extractFirstSentence(text, maxWords = 22) {
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

export function extractQuickRecall(rawContent, _questionText = '') {
  if (!rawContent) return null;

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

  const points = [];
  const lines = rawContent.split('\n').map((l) => l.trim()).filter(Boolean);

  const introPara = lines.find(
    (l) =>
      !l.startsWith('#') &&
      !l.startsWith('```') &&
      !l.startsWith('>') &&
      !l.startsWith('|') &&
      !/^(?:\d+\.|\*|-)/.test(l) &&
      l.length > 25 &&
      /\b(is a|is an|is the|refers to|deals with|defined as|measures|models|describes|difference between|two ways to|captures|compares)\b/i.test(l)
  );
  if (introPara) {
    const coreSentence = extractFirstSentence(introPara, 28);
    points.push(`**Core Concept** — ${coreSentence}`);
  }

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

  const termLineRegex = /^(?:[-*•]|\d+\.)?\s*(?:\*\*)?([A-Za-z0-9\s/()_–—\\]{2,35})(?:\*\*)?\s*[:—–-]\s*(.+)$/;
  for (const line of lines) {
    if (line.startsWith('#') || line.startsWith('```') || line.startsWith('|')) continue;
    const match = line.match(termLineRegex);
    if (match) {
      const term = match[1].trim().replace(/^\*\*|\*\*$/g, '');
      const rawExp = match[2].trim();
      if (!BLACKLIST_TERM_REGEX.test(term) && term.length >= 2 && rawExp.length > 5) {
        const crispExp = extractFirstSentence(rawExp);
        if (!points.some((p) => p.toLowerCase().includes(term.toLowerCase()))) {
          points.push(`**${term}** — ${crispExp}`);
        }
      }
    }
  }

  if (points.length === 0) {
    const firstPara = lines.find((l) => !l.startsWith('#') && !l.startsWith('```') && !l.startsWith('>') && l.length > 25);
    if (firstPara) {
      points.push(`**Core Concept** — ${extractFirstSentence(firstPara, 25)}`);
    } else {
      points.push('**Core Concept** — Grounded academic concept verified from study notes.');
    }
  }

  return points.slice(0, 6);
}

function stripQuickRecall(content) {
  if (!content) return '';
  let cleaned = content;

  cleaned = cleaned.replace(
    /(?:^|\n)\s*>\s*(?:\*{0,2}|#{1,4}\s*)⚡?\s*(?:2-Min\s+)?Quick\s+Recall[^\n]*\n((?:>\s*[^\n]*\n?)*)/gi,
    '\n'
  );

  cleaned = cleaned.replace(
    /(?:^|\n)\s*(?:\*{0,2}|#{1,4}\s*)⚡?\s*(?:2-Min\s+)?Quick\s+Recall[^\n]*(?:\*{0,2})\s*\n(?:(?:\s*[-*•]|\s*\d+\.|\s*>)[^\n]*\n?)+/gi,
    '\n'
  );

  cleaned = cleaned.replace(
    /(?:^|\n)\s*(?:>\s*)?(?:\*{0,2}|#{1,4}\s*)⚡?\s*(?:2-Min\s+)?Quick\s+Recall[^\n]*(?:\*{0,2})\s*(?=\n|$)/gi,
    '\n'
  );

  return cleaned;
}

function formatMarkdownMath(content) {
  if (!content) return '';

  let cleaned = stripQuickRecall(content);

  cleaned = cleaned.replace(
    /(?:^|\n)(?:Mark Allocation|Grading Rubric|Scoring Breakdown|Reviewer Assessment):\s*[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi,
    '\n'
  );

  cleaned = cleaned.replace(
    /\n\s*\n\s*(?:This answer|This response|This solution|This explanation|The above answer|The answer above|The response above)\b(?:(?!\n\s*\n)[\s\S])*?(?:concise|plain English|simple English|bullet|mark requirement|marks requirement|jargon|explains? them simply|explains? it simply|brief introduction|as requested|as required|proportional to the marks?|easy to (?:understand|memori[sz]e))(?:(?!\n\s*\n)[\s\S])*\s*$/i,
    ''
  );

  const parts = cleaned.split(/(```[\s\S]*?```)/g);

  const processed = parts.map((part) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      return part;
    }

    let text = part;

    text = text.replace(/(?:^|\n)\s*\$\s*\n+([\s\S]*?)\n+\s*\$\s*(?=\n|$)/g, (_match, formula) => {
      return `\n\n$$\n${formula.trim()}\n$$\n\n`;
    });

    text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_match, formula) => `\n\n$$\n${formula.trim()}\n$$\n\n`);
    text = text.replace(/\\\(([\s\S]*?)\\\)/g, (_match, formula) => `$${formula.replace(/\s+/g, ' ').trim()}$`);
    text = text.replace(
      /\[\s*(\\mu|\\max|\\min|\\begin\{cases\}|\\neg|\\text|\\sum|\\frac|\\int|\\lim|\\sigma|\\alpha|\\beta|\\gamma|\\delta|\\theta)([\s\S]*?)\]/g,
      (_match, prefix, rest) => `\n\n$$\n${prefix}${rest.trim()}\n$$\n\n`
    );
    text = text.replace(/\$([^$\n]+)\$/g, (_match, inner) => `$${inner.trim()}$`);
    text = text.replace(/\n{3,}/g, '\n\n');
    text = text.replace(/([^\n])\n(\d+\.\s+[A-Za-z])/g, '$1\n\n$2');
    text = text.replace(/([^\n])\n(###?\s+)/g, '$1\n\n$2');

    return text;
  });

  return processed.join('').trim();
}

export const AnswerCard = React.memo(function AnswerCard({
  answer,
  index,
  readOnly = false,
  onNavigateNext,
  onNavigatePrev,
  hasPrev = false,
  hasNext = false,
  id,
}) {
  const retryAnswer = useQuestionBankStore((s) => s.retryAnswer);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isRetryConfirmOpen, setIsRetryConfirmOpen] = useState(false);
  const [retryInstruction, setRetryInstruction] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedSources, setExpandedSources] = useState({});
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleRetry = async () => {
    if (readOnly) return;
    setIsRetryConfirmOpen(false);
    setIsRetrying(true);
    await retryAnswer(answer.id, retryInstruction);
    setRetryInstruction('');
    setIsRetrying(false);
  };

  const handleCopy = () => {
    if (answer?.content) {
      navigator.clipboard.writeText(`Q: ${answer.question_text}\n\n${answer.content}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setIsMenuOpen(false);
    }
  };

  const toggleSourceExpand = (sourceIdx) => {
    setExpandedSources((prev) => ({
      ...prev,
      [sourceIdx]: !prev[sourceIdx],
    }));
  };

  const sources = answer.sources || [];

  const formattedContent = useMemo(() => {
    return formatMarkdownMath(answer.content);
  }, [answer.content]);

  const formattedQNum = String(answer.question_number || index + 1).padStart(2, '0');
  const marks = answer.marks || 5;

  return (
    <>
      <article
        id={id || `q-${answer.id}`}
        className="rounded-2xl bg-white border border-[#E2E0D9] p-6 sm:p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0px_4px_12px_rgba(25,36,59,0.06)]"
      >
        
        <div className="border-b border-[#EAE8E3] pb-5 mb-6 flex justify-between items-start gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-[#0057FF] text-white shadow-2xs tracking-wide">
                Q{formattedQNum}
              </span>
              <span className="font-semibold text-xs px-2.5 py-1 rounded-lg bg-[#F8F7F4] text-[#526078] border border-[#E2E0D9]">
                {marks} marks
              </span>
              {answer.repeat_count > 1 && (
                <span className="font-semibold text-xs px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <span>🔥</span>
                  <span>{answer.repeat_count}x in past papers</span>
                </span>
              )}
            </div>
            <h3 className="font-bold text-lg sm:text-xl leading-snug text-[#19243B] mt-3">
              {answer.question_text}
            </h3>
          </div>

          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="rounded-lg text-[#526078] hover:text-[#19243B] hover:bg-[#F1F0EC] p-2 transition-colors cursor-pointer"
              title="More actions"
              aria-label="More actions"
            >
              <MoreHorizontal className="size-5" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-[#E2E0D9] bg-white p-1.5 shadow-[0px_8px_24px_rgba(25,36,59,0.1)] animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-xs text-[#19243B] hover:bg-[#F1F0EC] transition-colors text-left"
                >
                  <Copy className="size-4 text-[#526078]" />
                  <span>{copied ? 'Copied to clipboard!' : 'Copy answer'}</span>
                </button>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsRetryConfirmOpen(true);
                    }}
                    className="flex items-center gap-2.5 w-full rounded-lg px-3 py-2 text-xs text-[#19243B] hover:bg-[#F1F0EC] transition-colors text-left"
                  >
                    <Sparkles className="size-4 text-[#0057FF]" />
                    <span>Improve this answer</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="text-[#19243B] text-[16px] sm:text-[17px] leading-8 mt-6">

          {answer.status === 'failed' ? (
            <div className="rounded-xl bg-[#FEF2F2] border border-[#FCA5A5]/60 p-6 my-4 transition-all">
              <div className="flex items-start gap-4">
                <AlertCircle className="text-[#DC2626] mt-0.5 shrink-0 size-5" />
                <div className="flex flex-col gap-2 flex-1">
                  <h4 className="font-semibold text-[#991B1B] text-base">
                    We couldn't create this answer
                  </h4>
                  <p className="text-[#B91C1C] text-sm leading-6">
                    {answer.error_message || 'The linked study material could not be read right now. Your other answers are still available.'}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={isRetrying}
                      className="font-medium rounded-lg border border-[#F87171]/50 bg-white text-[#DC2626] hover:bg-[#FEE2E2] px-4 py-2 text-xs transition-colors cursor-pointer"
                    >
                      {isRetrying ? 'Retrying...' : 'Retry'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRetryConfirmOpen(true)}
                      className="font-medium rounded-lg bg-[#0057FF] text-white hover:bg-[#0047D6] px-4 py-2 text-xs transition-colors cursor-pointer"
                    >
                      Regenerate with custom prompt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="markdown-answer-body leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  pre({ children }) {
                    return <>{children}</>;
                  },
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const lang = match ? match[1] : '';
                    if (lang === 'mermaid') {
                      return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
                    }
                    const isBlock = Boolean(className) || (typeof children === 'string' && children.includes('\n'));
                    if (isBlock) {
                      return (
                        <pre>
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      );
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {formattedContent || '_No answer generated yet._'}
              </ReactMarkdown>
            </div>
          )}

          {sources.length > 0 && answer.status !== 'failed' && (
            <div className="mt-8 pt-6 border-t border-[#E2E0D9]">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="size-4 text-[#0057FF]" />
                <span className="text-xs font-semibold text-[#19243B] uppercase tracking-wider">
                  Sources & Citations ({sources.length})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sources.map((src, sIdx) => {
                  const isExpanded = !!expandedSources[sIdx];
                  const docTitle = src.document_title || src.title || `Resource #${src.document_id || sIdx + 1}`;
                  const pageInfo = src.page_label ? `Page ${src.page_label}` : src.page_number ? `Page ${src.page_number}` : null;
                  const snippet = src.snippet || src.text || '';

                  return (
                    <div
                      key={sIdx}
                      className="rounded-xl border border-[#E2E0D9] bg-[#F8F7F4] p-3 text-xs transition-all hover:bg-white hover:border-[#C6CAD3]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-medium text-[#19243B] truncate">
                          <FileText className="size-3.5 shrink-0 text-[#0057FF]" />
                          <span className="truncate">{docTitle}</span>
                        </div>
                        {pageInfo && (
                          <span className="font-mono text-[10px] text-[#526078] bg-white border border-[#E2E0D9] px-1.5 py-0.5 rounded shrink-0">
                            {pageInfo}
                          </span>
                        )}
                      </div>

                      {snippet && (
                        <div className="mt-2 text-[#526078] leading-relaxed">
                          <p className={isExpanded ? '' : 'line-clamp-2'}>
                            {snippet}
                          </p>
                          {snippet.length > 120 && (
                            <button
                              type="button"
                              onClick={() => toggleSourceExpand(sIdx)}
                              className="mt-1 text-[11px] font-semibold text-[#0057FF] hover:underline cursor-pointer flex items-center gap-0.5"
                            >
                              {isExpanded ? (
                                <>
                                  <span>Show less</span>
                                  <ChevronUp className="size-3" />
                                </>
                              ) : (
                                <>
                                  <span>Show citation</span>
                                  <ChevronDown className="size-3" />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-[#E2E0D9] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => setIsRetryConfirmOpen(true)}
                  disabled={isRetrying}
                  className="font-medium rounded-lg text-sm border border-[#E2E0D9] bg-white text-[#19243B] hover:bg-[#F1F0EC] flex px-4 py-2.5 items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`size-4 ${isRetrying ? 'animate-spin text-[#0057FF]' : 'text-[#526078]'}`} />
                  <span>{isRetrying ? 'Synthesizing...' : 'Improve answer'}</span>
                </button>
              )}

              {hasPrev && onNavigatePrev && (
                <button
                  type="button"
                  onClick={onNavigatePrev}
                  className="font-medium rounded-lg text-sm border border-[#E2E0D9] bg-white text-[#19243B] hover:bg-[#F1F0EC] flex px-3.5 py-2.5 items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="size-4 text-[#526078]" />
                  <span>Previous</span>
                </button>
              )}

              {hasNext && onNavigateNext && (
                <button
                  type="button"
                  onClick={onNavigateNext}
                  className="font-medium rounded-lg text-sm border border-[#E2E0D9] bg-white text-[#19243B] hover:bg-[#F1F0EC] flex px-3.5 py-2.5 items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="size-4 text-[#526078]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </article>

      <ConfirmationModal
        isOpen={isRetryConfirmOpen}
        title="Improve this answer"
        confirmText="Regenerate answer"
        cancelText="Cancel"
        confirmVariant="primary"
        withInput={true}
        inputValue={retryInstruction}
        onInputChange={setRetryInstruction}
        inputPlaceholder="Tell AcademicStack what you want changed..."
        subtext="For example: add a worked example, simplify the explanation, or focus on the exam steps."
        disclaimer="Regenerating an answer uses your configured OpenAI API key and retrieves fresh context from your linked materials."
        onConfirm={handleRetry}
        onCancel={() => {
          setRetryInstruction('');
          setIsRetryConfirmOpen(false);
        }}
      />
    </>
  );
});

export default AnswerCard;
