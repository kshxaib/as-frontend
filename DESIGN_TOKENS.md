# AcademicStack — Design Token Reference

> **This is the single source of truth for the AcademicStack visual language.**
> Every redesign decision — color, type, spacing, radius, shadow, motion — must derive from or explicitly reference this document.
> Do not introduce arbitrary hex values, extra fonts, or secondary theme systems.

---

## § 0 — Core Design Principle

The AcademicStack interface derives its character from **four foundational elements only**:

```
TYPOGRAPHY  +  SPACING  +  EDITORIAL COMPOSITION  +  COLOR RESTRAINT
```

**Never** from:
- Gradients
- Glow effects
- Neon palettes
- Decorative AI illustrations
- Glassmorphism blur stacks
- Animated background blobs

The product must feel like **a premium digital research workstation** — not a generic AI SaaS template.

**Constraint rule:** If a visual decision makes AcademicStack look more like a generic AI dashboard, choose the quieter, editorial alternative.

---

## § 1 — Brand Identity

| Field | Value |
|---|---|
| **Product name** | AcademicStack |
| **Category** | Academic / Research Workspace |
| **Core concept** | *"From study material to solution manuscript."* |
| **Visual direction** | Editorial · Academic · Scholarly · Calm · Precise · Premium |

**Feels like:**
- A premium digital library
- A research workstation
- A modern university workspace
- An editorial reading environment
- A scholarly document system

**Must never feel like:**
- Generic AI SaaS
- Chatbot / AI playground
- Developer dashboard
- Cyberpunk interface
- Template-generated SaaS dashboard

---

## § 2 — Theme Names

| Theme ID | Display Name | Use |
|---|---|---|
| `light` | **Reading Room** | Light / day mode |
| `dark` | **Midnight Library** | Dark / night mode (primary) |

Themes are **not simple color inversions.** Each theme has intentionally designed semantic token values.

---

## § 3 — Color Palette — Named Scale

These are raw named palette values. **Do not use directly in components** — always go through semantic tokens.

### Teal (Scholar Teal — primary brand accent)
```
teal-500:  #14b8a6
teal-600:  #0d9488    primary action (dark theme)
teal-700:  #0f766e    primary action (light theme)
teal-950:  #042f2e
```

### Amber (Manuscript Amber — AI provenance ONLY)
```
amber-500: #f59e0b    AI accent (dark theme)
amber-600: #d97706    AI accent (light theme)
amber-700: #b45309
```

### Gold (Laurel Gold — Community & Export)
```
gold-500:  #c8a820    community accent (dark theme)
gold-600:  #a88a16    community accent (light theme)
```

### Ink (neutral text/surface)
```
ink-50:    #f8f9fa
ink-100:   #f0f2f4
ink-200:   #dce1e7
ink-300:   #bcc4cd
ink-400:   #8e9aaa
ink-500:   #667180
ink-600:   #4e5a69    muted text
ink-700:   #374151
ink-800:   #1f2937
ink-900:   #111827
ink-950:   #070c12
```

### Status Colors
```
success:  #22c55e / #16a34a
warning:  #e0a92b / #c9922a (ochre)
error:    #f87171 / #ef4444 (brick)
info:     #2dd4bf / #14b8a6
```

---

## § 4 — Semantic Color Tokens

### 4.1 — Reading Room (Light Theme)

