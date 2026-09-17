import React, { useEffect, useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ResourceManager } from './components/ResourceManager';
import { QuestionBankManager } from './components/QuestionBankManager';
import { QuestionReview } from './components/QuestionReview';
import { SolutionViewer } from './components/SolutionViewer';
import { PredictedPaperGenerator } from './components/PredictedPaperGenerator';
import { CommunityHub } from './components/CommunityHub';
import { ProfileSettings } from './components/ProfileSettings';
import { AuthModal } from './components/AuthModal';
import { ApiKeyRequiredModal } from './components/ApiKeyRequiredModal';
import { ErrorModal } from './components/ErrorModal';
import { useQuestionBankStore } from './store/useQuestionBankStore';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';

function App() {
  const { activeTab, setActiveTab } = useQuestionBankStore();
  const { initAuth, isAuthenticated } = useAuthStore();
  const { initTheme } = useThemeStore();
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  // Detect public predicted paper share link (?predict=token)
  const [sharedPredictToken, setSharedPredictToken] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('predict') || null;
  });

  const isPredictShare = Boolean(sharedPredictToken);

  useEffect(() => {
    initTheme();
    initAuth();
  }, [initTheme, initAuth]);

  const prevAuthRef = useRef(isAuthenticated);

  // Detect logout → show logged-out message
  useEffect(() => {
    if (prevAuthRef.current && !isAuthenticated) {
      const showTimer = setTimeout(() => setJustLoggedOut(true), 0);
      setActiveTab('resources');
      const hideTimer = setTimeout(() => setJustLoggedOut(false), 5000);
      prevAuthRef.current = isAuthenticated;
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, setActiveTab]);

  // ─── Determine what to render ───────────────────────────────────────────────
  // Strictly require authentication for all app tabs including The Commons
  const showApp = isAuthenticated;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans antialiased selection:bg-[var(--primary)] selection:text-[var(--primary-foreground)]">

      {/* Navbar always rendered */}
      <Navbar />

      {/* Main content area */}
      <main>
        {/* ── UNATHENTICATED: LANDING PAGE ONLY ── */}
        {!showApp && (
          <div key="landing">
            <LandingPage
              justLoggedOut={justLoggedOut}
              hasSharedToken={isPredictShare}
            />
          </div>
        )}

        {/* ── AUTHENTICATED APP WORKSPACE ── */}
        {showApp && (
          <div key="app">
            {/* Direct Predicted Paper View if opened via share link */}
            {isPredictShare ? (
              <PredictedPaperGenerator
                sharedToken={sharedPredictToken}
                onClearShared={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.delete('predict');
                  window.history.replaceState({}, '', url.pathname + url.search);
                  setSharedPredictToken(null);
                  setActiveTab('predictor');
                }}
              />
            ) : (
              <>
                {activeTab === 'resources' && <ResourceManager />}
                {activeTab === 'question_banks' && <QuestionBankManager />}
                {activeTab === 'review' && <QuestionReview />}
                {activeTab === 'solutions' && <SolutionViewer />}
                {activeTab === 'predictor' && <PredictedPaperGenerator />}
                {activeTab === 'community' && <CommunityHub />}
                {activeTab === 'profile' && <ProfileSettings />}
              </>
            )}
          </div>
        )}
      </main>

      {/* Global Modals — always mounted */}
      <AuthModal />
      <ApiKeyRequiredModal />
      <ErrorModal />
    </div>
  );
}

export default App;