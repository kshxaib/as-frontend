import { useEffect, useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { ResourceManager } from './components/ResourceManager';
import { QuestionBankManager } from './components/QuestionBankManager';
import { QuestionReview } from './components/QuestionReview';
import { SolutionViewer } from './components/SolutionViewer';
import { CommunityHub } from './components/CommunityHub';
import { ProfileSettings } from './components/ProfileSettings';
import { AuthModal } from './components/AuthModal';
import { ApiKeyRequiredModal } from './components/ApiKeyRequiredModal';
import { AppShell, ShellContent } from './components/layout/AppShell';
import { GuestBar } from './components/layout/GuestBar';
import { useQuestionBankStore } from './store/useQuestionBankStore';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const activeTab = useQuestionBankStore((s) => s.activeTab);
  const setActiveTab = useQuestionBankStore((s) => s.setActiveTab);
  const { initAuth, isAuthenticated } = useAuthStore();
  const [navigationOpen, setNavigationOpen] = useState(false);

  // Track previous auth state to detect logout transitions.
  // Render-time adjustment is React's sanctioned pattern here
  // (replaces a setState-in-effect that the hooks rules flag).
  const [prevAuth, setPrevAuth] = useState(isAuthenticated);
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (prevAuth !== isAuthenticated) {
    setPrevAuth(isAuthenticated);
    if (!isAuthenticated) {
      // Reset to landing state
      setActiveTab('resources');
      setJustLoggedOut(true);
    }
  }

  // Auto-clear the signed-out notice after 5 seconds
  useEffect(() => {
    if (!justLoggedOut) return;
    const timer = setTimeout(() => setJustLoggedOut(false), 5000);
    return () => clearTimeout(timer);
  }, [justLoggedOut]);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-foreground">

      {!isAuthenticated && <GuestBar />}

      {!isAuthenticated ? (
        /* ── GUEST: landing or public community ── */
        activeTab === 'community' ? (
          <main className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <CommunityHub />
          </main>
        ) : (
          <LandingPage justLoggedOut={justLoggedOut} />
        )
      ) : (
        /* ── AUTHENTICATED: The Reading Room shell ── */
        <AppShell
          navigationOpen={navigationOpen}
          onNavigationOpenChange={setNavigationOpen}
        >
          <ShellContent tabKey={activeTab}>
            {activeTab === 'resources' && <ResourceManager />}
            {activeTab === 'question_banks' && <QuestionBankManager />}
            {activeTab === 'review' && <QuestionReview />}
            {activeTab === 'solutions' && <SolutionViewer />}
            {activeTab === 'community' && <CommunityHub />}
            {activeTab === 'profile' && <ProfileSettings />}
          </ShellContent>
        </AppShell>
      )}

      {/* Global Modals — always mounted */}
      <AuthModal />
      <ApiKeyRequiredModal />
    </div>
  );
}

export default App;
