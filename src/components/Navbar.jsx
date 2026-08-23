import React, { useState, useRef, useEffect } from 'react';
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
  KeyRound,
  ChevronDown,
  Library,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { useAuthStore } from '../store/useAuthStore';
import { ConfirmationModal } from './ConfirmationModal';
import { ThemeToggle } from './ui/ThemeToggle';

export const Navbar = () => {
  const { activeTab, setActiveTab, currentAnswerSet } = useQuestionBankStore();
  const { user, isAuthenticated, logout, openAuthModal } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isUserMenuOpen]);

  // Main study navigation items
  const navItems = [
    { id: 'resources', label: 'Study Resources', icon: BookOpen, requiresAuth: true },
    { id: 'question_banks', label: 'Question Banks', icon: FileText, requiresAuth: true },
    { id: 'review', label: 'Question Review', icon: Layers, requiresAuth: true },
    { id: 'solutions', label: 'Solved Answers', icon: FileCheck2, requiresAuth: true, badge: currentAnswerSet?.completed_questions },
    { id: 'community', label: 'Community Hub', icon: Globe, requiresAuth: false },
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

  const requiredKeys = ['has_gemini_key', 'has_groq_key', 'has_openrouter_key', 'has_nvidia_key'];
  const configuredRequiredCount = requiredKeys.filter((k) => user?.[k]).length;
  const allRequiredPresent = configuredRequiredCount === 4;

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setIsUserMenuOpen(false);
    logout();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* ── Brand / Editorial Masthead ── */}
          <div
            onClick={() => setActiveTab(isAuthenticated ? 'resources' : '')}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0 group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] text-[var(--primary)] transition-colors group-hover:border-[var(--primary)]">
              <Library className="h-4 w-4 stroke-[1.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base font-medium tracking-tight text-[var(--text-primary)]">
                AcademicStack
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)] -mt-0.5">
                Research Workspace
              </span>
            </div>
          </div>

          {/* ── Desktop Nav (The Stacks) ── */}
          <nav className="hidden md:flex items-center gap-1">
            {visibleTabs.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item)}
                  className={`relative flex items-center gap-2 rounded-[6px] px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--sidebar-active-bg)] text-[var(--primary)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-0.5 rounded-[4px] bg-[rgba(34,197,94,0.15)] px-1.5 py-0.2 font-mono text-[10px] font-medium text-[var(--success)]">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[var(--primary)] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── Right Actions: Theme Toggle & User Account Dropdown ── */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Switcher */}
            <ThemeToggle compact />

            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                {/* Single Consolidated User Profile Button */}
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className={`flex items-center gap-2 rounded-[8px] border px-2.5 py-1 text-xs transition-all ${
                    isUserMenuOpen || activeTab === 'profile'
                      ? 'border-[var(--primary)] bg-[var(--surface-well)] text-[var(--text-primary)] shadow-xs'
                      : 'border-[var(--border)] bg-[var(--surface-well)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--text-primary)]'
                  }`}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-[var(--primary-foreground)] uppercase">
                    {user.name?.[0] || 'U'}
                  </div>
                  <span className="hidden sm:inline font-medium text-xs">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown
                    className={`h-3 w-3 stroke-[1.5] text-[var(--text-muted)] transition-transform duration-200 ${
                      isUserMenuOpen ? 'rotate-180 text-[var(--primary)]' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-[12px] border border-[var(--border)] bg-[var(--surface-elevated)] p-1.5 shadow-[var(--shadow-lg)] z-50 animate-in fade-in zoom-in-95 duration-100">
                    
                    {/* User Header */}
                    <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
                      <p className="font-display text-xs font-medium text-[var(--text-primary)] truncate">
                        {user.name}
                      </p>
                      <p className="font-mono text-[11px] text-[var(--text-muted)] truncate">
                        @{user.username}
                      </p>
                    </div>

                    {/* API Keys & Settings Option */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setActiveTab('profile');
                        }}
                        className={`w-full flex items-center justify-between gap-2.5 rounded-[6px] px-3 py-2 text-xs transition-colors ${
                          activeTab === 'profile'
                            ? 'bg-[var(--sidebar-active-bg)] text-[var(--primary)] font-medium'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--surface-well)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <KeyRound className="h-3.5 w-3.5 stroke-[1.5] text-[var(--primary)] shrink-0" />
                          <span>API Keys & Profile</span>
                        </div>
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                            allRequiredPresent
                              ? 'bg-[rgba(34,197,94,0.1)] text-[var(--success)] border-[rgba(34,197,94,0.25)]'
                              : 'bg-[rgba(245,158,11,0.1)] text-[var(--warning)] border-[rgba(245,158,11,0.25)]'
                          }`}
                        >
                          {allRequiredPresent ? '4/4 Ready' : `${configuredRequiredCount}/4 Keys`}
                        </span>
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="editorial-rule my-1" />

                    {/* Sign Out Option */}
                    <div className="py-0.5">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsLogoutModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 rounded-[6px] px-3 py-2 text-xs text-[var(--text-muted)] hover:bg-[rgba(239,68,68,0.1)] hover:text-[var(--error)] transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5 stroke-[1.5]" />
                        <span>Sign Out</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated Guests */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-all"
                >
                  <LogIn className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="flex items-center gap-1.5 rounded-[8px] bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-sm"
                >
                  <UserPlus className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>Get Started</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile Nav ── */}
        <div className="flex md:hidden overflow-x-auto border-t border-[var(--border-subtle)] bg-[var(--surface-muted)] px-3 py-1.5 scrollbar-none gap-1">
          {visibleTabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={`flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="h-3 w-3 stroke-[1.5]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        title="Sign Out of AcademicStack?"
        message="Are you sure you want to log out? Your configured API keys will remain securely encrypted on your account."
        confirmText="Yes, Sign Out"
        cancelText="Stay Signed In"
        confirmVariant="danger"
        iconType="logout"
        onConfirm={handleConfirmLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};
