import React, { useEffect, useRef } from 'react';
import {
  BookOpen,
  Sparkles,
  Layers,
  FileCheck2,
  Globe,
  KeyRound,
  ArrowRight,
  Brain,
  Upload,
  Search,
  Zap,
  Shield,
  Users,
  FileText,
  ChevronRight,
  Star,
  CheckCircle2,
  Lock,
  Eye,
  Download,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useQuestionBankStore } from '../store/useQuestionBankStore';

// ─── Animated Gradient Orb ────────────────────────────────────────────────────
const GradientOrb = ({ className }) => (
  <div className={`absolute rounded-full blur-3xl opacity-20 animate-pulse-slow pointer-events-none ${className}`} />
);

// ─── Feature Card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon: Icon, title, description, color, glow }) => (
  <div
    className="group relative flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm
      hover:border-white/10 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-0.5"
    style={{ boxShadow: `0 0 0 0 ${glow}` }}
  >
    <div
      className="flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110"
      style={{ background: `${color}15`, borderColor: `${color}25`, color }}
    >
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

// ─── Step ─────────────────────────────────────────────────────────────────────
const Step = ({ num, icon: Icon, title, desc, color }) => (
  <div className="flex flex-col items-center text-center gap-3">
    <div
      className="relative flex h-16 w-16 items-center justify-center rounded-2xl border"
      style={{ background: `${color}10`, borderColor: `${color}30`, color }}
    >
      <Icon className="h-7 w-7" />
      <div
        className="absolute -top-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold text-white"
        style={{ background: color, borderColor: `${color}50` }}
      >
        {num}
      </div>
    </div>
    <div>
      <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed max-w-[180px]">{desc}</p>
    </div>
  </div>
);

