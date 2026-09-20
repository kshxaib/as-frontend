import React, { useEffect, useState, useRef } from 'react';
import { WorkspaceLayout } from './components/WorkspaceLayout';
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

  const showApp = isAuthenticated;

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#19243B] font-sans antialiased selection:bg-[#0057FF] selection:text-white">
      
      {!showApp && (
        <LandingPage
          justLoggedOut={justLoggedOut}
          hasSharedToken={isPredictShare}
        />
      )}

      {showApp && (
        <WorkspaceLayout>
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
        </WorkspaceLayout>
      )}

      <AuthModal />
      <ApiKeyRequiredModal />
      <ErrorModal />
    </div>
  );
}

export default App;
