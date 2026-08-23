import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ResourceManager } from './components/ResourceManager';
import { QuestionBankManager } from './components/QuestionBankManager';
import { QuestionReview } from './components/QuestionReview';
import { SolutionViewer } from './components/SolutionViewer';
import { CommunityHub } from './components/CommunityHub';
import { ProfileSettings } from './components/ProfileSettings';
import { AuthModal } from './components/AuthModal';
import { ApiKeyRequiredModal } from './components/ApiKeyRequiredModal';
import { useQuestionBankStore } from './store/useQuestionBankStore';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';

function App() {
  const { activeTab, setActiveTab } = useQuestionBankStore();
  const { initAuth, isAuthenticated } = useAuthStore();
  const { initTheme } = useThemeStore();
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  // Track previous auth state to detect logout transitions
  const [prevAuth, setPrevAuth] = useState(isAuthenticated);

  useEffect(() => {
    initTheme();
    initAuth();
  }, [initTheme, initAuth]);

  // Detect logout → show logged-out message
  useEffect(() => {
    if (prevAuth && !isAuthenticated) {
      setJustLoggedOut(true);
      // Reset to landing state
      setActiveTab('resources');
      const timer = setTimeout(() => setJustLoggedOut(false), 5000);
      return () => clearTimeout(timer);
    }
    setPrevAuth(isAuthenticated);
  }, [isAuthenticated, prevAuth, setActiveTab]);

  // ─── Determine what to render ───────────────────────────────────────────────
  // Community tab is public — accessible to guests too
  const isCommunityTab = activeTab === 'community';
  const showApp = isAuthenticated || isCommunityTab;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans antialiased selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)]">

      {/* Navbar always rendered */}
      <Navbar />

      {/* Main content area */}
      <main>
        {/* ── LANDING PAGE ── (unauthenticated, non-community tab) */}
        {!showApp && (
          <div key="landing">
            <LandingPage justLoggedOut={justLoggedOut} />
          </div>
        )}

        {/* ── AUTHENTICATED APP + COMMUNITY (public) ── */}
        {showApp && (
          <div key="app">
            {/* Community tab — accessible without auth */}
            {activeTab === 'community' && <CommunityHub />}

            {/* Below tabs require authentication */}
            {isAuthenticated && (
              <>
                {activeTab === 'resources' && <ResourceManager />}
                {activeTab === 'question_banks' && <QuestionBankManager />}
                {activeTab === 'review' && <QuestionReview />}
                {activeTab === 'solutions' && <SolutionViewer />}
                {activeTab === 'profile' && <ProfileSettings />}
              </>
            )}

            {/* Safety fallback for guests */}
            {!isAuthenticated && activeTab !== 'community' && (
              <LandingPage justLoggedOut={justLoggedOut} />
            )}
          </div>
        )}
      </main>

      {/* Global Modals — always mounted */}
      <AuthModal />
      <ApiKeyRequiredModal />
    </div>
  );
}

export default App;