// ─── Tier Card ────────────────────────────────────────────────────────────────
const TierCard = ({ title, icon: Icon, iconColor, borderColor, bgColor, items, cta, onCta, highlighted }) => (
  <div
    className={`relative flex flex-col gap-5 rounded-2xl border p-6 ${highlighted ? 'shadow-2xl' : ''}`}
    style={{ background: bgColor, borderColor, boxShadow: highlighted ? `0 0 40px ${iconColor}20` : undefined }}
  >
    {highlighted && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-bold text-white border border-indigo-400/40">
        FULL POWER
      </div>
    )}
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl border"
        style={{ background: `${iconColor}15`, borderColor: `${iconColor}25`, color: iconColor }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-bold text-white">{title}</h3>
    </div>
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: iconColor }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
    {cta && (
      <button
        onClick={onCta}
        className="mt-auto flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all"
        style={{
          background: highlighted ? `linear-gradient(135deg, #4f46e5, #6366f1)` : 'rgba(255,255,255,0.05)',
          color: highlighted ? '#fff' : iconColor,
          border: `1px solid ${iconColor}30`,
        }}
      >
        <span>{cta}</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const LandingPage = ({ justLoggedOut }) => {
  const { openAuthModal } = useAuthStore();
  const { setActiveTab } = useQuestionBankStore();

  const features = [
    {
      icon: Upload,
      title: 'Study Resources',
      description: 'Upload PDFs, lecture notes, textbook chapters. Organize by subject and chapters for instant access.',
      color: '#6366f1',
      glow: 'rgba(99,102,241,0)',
    },
    {
      icon: FileText,
      title: 'Question Banks',
      description: 'Upload past exam papers. AI extracts questions, mark allocations, and organizes them for review.',
      color: '#06b6d4',
      glow: 'rgba(6,182,212,0)',
    },
    {
      icon: Layers,
      title: 'AI Question Review',
      description: 'Review and edit AI-extracted questions. Adjust marks, add custom questions, manage your exam prep.',
      color: '#8b5cf6',
      glow: 'rgba(139,92,246,0)',
    },
    {
      icon: Brain,
      title: 'RAG Answer Generation',
      description: 'AI generates comprehensive answers grounded in your uploaded notes using vector retrieval.',
      color: '#10b981',
      glow: 'rgba(16,185,129,0)',
    },
    {
      icon: Globe,
      title: 'Community Hub',
      description: 'Share solved papers and resources publicly. Browse and download community-shared content for free.',
      color: '#f59e0b',
      glow: 'rgba(245,158,11,0)',
    },
    {
      icon: FileCheck2,
      title: 'PDF Export',
      description: 'Export beautifully formatted solved exam papers as PDFs. AI-reviewed, citation-rich documents.',
      color: '#ec4899',
      glow: 'rgba(236,72,153,0)',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* ── Ambient Background Orbs ── */}
      <GradientOrb className="h-[500px] w-[500px] bg-indigo-600 -top-32 -left-32" />
      <GradientOrb className="h-[600px] w-[600px] bg-cyan-500 top-1/3 -right-48 animation-delay-2000" />
      <GradientOrb className="h-[400px] w-[400px] bg-violet-600 bottom-0 left-1/3 animation-delay-4000" />

      {/* ── Subtle grid pattern ── */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-28 pb-20 text-center">
        {/* Logged out notice */}
        {justLoggedOut && (
          <div className="mb-8 flex items-center gap-2.5 rounded-xl border border-slate-700/60 bg-slate-900/80 px-5 py-3 text-xs text-slate-300 backdrop-blur-sm animate-fade-in-down">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>You've been signed out successfully. See you next time! 👋</span>
          </div>
        )}

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span>OpenAI-Powered Exam Preparation Platform</span>
        </div>

        {/* Headline */}
        <h1 className="max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
          <span className="text-white">Study Smarter,</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Ace Every Exam
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
          AcademicStack is your AI-powered academic hub. Upload study materials, extract exam questions,
          generate cited answers with RAG, export polished PDFs — and share with your community.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <button
            id="hero-get-started-btn"
            onClick={() => openAuthModal('register')}
            className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-7 py-3.5 text-sm font-bold text-white shadow-2xl shadow-indigo-500/30 hover:from-indigo-500 hover:to-cyan-500 transition-all duration-300 hover:shadow-indigo-400/40 hover:-translate-y-0.5"
          >
            <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            <span>Get Started Free</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            id="hero-sign-in-btn"
            onClick={() => openAuthModal('login')}
            className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-7 py-3.5 text-sm font-semibold text-slate-200 hover:border-indigo-500/40 hover:bg-slate-800/80 transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5"
          >
            <span>Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            id="hero-community-btn"
            onClick={() => setActiveTab('community')}
            className="flex items-center gap-2 rounded-2xl border border-amber-500/25 bg-amber-500/8 px-7 py-3.5 text-sm font-semibold text-amber-300 hover:border-amber-500/50 hover:bg-amber-500/15 transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5"
          >
            <Globe className="h-4 w-4" />
            <span>Browse Community</span>
          </button>
        </div>

        {/* Social proof strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          {[
            { icon: Shield, label: 'API Keys Encrypted' },
            { icon: Zap, label: 'Real-time RAG Pipeline' },
            { icon: Users, label: 'Community Sharing' },
            { icon: Download, label: 'PDF Export' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-indigo-500" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — FEATURES
      ══════════════════════════════════════════════════════ */}
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div className="text-center mb-12">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/60 px-4 py-1.5 text-xs font-semibold text-slate-400 backdrop-blur-sm">
              <Zap className="h-3 w-3 text-cyan-400" />
              <span>Everything you need</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              A Complete Academic Toolkit
            </h2>
            <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto">
              Six powerful modules that work together to transform how you prepare for exams.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-4xl">
          {/* Glassmorphism container */}
          <div className="relative rounded-3xl border border-white/5 bg-white/[0.02] p-8 sm:p-12 backdrop-blur-sm overflow-hidden">
            {/* inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-transparent to-cyan-600/5 pointer-events-none rounded-3xl" />

            <div className="text-center mb-12">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/60 px-4 py-1.5 text-xs font-semibold text-slate-400 backdrop-blur-sm">
                <Brain className="h-3 w-3 text-violet-400" />
                <span>Simple 3-step workflow</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                From Notes to Answers in Minutes
              </h2>
            </div>

            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
              {/* Connecting lines (desktop) */}
              <div className="absolute top-8 left-[33%] right-[33%] hidden sm:block h-px bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-emerald-500/30" />

              <Step
                num="1"
                icon={Upload}
                title="Upload Materials"
                desc="Upload your PDFs, lecture notes, and past exam papers to Cloudinary."
                color="#6366f1"
              />
              <Step
                num="2"
                icon={Search}
                title="AI Indexes & Extracts"
                desc="OpenAI embeddings index your notes into Qdrant. Questions are extracted from exam papers."
                color="#8b5cf6"
              />
              <Step
                num="3"
                icon={Sparkles}
                title="Generate & Export"
                desc="RAG pipeline generates comprehensive, cited answers. Export as a polished PDF."
                color="#10b981"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 4 — ACCESS TIERS
      ══════════════════════════════════════════════════════ */}
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/60 px-4 py-1.5 text-xs font-semibold text-slate-400 backdrop-blur-sm">
              <KeyRound className="h-3 w-3 text-amber-400" />
              <span>Access levels</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Start Free. Unlock AI When Ready.
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              No subscription required. Bring your own OpenAI API key for AI features.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TierCard
              title="Guest"
              icon={Eye}
              iconColor="#64748b"
              borderColor="rgba(100,116,139,0.2)"
              bgColor="rgba(15,23,42,0.6)"
              items={[
                'Browse Community Hub',
                'Download shared resources',
                'Download shared solved papers',
                'No registration needed',
              ]}
              cta="Browse Community"
              onCta={() => setActiveTab('community')}
            />
            <TierCard
              title="Registered"
              icon={Lock}
              iconColor="#6366f1"
              borderColor="rgba(99,102,241,0.2)"
              bgColor="rgba(15,23,42,0.6)"
              items={[
                'Everything in Guest',
                'Upload study resources',
                'Upload question banks',
                'Manage your content',
                'Share to community',
              ]}
              cta="Create Account"
              onCta={() => openAuthModal('register')}
            />
            <TierCard
              title="AI Powered"
              icon={Sparkles}
              iconColor="#6366f1"
              borderColor="rgba(99,102,241,0.35)"
              bgColor="rgba(99,102,241,0.04)"
              highlighted
              items={[
                'Everything in Registered',
                'PDF indexing (Qdrant vectors)',
                'AI question extraction',
                'RAG answer generation',
                'AI academic review pass',
                'PDF export of solved papers',
              ]}
              cta="Add OpenAI Key"
              onCta={() => openAuthModal('register')}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 5 — TECH STACK
      ══════════════════════════════════════════════════════ */}
      <section className="relative px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">Powered by</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { name: 'OpenAI', color: '#10b981', desc: 'Embeddings & GPT' },
              { name: 'Qdrant', color: '#6366f1', desc: 'Vector Search' },
              { name: 'PostgreSQL', color: '#06b6d4', desc: 'Data Storage' },
              { name: 'Cloudinary', color: '#f59e0b', desc: 'File Storage' },
              { name: 'FastAPI', color: '#8b5cf6', desc: 'Backend API' },
              { name: 'React', color: '#38bdf8', desc: 'Frontend' },
            ].map(({ name, color, desc }) => (
              <div
                key={name}
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-3.5 backdrop-blur-sm hover:border-white/10 transition-all"
              >
                <div className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                <span className="text-xs font-bold text-white">{name}</span>
                <span className="text-[10px] text-slate-500">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 6 — BOTTOM CTA
      ══════════════════════════════════════════════════════ */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="relative rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900/30 via-slate-900/60 to-violet-900/20 p-10 sm:p-14 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-transparent to-cyan-600/5 pointer-events-none rounded-3xl" />
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/15 border border-indigo-500/25">
                <BookOpen className="h-7 w-7 text-indigo-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Ready to ace your exams?
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                Join AcademicStack and turn your study materials into AI-powered exam preparation.
                Free to start, scales with your needs.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  id="cta-get-started-btn"
                  onClick={() => openAuthModal('register')}
                  className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-3.5 text-sm font-bold text-white shadow-2xl shadow-indigo-500/30 hover:from-indigo-500 hover:to-cyan-500 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  <span>Create Free Account</span>
                </button>
                <button
                  id="cta-sign-in-btn"
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-8 py-3.5 text-sm font-semibold text-slate-300 hover:border-indigo-500/40 hover:text-white transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5"
                >
                  Already have an account? Sign in
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative border-t border-white/5 px-4 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-white">AcademicStack</span>
            <span className="text-xs text-slate-500">OpenAI Edition</span>
          </div>
          <p className="text-xs text-slate-600">AI-Powered Exam Preparation & Vector RAG Platform</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => openAuthModal('login')}
              className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
            >
              Register
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className="text-xs text-slate-500 hover:text-amber-400 transition-colors"
            >
              Community
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