```css
--background:         #f8f9fa;
--foreground:         #111827;
--surface:            #ffffff;
--surface-elevated:   #ffffff;
--surface-muted:      #f0f2f4;
--surface-well:       #e8ecf0;
--text-primary:       #111827;
--text-secondary:     #374151;
--text-muted:         #4e5a69;
--text-disabled:      #8e9aaa;
--border:             #dce1e7;
--border-subtle:      #e8ecf0;
--border-strong:      #bcc4cd;
--primary:            #0f766e;
--primary-hover:      #0d9488;
--primary-active:     #0f766e;
--primary-foreground: #ffffff;
--secondary:          #f0f2f4;
--secondary-hover:    #dce1e7;
--secondary-foreground: #374151;
--ai:                 #d97706;
--ai-hover:           #b45309;
--ai-foreground:      #ffffff;
--community:          #a88a16;
--community-hover:    #86690f;
--community-foreground: #ffffff;
--success:            #16a34a;
--success-hover:      #15803d;
--success-foreground: #ffffff;
--warning:            #c9922a;
--warning-hover:      #a8721d;
--warning-foreground: #ffffff;
--error:              #dc2626;
--error-hover:        #b91c1c;
--error-foreground:   #ffffff;
--info:               #0d9488;
--info-hover:         #0f766e;
--info-foreground:    #ffffff;
--focus-ring:         rgba(14, 116, 144, 0.45);
--overlay:            rgba(17, 24, 39, 0.55);
--sidebar-background: #f0f2f4;
--sidebar-border:     #dce1e7;
--sidebar-text:       #4e5a69;
--sidebar-text-active: #0f766e;
--sidebar-active-bg:  rgba(14, 116, 144, 0.08);
--sidebar-hover-bg:   rgba(14, 116, 144, 0.05);
```

### 4.2 — Midnight Library (Dark Theme) — PRIMARY

```css
--background:         #0c1015;
--foreground:         #e8ecf0;
--surface:            #141a22;
--surface-elevated:   #1a2230;
--surface-muted:      #111722;
--surface-well:       #0e131a;
--text-primary:       #e8ecf0;
--text-secondary:     #bcc4cd;
--text-muted:         #667180;
--text-disabled:      #374151;
--border:             #1f2937;
--border-subtle:      #161e28;
--border-strong:      #374151;
--primary:            #14b8a6;
--primary-hover:      #2dd4bf;
--primary-active:     #0d9488;
--primary-foreground: #042f2e;
--secondary:          #1a2230;
--secondary-hover:    #1f2937;
--secondary-foreground: #bcc4cd;
--ai:                 #f59e0b;
--ai-hover:           #fbbf24;
--ai-foreground:      #451a03;
--community:          #c8a820;
--community-hover:    #dbc230;
--community-foreground: #4a3a0b;
--success:            #22c55e;
--success-hover:      #16a34a;
--success-foreground: #052e16;
--warning:            #e0a92b;
--warning-hover:      #c9922a;
--warning-foreground: #451a03;
--error:              #f87171;
--error-hover:        #ef4444;
--error-foreground:   #450a0a;
--info:               #2dd4bf;
--info-hover:         #14b8a6;
--info-foreground:    #042f2e;
--focus-ring:         rgba(20, 184, 166, 0.50);
--overlay:            rgba(7, 12, 18, 0.75);
--sidebar-background: #0e131a;
--sidebar-border:     #161e28;
--sidebar-text:       #667180;
--sidebar-text-active: #14b8a6;
--sidebar-active-bg:  rgba(20, 184, 166, 0.10);
--sidebar-hover-bg:   rgba(20, 184, 166, 0.05);
```

---

## § 5 — Color Usage Rules

| Color | Token | Use ONLY for |
|---|---|---|
| Scholar Teal | `--primary` | Primary buttons, active nav, focus indicators, primary links |
| Manuscript Amber | `--ai` | AI-processing, AI-generated labels, AI action buttons, RAG provenance |
| Laurel Gold | `--community` | Community section, share/export, source citations |
| Brick | `--error` | Delete, error states, destructive confirmations |
| Scholarly Green | `--success` | Indexed status, completed, key configured |
| Ochre | `--warning` | Partial key setup, in-progress, non-critical notices |

**AI ≠ purple. AI ≠ indigo. AI ≠ violet. AI = Manuscript Amber only.**

---

## § 6 — Forbidden Colors & Styles

