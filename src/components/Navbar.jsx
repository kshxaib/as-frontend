import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  Layers,
  FileCheck2,
  Globe,
  LogIn,
  LogOut,
  FileText,
  UserPlus,
  KeyRound,
  ChevronDown,
  Library,
  Sparkles,
  GitPullRequest,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { useAuthStore } from '../store/useAuthStore';
import { ConfirmationModal } from './ConfirmationModal';
import { AcademicLogo } from './ui/AcademicLogo';
import { GithubIcon } from './ui/GithubIcon';

export const Navbar = () => {
  const { activeTab, setActiveTab, currentAnswerSet } = useQuestionBankStore();
  const { user, isAuthenticated, logout, openAuthModal } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

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

  const navItems = [
    { id: 'resources', label: 'Study Resources', icon: BookOpen, requiresAuth: true },
    { id: 'question_banks', label: 'Question Banks', icon: FileText, requiresAuth: true },
    { id: 'review', label: 'Question Review', icon: Layers, requiresAuth: true },
    { id: 'solutions', label: 'Solved Answers', icon: FileCheck2, requiresAuth: true, badge: currentAnswerSet?.completed_questions },
    { id: 'predictor', label: 'Paper Predictor', icon: Sparkles, requiresAuth: true },
    { id: 'community', label: 'Community Hub', icon: Globe, requiresAuth: true },
  ];

  const visibleTabs = isAuthenticated ? navItems : [];

  const handleTabClick = (item) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setActiveTab(item.id);
  };

  const hasOpenAIKey = !!user?.has_openai_key;

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setIsUserMenuOpen(false);
    logout();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E2E0D9] bg-white/95 backdrop-blur-xs font-sans">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <div
            onClick={() => setActiveTab(isAuthenticated ? 'resources' : '')}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0 group"
          >
            <AcademicLogo size={32} className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-[#19243B]">
                AcademicStack
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-[#687184] -mt-0.5">
                Research Workspace
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {visibleTabs.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item)}
                  className={`relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#EAF0FF] text-[#0057FF] font-semibold'
                      : 'text-[#687184] hover:text-[#19243B] hover:bg-[#F8F7F4]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-0.5 rounded-full bg-[#EAF5EF] px-1.5 py-0.2 text-[10px] font-bold text-[#187347]">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#0057FF] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://github.com/kshxaib/AcademicStack"
              target="_blank"
              rel="noopener noreferrer"
              title="View source & contribute on GitHub"
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[#E2E0D9] bg-[#F8F7F4] hover:bg-[#EAE8E3] hover:text-[#0057FF] px-2.5 py-1 text-xs font-medium text-[#19243B] transition-colors"
            >
              <GithubIcon size={14} className="shrink-0" />
              <span>Contribute</span>
            </a>

            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className={`flex items-center gap-2 rounded-lg border px-2.5 py-1 text-xs transition-all cursor-pointer ${
                    isUserMenuOpen || activeTab === 'profile'
                      ? 'border-[#0057FF] bg-[#EAF0FF] text-[#19243B] shadow-xs'
                      : 'border-[#E2E0D9] bg-[#F8F7F4] text-[#687184] hover:border-[#0057FF] hover:text-[#19243B]'
                  }`}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0057FF] text-[10px] font-bold text-white uppercase">
                    {user.name?.[0] || 'U'}
                  </div>
                  <span className="hidden sm:inline font-semibold text-xs text-[#19243B]">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown
                    className={`h-3 w-3 stroke-[1.5] text-[#687184] transition-transform duration-200 ${
                      isUserMenuOpen ? 'rotate-180 text-[#0057FF]' : ''
                    }`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[#E2E0D9] bg-white p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                    
                    <div className="px-3 py-2 border-b border-[#E2E0D9]">
                      <p className="text-xs font-bold text-[#19243B] truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-[#687184] truncate">
                        @{user.username}
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setActiveTab('profile');
                        }}
                        className={`w-full flex items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors cursor-pointer ${
                          activeTab === 'profile'
                            ? 'bg-[#EAF0FF] text-[#0057FF] font-semibold'
                            : 'text-[#687184] hover:bg-[#F8F7F4] hover:text-[#19243B]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <KeyRound className="h-3.5 w-3.5 stroke-[1.5] text-[#0057FF] shrink-0" />
                          <span>API Keys & Profile</span>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                            hasOpenAIKey
                              ? 'bg-[#EAF5EF] text-[#187347] border-[#A6F4C5]'
                              : 'bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]'
                          }`}
                        >
                          {hasOpenAIKey ? 'OpenAI Ready' : 'Key Needed'}
                        </span>
                      </button>

                      <a
                        href="https://github.com/kshxaib/AcademicStack"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#687184] hover:bg-[#F8F7F4] hover:text-[#0057FF] transition-colors"
                      >
                        <GithubIcon size={14} className="text-[#19243B] shrink-0" />
                        <span>Contribute on GitHub</span>
                      </a>
                    </div>

                    <div className="my-1 border-t border-[#E2E0D9]" />

                    <div className="py-0.5">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsLogoutModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[#B42318] hover:bg-[#FFF0EE] transition-colors cursor-pointer font-medium"
                      >
                        <LogOut className="h-3.5 w-3.5 stroke-[1.5]" />
                        <span>Sign Out</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 rounded-lg border border-[#E2E0D9] bg-[#F8F7F4] px-3 py-1.5 text-xs font-semibold text-[#19243B] hover:bg-[#EAE8E3] transition-all cursor-pointer"
                >
                  <LogIn className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="flex items-center gap-1.5 rounded-lg bg-[#0057FF] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0046CC] transition-all shadow-xs cursor-pointer"
                >
                  <UserPlus className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>Get Started</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {visibleTabs.length > 0 && (
          <div className="flex md:hidden overflow-x-auto border-t border-[#E2E0D9] bg-[#F8F7F4] px-3 py-1.5 scrollbar-none gap-1">
            {visibleTabs.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item)}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0057FF] text-white font-semibold'
                      : 'text-[#687184] hover:text-[#19243B]'
                  }`}
                >
                  <Icon className="h-3 w-3 stroke-[1.5]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

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
