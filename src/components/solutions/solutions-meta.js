/**
 * Non-component metadata for the solutions feature.
 * Kept out of JSX files so they stay fast-refresh friendly.
 *
 * Real backend values (answers/schemas.py + db/models.py):
 *   answer.status       ∈ "pending" | "generating" | "completed" | "failed"
 *   answer_set.status   ∈ "generating" | "completed" | "failed" | "completed_with_errors"
 *   sources             = parsed JSON array of
 *                         { resource_name, page, chapter?, resource_id? }
 * No review/approval state exists — none is invented here.
 */

// ── LaTeX & Markdown preprocessor ───────────────────────────────────────────
// Battle-tested 7-pass normalizer extracted verbatim from the original
// AnswerCard (AUDIT_REPORT.md §G). It only repairs LaTeX/markdown syntax;
// it never alters the generated wording.
export function formatMarkdownMath(content) {
  if (!content) return '';

  let text = content;

  // 1. Fix isolated single dollars on their own lines: $\n\n[formula]\n\n$ -> $$\n[formula]\n$$
  text = text.replace(/(?:^|\n)\s*\$\s*\n+([\s\S]*?)\n+\s*\$\s*(?=\n|$)/g, (match, formula) => {
    return `\n\n$$\n${formula.trim()}\n$$\n\n`;
  });

  // 2. Convert standard bracketed display math \[ ... \] to $$ ... $$
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (match, formula) => `\n\n$$\n${formula.trim()}\n$$\n\n`);

  // 3. Convert \( ... \) to $ ... $ (inline)
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, (match, formula) => `$${formula.replace(/\s+/g, ' ').trim()}$`);

  // 4. Convert bracketed LaTeX environments like [ \mu... ], [ \begin{cases}... ] to $$ ... $$
  text = text.replace(/\[\s*(\\mu|\\max|\\min|\\begin\{cases\}|\\neg|\\text|\\sum|\\frac|\\int|\\lim|\\sigma|\\alpha|\\beta|\\gamma|\\delta|\\theta)([\s\S]*?)\]/g,
    (match, prefix, rest) => `\n\n$$\n${prefix}${rest.trim()}\n$$\n\n`
  );

  // 5. Fix any broken inline math split across multiple newlines: $\n A \n$ -> $A$
  text = text.replace(/\$([^$\n]+)\$/g, (match, inner) => `$${inner.trim()}$`);

  // 6. Clean up excessive consecutive blank lines (limit to max 2 newlines = 1 blank line)
  text = text.replace(/\n{3,}/g, '\n\n');

  // 7. Ensure clean spacing before subquestions / numbered topics
  text = text.replace(/([^\n])\n(\d+\.\s+[A-Za-z])/g, '$1\n\n$2');
  text = text.replace(/([^\n])\n(###?\s+)/g, '$1\n\n$2');

  return text.trim();
}

/** Status presentation map — icon keys resolved in AnswerStatus.jsx. */
const ANSWER_STATUS_CONFIG = {
  pending: { tone: 'neutral', label: 'Pending' },
  generating: { tone: 'info', label: 'Generating', dot: true, pulse: true },
  completed: { tone: 'success', label: 'Generated via RAG', iconKey: 'check' },
  failed: { tone: 'destructive', label: 'Generation Failed', iconKey: 'alert' },
}

export function getAnswerStatus(status) {
  return ANSWER_STATUS_CONFIG[status] ?? ANSWER_STATUS_CONFIG.pending
}

/**
 * Source meta line — uses ONLY real fields and preserves the original
 * rule of hiding the generic "General" chapter label.
 */
export function formatSourceMeta(source) {
  const parts = [`Page ${source.page}`]
  if (source.chapter && source.chapter !== 'General') {
    parts.push(source.chapter)
  }
  return parts.join(' · ')
}