### NEVER introduce:
- Neon purple / electric violet (`#8b5cf6`, `#7c3aed`, `#6d28d9`, `#4f46e5`)
- Indigo AI gradients (`from-indigo-600 to-cyan-600`)
- Purple, violet, or cyan glow on any element
- Rainbow / multi-hue gradient backgrounds
- Glowing borders (`box-shadow: 0 0 30px rgba(99,102,241,0.25)`)
- Animated background gradients or shimmer effects
- Giant blur orbs / gradient blobs as background decoration
- Excessive `backdrop-blur` on non-elevated surfaces
- AI Sparkle animations as decorative elements (Sparkles icon for primary brand)
- Robot / brain / AI stock illustrations
- `bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950` on modal backgrounds
- `from-indigo-600 to-cyan-500` on brand logo or buttons

### NEVER use:
- Arbitrary hex values when a semantic token exists
- Page-specific color overrides that bypass the token system
- Hardcoded Tailwind indigo/purple for primary actions
- `AI RAG` label badge in neon indigo on the navbar

---

## § 7 — Typography System

### Fonts

| Role | Font | CSS Variable | Fallback |
|---|---|---|---|
| Display / Editorial headings | Fraunces | `font-display` | Georgia, serif |
| UI / Body / Interface | Geist Variable | `font-sans` | system-ui, sans-serif |
| Technical / Mono / Metadata | JetBrains Mono | `font-mono` | Courier New, monospace |

**Google Fonts import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Geist:wght@100..900&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

**Custom properties:**
```css
--font-display: 'Fraunces', Georgia, serif;
--font-sans:    'Geist Variable', system-ui, -apple-system, sans-serif;
--font-mono:    'JetBrains Mono', 'Courier New', monospace;
```

### Usage Rules
- Large editorial headings → Fraunces (page titles, question text, manuscript headings)
- All UI, body, labels, buttons → Geist Variable
- Question numbers, marks, dates, counts, status badges → JetBrains Mono
- Source citations → JetBrains Mono
- Do NOT make everything bold
- Do NOT use giant headings on content pages
- Do NOT overuse uppercase (mono metadata only — sparingly)
- Do NOT use excessive letter spacing

---

## § 8 — Type Scale

| Token | Font | Size | Weight | Line Height | Tracking | Use |
|---|---|---|---|---|---|---|
| `text-display-xl` | Fraunces | 56px | 300 | 1.05 | -0.03em | Hero headlines |
| `text-display-lg` | Fraunces | 40px | 400 | 1.1 | -0.025em | Page titles |
| `text-display-md` | Fraunces | 28px | 400 | 1.2 | -0.02em | Section heads |
| `text-h1` | Geist | 22px | 700 | 1.3 | -0.015em | Primary heading |
| `text-h2` | Geist | 18px | 600 | 1.35 | -0.01em | Secondary heading |
| `text-h3` | Geist | 15px | 600 | 1.4 | 0 | Tertiary heading |
| `text-h4` | Geist | 13px | 600 | 1.4 | 0 | Group label |
| `text-body-lg` | Geist | 16px | 400 | 1.6 | 0 | Lead paragraph |
| `text-body` | Geist | 14px | 400 | 1.55 | 0 | Standard body |
| `text-body-sm` | Geist | 13px | 400 | 1.5 | 0 | Secondary body |
| `text-caption` | Geist | 12px | 400 | 1.45 | 0 | Captions |
| `text-label` | Geist | 12px | 500 | 1.4 | 0.01em | Form labels |
| `text-meta` | JetBrains Mono | 11px | 400 | 1.4 | 0.02em | Dates, counts, IDs |
| `text-mono` | JetBrains Mono | 13px | 400 | 1.5 | 0 | Code, technical |
| `text-q-num` | JetBrains Mono | 13px | 500 | 1 | 0.04em | Question numbers (Q01) |
| `text-marks` | JetBrains Mono | 11px | 500 | 1 | 0.03em | Mark allocations |
| `text-status` | JetBrains Mono | 10px | 500 | 1 | 0.08em | Status badges |
| `text-citation` | JetBrains Mono | 11px | 400 | 1.4 | 0 | Source citations |

