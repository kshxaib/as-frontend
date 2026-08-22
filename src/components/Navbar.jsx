import React from 'react';
import {
  BookOpen,
  Layers,
  FileCheck2,
  Globe,
  User,
  LogIn,
  LogOut,
  FileText,
  UserPlus,
  ShieldCheck,
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
    { id: 'profile', label: 'Profile & Keys', icon: User, requiresAuth: true },
  ];

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

  const hasAnyKey = user?.has_gemini_key || user?.has_groq_key || user?.has_cerebras_key || user?.has_nvidia_key || user?.has_openai_key;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ── Brand ── */}
        <div
          onClick={() => setActiveTab(isAuthenticated ? 'resources' : '')}
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20">
            <BookOpen className="h-4.5 w-4.5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white">AcademicStack</span>
            <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20 hidden sm:inline">
              Multi-AI
            </span>
          </div>
        </div>

        {/* ── Desktop Tab Switcher ── */}
        <nav className="hidden md:flex items-center gap-1 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-1 backdrop-blur-md">
          {visibleTabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-bold ml-0.5">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Right Section ── */}
        <div className="flex items-center gap-2.5 shrink-0">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              {/* AI Key Status Tag */}
              <button
                onClick={() => setActiveTab('profile')}
                className={`hidden sm:flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold border transition-all ${
                  hasAnyKey
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                }`}
              >
                <ShieldCheck className="h-3 w-3" />
                <span>{hasAnyKey ? 'Keys Active' : 'Setup Keys'}</span>
              </button>

              {/* User Profile Pill */}
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-700 hover:text-white transition-all"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white uppercase">
                  {user.name?.[0] || 'U'}
                </div>
                <span className="hidden sm:inline font-medium">{user.name.split(' ')[0]}</span>
              </button>

              {/* Logout */}
              <button
                onClick={logout}
                title="Sign Out"
                className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-2 text-slate-400 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 transition-all"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* Unauthenticated Guests */
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-all"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-500 transition-all"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Get Started</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Nav ── */}
      <div className="flex md:hidden overflow-x-auto border-t border-slate-800/80 bg-slate-950 px-3 py-2 scrollbar-none gap-1">
        {visibleTabs.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item)}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
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
      </div>
    </header>
  );
};
