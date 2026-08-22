import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
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

function App() {
  const { activeTab } = useQuestionBankStore();
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main>
        {activeTab === 'resources' && <ResourceManager />}
        {activeTab === 'question_banks' && <QuestionBankManager />}
        {activeTab === 'review' && <QuestionReview />}
        {activeTab === 'solutions' && <SolutionViewer />}
        {activeTab === 'community' && <CommunityHub />}
        {activeTab === 'profile' && <ProfileSettings />}
      </main>

      {/* Modals */}
      <AuthModal />
      <ApiKeyRequiredModal />
    </div>
  );
}

export default App;