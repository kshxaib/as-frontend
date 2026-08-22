# AcademicStack Frontend — Full Audit Report

> **Audit date:** August 23, 2026
> **Scope:** Complete frontend codebase audit (`as-frontend`) + backend API cross-check (`as-backend`)
> **Status:** READ-ONLY AUDIT — no source files were modified, deleted, renamed. No packages installed. No redesign performed. This document is the only file created.
>
> Every source file was read: all 16 components, both Zustand stores, the API client, `index.css`, `App.jsx`, `main.jsx`, config files (`package.json`, `components.json`, `vite.config.js`, `jsconfig.json`, `eslint.config.js`), `.opencode/`, `public/`, `assets/`, and the FastAPI backend route definitions (`as-backend/app/**/routes.py`) for API-contract verification.
>
> **Goal:** Redesign the entire UI while preserving all currently working functionality and API integrations.

---

## Table of Contents

- [A. Current Architecture](#a-current-architecture)
- [B. Route/Page Inventory](#b-routepage-inventory)
- [C. Component Inventory](#c-component-inventory)
- [D. API Integration Inventory](#d-api-integration-inventory)
- [E. State/Store Inventory](#e-statestore-inventory)
- [F. Current UI Problems](#f-current-ui-problems)
- [G. Components Worth Keeping](#g-components-worth-keeping)
- [H. Components That Should Be Rebuilt](#h-components-that-should-be-rebuilt)
- [I. Technical Debt](#i-technical-debt)
- [J. Recommended UI Architecture](#j-recommended-ui-architecture)
- [K. Recommended Redesign Order](#k-recommended-redesign-order)
- [L. Files Modified Per Phase](#l-files-modified-per-phase)

---

## A. Current Architecture

### Directory Tree

```
as-frontend/
├── index.html                 # KaTeX CDN link + hardcoded slate body classes
├── package.json
├── vite.config.js             # @ alias → ./src, react plugin, @tailwindcss/vite
├── components.json            # shadcn config: style "base-nova", tsx:false, neutral baseColor
├── jsconfig.json              # paths: "@/*" → "./src/*"
├── eslint.config.js           # flat config, react-hooks + react-refresh plugins
├── public/
│   ├── favicon.svg            # used (index.html)
│   └── icons.svg              # UNUSED anywhere
├── .opencode/                 # Agent skills only (design/banner/slides/ui-ux-pro-max
│                              #   data + scripts) — build tooling, NOT app code.
│                              #   No project-specific design docs found.
└── src/
    ├── main.jsx               # React root (StrictMode)
    ├── App.jsx                # Tab switcher + global modals (NO router)
    ├── index.css              # Tailwind v4 + shadcn theme vars + KaTeX/markdown styles
    ├── api/
    │   └── client.js          # Axios instance + JWT request interceptor
    ├── lib/
    │   └── utils.js           # cn() helper (clsx + tailwind-merge)
    ├── assets/
    │   ├── hero.png           # UNUSED
    │   ├── react.svg          # UNUSED
    │   └── vite.svg           # UNUSED
    ├── store/
    │   ├── useAuthStore.js         # auth + 5-provider key CRUDs (232 lines)
    │   └── useQuestionBankStore.js # EVERYTHING ELSE — one 502-line god-store
    └── components/
        ├── ui/
        │   └── button.jsx      # Only shadcn/Base UI component — NEVER IMPORTED
        ├── Navbar.jsx             # Top nav, tab pills, key-status badge, logout confirm
        ├── LandingPage.jsx        # Hero + features + footer (+ ~120 lines dead code)
        ├── ResourceManager.jsx    # Resources CRUD + indexing + upload modal (inline)
        ├── QuestionBankManager.jsx# QB CRUD + extraction + upload modal (inline)
        ├── QuestionReview.jsx     # Stats dashboard + filters + QuestionCard list
        ├── SolutionViewer.jsx     # Answer sets + AnswerCard list + PDF/share
        ├── CommunityHub.jsx       # Public browse (guest-accessible)
        ├── ProfileSettings.jsx    # User info + 5 provider key cards
        ├── AuthModal.jsx          # Login/Register modal
        ├── ApiKeyRequiredModal.jsx# "4 keys required" gate modal
        ├── AiProgressModal.jsx    # FAKE staged progress (hardcoded 3.2s timers)
        ├── ConfirmationModal.jsx  # Generic confirm dialog
        ├── QuestionCard.jsx       # Editable question row
        ├── AnswerCard.jsx         # Markdown/KaTeX answer + citations + retry
        └── AddQuestionModal.jsx   # Manual question entry
```

### Key Architectural Facts

1. **Navigation is not URL-based.** The `activeTab` string lives in Zustand; `App.jsx` conditionally renders pages. No deep links, no browser back button support, no refresh persistence of the current view.

2. **shadcn / Base UI / Nova stack is installed but 100% unused.** Git status confirms `components.json`, `src/components/ui/button.jsx`, `jsconfig.json`, the Vite `@` alias, and the `@theme inline` block were just added — but zero existing components import them. Every component hand-rolls raw `<button>`, `<input>`, `<select>`, and `<div>`-based modals.

3. **Design system exists in CSS but is ignored by markup.** `index.css` defines full oklch token sets (`--background`, `--card`, `--primary`, `--radius`, sidebar/chart scales, both `:root` light and `.dark` palettes) via `@theme inline` mapping — yet every component hardcodes `slate-950`, `slate-900/60`, `indigo-600`, etc. Dark mode is effectively hardwired; the `.dark` class variant is defined but never toggled by any logic.

4. **KaTeX CSS is loaded twice** — a CDN `<link>` (`katex@0.16.11`) in `index.html` AND `@import "katex/dist/katex.min.css"` in `index.css`. Duplication/conflict risk; npm version is `katex@^0.18.4`.

5. **Fonts:** Geist Variable via `@fontsource-variable/geist`; mapped as `--font-sans` / `--font-heading` in `@theme`.

6. **`.opencode/` contents:** skills only (`banner-design`, `brand`, `design`, `design-system`, `slides`, `ui-styling`, `ui-ux-pro-max`) with CSV data catalogs and Python/CJS scripts — agent design tooling, not application code.

7. **Git state at audit time:** recent history shows feature commits building the app; working tree has uncommitted migration-in-progress work:
   - Modified: `package.json`, `package-lock.json`, `src/index.css`, `vite.config.js`
   - Untracked: `.opencode/`, `components.json`, `jsconfig.json`, `src/components/ui/`, `src/lib/`

8. **Stack declared vs. actually used:**

   | Stack item | Status |
   |---|---|
   | React 19 | Used |
   | Vite 8 | Used |
   | JavaScript (JSX) | Used |
   | Tailwind CSS v4 (`@tailwindcss/vite`) | Used (but theme tokens ignored by markup) |
   | shadcn (`base-nova` style, `components.json`) | Configured, NOT adopted |
   | Base UI (`@base-ui/react`) | Installed, only referenced inside unused `ui/button.jsx` |
   | Lucide icons | Used extensively |
   | Motion (`motion` package v13) | Installed, NEVER imported anywhere |
   | UI UX Pro Max (skill data in `.opencode/`) | Available as tooling, not applied |

---

## B. Route/Page Inventory

There is **no router library** (`react-router` etc. is absent from `package.json`). Navigation is a tab system driven by the `activeTab` string in Zustand:

| Tab id (`activeTab`) | Page component | Auth required | Purpose |
|---|---|---|---|
| *(none — guests)* | `LandingPage` | No (guests only) | Marketing hero, feature grid, footer; shown when unauthenticated and not on community tab |
| `resources` | `ResourceManager` | Yes | Upload/index/delete/share study PDFs |
| `question_banks` | `QuestionBankManager` | Yes | Upload QB papers, AI extract questions, download originals |
| `review` | `QuestionReview` | Yes | Review/edit extracted questions, tune marks, trigger answer generation |
| `solutions` | `SolutionViewer` | Yes | View/regenerate answers, export solved PDF, share to community |
| `community` | `CommunityHub` | **No — public** | Browse/download community-shared resources & solved question banks |
| `profile` | `ProfileSettings` | Yes | Account info + multi-provider API key management |

### Rendering Logic in `App.jsx`

- `showApp = isAuthenticated || activeTab === 'community'`
- Guests see `LandingPage` except on the community tab.
- Protected tabs render only when `isAuthenticated`; there is a safety net that falls back to `LandingPage`.
- Logout transition detection (`prevAuth` → `isAuthenticated`) sets `justLoggedOut` for 5 seconds → landing page shows a signed-out notice and resets tab to `resources`.
- Global overlays always mounted: `AuthModal`, `ApiKeyRequiredModal`.
- Navbar clicking a protected tab while logged out calls `openAuthModal('login')` instead of navigating.
- Page transitions use only the `animate-fade-in` CSS class on wrapper divs.

---

## C. Component Inventory

| Component | Lines | Self-contained? | Notes |
|---|---|---|---|
| `Navbar.jsx` | 197 | Yes | Desktop pill nav + mobile horizontal-scroll strip; API-keys status badge ("Keys Ready (4/4)" / "Setup Keys (n/4)"); user avatar pill; logout via ConfirmationModal |
| `LandingPage.jsx` | 317 | Yes | Hero + CTAs, social-proof strip, 6 FeatureCards grid, footer; contains `GradientOrb`, `FeatureCard`, `Step`, `TierCard` sub-components — **`Step` and `TierCard` are defined but never rendered (dead code)** |
| `ResourceManager.jsx` | 457 | Yes | Header, alert banners, search + subject filter bar, resource card grid (status pills: Uploaded / Vectorizing / Indexed / Failed), inline upload modal (title/subject/chapters/description/visibility/PDF file), delete confirm, AiProgressModal for indexing |
| `QuestionBankManager.jsx` | 376 | Yes | Same layout patterns as ResourceManager; upload modal includes resource-linking checkbox list; AI Extract / Re-extract buttons with confirm; Review & Solve navigates to review tab; download original paper |
| `QuestionReview.jsx` | 411 | Yes | QB switcher select, extract/re-extract + add-question buttons, 4 stat cards (Total Questions, Total Marks, Marks Source breakdown explicit/AI/user-modified, Linked Resources), search + marks filter pills + source filter select, QuestionCard list, sticky bottom "Approve & Generate Answers" bar with ping dot, two ConfirmationModals, two AiProgressModals |
| `SolutionViewer.jsx` | 387 | Yes | Bank switcher select + quick bank tabs strip, Download Solved PDF / Share with Community / Regenerate buttons, 3 stat cards (Solved count, Total Solved Marks, AI Quality Check), search, AnswerCard list, regenerate confirm, AiProgressModal; 4 chained useEffects for data hydration; early-return empty state when no banks exist |
| `CommunityHub.jsx` | 285 | Yes | Public page; sub-tabs (Public Notes & Textbooks / Solved Question Banks) with counts, search + subject filter, resource card grid + solved-set card grid with per-card PDF download, refresh button |
| `ProfileSettings.jsx` | 495 | Yes | Guest sign-in gate view; Profile Details card (name/username/member since); required-keys progress banner (n/4); data-driven array of 5 provider cards (Gemini, Groq, OpenRouter, NVIDIA NIM, OpenAI optional); per-provider key input w/ show-hide toggle, format validation, save/update/delete actions, get-key external links; delete key ConfirmationModal |
| `AuthModal.jsx` | 172 | Yes | Login/Register mode tabs, name/username/password fields, error banner, submit states; hand-rolled overlay (no focus trap) |
| `ApiKeyRequiredModal.jsx` | 102 | Yes | Gate modal listing 4 required keys with Active/Missing status per key, configured count, "Add Missing Keys in Profile" CTA navigating to profile tab |
| `AiProgressModal.jsx` | 169 | Yes | Simulated staged progress for extraction/generation/indexing — hardcoded step definitions, 3.2s interval step advancement, elapsed-seconds counter, animated current/done/pending states. **Not connected to any real progress source** |
| `ConfirmationModal.jsx` | 126 | Yes | Generic reusable dialog: props `isOpen/title/message/confirmText/cancelText/confirmVariant(primary|danger|warning|emerald)/iconType(alert|trash|sparkles|logout|refresh)/isLoading/onConfirm/onCancel`; used 8× across app — the most consistently reused component |
| `QuestionCard.jsx` | 192 | Yes | Inline edit mode (textarea + custom marks number input), quick-marks presets (2/5/10), marks-source badge (Explicit / AI Estimated / User Verified), delete confirm modal |
| `AnswerCard.jsx` | 186 | Yes | Collapsible answer card; header Q-number chip, marks badge, status (Generated via RAG / Generation Failed); failed state with inline retry button; Markdown rendering pipeline (react-markdown + remark-gfm + remark-math + rehype-katex) fed through `formatMarkdownMath()` normalizer (7 regex passes fixing `$...$`, `$$...$$`, `\[...\]`, `\(...\)`, bracketed LaTeX environments, broken line splits, excessive newlines); numbered source citations (resource_name, page, chapter); regenerate ConfirmationModal |
| `AddQuestionModal.jsx` | 112 | Yes | Manual question entry: textarea + marks presets (2/5/10) + custom number input |
| `ui/button.jsx` | 57 | Yes | Base UI Button primitive + cva variants (default/outline/secondary/ghost/destructive/link; sizes default/xs/sm/lg/icon/icon-xs/icon-sm/icon-lg). **Orphaned — imported nowhere** |

### Duplication Map (copy-paste patterns across components)

- Alert banners (error/success): duplicated nearly identically in `ResourceManager`, `QuestionBankManager`, `QuestionReview`, `SolutionViewer` (+ local variants in `ProfileSettings`)
- Search input with leading icon: ×6 occurrences
- Upload modals (form + overlay): 2 near-identical implementations
- Stat-card shells: ×7 across QuestionReview/SolutionViewer
- Card shell (`rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm`): ×4 grids
- Spinner loading block (`RefreshCw animate-spin` centered): ×5

---

## D. API Integration Inventory

### Client Configuration (`src/api/client.js`)

- Axios instance; `baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'`
- Request interceptor attaches `Authorization: Bearer <token>` from `localStorage.academicstack_token`
- Response interceptor is a pass-through (no 401 handling, no global error normalization)

### Endpoints Used by the Frontend

**Auth (`useAuthStore`, consumed by Navbar/AuthModal/ProfileSettings):**

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | body `{username, password, name}` → `{access_token, user}` |
| POST | `/auth/login` | body `{username, password}` → `{access_token, user}` |
| GET | `/auth/me` | session init on app mount |
| PUT | `/auth/profile/gemini-key` | body `{gemini_api_key}` |
| DELETE | `/auth/profile/gemini-key` | remove key |
| PUT / DELETE | `/auth/profile/groq-key` | `{groq_api_key}` |
| PUT / DELETE | `/auth/profile/openrouter-key` | `{openrouter_api_key}` |
| PUT / DELETE | `/auth/profile/nvidia-key` | `{nvidia_api_key}` |
| PUT / DELETE | `/auth/profile/openai-key` | `{openai_api_key}` (optional backup) |

**Resources (`ResourceManager`, `CommunityHub`):**

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/resources?user_id={id}` | list (user_id optional filter) |
| POST | `/resources` | multipart form: `user_id, name, subject, chapters?, description?, visibility(private|community), file(PDF)` |
| POST | `/resources/{resource_id}/index` | Qdrant vector indexing → `{chunks_indexed}` |
| DELETE | `/resources/{resource_id}` | deletes resource + embeddings |
| GET | `/resources/{resource_id}/download` | blob download of original PDF |

**Question Banks & Questions (`QuestionBankManager`, `QuestionReview`, `QuestionCard`, `AddQuestionModal`):**

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/question-banks?user_id={id}` | list |
| POST | `/question-banks` | multipart: `user_id, name, subject, resource_ids(comma-joined), file(PDF)` |
| GET | `/question-banks/{id}` | single bank detail |
| POST | `/question-banks/{id}/extract` | AI question extraction |
| GET | `/question-banks/{id}/questions` | extracted questions list |
| POST | `/question-banks/{id}/questions` | add manual question `{question_text, marks}` |
| GET | `/question-banks/{id}/download` | original paper PDF blob |
| PUT | `/questions/{questionId}` | edit `{question_text?, marks?}` |
| DELETE | `/questions/{questionId}` | remove question |

**Answers & Solutions (`SolutionViewer`, `AnswerCard`):**

| Method | Endpoint | Notes |
|---|---|---|
| POST | `/answer-sets/generate` | body `{question_bank_id}` → full answer set |
| GET | `/answer-sets/{answerSetId}` | full set with answers |
| GET | `/question-banks/{id}/answer-sets` | sets list for a bank |
| POST | `/answers/{answerId}/retry` | regenerate one answer |
| GET | `/answer-sets/{answerSetId}/pdf` | solved-paper PDF blob export |

**Community (`CommunityHub`, share toggles):**

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/community/resources` | public resources feed |
| GET | `/community/answer-sets` | public solved sets feed |
| POST | `/community/resources/{resourceId}/share` | toggle visibility private↔community |
| POST | `/community/answer-sets/{answerSetId}/share` | toggle visibility |

### Backend Endpoints NOT Used by the Frontend

| Endpoint | Observation |
|---|---|
| `GET /api/answer-sets/{id}/progress` | **Real-time generation progress exists but the UI fakes progress instead** (AiProgressModal hardcoded timers) |
| `GET /api/resources/{resource_id}` | single-resource fetch unused |
| `POST /api/users`, `GET /api/users/{user_id}` | user admin routes unused |

### API Contract Notes / Risks

1. **`user_id || 1` fallback bug:** `formData.append('user_id', user?.id || 1)` in both upload flows — a guest edge case would attribute uploads to user 1. Backend auth is actually JWT-based; the `user_id` param is redundant.
2. **No response error normalization:** every consumer repeats `err.response?.data?.detail || '<fallback string>'`.
3. **No request cancellation** on unmount/tab switch; no retry/backoff.
4. Blob-download logic (createObjectURL → anchor click → revoke) duplicated ×4 in the store + 1 unused variant.

---

## E. State/Store Inventory

### `useAuthStore` (Zustand)

State:
- `user` — profile object incl. flags `has_gemini_key`, `has_groq_key`, `has_openrouter_key`, `has_nvidia_key`, `has_openai_key`, plus `name`, `username`, `created_at`
- `token`, `isAuthenticated` — hydrated synchronously from localStorage at store creation
- `isLoading`, `error`
- Modal state: `isAuthModalOpen`, `authModalMode ('login'|'register')`

Actions:
- `initAuth()` — validates stored token via `/auth/me`; clears token on failure
- `login(username, password)`, `register(username, password, name)` — persist token to localStorage, close modal
- `logout()` — clear token + state
- Key management ×10: `updateGeminiKey/deleteGeminiKey`, `updateGroqKey/deleteGroqKey`, `updateOpenRouterKey/deleteOpenRouterKey`, `updateNvidiaKey/deleteNvidiaKey`, `updateOpenAIKey/deleteOpenAIKey` — ten near-identical functions (boilerplate)
- `clearError()`

### `useQuestionBankStore` (Zustand — god-store, 502 lines)

| Domain | State | Actions |
|---|---|---|
| Navigation | `activeTab` ('resources' \| 'question_banks' \| 'review' \| 'solutions' \| 'community' \| 'profile') | `setActiveTab` (also clears feedback) |
| Key gate modal | `isKeyModalOpen`, `keyModalFeature` | `triggerKeyModal(featureName)`, `closeKeyModal` |
| Feedback (global singleton) | `error`, `successMessage` | `clearFeedback` |
| Resources | `resources[]`, `isLoading`, `isUploadingResource`, `isIndexingResource {id:boolean}` | `fetchResources`, `uploadResource(formData)`, `indexResource(id)` (gated by key check), `deleteResource(id)` |
| Question banks | `questionBanks[]`, `currentQuestionBank`, `isUploadingQuestionBank`, `extractingQBs {id:boolean}` | `fetchQuestionBanks` (auto-selects first bank), `uploadQuestionBank(formData)`, `selectQuestionBank(id)` (parallel fetch bank+questions+answer-sets, then hydrates latest answer set), `extractQuestions(id)` (key-gated) |
| Questions | `questions[]`, `isSavingQuestions` (unused) | `updateQuestion(id, payload)`, `addQuestion(bankId, payload)`, `deleteQuestion(id)` |
| Answers | `currentAnswerSet`, `answerSetsList[]`, `isGeneratingAnswers`, `isRetryingAnswer {id:boolean}` | `generateAnswers(bankId)` (key-gated; auto-navigates tab→solutions), `retryAnswer(answerId)` (key-gated) |
| Downloads | — | `downloadSolvedPdf` (**defined TWICE — line 347 and line 405; second silently overwrites first**), `downloadResourceFile`, `downloadQuestionBankFile`, `downloadDirectPdf(url,…)` (**never called by any component**) |
| Community | `communityResources[]`, `communityAnswerSets[]`, `isLoadingCommunity` | `fetchCommunityFeed` (+alias `fetchCommunityData`), `toggleResourceShare`, `toggleAnswerSetShare` |

Helpers:
- `hasAllRequiredKeys()` — requires ALL of Gemini + Groq + OpenRouter + NVIDIA (used as gate before index/extract/generate/retry)
- `hasEmbeddingKey()` — Gemini or OpenAI; **defined but never used**

### State Management Observations

1. No server-cache library (React Query/SWR); all fetching ad-hoc in component effects.
2. Refetch storms: `fetchResources`/`fetchQuestionBanks` re-run on every mount across multiple pages (e.g., both QBManager and QuestionReview fetch banks).
3. Global single-slot `error`/`successMessage` causes cross-page leakage; auto-dismiss timers exist only in QuestionReview/SolutionViewer (4s), not elsewhere.
4. Per-item async maps (`isIndexingResource`, `extractingQBs`, `isRetryingAnswer`) are a good pattern worth preserving.
5. `setActiveTab` doubles as navigation + feedback reset — conflates concerns.
6. Cross-store coupling: QBStore reads AuthStore via `getState()` inside actions.

---

## F. Current UI Problems

1. **Two competing design systems.** shadcn oklch tokens exist in `index.css` but every pixel is hardcoded slate/indigo utility classes → theming, light mode, or brand changes require mass edits.
2. **Monolithic page components** (300–500 lines each) mixing layout, forms, modals, banners, and cards — heavy duplication (alert banners ×5 files, search inputs ×6, upload modals ×2, stat-card shells ×7, card shells ×4).
3. **Fake progress UX.** `AiProgressModal` runs hardcoded 3.2s/step animations while the backend exposes a real `/answer-sets/{id}/progress` endpoint — misleading during long AI generations.
4. **Typography too small everywhere.** `text-xs` is the de-facto body size; frequent `text-[11px]` and `text-[10px]` — poor readability/accessibility.
5. **Inconsistent spacing & radius language.** `rounded-lg/xl/2xl/3xl` mixed arbitrarily; alert styles differ slightly between pages (e.g., `text-xs` vs `text-sm`, backdrop-blur variants).
6. **No toast system.** Success/error rendered as full-width stacked banners with manual Dismiss buttons; auto-dismiss inconsistent (only 2 of 6 pages); stale errors can persist across tab switches.
7. **Accessibility gaps:** hand-rolled div-modals without focus trap / ESC handling / aria roles (`AuthModal`, both upload modals, `AddQuestionModal`); unstyled native `<select>`s; icon-only buttons relying on `title`; status communicated by color alone in several places.
8. **Branding inconsistencies:** footer reads "OpenAI Edition"; SolutionViewer loading text says "Generating & Reviewing Answers with OpenAI…" while the actual stack is a Gemini/Groq/OpenRouter/NVIDIA multi-provider pipeline.
9. **Dead weight shipped to users:** unused `ui/button.jsx`, unused `motion` dependency, unused assets (`hero.png`, `react.svg`, `vite.svg`, `public/icons.svg`), ~150 lines dead code in LandingPage (`TierCard`, `Step`, zero-alpha `glow` values), duplicate `downloadSolvedPdf` definition, unused store helpers.
10. **Mobile nav is an overflow scroll strip** — workable but cramped with 6 items; sticky bottom bar overlaps content, compensated ad-hoc with `pb-24` per page.
11. **No skeletons** — spinner-only loading causes jarring layout shifts on all list pages.
12. **Guest UX friction:** landing CTAs and navbar don't communicate the "4 free API keys" requirement until the user is blocked mid-flow by `ApiKeyRequiredModal`.
13. **KaTeX display styling via `!important` overrides** in CSS — brittle against katex version bumps (and double-loaded, see A.4).
14. **Hardcoded body classes in `index.html`** (`bg-slate-950 text-slate-100 …`) duplicate what `index.css` base layer should own.

---

## G. Components Worth Keeping

*(Logic preserved verbatim; visual layer may be reskinned onto new primitives.)*

| Asset | Why keep | Action |
|---|---|---|
| `ConfirmationModal` component design | Good generic prop API (variant/icon), used consistently ×8 | Port wrapper to Base UI AlertDialog |
| `AnswerCard.formatMarkdownMath()` regex pipeline | Battle-tested LaTeX/markdown normalization (7 passes) | Extract verbatim into `src/lib/mathFormat.js` |
| `ProfileSettings` `providers[]` config array + `validateKeyFormat()` | Clean data-driven model incl. per-provider placeholders, key URLs, descriptions, format rules | Keep model; rebuild presentation as `ProviderKeyCard` |
| All store action logic / API wiring | Works end-to-end; contracts proven | Preserve contracts while splitting stores |
| `AiProgressModal` concept | Right idea for long AI operations | Rewire steps to real `/progress` endpoint polling |
| Empty-state copy throughout | Genuinely good microcopy ("Upload First Resource", etc.) | Preserve wording in rebuilt empty states |
| Per-item async maps (`isIndexingResource`, `extractingQBs`, `isRetryingAnswer`) | Correct granular-loading pattern | Carry into new stores |
| `api/client.js` | Minimal, correct JWT interceptor | Keep; add 401 interceptor only |
| `lib/utils.js` (`cn`) | Standard, correct | Keep |

## H. Components That Should Be Rebuilt

| Target | Reason | New shape |
|---|---|---|
| All 6 page components (`ResourceManager`, `QuestionBankManager`, `QuestionReview`, `SolutionViewer`, `CommunityHub`, `ProfileSettings`) | Monolithic, duplicated patterns, hardcoded styling | Decompose into feature folders composed from shared primitives |
| `Navbar` | Cramped mobile strip, no motion indicator, tab-based not link-based | Responsive shell (drawer/sheet on mobile), Motion active-tab indicator, router links |
| `LandingPage` | ~150 lines dead code, static feel, glow props are no-ops | Rebuild hero/features with Motion choreography |
| `AuthModal` + both upload modals + `AddQuestionModal` | No focus management/ESC/aria; duplicated overlay code | Shared FormDialog built on Base UI Dialog primitives |
| `AiProgressModal` | Fake progress | Real progress source; keep staged-step UI concept |
| NEW shared layer required | Nothing reusable exists today except ConfirmationModal/button | Build `components/ui/*` (Button, Card, Dialog, Input, Select, Badge, Tabs, Skeleton, Toast, Tooltip, DropdownMenu) + `components/shared/*` (PageHeader, SearchFilterBar, StatCard, EntityCardShell, UploadModal, ConfirmDialog) |

---

## I. Technical Debt

1. **God-store:** `useQuestionBankStore` (502 lines) mixes navigation, modals, feedback, resources, banks, questions, answers, community, and downloads; contains a duplicate `downloadSolvedPdf` definition (lines 347 & 405).
2. **Dead code:** `TierCard`/`Step` in LandingPage; store's `hasEmbeddingKey()` and `downloadDirectPdf()`; `isSavingQuestions` state (never toggled); unused Lucide imports scattered across many files (e.g., `ExternalLink`, `Database`, `Award`, `HelpCircle`, `ChevronRight`, etc.).
3. **Uncommitted migration-in-progress** sitting in working tree (`components.json`, `ui/`, `lib/`, modified configs) — redesign should start from a clean commit.
4. **Double KaTeX load** (CDN 0.16.11 + npm ^0.18.4) plus `!important`-heavy katex overrides.
5. **No TypeScript / no PropTypes** — silent prop-shape bug risk during refactor.
6. **No router, no error boundaries, no 401 response interceptor, no request cancellation.**
7. **Data-integrity smells:** `user_id || 1` upload fallback; `selectQuestionBank(Number(e.target.value))` coercion.
8. **`shadcn` CLI package listed as a production dependency** (build tooling, not runtime); `motion` installed but unused.
9. **Refetch-on-every-mount effects** without caching/deduping.
10. **Docs debt:** README is untouched Vite boilerplate; `VITE_API_URL` env var undocumented.

---

## J. Recommended UI Architecture

```
src/
├── app/
│   ├── App.jsx                  # RouterProvider + Toaster + ErrorBoundary
│   └── routes.jsx               # URL routes (/login stays modal-over-any-route)
├── api/
│   ├── client.js                # unchanged (+401 interceptor)
│   ├── auth.api.js              # typed wrappers per domain — endpoints untouched
│   ├── resources.api.js
│   ├── questionBanks.api.js     # incl. questions
│   ├── answers.api.js           # incl. answer-sets, retry, pdf
│   └── community.api.js
├── stores/
│   ├── authStore.js             # session + provider keys only
│   └── uiStore.js               # modals/toast triggers/navigation state
│                                # (server data → TanStack Query optional/later)
├── components/
│   ├── ui/                      # shadcn Nova primitives: Button (exists), Card,
│   │                            # Dialog, Input, Textarea, Select, Checkbox,
│   │                            # Badge, Tabs, Skeleton, Toast/Sonner, Tooltip,
│   │                            # DropdownMenu, AlertDialog
│   └── shared/                  # PageHeader, AlertBanner→Toasts, SearchFilterBar,
│                                # StatCard, EntityCardShell, UploadModal(config-
│                                # driven), ConfirmDialog(wraps ui/dialog),
│                                # ProgressStages(real source), EmptyState
├── features/
│   ├── landing/                 # LandingPage + sections
│   ├── auth/                    # AuthDialog
│   ├── resources/               # page + ResourceCard + ResourceUploadModal
│   ├── question-banks/          # page + QBCard + QBUploadModal + LinkResourcesField
│   ├── review/                  # page + QuestionCard + AddQuestionModal + GenerateBar
│   ├── solutions/               # page + AnswerCard + citations + export bar
│   ├── community/               # page + SharedResourceCard + SolvedSetCard
│   └── profile/                 # page + ProviderKeyCard + ProfileInfoCard
├── lib/
│   ├── utils.js                 # cn() (existing)
│   ├── mathFormat.js            # extracted formatMarkdownMath()
│   ├── download.js              # unified blob-download helper
│   └── keyValidation.js         # per-provider key format rules
└── styles/
    └── tokens.css               # single oklch palette driving BOTH light & dark
```

### Architecture Principles

1. **Zustand for session/UI state only**; server interactions live behind `api/*.api.js` modules so the redesign never touches fetch logic or endpoint contracts.
2. **Every visual element consumes CSS variables** (`bg-background`, `text-foreground`, `border-border`) — zero hardcoded slate/indigo utilities in feature code.
3. **Motion for enter/orchestration animations; tw-animate-css for micro-states.**
4. **One toast system replaces all inline banners.**
5. **Modals = Base UI primitives** with proper focus trap, ESC close, aria attributes.
6. **Preserve all flows exactly:** upload → index → extract → review/edit → generate → retry → PDF export → share → community browse.

---

## K. Recommended Redesign Order

### Phase 0 — Foundation (no visible change yet)
- Commit or clean the pending shadcn scaffolding in the working tree.
- Remove dead code: LandingPage `TierCard`/`Step`, store duplicate `downloadSolvedPdf`, `downloadDirectPdf`, `hasEmbeddingKey`, unused imports, unused assets.
- Deduplicate KaTeX load (keep npm import, drop CDN link).
- Add 401 response interceptor + global ErrorBoundary.
- Generate full `components/ui/*` primitive set from the Nova registry.
- Define final token palette (proper light + dark) and bump base font scale.

### Phase 1 — App Shell
- Introduce router with a URL per tab (`/resources`, `/question-banks`, `/review`, `/solutions`, `/community`, `/profile`); login remains modal-over-any-route.
- Rebuild Navbar/sidebar shell with Motion active-tab indicator + mobile drawer.
- Toast system replacing inline alert banners; ConfirmDialog rebuilt on Base UI.
- Skeleton loading components for all lists.
- Verify all 6 tabs still render existing page content inside the new shell before touching pages.

### Phase 2 — Core Pipeline Pages (highest value)
Rebuild in flow order, decomposing into feature folders while preserving all API calls:
1. **ResourceManager** (+ ResourceUploadModal, ResourceCard)
2. **QuestionBankManager** (+ QBUploadModal incl. resource-linking field)
3. **QuestionReview** (+ QuestionCard, AddQuestionModal, sticky GenerateBar)
4. **SolutionViewer** (+ AnswerCard w/ citations, export bar)
5. Rewire **AiProgressModal** to real `/answer-sets/{id}/progress` polling.

### Phase 3 — Secondary Surfaces
- **ProfileSettings** (keep providers config array; rebuild as ProviderKeyCard list)
- **AuthModal** → AuthDialog on Base UI
- **ApiKeyRequiredModal** restyle
- **CommunityHub** rebuild

### Phase 4 — Landing & Polish
- Rebuild **LandingPage** (Motion hero choreography, remove dead code).
- Dark/light toggle wired to tokens.
- Responsive audit (all breakpoints) + accessibility pass (focus traps, aria labels, contrast, keyboard nav).
- End-to-end QA of every flow; README/env documentation.

---

## L. Files Modified Per Phase

### Phase 0
| Action | Files |
|---|---|
| Modify | `package.json` (deps only if separately approved), `src/index.css` (tokens), `index.html` (drop KaTeX CDN, meta/title), `src/store/useQuestionBankStore.js` (remove duplicate fn), `src/components/LandingPage.jsx` (dead-code removal only), import cleanup in all 16 components |
| Create | `src/components/ui/*` (~12 primitives), `src/lib/mathFormat.js`, `src/lib/download.js`, `src/lib/keyValidation.js` |
| Delete candidates | `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png`, `public/icons.svg` |

### Phase 1
| Action | Files |
|---|---|
| Create | `src/app/routes.jsx`, `src/components/shared/{ConfirmDialog, SearchFilterBar, Skeletons}`, toast system |
| Rewrite | `src/App.jsx`, `src/main.jsx` (router provider), `src/components/Navbar.jsx` |
| Modify | `src/store/useAuthStore.js` + split navigation out of `useQuestionBankStore.js` into uiStore; shell integration touches on all 6 page components (content unchanged) |

### Phase 2
| Action | Files |
|---|---|
| Create | `src/features/resources/**`, `src/features/question-banks/**`, `src/features/review/**`, `src/features/solutions/**` |
| Retire inline code from | `ResourceManager.jsx`, `QuestionBankManager.jsx`, `QuestionReview.jsx`, `SolutionViewer.jsx` (replaced by feature folders) |
| Evolve in place | `QuestionCard.jsx`, `AnswerCard.jsx`, `AddQuestionModal.jsx`, `AiProgressModal.jsx` (real progress source) |
| Modify | `src/api/client.js` (401 interceptor only — endpoints untouched) |

### Phase 3
| Action | Files |
|---|---|
| Rewrite | `ProfileSettings.jsx`, `AuthModal.jsx`, `ApiKeyRequiredModal.jsx`, `CommunityHub.jsx` into `src/features/{profile,auth,community}/**` |
| Wrap | `ConfirmationModal.jsx` becomes thin wrapper around `ui/dialog` |

### Phase 4
| Action | Files |
|---|---|
| Rewrite | `LandingPage.jsx` → `src/features/landing/**` |
| Final pass | `index.css` (tokens polish), `index.html`, `README.md` |
| Sweep | accessibility/responsive fixes across all Phase 1–3 files |

---

## Verification Checklist (functionality that MUST survive the redesign)

- [ ] Register / Login / Logout / session restore via `/auth/me`
- [ ] All 5 provider key save/delete flows + format validation + 4-of-4 gating badge
- [ ] Resource upload (multipart w/ visibility) → index (Qdrant) → delete → download original
- [ ] QB upload (multipart w/ resource_ids linking) → AI extract → re-extract confirm
- [ ] Question edit / quick-marks / add manual / delete
- [ ] Generate answers (key-gated, tab auto-nav to solutions) → per-answer retry
- [ ] Solved-PDF export (blob download w/ filename) ×3 contexts (own set, community set naming)
- [ ] Community feed browse (guest OK) + share toggles both directions
- [ ] Key-required gate modal triggers on index/extract/generate/retry when keys missing
- [ ] Empty states on every list; loading states; error banners

---

*End of audit report. No changes were made to any source file, configuration, backend file, or dependency during this audit.*





