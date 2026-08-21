import React from 'react';
import { Navbar } from './components/Navbar';
import { QuestionReview } from './components/QuestionReview';
import { SolutionViewer } from './components/SolutionViewer';
import { useQuestionBankStore } from './store/useQuestionBankStore';

function App() {
  const { activeTab } = useQuestionBankStore();

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main>
        {activeTab === 'review' ? <QuestionReview /> : <SolutionViewer />}
      </main>
    </div>
  );
}

export default App;