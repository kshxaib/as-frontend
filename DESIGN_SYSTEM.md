# AcademicStack Design System

> **Version:** 1.0 — Design direction only. No application pages modified yet.
> **Date:** August 23, 2026
> **Companion documents:** `AUDIT_REPORT.md` (functionality & API inventory that this system must preserve)
>
> **Toolchain:** UI UX Pro Max (style/palette/typography research) · 21st.dev (component inspiration) · shadcn/Base UI (`base-nova` registry, already configured in `components.json`) · Lucide (sole icon set) · Motion (`motion` package, animation layer)

---

## 0. Product Understanding (drives every decision below)

AcademicStack is **document-centered knowledge work**, not conversation. The eight workflows are pipelines over PDFs and structured academic content:

| Workflow | Essence | Dominant UI objects |
|---|---|---|
| Resources | Upload study PDFs → index into vector store | File cards, upload dialog, status lifecycle |
| Question Banks | Upload exam papers → AI extraction | File cards, extraction action, linked-resource field |
| Question Review | Verify/edit extracted questions & marks | Editable list rows, mark presets, stats |
| Answer Generation | RAG-generate answers for approved questions | Long-running job UI, staged progress |
| Answer Review | Read/regenerate cited answers | Rich Markdown/KaTeX reader, citation chips |
| PDF Export | Download solved paper | Single prominent export action |
| Community | Public browse/download | Feed cards, guest mode |
| Profile/API Keys | Configure 5 AI providers | Settings cards, masked inputs, gating |

**Design thesis:** make it feel like a **beautiful digital research desk / private library** — calm paper surfaces, scholarly serif headlines, precise monospaced data (marks, citations, key status) — with **one restrained amber accent reserved for AI moments**. Authority comes from typography and structure, not gradients and glass.

**Positioning statement:** *"Where ChatGPT looks like a chat window, AcademicStack looks like a well-typeset exam paper that happens to be alive."*

---

## 1. Product Visual Identity

**Name for the direction:** **“The Reading Room”**

- **Personality:** scholarly, precise, calm, confident, quietly premium. A senior librarian who is also an engineer.
- **Metaphor set:** paper & ink, library shelves (sidebar), manuscript annotations (badges/citations), examination stationery (question cards), brass & laurel (achievement/export moments).
- **What it is NOT:** a chatbot, a neon “AI wrapper”, a glassy dashboard, a toy edu-app with cartoon illustrations.
- **Signature elements (the memorable bits):**
  1. **Serif display headlines** (Fraunces/Playfair-class) paired with utilitarian UI sans.
  2. **Monospace metadata voice** — question numbers, marks, citation refs, elapsed times, key counts are always mono, slightly letterspaced, like printed exam folios.
  3. **Hairline-ruled structure** — borders and rules do the structural work (editorial print heritage); shadows stay whisper-quiet.
  4. **Amber = AI.** Every AI-initiated action (extract, generate, retry) carries the single Manuscript Amber accent. Nothing else uses it for decoration.
  5. **Numbered pipeline motif** — ① Resources → ② Extraction → ③ Review → ④ Solutions → ⑤ Export appears in nav and page headers as a subtle wayfinding device.
- **Density:** mid. Generous reading measures for answers/questions; efficient compact zones for lists/stats. Airy, never sparse-empty.
- **Mode:** dual-theme first-class. Light (“Reading Room”) is the default marketing/guest impression; Dark (“Midnight Library”) is the default workspace theme for long study sessions. Both are token-driven; neither is an afterthought.

---

## 2. Color System