---

## § 9 — Spacing System

Base unit: **4px**

```
space-1:  4px
space-2:  8px
space-3:  12px
space-4:  16px
space-5:  20px
space-6:  24px
space-8:  32px
space-10: 40px
space-12: 48px
space-16: 64px
space-20: 80px
space-24: 96px
space-32: 128px
```

| Usage | Value |
|---|---|
| Page horizontal padding (desktop) | space-8 (32px) |
| Page horizontal padding (mobile) | space-4 (16px) |
| Section gap | space-12–space-16 |
| Card internal padding | space-5–space-6 |
| Card gap in grids | space-4 |
| Toolbar height | 56px |
| Sidebar width (desktop) | 224px |
| Sidebar width (collapsed) | 56px |
| Form field gap | space-4 |
| Button internal padding (x) | space-4 |
| Button internal padding (y) | space-2–space-3 |

**Whitespace is a design element.** Allow generous breathing room. Avoid cramming sections.

---

## § 10 — Border Radius System

```
radius-sm:   4px    — tags, badges, small chips
radius-md:   8px    — inputs, small buttons, subtle cards
radius-lg:   12px   — standard cards, modals inner panels
radius-xl:   16px   — primary cards, prominent containers
radius-2xl:  24px   — large modals, sheets
radius-pill: 9999px — status dots, pill tags only (not buttons, not nav)
```

---

## § 11 — Shadow System

```css
--shadow-xs: 0 1px 2px 0 rgba(0,0,0,0.08);
--shadow-sm: 0 1px 3px 0 rgba(0,0,0,0.12), 0 1px 2px -1px rgba(0,0,0,0.08);
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.15), 0 2px 4px -2px rgba(0,0,0,0.10);
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.18), 0 4px 6px -4px rgba(0,0,0,0.12);
```

No colored glows. No purple/teal/indigo box-shadows.

---

## § 12 — Border Tokens

```css
--border-hairline: 1px solid var(--border-subtle);
--border-default:  1px solid var(--border);
--border-strong:   1px solid var(--border-strong);
```

Borders resemble editorial rules — not heavy card outlines.
Prefer whitespace over borders where possible.

---

## § 13 — Surface System

| Surface | When to use |
|---|---|
| `--background` | Page canvas. Default document background. |
| `--surface` | Primary content areas. List containers, main panels. |
| `--surface-elevated` | Dialogs, popovers, important floating elements. |
| `--surface-muted` | Secondary grouping. Sidebars, secondary panels, filter bars. |
| `--surface-well` | Inset areas. Code blocks, formula display, key input backgrounds. |

> Not every section should be a card. Cards exist only when they communicate meaningful content grouping.

---

## § 14 — Component Color Mapping

| Component / Context | Token |
|---|---|
| Primary action button | `--primary` (Scholar Teal) |
| Secondary / neutral button | `--secondary` |
| AI action button (extract, generate) | `--ai` (Manuscript Amber) |
| Community / export button | `--community` (Laurel Gold) |
| Destructive / delete button | `--error` (Brick) |
| Active navigation indicator | `--primary` teal — understated, not glowing |
| Question number | JetBrains Mono + `--text-muted` |
| Marks badge | JetBrains Mono + `--text-muted` |
| Source citations | `--community` gold + JetBrains Mono |
| AI provenance label | `--ai` amber |
| Indexed resource status | `--success` |
| Failed status | `--error` |
| Processing / pending status | `--warning` |
| Key configured | `--success` |
| Key missing | neutral + `--text-muted` |
| Focus ring | `--focus-ring` (teal, not indigo) |
| Modal overlay | `--overlay` (flat dark) |

