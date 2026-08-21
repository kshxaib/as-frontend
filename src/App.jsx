import React from 'react';
import { Navbar } from './components/Navbar';
import { QuestionReview } from './components/QuestionReview';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main>
        <QuestionReview />
      </main>
    </div>
  );
}

export default App;