Research basis: UI UX Pro Max `color` domain — LMS palette (education teal + course amber + grade green), deliberately **rejecting** the generic “AI-Native purple” (#7C3AED chatbot look flagged as an anti-pattern for this product) and rejecting the old slate-950/indigo hardcode.

### 2.1 Semantic roles

| Role | Light “Reading Room” | Dark “Midnight Library” | Usage |
|---|---|---|---|
| `--background` | Paper `oklch(0.977 0.004 95)` | Ink Navy `oklch(0.165 0.015 255)` | App canvas |
| `--foreground` | Ink `oklch(0.22 0.02 258)` | Paper White `oklch(0.945 0.006 95)` | Primary text |
| `--card` | `oklch(1 0 0)` | `oklch(0.205 0.018 255)` | Cards, sheets, dialogs |
| `--card-foreground` | = foreground | = foreground | |
| `--muted` | `oklch(0.955 0.006 95)` | `oklch(0.245 0.016 255)` | Secondary fills, hover wells |
| `--muted-foreground` | `oklch(0.46 0.02 258)` | `oklch(0.68 0.015 258)` | Secondary text (≥4.5:1) |
| `--border` | `oklch(0.90 0.008 258)` | `oklch(1 0 0 / 11%)` | Hairlines, rules |
| `--input` | `oklch(0.88 0.008 258)` | `oklch(1 0 0 / 16%)` | Input borders |
| `--ring` | Scholar Teal | Bright Scholar Teal | Focus rings |
| `--radius` | `0.75rem` | same | Radius derivation base |

### 2.2 Brand primaries

| Token | Light | Dark | Role |
|---|---|---|---|
| `--primary` | **Scholar Teal** `oklch(0.52 0.085 192)` (≈ #0E6E6A) | `oklch(0.74 0.10 186)` | Primary actions, active nav, links, “Indexed/RAG-ready” identity |
| `--primary-foreground` | `oklch(0.99 0.003 95)` | `oklch(0.14 0.02 255)` | Text on primary |
| `--accent` | **Manuscript Amber** `oklch(0.70 0.125 68)` (≈ #C77414) | `oklch(0.82 0.115 78)` | **AI actions only**: Extract, Generate, Retry, AI badges, progress highlights |
| `--accent-foreground` | Ink | Ink | |

Rules: teal is the *product* color; amber is the *intelligence* color. They may appear together in a composition but never as a blended gradient button. No purple anywhere in the core system (community gold below is the only warm-secondary exception).

### 2.3 Status & feedback palette

| Token | Light | Dark | Domain meaning |
|---|---|---|---|
| `--success` | Emerald `oklch(0.56 0.12 158)` | `oklch(0.72 0.13 158)` | Indexed, extracted, completed, key Active |
| `--warning` | Amber-deep `oklch(0.62 0.13 62)` | `oklch(0.78 0.12 70)` | AI-estimated marks, setup incomplete, re-extract risk |
| `--destructive` | Rose `oklch(0.55 0.19 22)` | `oklch(0.68 0.17 22)` | Failed generation/indexing, deletes |
| `--info` | Slate Blue `oklch(0.55 0.07 245)` | `oklch(0.72 0.08 240)` | In-progress jobs (indexing/vectorizing) |
| `--gold` | Laurel Gold `oklch(0.72 0.12 85)` | `oklch(0.80 0.11 88)` | Community/shared items, export/PDF moments (brass/laurel) |

Status usage maps 1:1 to existing business states (must survive redesign):

| Business state | Token treatment |
|---|---|
| Resource: uploaded/unindexed | Neutral outline badge |
| Resource: indexing | `--info`, animated pulse dot |
| Resource: indexed | `--success` + Database glyph, “RAG-ready” |
| Resource: indexing_failed | `--destructive` + retry affordance |
| QB: uploaded | Neutral outline |
| QB: extracting | `--accent` amber, spark glyph |
| QB: extracted | `--success` |
| Marks source: explicit / ai_estimated / user_modified | Success / Warning / Info respectively (icon + text, never color alone) |
| Answer: completed / failed | Success / Destructive |
| Visibility: private / community | Neutral outline / `--gold` filled |

### 2.4 Charts & data (stat tiles)

Derived 5-step ramp from Scholar Teal → Ink for any future charting; today’s stats (counts, totals) render as typographic figures, not charts — see §9.3.

### 2.5 Scrim & overlays

Dialog scrim: light `oklch(0.22 0.02 258 / 42%)` + 4px backdrop blur; dark `oklch(0.10 0.015 255 / 62%)` + 8px blur. Measured so card-on-scrim keeps ≥4.5:1 body contrast in both themes.

---

## 3. Typography System

Research basis: UI UX Pro Max `typography` domain — “Academic/Research” (Crimson Pro + Atkinson) and “Classic Elegant / Minimalist Editorial” pairings; fused with the already-installed Geist Variable to avoid re-vendoring the UI sans.

### 3.1 The three voices

| Voice | Font | Weight range | Where it speaks |
|---|---|---|---|
| **Display (Scholar)** | **Fraunces Variable** (recommended; catalog fallback: Playfair Display) — serif, optical sizing on | 500–650, tracking `-0.01em…-0.02em` | Page titles, landing hero, empty-state headlines, big stat numerals |
| **UI Sans (Operator)** | **Geist Variable** (already installed via `@fontsource-variable/geist`) | 400–600 | All UI chrome: buttons, inputs, nav, body UI copy |
| **Mono (Registry)** | **JetBrains Mono** (catalog-backed; alt: Geist Mono if bundled with Geist package) | 400–500, uppercase meta gets `+0.08em` tracking | Question numbers (`Q1`), marks (`5M`), citation refs (`p.42 · Ch.3`), elapsed timers, key counts (`4/4`), IDs |

Rationale: serif = academic authority and instant differentiation from generic SaaS; Geist keeps UI crisp and is a zero-cost reuse; mono gives data an exam-folio voice. Long-form *answer content* stays sans (screen legibility over long Markdown), while *question text* may use the serif at reading size for editorial character.

> Implementation note (Phase 0, requires approval): add `@fontsource-variable/fraunces` + `@fontsource/jetbrains-mono`. Until approved, Playfair Display via Google Fonts import in `index.css` and system `ui-monospace` stack are acceptable stopgaps.

### 3.2 Type scale

Fluid where noted. Base bumped up from today’s `text-xs` disease — **body never below 14px**.

| Token | Size / Line-height | Tracking | Weight (default) | Use |
|---|---|---|---|---|
| `display-xl` | clamp(2.75rem→4rem) / 1.05 | -0.02em | Serif 600 | Landing hero only |
| `display-lg` | clamp(2rem→2.75rem) / 1.12 | -0.015em | Serif 600 | Empty-state heroes, major section headers |
| `title-xl` (h1) | 30px/1.15 (fluid 26→32) | -0.01em | Sans 600 | Page titles |
| `title-lg` (h2) | 22px/1.25 | -0.005em | Sans 600 | Section headers, dialog titles |
| `title-sm` (h3) | 17px/1.35 | normal | Sans 600 | Card titles |
| `body-lg` | 16px/1.6 | normal | Sans 400 | Answer/question reading text |
| `body-base` | **14.5px/1.55** | normal | Sans 400 | Default body/UI text |
| `body-sm` | 13px/1.45 | normal | Sans 400 | Secondary UI text, helper copy |
| `meta` | 11.5px/1.3 | +0.06em uppercase | Mono 450 | Badges, table heads, metadata rows |
| `figure` | 34px/1 tabular | -0.01em | Serif 550 | Stat tile numerals |

Rules:
- One serif moment per screen region maximum; never serif inside form controls.
- Mono is for **data**, never for sentences.
- Tabular numerals (`font-variant-numeric: tabular-nums`) on all counts/marks/stats.

---

## 4. Spacing System

4px base grid; 8px rhythm for component interiors (research dial: density mid — standard 16–64 page scale, compact 8–24 inside dense lists).

| Token | Value | Primary use |
|---|---|---|
| `space-1` | 4px | Icon↔label gaps, badge padding |
| `space-2` | 8px | Control interiors, list row gaps (dense) |
| `space-3` | 12px | Input paddings, card inner gaps |
| `space-4` | 16px | Component padding unit, grid gap |
| `space-5` | 20px | Card padding (compact cards) |
| `space-6` | 24px | Card padding (standard), section gaps mobile |
| `space-8` | 32px | Section gaps tablet |
| `space-10` | 40px | Section gaps desktop |
| `space-12`–`space-16` | 48–64px | Page vertical rhythm, hero spacing |
| `gutter` | 20 / 28 / 40px | Page horizontal inset at sm / md / lg+ |
| `content-max` | 1280px (workspace) · 720px (reading: answers) · 1120px (landing prose) | Measure control |
| `sidebar-w` | 264px expanded · 72px rail | §13 |
| `header-h` | 60px | Top bar height |

Vertical rhythm tiers by hierarchy: related items 8–12px → groups 16–24px → sections 32–48px → page regions 56–80px. Reading measure for answer bodies: 68–72ch max.

---

## 5. Border-Radius System

Derived from `--radius: 0.75rem` so shadcn `--radius-sm/md/lg/xl` compute consistently. Bento-influenced but restrained (editorial print heritage caps roundness).

| Token | Value | Applied to |
|---|---|---|
| `radius-xs` | 5px | Tiny chips, code spans, checkbox |
| `radius-sm` | 8px | Badges (non-pill), small buttons, inputs in dense tables |
| `radius-md` | 12px | Buttons (default), inputs, selects, menu items |
| `radius-lg` | 14px | Popovers, dropdowns, command palette |
| `radius-xl` | 18px | Standard cards, dialogs, sheets |
| `radius-2xl` | 22px | Hero/bento tiles, landing feature cards |
| `radius-full` | 999px | Pills, avatars, status dots, toggles |

Consistency rule: interactive controls ≤14px; surfaces ≥18px. Never mix two radii on nested touching corners without an inset border strategy (nested card corners align or are inset by ≥8px).

---

## 6. Shadows & Elevation

Paper-layer model: structure comes from hairlines; elevation is quiet and warm-tinted (ink-based, not black). Dark mode swaps shadow-elevation for **surface-step elevation** (card lightens per layer) + stronger borders.

| Token | Light value | Dark treatment | Used for |
|---|---|---|---|
| `shadow-hairline` | none (border only) | border brightens | Cards at rest |
| `shadow-xs` | `0 1px 2px oklch(0.22 0.02 258 / 6%)` | surface step +0.015 L | Inputs, badges w/ border |
| `shadow-sm` | `0 1px 3px /7%, 0 1px 2px /5%` | +border emphasis | Hovered list cards, sticky bars |
| `shadow-md` | `0 4px 12px -2px /10%, 0 2px 4px /5%` | surface step +0.03 L | Popovers, command menu |
| `shadow-lg` | `0 16px 40px -12px /16%, 0 4px 12px /6%` | surface step +0.05 L + scrim | Dialogs, sheets |
| `--glow-ai` | `0 0 0 1px accent/25, 0 0 24px accent/12` | same, slightly stronger | **Only** sanctioned glow: active AI processing surfaces |

Forbidden outside that single exception: colored/neon glows (the old `glow-indigo` dies), layered triple shadows on flat cards, drop shadows on text.

---

## 7. Button Styles

Built on the existing orphaned `ui/button.jsx` (Base UI + cva) — its variant API is kept, restyled to this system. Sizes grow vs. old app (min visual height 36px default).

### Variants

| Variant | Look | Use |
|---|---|---|
| `primary` | Scholar Teal solid, paper-white label, `shadow-xs`; hover −4% L + `shadow-sm`; active translateY(0.5px) | Main action per view (Upload, Save Key, Add Question) |
| `ai` | Manuscript Amber solid, ink label, subtle `--glow-ai` at rest disabled until ready | **AI verbs only**: Extract Questions, Generate Answers, Regenerate |
| `secondary` | Muted fill, foreground text, hairline border | Supporting actions (Share, Review & Solve) |
| `outline` | Transparent bg, hairline border; hover muted well | Tertiary/cancel-adjacent actions |
| `ghost` | Transparent; hover muted well | Toolbars, card icon actions |
| `destructive` | Rose outline by default; **solid rose only inside confirm dialogs** | Delete affordances |
| `link` | Teal underline-on-hover, no padding box | Inline navigation (“Review & Solve →”) |
| `gold` (export) | Laurel Gold solid, ink label | PDF export/download-solved actions |

### Sizes

`xs` 26px · `sm` 31px · `default` 36px · `lg` 42px · `icon` variants square-matching each. Gap icon↔label 6–8px; icon size 16 (default/sm), 18 (lg).

### Behavior rules

- Every button: visible focus ring (§18), disabled = 50% opacity + `cursor-not-allowed` + tooltip explaining why (e.g., “Configure 4 API keys first”).
- Async buttons swap label → spinner + verb (“Generating…”), keep width stable (min-width pinned to resting label).
- Destructive actions are never inline-only: they open ConfirmDialog (§11).
- One `primary`/`ai`/`gold` hero action per view; everything else recedes.
- Cursor pointer everywhere clickable (catalog checklist item).

---

## 8. Input & Form Styles

All forms rebuilt on Base UI Field/Input primitives; native unstyled controls are retired from primary flows.

### Anatomy

- **Label:** always visible, above field, `body-sm` Sans 500. Optional right-aligned “meta” mono hint (e.g., `min 20 chars`).
- **Input:** 36px (sm 31 / lg 42) height, `radius-md`, `--input` border 1px, card bg; focus = `--ring` 2px + border→primary; error = destructive border + inline message below (`body-sm` rose, icon AlertCircle 14px) wired via `aria-describedby`.
- **Leading icons** allowed (search, key); trailing slot reserved for password reveal / clear.
- **Helper text** sits under the field in `muted-foreground`; never as placeholder replacement.
- Placeholders: realistic examples (“e.g., Operating Systems — Ch 1–4”), never instructions that disappear on input.

### Special fields

| Field | Treatment |
|---|---|
| API keys | Mono font, masked by default, Eye/EyeOff toggle inside right inset, paste-friendly, per-provider prefix hint chip (e.g., `gsk_…`) |
| Marks | Segmented preset control [2][5][10] + compact numeric stepper (custom), tabular numerals |
| Visibility (private/community) | Radio-card pair with icon + one-line description, not a bare `<select>` |
| File upload (PDF) | Full dropzone: dashed `radius-lg` well, FileUp icon, “Drop PDF or browse”, accepted-type + size meta line, selected-file chip w/ filename + size + remove |
| Resource linking (checkbox list) | Scrollable 200px checklist of option-cards; each row shows name, subject badge, indexed dot; checked = teal border + CheckCircle |
| Search inputs | Ghost variant inside filter bars: muted well bg, Search icon leading, ⌘K hint when command menu lands |

### Validation UX

Inline validation on blur + on submit; submit blocked with focus moved to first invalid field; multi-error forms get an error summary region (§18). Server errors map into the same inline slots; global failures go to toast (§14).

---

## 9. Card Styles

### 9.1 Standard entity card (Resource / QB / Community item)

- Surface: `--card`, hairline border, `radius-xl`, padding `space-5`.
- Zones: **header row** (subject pill left, visibility/status right) · **title** (title-sm serif optional for QB names) · **meta line** (mono: chapters, uploader, date) · **description** clamp-2 · **footer rule** (hairline) with actions row.
- Hover: border→`--border` strong, translateY(-2px), `shadow-sm`; 150ms ease-out. No scale jumps >2%.
- Status badge lives top-right; primary action bottom-left; overflow icon actions bottom-right behind a DropdownMenu (replaces today’s naked icon rows).

### 9.2 Bento stat tiles (QuestionReview / SolutionViewer dashboards)

- Grid of modular tiles (`radius-xl`): 1 default tile, optional 2× feature tile.
- Interior: `meta` mono label uppercase → `figure` numeral → delta/context line (`body-sm` muted).
- The “Marks Source” breakdown tile hosts three inline mini-badges (explicit/AI/modified).
- Tiles are non-interactive at rest; hover reveals a subtle muted wash only if clickable.

### 9.3 Reading surfaces

- **AnswerCard (SolutionViewer):** full-width reader card, `content-max` 720px inner measure; header = Q-chip (mono, teal tint) + question text (serif body-lg) + marks badge + status; collapsible body renders Markdown/KaTeX on paper surface with generous 1.65 line-height; citation footer = numbered gold-tinted chips (`[1] Resource · p.42`). Failed state = destructive inset panel with Retry (`ai` ghost variant).
- **QuestionCard (Review):** list-row card optimized for scanning: Q-number mono chip, source badge, text, quick-marks segmented control right-aligned, edit/delete in hover-revealed action cluster (always visible on touch).

---

## 10. Table Styles

Tables appear only where scanning beats cards (question review lists, future answer-set histories). Otherwise lists remain card/row hybrids.

- Header row: sticky, `meta` mono uppercase labels, `muted` background, no vertical rules.
- Rows: 44px min height, hairline dividers, hover `muted` wash; selected row = teal 8% tint + 2px inset-left teal bar.
- Numeric columns (marks, counts): right-aligned, tabular, mono.
- Row actions: hover/tap-revealed ghost icon cluster or single overflow menu.
- Empty table state and loading skeleton must match column geometry exactly (§14).
- Mobile <768px: tables degrade to stacked definition rows (label:value pairs) — horizontal scrolling is the last resort, never for primary flows.

---

## 11. Modal / Dialog Styles

All dialogs rebuilt on Base UI Dialog/AlertDialog primitives: focus trap, ESC close, scrim click dismiss (except destructive confirms), focus restore, `role="dialog"` + labelled title.

### Variants

| Type | Geometry | Notes |
|---|---|---|
| **Form dialog** (uploads, add question) | 480–560px wide, `radius-xl`, header (title + X) / scrollable body / sticky footer (Cancel ghost + submit primary/ai) | Footer stays pinned while body scrolls; submit shows async state |
| **Confirm dialog** (deletes, re-extract, regenerate, logout) | 420px, icon medallion top-left (48px tinted circle per variant), title serif title-lg, message `body-base` muted | Confirm button colored by risk: destructive solid rose / warning amber-solid / AI actions amber; Cancel = outline. Loading state disables both |
| **Gate dialog** (ApiKeyRequired) | 520px, checklist of 4 providers with Active/Missing rows (mono counts), primary CTA → Profile | Replaces today’s version 1:1 functionally |
| **Sheet** (mobile nav, mobile filters) | Edge-slid panel, spring physics, drag-to-dismiss optional | §13 |
| **Progress dock** (AI jobs) | NOT a modal — see §15 | Non-blocking by design |

Rules: max one dialog stack deep (confirm-over-form allowed); scrim per §2.5; entrance scale 0.97→1 + fade 180ms, exit 140ms reverse; body scroll locks.

---

## 12. Badge & Status Styles

Three badge grammars — all include text (color never alone):

1. **Dot-badge** (live states): status dot (8px, token color, pulse when in-progress) + label. Used for indexing/extraction/generation.
2. **Pill-badge** (classifications): `radius-full`, tinted bg 10%, token-colored text + matching hairline border, optional leading Lucide glyph 12px. Subject pills, marks-source badges, visibility badges.
3. **Count-chip** (mono data): neutral muted bg, mono meta font — `4/4 keys`, `Q3`, `120 chunks`.

Tint recipes per token: bg = color @ 10–12% alpha, text = color (contrast-corrected shade in light mode), border = color @ 25%.

Status → glyph mapping (fixed vocabulary): Indexed=Database · RAG-ready=CheckCircle2 · Extracting/Generating=Sparkles · Failed=AlertCircle · In-progress=Loader2 spin · Community=Globe · Private=Lock · PDF/export=FileDown · Verified/UserModified=UserCheck · AI-estimated=Wand2.

---

## 13. Navigation & Sidebar Design

Replaces the pill navbar. Desktop-first sidebar + slim top bar; the audit’s URL-router recommendation is assumed as shell foundation.

### Desktop ≥1024px — “The Stacks”

- **Left sidebar 264px** (collapsible to 72px icon rail; state persisted): brand block (wordmark + “AI Study Engine” micro-tag), then grouped nav:
  - **LIBRARY** — Resources (`BookOpen`), Question Banks (`FileText`)
  - **WORKSPACE** — Question Review (`Layers`), Solutions (`FileCheck2`)
  - **COMMONS** — Community Hub (`Globe`) — public, always visible
  - Bottom zone: **Profile & Keys** (`KeyRound`) with live key-status chip (`4/4` mono count-chip, success/warning dot), user row (avatar monogram + name + logout icon w/ confirm).
- Active item: teal 10% tint bg + 3px inset-left teal bar + foreground text; hover = muted wash. Motion: layoutId sliding indicator (Motion) on group-level container.
- **Pipeline wayfinding:** tiny numbered dots (①–⑤) beside Library/Workspace items echoing upload→extract→review→solve→export order.
- **Top bar 60px:** current page title (title-sm) + contextual actions right (theme toggle, ⌘K search placeholder, notifications-future). Transparent over canvas with hairline bottom rule on scroll.

### Tablet 768–1023px

Persistent 72px icon rail w/ tooltips; labels appear as expanded popover on hover/focus.

### Mobile <768px

- Top app bar: menu button, wordmark, avatar.
- Hamburger opens left Sheet drawer with full labeled nav (spring slide-in, scrim).
- Sticky bottom action bars (Generate/Export) become full-width footed bars respecting safe-area insets; content gets bottom padding via layout, not ad-hoc `pb-24`.

### Guest mode

Sidebar collapses to minimal: Community Hub only + prominent Sign In / Get Started block; landing page carries marketing nav instead.

---

## 14. Empty / Loading / Error States

### Empty states

- Composition: 56px tinted icon medallion (subject-appropriate Lucide) → serif `display-lg` headline (existing good microcopy preserved: “No Study Resources Found”, “Upload First Resource”, etc.) → one-sentence explanation (`body-base` muted, max 40ch) → single CTA (primary or ai variant).
- Variants: *first-run* (big, centered, illustrative), *no-search-results* (“No matches for ‘x’” + Clear-filters ghost button), *filtered-out* (inline within toolbar context).
- Community empties double as invitations (“Be the first to share…”).

### Loading states

- **Skeletons everywhere lists render** — geometry-matched to final cards/rows/tiles (shimmer = muted→card gradient sweep, 1.4s loop). No spinner-only screens.
- **Stat tiles:** skeleton numerals; **reading surfaces:** 3-line text skeleton blocks.
- Buttons own their inline spinners (§7); page-level route transitions use top-edge progress hairline (teal) only for navigations that trigger fetches.
- Per-item async (indexing/extracting/retrying) keeps the audit-preserved per-id maps: card-local badge + disabled actions, never whole-page locks.

### Error states

- **Toast** (sonner-style, bottom-right desktop / top mobile) for transient failures: destructive accent bar, title + one-line detail from API `detail` field, optional Retry action. Auto-dismiss 6s; errors persist until acted on.
- **Inline field errors** for form validation (§8).
- **Panel error state** replaces list content when a fetch fails wholesale: AlertTriangle medallion, headline “Couldn’t load your resources”, detail line, Retry primary button.
- **Failed AI answer** keeps its in-card retry affordance (destructive inset panel).
- Every error names the recovery action; no dead-end alerts.

---

## 15. AI Processing States

Principle: **honest, visible, non-blocking.** The fake-timer modal is retired; the real `/answer-sets/{id}/progress` endpoint becomes the source of truth.

1. **Progress Dock (generation):** bottom-right docked card (or inline panel on the triggering page) — not a full-screen modal. Contains: amber spark medallion w/ gentle pulse, bank name, elapsed timer (mono), determinate bar when backend reports counts, staged checklist (Retrieving from Qdrant → Drafting with model router → Academic review → Compiling set) with idle/spinner/check step states driven by polled progress. Minimizes to a chip in the top bar; completion raises a success toast + auto-navigates per existing behavior.
2. **Extraction/Indexing:** same staged checklist component, contextualized copy, but rendered as card-local overlay on the entity card being processed (keeps per-id maps meaningful).
3. **Streaming/shimmer:** while an individual answer body populates, show amber-tinted shimmer lines inside the AnswerCard.
4. **AI badge grammar:** any content touched by AI carries the Wand2/Sparkles glyph in Manuscript Amber so provenance is scannable (matches marks-source and citation systems).
5. Failure mid-job → toast + panel retry; partial results remain viewable.

---

## 16. Motion & Animation Principles

Library split: **Motion** for orchestration/layout/list choreography; tw-animate-css for micro enter/exits. Everything token-driven:

| Token | Value | Use |
|---|---|---|
| `duration-instant` | 100ms | Hovers on small controls, ripples |
| `duration-fast` | 150ms | Button/card hovers, color fades |
| `duration-base` | 220ms | Dialogs, drawers, page enters |
| `duration-slow` | 320ms | Sheets, dock slide-up |
| `duration-deliberate` | 480ms | Landing hero reveals |
| `ease-standard` | cubic-bezier(0.2, 0, 0, 1) | Default |
| `ease-exit` | cubic-bezier(0.4, 0, 1, 1), duration ×0.7 | Exits faster than enters |
| spring (drawers/dock) | stiffness 400 · damping 40 | Positional physics |

Choreography rules:
- **Enter:** fade + translateY(8px→0); exits reverse and quicker.
- **Lists:** stagger 35ms/item, capped at 350ms total; layout animations via Motion for filter/search reorders (questions list reflow is the showcase moment).
- **Active nav indicator:** shared-layout sliding pill/bar.
- **Numbers:** stat figures count up once on mount (600ms, ease-out; skipped under reduced motion).
- **Ambient budget:** max ONE continuous ambient animation per viewport (e.g., progress pulse). The old floating orbs/pulse-slow background loops are cut from workspace pages; landing may run a single slow aurora wash ≤12s at low opacity.
- **Hover discipline:** transforms limited to translateY(±2px)/scale(1.02); nothing animates layout-affecting properties (width/height/top/left).
- **Reduced motion:** `useReducedMotion()` + CSS media query strip all transforms/loops; keep opacity fades ≤120ms; skeletons stop shimmering (static tint).

---

## 17. Responsive Strategy

Mobile-first, four canonical breakpoints (tested at 375 / 768 / 1024 / 1440):

| Range | Shell | Layout behavior |
|---|---|---|
| <768 mobile | Top app bar + Sheet drawer; sticky action footers w/ safe-area | 1-col lists; stat tiles stack 1-col (or 2-up ≥380px); tables → stacked rows; dialogs become full-bleed sheets from bottom; filters collapse into a Filter sheet |
| 768–1023 tablet | Icon rail sidebar | 2-col card grids; split views allowed (list + preview); dialogs centered |
| 1024–1439 desktop | Full sidebar | 3-col card grids; reading measure capped; command palette viable |
| ≥1440 wide | Sidebar + content-max 1280 | Grids cap at 4-col; extra space goes to margins, never stretched cards |

Touch: all interactive targets ≥44×44px on coarse pointers (hit-slop padding on icon buttons). No hover-only affordances on touch — reveal actions permanently or via overflow menu. Sticky bars always leave scroll insets so content is never permanently obscured.

---

## 18. Accessibility Rules

Target **WCAG 2.2 AA** (verified against skill UX guidance):

1. **Contrast:** body text ≥4.5:1, large text/UI ≥3:1, in BOTH themes — dark-mode muted text is pre-tuned lighter than the old slate palette; verify composed badge tints, not just raw tokens.
2. **Focus:** `focus-visible` = 2px `--ring` + 2px offset everywhere; never removed. Focus order matches visual order.
3. **Keyboard completeness:** every flow operable by keyboard — dialogs trap+restore focus, menus arrow-navigable, dropzones have button alternative, ⌘K palette (future) fully listed.
4. **Semantics:** landmarks (`nav/main/header`), skip-to-content link, headings hierarchical per page; icon-only controls get `aria-label`; decorative icons `aria-hidden`.
5. **Status & live regions:** toasts and AI-job completion announced via polite live region; busy states use `aria-busy`; badges pair glyph+text with color (never color alone).
6. **Forms:** visible labels, `aria-describedby` for hints/errors, error summary focuses first invalid field on submit (multi-error), errors persist until resolved.
7. **Math:** KaTeX keeps its MathML twin for screen readers — the current CSS that visually clips `.katex-mathml` must be re-done accessibly (visual-hide without removing from AT tree).
8. **Motion & preference:** reduced-motion honored globally (§16); theme respects `prefers-color-scheme` default with manual override.
9. **Targets:** ≥44px touch targets (§17); drag/gesture alternatives provided.
10. **Auth:** login/register allow paste + password managers (no blocking of either).

---

## 19. Iconography Rules

- **Single family: Lucide.** Stroke width locked at 1.75px across the product (set via component wrapper default). No Phosphor/Heroicons mixing, no emoji glyphs anywhere (the 👋 in today’s logout banner gets replaced with an icon + copy).
- **Sizes (tokens):** `icon-xs` 14 (inline meta, badges) · `icon-sm` 16 (buttons/inputs/menu items) · `icon-md` 20 (nav, card headers) · `icon-lg` 24 · `icon-xl` 32–56 only inside empty-state medallions.
- **Style discipline:** outline style everywhere; filled variants permitted ONLY for active nav state and status dots. One style per hierarchy level.
- **Semantic vocabulary fixed** (§12 mapping) — a glyph means one thing product-wide (Database always = vector-indexed; Sparkles always = AI action; Globe always = community/public).
- Provider “logos” (Gemini/Groq/OpenRouter/NVIDIA/OpenAI): neutral monogram chips (letterform in tinted square) — no unofficial brand art.
- Icons inherit `currentColor`; meaningful standalone icons require accessible names; alignment optically centered against text baseline.

---

## 20. Anti-Patterns to Avoid

Explicitly banned in AcademicStack UI:

1. ❌ **Purple-gradient chatbot aesthetic** (the researched generic “AI-Native” look: #7C3AED washes, chat bubbles, typing dots as decoration).
2. ❌ **Glassmorphism panels** (frosted blur surfaces as primary containers — scrim blur in dialogs only).
3. ❌ **Neon glows** outside the single sanctioned `--glow-ai` moment; the old `glow-indigo` box-shadow dies.
4. ❌ **Fake progress timers** — any animation not driven by real backend state.
5. ❌ **Micro-text:** body <14px, any text <12px, `text-[10px]`-class labels.
6. ❌ **Emoji as structural icons.**
7. ❌ **Hardcoded colors** (`slate-950`, hex literals) in feature code — tokens only, enforced by review.
8. ❌ **Generic SaaS-admin dashboard look:** uniform gray KPI strips, three-equal-columns-of-nothing, decorative charts without data purpose.
9. ❌ **Blocking full-screen modals for long AI jobs** (must be dockable/minimizable).
10. ❌ **Spinner-only loading** / layout shift on data arrival (no skeletons = not done).
11. ❌ **Raw unstyled native selects/checkboxes/file inputs** in primary flows.
12. ❌ **Color-only status communication.**
13. ❌ **Ambient loop spam** (>1 continuous animation per viewport; parallax excess; autoplaying media).
14. ❌ **Serif misuse:** serif in form controls, buttons, tables, or multiple serif families per screen.
15. ❌ **Hover-only discoverability** on touch devices; tooltips as the only label for icon actions.
16. ❌ **Zebra-stripe dense tables with tiny mono bodies** (print-folio look applies to metadata, not full datasets).

---

## Appendix A — 21st.dev Component Sourcing Map

Pull inspiration/patterns from 21st.dev’s shadcn-compatible blocks, then re-token into this system (never vendor styles verbatim):

| Need | Source pattern (21st.dev / shadcn ecosystem) | Adaptation |
|---|---|---|
| App shell nav | shadcn Sidebar (collapsible, groups, footer user) | + pipeline numbering, key-status chip, Motion indicator |
| Stat dashboards | Bento grid stat tiles | serif figures, mono meta labels |
| Upload flows | Dropzone file-upload blocks | PDF-only validation chip, visibility radio-cards |
| Lists/tables | Data-table + list-row hybrids | stacked-row mobile degradation |
| Toasts | Sonner | token-mapped variants, API-detail messages |
| Confirmations | AlertDialog block | risk-colored confirms, icon medallions |
| Mobile nav/filters | Sheet | spring physics per §16 |
| Command search | cmdk command menu | Phase-later enhancement, ⌘K |
| Loading | Skeleton + shimmer-text patterns | geometry-matched sets |
| AI states | AI loader/shimmer/thinking blocks | amber-provenance grammar (§15) |
| Progress | Stepper/timeline blocks | real `/progress` binding |
| Rich content | Markdown renderer wrappers | existing remark/rehype pipeline preserved |

## Appendix B — Token Wiring (Phase 0 target)

All §2 values land as CSS variables consumed through Tailwind v4 `@theme inline` (pattern already present in `index.css`, currently unused by markup):

```css
:root {
  --background: oklch(0.977 0.004 95);
  --foreground: oklch(0.22 0.02 258);
  --card: oklch(1 0 0);
  /* …full §2 sets… */
  --radius: 0.75rem;
}
.dark { /* Midnight Library set */ }

@theme inline {
  --color-background: var(--background);
  --color-primary: var(--primary);
  --font-sans: 'Geist Variable', ui-sans-serif, system-ui, sans-serif;
  --font-serif: 'Fraunces Variable', 'Playfair Display', Georgia, serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  /* radius scale derived from --radius */
}
```

Enforcement: feature code uses semantic utilities only (`bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-accent`…). Any literal `slate-*`/hex in `src/features/**` fails review.

---

*End of design system. Implementation has NOT started — no application pages, stores, routes, or API logic were modified. Next step upon approval: Phase 0 foundation (tokens + primitives), per AUDIT_REPORT.md §K.*





