import React from 'react';
import {
  BookOpen,
  Sparkles,
  Layers,
  FileCheck2,
  Globe,
  User,
  LogIn,
  KeyRound,
  LogOut,
  FileText,
  UserPlus,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { useAuthStore } from '../store/useAuthStore';

export const Navbar = () => {
  const { activeTab, setActiveTab, currentAnswerSet } = useQuestionBankStore();
  const { user, isAuthenticated, logout, openAuthModal } = useAuthStore();

  const navItems = [
    { id: 'resources', label: 'Study Resources', icon: BookOpen, requiresAuth: true },
    { id: 'question_banks', label: 'Question Banks', icon: FileText, requiresAuth: true },
    { id: 'review', label: 'Question Review', icon: Layers, requiresAuth: true },
    { id: 'solutions', label: 'Solved Answers', icon: FileCheck2, requiresAuth: true, badge: currentAnswerSet?.completed_questions },
    { id: 'community', label: 'Community Hub', icon: Globe, requiresAuth: false },
    { id: 'profile', label: 'Profile & API Keys', icon: User, requiresAuth: true },
  ];

  // Show tabs only when authenticated, plus always show community tab
  const visibleTabs = isAuthenticated
    ? navItems
    : navItems.filter((item) => !item.requiresAuth);

  const handleTabClick = (item) => {
    if (item.requiresAuth && !isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setActiveTab(item.id);
  }; 

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ── Brand ── */}
        <div
          onClick={() => setActiveTab(isAuthenticated ? 'resources' : '')}
          className="flex items-center gap-3 cursor-pointer select-none flex-shrink-0"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">AcademicStack</span>
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20 hidden sm:block">
                OpenAI Edition
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">AI Exam Preparation & Vector RAG Platform</p>
          </div>
        </div>

        {/* ── Tab Switcher (Desktop) — only shown when authenticated or community tab ── */}
        {(isAuthenticated || true) && (
          <div className="hidden lg:flex items-center rounded-2xl border border-slate-800 bg-slate-900/80 p-1">
            {visibleTabs.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Right Section: User Status & Auth ── */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* OpenAI Key Status Indicator */}
              <div
                onClick={() => setActiveTab('profile')}
                className="cursor-pointer hidden sm:flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all hover:opacity-80"
                style={{
                  backgroundColor: user.has_openai_key ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  borderColor: user.has_openai_key ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)',
                  color: user.has_openai_key ? '#34d399' : '#fbbf24',
                }}
              >
                <KeyRound className="h-3 w-3" />
                <span>{user.has_openai_key ? 'AI Enabled' : 'View Only'}</span>
              </div>

              {/* User Avatar */}
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-700 transition-colors"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-[10px] font-bold text-white uppercase">
                  {user.name?.[0] || 'U'}
                </div>
                <span className="hidden md:inline font-semibold">{user.name.split(' ')[0]}</span>
              </button>

              {/* Logout */}
              <button
                onClick={logout}
                title="Sign Out"
                className="rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* Unauthenticated: Show Sign In + Get Started buttons */
            <div className="flex items-center gap-2">
              <button
                id="navbar-signin-btn"
                onClick={() => openAuthModal('login')}
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:border-indigo-500/40 hover:text-white transition-all"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
              <button
                id="navbar-register-btn"
                onClick={() => openAuthModal('register')}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-cyan-500 transition-all"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Get Started</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Nav Strip ── */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-800/80 bg-slate-950 px-2 py-1.5 scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          {visibleTabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          {/* Mobile auth button for guests */}
          {!isAuthenticated && (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-all ml-1"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