---

## § 15 — Button Hierarchy

| Variant | Background | Text | Use case |
|---|---|---|---|
| **Primary** | `--primary` (teal) | `--primary-foreground` | Main CTA, primary action |
| **Secondary** | `--secondary` | `--secondary-foreground` | Secondary action |
| **Outline** | transparent | `--text-primary` | Tertiary |
| **AI** | `--ai`/10 opacity | `--ai` text | Extract, generate, AI tasks |
| **Community** | `--community`/10 | `--community` text | Share, community, export |
| **Destructive** | `--error`/10 | `--error` text | Delete, remove |
| **Ghost** | transparent | `--text-secondary` | Inline, toolbar |

No gradient backgrounds. No pill-shaped buttons. No glowing buttons.
Minimum height: 36px desktop, 40px touch.

---

## § 16 — Input System

```
Background:    --surface-well
Border:        --border-default
Border-focus:  --primary (teal)
Border-error:  --error
Text:          --text-primary
Placeholder:   --text-disabled
Label:         --text-secondary
Radius:        radius-md (8px)
Height:        40px standard, 36px compact
Focus:         outline: 2px solid var(--focus-ring); outline-offset: 2px;
```

No glowing focus effects. Clean editorial style.

---

## § 17 — Dialog System

Reference component: **ConfirmationModal** (preserve its visual quality as the benchmark).

```
Background:  --surface-elevated
Border:      --border-default
Overlay:     --overlay (flat, not blur-heavy)
Radius:      radius-2xl (24px)
Shadow:      --shadow-lg
Max-width:   448px standard, 640px large
Padding:     space-6 or space-8
```

All dialogs: focus trap, ESC dismiss, aria-modal, aria-labelledby, scrollable on mobile.

---

## § 18 — Sidebar & Navigation

```
Background:      --sidebar-background
Border-right:    1px solid var(--sidebar-border)
Width desktop:   224px (with labels), 56px (icon-only)
Active item bg:  --sidebar-active-bg (teal/10)
Active text:     --sidebar-text-active (teal)
Active indicator: 2px solid --primary (left edge)
Inactive text:   --sidebar-text
Hover:           --sidebar-hover-bg
Nav icons:       Lucide, stroke 1.5, 20px
```

No glow, no neon nav, no pill active states.

**Top bar:**
- Height: 56px
- Background: `--surface` + `--border-hairline` bottom border
- Contains: page context, theme toggle, provider status pill, user menu
- Quiet — supports the content, does not dominate

---

## § 19 — Icon System (Lucide)

| Token | Size | Use |
|---|---|---|
| `icon-sm` | 16px | Inline icons, badges |
| `icon-md` | 20px | Navigation, button icons |
| `icon-lg` | 24px | Dialog icons, empty states |

Stroke: 1.5. Never emoji as UI icons.

---

## § 20 — Motion System

```css
--duration-fast:     120ms
--duration-standard: 200ms
--duration-slow:     350ms
--ease-standard:     cubic-bezier(0.4, 0, 0.2, 1)
--ease-enter:        cubic-bezier(0, 0, 0.2, 1)
--ease-exit:         cubic-bezier(0.4, 0, 1, 1)
```

**Use motion for:** page entrance, nav indicator, card reveal, dialog open/close, hover state transitions, progress steps, sidebar collapse.

**Do not use motion for:** floating/bobbing elements, infinite decorative animations, gradient sweeps, excessive spring physics, parallax.

Always respect `prefers-reduced-motion: reduce`.

---

## § 21 — Accessibility

| Requirement | Value |
|---|---|
| Focus ring | `2px solid var(--focus-ring)` |
| Focus offset | `2px` |
| Min tap target | 44×44px mobile, 36px desktop |
| Color contrast | WCAG AA minimum (4.5:1 text) |
| Dialogs | Focus trap, aria-modal, aria-labelledby |
| Loading states | aria-busy, aria-live |
| Reduced motion | Respected via media query |
| Semantic HTML | h1–h6 hierarchy, nav, main, aside, footer landmarks |

