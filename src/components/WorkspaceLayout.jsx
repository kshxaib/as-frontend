import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  Files,
  CircleHelp,
  MessageCircle,
  ChartNoAxesColumnIncreasing,
  Users,
  LogOut,
  ChevronDown,
  KeyRound,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  PanelLeft,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { useAuthStore } from '../store/useAuthStore';
import { ConfirmationModal } from './ConfirmationModal';

export const WorkspaceLayout = ({ children }) => {
  const { activeTab, setActiveTab, currentAnswerSet } = useQuestionBankStore();
  const { user, logout } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('academicstack_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const userMenuRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('academicstack_sidebar_collapsed', String(next));
      } catch {
        
      }
      return next;
    });
  };

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

  const getInitials = (name) => {
    if (!name) return 'AL';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'resources':
        return 'Study materials';
      case 'question_banks':
        return 'Question papers';
      case 'review':
        return 'Review questions';
      case 'solutions':
        return 'Answers';
      case 'predictor':
        return 'Paper predictor';
      case 'community':
        return 'Community';
      case 'profile':
        return 'Profile & API key';
      default:
        return 'AcademicStack';
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileDrawerOpen(false);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setIsUserMenuOpen(false);
    setIsMobileDrawerOpen(false);
    logout();
  };

  const hasOpenAIKey = Boolean(user?.has_openai_key);

  const renderNavItems = (isCollapsed = false) => (
    <>
      <nav aria-label="Workspace navigation" className="flex-1 flex flex-col gap-6">
        
        <div className="flex flex-col gap-1">
          {!isCollapsed ? (
            <p className="font-semibold uppercase text-[#526078] text-[10px] tracking-[0.08em] px-3 mb-1 select-none transition-opacity duration-200">
              Your workspace
            </p>
          ) : (
            <div className="h-px bg-[#E2E0D9] mx-2 my-1" />
          )}

          <button
            type="button"
            onClick={() => handleTabClick('resources')}
            title="Study materials"
            className={`font-medium rounded-xl text-sm flex items-center min-h-11 transition-all duration-200 text-left w-full cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'
            } ${
              activeTab === 'resources'
                ? 'bg-[#0057FF]/10 text-[#0057FF] font-semibold shadow-2xs'
                : 'text-[#526078] hover:bg-[#F1F0EC] hover:text-[#19243B]'
            }`}
          >
            <BookOpen className="size-5 shrink-0" />
            {!isCollapsed && (
              <span className="truncate transition-opacity duration-200">Study materials</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('question_banks')}
            title="Question papers"
            className={`font-medium rounded-xl text-sm flex items-center min-h-11 transition-all duration-200 text-left w-full cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'
            } ${
              activeTab === 'question_banks'
                ? 'bg-[#0057FF]/10 text-[#0057FF] font-semibold shadow-2xs'
                : 'text-[#526078] hover:bg-[#F1F0EC] hover:text-[#19243B]'
            }`}
          >
            <Files className="size-5 shrink-0" />
            {!isCollapsed && (
              <span className="truncate transition-opacity duration-200">Question papers</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('review')}
            title="Review questions"
            className={`font-medium rounded-xl text-sm flex items-center min-h-11 transition-all duration-200 text-left w-full cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'
            } ${
              activeTab === 'review'
                ? 'bg-[#0057FF]/10 text-[#0057FF] font-semibold shadow-2xs'
                : 'text-[#526078] hover:bg-[#F1F0EC] hover:text-[#19243B]'
            }`}
          >
            <CircleHelp className="size-5 shrink-0" />
            {!isCollapsed && (
              <span className="truncate transition-opacity duration-200">Review questions</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('solutions')}
            title="Answers"
            className={`font-medium rounded-xl text-sm flex items-center min-h-11 transition-all duration-200 text-left w-full cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : 'px-3 justify-between'
            } ${
              activeTab === 'solutions'
                ? 'bg-[#0057FF]/10 text-[#0057FF] font-semibold shadow-2xs'
                : 'text-[#526078] hover:bg-[#F1F0EC] hover:text-[#19243B]'
            }`}
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
              <MessageCircle className="size-5 shrink-0" />
              {!isCollapsed && (
                <span className="truncate transition-opacity duration-200">Answers</span>
              )}
            </div>
            {!isCollapsed && currentAnswerSet?.completed_questions > 0 && (
              <span className="rounded-full bg-[#EAF5EF] text-[#187347] px-2 py-0.5 text-[10px] font-bold">
                {currentAnswerSet.completed_questions}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('predictor')}
            title="Paper predictor"
            className={`font-medium rounded-xl text-sm flex items-center min-h-11 transition-all duration-200 text-left w-full cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'
            } ${
              activeTab === 'predictor'
                ? 'bg-[#0057FF]/10 text-[#0057FF] font-semibold shadow-2xs'
                : 'text-[#526078] hover:bg-[#F1F0EC] hover:text-[#19243B]'
            }`}
          >
            <ChartNoAxesColumnIncreasing className="size-5 shrink-0" />
            {!isCollapsed && (
              <span className="truncate transition-opacity duration-200">Paper predictor</span>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-1">
          {!isCollapsed ? (
            <p className="font-semibold uppercase text-[#526078] text-[10px] tracking-[0.08em] px-3 mb-1 select-none transition-opacity duration-200">
              Study together
            </p>
          ) : (
            <div className="h-px bg-[#E2E0D9] mx-2 my-1" />
          )}

          <button
            type="button"
            onClick={() => handleTabClick('community')}
            title="Community"
            className={`font-medium rounded-xl text-sm flex items-center min-h-11 transition-all duration-200 text-left w-full cursor-pointer ${
              isCollapsed ? 'justify-center px-0' : 'px-3 gap-3'
            } ${
              activeTab === 'community'
                ? 'bg-[#0057FF]/10 text-[#0057FF] font-semibold shadow-2xs'
                : 'text-[#526078] hover:bg-[#F1F0EC] hover:text-[#19243B]'
            }`}
          >
            <Users className="size-5 shrink-0" />
            {!isCollapsed && (
              <span className="truncate transition-opacity duration-200">Community</span>
            )}
          </button>
        </div>
      </nav>
    </>
  );

  return (
    <div className="bg-[#F8F7F4] text-[#19243B] flex min-h-screen font-sans antialiased selection:bg-[#0057FF] selection:text-white">
      
      <aside
        className={`hidden lg:flex bg-[#FCFBF9] border-r border-[#E2E0D9] flex-col shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-[72px] p-3' : 'w-[240px] p-4'
        }`}
        aria-label="Workspace navigation"
      >
        
        <div className="flex items-center select-none min-h-[40px]">
          <div
            onClick={() => handleTabClick('resources')}
            className={`flex items-center gap-2.5 cursor-pointer group ${
              isSidebarCollapsed ? 'mx-auto' : ''
            }`}
            title="AcademicStack Workspace"
          >
            <div className="rounded-xl bg-[#0057FF] text-white grid place-items-center size-9 shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <BookOpen className="size-5" />
            </div>
            {!isSidebarCollapsed && (
              <span className="font-bold text-lg tracking-tight text-[#19243B] truncate transition-opacity duration-200">
                AcademicStack
              </span>
            )}
          </div>
        </div>

        {!isSidebarCollapsed && (
          <p className="text-[#526078] text-xs mt-1 pl-[46px] select-none truncate transition-opacity duration-200">
            Your study workspace
          </p>
        )}

        <div className="mt-8 flex-1 flex flex-col">
          {renderNavItems(isSidebarCollapsed)}
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0 relative">
        
        <header className="bg-transparent flex px-4 sm:px-8 justify-between items-center shrink-0 h-14 sm:h-16 sticky top-0 z-30 transition-all">
          
          <div className="flex items-center gap-3">
            
            <button
              type="button"
              onClick={toggleSidebar}
              className="hidden lg:inline-flex items-center justify-center size-9 rounded-xl border border-[#E2E0D9] bg-white text-[#526078] hover:text-[#19243B] hover:bg-[#F8F7F4] hover:border-[#C6CAD3] transition-all cursor-pointer shadow-2xs group"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="size-4.5 text-[#0057FF] group-hover:scale-110 transition-transform" />
              ) : (
                <PanelLeftClose className="size-4.5 text-[#526078] group-hover:text-[#19243B] transition-transform" />
              )}
            </button>

            <div className="flex items-center gap-2.5 lg:hidden">
              <div className="rounded-xl bg-[#0057FF] text-white grid place-items-center size-8 shadow-xs">
                <BookOpen className="size-4.5" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-[#19243B] block">
                  AcademicStack
                </span>
                <span className="text-[#526078] text-xs block">
                  {getTitle()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            <div className="hidden lg:block relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                type="button"
                aria-expanded={isUserMenuOpen}
              >
                <div className="font-bold rounded-full bg-[#0057FF]/10 text-[#0057FF] text-xs border border-[#0057FF]/20 grid place-items-center size-9 shadow-2xs">
                  {getInitials(user?.name || user?.username)}
                </div>
                <span className="font-semibold text-sm text-[#19243B]">
                  {user?.name || user?.username || 'Alex Lee'}
                </span>
                <ChevronDown
                  className={`text-[#526078] size-4 transition-transform duration-200 ${
                    isUserMenuOpen ? 'rotate-180 text-[#0057FF]' : ''
                  }`}
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-xl border border-[#E2E0D9] bg-white p-1.5 shadow-[0px_8px_24px_rgba(25,36,59,0.08)] z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-[#E2E0D9]">
                    <p className="text-xs font-bold text-[#19243B] truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-[11px] text-[#526078] truncate">
                      @{user?.username || 'user'}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleTabClick('profile');
                      }}
                      className="w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs text-[#19243B] hover:bg-[#F1F0EC] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <KeyRound className="size-3.5 text-[#0057FF]" />
                        <span>Profile & API key</span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                          hasOpenAIKey
                            ? 'bg-[#EAF5EF] text-[#187347] border-[#A6F4C5]'
                            : 'bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]'
                        }`}
                      >
                        {hasOpenAIKey ? 'Key Ready' : 'Key Needed'}
                      </span>
                    </button>
                  </div>

                  <div className="border-t border-[#E2E0D9] my-1" />

                  <div className="py-0.5">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#B42318] hover:bg-[#FFF0EE] transition-colors cursor-pointer font-medium"
                    >
                      <LogOut className="size-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileDrawerOpen((prev) => !prev)}
              className="lg:hidden rounded-xl bg-white text-[#526078] border border-[#E2E0D9] grid place-items-center shrink-0 size-11 shadow-xs hover:bg-[#F1F0EC] transition-colors cursor-pointer"
              type="button"
              aria-label={isMobileDrawerOpen ? 'Close navigation' : 'Open navigation'}
            >
              {isMobileDrawerOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </header>

        {isMobileDrawerOpen && (
          <>
            <div
              className="lg:hidden bg-[#19243B]/20 fixed top-14 sm:top-16 right-0 bottom-0 left-0 z-30 backdrop-blur-xs animate-in fade-in duration-200"
              onClick={() => setIsMobileDrawerOpen(false)}
            />
            <aside
              className="lg:hidden shadow-2xl bg-[#FCFBF9] border-r border-[#E2E0D9] flex fixed top-14 sm:top-16 bottom-0 left-0 p-5 flex-col w-[320px] max-w-[calc(100%-35px)] z-40 animate-in slide-in-from-left duration-200"
            >
              <h2 className="font-bold text-base px-3 mb-4 text-[#19243B] select-none">
                Your study workspace
              </h2>
              {renderNavItems(false)}
            </aside>
          </>
        )}

        <main className="mx-auto px-6 pb-8 pt-2 sm:px-8 sm:pb-10 flex-1 w-full max-w-[1280px]">
          {children}
        </main>
      </div>

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
    </div>
  );
};

export default WorkspaceLayout;