---

## § 22 — Responsive Breakpoints

| Name | Min-width | Primary target |
|---|---|---|
| mobile | 375px | iPhone SE |
| tablet | 768px | iPad portrait |
| desktop | 1024px | Laptop minimum |
| desktop-lg | 1280px | Standard desktop |
| desktop-xl | 1440px | Wide desktop (primary design canvas) |

---

## § 23 — Page-Specific Visual Language

### Landing
- Fraunces display type + generous whitespace + teal/gold accents
- No: AI robot, purple gradient blob, generic SaaS splash
- Background: flat `--background`, no animated orbs
- CTA: primary teal + secondary neutral + community gold

### Study Resources
- Feel: digital academic library
- Document list, not card grid
- Status: Indexed (success), Indexing (amber pulse), Failed (brick), Unindexed (neutral)
- AI Index action: amber button

### Question Banks
- Feel: examination archive
- Serif bank title, mono metadata, amber extraction status
- Linked resources: gold citation style

### Question Review
- Feel: editing an examination manuscript
- Q01 (JetBrains Mono) + question text (Fraunces) + marks (mono)
- Hairline dividers between questions, not card borders
- Generate: amber AI button. Add: teal primary. Delete: brick + confirmation modal

### Solutions Viewer
- Most important visual experience
- Question: Fraunces 16–18px
- Answer: Geist 14px, 1.6 line height
- Q number: JetBrains Mono, muted
- Marks: JetBrains Mono, right-aligned, muted
- Sources: Laurel Gold, JetBrains Mono
- AI provenance: Manuscript Amber, brief factual label only
- **Never fabricate AI confidence %, scores, or "verified" claims**

### Community Hub
- Feel: The Commons / shared academic archive
- Accent: Laurel Gold
- No social media patterns (likes, views, ratings, follows)

### Profile & Keys
- Calm professional settings
- No neon provider colors
- Configured: muted success dot. Missing: neutral.
- Key deletion: always confirmation modal

---

## § 24 — Anti-Pattern Reference

| Anti-pattern | Reject because |
|---|---|
| `from-indigo-600 to-cyan-600` gradient buttons | Generic AI SaaS trope |
| Purple / violet for AI | Wrong semantic |
| `box-shadow: 0 0 30px rgba(99,102,241,0.25)` | Cheap glow |
| `bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950` modals | Fake premium |
| Giant animated blur orbs as background | Visual noise |
| `animate-pulse-slow` on large background elements | Decorative distraction |
| Sparkles icon for primary brand | Lazy AI trope |
| Every section in same `rounded-3xl border border-slate-800 bg-slate-900/60` card | Repetitive template |
| Neon glow on active navigation | Cyberpunk, not academic |
| `backdrop-blur-xl` on every surface | Excessive glassmorphism |
| Invent AI confidence %, scores, or "verified" claims | Fabricated data |
| `AI RAG` badge in neon indigo on navbar | Meaningless marketing noise |
| `from-indigo-600 to-cyan-500` on brand logo | Generic |

---

## § 25 — Implementation Rules

1. Consume semantic tokens — not raw palette colors or arbitrary hex values
2. When torn between two options, choose the quieter editorial alternative
3. Reference ConfirmationModal as the quality benchmark for interactive components
4. Preserve all existing functionality — do not touch stores, API clients, auth logic, or backend behavior
5. Test at 1440, 1280, 1024, 768, 390px before considering a component done
6. Verify animations degrade gracefully under `prefers-reduced-motion: reduce`
7. Do not create page-specific color overrides — one visual language, appropriate page compositions

---

*DESIGN_TOKENS.md — AcademicStack v2 Visual Language*
*To be reviewed and approved before any frontend redesign begins.*
